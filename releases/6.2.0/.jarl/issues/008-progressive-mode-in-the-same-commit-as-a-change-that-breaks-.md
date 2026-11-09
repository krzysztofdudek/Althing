# 008 · Progressive mode: in the same commit as a change that breaks a rule, a branch can set progressive.reference to itself (HEAD or its own name), and the gate passes with an empty scope

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-jraw
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/progressive-scope-resolve.ts, Yggdrasil/source/cli/src/core/progressive-scope.ts, Yggdrasil/source/cli/src/core/progressive-preflight.ts, Yggdrasil/source/cli/src/io/config-parser.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/progressive-scope-resolve.ts:376 (`getMergeBase(projectRoot, 'HEAD', reference)`), :388 (changedFilesAgainst), :285/:463 (didConfigVocabularyMove); source/cli/src/core/progressive-scope.ts:605-606 (configVocabularyChanged only when yg-config.yaml is in the set), comment :1038-1044; source/cli/src/core/progressive-preflight.ts:265-266 (honest-empty); io/config-parser.ts ~628-670 (accepts any non-empty string)
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
The guard on a change of the block measures from merge-base(HEAD, NEW reference), and the new reference comes from the config being judged. When it resolves to HEAD, the merge base is HEAD, the change set contains only uncommitted changes (empty in CI), yg-config.yaml is not visible in it, didConfigVocabularyMove compares the config from HEAD with the working copy (identical), and the preflight classifies the state as honest-empty. Reproduction (npm yg 6.1.0, one script rule, no reviewer): main with progressive.reference: main, fully filled; one commit on feat writes BAD into src/a.ts (breaks the enforced rule no-bad) and changes the block to `reference: HEAD`; `yg check --approve --only-deterministic`, then `yg check --no-approve`: `PASS ... nothing in scope; 1 obligation outside your changes vs HEAD`, exit 0, with no note about the block change, with the false note 'stands on code this change did not touch'; `yg check --full`: FAIL, error[refused]. Controls: the reference left at main: FAIL; the same re-pointing to HEAD uncommitted: FAIL with the note 'reaches the whole project'; re-pointing to main~1: FAIL with a note; re-pointing to the branch's own name (`feat`): PASS, the same bypass. A realistic pipeline (a bare origin, origin/main as the reference, fresh clones with full history): a PR re-pointing to `origin/feat` or `HEAD` passes the measured leg, also as a GitHub-style merge commit. After the HEAD variant is merged, the `--full` leg on main is red, but every subsequent PR is measured against itself: a second PR with no config change, breaking src/b.ts, also passes with 'nothing in scope'. The comment in the code (progressive-scope.ts:1038-1044) names exactly this attack, and the unit tests (progressive-scope.test.ts:1238-1265) call the pure configVocabularyChanged with a base text that the integration path never supplies in this case. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-5/repro/head-commit.log (ci-head.log, ci-own-remote.log; controls keep.log, head-uncommitted.log, ancestor.log, own-name.log; scripts mk.sh, run.sh, ci.sh).

## Why
docs/progressive-mode.md: 'Changing the block costs one full run ... because a change that re-points the measurement could otherwise narrow the gate on its own authority.' This guarantee does not hold for a reference pointing at the branch itself, and after `reference: HEAD` is merged the PR gate is off for all subsequent PRs, with no note at all, until someone reverts the block.

## Acceptance
- A change of the progressive block is compared with the reference recorded before the change (e.g. the config at merge-base(HEAD, old reference) or the first-parent history from the old reference), not with the merge base of the new one; a commit re-pointing the reference to HEAD, its own branch name or origin/<working branch> answers for the whole project with a note.
- A reference resolving to HEAD or a descendant of it is rejected, with a fallback to the whole project and a note; an integration test for a committed re-pointing (HEAD and the branch's own name) gives FAIL in the scenario with BAD in src/a.ts.

## Changelog
- Fixed: A progressive.reference counted from the commit being checked (HEAD, @, HEAD~1, ...) makes every run answer for the whole project with a notice, and a commit whose reference resolves to itself is compared with the progressive block of each of its parents, so re-pointing the reference at its own branch in the commit that breaks a rule no longer passes. Re-pointing in one commit and breaking in a later one is still measured against itself until merged (yg check --full catches it); keep yg-config.yaml under code review.

## Evidence

orchestrator: Grain 196 (merged into Grain 6.1.1) says in the propose report that progressive mode starts once the adoption is committed on the local reference branch or after a merge into origin/<branch>. If 008 changes the behaviour of the reference (e.g. a repo with no remote, a reference relative to HEAD → the whole project), the worker of package 7 flags it in its report, so that Grain's sentence is corrected in the same release.

Ruling 008-skip-parent-without-graph: 008: when comparing the progressive block with the parents of HEAD, we skip a parent that has no yg-config.yaml (the commit/PR adding the first graph). This goes slightly beyond the scope of yggdrasil-scope, but it keeps the promise of progressive mode (adoption does not turn all the existing code red) and agrees with Grain's sentence in 196: 'progressive mode starts once the adoption is committed on the local reference branch, or merged into origin/<branch>'. A PR adding the first graph with a reference pointing at itself passes the measured step; --full still catches it.
- **ran (history):** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

Ruling ask-008 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

