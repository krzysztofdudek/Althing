# 307 · Jarl: the reply of review names the next step (approved: merge, then set done with evidence; changes: a round), so a reviewer's verdict doe…

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261015T1110-ibyk
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-review-names-the-next-step
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2142
**After:** 246
**Branch:** jarl/320-merge-record
**Merged:** 7dcf62c38c50c8b0ce27720f0d3fa7e3fd5cd11f in ../../../JarlSkill
**CI:** pending

## What
Claim: After twelve approves and five sends-back the tickets stayed open and in-progress in the list, and nothing said that the next step was a merge and then a move to done, by whom, with which command.

cmdReview returns the verdict, the reviewer's kind, the severities and the acceptance, and nothing about what follows (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2113-2142); the flow is in SKILL.md only; a field report from a private deployment of 6.1.0, section 3.4 (source.md). The view 'approved, not closed' is issue 283 and is not repeated here.

## Why


## Acceptance
- Proposed by the finding — make it checkable before a worker starts: The reply of an approve carries one line naming the next step: the merger merges and records it with merged, then set <id> done with the evidence rows; a worker never closes. The reply of changes names the round (round <id>) and the worker to be raised again. A coordinator's approve on a code issue keeps its existing note. Tests: the line is present on approve and on changes, and absent from neither the CLI nor the MCP reply. 6.2.0.
- Written after 246 (architect's scope review of 2026-10-18, section 4, item 4), so the next step an approve names is 246's one call, merged <id> --sha <sha> --ran "<check>" --saw "<summary>", then set <id> done; it pairs with 283's in-flight facts and does not repeat them

## Changelog
- Added: The reply of review names the next step: after an approve of code the merger's one merged call and then set done, which a worker never does; after changes the round that sends the work back.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 7dcf62c · **saw:** 368 tests, 365 pass, 0 fail, 3 skipped

