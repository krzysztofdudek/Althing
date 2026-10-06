# 202 · Grain: in a mixed TS/JS partition, files without the directive count against the 'use strict' rule

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, conventions
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-170
**Where:**
**Branch:** jarl/200-rule-populations
**Merged:** a18cea1
**CI:** none

## What
Reported by the worker of package 170: the population of the directive rule in a mixed partition includes files in which the directive makes no sense (ES / TS modules).

## Why



## Acceptance
The 'use strict' rule counts only files for which the directive matters; test red→green.

## Changelog
- Fixed: the rule that files start with 'use strict' no longer counts TypeScript, declaration and ES-module files (including .js files in a package marked as a module), which are strict without it, and a proposed rule no longer applies to them.

## Evidence

docs: where the final pass describes the lexical surfaces (directive): an ES module (top-level import/export, .mjs/.mts) is strict without 'use strict', so the directive rule is counted over CommonJS/script files; modules carry the directive only where they choose one that means something in a module ('use client')
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2260, pass 2259, fail 0, skipped 1, merge a18cea1

