# 338 · Jarl: no task numbers and no task descriptions anywhere in the code, the tests, the comments or the docs; only comments that explain the code, and the code itself

**Status:** done
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
**Merged:** 9e41d72b724db94c2bbe6002b3b31276c26efb02 in ../../../JarlSkill
**CI:** pending

## What
The owner, 2026-10-18 (translated from Polish): ban writing task numbers in the code; zero task numbers anywhere and no descriptions of tasks, only sensible comments and code. Today the test headers and many comments open with a task number in parentheses ('(issue 281)', '(issue 475)') or tell the story of a task ('retired', 'the field report'), and workers copy the habit from each other. A comment says what the code does and why it must be so; a test title says what behaviour it proves; neither refers to a ticket, a loop, a package, a round, a reviewer or a release. The loop ends and the numbers then point nowhere. Commit subjects may name the issue (that is where the history lives); no file may.

## Why
A task number in a file is a pointer into a record that the reader of the repository does not have, it ages the moment the loop is archived, and it replaces the explanation a comment should give.

## Acceptance
- No file under skills/, README.md, CLAUDE.md or CHANGELOG.md names an issue, a ticket, a task, a package, a round or a reviewer by number or by a story about it: a test in the seams test fails on the shapes '(issue N)', 'issue N', 'issues N', 'ticket N', '#N' as a task reference, 'package N', 'round N' in comments and test titles and docs; the allowed exceptions are listed in the test and kept narrow (a test that builds a scratch loop and writes issue numbers as data, ids that are the subject of the behaviour under test)
- Every comment and test title that held such a number or story is rewritten to say what the code does or the behaviour proved, without losing the fact it stated; the full suite passes with no assertion edited
- The worker brief and the skill's worker section tell a worker that no file carries a task number or a task description, in the present tense

## Evidence

- **ran:** git grep -i -E '<task shapes>' release/6.2.0 -- skills README.md CHANGELOG.md CLAUDE.md | wc -l · **saw:** 62 lines on the release tip: task numbers and stories in comments, test titles, tests' data and the prose files
- **ran:** git grep -i -E '<task shapes>' -- skills README.md CHANGELOG.md CLAUDE.md | wc -l · **saw:** 45 lines on the branch: what remains is assertion strings, the ids the tests feed a command, the help text's id examples and the seams test's own samples; none is a comment, a test title or a prose line
- **ran:** git grep -c 'assert\.' -- skills/jarl/scripts/tests · **saw:** the counts equal the tip's for every test file, except seams.test.mjs, which gains the four assertions of the new rule; no existing assertion is edited
- **ran:** node --test --test-name-pattern='rule 8' tests/seams.test.mjs (on the release tip plus the new rule only) · **saw:** fails: the rule lists 22 task references in comments, titles and prose files (red)
- **ran:** node --test --test-name-pattern='rule 8' tests/seams.test.mjs (on the branch) · **saw:** pass 1, fail 0 (green)
- **ran:** npm test in skills/jarl/scripts · **saw:** tests 516, pass 495, fail 0, skipped 21 (the live-loop tests need JARL_LIVE_LOOP and are skipped as before)
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 9e41d72 · **saw:** 516 tests, 495 pass, 0 fail, 21 skipped

