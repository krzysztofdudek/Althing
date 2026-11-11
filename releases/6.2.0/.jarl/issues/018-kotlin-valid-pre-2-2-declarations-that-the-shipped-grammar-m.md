# 018 · Kotlin: valid pre-2.2 declarations that the shipped grammar misreads are silently lost, so imports of them give no edges (an annotated annotation class, an annotated enum with one entry, an annotated data object and const val, a nested class with its constructor on the next line)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-zkoh
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/kotlin.mts, Runes/src/relations/extractors/kotlin-recover.mts, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/kotlin.mts:218-224 (DECLARATION_TYPES), :335-384 (declarationsOf); src/relations/extractors/kotlin-recover.mts:493-497 (damaged() requires an ERROR node), :520-523 (kotlinView returns the raw tree without ERROR); the tree-sitter-kotlin 1.1.0 grammar (Runes grammars/manifest.json:280-284); Yggdrasil docs/relations-flows-ports.md:82, :119, :129
**Branch:** jarl/018-kotlin-recovery
**Merged:** bf3c811 in ../../../Runes
**CI:** none

## What
Two causes. (1) At the top level the grammar reads as script statements, without an ERROR node: `@A… annotation class X` with no parameter list and no body, `@A enum class X { A }` with one entry, `@A data object X` with no supertype (all as annotated_expression) and `@A const val X = …` (assignment). declarationsOf does not see them, and recovery does not start, because there is no ERROR; the file declares nothing, so the import finds no declaring file. (2) A nested class with its primary constructor on the next line (ktfmt style) gives an ERROR in the class body; recovery from declarations cannot read the enclosing class and records the marker `Outer+*`, which silences every `import Outer.X`. Reproduction (npm @chrisdudek/yg 6.1.0 and @chrisdudek/runes 1.0.0, Node 24.11.1, two nodes lib and app, `yg check --json`): the controls give edges (a plain class, a bare `annotation class`, an annotated enum with several entries, an annotated class, unannotated `data object` and `const val`, an unannotated enum with one entry, `Reader`, a nested class with its constructor on the same line); nine imports are left without an edge: D1 (`@Qualifier @Retention annotation class`), D4 (`@Target annotation class`), D6 (an `@Serializable` enum with one entry), C1 (the same on one line), C7 (`@Keep annotation class`), E2 (`@Keep data object`), E14 (`@Keep const val`), Reader.Options (a nested class with `private constructor(...)` on the next line) and Reader.Token (its sibling). A probe with the shipped wasm: D1, D4, D6, C1, C7, E2 → annotated_expression, E14 → assignment, hasError=false and zero declarations; Reader.kt hasError=true and declares only com.acme.Reader and com.acme.Reader+*. Boundaries: an annotated annotation class with a parameter list is read, so is an annotated data object with a supertype, so is an enum with two entries; a top-level class with its constructor on the next line is read, a nested one is not. square/okhttp @406635f (26 nodes): 50 files in 8 modules import mockwebserver3.junit5.StartStop (an annotated annotation class), 0 edges to mockwebserver-junit5. square/moshi @889013e: FromJson.kt and ToJson.kt declare nothing (CardAdapter.java:18 and :20 silent), EnumJsonAdapter.kt:21 and :22 (JsonReader.Options, JsonReader.Token.STRING) silent, because JsonReader.kt is one ERROR node. Issue 213 (6.1.0) concerned only 2.2 constructs. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-15/log.txt (repro.sh, install/probe.mjs, variants/).

## Why
The error is always on the side of silence, but it switches off the undeclared-dependency check on very common Kotlin 1.x (every Dagger/Hilt qualifier, every JUnit marker annotation) and hides a whole dependency between modules in a popular repo. docs/relations-flows-ports.md:82 and the table of known limitations (:129) list only Kotlin 2.2 constructs, while :119 claims that an unknown construct becomes an ERROR node; shape (1) contradicts that.

## Acceptance
- An annotated_expression or assignment at the top level whose text starts with a declaration form (soft keyword) is treated as damage and goes to the existing lexical recovery; the imports D1, D4, D6, C1, C7, E2 and E14 give an edge.
- Recovery reads a nested class with its constructor on the next line; Reader.Options and Reader.Token give an edge.
- The table of known grammar limitations in docs/relations-flows-ports.md describes what remains; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: Kotlin imports now give an edge for annotated top-level declarations (a meta-annotated annotation class such as a Dagger or Hilt qualifier, an annotated enum with one entry, an annotated data object, expect class or const val) and for the nested types of a class where a nested class has its primary constructor on the line below its header (ktfmt style); the shipped grammar misread these declarations, so they were never declared and the imports stayed silent.

## Evidence

- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1513, pass 1513, fail 0, catalogue 465 cases, dist/ is fresh; npm run coverage: tests 1513, pass 1513, fail 0, all files 98.72 / 93.70 / 98.50, exit 0; merge bf3c811 (catalogue count conflict resolved to 462 + 3 = 465)

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 018: lib declares D1 (@Qualifier @Retention annotation class), D4 (@Target annotation class), D6 (@Serializable enum with one entry), C1 (the same on one line), C7 (@Keep annotation class), E2 (@Keep data object), E14 (@Keep const val) and Reader with nested classes Options and Token whose private constructors stand on the next line; app imports all nine. 6.1.0: no edge. Built: Use.kt lines 3 to 11 -> lib, all nine.

