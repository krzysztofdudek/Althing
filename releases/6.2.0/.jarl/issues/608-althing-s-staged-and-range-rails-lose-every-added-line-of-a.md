# 608 · Althing's staged and range rails lose every added line of a file after an added line that begins wi…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1536-jeew
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363b-opus
**Where:** the review of 363

## What
Althing's staged and range rails lose every added line of a file after an added line that begins with "++ ", because addedLines in rails/git.mjs takes any "+++ " line for a file header

## Why


## Acceptance


## Evidence

