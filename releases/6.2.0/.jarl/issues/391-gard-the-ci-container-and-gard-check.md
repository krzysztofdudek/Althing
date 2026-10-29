# 391 · Gard: the CI container and gard check

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, container, tests
**Files:** Gard/src/check, Gard/test/check.test.mjs
**Repo:** ../../../Gard
**After:** 387
**Found by:** owner
**Where:** the owner, 2026-10-25: a shell needs its own container to run its CI, wider than the one the application has

## What
The shell declares checks (name, command, repo to run in); gard check runs them for a view in the shell's CI container, which is the application's container plus what the checks need (the architecture graph's tool, a browser for end-to-end tests). The same definition is usable in the shell's own CI. The answer gives each check's exit code and the time it took.

## Why
A shell's checks are what tells a user that the environment still works with the code; they must run the same locally and in CI.

## Acceptance
- A fixture shell with two checks, one failing, reports both with their exit codes, and gard check exits 1
- The CI container definition is generated from the same files as the application's plus the declared additions (a test compares them)

## Evidence

