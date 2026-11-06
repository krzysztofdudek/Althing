# 140 · Jarl: ask, log and decide pointed at a directory with no loop crash with a bare ENOENT, where set and field say no such issue

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096f-opus
**Where:** Review of 096 (rev-jarl-096f-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Worker:** w-jarl-128-sonnet-r2
**Worktree:** /home/me/Worktrees/JarlSkill/128-fields-and-refusals
**Since:** 2026-11-06 16:19

## What
ask, log and decide run in a directory that holds no loop end with a bare ENOENT and no ready line; set, field and the other writes there say no such issue instead of no loop here. The behaviour was there before 096.

## Why
An agent that runs from the wrong directory should be told there is no loop and given the --root form.

## Acceptance
Every command that needs a loop says no loop is found here and ends with the form that names --root, with a test per writing command

## Changelog
- Fixed: every command that writes, run where no loop is found, now says there is no loop there and names --root as the way to point at one. Before, ask, log and decide stopped with a file error, and set, field and the others said there was no such issue.

## Evidence

- **ran:** node --test tests/no-loop.test.mjs on the code before the change · **saw:** 32 of 34 failed: ask, log and decide ended with a bare ENOENT, set and field with 'no such issue', the rest with their own wording
- **ran:** npm test in skills/jarl/scripts on the branch tip (TMPDIR in a mktemp folder); ask q in an empty directory with and without --root · **saw:** tests 1298, pass 1277 on the run before the final wording change (one failure then fixed: the wording now holds 'no .jarl/'); the 21 writing commands, resume and 3 tools each print 'no loop here: <dir> holds no .jarl/ — open one with …, or pass --root "<loop-root>"' and end with the init form carrying the call's root; list and status still read an empty loop
- **ran:** node --test tests/no-loop.test.mjs with the new tests, on the code before the change (lib/loop.mjs as at the previous commit) · **saw:** 27 tests, 24 pass, 3 fail: the line-break root splits the reason into a line starting with the caller's own words, the command-substitution root is printed bare in the reason, and the reason of a call with no --root prints the directory unquoted; the form line of that call is already 'jarl.mjs init "<goal>"' with no --root
- **ran:** node --test tests/no-loop.test.mjs tests/refusals.test.mjs on the branch tip · **saw:** 55 tests, 54 pass, 0 fail, 1 skipped: for every writing command and resume, a root with a line break is echoed as one quoted word with the break written \n and the reply is two lines, a root holding a command substitution is echoed in single quotes and pasting the whole message into sh and zsh makes no file, and a call with no --root ends with the init form naming none
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (TMPDIR in a mktemp folder), run again after two runs hit ENOSPC on the shared temp filesystem · **saw:** exit 0: tests 1315, pass 1293, fail 0, skipped 22 (the two earlier runs failed only with ENOSPC while other suites filled the filesystem)

