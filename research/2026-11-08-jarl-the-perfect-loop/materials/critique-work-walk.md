# Critique of the Jarl 6.3.0 work plan against its design

I read both documents, the rulings and the skill at a6dcbc3. I also probed a scratch copy, since removed. I did not run the suite. The last recorded full run counted 1,744 tests, more than the 1,300 assumed.

## Critical

**C1. Piece 3 and piece 5 cannot both hold (design 3; work, pieces 1, 3, 5).**
- Piece 3 reads only "the current shape", which the design defines as a key and a writer in fixed places.
- The real log has 2,758 lines, with no keys and no writers. Its 1,191 row lines name no acceptance line, and piece 1 refuses such a row.
- `verify` comes back clean only if the conversion invents writers and line attributions.
- Fix: define a fixed value for history (writer `unrecorded`, a row shape that counts for no line) and test it.
- "A line a conversion left unmarked reads as `read`" has no line in any piece, so the 32 unfinished issues have no defined reading.

**C2. Mandatory `--by` is impossible at piece 1.**
- I ran it: a loop whose profile names an external scheduler refuses `--by` below format 3. Piece 1 also refuses its absence.
- 22 test files use such profiles, and composer mode survives until piece 3, so piece 1's suite line cannot pass.
- "In one place" is also wrong. The tests make about 550 direct library writes.
- `setTags`, `setPriority`, `setFiles`, `setSource`, `addRound`, `answer` and `appendLog` have no parameter for a writer.
- Fix: move this line to piece 3 and decide the library's writer parameter.
- Marks, `--line` and leases also break tests helpers do not reach: 274 acceptance sites, about 400 `--ran` sites, and most filings, which carry no line. Name this work in piece 1.

**C3. The record library contract does not survive piece 3.**
- `FORMAT_LINES` sits in the frozen, fingerprinted tables of `jarl-record/2` and `/3`.
- Piece 3's grep forces their removal, while `record.mjs` and its contract test promise every listed version stays.
- Piece 1 already drops the `without-rows` option and changes what `evidenceRows` returns.
- "Does what its contract page says" is circular, and the design never mentions the library. `family/contracts.md` records no family consumer.
- Fix: a ruling for one contract, `jarl-record/4`, or remove the library. Issue 155's "earlier tables are kept" must change with it.

## Important

1. **Marker undefined.** Neither document gives its number or place. Today it is `format` in `profile.json`, and a first `new` already writes 3. Keep 3, and 6.2.0 loops pass the refusal.
2. **Piece 5 against the rails.**
   - `rails/loop.mjs` refuses `profile.json` under a release loop.
   - `rails/manifest.mjs` requires a driver pin, so "the driver pin is gone" fails. Repoint it, or change the rail.
   - The architecture file says this loop is "never by hand". Changing that needs the owner's word.
3. **Piece 3's greps.**
   - The composer grep hits `SKILL.md`, `jarl.md`, `commands.md`, `profile.md` and `record.md`, so it depends on piece 4.
   - It misses "external scheduler" with a space.
   - The `old-jarl` grep passes with the frozen readers still present, because those files do not contain the string.
4. **Piece 2 deadlock.** "A review is offered only when every issue has its proof" never fires if read literally, because a declared `check` is proved at landing and a `read` line by the approve. Name the methods that count.
5. **Lessons check comes too late.** Piece 2's caps decide what survives from 5,631 words of role text. The lessons check runs at piece 3 or 4. Do it before piece 2.
6. **The re-run leaves no trace.**
   - Design 3 says a row does not close a line alone because the examiner re-runs it.
   - The gate counts a typed row plus any approve, so the record cannot show a re-run happened.
   - Have the examiner record each re-run, or state the gap and exempt it from piece 6's "every rule has a test".
7. **Examiners per diff.** Design 6 gives a diff over about 400 lines more than one examiner. The work file and a-027 say one per piece. Piece 1 will exceed 400.
8. **Remains of the narrowed design.**
   - `compare`'s "same digest" has no source now the tool runs nothing. Piece 1 asks for one row, the design for two, and piece 3's "does its work" is undefined. Say two rows with identical `--saw`.
   - Also stale: section 6 "facts to check"; section 8 "the owner's digest reads them all"; section 9 "his digest waits"; section 15 "typed rows only".
9. **Design behaviour with no line.**
   - Section 4: a multi-tier lease runs at the highest (not in the code).
   - Sections 5 and 7: "what it must report" and the three "you do not" lines.
   - Section 6: the 400-line rule and the re-examination brief.
   - Section 9: the dirty-tree note and the host recipe.
   - Section 10: the first line and ratifications in one batch.
   - Section 11: owner questions per merged issue, and follow-ups by `Where:` (today's metric reads `Found by`).
   - Section 11: the register's new home.
   - Unspecified: how `read` lines interact with profile `approve: none` and waivers; `import`, which writes an unmarked "Proposed" line.
10. **Absorbed with no line.** 210; 223's colon; 221; 155, which also needs Yggdrasil's contracts page; 207's nested counts. Issue 076 requires six scripted tests, and I found none in the suite. Piece 6 names only the live runs.
11. **Blind tests contradict the design.** `blind-tests.md` gives raised agents the skill. The design gives them only a brief. Updating "the commands" does not fix that.
12. **Rule for "worse".**
    - It computes by hand: 979k + 1,057k = 2.04M, 51.9%, and 13 parsed lines.
    - Condition 2 contradicts design 3, which says the examiner's share "will not fall".
    - Condition 4 has no window, because the stop comes before piece 2.
    - "Tokens" is undefined, for example cache reads. One line also held four demands (204), and piece 1 runs strong models on work done earlier on lighter ones.
13. **Three-arm comparison.**
    - Arm 1's default is arm 2 plus the record, so it cannot confirm section 4's default. Today's numbers are the comparison that can.
    - The readings omit the likeliest result: Jarl finds more and costs more.
    - A replay may never recreate the three defects. Then every arm scores zero and reading 1 fires. Seed the defective branches.
    - Fix the model per arm, and give all arms the same lines.
14. **126 and 127.** "Do not take Horde into account" concerned the design. These issues remove false present-tense claims. Defer 126 outside a Jarl-only release, and put 127 in piece 5.

## Minor

- Reasons do not fit: 072 is a `verify` gap, not a measure; 067 and 064 name a measure and a view the design never had; 024's "no case" contradicts its field report.
- 161's acceptance forbids a hand edit of the log, which conversion is.
- `Check (jarl):` would not match the tool's repository name, `JarlSkill`, and the banner would stay at zero.
- The cold-start drill and the "will not grow" line have no design section.
- Piece 6's mutation table is not a `test` the method can hold, and "rule" is uncounted.
- The goal's eight lines appear only in the work file, and no piece adds them to `goal.md`.
- "Absorbs" never says how an absorbed issue closes.
- Moving the loop at piece 5 departs from a-028's wording and section 15. Note it for ratification.
- The 4,500 limit has no slack over estimates written "about".

## What survives

- The issue table holds all 33 unfinished issues.
- Each of the eight goal lines has a piece.
- Piece 1's unconditional new shapes are harmless: the first `new` already raises a loop to format 3, the shapes are outside `FORMAT_LINES`, and the real loop stays on the pinned driver.
- Coordinators by need, the examiner's depth from methods, and the removals in section 12 hold together.
- The chain stands without witnessed proof, provided item 6 is settled.
- The order 1 to 7 stands once C2 moves one line and C1, C3 and the marker are decided before piece 3.
