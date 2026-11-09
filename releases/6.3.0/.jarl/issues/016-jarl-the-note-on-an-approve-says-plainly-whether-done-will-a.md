# 016 · Jarl: the note on an approve says plainly whether done will accept it, and done shows the acceptance lines no row speaks to

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261028T0923-swot
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/016-line-and-tip-mark
**Merged:** afee327cc41e51097d48dc06754bc23aaffbf8ce in ../../../JarlSkill
**CI:** none

## What
Two field reports disagree on the same rule. In one, done refused a coordinator's approve. In the other, a note on a same-model approve said the clearing approve should come from a different model, three reviewers reported the issue could not close, and set done accepted it at once; an approve by reviewers ranked below the worker carried a warning, and done accepted that too, on an issue with an acceptance line that had no evidence at all. The owner's rule is now that a reviewer is a different agent, not a different model.

## Why
A note that reads as a gate but is not one is worse than either: reviewers stop work that could close, and the coordinator learns to ignore the warning that matters.

## Acceptance
- The note on an approve states which approves done accepts in this loop and why, as advice or as a gate, never both
- The model rule follows the loop's profile; its default is a separate agent, which matches the owner's rule
- done lists each acceptance line with no Proof row that names it, and asks for a reason to close without one
- Tests for each

## Changelog
- Changed: Which reviews can close a task is set by the loop. By default any reviewer who is not the task's worker counts, whatever model it runs on, and the message after a review says plainly whether the task can now be closed. A loop can ask instead for a reviewer on another model than the worker's, or on one at least as strong, and then a review that does not meet it, or that does not say which model gave it, cannot close the task.
- Added: A piece of proof can name the checkable lines of the task it proves (evidence --line 2). Once a loop does that, closing a task lists each of its lines that no proof names, and the task closes only with a reason, which is kept beside those lines and shown in the report. A loop that never names a line closes tasks as before. The first such proof moves the loop to format 3.

## Evidence

- **ran (history):** node --test tests/reviewer-rule.test.mjs, run in a copy of the release tip's scripts (before the change) · **saw:** pass 0, fail 4: the default approve note does not say advice or gate, other-model and model-rank are not profile values (the profile is refused), done accepts a same-model approve
- **ran (history):** node --test tests/reviewer-rule.test.mjs tests/identical-output.test.mjs tests/models.test.mjs tests/models-loops.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/profile.test.mjs tests/profile-keys.test.mjs tests/record-contract.test.mjs tests/fresh-review.test.mjs tests/surface.test.mjs tests/help-workflow.test.mjs tests/lone-agent-review.test.mjs tests/printed-texts.test.mjs tests/gate-window.test.mjs tests/retract.test.mjs (branch, after the change) · **saw:** pass 249, fail 0
- **ran (history):** node --test tests/reviewer-rule.test.mjs with the new cases, on the branch at d31be29 (before the fix) · **saw:** tests 8, pass 4, fail 4: under other-model and under model-rank, set 3 done closed an issue whose lease names no model on an approve given without --model (expected a refusal, got exit 0); the approve on such an issue with a model got no note saying done accepts it; the model gate's refusal ended with the review form without --model
- **ran (history):** node --test tests/reviewer-rule.test.mjs, then with models, models-loops, docs-true, tense, printed-texts, refusals, review-waiver, identical-output, fresh-review, words and vocabulary (branch at 011bc4c, after the fix) · **saw:** reviewer-rule: tests 8, pass 8, fail 0; with the others: tests 172, pass 170, fail 0. Done refuses an approve without --model under other-model and model-rank whatever the lease names, its refusal ends with the review form with --model, the note says so, and models.md and profile.md say the same
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip 7e674a6 · **saw:** tests 1295, pass 1273, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch with packages A, B and C, TMPDIR from mktemp -d; two import lines conflicted with B and kept the names of both sides · **saw:** tests 1369, pass 1347, fail 0, skipped 22, merge 8235daf

Ruling ask-016 (stop): Krzysztof chose option (a), a --line <n> option on evidence, exact, riding the one format raise (an option label, not his wording); the coordinator had recommended (b).
- **ran (history):** status, resume, report, list --all, next --all, next --as jarl and owner, verify, decisions --live, models, branches, goal, profile (each with --json where it has one), show and show --json of every issue and brief of the last 12, on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it: the scripts of release/6.2.1 against those of 59a5b1c · **saw:** 443 views compared, 0 differ once ages are taken out; closedGate lists only 028 on both; the copy stays at record format 1 and no profile.json is written
- **ran (history):** cd skills/jarl/scripts && node --test tests/proof-lines.test.mjs, in a copy of the release tip's scripts (before the change) · **saw:** tests 9, pass 0, fail 9: evidence refuses --line as an unknown flag, so no row names a line and done never lists one
- **ran (history):** cd skills/jarl/scripts && node --test tests/proof-lines.test.mjs tests/surface.test.mjs tests/mcp.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/brief.test.mjs tests/retract.test.mjs tests/reviewer-rule.test.mjs tests/owner-sign-off.test.mjs tests/record-contract.test.mjs tests/format-marker.test.mjs (branch tip 59a5b1c) · **saw:** tests 231, pass 231, fail 0: a row names its lines with --line repeated or as a comma list, in its mark in the file and the log, and show, show --json, brief, the record library and the gate read them; the first such row raises a format-1 loop to 3 and both pinned readers refuse it; a line the issue lacks, a non-number, --line on a note or on an issue with no acceptance line, and --line in a composer loop below 3 are refused with nothing written; once the loop names lines, done lists each line no counted row names (a row with no --line, a retracted row and a row before a reopen name none; an owner line is his tick's) and closes only with a reason, written under Evidence and shown by report; a loop that names no line keeps the count note, and issues closed before the first such row keep their gate; field notes a rewritten acceptance; an approve names the lines
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 59a5b1c, the tip of jarl/016-line-and-tip-mark, TMPDIR from mktemp -d) · **saw:** tests 1583, pass 1561, fail 0, cancelled 0, skipped 22, exit 0; an earlier run at fdb1762 hit ENOSPC under load in three files that pass alone, and found the commands reference without --line among the evidence flag fields, added in 59a5b1c
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on an import line of lib/evidence.mjs and two places of lib/review.mjs, resolved by keeping both sides · **saw:** tests 1595, pass 1573, fail 0, skipped 22, merge afee327

