# 124 · A shallow clone with a window over 14 days reports 'history full' without disclosing the shallowness, and gives the truncated 'held since' and 'N new in 180d' as facts; after unshallow the state stays truncated until `refresh --full`

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/engine/grain-report.mjs, Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/learn.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:786-790 (v6.1.0 ae6152f, unchanged on release/6.1.1): a shallow clone with a visible window >= freshDays (14) is walked (deliberately, comment :774-785) and returns mode 'full' with no reason, no shallowness flag and no boundary; grain-context.mjs:296-297 writes historyMode 'full' and historyReason null; grain-report.mjs:22 (freshnessLines) prints `history ${historyMode}`; mine.mjs:689 heldSummary (render :816) takes the earliest lc.first, which for scopes from before the cut is the boundary commit; learn.mjs:446 counts `fresh` as the files whose lc.first falls within the last 180 days; grain-context.mjs:213-214 invalidates the cache after unshallow (§G13) only when historyReason equals 'shallow clone — history unavailable, weights flat'.
**Branch:** jarl/044-held-since-and-shallow
**Merged:** dd66c06
**CI:** none

## What
Reproduction (Grain v6.1.0, fresh clone ae6152f; own fixture from verify-62/gen/build-fixture.sh: 29 handlers with @Handler added in five waves from 2024-02 to 2024-07, then 9 fix commits up to 2024-10-19, then an undecorated dispute handler on 2024-10-30):

- 01: a `--depth 5` clone (cut at 47d88d6, 2024-09-13; HEAD 2024-10-30, a 47-day window) and a full clone (first commit 2024-01-10). Both print 'freshness: … up to date · history full'; the shallow clone's stderr even says 'walking full history' and 'indexing … (full history)'. In the shallow clone every 'held since' is 2024-09, in the full one 2024-02, e.g. 'types here are annotated with `@Handler` … held since 2024-09'. The template line says '29 new in 180d' in the shallow clone and '11 new in 180d' in the full one; 11 is correct. The 85 versus 84 conventions from the finder's log did not reproduce (here 32 in both clones; this depends on the fixture and does not change the conclusion).
- 02: `status --json` has historyMode "full", and meta.json has historyReason null.
- 03: a clone with a neutral directory name: status, report, `where src/handlers`, `status --json` and `report --json` together contain the word 'shallow' 0 times; the `where` card says 'held since 2024-09, last reinforced 2024-10'. Beyond the report: after `git fetch --unshallow` (HEAD unchanged) status still says 'up to date · history full' with 5 commits, and `grain refresh` gives 'history unchanged', still 5 commits and 2024-09.
- 04: after unshallow and a new commit the walk goes incrementally e6cb28e..HEAD and still says 2024-09, so the history from before the cut is never read. Only `refresh --full` restores 2024-02, and nothing suggests running it.
- 05: docs/reference.md:873 says that on a shallow clone `cochange` returns null in pairs, control and window, plus a note; here they come back non-empty (window.commits 4) with note null, so the documentation contradicts the code.

tests/stress/edge-cases.mjs:35 checks that the status of a shallow clone mentions /shallow/, but only for `--depth 1`, so this path is not tested. Related but different: 044 (held since = the birth date of the oldest conforming scope); even with its fix a shallow clone would give the cut date without a caveat.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-7/D-shallow-truncated-history.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-62/logs/01-clones-status-report.log and 02-05 in the same directory.

## Why
README:384-385 promises that hostile repositories degrade 'with an honest stamp', and docs/validation.md:425-428 sets the contract 'degrade, never crash, never lie'. The survival gate safely uses a lower bound on age, but a 'held since' without a caveat and an inflated 'new in 180d' (an overcount, not a lower bound) are output errors. This is a real CI case (`actions/checkout` with `fetch-depth: 50`), and the truncated state survives unshallow and new commits.

## Acceptance
- On a shallow clone, status and the report stamp say so (e.g. 'history truncated at <sha and date of the boundary> — shallow clone'), and historyMode/historyReason in the JSON carry this information.
- 'held since' and 'new in 180d' computed at the shallowness boundary are marked as a lower bound or excluded (e.g. 'held since ≤2024-09').
- After `git fetch --unshallow` the next query walks the full history (the cache invalidation also covers a shallow clone that was walked).
- The cochange contract for a shallow clone in docs/reference.md matches the code.

## Changelog
- Fixed: on a shallow clone, status and report say the history is cut off and where, dates and counts taken at the cut are marked as bounds ("held since ≤2024-09", "≥3 new in 180d"), and after the clone is deepened the next run reads the whole history.

## Evidence

docs: docs/reference.md:892 cochange: no-history case is a shallow clone shorter than 14 days; a longer shallow clone is counted over the commits it holds. docs/reference.md status --json/export: freshness.historyReason; history.truncatedAt {sha,date} only on a shallow clone. Commit 14c5ff5; red→green: tests/shallow-history-truncated.test.mjs 4/4 red → green. Needs HIST_V + MODEL_V.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2164, pass 2163, fail 0, skipped 1, merge dd66c06

