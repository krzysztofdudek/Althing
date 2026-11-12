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

## Reviews
- **approve** · by rev-705-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Minor: source/cli/scripts/tsc.mjs:22 and tests/unit/repo/compiler-pin.test.ts:39 hold the pin to itself, not to TypeScript 7: moving the alias to npm:typescript@6.0.3 together with the lockfile passes the runner and all four tests, so a later edit could put the type check back on 6 with the guard green (the change would show in the diff). Minor: compiler-pin.test.ts:48 matches \btsc\b, which does not match tsc6, the command the compatibility package puts on the path; a script calling tsc6 (or node node_modules/typescript/bin/tsc6) passes the guard and type-checks on 6.0.3. Minor (evidence wording): the report says a bare tsc is 6.0.3 after a clean install; in my clean npm ci node_modules/.bin/tsc linked to @typescript/native and reported 7.0.2, because @typescript/native and @typescript/old both declare a tsc command and which link wins is not fixed; the runner makes either outcome harmless. Tried to get past the guard: a type error makes typecheck fail; bare tsc and tsc6 replaced by failing stubs in my install were never called by typecheck, typecheck:e2e or build, and the process list showed only the 7.0.2 native compiler (@typescript/typescript-linux-arm64/lib/tsc); a script with tsc --noEmit, typecheck as npx tsc, the pin moved to 7.0.2 with a caret or to 7.0.3, and a build without the check each made compiler-pin.test.ts fail, and the runner refused 7.0.3 and the caret with its message. A clean npm ci with an empty cache fetched typescript 7.0.2, the linux-arm64 compiler, @typescript/typescript6 6.0.2 and typescript 6.0.3 from the registry with no error before stopping only on the Runes 404 (issue 679); require('typescript') gives 6.0.3 and typescript-eslint installs without a peer complaint. The lockfile entry of @chrisdudek/runes is unchanged. The run did not use the systemd-run memory cap: it ran inside the container with nice and timeout only.

## Evidence

### Proof

- **ran (line 7dc8eec82eef):** bash scripts/repo-check.sh (in the dev container, worktree of jarl/705-typescript-7 at 9d01b6c15) · **saw:** only pack-smoke failed (issue 679); typecheck, e2e typecheck, lint, build, 738 test files / 10895 tests, coverage branches 91.25%, docs build, markdownlint, digest freshness, graph check PASS (8381 pairs verified) all green
- **ran (line 7dc8eec82eef):** bash scripts/repo-check.sh (dev container, git archive of 715ef8d31, fresh npm ci in source/cli and docs, Runes 1.1.0 copied in per issue 679) · **saw:** only pack-smoke failed (Runes codeload 404, issue 679); typecheck, e2e typecheck, lint, dead exports, build, 739 test files / 10899 tests passed, coverage branches 91.25%, portal e2e, docs build, markdownlint, digest freshness, graph check PASS (8383 pairs verified)
- **ran (line a934ea8dc008):** npm pack of the base (d2cc7b6af) and of 715ef8d31 after each build, unpacked and diffed with diff -r · **saw:** same file list, every dist file (all .d.ts included) byte-identical; only package.json differs: the three scripts and the two devDependencies (@typescript/native npm:typescript@7.0.2, typescript npm:@typescript/typescript6@6.0.2); dependencies carry no TypeScript; no tsconfig file changed

### Notes

Assumed: TypeScript 7.0.2 is pinned exactly as the devDependency alias @typescript/native = npm:typescript@7.0.2 (the tsc that checks types), and the name typescript becomes npm:@typescript/typescript6@6.0.2 (Microsoft's compatibility package, which re-exports the 6.0 API). TypeScript 7 ships no programmatic API, so tsup's declaration bundler, typescript-eslint (newest 8.72.2, peer typescript <6.1.0, no release supports 7) and the repo's own tests/dead-exports script that import typescript would fail on a plain typescript@7.0.2. The shipped .d.ts files are still produced by the 6 API.

Assumed: the compiler-pin guard test (pin helper, installed version, no bare tsc script) is NOT in the commit: its new test file opens a paid reviewer pair (test-deterministic) that turns the graph check and cli-read-cost-bounds red until the jarl fills it. The file is kept at a file named 705-compiler-pin.test.ts in the large-file area; it also needs a line in .yggdrasil/model/cli/tests/unit/repo/yg-node.yaml mapping and a log entry. The build itself fails unless the compiler reports 7.0.2 (scripts/tsc.mjs --check).

Assumed (replaces the earlier note about the test): the compiler-pin guard test is in the branch (source/cli/tests/unit/repo/compiler-pin.test.ts, mapped in the repo-wide guards node with a log entry). It opens one reviewer pair, test-deterministic @ that file, which the jarl fills on the host; deterministic check otherwise passes (8382 pairs, 1 unverified). The test passes (4 tests) and typecheck and lint are green.

