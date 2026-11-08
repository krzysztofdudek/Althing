# 196 · Jarl: the diff parser names no file when diff.noprefix or diff.srcPrefix is set, and a linked worktree whose path holds a line break is not seen as linked

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-163-opus-i1
**Where:** lib/rounds.mjs headerPath; lib/repositories.mjs mainCheckoutOf

## What
A user git setting diff.noprefix, diff.srcPrefix or diff.dstPrefix makes the diff parser name no file in the marker and large-file notes. A linked worktree whose path holds a line break is not seen as linked, so new files there instead of refusing.

## Why
A note should name the file whatever the user's git settings, and a refusal should not depend on the shape of a path.

## Acceptance
The git commands that feed the parser are run with the prefix settings forced to their defaults, and mainCheckoutOf reads linked worktrees without splitting on line breaks; a test per case

## Evidence

