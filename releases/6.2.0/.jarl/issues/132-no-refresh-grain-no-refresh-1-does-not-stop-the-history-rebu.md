# 132 · --no-refresh / GRAIN_NO_REFRESH=1 does not stop the history rebuild: how, what, export, cochange, measure, advise and selftest walk the history, overwrite the cache and mix it with a stale model

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-where.mjs, Grain/plugins/grain/engine/grain-what.mjs, Grain/plugins/grain/engine/grain-export.mjs, Grain/plugins/grain/engine/cochange.mjs, Grain/plugins/grain/engine/measure.mjs, Grain/plugins/grain/engine/grain-advise.mjs, Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:555-557 (want='none' from --no-refresh or GRAIN_NO_REFRESH reaches only ensureFresh, and ctx at :565 does not carry it); an unconditional loadHistory({gitdir, store, log}) in grain-where.mjs:165-167 (cmdHow), grain-what.mjs:13-15, grain-export.mjs:18-20, cochange.mjs:457-459, measure.mjs:248-250, grain-advise.mjs:455-457 and in selftest (grain.mjs:648/680/754/802/841); loadHistory resumes from lastSha..HEAD or walks everything on divergence (history.mjs:822-833) and writes the result (writeHistoryState, :848). The how-hook already has the right pattern (grain.mjs:400-417): readHistoryState read-only, used only with a matching lastSha. release/6.1.1 (0e0093a) does not touch these calls.
**Branch:** jarl/109-freshness-and-store-truth
**Merged:** 3b40074
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 ae6152f, without npm install, called as `node plugins/grain/bin/grain.mjs`):

(1) Fixture, 12 commits: index, then amend HEAD. `GRAIN_NO_REFRESH=1 grain status` does not walk the history and does not touch history.json. `GRAIN_NO_REFRESH=1 grain how handler fix` prints '[grain] walking full history', lastSha in history.json moves from 9004e3e to the new HEAD 632f434, and meta.headSha stays 9004e3e. The first example in the answer is the amended commit, 632f434, and the answer is stamped 'as of 9004e3e (STALE)', that is, it names a snapshot that does not contain the cited commit.

(2) Per command, with the --no-refresh flag (not the variable), after one new commit on the same line, with the cache restored from a copy before each run. Without a walk: status, where, check and `how --no-history`. With a walk cb046a4..HEAD and lastSha overwritten to 8b8d9ed: how, what, export, cochange, measure and selftest --null. cochange walks the history even before rejecting missing arguments; the usage error comes after the walk. advise in a repo without .yggdrasil/ says 'no architecture graph' before it reaches loadHistory, so grain-advise.mjs:455-457 is confirmed by code reading only.

(3) typeorm @17e858d (5203 non-merge commits), warm index, amend of the last commit. `GRAIN_NO_REFRESH=1 status`: 0.23 s, 124 MB RSS, history.json unchanged. `GRAIN_NO_REFRESH=1 how fix relation loading`: '[grain] walking full history … 5203 commits, 32944 blobs (32944 cached), 4.3s', 5.20 s, 831 MB RSS; lastSha 17e858d → 162e7e3, meta stays 17e858d, output 'as of 17e858d (STALE)'. The finder measured a walk of 26.1 s, 29.4 s and 690 MB with a colder blob cache and a different load; the full walk itself is the same.

Tests cover --no-refresh only for where, check, explain and status (grain.test.mjs:251, cross-check-freshness.test.mjs, no-history-flag.test.mjs:96). The authors' comment in grain.mjs:401-402 names the loadHistory path (walk and write) as exactly what 'never refreshes' forbids. Related: issue 109 (the STALE banner on stdout breaks JSON). Hooks are not affected, because the how-hook reads the history read-only.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f3-norefresh-walks/repro.log and <the session scratchpad, since lost>/bughunt/grain/find-10/f10-typeorm/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-70/fixture-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-70/percmd-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-70/typeorm-repro.log (the typeorm index built cold by `grain refresh`, typeorm-build.log in the same directory).

## Why
docs/reference.md:9 ('--no-refresh (answer from the existing index; a stale one carries a STALE banner)'), :301 ('GRAIN_NO_REFRESH=1 never auto-rebuild') and README.md:286 promise an answer from the existing index, and history.json sits in .grain/cache and is part of the index. The switch does not work: the unwanted walk costs time and memory on a large repo, and the lines derived from history carry a STALE stamp that names the wrong snapshot. Nothing breaks, because the written history.json is correct for HEAD, and a later refresh uses it as 'unchanged'.

## Acceptance
- With want='none', commands read the history layer read-only (readHistoryState) and use it only when lastSha equals meta.headSha, and skip it otherwise; they never walk the history or write it.
- Fixture: after amend HEAD, `GRAIN_NO_REFRESH=1` with `how handler fix`, `what`, `export`, `cochange`, `measure` and `selftest --null` does not print 'walking' and does not change lastSha in history.json.
- There is a --no-refresh test for at least one command that reads history.

## Changelog
- Fixed: --no-refresh and GRAIN_NO_REFRESH=1 now also stop how, what, export, cochange, measure, advise and selftest from re-reading the git history; they answer from the history already indexed.

## Evidence

red: tests/no-refresh-history-read-only.test.mjs on release/6.1.1 code 12/12 command cases fail ('[grain] walking full history' for how, what, export, cochange, measure, selftest --null, flag and env); green 14/14 at 2134400. advise covered by the same loadHistory switch (code reading only, needs a graph).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2119, pass 2118, fail 0, skipped 1, merge 3b40074

