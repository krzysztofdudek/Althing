# 230 · Grain: same-named scopes keyed by identity, not position — the full solution of 042 and lifting the quarantine

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-bvif
**Tags:** grain, history, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#042-file-quarantine
**Where:**
**After:** 003, 182, 169

## What
In 6.1.1 (042) same-named functions in a file are excluded from trend conclusions (a per-file quarantine, ~5% of scopes); the proper solution — a scope key robust to adding siblings — deferred to 6.2.

## Why
5% of scopes get no trend conclusions; adding a sibling must not glue together the histories of different functions.

## Acceptance
The scope key does not change after adding, removing or reordering same-named siblings (e.g. parent path + name + signature/anonymous index stable against siblings); the 6.1.1 quarantine lifted; on the click repository the false 'fading' does not come back, and the trends of real functions do come back; docs/validation.md and results.md re-measured; HIST_V/MODEL_V bumped in the final pass.

## Evidence


### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Deferred: New capability, not a defect of what ships; moved past this release. Ruling backlog-tidy-for-the-three-tools.

