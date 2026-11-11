# 627 · Yggdrasil: the dead-run cleanup of private reviewer folders can remove a live run's folder across containers that share a temporary folder and a hostname, and the fallback's transient wording depends on timing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1755-jnex
**Tags:** yggdrasil, reviewers
**Files:** 
**Repo:** Yggdrasil
**After:** 537
**Found by:** jarl
**Where:** rev-537b-opus, 537 round 2 (claude-code.ts:139-158 and :162; :224-233)
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


## Why
A sidecar, a pod's shared temp volume or a host-network container shares hostname and temp folder but not the process list, so a live review's folder is taken for dead and its key removed (fails closed as Not logged in); and in the fallback for older Claude Code the 'passes by itself' wording is chosen by re-reading a file other reviewers may be mid-writing.

## Acceptance
[test] A folder of a live run whose process is not in this run's process list (another container, same hostname, shared temp folder) is never removed, decided by something other than the process list, and in the fallback a parse failure under contention is classified the same on every run, each red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: a claude-code review is no longer signed out by another run's clean-up in a container that shares its temporary directory and hostname; each private folder has a lock beside it (yg-claude-config-….lock) that its run holds while it lives, and a folder is removed only when the lock is let go (without a lock, as on Windows, once it is a day old). A failure met while the user's configuration file was being written is offered a re-run every time.

## Evidence

### Proof

- **ran (line 26288f1cf91a):** cd source/cli && npx vitest run tests/unit/llm/claude-code-config.test.ts (before the fix) · **saw:** 3 failed, 12 passed: the folder of a live run whose process is not in this process list was removed (expected [true,true,true,true], got [false,false,true,true]); no lock answered for a review in flight; a parse failure met during a write was not marked momentary
- **ran (line 26288f1cf91a):** cd source/cli && npx vitest run tests/unit/llm tests/e2e/cli-reviewer-fill-runtime.test.ts tests/e2e/cli-llm-reviewer-mock.test.ts tests/unit/repo (after the fix, commit 1d0b41035) · **saw:** Test Files 45 passed (45), Tests 426 passed (426): the locked folder stays, the folders with a released lock and the old one without a lock go, the torn user file is momentary on 3 runs of 3
- **ran (line 26288f1cf91a):** two throwaway containers of the devcontainer image, same --hostname, one shared temp folder, a stand-in claude and no real home: run A reviews for 12s while run B starts and cleans up (before the fix) · **saw:** B removed A's folder; A ended with 1 failed: 'claude' exited with code 1: Not logged in: the configuration folder was removed under a live review
- **ran (line 26288f1cf91a):** the same two containers after the fix; then A killed with docker kill -s KILL mid-review and B run again · **saw:** A's folder and its .lock were still there after B ran, A ended 6 passed 0 failed, the temp folder was empty afterwards; after the kill, B removed A's folder and lock

### Notes

Assumed: the lock is a socket beside the folder that its run listens on, which the system closes however the run ends and which answers across containers on one host; where none can be held (Windows, a temp path too long for a socket) a folder is removed only after 24 hours, longer than any review. A temp folder shared between machines with the same hostname is not covered: a lock does not answer across machines. The earlier test of dead-run cleanup now gives its dead folders a released lock, because the process number no longer decides.

