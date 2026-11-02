# 471 · Runes: TypeScript config follow-ups after 236 and 298 (a tsconfig field naming a missing file, a subpath directory's own package.json, invisible characters left in a resolver test)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-236-opus
**Where:** Review of 236 and 298 (2026-11-02)
**After:** 236

## What
When a package's tsconfig field names a file that does not exist, the resolver falls back to tsconfig.json, and no test covers it. A subpath directory with a package.json of its own is not read for its tsconfig field the way tsc reads it. test/relations/extractors/typescript-resolve.test.mjs still holds four literal invisible characters.

## Why
An untested fallback can regress silently, a subpath layout tsc accepts loses its aliases, and an invisible character in a test is easy to break by an editor.

## Acceptance
- A test covers the fallback from a missing tsconfig field target to tsconfig.json
- extends through a subpath directory with its own package.json reads that package.json's tsconfig field as tsc does, with a catalogue case red before and green after
- typescript-resolve.test.mjs holds no literal invisible character

## Evidence

