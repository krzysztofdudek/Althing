# 439 · Mimir: a ready index of an area, exported, imported and built in CI

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, search, index
**Files:** Mimir/src/search/export.mjs, Mimir/src/search/import.mjs, Mimir/templates/area-index-workflow.yml, Mimir/test/index-export.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** Mimir at 10257cd imports an index only when the model id matches; nothing builds one

## What
index export writes an area's index to a file in the area's repository (fragments with content hashes and the model id); a workflow template for an area builds and publishes it; import in another home skips fragments of files changed locally (another hash) and refuses a file of another model id.

## Why
A new computer or a colleague gets a ready index instead of computing all knowledge from scratch.

## Acceptance
Two exports with no change give identical files; import in a second home skips locally changed files and gives the same search results for the others as a local index; another model id is refused with its fix; the template parses as YAML and is not run in the loop

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

