# 464 · Gard guard direct-git: an agent's git commit and git push in a shell go through Gard

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1448-gjhh
**Tags:** gard, workplace, guards, git-gate, hooks
**Files:** Gard/src/guards/direct-git.mjs, Gard/test/guard-direct-git.test.mjs
**Repo:** ../../../Gard
**After:** 394, 402
**Found by:** owner
**Where:** ruling git-through-gard: the gate is gard commit and gard push, and nothing is installed in the code repository, so a plain git commit would skip the rules

## What
In a repo of a rig, an agent's git commit or git push (also through git -C, an alias or a shell chain) is refused, and the refusal gives the same call as gard commit or gard push with the agent's arguments. An agent's use of --allow-once is refused too: letting a rule through is the user's word. Every other git command passes.

## Why
Agents must not be able to skip the rules by calling git directly; a person's commit outside Gard is not gated, which the owner accepts.

## Acceptance
Tests refuse git commit -m, git -C <repo> commit and git push in a rig's repo with the right gard command, refuse an agent's --allow-once, and pass git status, git log and git commit outside any rig

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

