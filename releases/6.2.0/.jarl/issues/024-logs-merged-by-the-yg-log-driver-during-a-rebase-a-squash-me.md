# 024 · Logs merged by the yg-log driver during a rebase, a squash merge or a merge with a conflict lose their baseline for good: yg check stops guarding append-only, and the next approve records a rewritten log

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/lock-store.ts, Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts, Yggdrasil/source/cli/src/cli/init-scaffold.ts, Yggdrasil/source/cli/src/core/check-log-state.ts, Yggdrasil/source/cli/src/core/log/log-gate.ts, Yggdrasil/docs/the-lock.md, Yggdrasil/docs/cli-reference.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/lock-store.ts:1225-1234 (mergeLeaf in mergeTwoLevels :1216 / mergeLockTexts :1124 returns undefined :1233 when both sides touched the log baseline); core/log/log-merge-resolve.ts:756-770 (only MERGE_HEAD and 'HEAD is a merge commit'; no REBASE_HEAD/ORIG_HEAD; :769 merge 'none'); cli/log.ts:503; cli/init-scaffold.ts:152-165, :227-254 (only the post-merge hook); core/check-log-state.ts:152 (`if (logBaseline) {` skips the check); core/log/log-gate.ts:149 (`if (!storedLog) return true;`)
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
When both sides touched a node's log baseline, the yg-lock driver removes the key (together with source), counting on `yg log merge-resolve` with no target to write it again. In these flows that does not happen. Reproduction (a fresh clone and npm @chrisdudek/yg@6.1.0, no reviewer; `yg init` configured both drivers, .gitattributes and .git/hooks/post-merge): two branches add an entry to the log of node app. Control A: rewriting the first entry on main with the baseline intact: FAIL error[log-integrity] prefix_modified. Control B: an ordinary merge with no conflict: the hook writes the baseline ('Verified …; baseline recorded.'), the rewrite is caught, and log-entry-missing demands an entry for the merge. Cases (in each, the lock ends with nodes.app = {}, and the yg-log driver merged log.md cleanly): (1) `git rebase main`: `yg log merge-resolve` says 'HEAD is not a merge commit and no merge is in progress — no log to reconcile.'; (2) `git merge --squash` + commit: the hook itself prints the same; (3) a merge stopped on a conflict in src/a.ts, resolved and finished with `git commit`: the hook does not run at all, although HEAD has two parents; (4) `git pull --rebase`: like (1). After rewriting 'initial entry' to 'REWRITTEN HISTORY', in all four `yg check` gives PASS with only the log-cycle-open warning, without log-integrity. In (1) and (3) `yg check --approve` records the rewritten log as the new baseline (PASS); restoring the true history is then reported as prefix_modified. The log gate additionally waives the entry due for the merge: in (3) the merged code gets only a warning, and approve closes the cycle without an entry. The manual remedies work (`yg log merge-resolve --node app --ours main --theirs ORIG_HEAD` after a rebase, a bare `yg log merge-resolve` on the merge commit with a conflict; after them the rewrite is caught and log-entry-missing comes back), but nothing runs them or points to them. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-21/logs/verify-lost-baseline.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-21/logs/verify-remedies.log (scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-21/scripts/).

## Why
A documented, enforced invariant (the log is append-only) switches off silently in everyday flows (rebase, pull --rebase, squash, every merge with a conflict in code) when two branches touched the log of the same node, and the next approve blesses the rewrite. docs/the-lock.md:179 and cli-reference.md:2514 promise that the hook writes the baseline again, and the-lock.md:151 promises prefix_modified until a squash or rebase is reconciled; with the driver nothing is reported and the user never reaches the remedy. The baseline sits in editable JSON, so it protects against accident, not against an adversary; git history is not lost.

## Acceptance
- The lock driver keeps the log baseline from the merge base instead of removing the key (the shared history is byte-identical, so it is a valid prefix of the yg-log driver's union), or yg check reports a log.md with history in the repo and no baseline and points to `yg log merge-resolve` with --ours/--theirs.
- Cases (1)-(4): rewriting the first entry after the merge gives error[log-integrity], and the entry due for the merge is required; rebase (a post-rewrite hook) and squash are handled or named in the message.

## Changelog
- Fixed: A log both branches added to stays protected after a rebase, a pull --rebase, a squash merge or a merge that stopped on a conflict: the lock merge driver keeps the baseline the two branches share instead of dropping it, so a rewrite of the shared history is still log-integrity and the next yg check --approve can no longer record a rewritten log; node logs and type decision logs alike.

## Evidence

jarl: option (a) — rebase, squash and a merge stopped on a conflict do not force a merge log entry of their own (only the log-cycle-open warning), which the documentation now says; enforcing it through yg check is new behaviour — an issue for 6.2

merged into release/6.1.1 at 387472893, gate green
- **ran:** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

