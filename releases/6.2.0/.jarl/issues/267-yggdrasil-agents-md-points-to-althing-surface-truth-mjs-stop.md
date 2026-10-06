# 267 · Yggdrasil: AGENTS.md points to Althing, surface-truth.mjs stops naming the private practice repository, and the README's family section gains the Althing sentence

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** yggdrasil, docs, migration, needs-owner
**Files:** Yggdrasil/AGENTS.md, Yggdrasil/source/cli/scripts/surface-truth.mjs, Yggdrasil/README.md
**Repo:** ../../../Yggdrasil
**Found by:** jarl
**Where:** Yggdrasil/source/cli/scripts/surface-truth.mjs:6 (its header comment names the author's private repository); Yggdrasil/README.md:228 on release/6.2.0 (the family section ends without the canon's Althing sentence); Yggdrasil/AGENTS.md (no pointer to Althing; lines 120-157 are the block yg init manages)
**After:** 266

## What
The move's step M9 for Yggdrasil. AGENTS.md gains, outside the block yg init manages, the line "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". The header comment of source/cli/scripts/surface-truth.mjs names the family's release protocol in Althing instead of the private repository. README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On release/6.2.0; if 6.2.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref yggdrasil=<the branch carrying the change> reports no difference for Yggdrasil
- surface-truth.mjs names Althing and no private repository; AGENTS.md carries the pointer line outside the managed block, and yg init --upgrade leaves it in place
- The devcontainer check (cd source/cli && npm test) is green on the commit

## Evidence

