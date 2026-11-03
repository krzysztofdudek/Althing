# 473 · Runes: three edge gaps the corpus found (airflow UI tests mapped by a referenced tsconfig, next-intl semver ranges bound to workspace packages, `jest` extensionless ESM imports bound to .mjs)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 184
**Found by:** w-runes-184-opus
**Where:** The 184 worker's corpus run (2026-11-02): airflow UI 120 references, next-intl 11, `jest` 2
**Branch:** jarl/473-ts-corpus-gaps
**Worker:** w-runes-473-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/Runes-473
**Since:** 2026-11-03 01:21

## What
In airflow's UI, Runes misses the tests/* paths that the first referenced tsconfig maps. In next-intl, a dependency given as a semver range is bound to the workspace package of that name, where pnpm would install it from the registry. In jest, an extensionless ESM import binds to a .mjs file.

## Why
The first loses real edges, the second and third add edges the real tools do not resolve.

## Acceptance
- Each of the three is fixed or documented as a silence, with a catalogue case each, red before and green after
- The corpus goldens of airflow, next-intl and jest change only by the lines these fixes explain

## Changelog
- Fixed: a file that several referenced tsconfig projects include now reads the paths of the first project in the order of references, so imports through a solution-style tsconfig's mapped names (Airflow UI's `tests/e2e/fixtures`) bind where they were silent; a consumer's graph shows new edges, no new refusals.

## Evidence

- **ran:** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs, before the fix to the reference choice · **saw:** fail 1: case typescript-tsconfig-references-first-project-edge: expected edge tests/spec.ts:1->helpers not emitted (got none)
- **ran:** node --test test/relations (after the fix and the updated resolve tests) · **saw:** pass 1701, fail 0; the first-project case green; corpus verify --only airflow: 120 added, 120 explained; oracles --only airflow: 0 disagreements
- **ran:** corpus verify --only next-intl and --only jest, after the explained.md reasons were rewritten · **saw:** passed, 0 added, 0 removed; the two new catalogue cases (semver range linked, extensionless ESM) are green at once because Runes was right in both; no red run applies

docs: none; README.md names no behaviour these three cases change

