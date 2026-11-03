# 075 · Jarl: the test suite leaves its temporary directories behind, about 30,000 per day of loop work, until the machine runs out of inodes

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** 2026-11-03: the system temporary directory (a tmpfs of 1,048,576 inodes) reached 100 percent used and every shell command on the machine failed; the top-level entries were Jarl test directories: jarl 6934, jarl-git 2768, jarl-loop 2674, jarl-shape 2080, jarl-repos 1322, jarl-attach 1218, jarl-models 1204, jarl-clean 879 and more; removing those older than 20 minutes brought it to 10 percent
**Branch:** jarl/075-tests-leave-no-temp-dirs
**Worker:** w-jarl-075-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-075
**Since:** 2026-11-03 09:42

## What
Many test files create a directory with mkdtemp and never remove it, or remove it only when the test passes; each full run of npm test leaves hundreds of directories, and a run stopped by a timeout leaves the rest. Six workers running the suite in parallel filled the machine's temporary directory in a day.

## Why
A test suite that exhausts the machine stops every agent and every command on it, Jarl's own users included.

## Acceptance
- After a full npm test, passing or failing, no directory the suite created is left in the temporary directory, checked by a test that counts the suite's own prefix before and after (or by running the suite with TMPDIR pointed at an empty directory and finding it empty)
- A test stopped by a timeout or a failure still removes its directory (after hooks, not cleanup at the end of the test body)

## Evidence

- **ran:** TMPDIR=<empty dir> npm test, before the change; ls of that dir · **saw:** 811 pass, 0 fail; 1146 entries left behind (jarl- 240, jarl-git- 88, jarl-loop- 81, jarl-shape- 65, jarl-repos- 45, report-2026-09-25- 43, and more)
- **ran:** TMPDIR=<empty dir> npm test, after the change; ls of that dir · **saw:** 817 pass, 0 fail (6 new cleanup tests); the dir holds only node-compile-cache, no suite directory

