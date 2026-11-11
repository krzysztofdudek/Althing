# 490 · Runes: under autolib = false with no [lib], a use of the package's own crate name from a bin still resolves into src/lib.rs

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0413-rwnd
**Tags:** 1.1.1, runes, rust
**Files:** Runes/src/relations/extractors/resolve-path.mts
**Repo:** Runes
**After:** 488
**Found by:** w-runes-488-sonnet
**Where:** The 488 worker's report (2026-11-03): crateRootFor and dependencyFor keep the lib tree at src/lib.rs
**Branch:** jarl/490-autolib-and-corpus
**Worker:** w-490-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:35

## What
488 makes src/lib.rs no crate root under autolib = false without a [lib] table, but crateRootFor and dependencyFor still point the package's library at src/lib.rs, so use app::x from a bin can bind there.

## Why
A false edge into a file Cargo does not build as a library.

## Acceptance
Under autolib = false with no [lib], use <package>::x from a bin gives no edge into src/lib.rs, with a case red before and green after

## Changelog
- A bin that uses its own package name (`use app::x;`), and a package that depends by path on one, no longer get an edge into `src/lib.rs` when the package writes `autolib = false` and no `[lib]` table, since Cargo builds no library there; a `[lib]` table keeps the library.

## Reviews
- **approve** · by rev-490-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1051-ahro
  490 line 1, read and re-run: 'Under autolib = false with no [lib], use <package>::x from a bin gives no edge into src/lib.rs, with a case red before and green after' holds: two of the three new cases fail on release/1.1.0 and pass on the branch, the third keeps the [lib] table's edge, and fourteen layouts of my own behave as Cargo does. 527 line 1, read and re-run: 'The three reasons say what the pinned clones show, the hiredis entry matches on gcc and on clang, and an entry that matches nothing fails the run under --strict, with a test' holds: the three reasons agree with react at its pin, hiredis is explained under real gcc, and a stale entry fails gate and oracles under --strict and only there. Tried to get a stale entry past --strict on the built tool (another oracle's kind in a C repository, a * entry beside the exact one, the gate command, a + entry, verify): only the + entry and verify pass, and the issue asks for oracle entries only. No stale entry found: none in the routine tier under the typescript, python, cargo and c oracles, none in react. The message normaliser is a fair check, not a weakened one: it drops only gcc's echo of the directive and one pair of surrounding quotes, and the file, line, column and text still have to match. Minor: .github/workflows/ci.yml:109 and corpus/explained.md:16 still describe --strict and unused entries as before (a skipped oracle fails; unused entries are named), and do not say that an unused entry now fails a --strict run. Minor: test/corpus.test.mjs:160 proves the failure through the oracles command, while CI runs gate; I ran gate by hand and it fails the same way. Not checked: a real clang (none on this machine; the clang form is proved by a stub only), the go and csharp oracles (no toolchain), the heavy tier other than react, Windows. Not a finding of this change: react's oracle run fails on release/1.1.0 and on the branch alike with 1032 unexplained typescript:mismatch lines, the subject of issue 526.

## Evidence

### Proof

- **ran (line 40ce14f3975d):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs, at the commit that adds the cases and before the fix · **saw:** pass 100, fail 2: rust-autolib-off-own-crate-name-from-bin-silence and rust-autolib-off-path-dependency-without-lib-silence fail with 'unexpected cross-owner edge' into util; the [lib] guard case passes
- **ran (line 40ce14f3975d):** npm run check, on the clean committed tip · **saw:** tests 2114, pass 2113, fail 0 (1 skipped), dist/ is fresh; the matrix and the catalogue count 684 pass, the two silence cases green
- **ran (line 40ce14f3975d):** git archive of 6495ef4's tip 55310c0, npm ci, npm run build, npm run grammars, node --test 'test/**/*.test.mjs'; then the three new cases and the matrix file copied onto a git archive of release/1.1.0 and node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs there · **saw:** branch: tests 2114, pass 2113, fail 0, skipped 1, and the rebuilt dist is identical to the committed one. base: rust-autolib-off-own-crate-name-from-bin-silence and rust-autolib-off-path-dependency-without-lib-silence fail, rust-autolib-off-lib-table-own-crate-name-from-bin-edge passes. Fourteen layouts of my own through the case runner, base then branch: extern crate, an integration test, a hyphenated name, edition 2015, a workspace dependency and a renamed dependency without a library go from an edge to silence; a [lib] table, autolib = true, no autolib key, a commented-out key and crate:: keep their edge; a no-library package whose own name is also a path dependency now binds the dependency

### Notes

Assumed: the review's wording 'react-14' for the false lockfile claim is not what the pinned react commit shows (react-14 has a yarn.lock); the reason that names a lockfile the fixture lacks is fixtures/eslint-v10 (package.json, no yarn.lock), so that entry is the one corrected. Assumed: the hiredis answer is made compiler-neutral in the oracle (gcc's directive echo and the quotes dropped) rather than by loosening how entries match, since entries match exactly by design. Assumed: a Rust package without a library gives a null library tree, so its own crate name falls through to the dependency and edition-2015 forms instead of returning silence at once.

