# Blocks and the composer: Horde on Jarl's engine, Grain in the architect's hands

Research for the 7.0 line, not for 6.1.0 (loop issue 439). Date 2026-09-27. Read-only against every tool repository. Sources as read: Horde `release/6.1.0` @ bbd50bb, Jarl `release/6.1.0` @ f4e5c55 and `jarl/424-mcp` @ 59fe8de, Grain `release/6.1.0` @ 07e914f, Yggdrasil `release/6.1.0`, the family canon (now `family/canon.md`), `VISION.md`, and the rulings of the 6.1.0 loop.

Path conventions: `H/` is `Horde/skills/horde/scripts/`, `J:` is `JarlSkill/skills/jarl/scripts/jarl.mjs`, `JS:` is `JarlSkill/skills/jarl/SKILL.md`, `G/` is `Grain/plugins/grain/`. Line numbers are on the commits above.

## The concept under test

Krzysztof, 2026-09-27 (translated from Polish): "Then Yggdrasil, Grain, Jarl are the blocks, and Horde is the composer. Horde's architect would have Grain for measurements too." and "I like this concept, because each block builds on another." Yggdrasil is law, Grain is measurement, Jarl is the work loop, each an independent block. Horde becomes the composer. It runs on Jarl's loop engine through a few generic extension points. It keeps only what is truly its own: architect, refine onto the graph, landing gate, legislate, audit, drill, retro, escalate, report, trunk. Jarl's code must never know the words "wave", "architect" or "node".

## Summary

The concept is sound as a direction. But the premise that Horde's loop scripts "duplicate Jarl" holds only for the record, not for the behaviour. Horde's copies either act on state where Jarl only records it, or they carry invariants that Jarl's defaults would break. Five findings carry the rest of this report:

1. **Jarl's own boundary forbids most of what Horde's loop does.** `JS:547-556` ("What Jarl will not grow") was written two days ago, from finding jarl-2-B11 of the 2026-09-25 Jarl research. It excludes:
   - a merge queue that runs the check and refuses;
   - a CI-gated done;
   - leases that expire or are taken over;
   - territory locks across loops;
   - a computed wave or critical-path planner.

   Horde's `land.mjs`, `tick.mjs`, `queue.mjs` and the `_lib.mjs` leases are exactly those. The redesign therefore needs a ruling on that paragraph before any code moves (decision 1).
2. **What truly moves to Jarl is small**: roughly 4,000–5,500 of Horde's ~23,100 script lines. The parts that dissolve into Jarl:
   - `handoff.mjs` (165 lines);
   - `decide.mjs` (203);
   - the record half of `tk.mjs` (1,376);
   - parts of `queue.mjs` (1,944), `ask.mjs` (285) and `status.mjs` (240);
   - the scheduling core of `tick.mjs` (1,187).

   `report.mjs`, `wave.mjs` and `blame.mjs` are listed in issue 439 as duplicates, but Jarl has no equivalent for any of them. In exchange, Jarl (2,763 lines today) would grow about ten extension points, not four.
3. **Jarl has no merge.** `J:947-951` records a merge; it never makes one. Horde's `land.mjs` makes the merge itself, transactionally: a catch-up merge with rule-based conflict resolution, a sha pin, and a compare-and-swap `update-ref` at `H/land.mjs:3440`. A yes/no "gate before done" command cannot carry that. Either Jarl gains a merge executor, or Horde's land keeps merging and only records into Jarl (decision 2).
4. **The review semantics are opposite.** Jarl's `done` requires a live approve from a fresh reviewer (`J:902-913`). Horde's reviewer has no verb that signs (`Horde/skills/horde/reference/model.md:62-68`), and trust is "manufactured in one place", the gate (`model.md:126-141`). This needs either a profile-declared done policy or a change to one of the two models (decision 3).
5. **Grain serves the architect only in pieces.** The primitives exist in the engine: `typeEvidence` counts co-change inside and crossing any file set (`G/engine/propose-levels.mjs:134-149`). But:
   - no command returns a partition score;
   - no command drafts rules against an existing graph (`advise` reserves `kind: rule` and never emits it);
   - no metric can be scoped to a commit range;
   - Horde calls none of Grain's co-change today.

Section 6's verdict, the time-sensitive part:
- **434 proceeds now.**
- **426 proceeds now.**
- **436 splits**: the Horde side proceeds; the Jarl side shrinks to a generic hook or waits.
- **431 shrinks** to the surface that survives 7.0, or waits.

## 1. Map of every Horde script and mechanism

Verdict key:
- **keep**: stays in Horde;
- **move**: Jarl already has it, Horde deletes its copy;
- **EP**: becomes a Jarl extension point, with the kind named;
- **split**.

### 1.1 The table

| Script | Lines | What it is | Closest Jarl | Verdict |
|---|---|---|---|---|
| `tk.mjs` | 1,376 | Tickets: create with graph and charter validation, list, show, status, per-ticket log, grep, review-close/skip, rounds, edit, move (`H/tk.mjs:87-178`, main `:1360-1372`) | `new`, `list`, `show`, `set`, `body`, `files`, `after`, `round` | **split**: the record goes to Jarl; validation, review-close and the round cap become EPs |
| `queue.mjs` | 1,944 | DAG of tickets, readiness, worktree provisioning, merged bookkeeping, `plan` (critical path), `quality` from Grain advice, `reconcile` of ended workers (`H/queue.mjs:323-336`, `:716-768`, `:1133-1254`, `:1339-1570`, `:1829-1910`) | `after`, `next`, `set in-progress --branch`, `branches`, `queue` | **split**: readiness via EPs (claims, deps, comparator); plan, quality and reconcile stay |
| `ask.mjs` | 285 | The client channel. Kinds stop, stuck, lower, charter; answers become decisions with Kind, Territory, Aspect, Scope (`H/ask.mjs:53`, `:157-197`) | `ask`, `answer` (`J:2083-2113`) | **EP**: ask schema, answer template, hooks; the holds stay |
| `decide.mjs` | 203 | Rulings; refuses `--node` and prints a `yg log add` redirect (`H/decide.mjs:126-134`) | `decide`, `decisions` (`J:2130-2146`) | **move**, plus a pre-decide validator EP |
| `handoff.mjs` | 165 | Writes handoff.json/md (`H/handoff.mjs:41-145`) | `resume` (`J:2187-2227`); handoff retired by the ruling that the handoff comes from the CLI | **move** (delete); Horde's sections via a resume-contributor EP |
| `status.mjs` | 240 | Digest across hordes (`H/status.mjs:46-152`) | `status`, `resume`, `branches`, `tips` | **split**: counts come from Jarl; gate cache, evidence and leases become contributors |
| `report.mjs` | 219 | Client page `horde-report/1` (`H/report.mjs:109-139`) | `report` (`J:2313-2344`), a different audience | **keep**, driven by event hooks |
| `wave.mjs` | 1,524 | Journal `plan.md`, wave start/close, evidence catalogue, law diff and audit at close (`H/wave.mjs:98-116`, `:199-245`, `:1214-1440`) | none; refused at `JS:555` | **keep**; `noteMerged` and `noteFate` subscribe to an on-merged hook |
| `blame.mjs` | 490 | Line → landing merge `Ticket:` trailer → ticket → evidence and verdicts (`H/blame.mjs:197-368`) | none | **keep** |
| `brief.mjs` | 759 | Renders role briefs with takeover, return and stack blocks (`H/brief.mjs:50-468`) | prose briefs in `JS:303-424`, `round` takeover block | **keep** |
| `tick.mjs` | 1,187 | The scheduler: ask holds, reconcile, land the ready set in the background, dispatch, spawn, report (`H/tick.mjs:982-1057`) | none as a whole; `next`, `queue`, `set` in parts | **dissolve**: selection goes to Jarl `next` with EPs; holds, reconcile and spawn stay in Horde |
| `refine.mjs` | 1,210 | cut / consult / review / frame (`H/refine.mjs:771`, `:872`, `:919`, `:1048`) | none | **keep**; `applyRuling` (`:1011-1028`) becomes Jarl calls |
| `node.mjs` | 2,644 | The only yg speaker: boundaries, contracts, proposals, ladder, promote/demote (`H/node.mjs:145-411`, dispatch `:2595-2640`) | none | **keep**; its boundary helpers are the body of the territory resolver |
| `law.mjs` | 328 | Law diff base → trunk, `horde-law/1` (`H/law.mjs:191-306`) | none | **keep**, triggered by a Horde close, not by Jarl |
| `audit.mjs` | 880 | Review-date, advise and Grain sweeps at a close (`H/audit.mjs:367`, `:536`, `:690`, `:840`) | none | **keep**; `fileTicket` (`:324-343`) is rewritten onto `jarl new` / `jarl ask` |
| `land.mjs` | 4,692 | The landing gate and the merge (`H/land.mjs:4237-4478`) | `check` (read-only, 4 items, `J:1614-1677`), `merged` (records only) | **split**, see 1.3 |
| `drill.mjs` | 770 | Disciplines drilled over real `.horde/` snapshots (`H/drill.mjs:237-411`, `:749`) | none | **keep**; its corpus must be re-recorded if the record format moves |
| `retro.mjs` | 521 | Retrospective gather/classify; taste goes to `yg log` (`H/retro.mjs:128`, `:282-300`, `:420`) | none | **keep**; its input reader is rewritten against Jarl's journal |
| `escalate.mjs` | 144 | Recurring answered asks → rule-filing steps (`H/escalate.mjs:22-71`) | none | **keep**; reads Jarl's ask store if asks move |
| `horde.mjs` | 1,475 | Mission wrapper: init (yg init, grain propose, yg adopt, trunk branch), charter, archive, history, done (`H/horde.mjs:525-680`, `:1025`, `:1334`) | `init`, `archive`, `close` in part | **keep**; `init` also runs `jarl init`, and `done` wraps Jarl's close |
| `_lib.mjs` | 2,041 | Locks, counter, leases, parent branch, log and decision parsing | `withLock`, `writeAtomic`, `claimFile` | **split**, see 1.4 |

**Trunk and teams.** Only `trunk` exists:
- `TEAM='trunk'` at `H/tick.mjs:63`;
- "Only 'trunk' exists" at `H/land.mjs:220`;
- `--level team` is refused at `H/land.mjs:4636`.

The team nesting survives only as a read path (`H/_lib.mjs:1240-1286`) and in `retro.mjs:96-106`. What is real is the per-ticket parent branch. `parentBranchOf` (`H/_lib.mjs:1645-1657`) returns `<h>/trunk`, or an unmerged dependency's branch for a stacked ticket, or `<h>/prototype` via `prototypeGuard` (`H/land.mjs:2884`). Verdict: **keep** the parent branch; "teams" as a mechanism can be deleted in 7.0 rather than ported.

### 1.2 Genuine equivalences and false ones

Genuinely equivalent, safe to move:
- **Root discovery** through the git common directory: `H/_lib.mjs:672-680` and `J:202-220` do the same thing.
- **Atomic JSON writes**: `writeJSON` (`H/_lib.mjs:1672-1682`) and `writeAtomic` (`J:322-326`).
- **Rulings**: Jarl's `decide` is a strict superset of Horde's. Jarl has By, Supersedes, Superseded-by and Settles (`J:498-545`); Horde has no supersede.
- **Handoff**: both sides concluded that a stored handoff goes stale. Jarl retired its own (the ruling that the handoff comes from the CLI), and Horde's `handoff.json` has no reader except a session (`model.md:281`).
- **Locking**: Jarl's lock is strictly stronger. It judges staleness by pid, host and age and serialises breaking (`J:227-319`); Horde's is pid-only (`H/_lib.mjs:298-301`). Moving state writes onto Jarl's lock fixes Horde races (see 1.5).

These only look alike. Each one breaks a Horde invariant if Horde "just calls Jarl":

1. **Two state machines against one.**
   - Horde's ticket Status (`H/tk.mjs:58`): proposed, queued, running, landed, changes, blocked, merged, dropped.
   - Horde's queue-item state (`H/queue.mjs:45`) adds waiting and escalated.
   - Jarl's states: `open in-progress done dropped deferred` (`J:14`).

   `proposed` has no Jarl analogue. Mapped to `open`, Jarl's `next` offers it (`J:1153`), and **the architect's veto disappears**: only refine's review may queue a ticket (`H/refine.mjs:1022`, `H/queue.mjs:34-36`).
2. **"Landed" is not "merged", and neither is "done".**
   - Horde `landed`: the worker's branch is ready for the gate (`H/queue.mjs:1869-1871`).
   - Horde `merged`: land.mjs merged it after nine green items.
   - Jarl `done`: closes the record, and "gates only the record: nothing here stops code from landing" (`J:901`).
3. **Review.** Jarl needs an approve for done (`J:910-911`); Horde forbids one. Mapping Horde's `review-close` (`H/tk.mjs:1141-1149`) to a Jarl approve puts a signature into the record, which `model.md:139-141` forbids.
4. **What settles a dependency.** Jarl: done or dropped (`J:757-759`). Horde: merged only (`H/queue.mjs:1032-1043`). Under Jarl's rule, a dropped or done-but-unmerged dependency releases its dependents. That breaks "merge order equals dependency order".
5. **Stored against computed edges.** Horde derives port edges (Consumes → Produces, `H/queue.mjs:1396-1406`) on every read and refuses to remove them (`:987-1005`). Jarl's After is a stored, removable list (`J:364`). Materialising ports into After makes them stale and deletable.
6. **Territory.**
   - Jarl compares exact (repository, path) pairs (`J:1148-1160`), and a ticket with no Files claims nothing.
   - Horde matches globs (`H/queue.mjs:1302-1306`); a ticket with no Files locks its whole node (`:1093-1107`); append-only files and node logs are excluded (`:1069-1071`).
7. **Leases.**
   - Jarl's lease is shown and never acted on (`JS:147-155`).
   - Horde's worker lease carries pid and pidStartedAt. It is judged by evidence ("landed", "stopped", a dead pid, pid reuse; `H/queue.mjs:821-847`) and acted on: reconcile commits a dirty tree as "wip: reclaimed" and requeues the ticket (`:1846-1906`).
   - Horde's cross-horde territory leases in `leases.json` (`H/_lib.mjs:1360-1537`) are exactly the "territory locks across loops" that `JS:553` refuses.
8. **Rounds.**
   - Jarl: a takeover block at 3, no cap (`J:20`, `J:1587`).
   - Horde: resume first, then fresh; refused at the cap, which leads to `blocked` plus a `stuck` ask (`H/tk.mjs:306-329`, `H/tick.mjs:761-766`). The counter is shared between red gates and review findings.
9. **Asks.** Same vocabulary (`JS:562` says it carries over unchanged), opposite effect.
   - A Jarl ask holds nothing.
   - A Horde ask holds by kind (`H/tick.mjs:230-300`): stop holds everything, stuck one ticket, charter the tickets earning the named evidence rows, lower one landing.
   - Horde's `lower` answers are consumed in place by land (`H/land.mjs:1423-1443`). Jarl's answer body has no Kind, Aspect or Scope (`J:2105`), so land's `findAnswer` would never match and every `lower` would refuse forever.
10. **Record format.**
    - Jarl reads one field per line (`J:343`). Horde's template packs several per line (`Horde/skills/horde/templates/ticket.md:4-8`), so Jarl would read `node` as `x · **Class:** y …`.
    - A Horde ticket is a directory with `issue.md` and `log.md`; a Jarl issue is one file.
    - Horde's heading is `## Acceptance — evidence`, not Jarl's `## Acceptance` (`J:1053`), so every Horde ticket reads as having no acceptance.
11. **Ids.** Horde draws tickets, graph items and asks from one counter, so "a ticket and a graph item never wear the same number" (`H/_lib.mjs:876-887`). Jarl uses max+1 per kind.
12. **Logs.** Horde's per-ticket log has ISO millisecond stamps, which load-bearing readers compare against a `since` (`H/queue.mjs:804-817`, `H/tk.mjs:1080-1116`). Jarl's global log has minute stamps (`J:481-488`) and cannot order two events in the same minute.
13. **Several missions per repository.** Horde holds many hordes under one `.horde/` (`H/_lib.mjs:1607-1614`). Jarl refuses a second live loop per root (`J:576`, `J:600-602`).

### 1.3 `land.mjs` broken down

One `run()` (`H/land.mjs:4237-4478`) does, in order:
1. find the item;
2. read the ticket and its log;
3. resolve the parent branch and run the prototype guard;
4. **a catch-up merge that mutates the worker branch** (`:4284-4292`);
5. diffs and mission size;
6. scratch trees at head and base;
7. base freshness;
8. scope, revert test, journal, graph text;
9. law, conflict and protection guards;
10. consume answers (`:4372`);
11. **take the gate lock** (`:4377`);
12. gate, graph, mapping, judge, inherited findings;
13. rejudge and waiting-on-user classification;
14. **sha re-check** (`:4424-4428`);
15. `mergeIntoParent` (`:4430`);
16. record merged, landed, gate cache and fate, or else record waiting or changes with a round;
17. write `land/<t>.json`.

| Part | Lines | Nature | Target |
|---|---|---|---|
| Catch-up merge and known-conflict resolver (yg lock files take the parent's side, append-only files, `yg log merge-resolve`) | 2913-3137 | generic merge plus a yg-specific resolver | Jarl merge executor with a pluggable conflict resolver, or keep |
| `mergeIntoParent`: `--no-ff`, scratch tree, `update-ref` compare-and-swap, `expectTree` in batches | 3335-3450, 3071-3076 | generic merge | Jarl merge executor, or keep |
| Trailers Ticket / Evidence / Law | 3335-3398 | Horde | merge-message hook |
| Gate lock | 301-372 | operation lock, shared with tick | keep in Horde |
| Scope, revert test, gate command, report parsing | 404-1041, 2436-2883 | partly generic evidence, Horde config | gate before done |
| Graph, judge, graph text, mapping, law, conflict, evidence, gate guards | 1042-2389 | yg and promises | gate before done (Horde) |
| Revert tickets, fate, mission size | 3187-3334, 3582-3726 | Horde | keep |
| Batching and background landing | 3727-4236, 4596-4607 | loop-level optimisation | keep; nothing like it in Jarl |

Why a yes/no gate command before done is not enough, argued adversarially:
- It **mutates before it measures** (the catch-up merge).
- It needs a **transactional sha pin**: measure at `branchSha`, refuse if the branch moved, then merge with compare-and-swap against the parent tip. A hook followed by a separate Jarl merge loses this, unless Jarl hands the sha to the hook and itself refuses when either side moved.
- **The merge target is per ticket and is the gate's decision**: trunk, a stacked dependency, or prototype.
- **A red result has four kinds with payloads, not one exit code** (handled at `H/tick.mjs:657-735`):
  - changes: a round is counted;
  - stale: conflict files, a requeue without a round, and blocked plus an ask the second time;
  - rejudge: a requeue without a round, once;
  - waiting-on-user: blocked, with one ask.
- It can **take 15 minutes** (`gateTimeoutMs`) and runs detached, while Jarl's write lock waits 20 seconds (`J:240`).
- It **writes into the merge commit**.
- It **needs both trees**.
- It **consumes Horde state partway through the run**.

So the gate EP must be asynchronous, structured and run outside the lock. The merge stays Horde's unless Jarl deliberately grows a merge executor.

### 1.4 `_lib.mjs` primitives

| Primitive | Horde | Jarl | Verdict |
|---|---|---|---|
| State lock | per file, pid-only (`H/_lib.mjs:280-338`); lock order queue → asks → decisions, graph, counter (`:841-852`) | one `.jarl/.lock`, pid + host + age (`J:249-319`) | **move** the state writes onto Jarl's lock |
| Operation locks: gate, tree, retro | `H/land.mjs:301`, `H/_lib.mjs:383-417` | none | **keep** |
| Id counter shared by t-/g-/a- | `H/_lib.mjs:876-887` | max+1 per kind, link-claimed (`J:698-719`) | **EP**: id allocator, or `new --id` |
| Cross-horde leases | `H/_lib.mjs:1347-1581` | refused (`JS:553`) | **keep** (or a Jarl registry, against the stated boundary) |
| Parent branch and stacking | `H/_lib.mjs:1645-1657` | none | **keep** |
| Log and decision parsing | `H/_lib.mjs:999-1106`, `:1202-1237` | `journalById`, `loadDecisions` | migrate the formats |

### 1.5 Horde defects found along the way (independent of 7.0)

Worth filing in the 6.1.0 loop regardless of the redesign:

- **Unlocked, non-atomic state writes** in three places:
  - issue.md and log.md through `writeText` / `appendText` (`H/tk.mjs:351-356`, `H/_lib.mjs:1688-1698`);
  - `claimLease`, a read-modify-write of the shared `leases.json` with no lock (`H/_lib.mjs:1475-1519`);
  - `consumeAnswer`, which rewrites decisions.md without the decisions lock (`H/land.mjs:1434-1443`).
- **A "once" answer is spent before the gate.** On the single-ticket path, the lower answer is consumed after the guards and before the gate (`H/land.mjs:4372`), so a later red gate has already spent it. The batch path consumes it after the merge (`:4017`). The two paths behave differently; this needs confirming.
- **Ticket status is never written `merged`.** Only the queue item is (`H/queue.mjs:684-694`), and `status.mjs:39-51` admits the lag.
- **`status.mjs` reads leases by node** (`leases[node]`, `H/status.mjs:120-124`). After a cut, leases are keyed by territory, so foreign leases always read empty. The correct reader, `leaseHolderForNode`, already exists (`H/_lib.mjs:1565-1581`).
- **Tooling trap:** plain `grep` treats `land.mjs` as binary and skips it. Sweeps over the scripts need `grep -a`.

## 2. The Jarl extension points

### 2.1 Shape: a profile, commands, and opaque keys

Everything Horde adds reaches Jarl as data plus commands, declared once in a profile the loop is opened with (`jarl init --profile <file>`, stored as `.jarl/profile.json`). Jarl reads keys and exit codes; it never interprets a Horde word. A command receives JSON on stdin (the issue, the transition, the loop root) and answers with JSON on stdout.

Commands run **outside** `.jarl/.lock`. Jarl commits their result with compare-and-set: it re-reads the issue and refuses if the issue changed since the command started. The 20-second lock wait (`J:240`) against gates that run for minutes forces this.

### 2.2 The four candidates

**A. Profile-declared issue fields.**

Jarl already keeps unknown fields when parsing (`J:343`, `J:350-352`). It still needs:
- field names beyond letters and spaces (FIELD_RE refuses digits and dashes);
- `renderIssue` (`J:455-477`) writing declared fields;
- enums per field, replacing the `KINDS` and `TIERS` refusals (`J:687`) with the profile's values;
- declared extra sections, and a heading alias for Acceptance;
- `set <id> <field> <value>` for declared fields;
- `list --where field=value`.

A constraint on the MCP server: the generator (`jarl-mcp.mjs` on `jarl/424-mcp`) builds tool schemas from static tables (`COMMAND_FLAGS`, `COMMAND_ARGS`). Profile fields make the schema per loop, so the server must build `tools/list` from the loop's profile. This is worth noting on 424 now; it does not block 424.

Word test: passes. A field called `Node` is just a string Jarl stores.

**B. Pluggable territory resolver.**

Replace `keysOf` in `cmdNext` (`J:1148-1151`) with a command that maps an issue to a list of opaque claim keys. Jarl keeps the rule "two issues sharing a key never run together" and applies it in three places: `next`, `queue` batching (`J:1970-2025`), and `check`'s scope item.

Horde supplies:
- node or territory keys from its boundary helpers (`H/node.mjs:1871`, `:1961`) or from `yg owner --file --json`;
- the fallback where a ticket with no Files locks its whole node;
- the append-only exclusions.

Two adversarial notes:
- `yg owner` takes one `--file` per call and loads the graph each time (`Yggdrasil/source/cli/src/cli/owner.ts:148-151`). A resolver over a ticket's file list needs a batch form (`--files` or stdin). That is a small gap in Yggdrasil.
- **Grain co-change pairs do not belong in the runtime resolver.** Horde uses no co-change today (no occurrence in `H/`). At file level, a co-change partner predicts later co-change no better than a popularity-matched file (`Grain/docs/results.md:99`, row 153). Only at node level does it beat the control (`Grain/docs/validation.md:629`, 0.254 against 0.184). Co-change belongs in the architect's cut at planning time (section 3), not in per-dispatch locking.

Word test: passes. The keys are opaque strings.

**C. Gate commands before in-progress and before done.**

- **Before in-progress** carries Horde's provisioning: cut `<h>/t-NNN`, add the worktree, handle stacking (`H/queue.mjs:716-768`). The command may refuse, or return the lease fields to write (branch, worktree, a structured worker record).
- **Before done** is a profile done policy that replaces or extends `doneRefusal` (`J:902-913`). Horde's policy is "the merge happened through land", not "a fresh approve".

The honest reading of 1.3 is that **land stays a Horde command that merges and then records into Jarl** (`jarl merged --sha`, then `jarl set done`). The before-done gate in Jarl then exists to close the bypass: nobody can `jarl set done` a Horde issue without landing it. This keeps Jarl's line intact, because Jarl hosts a refusal that a profile installs but owns no gate itself. The alternative is a Jarl merge executor with conflict-resolver, merge-target and trailer hooks (decision 2).

Word test: passes, provided Jarl names only transitions.

**D. Event hooks.**

The events use Jarl's own nouns:
- `filed`;
- `status-changed`;
- `merged` (id, sha, repo);
- `ask-filed`;
- `ask-answered`;
- `decided`;
- `settled` (nothing open or in flight). This is Horde's wave-close trigger, without Jarl knowing the word "wave".

Horde's subscribers:
- `wave.mjs` `noteMerged` and `noteFate`;
- `report.mjs` `refreshReport`;
- notify;
- audit and law at a close;
- retro at the mission close.

Delivery semantics:
- a hook fires after the write is committed, never inside the lock;
- delivery is at-least-once, so subscribers must be idempotent (Horde's `noteMerged` already is, `H/wave.mjs:222-229`);
- a failing hook is reported, never rolled back.

### 2.3 What the four are missing

The audit in section 1 found these necessary as well:

1. **A status profile with flags.** Each declared status carries `dispatchable`, `settles-dependents`, `holds-claim`, `terminal` and `closes-record`. Without it, the architect's veto (`proposed`), merged-only settlement and `blocked` cannot be expressed. This is the largest single change to Jarl, because `STATUSES` is a constant used everywhere.
2. **A dependency resolver.** `deps(issue, all)` returns computed, non-removable edges with provenance, so `after --clear` refuses to remove a computed edge.
3. **An ordering comparator and a hold filter.** A `next` comparator (Horde uses six keys, `H/queue.mjs:1213-1234`) and a hold filter that `next` and `queue` consult (Horde's ask holds).
4. **A round policy.** The cap, the status and ask on reaching the cap, and one counter shared by gate rounds and review rounds.
5. **An ask schema.** Kinds with required fields and answer options (`scope once|mission`), a ruling template, and an in-place mark (`Consumed`) written under the lock.
6. **An id allocator**, or `new --id` and `ask --id`, to keep one sequence.
7. **A per-issue log with ISO millisecond stamps**, or at least `log <id>`, so rounds and worker end lines can be ordered.
8. **A structured sidecar per issue.** Nested lease, review and gate records (pid, pidStartedAt, `gate{pid,sha,at}`) do not fit one-line fields.
9. **Several named loops per root,** plus enumeration of archived loops, since blame reads every archived horde. The alternative is one Jarl loop per horde under `.horde/hordes/<h>/`. Jarl's `--root` already allows that (the ruling that fitted Jarl to work driven from another repository), so it is the cheaper route and the recommended one.
10. **Resume and status contributors**, so `jarl resume` shows Horde's wave, gate cache and evidence coverage.

### 2.4 What is too much

- **Co-change in the territory resolver**: see B.
- **Cross-horde leases in Jarl**: `leases.json` stays in Horde, the only tool with more than one mission per repository.
- **Reconcile's salvage in Jarl**: acting on a dead worker is the takeover that `JS:553` refuses, and Horde is its only consumer.
- **Batching and background landing in Jarl**: a loop-level optimisation for a single consumer.
- **Jarl knowing Yggdrasil**, even optionally, as issue 436 currently specifies for `decide` (section 6). A `decided` hook does the same job without adding a dependency edge.

### 2.5 The word test, applied

Jarl's code passes if the profile is data, the resolvers are commands, and the events are named with Jarl's nouns. It fails at three points in current plans:
- 436's "decide has a way to name an area and writes to `yg log` when the repository has Yggdrasil". That is a Yggdrasil code path in Jarl, and a `--node` in all but name.
- Any `merge-target` hook whose values Jarl interprets. Jarl must treat the target as an opaque ref.
- A `settled` event that Jarl calls anything else.

## 3. Grain in the architect's hands

Grain today has 21 CLI verbs (dispatch in `G/engine/grain.mjs`, usage text at `G/engine/grain-usage.mjs:4-55`). Its MCP server exposes six read-only tools (`G/bin/grain-mcp.mjs:74-219`): where, how, what, check, status, report. Horde reaches Grain only through `config.grainCommand`, which defaults to none (`H/horde.mjs:408`), so Grain is optional for Horde today.

**Need 1: cut the plan along co-change seams.**

What exists today:
- `completeness <files…>` returns co-change partners, but as text only, at most 5, and for exact file paths only (`G/engine/completeness.mjs:42-72`, `:115`).
- `export` has raw `cochange[]` pairs, capped at 2000 and uncertified (`G/engine/export.mjs:630`).
- `advise --json` gives node-pair `relation` items for an existing graph (`G/engine/grain-advise.mjs:128`).
- `typeEvidence` counts co-change inside and crossing any file set (`G/engine/propose-levels.mjs:134-149`), but only inside `propose`.
- Horde's cut brief points the architect at `grain map` (`H/refine.mjs:340`), which carries no co-change at all.

Gaps:
- a `cochange --files/--nodes [--partition <json>] --json` command that returns certified pairs within a set and scores a proposed partition (inside against crossing), exposing `typeEvidence`;
- directory and node granularity, because file-level co-change does not beat popularity;
- `completeness --json`.

**Need 2: draft rules for legislate.**

What exists today:
- `propose` writes a whole proposed `.yggdrasil/` with aspects, `check.mjs`, provenance and a status of draft, advisory or enforced (`Grain/docs/reference.md:381-600`).
- `.family-candidates.grain.json` (`G/engine/propose-family.mjs:34`; schema at `reference.md:672-690`) is read by `yg advise`.
- Grain reads the graph, read-only (`G/engine/yggdrasil-graph.mjs:462`).

Gaps:
- rule drafts **against an existing graph for one node or territory**: `advise` reserves `kind: rule` and `kind: port` and never emits them (`reference.md:760`);
- `propose` scoped to a node or territory;
- dependency-rule drafts from boundary decisions for a live graph.

**Need 3: before/after measurement in the mission report.**

What exists today:
- Every metric is computed at HEAD over the full history.
- `check --range a..b` reviews a diff against the HEAD model.
- `status --json` gives `cochangePairs`.
- `oracle record/score` diffs two graphs.
- Research scripts compute graph trajectory and debt over time (`G/tests/stress/trajectory.mjs`, `graph-currency.mjs`, `coupling.mjs`), but none ships as a command.

Gaps:
- an as-of-sha mode (`--at <sha>`), or `export` at two shas with a shipped diff;
- coupling metrics scoped to a territory;
- a mission-level `grain measure --from <sha> --to <sha> --scope <nodes> --json`.

Two consequences for the design:
- **Grain becomes a required dependency of Horde in 7.0** if the architect "has Grain to measure". Today it is optional (`H/horde.mjs:408`), and the canon says Horde "doesn't assume" add-ons. Grain is core, not an add-on, but the dependency graph lists no Horde → Grain edge (`family.md:36`). This is decision 7.
- **Grain's MCP parity (426) is the architect's interface.** The architect is an agent, and the commands it needs (`advise`, `completeness`, `propose`, `export`) are exactly the ones missing from Grain's MCP server today.

## 4. Migration

### 4.1 Live `.horde/` missions

`.horde/` is uncommitted operational state that "dies with the horde" (the `model.md` invariants; layout at `model.md:253-289`). Durable knowledge is already in the graph, so there is little to migrate. Options:

1. **Finish on 6.x (recommended).** A mission opened on 6.x finishes on 6.x. Horde 7.0 refuses to operate on a `.horde/hordes/<h>/` that has no Jarl loop, and names the 6.x version to finish it with. The cost is a release note.
2. **A one-shot converter.** `horde migrate <h>` would:
   - convert `teams/trunk/issues/NNN-slug/{issue.md,log.md}` plus `queue.json` into `.jarl/issues/NNN-slug.md` with the Horde profile;
   - map the two state machines onto the profile's statuses;
   - split the multi-field lines;
   - move the per-ticket ISO logs into the sidecar;
   - move `asks.json` into the Jarl ask store with the extended schema;
   - drop `handoff.json`.

   It is costly and runs once per adopter, so in practice it is barely tested.
3. **Legacy readers only.** `blame.mjs` must still read archived hordes (`hordes/_archive/`) for the chain of custody, whichever option is chosen, so it keeps a read-only legacy reader. Old `decisions.md` headings (`ask-a-007 · ticket 004`) mis-parse under Jarl's regex (`J:494`), so that reader stays Horde's.

`leases.json`, `config.json`, `gate.lock`, `land/`, `law/` and the `retro*` files remain Horde's under the new layout. There is nothing to migrate there.

### 4.2 Tests

**Horde** has 44 `*.test.mjs` files, about 721 tests and about 28,400 test lines (`H/tests/`; `npm test` runs `node tests/yg-floor.mjs && node --test tests/*.test.mjs`).

Files hit hard by replacing tk, queue, wave and leases (test counts):

| Test file | Tests |
|---|---|
| queue | 18 |
| tk | 18 |
| tick | 50 |
| wave | 16 |
| land | 152 (setup goes through `queue.mjs set running`) |
| law-audit | 11 |
| mechanics | 10 |
| plan | 8 |
| lifecycle | 1 |
| family.e2e | 4 |
| refine | 24 |
| quality | 7 |
| plan-out | 5 |
| ask | 8 |
| blame | 11 |
| drill | 28 |

- The drill corpus (`H/tests/drills/*/{violates-,satisfies-}*`, with `.horde/` snapshots and a `repo.bundle`) must be **re-recorded, not edited**. Its snapshots are already in the pre-6.0 format.
- Largely unaffected: law-guard (36), law-diff (13), promises-package (69), yg-output, the evidence and mapping checks, graph-text, decide.
- The honest estimate: land.test's 152 tests get their setup rewritten, not their assertions.

**Jarl** has 6 test files, about 109 tests and about 2,400 lines. Every extension point needs its own suite. It also needs a **contract test run from Horde's side**: a Horde profile opened on a real Jarl, exercising the veto, merged-only settlement, holds and the done bypass. That mirrors Grain's seam tests, which already fetch the neighbours' same-named branches in CI (`G/tests/seams.test.mjs`; `Grain/.github/workflows/ci.yml:39-118`). Horde's CI would fetch Jarl the same way.

**Grain** has 221 top-level test files plus 878 under `tests/relations/`, about 2,379 tests. The migration does not touch it; the new commands in section 3 do.

## 5. Family consequences

### 5.1 The new shape

- **Jarl joins the core.** It takes the family version, as `promises` did (the ruling that `promises` rides on the family number): Jarl 0.2.0 on `release/6.1.0` jumps to 7.0.0 with the core.
- **Dependency direction:**
  - Horde → Yggdrasil: required, as today;
  - Horde → Jarl: required, new;
  - Horde → Grain: required or optional (decision 7);
  - Grain → Yggdrasil: stays optional;
  - Jarl → nothing;
  - no block depends on Horde.

  The rule "blocks need nothing from Horde" already holds today: nothing in Yggdrasil, Grain or Jarl calls Horde. The one exception is Grain's seam test 4, which parses `grain advise --json` under Horde's `queue.mjs quality`. That test is a contract check, not a runtime dependency, and it moves with `quality`.
- **Contracts.** Jarl today "exchanges no documents with the core" (`family.md:38`). The profile schema, the hook payloads and the gate verdict become Jarl's first registered contracts on the Family Contracts page.

### 5.2 Sentences to rewrite (pointed at, not rewritten)

**The canon (`family.md` at the time, now `family/canon.md`):**
- `:12`, four sentences:
  - "**Three jobs, one core, in layers.**"
  - "Horde is the software house that builds on the law …"
  - "Work too big for one agent has two doors. Horde is the door for a mission held to Yggdrasil's law, and the add-on **Jarl** is the lighter door beside it: … with no law and no landing gate."
  - "From 6.0.0 the core ships as one version; the add-ons keep their own."
- `:14-18`: the Core table gains a Jarl row, and Horde's row ("The software house on the law …") gains "on Jarl's loop, measured by Grain".
- `:20`: "Four add-ons attach to the agent rather than to the graph …" becomes three.
- `:27`: Jarl's add-on row, including "In Horde's loop: None. Jarl runs beside Horde …", moves to the core table and inverts.
- `:32`: the versioning sentence, "the core (Yggdrasil, Grain, Horde) ships as one version; the add-ons (…, Jarl) keep their own".
- `:36`: the dependency graph, "Two edges, both onto Yggdrasil …" and "Ratatoskr, Urd, Researcher and Jarl have no dependency on anything in the family".
- `:38`: "Jarl exchanges no documents with the core".
- `:44-48`: the 6.1.0 section "Jarl joins the family, and D4 gets a second door", including "Jarl joins as the fourth add-on … Horde doesn't use it inside its loop". This is history, so it needs a 7.0 successor section, not an edit.
- `:77` item 8 and `:82` item 13: the tagline and the add-on count in the drift list.

**`VISION.md`:**
- `:40`: the Horde row, "worked by a loop that raises agents and retires them". That loop is now Jarl's, so the row may need Jarl as a co-embodiment, or Jarl may need its own "issue → merged branch" row.
- `:42`: "Horde is the software house that works on the law." and "Jarl is the foreman: … and no rulebook."
- `:44`: "From there, work too big for one agent has two doors. … Jarl is the lighter door beside it …". The two doors can survive, because Jarl stays usable alone, but the sentence must add that Horde is built on it.
- `:46`: "The dependency graph has two edges and only two. …", "The four companions, Ratatoskr, Urd, Researcher and Jarl, depend on nothing …", and "The core three share one version number …".

**Jarl's own `SKILL.md`:**
- `JS:12-14`: "Jarl is the light version of Horde … When a repository needs rails, that is Horde's job; Jarl is the loop and nothing more." The last clause becomes the design principle rather than a disclaimer.
- `JS:533-556`: "What Jarl will not grow" (decision 1).
- `JS:558-562`: "Horde replaces Jarl when a mission needs the graph …" becomes "Horde runs on Jarl when …".

## 6. Implications for release 6.1.0

**434: Horde moves from `yg aspects log` to `yg log --aspect`. Verdict: proceed now.**
- Every call site is in code that stays Horde's in any 7.0 design:
  - `logToAspect` at `H/node.mjs:1323`;
  - `tryLogAspect` at `:1349`;
  - `whyOf` at `H/law.mjs:182`;
  - printed hints at `H/node.mjs:1311/1547/1583`, `H/escalate.mjs:65`, `H/audit.mjs:428`, `roles/legislate.md:68` and `roles/architect.md:104`;
  - tests in escalate, law-diff, quality, horde, law-audit and docs.
- Yggdrasil 6.1.0 removes the old command (the ruling on the type log and context: "let's ignore it", translated from Polish), and Horde's floor is `YG_DOCUMENTS_AFTER='6.1.0'` (`H/node.mjs:188`). Without 434, Horde 6.1.0 is broken against Yggdrasil 6.1.0.
- It is small and mechanical, and nothing is thrown away.

**426: Grain MCP parity. Verdict: proceed now.**
- Grain is untouched by the redesign.
- The missing tools (`advise`, `completeness`, `propose`, `export`, `obligation`, `map`) are the architect's future interface (section 3).
- One addition worth folding in: the table-driven generator will expose that `completeness` has no `--json`. Give it one in the same issue.

**436: Horde and Jarl write area decisions to `yg log`. Verdict: split.**
- *Horde side, proceed.* `decide.mjs` already refuses `--node` and prints the `yg log add` redirect (`H/decide.mjs:126-134`). Turning that redirect into a write, and letting the architect write type decisions after the user's consent, is Horde's own code. It survives 7.0, because the pre-decide validator of 2.3 would call the same code.
- *Jarl side, shrink or wait.* The acceptance line ("decide has a way to name an area and writes to `yg log` only when the repository has Yggdrasil") puts a Yggdrasil code path into Jarl. That fails the word test and adds a Jarl → Yggdrasil edge, the opposite of the blocks principle. Either shrink it to a generic `decided` hook (`jarl decide … --area <opaque>` plus a command the loop configures for the hook to call), which would be the first real use of 2.2 D, or defer the Jarl half to 7.0.

**431: Horde MCP server with full parity. Verdict: shrink, or wait for 7.0.**
- Horde has no command table: each of its 20 scripts dispatches its own commands. The tool set would need a new central table, and the skills rewritten to call tools.
- In 7.0, about a third of that surface disappears into Jarl: `tk`, `queue`, `ask`, `decide`, `handoff`, `status`, and `tick`'s scheduler. Generating from a table makes the later deletion cheap. But the table, the parity test and the skill rewrite for those doomed commands would be thrown away.
- Options:
  - (a) full parity in 6.1.0 as ruled (`mcp-horde`, "Horde too", translated from Polish), at full cost;
  - (b) 6.1.0 ships the table and parity only for the scripts that survive (`refine`, `node`, `law`, `land`, `drill`, `retro`, `escalate`, `horde`, `brief`, `blame`, `report`, `wave`), and the loop commands stay CLI-only until 7.0;
  - (c) defer 431 to 7.0, where Horde's MCP becomes Jarl's tools plus Horde's own.
- The ruling is the owner's. This report recommends (b), which requires revisiting the ruling `mcp-horde` (decision 9).

Also relevant to the running loop:
- **424 (Jarl MCP)** is unaffected, but its design should note that 7.0 profiles will make tool schemas per loop (2.2 A).
- **The Horde defects in 1.5** belong in 6.1.0 regardless of 7.0: the unlocked writes, the answer consumed before the gate, and the status reader.

## 7. Decisions for the owner

**1. Does "What Jarl will not grow" survive?**
- *Context:* it was written 2026-09-25 to keep Jarl light (`JS:533-556`). Horde's loop is exactly the five things it refuses.
- *Options:*
  - (a) The line stays, reworded: "Jarl ships no gate, planner or acting lease of its own; a profile may install them as commands". Cheap in words. It keeps Jarl light for users without a profile and moves all the behaviour into Horde's commands.
  - (b) The line goes, and Jarl grows a merge executor and acting leases. Jarl becomes heavy for everyone.
  - (c) The concept stops short: Horde reuses Jarl's record code as a library (issue file, lock, rulings, asks) but keeps its own loop. The least change and the smallest gain.
- *Recommendation:* (a).

**2. Who merges?**
- *Context:* Jarl records merges; Horde's land makes them transactionally (1.3).
- *Options:*
  - (a) land.mjs keeps merging and records into Jarl, and Jarl gets a guard against the done bypass. A small change to Jarl.
  - (b) Jarl gains a merge executor with conflict-resolver, merge-target and trailer hooks. Large, and it contradicts 1(a).
- *Recommendation:* (a).

**3. Review: does a Horde issue need an approve?**
- *Context:* Jarl's done needs a fresh approve (ruling `fresh-reviewer-required`); Horde's review cannot sign (`model.md:62-68`).
- *Options:*
  - (a) A profile done policy, where Horde's policy is "landed by the gate". Jarl's fresh-review rule stays for loops without a profile. Cost: one more EP.
  - (b) Horde adopts Jarl's approve before land. Cost: a change to Horde's doctrine that "trust is manufactured in one place".

**4. What settles a dependency?**
- *Options:*
  - (a) Declared per status in the profile: Horde uses merged only; Jarl's default stays done or dropped.
  - (b) One rule for both, which breaks one of the two tools.
- *Recommendation:* (a).

**5. One Jarl loop per horde, or several loops per root?**
- *Options:*
  - (a) Each horde opens its own Jarl loop at `.horde/hordes/<h>/` via `--root`, which already works. Cross-horde leases stay in Horde's `leases.json`.
  - (b) Jarl learns several named loops per root.
- *Recommendation:* (a); it costs nothing in Jarl.

**6. May a block call another block?**
- *Context:* 436 as written makes Jarl call `yg log`.
- *Options:*
  - (a) Blocks never call each other at runtime; cross-block effects go through hooks that the composer (or the user) configures. Cost: the hook mechanism must exist before 436's Jarl half.
  - (b) Optional edges are fine when the other block is present, as Grain → Yggdrasil already is. Cost: an edge per integration, which erodes the "independent blocks" picture.

**7. Is Grain required for Horde in 7.0?**
- *Options:*
  - (a) Required: the architect always measures. This adds a Horde → Grain edge and makes Grain's gaps (section 3) release blockers. A stronger product and a heavier install.
  - (b) Optional as today: the architect measures when Grain is present and says so when it is not. Keeps today's `grainCommand` pattern.

**8. Jarl's version and place.**
- Jarl moves into the core and ships as 7.0.0 with Yggdrasil, Grain and Horde, as `promises` took the family number.
- Confirm, or keep Jarl on its own number with a declared compatibility range to Horde.

**9. 431 in 6.1.0.**
- *Context:* ruling `mcp-horde` says full parity in 6.1.0, and about a third of that surface dies in 7.0.
- *Options:*
  - (a) full parity as ruled;
  - (b) parity for the surviving scripts only;
  - (c) defer to 7.0.
- *Recommendation:* (b).

**10. 436's Jarl half.**
- *Options:*
  - (a) as written: Jarl writes to `yg log` when Yggdrasil is present;
  - (b) a generic `decided` hook now, with the Horde side as written;
  - (c) the Horde side now, the Jarl side in 7.0.
- *Recommendation:* (b) if decision 6 is (a); otherwise (c).

**11. Grain additions for 7.0.**
- Which of the gaps become 7.0 issues:
  - the `cochange` command with partition scoring;
  - rule items in `advise` for an existing graph;
  - as-of-sha measurement;
  - `completeness --json`;
  - a batch `yg owner`, on Yggdrasil's side.
- *Cost:* each is a Grain feature with its own validation burden, since Grain proves its claims against controls. The partition score is the cheapest, because `typeEvidence` already exists.

**12. Live missions at the 7.0 boundary.**
- *Options:*
  - (a) finish on 6.x, and Horde 7.0 refuses an old mission with a clear message;
  - (b) ship `horde migrate`.
- *Recommendation:* (a), because `.horde/` is disposable by design.

**13. Horde defects found here.**
- *Options:*
  - (a) file the four items in 1.5 into the 6.1.0 loop now; the unlocked writes and the answer consumed before the gate are correctness bugs;
  - (b) fold them into 7.0, where Jarl's lock fixes the first group by construction.
- *Recommendation:* file now. The answer-spending bug does not go away in 7.0.
