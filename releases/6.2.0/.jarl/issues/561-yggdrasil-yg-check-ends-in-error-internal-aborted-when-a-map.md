# 561 · Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1150-vqto
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340-fable
**Where:** the review of 340
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Yggdrasil: yg check ends in error[internal] "Aborted()" when a mapped file of a parsed language is about 40 MiB
A generated repository with two .ts files of 40 MiB of repeated prose lines (not valid TypeScript) and two .ts files of 40 MiB of binary bytes: yg check under --max-old-space-size=512 prints "Aborted()" four times, then error[internal] "Unexpected error while running check: Aborted(). Build with -sASSERTIONS for more info." and exits 1, with about 2052 MiB of memory outside the heap at the peak, which points at the parser's own memory. Same result on release/6.2.0 and on the 340 branch, so issue 340 did not cause it. Not tried: a valid source file of that size, or the size at which it starts. A large generated bundle mapped beside the source would meet it, and the message names neither the file nor a way out.

## Why


## Acceptance


[test] A mapped file of a parsed language whose parse the parser aborts (about 40 MiB of non-code text or binary bytes) never ends yg check in error[internal]: the file's relations are reported as unread with the reason, the other files are checked, and peak memory outside the heap stays bounded, red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: yg check reads every other file when one mapped source file is too large or too dense for the parser (a source file over 4 MiB is read in a process of its own; a file whose tree does not fit in the parser's 2 GiB is reported as relation-parse-failed with the reason). Fixed: a script rule that asks for the syntax tree of such a file is left unverified with the reason, instead of check-failed-to-run with advice to fix check.mjs.

## Evidence

### Proof

- **ran (line cffda912407e):** cd source/cli && npx vitest run tests/e2e/parser-memory.test.ts (the new test file, on a scratch copy of release/6.2.0 at 03ac2699d, built) · **saw:** RED before: 4 failed (4). Both relation tests fail: yg check prints Aborted() and error[internal] 'Unexpected error while running check: Aborted()', for three 56 MiB source files and for two 24 MiB source files alike.
- **ran (line cffda912407e):** cd source/cli && NODE_OPTIONS=--max-old-space-size=8192 npx vitest run tests/e2e/parser-memory.test.ts tests/integration/relation-pass-parser-memory.test.ts tests/unit/relations/file-facts.test.ts tests/unit/ast/parse-guard.test.ts (branch jarl/561-parser-abort, built) · **saw:** GREEN after: 5 files with the structure one, 38 passed. Three 56 MiB files: relation-parse-failed names '3 TypeScript files, e.g. src/data/bundle-1.ts' and 'the parser ran out of memory', the undeclared dependency of the small files is still reported, no error[internal], peak resident 496 MiB. Two 24 MiB files: both read, no parse failure, peak resident 297 MiB.
- **ran (line cffda912407e):** nice -n 15 timeout 3300 bash scripts/repo-check.sh (branch at 42355c4d0, release/6.2.0 at 03ac2699d merged in); then npm run test:coverage -- --coverage.reportOnFailure with the thresholds off · **saw:** Every step passes except those that need this repository's own reviewer verdicts: 32 reviewer pairs are open (20 changed, 12 new), so 'Graph: check' fails and 3 tests that read the repository's own graph fail on them (cli-read-cost-bounds 3, portal-derive-nodes twice); 10652 other tests pass. Coverage with those 3 failing: branches 91.42%, lines 97.57%, functions 96.96%, statements 96.56%.

### Notes

Assumed: 'peak memory outside the heap stays bounded' means the check itself never holds the tree of a large file. The parser needs up to 2 GiB to learn that a tree does not fit, so that memory is spent in a process of its own, one file at a time, and given back when it ends; the test asserts a peak resident size of the check under 1 GiB with three such files (496 MiB measured, about 2 GiB before).

Assumed: the cause is one for both issues, so one commit carries both. The tree-sitter runtime keeps all trees in one WebAssembly memory of at most 2 GiB, aborts when it cannot grow, and answers every later call on that thread with the same abort (measured: even deleting the parser throws). In 561 two files in flight each held a tree; in 610 one tree needed more than 2 GiB.

Assumed: the issue's inputs (40 MiB of prose) each parse alone in about 1.2 GiB and failed only together, so the test uses dense valid source instead: 56 MiB files that cannot fit alone, and 24 MiB files that fit one at a time. They fail the same way on the release branch and run in seconds, where 40 MiB of prose takes about 100 s per file.

Assumed: the threshold for reading a file in a process of its own is 4 MiB of text. A tree takes up to about 48 times its text (40 MiB of source took 1.9 GiB), so a smaller file cannot exhaust the parser alone.

Assumed: the two new process entry files are left out of coverage the way the worker thread entry already is, because they run only as their own processes from the built bundle; their logic is in modules tested in-process.

