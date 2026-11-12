# 580 · Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1335-tamu
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
Yggdrasil: a script rule's run holds the text of every own file of its component at once, even when the rule reads only paths. Eight text files of 40 MiB in one component end yg check --approve --only-deterministic with heap out of memory under --max-old-space-size=256, on release/6.2.0 and on the branch of issue 340 alike; the crash is in allocating the next file's buffer. The same eight files at 65 MiB each pass on that branch, because files over 64 MiB are no longer read. So under the 64 MiB limit a component's rule run still costs the sum of its files.

## Why


## Acceptance


[test] A script rule that reads only paths does not hold its component's file texts; eight 40 MiB text files in one component pass yg check --approve --only-deterministic under --max-old-space-size=256, red before and green after · by: cd source/cli && npm test

## Changelog
- A script rule that reads only the paths of its component's files no longer makes `yg check` hold their text. Under a small memory limit, a component of several large text files used to stop `yg check --approve --only-deterministic` for running out of memory even though the rule never read them; a file's text is now read when a rule asks for it.

## Evidence

### Proof

- **ran (line da5b691e38cf):** cd source/cli && npx vitest run tests/e2e/script-rule-paths-memory.test.ts (red on the base: heap out of memory, 8 text files of 40 MiB under --max-old-space-size=256) · **saw:** green after: 1 test passed, yg check --approve --only-deterministic exits 0 with no errors; tests/unit/bounty2/structure-infile.test.ts 35 passed

