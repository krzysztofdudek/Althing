# 058 · Jarl: reviewer, worker and takeover briefs are written by hand

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-deca710c
**Where:** JarlSkill/skills/jarl/references/reviewer.md:18 at a1132a8
**After:** 035, 085, 086
**Branch:** jarl/058-brief-command
**Merged:** 6847047 in ../../../JarlSkill
**CI:** none

## What
Claim: About 30 reviewer briefs and 2 takeover briefs were hand-written, each a chance to forget a ruling or an acceptance line. Corrected by the sceptic: Severity low: what is left is assembling show, the standing brief of 020 and the review command into one text; the takeover brief exists.

The reviewer brief is a template in references/reviewer.md and the worker gets show pasted; no brief command. Map row fr-24; issue 020 adds a standing brief.

## Why

Briefs written by hand drop rules and acceptance lines; a brief assembled from the record carries every rule that matches and the command that records the result.

## Acceptance
- brief <id> (worker), brief <id> --role reviewer and brief --slice <s> (coordinator) are read-only and assembled when asked: the issue as show prints it, the rules with a scope that match (086), the findings of earlier rounds, the proof rows, links to the role reference, and the exact command that records the result
- The same data is exported through record.mjs as an additive function, so other renderers can use it
- Tests for each brief, including that a rule of another slice or role is absent

## Changelog
- Added: Jarl can write the brief you hand to a worker, a reviewer or a coordinator, so you no longer write it by hand: the task, the rules meant for that person, what earlier reviews found, the proof so far and the command that records the result. A tool built on Jarl can get the same brief as data.

## Evidence

Field example, distilled from the owner's private work (no names): a reviewer's finding was fixed by switching a required behaviour off for one field; the next review rounds, briefed by hand with the earlier findings only, checked that the finding was gone and not that the fix kept every acceptance line, and the loss surfaced only in a later requirements audit. Jarl's reviewer reference already asks every review, above all after a round, to check the acceptance line literally and whether the fix weakened anything that worked; the hand-written briefs did not carry it. The rule existed; its delivery failed.
- **ran:** skills/jarl/scripts at release/6.2.1 fa23bbd with tests/brief.test.mjs of 9e045ee copied in: node --test tests/brief.test.mjs · **saw:** tests 10, pass 0, fail 10 (unknown command: brief; R.briefData is not a function)
- **ran:** JarlSkill-058 at 9e045ee, skills/jarl/scripts: node --test tests/brief.test.mjs · **saw:** tests 10, pass 10, fail 0 (worker, reviewer with rounds and findings, takeover, coordinator, undeclared and empty slice, refusals with forms and nothing written, --root carried and no worktree path, long issue and CRLF, library parity; rules of another slice or role absent)
- **ran:** copy of releases/6.3.0/.jarl: jarl.mjs brief 016, release tip fa23bbd vs 9e045ee · **saw:** before: unknown command: brief, exit 1; after: exit 0, 49 lines, show text, Rules for the worker of 016 (1) jarl:worker-only-the-issue, 51 ruling(s) in force, Rounds/Findings/Proof (0), evidence and field Changelog forms with --root
- **ran:** copy of releases/6.3.0/.jarl at 9e045ee: jarl.mjs brief 015 --role reviewer (done, 3 rounds); brief --slice odin · **saw:** 015: exit 0, 93 lines, 4 reviewer rules incl. jarl:reviewer-every-round, Rounds so far (3), Findings (3) whole from the log, Proof rows (17), review form; --slice odin: refused, the loop has no slice (the copy has no Coordinators line or slice tag), form goal --set; diff -rq original copy: no change
- **ran:** JarlSkill-058 at 9e045ee, skills/jarl/scripts: TMPDIR=<scratch> nice -n 15 timeout 2400 npm test · **saw:** tests 1203, pass 1183, fail 0, cancelled 0, skipped 20, exit 0
- **ran:** skills/jarl/scripts at 9e045ee with tests/brief.test.mjs of 63354af copied in: node --test tests/brief.test.mjs · **saw:** tests 14, pass 10, fail 4: journal-only findings then file findings, a Reviews section that does not line up, a Worktree header left out, a takeover of three unmarked rounds
- **ran:** JarlSkill-058 at 63354af, skills/jarl/scripts: node --test tests/brief.test.mjs tests/seams.test.mjs tests/modules.test.mjs · **saw:** tests 33, pass 33, fail 0
- **ran:** copies of releases/6.3.0/.jarl at 63354af: jarl.mjs brief 031 --role reviewer; brief 015 --role reviewer; on a second copy review 031 changes by rev-scratch-058 then brief 031 --role reviewer · **saw:** 031: Rounds so far (6), Findings (6), log holds 6 changes lines; 015: Rounds (3), Findings (3), log 3; after one more review written to the file: Rounds (6), Findings (7), no line-up note; brief 058 prints no Worktree: line; brief 031 roles takeover, worker
- **ran:** JarlSkill-058 at 63354af, skills/jarl/scripts: TMPDIR=<scratch> nice -n 15 timeout 2400 npm test · **saw:** tests 1207, pass 1187, fail 0, cancelled 0, skipped 20, exit 0
- **ran:** skills/jarl/scripts at 63354af with tests/brief.test.mjs of 023b66c copied in: node --test tests/brief.test.mjs · **saw:** tests 19, pass 15, fail 4: rev-a to rev-d with a fourth journal-only verdict, a file that lost its newest entry, a log with no review line, a file-only entry
- **ran:** JarlSkill-058 at 023b66c, skills/jarl/scripts: node --test tests/brief.test.mjs · **saw:** tests 19, pass 19, fail 0
- **ran:** fresh copy of releases/6.3.0/.jarl: node <scratch>/compare-findings.mjs skills/jarl/scripts/jarl.mjs (at 023b66c) <copy>, each issue with a review line: brief --role reviewer findings by reviewer against the log's changes lines, heading count against the list · **saw:** issues with a review: 55, findings listed: 57, differences: 0; diff -rq original copy: no change
- **ran:** JarlSkill-058 at 023b66c, skills/jarl/scripts: TMPDIR=<scratch> nice -n 15 timeout 2400 npm test · **saw:** tests 1212, pass 1192, fail 0, cancelled 0, skipped 20, exit 0
- **ran:** npm test in skills/jarl/scripts of the release worktree, at 6847047 with 058 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1212, pass 1192, fail 0, skipped 20, exit 0

