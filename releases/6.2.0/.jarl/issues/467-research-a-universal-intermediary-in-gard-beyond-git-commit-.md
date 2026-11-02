# 467 · Research: a universal intermediary in Gard, beyond git commit and git push

**Status:** deferred
**Kind:** research
**Priority:** 2
**Tier:** strong
**Tags:** gard, workplace, git-gate, guards, needs-owner
**Files:** Althing/research/gard-universal-intermediary
**Repo:** ../..
**After:** 402
**Found by:** owner
**Where:** the owner, 2026-10-29 (translated from Polish): make a universal proxy, not only git push or commit, to be thought through; ruling git-through-gard makes Gard the intermediary of two git operations, and gard run already stands between the user and every command of a project

## What
A consideration to talk through with the owner first (ruling progressive-rule-changes-to-discuss). The agent who reaches it prepares a design pass on one rule mechanism for everything Gard stands in front of, and brings it to the owner before anything is filed or built. Two readings to weigh: every git operation through Gard (checkout, switch, merge, rebase, reset, clean, stash, branch deletion, worktree, fetch and pull), each with events rules can answer, so that operations that lose someone's work can be stopped or confirmed the way Mimir's git runner refuses destructive calls by name; and any command a rig runs through gard run (an install, a publish, a migration, a deploy) as an event rules can answer before and after it runs. For each: what it would protect, what it would cost in speed and in getting in the way, how the direct-git guard and the agent's hooks would follow, what a person outside Gard can still do, and whether it fits Gard 1.0.0 or comes after.

## Why
The owner wants Gard's intermediary to be general rather than two special cases, but asked for it to be thought through before it is built.

## Acceptance
- A research folder with Question, Method, Status and Conclusion compares the two readings with what each protects and costs, and lists the operations and commands it would cover
- The owner's decision on scope is recorded as a ruling, and the issues it produces name their After edges

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

