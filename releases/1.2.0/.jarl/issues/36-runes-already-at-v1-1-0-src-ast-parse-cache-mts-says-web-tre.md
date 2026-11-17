# 36 · Runes, already at v1.1.0: src/ast/parse-cache.mts says web-tree-sitter objects 'are not freed by Ja…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1712-kxou
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-27-opus
**Where:** the review of 27

## What
Runes, already at v1.1.0: src/ast/parse-cache.mts says web-tree-sitter objects 'are not freed by JavaScript GC'. On web-tree-sitter 0.27 (pinned since 1.1.0), every Tree, Parser, Query, TreeCursor and LookaheadIterator registers a FinalizationRegistry that frees it once collected; seen on 0.27.2, where a tree nobody deleted was freed by the runtime after a collection. Deleting explicitly stays right (a collection comes when the JavaScript heap needs it, not the WebAssembly one), but the reason the comment gives is wrong, and the same belief underlies the parser host's 'lost only with a runtime that is never used again' (issue 27).

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: present at v1.1.0 already (ruling runes-1-2-0-cut-for-new-findings)

