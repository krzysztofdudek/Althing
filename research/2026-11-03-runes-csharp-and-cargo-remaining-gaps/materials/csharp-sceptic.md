# C# sceptic: the 15 findings of the C# audit, checked again

Sceptic: skp-runes-csharp-opus, a fresh Opus instance that did not run the audit. Trees: `.cache/audit-runes-5227538` and `.cache/audit-runes-v1.0.0`, read only.

## What was run

- The auditor's 43 probes through `csharp-probe-runner.mjs` on both trees, the same commands as in `csharp-audit.md`. The outputs, `sceptic/rerun-5227538.txt` and `sceptic/rerun-v1.0.0.txt`, are byte for byte the auditor's `csharp-probe-output-*.txt`.
- The diff between the two trees has five probes: p20 (fixed by 138), p22 (silence before, a false edge now), p38 (the alias edge added, the false line 4 kept), p40 (silence before, a wrong-arity edge now), p43 (line 4 fixed). Every other probe gives the same edges on v1.0.0, so the pre-existing labels hold.
- Four probes of my own in `sceptic/`, run on both trees (`sceptic/sceptic-probes-*.txt`, the same output on both):
  - s01: a lambda return type `Cell () => null` with nothing else naming `Cell` on the line gives no edge;
  - s02: `ReferenceOutputAssembly="false"` with two public `App.Clock` types, without the internal `Program` that mixes p21 with issue 489, still gives silence;
  - s03: a domain `Route` class and ASP.NET's `[Route]` give a false edge to the domain node;
  - s04: a compilable version of p39 still gives silence.
- I read the code at every place the audit cites for the findings below; each claim matches the code.

## The probes, checked against the specification

Each expectation was read against the C# standard (ECMA-334, 7th edition, as cited by section) and found right, with these notes:

- p11, p29, p41: the extension in each probe could not even apply to the receiver's type, so C# gives no edge to it for two reasons, not one. Runes binds an extension call by its name alone (`extensionCall`, `csharp.mts:920-940`), so the finding holds either way.
- p21: top-level statements compile to an `internal` `Program`, so Tests could not see either `Program` in real C#. The probe mixes this finding with 489 (internal types). s02 shows the gap without that confound.
- p39: Web writes `using App.Shared;` for a namespace it cannot see, which is CS0246, so the probe does not compile. s04 compiles and shows the same silence. The header of `csharp-reach.mts` (line 15) says that `PrivateAssets` and `DisableTransitiveProjectReferences` are not read on purpose and fail open. `ReferenceOutputAssembly` is not mentioned there.
- p16 (file-local types): the auditor wrote this rule from memory. The published C# 11 feature specification (dotnet/csharplang `proposals/csharp-11.0/file-local-types.md`, Lookup) says: "if the set of accessible members contains file-local types, all members which are not file-local types are removed from the set", and its remarks say this lets "a file-local type to shadow a namespace or a non-file-local type". The finding stands.
- p26 is a false PASS. Its `System.Func<Cell>` return type already names `Cell` on the line. s01 and p15 line 8 show that an explicit lambda return type is never read (no `lambda_expression` case in `emitTypeNode`; the comment at `csharp.mts:1281-1282` covers lambda parameters only). This is a 16th gap that the audit did not list. It is low and has the same shape as csharp-1-reftypes.

## Verdicts

| Id | Verdict | Severity after | Reason |
|---|---|---|---|
| csharp-1-nestencl | confirmed | high | §7.6.1 reads the nested types of each enclosing type, and of their bases, before any namespace member; the loop at `csharp.mts:1801-1807` reads only namespaces, aliases, the global reading and usings. Reproduced on p01, p02, p19, p31, p38; same on v1.0.0. A nested `Command`, `Result` or `Status` beside a shared type of that name is a usual layout. |
| csharp-1-inhermem | confirmed | high | §12.8.4: member lookup in the enclosing type, inherited members included, comes before namespaces. `collectDeclaredNames` sees only the file. `User.FindFirst` in a controller with a domain `User` is everyday ASP.NET code. The false edge is often hidden at node level when the controller already depends on the domain node, but it still lands. |
| csharp-1-basenest | confirmed-with-a-changed-severity | low | The rule is right (§7.6.1, "T or any of its base types"). The lost edge of p03 line 4 points to the node of the base class, which the base list on line 3 already reaches. A visible effect needs a second type of the same name in an enclosing namespace or import (p03), or the rarer `Derived.Options` (p32). |
| csharp-1-arityign | confirmed | medium | §7.6.1 matches K type arguments. Reproduced on p05, p06, p17, p40. The p40 form is a regression: v1.0.0 gives silence, 5227538 gives `Api.cs:2->core`. A pair such as `Result`/`Result<T>` or `IRepository`/`IRepository<T>` split across projects that share a namespace gives both a false edge and a lost one. |
| csharp-1-delegate | confirmed-with-a-changed-severity | low | §21: a delegate declaration declares a type, and `TYPE_DECLARATION_TYPES` (`csharp.mts:120-127`) leaves it out. Modern code mostly uses `Func`/`Action` or framework delegates. A lost edge to a custom delegate is usually covered by other uses of its node, and the false edge (p08) needs a delegate and a class of one name. |
| csharp-1-attrread | confirmed | medium | §23.3: of the two readings, the one that is a type derived from `System.Attribute` is the result. s03 shows a common form, beyond p09's contrived entity: a domain `Route`, `Table`, `Column` or `Index` class beside the framework attribute of the same short name gives a false edge on every use. |
| csharp-1-extinstm | confirmed | medium | §12.8.10.3: extension methods are considered only when no applicable instance method exists. Runes binds an extension call by name alone, and drops it only for a method declared in the same file. Common names (`Validate`, `Publish`, `Save`) collide. |
| csharp-1-patterns | confirmed-with-a-changed-severity | low | The grammar's shapes are as the audit says, and the edges are lost (p14 lines 4 and 8, p27, p28, p43 line 5). These are lost edges only, never false ones, and the same file usually names those types elsewhere. That puts it with reftypes and queryrng, which the audit rated low. |
| csharp-1-usingsta | confirmed | low | §14.5.4: `using static` imports the nested types and the extension methods of the type. Reproduced on p12, p13, p35. Uncommon for nested types. |
| csharp-1-reftypes | confirmed | low | No `ref_type` case; p23, p24 and p15 lines 4 to 6 give nothing. Ref returns are rare outside performance code. |
| csharp-1-queryrng | confirmed | low | §12.20.3.2: an explicit range variable type is a type position. `from_clause` is read for the name only (`csharp.mts:829`). Rare. |
| csharp-1-fnptrtyp | confirmed | low | `function_pointer_type` falls to the default case (`csharp.mts:1069`). Unsafe interop only. |
| csharp-1-filelocl | confirmed | low | Checked against the published feature specification (quoted above): the file-local type wins in its own file. The probe gives a false edge on both trees. Rare. |
| csharp-1-refnoout | confirmed | low | s02 shows it without p21's confound with 489. The output is the same on v1.0.0, which has no reference graph, so this is not a regression: the graph only fails to remove a false ambiguity. The `PrivateAssets` half is a documented fail-open choice (`csharp-reach.mts:15`) and only matters in a layout like s04. |
| csharp-1-compremv | confirmed | low | The `Compile` reader (`csharp-reach.mts:261-272`) reads `Include` only, and the own-project preference (`resolver.mts:238-246`) then keeps the removed file. v1.0.0 gives silence on p22; 5227538 gives `Api.cs:3->Old`, a false edge where there was a lost one. This is a regression. It needs files under a `Compile Remove` that belong to no nested project and repeat a type of a referenced project, which is uncommon. |

## Counts

- Verdicts: 12 confirmed, 3 confirmed with a changed severity (basenest, delegate and patterns, each medium to low), 0 refuted.
- Severity after this check: 2 high, 3 medium, 10 low. The audit had 2 high, 6 medium and 7 low.
- Regressions that survive: csharp-1-compremv (p22) and the alias-target form of csharp-1-arityign (p40). csharp-1-refnoout gives the same output as v1.0.0 and is not a regression.
- Not in the audit: the explicit lambda return type (s01, p15 line 8) gives no edge, a low, pre-existing gap. It was hidden by the false PASS of p26. It is not added to `csharp-findings.json`, whose items this check may only annotate.
