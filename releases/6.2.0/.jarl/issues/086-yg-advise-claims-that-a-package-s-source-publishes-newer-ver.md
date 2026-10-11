# 086 · yg advise claims that a package's source publishes newer versions that come from another, removed package with the same name, and nothing ever refreshes this

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/package-versions-cache.ts, Yggdrasil/source/cli/src/cli/advise.ts, Yggdrasil/source/cli/src/cli/pack.ts, Yggdrasil/source/cli/src/cli/pack-update.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/package-versions-cache.ts:143-163 (recordObservedVersions carries over every existing entry; the comment at :148-150 calls a leftover from a removed package 'harmless'; PackageVersionsEntry :41-46 does not record the source); cli/pack.ts:767ff (runRemove does not touch the cache), :518-520 (pack add records versions only when fetched.published !== null; a plain directory gives null), :580-596 (list); cli/pack-update.ts:252-260 (update); utils/git-pack-fetch.ts:180-207 listPublishedVersionTags returns null for a plain directory; cli/advise.ts:839-862 (gatherPackageUpdates matches the cache to the install record by name only and shows the versions as published by the current source)
**Branch:** jarl/028-packages
**Worker:** ygg-028-packages
**Worktree:** /home/node/wt/028-packages
**Since:** 2026-10-05 13:00

## What
Reproduction (a fresh clone at tag v6.1.0 e5441101, npm ci, npm run build, `yg --version` 6.1.0; origin/main changes only init-reviewer-setup.ts and init-scaffold.ts; a custom script): a git marketplace publishes house-style at 0.1.0, 0.2.0 and 0.3.0; `pack add ../market#house-style@0.3.0 --as acme/law` → the cache has 0.1.0, 0.2.0 and 0.3.0. `pack remove house-style` removes the package, the cache is unchanged. `pack add ../localdir#house-style --as me/local` from a plain directory (git archive 0.1.0, no .git): the record says source ../localdir, version 0.1.0, follows the newest. `pack list` gives no newer versions, `pack update house-style` says "'house-style' is already at 0.1.0.", and the cache still has the timestamp from the first install. `yg advise`: nomination[package-update] 'The package "house-style" is installed at version "0.1.0", and its source publishes "0.2.0", "0.3.0". why: read from "../localdir" ... The version numbers and the package name are that source's own words'; the fix `yg pack update house-style` does nothing, and the next advise shows the same nomination. Control: a fresh consumer with only the install from a plain directory has no cache file and no nomination, so the nomination comes solely from the removed package's entry. A git source, even without a tag for this name, overwrites the entry correctly. Deleting .yggdrasil/.yg-packages-versions.json clears the state (the docs call the file disposable), but nothing suggests it. Missing test: removing and reinstalling the same name (tests/unit/io/package-versions-cache.test.ts, e2e/cli-pack-lifecycle.test.ts). This is not 095 nor 295 from 6.1.0. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-56/logs/stale-versions.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-56/repro/stale-versions.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/logs/f8-advise-stale-versions.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-6/repro/f8-advise-stale-versions.sh.

## Why
docs/packages.md:380-397 says that the cache holds 'what each source told it', a package never asked 'is simply not mentioned', and versions and source are quoted as the source's words; here one source's versions are attributed to another that was never asked, the agent sees a false claim over and over, and the suggested fix does nothing. An advisory nomination blocks nothing, and the sequence is unusual, so minor.

## Acceptance
The cache entry is removed on `pack remove` and on an add or update from a source that cannot be asked, or the cache records the source in each entry and advise ignores entries whose source differs from the one in the install record: in the repro sequence `yg advise` gives no package-update nomination (e2e test: removing and reinstalling the same name from a plain directory).

## Changelog
- Fixed: yg advise no longer credits a package with versions another package's source published; yg pack remove, and yg pack add or update from a plain directory, drop what was recorded for that package.

## Evidence


merge of jarl/028-packages (34ea6f868) onto release/6.2.0 at 8fa91f90d: pre-commit hook red, merge aborted, no commit. First failing line: 'error[log-entry-missing] 1 node changed with no log entry' at cli/core/loader (step 'Graph: deterministic cache'; 021 and 030 both changed the loader since the merge base 5fa8acce6, so the merge owes its own entry: yg log merge-resolve --node cli/core/loader, then yg log add --node cli/core/loader with the merge's reason). The three test failures (portal-derive-nodes 'the real repo rolls up clean', own-graph default port '2: no pair is unverified or stale', read-cost-bounds '3: yg check --json exits 0') read this repository's own graph and most likely follow from the same entry. The merge itself had no conflicts and codes:update changed nothing.

