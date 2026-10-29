# 402 · Gard: the git gate's engine moves from Mimir

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, git-gate, port
**Files:** Gard/src/gate, Gard/test/gate.test.mjs
**Repo:** ../../../Gard
**After:** 378
**Found by:** owner
**Where:** Mimir at 10257cd: src/hooks/git-gate*.mjs and src/commands/git-gate-*.mjs with their tests; the design is research/2026-10-29-mimir-and-gard/git-gate-design.md

## What
The gate's engine is copied from Mimir with its tests and renamed: plain stubs in .git/hooks; chain mode where a hook manager owns core.hooksPath (husky, lefthook), with core.hooksPath of the worktree pointing at Gard's directory, which runs Gard's rules and then the manager's hooks, and the entry in .git/info/exclude; the events pre-commit, commit-msg and pre-push; exit code 10 blocks and anything else passes; a snapshot of what is committed; gard gate allow --once for one commit on the user's word; linked worktrees and containers. Mimir keeps its copy until it resumes and removes it.

## Why
The owner, 2026-10-27: a commit in a code repository opened from a shell must be blockable by rules that live above it. The engine belongs with the shell; the rules stay with whoever writes them.

## Acceptance
- Every gate test of Mimir passes in Gard under Gard's names, in plain-stub mode and in chain mode with husky and with lefthook fixtures
- A blocked commit in a linked worktree leaves the index and the working tree as they were

## Evidence

