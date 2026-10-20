# Blocks and the composer: a coherence critique

An independent critic's reading of the "three blocks and one composer" concept as shaped on 2026-09-27. Date 2026-09-27. Read-only. Sources: `VISION.md`, the family canon (now `family/canon.md`), the mapping research [blocks and the composer](../2026-09-27-blocks-and-composer/report.md) (called "the mapping report" below), the 2026-09-25 Jarl and Horde research, the 2026-09-27 Yggdrasil knowledge-coherence audit, the rulings of the 6.1.0 loop (notably `blocks-and-composer`, the ruling on the type log and context, `mcp-parity`, `mcp-horde`, the ruling that the handoff comes from the CLI, the ruling to put everything into 6.1.0 without asking, the ruling on the parents hierarchy, and `fresh-reviewer-required`), the issues 440–453 of the 6.1.0 loop, and the READMEs and skills of Yggdrasil, Grain, Horde and Jarl on their `release/6.1.0` branches.

The brief asked for candour. Where this report disagrees with a ruling, it says so and gives the reason; the rulings remain the owner's.

## 1. Coherence verdict

**Short version: the direction holds, the cut does not yet.** "Law, measurement, work loop, composer" is a good way to explain the family, and it is a better story than "two doors". But the concept as ruled draws two of its three seams in the wrong place, hides one block that already exists inside Horde, and puts a 7.0-sized rebuild into a release that was paused for readiness two days ago. The blocks are independent in the dependency graph and coupled in everything else: roadmap, version number, record format and trust doctrine.

### 1.1 Are the blocks truly independent, or does Horde smuggle coupling back in?

At runtime they are independent: nothing in Yggdrasil, Grain or Jarl calls Horde, and ruling (6) of `blocks-and-composer` forbids blocks calling each other. At design time the coupling comes straight back in, through four channels.

- **Roadmaps are Horde-shaped.** Of the ten issues filed from the mapping research (441–450), every block-side issue exists because Horde needs it. Jarl's 441–444 add profiles, status flags, resolvers, gate commands, an ask schema, an id allocator, ISO-millisecond per-issue logs, JSON sidecars and event hooks. Grain's 446 adds partition scoring and as-of-sha measurement. Yggdrasil's 447 adds a batch `yg owner`. None of them was asked for by a solo user of that block. A block whose roadmap is written by its single consumer is a module of that consumer with a separate repository.
- **One version number.** `family.md` says the core shares a version "because they are one product and any drift between them is paid for by whoever installed them". Ruling (8) moves Jarl onto that number. That is an honest description of coupling. It cannot also be the description of independent blocks. You can have independent blocks with declared compatibility ranges, or one product with internal modules. The concept currently claims both.
- **Seam tests across repositories.** Grain's CI already fetches its neighbours' same-named branches, and the mapping report proposes the same for Horde against Jarl. That is lockstep development, which is fine, but it is the definition of a coupled product.
- **"Blocks never call each other at runtime" is weaker than it sounds.** A hook configured by the composer that runs `yg log add` when Jarl fires `decided` is a runtime call with one level of indirection. The real rule is "no block hard-codes another block's name". Say that, because it is the rule you can actually test (the mapping report's "word test").

None of this is wrong. It becomes wrong only if the public story says "independent blocks" and the install, versioning and release reality says "one product".

### 1.2 Is Jarl-as-engine a sound bet?

As ruled, not yet. Three findings from the mapping report, read together, point the other way.

1. **What moves is small.** Roughly 4,000–5,500 of Horde's ~23,100 script lines dissolve into Jarl: the record, rulings, handoff, part of the queue. Everything that makes Horde Horde (land, tick's holds and reconcile, leases, waves, blame, refine, node, law, audit, drill, retro) stays. The saving is about a fifth of Horde.
2. **What Jarl must grow is large and Horde-shaped.** About ten extension points, not four. A status profile with the flags `dispatchable`, `settles-dependents`, `holds-claim`, `terminal`, `closes-record` is Horde's two state machines flattened into flags. An ask schema with `Consumed` marks is Horde's `lower` answer. An id allocator shared across kinds is Horde's one counter. The word test passes because the names are neutral, but neutral names on a Horde-shaped interface do not make it generic. An interface extracted from exactly one consumer usually fits that consumer and nobody else; the usual guard is to wait for a second consumer before extracting.
3. **The two trust models are opposite, and the profile papers over it.** Jarl's `done` requires a fresh reviewer's approve (ruling `fresh-reviewer-required`). Horde forbids any review that signs; trust is manufactured in one place, the gate. A "done policy in the profile" makes both legal, which means the engine has no trust doctrine of its own. That may be acceptable for an engine, but then Jarl's public promise ("merges only after a fresh reviewer approves it") is a default, not a property.

And one finding the mapping report states but the ruling does not absorb: **merge is not in Jarl, and the ruling keeps it out** (decision 2(a): `land.mjs` keeps merging and records into Jarl). So the engine does not own the one transition that matters most. Horde on Jarl will be Horde's scheduler, Horde's gate, Horde's merge and Horde's leases, writing its bookkeeping into Jarl's files through ten ports. That is a shared record format, not an engine.

The cheaper and more honest version of the bet is the mapping report's option 1(c), which the ruling rejected: **Horde reuses Jarl's record layer as a library** (issue file format, lock, rulings with supersession, asks, the log, `resume`). That removes the duplicated bookkeeping and Horde's lock races (the 1.5 defects) without committing Jarl to a Horde-shaped plugin API. Extension points can follow when a second composer needs the same ones.

### 1.3 Are the boundaries at the natural seams?

Two seams are drawn along the engine, not along the job, and one block is missing.

- **Law and measurement are one job with a hardness dial.** Grain is described as measurement, but it already legislates. `grain decide steer`, `decide boundary --never-imports` and `decide waive` write maintainer decisions to `.grain/seeds.jsonl`. Grain's hooks speak after every edit and before every commit. Its own VISION row calls its output "soft law". So the family has two law systems: Grain's soft law (mined, advisory, edit-time) and Yggdrasil's hard law (declared, enforced, commit-time and CI). The seam between them is "statistics vs declaration", which is an implementation fact. For the user the job is one: "the rules of this repository, how sure we are of each, and how hard each one bites". The cleaner cut keeps Grain as the mining engine and gives the user one rule and decision surface with provenance (mined or declared) and hardness (note, advisory, enforced).
- **The landing gate is a block hiding inside Horde.** The mapping report's section 1.3 shows that `land.mjs` is a transactional merge executor (catch-up merge, sha pin, compare-and-swap `update-ref`, a resolver for the family's known conflicts: yg lock files, node logs via `yg log merge-resolve`, append-only files) wrapped around Horde-specific guards. The 6.1.0 loop, run on Jarl, resolved CHANGELOG, log and lock conflicts by hand dozens of times (the 2026-09-25 Horde research quotes the log). So Jarl's users need exactly the generic half of land, and Jarl's boundary refuses to grow it. That is the signature of a missing block: a capability two consumers need and neither may own. A "landing" block (merge executor plus pluggable conflict resolvers plus a pre-merge command hook) would sit between Jarl and Yggdrasil, serve both doors, and make Horde thinner than the Jarl-engine plan ever can.
- **Jarl as the work loop is the right seam.** It is the only block whose independence is proven by use: 453 issues across four repositories, run by Jarl alone, without Horde.

### 1.4 Where the pieces contradict each other or the thesis

1. **Two trust doctrines.** `VISION.md` says what lands "is decided by a mechanical gate rather than by anyone's say-so", and its frontier calls a model's verdict "a testimony at one point in time … calibrated and measured, never trusted". Jarl's done rests on a fresh LLM reviewer's approve, which is say-so by a model. The 2026-09-25 Jarl research counted 17 fresh approvals out of 221; the ruling then made fresh review mandatory. Under the composer, the same family ships a tool whose trust is testimony (Jarl) and one whose trust is mechanical (Horde), sharing one engine. That is defensible ("the lighter door has lighter proof"), but the thesis page does not say it.
2. **Softer artefacts need more consent than harder ones.** `VISION.md`: law is raised "freely and without a signature" by the agent working the territory. The ruling on the type log and context: an agent writes a type decision, which is never enforced, only after the user's consent. So an agent may add an enforced rule without asking and may not add an unenforced note without asking. The real reason is context budget (type decisions cascade into every agent's context), not authority. Calling it consent confuses the two, and it will be dropped the first time a loop runs under a mandate like the ruling to put everything into 6.1.0 without asking.
3. **Four decision stores.** Jarl `decisions.md`, Horde `decide.mjs`, Grain `.grain/seeds.jsonl`, and now `yg log --type`. Three of them hold "area decisions" in all but name, with different enforcement: Grain's boundary is flagged at edit time, Yggdrasil's type decision is never enforced, and Jarl's ruling is scoped to a loop that is deleted before the branch merges. The family breaks its own one-home-per-fact rule in its central noun.
4. **Grain proposes nodes; the owner is moving to types.** Grain's `propose` mines "components" into a graph with `yg-node.yaml` files, which is the file-heavy shape the owner is leaving. The adoption ladder (Grain first, then `yg adopt`) hands a new user the graph style its author no longer uses.
5. **"Two doors" survives only as a sentence.** If Horde runs on Jarl, there are not two doors; there is one loop with law optional. The canon should say that, and the rename below follows from it.
6. **The composer did not run the family's own mission.** The largest mission the family has had, this release, ran on the lighter door. Horde, the flagship "mission held to Yggdrasil's law", was not chosen for the owner's own repositories, all of which have Yggdrasil graphs. That is the most important product signal in the corpus, and no document I read discusses it.

## 2. Tensions and risks, ranked

Ranked by expected damage, high to low.

**1. The rebuild inside 6.1.0 (scope, not design).** The mapping report is titled "Research for the 7.0 line, not for 6.1.0". The ruling to put everything into 6.1.0 without asking moved it in, on the same day, with the coordinator deciding every open question. 6.1.0 was paused on 2026-09-25 for readiness; since then the loop went from roughly 231 to 453 issues, with 79 open and 22 in progress today. Issues 441–449 are each large and depend on each other in sequence (profile, then resolvers, then gates, then hooks, then Horde's port, then canon). The risk is a release that does not converge, and a family whose public version stays 6.0.0 while the internal design moves twice.

**2. A one-person maintainer with agent-written code and docs.** Four repositories, about 450 issues in eleven days, Horde's scripts alone at tens of thousands of lines with ~28,000 test lines, a TypeScript CLI, a mining engine with ~2,400 tests. The owner's own words in ruling `code-docs-conflicts`: code and knowledge "were created in parallel by agents … may be mixed up and may be wrong" (translated from Polish). That is the thesis's problem ("trust is the bottleneck") appearing inside the family's own development: the rails did not stop Yggdrasil's knowledge and code from drifting apart. More surface (profiles, hooks, four MCP servers, a composer) multiplies the places where that drift can happen, and the only reviewer of intent is one person who has just asked the loop to stop asking him.

**3. Jarl growing into a second Horde.** Jarl was 884 lines on 2026-09-25 and is 2,771 plus a 253-line MCP server today, before any of 441–444. It already has five roles (jarl, reeve, worker, reviewer, merger). Its "What Jarl will not grow" paragraph is two days old and is being reworded (ruling (1)) to "a profile may install them", which keeps the letter and drops the meaning: every tool "never blocks unless configured to". A solo Jarl user will pay for ten extension points in docs, CLI flags and MCP tool schemas while using none of them. Jarl's selling point is that it is light.

**4. Decision sprawl and the log semantics versus how agents behave.** The evidence on agent behaviour is in the 6.1.0 record: 143 issues filed with empty bodies, 119 self-reviews, 503 copied evidence lines. Agents fill required fields minimally and skip optional ones. Predictions for the log design:
- `yg log --node` (required when the node enforces it, due whenever node code changes per the ruling that the log comments on changes) will fill with low-value "why" entries written to satisfy the gate.
- `yg log --type` (never required, consent-gated) will stay nearly empty in autonomous loops and be written in bursts when a human is present.
- `--supersedes` needs an agent to know an earlier entry exists and is now wrong; agents that did not read it will append a contradicting one instead. Without a check that flags two live decisions on the same subject, supersession decays into "latest wins by accident".
- With four decision stores, an agent will write where its current tool points, and the same decision will exist in two places with different wording within a month.

**5. Node-less Yggdrasil versus features that assume nodes.** The owner is working with types only. Much of the family assumes nodes: `yg log --node` and `log_required`; relations and ports (declared per node); `ctx.node` and `ctx.graph`, which throw on a type-covered file; Horde's territory ("a ticket with no Files locks its whole node"), its architect's veto over graph items, "refine onto the graph", `node.mjs`; issue 447's batch `yg owner`; Grain's `propose` output. If types are the future, the enforced "why" discipline disappears silently for type-only graphs (only the unenforced type log remains), and Horde's core unit of work has no referent. This needs one explicit ruling: are nodes first-class, optional with a type-level fallback for every node feature, or legacy?

**6. MCP parity cost.** Parity doubles every public surface: each CLI flag is now also a tool schema, each rename breaks two interfaces, and each block runs its own server. Three of the fourteen newest issues (440, 452, 453) are MCP defects found within a day of the servers landing. With profiles, Jarl's tool list becomes per-loop (issue 444). Four servers with ~20–30 tools each also cost context in every session that loads them, which is the resource the family exists to save. Ruling `mcp-horde` asks for a Horde server on top.

**7. A block that is "independent" yet useless alone.** Yggdrasil and Jarl pass: each has solo value. Grain alone gives `where`, `how`, `check` hints with a denominator, which is useful but modest; its validation shows file-level co-change no better than popularity, and its strongest outputs (`propose`, `advise`, `.family-candidates`) only pay off with Yggdrasil. The new architect features (partition scores, as-of-sha measure) only pay off with Horde. Grain risks becoming the block whose headline value is "input for the other two". Horde is not a block and should not claim to be one.

**8. The adoption story ("Grain first").** The coordinator already had to soften it (the ruling that Yggdrasil's quickstart stands alone: Yggdrasil's README starts with `yg init`). Grain first means indexing a whole history and trusting statistics before any rule exists, then converting to a node-based graph through `yg adopt`. The documents I read show no outside adopter who went down that ladder; it is a designed path, not an observed one. Meanwhile the observed path (the owner's own) is "Jarl first, Yggdrasil by hand, types only".

**9. The consent rule for type decisions.** Covered in 1.4: it is a context-budget rule named as an authority rule, it inverts the thesis's raise-freely principle, and it fails open under any mandate. It will either block autonomous loops or be ignored by them.

## 3. Out-of-the-box ideas

Each with the why and a rough cost (S under a day, M a few days, L a week or more, for one agent-assisted maintainer).

1. **Extract the landing gate as its own block.** The generic half of `land.mjs`: catch-up merge, sha pin, compare-and-swap merge, pluggable conflict resolvers (yg lock takes a side, `yg log merge-resolve`, diff3 for append-only files), a pre-merge command hook that returns a structured verdict. *Why:* it is the capability both doors need and neither may own, and it removes the most repeated manual work in the 6.1.0 loop. Jarl users get it without Jarl growing a gate. *Cost:* M–L; the generic part is well under a quarter of `land.mjs`.

2. **One decision ledger with scope and hardness.** A single record type: `scope` (loop, area/type, repository), `hardness` (note, advisory, enforced), `provenance` (mined, ruled, declared), `supersedes`. Grain seeds, Jarl/Horde rulings and `yg log --type` become views or writers of it, and one check flags two live entries on the same subject. *Why:* the family's central noun currently lives in four stores. *Cost:* M for the format and readers; the migration is the real cost.

3. **Distil at loop close instead of consenting per decision.** At `jarl close` or Horde's `done`, a step lists the loop's rulings that name an area and proposes which become type decisions; the client approves the batch once. *Why:* it keeps the "only big decisions" filter, makes consent cheap enough to actually happen, and mirrors the distillation playbook of the repository the family was run from. *Cost:* S.

4. **Grain measures the loop itself.** Jarl's log and issue files are structured: compute cycle time, rounds, reopens, review provenance and rework per area (map issue `Files:` to Yggdrasil types). *Why:* the 17-of-221 fresh-review finding took a manual research pass; it should be a command. It also answers VISION's first frontier ("the rails must not rot") with data: which rules and areas generate rework. *Cost:* S–M, no new mining.

5. **Compile decisions into rules.** A type decision that states a checkable invariant gets a "compile" proposal: Grain counts how many places break it today (the denominator it already produces), and drafts a deterministic aspect at advisory status. *Why:* it closes the loop from "we decided" to "it is enforced", which is the thesis's own move, and gives each decision an honest cost before it hardens. *Cost:* M; it builds on the planned `advise kind: rule`.

6. **The integrator as a derived, verified "state of the area" page.** Per type, generated from live decisions, rule ids and Grain evidence; every sentence carries a citation to an entry id; a deterministic check verifies each cited entry exists and is not superseded. It is a cache, never a source: gitignored or regenerated, and nothing may cite it. *Why:* it gives agents one short page instead of three logs, while keeping the canonical homes canonical. *Cost:* M. *Risk:* agents read it instead of the rules; mitigate by having `yg context` emit rules first.

7. **One generic MCP adapter instead of four servers.** Each block exposes a command table and `--json` documents with schema names; one family package turns any such table into an MCP server. Parity becomes a property of the adapter, tested once. *Why:* it keeps the owner's parity ruling while paying for it once instead of per tool; it also caps the context cost by letting a session load only the tools it needs. *Cost:* M once, then S per tool, and it deletes three bespoke servers.

8. **Hooks and documents as the only public API between blocks.** Formalise what ruling (6) implies: blocks publish events and versioned JSON documents, and nothing else is a cross-block contract. Register them on the Family Contracts page with a compatibility range per block. *Why:* it makes block independence testable and lets blocks leave the shared version number. *Cost:* S to declare, M to enforce with contract tests.

9. **Build a second composer before generalising Jarl.** A 50–100 line example: "Jarl plus Yggdrasil's deterministic check as the done guard plus the landing block". Only the extension points both composers need get built. *Why:* it is the cheapest proof that the interface is generic, and it doubles as the "composer kit" others can copy. *Cost:* S–M.

10. **An LLM-free Horde mode.** Deterministic rails only: Yggdrasil script rules, the landing gate, Jarl's record, no reviewer tier; the agent runtime is pluggable, including a human. *Why:* it is the only configuration where every "proof" in VISION's sense is actually deterministic, it runs in CI without a key, and it makes Horde testable end to end. *Cost:* S–M, mostly configuration and one test path.

11. **Publish the 6.1.0 loop as a public benchmark.** The record already exists in publishable form: 453 issues, rulings, review provenance, rework. Publish it with the loop metrics from idea 4 and a scrub pass for tone. *Why:* "honesty is the brand"; a real, messy, counted record of agents building the tools that govern agents is stronger evidence than any demo, and it includes the 17-of-221 figure. *Cost:* S.

12. **An incident profile: the production seat from existing blocks.** A Jarl profile whose issue kind is `incident`, filed from production signal, whose `done` requires either a rule change (a ledger entry of hardness advisory or enforced) or a recorded waiver. *Why:* VISION's third frontier says the production signal "arrives at no seat"; this gives it a seat without a new tool. *Cost:* S–M once profiles exist; S as a convention before.

13. **Jarl issues as graph citizens, through hooks only.** An issue's `Files:` resolves to Yggdrasil types; `yg context` for a type lists open issues and live rulings touching it; blame runs line to merge trailer to issue. *Why:* the next agent touching an area sees the open work and recent decisions there. *Cost:* S–M.

14. **A "will not grow" list for every block, reviewed at each release.** Jarl has one; Yggdrasil, Grain and the landing block should too, and every composer-driven issue is checked against them. *Why:* it is the cheapest defence against risk 3 happening to every block in turn. *Cost:* S.

## 4. Opinion

In the owner's place I would keep the idea, change the cut, and take it out of 6.1.0.

**Ship 6.1.0 now, without the rebuild.** Take 441–449 out of the release, keep 450 (real Horde defects) and the small, Horde-independent items. The mapping report said this work was for 7.0, and I agree with the report over the ruling that overrode it. The family has been at 6.0.0 publicly while the loop grew from 231 to 453 issues. A release that ships is worth more to the thesis than a better architecture that has not.

**Keep Jarl as the proven heart, and keep it light.** It is the one block whose value is demonstrated by the owner's own behaviour. I would not turn it into a plugin engine for one consumer. For 7.0 I would do the mapping report's option 1(c) first: converge Horde's ticket, ask and ruling formats onto Jarl's, and share Jarl's record layer and lock as a library. That removes the duplication and the races for a fraction of the cost. Add extension points only when a second composer, even a toy one, needs the same point.

**Add the missing block: the landing gate.** It is the real seam the mapping report found, and it serves Jarl users today. After it exists, Horde is Jarl's record, the landing block, Yggdrasil's law, Grain's measurements and the architect. That is a composer worth the name, and it is thinner than the plan on the table.

**Merge the decision stores before adding a fifth.** One ledger, scopes and hardness, with distillation at loop close replacing per-decision consent. I would drop the word "consent" from the type-log rule and call it what it is: a context budget, enforced by a batched review at close.

**Rule on nodes.** Either nodes are first-class and the owner's type-only practice is a personal shortcut, or every node feature needs a type-level fallback and Horde's territory becomes "type within a directory". Right now the flagship composer is built on a unit the author has stopped using.

**Pay for MCP once.** One adapter from command tables; no bespoke Horde server in 6.1.0.

**Rename the doors.** "Two doors" no longer describes the design. I would say: **Jarl is the loop; law is optional; Horde is the loop with law turned on.** If the brand matters, let "Horde" name the composed distribution (the thing you install to get all of it), not a fourth peer of the blocks.

**Take the dogfooding signal seriously.** The owner ran the family's own biggest mission on Jarl, not on Horde. Before investing more in the composer, I would run one real, bounded mission through Horde on the family's own repositories and measure it against the Jarl loop with idea 4's metrics. If Horde does not win on rework or on review quality, the 7.0 plan should be smaller than it is.

**Stop multiplying surfaces until the knowledge-code drift is closed.** The owner said he does not know whether Yggdrasil's code or its knowledge is right. That is the thesis failing at home. More surface makes it worse; fewer, better-proved surfaces make the story true.

## 5. Questions the concept has not answered yet

1. Are the blocks independent products with compatibility ranges, or modules of one product with one version? The concept currently asserts both.
2. What does Horde give a user who already has Jarl and Yggdrasil's pre-commit and CI gate? Stated in one sentence, and measured.
3. Why was Horde not used for the family's own release, and what would have to be true for it to be used for 7.0?
4. Which trust doctrine is the family's: a fresh reviewer's approve (testimony) or a mechanical gate? If both, where does `VISION.md` say which door carries which?
5. Where does a decision live when Grain, Yggdrasil, Jarl and Horde can all record one? Which one wins when they disagree?
6. Are nodes first-class going forward? If not, what replaces them as Horde's territory, as the home of the enforced "why", and as the target of Grain's `propose`?
7. In an autonomous loop under a mandate like "stop asking", who consents to a type decision? Does a coordinator's ruling count?
8. What detects two live, contradicting type decisions, and what happens to `--supersedes` when the writer never read the earlier entry?
9. Is the integrator's page a source or a cache? May anything cite it?
10. Who owns merge? If the answer stays "Horde's land", how do Jarl users get conflict resolution without Jarl crossing its own line?
11. What is the second consumer of Jarl's extension points? If there is none, why build them now?
12. What is the context budget for MCP tools across four servers, and who enforces it?
13. Where does the production signal land? None of the blocks or the composer claims it, and `VISION.md` names it as a frontier.
14. What does "Grain first" look like for an outside adopter, and has anyone outside the family walked it?
15. What is the stop rule for 6.1.0: which issues can still enter, and who says no now that the coordinator decides without asking?
