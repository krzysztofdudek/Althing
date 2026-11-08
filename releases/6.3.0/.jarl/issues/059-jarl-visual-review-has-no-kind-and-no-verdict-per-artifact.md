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

