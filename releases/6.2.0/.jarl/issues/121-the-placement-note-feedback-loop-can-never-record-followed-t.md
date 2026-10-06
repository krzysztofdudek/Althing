# 121 · The placement-note feedback loop can never record 'followed': the PostToolUse of the flagged Write itself settles it as 'deviated' before the corrective write arrives

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-session.mjs, Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-report.mjs, Grain/plugins/grain/tests/placement-feedback.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-session.mjs:222-224 (`if (rel === entry.badRel) { bumpOutcome(st2, 'deviated'); delete pending[k]; }`) in resolvePlacementPending (:208-232), called from the ordinary PostToolUse branch in grain.mjs:179 for the same Write whose PreToolUse recorded the entry (grain.mjs:149); the 'followed' branch :225-227; grain-report.mjs:74-77 (the status line). The test placement-feedback.test.mjs:89 goes Pre(bad), Pre(good)/Post(good) and skips Post(bad), which by its own line 75 always follows. The same resolvePlacementPending on release/6.1.1.
**Branch:** jarl/057-session-and-placement-truth
**Merged:** 6500847
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0; fresh clone of brocoders/nestjs-boilerplate @9620f15, `grain refresh`; a driver runs the exact commands from hooks.json through sh, with CLAUDE_PLUGIN_ROOT and payloads in Claude Code's shape):
1. PreToolUse Write src/auth/auth-change-email.dto.ts gives the note '`*.dto.ts` files named like `auth` live in `src/auth/dto/` — 6 of 9'; placement-pending.json: {"dto.ts#auth":{dir:"src/auth/dto",badRel:"src/auth/auth-change-email.dto.ts"}}.
2. The file is written, as always, because the hook does not block.
3. PostToolUse of the same Write: pending {} and placement-outcomes.json {"followed":0,"deviated":1}.
4. The agent follows the note: PreToolUse src/auth/dto/auth-change-email.dto.ts is silent, the file is written, PostToolUse finds nothing pending.
5. The misplaced copy is removed from the tree. The result stays {"followed":0,"deviated":1}, and `grain status` says 'placement notes followed: 0 of 1 (0%)'.

Control (a separate fresh clone, log 02): the flagged Write is denied, so it does not run and no PostToolUse arrives; the same corrective write then gives {"followed":1,"deviated":0}, and the status '1 of 1 (100%)'. So the suffix+token key does match the corrective write, and the only thing blocking 'followed' is the flagged Write settling the suggestion itself.

A natural fix through `mv` in Bash fires no Write PostToolUse at all; codex-hooks.json has the same pair of hooks, Pre/Post. A study in a private repository (§4-§6) reads {"followed":0,"deviated":2} as 'grain was correct and overridden', and its criterion for the reworded note is 'placement-outcomes.json shows followed ≥ 1', which this bug makes unreachable even when the agent follows the note. Distinct from 056 (there {"followed":0,"deviated":1} is a side effect of a wrong note under .yggdrasil/).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-5/logs/02-placement-followed-unreachable.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-57/logs/01-flow-flagged-write-then-corrective.log, control <the session scratchpad, since lost>/bughunt/grain/verify-57/logs/02-control-flagged-write-denied.log, refresh <the session scratchpad, since lost>/bughunt/grain/verify-57/logs/00-refresh.log.

## Why
docs/reference.md:176-182 and the comment at grain-session.mjs:150-163 say that a real 'followed' is a separate corrective write under a different path, and that the suffix+token key exists so that this write finds the first one's entry. The same text admits that the Pre and Post of one Write always see the same path and that the hook never blocks. Together this means that with allowed writes the documented 'followed' path is unreachable, so the rate in `grain status` is close to 0% by construction, and the measurement of placement-note effectiveness in Grain's research is worthless. Only the local self-measurement counter is wrong; the advice and the check results do not change.

## Acceptance
- The PostToolUse of a flagged Write does not settle the pending suggestion as 'deviated'; it is settled by a later write (a corrective one gives 'followed') or by the end of the session or the entry's expiry (which gives 'deviated').
- The flow from 01-flow-flagged-write-then-corrective.log (a flagged write, then a write to src/auth/dto/) ends with {"followed":1}, and `grain status` says 'placement notes followed: 1 of 1'.
- placement-feedback.test.mjs has Post(bad) between Pre(bad) and the corrective write.

## Changelog
- Fixed: grain status counted a placement note as ignored even when the agent then wrote the file where the note said; that now counts as followed.

## Evidence

- **ran:** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/placement-feedback.test.mjs (the test with Post(bad) between Pre(bad) and the corrective write, on release/6.1.1's grain-session.mjs, then on 312e808) · **saw:** before: pass 4, fail 2 — 'the flagged write's own PostToolUse settles nothing', actual { followed: 0, deviated: 1 }, expected null; after: pass 6, fail 0
- **ran:** verify-57 bin/flow.sh (exact hooks.json commands) on fresh clones of nestjs-boilerplate @9620f15 refreshed by each engine: release/6.1.1 (git archive) vs the branch (<the session scratchpad, since lost>/patch-611/grain-057/flow-121.log) · **saw:** before: after Post(bad) pending {} and outcomes {followed:0,deviated:1}; after the corrective write still {followed:0,deviated:1}; 'placement notes followed: 0 of 1 (0%)'. after: Post(bad) leaves pending {dto.ts#auth: … written:true}, outcomes empty; the corrective write to src/auth/dto/ settles {followed:1,deviated:0}; 'placement notes followed: 1 of 1 (100%)'
- **ran:** cd plugins/grain && npm test (branch tip 312e808, no YG_BIN) · **saw:** tests 1857, pass 1831, fail 0, skipped 26

docs: docs/reference.md: 'Placement feedback loop' — replace the sentences saying the same exact path can only complete as deviated and that a later write resolves it as deviated when the flagged path was written anyway, with: the flagged write itself only marks the suggestion written; a later write into the suggested directory resolves it as followed; a written suggestion no such write resolves before it expires (GRAIN_HOOK_TTL_MS) counts as deviated, settled at the next write hook; one whose write never landed counts as nothing. Store layout, placement-pending.json line: '(a written one counts as deviated when it expires after GRAIN_HOOK_TTL_MS)'

jarl: a newer hint with the same key replaces the stored one, and the stored one's outcome is lost — accepted (better to lose it than to guess)
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1857, pass 1856, fail 0, skipped 1, merge 6500847

