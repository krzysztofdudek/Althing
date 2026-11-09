# 229 · Jarl 6.3.0, piece 5: this loop and Althing moved to the new Jarl

**Status:** done
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
**Merged:** 9c7c05414960bb025d16041740f4100f10d2f77a
**CI:** none

## What
the loop and `workspace/` on the tool they ship with. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 5.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [check] an agent converts `releases/6.3.0/.jarl` following the conversion file and nothing else, and `verify` is clean · by: `jarl verify --root releases/6.3.0`
- [read] the conversion lost nothing: issue, ruling and evidence counts match, and a sample of 20 issues reads the same
- [check] `ws` drives the new Jarl with the commands of 6.3.0, and the workspace's own tests pass · by: `npm test`
- [read] AGENTS.md, the skills `directing-a-release-loop` and `releasing-the-family` and the briefs in `releases/6.3.0/briefs/` say what the new Jarl does, the driver pin in the release's manifest points at the new Jarl, and the rails accept a converted loop
- [read] the family's contracts page in Althing names `jarl-record/4`, and `ws status` reads the counts of a loop with a profile (207)
- [read] the canon's sentence on Jarl says what section 15 of the design says, by the canon's own procedure
- [check] the gate passes · by: `yg check && npm test`

## Reviews
- **changes** · by rev-jarl-229-opus-move (fresh) · 2026-11-09 · model claude-opus-5-5
  Important (line 5): Yggdrasil docs/family-contracts.md line 52 still registers jarl-record/1. Issue 155, which this piece absorbs, names that page, and family/contracts.md says the page is canonical. family/contracts.md line 16 and family/canon.md line 55 now say the page registers jarl-record/4, which the page does not yet do. Change the page through an issue on Yggdrasil, or have the director reword the line. Important (line 3): workspace/ws.mjs line 367 hardcodes repo jarl for --driver-sibling. ws release open 6.3.9 --previous 6.3.0 --goal x --driver-sibling 6ecab42 runs the old driver at this machine's jarl source, stops with "unknown flag --by for init", and leaves releases/6.3.9/family.json, so a retry is refused as "exists already". The releasing skill prescribes this command. Important (line 6): the canon procedure is partly done. Step 5: family/map.md line 15 still says "a worker per issue in its own worktree". Step 4: no issue covers the Jarl README (issue 193 covers five others, the README at 6ecab42 line 138 keeps the retired phrase) or the GitHub description at family/canon.md line 84, while canon.md line 163 says the six READMEs resync "by the issue filed for them". Step 6: show 229 --full holds no canon-sync row. Minor (line 4): briefs/reviewer.md line 7 renders the Jarl checkout from {{repo:jarl}}, the driver of 6.2.0; the other two briefs use {{repo:jarl-6-3-0}}. Minor (line 4): the directing skill line 46 treats --worktree as recorded, and the tool prints "--worktree was checked and is not recorded". Met: line 1, line 2 (the conversion lost nothing: an independent conversion from 3c36c77 equals commit 0138552 except the key letters and the converted line; 231 issues, 84 rulings, 29 questions and 1253 rows match; show of all 231 reads the same with labels set aside, 001 gaining the tool's sign-off note), line 7, and the rails. Line 4 otherwise: every command form I ran from the skills and briefs works.
- **approve** · by rev-jarl-229-opus-move (fresh) · 2026-11-09 · model claude-opus-5-5
  Round 2 at 41d7063, all three Important findings of round 1 closed. Line 2, "the conversion lost nothing: issue, ruling and evidence counts match, and a sample of 20 issues reads the same": met, and the loop files changed since are only the director's edits to 001, the rows and notes of 229, and 20 appended log lines. Line 4, "AGENTS.md, the skills `directing-a-release-loop` and `releasing-the-family` and the briefs in `releases/6.3.0/briefs/` say what the new Jarl does, the driver pin in the release's manifest points at the new Jarl, and the rails accept a converted loop": met; I ran ws release open 6.3.9 --previous 6.3.0 --goal x --driver-sibling 6ecab42 literally and it opens under jarl-6-3-0 with verify clean; naming the old driver fails at init and git status shows nothing left, and the retry opens; a checkout off the commit named is refused; the reviewer brief renders the driver of 6.3.0; a lease with --worktree writes no path. Line 5, "the family's contracts page in Althing names `jarl-record/4`, and `ws status` reads the counts of a loop with a profile (207)": met as the director narrowed it. Line 6, "the canon's sentence on Jarl says what section 15 of the design says, by the canon's own procedure": met; family/map.md and the description at family/canon.md line 84 say a worker per piece of work, the description is 247 characters, the retired phrase stands only in the retired list, the history and the inventory snapshot, and row 7 holds the canon-sync comparison. Step 4 waits on one issue: new refuses a linked worktree at lib/new.mjs line 66, and the command in note-5 files a valid issue on a scratch main checkout. That is enough, on condition that the coordinator files it at the landing. Minor: family/contracts.md line 16 and family/canon.md line 55 say the page registers jarl-record/4 while Yggdrasil docs/family-contracts.md line 52 holds jarl-record/1, until issue 155 lands. Minor: main's ws.local.json needs the source jarl-6-3-0 at the landing, or ws jarl stops with no source.

## Evidence

### Proof

- **ran (line 6df24177d78a):** jarl verify --root releases/6.3.0 · **saw:** verify: clean - every line of the record is placed, and nothing disagrees (the new Jarl, driver-6-3-0 at 6ecab42, on the converted loop)
- **ran (line 4177a48cb028):** npm test · **saw:** pass 108, fail 0, skipped 0, at the root of the worktree with the two table tests comparing against the driver
- **ran (line bb39f6ff3605):** yg check && npm test · **saw:** yg check: PASS (1208/1208 files covered, 5217 pairs verified); npm test: pass 108, fail 0
- **ran (line 6df24177d78a):** jarl verify --root releases/6.3.0 · **saw:** verify: clean, every line of the record is placed, and nothing disagrees (driver-6-3-0 at 6ecab42). An independent conversion from the frozen loop at 3c36c77 by the conversion file alone matches the conversion commit 0138552 except the random letters of the keys and the converted line's stamp and writer
- **ran (line 4177a48cb028):** npm test · **saw:** tests 108, pass 108, fail 0, skipped 0, at the root of the worktree at 789f3ee
- **ran (line bb39f6ff3605):** yg check --no-approve && npm test · **saw:** yg check: PASS, 1208/1208 files covered, 5217 pairs verified; npm test: pass 108, fail 0. Run with --no-approve so the examiner fills no verdict
- **ran (line 5fb9efd73c83):** node workspace/ws.mjs check canon-sync --source local · **saw:** canon-sync: 6 differences in 6 of 6 READMEs: each still holds the older sentences; the Jarl README and its description wait on the issue filed for them, 193 on the five others
- **ran (line 4177a48cb028):** npm test · **saw:** pass 112, fail 0, skipped 0, after the fixes of round 1
- **ran (line bb39f6ff3605):** yg check && npm test · **saw:** yg check --no-approve: PASS; npm test: pass 112, fail 0, after the fixes of round 1
- **ran (line 6df24177d78a):** jarl verify --root releases/6.3.0 · **saw:** verify: clean — every line of the record is placed, and nothing disagrees
- **ran (line 4177a48cb028):** npm test · **saw:** tests 112, pass 112, fail 0, skipped 0, at the root of the worktree at 41d7063
- **ran (line bb39f6ff3605):** yg check --no-approve && npm test · **saw:** yg check: PASS, 1208/1208 files covered, 5217 pairs verified; npm test: pass 112, fail 0, at 41d7063. Run with --no-approve so the examiner fills no verdict

### Notes

Conversion comparison by the conversion file alone: issues 231 before and after, each file byte-identical after undoing its Key line and its (history) words; evidence rows 1253 and log history lines 1253; decisions.md and asks.md byte-identical (84 ruling headings, 29 questions); 2944 dated log lines before, 2945 after (the converted line); status counts identical under old and new Jarl; 20 issues (1, 12, 23 ... 210) read the same through show of each tool, the labels of the new display set aside. The file was sufficient: no line needed improvising.

Assumed: ws brief on a loop of the current format prints the tool's own brief, then what releases/<version>/briefs/ adds for this machine: the tool cannot know where each family repository is checked out or how it runs, so those files stay, cut to that. An older loop keeps its complete templates.

Assumed: ws release open writes only the new forms (Check (<name>): lines, --by, lines with methods), since a future release is opened by a driver of the current format; the 6.2.0 loop never opens again.

Assumed: rails/manifest.mjs's message and the comment of rails/loop.mjs stay as they were: any byte changed in a rail's own code re-opens its type law and yg check then needs the owner's ratification, which this work does not hold. The manifest's driver repo as a source name and the conversion exception are said in the architecture file and the workspace.

Assumed: the issue for Jarl README and description is not filed on this branch: new refuses a linked worktree (the number could be used twice) and main is frozen until this lands. To file from the main checkout after the merge: jarl new "Jarl: its README family section and its GitHub description follow the canon sentence on one worker per piece of work" --kind docs --prio 3 --tier standard --repo ../../../JarlSkill --tags canon --found-by jarl --what "Issue 193 covers the READMEs of Yggdrasil, Grain, Ratatoskr, Urd and Researcher; this covers Jarl README family section and its GitHub description. The owner runs: gh repo edit krzysztofdudek/JarlSkill --description \"Your feature branch has more issues than one agent can hold in its head. Jarl makes your coding agent direct a crew: an issue per finding, a worker per piece of work in its own worktree, nothing closed without evidence and a fresh reviewer's word.\" (247 characters)." --why "The canon sends each surface that quotes it to an issue, and gh repo edit is the owner word every time." --acceptance "[read] Jarl README family section is the canon block on the release branch, and ws check canon-sync names no difference for Jarl" --acceptance "[owner] Jarl GitHub description reads as the canon says · material: the gh repo edit command in What · check: run it" --by jarl

