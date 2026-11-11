# 598 · Yggdrasil docs: 'vitepress dev' crashes at start while optimizing dependencies ('Transforming destr…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-mkzk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-356-fable
**Where:** the review of 356
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
Yggdrasil docs: 'vitepress dev' crashes at start while optimizing dependencies ('Transforming destructuring to the configured target environment is not supported yet'), on release/6.2.0 with vite 5.4.21 and on vite 6.4.6 alike; the esbuild 0.28 override is the likely cause; 'vitepress build' passes

## Why


## Acceptance


[test] vitepress dev starts in the docs folder and serves a page without the dependency-optimizing crash, checked by a smoke step in scripts/repo-check.sh or a test · by: cd source/cli && npm test

## Evidence

