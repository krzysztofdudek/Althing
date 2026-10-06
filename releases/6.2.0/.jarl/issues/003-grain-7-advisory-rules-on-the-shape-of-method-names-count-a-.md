# 003 · Grain: 7 advisory rules on the shape of method names count a different set of declarations than check

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, minor
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-6.1.1-patch
**Where:**
**Branch:** jarl/003-check-populations
**Worker:** grain-003
**Worktree:** /Users/me/.jarl-wt/Grain-003
**Since:** 2026-10-05 16:22

## What
On koa, petclinic and Yggdrasil, 7 advisory rules on method names still differ in count from yg check: Grain's set of methods (e.g. constructors in Java) is not the same set of declarations that the name-shape check reads.

## Why
The 'N break it today' number is meant to agree with what yg check shows afterwards; for enforced rules this already works (6.1.1), for advisory ones it does not.

## Acceptance
Node types for the check derived from Grain's bindings per grammar; advisory counts agree with yg check --full on the corpus. Scope: a minor release, not a patch.

## Evidence

grain-200: not fixed, per grain-scope (003 minor). Probe on HEAD: Grain's method population counts Java constructor_declaration (PascalCase, a camelCase deviant) and TS/JS arrow_function bindings; the rendered name-shape check reads only NT.funcDecl nodes with a name field, so it skips both. Aligning means choosing a direction: (a) Grain leaves language-fixed names (constructors) out of the method name-shape count, or (b) the check reads the node types Grain counted (export applicableNodeTypes, as returns does) — (b) alone would make yg refuse every Java constructor under a camelCase rule.

