# 408 · Gard: pull requests are opened through the command and the place a setting names

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261029T1428-jtpy
**Tags:** gard, workplace, identities, port
**Files:** Gard/src/tools/pr.mjs, Gard/test/pr.test.mjs
**Repo:** ../../../Gard
**After:** 407
**Found by:** owner
**Where:** Mimir at 10257cd: the pr-command setting (src/write/pr.mjs, src/config.mjs)

## What
A setting gives the command that opens a pull request (gh, az repos, glab or another, with placeholders for branch, base, title and body) and where it runs (the host, or a named tools container). Gard and any tool that calls it never assume one forge.

## Why
The owner, 2026-10-27: a pull request may only be openable in the container where the company's gh is signed in, and not every company uses GitHub.

## Acceptance
Tests with a fake forge command run it on the host and in a tools container with the placeholders filled, and a missing setting answers with its fix

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

