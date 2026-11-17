# 24 · Runes, TypeScript and JavaScript: a tsconfig paths map with very many keys makes each bare specifie…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1509-dcdr
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-755-opus
**Where:** the review of 10, 20, 755

## What
Runes, TypeScript and JavaScript: a tsconfig paths map with very many keys makes each bare specifier cost time in proportion to it, so a crafted repository stalls every consumer: at release/1.2.0 (3e125cb) a 6 MB tsconfig.json with 202037 paths keys takes about 89 ms per resolve or explainMiss call of a specifier no key matches (20 specifiers, each resolved and explained, 3.56 s; 2000 did not finish in 300 s), against the linear cost the readers keep elsewhere

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: a gap v1.1.0 already had, or a reach the new reader does not claim, not a false edge or a regression (ruling runes-1-2-0-cut-for-new-findings)

