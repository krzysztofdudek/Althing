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

## Evidence

### Proof

- **ran (line 6d99f3e10a5a):** cd source/cli && npx vitest run --maxWorkers=4 tests/unit/io/atomic-write-sync-retry.test.ts tests/unit/io/atomic-write-retry.test.ts tests/unit/formatters/cli-preamble.test.ts · **saw:** 4 files 31 passed; with the old sources 5 of 6 sync-retry tests, the locked-file test of the async write and the preamble locked-file test failed, so red before and green after

### Notes

Assumed: a write still refused after every retry throws LockedFileError (what/why/next), which the unexpected-error funnel renders as an environment problem; the sync and async writes share one retry table; the error carries its message structurally, so no new graph relation to the validation model

