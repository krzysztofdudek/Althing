# 273 · Urd: CLAUDE.md points to Althing, and the README's family section gains the Althing sentence

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261006T0609-rrbp
**Tags:** urd, docs, migration, needs-owner
**Files:** UrdSkill/CLAUDE.md, UrdSkill/README.md
**Repo:** ../../../UrdSkill
**Found by:** jarl
**Where:** UrdSkill/README.md:172 on main (the family section ends without the canon's Althing sentence); UrdSkill/CLAUDE.md (no pointer to Althing)
**After:** 266

## What
The move's step M9 for Urd, an add-on. CLAUDE.md gains the line "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On main, as for every add-on, with no version bump: its release workflow tags only a new CHANGELOG heading, so the push releases nothing. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref urd=main reports no difference for Urd, and CLAUDE.md carries the pointer line
- After the push, the release workflow's run on that commit creates no tag and no release (gh run view)

## Evidence

