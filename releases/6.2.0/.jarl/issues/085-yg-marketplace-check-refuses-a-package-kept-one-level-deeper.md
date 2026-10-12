# 085 · yg marketplace check refuses a package kept one level deeper under packages/ (packages/web/house-style) as an unlisted package directory and says to publish packages/web, although yg pack add installs it without a problem

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/marketplace-check.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/marketplace-check.ts:236-257: `claimed` is the set of the entries' full paths (`entryPath(e.path)`), but the loop walks only the first-level subdirectories of packages/ (`subdirectories()`, :118-125) and checks exact membership `claimed.has(dirPath)` (:241), so the entry packages/web/house-style never equals `packages/web`, and the next: text says to publish packages/web
**Branch:** jarl/028-packages
**Merged:** eb8c83e04d18a5fd6f9c6112a24584eee0880534 in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (yg built from a fresh clone at tag v6.1.0, node v24.11.1; marketplace-check.ts the same on v6.1.0 and main 2493aa16; each case: `yg marketplace init`, `yg pack new house-style`, the package directory moved, the path in the manifest corrected, commit, tag pack/house-style@0.1.0): A. packages/house-style (control): 'Ready to publish', exit 0. B. packages/web/house-style: `marketplace-dir-unlisted`: 'packages/web is a package directory that yg-marketplace.yaml does not list … next: Add an entry { name, path: packages/web, version } … or delete the directory.', 1 refusal, exit 1; the only yg-package.yaml in the tree is packages/web/house-style/yg-package.yaml. C. rules/web/house-style: PASS, exit 0 (the same depth outside packages/ is accepted). D. rules/house-style: PASS, exit 0. E. following the advice from B (an entry name: web, path: packages/web, version: 0.1.0): `marketplace-entry-missing` 'no yg-package.yaml' in packages/web, exit 1, so one refusal turns into another; the second piece of advice, 'delete the directory', would remove the package itself. F. a consumer of layout B: `yg pack add <B>#house-style --as acme/law` installs (1 rule, 5 files, exit 0), `yg pack verify` says the copy is exact (exit 0), `yg pack list` is clean. The schema says that `packages[].path` is 'The package directory, relative to the marketplace root', and docs/packages.md:563-566 that what `yg pack add` accepts, check accepts too; neither docs/packages.md nor the knowledge topic packages-and-marketplaces requires a package to be a direct child of packages/. This is not 332, 344 or 410 from 6.1.0 nor 029 here; the tests (unit 5 and 5b, e2e 'directory with no entry') cover only a flat packages/stray. Side note: `yg marketplace check --json` is unsupported (documented, not part of this issue). Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-55/logs/verify-55-marketplace-nested.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-55/repro.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/logs/f7-marketplace-nested.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/repro/f7-marketplace-nested.sh.

## Why
The CI workflow that `marketplace init` writes turns red on a valid layout that groups packages, and the refusal calls packages/web 'a package directory', which it is not, and advises publishing a directory without a yg-package.yaml or deleting the package. The workaround is easy (a flat packages/ or groups outside packages/), nothing is lost and nothing passes falsely, so minor.

## Acceptance
A first-level directory under packages/ is claimed when an entry equals it or starts with `${dirPath}/`, and unclaimed directories are reported at the level where they really lie: layout B gives 'Ready to publish', exit 0, and a stray packages/web/other next to it still gives marketplace-dir-unlisted naming packages/web/other (test).

## Changelog
- Fixed: yg marketplace check accepts a package kept under a grouping directory (packages/web/house-style) instead of refusing packages/web as unlisted, and names a stray directory where it lies (packages/web/other).

## Evidence


merge of jarl/028-packages (34ea6f868) onto release/6.2.0 at 8fa91f90d: pre-commit hook red, merge aborted, no commit. First failing line: 'error[log-entry-missing] 1 node changed with no log entry' at cli/core/loader (step 'Graph: deterministic cache'; 021 and 030 both changed the loader since the merge base 5fa8acce6, so the merge owes its own entry: yg log merge-resolve --node cli/core/loader, then yg log add --node cli/core/loader with the merge's reason). The three test failures (portal-derive-nodes 'the real repo rolls up clean', own-graph default port '2: no pair is unverified or stale', read-cost-bounds '3: yg check --json exits 0') read this repository's own graph and most likely follow from the same entry. The merge itself had no conflicts and codes:update changed nothing.
- **ran:** devcontainer: cd source/cli && npm test (the repository hook on the merge commit, with coverage) · **saw:** 707 of 708 test files passed in the hook run of the merge, coverage OK: lines 97.43%, branches 91.32% (bar 90.2%), repo-check all checks passed, merge eb8c83e04

