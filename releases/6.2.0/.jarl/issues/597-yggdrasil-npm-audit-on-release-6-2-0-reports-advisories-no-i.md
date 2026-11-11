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

## Reviews
- **approve** · by rev-356b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1601-whty
  No Critical or Important finding. 356 line 1, 'release/6.2.0 takes vite 8.3.3 or later in source/cli and 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later in both lockfiles': holds, the second commit moved none of them (vite 8.3.8 and 6.4.6, @vitest/mocker 5.1.0, source-map-js 1.2.2). Line 2, 'Each open Dependabot update is taken on release/6.2.0 with a green check or refused with a recorded reason, and the two tree-sitter bumps say why CI failed': holds, repo-check on 5dfc1d4ab exits 0 (709 test files, branches 91.36%), and the refusals stand as round 1 reproduced them. Line 3, 'The CHANGELOG says what was updated under Security': holds, and the entry is now true against a clean install: docs audit 0; source/cli lists one advisory (GHSA-g3hv-75wg-m249) on the minimatch 10.2.6 nested under eslint, @eslint/config-array and @typescript-eslint/typescript-estree; the latest releases of those three still ask for minimatch ^10; npm audit --omit=dev is 0 and the production tree holds only minimatch 11.0.8 with brace-expansion 5.0.13, so the nested copy is not installed with the CLI (the tarball ships dist only). 597 line 1 re-run and recorded. Tried beyond the lines: minimatch 10.2.6 against 11.0.8 with { dot: true } on 166 patterns (every glob in the repository's graph files and the mapping tests, plus brace, extglob, class, negation, escape and dot-file edge cases) across the 3433 tracked paths and 24 odd ones, 573862 comparisons, 31043 matches: identical except two, both for an empty path against an extglob pattern ('**/!(*.ts)' and '?(a)*' matched '' in 10 and do not in 11), an input the CLI never passes. minimatch 11 asks for Node 20 or 22 and later, inside the CLI's own >=22; it adds one dependency, @isaacs/nonrecursive-glob-match 1.1.0 (BlueOak-1.0.0, same author). The second commit's lockfile moves are only these: brace-expansion 5.0.13, minimatch 11.0.8 with its new dependency and the three nested 10.2.6 copies in source/cli; vue and its packages 3.5.45 with @babel parser packages, @jridgewell/sourcemap-codec, nanoid and postcss in docs; all from the npm registry. No test, check or threshold changed. Minor: the worker's recorded proof says 9 moderate findings, npm audit counts 10 (the CHANGELOG states no count, so nothing published is wrong). Minor, wording: the entry says of the advisories that reached users only 'the one on brace-expansion did'; the minimatch advisory also reached an installed CLI through minimatch 10.2.6 until this move to 11, which the entry leaves the reader to infer from 'moves to 11'.

## Evidence

### Proof

- **ran (line 1b4bee1c3270):** cd docs && npm audit; cd source/cli && npm audit; npm ls minimatch · **saw:** docs: found 0 vulnerabilities. source/cli: 9 moderate, all minimatch 7.0.0-11.0.0 reached through eslint, @eslint/config-array and the typescript-eslint packages; minimatch 11.0.8 (runtime) and brace-expansion 5.0.13 are clean. The CHANGELOG Security entry names this one.
- **ran (line 1b4bee1c3270):** scripts/repo-check.sh in the dev container on 5dfc1d4ab · **saw:** exit 0, Coverage OK lines=97.47% statements=96.42% functions=96.77% branches=91.36%
- **ran (line 1b4bee1c3270):** on 5dfc1d4ab extracted into a scratch folder in the dev container: npm ci, then npm audit, in source/cli and in docs; npm audit --omit=dev and npm ls minimatch in source/cli; npm view of the latest eslint, @eslint/config-array and @typescript-eslint/typescript-estree; scripts/repo-check.sh in the worktree · **saw:** docs: found 0 vulnerabilities. source/cli: 10 moderate, one advisory (GHSA-g3hv-75wg-m249, minimatch 7.0.0 to 11.0.0), every one the minimatch 10.2.6 nested under eslint, @eslint/config-array and @typescript-eslint/typescript-estree or a package that depends on them; their latest releases still ask for minimatch ^10, so no in-range update closes it. npm audit --omit=dev: 0. The top-level minimatch is 11.0.8 with brace-expansion 5.0.13. The CHANGELOG Security entry names that advisory and why it stays. repo-check: exit 0, 709 test files passed, Coverage OK lines=97.47% statements=96.42% functions=96.77% branches=91.36%

### Notes

Assumed: minimatch 11.0.8 is taken as the CLI's direct dependency. The CLI calls it in one place, with the call minimatch(file, pattern, { dot: true }), and the tests that exercise glob matching stay green. The nested minimatch 10.2.6 under eslint and typescript-eslint (development tools) stays: it is fixed only in 11, and those packages declare ^10; the 9 moderate findings npm audit still lists in source/cli are that chain, named in the CHANGELOG.

