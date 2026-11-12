# 721 · Yggdrasil: the first experience after yg init (public-surface audit, before 6.2.0): a first next step that leads to the first node type and rule, a leaner init, uncovered files folded to one line, yg portal --static writing where it breaks no coverage, and auto_approve: deterministic in new projects (ruling init-auto-approves-script-rules)

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0513-zrhb
**Tags:** yggdrasil, init, first-run
**Files:** 
**Repo:** Yggdrasil
**After:** 703
**Found by:** jarl
**Where:** the public-surface audit, 2026-11-12, recommendations 1, 2, 4, 5, 8 and 9

## What


## Why
A newcomer's first yg init and yg check today point to a command that fails on an empty graph, write files nobody uses yet, list every file as belonging to no component, and show no finding of a free rule until a flag nobody told them about.

## Acceptance
- [test] On a fresh project: yg init writes auto_approve: deterministic, no .clinerules/ unless that folder exists, no .gitkeep in model/ or flows/, no stale ignore entries or dangling comments; the first next step points to describing the first node type in yg-architecture.yaml, not yg type-suggest (also in yg tree and yg context --file); with coverage.required empty the uncovered files fold to one line saying 'covered by no type'; yg portal --static changes no coverage; a plain yg check shows a free rule's finding; each red before and green after · by: cd source/cli && npm test
- [read] Every command output 703's guidance touches says node types first, as the manual does; the list of outputs changed is in the evidence

## Evidence

