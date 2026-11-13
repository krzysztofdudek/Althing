# 718 · Runes: CI runs the whole suite on Linux, Windows and macOS in parallel, as Jarl's ci.yml does (ruling ci-everywhere-like-jarl)

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0406-pugh
**Tags:** ci, windows, macos
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/718-ci-everywhere
**Worker:** w-718-sonnet
**Model:** claude-sonnet-5-5@medium
**Since:** 2026-11-12 04:06
**Merged:** 8d31e57506fc3f2f5204b00fd76ecc1f711247bc in Runes
**Merge check:** npm run check · saw ℹ tests 2676, pass 2673, fail 0, skipped 3; exit 0

## What


## Why
Paths, links, signals and git behave differently on Windows and macOS; a suite run on Linux alone lets those faults through to users.

## Acceptance
- [read] .github/workflows/ci.yml runs the repository's whole test suite on ubuntu-latest, windows-latest (sharded where the suite is long) and macos-latest, Node 22 and 24, fail-fast off, as Jarl's does, and every step that ran on Linux alone now runs on all three or says in the workflow why it cannot
- [read] Every test that cannot run on a platform is skipped there with a stated reason, and the suite was run once locally on Linux with the platform guards in place; the first CI run on GitHub on all three platforms is green, recorded after the push

## Reviews
- **changes** · by rev-717-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Important: the Windows job is not sharded. ci.yml:106 runs npm test -- --test-shard=${{ matrix.shard }}/3, and npm appends the flag after the file pattern of the test script (node --test "test/**/*.test.mjs" --test-shard=1/3); node takes an option after the first file argument as an argument, not an option, so it ignores the shard. Measured at 2cbc997 with node 24.22.2: the full run and each of the shards 1/3, 2/3, 3/3 loaded all 77 test files; a six-file probe ran 6 of 6 with the flag after the pattern and 2 of 6 with it before. So each of the six Windows jobs runs the whole suite, and the comments at ci.yml:78 (three shards) and ci.yml:46 (the Windows run sees only a shard) state what does not happen. test/ci-workflow.test.mjs:54 is a false green: it runs node with --test-shard before the pattern, not the command the workflow runs, so it passes while the real step does not shard. A fix must make the script take the shard ahead of the pattern (as Grain's scripts/test.mjs does) and the test must run the repository's own npm test command line. Line 1 [read] otherwise met: ubuntu-latest, windows-latest and macos-latest on Node 22 and 24, fail-fast false; the YAML parses and action-validator passes; macOS reads the grammars built on Linux, which are WebAssembly files (\0asm), loaded by the WebAssembly runtime of web-tree-sitter, so a Linux-built cache is valid on macOS; the coverage thresholds (ci.yml:46) and the corpus gate (the corpus job's comment) stay on Linux, each with a reason in the workflow. Line 2 [read]: no skip added; npm ci and npm run check at 2cbc997 on Linux: 2676 tests, 2673 pass, 0 fail, 3 skipped with reasons (the Go oracle: go is not installed; the two Rust build tests: rustc and cargo 1.99.1 not installed), dist/ fresh. The first green GitHub run on three platforms is still to be recorded after the push.
- **approve** · by rev-718b-opus (fresh) · 2026-11-12 · model claude-opus-5-5@medium
  No findings. Round 1's Important is fixed. At 2f6227a (node 24.22.2, scratch extraction, warm grammar cache): npm test -- --test-shard=K/3 for K=1,2,3 ran 26, 26 and 25 test files, disjoint, 944+971+761 = 2676 tests, 0 fail; their union equals a plain npm test's 77 files, which equals every test/**/*.test.mjs on disk (2676 tests, 0 fail). npm test at 1a400a9 runs the same glob and the same 2676 tests (its two red ci-workflow tests are the red-first tests of the old workflow); there, --test-reporter after the pattern was ignored, which reproduces the original fault. Guard attacked: with package.json's test script put back to node --test "test/**/*.test.mjs", and separately with scripts/test.mjs putting the options after the pattern, test/ci-workflow.test.mjs fails at the shard test (every shard ran all 11 files); unchanged, it passes 5 of 5. scripts/test.mjs on Windows, by reading: spawnSync with process.execPath and an argv array and no shell, so nothing is quoted by cmd; the glob keeps forward slashes, which node's --test glob takes on Windows as the old quoted pattern did; a signal exit becomes 1. The README sentence matches ci.yml: Ubuntu, Windows and macOS, Node 22 and 24, Windows in three shards, Windows and macOS read the grammars job's artifact offline; ci.yml:46 and :78 now state what happens. npm run check: 2676 tests, 2673 pass, 0 fail, 3 skipped with reasons; check:dist reports dist/ fresh (run in a git snapshot of the extraction, whose dist/ is byte-identical to the committed one). Line 1 [read] met. Line 2 [read] met locally; the first green GitHub run on three platforms is still to be recorded after the push. Commits each name issue 718, the fixes are new commits, no test, guard or threshold weakened. Not run: Windows and macOS themselves.

## Evidence

### Proof

- **ran (line 1190a58b1537):** npm run check (Linux, committed tree) · **saw:** exit 0; tests 2676, pass 2673, fail 0, skipped 3; The build compiler is the pinned one; dist/ is fresh

### Notes

Assumed: macOS reads the grammars the Linux job built (artifact), as Windows does, rather than building from source on the runner; same pinned bytes on all three, no cold wasi-sdk fetch per runner. Assumed: Windows in 3 shards as Jarl's; coverage thresholds and the corpus gate stay Linux-only, each with its reason in the workflow. Assumed: the Rust build test and the Go oracle test are left skipping on CI (no pinned rustc 1.99.1 installed): a toolchain step I cannot run here would be a first CI run with unknown cost; no test skipped on macOS, none found that cannot run there.

