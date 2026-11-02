# 370 · Gard: the platform layer on macOS, Linux and Windows

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, foundation, windows
**Files:** Gard/src/platform, Gard/test/platform.test.mjs
**Repo:** ../../../Gard
**After:** 366, 369
**Found by:** owner
**Where:** Mimir at 10257cd: src/platform (paths.mjs, process.mjs, atomic.mjs, runtime.mjs) and its tests; whether this moves to Runes is the research of issue 366

## What
Paths and the home of Gard (GARD_HOME, default ~/.gard, on Windows the user profile), running a program by its name with arguments and never through a POSIX shell, atomic writes of a file with retries on the errors Windows raises while another process holds it, and case-insensitive file systems. Taken from Runes or copied from Mimir with its tests, as issue 366 decides; the platform under test is injectable, so the Windows rules are tested on any system and also on a real Windows runner (issue of Windows).

## Why
Gard targets three systems from 1.0.0; every command that touches a file or starts a program goes through this layer, so its rules are written once.

## Acceptance
- Tests with an injected Windows platform cover the path rules, the program runner without a shell and the retries of an atomic write, and the same tests pass on macOS and Linux
- No module of Gard outside src/platform starts a program or writes a file directly (a test or a Yggdrasil rule says so)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

