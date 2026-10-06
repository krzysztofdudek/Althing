# 224 · Family release 6.2.0 and Runes 1.1.0

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** release, needs-owner
**Files:** 
**Repo:** ../../../Yggdrasil, ../../../Grain, ../../../JarlSkill, ../../../Horde, ../../../Runes
**Found by:** jarl
**Where:**
**After:** 254, 255, 256, 257, 258, 259, 276

## What
The release per the releasing-the-family skill, after all the other issues of the loop are closed (runes-last) and only on the owner's word (release-last-on-owner-word). Order: Runes 1.1.0 on npm (the first publish is the owner's step); Yggdrasil pins @chrisdudek/runes@1.1.0 from registry.npmjs.org and removes the 'Until Runes is on npm' item; Grain pins the vendored Runes to the 1.1.0 tag; Jarl gets the number 6.2.0 (five manifests and a CHANGELOG section, also when unchanged) and is tagged before Horde; Horde: vendor.mjs update to Jarl's tag, pin ref to the tag, promises — the version in yg-package.yaml and yg-marketplace.yaml together, bumped when something in packages/promises/ changed. In every repository with work: release/<version> green in CI on the same SHA, npm run surface-truth green on Yggdrasil, version-bump commits (one per repository), merge to main, tag and release through the repository's workflow, verification of the publication (npm view, releases, pack/promises@…), cleanup of branches and worktrees at the end.

## Why



## Acceptance
Runes 1.1.0, Jarl 6.2.0, Yggdrasil 6.2.0, Grain 6.2.0 and Horde 6.2.0 released, with a CHANGELOG section and a tag in each; npm view @chrisdudek/yg and @chrisdudek/runes shows the new versions; pack/promises@<version> exists if promises changed.

## Evidence

Ruling ask-002 (charter): the owner: “yes” (translated from Polish) to the question whether the architect's variant goes in (everything from Jarl 6.2.0's recommended set except what the architect moved; repositories first in line to be set aside if the release had to be closed earlier) — after the architect's conclusions were explained and the idea of .jarl/<name>/ was rejected.

Ruling ask-010 (charter): the owner: Althing, public. The full answer is in the ruling althing-family-layer.

Ruling ask-011 (charter): the owner chose the option 'Faithfully, without swear words (Recommended)' (option label, translated from Polish): the content, tone and force of his words translated faithfully, swear words replaced with a neutral word, the marker '(translated from Polish)'; pure reactions without a decision do not go into the public rulings (they stay in the private journal).

Ruling ask-012 (charter): the owner chose the option 'Standing permission (Recommended)' (option label, translated from Polish): after the first push (on his word, after reading the content) the jarl pushes Althing's main to GitHub by itself whenever the pre-push checks are green (English, zero client names, zero secrets, zero binary files); pushes to the tool repositories still on his word.

Ruling ask-013 (charter): the owner chose the option 'Stays private (Recommended)' (option label, translated from Polish): the competitor review stays in the private repository together with the three business folders; it can move to Althing later in one move.

Ruling ask-014 (charter): the owner chose the option 'Yes, add the sentence (Recommended)' (option label, translated from Polish): one sentence about Althing goes into the shared family description and into the READMEs of the seven tools, after Althing's first push.

jarl: Althing M1+M3 built locally (12 commits, 61 tests green, nothing pushed); the name list initialised (1024 hashes); English calibration: every Polish paragraph caught, 0 false positives in English. Driver Jarl: JarlSkill main is at 2c12aa3 (a README/CLAUDE.md-only change after Skald was removed) instead of c9c36cf from the ruling jarl-pinned-in-loop — the script code is identical, so the driver pin is 2c12aa3.

