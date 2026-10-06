# 113 · 'Nearest conforming exemplar' in check is not the nearest: it is always the convention's first global exemplar

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/check.mjs, Grain/plugins/grain/engine/export.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/tests/cross-file-exemplar.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/check.mjs:247 `const near = exs[0];`, where `exs` (:176) is `f.exemplars` without the deviation itself; f.exemplars is the fact's global triple, ranked in learn.mjs:273-294 by four keys (never a deviation elsewhere, never churn, firstborn, most recent touch), none of which measures the distance from the deviation. The real choice by proximity is `nearestExemplar` in export.mjs:153-175 (the same file, then the longest common directory prefix, then the same role), private to the module. tests/cross-file-exemplar.test.mjs:8-10 has all files in one directory. check.mjs:247 is unchanged on release/6.1.1.
**Branch:** jarl/104-check-change-attribution
**Merged:** 0b629c8
**CI:** none

## What
Reproduction (fresh Grain ae6152f; expressjs/express @7ef9844, both in verify-50/):

(1) Without `'use strict'` in examples/mvc/controllers/user/index.js, check says 'Nearest conforming exemplar: examples/auth/index.js:1', while the three neighboring controllers (main, pet, user-pet) start with `'use strict'` (log 02).
(2) examples/content-negotiation/users.js gets the same examples/auth/index.js, while the 'See:' line right below it lists examples/content-negotiation/db.js and index.js from the same directory (log 03).
(3) Two more deviations, examples/web-service/index.js and examples/mvc/lib/boot.js, also get examples/auth/index.js (log 04).
(4) A contradiction within one tool on one commit (2f93b05, a working branch in the clone, never pushed): `grain export` gives these deviations `nearest` api_v1.js → examples/multi-router/index.js and boot.js → examples/mvc/controllers/pet/index.js (log 08), while `grain check --all` on the same two files prints 'Nearest conforming exemplar: examples/auth/index.js:1' for both (log 07).

Re-ranking the 3 exemplars alone would fix the content-negotiation case, but not mvc, because none of the 3 lies under examples/mvc/; the real fix needs the fact's full set of conforming sites, or the label has to lose the word 'Nearest'. Side observation beyond the report: after one `'use strict'` deviation in examples is committed, the directive convention disappears from the export, while `check --all` still reports one existing deviation.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-3/f5-nearest-exemplar-not-nearest.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-50/logs/01-mvc-user-check.log and 02-first-lines.log, 03-content-negotiation-users-check.log, 04-two-more-deviants-review.log, 07-check-all-vs-export-nearest.log, 08-export-nearest.log in the same directory.

## Why
The file pointed to always conforms, so the advice is not wrong, only distant and misnamed. The check headline tells the reader to 'open the nearest neighbour and copy it', and the agent opens a file from another example instead of a neighbor in the same directory. Two Grain commands on the same commit give different 'nearest' exemplars. Neither the README nor docs/reference.md says anywhere that the check exemplar is global.

## Acceptance
- check picks the nearest conforming site (the same file, then the same or the nearest directory, like nearestExemplar in the export) or stops calling the exemplar 'Nearest'.
- express @7ef9844: without `'use strict'` in examples/mvc/controllers/user/index.js, check points to a file under examples/mvc/, and for examples/content-negotiation/users.js to a file from examples/content-negotiation/ (or the line does not claim that the exemplar is the nearest).
- tests/cross-file-exemplar.test.mjs has files in more than one directory.

## Changelog
- Fixed: the example `check` points you to is now the one closest to your file, and it is called the nearest only when it sits in your file's own folder.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/cross-file-exemplar.test.mjs (plugins/grain, extended fixture) at 4005a0b · **saw:** red: pass 3, fail 4 (HotelOnly in src/svc pointed at src/billing/aardvark.service.ts; NightlyOnly in src/jobs told 'Nearest')
- **ran:** same, at the 113 commit · **saw:** green: 7/7
- **ran:** <the session scratchpad, since lost>/patch-611/grain-104/express113.sh (express @7ef9844, scratch clone) before the fix · **saw:** both files: 'Nearest conforming exemplar: examples/auth/index.js:1'
- **ran:** same, after the fix · **saw:** examples/mvc/controllers/user/index.js: 'A conforming exemplar: examples/auth/index.js:1' (no exemplar of the fact under examples/mvc/); examples/content-negotiation/users.js: 'Nearest conforming exemplar: examples/content-negotiation/db.js:1'
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2008, pass 2007, fail 0, skipped 1, merge 0b629c8

