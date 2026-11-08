# 059 · Jarl: visual review has no kind and no verdict per artifact

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-467627b4
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8
**After:** 035, 083
**Branch:** jarl/006-ceiling-artifact-use
**Worker:** w-jarl-006-opus
**Worktree:** /home/me/Worktrees/JarlSkill/006-ceiling-artifact-use
**Since:** 2026-11-08 11:18

## What
Claim: The most valuable finds were visual, and the rule that every render gets a visual reviewer could not be enforced. Corrected by the sceptic: Correct the evidence: a profile kind with required render slots already gates done; the owner's question narrows to a verdict per artifact and a gate at merged.

No review kind exists; attachments exist only for profile slots and not on verdicts. Map row fr-25.

## Why


## Acceptance
- review takes --artifact <path> naming the render or file a verdict judged, written under format 3 (083); report counts verdicts that name an artifact
- No gate at merge: Jarl never blocks landing; the owner's own looks are owner-only lines (039)
- Tests

## Changelog
- Added: A review can name the screenshot, render or file it judged, so each look at a picture is its own verdict on record. The task shows it with the verdict and the report counts such reviews. It never holds back a merge, and the first one moves the loop to format 3.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (on the release branch at 0e17fb9, before the change) · **saw:** tests 7, pass 0, fail 7: review refuses --artifact as an unknown flag, and a finding that opens like an artifact mark is written without the lead-in
- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/log-reader.test.mjs tests/brief.test.mjs (at 191e60b) · **saw:** pass 61, fail 0: the path is stored as given on the verdict line and the Reviews entry and shown by show; absolute, home, share and climbing paths are refused with the --artifact form and nothing written; the first one raises format 3, which the pinned 6.1.0 and 6.2.0 readers refuse; a composer's loop refuses it; report counts 3 (approve 2, changes 1) on 2 issues; done is not gated; the brief pairs the entry
- **ran:** 26 read views (status, resume, next, next --as jarl and owner, list, report, report --metrics, decisions, branches, verify, models, profile, show, brief, with their --json forms) by jarl.mjs at 0e17fb9 and at 2bc8040, each on its own copy of this loop with the tool repositories linked, then diff -r of the outputs · **saw:** only ageMs differs, in resume --json and status --json; every exit code is the same (verify 2 on both); closedGate holds 028 alone on both; the two copies stayed byte-identical after the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 2bc8040) · **saw:** tests 1603, pass 1581, fail 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/brief.test.mjs (the new tests before the fix) · **saw:** tests 47, pass 46, fail 1: review --artifact a file-scheme address of a home path was accepted and written
- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs tests/brief.test.mjs (at 20943f8) · **saw:** tests 47, pass 47, fail 0: the file scheme/, the file scheme/C:/, https://, http://localhost, $HOME, ${HOME} and %USERPROFILE% are refused with the --artifact form and nothing written; the oracle with the artifact letters and mark holds over 54823 histories (4520 ambiguous, 17339 out of order)
- **ran:** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 907489c) · **saw:** tests 1621, pass 1599, fail 0, skipped 22, exit 0; the decoy loop's log is byte-identical after the run and it holds no issue
- **ran:** cd skills/jarl/scripts && node --test tests/brief.test.mjs (after the merge of the release branch at 8693a56) · **saw:** pass 46 of 46: the oracle with J3's pairing and the artifact field and lead-in holds over 54823 histories, ambiguous 4520, pointing 36136, out of order 17339
- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (the new tables on the merge, before the fix) · **saw:** tests 9, pass 6, fail 3: file:x.png and the other one-slash and no-slash file forms, localhost:3000, mailto:, data: and javascript: were written; price$total.png, a$b/c.png and renders/x%y%.png were refused as variables; the help and reviewer.md said the rule in different words
- **ran:** cd skills/jarl/scripts && node --test tests/verdict-artifact.test.mjs (at the fix) · **saw:** tests 9, pass 9, fail 0: 41 values refused with the --artifact form and nothing written (file with 0 to 4 slashes in any case, https, HTTP localhost, localhost:3000, 127.0.0.1:8080, mailto, data, javascript, svn+ssh, drives and a:b, roots, shares, homes, variables at a segment start, climbs, a separator, a line break, empty); 10 written as given (renders/home page.png, ./x, a/../b, renders\x, renders/50%.png, price$total.png, a$b/c.png, renders/x%y%.png, renders/old/../home.png, v2.png); one rule sentence in the help and reviewer.md

