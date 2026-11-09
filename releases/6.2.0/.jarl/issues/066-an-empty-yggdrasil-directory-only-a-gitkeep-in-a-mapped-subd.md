# 066 · An empty `.yggdrasil/` directory (only a .gitkeep) in a mapped subdirectory silently takes that subtree out of the parent graph's mapping, coverage and rules; yg check and the CI gate are green

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-rmfx
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/repo-scanner.ts, Yggdrasil/source/cli/src/io/paths.ts, Yggdrasil/source/cli/src/core/checks/mapping.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/repo-scanner.ts:334-337 (walkForNestedProjectRoots: a directory with a `.yggdrasil` for which directoryHasAnyFile :404 returns true is a nested project; any file is enough, including an untracked and gitignored one, because the walk ignores .gitignore); for comparison, isGitBoundary :387-394 requires a populated directory or a valid `gitdir:` pointer; legacy excludeNestedGraphSubtrees :200-210; io/paths.ts:20-44 findYggRoot accepts any `.yggdrasil` directory; core/checks/mapping.ts:612-614 (mapping-path-missing does not name the root that cut the files off)
**Branch:** jarl/066-nested-roots
**Merged:** d36a5835b9c2346f83ed8f97a55134c008074472
**CI:** none

## What
Node pay maps src/pay/ with an enforced script rule no-bad; coverage.required: ["src/"]; src/pay/sub/b.ts contains BAD. Control: `FAIL ... 2/2 files covered · 4 excluded`, `error[refused] ... src/pay/sub/b.ts:1`, exit 1. After committing an empty `src/pay/sub/.yggdrasil/.gitkeep` (no yg-config.yaml): `yg check --approve --only-deterministic` and `yg check --no-approve` give `PASS 1 node · 1/1 file covered · 4 excluded · 1 pair verified`, exit 0, an empty issues list in JSON; `yg context` and `yg owner` say of b.ts 'excluded from graph coverage by design ... a nested .yggdrasil/ graph', `yg context --node pay` lists only a.ts; a fresh clone acting as CI is green too. From inside src/pay/sub, `yg check` fails with `config-invalid ... ENOENT .../src/pay/sub/.yggdrasil/yg-config.yaml`, so yg cannot load the "project" it treats as a boundary. An empty `.yggdrasil/` with no file at all: there is no boundary, check fails correctly (as the tests expect). An untracked, gitignored file in the directory: the boundary exists locally but not in a fresh CI clone, so the results diverge. When every file of a mapping is cut off, mapping-path-missing fires but does not name the stray `.yggdrasil`, and the fix proposes 'Remove this mapping'. Rejected parts of the report: the excluded count (b.ts is not counted with a real nested graph either, per docs/glossary.md:267) and the silence on a partial cut by a real nested graph (documented in docs/configuration.md:325). Related: 025 (a mistaken `yg init` in a subdirectory creates a real nested graph), but this one is about the marker test, not root detection. Confirmed on a fresh clone at 2493aa16 and on npm 6.1.0. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-34/logs/verify-34-empty-nested-ygg-src.log, verify-34-empty-nested-ygg-npm610.log, verify-34-ci-and-real-nested.log, verify-34-ci-clone-free-step.log, verify-34-full-cut.log; scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-34/scripts/ (empty-nested-ygg.sh, ci-and-real-nested.sh, full-cut.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-nested-graph-dir.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/nested-graph-dir.sh.

## Why
An enforced rule is switched off without any finding, and CI is green. docs/configuration.md:323 speaks of a subtree that 'carries its own nested `.yggdrasil/` graph', and says membership 'is not guessed from a name'; the code applies a "must have real content" rule to `.git`, and its own test (tests/unit/io/repo-scanner-nested.test.ts:173-188) calls a subtree silently dropping out because of a stray marker an overcorrection to avoid. The trigger is narrow (e.g. a .gitkeep or .gitignore left behind after a nested graph's yaml files were deleted), and a deliberate workaround already has documented routes, so minor.

## Acceptance
- A directory is a nested project boundary only when its `.yggdrasil/` contains a yg-config.yaml (preferably a loadable one); in the scenario with only a .gitkeep, `yg check --no-approve` gives FAIL with error[refused] on src/pay/sub/b.ts:1, exit 1, also in a fresh clone.
- A stray `.yggdrasil/` without yg-config.yaml gives a finding that names its path instead of a silent exclusion, and mapping-path-missing on a full cut names the root that cut the files off.

## Changelog
- Fixed: A .yggdrasil/ directory without yg-config.yaml no longer takes its subdirectory out of the graph; such a leftover is reported as nested-graph-without-config, commands run below it use the graph above, and mapping-path-missing names the separate project that took a mapping's files.

## Evidence

- **ran (history):** git commit (merge of jarl/066-nested-roots into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8174 pairs verified; coverage branches 90.41%; [repo-check] All checks passed; [release/6.1.1 d36a5835b] Merge jarl/066-nested-roots

