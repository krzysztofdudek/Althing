# 632 · grain check reads the edited file's own per-file records from the model of the accepted tree, not f…

**Status:** open
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

## What
grain check reads the edited file's own per-file records from the model of the accepted tree, not from the edited text (plugins/grain/engine/arch.mjs:129 computeArchHits hydrates model.relDecls as it was at the last index). With Runes 1.1.0 in place, an edit of a C# file in src/Web that adds 'using Lib.Bases;', the base class HandlerBase and a member of the type Options nested in HandlerBase (declared in src/Extra) gives no FIRST edge in check, while the full pass after the commit gives src/Web to src/Extra; the same holds for a new file, and for an edited Rust crate root whose new extern crate or item check reads from the old table, where Runes 1.0 read the root from its live text. The edited file's own declarations should replace its entries in the check-time table. It arrives with the adoption of Runes 1.1.0 (143); until then the changelog line of 604 ('so both give the same edges') holds only for edits that leave the edited file's own records unchanged.

## Why


## Acceptance


## Evidence

