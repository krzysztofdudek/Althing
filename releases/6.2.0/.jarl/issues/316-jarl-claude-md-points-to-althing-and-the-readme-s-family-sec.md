# 316 · Jarl: CLAUDE.md points to Althing and the README's family section gains the Althing sentence (the docs half of 269, after Althing's first push)

**Status:** in-progress
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261018T1650-rduu
**Tags:** jarl, docs, migration, needs-owner
**Files:** JarlSkill/CLAUDE.md, JarlSkill/README.md
**Repo:** JarlSkill
**Found by:** jarl
**Where:** JarlSkill/README.md (the family section ends without the canon's Althing sentence); JarlSkill/CLAUDE.md (no pointer to Althing)
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
Split from 269 under the ruling jarl-release-alone-with-every-jarl-issue: 269 keeps the real-loop test, which goes into Jarl 6.2.0, and this issue holds its docs half, which waits on Althing's first push (266) by its own terms, because a public pointer to an unpushed repository points nowhere (scope review of 2026-10-18, Q7). The move's step M9 for Jarl: CLAUDE.md gains the line 'Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing'. README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with 'The family is developed in the open in Althing: its releases, research and rulings.' (ruling ask-014: after Althing's first push). On the first JarlSkill release branch cut after 266, in a worker worktree, never in the driver checkout, whose branch stays put for the whole release (jarl-pinned-in-loop). Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer, and the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref jarl=<the branch carrying the change> reports no difference for Jarl, and CLAUDE.md carries the pointer line
- cd skills/jarl/scripts && npm test is green on the commit

## Evidence

