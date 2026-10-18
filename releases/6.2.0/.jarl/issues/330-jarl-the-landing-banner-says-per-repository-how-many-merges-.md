# 330 · Jarl: the landing banner says per repository how many merges carry the declared check

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** jarl, invariants
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/landing-banner.test.mjs
**Repo:** ../../../JarlSkill
**After:** 329
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2614 (checkSummary: landsOn is check when withCheck > 0); probe: status --json on a loop with no Check line and one merge recorded with --ran prints "declared": false, "landsOn": "check"; jarl.mjs --help, the status and report rows (the testimony mark shows when goal.md has no Check line)
**Branch:** jarl/328-invariants
**Merged:** 0afdb65b4c7f60c4e6e3312036aa9f58e7942379 in ../../../JarlSkill
**CI:** pending

## What
checkSummary reports that the loop lands on check as soon as any merge carries any --ran string. The string is never compared with the Check: line(s) of goal.md, so one merge in a hundred flips the whole loop, and a loop with no Check line at all reports that it lands on check (probe: "declared": false, "landsOn": "check"). The help text of status and report says the testimony mark shows when goal.md has no Check line, which is not the rule the code runs. The change: each merge check row is compared with the declared Check command(s) of its repository (the per-repository Check lines and the loop own Check line), by the rule SKILL.md states (the --ran text equals a declared command after trimming whitespace). status and report print, per repository, "k of n merges carry the declared check", and the testimony mark for a repository with no declared check; status --json and report --json carry k, n and declared per repository, and landsOn is derived from those counts. The help text of status and report and SKILL.md describe the banner and the testimony mark as the code prints them.

## Why
The banner is the one line that tells the owner what the loop landed on; a banner that flips on one string claims a check the record does not hold, and a reader trusts it exactly where it is wrong. A count per repository is the honest form and costs one comparison.

## Acceptance
- A test: a loop with no Check line and one merge recorded with --ran "npm test": status --json has declared false for the repository and status prints the testimony mark, never that the loop lands on check; the test fails on the base
- A test: Check: npm test and three merges, one with --ran "npm test", one with --ran "echo ok", one with no row: status and report print "1 of 3 merges carry the declared check" for that repository; the test fails on the base
- A test with two repositories, each with its own Check line: the counts are per repository and a row matching the other repository check does not count
- status --json and report --json carry {repo, k, n, declared} per repository, tested
- jarl.mjs --help for status and report and SKILL.md describe the per-repository count and when the testimony mark shows, in the present tense, matching the two cases the tests print

## Changelog
- Changed: status and report say per repository how many merges carry the declared check (k of n), and show the testimony mark for a repository that declares none, instead of reporting that the loop lands on its check when any one merge carries any check row.

## Evidence

- **ran:** node --test tests/landing-banner.test.mjs, on the base and on the change · **saw:** base: 7 of 7 fail; change: 7 of 7 pass
- **ran:** status on a frozen copy of the 6.2.0 loop · **saw:** Check lines are prose, so the banner prints the testimony mark and 0 of 106 (Grain), 0 of 23 (JarlSkill), 0 of 43 (Runes), 0 of 91 (Yggdrasil) merges carry the declared check
- **ran:** cd skills/jarl/scripts && npm test · **saw:** 429 tests, 0 fail; assertions changed to the new banner: merge-check.test.mjs (3: byRepo shape and lines, testimony needs a declared Check), report-metrics.test.mjs (3: banner text)
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 0afdb65 · **saw:** 436 tests, 418 pass, 0 fail, 18 skipped

