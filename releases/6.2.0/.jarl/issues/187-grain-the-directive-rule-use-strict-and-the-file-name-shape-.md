# 187 · Grain: the directive rule ('use strict') and the file-name shape rule cover data files (JSON, YAML) regardless of grammar

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, conventions
**Files:** Grain/plugins/grain/engine/lex.mjs, Grain/plugins/grain/engine/mine.mjs
**Repo:** ../../../Grain
**After:** 055
**Found by:** grain-047
**Where:**
**Branch:** jarl/170-name-shapes-and-data-files
**Merged:** 67f86e1
**CI:** none

## What
After 055 data does not count toward the quote convention, but auto.lex:directive is always in the rule set of the data grammar (JSON and YAML count as 'no directive' against a 'use strict' convention), and the repo-wide file-name shape rule is not limited by grammar (a new JSON file hears 'files here are named dotted lowercase').

## Why
False hook remarks after a data file is written.

## Acceptance
Lexical rules and name-shape rules apply only to the grammars they were drawn from; a test on JSON and YAML.

## Changelog
- Fixed: JSON, YAML, TOML and properties files are no longer held to the code's file-name rule or its leading-directive rule (such as `'use strict'`), in the hook, in `grain check` and in the rules `grain propose` writes, whose scope now leaves those files out.

## Evidence

- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2229, pass 2228, fail 0, skipped 1, merge 67f86e1

