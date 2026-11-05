# 049 · Jarl: an exact-output refactor cannot record its comparison instead of a review

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-d01e6fd4
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035, 086
**Branch:** jarl/098-review-scope
**Merged:** eb89513 in ../../../JarlSkill
**CI:** none

## What
Claim: A 600-line refactor with byte-identical renders got a review that changed nothing. Corrected by the sceptic: Severity low: a wasted review costs a reviewer run, not a false green, and 004 covers the mechanism; only the comparison as named evidence is new.

Code closes only with a fresh approve unless a loop-wide profile setting drops review. Map row fr-14; issue 004 adds an owner's waiver by ruling.

## Why

Ruling identical-output-light-review: a change meant to alter nothing keeps a fresh review, which may be light, and only the owner's own waiver (004) replaces it.

## Acceptance
- A change meant to alter nothing records its identical-output comparison as a proof row (the command and what it printed)
- Its fresh review may be on the light tier; the built-in rule of 086 for that case asks the reviewer to check that the comparison covers everything the change touched, and references/reviewer.md says so
- Replacing the review stays possible only through the owner's waiver for named issues (004); a test shows done refusing such an issue with no approve and no waiver

## Changelog
- Added: A change meant to leave the output exactly as it was can be tagged identical-output. Its worker records the before-and-after comparison as proof, and a lighter reviewer may approve it, but it still needs that review before it can be closed.

## Evidence

Ruling identical-output-light-review: Decided by the analysis session under the standing mandate (autonomy-quality), after the owner said he did not follow the question (a-007): a change meant to alter nothing, whose output is shown identical before and after, keeps its fresh review, which may be a light one that checks only that the comparison covers everything the change touched; the comparison is recorded as evidence. This keeps the rule that nothing closes without someone having looked. Replacing the review stays possible only by the owner's own waiver for named issues (004). Filed for his ratification.

Ruling ask-007 (stuck): Withdrawn as a question: the owner said he did not follow it; the option that keeps the review was taken under the mandate, ruling identical-output-light-review, filed for his ratification.

Reshaped by the model (report section 11) under ruling identical-output-light-review, which waits for the owner's ratification (a-008) and blocks nothing; it waits on 086 for the reviewer's rule.

Ruling ask-008 (ratify): ok — Krzysztof, 2026-11-03, ratifying identical-output-light-review: a change meant to alter nothing keeps a light fresh review that checks its comparison covers the change; only his own waiver for named issues (004) replaces the review.
- **ran:** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs (on release/6.2.1 2c798fe, archived to a scratch folder, the new test file copied in) · **saw:** tests 3, pass 1, fail 2 (done already refuses with no approve; the light-approve note and the brief notes are missing)
- **ran:** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs (jarl/098-review-scope 052ac8e) · **saw:** tests 3, pass 3, fail 0
- **ran:** jarl.mjs (release tip) on a copy of the 6.3.0 loop: field 049 Tags identical-output --add, Model (light)/(strong) goal lines, lease handed over on claude-opus-5-5, evidence row, review 049 approve --model claude-haiku-4-5 · **saw:** note: 049: claude-haiku-4-5 ranks below the worker's model (claude-opus-5-5); the approve that clears an issue comes from a model of at least the worker's rank
- **ran:** jarl.mjs (052ac8e) the same calls on another copy, then brief 049 --role reviewer and set 049 done before the approve · **saw:** note: 049: a change meant to alter nothing (tag identical-output): a light review may clear it, one that checks the comparison of the output before and after covers everything the change touched; brief: its review may be a light one ... the comparison never stands in for the review; set 049 done: 049 has no approving review newer than its last round or reopen
- **ran:** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 2400 npm test (jarl/098-review-scope 052ac8e) · **saw:** tests 1239, pass 1219, fail 0, skipped 20; exit 0
- **ran:** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 2400 npm test (jarl/098-review-scope afe4cd8) · **saw:** tests 1244, pass 1224, fail 0, skipped 20; exit 0 (the run at 0b01079 had 1 fail: a git call in the new format-1 test carried no timeout, fixed in afe4cd8)
- **ran:** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 2400 npm test (jarl/098-review-scope 004108c) · **saw:** tests 1248, pass 1228, fail 0, skipped 20; exit 0
- **ran:** npm test in skills/jarl/scripts of the release worktree, at eb89513 with 098 and 049 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1248, pass 1228, fail 0, skipped 20, exit 0

