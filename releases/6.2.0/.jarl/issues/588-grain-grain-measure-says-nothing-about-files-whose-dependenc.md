# 588 · Grain: grain measure says nothing about files whose dependencies it could not read (a source over t…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1414-refp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-169c-fable
**Where:** the review of 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What
Grain: grain measure says nothing about files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), in its text or its JSON, so its counts of imports and undeclared dependencies read as complete. On the release branch every over-limit file was missing from those counts without a word.

## Why


## Acceptance


[test] grain measure names, in its text and in its JSON, the files whose dependencies it could not read (a source over the parse limit whose read gave no facts, a source the parser failed on), so its counts of imports and undeclared dependencies are not presented as complete, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain measure names every file whose dependencies it could not read, in its notes and as from.unread and to.unread in its JSON: a source over the parse limit whose read gave no facts, a source whose dependency read ended with an error, and a source the parser failed on.

## Reviews
- **changes** · by rev-573-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1940-mmlp
  Important 1 (631 line 1; the package as it lands): cd0c0fcf merged with release/6.2.0 at 7f5c3ef3 (a clean textual merge, tree cb118b36) is red. plugins/grain/engine/history.mjs is 50590 characters there: release brought it to 49988 (182/217 moved code to lineage.mjs) and 606's guard adds 602 (the try/catch in git() at history.mjs:36, batchOut at :49, started() in gitOk at :54). npm test on the merge: tests 2291, pass 2282, fail 2, skipped 7; the two are tests/engine-module-size-budget.test.mjs and the branch's own tests/own-graph-enforced-rules.test.mjs ('error[refused] engine/file-size-budget, 1 violation in plugin/engine/history'). So 631 line 1 fails on the release tip once this lands, and the oracle README's '1629 passed, 1 refused' is no longer what the check prints. Bring release in and move the guard out of history.mjs (process-start.mjs holds the rest of it) or otherwise bring the module under the budget. On cd0c0fcf alone both tests pass (7 of 7). | Important 2 (605 line 1): EXTR_V is still g37 (engine/config.mjs:7), though 592c2a87's body says 'Needs: EXTR_V'. Probe: a store written by the release code while the Python extractor threw on app/orders.py, read by cd0c0fcf: 2 file edges where a clean index gives 3, no 'dependencies not read' line, and grain refresh and grain refresh --full both print '8 from cache, 0 parsed'. The old entry {s, r: null} has no why, so readAgain (oversize-relations.mjs:145) keeps it as a file in a language without an extractor. Same shape as 169's Minor 3, which was made a condition of that merge and bumped on that branch. | Minor 1 (573, wording): for an over-limit Java file whose read gave no facts, a reference by simple name from its own package is missing from the model (com/x/A.java to com/x/Data.java: 2 edges to Data when read, 1 when unread), while the note says only 'dependencies from it are not resolved ...; 1 dependency to it is counted, from a file that names it by path or package' (report-facts.mjs:204). The old sentence was right about A; the new one no longer says that a dependency to the file by name is not resolved. | Minor 2: export.mjs:210 says the reader of lines at a commit is in history.mjs ('history.mjs has it'), and tests/own-graph-enforced-rules.test.mjs:3 says it comes 'from the history layer'; it is linesAtCommit in grain-export.mjs:17. | Minor 3 (606, by reading): three starts are still outside the guard. measure.mjs:255-259 turns any failure of git rev-parse, EMFILE included, into 'no commit X in this repository', a stop that names no limit and says something false; the history walk's spawn (history.mjs:314 on the merge) has no 'error' listener, so a refused start there is an uncaught crash; grain-check.mjs gitNameOnly and mergeBase rethrow the raw spawn error. Seven commands (status, report, where, check, export with and without anchors, measure) under ulimit -n 24 to 56 never reached them: each run stopped at an earlier guarded start with the ulimit -n message or gave the unlimited answer (export differed only in indexedAt). | Judged and found sound: e661b462 is acceptable. The oracle is a test fixture whose architecture file the loop has kept in step with the code before (486, 591, the 117 and 124 splits); the edit maps CHANGELOG.md, which exists, to repo/config, which the README's node already relates to, and adds one path to that type's when; no rule, scope, status, review_by or suppression changed. Moving the git read out of export.mjs is a real fix, not a dodge: the rule's own description names the dispatcher as a module that may talk to git, grain-export.mjs is mapped to plugin/dispatch (cli-dispatch, 'the ONLY module that may reach git for a query'), and the serializer now takes the reader as an input, so its output is a function of what it is given; the only other caller (grain-advise.mjs:590) passes anchors: false. 605's rule matches 169's: an extractor error is unfinished, kept and named through automatic refreshes, read again by grain refresh, and --full reads every file without facts; measure keeps an end only while the index holds that outcome or the outcome is the file's own, and never one built on a parser failure. Agreement probe (an extractor error, a parser failure and an over-limit file without facts in one repository): status, report, export and measure name the same three files and none gives an edge from them. 612 line 2 [read] holds: 'When grain measure reads an earlier commit's file itself and the read stops, its log line names the next grain measure, as its note does'; measure.mjs:92 passes readAgainBy 'the next grain measure', learn.mjs:90 hands it on, partition.mjs:259 and :281 print it, and the third test of address-space-limit-never-ends-the-run was red on 6ea10bd2 and is green. 631 line 2 [read] holds: 'The stress oracle's graph matches the tree again, or its README says plainly which parts are out of date and why its scores still mean something'; the README's dated paragraph lists mappings, repo/instruments, the director nodes, relations, drill cases and reviewer pairs, and says what a score still means. Guards attacked: ulimit -n 20 to 56 over seven commands; ulimit -v 1.5 to 5.0 GB with one file (four runs each up to 2.2 GB) and 1.6 to 2.4 GB with five files read one after another: no fatal end and no wrong answer on cd0c0fcf, where 6ea10bd2 ended fatally at most of those limits. No added text tells an agent to call Grain. Not run: the full suite on cd0c0fcf alone (the worker's 2250 pass, 0 fail stands; I ran it on the merge), Windows and macOS.
  outside the issue, filed as 643: Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6.2.0 and on jarl/573-grain-large-files (3.6 GB on both, 2.6 GB on release): the re-started process (--liftoff-only) aborts with SIGABRT (exit 134 when started directly), and bin/grain.mjs:71 turns a child ended by a signal into a plain exit 1 without a word; GRAIN_V8=off answers. A silent failure the change did not touch.
  outside the issue, filed as 644: Grain: grain check reads the checked file's dependencies with relFactsFor (engine/check.mjs:41), which swallows an extractor error (engine/relations.mjs:176-182), so a file whose relation extraction throws is checked as having no dependencies and nothing says so, while the index now names such a file under 'dependencies not read' (605). Found by reading; 640 names only Vue and Svelte.

## Evidence

### Proof

- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test tests/measure-names-unread-files.test.mjs before the fix, 8 GB cap · **saw:** 2 tests, 0 pass, 2 fail: the JSON of grain measure has no unread list at either end, and a file the parser failed on or whose extraction threw is named nowhere
- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test on tests/measure-names-unread-files.test.mjs after the fix; and the run before it over 14 test files that touch measure (measure-baseline-ancestors, measure-undeclared-like-yg, oversize-relations-counted and others), 8 GB cap, no YG_BIN · **saw:** the new file: 2 tests, 2 pass. The 14 files: tests 162, pass 156, skipped 5, fail 1, the one failure a control number in my own new test (imports counted per reference), corrected before the passing run
- **ran (line 165c52cc263b):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on cd0c0fcf · **saw:** tests 2256, pass 2250, fail 0, skipped 6, exit 0, 275 s
- **ran (line 165c52cc263b):** node --import ./tests/git-env.mjs --test tests/measure-names-unread-files.test.mjs on an extraction of 6ea10bd2 with the test copied in, and on cd0c0fcf; and a probe on cd0c0fcf with an extractor error, a parser failure and an over-limit file without facts in one repository · **saw:** before: 2 tests, 0 pass, 2 fail. After: pass. Probe: measure --json lists the same three files in to.unread (unfinished, parse-failed, empty) that status, report and export name, and its notes say each with the command that reads it again
- **ran (line 165c52cc263b):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on 69a44d09, the branch merged with release/6.2.0 · **saw:** tests 2296, pass 2289, fail 0, skipped 7, exit 0, 482 s

### Notes

Assumed: a parser failure on a file under the limit is not known to be the file's own answer, so an end of grain measure built with one is built again by the next grain measure. The JSON lists the files per end as from.unread and to.unread, always present, empty when every file was read. On the release branch the over-limit case was already named in the notes (169); what was missing was the structured list and the two other kinds.

Docs delta for the final pass: reference.md, grain-measure/1: each end carries unread: [{file, why, error?}], why parse-failed for a source the parser failed on, else the outcome of the relation read.

