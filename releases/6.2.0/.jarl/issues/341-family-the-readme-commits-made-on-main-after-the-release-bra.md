# 341 · Family: the commits made on main after the release branches were cut enter Yggdrasil's and Grain's release branches

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0923-srlc
**Tags:** 
**Files:** Yggdrasil/README.md, Yggdrasil/AGENTS.md, Grain/README.md, Grain/CLAUDE.md
**Repo:** ../../../Yggdrasil, ../../../Grain
**Found by:** coordinator
**Where:**
**Branch:** jarl/341-main-into-release
**Worker:** w-341-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:23

## What
Between 2026-10-05 and 2026-11-04 main moved on in both repositories with five commits each that the release branches do not hold. Yggdrasil: Skald leaves the family, start at the step where it hurts, what you install and why, and two commits for Horde leaving the family. Grain: the same three, the family section without em dashes, and one commit for Horde leaving the family. Until they are in, the release branches still describe Horde and the canon check of 267 and 268 cannot pass. A release that fast-forwards main would fail, and one that merges would have to resolve them at the last moment.

## Why
The release branch is what ships; text written on main since must not be lost or fought over during the release steps.

## Acceptance
- Each release branch holds every commit of its origin/main, merged with conflicts resolved in favour of the newer text, and the repository's check is green on the merge
- git rev-list release/6.2.0..origin/main is empty in both repositories, recorded as a row

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

