# 263 · Skills and research: the owner's approval of the research split (the rest of the move's step M8)

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** althing, migration, needs-owner
**Files:** 
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/research/: 29 folders (28 of the family's engineering research and 2026-10-05-family-workspace) and INDEX.md, merged in 276b689

## What
Step M8 is on main, merged in 276b689: the four remaining skills (family-workspace, researching-the-family, handling-issues, keeping-the-canon) and the family's research: 28 folders of engineering research, the Polish files translated, absolute paths and references into the private practice repository rewritten neutrally, and a scrubbed copy of the earlier workspace design. Four folders stay private: the competitive market review and three business folders. The step is done when the rails and the keyed scan are green and the owner has approved the split (decision 3 of the design's list for him). He settled its one open choice on 2026-10-05: the competitive market review stays private with the three business folders, and can move later in one move (ruling ask-013). What remains is his word on the split as carried out: the folders listed in research/INDEX.md are the ones that go public.

## Why
The research is public from Althing's first push, and a folder published by mistake cannot be taken back once forks and caches hold it.

## Acceptance
- The owner's approval of the research split as carried out (the folders in research/INDEX.md public, the four kept private) is recorded as his answer to an ask or as an evidence row citing ask-013 and naming what he approved
- A folder he wants out or in is its own issue, and the publish issue waits on it

## Evidence

- **ran:** git show --stat 276b689 · **saw:** merge: the four remaining skills and the family's research (M8); 98 files changed: the four SKILL.md files, the research folders, the research node, layout/research enforced
- **ran:** ls -d research/*/ · **saw:** 29 folders: 28 of the family's engineering research and 2026-10-05-family-workspace
- **ran:** yg check --no-approve · **saw:** yg check: PASS 15 nodes, 474/474 files covered, 2048 pairs verified (script)
- **ran:** node rails/run.mjs tree --require-key · **saw:** rails tree: clean

jarl: the owner settled the split's one open choice on 2026-10-05 (ruling ask-013): the competitive market review stays private with the three business folders and can move later in one move. His approval of the split as carried out is what remains.

