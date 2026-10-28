# 345 · Yggdrasil: yg check tells pairs left unverified before the session apart from the session's own

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** field-report
**Where:**

## What
A field report: on a workspace whose main branch carries unverified reviewer pairs, every session that starts with yg check sees errors it did not cause and cannot clear. Progressive mode exists for this, but the summary does not say which unverified pairs were already there.

## Why
A red start that is not the session's own trains agents to ignore red.

## Acceptance
- The summary line counts unverified pairs that were already unverified at the base apart from those the working tree's changes made unverified, and says how to clear each kind
- A test with inherited and new unverified pairs

## Evidence

