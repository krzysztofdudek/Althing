# 314 · Althing: the releasing-the-family skill routes every question to the owner through ask and answer (the sentence moved out of Jarl's 250)

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, docs
**Files:** 
**Found by:** jarl-architect
**Where:** Althing/.claude/skills/releasing-the-family/SKILL.md, section Planning (line 44 already says that every question to the owner goes through ws jarl ask)

## What
Jarl's 250 had an acceptance clause that the releasing-the-family skill routes questions to the owner through ask. That skill lives in Althing, not in JarlSkill, so the architect's scope review of 2026-10-18 (section 4, item 6) moves the sentence here, beside 286 and 288. The skill's Planning section already says that every question to the owner goes through ws jarl ask before it is shown to him, with context, the question and two or three options with their costs. What 250 meant beyond that: the answer is recorded through ws jarl answer, so the ruling keeps the options offered and his own words apart (244), a decision taken provisionally under a mandate is decide plus ask --kind ratify, which blocks nothing, and the owner's to-dos are asked in the chat with their exact steps. While this loop's driver is Jarl 6.1.0 (jarl-pinned-in-loop), the options ride in the question's text; ask --option arrives with the driver of the next loop.

## Why
The skill is the one place a release session reads how to put a question to the owner; a question answered only in the host's choice window, or in chat, leaves the record without the alternatives he chose between.

## Acceptance
- The releasing-the-family skill says, in one place, that every question to the owner goes through ws jarl ask and his reply through ws jarl answer (never only the host's choice window or the chat), that a provisional decision under a mandate is decide plus ask --kind ratify, and that while the loop's driver is Jarl 6.1.0 the options are written into the question's text; nothing it says already is repeated
- If the skill already carries every point, the issue closes with an evidence row quoting the lines that do; otherwise yg check and npm test are green on the change

## Evidence

