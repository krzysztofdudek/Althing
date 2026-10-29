# 377 · Gard: gard repos sync clones each declared repo into its directory

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, rig, workplace
**Files:** Gard/src/rig/sync.mjs, Gard/test/sync.test.mjs
**Repo:** ../../../Gard
**After:** 376
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section The manifest: the clone address is the one the world knows, and a computer that reaches a host through another key uses git's own url insteadOf

## What
For every repo of the manifest: a missing directory is cloned from its url (git applies the computer's url insteadOf by itself), an existing clone is checked to have that origin and is reported if it differs, a non-empty directory that is not that repository is refused and never overwritten, and a repo whose branch differs from the declared one is reported. Fetching is explicit (--fetch). The answer lists each repo with its state.

## Why
A colleague or a product owner gets the whole application from one rig; Gard must never overwrite somebody's work while doing it.

## Acceptance
- A test syncs a rig of two repos from bare origins, then syncs again with no change, then meets a foreign directory and refuses it without touching it
- A test with a url insteadOf in a fixture git config clones through the rewritten address and records the declared one

## Evidence

