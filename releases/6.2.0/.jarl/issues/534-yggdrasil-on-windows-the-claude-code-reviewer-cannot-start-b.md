# 534 · Yggdrasil: on Windows the claude-code reviewer cannot start, because an empty argument is lost when the CLI is spawned through a shell

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T0927-xqra
**Tags:** yggdrasil, reviewer, windows
**Files:** Yggdrasil/source/cli/src/llm/cli-base.ts
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/llm/cli-base.ts:379
**Branch:** jarl/534-windows-spawn-and-lock
**Worker:** w-534b-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 09:46

## What
On Windows a binary with no extension is spawned with shell: true, and the arguments are joined into one line quoting only those with whitespace. The claude-code isolation arguments hold empty strings (--tools "", --setting-sources ""), which vanish, so --setting-sources takes --strict-mcp-config as its value and claude exits 1; the --mcp-config JSON loses its quotes too. Every pair of yg check --approve fails, fail-closed. A field report on Windows 11 with yg 6.1.0 confirmed a fix that quotes an empty argument and any argument holding whitespace or a quotation mark, escaping the quotation marks: 3 of 3 pairs judged, then fills of up to 356 calls.

## Why
A paid fill on Windows judges nothing.

## Acceptance
- [test] Through a shell, an empty argument and one holding a quotation mark reach the child process unchanged, red before and green after · by: cd source/cli && npm test
- [read] The CHANGELOG says the reviewer starts on Windows again

## Changelog
- The claude-code reviewer starts on Windows again: empty arguments and arguments with whitespace or quotation marks are quoted when yg starts it through a shell.

## Evidence

### Proof

- **ran (line 01c97de297d6):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts · **saw:** 11 passed; with the old cli-base.ts the 4 new 'arguments through a shell' tests (empty argument, quotation marks, whitespace, trailing backslash) failed, so red before and green after

### Notes

The worker was killed when the machine ran out of memory; seven uncommitted files stay in its worktree. A new worker resumes the lease.

Assumed: quoting also doubles backslashes before a quotation mark and at the end of a quoted argument (MSVCRT rules), so a path ending in a backslash keeps its closing quote

