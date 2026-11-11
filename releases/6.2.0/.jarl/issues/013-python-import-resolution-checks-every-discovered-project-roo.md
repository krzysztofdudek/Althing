# 013 · Python: import resolution checks every discovered project root for every import with an uncached existsSync, so yg check is quadratic in a uv/Poetry monorepo (Airflow: over two minutes, over 90% in resolveAbsolute) on every run

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-nubg
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/python-resolve.mts, Runes/src/relations/resolve-path.mts, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/python-resolve.mts:146-171 (resolveAbsolute: the loop over projectRoots() l.147, insideRegularPackage l.224-229, up to 4 candidates l.151-171, `roots.includes` l.148); src/relations/resolve-path.mts:48 (`exists` = uncached existsSync + exactCase); Yggdrasil source/cli/src/relations/resolve-path.ts:34 and pass.ts:1001 (the resolver built once per pass), pass.ts:200 (resolution deliberately live on every run)
**Branch:** jarl/009-python-roots
**Merged:** 2a5f1e2 in ../../../Runes
**CI:** none

## What
For every absolute non-stdlib import the code walks all discovered project roots and in each makes about 6 file system probes (2 in insideRegularPackage, up to 4 candidates), plus an O(P) `roots.includes` scan; an external import (requests, numpy) never hits, so it checks everything. Cost ≈ imports × roots, and in a uv/Poetry monorepo both numbers grow with the number of projects. The result of the discovered-roots part depends only on the specifier, yet it is computed anew for every import. A warm AST cache does not help, because resolution is live on every run. Measurement (clone v6.1.0 e544110, Node 24.11.1, warm cache, N projects with pyproject.toml, each 40 modules × 10 imports, one node per project): 25 projects/1025 files 2.9 s, 50/2050 10.3 s, 100/4100 45.4 s; control with the same files and no pyproject.toml 0.8/1.3/2.5 s (linear). Profile at n=100: 44.0 s, resolveAbsolute 41.6 s, exists 36.5 s, existsSync 25.1 s, insideRegularPackage 16.3 s. apache/airflow @58e987de (sparse: airflow-core, task-sdk, providers; 7205 .py, 112 pyproject.toml, 112 nodes): cold 160.6 s, warm 131.3 s, of which resolveAbsolute 121.3 s (92%), exists 97.0 s (164 s warm in the finder's run). A regression against 6.0.0 (0.8/1.6/2.4 s), which has no discovered roots (they came with issue 217). Memoising `exists` alone (a Map per resolver instance, identical results) gives 2.4-2.7x (synthetic 38.9 → 14.2 s, Airflow 131 → 54.5 s) and stays superlinear (resolveAbsolute 11.6 of 14.2 s). No scale test in Yggdrasil has Python with many pyproject.toml files. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-10/repro.log, airflow.log, memo-compare.log, memo-profile.log, v600-compare.log, v600-rerun.log; scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-10/bin/.

## Why
Every yg check, including the pre-commit hook and CI, costs minutes in a uv/Poetry monorepo and grows quadratically; the result is correct, but the tool stops being fit for the everyday loop on such repositories. This is a 6.1.0 regression.

## Acceptance
- Matches in discovered roots memoised per specifier (or one module → file index per root), plus memoisation of `exists` and insideRegularPackage(root) for the resolver's lifetime; the set of reported relations identical to today's (synthetic 24/49/99, Airflow 112).
- The synthetic time for 25/50/100 projects grows roughly linearly, in the order of magnitude of the control without pyproject.toml; a scale test with many pyproject.toml files in Yggdrasil or in Runes; a Runes release and a bumped pin.

## Changelog
- Fixed: Python: resolving imports in a uv or Poetry monorepo with many pyproject.toml projects no longer costs every import a file probe per project (quadratic, minutes per check on Airflow); one resolver per pass remembers its probes and looks only at the projects that hold the imported top-level package, with the same relations reported.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1613, pass 1613, fail 0, catalogue 487 cases, dist/ is fresh; npm run coverage: tests 1613, pass 1613, fail 0, all files 98.76 / 94.02 / 98.62, exit 0; merge 2a5f1e2 (catalogue count conflict resolved to 485 + 2 = 487; resolve-path.mts and its dist merged independently of the Cargo reader, a rebuild changed nothing)

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 013: N projects with a pyproject.toml, 40 modules x 10 imports each, one node per project (requests and numpy imports among them), warm run. Seconds, 6.1.0 against built: 25 projects 2.5 / 1.0, 50 projects 8.6 / 1.7, 100 projects 29.8 / 2.5; no edge on either (every import stays inside its project). Airflow was not rerun.

