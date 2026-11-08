# Jarl 6.3.0: the work

The pieces that build [the design](jarl-6-3-0-design.md), in order. The design says how the system works and why; this file says only what is built, in what order, and how it is known to be built. An agent reading these two files can do any piece. Paths under `skills/jarl/` are in JarlSkill, on the release branch.

## The goal, as lines with methods

These are the owner's terms. The release is done when all eight hold.

- [check] the full suite passes on the merged result
- [test] a loop in an older format is refused and the refusal names the conversion file
- [read] the skill holds the conversion file, from which an agent converts a loop
- [check] an agent converts this very loop with that file and `verify` is clean
- [check] the word budgets per role hold by a test
- [test] every rule of the design has a test that fails without it
- [read] an independent examiner: the code does what the design says
- [owner] the blind runs have passed and he says this is it

## How this release is built

By the design's own method, by hand, until the tool can carry it.

- Each piece below is one issue, and its lines are written with their methods. The pinned driver takes them as plain text.
- One strong agent per piece, with the design and this file as its specification. A piece is cut only where it stalls.
- Proof is typed, as in the finished tool. The examiner runs every mechanical line again.
- One independent examiner per piece, of another model where one exists and never weaker. It does not read the worker's report. It starts by inventing and running scenarios the lines do not name, then goes through the six steps of the design's section 6.
- The merger checks the merged result. Nobody repairs the release branch directly. A defect found after a landing is a small issue that goes through the same chain.
- The line of the worker's brief that says a format change must be readable by the driver is lifted for this work: the new tool does not write this loop until piece 5.
- When the coordinator files this list, the eight goal lines go into `goal.md`. An absorbed issue is dropped with a pointer to its piece when the piece lands.
- The issues in flight when this starts (206, 211, 212, 213) land first, or are dropped with their branches if they have not landed when piece 1 starts.

## When piece 1 counts as worse than today

Today's numbers are from the agents' own counters on 2026-11-08: 13 small issues, about 2.04 million tokens, about 157 thousand per issue and per acceptance line (each held one line), reviewers 52%, coordination not counted.

Piece 1 is measured by hand from the same counters (the total each agent's host reports), workers and examiners, coordination left out. It counts as worse if any of these holds:

1. tokens per acceptance line above 157 thousand;
2. more than three rounds;
3. a defect in it is found between its landing and the start of piece 2.

Then the jarl stops before piece 2 and takes the numbers to the owner (a-024). No allowance is made for piece 1 being harder than small issues, because such an allowance would be a number with no origin: he decides what the numbers mean.

## Order

1 → the cut of the largest files (issue 231) → 2 → 3 → 4 → 5 → 6 → 7.

Pieces 1 to 3 change the same files of `skills/jarl/scripts/lib/`, so none of them runs in parallel. Two things may run beside them without touching those files: the lessons check of piece 4 while piece 3 is in work, because it only reads, and the preparation of the starting loops for piece 6 while piece 4 is in work. The loop moves at piece 5 and not sooner, so that it is converted once, to the record's final shape (a-028 says after the core and the moves; removals and the conversion file have to exist first).

## Piece 1: the core

**Delivers:** the design's section 3 and the gate of section 6: lines, methods, line state, the gate per method, the line digest, old line text kept whole, a `changes` that stands until a round. No new code calls `needFormat`: piece 3 removes it. The new shapes are written unconditionally. About 274 places in the suite write an acceptance line and about 400 write a row; moving them to marks and `--line` is part of this piece.

**Tier:** strong. **Depends on:** the issues in flight having landed or been dropped.

**Lines:**

- [test] `new` and `field` accept a line headed `[test]`, `[check]`, `[compare]`, `[read]` or `[owner]` in the form `[method] text · key: value`, and refuse any other line, ending with the form that names the five
- [test] a `[compare]` line without `· by:` is refused; a `[check]` line without `· by:` means the goal's declared check
- [test] a line with no mark reads as `read`; `import`'s "Proposed" line counts as no line
- [test] a lease on an issue with no line is refused, ending with the form that adds one
- [test] `done` asks of each line what its method asks: for `test`, `check` and `compare`, a counted row naming it by the holder of the lease and one by a name that has not held it (the landing's check for a `check` on the declared command); for `compare`, two rows with identical `--saw`; a live approve for `read`, or a waiver or a profile with no approve in its place; the tick for `owner`
- [test] `--without-rows` and the switch-on of the line rule are gone, and `--without-rows` is refused as an unknown flag
- [test] a row stores the digest of its line, not its number; after the line is reworded or another inserted before it, the row counts for no line other than the text it named
- [test] `evidence --ran --saw` without `--line` is refused; a free note is still taken
- [test] a `changes` stands until a round or a new commit: an approve by another examiner after it does not clear the issue
- [test] the log keeps the whole old text of the lines when they change, and the tool can print the lines as they were at the lease
- [test] `show` prints each line's state as the design defines it, and `status` counts lines by method
- [test] `merged` notes when `--ran` matches no declared check and prints the declared ones, and a `Check (<name>):` line matches the repository's own name
- [check] the full suite passes on the merged result
- [read] an independent examiner: the code does what sections 3 and 6 of the design say about lines, methods and the gate

**Absorbs:** nothing further from the backlog.

## Piece 2: the moves

**Delivers:** the design's sections 5, 6 and 9, where an agent is told what to do: the complete brief, the examiner, `next --as`, handover, the honest exit.

**Tier:** strong. **Depends on:** piece 1.

**Lines:**

- [read] before the briefs are written, the history of the role text they replace is read and the real failure each part was the lesson of is named; `releases/6.3.0/plans/skill-lessons-kept.md` lists each lesson and where it now lives
- [test] `brief <ids>` takes every issue of one lease and prints complete text for the worker: role, the goal's first paragraph, the parent's purpose, lines with methods, branch and worktree from the lease and git, the loop root, the script's absolute path, the rules that reach it, at most three "you do not" lines, each command with every known value filled, and what it must report; a lease carrying several tiers takes the highest; a takeover's brief says the tree may be dirty
- [test] the same for the examiner with `--role reviewer`: the changes to the lines since the lease, the depth and the tier, the six steps, the proof rows as commands to re-run, the `Assumed:` notes, the previous findings after a round, and neither the worker's report nor any other free note
- [test] `brief --role merger` prints the merger's whole procedure, including the three cases of a red check
- [test] depth is computed from the lines as the table of section 6 says, the deeper of as at the lease and as now, for every row of that table
- [test] `next --as --json` gives each raise-move its role, default model, branch and the command that prints its brief
- [test] after the round limit `next --as` shows a takeover as due, with the command that raises it, until one is recorded
- [test] among moves of equal idleness and hold-up, `next --as` lists merge before review before rework before a new start
- [test] `next --as` does not offer a lease for an issue with no line
- [test] a review is offered for a branch only when every issue on it has the worker's rows for its `test`, `compare` and stated `check` lines
- [test] a handover of one issue of a lease is refused, ending with the form that moves the whole lease
- [test] `ask --kind stuck --issue <id> --by <holder>` lands on the director of the issue's slice, on the jarl with no slice, and on the owner when the asker is the director
- [test] `new` notes an empty Why and a `light` issue with a `read` line
- [test] the in-place gate reads git without a hook's variables when a Repo is a name (210), and the NO PROOF note prints its command apart from its colon (223)
- [test] `status` prints one count per stage
- [test] a goal line `Merger (<slice>): <name>` is accepted; `next --as` and the merge queue give each merger the approved work of its own target branch, and a slice's integration branch lands on the feature branch as a merge with its check
- [read] the merger's brief says one writer per target branch, each merger in a worktree of its own, and that only the holder of the main checkout commits `.jarl/`
- [test] the four scenarios of issue 224 show one consistent state across `next`, `next --as` and the merge queue
- [test] the brief caps hold: worker 700 words, examiner 500, merger 900, the issue's own text not counted
- [check] the full suite passes on the merged result
- [read] an independent examiner: the briefs let an agent do its job without reading the skill

**Absorbs:** 215, 216, 217, 223, 210, 224.

## Piece 3: the removals

**Delivers:** section 12's removals in code, and the refusal of section 3.

**Tier:** strong. **Depends on:** piece 2.

**Lines:**

- [test] a loop whose `goal.md` holds no `Format: 4` line, or another number, is refused on every command, before anything else, and the refusal names `references/converting-from-6-2.md`
- [test] `init` writes the line, and no command changes it
- [test] every write at the command line and through MCP without `--by`, and a lease or verdict without `--model`, is refused, ending with the form; the library takes the writer it is given
- [check] nothing in `skills/jarl/scripts` matches `needFormat`, `needRaisable` or `FORMAT_LINES` · by: `grep -rEl "needFormat|needRaisable|FORMAT_LINES" skills/jarl/scripts` prints nothing
- [check] the frozen older readers and the tests about them are gone · by: `ls skills/jarl/scripts/tests/fixtures | grep -E "^jarl-6\." ; grep -rl "old-jarl" skills/jarl/scripts/tests` prints nothing
- [test] the log reader reads only the current shape of each line, a writer of `unrecorded` and a history row included; a line of an older shape is named by `verify`; an issue closed before a `converted` line is not re-read against the gate
- [check] composer mode is gone from the code · by: `grep -rEil "external.scheduler|composer" skills/jarl/scripts/lib skills/jarl/scripts/*.mjs` prints nothing
- [test] `record.mjs` holds one contract, `jarl-record/4`, with the older tables gone, and its contract test holds that one
- [test] the `identical-output` tag has no effect, and `compare` does its work
- [test] the four-issue cut of review units and the package size are gone: a lease is one unit, whatever it carries
- [test] the reviewer's re-run rule by tier is gone
- [test] the "grew after the lease" mark is gone: the whole old text kept in the log does its work
- [check] the full suite passes on the merged result
- [read] an independent examiner: what went is what section 12 says went, and nothing else

**Absorbs:** 149 in part (`--model` required).

## Piece 4: the skill rewritten, with the conversion file

**Delivers:** section 13, and the file named by piece 3's refusal.

**Tier:** strong. **Depends on:** piece 3; its first line may start earlier.

**Lines:**

- [read] before any part over 200 words leaves the skill, its history is read and the real failure it was the lesson of is named, added to `releases/6.3.0/plans/skill-lessons-kept.md` with where it now lives
- [read] `SKILL.md` and a director's reference hold what section 13 says a director reads, and a raised agent is told it needs only its brief
- [read] `skills/jarl/references/converting-from-6-2.md` describes, shape by shape, what a 6.2.0 loop holds and what each becomes, including what this loop holds as a driver older than 6.2.0 wrote it: keys generated, `unrecorded` writers, history rows, the `converted` line, the `Format: 4` line, and `Check (JarlSkill):` style lines; an agent can convert a loop from it alone
- [check] the word budgets per role hold by a test: worker, examiner, merger and director as section 13 gives them
- [check] the words of section 13 are gone · by: the budget test counts the 088 set at no more than 5,000 words
- [read] one director's reference says each thing once: shapes (209), committing early, same or fresh worker, when to add a slice (218), first moves (219), the sentence on a dead merger (220), the recipe for restarting a dead director
- [read] section 12 of the design has its home as a maintainer's document no agent reads
- [read] the help and the skill agree, the top-level help prints less than today (149), and the refusal and help texts of 221 and 222 say what the tool does
- [read] "What Jarl will not grow" gives each exclusion its own reason and names no absent tool
- [check] the full suite passes on the merged result
- [read] an independent examiner: an agent given only the rewritten skill can direct a loop, and no lesson was lost

**Absorbs:** 088, 209, 218, 219, 220, 149 (the rest), 221, 222.

## Piece 5: this loop and Althing moved to the new Jarl

**Delivers:** the loop and `workspace/` on the tool they ship with.

**Tier:** strong. **Depends on:** piece 4.

**Lines:**

- [check] an agent converts `releases/6.3.0/.jarl` following the conversion file and nothing else, and `verify` is clean · by: `jarl verify --root releases/6.3.0`
- [read] the conversion lost nothing: issue, ruling and evidence counts match, and a sample of 20 issues reads the same
- [check] `ws` drives the new Jarl with the commands of 6.3.0, and the workspace's own tests pass · by: `npm test`
- [read] AGENTS.md, the skills `directing-a-release-loop` and `releasing-the-family` and the briefs in `releases/6.3.0/briefs/` say what the new Jarl does, the driver pin in the release's manifest points at the new Jarl, and the rails accept a converted loop
- [read] the contracts page names `jarl-record/4` (155), and `ws status` reads the counts of a loop with a profile (207)
- [read] the canon's sentence on Jarl says what section 15 of the design says, by the canon's own procedure
- [check] the gate passes · by: `yg check && npm test`

**Absorbs:** 132, 115, 161, 207, 155.

## Piece 6: the proof

**Delivers:** the design's section 16 made real.

**Tier:** strong. **Depends on:** piece 5.

**Lines:**

- [test] the six end-to-end scenarios of 076 are scripted and pass
- [read] `releases/6.3.0/plans/blind-tests.md` is updated: the commands of 6.3.0, a raised agent is given only its brief, and a coordinator trigger scenario is added. The runs of 076 are done as it says, with light and mid agents, one failure of a check being an issue
- [read] the cold-start drill: a fresh agent given only the record of this loop answers a fixed list of questions about its state, scored against known answers, and a wrong answer is filed
- [test] every rule of the design has a test that fails without it: a table in `skills/jarl/scripts/tests/` lists each rule of sections 3 and 6 and the name of its test, the table fails when a named test is missing, and the red run of each with its guard removed on a scratch copy is a recorded row
- [read] an independent examiner: the code does what the design says, section by section
- [check] the full suite passes on the merged result

**Absorbs:** 076.


## Piece 7: the release, on the owner's word

**Delivers:** 6.3.0 published.

**Tier:** strong, for what the release procedure gives an agent. **Depends on:** piece 6.

**Lines:**

- [check] the release procedure's gates pass on the exact commits · by: the skill `releasing-the-family`
- [read] the commits that carry an agent attribution trailer are dealt with as he rules (166)
- [read] the family sections of the READMEs follow the canon (193)
- [owner] the blind runs have passed and he says this is it · material: the report of piece 6 and the report of the loop · check: is this it
- [owner] the tag, the push and the publication · material: the release checklist · check: go

**Absorbs:** 001, 166, 193.

## Every issue not closed

| Issue | Disposition | Reason |
|---|---|---|
| 001 | kept, piece 7 | the release issue |
| 024 | dropped | an order or a finder across loops is left out (design, section 14): no case |
| 027 | kept, deferred | `only-jarl-now`; not part of this release |
| 064 | dropped | the view it belonged to is out |
| 067 | dropped | the measure it belonged to is out |
| 072 | dropped | the measure it belonged to is out |
| 076 | absorbed, piece 6 | the blind runs |
| 088 | absorbed, piece 4 | the budget, with new numbers |
| 115 | absorbed, piece 5 | AGENTS.md when the driver moves |
| 126 | dropped | names Horde; it is not to be taken into account |
| 127 | dropped | names Horde; it is not to be taken into account |
| 132 | absorbed, piece 5 | the workspace and its guard move with the loop |
| 149 | absorbed, pieces 3 and 4 | `--model` required, the help cut |
| 155 | absorbed, piece 5 | the contracts page follows the current format |
| 161 | absorbed, piece 5 | undated lines are fixed by the conversion |
| 166 | kept, piece 7 | the owner's word on published history |
| 193 | kept, piece 7 | the canon sentence on READMEs |
| 206 | kept, lands first | in flight |
| 207 | absorbed, piece 5 | `ws status` moves with the workspace |
| 209 | absorbed, piece 4 | words on shapes; its number is replaced by the lease |
| 210 | absorbed, piece 2 | the in-place gate, a small bug near that work |
| 211 | kept, lands first | in flight |
| 212 | kept, lands first | in flight |
| 213 | kept, lands first | in flight |
| 215 | absorbed, piece 2 | takeover due |
| 216 | absorbed, piece 2 | handover of a whole lease |
| 217 | absorbed, piece 2 | the complete brief |
| 218 | absorbed, piece 4 | the words it asks for |
| 219 | absorbed, piece 4 | first moves |
| 220 | absorbed, piece 4 | answered: known limitation and one sentence |
| 221 | absorbed, piece 4 | a refusal's wording |
| 222 | absorbed, piece 4 | the help text of `decide` |
| 223 | absorbed, piece 2 | the brief's commands and a note's form |
| 224 | absorbed, piece 2 | consistent next and queue views |
