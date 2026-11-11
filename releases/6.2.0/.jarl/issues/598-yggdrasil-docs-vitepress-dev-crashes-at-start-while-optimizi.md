# 598 · Yggdrasil docs: 'vitepress dev' crashes at start while optimizing dependencies ('Transforming destr…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-mkzk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-356-fable
**Where:** the review of 356

## What
Yggdrasil docs: 'vitepress dev' crashes at start while optimizing dependencies ('Transforming destructuring to the configured target environment is not supported yet'), on release/6.2.0 with vite 5.4.21 and on vite 6.4.6 alike; the esbuild 0.28 override is the likely cause; 'vitepress build' passes

## Why


## Acceptance


## Evidence

