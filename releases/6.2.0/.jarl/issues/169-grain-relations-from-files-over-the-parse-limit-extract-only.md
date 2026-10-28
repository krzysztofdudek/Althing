# 169 · Grain: relations from files over the parse limit (extract only the relations, with a cache)

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** grain, 6.2
**Files:** Grain/plugins/grain/engine/learn.mjs
**Repo:** ../../../Grain
**After:** 119
**Found by:** grain-100
**Where:**
**Branch:** jarl/169-oversize-relations

## What
After 119 a file over 1.5 million characters is named, but its types still do not give the edges yg check sees. Extracting only the relations costs about 6 s per refresh at 1.54 million characters (28 s at 6.18 million), so the result needs to be cached.

## Why
Generated API clients are a common case; Grain and yg diverge in edge counts.

## Acceptance
Relations from over-limit files are computed once per file version and cached; edge counts match yg check.

## Changelog
- Fixed: a source file over 1.5 million characters (a generated API client, say) still adds no conventions, but its dependencies are now counted, so Grain's edges match what yg check sees; the file is parsed once per file version and cached. Can turn a repository red: edges that were missing appear, and a graph that did not declare them fails yg check.

## Evidence


docs: README.md and the size-limit docs page: a source over 1.5 million characters adds no conventions but its dependencies are counted (relation-only parse, bounded at 90 s, cached per file version in the tree cache); relCoverage.unparsed gains sizeRelations. CHANGELOG Before you upgrade: edges of over-limit files now appear and can turn a graph that did not declare them red. Stamps: EXTR_V and MODEL_V.

2026-10-28 tidy-up: the worktree directory is gone; branch jarl/169-oversize-relations keeps 1 commit beyond release/6.2.0 (0b32539); the lease ends and the issue returns to the queue

