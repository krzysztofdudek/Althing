# 127 · cochange and completeness give different verdicts for the same pair of files with the same counts, because cochange drops touches of deleted files from the base-rate population

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-regk
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/cochange.mjs, Grain/plugins/grain/engine/completeness.mjs, Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/cochange.mjs:91 (unitResolver('file') returns null for a dead path), :105-111 (unitFootprints drops those touches from every fingerprint; on express 6156, `window.touchesOutsideAnyUnit`), :125-131 (unitAggregates counts touches and others from the trimmed fingerprints), :153-154 (partnerBits gets touches 5433 and othersA 251); history.mjs:664-668 and :757 (fileCommits, fileOthers and fileTouches count every touch, also of files later deleted), completeness.mjs:52-55 (reads fileTouches 11589 and othersA 467). A smaller difference: cochange.mjs:144-145 takes the index cost from 68 pairs recounted over live files (8 bits), and completeness.mjs:48 from `model.cochange.length`, 211 pairs (9 bits; docs/mathematics.md:212 says 'every directed pair the model holds'). The comment cochange.mjs:19-21 ('at file level the recount reproduces the per-file counts the model keeps') is false for `others`. The same code on main (6.1.0) and release/6.1.1.
**Branch:** jarl/048-cochange-one-population
**Merged:** 2d42a4f
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0 plus a CHANGELOG-only commit; fresh clone of express @023767fe; all numbers from the report match): `completeness lib/express.js` names History.md (71/152, 13.61 bits) and package.json (70/152, 1.44 bits). `cochange --files lib/express.js` (also with package.json and History.md added) shows the same counts (152, 1210, 985; together 71 and 70), does not certify the pair with package.json, and scores History.md at 3.87 bits.

Swapping one input at a time shows that the population is the cause. Recounting cochange with the model's population (othersA 467, touches 11589) gives 2.44 bits for package.json and 14.61 for History.md, that is, the completeness verdict plus 1 bit of difference in index cost. The model's counts with the cochange population (251, 5433) give null for package.json and 2.87 for History.md, that is, the cochange verdict. The partner share g/(T−n) in cochange roughly doubles, m = o/n falls, and the base rate 1−(1−π)^m changes, e.g. from 0.2908 to 0.3493 for lib/express.js→package.json.

Scale (larger than in the report): all directed pairs on express in which both files are alive and the raw counts in both commands match make 53 verdicts; 14 differ, and all 14 are named only by completeness (cochange named nothing that completeness did not). The strongest: `package.json -> lib/express.js` (39.94 bits in completeness, cochange does not name it at all) and `History.md -> lib/express.js` (36.3 bits versus nothing). `grain completeness package.json` names lib/express.js, and `grain cochange --files package.json` does not. Dropping dead files is not neutral: the commits of package.json touch few deleted files (213/1398, about 15%), while deleted files are 53% of all touches, so the base rates of its partners in cochange roughly double.

Partly documented: reference.md:870 (release/6.1.1 numbering) says that a file that no longer exists 'counts toward no unit', and the null curveball in cochange is consistent with commit sizes counted over live files only. But reference.md:872 promises 'the co-change cell `completeness` applies'. The only test (architect-commands.test.mjs:139) checks only the support count, on a fixture without deleted files. Closest: issue 048 ('grain cochange contradicts completeness', caused by renames). Here the counts are identical, there are no renames, and the difference comes from the population; the criterion of 048 requires only that the counts match, so its fix alone will not align the verdicts. Worth folding into the fix for 048 or doing alongside it.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f8-cochange-vs-completeness.log (the helper repro/dbg-cc-pop.mjs prints both populations); verification <the session scratchpad, since lost>/bughunt/grain/verify-65/v65-repro.log (script v65-repro.sh, helper decompose.mjs) and scale <the session scratchpad, since lost>/bughunt/grain/verify-65/v65-scale-express.log (scale.mjs) and <the session scratchpad, since lost>/bughunt/grain/verify-65/v65-reverse-direction.log.

## Why
Two of Grain's query surfaces name different partners for the same file, though the contract promises the same cell, and cochange always names fewer than completeness. Neither reading is shown to be statistically false; this is an inconsistency, not a failure or a false claim, but the 'same cell' promise is not kept.

## Acceptance
- At file level cochange uses the same population as completeness (all touches except mass commits, also of files later deleted) and the same index cost, or the documentation says that the two commands differ and why.
- express @023767fe: `grain cochange --files lib/express.js` and `grain completeness lib/express.js` name the same partners with the same bits, package.json included.

## Changelog
- Fixed: `grain cochange` and `grain completeness` now give the same verdict, with the same numbers, for the same pair of files; before, `cochange` named fewer partners on any repository that had deleted files.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/cochange-one-population.test.mjs (at cb3e416, then at 4cc4f00); express @023767fe: completeness lib/express.js --json vs cochange --files lib/express.js --json · **saw:** red: 2 of 2 fail (cochange names src/partner.js at 15.33 bits, completeness names nothing; touchesOutsideAnyUnit 88); green: 2 of 2 pass. express after: completeness History.md 13.61, package.json 1.43, test/exports.js 3.34, bin/express (deleted) 11.74; cochange in lib/express.js's direction History.md 13.61, package.json 1.43, test/exports.js 3.34 (before: History.md 3.87, test/exports.js 2.78, no package.json). Logs: <the session scratchpad, since lost>/patch-611/grain-048/before-ex127-*.txt, <the session scratchpad, since lost>/patch-611/grain-048/after-ex127-*.txt

docs: docs/reference.md:870 ('The unit'): at --level file a file that no longer exists still counts toward the commit sizes and the base rate, as it does for completeness, but no pair with it is named (completeness names it marked '(deleted)'); at dir and node level it counts toward no unit (window.touchesOutsideAnyUnit, now always 0 at file level). :872 ('The pairs'): the co-change cell completeness applies, over the same counts and, at file level, the same index cost (pairs above the floor, at most the 5 000 the model holds); docs/mathematics.md:212 'every directed pair the model holds' stays true.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1986, pass 1985, fail 0, skipped 1, merge 2d42a4f

