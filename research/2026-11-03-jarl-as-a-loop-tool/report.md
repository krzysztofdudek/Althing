# Jarl as a tool for running the work loop of one or many agents: the model

Draft 3, 2026-11-03. It answers the three critiques ([materials/revision.md](materials/revision.md) answers each finding) and carries the owner's rulings of 2026-11-03 in the 6.3.0 loop. Proposed, not built, unless a line says **built**, which cites Jarl at JarlSkill 71ebc5b (release/6.2.1 after the split into `skills/jarl/scripts/lib/`). The reasoning that led here is under Background.

## In four sentences

A jarl on a strong model talks with you and shapes the backlog: what is to be done, in what order, in what pieces, and which steps you want to see yourself. It hands parts of the backlog, marked by tags, to coordinators on a medium model; each coordinator raises workers and reviewers for its part, on models chosen per task, and goes to the jarl only when something is not its to decide. Jarl tells each of them what is on them now, delivers to each the rules that concern it, and refuses to let the record say something false, such as done without anyone having looked. One agent alone uses the same loop with fewer roles.

## The model on one page

- **A loop** is one record of work for one area (a release, a repository, a topic). The record is the only memory: what is not in it does not exist after a compaction. Jarl defines no language; the user and the environment do (ruling jarl-language-agnostic).
- **Levels.** The owner (a person); the jarl (strong tier); coordinators (standard tier), each over a slice of the backlog; workers and reviewers raised per unit of work on the tier the task needs (light, standard or strong; the owner's weak, medium and strong). Strength is Jarl's existing tiers, read from the goal's model lines; models are chosen by judgment (a-001).
- **The ball.** Every open thing has one holder who must move next, always a level that persists: the owner, the jarl, a named coordinator, or a named outside person. Jarl derives holders from the record and answers one question for anyone: what is on me now, a short list, each line with the command that moves it.
- **Waiting and returning.** A level waits on the agents it raised itself and returns only when the ball is on someone it did not raise. A coordinator therefore works its slice until something needs the jarl, the owner, another slice or an outside person, and then returns one line. The jarl talks with the owner in full.
- **Going up** is an entry in the record (an escalation, a question, a finding), never a chat message someone must read to learn the state. **Coming down** is a brief Jarl assembles from the record at the moment it is asked.
- **Rules with a scope.** A rule is one sentence with whom it applies to (the loop, a role, a tag, an issue and its sub-issues, a kind, a slice, an area of files, a repository, a moment of work) and until when. Every brief carries exactly the rules that match it; Jarl ships its own role guidance as such rules.
- **The backlog is a tree.** An issue may have sub-issues; numbers stay flat; a split never loses an acceptance line of the parent.
- **The owner's checkpoints.** An acceptance line may be one only the owner ticks; it names the material to review and what to check, and done waits for it (ruling owner-sign-off-with-material).
- **Jarl records, derives, displays and refuses at the level of the record.** It never raises an agent, merges, closes or expires anything; it never pushes or fetches.

## 1. The loop, and finding it

- **Yes, a call can reach a loop in a subdirectory: every tool call takes `root`** (built: `root`, else `JARL_ROOT`, else the loop at the root of the session's project, never one below it; `scripts/jarl-mcp.mjs:176-191`).
- **Proposed:** a session names its loop once (a `use <path>` call that sets the server's default for that session; `JARL_ROOT` on the command line), so the agent does not repeat it on every call.
- **Proposed:** Jarl lists the loops under a project by a bounded walk (no `node_modules`, `.git`, worktree directories or vendored copies; a stated depth). Where the project has a root loop it stays the default and the others are named in a note; where it has none and has several below, a call that names none is refused with the list. The skill routes (which loop serves which area); the tool never guesses.

## 2. Levels, and what each may do

| Level | Tier | Starts from | May read | May write | May raise | Returns or goes up when |
|---|---|---|---|---|---|---|
| owner | a person | `next --as owner --all` | everything | answers, rulings, ticks of owner-only lines | (nobody) | (never raised) |
| jarl | strong | `resume --as jarl` | everything | the goal, issues and their order and tree, slices, rulings, rules, questions to the owner | coordinators | talks with the owner whenever the owner holds the ball or speaks |
| coordinator | standard | `brief --slice <s>` | everything; acts on its slice | leases, issues it finds (into its slice), splits into sub-issues, escalations, rounds | workers, reviewers; the loop's merger if the goal names it | the ball is on someone it did not raise |
| worker | per task | `brief <id>` | its issue and what the brief names | evidence, notes, findings filed into its coordinator's slice | nobody | its unit is proven, or blocked with the reason recorded |
| reviewer | fresh, never below the worker | `brief <id> --role reviewer` | its issue, the diff, the proof | one verdict | nobody | after the verdict |

- **Built:** workers, reviewers, a merger and one reeve exist as roles in the guidance (`references/jarl.md:204-236`); a `Coordinators:` goal line names who counts as a coordinator (`scripts/lib/loop.mjs:141-157`); a self-approve is refused by name (`scripts/lib/review.mjs:65-71`); a coordinator's approve is not fresh.
- **Proposed:** the reeve becomes the coordinator, and `Coordinators:` names each coordinator with its slice. One coordinator, or the jarl, is named `Merger:` in the goal: it alone raises the merger, one merge at a time, which keeps the sole-committer rule of `references/jarl.md:216-222` with several slices.
- **Proposed:** the writer is named per call (`--by`) where it is not today; an unnamed write is the jarl's in a loop with no coordinators and shows as unnamed otherwise; no server-wide default name (a raised agent calls its parent's server). There is no permission table by level: Jarl cannot verify who an agent is, and the protections that matter sit where the record can hold them (the done gate, fresh review, owner-only lines).
- **One agent alone** holds the jarl's, the coordinator's and the worker's rows at once. Its minimum is `init`, `new`, `next`, `evidence`, `review`, `set done`, `ask` and `decide`, with nothing new to declare. A code issue with proof and no verdict holds the ball on the owner: "start a fresh reviewer for 7, 9 and 12", one review across them where the rule of section 7 allows.

## 3. The ball

- **Built base:** `status` and `resume` already derive a mark and a next move in words for each issue in flight: no rows, rows and no verdict, changes requested, approved, approved but not fresh, merged, merged with CI (`scripts/lib/evidence.mjs:345-372`). What is missing is the holder's name and a view per holder.
- **Derivation, proposed.** Holders come from the profile's status flags (`dispatchable`, the claim, terminal) and from verdicts, questions, rulings and owner-only lines, never from status names, so a profiled loop gets the ball too. Under an external scheduler (a composer's loop) `next --as` lists only what is not scheduling and names the composer's command for the rest, as `next` does today.

| Open thing | Holder |
|---|---|
| ready issue in a slice | its coordinator; with no slice, the jarl |
| lease | its coordinator, with the worker as doer and the age of the worker's last row, log line or commit |
| proof and no verdict since | its coordinator ("raise a reviewer"), with the age; in a loop with no coordinator able to raise one, the owner |
| changes verdict | its coordinator (a round), until a round or a new lease follows; after three rounds a takeover (built) |
| approve, not merged | the goal's `Merger:` |
| issue whose sub-issues are all done | its coordinator: check the parent's own acceptance against the whole |
| owner-only acceptance line | whoever produces its material until the material exists, then the owner |
| escalation (`ask --kind escalation`) | the jarl |
| question to the owner, ratify item (built) | the owner |
| waiting on After (built) | nobody; shown as "waits on X via N", X the blocker's holder |
| promise (an issue of kind `promise`) | the level of the agent that made it |
| external wait (an issue of kind `wait`) | the named outside person; the coordinator checks it when it says |
| ruling that names work and settles no live issue | the jarl |
| rule in force | nobody |

- **One view:** `next --as <holder>` prints at most seven lines, on the owner first, then by direct dependents, each with its command, then a count of the rest; the order is a display, not a schedule. The owner's digest is `next --as owner --all`; the jarl reads `next --as jarl` and `status --slice <s>`; `status` and `resume` end with the asker's list.
- **Liveness:** one goal line sets a threshold in minutes (default 30), read by `status`, `resume` and `next --as`; past it a lease or a proof with no verdict shows on the coordinator's list with the command to act. Ages read rows, log lines and commits of this clone and the refs it has fetched, and say so. **Built:** `status --stale-hours` takes a fraction but reads commits only, and `resume` always uses six hours (`scripts/lib/rounds.mjs:202-269`, `scripts/lib/resume.mjs:43`); the flag stays as a one-call override.

## 4. Slices, and leases that hold

- **A slice is a tag `slice:<coordinator>`**, as the owner suggested; `tag` refuses a second `slice:` tag on one issue. Sub-issues inherit their parent's slice, so a slice can be a subtree. An issue a worker or reviewer files carries its coordinator's slice: the brief's filing command holds the tag.
- **Views:** `next`, `status` and `resume` take `--slice <s>`, built on the scoping `status --tag` already has (**built**: `scripts/jarl.mjs:237-238`, `scripts/lib/evidence.mjs:279-318`). An escalation names its slice or issue, so it stays in the slice's view.
- **Leases hold, under the lock (proposed, a refusal at the level of the record):** a move into a status that holds the claim re-reads the record and refuses an issue already leased unless the call names a takeover or handover with its reason (issue 008), and refuses files or resources another lease holds, naming the holder and its slice. **Built today:** `next` only offers; `set in-progress` re-checks nothing (`scripts/lib/commands.mjs:477-530`). In a loop with more than one active slice, a lease on an issue that declares no Files or Resources is refused with the command to declare them (75 of 77 issues of the 6.3.0 loop declared none when this was checked).
- Across slices only leases hold; the in-list reservation of `next` applies within the asker's slice.

## 5. Waiting, going up, coming down

- **Waiting and returning.** A level waits on agents it raised (in the foreground, or resumed where the host allows) and returns only when the ball is on someone it did not raise. The owner's word: a subagent can raise subagents on his hosts. The relay of `references/jarl.md:230-236` stays for hosts where a raised agent cannot raise agents; there every raise row's holder is the jarl.
- **Up from a worker:** findings are notes or new issues in its coordinator's slice; it ends with one line.
- **Up from a coordinator:** `ask --kind escalation`, held by the jarl, only for (a) a gap or finding outside its slice's goal, (b) a decision that is the jarl's or the owner's, (c) its slice empty or blocked by another slice, (d) a takeover that failed too. These four are a built-in rule for the coordinator role. Counts are never pushed; the jarl reads them.
- **Up from the jarl:** `ask` as built; the owner reads his digest.
- **Down:** the jarl assigns slices, rules and rules with a scope; a coordinator raises workers and reviewers with briefs.

## 6. Briefs, rules with a scope, and the owner's checkpoints

- **Briefs (proposed):** `brief <id>` (worker), `brief <id> --role reviewer` and `brief --slice <s>` (coordinator), read-only, assembled at the moment they are asked: the issue as `show` prints it, the rules that match, the findings of earlier rounds, the proof rows, links to the role reference, and the exact command that records the result. The same data goes out through the record library as an additive function, so Althing's `ws brief` and later Horde's renderer can use it instead of assembling it again. **Built:** `show` prints the record half today; the third `round` prints a takeover block (`scripts/lib/rounds.mjs:26-31`); Althing's `ws brief` renders templates beside Jarl.
- **Rules with a scope (proposed, the owner's request):** a ruling may carry an `Applies to:` line with one or more selectors joined by "and": the loop, a role (jarl, coordinator, worker, reviewer, merger, takeover), a tag, an issue and its sub-issues, a kind, a slice, an area of files, a repository, a moment (filing, start, review, every round, merge, done, close). Each brief and `resume --as` prints the rules that match, whole; nothing else. A rule ends when revoked, at a date, or when an issue closes. Issue 020's standing brief is the rule whose scope is the loop.
- **Self-correcting:** an agent that learns a lesson proposes a rule; the ball goes to the jarl, or to the owner when the rule is his; once accepted it reaches every matching brief. At close, the loop's rules are offered for promotion: carried into the next loop, written into the repository's agent instructions, written into Yggdrasil's law when they are about code (built for area rulings: `references/jarl.md`, "Rulings about an area"), or dropped.
- **Built-in rules:** Jarl ships its role guidance as rules with a scope, quoted from the role references, which stay their single source. Examples: reviewer, every round: re-check every acceptance line, not only the earlier findings (the field example in 058's evidence); reviewer, on work done on the light tier: re-run each command a proof row names (a light worker in this loop recorded a row for a command it never ran); reviewer, on format, contract or visual work: a tier above the worker (the field report's rule, F-I4); coordinator: the four reasons to escalate; coordinator: pull before leasing and push right after (two-machines-caught-at-merge); coordinator: one shared review only over issues that are one contract or one screen, at most four (050).
- **The owner's checkpoints (ruling owner-sign-off-with-material):** an acceptance line marked owner-only names its material and what to check; it holds the ball on whoever produces the material, then on the owner; done refuses while it is unticked; work that must wait for his look waits on that issue. Which steps are checkpoints is agreed with the jarl while the backlog is written.

## 7. Models

- A level names its tier: the jarl strong, a coordinator standard by default; workers and reviewers on the tier their issue names; the goal's `Model (<tier>)` lines say which model each tier is (**built**). `init` asks nothing new; the lines stay optional and are offered once, by `next --as jarl`, when the first agent is leased. Model ids are folded across spellings (038). The fresh-review rule stays: a reviewer is never of the worker's model and never below it. Models are chosen by judgment (a-001); `models` keeps counting without warnings.
- 006 (a model ceiling in the profile) stays, read per tier.

## 8. Many sessions and machines (ruling two-machines-caught-at-merge)

- **Prevented:** two issues mixed in the record. Every issue gets a key at filing (its filing stamp and a few random characters), written in its header, on its `filed` line and on every log line about it; numbers are taken over every local and remote-tracking ref of the clone; a number taken twice is renumbered at the merge, the key telling the moves apart; `verify` refuses an issue file holding git conflict markers. **Built today:** a log line names its issue by number only (`scripts/lib/log.mjs:37-38`), and numbering reads this checkout and its worktrees only, so two branches of one checkout already collide.
- **Caught at the merge:** one issue leased in two clones before either pushed. Lease lines name their writer; two leases with no move out between them, by different writers and with no takeover, show to the jarl as a conflict. The coordinator's rule says to pull before leasing and push right after; Jarl itself never pushes or fetches.
- 022 stays the owner's feature for numbering a series; it is not the id mechanism. 031's detection and refusal ship first; the key comes with the format raise.

## 9. The record, its format, and Horde (ruling one-format-raise-horde-later)

| Change | Where it is written | An older reader would |
|---|---|---|
| issue key | header, `filed` line, every log line about the issue | misread it in silence: raises the format |
| writer on a write (`--by` where new) | log line, fixed position | misread it in silence: raises |
| owner-only acceptance mark | the issue's acceptance | let done pass in silence: raises |
| parent of a sub-issue | header | treat the tree as flat and offer parents: raises |
| batch id on one verdict over several issues (040) | verdict lines | count it as several reviews; raises |
| kinds `promise` and `wait`, ask kind `escalation` | header, asks | refuse an unknown kind: raises |
| `Applies to:` on a ruling | decisions.md | show it as ruling text; to be checked whether it raises |
| `Coordinators:` with slices, `Merger:`, the liveness threshold | goal | ignore unknown goal lines; no raise |
| slice tags, `next --as`, `brief`, `use`, the loop list | tags and read-only views | nothing to read; no raise |

- One raise to format 3 in 6.3.0 carries every row marked "raises", with the record contract `jarl-record/2`. A loop under a composer's profile (Horde's missions) is never raised; the features that need format 3 stay off there. Horde reads only what its vendored copy knows (Jarl v6.1.0, format 1: it already cannot read a loop the current Jarl starts, technical critique I10) and re-vendors in a later release.
- Existing loops read as today and are raised at their first write that needs format 3; unkeyed log lines stay readable by number.
- These changes are made for the honesty of the record: it should say what happened (one review of several issues, who wrote, which issue a line is about), not to serve a measurement.

## 10. Acceptance: six scenarios (issue 076)

1. **Delegation.** A jarl files a backlog, splits it into two slices and assigns two coordinators; each sees only its slice; both race to lease one ready issue and the second is refused; the jarl sees only what is on the jarl; the owner's digest holds only what is on the owner; one approve in each slice at once gives one merge at a time.
2. **Replacement.** A standing rule, a promise, an open question and a review in flight recorded for slice A all appear in a fresh coordinator's brief for slice A and none of slice B's.
3. **Stuck worker.** With the test-only clock seam, a lease silent past 30 minutes shows on its coordinator's list with the command to act, and `resume` agrees.
4. **Two machines.** Two clones, and apart two branches of one checkout, file, lease and merge; a number taken twice is renumbered with no move on both; a double lease is a conflict for the jarl; `verify` refuses a conflicted issue file.
5. **Owner returns.** One command prints in one message everything on the owner, most blocking first, each with what it holds up.
6. **One agent alone** (proposed beside the owner's five): a loop runs from `init` to `close` with the minimum of section 2, no goal line beyond the goal, and the owner's review shown as his to start.

Each is red at 71ebc5b on a behavioural assertion where one exists, and runs once live with real agents, kept in this folder.

## 11. What becomes of the open issues the model touches

| Issue | Becomes |
|---|---|
| 052 next actions | section 3, `next --as`: the core |
| 053 refusals with a ready command | the core with 052: each line and each refusal names its command |
| 042 stuck worker, 057 resource holder | section 3 liveness, one issue |
| 069 root cause, 070 owner digest | folded into 052 ("via N", `--as owner --all`) |
| 073 register | sections 3 and 6: the ball, kinds `promise` and `wait`; unchecked notes and validity by date dropped (a rule's or promise's end is an issue closing or a date on the rule) |
| 039 owner sign-off | section 6, as reshaped by owner-sign-off-with-material |
| 058 briefs, 020 standing brief | section 6: `brief`, and rules with a scope (020 is the loop-scoped rule) |
| 056 undeclared coordinator, 063 mandate | section 2: coordinators declared with their slices; a ruling may name the ruling it rests on (`decide --under`), kept small |
| 008 handover | section 4: the takeover or handover that the lease guard asks for |
| 066 takeover limit | a goal line read by the round rule, kept small |
| 043 Settles | `verify` lists rulings that name work and settle no live issue (section 3 row), ready outside the model |
| 060 resume shows the answer | needed by `resume --as`, ready outside the model |
| 061, 062 rulings in resume | `resume --as` prints the rules and rulings that match, whole: one issue |
| 064 since view | a filter over the log ending with the asker's list, kept small |
| 065 short report | ready outside the model |
| 068 coordinator slips | `report` per coordinator: reopens after done, retractions; kept small |
| 045 model lines at init | section 7: nothing new asked; offered once |
| 051 reviewer rank | section 6: a built-in rule, no counting |
| 040 batch record, 050 batching rule, 007 review queue | section 9 batch id; section 6 rule (one contract or one screen, at most four); the coordinator's list groups ready reviews by it |
| 049 identical output | ruling identical-output-light-review; 004 for the owner's waiver |
| 055 commit after approve | a note on `merged` when the approved tip is not the merged tip (002 records tips) |
| 041 relayed and bot verdicts | counted apart in `report` and `status`; whether a bot's approve may clear is the owner's (recommended: never) |
| 059 visual review | a verdict may name the artifact it judged; the owner's looks are checkpoints (section 6) |
| 044 external requirements | requirements as a branch of the tree with a Source (078); `import` reports changed findings; no separate requirement concept |
| 006 model ceiling | section 7 |
| 022 reserved numbers | the owner's series feature, not ids |
| 031, 032 | shipped or in flight; the key of section 8 is a new issue |
| 078 sub-issues | section 6 and the tree |
| 076 scenarios | section 10 |
| 048 language | dropped (jarl-language-agnostic) |

## 12. What goes, and the word budget

- Retired prose: the reeve section of `references/jarl.md` and its relay text move into the coordinator's row and its brief; the step lists of the role references become built-in rules with a scope, whose text stays in the references and is quoted, not restated; the daily commands table of SKILL.md gives way to `next --as`, which names the command.
- Budget: at the end of 6.3.0, SKILL.md and the five role references (jarl, worker, reviewer, merger, composers) are no longer, in words, than at 71ebc5b; a test checks it.
- Counted honestly, the model still adds: `next --as`, `brief`, `use`, the loop list, slice tags with `--slice`, the lease guard, `ask --kind escalation`, kinds `promise` and `wait`, `Applies to:` rules, sub-issues with a split, owner-only lines, the issue key with renumbering, `--by` where new, the `Merger:` and threshold goal lines, and one format raise. It removes the per-level model lines, number blocks, the review lease, unchecked notes, the permission table, loop-level brief templates and two of three views from draft 2.

## Open for the owner

- Whether a bot's approve may ever clear an issue (041; recommended: never).
- Whether the sixth scenario, one agent alone, joins the five of his ruling.

## Background


### Inputs

- Jarl at a1132a8: SKILL.md and the references (about 33,000 words in all: SKILL.md 2,763, jarl.md 4,464, commands.md 7,653, record.md 3,950, profile.md 3,399 and seven more), 38 commands, the library at 6,682 lines.
- The field report and its checked map: [research/2026-11-03-jarl-field-report-long-loop](../2026-11-03-jarl-field-report-long-loop/README.md) (44 items; 21 true, 18 partly, 3 not).
- The measurements of [research/2026-11-03-review-granularity-and-light-models](../2026-11-03-review-granularity-and-light-models/README.md): review outcome by size, and [where a unit's time goes](../2026-11-03-review-granularity-and-light-models/materials/time-by-unit.md).
- Two runs made for this report on a scratch copy (below, experiment 3).

### What Jarl is today, in one paragraph

Built: a record (`.jarl/`: goal, issues, an append-only log, rulings, questions, an optional profile) and a tool that writes it through commands that refuse what would make it false (a done without proof or a fresh approve, a self-approve, a forged log line, a cycle of After). Everything else is prose: the jarl's loop (boot, file, pick, raise a worker, review, merge, repeat), the reeve, the relay for hosts that cannot spawn, the briefs, the model rule. Jarl "records, derives and displays; it never blocks code from landing", and leaves gates, planners and expiring leases to a composer such as Horde (composers.md, "What Jarl will not grow"). The field report's verdict on that split: "an excellent memory and a weak guide".

### Thought experiments

#### 1. One agent alone

A session with no subagents (a host that cannot spawn, a topic in a notes repository whose topics are loops, a small repository) is jarl and worker at once. Built: a self-approve is refused, so a code issue cannot close until a second agent reviews it; an issue with no branch closes on the jarl's approve. What breaks: nothing tells the lone agent what it is waiting for. The honest state is "the owner must start a fresh session to review issues 7, 9 and 12", and that is exactly where one review over several issues pays most, because each review costs the owner an action. What it needs: the next move and who holds it, and a minimum that costs little to learn (init, new, next, evidence, done, ask, decide), with the crew's machinery out of the way until it is used.

#### 2. One coordinator and many workers

Measured on 6.2.0 (127 merged units): a round is a median 14 minutes of work and 8 from the worker's last evidence row to the verdict; a unit has 1.8 to 2.1 reviews. Each unit asks the coordinator for about five moves (lease and raise the worker, read the report and raise a reviewer, read the verdict, send a round or raise the merger, close). With five workers that is a move every few minutes, each costing context: a report read, a brief written by hand (the field report: about 30 reviewer briefs, the same 8 rules in about 90 messages). The context fills, compaction drops what was never recorded (a convention lost cost about 80 minutes of a blocked coordinator), and a stuck worker shows only after six hours with no commit unless the coordinator knows to ask for less (built: `status --stale-hours` takes a fraction, so 0.5 flags half an hour, but resume always uses 6 and only commits count, never rows or log lines; the report counts about 4 hours of stalls found 9 to 24 minutes late by a watchdog outside Jarl). The coordinator is the loop's bottleneck and its weakest memory. What it needs: Jarl computes each role's next move and the brief for it, every role records its own result, the coordinator reads one line per event, and silence is visible in minutes.

#### 3. Several sessions or machines on one loop

Run on a scratch copy with Jarl a1132a8 (commands in [materials/two-clones.md](materials/two-clones.md)):

- Two clones of one committed loop each filed an issue. Both got number 2; git merged them without a conflict, because the file names differ by slug. `list` shows two issues numbered 2, `verify` says "clean — every line of the record is placed, and nothing disagrees", and `show 2` and `set 2 in-progress` reach the first file only. Worse, as the sceptic found ([materials/sceptic.md](materials/sceptic.md)): the log line of a move carries the number and no file, so list and resume apply every move of 2 to both issues; after `set 2 dropped` both read dropped, and verify then advises writing the log's state into the second file, which drops an issue nobody dropped. Two branches of one checkout that each file an issue and then merge end the same way. The merge driver flags change nothing, because no driver covers the issue files, while SKILL.md, jarl.md and repositories.md promise that numbers never collide.
- A committed loop opened, committed and cloned before its first issue cannot file in the clone: `new` fails with a raw `ENOENT … scandir '.jarl/issues'`, because git keeps no empty directory.

The write lock protects sessions sharing one checkout (built, record.md "The write lock"); across clones nothing does, and a lease taken in two clones is possible by construction (not run). This is the shape of a notes repository whose topics are loops worked from two computers and of any loop with more than one driver. Even in one checkout nothing says which session drives what: a question the analysis session filed in the 6.2.1 loop shows in the release session's resume as if it were its own.

#### 4. A long loop with the owner away

Built and praised by the report: resume restores the record exactly, after any number of compactions. What breaks is everything never recorded: the owner's standing orders given in chat, the coordinator's conventions, promises, guesses that become facts in the next summary, a question asked in a dialog that a worker's ping cancelled (asked three times before it was answered). And the signal drowns: on the 6.2.0 loop resume printed 102 rulings in force, 309 lines and 41,043 bytes (map fr-28).

#### 5. Work that is not code

Films, renders, documents and decisions. Built: a profile can declare statuses, fields and attachment slots; evidence can attach a file with its hash. What breaks: the owner's sign-off is not a state (an issue was closed and reopened by hand), a verdict cannot name the render it judged, and every owner who wants this writes a profile from nothing.

#### 6. Speed

Measured on 6.2.0: 83 of 127 units were already packages of two to six issues with one review; per issue a package took a median 17 to 27 minutes against 47 alone; the review is about a third of a round; 13 units took over 30 hours and 83% of their time lay before the first verdict. So one review per issue is not what makes a loop slow. In order: how many units can run at once (limited by overlapping files and by the coordinator), stalls noticed late, the coordinator's cost per move, then reviews shared where the changes are one thing to check, then lighter models on light work (cheaper; whether faster is unmeasured).

#### 7. Models

Built: tiers light, standard and strong, model lines per tier in the goal, `models` with `fits`, `below` and `may clear`. Unused in practice: the report's loop declared no model lines, the family's own driver (6.1.0) records no model, and one model under two spellings splits every count (map fr-02). The measuring instrument exists and is not yet usable.

### What the sceptic changed

A fresh Opus sceptic checked the field report's 39 findings at a1132a8 ([sceptic.md](../2026-11-03-jarl-field-report-long-loop/materials/sceptic.md)): 20 stand, 18 stand with a correction, 1 is refuted, and severity moved down on 10 and up on none. The pattern in the corrections matters more than the counts. In at least nine places, what the report asked for is already in Jarl, and neither the coordinator in the field nor the analyst who read the code found it: a ruling names the issues it settles (`decide --settles`); `--stale-hours` takes a fraction of an hour; a profile can declare its own kinds with required file slots that done checks; the package rule groups small neighbouring issues under one review; `show` prints the record half of a brief, and the third `round` prints a takeover brief; `import` and `sources` track external items against issues; every move is a dated log line a since view could filter; and a standing order recorded with `decide`, or a question filed with `ask`, already survives every compaction. Most of the losses in the report came from records not made, not from records Jarl cannot hold.

So the first gap is not capability but guidance: the tool does not bring the right existing command to the agent at the moment it is needed, and 33,000 words of prose do not do it either. That moves the weight of the direction below toward the ball and the next move, which can name the existing command (for example: "worker 22 silent 40 minutes: status --stale-hours 0.5", "ruling X settles 40, which is not done"), and away from new commands.

### First synthesis, before the model

The report's items are not thirty separate wishes. Most of them are one missing concept and three missing properties.

**The missing concept: who holds the ball, and what is the next move.** Every open thing in a loop waits on someone: a ready issue on the coordinator, a lease on its worker, a branch with a report on the coordinator, a pending review on its reviewer, a changes verdict on the worker, an approve on the merger, a merged issue with an owner-only acceptance line on the owner, a question on the owner, an issue waiting After on whoever holds its blocker, a ruling that requires work and has no issue on the coordinator. Almost all of it can be derived from what Jarl already records. New would be only two kinds of entry (a promise by an agent, a wait on a named outside person) and one mark (an acceptance line only the owner may tick). From that one derivation come the next-actions list (fr-17), what waits on the owner in one message (fr-38), the root cause on the owner (fr-37), worker liveness as the age of the holder's last move (fr-07) and most of the register (fr-41). The register is then not a second store beside the record, but a view of it.

**Property 1: a coordinator that can be replaced at any moment.** Test: stop the coordinator mid-loop and start a fresh one, on a lighter model, with nothing but Jarl. Today it loses the conventions, the promises, the dialog questions, which reviewer runs where, and every brief. The fix is generated briefs (fr-24) built from the record and the loop's standing rules (issue 020 of 6.2.1), so a rule written once reaches every agent, and every role records its own result. This is also what makes many workers affordable and light models usable as coordinators: the more Jarl computes, the less the coordinator must hold.

**Property 2: safe with many drivers.** Ids that cannot collide across clones, `verify` that finds two issues with one number, a fresh clone that can file, and each session that drives a loop named, so the ball can sit with a session and not only with a role.

**Property 3: a record that tells the process as it was.** One record for one review of several issues (fr-05; today a reader can rebuild it from identical verdict lines), a later green gate shown apart from a merge's own check (fr-04 was refuted: one `merged <ids>` already records one check for several merges, but it overwrites each issue's own merge sha and the banner cannot tell the two apart), relayed and bot verdicts apart from fresh ones (fr-06), model names folded (fr-02), an undeclared coordinator name not counted as fresh (fr-22). Without these no question about batching or models can be answered from a loop, including this investigation's own.

**Less to read.** About 33,000 words of references exist because the steps live in prose. When the tool tells the next step and every refusal carries the corrected command (fr-18), the manual a coordinator must hold shrinks to the principles and one call.

**What stays out.** Merging, closing or expiring by itself; a schedule; a hook that runs a host's command; translating Jarl's output; a separate register store. The line "Jarl records, derives and displays" holds: every proposal above derives or refuses at the level of the record.

### The owner's shape: a jarl, coordinators by slice, workers and reviewers

The owner's input of 2026-11-03 (README) names the shape the direction should serve: a jarl on a strong model that talks with him and works the backlog, one or more coordinators on a medium model, each over its own slice of the backlog (a tag is enough to mark a slice), and workers and reviewers on whatever model the task needs, all as subagents. A coordinator does not reach the jarl until it has to.

Built, in prose only: the reeve (jarl.md, "The reeve: handing the loop down") is one long-lived coordinator on the standard tier that runs the loop and reports to the jarl on four occasions only (a research issue or a gap the goal did not foresee, an owner's answer that changes the goal, the counts every few merges, an empty queue), with a relay for hosts where a raised agent cannot raise agents. The tool knows none of it: `next`, `resume` and `status` take no slice (only `list --tag` filters by tag), a lease does not name the coordinator that raised its worker, and nothing records a question to the jarl as distinct from a question to the owner. In practice the family's own release loops run without a reeve: one strong session does everything.

What the direction adds for it: the ball can sit with the jarl, a named coordinator, a worker, a reviewer, the owner or an outside person; a coordinator's next moves and its resume cover its slice only; going up is an entry with the ball on the jarl (the reeve's four occasions become the rule for what such an entry may be), never a message the jarl must read to find out; and a slice is a tag the jarl assigns, so several coordinators can run one loop without sharing a context. Files already keep two coordinators from colliding (`next` never offers an issue whose files an in-progress issue holds, across the whole loop).

### Routing to the right loop

Built: every tool takes `root`, the absolute path of the checkout that holds the loop; without it the server's `JARL_ROOT`; without that, the loop at the root of the session's project, never one in a subdirectory (commands.md, "Which loop a call reaches"). A loop kept in a subdirectory, such as a topic in a notes repository, is reached only by passing `root` on every call, and a call that forgets it fails where the project has no loop at its root, or reaches the wrong loop where it has one. What the owner asks for: the skill holds the general routing (which loop serves which area), and the tool tells the agent what it needs: the loops it can see under the project, and a refusal that lists them when a call names none and the choice is not obvious, instead of a silent default.

