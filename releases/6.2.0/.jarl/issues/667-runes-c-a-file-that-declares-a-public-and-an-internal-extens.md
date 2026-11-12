# 667 · Runes, C#: a file that declares a public and an internal extension method of one name is dropped wh…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2152-kfpy
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-549c-opus
**Where:** the review of 549, 552, 555, 559, 577, 584, 594, 595, 619, 628, 636
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes, C#: a file that declares a public and an internal extension method of one name is dropped whole as a definer for a caller of another assembly that is no friend, because the reach filter reads the file-level internal:<key> mark (internalIn, src/relations/resolver.mts:309-316, through withinReach at :249). So a call only the public method takes loses its edge. Ext declares public static class A { public Tag(this Order o); internal Tag(this Order o, string k) } in App.Web, Lib declares Tag(this Order, string) in App, and Web (referencing both) calls o.Tag(): release/1.1.0 gives src/Web/Page.cs:4->Lib (a false edge) and no Ext edge; the branch gives neither (silence). The compiler binds A in Ext. Rev 38's per-method - mark in shapes: carries what the filter would need.

## Why


## Acceptance


[test] A file declaring a public and an internal extension method of one name stays a definer for a caller of a non-friend assembly through its public method, while the internal one stays out of reach, as catalogue cases, red before and green after · by: npm run check

## Changelog
- Fixed: C#: a private extension method (`static void Tag(this Order o)` in a static class) counts for calls in its own file only, and a file that declares a public and an internal extension method of one name stays a definer through the public one for a caller of another assembly that is no friend; a call that only the internal method of a non-friend assembly takes no longer binds it.

## Evidence

### Proof

- **ran (line aa479d1d0a29):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (Runes, commit 471e35e, before the fix) · **saw:** fail csharp-public-and-internal-extension-method-one-file-public-call-edge: Page.cs:4->Ext not emitted (got no edge for the call)
- **ran (line aa479d1d0a29):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f) · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions
- **ran (line aa479d1d0a29):** the branch's catalogue and matrix test files copied into a scratch extraction of c5124ca, node --test test/relations/extractors/<language>-name-resolution-matrix.test.mjs; then on a scratch extraction of 90c330f: npm run build, npm run grammars, node --test --test-concurrency=6 on every test file with rustc and cargo 1.99.1 on PATH, dist compared with the committed dist · **saw:** before: csharp-public-and-internal-extension-method-one-file-public-call-edge fails, -internal-call-binds-other-edge passes on both; after: 2649 tests, 2648 pass, 0 fail, 1 skipped (go not installed), the two rustc build tests ran and passed, rebuilt dist identical to the committed one

