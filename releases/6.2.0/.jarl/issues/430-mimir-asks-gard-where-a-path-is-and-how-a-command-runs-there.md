# 430 · Mimir asks Gard where a path is and how a command runs there

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** mimir, gard, workplace, compatibility
**Files:** Mimir/src/context/exec.mjs, Mimir/src/hooks/header.mjs
**Repo:** ../../../Mimir
**After:** 426, 378, 387
**Found by:** owner
**Where:** Mimir at 10257cd: src/context/exec.mjs reads an area's exec prefix and the header tells the agent; nothing enforces it

## What
When Gard is installed, Mimir's context and the session header take the root, the view and the run prefix from gard where, so the agent hears one answer from both tools. Without Gard, Mimir keeps the area's exec declaration as a hint and enforces nothing. The one edge is Mimir to Gard; Gard never calls Mimir.

## Why
Two tools that tell an agent two ways to run a command would be worse than one.

## Acceptance
- With a fake gard on the PATH, the header names the view and gard run; without it, the header names the area's exec as before
- A compatibility test of the workspace runs Mimir's context against Gard's real where on a fixture rig

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

