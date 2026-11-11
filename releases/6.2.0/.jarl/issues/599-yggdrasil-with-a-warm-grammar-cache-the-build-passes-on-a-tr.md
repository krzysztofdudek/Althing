# 599 · Yggdrasil: with a warm grammar cache the build passes on a tree-sitter-cli other than the pinned on…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-ixqs
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
Yggdrasil: with a warm grammar cache the build passes on a tree-sitter-cli other than the pinned one; the pin is checked only when a grammar is built from source

## Why


## Acceptance


[test] The tree-sitter-cli pin is checked whether a grammar is built from source or taken from a warm cache: an installed tree-sitter-cli other than the pinned one fails the build either way, red before and green after · by: cd source/cli && npm test

## Evidence

### Proof

- **ran (line e27f3b4319a0):** cd source/cli && npx vitest run tests/unit/repo/grammar-cli-pin.test.ts (before wiring the check into scripts/grammars.mjs, then after) · **saw:** red before: the grammar step exited 0 on a scratch project holding tree-sitter-cli 0.26.0 (expected 1); green after: 4 passed, the step fails with 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.26.0 is installed' and builds with the pinned version

