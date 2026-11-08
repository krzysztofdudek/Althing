# 374 · Gard: a test kit of fixture shells, bare origins, a fake Docker and recorded hook payloads

**Status:** dropped
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, foundation, tests
**Files:** Gard/test/helpers, Gard/test/fixtures
**Repo:** ../../../Gard
**After:** 369
**Found by:** jarl
**Where:** Mimir at 10257cd: test/helpers (fixture Desks, bare origins, fake forge) is the model

## What
Helpers that build, in a fresh temporary directory per test, a rig with nested repos at any depth and their bare origins, a repository with its own dev container and no rig, worktree views, and a home for Gard; a fake docker program that records its arguments and answers like the real one for the commands Gard uses; and recorded payloads of the agent tool's hooks (Claude Code first). Nothing touches the user's real home, real Docker or real repositories.

## Why
Every issue of Gard proves its acceptance with tests; without a shared kit each would build its own fixtures and they would drift.

## Acceptance
- A test builds a rig with repos at backend and own/api, clones them from bare origins and removes everything it made; another runs a command against the fake docker and reads back the recorded arguments
- A test fails if any helper writes under the real HOME (the helpers set HOME and GARD_HOME to the temporary directory)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

