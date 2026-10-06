# 108 · History replay compares a commit with the last processed commit instead of its parent: merged branches create phantom modifications, and an incremental refresh differs from a cold build

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/tests/cross-check-incremental-equivalence.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:270-276 (walk(): `git log --reverse --no-merges` without --topo-order, parallel lines interleaved by date), :299 (the raw-line regex `^:\d+ \d+ [0-9a-f]+ ([0-9a-f]+) ...` captures only the new blob sha; the old one, i.e. the parent's version, is thrown away), :579 (replay: `prev = state.prevState[e.path]`, the version left by the last processed commit), :602-611 (a modification is counted when the scope's body hash differs; `L.last = e.c.ts` without max()), :616 (prevState overwritten), :821-823 (incremental `lastSha..HEAD`). Identical on release/6.1.1, which changes only the log text in history.mjs.
**Branch:** jarl/062-history-walk-fidelity
**Merged:** 1f1165c
**CI:** none

## What
Reproduction (fresh clone of Grain main ae6152f, grain 6.1.0, extractor g36; fixture from tests/fixtures/build-fixture.mjs, HEAD 47da000, the same hashes as the finder's; own script). Shape of every case: index main at 47da000, branch `side` from b84a550 with one commit that only appends auditOrder() to src/handlers/order.handler.ts, merge --no-ff (merge date 2024-11-01), incremental refresh; then a cold build of a fresh clone of the same HEAD and a comparison of `grain export`. The truth from `git log -L` over the body of handle(): only 58903d8 (wave 1, birth) and d374da6 (2024-07-20, 'fix:'), i.e. mods 1, fixes 1, lastTouched 2024-07-20.

- A (side commit dated 2024-07-09): incrementally lastTouched 2024-07-09 and modifications 2, so lastTouched goes back in time from 07-20; cold, lastTouched 2024-07-20 and modifications 1. The diff of the exports shows only these two lifecycle fields (apart from the variable repo fields, indexedAt and history.mode). The history state differs too: scopeCommits for handle 3 versus 2, and the side commit's fingerprint lists `order.handler.ts#method#handle` as a touched scope, so the phantom touch also reaches the fingerprints and the scope co-changes.
- B (dated 2024-10-30): incremental and cold agree, but both give modifications 2 and lastTouched 2024-10-30, i.e. a phantom edit by a commit that never touched handle(); `git show --raw` of that commit is a change only relative to b84a550.
- C (beyond the report): B plus a later commit on main 'fix: audit helper prefix' that changes only auditOrder(). Both builds give handle() modifications 3, fixes 2, lastTouched 2024-11-05: two phantom modifications and one phantom fix, because every later commit to the file 'reverts' the stale copy from the side branch. fix and mods feed the deviation fix-rate signal in learn.mjs:121-127 (`c.plain += max(mods - fix, 0)`).
- L (control: the same change as a linear commit without a merge): the incremental and cold exports are identical apart from the variable fields, and handle() correctly has mods 1 and lastTouched 2024-07-20. The defect comes from merges.

tests/cross-check-incremental-equivalence.test.mjs has a rename, a deletion and an addition, but no merge; the only merge test (grain.test.mjs:40) checks only the commit count. Distinct from 044 (birth dates in held since) and 048 (co-changes across renames).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f1-merge-lifecycle/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-45/repro.log (script verify-45/repro.sh; the JSON diff and the history state rows in verify-45/diff.log).

## Why
Merged feature branches are an ordinary workflow (express has about 485 merges). The lifecycle (mods, fixes, churn, lastTouched), the deviation fix-rate signal, the fingerprints and the scope co-changes are silently skewed, and the export, i.e. the published contract with the consumer, depends on the date order of parallel lines. This breaks the invariant from README:155 and reference.md:287 ('the next query rebuilds the same bytes') and from the incremental equivalence test, under which the incremental model must be indistinguishable from a build from scratch.

## Acceptance
- walk() keeps the old blob sha from the raw line, and replay compares each commit's scopes with the parent's version (cache.get(oldSha)), not with the last processed version of the path; L.last is monotonic (max).
- Cases A, B and C from verify-45/repro.sh: handle() in order.handler.ts has mods 1, fixes 1 and lastTouched 2024-07-20, both incrementally and cold.
- tests/cross-check-incremental-equivalence.test.mjs has a case with a merged side branch whose dates interleave with main.

## Changelog
- Fixed: a merged branch no longer adds edits that never happened to the code around it, and refreshing after a merge gives the same model as a build from scratch.

## Evidence

- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2147, pass 2146, fail 0, skipped 1, merge 1f1165c

