# 029 · yg marketplace check passes a rule whose check.mjs imports a module the installation does not copy (a dot-named helper or a module outside the package), so the rule will not run in any repository, and yg pack verify still says the copy is exact

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/package-store.ts, Yggdrasil/source/cli/src/core/marketplace-check.ts, Yggdrasil/source/cli/src/io/artifact-reader.ts, Yggdrasil/source/cli/src/templates/knowledge/packages-and-marketplaces.ts, Yggdrasil/docs/packages.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/package-store.ts:108-110 (isIgnoredPackageEntry, applied at :182 in inspectPackageTree, shared by installation and the check); core/marketplace-check.ts:357-360 (takes only the tree's refusals; the five questions at :30-42 do not compare imports with files); io/artifact-reader.ts:224 (readSupportFileHashes already follows literal relative imports, including of dot-named code files)
**Branch:** jarl/028-packages
**Merged:** eb8c83e04d18a5fd6f9c6112a24584eee0880534 in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (fresh clone of main 2493aa16 and npm @chrisdudek/yg@6.1.0, node v24.11.1): dot variant: example/check.mjs imports './.helper.mjs' committed beside it; outside variant: imports '../../../lib/shared.mjs' from the marketplace root; tag, marketplace check, installation, attachment with status: enforced. In both, `yg marketplace check`: 'Ready to publish ... passes every check' (exit 0); `yg pack add` installs (5 files, without .helper.mjs; the module outside the package was never in it); `yg pack verify`: 'the copy is exactly pack/house-style@0.1.0' (exit 0); `yg check --approve --only-deterministic` at the consumer: 'Failed to load check.mjs ... Cannot find module .../example/.helper.mjs' (or .../aspects/packages/acme/lib/shared.mjs), check-failed-to-run, unverified, exit 1; `yg drill`: 2 unrun, exit 2. In the publishing repo both variants work. Control with './helper.mjs': 6 files, the check correctly refuses a.ts:1, drill 2 pass. The consumer cannot fix this: adding .helper.mjs to the copy makes the rule run, but `yg pack verify` fails ('sits among the copied files, but the package did not install it'), and `yg check` blocks on package-file-modified; the only way out is to detach the rule. In addition: a shared helper inside the package (packages/house-style/shared/x.mjs) is refused by marketplace check as an undeclared directory (package-manifest-invalid), so the only place in a package for a helper of several rules is closed, and authors are pushed toward two layouts that break every consumer. Issue 332 (6.1.0) concerned other cases, 164/363 the hashing of helpers, not their shipping. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-26/logs/verify-26-unshipped-imports.log, verify-26-consumer-cannot-fix.log, verify-26-shared-helper-in-package.log (scripts repro.sh, repro-consumer-fix.sh, repro-shared-in-package.sh in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-26/).

## Why
docs/packages.md:563-566 promises that a package that passes the check installs; here it installs, but its rule never works for anyone and nobody but the publisher can fix it. The packages-and-marketplaces knowledge topic (:184-187) tells authors that dot-named code files are part of a rule, and docs/packages.md:599 that installation does not copy them; the documented extraction path (copying .yggdrasil/aspects/<id>/ to packages/<pkg>/<rule>/) carries such a helper straight into the package. The failure at the consumer is loud, not a false PASS, hence major, not blocker.

## Acceptance
- marketplace check follows the literal relative imports of check.mjs and companion.mjs (e.g. through readSupportFileHashes) and refuses a package whose rule reaches a file outside the list the installation copies (inspectPackageTree(pkgDir).files), naming the import; the dot and outside variants do not get 'Ready to publish'.
- The documentation and the knowledge topic say the same thing about dot-named code files in a package, and a helper shared by several rules of a package has a legitimate place, or the docs say plainly that it has none.

## Changelog
- Fixed: yg marketplace check refuses a rule whose code imports a file yg pack add does not copy (a dot-named helper, or a module outside the package), naming the import; the docs say a package has no place yet for a helper several rules share.

## Evidence


merge of jarl/028-packages (34ea6f868) onto release/6.2.0 at 8fa91f90d: pre-commit hook red, merge aborted, no commit. First failing line: 'error[log-entry-missing] 1 node changed with no log entry' at cli/core/loader (step 'Graph: deterministic cache'; 021 and 030 both changed the loader since the merge base 5fa8acce6, so the merge owes its own entry: yg log merge-resolve --node cli/core/loader, then yg log add --node cli/core/loader with the merge's reason). The three test failures (portal-derive-nodes 'the real repo rolls up clean', own-graph default port '2: no pair is unverified or stale', read-cost-bounds '3: yg check --json exits 0') read this repository's own graph and most likely follow from the same entry. The merge itself had no conflicts and codes:update changed nothing.
- **ran:** devcontainer: cd source/cli && npm test (the repository hook on the merge commit, with coverage) · **saw:** 707 of 708 test files passed in the hook run of the merge, coverage OK: lines 97.43%, branches 91.32% (bar 90.2%), repo-check all checks passed, merge eb8c83e04

