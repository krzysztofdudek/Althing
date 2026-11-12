# 655 · Yggdrasil: a pair left unverified because the parser had no memory for a file's tree, or because th…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2026-jxmd
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561-opus
**Where:** the review of 561, 610
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: a pair left unverified because the parser had no memory for a file's tree, or because the file is over the rule text limit, is still headed 'N pairs whose check.mjs failed to run' in yg check's report and carries cause check-failed-to-run in --json (formatters/check-render-groups.ts:204, core/fill-report-phase.ts:129: every runtime item gets that cause). Issue 639 covers only the fill's closing summary; the heading and the machine-readable cause tell the author the rule's script failed when it did not. Minor.

## Why


## Acceptance


[test] A pair left unverified because the parser had no memory or the file is over the rule text limit is headed and caused as such in yg check's report and --json, not as check-failed-to-run, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule's pair left unverified because the parser had no memory for a syntax tree it asked for, or because the rule asked for the text or tree of a file larger than a rule can be given, is no longer reported as a `check.mjs` that failed to run. `yg check --approve` heads such pairs `left unjudged` and names the cause, `parser-out-of-memory` or `file-over-text-limit`, in `--json`; its closing summary names the files and no longer says to fix `check.mjs`. A rule that really fails keeps `check-failed-to-run`.

## Evidence

### Proof

- **ran (line 3bd533f81a65):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts tests/unit/core/fill-report.test.ts (2 of 3 e2e cases red on the base: cause check-failed-to-run, heading 'whose check.mjs failed to run', summary 'Fix the failing check.mjs') · **saw:** green after: 3 + 15 tests passed; --json cause parser-out-of-memory / file-over-text-limit, heading 'left unjudged', the summary names src/data/transcript.txt, a crashing rule keeps check-failed-to-run

