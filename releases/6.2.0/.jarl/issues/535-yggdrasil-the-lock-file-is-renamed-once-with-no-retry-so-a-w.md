# 535 · Yggdrasil: the lock file is renamed once with no retry, so a Windows EPERM ends a long check as an unclassified bug

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T0927-jedy
**Tags:** yggdrasil, lock, windows
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** source/cli/src/io/atomic-write.ts:309

## What
atomicWriteFileSync calls renameSync once. The async atomicWriteFile retries EPERM, EBUSY and EACCES for about 1.6 seconds, but the lock is written by the synchronous path (io/lock-store.ts:1095). On Windows a rename fails while another process holds the target open, and the check stops with 'The CLI encountered an error it does not classify'. A field report saw it with several runs in parallel and with one run in a checkout open in an editor.

## Why
The verdicts written so far stay, but a long run has to be restarted by hand, and the message calls a locked file a bug.

## Acceptance
[test] The synchronous rename retries EPERM, EBUSY and EACCES with growing delays, and a rename that keeps failing is reported as a locked file, not as an unclassified error · by: cd source/cli && npm test

## Evidence

