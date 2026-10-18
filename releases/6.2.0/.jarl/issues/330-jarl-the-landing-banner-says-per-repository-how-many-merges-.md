# 330 · Jarl: the landing banner says per repository how many merges carry the declared check

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** jarl, invariants
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/landing-banner.test.mjs
**Repo:** ../../../JarlSkill
**After:** 329
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2614 (checkSummary: landsOn is check when withCheck > 0); probe: status --json on a loop with no Check line and one merge recorded with --ran prints "declared": false, "landsOn": "check"; jarl.mjs --help, the status and report rows (the testimony mark shows when goal.md has no Check line)

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
- Fixed: status and report say per repository how many merges carry the declared check ("k of n"), instead of reporting that the loop lands on its check when any one merge carries any check row.

## Evidence

