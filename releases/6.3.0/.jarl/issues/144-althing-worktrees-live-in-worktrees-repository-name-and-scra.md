# 144 · Althing: worktrees live in ~/Worktrees/<Repository>/<name> and scratch in the system temporary directory, as the host's rules say: defaults, docs and skills follow

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** host-rules
**Files:** Althing/workspace/lib/local.mjs, Althing/workspace/ws.mjs, Althing/workspace/test/ws.test.mjs, Althing/workspace/test/brief-worktree.test.mjs, Althing/method/environment.md, Althing/method/loops.md, Althing/method/rulings.md, Althing/AGENTS.md, Althing/CLAUDE.md, Althing/.claude/skills/releasing-the-family/SKILL.md, Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/.claude/skills/family-workspace/SKILL.md, Althing/releases/6.3.0/briefs/worker-jarl.md
**Repo:** ../..
**After:** 143
**Found by:** jarl
**Where:** grep -rn '.jarl-wt\|Temp/tmp' method .claude AGENTS.md CLAUDE.md workspace
**Branch:** jarl/143-host-worktree-place
**Merged:** ec56666 in ../..
**CI:** none

## What
The host's rules (WorkspaceSetup, 2026-11-04, ~/.claude/CLAUDE.md) decide where working copies and temporary files live, and they stand over Althing's method and Jarl's habits: worktrees of every repository under ~/Worktrees/<Repository>/<name> (a finished one is removed at once with its branch), temporary files and test TMPDIR in a mktemp -d folder under the system temporary directory, never a folder in the home. Althing still says ~/.jarl-wt/<Repo>-<NNN> (method/environment.md lines 33-47, method/loops.md:29, the skills, AGENTS.md line 112, CLAUDE.md line 9), ~/Temp/tmp/<agent> for test TMPDIR (method/environment.md:47), 'worktrees-outside-tmp' in method/rulings.md names the old place, and ws.mjs and workspace/lib/local.mjs default the worktree root to ~/.jarl-wt; the worker brief template names the layout through {{wt:...}}/<Repo>-<NNN>.

## Why
A worker or a merger reading Althing's method creates its working copy in a place the host removes or flags, and scratch in a place the host no longer allows.

## Acceptance
- method/environment.md, method/loops.md, AGENTS.md, CLAUDE.md and the three skills say that the host's rules decide where worktrees and temporary files live, and name ~/Worktrees/<Repository>/<name> and a mktemp -d folder under the system temporary directory
- ws.mjs and workspace/lib/local.mjs default the worktree root to ~/Worktrees, the worktree layout is <root>/<Repository>/<name> in the brief renderer and the workspace tests, and ws doctor checks it
- method/rulings.md keeps the owner's words of worktrees-outside-tmp untouched and points to a new ruling of the open loop that places worktrees under ~/Worktrees by the host's rules; the ruling is recorded with ws jarl decide, by jarl, citing the host's rules
- No file outside the records of closed or historical loops names ~/.jarl-wt or ~/Temp/tmp as a place to use

## Evidence

- **ran:** npm test at the root of Althing main, at ec56666 with 143 and 144 merged · **saw:** tests 100, pass 100, fail 0
- **ran:** grep -rIn '.jarl-wt\|Temp/tmp' over method, .claude, AGENTS.md, CLAUDE.md, workspace and the 6.3.0 plans and briefs, after the follow-up commit; npm test at the root · **saw:** only the owner's historical rulings, their pointer lines and the workspace's old-place handling remain; tests 100, pass 100, fail 0

