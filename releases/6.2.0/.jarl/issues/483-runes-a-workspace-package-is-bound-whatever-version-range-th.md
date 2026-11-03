# 483 · Runes: a workspace package is bound whatever version range the dependency declares, even when the range excludes it or pnpm does not link by range

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-473-opus
**Where:** Review of 473 (2026-11-03); pnpm 9 defaults link-workspace-packages to false

## What
Runes binds a bare import to the workspace package of that name whenever one exists. pnpm links it only for workspace: specifiers, or for a range the package's version satisfies when link-workspace-packages is on; npm and yarn have their own rules.

## Why
An edge to a workspace package the install takes from the registry is a false edge.

## Acceptance
- A dependency whose range the workspace version does not satisfy, or a pnpm workspace without link-workspace-packages, binds no workspace edge, with cases for each and for the satisfied and workspace: controls
- The package manager is read from packageManager or the lockfile, and an unknown one keeps today's binding, documented

## Evidence

