# 569 · Grain: the agent hooks are removed, with the code, tests and text that exist only for them

**Status:** in-progress
**Kind:** cleanup
**Priority:** 1
**Tier:** standard
**Key:** 20261111T1244-rtaa
**Tags:** grain, hooks
**Files:** Grain/plugins/grain/hooks, Grain/plugins/grain/hooks.json, Grain/plugins/grain/com.github.copilot, Grain/plugins/grain/engine, Grain/plugins/grain/skills/grain/SKILL.md, Grain/README.md, Grain/docs/reference.md
**Repo:** Grain
**Found by:** owner
**Where:**
**After:** 341
**Branch:** jarl/569-no-hooks
**Worker:** w-569-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 13:37

## What
On the owner's word (ruling grain-without-hooks) Grain stops registering hooks. Remove the hook files of every host (hooks/hooks.json, hooks/codex-hooks.json, hooks/cursor-hooks.json, hooks.json, com.github.copilot/hooks/hooks.json) and their manifest entries; the hook commands (session-context, check-hook, read-hook, check-hook --pre, commit-hook, edit-hook, how-hook) and the code only they use (the hook branches of engine/grain.mjs, hook-context.mjs, the hook parts of grain-session.mjs, the hook-started refresh and lock hand-over, placement feedback); their tests; and every sentence of the skill, README and docs that describes hooks. Code a command still uses moves out first (otherRepoOf and otherRepoRefusal used by grain check and explain). Add nothing in their place: no instruction to agents to call Grain anywhere.

## Why
The owner does not want Grain to speak to agents unasked, and code kept only for removed hooks is dead weight.

## Acceptance
[check] No hook is registered by any of Grain's plugin manifests, and no hook command remains in the CLI · by: cd plugins/grain && npm test
[test] Grain's full suite passes with Yggdrasil supplied after the removal, and every command and tool works as before · by: cd plugins/grain && npm test
[read] No skill, README or docs sentence describes a hook, and no text was added that tells agents to call Grain

## Evidence

