# 573 · Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1309-zfhs
**Tags:** 
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-169b-fable
**Where:** the review of 169

## What
Grain: the "not parsed" note says of an over-limit or failed file that dependencies to and from it are not resolved, while edges to it are in the model wherever the importer binds by path or package: a Go package import gives cmd/main.go -> assets/bindata.go, and four Python services give four edges to the unread src/data.py. The tool before the change prints the same note with the same edges (plugins/grain/engine/report-facts.mjs:196).

## Why


## Acceptance


## Evidence

