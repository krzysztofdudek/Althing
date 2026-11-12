# 645 · Runes, C#: Worker.Options.Parse() gives nothing when the file declares Worker, a name-shadow check ignores project reach, and an ambiguous extension name could be decided by reading the receiver's type

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1952-eoyp
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**After:** 549
**Found by:** jarl
**Where:** w-549-fable, the C# rest package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
Each loses or keeps an edge the compiler decides otherwise; 3 of the 12 jellyfin edges 595 aimed at stay lost.

## Acceptance
[test] Worker.Options.Parse() in a file that declares Worker binds the nested type, a name-shadow check counts only declarations in reach, and an ambiguous extension call whose receiver type is written binds the one that takes it, a catalogue case each, red before and green after · by: npm run check

## Changelog
- Fixed: C#: `Worker.Options.Parse()` in a file that declares `Worker` reads `Worker` as a type, so the nested type it names gives its edge; a `using` that names a nearer namespace is voided only by a namespace the calling project can see, so the `using` binds the farther namespace when the nearer one lives in a project out of reach; and `o.Tag()` on a receiver whose type is written chooses, among extension methods of one name in several imported namespaces, the one whose first parameter takes that type, where it used to give no edge.

## Evidence

### Proof

- **ran (line 60c1392e0f5c):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (Runes, commit 738d8c0, before the fix) · **saw:** fail 5: csharp-file-type-dotted-receiver-inherited-nested-type-edge (Worker.cs:4->core not emitted), csharp-published-type-dotted-receiver-..., csharp-using-namespace-hidden-by-unreachable-namespace-edge (Use.cs:4->Far not emitted), csharp-extension-ambiguous-names-receiver-type-takes-one-edge and ...-receiver-derived-type-edge (Page.cs:7->a not emitted)
- **ran (line 60c1392e0f5c):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f); corpus verify --tier all · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; corpus verify: passed

### Notes

Assumed: the case with a public Worker (class Worker : WorkerBase in the same file, Worker.Options.Parse()) is dropped: for a type the file declares and publishes the receiver reads Worker, a type of the file's own node, and a nested type is named through its outer type's node, so the edge to the base class already stands at the base list (Worker.cs:2); only a file type, which no key names, needed the extra reading. The receiver is read for a name the file declares as a type and as nothing else (a type name that is also a field or a local keeps the old guard).

Assumed: an extension call narrows its definers by the receiver's written type only when the reading names two or more files and the receiver's type binds one type of the repository; the receiver parameter of an extension method is recorded at the end of its shape after a | (rev 41), nothing for a type parameter, an array, a tuple or an extension block's receiver. A parameter is refused only where the written types say for certain (the type itself, a base, an implemented interface, an alias or a type with an implicit conversion refuse nothing). SymbolTable.hasNamespace gains an optional file filter, and TargetHint's takes gains the optional receiver; both are in docs/api.md.

