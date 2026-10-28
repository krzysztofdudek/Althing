# 354 · Althing: the workspace and the briefs follow the rule that the family leaves only code on the host

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../..
**Found by:** owner
**Where:**

## What
Under the ruling family-repos-leave-only-code-on-host, Althing itself breaks the rule today: its .cache holds about 590 MB (an old Grain gate build and Jarl probe folders), and the workspace design of 275 (W0) builds one tree per commit into .cache/trees on the host. The briefs send workers to worktree roots on the host and run tests on the host. Release work moves into the repositories' dev containers: builds, clones and caches on container volumes, workers in clones on a volume (issue 346's pattern).

## Why
The workspace is what runs every release; if it fills the host, every repository's container is undone by it.

## Acceptance
- 275 and the workspace build trees, clones and caches inside a container or on its volumes, never under the checkout or elsewhere on the host; ws doctor reports anything a release left on the host
- The worker, reviewer and merger briefs send workers to a clone on a volume in the repository's container and run every check there
- method/environment.md states the rule once, and the release skill points to it
- After a full release rehearsal git status --ignored on the host lists nothing new in any family repository or in Althing, recorded as a row

## Evidence

