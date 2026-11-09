# 300 · Grain: the import check's node-type pattern matches a typed TypeScript parameter and a dynamic import, so an 'imports X' rule refuses a file that imports nothing

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2138-mzem
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/propose-lattice.mjs
**Repo:** ../../../Grain
**Found by:** rev-grain-003-opus2
**Where:** plugins/grain/engine/propose-lattice.mjs:267
**After:** 212

## What


The import check's node-type pattern still matches TypeScript's required_parameter (issue 180 fixed this only in Grain's own import reading) and dynamic import(...) calls. So an 'imports X' rule refuses a .ts file that imports nothing but has a typed parameter, and a dynamic import is read as a static one. The check also does not read Ruby and Lua require calls, and an index import (../base/index) is not matched to ~/lib/base, the same as extraction. The check of 212 now reads module-level CommonJS require and string literals; this issue brings the node-type pattern in line with what extraction records.

## Why


A false refusal on a file that imports nothing is a false red the adopter cannot explain; it was already present on the release base, so it is not a regression of 212, but 212 is where the check is now being made right.

## Acceptance


- A .ts file with a typed parameter and no imports is not refused by an imports X rule; a dynamic import is handled as extraction handles it; each with a red-to-green test.
- Ruby require_relative and Lua require are either read by the check or documented as unread, with a case; an index import is matched like extraction does.

## Evidence

