# 433 · Mimir drops what moved to Gard, and still works without Gard

**Status:** open
**Kind:** cleanup
**Priority:** 2
**Tier:** strong
**Tags:** mimir, workplace, port
**Files:** Mimir/src/hooks, Mimir/src/cleanup, Mimir/src/manifest/keys/container.mjs, Mimir/scripts/dx, Mimir/test/fixtures/owner-guards-module-copy
**Repo:** ../../../Mimir
**After:** 430, 431, 432, 395, 396, 397, 398, 401, 402, 407, 408, 412, 414, 415, 464, 465
**Found by:** owner
**Where:** Mimir at 10257cd: the gate engine (src/hooks/git-gate*), the cleanup of Docker and scratchpads (src/cleanup), the container key, the copy of the owner's guards module, the pair of branches and the tools container's pr-command; the owner's install runs the guards from the Desk today

## What
After the owner's setup runs Gard's guards and gate: Mimir's copies of what moved are removed (the gate engine, the guards module copy, the Docker and scratchpad parts of cleanup, the container key, the pair of branches, the tools container), and Mimir's own development runs through gard run instead of scripts/dx. Mimir keeps the area's exec hint, its worktrees and topics, its own cleanup of worktrees and products, and everything of knowledge. Tests prove Mimir alone still installs, answers context, searches, writes and finishes topics.

## Why
Two copies of one mechanism drift; the order (Gard first, then removal) keeps the owner's working install from breaking.

## Acceptance
- Mimir's suite passes with the removed modules gone and the graph covers every remaining file
- A test on a computer without gard runs init, context, search, write and topic finish

## Evidence

