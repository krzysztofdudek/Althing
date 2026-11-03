# 005 · Jarl: a ruling recorded as the owner's carries the owner's own words

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
decide --by records any name as the author with nothing behind it. A coordinator twice recorded a short question of the owner as his ruling and had to withdraw it.

## Why
A ruling in the owner's name binds every later worker; his own words beside it are what lets anyone check that he decided and did not only ask.

## Acceptance
- decide with --by naming the owner refuses without a quote of the owner's words, and stores the quote with the ruling
- decisions and show print the quote beside the ruling
- Tests for the refusal and the stored quote

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

A second field report (2026-10-27): decide without --by records the ruling as the owner's, so a coordinator's provisional ruling went in under the owner's name by omission, and the text cannot be corrected. This issue covers that too: a ruling without --by is the caller's (the coordinator's), never the owner's by default; the owner's needs --by and the quote.

