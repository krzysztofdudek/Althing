# 115 · The 'missing from your change' block in review spends its limited slots on deleted files, and the change shape points to a directory that has not existed since 2011

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-ncek
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/completeness.mjs, Grain/plugins/grain/engine/commit-log.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** (1) plugins/grain/engine/completeness.mjs:40-71: cochangeData sets `dead: !live.has(file)` (:58, :60), but leaves the dead hits on the sorted list, and missingLines cuts it to 5 (:225). (2) commit-log.mjs:166-181: applyChangeArchetypes builds cells from `currentPathOf(H.fps, liveM)`, which only follows renames, so a file deleted without a rename keeps its dead path; liveM never drops a dead cell or archetype, so the comment at :154 ('still-live coordinates') is not true; the review renderer (completeness.mjs:374-385) prints absent certified cells as `absent: lib/view/ (7 of 7)` with no dead marker. Unchanged on release/6.1.1.
**Branch:** jarl/048-cochange-one-population
**Merged:** 2d42a4f
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 ae6152f, engine 6.1.0; fresh clone of express @7ef9844): one comment line `// tweak` appended to lib/application.js, then `grain review`. Co-change lines: lib/response.js 31/179, lib/router/index.js (deleted) 21/179, lib/utils.js 21/179, lib/middleware.js (deleted) 11/179, lib/router/route.js (deleted) 10/179, and after them 'change shape: this change touches 1 of 2 certified cells of "lib/view/ + lib/" — absent: lib/view/ (7 of 7)'.

- An own tool, tools/allpartners.mjs, calls Grain's cochangeData without a limit: 6 partners pass the gate, 3 of them dead; the 6th is the live test/app.use.js 10/179, which loses a tie on name to the dead lib/router/route.js 10/179.
- `git show -M` confirms real deletions, not renames (so this is not issue 048): lib/router/index.js and lib/router/route.js in cec5780d (2015-07-06), lib/middleware.js in 1396e085 (2014-02-15), lib/view/* in 7710db45 (2011-10-07, which changes lib/view.js and deletes lib/view/view.js). A small correction: on the merged 4.x line lib/router/* was edited until 2023 (`--full-history`), but at HEAD these files do not exist.
- 20 of the 39 certified archetypes of express have a certified module cell over a directory with no tracked file at HEAD: lib/express, spec, examples/chat, lib/view, lib/router, docs, docs/layout, support, bin. `report` lists 'examples/chat/ + lib/express/' and the spec/ shapes, `map` names 'examples/chat/ + lib/express/'; `session-context` on this repo prints no shapes.

The same cause reaches the hooks (the pre-edit hook with a limit of 3: 'before you edit lib/application.js, note: edits like this also touch: lib/response.js · lib/router/index.js (deleted) · lib/utils.js'); the hook part is in issue 114.

Grain has its own liveness rule (tests/cross-check-liveness.test.mjs:1-21: no surface may name a path absent at HEAD unless it marks it or omits it). The shape line names lib/view/ without a marker, and the test checks only file paths, never the shape lines in review. For `how`, commit 654e1f9 (§066) decided to skip dead sites, because 'marking still handed a dead file to the reader as somewhere to edit'; that reasoning applies all the more to the 'missing from your change' block. commit-log.mjs:256-258 says that absent cells are rendered 'as a missing place to go add a file to'. Distinct from 050 (the `where` cards).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-3/f7-change-shape-dead-directory.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-51/v51-review.log and v51-allpartners.log, v51-edit-hook.log, v51-deleted-history.log, v51-dead-shapes.log, v51-report-map-session.log in the same directory (the first line of each log is the exact command).

## Why
A block titled 'missing from your change' hands the agent files that do not exist and pushes a live partner beyond the limit, and the change-shape line suggests adding work in a directory that has not existed since 2011. Nothing breaks, and the co-change lines are marked, but the advice is louder and loses the real signal.

## Acceptance
- Paths that do not exist at HEAD are not given as missing from the change and are dropped before the 5-line limit in missingLines.
- Change-shape cells and archetypes are limited to directories that exist at HEAD (review, report, map).
- express @7ef9844 with a comment appended to lib/application.js: `grain review` lists test/app.use.js among the co-changes, lists no '(deleted)' file in the missing block and gives no shape with lib/view/.

## Changelog
- Fixed: the "missing from your change" note no longer spends its lines on deleted files, and its change-shape line no longer points to folders that no longer exist.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/missing-from-change-live.test.mjs (at 4cc4f00, then at 819b649); express @7ef9844 with '// tweak' appended to lib/application.js: grain review, report, map · **saw:** red: 3 of 3 fail (five '(deleted)' lines cut test/use.js; 'absent: tests/fixtures/ (8 of 8), *.fixture.ts (8 of 8)'); green: 3 of 3 pass. express after: missing = lib/response.js 31/183, lib/utils.js 21/183, lib/express.js 18/183, test/app.use.js 10/183, no '(deleted)', no change-shape line; report/map name no lib/view/, lib/express/, spec/, examples/chat/. Logs: <the session scratchpad, since lost>/patch-611/grain-048/before-ex115-*.txt, <the session scratchpad, since lost>/patch-611/grain-048/after-ex115-*.txt

docs: docs/reference.md 'missing: sources' table: cochange row fires for a partner that still exists at HEAD (a deleted one is left out before the cap of five; completeness names it marked '(deleted)'); shape row: an archetype's cells are modules and suffixes some file still has at HEAD. Needs: MODEL_V.

docs: docs/validation.md, 'Commit archetypes, held to a test the clustering does not decide' (express row, 105 certified cells): measured before 6.1.1's live-cells rule; express @7ef9844 now shows 31 shapes (was 39), 77 certified cells; re-measure the row or date it.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1986, pass 1985, fail 0, skipped 1, merge 2d42a4f

