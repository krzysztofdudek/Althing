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

## Reviews
- **changes** · by rev-568-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1434-fnag
  Important (569 line 3, docs/validation.md:44): the Trial 3 paragraph still says, in the present tense, that both faults 'are fixed in the released build' and that the notes 'now arrive before it, on the PreToolUse hook'. That sentence describes a hook as something Grain does today, and after this change it is false. It needs the past tense of a dated record (what the 0.3.0 build did), or to go. The other dated trial lines in docs/results.md (180, 258) and docs/validation.md (33, 37) only report what was measured then; keeping them is right, removing them would falsify the record. | Minor (plugins/grain/tests/portable-manifest.test.mjs:32): the new guard reads the six plugin manifests but not the four marketplace files at the repository root, where a plugin entry can also carry hooks; tried by reading: a 'hooks' key added to one of them would pass the test. Today none has one. | Minor, known limitation (docs/reference.md:244, plugins/grain/engine/grain-session.mjs:28): GRAIN_HOOK_TTL_MS keeps a name that mentions hooks; it is still read by check and review for the pending deviations, and renaming it would silently drop an adopter's setting, so keeping it is the right call. | Checked and found sound: no manifest, hook file, engine branch, store file, skill, README, CLAUDE.md or reference sentence registers, starts or documents a hook; the diff adds no sentence that tells an agent to call Grain (every prose change is a removal or a narrowing; the skill's 'start every task by calling grain_how yourself' is gone too); the seven hook commands answer 'unknown command'; check and explain still refuse a file of a nested repository with the same sentence (otherRepoOf and otherRepoRefusal moved to grain-context.mjs unchanged); the converted tests (check-change-attribution, data-grammar scoping, placement, placement-graph-paths, pathsall-widening, how-places-weighting, cochange-follows-renames, indexed-unclassified-scopes, check-sibling-own-data) keep the assertions of the hook tests they replace on grain check or grain how, and what was dropped asserted only hook envelopes, repeat suppression or the session text; store-lock.mjs lost only the hand-over branch and the longer wait, both reachable only from a hook-started refresh. 568: the two agent-author tests are gone, the five remaining exemplar tests pass, fixtures commit as Dev. Full suite at 49d509e0: 2184 tests, 2178 pass, 0 fail, 6 skipped. Two commits, one per issue, each naming its issue; the changelog entry is on the issue.
  outside the issue, filed as 596: Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (engine/grain.mjs, the default of the dispatcher runs after ensureFresh). A host that still calls a removed hook command, from a registration of its own or a stale copy, now pays a full build on each call and gets exit 1. The refusal belongs before the index is touched.

## Evidence

### Proof

- **ran (line 547f5ebce973):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at the tip of the branch) · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped; tests/portable-manifest.test.mjs 'no manifest registers a hook, and no hook file is shipped' passes; docs-audit and mcp-server parity pass with no hook command in the dispatcher or the command table
- **ran (line 3bd386f8b003):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at the tip of the branch) · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped (6 skips are Windows-only and case-insensitive-filesystem tests, none needing Yggdrasil)
- **ran (line 547f5ebce973):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at 49d509e0); then on a scratch repository: grain check-hook, check-hook --pre, session-context, edit-hook, read-hook, how-hook, commit-hook · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped; 'no manifest registers a hook, and no hook file is shipped' passes; each of the seven hook commands answers 'unknown command' with exit 1; no file under the repository outside the stress oracle and the dated records names a hook file or registers one
- **ran (line 3bd386f8b003):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test (YG_BIN set; at 49d509e0); then on a scratch repository with a nested repository: grain status, grain check and grain explain on a file of the nested repository · **saw:** 2184 tests, 2178 pass, 0 fail, 6 skipped (the worker's numbers); status answers and the store holds no hook file; check and explain refuse the nested file with the same sentence as before, exit 1

### Notes

Assumed: docs/results.md and docs/validation.md keep their dated trial records (0.1.0 to 0.3.0: 'Trial 2 plus the post-edit check hook', 'the pre-write hook was silent on all fourteen writes'): they report what was measured then, not what Grain does now, and results.md calls itself the complete measurement record. Only the sentences that present hooks as a current feature were removed (results.md 'the edit-time hooks', validation.md 'The post edit hook is one warm check', mathematics.md 'the hooks' in the co-change reader list and one numeric-register row whose code was a hook branch).

Assumed: GRAIN_HOOK_TTL_MS keeps its name and meaning (how long a deviation check/review flagged stays pending), because grain check and review still use it for the check-feedback loop; renaming it would change what an adopter's setting does. Its docs row now says that.

Assumed: tests that drove a hook to prove a behavior check and review also have (data-grammar quote and file-name scoping, placement, pathsall, how's k>=2 filter, the renamed co-change partner) now run grain check or grain how on the same fixture and keep their assertions; hook-only tests and the hook parts of mixed tests were removed. One new test in portable-manifest.test.mjs pins that no manifest registers a hook and no hook file ships.

