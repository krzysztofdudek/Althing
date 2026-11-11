# 606 · Grain: with few open files allowed, Grain takes a git repository for a plain folder and leaves a large file out silently, and crashes with a few more

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-bhuz
**Tags:** grain
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** w-169-takeover-fable, issue 169 (ulimit -n 24 to 39)
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
A failure to start git must not change what Grain thinks the repository is; a silent wrong model is worse than a stop.

## Acceptance
[test] Under a low open-file limit Grain either answers as it does without the limit or stops with a message naming the limit, never treats a git repository as a plain folder, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: when git or a file cannot be opened because the shell allows too few open files, Grain stops with a message that names the limit (ulimit -n) and prints no answer. Raise the limit and run again.

## Evidence

### Proof

- **ran (line 3b7ae43e3ba5):** grain status on fresh scratch copies of a git repository with a 1.6-million-character Python file, under ulimit -n 16 to 48, on the release code · **saw:** 24 and 28: exit 0, the repository indexed as 'worktree, no git', 0 conventions, the large file's read 'Worker initialization failure: EMFILE'; 32: exit 0, still 'no git'; 36: exit 1, 'Cannot read properties of undefined (reading length)'; 40 and 48: the normal answer. In an empty repository 21 exits 1 with no output at all
- **ran (line 3b7ae43e3ba5):** node --import ./tests/git-env.mjs --test tests/open-file-limit-never-changes-the-answer.test.mjs before the fix (the test and its helper, nothing wired), 8 GB cap · **saw:** 2 tests, 1 pass, 1 fail: at ulimit -n 21 grain status exits 1 without a message
- **ran (line 3b7ae43e3ba5):** node --import ./tests/git-env.mjs --test tests/open-file-limit-never-changes-the-answer.test.mjs with the check-, where- and export- test files, after the fix, 8 GB cap · **saw:** tests 110, pass 110, fail 0: under each ulimit -n from 20 to 44 grain status either prints the answer it prints without a limit (from 40 up on this machine) or exits 1 with 'could not start git (EMFILE): this process has reached its limit on open files (ulimit -n)' and prints no answer; never 'worktree, no git'

### Notes

Assumed: a start refused for a resource (EMFILE, ENFILE, EAGAIN, ENOMEM with no exit status) is a stop; git missing from the machine (ENOENT) stays what it was, a folder without git. A relation worker that cannot start for want of a file handle also stops the run, where 169 named the file as unfinished: under this limit the answer must be the unlimited one or a stop. Below about 21 open files Node cannot load Grain at all and prints its own 'EMFILE: too many open files'; the test accepts that message as naming the limit.

Docs delta for the final pass: troubleshooting entry for 'could not start git (EMFILE): this process has reached its limit on open files (ulimit -n)'.

