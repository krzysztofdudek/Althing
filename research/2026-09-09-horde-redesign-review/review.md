# Horde after the mission: what it assumed, what broke, and a model without the breaks

An independent design review for the maintainer, written 2026-09-09 against Horde `main` (0.4.0 plus the `[Unreleased]` block), Yggdrasil 5.9.0's docs, the two mission reports of 7–8 September, the triage that checked every reported item against the code, and the 6.0.0 release index with decisions D0–D3. Item numbers below are the reports' numbers (`H15` = Horde item 15, `Y5` = Yggdrasil item 5); a verdict quoted as "confirmed" or "disproved" is the triage's, and I only lean on items the triage confirmed or that I could see in the code myself. Facts are stated as facts; where I am judging, I say so.

Four parts: what the current model assumes and which assumptions the mission falsified; a model without those flaws; what I would drop; how to get there inside 6.0.0.

---

## Part 1 — What the current model assumes, and what the mission did to it

The model is written in `SKILL.md`, `reference/model.md`, `reference/topology.md` and the seven role briefs; the scripts enforce parts of it. Below, each assumption is stated in the model's own terms, with where it is written, then the evidence.

### A1. One tree per steward is enough; the architect, the verifier and the director need none of their own

Written: `topology.md` "Stewards work in their own worktree… The director works in the main checkout and touches no branch of the horde"; the architect's brief opens with "Repository root: `{{repoRoot}}` — every command runs from there"; `roster.mjs:330-340` creates a worktree only for `role === 'steward' && flags.team`. Not written anywhere but true in the code: the verifier's brief is rendered with `t.queueItem.worktree` (`brief.mjs:508,582`), which is the **worker's** worktree, and `premerge` runs the gate in that same tree (`checkGate` → `findWorktreePath(root, branch)`). So the trunk tree has two writers (steward, architect) and the ticket tree has up to three (worker, verifier, `premerge`), and the model names a rule for none of them.

Evidence: H20 (a 17-charter change reverted and reapplied around the steward's commit), H27 (the architect's probe files disappeared into the steward's staging; the architect moved to the director's base-branch checkout), H28 (a worker's probes stood uncommitted in the trunk tree after it reported "reverted"). All three confirmed, one family. **Falsified.** D3 has decided the fix in principle: one tree per role.

### A2. Sharing `.horde/` through the git common dir makes "which checkout am I in" irrelevant

Written: `scripts/README.md` intro; `_lib.mjs:64-77` (`repoRoot()` is `git rev-parse --show-toplevel` from `process.cwd()`). True for `.horde/`, false for the graph: `.yggdrasil/` is tracked content and every checkout carries the version on its own commit. A command run from the main checkout on the base branch reads the base branch's graph, in which the mission's new nodes do not exist.

Evidence: H3 (briefs say "enter the repository directory"; owners wrote charters onto the base branch), H16 (`queue plan --horde` failed with "node not found" from the base checkout), H18 (`node.mjs log --run` from the wrong checkout vanished without an error). Confirmed, one cause. **Falsified.** D2 has decided the fix: `resolveTree`, scope precedence, refusal over guessing, provenance in every output.

### A3. A worktree is a self-sufficient place to run the repository

Written nowhere; assumed by `queue set running` and `roster spawn steward`, which call `git worktree add` and nothing else (`roster.mjs:338`, `queue.mjs:557`), and by the gates table, which runs the full gate "in the worker's worktree".

Evidence: H2 (no `.env`, the gate fails on database login; the steward copied it by hand), H26 (two full gates in two worktrees collided on one database; a verifier saw two red runs from someone else's Playwright), H35 (the `flock` form the mission used failed on that machine). Confirmed. **Falsified.** An adopter's repository has untracked configuration and shared external resources; the model has to provision the first and serialise the second.

### A4. "Liveness is judged by files and branches, never by silence"

Written in exactly those words in `README.md`, `SKILL.md` and `topology.md`. The code (`roster.mjs:479-580`): a steward is dead when the newest of three timestamps (branch tip, `queue.json` mtime, `lastTrace`) is older than `stewardMinutes` while the queue is non-empty; an owner when a review request has waited longer than `ownerMinutes`; the architect when a proposal has; a worker or verifier has no file signal at all and is judged on `lastTrace` alone, or reads `no-trace`. Every verdict is "time since the last signal against a threshold". There is no state between `alive` and `dead`, so "idle because nothing is on my desk" and "gone with work in my tree" render the same.

Evidence: H12 (the roster showed the architect dead right after it had closed everything; the director nearly respawned it), H30 (two workers stopped with real, uncommitted work in their worktrees and nobody noticed until the steward's next review). Confirmed, one cause. **Falsified as written**; the file signals exist but the verdict is silence.

### A5. A doorbell wakes the right agent at the right time; "every turn starts with `queue list`"

Written: `SKILL.md` "Files are the channel; messages between agents are doorbells"; the steward's brief "Never wait on a monitor for more than one turn… Every turn starts with…". The model has no mechanism that *starts* a turn. A teammate in Agent Teams runs only when a message arrives; a doorbell that arrives mid-turn is consumed, and if the file it pointed at is acted on later or not at all, nothing rings again.

Evidence: H6 and H13 (a ticket sat ready to merge for twenty minutes because the owner's doorbell came before the steward finished its turn; the director woke it by hand), H25 (the steward reported "no ruling" three times about an escalation ruled 38 minutes earlier, because a ruling is a file and the turn started from the inbox). H25 is confirmed and fixed in `[Unreleased]` (the turn now starts with `escalate list`); H6/H13 the triage marks as platform. **Falsified.** The platform fact is not the flaw; the flaw is that the model's memory of "who owes what" lives in the messages and not in a file somebody re-reads on a schedule.

### A6. The owner is a long-lived agent whose value is holding a node's context

Written: `model.md` "an owner is a lease on a node's context… replaceable at the cost of one brief", `topology.md` lineage, the steward's staffing section ("Owners stay alive for the reviews the wave will ask of them"). The same document also says "Nothing lives in an agent's head" and "Trust in an agent is a function of the evidence it left in files". The two statements pull against each other: if the context is in files, a parked owner buys nothing but a liveness question and a stale doorbell.

Evidence: what the long life produced in the mission was H3 and H11 (twenty-three charters refreshed "on boot" into the wrong tree with mission language, 63 occurrences of "mission"), H12's shape for the architect, and H21's fan-out of thirteen to thirty-two owners' keys per ticket. **Partly falsified.** Nothing in the mission needed an owner to be alive between its reviews; several things went wrong because it was.

### A7. The node's charter is the owner's to refresh, and the horde writes durable knowledge into the graph

Written: owner brief "Refresh it on boot if the code has moved past it… record the refresh in the node's log"; `node.mjs charter edit` writes `charter.md` beside `yg-node.yaml`; the node-charter template rendered `**Owner:** … · **Lease:** …` into committed graph text until 0.4.0.

Evidence: H11, H17. Confirmed; H17 fixed in 0.4.0; H11(c), the deterministic mission-language rail, is `premerge` item 9 in `[Unreleased]`. H11(a) and (b), a separate home for working notes and a brief that renders charter and notes apart, are not done. **Falsified.** Yggdrasil is plan-agnostic by design; the horde put plan into it because the only write path for "what I learned about this node" led into the graph.

### A8. A port is a versioned test in the graph, and every dependent consumes every port

Written: `model.md` "Contracts are ports, and a port is a test"; `consumersOf` (`node.mjs:1297-1313`) counts a relation with no port list as a consumer of every port, including one being created.

Evidence: H15 (a first port on a shared node fanned out to about thirty approvals), Y5 (Yggdrasil demanded `port-missing-consumes` from all 33 relations to that node), H21. Confirmed. **Falsified.** D1, D1a, D1b, D1c have decided the fix: ports are named entries with an implicit `default`, relations pair by name only, `version` and `test` leave Yggdrasil, `consumersOf` counts explicit names.

### A9. Approvals are per node, and computing them is cheap

Written: `SKILL.md` "the owner's review of every node the ticket names"; `tk.mjs review` recomputes consumers per produced port through `yg impact` per relation (`tk.mjs:841`).

Evidence: H21 (eight tickets needing 13–32 approvals; the mission ruled `wide-approvals-through-the-architect` above six nodes), H33 (`tk review` overran the two-minute tool timeout). Confirmed. **Falsified**, and only half of it is D1's doing: with named ports the fan-out through contracts goes away, but a change that genuinely touches thirty small nodes still needs thirty keys under a per-node rule.

### A10. The adopter's commit hook is a fast lane that passes on a worker's tree, and prose rules are judged after the commit

Written: `topology.md` gates table, row "ticket commit — the repository's commit hook lanes (`yg check`, lint, build, typecheck, unit)"; the verifier's brief step 6 "Judge the prose rules… nobody else on this ticket has a fresh context and no stake"; `premerge` item 6 fills the deterministic half and names the pending prose pairs for the verifier.

Evidence: H19. The mission's repository runs a plain `yg check` in its commit hook, which is red on any unjudged nondeterministic pair; a ticket with 333 new scenarios was 333 pairs; no verdict, no commit; no commit, no verifier. The mission resolved it by asking the chairman for consent to spend the reviewer at landing (`reviewer-runs-allowed-for-the-mission`), which is why `[Unreleased]` now counts reviewer calls. Confirmed (L). **Falsified** for any adopter whose hook demands a green full `yg check`, which is what Yggdrasil's own README recommends as the second CI leg.

### A11. A new test file that fails on the base is the universal proof that a change is load-bearing

Written: `tdd.md` "the merge checklist takes the new test files out of your diff, drops them onto the branch you started from, and runs them there"; `premerge` item 4 detects new tests by `config.testGlobs`.

Evidence: H14 (a type-level contract pin passes at runtime on any base; the verifier proved it by mutation; the steward merged over a ✗ with a decision in the log because the tool offers no "merge on a ruling"). Confirmed. **Falsified for one class of change**, and the tool has no second proof shape and no ruled override.

### A12. Two independent id spaces are harmless

`node.mjs:1687,1832`: `nextId(graph.ports)` and `nextId(graph.proposals)` run separately from 1. Evidence: H39, "[20]" meant a screen mapping once and a duplicated port another time; the director and the steward confused them twice. Confirmed. **Falsified.**

### A13. A flake is an incident for the repository's ledger

`verify.mjs:178-191` runs `yg incident add --tag not-enforcement` on a flaky verdict. Evidence: H34, two entries written to `.yggdrasil/incidents.md` for what were gate collisions (H26), against the adopter's law that an incident is a person's testimony with an explicit tag and reason (Yggdrasil `AGENTS.md`: "Never fabricate an incident"). Confirmed. **Falsified**, and it breaks Horde's own promise never to write into the graph behind the user's back.

### A14. A ticket's scope over its nodes' graph files means "the owner charters its node"

`premerge.mjs checkScope` comment; a ticket naming a node may edit that node's `yg-node.yaml`, `charter.md`, `log.md`. Evidence: H38, a worker added a `when:` predicate to an inherited aspect on the parent node, which is a rule change, inside a diff the checklist accepted. Confirmed. **Falsified**: "the node's own files" bundles a mapping line (which must travel with the file that needs it) with rule text (which must never travel with a ticket).

### A15. Tools finish inside one tool call

Evidence: H33, `premerge` runs the full gate inline (`checkGate` → `execSync(cmd)`), `tk review` runs `yg impact` per relation; both exceeded the harness's two-minute limit and had to be backgrounded by hand. Confirmed. **Falsified**: any tool that may spend minutes must be a job with a result file, not a call.

### A16. The node is the unit of context, of ownership and of approval, and the roles follow from it

Written: `model.md` "Right size. A node is cut correctly when its charter, its ports and its code fit one Sonnet context with room to work… This is the only cutting rule", and "Roles as functions of the graph". Two things are wrong here, and this is a judgement rather than a reported item.

First, the nodes are not Horde's to cut. On an adopted repository the graph is Grain's proposal accepted by the user, cut for architecture (rules, relations, types), and Yggdrasil's own doc says a node is "a bounded piece of the system". Horde's rule sizes by an agent's context. The mission's graph had many small front-end nodes, each rendering the same tokens, which is a sound architectural cut and a terrible ownership cut: a token change touched dozens of them (H21). Recutting nodes to fit a Sonnet context would change the architecture to fit the tooling, which is exactly the thing `model.md` says the horde must never do.

Second, the roles were not derived from the node; they were assumed from an organisation chart and the node was named as the owner's referent afterwards. Look at what each role is a function of: the director of the session, the steward of a branch, the architect of the whole graph, the worker of a ticket, the verifier of a ticket's evidence, the auditor of a merged sha. Only the owner is a function of the node. And the owner is where the mission's damage concentrated (A6, A7, A9). The claim "director : mission :: owner : node… the same skill runs one level down" was never implemented: an owner is not a steward for its subtree in any script.

**Verdict:** the cutting rule is right about *what a lease must fit* and wrong about *what it cuts*. The unit of ownership and approval should be a lease-sized set of whole nodes, cut by the context rule, while the node stays Yggdrasil's.

### A17. Sub-teams are how a horde scales

Written: `SKILL.md` "A team with more parallelism than one steward can drive gets a sub-team"; `topology.md` branches per team, `team:<t>` queue items, `--parent`, nested `teams/` on disk resolved by walking the roster; the `structure` escalation kind; `premerge --level team`.

Evidence: none. The mission ran one team. **Unsupported rather than falsified**, but every mechanism a sub-team adds (a second trunk-like tree, a second steward to wake, a second queue to reconcile, a merge-up item) multiplies A1, A2, A4 and A5, and the stated reason, parallelism, is not what bounded the mission: the gate lock (H26) and the account's rate limits did.

### What the mission proved right

These held, and the model I propose keeps them unchanged: the evidence catalogue with row ids and the plan naming rows nobody builds; keys bound to the diff's patch-id and carried across catch-ups; the scoped re-review over a range-diff; the fix-loop breaker; escalations recorded as decisions and dissent as a channel that never blocks; a verifier who is never the author; the audit as a sample with a published refutation rate; cost every wave close; the charter as the mission's law with amendments that force a re-plan; `queue next` enforcing `--depends` (H23/H31 were disproved: the tool was right and the steward's suspicion was wrong); and the graph-text rail added after H11.

---

## Part 2 — A model without these flaws

One sentence: **a horde is a steward and an architect, each the only writer of its own tree, driving one queue of tickets and graph changes over territories leased from the graph, where every role's pending work is a file on its desk that a mechanical tick re-rings until it is done, and nothing merges without two keys, one approval per territory, and a green re-proof of the adopter's own gate.**

### 2.1 Roles

| Role | Kind, model | Its tree (the only place it writes) | Its file | Its key |
|---|---|---|---|---|
| **director** | the user's session | the main checkout, read-only for the horde; writes only under `.horde/` | escalations, dissents, handoff | rulings |
| **steward** | teammate, Sonnet, one per horde | `worktrees/<h>/trunk` on `<h>/trunk`; makes no commits of its own, only merges | `queue.json`, its desk | none; `premerge` is the machine's key |
| **architect** | teammate, Opus, one per horde | `worktrees/<h>/architect` on `<h>/architect`, cut from trunk | `proposals.json`, its desk | the graph key on every `g-` item; the cross-cutting key |
| **planner** | one-shot subagent of the steward, per territory, at staffing and at every re-plan | none; reads the trunk tree | tickets, proposals, territory notes | none |
| **worker** | one-shot subagent of the steward, cheapest class that passes | `worktrees/<h>/t-NNN` on `<h>/t-NNN` | the ticket log | author |
| **verifier** | one-shot subagent of the steward, class ≥ the ticket's, never the author | `worktrees/<h>/v-NNN`, detached at the ticket tip | the verdict | verifier |
| **reviewer** | one-shot subagent of the steward, per (ticket, territory) | none; reads the diff through git | `tk review` | the territory's approval |
| **auditor** | one-shot subagent of the director, Opus | `worktrees/<h>/audit-NNN`, detached at the merge sha | the audit verdict | none |
| **counsel** | one-shot subagent of the director, Opus | none | an answer | none |

Kept: director, steward, architect, worker, verifier, auditor, counsel. **Merged:** the owner becomes two one-shot roles over a territory, the planner (proposes tickets, contracts and graph changes at staffing) and the reviewer (gives the territory's approval on one ticket), plus a notes file that carries what the owner used to carry in its head. **Dropped:** the owner as a long-lived agent, the sub-team steward.

Why the owner splits, as a judgement: the model already says the owner's context is in files and it is replaceable for one brief. Taking that seriously means the review of ticket 14 in a territory is a fresh reader with the territory's context, exactly as the verifier is a fresh reader of the evidence. What is lost is the re-reading of the territory context on each review, a fixed cost bounded by the cutting rule. What is gained: no owner liveness, no parked owners, no `verifier-seat` special case, no "the architect reviews when the owner is the author" rule (a reviewer is never the author by construction), and no agent whose "refresh on boot" writes into the graph.

Every role's brief is rendered from `resolveTree` (D2) and carries the absolute path of its tree and the sentence "you write nowhere else"; a role with no tree is told so and its tools refuse a write into any tree. Grandchild notifications reaching the director's session are named in `SKILL.md` as noise the director ignores (H7).

### 2.2 Trees

D3 as decided, with three additions.

- `roster spawn architect` creates `worktrees/<h>/architect` on branch `<h>/architect` off the trunk tip. Every graph change the architect makes is a commit on that branch and reaches the trunk as a `g-NNN` queue item merged by the steward, with the architect's key as author and `premerge --graph` as the second key (§2.9). The steward's tree therefore never has a hand-made commit; **any dirty state in the trunk tree is an error** and `queue set merged` refuses while `git status --porcelain` there prints anything (H28 mechanically).
- The verifier gets its own detached worktree at the ticket tip. It can run everything and can commit nothing to the branch; the worker's tree is never entered by another role. The auditor already makes its own; it is recorded on the roster like the others so `reconcile` can remove it.
- Provisioning is one function, `provisionTree(kind, ref)`, used by every spawn: `git worktree add`, then copies every path in `config.worktree.copy` (default `[".env"]`, set by `horde init` from what it finds untracked-and-ignored at the root and asks about; H2), then `yg check --approve --only-deterministic` so the free cache exists before anyone looks.

The director's main checkout is read-only for the horde: under D2 rule (3) a graph write into a tree on `config.base` is refused; I would extend that to *every* horde write outside `.horde/` from that tree, `--tree` or not. The director rules; it does not edit.

### 2.3 State: the graph and the horde's state

Yggdrasil's graph is committed and plan-agnostic. It holds: nodes, mappings, relations, ports as named entries with aspects and an implicit `default`, aspects and their status ladder, flows, each node's `charter.md` ("why it exists", "boundary", "must stay true", "ports: why the promise exists"), each node's log (why things changed). The horde reads it through `yg node|context|impact --json` and writes it through exactly one role in exactly one tree: the architect, in `worktrees/<h>/architect`, through `yg` and hand edits of `yg-node.yaml` that a `g-` item names.

The horde's state is uncommitted, in `.horde/` beside the main checkout:

```
.horde/
  .gitignore                     "*"
  config.json                    base, gates, judge, worktree.copy, approvals.wideThreshold, classes, parallelism, stale
  leases.json                    territory -> {horde, since}; shared by every horde on this repository
  gate.lock                      transient; the one lock every full gate takes
  worktrees/<h>/                 trunk, architect, t-NNN, v-NNN, audit-NNN
  hordes/<h>/
    charter.md                   the mission's law
    counter.json                 one counter for every id this horde issues
    territories.json             territory -> {nodes[], class, cutAt}
    roster.json                  agent -> role, kind, spawnedBy, tree, state (working|idle|stale|gone), lastTrace
    desks/<agent>.json           pending items for that agent, each with {id, kind, since, rings}
    queue.json                   one DAG: t-NNN and g-NNN items
    issues/t-NNN-slug/           issue.md, log.md, proof.patch (when the proof is a mutation)
    proposals.json               g-NNN: new-node | move-boundary | rename | rule | port | mapping | charter
    graph/<node>/ports.json      contract versions and tests for this mission, mirroring .yggdrasil/model/<node>/
    graph/<node>/notes.md        territory working notes: open points, what this mission changes here, Minor findings
    escalations.json  dissents.json  decisions.md
    plan.md  audit.json  cost.json  incidents.md  ladder.json  handoff.json
    cache/last-gate.json         per level, per sha
```

Three rails keep the line. **(1)** `premerge` item 9 (graph text, already in `[Unreleased]`) refuses mission language in `charter.md`, `log.md` and `graph:` commits. **(2)** `premerge` item 3 (scope, §2.9) admits a ticket diff under `.yggdrasil/` only as `mapping:` lines that an approved `g-` item names; `aspects:`, `when:`, `relations:`, `ports:`, `charter.md` and `log.md` are refused on a ticket branch outright, whatever the ticket's territories (H38). **(3)** Every write into the graph goes through a command that refuses any tree but the architect's (D2 rule 3 generalised). What the old owner wrote into `charter.md` "on boot" now lands as a `g-NNN` of kind `charter` (the proposed text as the proposal's body); the architect reads it against the graph-text rail and the code, commits it in its tree or vetoes it with a reason. What was "Open" in the charter template moves to `graph/<node>/notes.md`, which the planner and every reviewer read and may append to through `node.mjs note <node> "…"`.

### 2.4 Territories: the lease unit

A **territory** is a set of whole nodes, cut so that its charters, its ports and its code fit one context of the class assigned to it, with room to work. It is the unit of leasing across hordes (`leases.json`, same file as today, keyed by territory), of planning (one planner per territory), and of approval (one reviewer key per territory a ticket touches). The node stays the unit of architecture and is never recut by the horde.

`horde.mjs cut [--budget <bytes>]` computes the first cut from the charter's `## Nodes` section and the graph: walk the node tree; a subtree that fits the budget is one territory; one that does not splits by children; sibling leaves that are small are merged into one territory; a node named in the charter that belongs to no cut becomes its own. The cut is shown to the user at framing, as the node map is today, and recorded in `territories.json`. Refinements during the mission are `g-NNN` proposals of a new kind, `cut`, ruled by the architect and never needing the user unless they change a lease another horde holds. `horde.mjs charter edit` leases every territory the new `## Nodes` section reaches (H5); a node in no territory is a refusal naming `horde cut`.

Why this and not "recut the graph" or "one owner per node": it keeps the cutting rule where it is right (the lease) and takes it away from where it was wrong (the node), and it makes the approval count a function of how the *mission* is organised, which the director controls, instead of how the *architecture* is organised, which it must not.

### 2.5 Desks and the tick: liveness and wake-up

The rule: **no role waits on being remembered, because the memory is a file and the remembering is mechanical.**

Every tool that creates work for a role appends an item to that role's desk: `queue set landed` → the steward's desk gets `premerge t-013`; `verify record` and `tk review` → the steward's desk gets `check keys t-013`; `node.mjs propose` and `contract propose` → the architect's desk; `escalate add` and `dissent add` → the director's desk; `wave close` → the director's desk gets the audit sample; a charter amendment → the steward's desk gets `re-plan <territories>`. An item leaves the desk only when the tool that completes it removes it (`queue set merged` removes `premerge t-013`), never by hand.

`horde.mjs tick` is the loop's one command, run by the director on a schedule (a `/loop` or `ScheduleWakeup` every 10–20 minutes) or by hand. It does four things and rules on nothing: **(1)** `queue reconcile` for the horde, which is now the worker's liveness (below); **(2)** reads every desk and every roster state; **(3)** prints, per agent, `ring: <agent> — <n> items, oldest <age>` for every agent whose state is `idle` and whose desk is non-empty, with `rings` incremented on the item; **(4)** prints what waits on the director. The director sends the rings; the script cannot send an Agent Teams message, and that boundary is stated in `SKILL.md`. A ring is idempotent: its whole text is "read your desk". So a doorbell that arrived mid-turn and was lost (H6, H13) is re-rung on the next tick, and a ruling that was recorded while the steward was mid-turn (H25) is on the desk the steward reads at the top of every turn, which every brief now opens with: `horde.mjs desk --me <name>`.

Roster states replace `alive|dead`: `working` (set by the agent's tools on any write), `idle` (set by the agent's `handoff write` at the end of a turn, or by the tick when the agent's last trace is older than its newest desk item), `stale` (a desk item has been rung at least twice and waited longer than `config.stale.minutes`, default 30, since the first ring), `gone` (cold-boot `roster reconcile`, or an explicit reclaim). Only `stale` asks the director to act, and what it asks is "reclaim and respawn"; an architect with an empty desk is `idle`, never anything worse (H12). The one time threshold that remains measures a ring that was not answered, not silence.

Workers and verifiers are not on desks; they are subagents whose Agent call returns. **A worker's death is known the moment its call returns without a landed commit**, and the steward runs `queue reconcile --ticket t-NNN` at once: a commit beyond the parent → `landed`; a dirty tree → `wip: reclaimed` committed on the ticket branch, the item back to `queued` with a note, the next worker told; a clean tree with no commit → `queued`. The tick runs the same reconcile over every running item with a worktree whose newest file mtime and whose worker's last trace are both older than `config.stale.minutes`, for the case where the steward itself is gone (H30). Nothing here waits for a review.

Cold boot stays as it is, simplified: `roster reconcile` marks everything `gone`, `queue reconcile` sorts the running items, the director respawns the steward and the architect, and the first tick rings them.

### 2.6 Tickets and graph items: one queue, one counter

`queue.json` holds two kinds of item under one DAG and one `next`: **tickets** `t-NNN` (code, one ticket branch, worked by a worker) and **graph items** `g-NNN` (a graph change, committed by the architect on `<h>/architect`, merged by the steward like a ticket). A `g-` item may be a dependency of a `t-` item and the other way round; a mapping for files a ticket creates is the one case where a `g-` item's approved edit rides *inside* the ticket's commit (§2.9), and the item records that.

Ticket states: `proposed → queued → running → landed → (changes ⇄ running)* → merged | escalated | dropped`, with `waiting` for a class that cannot be spawned. Every transition is one tool call, writes the desk item it owes, and prints the provenance line (`tree · branch · sha`, D2 rule 4).

Every id this horde issues comes from `counter.json` with a kind prefix: `t-NNN` tickets, `g-NNN` proposals of every kind (graph change, port, mapping, charter, cut), `e-NNN` escalations, `d-NNN` dissents. One counter, so a number can never mean two things (H39); a bare number is accepted with a warning for one release and then refused. Branch names follow: `<h>/t-NNN`. The `graph.json` split into `ports[]` and `proposals[]` with two `nextId` calls goes away; a contract proposal *is* a `g-` item of kind `port`.

### 2.7 Approvals that scale with the graph

Under D1c a relation without `portNames` consumes `default`, a named port has exactly the consumers that name it, and under D1a a port carries no version in the graph. Approvals then derive as follows, computed **once**, at `queue set landed`, by `queue.mjs approvals t-NNN`, stored on the queue item, and read by everyone after (H33: `tk review` never calls `yg` again; it writes a file).

1. **Territory approvals.** For every file in the diff, the owning node from `yg context --file` (cached per node), then that node's territory. Each territory gets one approval slot, filled by one fresh reviewer spawned by the steward. A ticket's declared `--files` at proposal give the *planned* territories, which is what the plan prices; the diff at landing gives the *actual* ones, and a difference is the scope item's business.
2. **Contract approvals.** Only for a ticket that `--produces <node>/<port>@<v>` with `v` above the mirror's current version for a **named** port: every territory holding a node whose relation names that port gets a slot. `default` is never versioned and never owes a slot: changing what `default` promises is changing the node's inside, which is the territory's own key, and a neighbour it breaks shows as a red test in that neighbour, which is evidence, not a vote.
3. **The cross-cutting key.** When the territory count exceeds `config.approvals.wideThreshold` (default 3), the slots beyond the ticket's home territories (the one or two it names) are replaced by a single architect approval, recorded as `architect(wide)` on the Keys line; `premerge` item 2 accepts it mechanically. This is the mission's `wide-approvals-through-the-architect` ruling as a rule of the tool, not a decision to make again (H21).
4. **The graph key.** Any ticket whose diff touches `.yggdrasil/` at all also needs the `g-` item it rides with; there is no approval slot for graph text on a ticket.

The plan prints, per ticket, the reviewer count this implies, so a ticket that would cost twelve reviews is visible before dispatch and is usually a sign the cut is wrong (a `cut` proposal, not a dispatch).

**Contracts and the mirror.** D1a's intent, that the horde writes nothing working into the tree, I keep whole. Issue 008 places the mirror at `.horde/graph/<node>/ports.json` at repository level, and the index marks the level as still to be settled. I recommend **per horde**, at `hordes/<h>/graph/<node>/ports.json`, mirroring `.yggdrasil/model/<node>/`, for one reason: an uncommitted repository-level file is not a fact about the repository, it is a fact about one checkout; it does not travel with a clone and is not reviewed in a diff. If a port's version were really a repository fact it would have to be committed, and then it would be the second graph the model forbids. What a version does in Horde is order tickets (`@2` after the producer of `@2`) and price approvals within a mission; nothing outside a mission reads it. So: a port's contract test path is proposed by the planner (`contract propose <node> <port> --as <test> [--aspects a,b]`, H37), approved by the architect as a `g-` item of kind `port` whose graph edit is the named port with its aspects and nothing else, and its version starts at 1 for this mission with the test file's committed content as version 1's promise. The mirror records `{port, version, test, approvedBy, at}`; `tk new --consumes a/p@2` resolves against it and refuses `@2` when the mirror holds `@1` and no ticket produces `@2`. A later mission starts its own count. Nothing is lost, because nothing outside the mission ever depended on the number.

### 2.8 Landing, judging, merging: the merge checklist and the adopter's hook

Three layers, each one owner's law, none bypassing another.

**The adopter's commit hook** runs whatever the repository configured, in the worker's tree, on every commit, and Horde never passes `--no-verify` (the worker's brief says so; `horde.mjs land` refuses the flag). Horde's job is to bring the tree to a state in which the hook can pass without the worker judging its own work. That is the **judge policy**, `config.judge`, chosen at `horde init` with the chairman after `init` reads the hook (`.husky/`, `.git/hooks/pre-commit`, `lefthook.yml`, `package.json` scripts) and says what it found:

- `verifier` (the default): landing runs `yg check --approve --only-deterministic`, commits, and leaves the prose pairs for the ticket's verifier to judge under its own name in its own detached tree (`yg verdict package|record`), as the model has it today. If the hook refuses on pending prose pairs, `land` reports the hook's own words and files an escalation of kind `cost` ("this repository's hook demands judged prose pairs at commit; the chairman can consent to `judge: reviewer`"), and stops.
- `reviewer`: landing runs `yg check --approve` in the ticket tree, which spends Yggdrasil's own reviewer model on the pairs the change reached, and then commits; the calls are booked to the ticket (§2.10). The verifier's job is unchanged minus one step: it re-proves with a plain `yg check` (free, keyless), reproduces the evidence, runs the proof, runs the gate. The judge is still not the author; it is a different model under Yggdrasil's own record.

Either way the author never records a prose verdict, and the adopter's hook runs exactly as the adopter wrote it (H19). Progressive mode is the adopter's dial and is respected: a plain `yg check` on a ticket tree fails only on what the change reached; the trunk-level gate adds `--full`.

**`horde.mjs land t-NNN`** is the worker's last command: the policy's `yg check` fill, `git status --porcelain` limited to the ticket's declared files (a foreign path is a refusal naming it), the commit through the hook, `tk log "landed <sha>"`, `queue set landed`, the steward's desk. Its brief says the proof of a revert is `git status --porcelain` printing nothing, not a sentence (D3, H28).

**`horde.mjs gate <level> --tree <path>`** is the only command that runs a full gate. It takes `gate.lock` (a `mkdir`-based lock with a stale-holder check, no `flock`; H26, H35), exports `HORDE_TREE` and `HORDE_TICKET` for repositories that can isolate resources per tree, runs `config.gates.<level>`, and writes `{sha, level, result, at, seconds}` to `cache/last-gate.json` and to the ticket log. It is designed to run in the background with a result file; every brief that runs a gate says "run it in the background and read the result" (H33). The verifier runs it; the steward never runs it inline.

**`premerge.mjs t-NNN`** is a reader and finishes inside a tool call: **1** base freshness; **2** keys: author, verifier `reproduced`, every approval slot on the item filled and every key still bound to the diff (unchanged, keys travel across catch-ups); **3** scope: code files inside the declared list, graph files only as approved `mapping:` lines (§2.3 rail 2), no protected path; **4** proof: `revert` (new tests extracted onto the parent fail there), `mutation` (the verifier's `proof.patch` applied in a scratch tree makes the ticket's `--proof-command` red; H14), or `none` for a diff with no new test, judged on its evidence rows; a ruled escalation may be named for a ticket whose proof the tool cannot run, and the item then reads `✓ by ruling e-NNN`, so a merge over a ✗ is a recorded decision instead of a log line; **5** gate: green in the cache at this sha, else ✗ "run `horde gate`", never a run; **6** graph: a plain `yg check` in the ticket tree is green, no fill, no judging; **7** mapping: every added file is owned by a node on the branch's tree; **8** journal; **9** graph text. Then the steward merges `--no-ff` into a clean trunk tree, and `queue set merged` removes the worktrees, deletes the branch, writes the wave bullet, and clears the steward's desk item.

For a `g-NNN` item the same command runs `--graph`: base freshness; the architect's key; scope = only `.yggdrasil/` and the graph's own files; graph text; `yg check` green on the merged trunk tree in a scratch worktree; mapping. A `rule` kind additionally lists at wave close for the chairman, as raises do today; `yg-architecture.yaml` and suppressions still need the user before the item is even filed.

**The mapping case.** A file a ticket creates must be mapped in the same commit (Yggdrasil refuses a mapping with no file; the hook runs `yg check`; item 7 refuses an unmapped file). The planner declares new files on the ticket (`--files +src/x/new.ts`); at plan review the architect approves the mapping as a `g-` item of kind `mapping` bound to the ticket; the worker's brief carries the exact `mapping:` line; `land` refuses a commit whose `.yggdrasil/` diff is anything but that line. The worker executes an approved edit and decides nothing about the graph, which is D3's sentence with the one exception it needs to be true.

### 2.9 Numbering

One counter per horde, kind prefixes on every id, branches named from ticket ids, `g-` for every proposal kind, and `blame` reads the same `**Keys:**` shas it reads today. Sub-team numbering, `team:` items and cross-team dependency forms (`<team>:NNN`) do not exist.

### 2.10 Cost

Four ledgers, all mechanical, all summed at wave close and at `horde done`:

- **runs × class** from `roster spawn` (unchanged), now including every reviewer spawn, so the approval fan-out is a number on the close;
- **reviewer calls** from `.yggdrasil/yg-events.llm.jsonl`, per ticket (the lines the ticket branch adds over its parent) and per mission (base to trunk; already in `[Unreleased]`); under `judge: reviewer` this is where landing's spend shows;
- **gate runs**: count and wall seconds per level from `cache/last-gate.json` history, because under a lock the gate is the wall-clock bottleneck and the chairman should see it;
- **forecast against actual**: the plan's Σ(class weight × runs per ticket) at wave start against the three ledgers at close.

Tokens are not visible from a session; runs × class stays the proxy, and the close says so in one line rather than implying precision it does not have.

### 2.11 What stays as it is

Framing with the user, one question per message; the charter template minus the owner class and lease per node (territories carry the class); the evidence catalogue; `queue plan` with layers, critical path, collisions and uncovered rows; stacking (`--on`); `queue next` ranking and `--why`; the fix-loop breaker; the quality pass filtered to leased territories; the status ladder with its per-wave observations, relocated from `graph.json` to `ladder.json`; `promote` the architect's and `demote` the chairman's; escalations, dissents, decisions, handoff for the director and the steward; the audit sample and the refutation rate; `blame`; the drills; `horde done`'s four conditions.

### 2.12 Where I would decide differently from D0–D3

- **D1a / issue 008, the mirror's level:** per horde, not per repository, for the reason in §2.7. The shape (`graph/<node>/ports.json` mirroring `.yggdrasil/model/<node>/`) is as the maintainer described it.
- **D2, rule (3):** extend the refusal from "graph writes in a tree on the base branch" to "any horde write into a tree that is not the calling role's, and no write at all from the director's checkout". D3 already implies the first half.
- **D3:** as decided, plus a verifier tree; the mission's reports did not name the verifier sharing the worker's tree, but the code does it and it is the same class of fault.

Nothing here argues against D0, D1, D1b or D1c.

---

## Part 3 — What I would drop

| Mechanism | Where it is today | Why it has no place |
|---|---|---|
| Sub-teams: `<h>/<team>` branches, `team:<t>` queue items, `roster spawn steward --parent`, nested `teams/` resolved by walking the roster, `queue move`, `<team>:NNN` dependency forms, `premerge --level team`, `checkKeysForTeamMergeUp`, the `structure` escalation kind, `handoff --by steward --team` | `topology.md`, `roster.mjs`, `queue.mjs`, `premerge.mjs`, `escalate.mjs`, `handoff.mjs` | Unexercised in the only real mission; every level multiplies the tree, wake-up and reconcile problems the mission did hit; parallelism, the stated reason, was bounded by the gate lock and rate limits, not by the steward. A mission that needs more is two hordes on disjoint territories, which leases already support. |
| The owner as a long-lived subagent; `leaseScope` mission/wave; owner liveness; "refresh the charter on boot"; the `verifier-seat` approval; "the architect reviews when the owner is the author" | owner brief, `roster.mjs` owner verdict, `tk.mjs review` | Replaced by the planner, the reviewer and `notes.md` (§2.1). A reviewer is never the author by construction; nothing an owner knew needed an agent to stay alive. |
| `dead` by silence; `stewardMinutes`/`ownerMinutes`/`*Seconds`; `roster trace` reviving a dead lease; architect liveness by proposal age | `roster.mjs:479-580` | Replaced by desks, the tick, and `working|idle|stale|gone` (§2.5). The only threshold left measures an unanswered ring. |
| `node.mjs charter edit` and `node.mjs log --run` for any role but the architect; the `## Open` section of the node-charter template; `{{repoRoot}} — every command runs from there` in every brief | `node.mjs`, `templates/node-charter.md`, `reference/roles/*.md` | Graph writes happen in one tree by one role; working notes live in `.horde/`; briefs carry the role's tree (D2, D3, §2.3). |
| `consumersOf` over relations with no port list | `node.mjs:1297-1313` | D1 / issue 007. |
| Port `version` and `test` in the graph; `port-contract-*`; contract baselines in the lock | Yggdrasil `port-contracts.ts`, `relations-flows-ports.md` | D1a / issue 004; the version lives in the horde's mission-scoped mirror. |
| Two `nextId` counters (`graph.json.ports`, `graph.json.proposals`); `graph.json` itself | `node.mjs:1687,1832` | One counter with kind prefixes; proposals of every kind in `proposals.json`; the ladder's working in `ladder.json` (§2.6). |
| `verify record` calling `yg incident add` on a flaky verdict | `verify.mjs:178-191` | The incident ledger is the maintainer's testimony (Yggdrasil `AGENTS.md`); the flake goes to `hordes/<h>/incidents.md` and the wave close lists it as a proposal for the chairman (H34). |
| `premerge` running the gate inline; `tk review` calling `yg impact`; `premerge --no-gate` as the way to make it finish | `premerge.mjs checkGate`, `tk.mjs:841` | `horde gate` is the one gate runner, backgroundable, locked, cached; approvals are computed once at `landed`; `premerge` reads (§2.8, H33). |
| The steward committing a worker's uncommitted diff in the worker's tree ("step 5"); the steward's own `graph:` commits on trunk | steward brief steps 5 and "Graph changes" | The steward makes no commits: `reconcile` commits `wip:` on the ticket branch, and graph changes arrive as `g-` items from the architect's tree (§2.2). |
| A ticket's scope admitting its nodes' `charter.md`, `log.md` and every key of `yg-node.yaml` | `premerge.mjs checkScope` | Rule text never travels with a ticket; only an approved `mapping:` line does (§2.3 rail 2, H38). |
| `repoRoot()` from `process.cwd()` as the anchor for graph reads | `_lib.mjs:64-77` | D2 / issue 010. |
| The verifier briefed into the worker's worktree | `brief.mjs:508,582` | One tree per role (§2.2). |
| `horde init --nodes` as the only way to lease | `horde.mjs:328,560-564` | `charter edit` leases the territories the `## Nodes` section reaches (§2.4, H5). |
| The node as the unit of ownership and approval, and "a node is right-sized when it fits one Sonnet context" as a rule about nodes | `model.md` "Right size" | The rule sizes territories; nodes are Yggdrasil's and Grain's (§2.4, A16). |

Kept deliberately although it could look like ceremony: counsel (one Opus opinion, no state, cheap), dissent (a channel that never blocks and taught the mission things it could not see from above), the drills, `blame`.

---

## Part 4 — Migration inside 6.0.0

### Order

The Yggdrasil half first, because Horde's approval derivation reads the machine documents Yggdrasil emits.

1. **Yggdrasil 001–006** (issues as drafted): `aspects` optional on a port; `default` and `portNames` with the `consumes` alias; the one-sided mandate removed; `version`/`test` removed with a load-time notice; docs; own graph. Settle in 002 whether `yg-context/1` and `yg-impact/1` grow to `/2` with `portNames`; Horde refuses the old schema by name, as it does today for `yg-check/1`.
2. **Horde foundations: trees.** Issue 010 (`resolveTree`, precedence, refusals, provenance, briefs) and D3's candidate (architect tree and branch, verifier tree, `provisionTree` with `worktree.copy`, the trunk-must-be-clean refusal, the director's checkout read-only). Everything after assumes these.
3. **Horde: one counter and one proposal queue.** `t-`/`g-`/`e-`/`d-` prefixes; `graph.json` split into `proposals.json` and `ladder.json`; bare numbers accepted with a warning for this release.
4. **Horde: territories and approvals.** `horde cut`, `territories.json`, `charter edit` leasing; issue 007 (`consumersOf` by name); `queue approvals` computed once at `landed`; the reviewer role and brief; the planner role and brief (the owner brief split in two); `approvals.wideThreshold`; the per-horde contract mirror (issue 008 with the level changed as in §2.7); `contract propose --aspects`.
5. **Horde: desks, tick, roster states.** `desks/`, `horde tick`, `horde desk --me`, `working|idle|stale|gone`, `reconcile` on every tick and on every worker return, `config.stale.minutes`; the liveness thresholds and `trace`-revival removed; `SKILL.md`'s director loop rewritten around the tick.
6. **Horde: landing and merging.** `horde land`, `config.judge` with detection at `init`, `horde gate` with the lock and the cache, `premerge` as a reader with the proof variants, the ruled-override reading, the scope rail for `.yggdrasil/`, the mapping `g-` item bound to a ticket, the flake to `incidents.md`; `tk edit --depends` (H36).
7. **Horde: sub-teams removed.** Branch layout, queue items, roster kinds, `premerge` levels (trunk only, `--full` for progressive repositories), escalation kinds, briefs, `topology.md`.
8. **Docs.** `README.md` (roles table, "How it thinks", the family section), `SKILL.md`, `model.md`, `topology.md`, the role briefs, `scripts/README.md`, `CHANGELOG` `[Unreleased]` → `[6.0.0]`.
9. **Issue 999.**

Steps 3 and 4 can be done before step 1 lands if `consumersOf` is left reading the old document behind a schema check; nothing else in Horde depends on Yggdrasil's schema change. Steps 5 and 6 are independent of each other.

### An adopter with a running mission

`.horde/` is uncommitted working state and 0.x is labelled experimental in every changelog entry, so the honest default is: **close the current wave on 0.4.0, `horde archive`, and start the mission again on 6.0.0 from the same charter.** The charter, the decisions and the merged work on the trunk branch all survive an archive; what does not is the open tickets' state, which a fresh staffing reproposes from the same evidence catalogue at the cost of one planner per territory.

For a mission that cannot pause, ship `horde.mjs migrate <h>` in 6.0.0, run once, refusing when the horde has sub-teams ("merge or archive them on 0.4.0 first"). It rewrites `hordes/<h>/`: `teams/trunk/queue.json` → `queue.json` and `teams/trunk/issues/` → `issues/`, ticket numbers kept as `t-NNN`; `graph.json.ports` and `.proposals` → `proposals.json` with new `g-` ids from the counter and an old→new table appended to `decisions.md`; the ladder's working → `ladder.json`; `roster.json` entries → `idle`, owners → `gone` with a note; `territories.json` cut one-territory-per-node from the charter's `## Nodes`, so approvals on already-landed tickets mean what they meant; `leases.json` rekeyed; existing `**Keys:**` lines read as they are (owner approvals count as the territory's). It creates the architect's tree from the trunk tip and copies `worktree.copy` files into every existing worktree. It then runs the graph-text rail over every `charter.md` and `log.md` in the trunk tree and lists the ones that would refuse the next graph commit, for the architect to file as `g-` items of kind `charter`; the mission's decision `graph-text-is-plan-agnostic` already had the owners doing this by hand.

The adopter's Yggdrasil graph needs: the Yggdrasil 6.0.0 load-time notice for `version`/`test` on ports (fields ignored; remove them), `consumes` still read as an alias, and the eleven ports the mission approved with `aspects: []` load unchanged under 001. The first port on the shared node stops demanding thirty-three edits under 003, which is the change the mission's worker reverted its port publication over.

### What the adopter has to change in their own repository

Nothing in the commit hook. `horde init` on 6.0.0 reads it and asks the chairman to choose `config.judge`; an existing horde gets the question from `migrate`. If the repository's gate cannot run twice at once, nothing changes either, because the gate lock is Horde's; if it can, `HORDE_TREE` is available to the gate command for per-tree isolation and is optional.
