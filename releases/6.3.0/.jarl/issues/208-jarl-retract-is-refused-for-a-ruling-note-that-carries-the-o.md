# 208 · Jarl: retract is refused for a ruling note that carries the owner's quote, so such a note cannot be retracted

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1518-wyra
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-194-opus
**Where:** retract, the owner's-words check
**Branch:** jarl/208-quote-and-comment-gaps
**Merged:** a6dcbc3cf8aceec6390039bcea4b2ddef73ded85 in ../../../JarlSkill
**CI:** none

## What
retract <id> note-<n> is refused for a ruling note that carries the owner's quote, because of the owner's-words check, so the note stays.

## Why
A note written by mistake or superseded should be retractable by whoever may retract it.

## Acceptance
a ruling note with an owner's quote can be retracted by the owner's word, and the check still refuses an agent that invents a quote

## Changelog
- Added: a note that records the owner's own words can be taken back too.

## Evidence

- **ran (history):** node --test --test-name-pattern='note that carries' tests/owner-quote.test.mjs (before the fix) · **saw:** fail 1: retract 1 note-1 --by owner is refused with 'a line written to the issue file (~~Ruling rule-a (by owner): ... the owner's words: ...~~) holds The owner's words ... which the record keeps only as the owner's quote'
- **ran (history):** node --test tests/owner-quote.test.mjs tests/retract.test.mjs (after the fix) · **saw:** tests 58, pass 58, fail 0: the ruling note with the owner's quote is retracted by owner and by jarl, a reason or a new note that holds the marker is still refused
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs (full suite, branch tip) · **saw:** tests 1702, pass 1680, fail 0, skipped 22
- **ran (history):** node --test --test-name-pattern='note is retracted' tests/review-waiver.test.mjs (before the waiver fix) · **saw:** fail 1: after retract note-1 of an owner waiver, the issue still waits in the merge queue as approved (the waiver is read from its log line)
- **ran (history):** node --test tests/review-waiver.test.mjs tests/retract.test.mjs tests/owner-quote.test.mjs tests/resume.test.mjs tests/show-window.test.mjs tests/merge-holds.test.mjs (after the waiver fix) · **saw:** tests 140, pass 139, fail 0 (one skipped): a retracted waiver note puts the issue out of the queue and done asks for a review again; a standing waiver still waives
- **ran (history):** merged jarl/208-quote-and-comment-gaps into release/6.2.1 (one conflict in lib/journal.mjs imports, both sides kept); cd skills/jarl/scripts && node tests/suite.mjs on the merge a6dcbc3cf8aceec6390039bcea4b2ddef73ded85 · **saw:** 1738 tests, 1716 pass, 0 fail, 22 skipped

