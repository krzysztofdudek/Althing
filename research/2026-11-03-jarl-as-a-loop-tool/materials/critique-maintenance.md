# Critique of the model, draft 2: the cost of maintaining it

**Question:** What does the model in [report.md](../report.md) cost to keep: how much it adds to Jarl's surface and manual against what it removes, whether every part stays on Jarl's line ("records, derives and displays; it never blocks code from landing"), whether one agent alone stays cheap, what it costs Horde and every existing loop, where it will drift from Horde, and which parts could be cut, merged or deferred with the least loss.
**Method:** Read the model (sections 1 to 12; Background as context). Read at JarlSkill 71ebc5b, with `git show` only: SKILL.md, `references/composers.md` ("What Jarl will not grow"), `references/record.md` (the log grammar, the format marker), `references/profile.md` (`external-scheduler`), the section list of `references/jarl.md`, the word count of every reference and the line count of the library. Read Horde at its `main` (596f3d8), read-only: `scripts/vendor/jarl.pin.json`, `scripts/jarl-profile.json`, the heads of `loop.mjs`, `brief.mjs`, `escalate.mjs` and `handoff.mjs`. Read the canon on Jarl and Horde (`family/canon.md`, `VISION.md`) and the open 6.3.0 loop with `ws jarl list --all` and `ws jarl show` (052, 073, 042, 058, 020, 022, 031, 076). The counts below are my own reading of the model's text; the model gives none.
**Status:** done
**Conclusion:** The model removes nothing and adds a great deal: by my count about 15 new concepts, 6 to 8 new commands or views, 7 new flags, 5 new goal lines and 8 new kinds of line, mark or state in the record, against zero commands removed and one prose section replaced. Its claim that the manual shrinks (section 6) is not backed by any deletion. It has no section on the record format or migration, and several of its parts change the log's positional grammar, which forces a format raise that Horde's pinned copy of the record (still at v6.1.0, profile format 1) will refuse. The ball is specified only for Jarl's built-in statuses, so on a Horde mission (every status set by the record, an external scheduler) it is undefined and competes with Horde's scheduler. Three brief renderers, two partitions of the backlog (slices and Horde's teams) and two lease-liveness notions would exist side by side and drift. The part worth the most for its cost is the ball as a read-only derivation, `next --as`, reading only what is already recorded (052 with 069, 070 and the reading half of 042): no format change, one flag, and it answers the sceptic's main finding that the gap is guidance, not capability. Promises, external waits, unchecked notes, writer rights, per-driver number blocks, loop-level brief templates and the review lease can be deferred or cut with little loss. Findings: 3 Critical, 7 Important, 5 Minor.

## What the model adds and removes, counted

| Kind | Added (my count from the model's text) | Removed or folded |
|---|---|---|
| Concepts an agent must learn | level (named), slice, holder of the ball, next move, driver, number block, promise, external wait, review lease, unchecked note, owner-only acceptance line, writer identity, liveness threshold, batch id, mandate of a ruling, double-lease conflict, the loop list: about 15 new (lease, reeve and coordinator exist) | the reeve's four occasions, recast as the escalation rule (the concept stays) |
| Commands and views | `brief`, the owner's digest, the jarl's view, the loop list, the since view, a command for a promise and its close, one for an external wait, one to mark a review raised, one to check an unchecked note, one for the owner to tick an acceptance line, one to reserve a number block, one to assign a slice; `next --as` and slice-scoped `status` and `resume` | none of the 38 commands |
| Flags | `--as` on every write, `--role`, `--slice`, `ask --to`, a batch id on `review`, a mandate on `decide`, an unchecked mark on notes | none (`status --stale-hours` stays beside the new goal threshold) |
| Goal lines | the jarl's name, coordinators with their slices (an extension of `Coordinators:`), `Model (jarl)`, `Model (coordinator)`, the liveness threshold in minutes, each driver's number block | none |
| Record lines, marks and states | writer on every write, slice label, review lease, promise, external wait, unchecked mark, owner-only acceptance mark, batch id | none |
| Issues | | 057 into 042, 069 into 052, 061 with 062, 049 into 004; 051 dropped, 048 recommended dropped |

Every new command or view in Jarl is paid for at least seven times over: the command table, the usage text, the MCP tool and its fields, its JSON shape in `commands.md`, the tests that keep the docs true (`docs-true`, `printed-texts`, `mcp`, `library-parity`), a `record.mjs` export when a composer needs it, and the guidance that tells an agent when to use it. Every new line kind in the log is paid for again in the reader (`record.md`, "When a header disagrees with the log": a positional grammar with a comma rule and a reason segment), in `verify`, and in every older reader that meets it.

## Critical

### C1. No section on the record format and migration, while several parts change the log's grammar (sections 2, 3, 4, 8, 11)

**What is wrong.** A write that names its writer (`--as`, section 2), a slice label (section 4), a review lease, a promise, an external wait, an unchecked mark and an owner-only acceptance mark (section 3), a batch id (040) and reserved number blocks (section 8) are all new things the log or the issue file must carry. The log is read by position (record.md, "When a header disagrees with the log": after the status come the free reason and then the lease fields in a fixed order, with the comma rule for lines before the marker). A reader that predates a new trailing field reads it as part of the reason, in silence; that is exactly the case the format marker exists for (record.md, "The format marker": a write an older reader would misread in silence raises the format first). So the model forces at least one format raise to 3. Horde vendors `record.mjs` at v6.1.0 (`scripts/vendor/jarl.pin.json`: ref v6.1.0, api `jarl-record/1`) and opens missions with a profile at `"format": 1`. The first write by the Jarl plugin into a mission that raises the format (an `ask --to jarl`, a write with `--as` through the MCP tools, a batch verdict) makes Horde's own copy refuse its own mission on every command. The model says none of this; section 11 maps issues but never the format.

**Change.** Add a section "The record and its format" that lists every change the model makes to what is written, and for each says: additive and readable by a format-2 reader (a new kind of line that old readers already ignore as a note), or format-raising. Collect every format-raising change into one raise to 3 inside 6.3.0, never several across releases. File with it, in the same release, the Horde issue that re-vendors the record and states what Horde does with each new line (pass through, use, or refuse in its profile). Prefer derivations that need no new line: of the parts above, only the owner-only acceptance mark (039) and the batch id (040) carry enough value to justify a raise this release; the rest can wait (I4, I5, I3).

### C2. The ball is defined for Jarl's built-in statuses only; on a profiled loop, and on every Horde mission, it is undefined (sections 3, 9)

**What is wrong.** The table in section 3 names holders by statuses and events of the built-in profile: ready, in a lease, approve not merged, a changes verdict. A profile can name its own statuses, and Horde's does (`jarl-profile.json`: proposed, queued, running, landed, changes, blocked, merged, dropped, each `"set-by": "record"`, plus `"external-scheduler"`). Under `external-scheduler`, `next` and `queue` already step aside and print the composer's command (profile.md). The model does not say what `next --as` prints there. Either Jarl computes holders for Horde's statuses, in which case it second-guesses `tick.mjs` and sits close to item 5 of the line ("a computed schedule"), with "most blocking first" read across After as a critical path in miniature; or it steps aside, and then section 9's "a Horde mission may map its architect onto the jarl and run its tickets as one slice" and scenarios 1 to 5 hold for no mission at all. Both cost: the first a second scheduler that drifts from Horde's, the second a model whose central derivation does not reach the family's other loop.

**Change.** Derive the holder from the profile's flags, never from status names: a status flagged `dispatchable` is held by whoever runs the slice (or by the scheduler the profile names), one flagged `holds-claim` by the leaseholder, and verdicts, questions, rulings and owner sign-offs by their own rules, which do not depend on statuses. Under `external-scheduler`, `next --as` lists only what is not scheduling (questions, verdicts awaited, owner sign-offs, rulings with open Settles) and names the composer's command for the rest, the way `next` already does. Order the list by kind of hold (on the owner first, then by direct dependents only) and write in section 3 that the order is a display, not a schedule. Add one scenario that runs `next --as` on a loop opened with Horde's profile.

### C3. The manual does not shrink: nothing is removed, and section 6 claims the opposite

**What is wrong.** Jarl's guidance at 71ebc5b is about 33,800 words (SKILL.md 2,763; commands.md 8,129; jarl.md 4,464; record.md 3,953; profile.md 3,537; merger.md 2,372; composers.md 2,337; repositories.md 1,920; models.md 1,786; worker.md 1,220; reviewer.md 700; glossary.md 647), already more than the 33,000 the report counted at a1132a8. Section 6 says the guidance an agent must read "shrinks to its brief and its row of the table in section 2; the references stay for whoever wants depth". But the brief's "role's contract" is new text that must agree with worker.md, reviewer.md, merger.md and jarl.md, so it is one more copy, not fewer. Every addition counted above lands in commands.md, glossary.md and the role references, and none of the model's lines retires a section. The reeve section of jarl.md and the relay are not deleted, only "replaced" in a sentence of section 5. A coordinator still has to learn slices, the ball, the escalation list, promises, waits, unchecked notes and when to raise a review lease. Background ("Less to read") makes the shrink depend on fr-18, every refusal carrying its corrected command, which is issue 053, and section 11 does not map 053 at all.

**Change.** Add a table "What goes" beside section 11, naming each piece of prose the model retires and where its content now lives: the reeve section and the relay of jarl.md (into the coordinator's row and its brief), the role references' step lists (into the brief's contract, which is then read from those references as their single source, not written a second time), the "daily commands" table of SKILL.md (into `next --as`, which names the command). Set a word budget for 6.3.0, for example that SKILL.md plus the five role references end no longer than they start, and check it in the skill-shape test. Map 053 into section 3 and make it part of the core, since it is what lets prose go. Fold the three views into one (M5).

## Important

### I1. Three brief renderers, and a fourth copy of each role's contract (section 6)

**What is wrong.** Horde has `brief.mjs` (renders `reference/roles/<role>.md` from the charter, the node and the ticket, and inlines the role's discipline). Althing has `ws brief <role> --issue <id>` with templates per release, as section 6 says. The model adds Jarl's `brief --role` with six roles and, later, loop-level templates in `.jarl/briefs/`. Three renderers of one idea, each with its own template language and its own idea of what a role must be told, will drift; a rule changed in one reaches only the agents briefed by it.

**Change.** Give Jarl only the record half: a read-only `brief <id>` (058) that prints `show`, the standing brief of 020, the findings of earlier rounds, the rulings that touch the issue and the exact command that records the result, and export the same data through `record.mjs` as an additive function of `jarl-record/1`. Horde's `brief.mjs` and `ws brief` then render from that data instead of assembling it again. Leave the role's contract to the role reference it already lives in (link it, do not restate it). Defer `--role` beyond worker and reviewer, and defer `.jarl/briefs/` templates until a second loop besides Althing's needs them.

### I2. Slices as a new one-value label, beside Horde's Team field and the owner's "a tag is enough" (section 4)

**What is wrong.** The owner said a tag is enough to mark a slice (README, 2026-11-03). The model makes it a new label of one value per issue, which means a new header field, a log line kind to move it, a command to set it, and `verify` rules. Horde's profile already partitions tickets by a field, `Team` (default `trunk`), with its own leases under `teams/<team>/queue.json`. Two partitions of one record, a slice and a team, would sit in every mission; section 9 maps a whole mission onto "one slice", which throws Horde's teams away instead of reading them.

**Change.** Let a slice be the value of a field the profile names, defaulting to tags carrying a fixed prefix in the built-in profile (`slice:<coordinator>`, filtered by the existing tag code) and to `Team` in Horde's profile. Add one flag, `--slice`, to `next`, `status` and `resume`, reusing `list --tag`'s filter. Keep "one slice per issue" as a `verify` warning, not a new field with its own grammar. No new command to assign a slice: `tag` already does it.

### I3. Per-driver number blocks add goal churn and a second mechanism on top of the one that is safe anyway (section 8)

**What is wrong.** A block per driver "recorded once in the committed goal" means every new machine or session edits `goal.md`; two clones that each add a driver at once are the very race the blocks exist to prevent, and the model admits it is caught only by "the detection 031 adds". So 031's detection and refusal is the real safety, and the blocks are a second mechanism above it. Blocks also produce gaps and, in a loop past a few drivers, numbers of 1000 or more, which the format marker treats as a format raise (record.md). And 022 was filed for a different need: the owner's series kept apart by number (a film from 1000), not collision-proof ids. Folding 022 into an id mechanism makes both harder to explain.

**Change.** Ship 031 as filed (detection, refusal of every move by a doubled number, honest docs) and 032. Keep 022 as the owner's series feature. Rewrite scenario 4's acceptance from "no two issues share a number" to "two issues that share a number after a merge are reported by `verify` with both files, and no move lands on both", which 031 already meets. Decide the id design only if the live run of scenario 4 shows collisions are frequent enough to need it.

### I4. Four new record kinds or marks for a finding the sceptic lowered (sections 3, 11: 073)

**What is wrong.** Promise, external wait and unchecked note are new kinds, each with a lifecycle (create, close or check, expiry by date or event), so each brings commands, JSON, docs and tests, and each changes the format (C1). Issue 073 was lowered to medium by the sceptic, who noted that rules, decisions and questions already survive compaction, and the Background itself says most losses "came from records not made, not from records Jarl cannot hold". An unchecked note that "cannot be cited by a ruling" is a new refusal path through `decide`.

**Change.** Defer promise, external wait and unchecked notes to a later release. Meanwhile a promise is an issue of a kind the profile declares (profiles already declare kinds), with the agent as worker; an external wait is an issue with a `Waits on:` field or an `ask` of its own kind; both then appear in the ball through the rows that already exist. Keep the owner-only acceptance mark (039): one mark, read by the existing done gate, with real value in work that is not code.

### I5. A permission matrix by level, invited to become a refusal (section 2)

**What is wrong.** "A level writes only what its row allows; a write outside it is a note on stderr … until the owner rules otherwise" puts a table of levels against write kinds into the code, keeps it in step with section 2's table and the references, and prints notes agents ignore. The phrase "until the owner rules otherwise" plans its growth into a role-permission system, which is policing, not recording. It also needs the writer on every write (C1) to work at all.

**Change.** Cut it. Who did what is already recorded where it matters (`review --by`, `set --worker`, `decide --by`); add `--by` to `ask` and `new` only, as an optional field written into the line a format-2 reader already treats as reason text, or behind the single format raise of C1.

### I6. One agent alone: the minimum is asserted, not tested, and two parts grow it (sections 2, 3, 7, 10, 12)

**What is wrong.** Section 12 asks whether the levels make Jarl heavier alone and the model leaves it open. Two parts grow the minimum: a write that names its writer (`--as`, "or the session's configured name"), and `init` asking for five model lines (`Model (jarl)`, `Model (coordinator)` and three tiers). The ball table has no row for the lone agent's real state, which thought experiment 1 names: a code issue with proof that only a fresh session can review is on the owner ("start a fresh session to review 7, 9 and 12"); section 3 puts it on "its coordinator, raise a reviewer", which is the lone agent itself, who cannot. All five scenarios test the crew; none tests the minimum.

**Change.** State in section 2 that an unnamed writer is the jarl and no write needs `--as`; that `init` asks nothing it does not ask today (model lines stay optional and are offered once, by `next --as jarl`, when a spawn is first leased). Add the lone-agent row to section 3 (proof, no verdict, and no coordinator declared: on the owner, "start a fresh reviewer for N, M"). Add a sixth scenario: one agent alone runs a loop from `init` to `close` with only `init`, `new`, `next`, `evidence`, `set done`, `ask` and `decide` plus the owner's review, and no goal line beyond the goal.

### I7. Section 11 leaves open issues of the same area unmapped, so they will be built a second time (section 11)

**What is wrong.** The loop holds Jarl issues the model's parts cover but section 11 does not name: 043 (a ruling no merged issue implements, the same as the ball's "ruling whose Settles issues are not done" row), 008 (an issue handed to a new worker without a stale alarm, which is the replacement and takeover rows), 066 (the takeover limit fixed at three, which the ball table hard-codes as "after three rounds"), 053 (refusals with a ready command, see C3), 060 (resume shows an answered question instead of its decision, which the jarl's resume must get right), 065 (short forms of report and models, the same need as the seven-line cap) and 020 (the standing brief, which sections 3 and 6 lean on). Unmapped issues get worked from their own acceptance and land beside the model's version of the same thing.

**Change.** Extend section 11 to every open Jarl issue in 6.3.0, each with kept, folded into which, reshaped, deferred or dropped, so that no worker builds a second derivation of a row the ball already has. Fold 043 into the Settles row, 008 into the replacement row, 066 into a goal line read by the takeover row, 053 into the core with 052.

## Minor

### M1. Model lines per level duplicate the tiers (section 7)

**What is wrong.** The owner's levels map onto the tiers that exist: strong for the jarl, medium (standard) for coordinators. `Model (jarl)` and `Model (coordinator)` beside `Model (strong)` and `Model (standard)` are two lines that say the same thing and can disagree.

**Change.** Let the level name its tier (jarl: strong; coordinator: standard by default) and read the model from the tier line. Land 038 (one model under two spellings) first, or the counts split by level as well.

### M2. `ask --to jarl` adds an addressee where a kind already exists (section 5)

**What is wrong.** `ask` already takes kinds (ratify among them). A second dimension, the addressee, is one more flag to document and to read in every view.

**Change.** Make the escalation a kind of ask (`--kind escalation`, held by the jarl); the four occasions of section 5 become the guidance for when to use it.

### M3. Two liveness knobs (section 3)

**What is wrong.** A goal threshold in minutes beside `status --stale-hours` and resume's fixed six hours leaves two knobs and a default that disagree.

**Change.** One goal line, read by `status`, `resume` and `next --as`; `--stale-hours` stays only as a one-call override, and the docs say so in one sentence.

### M4. The review lease is a new state where a derivation may do (section 3, open point 1)

**What is wrong.** A review lease is one more state with its own line, its own liveness and its own expiry questions, and it overlaps Horde's leases in `queue.json`.

**Change.** Defer it: the row "branch with proof and no verdict since" already holds the ball on the coordinator, and the liveness of that row (age since the last proof row) shows a review that never came back. Add the state only if the live run of scenario 3 shows the coordinator cannot tell "not raised" from "raised and silent".

### M5. Three views where one flag does (section 3)

**What is wrong.** `next --as`, the owner's digest and the jarl's view are three outputs with three JSON shapes to document and test.

**Change.** The digest is `next --as owner --all` (every line, not seven); the jarl's view is `next --as jarl` plus one per-slice count line in `status --slice`. One view, one shape.

## What could go, and what carries the most

| Part | Proposed handling | Loss |
|---|---|---|
| promise, external wait, unchecked notes (073) | defer; express as profile kinds and asks | low: sceptic lowered 073; most losses were records not made |
| writer rights by level | cut | none: recorded where it matters |
| per-driver number blocks (022 as id) | defer; ship 031 and 032 | low: 031 refuses the damage |
| loop-level brief templates, `brief --role` beyond worker and reviewer | defer | low: Horde and Althing render their own |
| review lease | defer behind scenario 3's live run | low |
| slice as a new label | tags or a profile-named field, one flag | none |
| owner's digest and jarl's view as separate views | fold into `next --as` | none |
| 063 mandate, 068 coordinator slips | defer | low |

The single part that carries the most value for its cost is the ball as a read-only view, `next --as <holder>`, computed from what the record already holds, with each line naming the existing command that moves it (052, with 069, 070, 053 and the reading half of 042). It adds one flag and no record line, so no format raise and nothing for Horde to re-vendor; it brings the existing commands to the agent at the moment they are needed, which is the sceptic's first gap; and it is what lets prose leave the references.
