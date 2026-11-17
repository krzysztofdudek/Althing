# 755 · Runes, TypeScript and JavaScript: a use through a bundler alias is answered outside

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-qykp
**Tags:** api, bundler, javascript, runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-bundler-alias
**Where:** Runes/src/relations/extractors/typescript-resolve.mts:80, Runes/src/relations/extractors/typescript-resolve.mts:105
**Branch:** jarl/755-bundler-alias
**Worker:** w-755-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
Claim: At v1.1.0 the readers resolve tsconfig and jsconfig paths, baseUrl, and package exports and imports. An alias that only a bundler configuration defines is not read, and explainTsMiss answers outside for the bare specifier. A repository with such an alias and no matching tsconfig paths entry has every use through it answered {"kind":"absent","reason":"outside"}, while the same use as a relative path resolves and the same alias as a tsconfig paths entry resolves.

repros.sh alias_vite: "@/data/d" and "~data/d" printed {"kind":"absent","reason":"outside"}, "../data/d" printed resolved to src/data/d.ts; alias_webpack: require("data-alias/d") printed outside; alias_babel: "@d/d" printed outside; alias_tsconfig: "@/data/d" printed resolved to src/data/d.ts

Moved from issue 755 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer that stays quiet about an outside use reports nothing for every import through a Vite, webpack or Babel alias, with no sign that a reader did not look: a Vue or Vite project that keeps its alias only in the bundler configuration passes a layer check on every such use. A new family tool that uses the readers as they are found it.

## Acceptance
- [read] A ruling in the loop says which of the two answers the readers give for a bare specifier in a repository that holds a bundler configuration: the alias read from the configuration's literals, or reason unfollowed
- [test] In a repository with a Vite resolve.alias, a webpack resolve.alias and a Babel module-resolver alias, none of them in a tsconfig, classifyUse of a use through each gives the answer the ruling picks, in a unit test and a catalogue case per bundler, red at v1.1.0 (outside) and green after; a specifier of an installed package in the same repository still gives outside, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- TypeScript and JavaScript: an import through an alias that only the bundler configuration defines (Vite `resolve.alias`, webpack `resolve.alias`, Babel module-resolver `alias`, such as create-vue's `'@': fileURLToPath(new URL('./src', import.meta.url))` or `path.resolve(__dirname, 'src')`) now gives an edge to the file it names; in 1.1.0 it was read as an installed package and `classifyUse` answered `outside`. The configuration is read as text and never run: a replacement written in another form (a variable, a template, a relative string in Vite or webpack) is not followed. Where such an alias may apply, a bare specifier that names no dependency of a package.json at or above the file and no Node built-in is answered `unfollowed` instead of `outside`. This can show new findings: a consumer's graph can show new edges through bundler aliases, and a consumer that reports unfollowed uses can see new ones in a repository whose bundler configuration computes its aliases.

## Evidence

### Proof

- **ran (line 17a6670f05e2):** node --test test/relations/extractors/typescript-bundler-alias.test.mjs and the alias cases of the TypeScript and JavaScript matrices, at 4c47621 (tests only) · **saw:** red: each of the four classifyUse tests failed with { kind: 'absent', reason: 'outside' } (@/data/d, data-alias/d, @d/d, and the unreadable alias's @/data/d); the vite, webpack and babel cases emitted no edge, the unreadable case answered outside
- **ran (line 17a6670f05e2):** node --test test/relations/extractors/typescript-bundler-alias.test.mjs typescript-resolve, resolve-path, resolver, catalogue, exports and the TypeScript and JavaScript matrices, at e25283d · **saw:** green: pass 485, fail 0; vite, webpack and babel uses resolve to src/data, vue, lodash and react stay outside, the unreadable alias gives unfollowed and a declared dependency or built-in outside; catalogue holds 1005 cases

### Notes

Assumed: the configurations read are those of the nearest directory at or above the file that holds any of the listed names, all of them together; two that map one specifier to different places give no edge (unknown). vitest.config.*, vue.config.js and Nuxt or Vue CLI built-in aliases are not read (not in the plan's list).

Assumed: Vite and webpack resolve a relative string replacement ('./src') from the importing file, not from the configuration (Vite docs: relative alias values are used as-is), so the reader refuses it instead of reading it from the configuration's directory as the plan's hypothesis said; Babel's module-resolver reads it from its working directory, the configuration's, and that form is read. A bare string is a package request. path.resolve/path.join accept one or more string literals after __dirname; a top-level const holding a listed form ('@': pathSrc in skywalking-booster-ui) is not followed.

Assumed: under an alias the reader cannot follow, a bare specifier still falls through to the packages of the repository for resolution (no existing edge moves), and only the explanation changes: unfollowed unless a package.json at or above the file declares it in any dependency field or it is a Node built-in. An unreadable bundler configuration sends no config-unreadable diagnostic: that code's promise names JSON files that do not parse.

