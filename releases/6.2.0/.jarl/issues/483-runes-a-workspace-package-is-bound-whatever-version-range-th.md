# 483 · Runes: a workspace package is bound whatever version range the dependency declares, even when the range excludes it or pnpm does not link by range

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-473-opus
**Where:** Review of 473 (2026-11-03); pnpm 9 defaults link-workspace-packages to false
**Branch:** jarl/482-ts-export-conditions
**Worker:** w-runes-482-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-482
**Since:** 2026-11-03 03:38

## What
Runes binds a bare import to the workspace package of that name whenever one exists. pnpm links it only for workspace: specifiers, or for a range the package's version satisfies when link-workspace-packages is on; npm and yarn have their own rules.

## Why
An edge to a workspace package the install takes from the registry is a false edge.

## Acceptance
- A dependency whose range the workspace version does not satisfy, or a pnpm workspace without link-workspace-packages, binds no workspace edge, with cases for each and for the satisfied and workspace: controls
- The package manager is read from packageManager or the lockfile, and an unknown one keeps today's binding, documented

## Changelog
- Fixed: a workspace package declared by a version range or a tag binds only where the package manager (the root's `packageManager` or its lockfile) links it: npm and yarn for a range the package's version satisfies, pnpm only with `link-workspace-packages` on, which pnpm 9 turned off by default; `workspace:` specs, local paths, undeclared imports and an unknown manager bind as before. A consumer's graph can lose edges to workspace packages the install takes from the registry.

## Evidence

- **ran:** node --test --test-name-pattern=typescript-workspace- test/relations/extractors/typescript-name-resolution-matrix.test.mjs (build without the linking fix) · **saw:** pass 9, fail 2: workspace-pnpm-range-unlinked-silence and workspace-range-unsatisfied-silence emit an edge to lib
- **ran:** node --test --test-name-pattern=typescript-workspace- test/relations/extractors/typescript-name-resolution-matrix.test.mjs (commit 39a3b3b) · **saw:** pass 11, fail 0
- **ran:** node scripts/corpus.mjs verify --only react · **saw:** 107 removed, every one from a react fixture pinning an older or experimental React under yarn 1.22.22; explained and golden regenerated

