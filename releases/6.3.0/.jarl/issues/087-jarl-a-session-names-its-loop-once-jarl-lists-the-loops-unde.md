# 087 · Jarl: a session names its loop once, Jarl lists the loops under a project, and a call that names none where the choice is not obvious is refused with the list

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-routing
**Where:**

## What
The owner: a loop lives in an area (a topic, a repository); the skill should route and the tool should tell the agent what it needs. Built: every call takes root, else JARL_ROOT, else the loop at the project's root, never one below (scripts/jarl-mcp.mjs:176-191).

## Why
Passing root on every call is the agent's burden, and forgetting it reaches the wrong loop or none.

## Acceptance
- use <path> sets the loop a session's calls reach until changed; the CLI honours JARL_ROOT as today
- Jarl lists the loops under a project by a bounded walk (no node_modules, .git, worktree directories or vendored copies; a stated depth)
- Where the project has a root loop it stays the default and a note names the others; where it has none and several below, a call that names none is refused with the list
- Tests for each

## Evidence

