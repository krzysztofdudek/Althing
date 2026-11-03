# 058 · Jarl: reviewer, worker and takeover briefs are written by hand

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-deca710c
**Where:** JarlSkill/skills/jarl/references/reviewer.md:18 at a1132a8
**After:** 035, 086

## What
Claim: About 30 reviewer briefs and 2 takeover briefs were hand-written, each a chance to forget a ruling or an acceptance line. Corrected by the sceptic: Severity low: what is left is assembling show, the standing brief of 020 and the review command into one text; the takeover brief exists.

The reviewer brief is a template in references/reviewer.md and the worker gets show pasted; no brief command. Map row fr-24; issue 020 adds a standing brief.

## Why


Briefs written by hand drop rules and acceptance lines; a brief assembled from the record carries every rule that matches and the command that records the result.

## Acceptance
- brief <id> (worker), brief <id> --role reviewer and brief --slice <s> (coordinator) are read-only and assembled when asked: the issue as show prints it, the rules with a scope that match (086), the findings of earlier rounds, the proof rows, links to the role reference, and the exact command that records the result
- The same data is exported through record.mjs as an additive function, so other renderers can use it
- Tests for each brief, including that a rule of another slice or role is absent

## Evidence

Field example, distilled from the owner's private work (no names): a reviewer's finding was fixed by switching a required behaviour off for one field; the next review rounds, briefed by hand with the earlier findings only, checked that the finding was gone and not that the fix kept every acceptance line, and the loss surfaced only in a later requirements audit. Jarl's reviewer reference already asks every review, above all after a round, to check the acceptance line literally and whether the fix weakened anything that worked; the hand-written briefs did not carry it. The rule existed; its delivery failed.

