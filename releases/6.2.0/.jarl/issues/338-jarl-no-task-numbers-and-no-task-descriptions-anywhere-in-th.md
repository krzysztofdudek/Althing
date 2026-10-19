# 338 · Jarl: no task numbers and no task descriptions anywhere in the code, the tests, the comments or the docs; only comments that explain the code, and the code itself

**Status:** in-progress
**Kind:** cleanup
**Priority:** 1
**Tier:** standard
**Tags:** jarl, hygiene
**Files:** JarlSkill/skills/jarl/scripts, JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/CHANGELOG.md
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** test headers and comments of JarlSkill/skills/jarl/scripts/tests (for example the first line of fresh-review.test.mjs, models.test.mjs, retract.test.mjs) and the comments of the library
**After:** 322
**Branch:** jarl/338-no-task-numbers
**Worker:** w-hyg-haiku
**Since:** 2026-10-19 08:21

## What
The owner, 2026-10-18 (translated from Polish): ban writing task numbers in the code; zero task numbers anywhere and no descriptions of tasks, only sensible comments and code. Today the test headers and many comments open with a task number in parentheses ('(issue 281)', '(issue 475)') or tell the story of a task ('retired', 'the field report'), and workers copy the habit from each other. A comment says what the code does and why it must be so; a test title says what behaviour it proves; neither refers to a ticket, a loop, a package, a round, a reviewer or a release. The loop ends and the numbers then point nowhere. Commit subjects may name the issue (that is where the history lives); no file may.

## Why
A task number in a file is a pointer into a record that the reader of the repository does not have, it ages the moment the loop is archived, and it replaces the explanation a comment should give.

## Acceptance
- No file under skills/, README.md, CLAUDE.md or CHANGELOG.md names an issue, a ticket, a task, a package, a round or a reviewer by number or by a story about it: a test in the seams test fails on the shapes '(issue N)', 'issue N', 'issues N', 'ticket N', '#N' as a task reference, 'package N', 'round N' in comments and test titles and docs; the allowed exceptions are listed in the test and kept narrow (a test that builds a scratch loop and writes issue numbers as data, ids that are the subject of the behaviour under test)
- Every comment and test title that held such a number or story is rewritten to say what the code does or the behaviour proved, without losing the fact it stated; the full suite passes with no assertion edited
- The worker brief and the skill's worker section tell a worker that no file carries a task number or a task description, in the present tense

## Evidence

