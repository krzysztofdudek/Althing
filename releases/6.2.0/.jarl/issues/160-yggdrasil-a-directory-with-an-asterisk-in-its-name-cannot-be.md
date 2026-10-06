# 160 · Yggdrasil: a directory with an asterisk in its name cannot be mapped literally (a backslash in a mapping entry is replaced with /)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** yggdrasil, mapping
**Files:** Yggdrasil/source/cli/src/core/graph/mapping.ts
**Repo:** ../../../Yggdrasil
**Found by:** grain-035
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What
Yggdrasil treats a mapping entry as a glob only when it contains *, and replaces backslashes in entries with /, so a directory whose name contains * can be neither mapped literally nor escaped.

## Why
Rare but real names (e.g. generated directories) are then unmappable, and Grain has no way to propose a mapping for them.

## Acceptance
There is a documented way to map a literal path with * (an escape or a literal form); a test.

## Changelog
- Fixed: a file or directory with a * in its name can be mapped by writing the * as [*] (gen[*]out/** maps the directory gen*out); documented, and the mapping-path-missing error for such a directory gives that spelling.

## Evidence

- **ran:** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

