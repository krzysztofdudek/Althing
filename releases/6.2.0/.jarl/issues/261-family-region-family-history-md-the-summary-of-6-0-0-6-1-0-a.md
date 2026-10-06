# 261 · Family region: family/history.md, the summary of 6.0.0, 6.1.0 and the 6.1.1 to 6.2.0 origin (the rest of the move's step M6)

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** strong
**Tags:** althing, migration
**Files:** Althing/family/history.md
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/README.md:11 lists the history among the contents of family/; family/ holds canon.md, contracts.md, inventory.md, map.md, parked.md and registry.json, and no history.md

## What
Step M6 of the move (the family region) is on main: the canon, the registry, the map, the contracts index, the inventory and the parked ideas (4ba6f35), layout/family enforced again (7c11dd5), and ws check canon-sync with its tests (1fcb387), merged in b60441e. What remains is family/history.md: one section per release (6.0.0, 6.1.0, and the 6.1.1 patch that became 6.2.0), each saying what shipped per repository, how the family's composition changed, the counts, and which standing rulings of method/rulings.md it produced, by slug. The records of 6.0.0 and 6.1.0 stay private (they are Polish and carry private paths and names), and so do Grain's first-project history and Horde's earlier history; this file is their public summary. It is written from public sources: each tool's CHANGELOG sections and tags, releases/6.1.0/family.json, the ledger, the research folders, and the 6.2.0 loop's goal, rulings and log. A figure only the private records hold (the issue and ruling counts of the 6.0.0 and 6.1.0 loops) arrives from the owner's side as a distilled list of numbers; the worker reads nothing outside Althing and the public repositories.

## Why
The front page promises the history, and the owner reads family/history.md before Althing's first push. Without it the only account of how the family reached 6.2.0 is in records nobody outside can read, and the upgrade path starts at a release (6.1.0) the repository never describes.

## Acceptance
- family/history.md has one section each for 6.0.0, 6.1.0 and 6.1.1 to 6.2.0: what shipped per repository, the composition changes, the counts, and the standing rulings linked by slug; every commit or tag it cites matches releases/6.1.0/family.json or a public tag
- It names no client, client project, client person or private repository and links nothing private; any words of the owner in it are marked (translated from Polish)
- yg check && npm test green, and node rails/run.mjs tree --require-key reports the tree clean

## Evidence

- **ran:** git show --stat b60441e · **saw:** merge: the family region (M6); 13 files changed: family/canon.md, contracts.md, inventory.md, map.md, parked.md, registry.json, the family node, layout/family enforced, workspace/checks/canon-sync.mjs and its tests, ws.mjs; no family/history.md
- **ran:** node --test workspace/test/canon-sync.test.mjs · **saw:** tests 23, pass 23, fail 0, skipped 0
- **ran:** node workspace/ws.mjs check canon-sync --source local · **saw:** canon-sync: 7 difference(s) in 7 of 7 READMEs; each is the one expected line, the canon's sentence on Althing (ask-014), which the READMEs gain after Althing's first push (267-270, 272-274)

