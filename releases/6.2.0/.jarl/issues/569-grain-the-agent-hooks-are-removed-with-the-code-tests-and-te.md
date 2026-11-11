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

## Changelog
- Grain no longer registers hooks for Claude Code, Codex, Cursor or Copilot, so it answers only when you ask, through its commands and tools. The hook commands (session-context, check-hook, edit-hook, read-hook, how-hook, commit-hook), the environment settings GRAIN_REFRESH_RETRY_MS, GRAIN_REFRESH_WAIT_MS and GRAIN_UNWATCHED, and the placement-notes line in grain status are gone; GRAIN_HOOK_TTL_MS still sets how long a flagged deviation stays pending. Nothing in your repository turns red.

## Evidence

### Proof

- **ran (line 547f5ebce973):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at the tip of the branch) · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped; tests/portable-manifest.test.mjs 'no manifest registers a hook, and no hook file is shipped' passes; docs-audit and mcp-server parity pass with no hook command in the dispatcher or the command table
- **ran (line 3bd386f8b003):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at the tip of the branch) · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped (6 skips are Windows-only and case-insensitive-filesystem tests, none needing Yggdrasil)

### Notes

Assumed: docs/results.md and docs/validation.md keep their dated trial records (0.1.0 to 0.3.0: 'Trial 2 plus the post-edit check hook', 'the pre-write hook was silent on all fourteen writes'): they report what was measured then, not what Grain does now, and results.md calls itself the complete measurement record. Only the sentences that present hooks as a current feature were removed (results.md 'the edit-time hooks', validation.md 'The post edit hook is one warm check', mathematics.md 'the hooks' in the co-change reader list and one numeric-register row whose code was a hook branch).

Assumed: GRAIN_HOOK_TTL_MS keeps its name and meaning (how long a deviation check/review flagged stays pending), because grain check and review still use it for the check-feedback loop; renaming it would change what an adopter's setting does. Its docs row now says that.

Assumed: tests that drove a hook to prove a behavior check and review also have (data-grammar quote and file-name scoping, placement, pathsall, how's k>=2 filter, the renamed co-change partner) now run grain check or grain how on the same fixture and keep their assertions; hook-only tests and the hook parts of mixed tests were removed. One new test in portable-manifest.test.mjs pins that no manifest registers a hook and no hook file ships.

