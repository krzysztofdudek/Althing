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

## What
After 119 a file over 1.5 million characters is named, but its types still do not give the edges yg check sees. Extracting only the relations costs about 6 s per refresh at 1.54 million characters (28 s at 6.18 million), so the result needs to be cached.

## Why
Generated API clients are a common case; Grain and yg diverge in edge counts.

## Acceptance
Relations from over-limit files are computed once per file version and cached; edge counts match yg check.

## Evidence


