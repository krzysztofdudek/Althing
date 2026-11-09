# 211 · Yggdrasil: the second half of 078 — architecture.ts checks the raw mapping entry (e.g. ./src/a.ts) when it resolves to nothing, instead of the canonical spelling

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T2049-orbn
**Tags:** yggdrasil, mapping
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** ygg-004
**Where:**
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
078 in package 004 fixed the expansion (an exact file in canonical spelling for a type's when); the part in architecture.ts belongs to package 6 (jarl/020-config-errors) and is to go there.

## Why



## Acceptance
A mapping entry in a non-canonical spelling that does not resolve to a file gives the same result for a type's when as the canonical spelling; test red→green.

## Changelog
- Fixed: a mapping entry spelled ./src/missing.ts (or with . or .. segments) naming a file that does not exist gets the same findings as src/missing.ts, with no false type-when-mismatch (folded into the 078 entry).

## Evidence

- **ran (history):** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

