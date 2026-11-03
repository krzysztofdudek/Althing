# 482 · Runes: TypeScript export conditions under moduleResolution Bundler read the import branch, but Runes takes the first export target that exists (next-intl e2e apps)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-473-opus
**Where:** Review of 473 (2026-11-03): next-intl e2e/* at the pinned commit, five references
**Branch:** jarl/482-ts-export-conditions
**Worker:** w-runes-482-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-482
**Since:** 2026-11-03 03:38

## What
With moduleResolution Bundler, TypeScript resolves a package's exports through the import (and types) conditions. Runes takes the first target that exists on disk, plugin.d.cts from the require branch, so where the import branch's file is missing it binds an edge TypeScript does not.

## Why
A false edge to a file the compiler never reads.

## Acceptance
- Export targets are chosen by the conditions the importing file's moduleResolution and module settings select, with catalogue cases for Bundler, Node16 import and Node16 require, red before and green after
- next-intl's tracked false edges leave explained.md and its golden changes only by the lines this explains

## Evidence

From the review of 473 round 2 (2026-11-03): six next-intl examples/* lines (dependency ^4.0.0, apps on moduleResolution Bundler, no dist/ at the pinned commit) share the export-conditions false edge of the five e2e lines; all eleven are this issue's

From the review of 473 round 3 (2026-11-03): the references search in 473 is level by level, but tsserver checks one project's direct references and then each child's whole subtree in turn, so from three levels deep the two can choose differently; the comment and the direct-before-nested case overstate the match. Part of this issue: say or do what tsserver does

