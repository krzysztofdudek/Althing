# 083 · After a successful `yg adopt --replace` the old graph moved aside to .yggdrasil.replaced-<ts>/ is read as source code: with coverage.required "/" the next `yg check` (the command adopt gives as next) fails on the old graph's files

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-fxhg
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/adopt-transaction.ts, Yggdrasil/source/cli/src/cli/adopt.ts, Yggdrasil/source/cli/src/io/repo-scanner.ts, Yggdrasil/source/cli/tests/e2e/cli-adopt.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/adopt-transaction.ts:31 (REPLACED_DIR_PREFIX = '.yggdrasil.replaced-') and :388-391 (rename of <repoRoot>/.yggdrasil to a sibling at the repo root); io/repo-scanner.ts:163 (collectFiles skips only an entry named exactly '.yggdrasil' at the project root); walkForNestedProjectRoots (~:334) treats a directory as a separate project only with a `.yggdrasil` or `.git` subdirectory, and the copy holds the graph files directly; isCoverageExcludedPath :439 knows only '.yggdrasil'; adopt writes only .yggdrasil/.gitignore lines, which do not reach the sibling; adopt.ts:410 'delete it once you are satisfied', then `next: yg check`
**Branch:** jarl/066-nested-roots
**Merged:** d36a5835b9c2346f83ed8f97a55134c008074472
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0 and a fresh clone of main 2493aa16 built with tsup, both identical; custom scripts): a graph with one node mapping src/a.ts and coverage.required ["/"], `yg check` PASS '1/1 file covered'. A copy of the graph as a separate proposal with a changed description, `yg adopt ../proposal --replace`: exit 0, 'Previous graph kept at .yggdrasil.replaced-<ts>/ — delete it once you are satisfied' and 'next: yg check'. The next `yg check`: 'FAIL error[unmapped] 7 files belong to no node' with the copy's files (.gitignore, .gitkeep, model/core/yg-node.yaml, yg-architecture.yaml, yg-config.yaml), exit 1, with the advice 'create nodes for active areas first'; `yg context --file` on a file of the copy says to add it to a node's mapping. `git status` shows 7 untracked files, and `git check-ignore` matches nothing, so `git add -A` would commit the old graph (the old graph's cache files are hidden only by its own copy of .gitignore). Control: moving the copy outside the repo (mv) restores PASS. With init's default required: [] the same files are a non-blocking warning[uncovered], exit 0. With the proposal in the documented .yggdrasil-proposal/ inside the repo, the proposal is skipped as a nested project, but the copy after adopt is flagged anyway. e2e test 4 in tests/e2e/cli-adopt.test.ts (~l.195) checks that the copy exists but does not run `yg check` afterwards. docs/cli-reference.md (yg adopt, step 1) says only that the old graph 'goes to `.yggdrasil.replaced-<timestamp>/` at the repository root'. This is not 002 nor 034 here; the `.replaced-*` exception in the package store (334 from 6.1.0, 030 here) is a different mechanism. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-53/logs/adopt-replace-npm610-required-slash.log, adopt-replace-npm610-required-empty.log, adopt-replace-main2493aa16-required-empty.log, adopt-replace-inrepo-proposal-v2-npm610.log (adopt-replace-inrepo-proposal-npm610.log is an invalid run); scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-53/repro/ (adopt-replace-backup.sh, adopt-replace-inrepo-proposal-v2.sh, yg-main.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/logs/f5-adopt-replace-backup.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/repro/f5-adopt-replace-backup.sh.

## Why
The adopt step itself turns a passing repo red on the very next command it gives, the repair advice points the wrong way, and the old graph stays unignored by git. It blocks only with coverage.required "/" (or with no coverage block, where the default is ["/"]), and adopt names the directory and says to delete it, so minor.

## Acceptance
After `yg adopt <proposal> --replace` in a graph with coverage.required ["/"], the next `yg check` passes: .yggdrasil.replaced-* is excluded from the coverage walk like .yggdrasil (or the copy lies outside the walk) and is ignored by git; e2e test 4 in cli-adopt.test.ts runs `yg check` after --replace.

## Changelog
- Fixed: The graph yg adopt --replace moves aside (.yggdrasil.replaced-<timestamp>/) is left out of yg check like .yggdrasil/, and the clone's .git/info/exclude ignores it, so the next yg check passes under coverage.required ["/"] and git add -A never commits it.

## Evidence

- **ran (history):** git commit (merge of jarl/066-nested-roots into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.41%; [repo-check] All checks passed; [release/6.1.1 d36a5835b] Merge jarl/066-nested-roots

