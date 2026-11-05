# 139 · Jarl: log accepts a free note shaped like a merge line, such as '4 merged abc1234 into main'

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096d-opus
**Where:** Review of 096 (rev-jarl-096d-opus), Outside the issue

## What
The shape check in lib/journal.mjs lets a free note read as a merge of issue 4 pass as plain text. The behaviour was there before 096.

## Why
The log is the record of merges; a free note that reads as one can be mistaken for one by a person, though not by the tool.

## Acceptance
A free note whose words read as a filing, a move, a merge, a round or a verdict by position is refused and names the operation that writes it, with a test per kind

## Evidence

Dropped: a known limitation under the owner's ruling known-limitations-list-for-wording-minors: only wording, taste or an input no one is expected to give; it is written in releases/6.3.0/plans/known-limitations.md for the release notes

