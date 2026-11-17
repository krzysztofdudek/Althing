# 755 · Runes, TypeScript and JavaScript: a use through a bundler alias (Vite resolve.alias, webpack resolve.alias, Babel module-resolver) is answe…

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261115T1054-zjmd
**Tags:** api, bundler, javascript, runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts, Runes/src/relations/resolve-path.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-bundler-alias
**Where:** Runes/src/relations/extractors/typescript-resolve.mts:80, Runes/src/relations/extractors/typescript-resolve.mts:105

## What
Claim: At v1.1.0 the readers resolve tsconfig and jsconfig paths, baseUrl, and package exports and imports. An alias that only a bundler configuration defines is not read, and explainTsMiss answers outside for the bare specifier. A repository with such an alias and no matching tsconfig paths entry has every use through it answered {"kind":"absent","reason":"outside"}, while the same use as a relative path resolves and the same alias as a tsconfig paths entry resolves.

repros.sh alias_vite: "@/data/d" and "~data/d" printed {"kind":"absent","reason":"outside"}, "../data/d" printed resolved to src/data/d.ts; alias_webpack: require("data-alias/d") printed outside; alias_babel: "@d/d" printed outside; alias_tsconfig: "@/data/d" printed resolved to src/data/d.ts

## Why


A consumer that stays quiet about an outside use reports nothing for every import through a Vite, webpack or Babel alias, with no sign that a reader did not look: a Vue or Vite project that keeps its alias only in the bundler configuration passes a layer check on every such use. A new family tool that uses the readers as they are found it.

## Acceptance
- [read] A ruling in the loop says which of the two answers the readers give for a bare specifier in a repository that holds a bundler configuration: the alias read from the configuration's literals, or reason unfollowed
- [test] In a repository with a Vite resolve.alias, a webpack resolve.alias and a Babel module-resolver alias, none of them in a tsconfig, classifyUse of a use through each gives the answer the ruling picks, in a unit test and a catalogue case per bundler, red at v1.1.0 (outside) and green after; a specifier of an installed package in the same repository still gives outside, and every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: Moved to the Runes 1.2.0 loop (releases/1.2.0) under the same number, on the owner's answer to a-41 and a-42; it is worked and closed there

