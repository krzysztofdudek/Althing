# 133 · Index builds are not coordinated: a commit that lands during a history walk is replayed twice and counted twice, and parallel queries each build the same index separately

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-kdds
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/grain-context.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:772 (`head = headSha(gitdir)` remembered), :823 (the range `state.lastSha + '..HEAD'` with a symbolic HEAD; a full walk has no range, so `git log` follows the live HEAD, walk() :258-279, :276), :834 (the walk of that range), :839 (`state.lastSha = head`, i.e. the sha remembered earlier); grain-context.mjs:193 (head remembered and written as meta.headSha at :293), :275 (headTree reads the symbolic HEAD, history.mjs:130 defaults to rev='HEAD'), :192-300 (ensureFresh without a lock). Writes are atomic (tmp-pid + rename, writeHistoryState history.mjs:477). The same on 6.1.0 and release/6.1.1.
**Branch:** jarl/109-freshness-and-store-truth
**Merged:** 3b40074
**CI:** none

## What
Reproduction (fresh clone of Grain 6.1.0 ae6152f in verify-71/; pinned fixture with HEAD 47da000; fresh clone of typeorm):

(a) A commit replayed twice: confirmed, a real defect.
- A git shim (a-shim) commits B on the promisor config call in loadHistory, that is after head is remembered and before the walk. The walk covered 2 commits (A and B) but was stamped A, and the next query walked A..HEAD and replayed B once more. The state has 19 commits versus 18 in git; fileCommits[order.service.ts] and pairSup(handler, service) are 3 versus 2 in git (cold build: 2 and 2); fingerprint 1b0c2ba appears twice; `grain how` prints the same example twice ('2 past changes match', '(2/2)'), while the cold build says 1 match, (1/1). The skew survives a further commit C, and model.json differs from a cold build at the same HEAD in nonMegaCommits (20 versus 19), fileTouches (178 versus 176) and historyStats.
- The first cold build too (a2-coldfirst): the full walk saw 17 commits but was stamped 47da000, and the next query replayed B (state 18 versus 17 in git).
- Without a shim, real timings (r-race): on a warm typeorm, a plain `grain status` during a loop committing about every 0.1 s for 8 s. The query stamped 62663a2 but walked 11 commits; the next one walked 79. In total 9 commits counted twice: state.commits 5295 versus 5286 in git, and 9 duplicated fingerprint shas.

(b) Parallel queries build separately: reproduced, but this is a resource cost, not wrong answers. typeorm with a warm index and one new one-line commit; `where`, `check` and `report` run together log the same 'walking 17e858d..HEAD' and do a full re-learn: about 18 s and 1331-1359 MB max RSS each, about 4 GB in total (one query alone: 17.9 s and 1439 MB). The final store is consistent (state.commits equal to the count in git, no duplicates), because writes are atomic and each process walks the same range. The README lists 'races' among the hostile cases that only have to 'degrade without a crash', so the missing lock is a known design choice; here it is an improvement. Correction to the report: Grain's own MCP server calls serveStdio without `concurrency`, and the Runes default is total=1 (vendor/runes/dist/mcp/server.mjs:46), so parallel grain_* calls through one server run one after another; the duplicated builds come from separate processes (several CLI calls, sessions, agents or MCP servers on one checkout).

Different from 487 from release-6.1.0 (cache keyed by the grammar stamp).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f5-race2/repro.log and <the session scratchpad, since lost>/bughunt/grain/find-10/f11b-parallel/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-71/a-shim/repro.log (the main one) and <the session scratchpad, since lost>/bughunt/grain/verify-71/a2-coldfirst/repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-71/r-race/repro.log (without a shim, real timings), <the session scratchpad, since lost>/bughunt/grain/verify-71/b-parallel/repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-71/b-small/repro.log.

## Why
(a) The counts are skewed only by the commits that fall into the window, but silently and permanently (until `refresh --full` or a change of the version stamp), contrary to the invariant from the README ('Delete the cache any time; the next query rebuilds the same bytes') and tests/cross-check-incremental-equivalence.test.mjs ('indistinguishable from a from-scratch build at the SAME HEAD'). On a large repository the window includes readHistoryState (about 2 s for a history.json of 158 MB). (b) Several processes on one checkout multiply memory and CPU, which on a large repository risks an OOM.

## Acceptance
- A refresh walks exactly the range it stamps (`lastSha..<remembered head>`, and for a full walk `<head>`), and the HEAD tree is built from the same sha.
- The a-shim scenario: after a commit B landed during the walk, the history state and `grain how concurrent edit landing during walk` match a cold build of the same HEAD (1 match, (1/1)).
- Parallel queries on one store wait for a single build (a lock under .grain/cache), or the decision that this stays without a lock is recorded in the documentation.

## Changelog
- Fixed: a commit made while Grain was reading the history is no longer counted twice, and several Grain processes on one checkout now wait for a single rebuild instead of each rebuilding the index.

## Evidence

red: tests/build-coordination.test.mjs on release/6.1.1 code 0/3 (shim: walk covered B but stamped A; 3 parallel status each built; held lock ignored); green 3/3 at 7ad4d28 + d0f1be8. A lock was chosen (director's direction), not 'no lock, documented': .grain/cache/build.lock, pid+host, 30 s heartbeat, taken over when the owner is dead or 10 min untouched. docs: docs/reference.md cache paragraph: queries that find the index behind HEAD build it one at a time; a second grain process waits (.grain/cache/build.lock) and answers from that index; a lock left by a dead process is taken over. Optional HIST_V bump to evict already-skewed stores.

round 2 (ab79929): red on d0f1be8 — held local lock and foreign-host lock each blocked 'grain status' ~600 s; SIGTERM/SIGINT to the build left build.lock; rename-based takeover (intermediate draft) let two processes hold the lock at once. green: build-coordination.test.mjs 9/9 (query answers stale within 3 s naming the lock; foreign lock not waited on; signals remove the lock; 4 concurrent takeovers serialize). npm test 2063 pass, 0 fail. docs (supersedes earlier note): a query waits up to 3 s for another build, then answers from the existing index with a STALE banner saying it is being rebuilt; lock .grain/cache/build.lock; a dead local owner's or 10-min-untouched lock is taken over, another host's is never waited on; remove the file if no grain build is running.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2119, pass 2118, fail 0, skipped 1, merge 3b40074

