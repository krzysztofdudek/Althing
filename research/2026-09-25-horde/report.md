# Horde: improvements after 6.1.0

## 1. Verdict

Horde 6.1.0 (release/6.1.0 @ 87aa419) has a sound trust model: a mechanical gate, one-way law, and asks scoped to what they hold. It already reads Yggdrasil's documents (`yg-check/1`, `yg-drill/1`, `yg-aspects-health/1`, `yg-error/1`) by schema. Its weakest part is the concurrency layer between `tick`, workers and landings, and that layer is not ready for unattended or parallel use.

Two defects there are proven by scratch experiments against the real scripts:

- **`tick` reclaims live workers.** It commits their half-written trees, dispatches the same ticket twice, and reviews half-done branches. The external runner cannot run a real ticket safely.
- **A conflicting catch-up loops forever.** No round is counted, so the breaker never trips and the client is never asked. It is triggered by the family's everyday conflicts (CHANGELOG, node `log.md`, `yg-lock.*.json`), which the 6.1.0 Jarl loop resolved by hand dozens of times.

The second group of findings is about Horde's own process producing red gates and "graph got weaker" readings that are not the ticket's fault:

- Refusals only the user can resolve still tick fix rounds.
- The quality index counts cache state as violations.
- The log gate goes quiet after the first entry.
- The advise sweep sends lowerings and promotions to workers.

In most of these cases Yggdrasil 6.1.0 already emits the fact Horde needs (`cause`, `next.remaining`, `aborted.stage`, `evidenceHash`, `log-cycle-open`), and Horde does not read it.

One guard hole is real and quiet. Packaged and nested rule ids escape the conflict-of-interest guard and the evidence pin, and that includes the `promises` package that Horde itself tells adopters to install.

None of this needs a change to the trust model. It needs about two weeks of focused work, most of it S–M items with fixtures that can be written today. Two scope limits apply to the evidence:

- One item (horde-2-F4) is reasoned from the code, not reproduced, because that needs a live LLM reviewer.
- The `.horde/` fixtures in the harness ran against the host `yg` 6.0.0. The reconcile and stale paths do not depend on the yg version, and the Yggdrasil-document findings were run against the 6.1.0 dev-container CLI.

## 2. Top recommendations

**1. Give running workers a lease that reconcile respects (horde-2-F1).**
- **What:** at dispatch, record the worker (name, start time, pid under the external runner). Reconcile settles an item only on evidence that the worker ended: its mandated `tk.mjs log NNN "landed <sha>"` line, a dead pid, or an explicit `tick --reclaim NNN`. Until then the item shows as `working`.
- **Why:** today every tick treats every `running` item as returned. Both the `--watch` loop (every 300 s) and SKILL.md's 20–30 minute wake-ups run tick while workers are still working.
- **Effort:** M (1–2 days).
- **How we would know it worked:** the three scratch experiments (`live-worker.mjs`, `live-worker-bc.mjs`) become tests that fail today and pass after. An external `--watch` run whose spawn command sleeps 10 minutes never produces two workers on one ticket.

**2. Break the catch-up conflict loop and resolve the known conflicts mechanically (horde-2-F2 + horde-2-F3, with horde-2-F4 bundled).**
- **What:**
  - Count stale-with-conflict returns and escalate on the second one with the same file set.
  - Never promote a mid-merge tree to `landed`.
  - Add a resolver for the known conflicts, used at catch-up and in the batch combine step:
    - `yg log merge-resolve` for node logs;
    - take the parent's side of `yg-lock.*.json` wholesale;
    - a diff3 pure-addition merge for `config.appendOnly` files.
  - Treat a prose re-judge caused by the catch-up as no round (F4).
- **Why:** this is the most common trigger of an endless loop that burns a worker spawn every cycle and never reaches the client.
- **Effort:** S–M for F2 (about 1 day), M for F3 (about 2 days), S for F4 (about 0.5 day).
- **How we would know it worked:** `conflict.mjs` becomes a test that ends in a landed ticket or exactly one open ask within 3 ticks. A fixture with 3 parallel tickets on one node, each adding a log entry and a CHANGELOG line, lands all three with zero stale refusals and zero respawns.

**3. Stop charging workers for decisions only the user can make (horde-1-F3).**
- **What:** classify each red graph item by yg's own buckets (`next.remaining`, issue `cause`). A refusal with `needsFix === 0 && fillable === 0`, or with every blocking cause in {reviewer-missing, reviewer-unreachable, reviewer-failed}, costs no round and raises one director item per horde. Surface `config-reviewer-missing` at `horde init` and at the frame step. Delete the YAML-regex `hasReviewer`.
- **Why:** today every ticket touching a prose-ruled node with no reviewer bounces until it is `stuck`.
- **Effort:** M (1–2 days).
- **How we would know it worked:** in a fixture with no reviewer, two tickets on the node both show "waiting on a user decision", neither ticks a round, exactly one ask exists, and the frame names the gap.

**4. Resolve rule ids by the graph, not by a one-segment regex (horde-1-F1).**
- **What:** map every changed path under `.yggdrasil/aspects/` to a rule id by longest-prefix match against the `yg aspects --json` ids that lawGuard already reads. Count every file in the rule's directory plus `yg-aspect.adapt.yaml` as rule text. Find the has-evidence pin through the rule whose id ends in `has-evidence`.
- **Why:** installed packages and nested ids pass the conflict-of-interest guard unseen, and the evidence pin is read from a path install never creates.
- **Effort:** S–M (1 day). Optionally 0.5 day in Yggdrasil for a per-rule `definitionHash`.
- **How we would know it worked:** a fixture branch that edits `.yggdrasil/aspects/packages/o/r/promises/has-evidence/content.md` together with a promise it reaches is refused. A pin written in the adapt file changes the gate's pairing.

**5. Make `done` depend only on what ran (horde-2-F5).**
- **What:** stamp every gate-cache entry as `ran` or `asserted`, and have `done` accept only `ran`. `wave evidence` validates each row by its catalogue class: an answered ask, an existing artifact at the trunk tip, or a command the tool runs itself.
- **Why:** two of `done`'s three conditions can be met from typed input alone, which contradicts model.md's "trust … a function of the evidence it left in files".
- **Effort:** S–M (1 day).
- **How we would know it worked:** `wave close --gate green --sha <trunk>` followed by `done` still runs the trunk gate (`by: 'horde done'` in the cache), and `wave evidence E1 --by "looks fine"` is refused on a non-testimony row.

**6. Read the landing's free fill as one document (horde-1-F2).**
- **What:** replace the text fill plus the second check with one `yg check --approve --only-deterministic --json --compact`, branching on `exit.status` and `aborted.stage`.
- **Why:** the landing now runs two graph processes, and it misreads a log-gate abort as "no judge configured".
- **Effort:** S (0.5–1 day).
- **How we would know it worked:** a landing on a `log_required` node with no entry yields one graph item naming the node and the `yg log add` step. A wrapped `ygCommand` counts one spawn, not two.

**7. Stop measuring cache state as quality loss (horde-1-F5).**
- **What:** run the free fill on the trunk before `measureQuality`, which writes only the gitignored cache and is the simpler option. Alternatively, exclude deterministic unverified or stale pairs and the causes `deterministic-not-run` and `keyed-by-earlier-release` from the baseline, and report `log-cycle-open` under its own name.
- **Effort:** S (0.5 day).
- **How we would know it worked:** two consecutive wave closes with no rule or code change report Δ baseline 0 and Δ noise floor 0.

**8. Route advise items by class and evidence (horde-1-F7).**
- **What:** key the ledger by `id@evidenceHash`, and file an item again only when it is not already open. Add a routing table:
  - `promotion:` goes to the ladder;
  - lowering classes go to a client ask;
  - `sharpen:`, `drill-miss:` and hot-spot classes go to the legislate pass;
  - `architecture-cut:` goes to the architect.
- **Effort:** S–M (1 day).
- **How we would know it worked:** in a fixture, promotion and decorative-rule items produce no worker ticket, and a changed evidence hash files exactly one new item.

**Cheap batch (under 1 day in total):**
- horde-1-F4(a): the worker brief runs the free full fill when the dry run shows 0 reviewer pairs.
- horde-1-F10: CHANGELOG contradiction and stale comments.
- horde-2-F8 parts (3) and (4): external worker logs and pid, and the legacy wave-close lines.
- horde-2-F9 part (1): drop the "weight estimate".

## 3. Findings table

| id | kind | priority | title | where | proposal |
|---|---|---|---|---|---|
| horde-2-F1 | defect | high | `tick` reclaims live workers: it commits their WIP, re-dispatches the ticket and reviews half-done branches | queue.mjs:1717-1775; tick.mjs:831, :776-800; SKILL.md:243; horde.mjs:402 | A lease by log line, pid or explicit reclaim. No clock. |
| horde-2-F2 | defect | high | A conflicting catch-up loops forever and the client is never asked | land.mjs:3523-3575, :2575-2610; tick.mjs:564-575; worker.md:29-34; queue.mjs:1729-1736 | Count stale conflicts and escalate on repeat. Add a catch-up-conflict brief section. Reconcile checks MERGE_HEAD and dirtiness first. |
| horde-2-F3 | opportunity | high | Mechanise the known merge conflicts (node logs, locks, append-only files) | land.mjs:2575-2610, :364; tk.mjs:253-254; queue.mjs:984-997, :1384-1387; Yggdrasil docs/the-lock.md:139-182 | `yg log merge-resolve`, take one side of the lock, diff3 pure-addition merge for `config.appendOnly`. Drop appendOnly files from lockConflict. |
| horde-1-F1 | defect | high | Landing guards assume a rule id is one directory name, so packaged and nested rules escape the conflict guard and the evidence pin | land.mjs:1448, :2651, :1702, :1833 | Longest-prefix match against `yg aspects --json` ids. Read the adapt file. Optional `definitionHash` in yg-aspects/1. |
| horde-1-F3 | risk | high | Refusals no worker can fix still tick fix rounds | land.mjs:1037-1054, :3679-3690, :3569-3571; node.mjs:497-511; horde.mjs:562-575 | Classify by `next.remaining` and `cause`, no round, one director item. Surface at init and frame. Drop `hasReviewer`. |
| horde-2-F5 | risk | medium | `done` can be satisfied by typed `--gate green` and `--by` strings | wave.mjs:1018-1030, :761-768; horde.mjs:1331-1340 | Stamp gate entries `ran` or `asserted`; `done` accepts only `ran`. Class-checked `wave evidence`. |
| horde-1-F2 | defect | medium | The landing's free fill is read as text, costs two runs, and misreads a log-gate abort as a missing reviewer | node.mjs:519-533; land.mjs:990-1021 | One `--approve --only-deterministic --json --compact` run that branches on `aborted.stage`. |
| horde-1-F4 | risk | medium | Under Horde the yg log gate goes quiet after the first entry | worker.md:86-91; land.mjs:990; Yggdrasil the-lock.md:87 | The brief runs the free full fill when there are 0 reviewer pairs. `log-cycle-open` on a changed node turns the graph item red. |
| horde-1-F5 | defect | medium | The wave quality index counts cache state and Horde's own process as "the graph got weaker" | node.mjs:639-695; wave.mjs:857-883 | Free fill on the trunk before measuring, or exclude deterministic stale and unverified pairs and report them apart. |
| horde-1-F7 | defect | medium | The advise sweep ignores `evidenceHash` and item class | audit.mjs:497-549, :355-387 | Key by `id@evidenceHash` (refile only if not open). Add a class routing table. |
| horde-1-F8 | opportunity | medium | Relation findings carry edges, but the landing neither routes them nor separates inherited findings from new ones | land.mjs:1016-1021; node.mjs:564-570 | Compare against the parent tree and label findings introduced or inherited. Render all `groups[]`. Route relation stanzas (check worker scope first). |
| horde-2-F7 | risk | medium | The client's "go" never mentions paid reviewer runs, which workers are told to run unasked | worker.md:86-91; refine.mjs:1030-1145; Yggdrasil cli-reference.md:366, :542 | Frame discloses the provider and the pending prose judgements (no money figure). Family issue for `yg check --approve --against <ref>`. Needs a ruling. |
| horde-2-F8 | opportunity | medium | The client cannot see the mission; external worker output is thrown away | tick.mjs:794-795; model.md Runner; templates/wave-close.md:3,7; wave.mjs:226-235 | (1) `horde.mjs report`; (2) `config.notify`; (3) run logs and pid; (4) drop the legacy lines. (1) and (2) need a ruling. |
| horde-2-F4 | defect | low | A prose verdict made stale by the automatic catch-up is charged as a fix round | land.mjs:3523-3530, :1033-1053, :3656-3693 | Return `rejudge` with no round and send a narrow refresh brief. Bundle with F3. Not reproduced. |
| horde-2-F6 | opportunity | low | No way back from a bad landing | land.mjs:2876-2915, :112-121; ask.mjs:55-60 | A `revert` ticket kind whose guards are measured against base-at-start. `--fate reverted` verifies ancestry. |
| horde-2-F9 | inconsistency | low | Parallelism and seven other defaults are unsourced; a class-weight "weight estimate" survived the cost removal | scripts/README.md:1640-1664; horde.mjs:394-402; queue.mjs:1565; _lib.mjs:688-690 | Drop the weight estimate. Print the measured landing drain beside dispatch. Source each constant. |
| horde-1-F9 | opportunity | low | Retire the 6.0.x text fallbacks at the next family release | node.mjs:189, :333-345, :383-384, :731-767, :866-872; audit.mjs:159-260 | Raise the floor to 6.1.0, delete the text parsers, use `code: "usage"` and `next.command`. |
| horde-1-F10 | inconsistency | low | The shipped 6.1.0 texts contradict what Horde does | CHANGELOG.md:55-56; retro.mjs:455; land.mjs:1833; node.mjs:621-623, :691 | Fix CHANGELOG:56 in place (6.1.0 is untagged). Delete stale comments. Relabel or drop `judges`. |

horde-1-F6 is not listed on its own. Its consent point was absorbed into horde-2-F7.

## 4. Details for high-priority items

### horde-2-F1: tick reclaims live workers

**Mechanism.** `reconcileRunningLocked` (queue.mjs:1721-1768) handles every `running` item as if its worker had returned:
- with commits beyond the parent, it sets `landed` (queue.mjs:1733);
- with a dirty tree, it runs `git add -A && git commit -m 'wip: reclaimed'` inside the worker's worktree and re-queues the item (queue.mjs:1745);
- with a clean tree, it removes the worktree (queue.mjs:1759).

`runOnce` calls it unconditionally (tick.mjs:~831). `externalStart` (tick.mjs:776-800) spawns detached with `stdio: 'ignore'` and keeps no pid, although gates already get `processAlive` tracking (tick.mjs:357). The tick.mjs header assumes the caller "runs tick again once they come back". SKILL.md:243 prescribes 20–30 minute wake-ups, and `--watch` re-ticks every `tick.interval` (300 s).

**Evidence.**
- `live-worker.mjs` printed `reconciled [{"ticket":"001","state":"queued","note":"worktree was dirty — committed as \"wip: reclaimed\"…"}]`, then `spawn [{"ticket":"001",…same worktree}]`. That is a second worker in the same tree.
- In `live-worker-bc.mjs`, a worker with one stage commit ("red test first") was marked `landed` and got `review raised on c18c1dd…`.

**Consequences.**
- Under the external runner, any ticket longer than one interval is corrupted.
- Under the foreground runner, the opposite cost applies: each batch waits for its slowest worker before anything lands.

**Fix and cost.** Add `item.worker = {name, startedAt, pid?}` and settle an item only on:
- the worker's `landed <sha>` log line;
- a dead pid (external runner);
- an explicit `queue.mjs set NNN returned` or `tick --reclaim NNN`.

This keeps the "no liveness threshold" principle, because the signal is a file or a pid, not a clock. horde-2-F8 part (3) (run logs and pid capture) is a natural part of the same change. Cost is 1–2 days across queue.mjs, tick.mjs, SKILL.md and model.md.

### horde-2-F2: the catch-up conflict loop

**Mechanism.**
- `pullParentIntoBranch` (land.mjs:2575-2610) aborts on any conflict.
- The stale path (tick.mjs:564-575) counts no round, by design (issue 028).
- The worker brief (worker.md:29-34) says to stop on a dirty merge.
- `reconcile` (queue.mjs:1729-1736) promotes to `landed` on commit count before it looks at the tree or MERGE_HEAD.

The ticket therefore cycles stale → worker stops → landed → stale, indefinitely.

**Evidence.** `conflict.mjs` printed `cycle 0 [{"a":"changes","round":null}] asks []` and `cycle 1 [{"a":"changes","round":null}] asks []`. Each cycle spends a worker spawn. land.mjs:2713 tells the reader to "catch the branch up … resolve it there", while worker.md:33 forbids continuing a dirty merge. No role is allowed to resolve the conflict.

**Fix and cost.**
- (a) Add `item.staleConflicts`, and on the second stale return with the same file set, either file a `stop` ask naming the files or hand off to the F3 resolver.
- (b) Add a catch-up-conflict section to the brief, rendered only after a stale-with-conflict result.
- (c) Make reconcile refuse to promote a mid-merge tree.

About 1 day.

### horde-2-F3: mechanical resolution of the family's known conflicts

**Why this matters most in practice.** Parallel tickets on one node both append to its `log.md`, which tk.mjs:253-254 removes from file locks. They then collide at catch-up and feed F2's loop. A repository where every change adds a CHANGELOG entry either serializes every ticket (lockConflict, queue.mjs:984-997) or gets refused by scope.

**Field evidence from the 6.1.0 loop.**
- "conflict only in CHANGELOG, both entries kept" (translated from Polish; .jarl/log.md:285, 471, 473)
- "conflicts in CHANGELOG, cli/core/advise/log.md, both locks … locks: our side in full" (translated from Polish; :460)
- "log conflict … merged as a union, lock taken from release and refilled" (translated from Polish; :1184-1187)
- Four merge-resolve bugs (195, 196, 211, 222). Issue 222 was marked "urgent, blocks merges" (translated from Polish; :1587).

**Current state.** Yggdrasil documents the recipe (the-lock.md:139: "take one side of the lock file, then merge-resolve each conflicted log, then commit, then yg check --approve"). A grep over Horde scripts finds no `merge-resolve`, no `appendOnly` and no MERGE_HEAD.

**Fix and cost.** A resolver used by `pullParentIntoBranch` and the batch combine step:
- node `log.md`: run `yg log merge-resolve --node <n>`;
- `yg-lock.*.json`: take the parent's side wholesale;
- `config.appendOnly` globs: accept only a diff3 pure addition on both sides at the same anchor;
- anything else: refuse, as today.

Appending entries weakens nothing that protects, so no `lower` ask is involved. horde-2-F4 becomes common only once the lock is taken one-sided, so it ships in the same change. Cost is about 2 days, including an end-to-end test.

### horde-1-F1: rule ids with slashes escape the guards

**Mechanism.**
- land.mjs:1448 `ASPECT_TEXT_FILE` is `/^\.yggdrasil\/aspects\/([^/]+)\/(content\.md|check\.mjs|companion\.mjs|yg-aspect\.yaml)$/`, and `lawTrailers` (:2651) uses the same pattern.
- A node test showed that `.yggdrasil/aspects/boundary/clean-core/content.md` and `.yggdrasil/aspects/packages/promises/has-evidence/check.mjs` both fail to match.
- `yg pack add` installs under `.yggdrasil/aspects/packages/<owner>/<repo>/<pkg>/`, with adaptations in `yg-aspect.adapt.yaml` (Yggdrasil docs/packages.md:25-32, :51-53, :130-160).
- `evidencePinAt` (land.mjs:1701-1702) reads `.yggdrasil/aspects/has-evidence/yg-aspect.yaml`, a path that install never creates. A pinned `evidence: mirror` is therefore ignored, and the gate falls back to `auto`.

**Why it matters.** horde.mjs:322 tells adopters to `yg pack add …#promises`, so the gap covers the exact package Horde recommends. A branch that rewrites a packaged rule's `content.md` together with code the rule reaches lands with no conflict-of-interest refusal, and its trailer reads `Law: packages changed`.

**Scope.** audit.mjs:568-571 and horde.mjs:248 already handle `/` in rule ids. Only land.mjs kept the single-segment assumption. Issue 118 fixed only the audit's drill-miss split.

**Cost.** About 60 lines and 3 fixtures (nested id, installed package, adapt-file pin).

### horde-1-F3: user-only refusals burn fix rounds

**Mechanism.**
- `recordChanges` (land.mjs:3683-3693) ticks a round for every red item. Only the stale path (:3569-3575) is exempt.
- `checkJudge` (:1037-1054) refuses with "configure one (yg init --provider …)", based on `hasReviewer`, a YAML regex over yg-config.yaml and yg-secrets.yaml (node.mjs:497-511).
- `horde init` refuses only when a commit hook runs a full check (horde.mjs:566-575).

**Evidence.** The scratch re-run returned `next.requiresUser: true`, `next.remaining: {needsFix:0, fillable:0, needsUser:1, waitingOnReviewer:1}`, issue `cause: "reviewer-missing"` and code `config-reviewer-missing`, with the why "Configuring a reviewer is the user's decision".

**Consequence.** Every ticket on such a node burns rounds until it is `stuck`. The 6.1.0 ruling that Yggdrasil's reviewer is the one judge (that loop's decisions.md:105-106) says Horde refuses such landings. It does not say Horde should spend rounds on them.

**Cost.** About 100 lines across land.mjs, horde.mjs and node.mjs, plus 3 fixtures.

## 5. What is already good

- **The trust model holds.** A mechanical gate, one-way law, and asks scoped to one thing each ("One answered question per thing being lowered, never one for a category"). Every proposal above works inside it, not around it.
- **Schema-based reads are in place.** Horde already consumes `yg-check/1`, `yg-drill/1`, `yg-aspects-health/1` and `yg-error/1` as documents, so most fixes are "read one more field", not new plumbing.
- **The stale-no-round principle is right.** tick.mjs:564-575 already says "a fix loop is never spent on a merge somebody else's landing made necessary". F3 (horde-1) and F4 (horde-2) extend the same principle to other refusals that are not the ticket's fault.
- **Liveness for gates already exists** (`processAlive`, tick.mjs:357), so the worker lease in horde-2-F1 has a local pattern to copy.
- **Rule-id handling is correct outside land.mjs.** audit.mjs:568-571 and horde.mjs:248 already handle ids with `/`, which shows the fix for horde-1-F1.
- **The ruling that dropped cost reporting is respected.** No finding brings back cost accounting. The one item near that line (horde-2-F7) is left for Krzysztof's ruling.
- **The constants table is honest.** scripts/README.md:1640-1664 marks unsourced defaults as "Not recorded" instead of inventing sources, which is what makes horde-2-F9 easy to act on.

## 6. Open questions for the owner

1. **Consent for reviewer runs (horde-2-F7).** Should the frame tell the client which provider judges prose rules and how many judgements are pending?
   - Option A: yes, provider plus pending count, no money figure. It costs about half a day, and it brings a count back into the frame, which is the part that touches the ruling that dropped cost reporting.
   - Option B: no disclosure. It is free, but workers keep running what Yggdrasil itself calls "paid — ask the user to approve it first" without the client's knowledge.
   - Separately: should `yg check --approve --against <ref>` be filed as a Yggdrasil family issue? It is M effort in Yggdrasil.
2. **A client-facing view (horde-2-F8 parts 1–2).** Build `horde.mjs report` (about 1–2 days) and a `config.notify` hook (about half a day)?
   - Option A: build both. The client can see the mission without the director's chat, and an external loop can reach the client when an ask is filed.
   - Option B: only the cheap parts, (3) run logs and pid and (4) dropping the legacy lines, now, and defer the report as product scope.
3. **Automatic merge of append-only files (horde-2-F3).** Is a diff3 pure-addition merge of CHANGELOG-like files acceptable without an ask?
   - Option A: yes, with `horde init` detecting CHANGELOG.md by default. This removes most serialization.
   - Option B: only node `log.md` and locks by default, with CHANGELOG opt-in per mission. Safer, but CHANGELOG-heavy repositories stay serialized.
4. **Who adds a missing relation (horde-1-F8).** When a ticket adds a cross-node import, may the worker declare the relation in `yg-node.yaml` within its scope, or must it go to the architect?
   - Worker: no new routing, but graph changes without the architect's veto.
   - Architect: the veto stays whole, at the cost of one proposal round per new edge.
5. **Version floor (horde-1-F9).** Raise Horde's Yggdrasil floor to 6.1.0 at the next family release and delete about 150–200 lines of text fallbacks?
   - Doing so drops support for mixed installs, which the one-number policy already discourages.
   - Keeping the floor means two parsing paths stay maintained.
6. **Unsourced constants (horde-2-F9).** Eight defaults (`parallelism` 6, `fixRounds.resume` 3, `fixRounds.fresh` 2, `tick.interval` 300, `territory.maxBytes`, `law.retireAfterWaves`, `law.qualityDropAsk`, `WAVES_CLEAN_FOR_ENFORCED`) need a dated ruling or a source.
   - Option A: rule on each one now, about an hour of your time.
   - Option B: accept them as provisional and replace `parallelism` with the measured landing-drain reading first.
7. **Rule definition hash (horde-1-F1, optional part).** Add a per-rule `definitionHash` to Yggdrasil's `yg-aspects/1`? It is about half a day in Yggdrasil, and afterwards the law and conflict guards compare two hashes instead of listing files. Without it, Horde keeps its own file list per rule and has to track Yggdrasil's hashing rules by hand.
8. **Revert tool (horde-2-F6).** Build it now (M, about 2 days, new guard semantics measured against base-at-start) or wait until a mission actually needs a revert? There is no field evidence yet.
