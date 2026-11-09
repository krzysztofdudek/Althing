# 227 · Yggdrasil: a shared place for helper files in a rule package (the second half of 029)

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261005T1413-cuox
**Tags:** yggdrasil, packages, partial
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#yggdrasil-scope
**Where:**
**After:** 028

## What
In 6.1.1 (029) marketplace check rejects an import from outside the files the installation copies, and the documentation says there is no shared place for helpers yet; the layout deferred to 6.2.0.

## Why
A package with several rules has to copy shared code into every rule today.

## Acceptance
A documented directory for shared files in a package, copied by pack add/update, counted in the support hashes of the rules that import it (a change to a helper invalidates those rules' verdicts), and verified by marketplace check; e2e tests of installation, update and invalidation.

## Evidence


### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Deferred: New capability, not a defect of what ships; moved past this release. Ruling backlog-tidy-for-the-three-tools.

