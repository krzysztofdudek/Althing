# 500 · C#: using static imports neither nested types nor extension methods for references

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-awol
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-usingsta
**Where:** src/relations/extractors/csharp.mts:1600
**Branch:** jarl/500-csharp-lookup-levels
**Worker:** w-500-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:23

## What
Claim: Only the using static target gives an edge. The nested types and extension methods it imports (spec 14.5.4) are lost, and inside a namespace body a farther global type of the same name binds instead (a false edge). Pre-existing in v1.0.0.

probes/csharp p12 (Draw.cs:4 missing), p13 (A.cs:4 missing), p35 (Draw.cs:4->legacy, expected core); same on v1.0.0

## Why


## Acceptance
- [test] A using static T directive makes T's nested types visible to a simple name, at the binding level of the body that holds the directive (C# spec §14.5.4), with the audit's probes p12 (Draw.cs:4 -> core) and p35 (Draw.cs:4 -> core, not legacy) as catalogue cases, red before and green after · by: npm run check
- [test] A using static T directive makes T's extension methods callable in extension form, with p13 (A.cs:4 -> ext) as a catalogue case, red before and green after · by: npm run check
- [test] A using static of the compilation unit, of a namespace body and a project-wide global using static each import at their own level, with a case each · by: npm run check
- [test] A nested type a using static imports and a type of the same name a plain using of the same level imports are ambiguous (CS0104), and the reference gives no edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- C#: `using static T;` imports the nested types and the extension methods of `T` at the level of its directive (the compilation unit, a namespace body, or the whole project for `global using static`), so `Circle` for `T.Circle` and `s.Shout()` for an extension method of `T` now give their edges, and inside a namespace body a farther global type of the same name no longer binds; a `file` type and a type nested in one is found by its name inside its own file, so a public type of the same name in another file no longer gets an edge from that file. A relation pass can show new edges, and so new refusals, where a using static now imports a type or a call; a consumer that runs its own pass passes the optional `globalStatics` of each file to `buildCsharpProjectScopes` and `projectGlobalStatics` in the uses options to get the project-wide form.

## Evidence

### Proof

- **ran (line a18b4bdfb445):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** red at fa044eb: csharp-using-static-nested-type-edge (Draw.cs:4->core missing, got only :1), csharp-using-static-nested-type-namespace-body-hides-global-edge (Draw.cs:4->legacy instead of core); green at c201fb5: 2203 tests, 2202 pass, 0 fail, 1 skipped, dist/ is fresh
- **ran (line ad8a25479587):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** red at fa044eb: csharp-using-static-extension-method-edge (A.cs:4->ext missing, got only :1) and the namespace-body and global variants; green at c201fb5: 2203 tests, 2202 pass, 0 fail, 1 skipped, dist/ is fresh; the guard case csharp-using-static-extension-method-other-class-silence stays silent
- **ran (line d9095730129d):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** cases csharp-using-static-nested-type-edge (compilation unit), ...-namespace-body-hides-global-edge (namespace body), csharp-global-using-static-nested-type-edge (project-wide), plus ...-beside-global-type-edge and ...-loses-to-enclosing-namespace-edge for the level order, red at fa044eb (three missing edges), green at c201fb5: 2203 tests, 2202 pass, 0 fail, dist/ is fresh
- **ran (line 94d840e5abec):** nice -n 15 npm run check (on c201fb5, clean tree) · **saw:** case csharp-using-static-nested-type-beside-using-ambiguous-silence: red at fa044eb (unexpected edge Draw.cs:5->geo), green at c201fb5: 2203 tests, 2202 pass, 0 fail, dist/ is fresh
- **ran (line d0bad6f909cb):** nice -n 15 npm run corpus · **saw:** corpus gate: passed (CleanArchitecture 453 edges... 0 added, 0 removed, 0 explained; every routine repository 0 added, 0 removed). Heavy tier, informational: node scripts/corpus.mjs verify --only eShop,jellyfin --tier heavy: eShop 2017 edges 0 added; jellyfin 32801 edges vs 32798 on release/1.1.0, 3 added by this change (Jellyfin.Server/Program.cs:120, :229, :378 -> MediaBrowser.Controller/Extensions/ConfigurationExtensions.cs, extension calls through using static), the other 18 added edges are already there on release/1.1.0

### Notes

Correction to the row of line 5: CleanArchitecture printed 452 edges, not 453; 0 added, 0 removed, 0 explained.

Assumed: an extension method imported by a using static is matched on a second key that the declaring class publishes beside its namespace key (App.Ext.StringExt.Shout() beside App.Ext.Shout()), so the directive imports the methods of its class alone and not those of the other static classes of the namespace; this adds keys to declarations() and raises the extractor rev to 19.

Assumed: the project-wide global using static travels as new optional fields on the existing project facts (CsharpGlobalFacts.globalStatics in, CsharpProjectScope.statics out, CsharpUsesOptions.projectGlobalStatics), listed in docs/api.md; a consumer that passes none sees the using static directives of each file only. The consumers (Grain, Yggdrasil) do not pass them yet. The MSBuild item Using Include Static=true is still skipped, as before.

