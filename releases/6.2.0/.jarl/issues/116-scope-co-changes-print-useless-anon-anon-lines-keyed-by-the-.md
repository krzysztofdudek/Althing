# 116 · Scope co-changes print useless '`<anon>` ↔ `<anon>`' lines keyed by the ordinals of anonymous functions, under the 'missing from your change' heading, and these pairs take over 90% of the scope pair budget

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-sill
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/completeness.mjs, Grain/plugins/grain/engine/grain-check.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/scopes.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/scopes.mjs:825-831 (`s.ord = n`, :829: every `<anon>` is told apart only by its position among scopes of the same kind and name), history.mjs:578 (the key kind#name#ord), :661 and :691-698 (pairs over every touched key, with no `<anon>` filter), learn.mjs:661-707 (the budget of 5000 pairs counted over all pairs), completeness.mjs:79-107 scopeCochangeLines (prints only `split('#')[1]` at :93, with no line, no ordinal, no `<anon>` filter and no check of whether the scope is in the change), grain-check.mjs:465-466 (the lines are appended right after the missingLines block). Every other consumer filters `<anon>`: check.mjs:39, learn.mjs:82 and :97, export.mjs:286, spectrum.mjs:31/44, propose-lattice.mjs:30. release/6.1.1 does not touch these files apart from the log text in history.mjs.
**Branch:** jarl/116-review-output-truth
**Merged:** b45af68
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 plus a CHANGELOG-only commit; express @7ef9844; logs in verify-52/logs/, the first line of each is the exact command):

- `grain check test/Router.js` prints under 'missing from your change:' the line 'co-change: lib/router/index.js (deleted)', and after it five lines like 'co-change (scopes): `<anon>` ↔ `<anon>` in package test (17/17 … 15/15)'; exit 0, output byte for byte the same as the finder's.
- Model: 5000 stored pairs (4964 within a file, 36 across files); 4610 have `<anon>` on both sides (finder: 4614), all within a file. The top Router.js pair is `test/Router.js#method#<anon>#82` ↔ `#84` (17/17); in response it is `lib/response.js#method#<anon>#11` ↔ `#12` (54/60).
- Exactly 10 of the 76 lib/*.js and test/*.js files print any scope line at all; in each of them every line (5 of 5) is `<anon>` ↔ `<anon>`, and all of them stand under the heading. On express, check never prints a named scope pair.
- Ordinal #82 is Router.js:362 and #84 is Router.js:372; in lib/response.js #12 is `res.vary = function(field){`, a public method that name extraction leaves anonymous.
- Inserting one `it()` at line 10 of a copy of the file shifts every later ordinal by one, and the key #82 then names a different callback.
- A mechanism beyond the report: a fixture with 10 commits, each of which only inserts a new callback at the top of the file and never edits an existing one, stores the pairs `<anon>#1↔#2` (sup 10), `#1↔#3` (9), `#2↔#3` (9), `#1↔#4` (8). The ordinal shift alone produces these numbers.
- Budget: the pre-budget store (loadHistory on a copy of the cache) has 28534 pairs, 28498 within a file: 27592 with `<anon>` on both sides, 731 with one side, 175 named on both. The budget drops 98 of the 175 named pairs (cut at sup 14); without the `<anon>` pairs all of them would fit. Cross-file pairs are protected by the split into halves (all 36 stay), so `advise` does not starve.
- Counterfactual without the `<anon>` pairs: check would print real named lines: lib/application.js `all ↔ use` (22/25), lib/response.js `attachment ↔ download` (15/20), lib/request.js `accepts ↔ is` (16/19); lib/utils.js and test/Router.js would print nothing.
- `check --all` prints the same bare lines, and `check --json` carries no scope pairs at all, so the user has no way to resolve the ordinals.

Mitigating: the post-edit hook speaks only the lines with the `[grain]` prefix (grain.mjs, around line 190), so these lines do not reach the agent unasked; the exit code and the gates do not change. A common cause with 042 (positional ordinals), but 042 covers replay, drift and steer, and its criteria cover neither this rendering nor the budget; the fix for 042 has to be checked against this issue, because an `<anon>` scope, even with a stable identity, has no name to show.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-3/f9-anon-scope-cochange.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-52/logs/v52-check-router.log and v52-model-counts.log, v52-sweep.log, v52-anon-identities.log, v52-anon-lib.log, v52-ordinal-shift.log, v52-fixture-shift.log, v52-budget.log, v52-counterfactual.log, v52-json-all.log in the same directory.

## Why
docs/validation.md:567 calls a scope co-change 'a pair of NAMED DECLARATIONS', the grain-advise.mjs header speaks of pairs 'of named declarations that a maintainer can open and read', and the test scope-cochange.test.mjs:162 says the line is 'naming both scopes'. Lines with no name and no line number give the agent nothing to act on, and the `<anon>` pairs push real named pairs within a file out of the budget.

## Acceptance
- Anonymous scopes with an ordinal do not enter scope co-changes (or are rendered with their current line and do not count toward the budget).
- Scope co-change lines do not stand under the 'missing from your change' heading.
- express @7ef9844: `grain check test/Router.js` does not print '`<anon>` ↔ `<anon>`', and `grain check lib/application.js` prints the pair `all ↔ use`.

## Changelog
- Fixed: `grain check` no longer prints pairs of unnamed functions as declarations that change together, and the pairs it does print now sit under their own heading instead of under "missing from your change".

## Evidence

docs: docs/validation.md, grain advise change-together paragraph (pairs of NAMED DECLARATIONS): numbers were measured with <anon> pairs in the store; re-measure or state that scope co-change now holds named declarations only. docs/reference.md check <file> output: scope co-change lines have their own heading 'declarations that changed together in past commits:'.

express @7ef9844 (fresh clone): before (release/6.1.1) check test/Router.js printed 5 '<anon> ↔ <anon>' lines, model 5000 pairs / 1 named-both; after: no scope lines, model 21 pairs, 0 anonymous. Acceptance 'check lib/application.js prints all ↔ use' NOT met: in history use/all are named scopes in 11/8 commits, together in 3 (< cochangeMinSup 8). Remaining 21 pairs are test/view.test.js case '/' #10..#16 — ordinal-keyed same-name scopes, the 042 family. Logs: scratchpad/patch-611/grain-116/116-{before,after}-{router,app}.log

red→green: tests/scope-cochange-named-only.test.mjs — before 0/3 (model held <anon> pairs; check printed '<anon> ↔ <anon>' under 'missing from your change:'); after 3/3. Commit d3329ea. Needs: MODEL_V.

116 commit amended to 268e666: scope-cochange-cap-split.test.mjs express oracle now cuts the budget over NAMED store pairs (store 23374 pairs, 21 named, 0 named cross-file); it asserts no anonymous pair in the model, min(budget, named) retained, every named cross pair kept. Full gate (YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES): 2202 tests, 2201 pass, 0 fail, 1 skip.

Ruling 116-no-all-use: The acceptance line of 116 about printing the pair all ↔ use on express is dropped: the data show that these methods change together as named functions in only 3 commits, below the threshold of 8, so the requirement stood on a false premise. The contract of 116 remains: pairs with an anonymous side neither use up the budget nor print, and named pairs that meet the threshold print under their own heading. Same-name pairs keyed by position stay with 042. The JSON key names recipe and kinStem (129) are accepted.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2202, pass 2201, fail 0, skipped 1, merge b45af68

