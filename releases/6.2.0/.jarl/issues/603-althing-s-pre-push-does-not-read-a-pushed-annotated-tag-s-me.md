# 603 · Althing's pre-push does not read a pushed annotated tag's message or tagger

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1504-btsu
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's pre-push does not read a pushed annotated tag's message or tagger
rails/run.mjs range peels a pushed tag object to its commit (cat-file -e <sha>^{commit}, then rev-list), so the message and the tagger of an annotated tag pushed to the canonical repository are never read by the names rail or the messages rail; a deny-listed word in a release tag's message leaves the machine unscanned. Found while reviewing 363, whose gate has the same gap.

## Why


## Acceptance


[test] Althing's pre-push reads a pushed annotated tag's name, tagger and message, nested tags too, and refuses a test word in any of them, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line efbda406cccc):** node --test --test-name-pattern tag rails/test/run.test.mjs (at 83df69c, the two new tests uncommitted beside it, before the fix) · **saw:** the two tag tests fail: rails range (1 commit): clean over a tag whose message carries a test entry, and a real push of that tag through Althing's pre-push hook arrives
- **ran (line efbda406cccc):** node --test rails/test/run.test.mjs (the tree of 481812c, the fix) · **saw:** tests 15, pass 15, fail 0: a test entry in a tag's message, in its tagger, in the name the object was made under and in the inner tag of a tag of a tag is refused as tag object <id>, a session trailer in a tag's message is refused by the message rail, and a real push of a named tag to a local bare remote is refused with nothing arrived while a clean tag arrives

### Notes

Assumed: the history scan (nightly) reads every tag object a ref names too, and a tag named by hand in a range is read like a pushed one.

