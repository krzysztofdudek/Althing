# Runs on scratch loops

Two runs back the claims about behaviour in this folder. Each used a copy of the skill extracted with `git archive` from one commit of JarlSkill, a scratch git repository with a feature branch, and a loop opened in it. `<scratch>` stands for the scratch folder; `jarl.mjs` is the extracted script. Neither run touched a real loop.

## Run 1: a loop with two coordinators (JarlSkill 89bb93b)

Done for the first part of this question (the simulation that led to issues 209 and 215 to 223). The loop declared `Check: node --test`, three model lines (light, standard, strong), `Coordinators: north, south` and `Merger: jarl`, and held four issues: two light ones in slice north on neighbouring files, one strong one in slice south, one with no slice, no files and no acceptance.

What it showed, each already filed:

| Seen | Issue |
|---|---|
| `next --as north` offered the two neighbouring light issues as two separate "raise a worker" lines | 209 |
| after the third `round` printed the takeover block, `next --as north` said of issue 1 "sent back by a round, no new proof yet; the worker records it" | 215 |
| `set 1 in-progress … --handover` on one issue of a package left issues 1 and 2 on one branch with two workers; `branches` and `verify` printed nothing about it | 216 |
| `brief 1,2` was refused with "No such issue: 1,2"; the brief's commands name a bare `jarl.mjs`; it carries no filing command | 217 |
| a worker leased on the strong tier and left with one uncommitted file showed in `branches` as `(1 uncommitted)`, while liveness reads only commits, rows and log lines | 218 |
| a fresh coordinator of slice south saw "with worker w-south-1 … the worker records it" and had no way to know whether that worker still ran | 220 |

## Run 2: who may write what (JarlSkill 0556c16)

The loop declared `Coordinators: north, south` and held two light issues in slice north, leased as one package to worker `w1` on branch `jarl/1-rename`. Every call named its writer with `--by`. The commands and what they printed:

```
$ jarl.mjs set 1 in-progress "fresh worker for issue 1" --branch jarl/1-rename --worker w2 --model mid-model --handover --by north
1 → in-progress · jarl/1-rename · w2 · handed over

$ jarl.mjs evidence 1 --ran "node --test" --saw "tests 1, pass 1" --by w1
1 evidence row recorded

$ jarl.mjs field 1 Acceptance "a.mjs exists" --by w2
1 Acceptance: a.mjs exists
note: 1 is leased (in-progress), and its scope grew after the lease: line 1 "a.mjs exists" — an issue's scope does not grow once it is leased: a new ask is a new issue, …

$ jarl.mjs field 1 Tags identical-output --add --by w2
1 Tags: identical-output, slice:north

$ jarl.mjs field 1 Tier light --by w2
1 Tier: light

$ jarl.mjs decide skip-slow-tests "workers may skip slow tests" --by w2
decided skip-slow-tests · by w2

$ jarl.mjs decide north-style "every file uses tabs" --by north
decided north-style · by north

$ jarl.mjs new "Rename x in a" --tier light --files src/a.mjs --tags slice:north --by north
filed 3 · <scratch>/repo/.jarl/issues/3-rename-x-in-a.md

$ jarl.mjs ask "Should the rename keep the old export?"
asked a-1
$ jarl.mjs answer a-1 "keep it" --by owner
answered a-1

$ jarl.mjs verify
… worktree leases: clean
```

What it shows:

1. **No fencing.** Worker `w1`, replaced by `w2` on issue 1, still wrote a proof row on issue 1, and that row counts for the done gate of `w2`'s lease (the gate's window opens at a start, and a handover is not a start).
2. **The worker rewrites what it must prove.** The holder of the lease replaced acceptance line 1, "a.mjs exports y", with "a.mjs exists". The tool wrote it and called the narrowing "scope grew", which is untrue.
3. **The worker sets the tag that lightens its own review.** reviewer.md says the issue's own worker never sets `identical-output`; the tool let the holder set it.
4. **The worker moves its own tier.** The holder set Tier light, then strong.
5. **A worker makes a loop-wide ruling.** `decide --by w2` recorded a ruling in force for every agent of the loop.
6. **A coordinator's ruling reaches the other slice.** `decide --by north` with no scope is a ruling of the whole loop, including slice south.
7. **A retried filing files twice.** The same title, files and slice as issue 1 filed issue 3 with no note.
8. **Anyone answers as the owner.** `answer … --by owner` needs no words of his, while `decide --by owner` does.

Two more calls on the same loop, after a third issue (4, ready, in slice north) was filed:

```
$ jarl.mjs ask "Stop: the base branch is red for a reason nobody understands" --kind stop --by w2
asked a-2
$ jarl.mjs next
4  P2  Another
$ jarl.mjs next --as owner
On the owner (1)
- a-2 Stop: the base branch is red for a reason nobody understands: question (stop) — …
```

9. **"stop halts everything" does not halt anything.** commands.md says of `ask --kind stop` that it "halts everything"; `next` holds only the issues a stop question names, so with no `--issue` it holds none and issue 4 is still offered.
10. **A worker asks the owner directly.** The question by `w2` went straight onto the owner's list. jarl.md says a coordinator never talks to the owner and a worker reports to its coordinator; the tool routes a worker's question to the owner all the same.

The record knew every fact needed to catch points 1 to 6 and 10: who holds and who has held each lease, and which names the goal declares coordinators. The tool already uses the same facts to refuse a self-approve. Point 8 cannot be caught by the record alone (Jarl cannot verify a person), only made visible.

## What these runs do and do not show

One agent typed every call, including the violations, on purpose. The runs prove what the tool allows. They do not show that a real loop does these things: [real-loop.md](real-loop.md) checks each claim against the record of two real loops, and for most of run 2 it finds no case.

## Run 3: a team of people on one record (JarlSkill a6dcbc3)

A loop with `Coordinators: ana, ben`, an issue with an owner-only line in slice ana, leased to `ola`, proof by `ola`.

```
$ jarl.mjs review 1 approve "read the diff, it meets the line, nothing else moved" --by ben --model person
1 review approve by ben (coordinator) · … next: a fresh reviewer's approve is next …
note: 1 carries code and ben is a coordinator — the fresh-review rule: this approve is recorded but does not clear it for done or the merge queue …
$ jarl.mjs tick 1 1 --by eva
only the owner ticks an owner line (got "eva"): he ticks it once he has reviewed its material, and nobody ticks it for him
$ jarl.mjs decide q "keep the name" --by eva
decided q · by eva
```

A second loop in a subdirectory held a question; `next --as owner` on the first loop did not show it, and `use` listed both. The record works for people as it stands, with three breaks: a team lead named as a coordinator cannot clear a colleague's work, the owner is one literal name, and nothing tells a person that the ball is on them.
