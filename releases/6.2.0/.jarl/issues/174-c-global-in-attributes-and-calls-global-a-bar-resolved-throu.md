# 174 · C#: global:: in attributes and calls ([global::A.Bar] resolved through enclosing namespaces; [global::Foo], global::X.Member() without an edge; a nested tuple in a generic argument)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 156, 161
**Found by:** runes-138
**Where:**
**Branch:** jarl/173-cargo-and-global
**Merged:** cc62301 in ../../../Runes
**CI:** none

## What
After 156 and 161: [global::A.Bar] in an attribute is first looked up in the enclosing namespaces and usings (a possible false edge, the same bug as 156 in another position); [global::Foo] and global::X.Member() give no edge; new List<List<(Foo F, int I)>>(n) gives no edge. General handling of qualified names has no tests (state from before the patch).

## Why
A possible false edge in attributes and a few silent dependencies.

## Acceptance
global:: in attributes and calls binds only to global types; the nested tuple gives edges; catalogue cases for each form, with silence cases.

## Changelog
- Fixed: in C#, an attribute written after `global::` (`[global::A.Bar]`, `[global::Foo]`, `[global::Gen<Order>]`) binds only an attribute of the global namespace; the qualified form used to bind a same-named attribute of an enclosing namespace or a using first, and the single-name and generic forms gave no edge.
- Fixed: in C#, a static member reached through `global::` (`global::Clock.Now()`, `global::Billing.Ledger.Post(x)`, `global::X.Prop`, as generated gRPC and protobuf code writes them) depends on its type in the global namespace; it used to give no edge.
- Fixed: in C#, a tuple type with named elements one or two generic levels deep in an expression (`new List<List<(Order Item, int Index)>>(n)`, `Make<List<(Invoice Doc, int I)>>(n)`) gives edges for its element types and for the enclosing generic types, as the one-level form does since 161; the element names never do.

## Evidence

jarl: emitting the names of the enclosing generic types in a nested tuple (Page in List<Page<(…)>>) accepted — these are real types in a type position
- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1694, pass 1694, fail 0, catalogue 516 cases, dist/ is fresh; npm run coverage: tests 1694, pass 1694, fail 0, all files 98.80 / 94.39 / 98.78, exit 0; merge cc62301 (catalogue count conflict resolved to 505 + 11 = 516; rebuilt dist matches; d06be20 after the approve changes comments only)

