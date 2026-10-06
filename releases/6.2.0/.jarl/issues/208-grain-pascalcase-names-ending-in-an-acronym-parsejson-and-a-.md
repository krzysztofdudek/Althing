# 208 · Grain: PascalCase names ending in an acronym (ParseJSON) and a lone ID/IO break the PascalCase rule

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, names
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-grain-170
**Where:**
**Branch:** jarl/200-rule-populations
**Merged:** a18cea1
**CI:** none

## What
The reviewer of package 170: 171 covered camelCase and UPPER_SNAKE_CASE; PascalCase with a trailing acronym and one-word acronyms under a PascalCase rule were left outside the acceptance.

## Why



## Acceptance
ParseJSON, ID and IO do not break the PascalCase rule in propose and check; yg check after adoption agrees; test red→green.

## Changelog
- Fixed: PascalCase names that end in an acronym (ParseJSON) and short all-capital type names (ID, IO) no longer break a PascalCase naming rule, in Grain or after the rule is adopted.

## Evidence

docs: wherever the name-shape fitting rule is described (046/171 notes): a PascalCase name may end in a run of capitals (ParseJSON), and a lone UPPER word (ID) fits PascalCase as well as UPPER_SNAKE_CASE; drop 'a PascalCase name ending in an acronym is still read as its own shape'
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2260, pass 2259, fail 0, skipped 1, merge a18cea1

