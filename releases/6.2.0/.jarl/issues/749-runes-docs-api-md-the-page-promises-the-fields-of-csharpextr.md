# 749 · Runes, docs/api.md: the page promises the fields of CsharpExtract through its signature (a type mar…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T0625-ifga
**Tags:** 
**Files:** Runes/docs/api.md, Runes/CHANGELOG.md
**Repo:** Runes
**Found by:** rev-740-opus
**Where:** the review of 735, 740, 742, 745
**Branch:** jarl/740-runes-1-1-0-final
**Worker:** w-740-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-15 06:33

## What
Runes, docs/api.md: the page promises the fields of CsharpExtract through its signature (a type marked with a dash is promised through the signature that reaches it), yet 1.1.0 renames the CsharpRefDescriptor kind 'static' to 'target' (issue 185) and adds required fields (CsharpExtract.fileLocalTypes, scope.prefixDecls, aliasDecls, staticDecls and globalStatics, at on the descriptors, CsharpProjectScope.statics), so code that matches the kind 'static' or builds one of these objects no longer compiles against 1.1.0, at 72d243a; the page says only that the extract changes shape and is stale by the C# rev. The family's code only reads them (Yggdrasil's facts cache keeps fileLocalTypes, lists and receiverTypes; Grain reads scope.statics), so nothing breaks there; the question is whether the page should put the extract's shape outside the promise or the CHANGELOG should say it.

## Why


## Acceptance


[read] docs/api.md says plainly that the per-language extract records (CsharpExtract with its scope and descriptors, and the other languages' extracts) follow their extractor's rev and may change shape in a minor version, so a consumer that stores them re-extracts when the rev changes, and the CHANGELOG's Before you upgrade note names the C# change of 1.1.0 outright: the descriptor kind 'static' is now 'target', and fileLocalTypes, the scope's prefixDecls, aliasDecls, staticDecls and globalStatics, the descriptors' at and CsharpProjectScope.statics are new required fields

## Evidence

