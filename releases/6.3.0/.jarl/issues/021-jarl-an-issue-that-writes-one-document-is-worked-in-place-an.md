# 021 · Jarl: an issue that writes one document is worked in place, and the reference says who commits it

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/043-profile-and-numbers
**Worker:** w-jarl-043-opus
**Worktree:** /home/me/Worktrees/JarlSkill/043-profile-and-numbers
**Since:** 2026-11-08 11:18

## What
In a loop of research issues that each write one markdown file, a worktree, a branch and a merge per issue was ceremony; the loop ruled that such issues write their declared file in place and the coordinator commits. The rules say only the merger commits, which leaves a loop with no merges in doubt.

## Why
Document work is a common shape of a loop; the skill should support it rather than leave each coordinator to invent it.

## Acceptance
- An issue may be marked as worked in place on its declared files; next keeps two such issues off one file, as it does now
- The references say who commits in that case and when, and that the merge steps do not apply
- A test for the in-place mark and the file guard

## Changelog
- Added: A task that only writes its own files, such as one document, can be tagged in-place: its worker writes them in the loop's own checkout with no branch and no merge, and the person who commits there commits them. Jarl closes such a task only once a recorded proof names that commit. The first such tag moves the loop to format 3.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/in-place.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 4 tests, pass 0, fail 4 — a lease of an in-place issue with --branch or no files is accepted, done closes it with no commit named, the tag raises nothing
- **ran:** cd skills/jarl/scripts && node --test tests/in-place.test.mjs, at f7c8408 · **saw:** green: 4 tests, pass 4, fail 0 — the ready row and the lease take no branch, a lease with no files refused with the field Files form, next holds the second issue on the same file, done refuses until a row names a commit on HEAD that changes the declared file (a commit of another file does not count), the tag raises format 3 which 6.2.0 refuses, a code issue is never tagged, below format 3 verify notes the tag
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, report, sources, branches, models, profile, verify, goal, and show, show --full and brief of each of the 199 issues), text and --json, base 0e17fb9 against tip f7c8408 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1230 calls, 6 differ: resume, resume --json, status --json, next --as jarl --json and verify, verify --json; the differences are ageMs and the list of rulings whose issues are not closed; closedGate is 028 alone in both; every done issue reads the same
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)

