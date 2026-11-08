# 006 · Jarl: a model ceiling in the profile, which the fresh-review rule and the advice respect

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035
**Branch:** jarl/006-ceiling-artifact-use
**Merged:** f3d096322f6243bbf8604e22cb4d7e08f3996f33 in ../../../JarlSkill
**CI:** none

## What
The fresh-review rule (another model, not a lower-ranked one) always points at the strongest allowed model, and Jarl knows neither a ceiling nor a cost. A loop that bars a model, or runs on a tight budget, gets advice it cannot follow.

## Why
Model choice is the largest cost of a loop; the rule should say what to do when the reviewer it wants is above the ceiling: run the worker on a lighter model so a reviewer under the ceiling still outranks it.

## Acceptance
- The profile can name the models a loop may not use, or the strongest it may use; the profile check refuses an unknown model
- When the reviewer the rule needs is above the ceiling, the refusal and next say so and name the lighter worker that would make the review possible
- Jarl reads no usage or budget from the host; the help says the ceiling is the owner's lever for cost
- Tests for the ceiling in the profile, in the refusal and in next

## Changelog
- Added: A loop's profile can name the strongest model the loop may use and the models it may not use, to keep its cost down. Jarl's advice then stays within that: the model it suggests for a task, the step up after failed rounds, and, when a review would need a model above the limit, the lighter worker that makes the review possible.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

From 003 (2026-11-03), part of this issue: where the profile caps the models, the takeover advice of 003 stays under the cap, with a test

Kept by the model (report section 7): a ceiling per tier; a level names its tier.
- **ran:** cd skills/jarl/scripts && node --test tests/model-ceiling.test.mjs (on the release branch at 0e17fb9, before the change) · **saw:** tests 7, pass 1, fail 6: a profile key models is refused as unknown, so no ceiling, no barred model, no note, no next mark and no capped takeover
- **ran:** cd skills/jarl/scripts && node --test tests/model-ceiling.test.mjs (at ff8cdf3) · **saw:** tests 7, pass 7, fail 0: profile shows and checks the ceiling and barred models and refuses one no Model line places; done's refusal, the verdict note and next name the lighter worker (m-light lets m-std review); the takeover offers no tier above the ceiling; both older readers refuse the key
- **ran:** 26 read views (status, resume, next, next --as jarl and owner, list, report, report --metrics, decisions, branches, verify, models, profile, show, brief, with their --json forms) by jarl.mjs at 0e17fb9 and at 2bc8040, each on its own copy of this loop with the tool repositories linked, then diff -r of the outputs · **saw:** only ageMs differs, in resume --json and status --json; every exit code is the same (verify 2 on both); closedGate holds 028 alone on both; the two copies stayed byte-identical after the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 2bc8040) · **saw:** tests 1603, pass 1581, fail 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node --test tests/model-ceiling.test.mjs (the new tests on the merge of the release branch, before the fix) · **saw:** tests 10, pass 6, fail 4: an unrelated bar, a ceiling at the top tier and an unplaced ceiling print beyond what the profile allows where the loop without the key prints none; verify passes an unknown model; model-rank names m-light, not the reviewer's own tier; the takeover from the top tier names no ceiling
- **ran:** cd skills/jarl/scripts && node --test tests/model-ceiling.test.mjs (at d851b41) · **saw:** tests 10, pass 10, fail 0: next, the note and done print exactly what they print without the key for agent, other-model and model-rank under an unrelated bar, a top ceiling and an unplaced ceiling; a barred strongest, everything barred and a two-model lease under other-model each name the limit and the nearest worker; verify reports m-nowhere; the takeover from strong names ceiling m-std
- **ran:** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 907489c) · **saw:** tests 1621, pass 1599, fail 0, skipped 22, exit 0; the decoy loop's log is byte-identical after the run and it holds no issue
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on the review result line of lib/review.mjs and on two flag-field lines of references/commands.md, resolved by keeping both sides · **saw:** tests 1674, pass 1652, fail 0, skipped 22, merge f3d0963

