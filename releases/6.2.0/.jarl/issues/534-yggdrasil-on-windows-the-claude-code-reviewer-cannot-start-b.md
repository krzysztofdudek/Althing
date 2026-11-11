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

## Reviews
- **changes** · by rev-534-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1024-blzi
  Important (535) source/cli/src/io/atomic-write.ts:298: the asynchronous write retries the whole temp-then-rename step, so after this change any EPERM, EBUSY or EACCES from the temp file's open (a read-only directory, a wrong owner after sudo, a CI checkout) is thrown as LockedFileError and rendered by the preamble as 'another program holds it open', with 'close whatever has the file open' as the next step and 'every verdict written before is kept' even for a portal, pack or graph-file write. Probe on Linux: atomicWriteFile into a 0555 directory waited 1601 ms and reported '<file> could not be written: another program holds it open (EACCES)'; the error's syscall was open on the .tmp file. The sync form, which retries only the rename, still reports the raw EACCES, so the two forms now disagree. The issue's line asks for a rename that keeps failing to be reported as a locked file; classify only a rename failure (err.syscall === 'rename') as a locked file, keep the open/write failure honest, and word why/next so that a persistent EPERM/EACCES (a read-only target on Windows, a permission on POSIX) is not asserted to be another program. Minor (534) source/cli/tests/unit/llm/cli-base-process.test.ts:73: the four new tests pass the quoted line through /bin/sh and are skipped on win32, and there is no Windows CI, so cmd.exe plus the MSVCRT parse the fix targets is never run; for the arguments yg actually passes (claude-code's two empty values and {"mcpServers":{}}, gemini and codex temp paths) a reading of cmd.exe's rules finds the quotes balanced and no metacharacter left outside them, and the field report confirmed the same quoting, so it is unproved here, not wrong. Minor (534) source/cli/src/llm/cli-base.ts:206: the doc comment says an argument is read back unchanged by a shell, which holds for whitespace, quotation marks and empty values but not for cmd.exe metacharacters (& ^ | < > %) in an unquoted argument; its wrapping is broken mid-sentence. Read line 534/2 met: CHANGELOG 'The claude-code reviewer starts on Windows again. When yg started it through a shell, its empty arguments ... were dropped ... An argument that is empty, holds whitespace or holds a quotation mark is now quoted'. cbdc1d75c is a true update, not a weakened guard: the test still asserts the exact consumer set, and the two names added (cli/preamble, cli/tests/unit/support/formatters) match the two relations this branch added, each backed by a real import of LockedFileError.
  outside the issue, filed as 548: Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace but a cmd.exe metacharacter (& ^ | < > %), such as a gemini or codex policy path under a profile named R&D, is left unquoted and cmd splits or rewrites the line; and the binary itself is never quoted, so copilot-cli, which resolves a full .cmd path such as the npm folder under a profile with a space, is started through cmd.exe as a broken command. Read from the code, not run on Windows.

## Evidence

### Proof

- **ran (line 01c97de297d6):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts · **saw:** 11 passed; with the old cli-base.ts the 4 new 'arguments through a shell' tests (empty argument, quotation marks, whitespace, trailing backslash) failed, so red before and green after
- **ran (line 01c97de297d6):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/llm/cli-base-process.test.ts (tip dcc170cf5, in the dev container); then the same test file in a git archive of the tip with release/6.2.0's cli-base.ts put back · **saw:** tip: 11 of 11 passed; old cli-base.ts: the 4 'arguments through a shell' tests failed (empty argument, quotation marks, whitespace, trailing backslash). Red before, green after. The test runs the arguments through /bin/sh on Linux and is skipped on win32; cmd.exe is never exercised

### Notes

The worker was killed when the machine ran out of memory; seven uncommitted files stay in its worktree. A new worker resumes the lease.

Assumed: quoting also doubles backslashes before a quotation mark and at the end of a quoted argument (MSVCRT rules), so a path ending in a backslash keeps its closing quote

