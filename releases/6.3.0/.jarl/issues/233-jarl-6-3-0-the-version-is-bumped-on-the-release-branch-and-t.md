# 233 · Jarl 6.3.0: the version is bumped on the release branch and the changelog reads as released

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261109T0954-ehop
**Tags:** 
**Files:** 
**Repo:** JarlSkill
**Found by:** jarl
**Where:**

## What
The plugin manifests of every platform name 6.3.0; CHANGELOG.md's Unreleased section becomes 6.3.0 with its compare links, and says what 6.3.0 is against 6.2.0 for the people who use Jarl.

## Why
The release procedure's bump commit, prepared before the owner's word on the push and the tag.

## Acceptance
- [check] every plugin manifest names 6.3.0 and none names 6.2.0 · by: grep -rn '"version"' .claude-plugin .codex-plugin .cursor-plugin .github/plugin
- [read] CHANGELOG.md has a 6.3.0 heading, an empty Unreleased section and compare links, and every line under 6.3.0 is true of the release tip against 6.2.0, for someone who uses Jarl
- [check] the full suite passes on the merged result

## Evidence

