# Blind runs of Jarl 6.3.0 with light and mid models (issue 076, line 2 of issue 230)

## Question

Can an agent that knows nothing about Jarl, given only the skill or, when it is raised, only its brief, do the work of the six scenarios of issue 076 and find its way out of every refusal from the refusal's own words?

## Method

The plan is `releases/6.3.0/plans/blind-tests.md`. I ran the skill at commit 7c2fa20 of the branch `jarl/230-proof`, without its tests, on Linux. Each agent was Claude Haiku 5.5 at max effort or Claude Sonnet 5.5 at medium effort, one at a time, each in its own temporary folder holding only a scratch repository, the starting loop and the skill, started by `claude -p` with no MCP server, no user settings, no slash commands, attribution and auto memory off, and shell and file tools only. The starting loops come from `workspace/blind-starts.mjs`. Scenario 3's worker, examiner and merger started from the text `brief` printed and nothing else; the coordinators of scenario 2 were raised through `brief --slice`. A probe Haiku was asked what it knew of Jarl and what it could see before the first real run. I read every transcript and scored each run against the checks of the plan.

## Status

Finished. Two passes of the scenarios that failed; the rule of the plan ends there. Nothing here is fixed: every defect below is a report, and the fixes wait for a decision.

## Conclusion

Yes for lone work, the worker's path, a stuck lease, the coordinator's trigger, the owner's digest and the MCP server: no agent needed the author, and no refusal left one lost. Nine refusals by Jarl in all were met by the printed form or another correct call, three more calls failed as malformed input to the MCP client and were corrected the next call, and no agent guessed its way past a refusal.

No for two machines, in all four runs, because the tool itself tells an agent to edit a record file by hand and no other way exists. Partly for the replacement: all four runs named what the slice holds, but only in the second pass did agents reach for the slice's brief, and all four also named the other slice. The Sonnet worker's review never landed: the examiner of the pair was Haiku, and it stopped at the depth its brief asks for. That is a conflict in the plan, not a defect of Jarl.

## The runs

Counts are the Jarl calls the agent made, refusals met and what followed each; a coordinator's run counts its subagents' calls.

| Scenario | Agent | Checks | Calls | Refusals, then | Looked for | By hand or outside | Cost it most |
|---|---|---|---|---|---|---|---|
| 1 lone, first start | Haiku | discarded (see Limits) | | | | started the host's `claude` itself | the pilot run: its children were not isolated |
| 1 lone | Haiku | met: loop opened, three issues with lines, rows with their commands, proof on code, owner asked through three recorded questions, nothing closed | 52 | 1: `brief 1-3`; then `brief 1,2,3`, a correct call | the grammar of a line, in `lib/lines.mjs` after grepping the references | none | finding the mark syntax of an acceptance line |
| 1 lone | Sonnet | met | 19 | 4: three lines without a mark, `set 1 2 3`; then the printed form each time | `references/jarl.md`, `models.md` | none | its question to the owner quotes `brief 1-3`, a form that is refused |
| 2 delegation | Haiku | met, two issues on the feature branch through slice mergers | 78 | 0 | `commands.md`, `models.md`, `repositories.md` | none | landing the integration branches: the loop flagged issues 1 and 6 "closed, gate does not hold" and it re-closed them |
| 2 delegation | Sonnet | met for the slices; each issue landed on its slice's branch, the slice branches not on the feature branch | 35 | 0 | `models.md` | none | the model name `claude-sonnet-5-5` was refused by the spawn tool; `sonnet` worked |
| 3 review (worker Haiku, examiner Sonnet) | Haiku | met: red then green, review by another name, verdict the worker can read, merge recorded, a real round in the first start | 19 | 1: a changelog entry with no section; then the printed form | nothing | none | the merger stopped to ask where a changelog would go |
| 3 review (worker Sonnet, examiner Haiku) | Sonnet | not met, twice: the examiner recorded rows and stopped; no verdict and no merge | 10 | 0 | nothing | none | the brief told Haiku to run at tier strong or above; it did not record a verdict |
| 4 replacement, first pass | Haiku | partly: rule, promise, question and review in flight named; `resume` first; no `brief --slice`; other slice named | 10 | 0 | the record files directly | none | it read `.jarl/` files instead of the brief |
| 4 replacement, first pass | Sonnet | partly: the same | 3 | 0 | the record files directly | none | as above |
| 4 replacement, second pass | Haiku | partly: `brief --slice` used; other slice named | 23 | 0 | the record files | none | it pursued a defect in the check, outside its job |
| 4 replacement, second pass | Sonnet | partly: `brief --slice` used; other slice named | 7 | 0 | the record files | none | nothing |
| 5 stuck, second start | Haiku | met: stale lease found, handed over with the printed command, live one left | 18 | 0 | `commands.md` by `grep`, the reference being too large to read whole | the size of `commands.md` |
| 5 stuck, second start | Sonnet | met; it also did the replacement's work under the new worker's name | 6 | 0 | `commands.md`, `jarl.md` | none | nothing |
| 6 two machines | Haiku | not met: found everything, renumbered and handed over with the tool, but removed the markers with the Edit tool | 24 | 0 | `jarl.md` and `grep` over the references | hand edit of an issue file; a scratch copy in the system's temporary folder, removed after | it rehearsed the repair in a scratch copy first |
| 6 two machines | Sonnet | not met: found everything, renumbered with the tool, removed markers with `python3`, the double lease left unresolved | 15 | 1: `set ... "" --header`; then the correct form without a reason | nothing | hand edit of an issue file | the printed form of the refusal offers a reason the message says it does not take |
| 6, second pass | Haiku | not met: hand edit again, "No tool command removes markers" | 16 | 0 | `jarl.md` | hand edit of an issue file | as above |
| 6, second pass | Sonnet | not met: hand edit with `sed` of the header too, double lease left | 14 | 0 | nothing | hand edit of an issue file | as above |
| Owner's pass | Sonnet | met: one message, each entry says what it holds up; ordered by itself, not by the digest | 2 | 0 | nothing | none | it used `resume`, not `next --as owner --all` |
| Coordinator's trigger | Sonnet | met: slices by area with `Coordinators:` and `slice:` tags, six leases left, everything through the tool | 12 | 1: `tag --help`; then the printed form | `commands.md` | none | nothing |
| MCP pass (scenario 1) | Sonnet | met through the MCP tools alone | 13 | 3: `jarl_new` with input it wrote as bad JSON; then a correct call | `jarl.md` | none | the three malformed calls |

Scenario 3 also ran once with a start whose suite could not pass from the one issue. The worker and the examiner reported that correctly, and the examiner's `changes`, the round and the second examination all worked; the merge could not be reached.

Scenario 2's late coordinator, told to lease another slice's issue, met a lease whose branch did not exist and handed it over; Jarl refused nothing across slices. The Sonnet one first tried a command `lease`, was told it does not exist, and went to `set`. Run again with a live lease (scenario "second-lease", once per agent), neither model attempted the lease: both read the state and stopped to ask. The refusal of a second lease was not met live, in any run, and stays proved only by the scripted scenario.

## The failures, and what I would change

**Two machines: a hand edit is the only way out.** `verify` prints "keep one side of each conflict and remove the markers". The skill says "One tool moves the record", and the plan counts a hand edit as a failed run. Both can't stand. Quote from a run: "No tool command removes markers, so I removed them by hand". Either a `resolve` command or a `verify` message that names `git checkout --ours` or `--theirs` for the file would end it. Two Sonnet runs also left the double lease standing after making `verify` clean: `verify` does not read the lease conflict that `next --as jarl` still lists.

**Replacement: `brief --slice` is not the first move a reader sees.** Both first-pass runs started from `resume` and never ran `brief --slice`, though the skill's coordinator section names it. Every run also names the other slice, because `resume` and the record files show the whole loop. I would put `brief --slice <name>` (or `resume --as`) into the skill's first moves for a coordinator, and say what `resume` shows beyond the slice.

**The pairing of scenario 3 is wrong.** A Haiku examiner of a Sonnet worker reads "Run at tier strong or above" and does not record a verdict, which is the rule of the tool working. The plan's "other model of the pair" cannot put a light model on the examiner of a read line. I would change the plan, and give a tier-too-low examiner a printed way out; it currently can only stop and say so.

**Smaller defects, each seen once or twice.**

- `brief` refuses a range: `no such issue: 1-3`, while `set` takes `1-3`. A Sonnet's question to the owner recommends `brief 1-3 --role reviewer`.
- The refusal of `set ... --header` prints `"<why>"` in its form, and its message says `--header` takes no reason.
- An issue set done before its integration branch lands on the feature branch shows as "closed, gate does not hold"; the fix a run reached for was to set it done again.
- A coordinator can hand over a lease of another slice with no refusal. The design refuses nothing new here; I note that it happened.

## What the agents never found

Nobody reached `close`, `report`, `tick` or `round` on their own: the runs stopped earlier. The owner's pass did not use `next --as owner --all`; it read `resume` instead. The first pass of the replacement did not find `brief --slice`.

## Limits

- The agent's shell could read the home folder of the machine; the flags can't stop that. I read every command: no agent read outside its folder, and the scratch copies some of them made went in the system's temporary folder.
- The first Haiku run found the host's own `claude` on the path and started children with it, which saw the machine's settings. I discarded that run and put a stub named `claude` first on the path for the agents. A determined agent could still call the real binary by its full path; none tried.
- The harness tells the agent the account's e-mail address. No flag removes it.
- Two scenario starts were wrong the first time (a value not named; a suite line that could not pass) and were corrected; the affected runs are noted above and scored from the corrected start.
- Linux only. One run per agent per scenario, two for the ones that failed: this is a read of what the words do, not a measurement.
