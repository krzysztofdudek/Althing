# 142 · Yggdrasil: adoption of Runes 1.1.0 (pin, documentation of relation limits, rerun of the reproductions)

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0949-puab
**Tags:** yggdrasil, runes
**Files:** Yggdrasil/source/cli/package.json, Yggdrasil/source/cli/package-lock.json, Yggdrasil/docs/relations-flows-ports.md
**Repo:** ../../../Yggdrasil
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018, 475
**Found by:** jarl
**Where:**

## What
The extractor fixes in Runes 1.1.0 reach Yggdrasil only after Runes 1.1.0 is published, on the owner's word: npm install @chrisdudek/runes@1.1.0 --save-exact in source/cli, an update of the cited lines and of the limits table in docs/relations-flows-ports.md, and a rerun of the reproduction of every Runes issue on Yggdrasil. Runes 1.0.1 was never published, and release/6.2.0 pins 1.0.0 today. The Yggdrasil halves of 233, 234, 235 and 240 land with this adoption, because their Runes halves are already on Runes release/1.1.0. 475 comes first.

## Why
Without this the 13 Runes fixes change nothing for Yggdrasil's users.

## Acceptance
Yggdrasil release/6.1.1 pins Runes 1.0.1; the limits documentation matches; reproductions 009–018, 073–075 green on the built Yggdrasil. Requires Runes 1.0.1 to be published first, on the owner's word.

## Evidence


2026-10-28 tidy-up: Runes 1.0.1 was never published (Runes' last tag is v1.0.0); the release this issue adopts is Runes 1.1.0 from release/1.1.0, and the title says so

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: Replaced by 530, which adopts Runes 1.1.0. The tool refuses to change the old acceptance of this issue, filed as 531. Ruling backlog-tidy-for-the-three-tools.

