# 239 · Grain: a stack scenario on a corpus of real repositories — propose, a real yg adopt, yg check --full, edge parity of the three tools (the Grain part of 184)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** corpus, grain, workspace
**Files:** Althing/workspace/checks/stack.mjs
**Repo:** ../..
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**After:** 275, 184

## What
Split off from 184 per the 6.2.0 plan (C2, section 6).

## Why



## Acceptance
npm run corpus:gate (with YG_BIN) on the routine set: propose, yg adopt exit 0, yg check --full --approve --only-deterministic exit 0, yg advise --all without relation-declared-unused and aspect-effective-nowhere, 'N break it today' equal to yg check --full; edge parity of Grain/Yggdrasil/the Runes golden file at directory level; the corpus.yml workflow; a deliberately planted change in a refusal and in parity gives exit 1 with the name of the repository and of the step.

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

jarl: the acceptance above names Grain's npm run corpus:gate and a corpus.yml in Grain, from before 239 moved to Althing. In Althing they are the workspace's stack check (workspace/checks/stack.mjs, with its corpus list) run through ws, and the candidate workflow's stack job, which 278 adds once Althing is on GitHub. Runes' corpus manifest (184, package C1) is the list it refers to by id, so 239 waits on 184 too.

