# 049 · Jarl: an exact-output refactor cannot record its comparison instead of a review

**Status:** open
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

## What
Claim: A 600-line refactor with byte-identical renders got a review that changed nothing. Corrected by the sceptic: Severity low: a wasted review costs a reviewer run, not a false green, and 004 covers the mechanism; only the comparison as named evidence is new.

Code closes only with a fresh approve unless a loop-wide profile setting drops review. Map row fr-14; issue 004 adds an owner's waiver by ruling.

## Why

Ruling identical-output-light-review: a change meant to alter nothing keeps a fresh review, which may be light, and only the owner's own waiver (004) replaces it.

## Acceptance
- A change meant to alter nothing records its identical-output comparison as a proof row (the command and what it printed)
- Its fresh review may be on the light tier; the built-in rule of 086 for that case asks the reviewer to check that the comparison covers everything the change touched, and references/reviewer.md says so
- Replacing the review stays possible only through the owner's waiver for named issues (004); a test shows done refusing such an issue with no approve and no waiver

## Evidence

Ruling identical-output-light-review: Decided by the analysis session under the standing mandate (autonomy-quality), after the owner said he did not follow the question (a-007): a change meant to alter nothing, whose output is shown identical before and after, keeps its fresh review, which may be a light one that checks only that the comparison covers everything the change touched; the comparison is recorded as evidence. This keeps the rule that nothing closes without someone having looked. Replacing the review stays possible only by the owner's own waiver for named issues (004). Filed for his ratification.

Ruling ask-007 (stuck): Withdrawn as a question: the owner said he did not follow it; the option that keeps the review was taken under the mandate, ruling identical-output-light-review, filed for his ratification.

Reshaped by the model (report section 11) under ruling identical-output-light-review, which waits for the owner's ratification (a-008) and blocks nothing; it waits on 086 for the reviewer's rule.

Ruling ask-008 (ratify): ok — Krzysztof, 2026-11-03, ratifying identical-output-light-review: a change meant to alter nothing keeps a light fresh review that checks its comparison covers the change; only his own waiver for named issues (004) replaces the review.

