# 605 · Grain: an ordinary file whose extractor throws is kept as having no relations until its stamp changes

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-juib
**Tags:** grain, relations
**Files:** 
**Repo:** Grain
**After:** 169
**Found by:** jarl
**Where:** w-169-takeover-fable, issue 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
An extractor exception depends on the code that ran, not on the file; keeping it as the file's answer hides the file's dependencies after the extractor is fixed or the moment passes.

## Acceptance
[test] A file under the parse limit whose extraction throws is reported as unread with the reason and read again by grain refresh, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: a source file whose dependency read ends with an error is named under 'dependencies not read' with the reason in status, report and the export (relCoverage.unparsed.unread), and grain refresh reads it again. Can turn a repository red: once the file is read, edges that were missing appear, and a graph that did not declare them fails yg check.

## Reviews
- **changes** · by rev-573-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1940-mmlp
  Important 1 (631 line 1; the package as it lands): cd0c0fcf merged with release/6.2.0 at 7f5c3ef3 (a clean textual merge, tree cb118b36) is red. plugins/grain/engine/history.mjs is 50590 characters there: release brought it to 49988 (182/217 moved code to lineage.mjs) and 606's guard adds 602 (the try/catch in git() at history.mjs:36, batchOut at :49, started() in gitOk at :54). npm test on the merge: tests 2291, pass 2282, fail 2, skipped 7; the two are tests/engine-module-size-budget.test.mjs and the branch's own tests/own-graph-enforced-rules.test.mjs ('error[refused] engine/file-size-budget, 1 violation in plugin/engine/history'). So 631 line 1 fails on the release tip once this lands, and the oracle README's '1629 passed, 1 refused' is no longer what the check prints. Bring release in and move the guard out of history.mjs (process-start.mjs holds the rest of it) or otherwise bring the module under the budget. On cd0c0fcf alone both tests pass (7 of 7). | Important 2 (605 line 1): EXTR_V is still g37 (engine/config.mjs:7), though 592c2a87's body says 'Needs: EXTR_V'. Probe: a store written by the release code while the Python extractor threw on app/orders.py, read by cd0c0fcf: 2 file edges where a clean index gives 3, no 'dependencies not read' line, and grain refresh and grain refresh --full both print '8 from cache, 0 parsed'. The old entry {s, r: null} has no why, so readAgain (oversize-relations.mjs:145) keeps it as a file in a language without an extractor. Same shape as 169's Minor 3, which was made a condition of that merge and bumped on that branch. | Minor 1 (573, wording): for an over-limit Java file whose read gave no facts, a reference by simple name from its own package is missing from the model (com/x/A.java to com/x/Data.java: 2 edges to Data when read, 1 when unread), while the note says only 'dependencies from it are not resolved ...; 1 dependency to it is counted, from a file that names it by path or package' (report-facts.mjs:204). The old sentence was right about A; the new one no longer says that a dependency to the file by name is not resolved. | Minor 2: export.mjs:210 says the reader of lines at a commit is in history.mjs ('history.mjs has it'), and tests/own-graph-enforced-rules.test.mjs:3 says it comes 'from the history layer'; it is linesAtCommit in grain-export.mjs:17. | Minor 3 (606, by reading): three starts are still outside the guard. measure.mjs:255-259 turns any failure of git rev-parse, EMFILE included, into 'no commit X in this repository', a stop that names no limit and says something false; the history walk's spawn (history.mjs:314 on the merge) has no 'error' listener, so a refused start there is an uncaught crash; grain-check.mjs gitNameOnly and mergeBase rethrow the raw spawn error. Seven commands (status, report, where, check, export with and without anchors, measure) under ulimit -n 24 to 56 never reached them: each run stopped at an earlier guarded start with the ulimit -n message or gave the unlimited answer (export differed only in indexedAt). | Judged and found sound: e661b462 is acceptable. The oracle is a test fixture whose architecture file the loop has kept in step with the code before (486, 591, the 117 and 124 splits); the edit maps CHANGELOG.md, which exists, to repo/config, which the README's node already relates to, and adds one path to that type's when; no rule, scope, status, review_by or suppression changed. Moving the git read out of export.mjs is a real fix, not a dodge: the rule's own description names the dispatcher as a module that may talk to git, grain-export.mjs is mapped to plugin/dispatch (cli-dispatch, 'the ONLY module that may reach git for a query'), and the serializer now takes the reader as an input, so its output is a function of what it is given; the only other caller (grain-advise.mjs:590) passes anchors: false. 605's rule matches 169's: an extractor error is unfinished, kept and named through automatic refreshes, read again by grain refresh, and --full reads every file without facts; measure keeps an end only while the index holds that outcome or the outcome is the file's own, and never one built on a parser failure. Agreement probe (an extractor error, a parser failure and an over-limit file without facts in one repository): status, report, export and measure name the same three files and none gives an edge from them. 612 line 2 [read] holds: 'When grain measure reads an earlier commit's file itself and the read stops, its log line names the next grain measure, as its note does'; measure.mjs:92 passes readAgainBy 'the next grain measure', learn.mjs:90 hands it on, partition.mjs:259 and :281 print it, and the third test of address-space-limit-never-ends-the-run was red on 6ea10bd2 and is green. 631 line 2 [read] holds: 'The stress oracle's graph matches the tree again, or its README says plainly which parts are out of date and why its scores still mean something'; the README's dated paragraph lists mappings, repo/instruments, the director nodes, relations, drill cases and reviewer pairs, and says what a score still means. Guards attacked: ulimit -n 20 to 56 over seven commands; ulimit -v 1.5 to 5.0 GB with one file (four runs each up to 2.2 GB) and 1.6 to 2.4 GB with five files read one after another: no fatal end and no wrong answer on cd0c0fcf, where 6ea10bd2 ended fatally at most of those limits. No added text tells an agent to call Grain. Not run: the full suite on cd0c0fcf alone (the worker's 2250 pass, 0 fail stands; I ran it on the merge), Windows and macOS.
  outside the issue, filed as 643: Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6.2.0 and on jarl/573-grain-large-files (3.6 GB on both, 2.6 GB on release): the re-started process (--liftoff-only) aborts with SIGABRT (exit 134 when started directly), and bin/grain.mjs:71 turns a child ended by a signal into a plain exit 1 without a word; GRAIN_V8=off answers. A silent failure the change did not touch.
  outside the issue, filed as 644: Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), which swallows an extractor error (engine/relations.mjs:176-182), so a file whose relation extraction throws is checked as having no dependencies and nothing says so, while the index now names such a file under 'dependencies not read' (605). Found by reading; 640 names only Vue and Svelte.

## Evidence

### Proof

- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs before the fix, 8 GB cap · **saw:** 2 tests, 0 pass, 2 fail: a Python file whose extractor throws is read once, is in no unread list, and status says nothing of it
- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs with the six other test files of unparsed and over-limit sources, after the fix, 8 GB cap, no YG_BIN · **saw:** tests 55, fail 0, 1 skipped (needs YG_BIN): the file is named under 'dependencies not read' with the error, a plain refresh keeps the answer without reading, grain refresh reads the file and its edge returns, in the library and on the command line
- **ran (line b926cb9b69ec):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on cd0c0fcf · **saw:** tests 2256, pass 2250, fail 0, skipped 6, exit 0, 275 s
- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs on an extraction of 6ea10bd2 with the test copied in, and on cd0c0fcf; and a store written by 6ea10bd2 while the Python extractor threw on app/orders.py, then read by cd0c0fcf with status, grain refresh and grain refresh --full · **saw:** before: 2 tests, 0 pass, 2 fail (unparsed.unread undefined; the note absent). After: pass. The old store under cd0c0fcf: 2 file edges where a clean index gives 3, no 'dependencies not read' line, and grain refresh and grain refresh --full both print 8 from cache, 0 parsed; EXTR_V is still g37
- **ran (line b926cb9b69ec):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on 69a44d09, the branch merged with release/6.2.0 · **saw:** tests 2296, pass 2289, fail 0, skipped 7, exit 0, 482 s
- **ran (line b926cb9b69ec):** node --import ./tests/git-env.mjs --test tests/extractor-error-read-again.test.mjs on 203c2403 · **saw:** 3 tests, 3 pass: an index rewritten to the old shape (no facts, no reason, extractor g37) is read again under g38 and the file's dependency is back

### Notes

Assumed: a file under the limit that was parsed is not 'not parsed', so the note names it under a heading of its own, 'dependencies not read', on the same line. Its failure is filed as unfinished, the outcome 169 gives an extractor error on an over-limit file.

Correction to my second row: that run printed tests 51, pass 50, fail 0, skipped 1, not 55.

Docs delta for the final pass: the size-limit page gains 'a source under the limit whose dependencies could not be read is named under dependencies not read with the reason, and grain refresh reads it again'; reference.md lists relCoverage.unparsed.unread and relCoverage.unparsed.inbound. Needs EXTR_V (commit body).

Round 1: EXTR_V is bumped to g38 in this branch at the examiner's word, though the brief reserves the stamps for the final pass; the final pass must not bump it a second time for this issue.

