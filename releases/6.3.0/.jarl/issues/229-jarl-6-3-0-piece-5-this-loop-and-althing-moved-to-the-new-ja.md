# 229 · Jarl 6.3.0, piece 5: this loop and Althing moved to the new Jarl

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261108T1910-dqno
**Tags:** 
**Files:** 
**After:** 228
**Found by:** jarl
**Where:**
**Branch:** jarl/229-move
**Worker:** w-jarl-229-opus
**Worktree:** /home/me/Worktrees/Althing/229-move
**Since:** 2026-11-09 04:07

## What
the loop and `workspace/` on the tool they ship with. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 5.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [check] an agent converts `releases/6.3.0/.jarl` following the conversion file and nothing else, and `verify` is clean · by: `jarl verify --root releases/6.3.0`
- [read] the conversion lost nothing: issue, ruling and evidence counts match, and a sample of 20 issues reads the same
- [check] `ws` drives the new Jarl with the commands of 6.3.0, and the workspace's own tests pass · by: `npm test`
- [read] AGENTS.md, the skills `directing-a-release-loop` and `releasing-the-family` and the briefs in `releases/6.3.0/briefs/` say what the new Jarl does, the driver pin in the release's manifest points at the new Jarl, and the rails accept a converted loop
- [read] the contracts page names `jarl-record/4` (155), and `ws status` reads the counts of a loop with a profile (207)
- [read] the canon's sentence on Jarl says what section 15 of the design says, by the canon's own procedure
- [check] the gate passes · by: `yg check && npm test`

## Evidence

### Proof

- **ran (line 6df24177d78a):** jarl verify --root releases/6.3.0 · **saw:** verify: clean - every line of the record is placed, and nothing disagrees (the new Jarl, driver-6-3-0 at 6ecab42, on the converted loop)
- **ran (line 4177a48cb028):** npm test · **saw:** pass 108, fail 0, skipped 0, at the root of the worktree with the two table tests comparing against the driver
- **ran (line bb39f6ff3605):** yg check && npm test · **saw:** yg check: PASS (1208/1208 files covered, 5217 pairs verified); npm test: pass 108, fail 0

### Notes

Conversion comparison by the conversion file alone: issues 231 before and after, each file byte-identical after undoing its Key line and its (history) words; evidence rows 1253 and log history lines 1253; decisions.md and asks.md byte-identical (84 ruling headings, 29 questions); 2944 dated log lines before, 2945 after (the converted line); status counts identical under old and new Jarl; 20 issues (1, 12, 23 ... 210) read the same through show of each tool, the labels of the new display set aside. The file was sufficient: no line needed improvising.

Assumed: ws brief on a loop of the current format prints the tool's own brief, then what releases/<version>/briefs/ adds for this machine: the tool cannot know where each family repository is checked out or how it runs, so those files stay, cut to that. An older loop keeps its complete templates.

Assumed: ws release open writes only the new forms (Check (<name>): lines, --by, lines with methods), since a future release is opened by a driver of the current format; the 6.2.0 loop never opens again.

Assumed: rails/manifest.mjs's message and the comment of rails/loop.mjs stay as they were: any byte changed in a rail's own code re-opens its type law and yg check then needs the owner's ratification, which this work does not hold. The manifest's driver repo as a source name and the conversion exception are said in the architecture file and the workspace.

