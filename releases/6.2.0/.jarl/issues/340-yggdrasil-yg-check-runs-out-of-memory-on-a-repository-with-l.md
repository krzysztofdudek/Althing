# 340 · Yggdrasil: yg check runs out of memory on a repository with large mapped files, because the relation pass holds every mapped file as text

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261022T1010-llqr
**Tags:** yggdrasil, relations, performance
**Files:** Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/source/cli/src/structure/hook-loader.ts
**Repo:** ../../../Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/relations/pass.ts: enumerateFileRecords and readSourceText; the rule input of the deterministic worker reads each own file of a node whole as well
**Branch:** jarl/340-relation-pass-memory
**Worker:** w-340-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 09:42

## What
On a real repository with about 12 000 tracked files and about 2.4 GB of mapped content (52 files over 5 MB: transcripts up to 100 MB, archives, video, images), yg check 6.1.0 on Node 24 dies after about 83 seconds with 'Reached heap limit Allocation failed - JavaScript heap out of memory' at the default heap of about 4 GB, its stack in reading files into strings. With the heap raised to 12 GB it finishes. The cause in the code: the relation pass reads every mapped file of every node, whatever its language, decodes it as UTF-8 and keeps the string in its file records for the whole run; a binary file is decoded too, and its replacement characters take two bytes each. On release/6.2.0 readSourceText still reads every mapped file and keeps its UTF-8 text even when it marks the file binary. The deterministic rule worker also reads each own file of a node whole as text, with no size or binary limit.

Checked on 2026-11-09 against release/6.2.0: the rule worker already skips binary extensions and oversized binary files, so of that clause only text files up to 512 MiB read whole still stands. The relation pass is as described. The test sets its own heap limit, because a repository above the default heap of about 4 GB is not practical in CI.

## Why
A check that cannot finish on a large repository blocks every commit there through the pre-commit hook, and raising the heap only moves the limit. Only files the relation pass parses need their text; the rest need an identity (a hash from the bytes or a stream).

## Acceptance
- [read] The relation pass reads as text only the files whose language it parses, and every other mapped file is identified by a hash computed from its bytes, with no string kept for the run
- [read] A binary or very large file is never decoded to text for a rule, and a rule that asks for its content gets it marked binary or too large, as the rule API documents
- [test] A generated repository, not committed, whose mapped files exceed a heap limit the test sets with --max-old-space-size finishes yg check under that limit, and peak memory is reported · by: cd source/cli && npm test
- [read] The CHANGELOG says what changed for large repositories

## Evidence

### Proof

- **ran (line ba8e4ad3fd96):** cd source/cli && npx vitest run tests/e2e/relation-large-files-memory.test.ts (dist built from release/6.2.0's relation pass, the new test only) · **saw:** 1 failed: FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory (96 MiB mapped, --max-old-space-size=64)
- **ran (line ba8e4ad3fd96):** cd source/cli && npx vitest run tests/e2e/relation-large-files-memory.test.ts (dist built with the fix) · **saw:** 1 passed; yg check, 96 MiB mapped, --max-old-space-size=64: peak heap used 67 MiB, peak resident 185 MiB

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

