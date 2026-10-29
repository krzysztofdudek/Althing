# 409 · Gard: a browser profile per company in its tools container

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** gard, workplace, identities
**Files:** Gard/src/tools/browser.mjs, Gard/test/browser-profile.test.mjs
**Repo:** ../../../Gard
**After:** 407
**Found by:** owner
**Where:** the owner, 2026-10-24: a dedicated Chromium profile per company, isolated from the private host

## What
A tools container may declare a persistent browser profile in a volume of its own, used by browser automation inside that container (Playwright with a persistent context). The host's browser profiles are never read or written.

## Why
Company web sessions belong to the company's isolated place, like its command-line logins.

## Acceptance
A fixture starts a browser in the tools container with the declared profile twice and finds the state of the first run in the second; nothing under the host's browser directories changes

## Evidence

