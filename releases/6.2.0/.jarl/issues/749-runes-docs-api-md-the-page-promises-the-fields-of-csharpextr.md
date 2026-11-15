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
**Merged:** 16731a22fe4d4362e6ca743b5819ab369a941b77 in Runes
**Merge check:** npm run check · saw ℹ tests 2753, pass 2750, fail 0, skipped 3; dist/ is fresh; exit 0 (version 1.1.0, top section [1.1.0] - 2026-11-15)

## What
Runes, docs/api.md: the page promises the fields of CsharpExtract through its signature (a type marked with a dash is promised through the signature that reaches it), yet 1.1.0 renames the CsharpRefDescriptor kind 'static' to 'target' (issue 185) and adds required fields (CsharpExtract.fileLocalTypes, scope.prefixDecls, aliasDecls, staticDecls and globalStatics, at on the descriptors, CsharpProjectScope.statics), so code that matches the kind 'static' or builds one of these objects no longer compiles against 1.1.0, at 72d243a; the page says only that the extract changes shape and is stale by the C# rev. The family's code only reads them (Yggdrasil's facts cache keeps fileLocalTypes, lists and receiverTypes; Grain reads scope.statics), so nothing breaks there; the question is whether the page should put the extract's shape outside the promise or the CHANGELOG should say it.

## Why


## Acceptance


[read] docs/api.md says plainly that the per-language extract records (CsharpExtract with its scope and descriptors, and the other languages' extracts) follow their extractor's rev and may change shape in a minor version, so a consumer that stores them re-extracts when the rev changes, and the CHANGELOG's Before you upgrade note names the C# change of 1.1.0 outright: the descriptor kind 'static' is now 'target', and fileLocalTypes, the scope's prefixDecls, aliasDecls, staticDecls and globalStatics, the descriptors' at and CsharpProjectScope.statics are new required fields

## Reviews
- **approve** · by rev-740-opus (fresh) · 2026-11-15 · model claude-opus-5-5@xhigh · batch 20261115T0648-xivd
  Round 2 at 1c83846. Every round-1 finding is answered, checked against the tip: the Python and PHP limit now says absent with the reason unfollowed and no candidates, which is what the tip answers (php-psr4-two-roots-both-hit-ambiguous-silence: Handler.php:3 absent unfollowed; two pyproject projects holding shared/util.py: absent unfollowed); New edges names Rust brace-list imports and re-exported extern crate and the Kotlin annotated and ktfmt forms, Edges that go away the sys.path-by-configuration folders; the is-not chain is a known limit and holds (probe: x is not App.Models.Order || x is not App.Models.Line gives no edge); the API bullet matches the .d.mts (fileLocalTypes and the scope's four fields required, lists, receiverTypes and descriptor types optional, CsharpGlobalFacts.globalStatics and projectGlobalStatics optional, valuesOf, reach and the fifth and sixth arguments named), Stored results names fileLocalTypes; the heading is dated 2026-11-15; 748's line is its Changelog field verbatim and the tip agrees (probe: { Order.Id: 3 } and a switch arm { Order.Customer.Name: "a" } give no edge to a same-named App.Order, { Order.Kind: Kinds.A } gives the edge to Kinds, { Order: Models.Order } to Order). Judged: 735 line 1 'The comment says where the test runs and when it is skipped, as the workflow and the code do': the header now says skipped with the reason where the toolchain is missing or of another version, except on CI, where the workflow installs it and the test fails, as rustToolchainVerdict and the workflow do. 740 line 2 'CHANGELOG.md's top section is [1.1.0] with the release date, written for someone upgrading from 1.0.0 ...': met, read once more as the release text; nothing of Yggdrasil or Grain; [1.0.0] and older unchanged; no [1.0.1] heading. 740 line 3 'README.md and CLAUDE.md say what 1.1.0 is where they state a version, a count or a status, and match the catalogue and test counts of the tip': 992 cases in 12 languages, 992 case files at the tip. 745 line 1 'docs/api.md names this limit where it describes classifyUse's outside answer, and the CHANGELOG's known limits of 1.1.0 carry it': unchanged since round 1, met. 749 line 1 'docs/api.md says plainly that the per-language extract records ... follow their extractor's rev and may change shape in a minor version, so a consumer that stores them re-extracts when the rev changes, and the CHANGELOG's Before you upgrade note names the C# change of 1.1.0 outright ...': docs/api.md lists the extract records under What it does not cover, with the exception noted beside the promise of a type marked with a dash; CsharpExtract is the only extract record type, the other languages' records are their declarations() keys, which the bullet names; the C# extract's shape bullet names the kind rename and every required field the issue lists. That this moves the extract's shape outside the 1.x promise is the jarl's ruling runes-extract-shapes-follow-the-rev, filed for the owner's ratification (a-43), open. Minor (wording, 740 line 2): the intro says 'The additions are optional arguments, fields and methods', while the C# extract's shape bullet lists new required fields; the intro's own claim, a call written for 1.0.0 needs no change, holds. 742 line 1 proved again by my row; line 2 (a run on GitHub) open, the jarl's after the push. The branch against release/1.1.0 at 5a7f1ee touches only the lease's files; dist fresh; one issue per commit.
- **approve** · by rev-740-opus (fresh) · 2026-11-15 · model claude-opus-5-5@xhigh · batch 20261115T0701-mmhm
  Round 3 at 5dd7b30: the only change since 1c83846 is the [1.1.0] intro line, which is now true; the round-2 approve stands.

## Evidence

