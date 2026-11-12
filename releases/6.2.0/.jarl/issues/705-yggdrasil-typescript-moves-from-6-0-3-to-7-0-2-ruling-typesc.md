# 705 · Yggdrasil: TypeScript moves from 6.0.3 to 7.0.2 (ruling typescript-bumped)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-phwh
**Tags:** yggdrasil, typescript, dependencies
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12 (ruling typescript-bumped)
**Branch:** jarl/705-typescript-7
**Worker:** w-705-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:18

## What


## Why
The owner wants the family on a newer TypeScript; 7.0.2 is npm's latest, a major release, so options it dropped or changed have to be met in the build, the type check, lint and the shipped declaration files.

## Acceptance
- [check] source/cli builds, type-checks and lints with TypeScript 7.0.2 pinned in package.json and the lockfile, and scripts/repo-check.sh passes apart from pack-smoke (issue 679) · by: bash scripts/repo-check.sh
- [read] Any tsconfig option TypeScript 7 removed or changed is replaced with what keeps the same build, the shipped .d.ts files of the published package are compared before and after, and every difference is explained in the evidence

## Evidence

