# 690 · Yggdrasil: its own yg check shows a standing relation-package-entry-missing warning for source/cli/package.json (entry dist/ast.js, imported as @chrisdudek/yg/ast); clearing it moves the entries and needs yg-architecture.yaml to allow rule scripts and test fixtures to use the ast adapter

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261112T0038-byfn
**Tags:** yggdrasil, relations, architecture
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** rev-530-opus and w-530-sonnet, Runes 1.1.0 adoption (patch kept in the large-file area as '530 package entry layout.patch')
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
A standing warning on the tool's own repository teaches its users to ignore warnings; the fix that builds the entries where the exports point turns about fifty rule scripts and a fixture into undeclared dependencies on cli/ast/report, which the architecture forbids today.

## Acceptance
- [owner] The owner decides whether yg-architecture.yaml allows uses from rule-script and test-fixture to ast-adapter · material: the patch '530 package entry layout.patch' in the large-file area and the list of affected rule scripts · check: that the allowed relation matches what those scripts really import
- [test] With his word, Yggdrasil's own yg check shows no relation-package-entry-missing warning and the graph check stays green · by: cd source/cli && npm test

## Evidence

