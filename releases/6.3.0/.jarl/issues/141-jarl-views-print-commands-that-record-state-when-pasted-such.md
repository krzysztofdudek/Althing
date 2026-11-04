# 141 · Jarl: views print commands that record state when pasted, such as next --as jarl printing merged <id> --ci green|red

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096g-opus
**Where:** Review of 096 (rev-jarl-096g-opus), Outside the issue

## What
Views and replies print commands: next --as jarl prints 'merged <id> --ci green|red', which pasted records CI green; the owner's list prints 'answer a-N "yes" --by owner (or "reject")'; new prints 'field <id> Files p,q'. They were there before 096.

## Why
A view is read by agents who paste; a printed command that records a state or an act reserved to someone else can be pasted without the facts being checked.

## Acceptance
A command a view prints either carries a registered placeholder where a fact only the reader knows goes, or is read-only; the owner's acts are shown as questions to ask; a test scans the views' output for it

## Evidence

