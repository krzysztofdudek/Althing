# 155 · TS/JS: after 012 and 011 several layouts lose edges that npm/tsc resolve (nested workspaces, a package outside the globs importing itself, a marker package.json, an unreadable config in references, tsc include edge cases)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1018-owbz
**Tags:** runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** ../../../Runes
**After:** 012, 011
**Found by:** rev-runes-010
**Where:**
**Branch:** jarl/144-ts-followups
**Merged:** bdc69a9 in ../../../Runes
**CI:** none

## What
The reviewer of 010-ts-resolve checked on npm 11.6.2, pnpm 10.30.3 and tsc 6.0.3: (1) a member that declares its own workspaces does not see the outer members; (2) a package outside the workspace globs that imports itself by name is silent; (3) a file under a marker package.json ({"type": ...}) does not see the file:/link: dependencies of the parent package; (4) one unreadable config in references silences bare imports in files that no config from references holds (e.g. scripts/ in a monorepo with SvelteKit/Nuxt without a generated config in CI); (5) the notion of 'a config holds a file' is broader than in tsc (names with a dot under a wildcard, an include ending in **, no default exclusion of outDir). All of this is silence, never a false edge.

## Why
Lost edges are gaps in architecture enforcement; each of these layouts occurs in real monorepos.

## Acceptance
Each of the five cases either resolves the way npm/pnpm/tsc do, or is a documented silence with a test; material: session scratchpad patch-611/review-010-ts-resolve.

## Changelog
- Fixed: TypeScript and JavaScript imports that npm, pnpm and Node resolve no longer go silent in four layouts: a workspace member that declares a workspace of its own sees the enclosing workspace's members, a package with exports imports itself by name wherever it sits, a file under a package.json that only sets "type" sees the file:/link: dependencies of the package around it, and a referenced tsconfig that extends a generated base missing from the commit (SvelteKit, Nuxt) silences only the files it may hold, so scripts and configs beside the app keep their edges.
- Fixed: which referenced tsconfig holds a file now follows tsc, so the right config's paths apply: a wildcard skips names starting with a dot and node_modules, an include ending in ** matches nothing, and outDir and declarationDir are excluded when no exclude is set.

## Evidence

jarl: case (4) — a generated base reaching outside the app directory (a Nuxt layer) behaves as in 1.0.0 instead of going silent; accepted (the patch does not change behaviour where the fix is not unambiguous)
- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1673, pass 1673, fail 0, catalogue 505 cases, dist/ is fresh; npm run coverage: tests 1673, pass 1673, fail 0, all files 98.76 / 94.22 / 98.78, exit 0; merge bdc69a9 (catalogue count conflict resolved to 501 + 4 = 505; rebuilt dist matches)

