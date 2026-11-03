# 048 · Jarl: the output is English whatever the loop's language

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-d74279bd
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdInit), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1338 at a1132a8
**After:** 035

## What
Claim: report and resume print the goal's language next to English headings and log lines.

No language setting exists in the skill or the scripts. Map row fr-13.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Owner decision: whether Jarl localises output; the cheap step is a goal line and a note on a title in another language.

## Evidence

Ruling ask-009 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "Jarl is language-agnostic; the environment and the user decide. We do not define it." The full ruling is jarl-language-agnostic.

Ruling jarl-language-agnostic: Krzysztof, 2026-11-03 (translated from Polish): "Jarl is language-agnostic; the environment and the user decide. We do not define it." Jarl gets no language setting and no translated output: a loop's goal, titles and text are in whatever language its user writes, and the agent speaks to its user in the user's language. Issue 048 is dropped on this ruling.

Dropped: the owner ruled jarl-language-agnostic: Jarl defines no language; the environment and the user decide

