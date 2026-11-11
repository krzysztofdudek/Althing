# 535 · Yggdrasil: the lock file is renamed once with no retry, so a Windows EPERM ends a long check as an unclassified bug

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T0927-jedy
**Tags:** yggdrasil, lock, windows
**Files:** Yggdrasil/source/cli/src/io/atomic-write.ts
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/io/atomic-write.ts:309
**Branch:** jarl/534-windows-spawn-and-lock
**Worker:** w-534b-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 09:46

## What
atomicWriteFileSync calls renameSync once. The async atomicWriteFile retries EPERM, EBUSY and EACCES for about 1.6 seconds, but the lock is written by the synchronous path (io/lock-store.ts:1095). On Windows a rename fails while another process holds the target open, and the check stops with 'The CLI encountered an error it does not classify'. A field report saw it with several runs in parallel and with one run in a checkout open in an editor.

## Why
The verdicts written so far stay, but a long run has to be restarted by hand, and the message calls a locked file a bug.

## Acceptance
[test] The synchronous rename retries EPERM, EBUSY and EACCES with growing delays, and a rename that keeps failing is reported as a locked file, not as an unclassified error · by: cd source/cli && npm test

## Changelog
- A file another program holds open on Windows no longer ends a long check as an unclassified error: the lock write retries with growing pauses, and a file that stays locked is reported as such.

## Reviews
- **changes** · by rev-534-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1024-blzi
  Important (535) source/cli/src/io/atomic-write.ts:298: the asynchronous write retries the whole temp-then-rename step, so after this change any EPERM, EBUSY or EACCES from the temp file's open (a read-only directory, a wrong owner after sudo, a CI checkout) is thrown as LockedFileError and rendered by the preamble as 'another program holds it open', with 'close whatever has the file open' as the next step and 'every verdict written before is kept' even for a portal, pack or graph-file write. Probe on Linux: atomicWriteFile into a 0555 directory waited 1601 ms and reported '<file> could not be written: another program holds it open (EACCES)'; the error's syscall was open on the .tmp file. The sync form, which retries only the rename, still reports the raw EACCES, so the two forms now disagree. The issue's line asks for a rename that keeps failing to be reported as a locked file; classify only a rename failure (err.syscall === 'rename') as a locked file, keep the open/write failure honest, and word why/next so that a persistent EPERM/EACCES (a read-only target on Windows, a permission on POSIX) is not asserted to be another program. Minor (534) source/cli/tests/unit/llm/cli-base-process.test.ts:73: the four new tests pass the quoted line through /bin/sh and are skipped on win32, and there is no Windows CI, so cmd.exe plus the MSVCRT parse the fix targets is never run; for the arguments yg actually passes (claude-code's two empty values and {"mcpServers":{}}, gemini and codex temp paths) a reading of cmd.exe's rules finds the quotes balanced and no metacharacter left outside them, and the field report confirmed the same quoting, so it is unproved here, not wrong. Minor (534) source/cli/src/llm/cli-base.ts:206: the doc comment says an argument is read back unchanged by a shell, which holds for whitespace, quotation marks and empty values but not for cmd.exe metacharacters (& ^ | < > %) in an unquoted argument; its wrapping is broken mid-sentence. Read line 534/2 met: CHANGELOG 'The claude-code reviewer starts on Windows again. When yg started it through a shell, its empty arguments ... were dropped ... An argument that is empty, holds whitespace or holds a quotation mark is now quoted'. cbdc1d75c is a true update, not a weakened guard: the test still asserts the exact consumer set, and the two names added (cli/preamble, cli/tests/unit/support/formatters) match the two relations this branch added, each backed by a real import of LockedFileError.
  outside the issue, filed as 548: Yggdrasil source/cli/src/llm/cli-base.ts: through a Windows shell, an argument with no whitespace but a cmd.exe metacharacter (& ^ | < > %), such as a gemini or codex policy path under a profile named R&D, is left unquoted and cmd splits or rewrites the line; and the binary itself is never quoted, so copilot-cli, which resolves a full .cmd path such as the npm folder under a profile with a space, is started through cmd.exe as a broken command. Read from the code, not run on Windows.

## Evidence

### Proof

- **ran (line 6d99f3e10a5a):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/io/atomic-write-sync-retry.test.ts tests/unit/io/atomic-write-retry.test.ts tests/unit/formatters/cli-preamble.test.ts · **saw:** 4 files 31 passed; with the old sources 5 of 6 sync-retry tests, the locked-file test of the async write and the preamble locked-file test failed, so red before and green after
- **ran (line 6d99f3e10a5a):** bash scripts/repo-check.sh (worktree tip), then the same on release/6.2.0 from git archive with its own npm ci; then vitest run --coverage on the tip · **saw:** tip: CLI tests 2 failed files (cli-own-graph-default-port, fixed in cbdc1d75c; cli-read-cost-bounds, exits 1 only while 6 reviewer pairs are open); coverage after the fix: branches 91.35%, lines 97.48%; Docs node_modules step fails in the worktree only (lockfile unchanged); Graph steps red only on the 6 open pairs; Portal Chromium steps fail on the release branch too; release branch: 5 other tests fail only because git archive has no .git
- **ran (line 6d99f3e10a5a):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/io/atomic-write-sync-retry.test.ts tests/unit/io/atomic-write-retry.test.ts tests/unit/formatters/cli-preamble.test.ts (tip dcc170cf5); then the first two in a git archive of the tip with release/6.2.0's atomic-write.ts and preamble.ts put back · **saw:** tip: all passed (31 with the 534 file); old sources: 5 of 6 sync-retry tests and the async locked-file test failed. Red before, green after. A probe outside the suite: atomicWriteFile into a read-only directory on Linux waits 1601 ms and throws LockedFileError 'another program holds it open (EACCES)', where the failing call was the temp file's open, not the rename

### Notes

Assumed: a write still refused after every retry throws LockedFileError (what/why/next), which the unexpected-error funnel renders as an environment problem; the sync and async writes share one retry table; the error carries its message structurally, so no new graph relation to the validation model

Open reviewer pairs for the host to fill (yg check --approve): silent-missing-files @ source/cli/src/io/atomic-write.ts; test-deterministic @ cli-own-graph-default-port.test.ts, cli-base-process.test.ts, cli-preamble.test.ts, atomic-write-retry.test.ts, atomic-write-sync-retry.test.ts

The jarl filled the six open reviewer pairs on the host (node source/cli/dist/bin.js check --approve: 6 passed, 0 refused, about 0.23 USD); yg check then printed PASS with 8249 pairs verified, and the verdicts are committed on the branch.

