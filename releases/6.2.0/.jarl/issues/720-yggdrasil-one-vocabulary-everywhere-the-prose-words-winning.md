# 720 · Yggdrasil: one vocabulary everywhere, the prose words winning (rule, script rule, reviewer rule, bundle, component, fill, passed), old names accepted as aliases for one release (rulings yggdrasil-one-vocabulary-now, yggdrasil-vocabulary-prose-wins)

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


## Why
An agent meets two vocabularies for the same things (aspect and rule, deterministic and script rule, llm and reviewer rule, aggregate and bundle, node and component, approve and fill); the owner wants one, the prose's.

## Acceptance
- [read] A design names, for each old name, the new name in every place it appears (configuration keys, file and folder names, CLI commands and flags, error codes and labels, --json fields and schema ids, knowledge topics, portal), how the old name is still accepted for one release and what tells a user to move, and what Grain, Jarl and Althing must change; the owner sees it before the code
- [test] Every new name works and every old name still works with a one-line notice naming the new one, on a project made by 6.1.0, red before and green after · by: cd source/cli && npm test
- [test] yg prime, help, knowledge pages, docs, CHANGELOG and every message use only the new names; a guard test refuses an old name in the prose · by: cd source/cli && npm test
- [test] yg init --upgrade migrates a .yggdrasil made by 6.1.0 or early 6.2.0 to the new names in place (files and folders renamed, keys rewritten, locks and logs carried so no verdict or log entry is lost), runs twice with no further change, and leaves a project yg check reads green as before; a project not yet migrated still works through the aliases with a notice that names yg init --upgrade, red before and green after · by: cd source/cli && npm test

## Evidence

