# 095 · Jarl: the owner's-quote check misses a few spellings, refuses an honest phrase, and the library keeps By as typed; a ruling the old driver writes can end in the marker

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 005
**Found by:** rev-jarl-005d-opus
**Where:** Review of 005 after its takeover (2026-11-03)
**Branch:** jarl/208-quote-and-comment-gaps
**Worker:** w-jarl-208-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/208-quote-and-comment-gaps
**Since:** 2026-11-08 15:36

## What
A few spellings slip past the marker check (the letter o with a stroke, a small-capital d, an HTML entity for the apostrophe, Markdown emphasis); an honest phrase such as the owner's word: needed is refused; appendDecision in the record library keeps Owner as typed with no quote; an evidence note shaped like a ruling row is accepted; a ruling the pinned driver writes is unindented, so an owner's ruling ending in the marker line would read as his quote while that driver writes the loop; the CHANGELOG claims every spelling.

## Why
A forged quote is the harm 005 exists to stop; an honest phrase refused teaches people to stop writing the owner's words.

## Acceptance
Each case is fixed or documented as a limit with a test; the CHANGELOG claims only what holds

## Changelog
- Fixed: Jarl refuses any other text that spells out the line holding the owner's own words, whether in capitals, look-alike letters, hidden characters, other quotation marks, HTML codes or Markdown marks. A note that only looks like his ruling is free text and settles nothing.

## Evidence

- **ran:** node --test tests/owner-quote.test.mjs (new spellings, honest phrase and library author, before the fix) · **saw:** tests 51, pass 38, fail 13: the marker with an o with a stroke, small capitals, a d with a stroke, HTML entities for the apostrophe, colon and letters, Markdown emphasis and escapes is written; 'the owner's word: needed' is refused; the library keeps By as typed
- **ran:** node --test tests/owner-quote.test.mjs tests/ruling-under.test.mjs tests/review-waiver.test.mjs tests/retract.test.mjs tests/record-contract.test.mjs (after the fix) · **saw:** owner-quote: tests 51, pass 51, fail 0; the five files together 103 of 103 pass: each new spelling is refused in every path, the singular phrase is written, the library stores owner for every spelling of him; the note shaped like a ruling row and the unindented-ruling quote are pinned as limits by tests
- **ran:** node --test tests/owner-quote.test.mjs, the new spellings and singular cases run against the previous commit's code (a scratch copy of it) · **saw:** tests 72, pass 50, fail 22: the singular marker with a quotation mark, &ocirc;, Coptic, barred, sideways and long-stroke o, Cherokee w, d with a hook, tags, comments, Markdown links, brackets, single and corner quotation marks are written; owners_words: is refused

