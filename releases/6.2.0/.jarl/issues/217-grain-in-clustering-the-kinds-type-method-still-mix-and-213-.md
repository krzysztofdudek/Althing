# 217 · Grain: in clustering the kinds (type/method) still mix, and 213 only takes the group away from the mixed ones; counting of renames outside the kept trail is doubled; the rename chain is cut after 20 steps without a warning

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, 6.2
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-grain-213
**Where:**
**Branch:** jarl/182-file-lineage
**Worker:** grain-182-sonnet
**Since:** 2026-10-12 00:24

## What
The reviewer of package 213: on petclinic 43 types were in method groups (42 ambiguous), express had 38 case/method mixes; after 213 these scopes lose their group instead of landing in the group of their own kind. 215: rename commits outside the kept trail counted twice (support below the limit may be overstated). 216: the rename chain stops after 20 steps without a warning.

## Why



## Acceptance
Clustering per kind; no double counting of renames; a chain cut-off reported; tests red→green.

## Changelog
- Fixed: role groups are formed per kind of scope, so a type that shares name tokens with the methods it declares lands in a group of types instead of losing its group, and a file renamed more than 20 times keeps the history of every path it had.

## Evidence


ran: tests/roles-cluster-per-kind.test.mjs and tests/rename-chain-no-cap.test.mjs on release/6.2.0 then on jarl/182-file-lineage (0b5c226) · saw: red (the group medoids are method only, the 14 types have no group; a 25-step chain ends at dir20 and a scope edit is not found under dir25), green all pass; the cut-off cannot occur any more, so there is nothing to disclose; the rename-commit double count is closed by issue 182

docs: none needed (docs/reference.md names no 20-step limit)

