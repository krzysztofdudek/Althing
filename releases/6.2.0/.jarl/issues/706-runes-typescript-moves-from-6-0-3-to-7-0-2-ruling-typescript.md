# 706 · Runes: TypeScript moves from 6.0.3 to 7.0.2 (ruling typescript-bumped)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-gutr
**Tags:** runes, typescript, dependencies
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** the owner, 2026-11-12 (ruling typescript-bumped)
**Branch:** jarl/706-typescript-7
**Worker:** w-706-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:18

## What


## Why
The owner wants the family on a newer TypeScript; 7.0.2 is npm's latest, a major release, so options it dropped or changed have to be met in the build and in the committed dist.

## Acceptance
- [check] npm run check passes with TypeScript 7.0.2 pinned in package.json and the lockfile, with dist rebuilt and fresh · by: npm run check
- [read] Any tsconfig option TypeScript 7 removed or changed is replaced with what keeps the same build, the committed dist and its .d.ts files are compared before and after, and every difference is explained in the evidence

## Changelog
- Runes is now built and checked with TypeScript 7.0.2; the published code and its type declarations are the same as before, so users see no change.

## Reviews
- **changes** · by rev-706-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Important, package.json:54 and :80-81: the bridge @typescript/typescript6 depends on @typescript/old (npm:typescript@^6, locked at 6.0.3), whose bin is also named tsc; after a clean npm ci of a463320 node_modules/.bin/tsc links to @typescript/old/bin/tsc and tsc -v prints 6.0.3, so build, typecheck and npm run check in CI (ci.yml and release.yml run npm ci) and in every fresh clone compile with TypeScript 6.0.3. The issue's goal is not met there and line 1 goes green whichever compiler runs; the worker's worktree had tsc linked to TypeScript 7 only through its install history. Calling TypeScript 7 by its own bin path from a clean install gives a dist byte-identical to the committed one (148 files), so the code holds; what needs to change is how the build picks its compiler, plus a check that it is 7.0.2 (tried: a fresh install gets past the current setup unnoticed). Minor, test/relations/extractors/typescript-version-range.test.mjs:1 and :26-27: the header and the test 'models the TypeScript version the repository pins' now compare with the bridge's 6.0.3 while the repository pins 7.0.2, so the guard keeps its name but no longer says what it checks. Confirmed fine: @typescript/typescript6 is Microsoft's (scope @typescript, maintainers microsoft1es and typescript-bot), pinned exactly at 6.0.2 under the alias typescript6; both TypeScript packages are devDependencies only; nothing in src, dist or the published files imports typescript; tsconfigs unchanged; dist from a clean npm ci is byte-identical; 2628 pass, 1 skipped; dist/ is fresh.
  outside the issue, filed as 711: Runes models TypeScript 6.0.3 for types@<range> export conditions (MODELLED_TYPESCRIPT_VERSION in src/relations/extractors/typescript-version-range.mts:6). A project compiled with TypeScript 7 gets a different resolution from its compiler: with exports keys types@>=7 or types@7.0.2 TypeScript 7.0.2 picks that entry and Runes does not, and with types@<7 Runes picks it and TypeScript 7 does not (probed with a fixture package and tsc --traceResolution). Whether the modelled version moves to 7, or follows the project's own TypeScript, is a choice of behaviour of its own.
- **approve** · by rev-706b-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Minor, scripts/check-compiler.mjs:15: the bare-tsc test matches only the token tsc, so a script that runs tsc6 (the bridge package's own bin, present in node_modules/.bin after npm ci, compiling with 6.0.3) passes the check; tried: build and typecheck pointed at node_modules/@typescript/old/bin/tsc fail, npx tsc fails, pins ^7.0.2 and ~7.0.2 fail, tsc6 -p tsconfig.json passes; the accidental takeover round 1 found is covered, a deliberate tsc6 is not. Minor, README.md:273: the npm run check line lists build, grammars, tests and dist freshness but not the compiler check (found by the worker). Confirmed: fresh npm ci clone of f7834e8, the build's processes are node node_modules/typescript/bin/tsc (7.0.2, its native linux binary), dist byte-identical, npm run check 2633 tests, 2632 pass, 1 skipped, dist/ is fresh; TypeScript 7.0.2's package.json bin is {tsc: ./bin/tsc}, bin is in its files, the lockfile carries @typescript/typescript-win32-x64 and win32-arm64 7.0.2, and lib/tsc.js runs the exe with execFileSync on win32, so the path works under cmd.exe on CI's windows-latest jobs (read, not run); ci.yml (Ubuntu and Windows, Node 22 and 24) runs npm run build and npm test, both through the check, and the check's own test calls compilerProblems on the repository inside npm test, so a misfiring main-module guard on Windows would still be caught; release.yml runs npm ci and check:dist, whose rebuild goes through build. Line 2 [read]: no tsconfig changed on the branch and dist and its .d.ts files from TypeScript 7.0.2 are byte-identical to the committed ones, so nothing needed replacing; met.

## Evidence

### Proof

- **ran (line 9d3a556c5641):** npm run check · **saw:** exit 0 on the committed tree with typescript 7.0.2 pinned: build, grammars, 2629 tests (2628 pass, 0 fail, 1 skipped), check:dist printed 'dist/ is fresh.'
- **ran (line 9d3a556c5641):** git archive a463320 into a scratch folder; npm ci; npm run build; npm run check (check:dist in a git-initialised copy) · **saw:** 2629 tests, 2628 pass, 0 fail, 1 skipped; dist/ is fresh; but node_modules/.bin/tsc links to @typescript/old/bin/tsc and tsc -v prints Version 6.0.3, so this clean-install check compiled with TypeScript 6.0.3, not 7.0.2
- **ran (line 9d3a556c5641):** npm ci then npm run check in a fresh clone of f7834e8 · **saw:** check:compiler printed 'The build compiler is the pinned one.', 2633 tests (2632 pass, 0 fail, 1 skipped), 'dist/ is fresh.'; node_modules/.bin/tsc still reports 6.0.3 there but the build calls node_modules/typescript/bin/tsc, 7.0.2
- **ran (line 9d3a556c5641):** fresh clone of f7834e8; npm ci; npm run check (under a 12G memory cap) · **saw:** check:compiler 'The build compiler is the pinned one.' (printed by check:compiler, the test build and the check:dist rebuild); 2633 tests, 2632 pass, 0 fail, 1 skipped; 'dist/ is fresh.'; exit 0. A node wrapper on PATH logged the build's processes: node node_modules/typescript/bin/tsc -p tsconfig.json and -p tsconfig.relations.json; that path reports Version 7.0.2 and execs @typescript/typescript-linux-arm64/lib/tsc, while node_modules/.bin/tsc still reports 6.0.3 and is never called. dist after the build is byte-identical to the committed dist

### Notes

Assumed: Microsoft's bridge package @typescript/typescript6 6.0.2 (resolves to typescript 6.0.3), installed under the name typescript6, supplies the compiler API that the compiler-comparison test, the version-range test and the corpus oracle need, because the typescript 7 package no longer exports it. MODELLED_TYPESCRIPT_VERSION stays 6.0.3: moving it would change how types@ ranges resolve, a change of edges outside this issue.

Compared dist before and after: rebuilt under 7.0.2 from clean, git status and git diff --stat on dist print nothing; 148 tracked files (74 .d.mts) are byte-identical to the committed ones. tsconfig.json and tsconfig.relations.json needed no change (build prints no deprecation or removed-option error). Corpus gate on 15 TypeScript and C# repositories (express koa commander.js ky skywalking-booster-ui vitepress zod next-intl jest CleanArchitecture jellyfin eShop react typeorm shaka-player): passed, 0 added and 0 removed edges against the goldens, TypeScript oracle checks ran with all disagreements explained; the C# oracle is skipped on this host (no dotnet).

