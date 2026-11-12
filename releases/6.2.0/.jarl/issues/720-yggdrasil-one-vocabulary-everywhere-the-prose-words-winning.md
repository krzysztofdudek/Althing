# 720 · Yggdrasil 7.0.0: the reshaped public surface (one vocabulary of prose words, no aliases, the cuts and the redesigned configuration), moved to by an update document an agent follows, not by migration code

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261112T0513-pgne
**Tags:** yggdrasil, vocabulary, api
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12, after the public-surface audit

## What


The same design and move cover the rulings yggdrasil-surface-reshaped-no-aliases (--json /2, exit codes 0/1/2, flags for every target, one schema shape per key, merged and removed commands, yg upgrade, a layered prime), yggdrasil-attention-layer-removed (advise, incident, aspects --health, structure and their files gone; aspect-test, drill and simulate as one command with modes) and yggdrasil-node-and-log-simplified (yg node gone, yg log add in three forms); and issue 725's component design is shown with it.

## Why
An agent meets two vocabularies for the same things (aspect and rule, deterministic and script rule, llm and reviewer rule, aggregate and bundle, node and component, approve and fill); the owner wants one, the prose's.

## Acceptance
- [read] A design, shown to the owner before code, lists every rename (keys, file and folder names, commands, flags, error codes and labels, --json fields and schema ids, docs topics), every removal and every reshaped part decided on 2026-11-12 (the rulings from yggdrasil-one-vocabulary-now to yggdrasil-no-update-doc-means-nothing-to-do), the redesigned yg-config.yaml and yg-secrets.yaml, and what Grain, Jarl and Althing must change
- [test] Every new name works and no old name does; a project written for another CLI version gets one line from yg prime and yg check naming the update document for that step (or, with none, saying only to set the version); the upgrade machinery and every migration are gone, red before and green after · by: cd source/cli && npm test
- [test] yg prime, help, docs topics, docs and the CHANGELOG use only the new names; a guard test refuses an old name in the prose · by: cd source/cli && npm test
- [read] The update document for 6.x.x to 7.0.0 says what to rename, what no longer exists and when to ask the user, how to move yg-config.yaml and yg-secrets.yaml over, and how to rebuild the verdict lock; a fresh agent with only that document moves Yggdrasil's own graph, its examples and Althing's graph to 7.0.0, and yg check is green on each

## Evidence

