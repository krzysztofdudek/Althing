# 705 · Yggdrasil: TypeScript moves from 6.0.3 to 7.0.2 (ruling typescript-bumped)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-phwh
**Tags:** yggdrasil, typescript, dependencies
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12 (ruling typescript-bumped)
**Branch:** jarl/705-typescript-7
**Worker:** w-705-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:18

## What


## Why
The owner wants the family on a newer TypeScript; 7.0.2 is npm's latest, a major release, so options it dropped or changed have to be met in the build, the type check, lint and the shipped declaration files.

## Acceptance
- [check] source/cli builds, type-checks and lints with TypeScript 7.0.2 pinned in package.json and the lockfile, and scripts/repo-check.sh passes apart from pack-smoke (issue 679) · by: bash scripts/repo-check.sh
- [read] Any tsconfig option TypeScript 7 removed or changed is replaced with what keeps the same build, the shipped .d.ts files of the published package are compared before and after, and every difference is explained in the evidence

## Changelog
- **Yggdrasil's own build and type checks now run on TypeScript 7.0.2.** Nothing changes for people who use `yg`: the package installs the same files, and the type declarations it ships are the ones it shipped before.

## Evidence

### Proof

- **ran (line 7dc8eec82eef):** bash scripts/repo-check.sh (in the dev container, worktree of jarl/705-typescript-7 at 9d01b6c15) · **saw:** only pack-smoke failed (issue 679); typecheck, e2e typecheck, lint, build, 738 test files / 10895 tests, coverage branches 91.25%, docs build, markdownlint, digest freshness, graph check PASS (8381 pairs verified) all green

### Notes

Assumed: TypeScript 7.0.2 is pinned exactly as the devDependency alias @typescript/native = npm:typescript@7.0.2 (the tsc that checks types), and the name typescript becomes npm:@typescript/typescript6@6.0.2 (Microsoft's compatibility package, which re-exports the 6.0 API). TypeScript 7 ships no programmatic API, so tsup's declaration bundler, typescript-eslint (newest 8.72.2, peer typescript <6.1.0, no release supports 7) and the repo's own tests/dead-exports script that import typescript would fail on a plain typescript@7.0.2. The shipped .d.ts files are still produced by the 6 API.

Assumed: the compiler-pin guard test (pin helper, installed version, no bare tsc script) is NOT in the commit: its new test file opens a paid reviewer pair (test-deterministic) that turns the graph check and cli-read-cost-bounds red until the jarl fills it. The file is kept at a file named 705-compiler-pin.test.ts in the large-file area; it also needs a line in .yggdrasil/model/cli/tests/unit/repo/yg-node.yaml mapping and a log entry. The build itself fails unless the compiler reports 7.0.2 (scripts/tsc.mjs --check).

Assumed (replaces the earlier note about the test): the compiler-pin guard test is in the branch (source/cli/tests/unit/repo/compiler-pin.test.ts, mapped in the repo-wide guards node with a log entry). It opens one reviewer pair, test-deterministic @ that file, which the jarl fills on the host; deterministic check otherwise passes (8382 pairs, 1 unverified). The test passes (4 tests) and typecheck and lint are green.

