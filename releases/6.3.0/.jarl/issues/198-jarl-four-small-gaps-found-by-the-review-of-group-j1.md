# 198 · Jarl: four small gaps found by the review of group J1

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-173-opus-j1
**Where:** lib/ball.mjs issueRows; lib/resume.mjs near line 112; lib/review.mjs fileOutside; lib/evidence.mjs IN_FLIGHT_MARKS
**Branch:** jarl/194-small-views-and-refusals
**Merged:** 89bb93b2265908ce93dbd1eabf6a7790c7289770 in ../../../JarlSkill
**CI:** none

## What
(1) next --as keeps one row per issue for approves refused for their model instead of grouping them into review units. (2) resume --json shows in-flight next for more marks than references/commands.md says (approved with no code, sent back, model-refused). (3) review --outside at the format edge ends with the review form carrying one --outside, not the profile view its reason names, unlike import after 180. (4) The in-flight text for an issue already merged whose approve is refused for its model says neither the merge queue nor done accepts that, which is only wording.

## Why
Every view should say the same, and a refusal's form should be the one its reason names.

## Acceptance
Each of the four is fixed or said honestly in the docs, with a test where the code changes

## Changelog
- Fixed: approves refused for their model are grouped into review units, a merged issue's step no longer mentions the merge queue, and review --outside at the format edge ends with the profile view and the call's own form.

## Evidence

- **ran:** node --test --test-name-pattern='cut into review units, as the other' tests/queue-model-gate.test.mjs (on b3104b1's code) · **saw:** 1 fail: next --as jarl gave two review rows, one per issue, for two approves refused for their model
- **ran:** node --test --test-name-pattern='ends with the profile view its reason names' tests/outside-findings.test.mjs (on b3104b1's code) · **saw:** 1 fail: the refusal of a finding at number 1000 in a loop kept at format 1 ended with the review form carrying one --outside, the line before it the reason, no 'jarl.mjs profile'
- **ran:** node --test --test-name-pattern='already merged whose approve is refused' tests/queue-model-gate.test.mjs (on b3104b1's code) · **saw:** 1 fail: after the merge the step still read 'neither the merge queue nor done accepts that'
- **ran:** node --test tests/queue-model-gate.test.mjs tests/review-units.test.mjs tests/next-as.test.mjs tests/models.test.mjs tests/outside-findings.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs (at f89afb5) · **saw:** all pass, 0 fail: one review row with ids 1, 2 cut into units and the form review "<ids>" … --model "<model-id>"; one alone keeps its line; the merged step reads 'approved and merged, and done refuses its approve for its model: it waits …'; the outside refusal ends with 'jarl.mjs profile' then the review form with every value a placeholder; references/commands.md lists every case resume --json gives next for
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028
- **ran:** nice -n 15 timeout 1800 node tests/suite.mjs (skills/jarl/scripts at 59132f7), then node --test tests/skill-shape.test.mjs at f89afb5 · **saw:** suite: 1654 tests, 1629 pass, 3 fail, the rest skipped; the 3 failures were skill-shape's word-of-history check on one word of the new references/commands.md text, fixed in f89afb5; skill-shape then 21 pass, 0 fail
- **ran:** git merge --no-ff jarl/194-small-views-and-refusals into release/6.2.1 (two conflicts kept both sides); cd skills/jarl/scripts && node tests/suite.mjs on the merge 89bb93b2265908ce93dbd1eabf6a7790c7289770 · **saw:** 1685 tests, 1663 pass, 0 fail, 22 skipped

