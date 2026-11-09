# Blind tests of Jarl 6.3.0 with light and mid models

This is the plan for the live run that issue 076 asks for, at the end of the loop, after every other issue is done and merged. Its question: can an agent that knows nothing about Jarl, given only the installed skill and a plain goal, use Jarl 6.3.0 to do the work, without the author's help and without a refusal it cannot get out of. The scripted scenarios of 076 prove the levels hold together with no model in the loop. This run proves the words the agent reads (the skill, the help, the refusals, the forms) are enough.

## What "blind" means here

- The agent is told its goal in the words an owner would use, never the commands. It is told where the skill is and nothing else about Jarl.
- It gets no repository context, no memory, no hint of the author's intentions and no answer from the observer while it works. The observer only starts it, waits, reads what it did and scores.
- The loop it works in is a scratch copy: a fresh loop for most scenarios, a copy of a prepared loop for the rest. It never sees the real loop of the release, and nothing it writes can reach a tool repository or the Althing checkout.
- The skill it reads is the one at the tip of the release branch, extracted with `git archive` into the scratch folder next to the loop. Nothing else from the repository is in its reach: no tests, no research, no rulings of the family.

## Who runs

Each of the six scenarios runs with each of two agents, once, which makes twelve runs. The owner's pass, the MCP pass and the coordinator's trigger run once each with the mid agent.

| Agent | Model and effort | Why |
|---|---|---|
| light | Haiku 5.5 at max (`claude-haiku-5-5`, effort max) | the cheapest agent that the skill must still serve; mechanical and ordinary work |
| mid | Sonnet 5.5 at medium (`claude-sonnet-5-5`, effort medium) | the usual worker and coordinator, at the effort that follows the skill more literally |

Never Fable. A stronger model is not run: if it succeeds where the light ones fail, that is the finding, not a pass. Reviewer roles inside a scenario are played by the other model of the pair, never by the model that did the work (the rule of the loop itself).

A failed check is rerun only for that scenario and those models. The observer stops when a full pass has no failed check and no wrong guess after a refusal, or after the second pass, and the report says what is left.

## How an agent runs blind

Each run gets its own `mktemp -d` folder under the system temporary directory, holding only the scratch repository, the starting loop and the skill, and the agent starts in the repository. The skill comes from the tip of the release branch by `git archive`, without its `scripts/tests`. The agent starts with `claude -p`, its model and effort named, stream-json output to a file outside the repository, `--strict-mcp-config` with an MCP configuration of no servers, `--setting-sources project`, `--disable-slash-commands`, a `--settings` with attribution off and auto memory off, and only the tools the scenario needs (`--tools`). A probe before the first run asks a Haiku what it knows of Jarl and which skills, tools and instructions it sees; an agent that sees the older plugin, its MCP tools or the machine's own instructions invalidates the run.

The agents' path starts with a stub named `claude` that says the command is not found, because an agent can otherwise start the host's own `claude` and raise children the flags do not reach. Two things the flags do not stop: the shell of the agent can read the whole of the home folder, and the harness tells it the account's e-mail address. The observer reads every command of every transcript for the first, and the report names any read outside the folder.

A raised agent reads only its brief. Scenario 3's worker, examiner and merger each start with the text `brief` prints and no skill file. Coordinators are raised by the scenario's jarl with `brief --slice`. Every command the agents meet is the new Jarl's: lines with methods, `--by` and `--model` required, `--line` on proof, the brief from the tool.

## The scenarios

Each is written as the plain goal the agent receives, then what the observer checks at the end. They follow the six of issue 076; the first five need a prepared starting loop, the sixth starts empty.

1. **A lone agent from nothing.** Goal: "Keep track of the work to make this folder's three small scripts pass their checks; do it properly, with someone checking the code." Start: an empty loop and a scratch repository with three scripts and a failing check each. Checks: the loop was opened, three issues filed with acceptance lines, evidence rows recorded with the commands that were run, a proof for a code issue, the owner asked (through a recorded question) for a fresh session to review, nothing closed without evidence and review; every refusal the agent met, and whether it found its way out from the refusal's own words.
2. **A jarl with two coordinators.** Goal: "Split this backlog of twelve issues into two slices and hand each to a coordinator (claude-sonnet-5-5 for them); have each land one issue of its slice and stop there; keep the list of what only you can decide." Start: a loop with twelve filed issues and two matters outside both areas. The jarl agent raises two coordinator agents (Sonnet) through Jarl's own briefs, `brief --slice`, and each works its slice from that brief; a fresh late coordinator is then told to lease an issue another already holds, and a separate start, `second-lease`, tries it against a lease that reads as live. Checks: slices declared, each coordinator's list holds only its slice, a second lease on one ready issue refused with a usable form, the jarl's list holds only what is on the jarl, one merge at a time.
3. **A worker and a reviewer.** Each agent starts with the text `brief` prints for its role and no other word about Jarl; the worker's goal is "Fix issue 3 in the scratch repository and leave proof", the reviewer's (a fresh agent of the other model, on `brief 3 --role reviewer`) "Review issue 3 as the loop asks", and a merger, again fresh, starts on `brief --role merger`. Start: a loop and a repository with the issue leased and its worktree made. Checks: red then green recorded, the review recorded by a name that is not the worker's, a verdict that carries findings the worker can read, a second round when the reviewer asks for changes, the merge recorded.
4. **A replacement.** Goal: "You are taking over this slice from a coordinator who is gone; carry on." Start: a loop with a rule, a promise, an open question and a review in flight recorded for the slice (and one thing never recorded, which the observer says is out of reach). Checks: the agent's first moves are `resume` and the slice's brief (`brief --slice odin`), it names all four recorded things and none of the other slice, and it says what it cannot know.
5. **A stuck worker.** Goal: "See what is held up in this loop and move it." Start: a loop with a lease that shows idle and a lease of a worker that is alive. Checks: the stale lease found and handled with the command Jarl prints (`set <id> in-progress "<why>" --worker <new> --model <id> --handover --by <who>`), the live one left alone.
6. **Two machines.** Goal: "Two copies of this loop were worked apart and have been merged; make it consistent again." Start: a merged loop with a number taken twice, a lease taken in both clones and a conflict marker in an issue file. Checks: the agent finds each through `verify` and `resume`, repairs with Jarl's own commands, and does not edit a record file by hand.

7. **The coordinator's trigger.** One run, mid agent. Goal: "You run this loop. It has grown to thirty-odd issues across three areas and you are not keeping up with the workers' reports. Sort out how the work is organised so it keeps moving; you need not start any agent yet." Start: a loop with thirty-three issues in three areas and six leases, each with a row of proof. Checks: the agent finds slices and coordinators on its own from the words of the skill, names them with the goal's `Coordinators:` line and `slice:` tags cut by area, leaves the six leases as they are, and changes the record through the tool only.

The owner's pass, one run with the mid agent, starts from his side: "I come back after a week; tell me what I must decide." It checks the owner's digest reads as one message and each entry says what it holds up. The MCP pass runs scenario 1 with the mid agent, with the skill's own MCP server as the one MCP server and Jarl's calls made through its tools.

## What is recorded for each run

The observer writes one row per run, into a table in the run's report, from the agent's transcript and the end state:

- the end state against the checks of the scenario (met, partly met, not met, each check named);
- the number of Jarl calls, the number of refusals, and for each refusal whether the agent's next call was the form it printed, a different correct call, or a wrong guess;
- the calls the agent made that the skill does not mention, and the places it went looking (help, references, a file read) before it found the answer;
- anything it did by editing the record by hand, outside `.jarl/` commands, or outside its scratch folder: any of these is a failure of the run whatever the outcome;
- a free-text note by the observer of the one thing that cost the agent the most.

No time or effort estimate is taken or reported. The count of calls and refusals is the measure of friction.

## How a result becomes work

- A failed check is an issue in the open loop of the release, filed with the transcript's relevant lines quoted (never the whole transcript) and the scenario, the model and the run named. A fix is a package like any other and is reviewed by a fresh agent.
- Friction without failure (a refusal whose form was ignored, a command found only after three tries) is counted per scenario. A form or a sentence that two of the six runs misread is an issue; one that one run misread goes on the list of notes for the release.
- A fix reruns only the scenario and the models that failed, plus the lone-agent scenario once with every model, so a fix cannot break the way in.
- The run stops when a full pass has no failed check and no wrong guess after a refusal in any run, or after the second pass, or when the owner says to stop.

## Limits and care

- Every command of every agent is bounded; an agent that runs a server, a watcher or a prompt is stopped and the run counts as failed.
- The shared temporary filesystem has a limit on the number of files: runs go one scenario at a time, each in one folder made for it and removed by its exact name afterwards, and the test loops are prepared small. No run starts while a full suite runs.
- The agents run with shell and file tools only (plus the tool that raises agents where the scenario has one), so friction with the tool itself is part of what is measured; they never get the Jarl MCP tools in these runs, and the MCP pass covers the server.
- Windows and macOS are not reachable from here: the runs are Linux, and the report says so.
- The results go to `research/2026-11-03-jarl-as-a-loop-tool/` as a file of their own beside the usability run of issue 096 (`blind-run-6-3-0.md`, opening with the question, the method, the status and the conclusion), with the quoted lines checked against the boundary rules like any research.

## Order of work

1. Prepare the six starting loops and the three scratch repositories with a script that only builds them (it lives in `workspace/`, Node, no dependencies, so it is checked like the rest of the workspace), and extract the skill of the release tip.
2. Run the probe for isolation with one Haiku, then scenario 1 with the two agents; read every transcript.
3. Run scenarios 2 to 6 one at a time, reading as above, each folder removed by its exact name afterwards, no run while a full suite runs.
4. Run the owner's pass, the MCP pass and the coordinator's trigger.
5. Write the report; report what failed to the one who runs the loop; rerun what failed, for those models only; stop after the second pass at the latest.
6. Record the result as the evidence of issue 076.
