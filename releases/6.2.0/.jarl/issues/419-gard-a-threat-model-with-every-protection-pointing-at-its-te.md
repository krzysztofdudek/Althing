# 419 · Gard: a threat model with every protection pointing at its test

**Status:** dropped
**Kind:** docs
**Priority:** 2
**Tier:** strong
**Key:** 20261029T1428-obvx
**Tags:** gard, workplace, security
**Files:** Althing/research/gard-threat-model
**Repo:** ../..
**After:** 401, 406, 410
**Found by:** owner
**Where:** Mimir's first loop had the same issue for Mimir (M135); the design is research/2026-10-29-mimir-and-gard/gard-design.md

## What
A research folder on Gard's threats: what it holds (logins in tools containers, keys reached through the environment, the host's disk, the team's repositories), who could do harm (the author of a cloned rig or rule, a package running in a container, text an agent reads, the agent's own mistake), a table of protections each with the test that holds it in Gard's repository, and the plain statements: rules and guards of a cloned rig run without approval, hooks are rails and not guarantees (a failing or slow hook lets the call through), and a container is isolation for the host's disk, not a security boundary against hostile code. Known gaps are listed without tests.

## Why
A tool that runs other people's rules and touches team repositories must say honestly what it protects against and what not.

## Acceptance
- Every row of the table names a test file that exists in Gard and holds at least one test (the reviewer checks and records it)
- The three plain statements are present, and protections not yet built stand only in the list of gaps

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

