# 527 · Runes: four corrections to the corpus gate's explanations and warnings after 477

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0501-szeb
**Tags:** runes, corpus
**Files:** Runes/corpus/explained.md, Runes/scripts/corpus.mjs
**Repo:** ../../../Runes
**Found by:** rev-runes-477-opus
**Where:** Review of 477 (2026-11-03)

## What
Two node-loader reasons in explained.md omit that those react fixtures copy the build output into their own node_modules; one fixture reason claims a lockfile react-14 does not have; the hiredis entry quotes gcc's exact error text, so a machine with clang reports a new disagreement; an entry that matches nothing is only warned about, so stale entries can pile up.

## Why
An explanation that says something untrue, or that only one compiler reproduces, weakens the gate's record.

## Acceptance
The three reasons say what the pinned clones show, the hiredis entry matches on gcc and on clang, and an entry that matches nothing fails the run under --strict, with a test

## Evidence

