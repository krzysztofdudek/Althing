# 201 · Grain propose still applies module import and export rules to data files (JSON, YAML)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261002T1952-ueww
**Tags:** grain, conventions
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-170
**Where:**
**Branch:** jarl/200-rule-populations
**Merged:** a18cea1
**CI:** none

## What
Reported by the worker of package 170 after fixing 187 (the directive and file-name rules): the import and module-export rules still cover data files.

## Why



## Acceptance
Import and export rules cover only code-grammar files; an adopted proposal does not reject data files in yg check; test red→green.

## Changelog
- Fixed: proposed rules about which modules a file imports or how it exports no longer apply to JSON, YAML and other data files beside the code.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2260, pass 2259, fail 0, skipped 1, merge a18cea1

