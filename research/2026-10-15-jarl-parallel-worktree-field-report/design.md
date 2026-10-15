# Jarl in a long multi-agent session: the report against the code

Written 2026-10-15 by the coordinator of the 6.2.0 loop. Read-only: nothing in JarlSkill or in the loop was changed by this study; the issues it proposes are filed from [findings.json](findings.json). Inputs: [source.md](source.md); JarlSkill at `67615e6` (the code cited is `skills/jarl/scripts/jarl-lib.mjs` and `jarl.mjs`, and `skills/jarl/SKILL.md`, unchanged in these places since the pinned `2c12aa3`); the Jarl issues of the 6.2.0 loop. No probe was run: the one claim that depends on a reproduction (R1) is filed with the reproduction as its first step.

## The seven requests, one by one

### R1. `new` parses its fields into their own fields

The CLI and the MCP tool take `what`, `why`, `acceptance` (repeatable), `prio` and `tags` as separate flags (`jarl.mjs:245`), and `cmdNew` (`jarl-lib.mjs:955`) writes each into its own place; it reads nothing out of a text value. A `What` that contains `<why>…</why>`, `<prio>1</prio>` and a stray `</what>` is therefore what the caller put there: the fields were serialised into one parameter by the calling side, a mistake of a model writing a tool call, repeated on every call. That is a calling problem, but a reproducible one, and Jarl can defend against it at little cost: a `What`, `Why` or section text that holds a tag named after one of `new`'s own fields (`what`, `why`, `acceptance`, `prio`, `tags`, `files`, `kind`) is refused with a message that names the field and says to pass it as its own parameter; and the reply of `new` today is `filed NNN · <file>` and nothing else, so a caller cannot see that priority or tags were not taken. Proposed: the reply lists what was parsed (priority, tier, tags, the number of acceptance lines, the lengths of What and Why) and what was left empty (Why, Acceptance, Files, After, Where, Found by), each with the command that fills it, which also answers the report's 3.6. Filed as the first finding.

### R2. Numbers from one source shared by every worktree

Confirmed in the code: `cmdNew` takes the next number from the files of `issuesDir(root)` (`jarl-lib.mjs:992`). In the default mode (the loop out of git) a worktree has no `.jarl/` at all, so there is nothing to collide with and a call from a worktree is found by the script in the main checkout; in the committed mode a worktree holds the copy it was cut with (`SKILL.md:121-124`), and `new` run there counts that copy. The skill tells workers to pass the main checkout as `root` (`SKILL.md:406`), which the coordinator's workers did for evidence but not for `new`. Proposed, in this order of strength: `new` run with a `root` that is a linked worktree of a repository whose main checkout holds the same loop refuses, and names the main checkout; and it takes the highest number over the main checkout and every linked worktree of the repository (`git worktree list`), read-only, so a copy that lags cannot hand out a number already used. A shared counter file would be a second source of truth beside the files; it is not proposed. Filed as the second finding.

### R3. Evidence and claims in per-ticket files, no shared `log.md`, or auto-commit

Rejected as a change, kept as documentation. Evidence already lives in the issue's own file (an `## Evidence` section), one file per ticket, and the claim is the lease on that file; `log.md` is a line-per-event journal. In the default mode the loop is out of git on purpose (`SKILL.md:20`), so "always uncommitted" is the design: nobody commits it and nothing conflicts. In the committed mode `.jarl/.gitattributes` merges `log.md` by union and `decisions.md` by Jarl's own driver (`SKILL.md:21`), and the merger commits `.jarl/` with every merge. The coordinator's setup was the committed mode with workers committing on their branches and the main checkout also written to, which is the combination the skill describes as one place that commits: the merger. An auto-commit setting would put commits of the loop's state into the middle of every worker's history. The remaining gap is that the report's author did not find this: see R6.

### R4. After `review`, the next step

Confirmed. `cmdReview` returns the verdict, the reviewer's kind, the severities and the acceptance (`jarl-lib.mjs:2113-2142`); it does not say what follows. The flow is: approve, then `set <id> done` after the merge (the done gate wants evidence and a live approve), and a worker never closes. Proposed: the reply of an approve names the next step in one line ("approved; the merger merges and records it, then `set <id> done` with evidence"), and the reply of `changes` names the round (`round <id>`). Whether a ticket reads "approved, not closed" in status and in the list is issue 283 (in-flight rows carry the derived fact "approved and queued"); that is not repeated. `in-progress` is the lease (`SKILL.md:184`): it means the ticket is held by a worker, and stays until the ticket leaves it; that goes into the documentation of R6. Filed as the third finding.

### R5. Filters and a default view for `list`

Already served: `list` hides finished work by default (`jarl-lib.mjs:1109-1114`: done, dropped, deferred) and filters by `--status`, `--kind`, `--tag`, `--prio`, `--grep` and `--match <field>=<value>`; the MCP tool has the same fields. What it lacks is the view the report asks last, "which tickets wait for a reviewer", and that is issue 283 again. The gap that remains is that the reporter did not know of any of it: R6.

### R6. A recommended worktree workflow in `help`

The skill has it (the modes at `SKILL.md:20-24`, the worker rules at `:402-409`), but `help` prints each command's usage and the worktree recipe is not in it, and an agent that reads `help` and not the skill never sees it. Proposed: a short `help workflow` (or a closing section of `help`) with the three decisions the report's author had to make blind: which mode for a session with parallel workers (default, out of git, every call with the main checkout as `root`, unless the loop must travel with the branch), who commits `.jarl/` (the merger, never a worker), and who files tickets (the coordinator, or a worker with `root` set to the main checkout); and what `in-progress` means. The same text goes into `SKILL.md` where it is missing. Filed as the fifth finding.

### R7. A warning for code with no claimed ticket

Optional in the report; proposed as a note, never a refusal. `check --branch <b>` already reads a branch's diff for the changed files and the tests (`jarl-lib.mjs:2280`); it can also say that the branch carries commits and no issue holds a lease or a `Branch:` on it, which is exactly "work done without a ticket", seen at the merge. It does not change `ok`, in the spirit of issue 289. Filed as the fourth finding, with priority 3.

## What follows

Five issues for the Jarl release after 6.2.0, all in `JarlSkill`, none a blocker for 6.2.0: R1, R2, R4, R7 and R6. They are filed deferred to 6.3.0, as issue 281 and the other field-report items are; the owner decides whether any moves into 6.2.0. The first two protect the record from a wrong number or an empty section and would be the first to move.

## Limits of this pass

No scratch-loop probe was run, so R1's refusal and R2's collision are read from the code, not reproduced; each issue's first acceptance line is the reproduction. The report is from one session of one deployment.
