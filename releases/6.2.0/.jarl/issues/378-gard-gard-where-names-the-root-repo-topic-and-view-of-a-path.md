# 378 · Gard: gard where names the root, repo, topic and view of a path

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, rig, workplace
**Files:** Gard/src/rig/where.mjs, Gard/test/where.test.mjs
**Repo:** ../../../Gard
**After:** 375
**Found by:** owner
**Where:** Mimir at 10257cd: the resolution of a path to an area and a repo by the longest prefix is the model; the agent's hooks call this on every event

## What
From any path: the nearest root (the rig, or a repository with its own environment, or none), the repo that contains the path, and when the path is inside .worktrees the topic and the view. JSON with --json. Fast enough for the hook path: it reads only the manifests on the way up and caches by their modification times.

## Why
Every guard, every gard run and every other tool asks this first; Mimir gives the agent its answer.

## Acceptance
- Tests cover a path in a repo of a rig, in a view of a topic, in the thin case, and outside any root
- A timing test keeps a warm call under a fixed budget declared in the code

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

