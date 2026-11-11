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

## Evidence

### Proof

- **ran (line 7ab7952d57ac):** node --test test/corpus.test.mjs, at the commits that add the tests and before the fixes · **saw:** the strict test fails at the strict assertion (0 !== 1, the plain run passed with UNUSED named); the gcc and clang #error tests fail with the UNEXPLAINED answer carrying '#error "stop here"' or the quotes
- **ran (line 7ab7952d57ac):** npm run check on the tip; node scripts/corpus.mjs oracles --only hiredis --strict on the pinned clone · **saw:** check: tests 2114, pass 2113, fail 0; hiredis: ok, 1 disagreements, 1 explained, passed under --strict; the three reasons were read against the pinned react commit (flight and flight-esm predev/prestart/prebuild copy ../../build/oss-experimental/* into node_modules; eslint-v10 has no lockfile)

