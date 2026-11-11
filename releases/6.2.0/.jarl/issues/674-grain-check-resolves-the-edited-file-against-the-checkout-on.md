# 674 · grain check resolves the edited file against the checkout on disk with no file view (plugins/grain/…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2303-xzxg
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-143-opus
**Where:** the review of 143, 632, 633
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 23:04

## What
grain check resolves the edited file against the checkout on disk with no file view (plugins/grain/engine/arch.mjs:134, makeEdgeResolver without view), so an ignored or untracked manifest that is not JSON (a generated .csproj with a Using item, a Directory.Build.props, a go.mod) decides where the edit's references land: in a repository whose src/Api/Api.csproj is ignored and generated on disk with <Using Include="Lib.Models" />, an edit of src/Api/Controller.cs that adds 'Customer c;' gets 'FIRST edge src/Api → src/Lib' from check, while the index after the commit has no edge, and Yggdrasil's view (the files git does not ignore, no links) would give none either; the same on release/6.2.0 at dc31b968, so it predates 143. An ignored JSON config is already kept out by the exclusion Grain passes Runes. Check could resolve through a view of the working tree's tracked and not-ignored files, as yg check does, so that an edit's own manifest counts and a generated one does not.

## Why


## Acceptance


[test] grain check reads no file git ignores when it resolves an edit's imports (an ignored generated .csproj holding a Using gives no FIRST edge the index after the commit does not give), while an edit's own staged or edited manifests still count, red before and green after · by: cd plugins/grain && npm test

## Evidence

