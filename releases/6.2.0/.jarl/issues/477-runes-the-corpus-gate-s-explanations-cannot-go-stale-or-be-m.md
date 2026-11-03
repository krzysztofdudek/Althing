# 477 · Runes: the corpus gate's explanations cannot go stale or be mistyped silently, and one command runs edges and oracles

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, corpus, 1.1.0
**Files:** Runes/scripts/corpus.mjs, Runes/test/corpus.test.mjs, Runes/package.json, Runes/.github/workflows/ci.yml
**Repo:** ../../../Runes
**After:** 184
**Found by:** rev-runes-184b-fable
**Where:** Review of 184 (2026-11-03)

## What
An oracle explanation is keyed by the import specifier but not by the answers, so it keeps explaining a site after Runes moves to another wrong file. A mistyped oracle kind (typescript:false-edges) passes the pattern and explains nothing, silently. The acceptance of 184 asks for one command; the gate is npm run corpus and npm run corpus:oracles. The CI cache key is the manifest hash alone.

## Why
An explanation that outlives its reason is a false green waiting to happen, and a gate run in two halves is easy to run in one.

## Acceptance
- An oracle explanation names the answers it explains and stops matching when either answer changes, with a test
- An unknown kind in explained.md is refused with its line, with a test
- One command runs the edge gate and the oracles, locally and in CI

## Evidence

From CI run 41552714666 (2026-11-03), the first with a Go toolchain: the Go oracle lists packages with go list ./..., which skips testdata directories, so an import of a package under testdata (gin) reads as a false edge; explained in bf4a24d, but the oracle should ask go list for the import path itself; part of this issue

