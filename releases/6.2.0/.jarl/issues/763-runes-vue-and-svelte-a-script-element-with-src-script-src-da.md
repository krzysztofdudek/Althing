# 763 · Runes, Vue and Svelte: a script element with src (<script src="../data/d.ts"></script>) emits no use

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261115T1054-iboc
**Tags:** api, runes, svelte, typescript, vue
**Files:** Runes/src/relations/extractors/typescript.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-sfc-script-src
**Where:** Runes/src/relations/extractors/typescript.mts:498

## What
Claim: At v1.1.0 sfcScriptView keeps only the bytes between the tags of a script element; a script with an empty body and a src attribute gives no use, and the attribute is never read.

repros.sh vue_script: src/ui/s.vue holding <script src="../data/d.ts"></script> printed no use for the file

## Why


A component that takes its code from a file through src has no edge to it, so a consumer cannot see the dependency. A new family tool that uses the readers as they are found it.

## Acceptance
[test] A Vue and a Svelte component with <script src="../data/d.ts"></script> give a use of that file at the line of the element, red at v1.1.0 (no use) and green after; or docs/api.md lists it as unread and a test pins the empty answer; every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

