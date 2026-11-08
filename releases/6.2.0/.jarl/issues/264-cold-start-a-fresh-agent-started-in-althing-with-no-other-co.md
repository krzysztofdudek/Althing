# 264 · Cold start: a fresh agent started in Althing with no other context answers nine tasks from the repository alone (the move's step M10)

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** strong
**Tags:** althing, migration
**Files:** 
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/AGENTS.md section 1 ("an agent started here needs nothing from anywhere else") and the six skills under Althing/.claude/skills/
**After:** 261, 262, 263

## What
A fresh Opus agent is started in Althing's checkout with no other context, may use only the repository, and gets nine tasks: (1) resume 6.2.0 and name the next ready package; (2) render the brief for a Grain worker on a given issue; (3) say what needs the owner's word before Runes 1.1.0 is published; (4) file a reported Horde bug the right way; (5) start a research folder on a stated question; (6) change one sentence of the canon and say what else must follow; (7) explain a refusal by lang/english and its fix; (8) ask the owner a question the right way; (9) a reviewer's finding quotes a client's project name inside a committed issue file: say what happens next, in order. The subject answers and writes nothing: tasks that would write give the exact commands it would run. A second fresh Opus agent grades each answer against method/ and the skills. The test is run again whenever AGENTS.md or a skill changes materially. The tool repositories' pointer lines (the move's step M9) wait on Althing's first push and are not needed here, because every task is answered from Althing alone.

## Why
Althing promises that an agent started in it needs nothing from anywhere else. Until an agent with no other context has shown that, it is a claim, and the first push publishes it.

## Acceptance
- The grader finds nine of nine tasks answered correctly from Althing's files alone, recorded as --ran/--saw with the verdict per task
- Every answer that needed knowledge Althing lacks is filed as its own issue, and each such issue is added to the After of the publish issue (266)
- The subject wrote nothing: git status in Althing and the loop's log are unchanged by its run

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

