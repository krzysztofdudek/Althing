# 225 · Yggdrasil: a mapping entry meaning the whole repository — a defined meaning instead of a refusal (the second half of 019)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** yggdrasil, mapping, partial
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#yggdrasil-scope
**Where:**
**After:** 021

## What
In 6.1.1 (019) the entries '/', '//', './' and '.' are rejected when a node is loaded; the meaning 'the whole repository' was deferred to 6.2.0 (yggdrasil-scope).

## Why
A project node that deliberately covers everything outside the rest of the graph has no single documented spelling today.

## Acceptance
- One documented mapping spelling means the whole repository (excluding .yggdrasil/, files of nested graphs and coverage.excluded); the other spellings are either normalised to it or rejected with a hint; the type's when rules, owner, context and check treat it consistently; unit and e2e tests.
- The behaviour towards other nodes that map part of the repository is defined (the deepest owner wins) and tested.

## Evidence


