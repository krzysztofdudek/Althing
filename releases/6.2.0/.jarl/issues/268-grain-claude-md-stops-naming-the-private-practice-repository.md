# 268 · Grain: CLAUDE.md stops naming the private practice repository and points to Althing, and the README's family section gains the Althing sentence

**Status:** in-progress
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261006T0609-cgyr
**Tags:** grain, docs, migration, needs-owner
**Files:** Grain/CLAUDE.md, Grain/README.md
**Repo:** Grain
**Found by:** jarl
**Where:** Grain/CLAUDE.md:9 (names the author's private practice repository); Grain/README.md:408 on release/6.2.0 (the family section ends without the canon's Althing sentence)
**After:** 266, 341
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What
The move's step M9 for Grain. The first sentence of CLAUDE.md:9 becomes "This repository never names or links any client, client work, or private repository of the author." (the rest of that paragraph, on the measurement corpus, stays), and the paragraph is followed by "Issues, releases, research and the family canon live in Althing: https://github.com/krzysztofdudek/Althing". README.md's family section takes the canon's block as it stands in Althing's family/canon.md, which ends with "The family is developed in the open in Althing: its releases, research and rulings." (ruling ask-014: after Althing's first push). On release/6.2.0; if 6.2.0 is tagged before Althing's first push, on the next release's branch instead. Pushed only on the owner's word.

## Why
An agent working in the repository finds where its issues, releases and rulings are decided only through that pointer. A public file that names the author's private repository points readers at something they cannot see. And the canon's drift check (ws check canon-sync) reports the README as drifting until it carries the canon's block as it stands.

## Acceptance
- From Althing, node workspace/ws.mjs check canon-sync --source local --ref grain=<the branch carrying the change> reports no difference for Grain
- CLAUDE.md names no private repository and carries the pointer line
- cd plugins/grain && npm test is green on the commit

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

