# 22 · Runes, TypeScript and JavaScript: aliases in `vitest.config.*`, `vue.config.js` and the built-in aliases of Vue CLI and Nuxt are not read, nor an alias whose value is a top-level const

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1441-nxhh
**Tags:** runes, typescript, javascript, bundler
**Files:** 
**Repo:** Runes
**Found by:** w-755-opus
**Where:** Runes/src/relations/extractors/bundler-alias.mts

## What
After 755 the readers take resolve.alias from Vite and webpack configuration and the Babel module-resolver alias. A vitest.config.* (vitepress keeps its test aliases there), a vue.config.js, the built-in @ and ~ aliases of Vue CLI and Nuxt, and an alias whose value is a top-level const of the config file are not read, so a use through them is answered as 755 answers an unreadable alias.

## Why
Test files and Vue CLI or Nuxt applications reach their own modules through these aliases, and a consumer sees those uses as unfollowed instead of edges.

## Acceptance
[test] A use through an alias in vitest.config.*, vue.config.js (configureWebpack resolve.alias), the built-in @ and ~ of a Vue CLI or Nuxt project, and an alias whose value is a top-level const string or path call of the config file, gives the edge to the aliased file, a case each, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

