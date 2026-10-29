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
**Where:** ruling git-through-gard; Mimir at 10257cd: the rule engine of its gate (src/hooks/git-gate-rules.mjs, git-gate-run.mjs, git-gate-diff.mjs and their tests); its stubs, chain mode and snapshot are not carried over

## What
gard commit [git commit's arguments] and gard push [git push's arguments] are the gate. Each finds the root and the repo with where, collects the rules (the rig's gate.rules and the list of rule directories other tools fill), and runs them: gard commit runs pre-commit on the staged changes and commit-msg on the message (taken from -m or -F, or written in the editor git would open, before git sees it), and then calls git commit -F with that message; gard push works out the pushed range from its arguments, runs pre-push and then calls git push. Where the root has a container, the final git call runs in it through gard run, so the team's own hooks find their tools. A block names the rule, its message and its fix and exits 1; --allow-once <rule> lets one call through and is for a person, never for an agent. Nothing is written into the code repository.

## Why
The owner, 2026-10-29: nothing is wedged into the application's repository; a git intermediary in the rig runs the rules, and plain git does the rest.

## Acceptance
- Tests: a blocking pre-commit rule stops gard commit with its message and fix and the index and working tree stay as they were; a commit-msg rule sees the message given with -m and with the editor; gard push hands the right range to a pre-push rule; with no rule blocking, git runs with the user's arguments
- In a repo with husky, the team's own pre-commit still runs once through the final git call; the repository's .git/hooks, core.hooksPath and info/exclude are byte for byte as before

## Evidence

Ruling ask-023 (ratify): Superseded: Krzysztof, 2026-10-29, chose that the gate runs through gard commit and gard push and nothing is installed into a code repository (ruling git-through-gard).

