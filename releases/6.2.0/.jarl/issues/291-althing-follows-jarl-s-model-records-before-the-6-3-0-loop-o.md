# 291 · Althing follows Jarl's model records before the 6.3.0 loop opens: ws brief renders the model, the goal declares Model lines, and the rules point to them

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2007-gadd
**Tags:** althing, docs, models
**Files:** Althing/workspace/lib/briefs.mjs, Althing/workspace/test/ws.test.mjs, Althing/AGENTS.md, Althing/method/working-model.md, Althing/.claude/skills/directing-a-release-loop/SKILL.md
**Repo:** ../..
**After:** 287
**Found by:** jarl-architect
**Source:** research/2026-10-11-jarl-model-calibration-and-field-notes#althing-mc-model-records
**Where:** Althing/AGENTS.md section 8; Althing/workspace/lib/briefs.mjs (ws brief); Althing/method/working-model.md

## What
Once 287 lands, Althing must use what it records. ws brief renders the model into the lease command (--model) and into each reviewer brief's recording command; the 6.3.0 goal declares Model (<tier>): lines; AGENTS.md section 8, method/working-model.md and the skill for directing a release loop point to those lines and to ws jarl models, write the tiers as light, standard and strong, and state the reviewer rule as ruled: the approve that clears an issue is never of the worker's own model and never ranked below it until models says it may clear that kind, and a lighter first reviewer is welcome.

## Why
Section 8 today says that Jarl's measurements will replace the default split; until the briefs and the rules use the records, nothing is measured and the rule stays prose.

## Acceptance
- ws brief fills a model placeholder in the lease and recording commands of every brief it renders for a loop whose driver Jarl takes --model (the 6.3.0 templates), and fails when none is given; the 6.2.0 loop's briefs, driven by Jarl 6.1.0 (jarl-pinned-in-loop), which refuses --model, are not changed and render as today (architect's scope review of 2026-10-18, section 4, item 14); tests cover both
- The 6.3.0 goal.md template carries Model (strong), Model (standard) and Model (light) lines; AGENTS.md section 8, method/working-model.md and the directing skill name the lines, ws jarl models, the three tiers and the clearing-approve rule, and no model name appears in a rule
- yg check and npm test green; done before the 6.3.0 loop opens

## Evidence

