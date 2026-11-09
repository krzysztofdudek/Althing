# 059 · Jarl: visual review has no kind and no verdict per artifact

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0838-gaaw
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-467627b4
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8
**After:** 035, 083
**Branch:** jarl/006-ceiling-artifact-use
**Merged:** f3d096322f6243bbf8604e22cb4d7e08f3996f33 in ../../../JarlSkill
**CI:** none

## What
Claim: The most valuable finds were visual, and the rule that every render gets a visual reviewer could not be enforced. Corrected by the sceptic: Correct the evidence: a profile kind with required render slots already gates done; the owner's question narrows to a verdict per artifact and a gate at merged.

No review kind exists; attachments exist only for profile slots and not on verdicts. Map row fr-25.

## Why


## Acceptance
- review takes --artifact <path> naming the render or file a verdict judged, written under format 3 (083); report counts verdicts that name an artifact
- No gate at merge: Jarl never blocks landing; the owner's own looks are owner-only lines (039)
- Tests

## Changelog
- Added: A review can name the screenshot, render or file it judged, so each look at a picture is its own verdict on record. It takes a plain path inside the repository and refuses an address or a place on one computer. The task shows it with the verdict and the report counts such reviews. It never holds back a merge, and the first one moves the loop to format 3.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (on the release branch at 0e17fb9, before the change) · **saw:** tests 7, pass 0, fail 7: review refuses --artifact as an unknown flag, and a finding that opens like an artifact mark is written without the lead-in
- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/log-reader.test.mjs tests/brief.test.mjs (at 191e60b) · **saw:** pass 61, fail 0: the path is stored as given on the verdict line and the Reviews entry and shown by show; absolute, home, share and climbing paths are refused with the --artifact form and nothing written; the first one raises format 3, which the pinned 6.1.0 and 6.2.0 readers refuse; a composer's loop refuses it; report counts 3 (approve 2, changes 1) on 2 issues; done is not gated; the brief pairs the entry
- **ran (history):** 26 read views (status, resume, next, next --as jarl and owner, list, report, report --metrics, decisions, branches, verify, models, profile, show, brief, with their --json forms) by jarl.mjs at 0e17fb9 and at 2bc8040, each on its own copy of this loop with the tool repositories linked, then diff -r of the outputs · **saw:** only ageMs differs, in resume --json and status --json; every exit code is the same (verify 2 on both); closedGate holds 028 alone on both; the two copies stayed byte-identical after the views
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 2bc8040) · **saw:** tests 1603, pass 1581, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/brief.test.mjs (the new tests before the fix) · **saw:** tests 47, pass 46, fail 1: review --artifact a file-scheme address of a home path was accepted and written
- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/brief.test.mjs (at 20943f8) · **saw:** tests 47, pass 47, fail 0: the file scheme/, the file scheme/C:/, https://, http://localhost, $HOME, ${HOME} and %USERPROFILE% are refused with the --artifact form and nothing written; the oracle with the artifact letters and mark holds over 54823 histories (4520 ambiguous, 17339 out of order)
- **ran (history):** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 907489c) · **saw:** tests 1621, pass 1599, fail 0, skipped 22, exit 0; the decoy loop's log is byte-identical after the run and it holds no issue
- **ran (history):** cd skills/jarl/scripts && node --test tests/brief.test.mjs (after the merge of the release branch at 8693a56) · **saw:** pass 46 of 46: the oracle with J3's pairing and the artifact field and lead-in holds over 54823 histories, ambiguous 4520, pointing 36136, out of order 17339
- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (the new tables on the merge, before the fix) · **saw:** tests 9, pass 6, fail 3: file:x.png and the other one-slash and no-slash file forms, localhost:3000, mailto:, data: and javascript: were written; price$total.png, a$b/c.png and renders/x%y%.png were refused as variables; the help and reviewer.md said the rule in different words
- **ran (history):** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (at the fix) · **saw:** tests 9, pass 9, fail 0: 41 values refused with the --artifact form and nothing written (file with 0 to 4 slashes in any case, https, HTTP localhost, localhost:3000, 127.0.0.1:8080, mailto, data, javascript, svn+ssh, drives and a:b, roots, shares, homes, variables at a segment start, climbs, a separator, a line break, empty); 10 written as given (renders/home page.png, ./x, a/../b, renders\x, renders/50%.png, price$total.png, a$b/c.png, renders/x%y%.png, renders/old/../home.png, v2.png); one rule sentence in the help and reviewer.md
- **ran (history):** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 10ba5ca) · **saw:** tests 1658, pass 1636, fail 0, skipped 22, exit 0; the decoy's log is byte-identical and it holds no issue
- **ran (history):** the rule of review --artifact as the help and references/reviewer.md state it, one sentence compared by a test (skills/jarl/scripts/jarl.mjs at 7134b7d) · **saw:** one allowlist: a relative path inside the repository in plain characters (letters and digits with their marks, spaces and . _ - + @ # , = ( ) [ ], a dollar sign only between two letters or digits, a percent sign neither first in a segment nor before two hex digits, a slash or a backslash between segments); no segment is empty, ends with a dot or a space (but an opening ./) or is a device name of Windows; no leading dash; at most 260 characters; unchanged by NFC; no letter, digit or mark whose NFKC form holds more than letters, digits and marks; anything else refused, among it a colon wherever it stands, a tilde, and a .. segment even where it stays inside
- **ran (history):** cd skills/jarl/scripts && node --test tests/artifact-path.test.mjs tests/verdict-artifact.test.mjs (the new tests on the validator of 10ba5ca, exported and otherwise unchanged) · **saw:** tests 12, pass 9, fail 3: over 35601 generated values the old validator wrote 19407 that the oracle refuses and refused none it accepts; the real command wrote the first decided refusal it was given; the refusal table reads reasons the old code does not give
- **ran (history):** cd skills/jarl/scripts && node --test tests/artifact-path.test.mjs tests/verdict-artifact.test.mjs (at 7134b7d) · **saw:** tests 12, pass 12, fail 0: the oracle written from the sentence agrees with the command on all 35601 generated values (2516 accepted, 33085 refused, 0 disagreements) and gives every decided value its decided answer; 156 decided values through the real review command on one loop: 29 written and read back exactly from the verdict lines, the Reviews entries, show, show --json and report --json, 127 refused with the --artifact form and every file of the loop unchanged
- **ran (history):** three mutations of the new validator, one at a time (no invisible-character check; no hex-pair rule for a percent sign; no superscript digits in the device names), each followed by node --test tests/artifact-path.test.mjs and the file put back · **saw:** 432, 430 and 133 disagreements: the property test fails on each
- **ran (history):** cd skills/jarl/scripts && node --test on the two artifact tests and brief, log-reader, surface, docs-true, tense, vocabulary, modules, description, help-workflow, record-contract, mcp and jarl tests (the tree of 7134b7d) · **saw:** tests 386, pass 385, fail 0, skipped 1
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 7134b7d) · **saw:** tests 1661, pass 1639, fail 0, skipped 22, exit 0
- **ran (history):** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 7134b7d) · **saw:** tests 1661, pass 1639, fail 0, skipped 22, exit 0; every file of the decoy loop hashes the same after the run and it holds no issue
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on the review result line of lib/review.mjs and on two flag-field lines of references/commands.md, resolved by keeping both sides · **saw:** tests 1674, pass 1652, fail 0, skipped 22, merge f3d0963

