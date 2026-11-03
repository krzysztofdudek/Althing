# 035 · Jarl: the direction of research/2026-11-03-jarl-as-a-loop-tool is designed, critiqued and decided, and its issues are filed

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** strong
**Tags:** design
**Files:** research/2026-11-03-jarl-as-a-loop-tool/
**Found by:** owner
**Where:**
**Worker:** jarl-evolution-session
**Since:** 2026-11-03 07:38

## What
The one release (ruling one-release-partial-pause) carries the direction drafted in research/2026-11-03-jarl-as-a-loop-tool: who holds the ball and what the next move is, a coordinator that can be replaced at any moment, safety with many drivers, and a record that tells the process as it was. It is a draft; 006, 007 and 022 wait for it.

## Why
Building the review queue, the model ceiling or reserved numbers before the batching rule, the model rules and the id design are settled risks a shape this release then reworks.

## Acceptance
- report.md in the folder states the design, each part marked built or proposed, with the issues it implies
- Three independent fresh Opus critiques (fidelity to the owner's intent, technical soundness, the cost of maintaining it) are in the folder, and a revision answers every finding, saying what changed and what was rejected and why
- The owner's decisions on the design's open points are rulings in this loop
- The design's issues are filed in this loop with a Source in the folder, and 006, 007 and 022 are amended against it or kept with a reason

## Evidence

Under ruling field-report-findings-all-into-6-3-0 the design keeps, reshapes or drops, each with a reason, the 24 field-report issues that wait on it: 039, 040, 041, 042, 044, 045, 048, 049, 050, 051, 052, 055, 056, 057, 058, 059, 061, 062, 063, 064, 068, 069, 070, 073; also 006, 007 and 022, and the id design taken out of 031.
- **ran:** node workspace/ws.mjs jarl sources research/2026-11-03-jarl-field-report-long-loop/materials/findings.json --source research/2026-11-03-jarl-field-report-long-loop --release 6.3.0 · **saw:** 38 finding(s) · 38 filed · 0 unfiled · issues: open 29, dropped 9
- **ran:** yg check (at c919a90) · **saw:** yg check: PASS, 17 nodes, 1026/1026 files covered

