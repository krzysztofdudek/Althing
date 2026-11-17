# 763 · Runes, Vue and Svelte: a script element with src (<script src="../data/d.ts"></script>) emits no use

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-hcfu
**Tags:** api, runes, svelte, typescript, vue
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-sfc-script-src
**Where:** Runes/src/relations/extractors/typescript.mts:498
**Branch:** jarl/762-sfc-and-ts-calls
**Worker:** w-762-haiku
**Model:** claude-haiku-5-5@max
**Since:** 2026-11-17 11:47

## What
Claim: At v1.1.0 sfcScriptView keeps only the bytes between the tags of a script element; a script with an empty body and a src attribute gives no use, and the attribute is never read.

repros.sh vue_script: src/ui/s.vue holding <script src="../data/d.ts"></script> printed no use for the file

Moved from issue 763 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A component that takes its code from a file through src has no edge to it, so a consumer cannot see the dependency. A new family tool that uses the readers as they are found it.

## Acceptance
[test] A Vue and a Svelte component with <script src="../data/d.ts"></script> give a use of that file at the line of the element, red at v1.1.0 (no use) and green after; or docs/api.md lists it as unread and a test pins the empty answer; every existing answer and edge stays as it is · by: npm run check

## Evidence

