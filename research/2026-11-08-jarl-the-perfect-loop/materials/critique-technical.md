# Critique: technical soundness

Model: Opus 5.5 at xhigh. I ran Jarl 0556c16 on scratch loops under `<scratch>`. File references are relative to `skills/jarl/`. I edited no repository and removed the scratch folder. I did not run Windows, real host time limits or real agents.

## Critical

**C1. "A replaced holder cannot write" (item 1, mark 2, recovery table).** A name cannot fence.
- Same name: `set 1 in-progress "…" --branch jarl/1-new --worker w1 --handover` printed `handed over`, so old and new w1 are one name.
- No name: `evidence 1 --ran … --saw …` wrote a row with no writer. `--by` is required on five commands only (`scripts/jarl.mjs:1096`).
- Two clones: after a pull, the log held `by north · … handover · worker w2`, then `by w1 · 1 evidence row`, with no conflict. Neither clone could refuse it.
- Earlier proof: w1 wrote a row, w2 took over on a new branch and committed. After an approve and a merge, `set 1 done` printed `1 → done` with only w1's row. A handover opens no window (`scripts/lib/loop.mjs:582`). decision-rights.md says such proof "does not count"; item 1 refuses only later writes.
- Coordinators, reviewers and the merger hold no lease. A fresh coordinator must reuse its slice's name (`loop.mjs:284`).
- An in-place issue has no branch to fence. `ball.mjs:98` prints the idle handover with no `--branch`.

Fix: the lease issues a generation, the brief carries it, and writes check it under the lock. The done gate cuts at the handover. A row then carries a new field, so item 1's "Format: None" falls. Mark 2 should say only leases are fenced.

**C2. The merge run (item 2, recovery table).**
- It excludes nobody. `next --as` only displays it, so two raisers can each see no run.
- A merger writes nothing during its check (`references/merger.md:53`). In a default loop a live merger goes silent past the 30-minute default. In a committed loop `.jarl/` sits in the main checkout, so any agent's write counts as a change in its worktree and a dead merger looks alive.
- "Asking git whether its merge landed" fails. The merge commit exists before the check, and a red check rolls it back (`merger.md:49-53`). I recorded a merge with no check: `merged 2 --sha <sha> --by replacement`, then `set 2 done` printed `2 → done`.
- The rollback point of a batch lives only in the dead merger's context.

Fix: open the run through the tool, refused under the lock as a lease is, and record the base before the first merge. The replacement re-runs the check or resets to that base.

**C3. One merger per main checkout (section 3, item 2).** The merger commits `.jarl/` in the loop's repository, even for a merge elsewhere (`merger.md:49,76`; `references/repositories.md:41`). Five mergers make five committers in the loop's checkout, one possibly mid-merge there. `merger.md:20` names that exact collision. Separately, `goal --set "Merger (core): north"` is refused (`scripts/lib/journal.mjs:314-315`), and an issue naming two repositories would have two holders and one `done`.

Fix: one committer for the loop's repository, or a tool command that commits only `.jarl/` under the lock.

## Important

**I1. Item 1 contradicts item 4.** Item 1 refuses a worker's `ask`, and item 4 makes `ask --kind stuck --issue` the worker's honest exit. A `stuck` by w1 landed on `next --as owner` (`ball.mjs:337`). `ask --kind escalation --issue 1 --by w1` landed on the jarl, not on coordinator north (`ball.mjs:323`). No escalation to a coordinator exists yet. Fix: add that holder rule and route `stuck` through it.

**I2. "With what the line said before (the log already holds it)" (item 1) is false.** I rewrote line 2 of three. The log kept `was "line one" (49 characters)` (`references/record.md:68`). A default loop has no git history either. Fix: log the old text whole.

**I3. The refusal list leaks.** Under a lease, `split 2 --line 1=2 --line 2=3 --by w2` moved an acceptance line to a new issue. The same holder widened Files, moved its slice tag and rewrote What. The table says "after the lease only its coordinator", but the rule refuses only past holders, so a reviewer passes. Fix: allow only coordinator names after the lease, and cover `split` and slice tags. Files stays open to the worker and appears in the reviewer's brief.

**I4. Lone agents and two roles.** The scale table says the refusals catch a lone agent grading itself, and item 1 exempts it. Under its own name it is refused with no coordinator to go to, so its next call is `--by jarl`. A coordinator doing an in-place issue is doer and setter at once. `owner` is not among the coordinator names (`loop.mjs:250`), so an owner who reviewed loses `decide`. Item 1's Why cites agents gaming checks, yet one changed word passes this one. Fix: claim only the honest failure, and exempt the owner.

**I5. Composer loops.** `setTags(root, ids, ops)` takes no writer and `setField`'s `by` is optional (`scripts/record.mjs:151-160`). "Must name its writer" needs a contract bump of `jarl-record/3` or a carve-out. The document names neither.

**I6. The format claims (section 4 intro, items 2, 5, 9).**
- A plain-text run line passes `verify`.
- A mark in a fixed place, `<stamp> run by north · …`, is a finding (`log.mjs:65`).
- `1 evidence row (witnessed) · …` is a finding too (`log.mjs:158,363`).
- The only mark an older reader accepts is free text, and `evidence 1 --ran "witnessed exit 0 true"` was accepted. A witnessed row cannot be both unforgeable and readable by an older reader.
- `log "run reviewer r-7 on 1, 2 returned"` writes a run line under any name.
- An aged lease showed "no commit, row or log line for 6h". After one line, `1 run reviewer r-7`, it showed "no proof yet". A note about an issue counts as life (`rounds.mjs:406-409`), so a reviewer's run line hides a dead worker.

Fix: build these inside format 3 with fixed marks, and drop the older-reader promise for item 5.

**I7. Item 5.**
- MCP dispatch is synchronous, one call at a time, with no cancel (`scripts/jarl-mcp.mjs:15-18`). A long suite blocks every agent sharing that server (`references/jarl.md:274`).
- A worktree inside a devcontainer is "elsewhere" (`repositories.md:16`), so the host cannot run there, and the host is the wrong environment anyway.
- `run 1 -- true` is witnessed, and only a comparison with `Check:` stops it counting.
- The row does not hold uncommitted files, and a tail plus a hash cannot be run again, against mark 3.
- `run <id>` names one issue and the worktree. The merger checks a batch in the main checkout.

Fix: run from where the repository's environment lives, as a background job with a handle. Record the tree state and count only declared commands.

**I8. Item 6.**
- `tests/walk.mjs:152` compares every file in `.jarl/` except the lock, and a refused call must change none. `scripts/jarl.mjs:579` and every brief promise the same.
- In a committed loop, `status` printed `1 loop file(s) not committed`. Existing loops keep their old ignore file (`lock.mjs:116-117`).
- Two branches produced `CONFLICT (content): Merge conflict in .jarl/calls.log`.
- `status --by w1` and `next --by w1` are refused, so reads carry no writer, and "same writer" lumps every unnamed caller together.

Fix: an ignored file with a migration, an exclusion in the snapshot, reworded promises and a caller name on reads.

**I9. "Built" overclaims (line 10, flow table).**
- Step 5, "never weaker": with the reviewer's model ranked below the worker's, the tool said "advice, not a gate: done accepts this approve".
- Step 1: `new "No acceptance at all"` filed an issue.
- Step 4: the committed failing test is brief text at most, and section 5 calls it proposed.
- Step 8: the run in C2.

Fix: split the column into "the tool refuses" and "the brief asks".

## Minor

- **M1. Item 3.** Stages overlap: one issue showed "approved, not merged" on the jarl and "yours to tick" on the owner (`ball.mjs:449`). Right-to-left must sit below the idle and holds-up sort (`ball.mjs:431`), or the seven-line cut (`ball.mjs:23`) drops an idle worker. A coordinator that is not the `Merger:` holder has no merge rows, and where the owner reviews the top row is one it cannot move. The order is still harmless there.
- **M2.** Age in "ready" cannot be replayed from the log, because After and Files live in the file (`record.md:82`).
- **M3.** Item 11 only notes a repeat, while principle 3 says a retried call does nothing.

## What survives

- Refusals keyed on lease names are buildable under the lock. The log already holds those names, so the Acceptance, Tier, Kind and `decide` refusals need no new line. A worker's Changelog stays open.
- A slice-scoped ruling works today: `decided north-style · by north · applies to slice north`, and `next --as south` did not print it.
- Plain run lines pass `verify`, and the log merges them by union.
- `resume --slice --as`, `brief --slice` and the owner's list exist as the recovery table says.
- `status` and `next --as` agreed on a sent-back issue, on proof awaiting review and on an approved issue.
- Unknown segments on a merge line are ignored (`log.mjs:442-455`), so a check's witness could ride there.
- Refusing expiring leases still holds.
