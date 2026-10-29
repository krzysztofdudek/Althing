# 373 · Gard: a pre-push hook scans the pushed range for private names

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, names, security
**Files:** Gard/.githooks
**Repo:** ../../../Gard
**After:** 363, 367
**Found by:** owner
**Where:** issue 363 gives the workspace command and the hook template

## What
Gard installs the hook template of issue 363 as its pre-push hook, so that no commit with a name from the deny-list leaves the maintainer's machine; the repository's README for contributors says what the hook does and that it lets a push to a fork through with one line saying it is unscanned.

## Why
Gard is public and is built by someone who also works for companies.

## Acceptance
A push of a branch whose range carries a planted deny-listed word is refused on the maintainer's machine; a push to another remote without the key goes through with the unscanned line

## Evidence

