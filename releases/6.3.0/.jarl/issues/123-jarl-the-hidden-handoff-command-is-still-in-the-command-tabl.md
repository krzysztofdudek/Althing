# 123 · Jarl: the hidden handoff command is still in the command table

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-096-opus
**Where:** Found by the worker of 096

## What
After the surface is normalized, the command handoff still exists although it is hidden from the help and the tool list; a test already says the tool list has no handoff tool, and the command line keeps it.

## Why
A command nobody documents is a form an agent can still guess and find answering differently from the rest of the surface.

## Acceptance
handoff is either documented as part of the surface with one purpose in one line, or refused with one line naming the command that replaces it, and a test over the command table says which

## Evidence

Dropped: a known limitation under the owner's ruling known-limitations-list-for-wording-minors: only wording, taste or an input no one is expected to give; it is written in releases/6.3.0/plans/known-limitations.md for the release notes

