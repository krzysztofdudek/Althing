# 200 · Grain: the 'superseded' marking after steer ignores the name kind, so a steer for methods marks the PascalCase rule for types as overridden

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T1952-pryo
**Tags:** grain, names
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-170
**Where:** plugins/grain/engine/learn.mjs (superseded marking)
**Branch:** jarl/200-rule-populations
**Merged:** a18cea1
**CI:** none

## What
Reported by the worker of package 170 while fixing 170: superseded marking compares only the shape, not the kind (method/type/function).

## Why



## Acceptance
A steer for method names does not change the status of rules for type or function names; test red→green.

## Changelog
- Fixed: a steer on how methods are named no longer marks the rules for type or function names as superseded.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2260, pass 2259, fail 0, skipped 1, merge a18cea1

