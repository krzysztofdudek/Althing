# 762 · Runes, Vue and Svelte: a script block inside an HTML comment is read as code, so a commented-out import counts as a use

**Status:** deferred
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261115T1054-fucz
**Tags:** api, runes, svelte, typescript, vue
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-sfc-commented-script
**Where:** Runes/src/relations/extractors/typescript.mts:474, Runes/src/relations/extractors/typescript.mts:488

## What
Claim: At v1.1.0 sfcScriptView finds script blocks with the regular expression SCRIPT_BLOCK over the raw text, which has no notion of an HTML comment. A component whose only script is inside <!-- ... --> has its imports read.

repros.sh vue_script: src/ui/v.vue holding <template><b/></template> and <!-- <script>import { d } from "../data/d"</script> --> printed src/ui/v.vue:2 ../data/d resolved to src/data/d.ts, as the real script block of ok.vue did

## Why


A commented-out import in a component counts as a use, so a consumer reports a forbidden use that the code does not make. A new family tool that uses the readers as they are found it.

## Acceptance
[test] A Vue and a Svelte component whose only script block is inside an HTML comment give no use, one with a commented-out block beside a real one gives only the real block's uses on their own lines, red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

