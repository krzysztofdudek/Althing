# 143 · Grain: adoption of Runes 1.1.0 (re-vendor and pin)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0949-basf
**Tags:** grain, runes
**Files:** Grain/plugins/grain/engine/vendor/runes
**Repo:** ../../../Grain
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018
**Found by:** jarl
**Where:**

## What
Grain copies Runes (engine/vendor/runes, checked byte for byte). After the v1.1.0 tag is pushed: npm run runes:update -- --tag v1.1.0, a commit of the copy together with the pin, check --ci. A test requires the Runes version to match Yggdrasil's, so this goes together with 142. Runes 1.0.1 was never published, and release/6.2.0 vendors 1.0.0 today. The Grain halves of 233 and 234 land with this adoption. For 235, Grain already reads the commit tree from a temporary directory, so its answer does not depend on files built locally.

## Why
Without this the extractor fixes do not reach Grain, and Grain and Yggdrasil diverge in edge counts.

## Acceptance
- [read] release/6.2.0 vendors Runes 1.1.0 with a pin
- [test] Grain's suite passes with YG_BIN set · by: cd plugins/grain && npm test
- [read] Edge counts match Yggdrasil on one repository of the corpus from 184, named in the evidence

## Evidence


2026-10-28 tidy-up: Runes 1.0.1 was never published (Runes' last tag is v1.0.0); the release this issue adopts is Runes 1.1.0 from release/1.1.0, and the title says so

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

