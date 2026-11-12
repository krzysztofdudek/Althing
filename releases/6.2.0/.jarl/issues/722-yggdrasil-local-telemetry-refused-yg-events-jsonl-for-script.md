# 722 · Yggdrasil: local telemetry (.refused/, .yg-events.jsonl for script verdicts, .drill-results.jsonl, .feature-field.json, .type-class-cache/ with no typed architecture) off by default behind one key, on for projects that had it and set by Grain's install; git hooks, merge drivers and .gitattributes lines added when the first file they serve appears (public-surface audit)

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0513-uzfl
**Tags:** yggdrasil, init, files, grain
**Files:** 
**Repo:** Yggdrasil
**After:** 703
**Found by:** jarl
**Where:** the public-surface audit, 2026-11-12, recommendation 3 and section 5.6

## What


## Why
Yggdrasil writes copies of refused user files, event logs and indexes that no gate reads and most users never use; the owner suspects nobody needs them by default.

## Acceptance
- [test] A new project writes none of .refused/, .yg-events.jsonl, .drill-results.jsonl, .feature-field.json, nor .type-class-cache/ while no node type has a when predicate, until one key in yg-config.yaml turns local records on; yg init --upgrade writes the key on for a project that already has these files; yg advise and yg aspects --health say how to turn it on instead of showing empty counts; the post-merge hook, the merge drivers and each .gitattributes line appear when the first file they serve does, with yg init --no-git-hooks; each red before and green after · by: cd source/cli && npm test
- [read] docs/family-contracts.md and Grain's install say how Grain turns the key on, filed as a Grain issue if Grain must change

## Evidence

