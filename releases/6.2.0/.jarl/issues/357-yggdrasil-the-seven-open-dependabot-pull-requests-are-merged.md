# 357 · Yggdrasil: the seven open Dependabot pull requests are merged into the release or closed with a reason

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** standard
**Key:** 20261028T1029-jywo
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** coordinator
**Where:**
**After:** 356

## What
Open pull requests #104 to #110 (2026-10-18 to 2026-10-21) bump source-map-js (cli and docs), tree-sitter-cli and web-tree-sitter to 0.27.1, vite to 8.3.5, and two dependency groups. CI fails on the two tree-sitter bumps. They target main, while the release work lives on release/6.2.0.

## Why
Pull requests left open pile up and their branches stay on GitHub; each one is a decision to take or refuse an update.

## Acceptance
- Each update is taken on release/6.2.0 with a green check, or refused with a recorded reason; the two tree-sitter bumps say why CI failed
- Every pull request is closed with a comment naming where the update went, and its branch is deleted, on the owner's word for anything on GitHub

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: Merged into 356, which now holds both the alerts and the pull requests. Ruling backlog-tidy-for-the-three-tools.

