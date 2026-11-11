# 573 · Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1309-zfhs
**Tags:** 
**Files:** Grain/plugins/grain/engine/report-facts.mjs
**Repo:** Grain
**Found by:** rev-169b-fable
**Where:** the review of 169

## What
Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it are not resolved, while edges to it are in the model wherever the importer binds by path or package: a Go package import gives cmd/main.go -> assets/bindata.go, and four Python services give four edges to the unread src/data.py. The tool before the change prints the same note with the same edges (plugins/grain/engine/report-facts.mjs:196).

## Why


## Acceptance


[test] For an over-limit or failed file, the not-parsed note and the model agree: the note does not say dependencies to the file are unresolved where the model holds edges to it (a Go package import giving cmd/main.go -> assets/bindata.go, four Python services giving four edges to the unread src/data.py), or those edges are no longer in the model; both repros are tests, red before and green after · by: cd plugins/grain && npm test

## Evidence

