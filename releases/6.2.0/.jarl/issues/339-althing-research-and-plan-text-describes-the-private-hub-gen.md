# 339 · Althing: research and plan text describes the private hub generically before the first push

**Status:** in-progress
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, migration
**Files:** 
**Repo:** ../..
**Found by:** jarl
**Where:**
**Branch:** main
**Worker:** haiku-339
**Since:** 2026-10-20 06:17

## What
The residual-identity review found passages in research reports, plans and rulings that describe the contents, CI or remote of the private hub, or call it by a role. They say instead that some research stays private, or describe the thing generically.

## Why


## Acceptance
Each passage the review flagged under the private hub is rewritten generically or cut, with no change of what the text proves; a rail run and yg check stay green

## Evidence

- **ran:** git grep for private-hub terms in the nine edited research files; git diff --cached; git commit with the rails hook; yg check via the commit hook · **saw:** 9 files changed, 35 insertions, 35 deletions; yg check PASS 2504 pairs verified; rails staged and message clean; remaining hits are the out-of-scope README provenance lines and generic words

