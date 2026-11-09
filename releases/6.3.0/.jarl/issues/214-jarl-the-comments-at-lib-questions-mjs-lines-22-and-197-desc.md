# 214 · Jarl: the comments at lib/questions.mjs lines 22 and 197 describe an answer that names nobody without saying only the library takes such a call

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1535-iapd
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-194-opus-n1
**Where:** lib/questions.mjs lines 22 and 197
**Branch:** jarl/208-quote-and-comment-gaps
**Merged:** a6dcbc3cf8aceec6390039bcea4b2ddef73ded85 in ../../../JarlSkill
**CI:** none

## What
The command line refuses an answer that names nobody; the comments do not say the library alone takes it (see ruling decide-needs-an-author-is-the-command-lines-rule).

## Why


## Acceptance
the two comments say command line or library where the case differs

## Evidence

- **ran (history):** comment-only change: no behaviour to run red; the two comments before the change said an answer that names nobody is the jarl's, with no word on the command line · **saw:** before: the two comments at the author of an answer do not say that the command line refuses an answer without --by; no test can fail on a comment
- **ran (history):** node --test tests/tense.test.mjs tests/docs-true.test.mjs tests/surface.test.mjs tests/library-parity.test.mjs (after the change) · **saw:** tests 61, pass 61, fail 0; both comments now say the library alone takes such a call and the command line refuses it
- **ran (history):** merged jarl/208-quote-and-comment-gaps into release/6.2.1 (one conflict in lib/journal.mjs imports, both sides kept); cd skills/jarl/scripts && node tests/suite.mjs on the merge a6dcbc3cf8aceec6390039bcea4b2ddef73ded85 · **saw:** 1738 tests, 1716 pass, 0 fail, 22 skipped

