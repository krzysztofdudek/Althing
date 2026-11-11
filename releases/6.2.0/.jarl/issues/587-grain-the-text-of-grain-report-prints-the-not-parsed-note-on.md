# 587 · Grain: the text of grain report prints the "not parsed" note only inside its architecture section, …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1414-swrg
**Tags:** 
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-169c-fable
**Where:** the review of 169

## What
Grain: the text of grain report prints the "not parsed" note only inside its architecture section, which exists only when the repository has more than one module (plugins/grain/engine/report.mjs:72-80). On a repository with one module, report names no unparsed file and no unread one, while status does. The release branch behaves the same way.

## Why


## Acceptance


## Evidence

