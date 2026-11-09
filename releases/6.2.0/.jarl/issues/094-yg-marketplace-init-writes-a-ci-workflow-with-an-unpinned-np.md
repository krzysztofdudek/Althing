# 094 · `yg marketplace init` writes a CI workflow with an unpinned `npx --yes @chrisdudek/yg marketplace check`, and `yg pack new` pins requires.yg to ^<major>.0.0, so the marketplace gate changes without a commit (the next major turns CI red)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-xbrp
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/marketplace.ts, Yggdrasil/source/cli/tests/unit/cli/marketplace.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/marketplace.ts:95 in ciWorkflowText(): `' - run: npx --yes @chrisdudek/yg marketplace check',` without a version, although cliVersion() is imported in the same file (:11); scaffoldPackageManifest in cli/pack.ts:156 pins `requires.yg` to `^${major}.0.0`; the refusal comes from core/marketplace-check.ts:409-413 (checkPackageRequires against whichever CLI happens to run); the test tests/unit/cli/marketplace.test.ts:91 pins the unpinned text
**Branch:** jarl/028-packages
**Merged:** eb8c83e04d18a5fd6f9c6112a24584eee0880534 in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (clone of github.com/krzysztofdudek/Yggdrasil HEAD 2493aa16, built CLI 6.1.0; a fresh git repo with `.github/workflows/`): `yg marketplace init`, then `yg pack new house-style`. The generated .github/workflows/yg-marketplace.yml has the step `- run: npx --yes @chrisdudek/yg marketplace check` without a version, and packages/house-style/yg-package.yaml has `requires: yg: "^6.0.0"`; `yg marketplace check` passes today (exit 0), and `npm view` shows latest 6.1.0, which is what npx resolves to today. Simulating the next major (the range moved one major below the running CLI, as CLI 7.x would be against ^6.0.0): the workflow file unchanged, `yg marketplace check` refuses with `package-requires-unsatisfied`, exit 1. Corrections to the report: the workflow runs only on push and pull_request, so the red appears on the next push of any unrelated change; the drift is not only about majors, because issue 332 of 6.1.0 tightened `marketplace check` within 6.x, so a marketplace created on 6.0.0 got a stricter gate without any commit. docs/family-contracts.md:69 ('pin the exact CLI version in CI ... never `npx @chrisdudek/yg` without a version'), getting-started.md:372, the-lock.md:86, reviewers.md:725, CHANGELOG.md:72 and every CI recipe in the README and docs pin `@6.1.0`; docs/packages.md and cli-reference.md:2781 say only that the file 'runs the check on every push'. The owner's checkout on main has the same line. This is not 332, 344, 410 or 528 of 6.1.0. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-64/verify-64-marketplace-ci-unpinned.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-64/repro.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-marketplace-ci-unpinned.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/marketplace-ci-unpinned.sh.

## Why
The tool's template breaks its own documented CI policy: every marketplace's gate floats with the latest release and changes without a commit. Nothing is lost, nothing dangerous passes, the refusal names the cause clearly, and the fix on the author's side is one line in the workflow, so minor.

## Acceptance
ciWorkflowText() emits `npx --yes @chrisdudek/yg@<wersja uruchomionego CLI> marketplace check` (the placeholder means "the version of the running CLI", taken from cliVersion()) with a comment to raise the pin in a separate commit; marketplace.test.ts checks the pinned version.

## Changelog
- Fixed: the CI workflow yg marketplace init writes runs @chrisdudek/yg@<the version that wrote it> instead of an unpinned npx, with a comment to raise the pin in a commit of its own.

## Evidence


merge of jarl/028-packages (34ea6f868) onto release/6.2.0 at 8fa91f90d: pre-commit hook red, merge aborted, no commit. First failing line: 'error[log-entry-missing] 1 node changed with no log entry' at cli/core/loader (step 'Graph: deterministic cache'; 021 and 030 both changed the loader since the merge base 5fa8acce6, so the merge owes its own entry: yg log merge-resolve --node cli/core/loader, then yg log add --node cli/core/loader with the merge's reason). The three test failures (portal-derive-nodes 'the real repo rolls up clean', own-graph default port '2: no pair is unverified or stale', read-cost-bounds '3: yg check --json exits 0') read this repository's own graph and most likely follow from the same entry. The merge itself had no conflicts and codes:update changed nothing.
- **ran (history):** devcontainer: cd source/cli && npm test (the repository hook on the merge commit, with coverage) · **saw:** 707 of 708 test files passed in the hook run of the merge, coverage OK: lines 97.43%, branches 91.32% (bar 90.2%), repo-check all checks passed, merge eb8c83e04

