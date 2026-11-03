# 031 · Jarl: two clones or branches of a committed loop give two issues one number, and every move of that number lands on both

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#jarl-rethink-dupnum
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1562 at a1132a8
**Branch:** jarl/031-duplicate-numbers-detected
**Worker:** w-jarl-031-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-031
**Since:** 2026-11-03 08:34

## What
Claim: Numbers are taken from the clone's own issues, so two clones that each file an issue take the same number; git merges the two files without a conflict because their slugs differ; list then shows two issues numbered 2, verify reports clean, and show and set reach only the first file, so the second issue cannot be addressed by number. Corrected by the sceptic: Add to the claim: every move of the number lands on both issues in the record (log.md), so list, resume and the done gate treat the second issue as moved too. verify reports the second file only as a header that disagrees with the log, and its advice would copy the wrong state into it. The cause also covers two branches of one checkout, not only separate clones.

Run on scratch repositories with Jarl a1132a8: materials/two-clones.md, section 'Two clones file one number'. The numbering reads this checkout and its worktrees only (jarl-lib.mjs:1562-1564), and new is refused in a linked worktree because "the number would be used twice" (jarl-lib.mjs:1523); nothing covers a separate clone. findIssue returns the first file with the number (jarl-lib.mjs:881).

## Why


Two sessions or two machines driving one loop is the shape Jarl is meant for, and the docs promise that numbers never collide; when they do, the record moves an issue nobody moved and verify's advice spreads the damage.

## Acceptance
- A test files one issue in each of two clones of a committed loop (and, apart, on two branches of one checkout), merges them, and verify then reports the two files with one number, naming both; it is red on a1132a8
- While two issue files share a number, every command that moves or edits an issue by that number is refused with both file names, so no move lands on both; tested
- SKILL.md, references/jarl.md and references/repositories.md say what the numbering guarantees and where it does not hold (separate clones, branches of one checkout)

## Changelog
- Fixed: When two copies of a shared loop each file an issue and are then merged, both issues can get the same number. Jarl now says so and names both files, and it refuses to change either one by that number until you give one of them a new number.

## Evidence

Title and tier corrected by hand after import: the driver Jarl cut the imported title at its limit and has no command for the tier (017 was folded into 029); tier strong because the fix touches the record's ids and data integrity

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules

Acceptance narrowed by the analysis session: detection, refusal and honest docs are bug fixes outside the direction and may start now; ids that cannot collide across clones are a design question and belong to 035 (research/2026-11-03-jarl-as-a-loop-tool, safety with many drivers).
- **ran:** node --test tests/shared-number.test.mjs (on a copy of release/6.2.1 at 71ebc5b) · **saw:** pass 1, fail 5: verify reports clean for two clones and for two branches, set, prio, body, show and answer land on both files
- **ran:** node --test tests/shared-number.test.mjs tests/record-contract.test.mjs (branch jarl/031-duplicate-numbers-detected) · **saw:** pass 15, fail 0: verify names both files, every command by that number and the library's findIssue refuse it with both named, nothing written

