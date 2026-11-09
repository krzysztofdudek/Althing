# 392 · Gard: gard verify host-clean proves a command left nothing on the host

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1426-oozc
**Tags:** gard, workplace, container, tests
**Files:** Gard/src/verify/host-clean.mjs, Gard/test/verify-host-clean.test.mjs
**Repo:** ../../../Gard
**After:** 387
**Found by:** owner
**Where:** the acceptance of issues 346 to 354 checks git status --ignored on the host by hand

## What
gard verify host-clean -- <command> records git status --ignored of every repo of the root and the listing of declared host directories, runs the command through gard run, and reports every path that appeared, outside the empty mount points. Usable as the acceptance of any issue that must leave the host clean.

## Why
Leaving only code on the host is a rule every family repository now follows; it needs one check that anyone can run.

## Acceptance
A command that writes a file into a checkout is reported with that path, and one that writes only into volumes reports nothing

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

