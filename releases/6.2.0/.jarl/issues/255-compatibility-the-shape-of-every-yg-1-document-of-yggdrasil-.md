# 255 · Compatibility: the shape of every yg-*/1 document of Yggdrasil 6.2.0 compared with 6.1.0 and with the schemas; new error codes listed for consumers

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, workspace, yggdrasil
**Files:** Althing/workspace/checks/contracts.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275

## What
Horde and Grain read Yggdrasil through versioned documents (yg-check/1, yg-node/1, yg-context/1, yg-impact/1, yg-error/1, yg-advise-1, yg-packages/1 and others) and refuse a version that changed shape. In 6.2.0 the content of yg-check/1 rows changed (032), as did character escaping in JSON (088), codes were added (file-mapping-symlink, relation-file-binary, nested-graph-*, STRUCTURE_SUBJECT_UNREADABLE …), and a field in yg-packages/1 (028).

## Why



## Acceptance
For every yg-*/1 document: the 6.1.0 and 6.2.0 output on the same fixtures compared field by field with the schema; every shape change either reverted or given a bumped document version and adjusted consumers; a list of the new codes with how Horde and Grain treat them (an unknown code does not topple a consumer); the result in the issue.

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

