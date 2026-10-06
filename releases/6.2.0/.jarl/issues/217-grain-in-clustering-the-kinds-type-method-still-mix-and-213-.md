# 217 · Grain: in clustering the kinds (type/method) still mix, and 213 only takes the group away from the mixed ones; counting of renames outside the kept trail is doubled; the rename chain is cut after 20 steps without a warning

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, 6.2
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-grain-213
**Where:**

## What
The reviewer of package 213: on petclinic 43 types were in method groups (42 ambiguous), express had 38 case/method mixes; after 213 these scopes lose their group instead of landing in the group of their own kind. 215: rename commits outside the kept trail counted twice (support below the limit may be overstated). 216: the rename chain stops after 20 steps without a warning.

## Why



## Acceptance
Clustering per kind; no double counting of renames; a chain cut-off reported; tests red→green.

## Evidence


