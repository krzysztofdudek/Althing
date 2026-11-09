# 067 · The documented recipe 'Reverting a change you regret' (yg knowledge read log-management) breaks log integrity and ends `yg check --approve` in the ABORTED state

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0754-gkyp
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/templates/knowledge/log-management.ts, Yggdrasil/source/cli/src/templates/knowledge/verification-and-lock.ts, Yggdrasil/docs/the-lock.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/templates/knowledge/log-management.ts:248-266 ('Reverting a change you regret': `git checkout HEAD~1 -- src/file.ts .yggdrasil/model/<path>/log.md`), contradicting the same topic at :246; the same recipe in verification-and-lock.ts:451-457 ('Reverting a node') and docs/the-lock.md:139 ('reverting the source *and* the log together'); integrity works as designed: src/core/log-integrity.ts:35-49 (validateAppendOnly) returns boundary_missing
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
A log_required type, a node with a script rule. Commit 1: entry A, `yg check --approve`. Commit 2: a source change, entry B, `yg check --approve`; the committed baseline in yg-lock.logs.json is entry B's datetime. The recipe verbatim, as `yg knowledge read log-management` prints it from the installed CLI (npm @chrisdudek/yg@6.1.0, a fresh v6.1.0 clone for the code): `git checkout HEAD~1 -- src/file.ts .yggdrasil/model/billing/log.md` exit 0; `yg log add --node billing --reason "Tried X, reverted because Y"` exit 0; `yg check --approve` → `ABORTED nothing ran — 1 problem must be fixed first`, `error[log-integrity] Log integrity broken (boundary_missing)`, exit 1; a plain `yg check` fails the same way (plus an unverified pair). The fix the CLI gives (`git checkout HEAD -- log.md`) restores the regretted entry B and throws away the new entry about the revert, and the next `yg check --approve` aborts with log-entry-missing: the agent is red twice and needs two steps the documentation does not know. With log_required: false, the same (every full approve records the baseline of the newest entry). Scenario C: revert only src/file.ts, `yg log add --supersedes <B>`, `yg check --approve` → PASS, then `yg check` PASS. Control: without the closing approve in commit 2 the baseline stays at A and the recipe passes, so it works only in the window before the baseline is recorded, which the recipe does not mention; the ordinary documented flow (approve, then commit) always fails. Rejected part of the report: that `yg log add` should refuse to append to a broken log as the type-log path does; this asymmetry is deliberate (adding a node entry does not record a baseline, and the next yg check catches the broken log anyway). The recipe comes from the content-addressed lock refactor (3d0aa775), from before the baseline in the committed lock; origin/main 2493aa16 unchanged. This is not 311 from 6.1.0 nor 024 here. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-35/logs/verify-revert-recipe.log, control <the session scratchpad, since lost>/bughunt/yggdrasil/verify-35/logs/verify-revert-recipe-window.log, scripts in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-35/scripts/; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-revert-recipe.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/revert-recipe.sh.

## Why
A basic flow documented in three places always ends in ABORTED in the normal way of working, and an agent follows the recipe verbatim; the topic contradicts itself (l.246 versus l.248-266), and the fix the CLI suggests silently loses the revert entry. The tool fails safe (nothing breaks, the git history stays), so not a blocker.

## Acceptance
- log-management.ts ('Reverting a change you regret'), verification-and-lock.ts ('Reverting a node') and docs/the-lock.md:139 say: revert the source alone with git, log.md only appended to, the revert recorded with `yg log add --supersedes <the regretted entry>` before `yg check --approve`; this recipe followed verbatim after a full approve and a commit ends in `yg check` PASS (an e2e test of scenario A).
- No knowledge topic or document tells you any more to restore log.md with git checkout after the baseline is recorded.

## Changelog
- Fixed: The documented way to revert a change you regret (yg knowledge read log-management, verification-and-lock, the lock guide) no longer restores log.md from git, which after a full yg check --approve ended in ABORTED on log-integrity; it reverts the source only and records the revert with yg log add --supersedes <the regretted entry>, then yg check --approve.

## Evidence

merged into release/6.1.1 at 387472893, gate green
- **ran (history):** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

