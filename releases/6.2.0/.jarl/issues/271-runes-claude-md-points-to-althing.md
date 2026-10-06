# 271 · Runes: CLAUDE.md points to Althing

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** runes, docs, migration, needs-owner
**Files:** Runes/CLAUDE.md
**Repo:** ../../../Runes
**Found by:** jarl
**Where:** Runes/CLAUDE.md (22 lines; nothing says where the family's issues, releases and rulings live)
**After:** 266

## What
The move's step M9 for Runes. CLAUDE.md gains the line "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". Runes is shared code, not a family member for users, so its README has no family section and the canon's sentence does not reach it. On release/1.1.0; if 1.1.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working on Runes finds where its issues and releases are decided only through that pointer; every other family repository carries it.

## Acceptance
- CLAUDE.md carries the pointer line
- npm run check is green on the commit

## Evidence

