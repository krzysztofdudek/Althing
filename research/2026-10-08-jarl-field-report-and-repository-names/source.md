# The field report, as it arrived

A field report from a private deployment; its origin is not named here. It was relayed to the architect on 2026-10-08 already summarised, in English; it is kept here as relayed, numbered as it arrived. The report calls the project "a loop in another project" and names nothing else. The check of each item against the code is in [design.md](design.md), part B.

## The loop it comes from

A coordinator ran a multi-day loop: about 250 issues, three to four parallel workers in worktrees, a fresh reviewer per change, `--no-ff` merges and a full gate after each, all through the MCP tools with an explicit root.

## Works well

- One tool changes state and writes the log line.
- The done gate (ran/saw since the last in-progress, an approve newer than the last round) really protects.
- The fresh, coordinator and self reviewer classes.
- Rounds with a counter.
- The stderr notes at `set done`.
- Multi-id calls.
- Root on every call, and the refusal of relative paths.
- `decide --supersedes` and `decisions --live`.
- After blocking `next`.

## Could be better

1. "CI pending" forever when nothing is pushed. Wants the local gate to count as the check (for example a `Check:` line in goal.md treated as CI, or `merged --ci local`).
2. No "ready for review" state between in-progress and done. A worker tried `ready` and was refused.
3. Merged, but the gate after it red for an outside reason: there is no place for that state.
4. Big issues worked in parts and rounds make `show` huge and eat agents' context. Wants `show --brief` (header, acceptance, the last N evidence rows) or sub-parts.
5. `status --by tag` is too long for a multi-scope loop. Wants `status --tag x`.
6. The owner is rarely available. Wanted a background queue of decisions for the owner, linked to issues, not one ask = one answer (for example an owner tag shown in status, or `ask --defer`).
7. Acceptance that cites a ruling later superseded: `check` could warn.
8. Unclear whether the same fresh reviewer may approve again after a round. One sentence of docs.
9. Workers' free-text evidence is very long and mixed with the ran/saw rows. A length limit, or a hint to keep long summaries in a file and link it.

## Works badly

- Several workers at once collide on shared resources (ports, a database server, machine load) that `next` cannot see. Wants an issue to declare an exclusive resource (for example a pseudo-file `resource:gate`) that `next` respects.
- After a context compaction the coordinator relied on the summary instead of handoff or resume. The skill should push harder to hand off before long sessions and periodically.
