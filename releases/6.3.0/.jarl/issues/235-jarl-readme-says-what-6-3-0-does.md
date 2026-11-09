# 235 · Jarl README says what 6.3.0 does

**Status:** in-progress
**Kind:** docs
**Priority:** 1
**Tier:** standard
**Key:** 20261109T1033-rctl
**Tags:** 
**Files:** 
**Repo:** JarlSkill
**Found by:** owner
**Where:**
**Branch:** jarl/235-readme
**Worker:** w-jarl-readme-sonnet
**Model:** claude-sonnet-5-5
**Since:** 2026-11-09 10:33

## What
The README still describes a worker per issue, an acceptance line with no method, and prints commands with no --by, which the tool refuses.

## Why
The owner asked on 2026-11-09 for the README to speak of the current version only, in the present, before the release.

## Acceptance
- [read] the README says in the present and with no version talk what the tool does now: an issue's lines each say how they are proved, one agent carries one issue or many, one independent examiner checks each piece of work
- [read] every command the README prints runs as printed once its placeholders are filled, --by included where the tool asks for it
- [read] its opening sentence, the social card's alt text and the worktree row agree with the canon's sentence on one worker per piece of work, and the first-day list is one idea per item
- [check] no difference for Jarl · by: node workspace/ws.mjs check canon-sync --source local --ref jarl=jarl/235-readme

## Reviews
- **changes** · by rev-jarl-232-opus-prep (fresh) · 2026-11-09 · model claude-opus-5-5
  Read at efbe1d9. Line 1 is not met: "the README says in the present and with no version talk what the tool does now: an issue's lines each say how they are proved, one agent carries one issue or many, one independent examiner checks each piece of work". Important 1: the first-day list describes one role as two. One item says a fresh reviewer reads the diff and checks that the new test was red before the change and green after. Two items later, one fresh examiner invents and runs scenarios. A first reader counts two agents, and the tool raises one: brief --role reviewer prints "The examiner's brief". Red before and green after is step 4 of the worker's brief. The examiner's six steps run every [test], [check] and [compare] line again, judge the [read] lines and invent scenarios. Make it one item that says that. Important 2: "In the record, nothing is closed without recorded evidence and an approve" is false. An issue with one [read] line, no row and a fresh approve closed: set 4 done printed "4 -> done". The item above it says a reader's judgement is a method. The opening sentence and the alt text say the same thing, "recorded evidence and an approval". Minor: the third item of Who clears an issue is honest, I saw each label I tried in status and report, and the section is more than a first reader needs. That item is one sentence naming eight labels, and the link at the top of the section already covers them. Checked and true: both init forms, new with --repo and --by, import run twice with the second filing nothing, use with and without a path, the refusal that lists loops below, --root and JARL_ROOT, all four anchors, all three kinds of self refused, approve none refused without requires-merged, no version talk or history in the Jarl text, the family section untouched, and 57 docs tests passing.
  outside the issue, filed as 236: assets/social-card.png, the first thing the README shows, prints "Each issue gets a worker", the wording the canon retired for one worker per piece of work (family/canon.md, item 24). The alt text now says something else than the picture. The repository holds no source for the card, so the owner decides on a new render.

## Evidence

### Proof

- **ran (line 7304449e2675):** node workspace/ws.mjs check canon-sync --source local --ref jarl=jarl/235-readme · **saw:** no section-drift line for Jarl; the 5 differences printed are the other five READMEs
- **ran (line 7304449e2675):** node workspace/ws.mjs check canon-sync --source local --ref jarl=jarl/235-readme · **saw:** read Jarl at jarl/235-readme; no [Jarl] section-drift line; canon-sync: 5 difference(s) in 5 of 6 READMEs, the other five; the diff from 4d54638 has no hunk in the family section

