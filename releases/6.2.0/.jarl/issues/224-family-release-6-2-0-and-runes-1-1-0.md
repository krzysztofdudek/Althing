# 224 · Family release 6.2.0 and Runes 1.1.0

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261005T1408-rjey
**Tags:** release, needs-owner
**Files:** 
**Repo:** ../../../Yggdrasil, ../../../Grain, ../../../JarlSkill, ../../../Runes
**Found by:** jarl
**Where:**
**After:** 254, 255, 256, 257, 258, 259, 276, 313, 326, 327

## What
The release per the releasing-the-family skill, after all the other issues of the loop are closed (runes-last) and only on the owner's word (release-last-on-owner-word). Order: Runes 1.1.0 on npm (the first publish is the owner's step); Yggdrasil pins @chrisdudek/runes@1.1.0 from registry.npmjs.org and removes the 'Until Runes is on npm' item; Grain pins the vendored Runes to the 1.1.0 tag; Jarl is already tagged 6.2.0 by then (see below); promises: the version in yg-package.yaml and yg-marketplace.yaml together, bumped when something in packages/promises/ changed. In every repository with work: release/<version> green in CI on the same SHA, npm run surface-truth green on Yggdrasil, version-bump commits (one per repository), merge to main, tag and release through the repository's workflow, verification of the publication (npm view, releases, pack/promises@…), cleanup of branches and worktrees at the end. Split under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18; architect's scope review, 7.2): Jarl 6.2.0 ships alone first, on the Runes 1.0.0 it vendors, and its half of this issue (the CHANGELOG section, the five manifests, the tag, the plugin and the publication checks) moved to 312 and 313. This issue keeps the family's other rows, whose order does not change. releases/6.2.0/family.json stays open, with repos.jarl.commit null until the family's candidate and a declared runes exception under repos.jarl (pin v1.0.0, its commit, the ruling) that 258 reads; at the candidate, repos.jarl.commit is set to the v6.2.0 commit 313 already published, and a candidate whose Jarl commit is not that tag is an error for 277 to catch.

## Why



## Acceptance
- Runes 1.1.0, Yggdrasil 6.2.0 and Grain 6.2.0 released, with a CHANGELOG section and a tag in each; npm view @chrisdudek/yg and @chrisdudek/runes shows the new versions; pack/promises@<version> exists if promises changed
- Jarl 6.2.0 published by 313, and at the family candidate releases/6.2.0/family.json names that published commit as repos.jarl.commit, keeping the declared runes exception

## Evidence

Ruling ask-002 (charter): the owner: “yes” (translated from Polish) to the question whether the architect's variant goes in (everything from Jarl 6.2.0's recommended set except what the architect moved; repositories first in line to be set aside if the release had to be closed earlier) — after the architect's conclusions were explained and the idea of .jarl/<name>/ was rejected.

Ruling ask-010 (charter): the owner: Althing, public. The full answer is in the ruling althing-family-layer.

Ruling ask-011 (charter): the owner chose the option 'Faithfully, without swear words (Recommended)' (option label, translated from Polish): the content, tone and force of his words translated faithfully, swear words replaced with a neutral word, the marker '(translated from Polish)'; pure reactions without a decision do not go into the public rulings (they stay in the private journal).

Ruling ask-012 (charter): the owner chose the option 'Standing permission (Recommended)' (option label, translated from Polish): after the first push (on his word, after reading the content) the jarl pushes Althing's main to GitHub by itself whenever the pre-push checks are green (English, zero client names, zero secrets, zero binary files); pushes to the tool repositories still on his word.

Ruling ask-013 (charter): the owner chose the option 'Stays private (Recommended)' (option label, translated from Polish): the competitor review stays in the private repository together with the three business folders; it can move to Althing later in one move.

Ruling ask-014 (charter): the owner chose the option 'Yes, add the sentence (Recommended)' (option label, translated from Polish): one sentence about Althing goes into the shared family description and into the READMEs of the seven tools, after Althing's first push.

jarl: Althing M1+M3 built locally (12 commits, 61 tests green, nothing pushed); the name list initialised (1024 hashes); English calibration: every Polish paragraph caught, 0 false positives in English. Driver Jarl: JarlSkill main is at 2c12aa3 (a README/CLAUDE.md-only change after Skald was removed) instead of c9c36cf from the ruling jarl-pinned-in-loop — the script code is identical, so the driver pin is 2c12aa3.

Ruling ask-018 (charter): The owner chose the option 'All into 6.2.0 (Recommended)' (option label, translated from Polish): the four growth items go into Jarl 6.2.0 — 246's CI default, --red and derived landing; 244's several-ratify answer and supersedes naming the open issues; 250's MCP server sentence; the show bounded by the gate's window (280).

Ruling ask-003 (stuck): The owner chose the option '6.2.0 like the whole family (Recommended)' (option label, translated from Polish): the promises rule package is released as 6.2.0 together with the family even when its content is unchanged, per Horde's own rules; the releasing skill's sentence that says otherwise is corrected.

Ruling ask-004 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

Ruling ask-016 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

Ruling ask-017 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

Ruling ask-019 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

Ruling ask-020 (ratify): Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

