# 643 · Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1940-vdwp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-573-opus
**Where:** the review of 573, 587, 588, 605, 606, 612, 631
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6.2.0 and on jarl/573-grain-large-files (3.6 GB on both, 2.6 GB on release): the re-started process (--liftoff-only) aborts with SIGABRT (exit 134 when started directly), and bin/grain.mjs:71 turns a child ended by a signal into a plain exit 1 without a word; GRAIN_V8=off answers. A silent failure the change did not touch.

## Why


## Acceptance


[test] Under ulimit -v 2.6 GB and 3.6 GB grain status answers or stops with a message naming the limit, never a bare exit 1 from a re-started process that aborted, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: when the process grain re-starts for a query is ended by a signal (for example under a limit on the memory of a process), grain now says so and names GRAIN_V8=off as the way round it; it used to exit in silence with code 1. The exit code is now the shell's code for that signal.

## Evidence

### Proof

- **ran (line ecfd28f814e2):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/launcher-names-a-child-ended-by-a-signal.test.mjs tests/orphan-child.test.mjs tests/build-coordination.test.mjs (before the fix the new test failed: exit 1 with no word, 1 !== 134) · **saw:** tests 21, pass 21, fail 0 after the fix; under ulimit -v 1000000 the launcher now ends with the signal's code and its own line after V8's message

### Notes

Assumed: the exact limits of the issue (2.6 and 3.6 GB) abort the re-started process only on the reviewer's machine and tree; here a small repository at 2.6 and 3.6 GB answers, and at 1.0 to 1.4 GB the child ends by SIGTRAP after V8's own message. The fault the issue names is the launcher's, a child ended by a signal turned into a bare exit 1, and the test sends the child SIGABRT to show it red before and green after. The launcher now names the signal, the usual cause (ulimit -v) and GRAIN_V8=off, and exits 128 plus the signal number instead of 1; it does not re-run the query by itself, since the aborted process may have printed or written part of its answer.

