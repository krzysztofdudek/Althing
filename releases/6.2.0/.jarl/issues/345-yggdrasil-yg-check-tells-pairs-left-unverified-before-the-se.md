# 345 · Yggdrasil: yg check tells pairs left unverified before the session apart from the session's own

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261028T0923-apyv
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:**
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
A field report: on a workspace whose main branch carries unverified reviewer pairs, every session that starts with yg check sees errors it did not cause and cannot clear. Progressive mode exists for this, but the summary does not say which unverified pairs were already there.

## Why
A red start that is not the session's own trains agents to ignore red.

## Acceptance
- The summary line counts unverified pairs that were already unverified at the base apart from those the working tree's changes made unverified, and says how to clear each kind
- A test with inherited and new unverified pairs

## Changelog
- Fixed: in progressive mode the verdict line tells the unverified pairs your change caused from the ones the reference branch already carried, each with the command that clears it.

## Evidence

### Notes

Assumed: 'already unverified at the base' is read off the progressive classification the run already makes: the unverified-outside twins (their files hold the bytes the reference holds) are the inherited kind, the plain unverified findings the change's own; the split appears in the verdict line only in a measured run (a project naming no reference has no base), and is not added to the yg-check/1 document, whose issues already carry each code.

