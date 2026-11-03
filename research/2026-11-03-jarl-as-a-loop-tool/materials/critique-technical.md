# Critique of the model, draft 2: technical soundness

**Question:** Is the model in report.md technically sound against Jarl at JarlSkill 71ebc5b (release/6.2.1 after the split into skills/jarl/scripts/lib/)? Are the lines marked built true there, can the ball be derived from the record, does "work until nothing is on you" run on real hosts, do slices hold under concurrency, is the id design sound, and are the five scenarios testable without models?

**Method:** I extracted skills/jarl at 71ebc5b with git archive into Althing's ignored .cache/ and changed nothing in JarlSkill. I read the modules under scripts/lib/ that each claim rests on (commands, evidence, rounds, review, loop, log, journal, ids, profile, resume), jarl-mcp.mjs, jarl.mjs's usage and flag tables, and references/jarl.md, record.md and composers.md. I ran the CLI only on scratch git repositories created under .cache/ and on a copy of the 6.2.0 loop's .jarl placed there: a double lease and a lease on a held file in one checkout, two branches of one checkout that each file an issue, two clones that lease the same issue and are merged, a per-level model line, and timings on the 6.2.0 copy. I did not run Jarl's test suite and wrote nothing to releases/*/.jarl. I also read Horde's vendored Jarl (its pin and its reader) and counted the issues with no declared files in the 6.2.0 and 6.3.0 loops.

**Status:** done

**Conclusion:** Most lines marked built are true at 71ebc5b; one is false (status already takes `--tag`), one overstates (file holding is an offer by `next`, not a guard), and two mix built and proposed. The model's weak points are where it meets concurrency and hosts, not the derivation itself: the in-flight half of the ball is already derived today (the in-flight marks), but `set in-progress` refuses neither a second lease nor a held file, so two coordinators in one checkout collide on their first race, and the rule "return when nothing is on you" makes a coordinator return the moment it has raised its workers, with no stated path that wakes it again. A review lease is far from the only new state: I count eleven new kinds of entry, several of which change the log's grammar and so the record format and Horde's contract. Per-driver number blocks do not cover two branches of one checkout (reproduced), need an online reservation step, and are invisible to older readers; the deeper defect is that a log line names an issue by number only, so any duplicate moved before a merge is mixed beyond repair whatever the allocation. What breaks first in a live run of scenario 1 is the read-then-lease race between two coordinators, before any second clone is involved. The write lock itself is not the bottleneck (writes hold it well under a second on a 528-issue record). Counts: 2 Critical, 10 Important, 6 Minor.

## What was checked and holds

- Section 1, root resolution: `root`, else `JARL_ROOT` (absolute only), else the loop found from the server's working directory, never a subdirectory (scripts/jarl-mcp.mjs:176-191; references/commands.md:23). True.
- Section 2: worker, reviewer, merger and reeve exist as roles in the guidance (references/jarl.md:204-236); a `Coordinators:` goal line names directors (scripts/lib/journal.mjs:166, :181; scripts/lib/loop.mjs:141-157); a self-approve is refused by name (scripts/lib/review.mjs:65-71); a coordinator's approve is kind `coordinator`, not fresh (loop.mjs:146-152). True.
- Section 3: the takeover after three rounds (scripts/lib/base.mjs:12, scripts/lib/rounds.mjs:20-32), `ask` and its kinds (base.mjs:11), After, `decide --settles` (scripts/lib/questions.mjs:253-259). True. Staleness: `--stale-hours` takes any positive number (rounds.mjs:202-206), reads the lease's Since and branch commits only (rounds.mjs:243-269), and resume calls status with no flags, so always six hours (scripts/lib/resume.mjs:43). True.
- Section 4: `next` holds back an issue whose files or resources an in-progress issue holds, loop-wide (scripts/lib/evidence.mjs:210-240); `list --tag` filters. True as stated for `next`'s offer; see C1 for what it does not guard.
- Section 6: `round` prints a takeover block on the third round (rounds.mjs:26-31); `ws brief <role> --issue <id>` exists in Althing (`node workspace/ws.mjs brief` prints its usage). True.
- Section 7: model names are stored as given (scripts/lib/models.mjs:26-31). True.
- Section 8: the write lock serialises writers of one checkout (scripts/lib/lock.mjs); two clones give two issues one number (reproduced in the report's material). True, and wider: see I5.
- Timings on a copy of the 6.2.0 record (528 issues): `new` 0.41 s, `status` 0.63 s, `next` 0.26 s, `resume` 3.17 s (lock-free). Lock contention is not where many drivers break.

## Critical

### C1. Two slices do collide on code: `next` offers, nothing refuses (sections 4, 3; scenario 1)

What is wrong: the report marks "Two slices never collide on code" as built, citing `next`. `next` is a read with no lock (it runs inside resume, "read-only, no lock", resume.mjs:33), and the lease that follows, `set <ids> in-progress`, re-checks nothing: scripts/lib/commands.mjs:477-530 writes Status, Branch, Worker and Since over whatever the issue holds, with no test of an existing lease, of files held by another lease, or of resources. Run on a scratch loop at 71ebc5b, two issues both declaring `f.txt`:

```
set 1 in-progress "A" --branch jarl/001-one --worker wA      → 1 → in-progress · jarl/001-one · wA
set 1 in-progress "B" --branch jarl/001-one-b --worker wB    → 1 → in-progress · jarl/001-one-b · wB
set 2 in-progress "held file" --branch jarl/002-two --worker wC → 2 → in-progress · jarl/002-two · wC
```

All three were accepted. The second silently replaced the first lease (worker wA keeps working on a branch the record no longer names), and the third leased a file another lease holds. Two coordinators that each read `next` before either leases will both take the same ready issue or two issues sharing a file; the lock only orders their writes. The guarantee is also vacuous for most real issues: `next` holds by declared files only, and 75 of the 77 issues of the 6.3.0 loop and 123 of the 528 of 6.2.0 declare no files.

Change: under the lock, a move into a status that holds the claim re-reads the record and refuses (a) an issue that already holds a lease unless the call says `--takeover "<why>"`, and (b) a file or resource another lease holds, naming the holder and its slice. Since section 2 wants notes rather than refusals for level boundaries, say explicitly that this one is a refusal at the level of the record (it prevents a false record, like the self-approve). An issue with no declared Files or Resources is not assignable to a slice while another slice is active in the same repository (or holds the repository as a whole). Scenario 1 gains a race step: both coordinators read `next`, both try to lease, the second is refused.

### C2. "Work until nothing is on you, then return" makes a coordinator return the moment it raises its workers, and nothing wakes it (one-page model, sections 2, 5, 9)

What is wrong: by the ball table, a running lease is on its worker and a raised review on its reviewer. A coordinator that has leased and raised its workers therefore has nothing of its own and, by the rule, returns one line. The model never says who is woken when that worker finishes. On the hosts named in the brief:

- A host whose raised agents end with their reply and cannot be resumed: the coordinator is gone; its worker's final line reaches whoever raised the coordinator, if anyone.
- A host whose raised agents can be resumed (Claude Code's Agent tool with an agent id, or any host that accepts further input to a raised agent while its parent lives): the resumer must be an agent that is still alive, and the model names none.
- A host whose raised agents cannot raise agents: the relay (references/jarl.md:230-236) has the coordinator write each brief to a file and the jarl spawn and forward each worker's one line back to it, and a second round is `resume <id> brief=<path>`. That relay presumes a long-lived reeve that stays alive to receive forwarded lines, which the "return when nothing is on you" rule contradicts; and under the relay every "raise a worker", "raise a reviewer" and "raise the merger" row of the ball table is really the jarl's move, not the coordinator's.

In all three cases the only party that is always alive is the top session, which then fields every worker's completion and decides which coordinator to wake: the per-move cost the levels were meant to take off it (about five moves per unit, Background experiment 2).

Change: separate waiting from returning. A level waits (in the foreground, where the host lets it) on agents it raised itself, and returns only when the ball is on someone it did not raise: the owner, the jarl, another slice, an outside person. Add a wake rule: whoever receives a raised agent's last line runs `next --as <that agent's raiser>` and resumes or re-raises the raiser only when that list is not empty; a re-raised coordinator starts from its brief (which scenario 2 already demands). Under the relay, the ball table names the jarl for every raise row, and `next --as jarl` lists the pending spawn lines. Then state per host, as a checked fact in the report, whether a raised agent survives its parent's return and whether its children's completion reaches anyone; I did not verify this for any host, and the model rests on it.

## Important

### I1. A review lease is not the only new state the ball needs, and the built half is not credited (section 3, section 12)

What is wrong: the in-flight half of the ball is already derived at 71ebc5b: status and resume mark each in-flight issue `no-rows`, `rows-no-verdict`, `changes-requested`, `approved`, `approved-not-fresh`, `merged` or `merged-ci`, each with its next move in words (evidence.mjs:345-372). What is missing there is the holder's name, not the derivation. Against that, the model needs much more new state than a review lease. Counting from sections 2 to 8: (1) a review lease; (2) a merge lease (I2); (3) a slice label per issue; (4) the levels and coordinators with their slices in the goal; (5) the writer on every write; (6) an addressee on a question (ASK_KINDS, base.mjs:11, has kinds, no addressee); (7) a promise kind; (8) an external wait kind with a time; (9) an unchecked mark on notes; (10) an owner-only acceptance mark; (11) a liveness threshold in the goal; and, by section 8, number blocks in the goal. Several of these change the log's grammar or the goal's machine lines (I6, I10).

Change: replace the open point with a table of the new state: each entry, the file and the log line that hold it, the command that writes it, and whether an older reader would misread it in silence (and so whether it raises the record format). Cite the in-flight marks as the built base of the ball.

### I2. One merger per coordinator breaks the sole-committer rule (sections 2, 3)

What is wrong: the level table gives each coordinator "merges via its merger" and the ball table puts "approve, not merged" on "the coordinator's merger". references/jarl.md:216-222 says the main checkout has exactly one writer at a time, and that while a merger's report is outstanding "no second merger is raised into it". With two slices, two coordinators each raise a merger into one main checkout. Nothing in the record says a merger is running, so neither coordinator can see the other's.

Change: one loop-wide merge lease (holder, since, threshold) and one merge queue across slices. The row "approve, not merged" goes to the holder of the merge lease when one is held, else to the jarl or a coordinator named in the goal as the loop's merge owner. Scenario 1 approves one unit in each slice at once and asserts that only one merge lease is granted.

### I3. The ball is put on agents that may no longer exist (section 3)

What is wrong: the rows "changes verdict → the worker", "review raised → that reviewer" and "promise → the agent that made it" name agent instances. On a host whose raised agents end with their reply, the worker that got `changes` is gone; the move that matters is the coordinator's (run `round`, resume or re-raise the worker). The record cannot tell whether an agent is alive, so a ball on a dead worker shows only when the liveness threshold passes, which is exactly the stall the model wants to make visible in minutes. A promise made by a worker that has returned is held by nobody.

Change: a holder is always a level that persists: the owner, the jarl, a named coordinator, a named outside person. Workers and reviewers appear as the doer of a unit, with their liveness, under that holder. After `changes`, the ball is the coordinator's until a `round` line or a new lease line follows. A promise is held by the level of the agent that wrote it.

### I4. A double lease across clones cannot be detected as specified, and verify is clean on a conflicted file (section 8, scenario 4)

What is wrong: two clones of a committed loop each leased issue 1 (`set 1 in-progress "by c1" …`, `"by c2" …`), committed, and were merged into the origin. Git reported `CONFLICT (content): Merge conflict in .jarl/issues/1-one.md` and auto-merged log.md by union (.jarl/.gitattributes: `/log.md merge=union`). The log then held both lease lines, and during the conflict `resume` showed only the last one (`1 one · branch jarl/1-c2 · worker w-c2`), while `verify` printed "clean — every line of the record is placed, and nothing disagrees" with conflict markers in the issue file. The union order is the order of the merge, not of time, so which lease wins depends on who merges whom. Two lease lines with no move out between them are also the legal takeover idiom in one checkout (C1's run), so a reader cannot tell a cross-clone double lease from a takeover.

Change: a lease line names its writer and clone (with I6's format raise); detection is two leases with no move out between them by different writers where neither says `--takeover`; `verify` refuses an issue file that holds git conflict markers. Scenario 4 states how the git conflict in the header is resolved before the double lease is asserted, and which side's lease the record keeps.

### I5. Per-driver number blocks do not make numbers unique, and the log cannot be repaired after the fact (section 8, section 12)

What is wrong, in the order it bites:

- Two branches of one checkout with one driver take the same number, and blocks are per driver. Reproduced at 71ebc5b: on a scratch loop holding issue 1, a branch `side` and `main` each ran `new`; both printed `filed 2`, the merge kept `2-on-main.md` and `2-on-side.md`, and verify printed "clean". The numbering reads this checkout and its worktrees (commands.mjs:166-170, :210-214), not other branches.
- The reservation is "recorded once in the committed goal", so a clone must commit, push and the other clone pull before either files: an online step on every new driver. Two clones reserving at once edit goal.md, which has no merge driver (only log.md and decisions.md have one), so the reservations meet as a text conflict or, if written in different places, merge silently into an overlap.
- "A reservation made twice is caught by the detection 031 adds": 031 detects two issue files with one number. By the time both exist after a merge, each clone's moves of that number have been logged and the union merge has mixed them, because a log line names its issue by number only (scripts/lib/log.mjs:37-38, `LEADING_ID`). 031's refusal stops further damage; it cannot unmix the log.
- An older reader ignores goal lines it does not know (journal.mjs:166 reads only Check, Model and Coordinators) and files at the highest number plus one, inside someone's block. By the format rule of references/record.md:128, the first block line must raise the record format.
- Room: the 6.2.0 loop used 528 numbers. Three digits leave a few blocks above an existing loop's numbers, and 1000 or more raises the format (scripts/lib/ids.mjs:25).
- A worker that files a finding, and a session with no configured name, have no block.
- record.md:46 says issues are "numbered in filing order from 1"; with blocks that stops being true.

Against the alternatives: a suffix per clone breaks the one id grammar `ID_SRC = '\\d+'` (ids.mjs:11) that `expandIds`, branch names (`branchIssueId`), `idsNamed`, After fields and the log all read, so it is jarl-record/2 and a new form of every id cited in commits and Althing's text. Renumbering at merge is impossible today once a duplicate has moved, because the moves cannot be told apart; it becomes possible the moment a log line can name the issue unambiguously.

Change: fix the record, not only the allocator. Give every issue a short collision-proof key at filing (the filing stamp and a few random characters), written in its header, on its `filed` line and on every log line about it, under one format raise. Numbers stay the readable id. Then: allocation takes the highest number over every local and remote-tracking ref's `.jarl/issues` (`git for-each-ref` and `git ls-tree`), which makes collisions rare even across branches; 031 refuses moves while a number is shared; a `renumber <file> <new>` repairs a duplicate at merge, the key telling its moves apart. Blocks stay only for 022's series use, as an option. Existing loops read their unkeyed lines as today and gain keys on the first write after the raise. Scenario 4 covers both two clones and two branches of one checkout.

### I6. The writer's name: a server default mislabels every raised agent, and the obvious log position breaks older readers (sections 2, 8)

What is wrong: section 2 has a write name its writer "(`--as`, or the session's configured name)". Where raised agents call the parent's MCP server (as Claude Code's subagents do with the parent's configured servers), a name configured in the server labels the worker's evidence and the reviewer's verdict with the coordinator's or the jarl's name. A verdict under a name on the goal's `Coordinators:` line, or `jarl`, is kind `coordinator` (loop.mjs:146-152), not fresh, so a real fresh review would stop counting. On the log side, a lease line is read by position: the lease fields must reach the end of the line (log.mjs:39-71). A trailing `· as <name>` segment makes an older reader find no lease in the line, so that worker drops out of the self set built from lease lines (loop.mjs:160-166), and a self-approve by that worker would read as fresh in that reader.

Change: no server-wide default name; the writer is named per call, and an unnamed write is shown as unnamed. The writer goes into the log under a format raise (one for all of I1's grammar changes), in a fixed position the new reader parses and an older reader refuses.

### I7. A built line is false: `status` already filters by tag (section 4, Background "The owner's shape")

What is wrong: the report says "`next`, `status` and `resume` take no filter" and "`next`, `resume` and `status` take no slice (only `list --tag` filters by tag)". At 71ebc5b, `status --tag <t>` "computes every part of status over the issues carrying that tag only" (scripts/jarl.mjs:237-238; evidence.mjs:279-318, through `scopedLoop`). Its questions are scoped by issue: an open question with no issue drops out of a tagged view (evidence.mjs:295).

Change: correct both sentences. Build slice views on `status --tag`'s scoping, and settle its question rule for slices: a coordinator's question to the jarl names its slice or an issue, or it disappears from the slice's own view.

### I8. A slice view of `next` either invents holds or hides collisions (section 4)

What is wrong: `next` lets a ready issue earlier in its list take its files for the rest of the list (evidence.mjs:213-214, :239-240). Filter that list by slice after computing it, and a ready, unleased issue of slice A holds an issue of slice B: B sees "held by slice A, issue N" for work nobody has started, and past the threshold the jarl gets a false escalation. Filter before, and both slices are offered issues sharing a file, which C1 then lets both lease.

Change: across slices only leases hold; the in-list reservation applies within the asker's slice. C1's refusal is the guard either way.

### I9. Scenarios 2 and 3 are not testable without models as written, and "red at 71ebc5b" is vacuous (section 10)

What is wrong:

- Scenario 3 needs time to pass. Stamps come from the wall clock, to the minute (scripts/lib/where.mjs:38, `new Date().toISOString()…slice(0, 16)`); the only environment seams are `JARL_GH` and `JARL_LOCK_WAIT_MS`. A test must sleep past a threshold of at least a minute (and straddle a minute boundary) or forge stamps.
- Scenario 2's "nothing it needs is missing" has no oracle. What a no-model test can assert is that entries seeded into the record (a standing rule, a promise, an open question, a review in flight) appear in `brief --role coordinator --slice A` and that slice B's do not. The real failure the scenario is about, things never recorded, cannot be tested without models.
- "Red on 71ebc5b": every proposed command and flag (`next --as`, `brief`, `ask --to`) is unknown there, so each test is red on a usage error, which proves nothing.

Change: add a clock seam to 076 (an environment variable read by `stamp()` and by the views' "now", documented as test-only). Rewrite scenario 2 with its seeded oracle and say what it cannot cover. Require each scenario to be red at 71ebc5b on a behavioural assertion that runs with existing commands where one exists: the double lease accepted (C1), two issues numbered 2 on two branches (I5), verify clean on a conflicted file (I4), a stale lease not shown at 30 minutes in resume.

### I10. The format and contract consequences are not stated, and Horde already cannot read a new loop (sections 8, 9)

What is wrong: Horde vendors Jarl v6.1.0 (Horde's scripts/vendor/jarl.pin.json: `"ref": "v6.1.0"`, `"api": "jarl-record/1"`), whose reader knows record format 1 only (its vendored jarl-lib.mjs:276, `RECORD_FORMATS = [1]`) and three-digit ids (:547, :573, :1711). The 71ebc5b CLI writes plain numbers, and a plain number under 100 raises the format (ids.mjs:25): a fresh scratch loop's first `new` wrote `.jarl/profile.json` with `"format": 2`, which that Horde reader refuses. So "its record is a Jarl loop" holds today only for loops Horde writes itself. The model then adds, on top, a writer segment, review and merge lease lines, issue keys or blocks, a question addressee, a slice field and new goal lines, each of which an older reader misreads or ignores, and at least some of which change `record.mjs`'s exports (so `RECORD_API` moves to jarl-record/2, references/composers.md:14).

Change: in sections 8 and 9, list each new entry with whether it raises the format; plan one raise (format 3) for all of them in 6.3.0, the jarl-record/2 contract, and an issue to re-vendor Jarl into Horde in the same release. Section 9's line with Horde should say that Horde reads only what its vendored copy knows.

## Minor

### M1. `Model (jarl)` collides with the tier grammar (section 7)

`goal --set "Model (jarl): opus"` on a scratch loop was refused: "the profile declares no tier jarl: its tiers are light, standard, strong". A Model line's qualifier is a tier (journal.mjs:166, :183-186), and tiers carry the rank. Change: a distinct label for a level's model (for example `Level model (jarl):`), outside the tier rank, under the same format raise.

### M2. The Settles row gives an issue a second holder (section 3)

`decide --settles` writes the ruling into the issues it settles (questions.mjs:253-259). A settled issue that is not done is the normal case while its work runs, and it already has its own holder; the row would put a second ball on the jarl, against "exactly one holder". Change: drop the row, or narrow it to a ruling that names work and settles no live issue.

### M3. Liveness is per clone (section 3, scenarios 3 and 4)

A worker's rows and log lines written in another clone are invisible until merged, and its commits until fetched, so a busy worker on another machine reads as stale. Change: the liveness view says which clone and which refs it read, and scenario 3 runs in one clone only.

### M4. "Cannot be cited by a ruling" cannot be checked (section 3)

Notes have no id, and a ruling is free text, so Jarl cannot tell that a ruling cites an unchecked note. Change: give notes an addressable id, or drop the clause and keep the ball on the author.

### M5. Loop discovery needs a defined walk (section 1)

A default-mode loop is out of git (its own .gitignore ignores everything), so `git ls-files` will not list it; finding loops means walking the file tree, which in a large project crosses node_modules, worktrees under the project and vendored copies. Refusing every call in a project that has a root loop and loops in subdirectories also changes the behaviour of every existing call. Change: specify the walk and its bounds, and keep the root loop as the default when it exists, with a note listing the others.

### M6. Built and proposed are mixed in three places (section 3, Background)

The row "rule in force (built: rulings; standing brief, issue 020)" reads as if 020 were built; it is open in the 6.3.0 loop. The row "issue waiting on After (built)" is built, but its display "waits on X via N" is not (no such text in scripts/lib/; it is 069). Background experiment 1's "a self-approve is refused" holds by name only: a lone agent that reviews under any name no lease of the issue has named passes (review.mjs:65-71). Change: mark 020 and the "via" display proposed, and say the self-approve refusal compares names.
