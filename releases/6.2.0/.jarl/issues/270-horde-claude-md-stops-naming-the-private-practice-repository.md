# 270 · Horde: CLAUDE.md stops naming the private practice repository and points to Althing, and the README's family section gains the Althing sentence

**Status:** dropped
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261006T0609-htzw
**Tags:** horde, docs, migration, needs-owner
**Files:** Horde/CLAUDE.md, Horde/README.md
**Repo:** ../../../Horde
**Found by:** jarl
**Where:** Horde/CLAUDE.md:9 (names the author's private practice repository); Horde/README.md:227 on main (the family section ends without the canon's Althing sentence)
**After:** 266

## What
The move's step M9 for Horde. The first sentence of CLAUDE.md:9 becomes "This repository never names or links any client, client work, or private repository of the author." (the sentence after it, that the skill's origin and development context stay private, stays), and the paragraph is followed by "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On Horde's release/6.2.0 (cut from main when Horde's first 6.2.0 package starts); if 6.2.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref horde=<the branch carrying the change> reports no difference for Horde
- CLAUDE.md names no private repository and carries the pointer line
- cd skills/horde/scripts && npm test is green on the commit

## Evidence

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

