# 699 · Yggdrasil: a dry run exits 0 when it reports and skips a unit, and pairs on type-covered files still take the check-failed-to-run cause

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0250-vtrl
**Tags:** yggdrasil, reports
**Files:** 
**Repo:** Yggdrasil
**After:** 560
**Found by:** jarl
**Where:** w-560-sonnet, memory rest package report
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
A dry run that skipped work should not look like a clean one to a script, and a type-covered file left unverified by the parser-memory or text-limit case should carry the same cause as a mapped file (639, 655).

## Acceptance
[test] A dry run that reports and skips a unit exits non-zero with the unit named, and a type-covered file's pair left unverified by the parser-memory or text-limit case carries that cause, red before and green after · by: cd source/cli && npm test

## Changelog
- **`yg aspect-test --dry-run` no longer ends like a clean run when it left a unit out.** A unit whose prompt cannot be assembled (a companion that fails, a suppress marker without a reason) is still reported and skipped while the other units print, and the run now ends with `yg aspect-test: incomplete` naming each skipped unit and exits 1, so a script can tell a partial preview from a complete one.

## Evidence

### Proof

- **ran (line 484bf4becc3f):** cd source/cli && npx vitest run tests/unit/cli/aspect-test.test.ts (red before: no incomplete stamp, exit undefined) · **saw:** green after: a dry run that skips a unit prints 'yg aspect-test: incomplete — 1 of 1 unit could not be previewed: node:N' and exits 1; this is the dry-run half of the line only, the type-covered-cause half is not done (depends on 560)

### Notes

Assumed: the 'dry run that reports and skips a unit' is yg aspect-test --dry-run (a unit whose prompt cannot be assembled is reported and skipped, then the run exited 0); yg check --approve --dry-run is documented to exit 0 always and stays so. The stamp reads 'yg aspect-test: incomplete — N of M units could not be previewed: <unit keys>', the live path's incomplete stamp. The second half of the line (a type-covered file's pair carrying the parser-memory or text-limit cause) cannot be built or proved on release/6.2.0: those causes (parser-out-of-memory, file-over-text-limit) exist only on jarl/560-memory-rest, not yet merged, so it is NOT done and needs this issue re-sent after 560 lands.

