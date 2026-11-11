# 527 · Runes: four corrections to the corpus gate's explanations and warnings after 477

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0501-szeb
**Tags:** runes, corpus
**Files:** Runes/corpus/explained.md, Runes/scripts/corpus.mjs
**Repo:** Runes
**Found by:** rev-runes-477-opus
**Where:** Review of 477 (2026-11-03)
**Branch:** jarl/490-autolib-and-corpus
**Worker:** w-490-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:35

## What
Two node-loader reasons in explained.md omit that those react fixtures copy the build output into their own node_modules; one fixture reason claims a lockfile react-14 does not have; the hiredis entry quotes gcc's exact error text, so a machine with clang reports a new disagreement; an entry that matches nothing is only warned about, so stale entries can pile up.

## Why
An explanation that says something untrue, or that only one compiler reproduces, weakens the gate's record.

## Acceptance
The three reasons say what the pinned clones show, the hiredis entry matches on gcc and on clang, and an entry that matches nothing fails the run under --strict, with a test

## Reviews
- **approve** · by rev-490-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1051-ahro
  490 line 1, read and re-run: 'Under autolib = false with no [lib], use <package>::x from a bin gives no edge into src/lib.rs, with a case red before and green after' holds: two of the three new cases fail on release/1.1.0 and pass on the branch, the third keeps the [lib] table's edge, and fourteen layouts of my own behave as Cargo does. 527 line 1, read and re-run: 'The three reasons say what the pinned clones show, the hiredis entry matches on gcc and on clang, and an entry that matches nothing fails the run under --strict, with a test' holds: the three reasons agree with react at its pin, hiredis is explained under real gcc, and a stale entry fails gate and oracles under --strict and only there. Tried to get a stale entry past --strict on the built tool (another oracle's kind in a C repository, a * entry beside the exact one, the gate command, a + entry, verify): only the + entry and verify pass, and the issue asks for oracle entries only. No stale entry found: none in the routine tier under the typescript, python, cargo and c oracles, none in react. The message normaliser is a fair check, not a weakened one: it drops only gcc's echo of the directive and one pair of surrounding quotes, and the file, line, column and text still have to match. Minor: .github/workflows/ci.yml:109 and corpus/explained.md:16 still describe --strict and unused entries as before (a skipped oracle fails; unused entries are named), and do not say that an unused entry now fails a --strict run. Minor: test/corpus.test.mjs:160 proves the failure through the oracles command, while CI runs gate; I ran gate by hand and it fails the same way. Not checked: a real clang (none on this machine; the clang form is proved by a stub only), the go and csharp oracles (no toolchain), the heavy tier other than react, Windows. Not a finding of this change: react's oracle run fails on release/1.1.0 and on the branch alike with 1032 unexplained typescript:mismatch lines, the subject of issue 526.

## Evidence

### Proof

- **ran (line 7ab7952d57ac):** node --test test/corpus.test.mjs, at the commits that add the tests and before the fixes · **saw:** the strict test fails at the strict assertion (0 !== 1, the plain run passed with UNUSED named); the gcc and clang #error tests fail with the UNEXPLAINED answer carrying '#error "stop here"' or the quotes
- **ran (line 7ab7952d57ac):** npm run check on the tip; node scripts/corpus.mjs oracles --only hiredis --strict on the pinned clone · **saw:** check: tests 2114, pass 2113, fail 0; hiredis: ok, 1 disagreements, 1 explained, passed under --strict; the three reasons were read against the pinned react commit (flight and flight-esm predev/prestart/prebuild copy ../../build/oss-experimental/* into node_modules; eslint-v10 has no lockfile)
- **ran (line 7ab7952d57ac):** node --test test/corpus.test.mjs on the branch's tree and with the branch's test file on release/1.1.0; node scripts/corpus.mjs gate|oracles|verify --only hiredis --strict with gcc 15.2 and hand-made explanation files; node scripts/corpus.mjs oracles --tier routine; node scripts/corpus.mjs oracles --only react on branch and base; ls and package.json of fixtures/eslint-v10, eslint-v9, flight-esm, flight in react at 7c6ac13e · **saw:** branch: corpus tests pass. base: the stale-entry test and the gcc and clang #error tests fail. hiredis with real gcc: 1 disagreements, 1 explained, exit 0 under --strict. A stale c entry, a stale typescript entry in a C repository and a stale * entry beside the exact one each print UNUSED and exit 1 under gate --strict and oracles --strict, exit 0 without --strict; a stale + entry and verify --strict are not judged, as the issue leaves them. Routine tier: no UNUSED line in any of 25 repositories (go and csharp oracles skipped here, no toolchain). react: no UNUSED line, 543 explained on branch and base alike; both fail on the same 1032 typescript:mismatch lines that issue 526 is about. Pinned react: fixtures/eslint-v10 has a package.json and no lockfile, eslint-v9 has a yarn.lock; flight-esm has predev and prestart, flight has predev and prebuild, each copying ../../build/oss-experimental/* into node_modules; neither declares the package

