# 474 · Rails: the English rail's slot rule cannot let through a foreign proper name that is also a Polish stop-word, such as the test tool `jest`

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** rails, language
**Files:** Althing/rails/english.mjs, Althing/rails/lexicon/foreign-allow.mjs
**Repo:** ../..
**Found by:** jarl
**Where:** yg check on 2026-11-03: lang/english refused the heading of 473 for the name `jest`; rails/english.mjs applies the allow-list only in letterFindings, never in slotWords

## What
A heading, a file name or a Tags value that names that test tool is refused as Polish, and the only remedy the message offers, an entry in foreign-allow.mjs, has no effect on the slot rule.

## Why
A refusal whose suggested fix does nothing pushes the writer toward rewording a true name or editing a record by hand.

## Acceptance
- A case-sensitive entry in the allow-list, with its reason, lets that exact word through the slot rule too, with a test; or the message stops suggesting the allow-list for slot findings and names what works
- rails tests green

## Evidence

