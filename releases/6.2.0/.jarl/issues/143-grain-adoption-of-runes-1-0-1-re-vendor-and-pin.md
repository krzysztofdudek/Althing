# 143 · Grain: adoption of Runes 1.0.1 (re-vendor and pin)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Tags:** grain, runes
**Files:** Grain/plugins/grain/engine/vendor/runes
**Repo:** ../../../Grain
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018
**Found by:** jarl
**Where:**

## What
Grain copies Runes (engine/vendor/runes, checked byte for byte). After the v1.0.1 tag is pushed: npm run runes:update -- --tag v1.0.1, a commit of the copy together with the pin, check --ci. A test requires the Runes version to match Yggdrasil's, so this goes together with the adoption in Yggdrasil.

## Why
Without this the extractor fixes do not reach Grain, and Grain and Yggdrasil diverge in edge counts.

## Acceptance
Grain release/6.1.1 vendors Runes 1.0.1 with a pin; npm test with YG_BIN green; edge counts match Yggdrasil on the corpus.

## Evidence


2026-10-28 tidy-up: Runes 1.0.1 was never published (Runes' last tag is v1.0.0); the release this issue adopts is Runes 1.1.0 from release/1.1.0, and the title says so

