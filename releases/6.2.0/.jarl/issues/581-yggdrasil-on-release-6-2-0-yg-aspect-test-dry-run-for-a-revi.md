# 581 · Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-vzsz
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340b-fable
**Where:** the review of 340
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: on release/6.2.0, yg aspect-test --dry-run for a reviewer rule ends with exit 134 after printing a companion list that names a 65 MiB file. Seen once on a copy of the e2e-companion fixture with a 65 MiB .sql file mapped into the dependency; the cause was not established, and the branch of issue 340 was not tried with a companion that returns such a file by path.

## Why


## Acceptance


[test] yg aspect-test --dry-run for a reviewer rule whose companion names a 65 MiB file ends with a report naming the file and the limit, never exit 134, red before and green after (or the cause is shown not to exist on the release, with the reproduction recorded) · by: cd source/cli && npm test

## Changelog
- `yg aspect-test --dry-run` and `yg check --approve` report a companion file larger than 64 MiB instead of running out of memory. A reviewer rule whose companion returns such a file now leaves that pair without a verdict, naming the file and the limit, and the other pairs go on; with a small memory limit the run used to abort while numbering the lines of the file.

## Evidence

### Proof

- **ran (line 7faf3b599b73):** cd source/cli && npx vitest run tests/e2e/companion-over-limit.test.ts tests/unit/core/companion-resolve.test.ts (red on the base: aspect-test --dry-run under --max-old-space-size=256 with a 65 MiB companion ends with heap out of memory; the unit case returns no infra) · **saw:** green after: 18 tests passed; stderr names apps/e2e/tests/big.sql and 67108864, the pairs whose companions fit still print

### Notes

Assumed: the exit 134 was reproduced only with the companion hook returning a 65 MiB file of one-character lines under a heap limit (node --max-old-space-size=128..1024 on the copy of the e2e-companion fixture with specs mapped as apps/e2e/tests/*, one scenario naming test: big.sql): the run aborts with 'JavaScript heap out of memory' while the prompt numbers the lines. At the default heap (and with ordinary line lengths, 65 MiB or 69 MiB, including through a pipe) the preview printed and exited 0 on the release, so the cause is the memory the prompt needs for a file past the text limit; the fix refuses such a companion with a report naming the file and the limit. The dry-run keeps its existing exit 0 for a unit it reports and skips.

