# 700 · Runes: the 46 Rust catalogue cases that do not build under rustc are rewritten so each builds, every expectation change reviewed

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-ovqz
**Tags:** runes, rust, catalogue
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-645-sonnet, 651 (ruling rust-fixtures-build-list)
**Branch:** jarl/700-rust-cases-build
**Worker:** w-700-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
Moved from issue 700 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A catalogue case that does not compile cannot show that rustc agrees with the edge it expects; the build test's list makes each one visible until it is fixed.

## Acceptance
[test] The build test's list of Rust cases that do not build is empty apart from the case unparsable on purpose, and each case whose expectation changed says why in its own text · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Evidence

