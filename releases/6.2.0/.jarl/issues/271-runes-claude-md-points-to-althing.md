# 271 · Runes: CLAUDE.md points to Althing

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** runes, docs, migration, needs-owner
**Files:** Runes/CLAUDE.md
**Repo:** ../../../Runes
**Found by:** jarl
**Where:** Runes/CLAUDE.md (22 lines; nothing says where the family's issues, releases and rulings live)
**After:** 266
**Branch:** jarl/271-claude-md-althing-pointer
**Merged:** 605254d in ../../../Runes
**CI:** green

## What
The move's step M9 for Runes. CLAUDE.md gains the line "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". Runes is shared code, not a family member for users, so its README has no family section and the canon's sentence does not reach it. On release/1.1.0; if 1.1.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working on Runes finds where its issues and releases are decided only through that pointer; every other family repository carries it.

## Acceptance
- CLAUDE.md carries the pointer line
- npm run check is green on the commit

## Evidence

Althing is public on GitHub (gh repo view: PUBLIC, 2026-11-03), so the pointer can land on release/1.1.0 now; 266's record steps do not change what the line says
- **ran:** npm run check · **saw:** ℹ tests 1982, ℹ suites 341, ℹ pass 1982, ℹ fail 0, ℹ cancelled 0, ℹ skipped 0, ℹ todo 0 (node --test over test/**/*.test.mjs, Runes check); dist/ is fresh. CLAUDE.md is not asserted by any test (grep of test/, scripts/, tools/ found no reference).
- **ran:** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 1997, pass 1997, fail 0, dist/ is fresh; corpus verify: passed on all 33 repositories (605254d on release/1.1.0: 476 and 479 merged at 6d01d91, 271 at 605254d)

