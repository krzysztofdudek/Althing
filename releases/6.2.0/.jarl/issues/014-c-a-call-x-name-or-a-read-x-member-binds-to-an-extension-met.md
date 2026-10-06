# 014 · C#: a call x.Name() or a read X.Member binds to an extension method or a type in the repo that the code cannot reach (a project with no reference to that assembly), which gives a false relation-undeclared-dependency that cannot be suppressed and can force a structural cycle

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts, Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/csharp.mts: extensionCall ~685-705, pushExtension :1337-1348, the member_access_expression 'receiver' branch :1097-1118, declaredNames/methodNames only from the file (collectDeclaredNames :618-640); src/relations/resolver.mts symbolFiles ~235-270; Yggdrasil source/cli/src/relations/pass.ts:700-744 (csharpProjectOptions/detectedUsesOf group files by .csproj, but only global usings and aliases go to assembleCsharpCandidates, never the reference closure)

## What
The C# extractor works on syntax only, and no candidate is checked against the assemblies reachable from the calling project. Reproduction (npm yg 6.1.0 with runes 1.0.0, one node per project, no relations): Case 1: src/Shared/CollectionExtensions.cs declares in namespace System.Collections.Generic `public static void AddRange<T>(this ICollection<T> t, IEnumerable<T> i)`; Billing and Catalog call `_lines.AddRange(more)` on List<string> and have no ProjectReference at all; `yg check`: FAIL billing→shared (Invoice.cs:6), catalog→shared (Product.cs:6). Control: the same extension in namespace Shared.Utils: PASS. Case 2: Shared really depends on Domain (ProjectReference + using) and declares `ForEach<T>(this IEnumerable<T>)` in namespace Shop; `lines.ForEach(...)` on List<int> in Domain gives domain→shared (Order.cs:8); declaring that relation gives `structural-cycle domain -> shared -> domain`. Case 3: the inherited property `protected IClock Clock` used as `Clock.Now` is read as the type Acme.Clock from another project with no ProjectReference: domain→shared (Order.cs:5). C# always prefers a matching instance method over an extension, and an inherited member over a type of that name, and none of these projects can reference the assembly pointed to. The verifier's corrections: (a) the jellyfin @305a964 examples in the finder's report are a wrong line attribution on an edge that really exists (Emby.Server.Implementations → Jellyfin.Extensions through the ProjectReference MediaBrowser.Model), not a false dependency; (b) a gate based on ProjectReference alone would give false negatives: the only 2 jellyfin edges outside that closure (fuzz/*/Program.cs) are real `<Reference Include=... HintPath=*.dll>` to assemblies from the repo; (c) green also comes from merging or nesting the nodes or moving the extension, all forced by a tool bug. The risks are recorded only in the internal notes of the Runes palette (reference/relations/csharp/csharp-extension-via-owned-namespace.md, csharp-local-shadows-type-name-silence.md). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-11/log.txt (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-11/repro.sh; fixtures case1, case1-control, case2, case2-cycle, case3; jellyfin-check.json).

## Why
relation-undeclared-dependency and structural-cycle cannot be suppressed (docs/cli-reference.md:2992, relations-flows-ports.md), so the cycle variant has no way out through editing relations. The documentation promises silence when a read may be wrong, and does not list these cases among the silent ones.

## Acceptance
- Owner candidates for C# references are limited to the reference closure of the calling project: ProjectReference, `<Reference>` to assemblies from the repo, and at least Directory.Build.props imports; cases 1, 2 and 3 give no edge, the control with a real reference still does.
- On jellyfin @305a964 no real edge between projects disappears (including fuzz/*/Program.cs through HintPath); a Runes release and a bumped pin in Yggdrasil.

## Evidence


