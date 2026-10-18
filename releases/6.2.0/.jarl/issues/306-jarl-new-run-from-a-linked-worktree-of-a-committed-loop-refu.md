# 306 · Jarl: new run from a linked worktree of a committed loop refuses and names the main checkout, and takes the highest number over the main ch…

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-new-number-from-a-worktree
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:992
**After:** 305, 310
**Branch:** jarl/310-ids-and-filing
**Merged:** 2ad622756fc87d49a52b8fa4a876912ee047e132 in ../../../JarlSkill
**CI:** pending

## What
Claim: Two workers that filed tickets inside their own worktrees of a committed loop each got a number already used in the main checkout, so two pairs of tickets shared a number and were renumbered by hand.

cmdNew takes the next number from the files of the loop it was given, the highest plus one (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:992); in the committed mode a worktree holds only the copy it was cut with (SKILL.md:121-124); a field report from a private deployment of 6.1.0, section 3.2 (source.md). Read from the code, not reproduced.

## Why


## Acceptance
- Proposed by the finding — make it checkable before a worker starts: When the root given to new is a linked worktree of a repository whose main checkout holds the same loop, new refuses and names the main checkout as the root to pass. Where it does run, the number is the highest over the main checkout and every linked worktree of the repository (git worktree list), read-only, so a lagging copy cannot hand out a used number. No counter file: the issue files stay the only source. Tests: a committed loop with a worktree that lags by two issues, new from the worktree refused; new on the main checkout with a worktree that holds a higher number takes the higher one plus one. 6.2.0.
- The main checkout is found through git's common directory by one helper this issue introduces, which 247 and 251 reuse; the highest number is taken numerically with 310's id grammar, so 1000 counts above 999 (architect's scope review of 2026-10-18, sections 1 and 2)

## Changelog
- Fixed: new run from a linked worktree of a committed loop refuses and names the main checkout, and the number it takes is the highest over the main checkout and every linked worktree.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 2ad6227 · **saw:** 267 tests, 265 pass, 0 fail, 2 skipped

