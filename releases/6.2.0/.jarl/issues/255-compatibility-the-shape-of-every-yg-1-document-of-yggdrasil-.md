# 255 · Compatibility: the shape of every yg-*/1 document of Yggdrasil 6.2.0 compared with 6.1.0 and with the schemas; new error codes listed for consumers

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, yggdrasil
**Files:** Althing/workspace/checks/contracts.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**

## What
Horde and Grain read Yggdrasil through versioned documents (yg-check/1, yg-node/1, yg-context/1, yg-impact/1, yg-error/1, yg-advise-1, yg-packages/1 and others) and refuse a version that changed shape. In 6.2.0 the content of yg-check/1 rows changed (032), as did character escaping in JSON (088), codes were added (file-mapping-symlink, relation-file-binary, nested-graph-*, STRUCTURE_SUBJECT_UNREADABLE …), and a field in yg-packages/1 (028).

## Why



## Acceptance
For every yg-*/1 document: the 6.1.0 and 6.2.0 output on the same fixtures compared field by field with the schema; every shape change either reverted or given a bumped document version and adjusted consumers; a list of the new codes with how Horde and Grain treat them (an unknown code does not topple a consumer); the result in the issue.

## Evidence


