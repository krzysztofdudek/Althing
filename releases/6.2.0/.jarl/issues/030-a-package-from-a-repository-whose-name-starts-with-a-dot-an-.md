# 030 · A package from a repository whose name starts with a dot (an organisation's `.github` repository) installs into a dot-named directory that the graph loader skips: its rules never load, and add, list and verify report success

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/graph-loader.ts, Yggdrasil/source/cli/src/cli/pack-source.ts, Yggdrasil/source/cli/src/cli/pack.ts, Yggdrasil/source/cli/src/io/package-manifest-parser.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/graph-loader.ts:486, :490, :494 (scanInstalledPackages skips owner, repo and package directories starting with '.'); cli/pack-source.ts:150-173 (identityFromUrl; isSafeSegment/validIdentity reject only '', '.', '..' and separators); cli/pack.ts:406 (--as)
**Branch:** jarl/028-packages
**Worker:** ygg-028-packages
**Worktree:** /home/node/wt/028-packages
**Since:** 2026-10-05 13:00

## What
Reproduction (npm @chrisdudek/yg 6.1.0 and a clone of main 2493aa16, identical result): a marketplace with origin https://github.com/acme/.github.git (also scp git@github.com:acme/.github.git); `yg pack add ../market#house-style`: 'Installed 'house-style' 0.1.0 ... into .yggdrasil/aspects/packages/acme/.github/house-style/' and the id to attach packages/acme/.github/house-style/example; `yg pack list`: 'copy untouched'; `yg pack verify`: exact copy, exit 0; `yg aspects`: '(no aspects defined ...)'; `yg check` before attaching: PASS with no mention of the dead package; after attaching the printed id: aspect-undefined with the fix 'names a rule installed from a package, and no installed package provides it. Run yg pack list ... install the package with yg pack add', although pack list says it is installed; a repeated pack add recreates the same state (a loop). The same with `--as acme/.github` and `--as .acme/law`. Attaching through a node type or through implies: from one's own rule also ends in an error (aspect-undefined, implied-aspect-missing), so the enforcement is not silent. Control: origin acme/github works. Workaround: `--as acme/dotgithub`, but nothing suggests it. Only the skip at the owner level has a purpose: the installation's .staging-*/.replaced-* directories sit directly under packages/ (io/package-store.ts:129, :393-394). The finder's variant with a package named `.x` is refuted: git does not create the tag pack/.x@0.1.0 ('not a valid tag name'), so such a package cannot be installed; a separate minor observation: `yg pack new .x` and `yg marketplace check` ('Ready to publish') accept a name whose tag git will not accept. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-27/logs/dot-identity-published-6.1.0.log, dot-identity-main-2493aa16.log, dot-identity-loudness-published-6.1.0.log, dot-package-name-published-6.1.0.log (scripts in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-27/repro/).

## Why
<org>/.github is a common place for an organisation's shared configuration, so a realistic place to publish shared rules. add/list/verify report a healthy package whose rules never load, and the check's message sends the user round in a loop. The enforcement is not silent and there is a workaround, hence minor.

## Acceptance
- The loader reads dot-named repo and package directories (the skip at the owner level remains only for the .staging-/.replaced- prefixes), or `yg pack add` refuses an identity with a dot-named segment and points to `--as <owner>/<repo>`; a package with origin acme/.github is either listed by `yg aspects` or cannot be installed.
- aspect-undefined tells 'recorded in yg-packages.yaml, but cannot be loaded' apart from 'not installed'; `yg pack new`/`yg marketplace check` refuse a package name from which git will not make a tag pack/<name>@<version>.

## Changelog
- Fixed: a package from a repository whose name starts with a dot (an organisation's .github) loads; aspect-undefined tells a recorded-but-unloaded package apart from one never installed; yg marketplace check refuses a package name git cannot put in a tag.

## Evidence


