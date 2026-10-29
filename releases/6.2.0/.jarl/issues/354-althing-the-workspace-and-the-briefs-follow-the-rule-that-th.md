# 354 · Althing: the workspace and the briefs follow the rule that the family leaves only code on the host

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace
**Files:** 
**Repo:** ../..
**Found by:** owner
**Where:**
**After:** 424, 425

## What
Under the ruling family-repos-through-gard, Althing itself breaks the rule today: its .cache holds about 590 MB (an old Grain gate build and Jarl probe folders), and the workspace design of 275 (W0) builds one tree per commit into .cache/trees on the host. The briefs send workers to worktree roots on the host and run tests on the host. Release work moves to Gard: the workspace's builds, trees and caches live in Gard's containers and volumes (issue 425), the briefs cut a worker's worktree as a Gard view and run every check through gard run (issue 424), and ws doctor reports anything a release left on the host.

## Why
The workspace is what runs every release; if it fills the host, every repository's container is undone by it.

## Acceptance
- 275 and the workspace build trees, clones and caches inside Gard's containers or on their volumes, never under the checkout or elsewhere on the host; ws doctor reports anything a release left on the host
- The worker, reviewer and merger briefs send workers to a Gard view and run every check through gard run
- method/environment.md states the rule once, and the release skill points to it
- After a full release rehearsal, gard verify host-clean lists nothing new in any family repository or in Althing, recorded as a row

## Evidence

