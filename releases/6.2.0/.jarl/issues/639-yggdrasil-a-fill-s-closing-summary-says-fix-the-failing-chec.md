# 639 · Yggdrasil: a fill's closing summary says 'Fix the failing check.mjs' for a pair left unverified because its file is too large or the parser could not hold its tree

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1922-evxz
**Tags:** yggdrasil, rules
**Files:** 
**Repo:** Yggdrasil
**After:** 561
**Found by:** jarl
**Where:** w-561-fable, 561 and 610
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
The pair is unverified by the file's size, not by the rule's script; telling the author to fix check.mjs sends them to the wrong place.

## Acceptance
[test] A fill whose pair is unverified because the file is over the text limit or its tree did not fit ends with a summary naming the file and the reason, not a fault in check.mjs, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule's pair left unverified because the parser had no memory for a syntax tree it asked for, or because the rule asked for the text or tree of a file larger than a rule can be given, is no longer reported as a `check.mjs` that failed to run. `yg check --approve` heads such pairs `left unjudged` and names the cause, `parser-out-of-memory` or `file-over-text-limit`, in `--json`; its closing summary names the files and no longer says to fix `check.mjs`. A rule that really fails keeps `check-failed-to-run`.

## Evidence

### Proof

- **ran (line 273a4dd1f246):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts tests/unit/core/fill-report.test.ts (2 of 3 e2e cases red on the base: cause check-failed-to-run, heading 'whose check.mjs failed to run', summary 'Fix the failing check.mjs') · **saw:** green after: 3 + 15 tests passed; --json cause parser-out-of-memory / file-over-text-limit, heading 'left unjudged', the summary names src/data/transcript.txt, a crashing rule keeps check-failed-to-run

