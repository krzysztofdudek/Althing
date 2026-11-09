# 048 · File co-changes do not follow a rename: a renamed partner is reported as '(deleted)', the renamed file loses all its partners, and `grain cochange` contradicts `completeness`

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-hcph
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/completeness.mjs, Grain/plugins/grain/engine/cards.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:664 (`state.fileCommits[f]`) and :704 (`state.pairSup[k]`) keyed by the path at commit time, toH() :712 emits H.cochange with these keys; learn.mjs:651 `model.cochange = H ? capCochange(H.cochange) : []` without remapping (model.scopeCochange :661-670 is remapped through currentPathOf); completeness.mjs:42-71 cochangeData (`c.a === f`, `dead: !live.has(file)`); cards.mjs:299 (where)
**Branch:** jarl/048-cochange-one-population
**Merged:** 2d42a4f
**CI:** none

## What
Reproduction (Grain ae6152f = 6.1.0, synthetic repo): src/a.js and src/b.js change together 12 times, then `git mv src/a.js lib/a.js` (R100), then 3 more joint changes. `grain completeness src/b.js` → 'src/a.js (deleted) (co-changed in 13/16 commits)', `--json` dead:true; `grain completeness lib/a.js` → 'no file changes with these more often than it changes anyway', partners empty; `grain check src/b.js` and the pre-edit hook say the same, and for lib/a.js they are silent. `grain cochange --files src/b.js,lib/a.js --runs 0` → 'lib/a.js ↔ src/b.js: together in 16 commits (16 of 17 for lib/a.js, 16 of 16 for src/b.js)'; `git log --follow` counts 17 commits of lib/a.js. Control without the move: `completeness src/a.js` gives src/b.js 16/16. `review` on a change to src/b.js has in the missing block: 'co-change: src/a.js (deleted)', while the change-shape line right below it says 'absent: lib/ (15 of 15)', because the archetype layer is remapped. pallets/flask @d73fa1c (R100 src/flask/scaffold.py → src/flask/sansio/scaffold.py): `completeness src/flask/app.py` → 'src/flask/scaffold.py (deleted) (co-changed in 27/131 commits)', `completeness src/flask/sansio/scaffold.py` has no partners, and `grain cochange` counts 479 commits of src/flask/app.py against 131 in completeness (350 commits under the old path flask/app.py drop out). A trap for the fix: toH cuts pairs below cochangeMinSup, capCochange cuts at 5000 pairs before any remapping, and the rename commit touches both the old and the new path; it has to be recounted from fps through currentPathOf with deduplication within the commit, as cochange.mjs does, not by summing ready-made pairs. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-15/verify-15-cochange-renames.log (script <the session scratchpad, since lost>/bughunt/grain/verify-15/make-rename.sh).

## Why
After every rename or directory move, that is after every refactor, the co-change advice the hooks print on every edit is wrong in two ways: it loses the renamed file's partners and tells the agent that a live companion is deleted. The contract in docs/reference.md:851 ('A touched path is carried to the path it lives at today') and :853 (cochange uses 'the co-change cell `completeness` applies') assumes the two commands agree.

## Acceptance
- File co-changes are counted under today's path (a recount through currentPathOf with deduplication within the commit) for completeness, check, review, the hooks and where; a renamed partner is named by today's path, not '(deleted)'.
- The synthetic repo from the reproduction: `grain completeness lib/a.js` gives src/b.js, `grain completeness src/b.js` gives lib/a.js without '(deleted)', and the numbers agree with `grain cochange --files src/b.js,lib/a.js --runs 0`.

## Changelog
- Fixed: after a file is renamed or moved, the files that change with it are still named, by the path the file has today; the renamed file no longer loses them and is no longer reported as deleted.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/cochange-follows-renames.test.mjs (at release/6.1.1, then at cb3e416) · **saw:** red: 4 of 4 fail (completeness lib/a.js names nothing; src/b.js names 'src/a.js (deleted) 13/16'); green: 4 of 4 pass (lib/a.js names src/b.js 16/17, src/b.js names lib/a.js 16/16, bits equal grain cochange --files src/b.js,lib/a.js --runs 0: 16 of 17 / 16 of 16). Logs: <the session scratchpad, since lost>/patch-611/grain-048/red-048.log, <the session scratchpad, since lost>/patch-611/grain-048/green-048.log

docs: docs/reference.md: completeness row (:24) and the 'missing:' cochange row: co-change is counted over the retained commit footprints (newest 20 000 non-bulk commits), each touch carried to the path the file lives at today and counted once per commit. Needs: MODEL_V.
- **ran (history):** round 2 (12de9b9): tests/cochange-whole-history.test.mjs at 819b649 then 12de9b9; reviewer's make-chains.sh and make-old.sh with fpsCap 30 · **saw:** red 3 of 4 fail (population 30 not 51; bulk move not followed; per-path double count), green 4 of 4. Chains: completeness = cochange for all 8 files (lib/a.js p.js 14/15 19.53 bits, d.js r.js 11/12, src/x.js s.js 9/12). cap30: completeness x.js names y.js 11/11 again, cochange --files x.js names 0 pairs over its 30-commit window. express @023767fe: all 225 held pairs equal the footprint recount; lib/express.js partners and bits equal in both commands. npm test 1951/1922 pass/0 fail/29 skip. Logs: <the session scratchpad, since lost>/patch-611/grain-048/red-048-r2.log, <the session scratchpad, since lost>/patch-611/grain-048/green-048-r2.log, <the session scratchpad, since lost>/patch-611/grain-048/r2-chains.txt, <the session scratchpad, since lost>/patch-611/grain-048/r2-cap30.txt

docs: docs/reference.md:872 ('The pairs'): grain cochange counts over the retained footprints (the newest 20 000 non-bulk commits); completeness, check, review, the hooks and where count file co-change over the whole history, carried to today's paths; on a history of fewer non-bulk commits the two agree exactly. Needs: HIST_V, MODEL_V.

docs: docs/mathematics.md:292: fpsCap also bounds the window grain cochange counts over; the model's file co-change is counted over the whole history, so no co-change claim of completeness/check/review/hooks/where rests on fpsCap.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1986, pass 1985, fail 0, skipped 1, merge 2d42a4f

