# 597 · Yggdrasil: npm audit on release/6.2.0 reports advisories no issue covers: brace-expansion 5.0.9 (hi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-exhx
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-356-fable
**Where:** the review of 356
**Branch:** jarl/356-dependency-alerts
**Worker:** w-356-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 14:45

## What
Yggdrasil: npm audit on release/6.2.0 reports advisories no issue covers: brace-expansion 5.0.9 (high) and minimatch 10.2.6 (moderate) among the CLI's runtime dependencies, and vue with @vue/server-renderer 3.5.28 (high) in docs

## Why


## Acceptance


[test] npm audit in source/cli and in docs lists no advisory that an in-range update closes, and every advisory left is named in the CHANGELOG with why it stays · by: cd source/cli && npm test

## Evidence

### Proof

- **ran (line 1b4bee1c3270):** cd docs && npm audit; cd source/cli && npm audit; npm ls minimatch · **saw:** docs: found 0 vulnerabilities. source/cli: 9 moderate, all minimatch 7.0.0-11.0.0 reached through eslint, @eslint/config-array and the typescript-eslint packages; minimatch 11.0.8 (runtime) and brace-expansion 5.0.13 are clean. The CHANGELOG Security entry names this one.
- **ran (line 1b4bee1c3270):** scripts/repo-check.sh in the dev container on 5dfc1d4ab · **saw:** exit 0, Coverage OK lines=97.47% statements=96.42% functions=96.77% branches=91.36%

### Notes

Assumed: minimatch 11.0.8 is taken as the CLI's direct dependency. The CLI calls it in one place, with the call minimatch(file, pattern, { dot: true }), and the tests that exercise glob matching stay green. The nested minimatch 10.2.6 under eslint and typescript-eslint (development tools) stays: it is fixed only in 11, and those packages declare ^10; the 9 moderate findings npm audit still lists in source/cli are that chain, named in the CHANGELOG.

