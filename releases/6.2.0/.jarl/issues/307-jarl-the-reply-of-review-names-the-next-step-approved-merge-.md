# 307 · Jarl: the reply of review names the next step (approved: merge, then set done with evidence; changes: a round), so a reviewer's verdict doe…

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-review-names-the-next-step
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2142

## What
Claim: After twelve approves and five sends-back the tickets stayed open and in-progress in the list, and nothing said that the next step was a merge and then a move to done, by whom, with which command.

cmdReview returns the verdict, the reviewer's kind, the severities and the acceptance, and nothing about what follows (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2113-2142); the flow is in SKILL.md only; a field report from a private deployment of 6.1.0, section 3.4 (source.md). The view 'approved, not closed' is issue 283 and is not repeated here.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: The reply of an approve carries one line naming the next step: the merger merges and records it with merged, then set <id> done with the evidence rows; a worker never closes. The reply of changes names the round (round <id>) and the worker to be raised again. A coordinator's approve on a code issue keeps its existing note. Tests: the line is present on approve and on changes, and absent from neither the CLI nor the MCP reply. 6.2.0.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

