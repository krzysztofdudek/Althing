# 592 · Althing: the names rail's range scan misses lines added in a merge commit, a name split across an old and an added line, and author e-mails, and passes an unreadable range as 0 commits

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261111T1421-uzsy
**Tags:** althing, rails, names, security
**Files:** Althing/rails
**Repo:** Althing
**Found by:** jarl
**Where:** w-363-fable, issue 363
**After:** 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
Althing's pre-push gate is the last check before its commits go public; each gap is a way a private name leaves without being seen, and an unreadable range that reads as clean is a false green.

## Acceptance
[test] A fixture with a planted test-list word in a merge commit's added lines, split across an old and an added line, and in an author e-mail is refused with the commit and file, and an unreadable range is an error, not 0 commits · by: yg check && npm test

## Evidence

