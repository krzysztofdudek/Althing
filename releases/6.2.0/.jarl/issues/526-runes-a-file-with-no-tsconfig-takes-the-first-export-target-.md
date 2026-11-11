# 526 · Runes: a file with no tsconfig takes the first export target that exists, whatever its condition (react: 1115 oracle mismatches)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0445-cbnz
**Tags:** 1.1.1, runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**After:** 482
**Found by:** w-runes-477-opus
**Where:** The 477 worker's heavy-tier read (2026-11-03): react at its pinned commit, react resolving to react.react-server.js, react-dom/server to server.edge.js, use-sync-external-store/shim to index.native.js
**Branch:** jarl/526-ts-conditions
**Worker:** w-526-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:16

## What
482 selects export conditions by the importing file's module settings, and keeps the old reading where no tsconfig decides. In react most files have no tsconfig, so the first target that exists on disk wins, which is often a react-server, edge or native build no resolver would pick by default.

## Why
1115 edges in one widely used repository point at files the real tools do not read.

## Acceptance
- A file no tsconfig covers resolves exports with the default conditions Node and TypeScript use (import or require by format, then types, node, default), with cases for react-server, edge and native targets, red before and green after
- react's heavy-tier oracle mismatches of this kind are gone, and its golden changes only by lines this explains

## Evidence

