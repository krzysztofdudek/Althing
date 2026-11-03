# Revision: how draft 3 of the model answers the three critiques

Draft 2 of [report.md](../report.md) was reviewed by three fresh Opus critics: [fidelity](critique-fidelity.md) (F), [maintenance](critique-maintenance.md) (M) and [technical soundness](critique-technical.md) (T). Between the critiques and this revision the owner ruled in the 6.3.0 loop (rulings one-format-raise-horde-later, two-machines-caught-at-merge, owner-sign-off-with-material, jarl-language-agnostic, subagents-can-nest, sixth-scenario-one-agent-alone and approval-defined-by-the-loop) and gave input recorded in the README (rules with a scope, sub-issues). Every finding is answered below: **accepted** (the change is made as the critic proposed), **changed** (the point is taken with another change, which the row names), or **rejected** (with the reason). Section numbers refer to draft 3.

## Fidelity

| Id | Rank | Answer |
|---|---|---|
| F-C1 | Critical | Accepted as resolved by the owner: "a subagent can run subagents" (README). A coordinator raised by the jarl raises its own workers and reviewers and waits on them; nothing goes through the jarl but escalations (section 5). Not verified by a run here; scenario 1's live run checks it. |
| F-I1 | Important | Accepted: a slice is a tag `slice:<coordinator>`, his own suggestion; `tag` refuses a second `slice:` tag on one issue (section 4). A slice can be a subtree of the backlog through sub-issues (078), which answers "if it created the backlog and there is a hierarchy in it". |
| F-I2 | Important | Changed: the permission matrix by level is cut (M-I5). The protection the critic wants already exists where the field report asked for it: done needs a fresh approve, a self or coordinator approve does not count, and the owner-only line holds done (section 6). Jarl cannot verify who an agent is, so refusing writes by level would be theatre. |
| F-I3 | Important | Accepted: 044 is reshaped, not deferred: requirements become a branch of the issue tree with a Source (078), and `import` reports findings whose text changed since filing; a separate "requirement item" concept is dropped because the tree carries it (section 11). |
| F-I4 | Important | Accepted: the field report's rank rule stays as a built-in rule with a scope (reviewer, on format, contract or visual work: one rank above the worker), with no counting in `models` (section 6). |
| F-I5 | Important | Accepted and put to the owner: he chose "caught and repaired at the next merge" (two-machines-caught-at-merge); section 8 says which collisions are prevented and which are caught. |
| F-I6 | Important | Accepted: the lone agent is in the one-page model and has its own ball row and a sixth scenario; `review` is in its minimum (sections 2, 3, 10). |
| F-I7 | Important | Accepted: the levels table has "May read" and "May raise" columns (section 2). |
| F-I8 | Important | Accepted: the model opens with four sentences in the owner's terms; strong, medium and light map once onto Jarl's strong, standard and light tiers; the reeve becomes the coordinator (top, section 2). |
| F-I9 | Important | Accepted: an issue a worker or reviewer files carries the slice of the coordinator that raised it; the brief's filing command holds the tag (section 4). |
| F-M1 | Minor | Accepted: section 1 opens with "yes, every call takes `root`", and a session can name its loop once (section 1). |
| F-M2 | Minor | Accepted: the record fixes are justified by honesty of the record, not by a measurement the owner refused (section 9). |
| F-M3 | Minor | Accepted: the one-line return binds coordinators, workers and reviewers; the jarl talks with the owner in full (section 5). |
| F-M4 | Minor | Accepted: one liveness threshold in minutes in the goal, default 30, asked for nowhere and used everywhere (section 3). |

## Maintenance

| Id | Rank | Answer |
|---|---|---|
| M-C1 | Critical | Accepted: section 9 lists every change to what is written, says which raise the format, and collects them into one raise to format 3 in 6.3.0 (ruling one-format-raise-horde-later); a loop under a composer's profile is never raised, so Horde's missions keep working until Horde re-vendors in a later release. |
| M-C2 | Critical | Accepted: holders are derived from the profile's flags and from verdicts, questions, rulings and sign-offs, never from status names; under an external scheduler `next --as` lists only what is not scheduling and names the composer's command for the rest; the order is a display, not a schedule (section 3). |
| M-C3 | Critical | Accepted in part: section 12 names the prose the model retires (the reeve section and its relay, the role step lists that become built-in rules with a scope, the daily commands table) and sets a word budget: SKILL.md and the role references end no longer than they start, checked by a test. Rejected in part: the references stay as the single source of each rule's text; the brief quotes them, it does not restate them. |
| M-I1 | Important | Accepted: Jarl provides the record half only, `brief <id>` and `brief --slice <s>`, read-only, exported through the record library as an additive function; role contracts stay in the role references; loop-level templates are dropped from 6.3.0 (section 6). |
| M-I2 | Important | Accepted: slices are tags with a fixed prefix, filtered by the scoping `status --tag` already has; one flag `--slice` on `next`, `status` and `resume`; no new field (section 4). A profile naming another field (Horde's Team) waits for Horde. |
| M-I3 | Important | Accepted: per-driver number blocks are dropped; 022 stays the owner's series feature; ids are made safe by a key per issue (T-I5) under the owner's "caught at the merge" (section 8). |
| M-I4 | Important | Changed: promise and external wait stay in 6.3.0, as two built-in kinds of issue, so they use the rows the ball already has and need no lifecycle of their own; unchecked notes are dropped (section 3). |
| M-I5 | Important | Accepted: the permission matrix is cut; who wrote is named per call (`--by`), never by a server default (sections 2, 9). |
| M-I6 | Important | Accepted: an unnamed writer is the jarl, `init` asks nothing new, model lines stay optional, and a sixth scenario runs a lone agent (sections 2, 10). |
| M-I7 | Important | Accepted: section 11 maps every open Jarl issue of the 6.3.0 loop that the model touches. |
| M-M1 | Minor | Accepted: a level names its tier (jarl strong, coordinator standard) and reads the tier's model line; no per-level model lines (section 7). |
| M-M2 | Minor | Accepted: escalation is an `ask` kind held by the jarl, not an addressee flag (section 5). |
| M-M3 | Minor | Accepted: one goal threshold read by `status`, `resume` and `next --as`; `--stale-hours` stays a one-call override (section 3). |
| M-M4 | Minor | Accepted: no review lease; "proof, no verdict since" holds the ball on the coordinator with its age (section 3). |
| M-M5 | Minor | Accepted: one view, `next --as <holder>`; the owner's digest is `next --as owner --all`, the jarl's view is `next --as jarl` with `status --slice` counts (section 3). |

## Technical

| Id | Rank | Answer |
|---|---|---|
| T-C1 | Critical | Accepted: under the lock, a move into a status that holds the claim refuses an issue already leased unless the call names a takeover or handover with its reason (the path of 008), and refuses files or resources another lease holds, naming holder and slice; in a loop with more than one active slice, a lease on an issue with no declared Files or Resources is refused with the command to declare them. This is a refusal at the level of the record, like the self-approve (section 4). |
| T-C2 | Critical | Accepted: waiting is separated from returning. A level waits on agents it raised itself and returns only when the ball is on someone it did not raise (section 5). With the owner's word that subagents nest, the coordinator holds its workers and the jarl hears only escalations. |
| T-I1 | Important | Accepted: section 9 tables the new state, and section 3 cites the in-flight marks of `status` and `resume` as the built base of the ball. |
| T-I2 | Important | Accepted: one merger for the whole loop, named in the goal (`Merger:` a coordinator or the jarl); every "approve, not merged" is that holder's, and only it raises the merger, one at a time (sections 2, 3). |
| T-I3 | Important | Accepted: a holder is always a level that persists (owner, jarl, a named coordinator, a named outside person); workers and reviewers appear as doers under their coordinator with their liveness (section 3). |
| T-I4 | Important | Accepted: lease lines name their writer under the format raise; two leases with no move out between them by different writers and no takeover are a conflict for the jarl; `verify` refuses an issue file holding git conflict markers (section 8). |
| T-I5 | Important | Accepted: every issue gets a key at filing, written on its header, its filed line and every log line about it, under the format raise; numbers are taken over every local and remote-tracking ref; a number taken twice is renumbered at the merge, the key telling the moves apart (section 8). |
| T-I6 | Important | Accepted: no server-wide writer name; the writer is named per call and an unnamed write shows as unnamed; the writer sits in a fixed position that an older reader refuses under the raise (section 9). |
| T-I7 | Important | Accepted: corrected; `status --tag` already scopes; the slice views build on it, and an escalation names its slice or issue so it stays in the slice's view (sections 4, 5). |
| T-I8 | Important | Accepted: across slices only leases hold; the in-list reservation of `next` applies within the asker's slice (section 4). |
| T-I9 | Important | Accepted: issue 076's acceptance already carries the clock seam, the seeded oracle for replacement and red on a behavioural assertion at 71ebc5b. |
| T-I10 | Important | Accepted: section 9 says Horde reads only what its vendored copy knows, that the jarl-record/2 contract comes with the raise, and that Horde re-vendors in a later release (ruling one-format-raise-horde-later). |
| T-M1 | Minor | Accepted: no `Model (jarl)` line (M-M1). |
| T-M2 | Minor | Accepted: the Settles row is narrowed to a ruling that names work and settles no live issue (section 3). |
| T-M3 | Minor | Accepted: liveness says which clone and refs it read (section 3). |
| T-M4 | Minor | Accepted: unchecked notes are dropped (M-I4). |
| T-M5 | Minor | Accepted: discovery walks the tree with stated bounds, the root loop stays the default where it exists, and other loops are listed in a note (section 1). |
| T-M6 | Minor | Accepted: built and proposed are separated in every row of draft 3. |
