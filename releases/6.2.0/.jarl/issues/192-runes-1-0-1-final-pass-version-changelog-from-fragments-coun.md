# 192 · Runes 1.0.1: final pass (version, CHANGELOG from fragments, counters in README and CLAUDE.md)

**Status:** done
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1612-wmlg
**Tags:** runes, release
**Files:** Runes/package.json, Runes/package-lock.json, Runes/src/version.mts, Runes/CHANGELOG.md, Runes/README.md, Runes/CLAUDE.md
**Repo:** ../../../Runes
**Found by:** jarl
**Where:**
**Branch:** jarl/runes-1.0.1-final
**Merged:** 0795e02 in ../../../Runes
**CI:** none

## What
After all the patch's fixes are merged: package.json and package-lock.json (two places) at 1.0.1, src/version.mts RUNES_VERSION with a rebuilt dist/version.mjs, a ## [1.0.1] section in CHANGELOG from the changelog fragments recorded on the issues (jl changelog), README (status line, number of catalogue cases) and CLAUDE.md (number of cases), npm run check and coverage. No push and no tag.

## Why
Releasing Runes 1.0.1 on the owner's word requires a ready branch.

## Acceptance
release/1.0.1 has version 1.0.1 in all places, a CHANGELOG section with an entry for every merged issue that has a fragment, current numbers; npm run check and coverage green.

## Evidence

- **ran (history):** npm run check (Runes-final, jarl/runes-1.0.1-final) · **saw:** exit 0; tests 1736 pass 1736 fail 0; dist/ is fresh
- **ran (history):** npm run coverage · **saw:** exit 0; 1736/1736 pass; all files 98.79% lines, 94.49% branches, 98.80% functions
- **ran (history):** find reference/relations -name '*.md' | wc -l · **saw:** 522 (README status and catalogue line, CLAUDE.md updated from 460)
- **ran (history):** grep version package.json package-lock.json src/version.mts dist/version.mjs · **saw:** 1.0.1 in all five places; CHANGELOG top section [1.0.1] - 2026-10-02 from fragments of 31 merged Runes issues
- **ran (history):** npm run check after round-2 CHANGELOG commit 3dd9b20 · **saw:** exit 0; tests 1736 pass 1736 fail 0; dist/ is fresh
- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1736, pass 1736, fail 0 (includes the version test: package.json, RUNES_VERSION and the top CHANGELOG section all 1.0.1), dist/ is fresh; npm run coverage: tests 1736, pass 1736, fail 0, all files 98.81 / 94.49 / 98.80, exit 0; merge 0795e02 (clean); nothing pushed or tagged

