# 300 · Grain: the import check's node-type pattern matches a typed TypeScript parameter and a dynamic import, so an 'imports X' rule refuses a file that imports nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2138-mzem
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/propose-checks.mjs, Grain/plugins/grain/engine/propose-base.mjs, Grain/plugins/grain/engine/propose-lattice.mjs, Grain/plugins/grain/engine/extract.mjs, Grain/plugins/grain/engine/config.mjs
**Repo:** Grain
**Found by:** rev-grain-003-opus2
**Where:** plugins/grain/engine/propose-lattice.mjs:267
**After:** 212
**Branch:** jarl/294-announced-counts
**Worker:** w-294-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:25

## What


The import check's node-type pattern still matches TypeScript's required_parameter (issue 180 fixed this only in Grain's own import reading) and dynamic import(...) calls. So an 'imports X' rule refuses a .ts file that imports nothing but has a typed parameter, and a dynamic import is read as a static one. The check also does not read Ruby and Lua require calls, and an index import (../base/index) is not matched to ~/lib/base, the same as extraction. The check of 212 now reads module-level CommonJS require and string literals; this issue brings the node-type pattern in line with what extraction records.

Checked on 2026-11-09 against release/6.2.0: the check and extraction resolve an index import the same way and neither strips /index, so that clause is no fault. A dynamic import matches only as a bare import token: it counts as an import seen and never matches a specifier.

## Why


A false refusal on a file that imports nothing is a false red the adopter cannot explain; it was already present on the release base, so it is not a regression of 212, but 212 is where the check is now being made right.

## Acceptance


- [test] A .ts file with a typed parameter and no imports is not refused by an imports X rule, red before and green after · by: cd plugins/grain && npm test
- [test] A dynamic import is either read with its specifier or named as unread, with a case · by: cd plugins/grain && npm test
- [read] Ruby require_relative and Lua require are read by the check or documented as unread, with a case

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

