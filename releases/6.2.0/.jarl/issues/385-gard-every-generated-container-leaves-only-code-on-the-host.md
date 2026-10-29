# 385 · Gard: every generated container leaves only code on the host

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, container
**Files:** Gard/src/container/host-clean.mjs, Gard/src/container/post-start.mjs, Gard/test/container-host-clean.test.mjs
**Repo:** ../../../Gard
**After:** 384
**Found by:** owner
**Where:** ruling family-repos-leave-only-code-on-host and the pattern of issue 346

## What
The generated container puts a named volume over every directory its tools write under a checkout (those the rig declares and the usual ones of each package manager and test runner it detects), sets the package manager's cache and TMPDIR inside the container, runs a post-start step that empties the temporary folder, chowns every volume to the container's user, and runs commands as that user. A directory a build deletes and re-creates is not made a mount point, and the answer says which one it skipped.

## Why
The owner's rule: the host keeps the code and nothing else; every family repository and every rig is built that way.

## Acceptance
- In a fixture rig with a Node repo, npm ci, npm test and a build through gard run leave git status --ignored on the host with nothing new but the empty mount points
- Removing the view's container and volumes leaves nothing of it on the host

## Evidence

