# 342 · Family: each CHANGELOG names only versions that were published; Grain's 6.1.1 and Runes' 1.0.1 sections fold into the release

**Status:** open
**Kind:** docs
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0923-katz
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

### Notes

The Runes half of 342 (the [1.0.1] entries become part of [1.1.0], with no header for 1.0.1) is carried by 740, the final pass of Runes 1.1.0; the Grain half stays with the family release.

The Runes half is met at the tag v1.1.0 (16731a2): CHANGELOG.md has no [1.0.1] heading, the [1.1.0] section says the changes prepared as 1.0.1 are part of it, and the version test passed in Runes CI run 43688029236; judged in rev-740-opus's approve of 740 (round 2). The Grain half stays with the family release.

Runes half after the CHANGELOG audit: at v1.1.0 (1f3476b) CHANGELOG.md names no 1.0.1 anywhere: no heading and, since the audit, no sentence about the unpublished 1.0.1 either; the 1.0.1 entries stay folded into [1.1.0] where a user of 1.0.0 meets them. The exports version test passed in CI run 43693663137 and release run 43694364773. The earlier note that the section says the 1.0.1 changes are part of it no longer describes the file.

