# 603 · Althing's pre-push does not read a pushed annotated tag's message or tagger

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1504-btsu
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363-opus
**Where:** the review of 363

## What
Althing's pre-push does not read a pushed annotated tag's message or tagger
rails/run.mjs range peels a pushed tag object to its commit (cat-file -e <sha>^{commit}, then rev-list), so the message and the tagger of an annotated tag pushed to the canonical repository are never read by the names rail or the messages rail; a deny-listed word in a release tag's message leaves the machine unscanned. Found while reviewing 363, whose gate has the same gap.

## Why


## Acceptance


## Evidence

