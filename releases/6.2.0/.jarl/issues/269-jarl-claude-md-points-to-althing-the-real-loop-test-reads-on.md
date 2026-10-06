# 269 · Jarl: CLAUDE.md points to Althing, the real-loop test reads only JARL_LIVE_LOOP, and the README's family section gains the Althing sentence

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** jarl, docs, migration, needs-owner
**Files:** JarlSkill/CLAUDE.md, JarlSkill/skills/jarl/scripts/tests/resume.test.mjs, JarlSkill/README.md
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** JarlSkill/skills/jarl/scripts/tests/resume.test.mjs:220 (the default loop path climbs out of the repository into the author's private practice repository); JarlSkill/README.md:185 on main (the family section ends without the canon's Althing sentence); JarlSkill/CLAUDE.md (no pointer to Althing)
**After:** 266

## What
The move's step M9 for Jarl. CLAUDE.md gains the line "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". The real-loop test in resume.test.mjs drops its default path into the private repository and reads its loop only from JARL_LIVE_LOOP, which Althing's ws env supplies, skipping with that reason when it is unset. README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On Jarl's release/6.2.0, in a worker worktree, never in the driver checkout, whose branch stays put for the whole release (jarl-pinned-in-loop); if 6.2.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands. A test in a public repository that looks for its input inside a private one is skipped everywhere but one machine, and a skipped test proves nothing.

## Acceptance
- resume.test.mjs holds no path outside the repository; with JARL_LIVE_LOOP unset the test is skipped with a reason that names the variable, and with it set to a copy of a loop the test runs
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref jarl=<the branch carrying the change> reports no difference for Jarl, and CLAUDE.md carries the pointer line
- cd skills/jarl/scripts && npm test is green on the commit

## Evidence

