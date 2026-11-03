# 096 · Jarl: the command surface is normalized and the old forms are removed: one command per kind of change, one meaning per flag, one name for free text, one rule for the author

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 052, 085
**Found by:** owner
**Source:** research/2026-11-03-jarl-as-a-loop-tool#surface-normalization
**Where:**

## What
Ruling normalize-the-surface-old-forms-out. At release/6.2.1 7a10c53 Jarl has 44 commands and about 17 read views; an issue's field is changed by field and also by prio, tag, files, repo, source and after, each with its own grammar; --by is the author on writes and the grouping in status and models; free text is a field named why, text, findings, what, question, answer, ruling, event or reason depending on the command; the author is required on review, defaults to the owner on answer and decide, and is optional elsewhere.

## Why
An agent pays for every form it must remember and every wrong guess; one form per thing, refused old forms that name the new one, and fewer views are what lets the guidance shrink (088).

## Acceptance
- One command changes any field of an issue (header fields and the description's sections) with one grammar for setting, adding, removing and clearing; prio, tag, files, repo, source, after and body are removed, and each removed command is refused with one line naming the form that replaces it
- A flag name means one thing across commands: --by is always the author; grouping is --group in status and models; --kind is the kind of the thing the command writes or filters; a test over the command table checks it
- Free text has one name in every tool (text) and one place in every command's usage
- The author is required on every write that records a judgement (review, answer, decide, retract) and optional elsewhere; an unnamed write shows as unnamed (as 085 says)
- The read views are reviewed against next --as (052): a view that only shows part of another is removed or folded into it, refused with the view that replaces it, and the help gives each remaining view one purpose in one line
- Every refusal ends with a ready command or the flag to add (folds 053); SKILL.md and the references use only the new forms; tests for each removal and refusal

## Evidence

