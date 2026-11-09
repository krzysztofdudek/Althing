# 005 · Jarl: a ruling recorded as the owner's carries the owner's own words

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261022T0715-uxhz
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/005-owner-ruling-quotes-owner
**Merged:** 16f1e59 in ../../../JarlSkill
**CI:** none

## What
decide --by records any name as the author with nothing behind it. A coordinator twice recorded a short question of the owner as his ruling and had to withdraw it.

## Why
A ruling in the owner's name binds every later worker; his own words beside it are what lets anyone check that he decided and did not only ask.

## Acceptance
- decide with --by naming the owner refuses without a quote of the owner's words, and stores the quote with the ruling
- decisions and show print the quote beside the ruling
- Tests for the refusal and the stored quote

## Changelog
- Fixed: A ruling recorded as the owner's now needs the owner's own words, which are kept with the ruling and shown beside it. A ruling recorded without a name is now the coordinator's, no longer the owner's.
- Fixed: Every ruling written into an issue now says who made it. No other text in the record can look like the owner's own words, whatever spelling it uses.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

A second field report (2026-10-27): decide without --by records the ruling as the owner's, so a coordinator's provisional ruling went in under the owner's name by omission, and the text cannot be corrected. This issue covers that too: a ruling without --by is the caller's (the coordinator's), never the owner's by default; the owner's needs --by and the quote.
- **ran (history):** node --test tests/owner-quote.test.mjs (rules from release branch) · **saw:** 5 of 6 fail: unknown flag --quote for decide; no --by recorded as owner
- **ran (history):** node --test tests/owner-quote.test.mjs; npm test · **saw:** 6 of 6 pass; full suite 817 pass, 0 fail
- **ran (history):** node --test tests/owner-quote.test.mjs; npm test (review fixes) · **saw:** 9 of 9 pass; full suite 820 pass, 0 fail
- **ran (history):** node --test tests/owner-quote.test.mjs (round 2 tests on the previous tip's lib) · **saw:** 3 of 13 fail: forged answer and ratify answer accepted, answer --by Owner stored as Owner, non-text quote accepted
- **ran (history):** node --test tests/owner-quote.test.mjs; npm test (round 2) · **saw:** 13 of 13 pass; full suite 824 pass, 0 fail
- **ran (history):** node --test tests/owner-quote.test.mjs (takeover tests on the previous tip 3b5fed4) · **saw:** 20 of 34 fail: the marker in 14 spellings (lower case, capitals, curly or modifier apostrophe, fullwidth colon or letters, no-break and zero-width characters, Cyrillic, combining accent, mathematical bold, curly quotes, after a separator) accepted through decide, ask, answer, evidence, log, body, new, round, review and whole-file writes; an indented last line read as the quote; Cyrillic, zero-width, fullwidth, 0wner and 'the owner' --by stored as other names; co-owner and array --by accepted
- **ran (history):** node --test tests/owner-quote.test.mjs; npm test (takeover, at e6ae047) · **saw:** 34 of 34 pass; full suite 887 tests, 864 pass, 0 fail, 23 skipped
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 894 ℹ pass 871 ℹ fail 0 (merge 16f1e59 on release/6.2.1)

Ruling ask-012 (ratify): tak — Krzysztof, 2026-11-03, ratifying decide-without-by-is-the-coordinators: in Jarl 6.3.0 a ruling recorded without --by is the coordinator's, not the owner's, and a ruling recorded as the owner's must carry his words.

