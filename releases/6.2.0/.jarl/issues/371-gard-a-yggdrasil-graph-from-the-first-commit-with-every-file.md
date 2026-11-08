# 371 · Gard: a Yggdrasil graph from the first commit, with every file mapped

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, foundation, yggdrasil
**Files:** Gard/.yggdrasil, Gard/package.json
**Repo:** ../../../Gard
**After:** 369
**Found by:** owner
**Where:** Mimir at 10257cd: its .yggdrasil graph and the test that blocks on yg check are the model; research/2026-10-29-mimir-and-gard/mimir-architecture.md

## What
Gard's architecture graph: a node per module of src (cli, errors, platform, rig, worktree, container, guards, gate, tools, drift, cleanup, plugin), types and relations that say which module may use which (the platform layer is the only one that starts programs and writes files), aspects for the rules every file keeps (code and comments in English, self-describing, pointing at nothing outside the repository; one registry of error codes), and full coverage of every file by wildcard mappings. yg is a devDependency at an exact version, and the repository's check runs yg check with the tests.

## Why
The owner keeps every repository in good shape with Yggdrasil from the start: the graph pulls the code into a clean layout and maps every file, so nothing grows outside it.

## Acceptance
- yg check passes with every file covered and the check of the repository fails when a new file is not mapped (a test or a recorded run)
- A deliberate import that breaks a relation (a guard writing a file directly) is reported by yg check

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

