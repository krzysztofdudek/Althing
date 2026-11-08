# 416 · Gard: the whole suite passes on a real Windows runner

**Status:** dropped
**Kind:** test
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, windows, tests
**Files:** Gard/test, Gard/.github/workflows
**Repo:** ../../../Gard
**After:** 372, 387, 394, 402
**Found by:** owner
**Where:** Mimir's Windows support was tested only on an injected platform, never on a real machine

## What
Gard's suite, its install and its hook entry run on the Windows runner of CI: paths, the program runner without a shell, gard commit and gard push, the shim on the PATH, the guards' reading of cmd and PowerShell, and the tests that need Docker (skipped with the reason where the runner has none). Every failure that only Windows shows is fixed or filed.

## Why
Windows is in the target of 1.0.0; a green injected platform proves the rules as written, not the system.

## Acceptance
A green CI run on Windows of the release branch's tip is recorded, with the number of tests run and skipped and the reason of each skip

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

