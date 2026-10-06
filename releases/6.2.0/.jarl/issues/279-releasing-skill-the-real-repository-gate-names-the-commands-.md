# 279 · Releasing skill: the real-repository gate names the commands that run it, the routine set as blocking, and every golden change explained (the skill half of 184)

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, corpus
**Files:** Althing/.claude/skills/releasing-the-family/SKILL.md
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/.claude/skills/releasing-the-family/SKILL.md:68 (step 3, the corpus gate, names npm run corpus and ws run candidate, which does not exist yet, and neither the resolver oracles, the routine set nor the explanation file); :15 (the promises version left as the open question a-003)
**After:** 184, 239

## What
The 6.2.0 plan (releases/6.2.0/plans/plan-6.2.0.md, section 6, row ALT) gives the skill's part of 184 to Althing; the move made it an issue of its own. Once Runes' corpus (184, package C1) and the workspace's stack scenario (239) exist, step 3 names the commands as they were built: npm run corpus and npm run corpus:oracles in Runes, and the stack check and ws run candidate <version> in Althing. It says that the routine set blocks the tag while the heavy tier runs nightly and on dispatch without blocking, and where each list lives; that the gate is read on the manifest's exact commits; and that every golden change in the release has a line in Runes' corpus/explained.md naming its issue. It says how 6.2.0 itself is gated before the release word: the runs one at a time under nice, their output recorded on 184 and 224. In the same commit, the paragraph on the promises version (:15) states the owner's answer to a-003 in place of the open question.

## Why
A release step that names a command that does not exist, or leaves out what blocks, is done by hand or skipped; 184 exists because the 6.1.1 bug hunt found more than 180 defects in real layouts that no suite knew.

## Acceptance
- Every command step 3 names runs as written on the release tips, each recorded as --ran/--saw
- Step 3 names the routine set as blocking and the heavy tier as advisory, with where each list lives, and requires a line in corpus/explained.md with an issue id for each golden change
- The promises paragraph states the owner's answer to a-003
- yg check && npm test green

## Evidence

