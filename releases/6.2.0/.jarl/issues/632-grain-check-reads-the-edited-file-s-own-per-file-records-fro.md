# 632 · grain check reads the edited file's own per-file records from the model of the accepted tree, not f…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-qfsg
**Tags:** adoption, grain
**Files:** 
**Repo:** Grain
**Found by:** rev-604-opus
**Where:** the review of 604
**After:** 143
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
grain check reads the edited file's own per-file records from the model of the accepted tree, not from the edited text (plugins/grain/engine/arch.mjs:129 computeArchHits hydrates model.relDecls as it was at the last index). With Runes 1.1.0 in place, an edit of a C# file in src/Web that adds 'using Lib.Bases;', the base class HandlerBase and a member of the type Options nested in HandlerBase (declared in src/Extra) gives no FIRST edge in check, while the full pass after the commit gives src/Web to src/Extra; the same holds for a new file, and for an edited Rust crate root whose new extern crate or item check reads from the old table, where Runes 1.0 read the root from its live text. The edited file's own declarations should replace its entries in the check-time table. It arrives with the adoption of Runes 1.1.0 (143); until then the changelog line of 604 ('so both give the same edges') holds only for edits that leave the edited file's own records unchanged.

## Why


## Acceptance


[test] With Runes 1.1.0 vendored, an edit of a C# file that adds a using, a base class and a member of a type nested in that base (declared in another node) gives in grain check the same FIRST edge the full pass after the commit gives, because check reads the edited file's records from the edited text, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain check reads the edited file's own imports, base classes and members from the edited text, so a dependency the edit adds is named as the first one between two modules, as the index names it after the commit.

## Evidence

### Proof

- **ran (line 6ca90b9cdd19):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/check-reads-edited-file-records.test.mjs (at the test commit, then at the fix commit) · **saw:** before the fix: 3 tests, 2 fail (the edit that adds a using, a base class and a nested member gives no FIRST edge in check; a new file the same) and 1 passes; after the fix: 4 tests, 4 pass, the full pass after the commit gives src/Web/Handler.cs > src/Extra/HandlerBaseOptions.cs as check did

