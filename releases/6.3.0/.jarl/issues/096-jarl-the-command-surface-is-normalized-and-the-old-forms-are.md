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
- Every refusal ends with a ready command or the flag to add (folds 053); SKILL.md and the references use only the new forms
- Easy for an agent (ruling surface-easy-for-agents): a fresh agent on the light tier, given only SKILL.md and the help, files an issue, changes its fields, leases it, records proof, records a review, answers a question and closes it on a scratch loop, with no call refused for a wrongly guessed form; its transcript is kept in research/2026-11-03-jarl-as-a-loop-tool

## Evidence

Ruling surface-may-break-nothing-lost: Krzysztof, 2026-11-03 (translated from Polish): "It can be breaking. The API surface for the agent is flexible, and we break nothing as long as we lose nothing." The surface of 096 may change incompatibly; what must hold is that no capability is lost: every function a removed form had is reachable through a new form, and every loop written before stays readable.

Ruling surface-easy-for-agents: Krzysztof, 2026-11-03 (translated from Polish), correcting the reading of his earlier words: "I mean, I do not know about the condition that we lose nothing; I simply want a nice Jarl with a nice API that an agent finds easy to use and understand. That is all." The aim of 096 is an API an agent finds easy to use and understand; breaking the old surface is allowed. The formal test that every removed form maps to a new one is dropped; ease is checked instead: a fresh agent on the light tier, given only SKILL.md and the help, does a set of ordinary tasks without a call refused for a wrongly guessed form (that check is the analysis session's proposal, not his wording).

