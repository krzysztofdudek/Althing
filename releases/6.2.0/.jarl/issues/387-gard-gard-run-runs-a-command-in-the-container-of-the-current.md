# 387 · Gard: gard run runs a command in the container of the current root or view

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, container
**Files:** Gard/src/container/run.mjs, Gard/test/run.test.mjs
**Repo:** ../../../Gard
**After:** 379, 385, 386
**Found by:** owner
**Where:** Mimir at 10257cd: scripts/dx run and run --in a worktree are the model; the owner's way of working: the session runs on the host, every command of the project runs in its container

## What
gard run [--view <v>] -- <command> finds the root and view of the current directory (or the named view), builds and starts their container when it is not running, and runs the command in it as the container's user, in the directory that matches the current one, with the exit code, stdout and stderr passed through and signals forwarded. The command is passed as arguments, never through a shell string. A root without a container answers with the fix.

## Why
This is the one way a command of a project runs, for a person, an agent, Mimir and Althing's workspace alike.

## Acceptance
- Tests against the fake docker check the container chosen for a repo, for a view and for a nested directory, the working directory inside, the user and the exit code
- A test with real Docker, skipped with the reason where Docker is missing, runs node --version in a fixture shell and gets the container's version

## Evidence

