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

## Changelog
- Fixed: yg check finishes on a repository whose mapped files hold far more bytes than its memory. The relation check reads as text only the source files whose dependencies it checks; every other mapped file (recordings, archives, images, transcripts) is identified by a hash read from its bytes in a stream, and none of its text is kept for the run.
- Before you upgrade: a rule receives a binary file, or a text file over 64 MiB, without its text. Such a file reaches ctx.files, ctx.node.files and ctx.graph with empty content, no ast, and a new field, unread, set to 'binary' or 'too-large'. A rule that read the text of such a file now sees it empty, so its verdict can change on upgrade; where a rule must look inside these files, have it check unread and report the file.

## Evidence

### Proof

- **ran (line ba8e4ad3fd96):** cd source/cli && npx vitest run tests/e2e/relation-large-files-memory.test.ts (dist built from release/6.2.0's relation pass, the new test only) · **saw:** 1 failed: FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory (96 MiB mapped, --max-old-space-size=64)
- **ran (line ba8e4ad3fd96):** cd source/cli && npx vitest run tests/e2e/relation-large-files-memory.test.ts (dist built with the fix) · **saw:** 1 passed; yg check, 96 MiB mapped, --max-old-space-size=64: peak heap used 67 MiB, peak resident 185 MiB
- **ran (line ba8e4ad3fd96):** cd source/cli && VITEST_MAX_WORKERS=4 npm run test:coverage -- --coverage.thresholds.*=0 --exclude tests/e2e/cli-read-cost-bounds.test.ts (final code, commit f2de9a768) · **saw:** 709 test files passed, including tests/e2e/relation-large-files-memory.test.ts; coverage lines 97.48, statements 96.43, functions 96.88, branches 91.37

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: the fault was confirmed on release/6.2.0 before any change: a generated repository with 241 MB of mapped files (3 x 40 MiB random bytes, 3 x 40 MiB text) beside two .ts files died in yg check under --max-old-space-size=256 with 'Reached heap limit Allocation failed - JavaScript heap out of memory'; the same repository with 1 MiB files peaked at 25 MiB heap.

Assumed: a mapped file the relation pass does not parse is identified by sha256 of its raw bytes, streamed; for valid UTF-8 this is the value hashString gave before, so feature-index pins and fact-cache keys of text files do not move. A binary or over-512-MiB file of a parsed language is now hashed from its raw bytes too (before: hash of its UTF-8 misreading, or of its size over 2 GiB); nothing reads that hash, since such a file has no facts.

Assumed: 'very large' for a rule is 64 MiB (RULE_TEXT_LIMIT_BYTES in the rule runtime): far above any source file, below the transcripts and dumps of the field report. A text file over it, or a binary by extension or by a NUL in its first 8000 bytes, reaches the check with empty content, no ast, and a new File field unread: 'binary' | 'too-large', in ctx.files, ctx.node.files (narrowed siblings) and ctx.graph node files; documented in the rule API (docs/reviewers.md, the writing-deterministic-aspects knowledge page, the File type). Empty content plus a mark was chosen over a throwing getter so a rule that walks every file does not turn red on upgrade; the mark lets a rule that must see such files report them. A text subject over the engine's string limit still stops the run, as before, because the pair computation already refuses it. ctx.fs.read is left as it was: a rule asking for a path's bytes gets them.

Assumed: a marked sibling or graph-reached file folds its read: observation from its bytes read for that alone when the check first looks at its content or its mark, so a change to it re-runs the verdict, matching the verifier's re-observation. That read holds the bytes in a Buffer for a moment; the string is what the issue's memory was spent on.

Open: scripts/repo-check.sh on f2de9a768 fails only on the 10 reviewer pairs the LLM reviewer must fill: deterministic @ source/cli/src/relations/pass.ts, structure/ctx-graph.ts, structure/ctx-parsers.ts, structure/hook-loader.ts, structure/index.ts, structure/types.ts, structure/rule-text.ts (new); test-deterministic @ source/cli/tests/integration/relation-pass-text-encoding.test.ts, tests/e2e/relation-large-files-memory.test.ts (new), tests/unit/structure/rule-text.test.ts (new). Failed steps: Graph: deterministic cache, Graph: check (10 unverified reviewer pairs, nothing else), CLI: test (only tests/e2e/cli-read-cost-bounds.test.ts case 3, 'yg check --json exits 0' on the repo's own graph, which exits 1 on those pairs; it passes on a git archive of release/6.2.0), and so the coverage gate was not evaluated (measured separately: branches 91.37%). Every other step passed, the portal e2e and docs build included.

