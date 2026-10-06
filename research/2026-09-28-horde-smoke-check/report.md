# Horde smoke check, release/6.1.0 (issue 518)

Replaces the replay measurement (the 6.1.0 ruling that a smoke check replaces the measurement): one small real mission, end to end, to confirm the rebuilt Horde works as designed. Run by a coordinator's worker on 2026-09-28; saved here by the coordinator.

**Verdict: works with issues.** Init, charter, cut, consult, architect review, two tickets, two workers, reviews, gate, a node ruling, wave close, retro and `done` all ran. The Grain measure is in the client report and the ruling reached the node's Yggdrasil log. Two workarounds were needed on the way (519, 523); nine defects were filed (519–527).

## Setup

- Yggdrasil `release/6.1.0` @ `4f097e322`, Grain `release/6.1.0` @ `3948f5d`, Horde `release/6.1.0` @ `d3a0997` with Jarl vendored.
- Toy repository: Node ESM with a strings and a math module, tests under `node --test`, nine commits of history.
- Goal: add `truncate(input, max, ellipsis='…')` with a test (E1) and export it with `npm test` green on trunk (E2).
- Nine agent spawns, each with an explicit model: architect (Opus) ×2, consultants ×2, workers ×2, reviewers ×2, retro ×1.

## Steps

| # | Step | Result | Issue |
|---|---|---|---|
| 1 | `horde init` | Horde created; Grain accepted. `yg adopt` refused Grain's proposal (`parent-type-forbidden`) because `grain propose` asked the `yg` on PATH (6.0.0) instead of the configured one; the `yg init` graph was left uncommitted and trunk cut before it. Worked around by hand. | 519 (P1) |
| 2 | Charter | Written with two evidence rows. | — |
| 3 | Cut | Accepted and leased; the Grain score failed on a two-territory cut because Grain's partition counts a parent's whole subtree and Horde counts owned files. | 520 |
| 4 | Consult | Tickets filed as proposals with ports; consultants first refused because the brief's example leaves the acceptance placeholder. | 521 |
| 5 | Architect review | Both tickets passed with reasons; queued. | — |
| 6 | Ticket 001 | Red→green test, review with two Minor findings, all nine gate checks green, merged with trailers. | — |
| 7 | Ticket 002 | Review sent it back correctly (out-of-scope test file). Then the gate asked for a `No new tests` declaration no Horde command can set; the next tick reused the old gate result for the same commit and counted a round; the fix-round brief did not say why. Worked around with an empty commit. | 523 (P1), 524, 522 |
| 8 | `decide --node` | Recorded for the node's log. | — |
| 9 | Wave close | Refused: nothing in the mission path opens a wave. | 526 |
| 10 | Retro | Counted zero gate refusals (last land file overwrote the history); taste entries left as untracked files. | 525, 527 |
| 11 | `done` | Evidence 2/2 green, trunk gate green, Grain measure in the report (files 7→9, imports kept inside 75%→80%), ruling committed into the node's log, horde archived; `yg check` passes and `npm test` is 10/10 on the final trunk. | — |

## Worked as designed

Grain required at init; the cut's structural checks, leases and evidence layer; proposals held until the architect passes them; the ticket record on Jarl (statuses only through the tools, ordering from ports, `jarl.mjs list` reads the archive); one review per ticket with Important findings sending work back; the nine-check gate with a revert test; the node ruling reaching Yggdrasil's log at `done`; the before/after Grain measure in the client report.
