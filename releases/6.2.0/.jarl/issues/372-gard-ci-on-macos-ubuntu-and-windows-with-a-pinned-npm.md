# 372 · Gard: CI on macOS, Ubuntu and Windows with a pinned npm

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1425-kqiu
**Tags:** gard, workplace, foundation, windows
**Files:** Gard/.github/workflows
**Repo:** ../../../Gard
**After:** 368
**Found by:** owner
**Where:** the family's workflows pin npm since 6.1.0 (method of the release, A publishing workflow pins its npm)

## What
A workflow runs the check of Gard (the tests and yg check) on macOS, Ubuntu and Windows on every push to release/1.0.0 and on pull requests, with Node 22 and the newest Node, and npm pinned to an exact version. Docker-dependent tests run where the runner has Docker and are skipped with the reason where it does not. No job publishes, tags or releases anything.

## Why
Windows is in the target from 1.0.0 and was only ever tested on an injected platform in Mimir; a real runner is the first proof.

## Acceptance
- The workflow file passes a YAML parse test and names the three systems and a pinned npm
- A green run on the three systems is recorded once the branch is pushed on the owner's word; until then the evidence says the run has not happened

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

