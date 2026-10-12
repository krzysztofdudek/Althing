# 182 · Grain: a commit older than the window that touches two former paths of one present-day file counts twice in co-changes

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, cochange, 6.2
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**After:** 048
**Found by:** rev-grain-048
**Where:**
**Branch:** jarl/182-file-lineage
**Worker:** grain-182-sonnet
**Since:** 2026-10-12 00:24

## What
After 048 (the whole history on present-day paths) a commit from before the window that changes two former paths of the same present-day file counts twice: the reviewer's case gives 15/17 instead of 12/14. Documented by the worker.

## Why
A slight overstatement of pair support on long histories with many renames.

## Acceptance
Each commit counts once per present-day file outside the window too; a test on the reviewer's case.

## Changelog
- Fixed: a file renamed or moved is counted once per commit in the co-change numbers however many paths a commit named it by, on long histories too; a path created again after its file was renamed away is now a separate file, so it no longer inherits the renamed file's earlier co-changes.

## Evidence


docs: docs/reference.md: where it says a touched path is carried to the path the file lives at today, add that the walk keeps every co-change count under the identity of the file, carried through its renames, so a commit counts once per file in and out of the retained window, and that a path created again after its file was renamed away is another file. Needs: HIST_V, MODEL_V.

ran: tests/cochange-lineage-outside-window.test.mjs on release/6.2.0 then on jarl/182-file-lineage (d7051e6) · saw: red 2 of 3 fail (the file's pair with p.js 15 of 19 where its commits are 12 of 14; footprints 16 commits of the file against 14), green 3 of 3 pass (12 of 14); incremental and cold walks give equal identities; cochange-whole-history updated for the new contract (a path created again keeps only its own commits)

