# 342 · Family: each CHANGELOG names only versions that were published; Grain's 6.1.1 and Runes' 1.0.1 sections fold into the release

**Status:** open
**Kind:** docs
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Grain, ../../../Runes
**Found by:** coordinator
**Where:**

## What
Grain's release branch carries a dated [6.1.1] section and Runes' a dated [1.0.1] section, but neither version was ever published (Grain's last tag is v6.1.0, Runes' v1.0.0): their changes ship in Grain 6.2.0 and Runes 1.1.0.

## Why
A CHANGELOG is read by people who upgrade from the version they have; a section for a version they could never install tells them something false.

## Acceptance
- Grain's [6.1.1] entries are part of its [6.2.0] section and Runes' [1.0.1] entries part of its [1.1.0] section, written for the people who use them, with no header for an unpublished version
- Each tool's version test stays green

## Evidence

