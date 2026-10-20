# The family as blocks and a composer: the whole design (issue 459)

*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

**Status:** a proposal for the owner's decision. None of it is a ruling yet. **Date:** 2026-09-27. **Basis:** `VISION.md`, `family/canon.md` (the family canon), `family/map.md` (the tool map), the mapping report (`2026-09-27-blocks-and-composer`), the coherence review (`2026-09-27-blocks-coherence`, both versions: `report.md` and `coordinator-notes.md`), the Grain coupling evaluation (`2026-09-27-grain-coupling-evaluation`) and all the rulings of the 6.1.0 loop. On top of that, the code on the `release/6.1.0` branches: Yggdrasil @ b4ea723a3, Grain @ a53bb0f, JarlSkill @ 79020ef, Horde @ bbd50bb.

**Convention:** **[built]** means the thing exists in code today. **[proposed]** means design. Where I disagree with an owner's ruling, I say so plainly, in a "Disagreement" block, and give the reason.

---

## 0. One-page summary

The owner's direction holds up. Yggdrasil, Grain and Jarl are blocks, Horde is the composer, and Horde's architect measures with Grain. Two changes in the cut make it close cheaply and honestly. First: Horde stands on Jarl as a **record library and a data profile**, not as an engine with ten ports. Second: shared code goes to **Runes**, not into any block.

| # | Decision | Recommendation in one sentence |
|---|---|---|
| D1 | Blocks | The blocks are Yggdrasil (law), Grain (measurement) and Jarl (the work loop). Each has a list of things it will not grow. |
| D2 | Horde | Horde is a **product**, not a distribution: a mission held by law, measured, and landed mechanically. |
| D3 | "Law and measurement are one job" | **We do not merge them.** We get one decision surface through a precedence rule, and Grain's `decide boundary` is promoted to a Yggdrasil rule. |
| D4 | "The landing gate is the missing block" | **There is no block.** Conflicts are resolved by git merge drivers belonging to the tool that owns the file. The transactional merge stays in Horde, and Jarl does not get `land`. |
| D5 | Contracts | There are only three channels: registered documents, native hooks (git and the agent host) and code vendored from Runes or along a declared edge. The call rule is testable with the words test. |
| D6 | Versions | From 7.0.0 the four blocks have **one family number**. Runes has its own semver. Compatibility is carried by schema ids and pins, not by the number. |
| D7 | Horde on Jarl | Horde uses Jarl as a **record library** (vendored) and as a **data profile** (441). We do not build the command ports 442–444 until a second composer appears. |
| D8 | Trust | One doctrine holds: the mechanical gate decides, and review can only subtract. Jarl's approve is a recorded absence of objection, that is, testimony, not proof. |
| D9 | Runes | Source in TS, and a `dist` committed in git (ESM and `.d.ts`), also published on npm. In go relations, AST, the grammar recipe, the catalogue of 460 cases, the lock, the command table, the MCP adapter and the testkit. Jarl's record does not go in. |
| D10 | Vendoring | A pin is tag + commit + sha256 of the files. The commands are `runes.mjs check` and `runes.mjs update`; the clone goes to `.runes/`, which is in `.gitignore`. The gate runs in `npm test` and strictly in CI. Yggdrasil takes Runes from npm with an exact pin. |
| D11 | Knowledge | Every decision has a canonical home according to its reach. The consent rule is **reach**: a type is shared vocabulary, so the client gives consent; a node is territory, so the agent decides. The client ratifies decisions in one batch when the loop closes. |
| D12 | Nodes and types | The type is the default unit. The node is optional but first-class. The enforced "why" stays a node feature, which is a conscious price. |
| D13 | MCP | One adapter (Runes) and one server per plugin. The budget is 6k tokens of `tools/list` per server, checked in CI. Profile fields go through `--field`. Yggdrasil gets no server. |
| D14 | Adoption | You enter by pain, not by a ladder. Instead of "two doors": "Jarl is the loop. Horde is the loop with the law switched on and with Grain in the architect's hands." |
| D15 | Production | The seat of the signal is `yg incident` **[built]**. The work is carried by an issue of kind `incident` in Jarl **[proposed]**. |
| D16 | 6.1.0 | Ships without a rebuild, with a hard stop rule. Jarl stays in it as the add-on 0.2.0. |
| D17 | 7.0 | Measurement first: loop metrics and one real Horde mission. Runes runs in parallel. Rewiring Horde (L) starts only after the measurement result. |

There are five places where I disagree with a ruling or with its timing:

- The vendoring gate also runs in CI, not only in development.
- 442–444 are not built.
- Grain is required for Horde only after evidence that measurement changes something.
- Jarl joins the core in 7.0, not in 6.1.0.
- Horde's MCP only in 7.0.

Each of these places has a justification and options in the text.

---

## 1. The facts the design stands on

Some of these facts are new: they are in none of the three reports. Some of them correct the coherence review.

1. **Three of the four tool repositories have no Yggdrasil graph.** Grain, Horde and JarlSkill have 0 files under `.yggdrasil/`, both on `main` and on `release/6.1.0`. A graph exists in Yggdrasil (519 nodes) and in one other repository. The review wrote that all the owner's repositories have graphs. That is not true. Horde could not have run most of the 6.1.0 work, because it requires a graph. The question "why not Horde" therefore has a partly mechanical answer, not only a product one.
2. **Horde has already been used for a family mission.** `family/map.md` (the tool map) records that "the mission that made the three tools one system ran through Horde on 2026-09-05/06". That is one trial, two weeks before 6.1.0.
3. **Grain already vendors Yggdrasil code and nothing guards it [built].** `Grain/plugins/grain/engine/vendor/relations/*.mjs` is generated by `scripts/build-relations.mjs`: it strips the TS and rewrites the imports. The headers pin the source to Yggdrasil `3cedc47f8`, and since then two commits have landed in `source/cli/src/relations`: `0fdec170b` and `d87da71df`. The race is invisible today.
4. **The catalogue of 460 relation cases exists in two copies, byte for byte.** `Yggdrasil/reference/relations/**` and `Grain/plugins/grain/tests/relations/reference/**` are the same 460 files, and `cmp` shows 460 identical. Two suites test the same extractor.
5. **The grammars are duplicated, but pinned consistently.** Of the 16 pins in Yggdrasil's `language-registry.ts`, 15 have the same `wasmSha256` in Grain's `engine/grammars/manifest.json`. The four `tree-sitter-typescript-*.patch` patches are identical in both repositories. The exception is PHP: Yggdrasil uses `php_only`, and Grain `php`. Grain therefore runs Yggdrasil's vendored PHP extractor on trees from a different grammar. The catalogue passes, but it is an unmanaged divergence. Grain also has 8 grammars that Yggdrasil does not have. Sizes: Yggdrasil's `dist/grammars` takes 22 MB, Grain's `engine/grammars` 32 MB.
6. **The code that is a candidate for Runes is about 10k lines of TS.** It is made up of the extractors (7,764), `symbol-table`, `resolver`, `resolve-path`, `repo-layout`, `ast/walk`, `ast/parser`, `parse-cache` and `language-registry` (2,294 together). Yggdrasil's relation unit tests are 11,003 lines, and its `relation-<lang>` e2e tests are 11 files and 2,299 lines.
7. **MCP size measured today** (characters/4): Jarl's `tools/list` is 38 tools and about 12.7k tokens, Grain's is 25 tools and about 9.5k tokens. Yggdrasil has no MCP server and no plugin. It is the npm package `@chrisdudek/yg`.
8. **The seat of the production signal partly exists [built].** `yg incident add|read` keeps a committed register of escapes with a cause tag and an optional `--aspect`. `yg advise` and `yg aspects --health` read it.
9. **The words test exists [built].** `JarlSkill/skills/jarl/scripts/tests/words.test.mjs` forbids the words wave, architect and node in `jarl.mjs` and `jarl-mcp.mjs`.
10. **The loop profile (441) is merged [built].** It has statuses with the flags `dispatchable`, `holds-claim`, `settles-dependents`, `terminal`, `closes-record` and `needs-reason`, fields declared with `enum`, `default` and `required`, sections and `acceptance-heading`. Fields go through a general `--field "<Name>=<value>"`, and an unknown profile key is rejected.
11. **Law at the type level requires the client's consent [built].** Rules pinned to a type live in `yg-architecture.yaml`, and Yggdrasil's prime says of that file: "Changes require user confirmation". This fact puts the whole dispute about consent in order (§6.2).
12. **State of the 6.1.0 loop:** 459 issues, of which 362 done, 62 open, 17 in-progress, 12 deferred and 6 dropped. 442–449, 431 and 436 are deferred.

---

## 2. Boundaries: blocks, the composer, infrastructure

Each block has three lists: what it owns, what it promises on its own (without the rest of the family) and what it will not grow. The "will not grow" lists are to go into each tool's README or SKILL and are reviewed at every release. Every issue filed out of a need of the composer is checked against them first.

### 2.1 Yggdrasil: law

- **Owns:** the graph (types, nodes, relations, ports, flows), rules (deterministic and judged aspects), `yg check` with the verdict lock, the log (`--node`, `--type`, `--aspect`), the incident register, rule packs, the `yg-*/N` documents and their schemas.
- **Promises on its own:** every change satisfies the rules that cover it, which is checked before going further and again in CI without a key.
- **Will not grow:**
  1. a work loop, issues or a queue;
  2. statistics from history (that is Grain's domain, so Yggdrasil only reads `grain-advice/1` and proposals);
  3. executing merges;
  4. agent orchestration;
  5. knowledge of Horde and Jarl in its code;
  6. its own MCP server (the owner's decision, see §8).

### 2.2 Grain: measurement

- **Owns:** the repository index, conventions with a denominator, co-change, `propose` and `advise`, measurement (selftest, oracle), calibration seeds (`.grain/seeds.jsonl`).
- **Promises on its own:** every claim about the repository has evidence and the number of places that break it, and it never blocks anything.
- **Will not grow:**
  1. blocking (hooks speak, they do not stop);
  2. new kinds of `decide` beyond `steer`, `waive` and `boundary`;
  3. its own graph format (it writes only Yggdrasil's proposal format);
  4. a work loop;
  5. reading Jarl's or Horde's state (`.jarl/`, `.horde/`), because loop metrics are computed by Jarl itself (§12);
  6. its own copy of the relation extractors (after Runes).

### 2.3 Jarl: the work loop

- **Owns:** the loop record (issues, log, rulings with supersession, questions, ratifications), roles (jarl, reeve, worker, reviewer, merger), views (`resume`, `status`, `report`, `queue`, `tips`, `branches`), the profile as data.
- **Promises on its own:** every problem has an issue, every issue has one worker in its own worktree, and nothing is closed without evidence and a fresh review.
- **Will not grow:** the current five-point list in `SKILL.md` stays (a merge queue with its own criteria, `done` waiting for CI, working leases and locks between loops, a release mode, a critical-path planner). I change one paragraph under the list. The current sentence "the profile can install such things as commands" I replace with: "the profile is data only; Jarl does not execute commands supplied by a profile". The reason is in §4.1.

### 2.4 Horde: the composer, as a product

**Decision: Horde is a product, not a distribution.** The distribution is the plugin catalogue, from which each block is installed separately. Horde cannot install other plugins, because plugins have no dependencies. Horde has its own promise, which no block gives, nor their sum put together "by hand": *a mission of any size is laid out on the graph before anyone starts writing; every change lands only through a gate that no agent can talk its way past; what the mission learned stays as law.*

Its irreducible parts:

- the architect (one judgment on the whole plan, measured with Grain);
- `refine` onto the graph;
- the landing gate with nine items and a transactional merge;
- leases between hordes;
- `legislate`, `audit`, `drill`, `retro`, `escalate`, `blame` and the client report.

What Horde will not grow: its own loop record (it takes that over from Jarl, §4), its own law format, its own statistics (Grain gives those) or features that a block could give its users on its own.

### 2.5 Runes: infrastructure, not a family member

Runes has no user, makes no promise and does not exist at runtime as a separate entity. It exists only as code: vendored in the blocks or installed from npm. Details in §5.

### 2.6 "Law and measurement are one job": we do not merge them

The critic is right about the symptom. Grain already legislates through `decide boundary --never-imports`. But I would be wrong if the conclusion were to read "one block", and I do not merge them, for four reasons:

1. The "measured" / "established" boundary is an honesty boundary that VISION puts forward. A claim with a denominator is something different from a declaration with evidence.
2. The failure modes are opposite: Grain never blocks, Yggdrasil blocks by design.
3. Grain works without Yggdrasil, and its standalone value (`where`, `how`, `check`) would vanish in a fusion.
4. The cadences differ: the index is rebuilt from history, and the verdict lock grows with commits.

From the critique I take the core: the user has one rule surface. **[proposed]** It works like this:

- `steer` and `waive` stay in Grain, because they are *calibration of the instrument*: they say what to count as a deviation, not what is law.
- `boundary` is law. When the repository has a graph, `grain advise --json` exposes every boundary as an item of `kind: rule`. That kind is reserved and not emitted today (`family-contracts.md`, "What each producer fills"). An exposed boundary is a draft Yggdrasil rule with a measured violation count.
- Once the rule is adopted, the seed gets a `promoted` marker and Grain stops flagging it, because `yg check` already does.
- Precedence on disagreement is described in §6.1.

### 2.7 "The landing gate is the missing block": there is no block, there is a mechanism in two pieces

The critic's analysis is accurate. The generic half of `land.mjs` is something a Jarl user needs. The coordinator resolved conflicts in `CHANGELOG`, logs and locks by hand "dozens of times". I divide it differently from the critic, though.

1. **Conflicts are resolved by git merge drivers belonging to the file's owner [proposed].** `.gitattributes` is git's native mechanism and works for everyone who merges: a human, Jarl's merger and `land.mjs`. No tool needs to name another for this.
   - Yggdrasil supplies drivers for its files, that is, `log.md` (the logic of `yg log merge-resolve` as a driver) and the lock files (it takes the parent's side, and the pairs stay unverified, in line with today's semantics). `yg init` writes `.gitattributes` and the local `merge.<name>.driver` configuration.
   - For `CHANGELOG.md` and Jarl's log files in committed mode (`log.md`, `decisions.md`) the built-in `merge=union` is enough.
   - A driver that is not defined in the clone's configuration should fall back to an ordinary text merge, that is, to a conflict, not to a wrong result. This is to be confirmed by a test at rollout.
2. **The transactional merge stays in Horde.** That means pinning the sha, a compare-and-swap `update-ref`, catch-up and a target that depends on the ticket. It has one consumer today, because Jarl's merger is serial and single. When a second consumer appears, the executor moves to Runes (the "two consumers" rule, §5.1).

The result: Jarl's users get conflict resolution, and Jarl does not cross its own line. The first point of its "will not grow" list stays untouched.

---

## 3. Contracts between blocks

### 3.1 Only three channels

1. **Documents.** JSON or YAML with a named, versioned schema id, registered on the Family Contracts page **[built: the page and the guard in Yggdrasil and in Grain's seam job]**. New rows are added: Jarl's profile (`jarl-profile/1`), its `--json` views consumed by Horde, and the record format (§4.4).
2. **Native hooks.** These are git hooks (pre-commit, merge drivers) and agent host hooks declared by a plugin (SessionStart, PostToolUse). **There are no event hooks between tools** (444). A composer that wants to react to an event does it itself, because it is the one that writes.
3. **Code.** Either vendored from Runes, or vendored along a declared edge, as Horde does from Jarl. Nothing more.

### 3.2 The call rule, worded so that it can be checked

> In the code shipped by tool X (`scripts/`, `engine/`, `bin/`, `src/`), no literal, import or file name points at an executable, a package, an MCP tool prefix (`yg`, `grain_`, `jarl_`, `horde_`) or a state directory (`.yggdrasil/`, `.grain/`, `.jarl/`, `.horde/`) of another family tool, unless the pair (X, that tool) is an edge in table 3.3. The word `horde` does not appear in the code of any block. Reading another tool's document is allowed in every direction, provided it is read by a schema id registered on Family Contracts.

**Test [proposed]:** `runes/testkit/words` generalises Jarl's present `words.test.mjs`. Every repository has a `words.allow` file with the allowed occurrences, reviewed like code. The test runs in every repository's CI, and the schema id guard already exists.

### 3.3 The dependency graph after 7.0

| Edge | Kind | State |
|---|---|---|
| Horde → Yggdrasil | required, CLI calls and documents | [built] |
| Horde → Jarl | vendored code (the record) and the `.jarl/` format; Jarl's plugin recommended, not required | [proposed] |
| Horde → Grain | required in 7.0 **conditionally** (§11, decision 7) | [proposed] |
| Grain → Yggdrasil | optional: calls (`yg drill`) and documents | [built]; the copy of the relation code disappears in favour of Runes |
| Yggdrasil → Grain | none; only reading `grain-*` documents by schema id | [built] |
| Jarl → anything | none | [built] |
| Each → Runes | code (vendor or npm), not a family edge | [proposed] |

### 3.4 Versions: one family number, compatibility in schema ids and pins

**The choice:** Yggdrasil, Grain, Jarl and Horde have one number from 7.0.0. The number means a set built and tested together. It is not a compatibility promise, which Yggdrasil already writes today in `family-contracts.md` ("The version number is therefore not a compatibility promise"). Compatibility is carried by three things:

- document schema ids (`/N` → `/N+1` when the shape or the meaning changes);
- `jarl-profile: N` and the record format marker (§4.4);
- exact pins of vendored code (commit and sha256).

Runes has its own semver, because it is not a family member and is released when a consumer needs something. The add-ons (Ratatoskr, Urd, Researcher) stay on their own numbers.

**An honest sentence for the canon:** "Four blocks, each usable on its own, released together as one tested set". The review was right that one cannot say at the same time "independent products with compatibility ranges" and "one number". I choose "usable on their own", not "versioned on their own".

The cost of this choice: a user of Jarl alone will see a jump 7.0.0 → 7.1.0 with no changes in Jarl. That is the price of one number, and I accept it.

---

## 4. Horde on Jarl

### 4.1 Decision: a record library and the profile as data, without command ports

The mapping report showed that what truly moves to Jarl is 4,000–5,500 of the ~23,100 lines of Horde's scripts. In exchange, Jarl would have to grow by about ten Horde-shaped extension points, not four. The review added a principle that I accept: an interface extracted from one consumer is not built before the second consumer. There is no second consumer of the command ports today, so:

- **441 stays [built].** Statuses with flags and declared fields are exactly what the library model needs: Horde's loop lies on disk as a real Jarl loop, and Jarl's views read it correctly.
- **442 (resolvers), 443 (command gates) and 444 (event hooks) are not built.** They come back only when a second composer, even a toy one, needs the same point.
- **Jarl gets two data flags in the profile [proposed, S].** The profile moves to `"done-gate": { "approve": "fresh" | "none", "requires-merged": true|false }`. `approve: none` may be set only together with `requires-merged: true`. Then entering a `closes-record` status requires a `Merged` field with a sha that is an ancestor of the loop's base. This closes the "`jarl set done` without landing" workaround with data, not with a command. `requires-merged` is useful to Jarl itself too.
- **Jarl gets `decide --area <text>` [proposed, S].** It is an opaque ruling field, needed for distillation (§6.4). This is the whole "Jarl side" of 436.

> **Disagreement.** The owner wants "to do what he said, as far as possible" (translated from Polish), and the coordinator ruled the ports to be profile commands. The library model still means "each block builds on another": Horde stands on Jarl's format, lock, rulings, questions and views, and a Horde mission is a Jarl loop on disk. It does not mean, however, that Jarl runs Horde's code. The cost of rejecting the ports is the loss of "engine" as a slogan. The gain is a Jarl that stays light for the standalone user, and no frozen API extracted from one consumer. Options for the owner: (a) the library now, ports with a second composer (recommendation); (b) ports 442–444 in 7.0 as in the coordinator's plan; (c) Horde keeps its own record, and only Runes is shared.

### 4.2 What moves, what is shared, what stays

| Part | Fate | From where and to where |
|---|---|---|
| Lock, atomic write, finding the root | shared | Runes `/fs`; the model is Jarl's lock (pid + host + age), stronger than Horde's |
| The ticket record (issue.md, fields, sections, acceptance), rulings with supersession, the global log, `resume` | moves | vendored from Jarl; the mission loop lies in `.horde/hordes/<h>/.jarl/` through `--root` [built: `--root`] |
| `handoff.mjs`, `decide.mjs`, the record half of `tk.mjs`, the `status.mjs` counters | disappear | replaced by Jarl's record |
| Horde's states (proposed, queued, running, landed, changes, blocked, merged, dropped) | Horde's profile | 441; `proposed` without flags, so the architect's veto stays (nobody but `refine` moves a ticket to `queued`) |
| Holding questions (stop, stuck, charter, lower) and answers consumed by `land` | stay in Horde | their effect (holding) is Horde behaviour |
| The scheduler (`tick`), readiness with port edges, the comparator, the round limit, reconcile, leases between hordes | stay | computed edges do not go into `After`; `jarl next` on a Horde loop is informational, which has to be documented |
| Per-ticket log with ms, JSON sidecars (lease, gate) | stay | Horde's files next to the record |
| `land.mjs`, `refine`, `node`, `law`, `audit`, `drill`, `retro`, `escalate`, `wave`, `blame`, `brief`, `report` | stay | `land` writes `jarl merged --sha` and the status through the library |
| The shared t-/g-/a- counter | stays for g- and a-; tickets are numbered by Jarl | the prefixes tell them apart; the "one number" invariant becomes a "one prefix" invariant |

**Installation:** Horde vendors Jarl's scripts directory at a Jarl tag, with a pin as in §5.5. If Jarl's plugin is installed, the director uses the `jarl_*` tools. If not, it uses the vendored CLI. Horde's MCP server does not repeat Jarl's tools, so as not to pay for context twice. A version mismatch between the installed Jarl and the vendored one ends loudly, because a profile with an unknown key is rejected **[built]**.

### 4.3 The trust doctrine: one, not two

The review sees two doctrines: testimony (Jarl) and mechanics (Horde). After reading both mechanisms I see one, written in two vocabularies:

- **Jarl:** the merger runs the *repository's check* and reverts with `reset --keep` on red (a mechanical gate). The merge also requires a fresh approve, and an approve without the check lets nothing in.
- **Horde:** the nine items of the checklist decide (a mechanical gate). The review has to take place (or a skip is recorded), and a critical finding from it sends the ticket back.

In both doors the mechanical gate is necessary, and review can only subtract and will never turn red into green. The difference lies in the vocabulary (approve versus a closing line with a counter) and in the fact that Horde allows a recorded skip.

**Proposed text for VISION** (in English, because that is VISION's language): *"What lands is decided by a mechanical gate in both doors. A fresh reviewer is required too, and its power runs one way: it can stop a change, never make a failing check pass. Its word is recorded as testimony — counted, never called proof."*

**The doctrine for Jarl:** approve means "a recorded absence of objection from a fresh reviewer" (the ruling `fresh-reviewer-required` stays unchanged). A loop with the profile `approve: none` hands landing over to the composer's gate and must have `requires-merged`. Jarl without a profile keeps the promise from the canon.

### 4.4 Who merges, and how Jarl's users get conflict resolution

- **Jarl:** the merger (prose in SKILL, no new command) and the merge drivers from §2.7.
- **Horde:** `land.mjs`, which uses the same drivers. Its own resolver of known conflicts shrinks to a git call.
- **Record format:** `.jarl/` gets a format marker (`"format": 1` in the profile or `.jarl/FORMAT`) [proposed, S]. The vendored and the installed Jarl refuse a format they do not know.

### 4.5 Missions open on 6.x

They finish on 6.x. Horde 7.0 refuses a `.horde/hordes/<h>/` without a Jarl loop and names the version in which it has to be finished. `blame` keeps a reader for archives in the old format. `.horde/` dies with the mission by design, so a migrator is unnecessary.

---

## 5. Runes: shared code and vendoring

### 5.1 What goes in, and what stays in the block

**The entry rule:** code goes to Runes when it has at least two consumers (or when a vendored duplicate of it already exists) and carries no word from the domain of any family tool.

| Module (subpath) | Contents | Consumers | State today |
|---|---|---|---|
| `runes/relations` | extractors for 11 languages, `symbol-table`, the three-state resolver, `resolve-path` without `guardedResolve`, `repo-layout` | Yggdrasil (npm), Grain (vendor) | code in Yggdrasil, a copy in Grain |
| `runes/ast` | `walk`, parser initialisation with an **injected** tree-sitter runtime | as above | as above |
| `runes/grammars` | the pin manifest (the union of both sets), patches, a build script with sha256 verification | as above | two pipelines: `scripts/grammars.mjs` and `build-grammars.mjs` |
| `reference/relations` + runner | the catalogue of 460 cases | Runes tests | two identical copies |
| `runes/fs` | `withLock`, `writeAtomic`, the root through the git common dir | Jarl, Horde, Grain (cache) | Jarl's lock is the strongest |
| `runes/cli` | the command table schema, `parseArgs`, the error document `<tool>-error/1`, the one-`--json`-block principle | Jarl, Grain, Horde | each does it its own way |
| `runes/mcp` | a stdio server generated from the table, with two executors: in-process (Jarl) and through a CLI spawn (Grain) | Jarl, Grain, Horde | two servers write the same thing |
| `runes/testkit` | git env (`maintenance.auto=false`, `gc.auto=0`, identity; from Grain 409 and Yggdrasil 451), the CLI↔MCP parity assertion, the words test, the `tools/list` budget | everyone (Yggdrasil as a devDependency) | scattered |
| `tools/vendor.mjs` | the vendoring and gate tool | everyone who vendors | an owner's ruling, not designed yet |

**Never into Runes:**

- Jarl's record (issues, rulings, questions), because it is Jarl's domain (§5.10);
- anything that knows a node, type, aspect, graph, convention, loop, mission or ticket;
- Yggdrasil's `owner-index`, `type-gate`, `verifier`, `pass`, `facts-cache` (that is resolution onto the node model);
- Grain's convention extraction (§5.4);
- the transactional merge, as long as it has one consumer;
- the family canon check, which runs at release, not daily;
- executables and CLIs (Runes has no `bin`);
- network at runtime;
- runtime dependencies.

The guard: Runes' own words test, with a list of tool names and domain words.

### 5.2 Language, build, packaging

- **Source in TypeScript.** The relation code is already in TS, and Yggdrasil needs the types.
- **Build:** `tsup` or `tsc` to ESM `.mjs` with `.d.mts`, target Node 18, because Jarl requires that in `engines`. The output in `dist/` is **committed in git**, because vendoring by clone (the owner's ruling) needs ready JS in the repository. CI checks that `dist` is fresh: a rebuild and `git diff --exit-code`.
- **Publication on npm** as `@chrisdudek/runes`, one package with subpaths in `exports`.
- **Zero runtime dependencies.** The relations take `Parser` and `Language` objects as arguments, so they do not import `web-tree-sitter`. Today's import rewriting in `build-relations.mjs` ("must bind the SAME web-tree-sitter module instance") disappears, and `kotlin-recover` gets an injected parser.

### 5.3 Grammars: Runes holds the recipe, not the bytes

**Decision:** Runes holds the pin manifest (repo, commit, `wasmSha256`, `nodeTypesSha256`), the patches and the build script. It does not hold the WASM files.

- **Size.** 22–32 MB of binaries in the Runes git history would grow with every pin change. The consumers have them anyway: Yggdrasil builds them into `dist` at build time, Grain commits the output.
- **Byte identity.** It is guaranteed by the sha256 pins and the reproducible build, which Yggdrasil has already proven ("byte-reproducible … Linux x64 and macOS arm64"). The same sha means the same grammar, wherever it was built.
- **Licences.** Runes redistributes nothing. Consumers that ship WASM carry a NOTICE as they do today.
- **Patches.** They are in one place, not in two identical copies.
- **Subset.** A consumer picks the languages (`--only`). The manifest is the union: Yggdrasil's 16 pins and Grain's 8 extra ones.
- **PHP.** One of `php` or `php_only` has to be chosen for the extractor, and both tools must use the same one. That is a technical decision at migration, with the catalogue test as evidence.

### 5.4 Unification: relations yes, convention extraction no

- **Relations:** Grain already runs Yggdrasil's extractors today (`engine/relations.mjs` imports from `vendor/relations/`). Unification is therefore a fact. Only governance is missing: a pin, a gate and one suite.
- **Grain's convention extraction** (`extract.mjs`, "binding-driven, language-free") serves something else: declarations, scopes and members in 23 languages without per-language code, as features for learning norms. It is not extraction of dependency edges. It stays in Grain.

**The product gain from an identical extractor:**

1. An edge in Grain's proposal is the same edge that `yg check` sees, so `yg adopt` of a proposal is green on relations by construction.
2. "Undeclared coupling" in `grain advise` and `relation-undeclared-dependency` in Yggdrasil speak about the same pairs, so the tools do not contradict each other in front of the user.
3. An extractor fix reaches both through one tag, not "some day, when someone runs `build-relations`".
4. Pace: the 460 cases are tested once.

### 5.5 Vendoring mechanics

The layout in a vendoring consumer, with Grain as the example:

```
Grain/plugins/grain/engine/vendor/runes/          # committed copy of selected files from Runes dist/
Grain/plugins/grain/engine/vendor/runes.pin.json  # pin
Grain/plugins/grain/scripts/runes.mjs             # copy of Runes tools/vendor.mjs (itself under the pin too)
Grain/.runes/                                      # in .gitignore: shallow clone for the gate
```

`runes.pin.json`:

```json
{ "source": "https://github.com/krzysztofdudek/Runes", "tag": "v1.3.0", "commit": "<sha>",
  "paths": ["dist/relations/**", "dist/ast/**", "dist/mcp/**", "dist/fs/**"],
  "files": { "relations/resolver.mjs": "<sha256>", "...": "..." } }
```

Commands:

| Command | What it does |
|---|---|
| `node scripts/runes.mjs check` | **The gate.** Runs `git clone --depth 1 --branch <tag> <source> .runes/<tag>` (reusing an existing one), checks `rev-parse HEAD == commit` (a moved tag is an error), and compares every file of the copy byte for byte with the clone's `dist/` and with the sha256 in the pin. Output: a list of mismatches (a file edited by hand, missing, extra, or a pin that does not match the tag), exit 1. |
| `node scripts/runes.mjs update [--tag vX.Y.Z]` | Fetches the tag, copies `paths`, rewrites the pin, prints the changed files and the Runes CHANGELOG entries between the old and the new tag. The developer makes one commit of it, `runes: X.Y.Z`. |
| `RUNES_DIR=../Runes node scripts/runes.mjs check --local` | Compares with a working copy of Runes next to it, for co-authoring a change before the tag. A report only, never "green". |

Where the gate runs:

- The consumer's `npm test` runs `runes.mjs check` as its first step.
- Offline in development the gate says "skipped: no network" and does not block.
- With `CI=true`, no network is an error.
- Optionally as a pre-commit hook.

> **Disagreement (small).** The owner said: "only within development" (translated from Polish). I propose the same script in CI too, in strict mode. A check that is skipped offline in development, with no strict version in CI, is not a check. Cloning a public repository in CI costs seconds.

Four repositories:

| Consumer | How it gets Runes | Gate |
|---|---|---|
| Yggdrasil | `"@chrisdudek/runes": "1.3.0"` (exact) in `dependencies`, bundled by `tsup` | npm lockfile integrity and a test "Runes version == the pin from `package.json`" |
| Grain | vendor: relations, ast, grammars (recipe), mcp, fs, testkit | `runes.mjs check`. `build-relations.mjs` and `build-grammars.mjs` disappear or become a thin call of the recipe from Runes. |
| Jarl | vendor: fs, cli, mcp, testkit | `runes.mjs check` |
| Horde | vendor: fs, cli, mcp, testkit, plus a second pin `jarl.pin.json` for Jarl's scripts directory at a Jarl tag | the same tool, two pins |

**Relation compatibility at release.** Grain's seam job already checks out Yggdrasil. It gets an assertion: "the tag in Grain's `runes.pin.json` == the Runes version in Yggdrasil's `package.json`". On branches it is advisory, on `release/*` it blocks. Thanks to this, Grain's proposal and `yg check` in one release have the same extractor.

### 5.6 Tests

**The Runes suite:** unit tests of the moved modules, the catalogue of 460 cases, grammar pipeline tests (sha verification), the `dist` freshness test, the words test, the tests of `fs`, `cli`, `mcp` and `testkit`. CI runs on a matrix of Node 18, 22 and 24.

**What moves to Runes:**

- `Yggdrasil/reference/relations/**` and `tests/unit/relations/reference-case-runner.ts`;
- `tests/unit/relations/extractors/*` (34 files);
- the tests of `symbol-table`, `resolver`, `resolve-path`, `registry`, `candidate-parity`, `csharp-parity`, `extractor-rev`;
- the grammar pipeline tests.

From Grain, the copy of `tests/relations/reference/**` with the catalogue runner is removed, because it is identical.

**What stays with the consumer as a seam test:**

- **Yggdrasil:** `tests/e2e/relation-<lang>.test.ts` (11 files) and `cli-relations*.test.ts`. They run the CLI and check resolution onto the node model, the type-gate and the verifier, which Runes does not have. The unit tests of `owner-index`, `type-gate`, `verifier`, `facts-cache`, `feature-vector` and `messages` stay too.
  - **A nuance to the owner's example:** the e2e tests cannot move to Runes, because they run Yggdrasil. I propose to *slim them down*: cases already covered by the catalogue drop out. What stays is one case per language, which proves that the CLI wires Runes in correctly, plus the cases that depend on the node model.
- **Grain:** `tests/relations/e2e` and `e2e-cli`, which run `grain export` and check directory ownership (`dirOwner`), and `csharp-project-scope-check`.

**Consumer smoke in Runes CI [proposed]:** one job modelled on Grain's seam job. It checks out Yggdrasil and Grain (the branch with the same name if it exists, otherwise `main`) and slips them a Runes build: to Yggdrasil through `npm install <tarball>`, to Grain through `runes.mjs update --from <path>`. It runs only their relation seam suites, not the whole suites. A Runes tag requires a green smoke: the release workflow depends on this job.

**The path of a Runes change to the consumers:**

1. **Tag.** A PR to Runes, CI green (unit, catalogue, `dist` freshness, words, smoke), tag `vX.Y.Z`, and the release workflow publishes to npm.
2. **Pin bump.** One commit in each consumer: `runes.mjs update --tag vX.Y.Z` or `npm i -E @chrisdudek/runes@X.Y.Z`.
3. **Gate.** `runes.mjs check` in the consumer's `npm test` confirms that the copy is exactly the tag.
4. **The consumer's CI.** The full suite with the seam tests.

Consumers bump their pins when they want. Compatibility is required only at a family release (the assertion from §5.5).

### 5.7 Ownership, releases and the cost for one person

- **Versioning:** semver, one version for all subpaths, a major on a breaking change, no backports.
- **Releases:** on a consumer's request, automated (tag → npm).
- **CHANGELOG:** one line per change.
- **Cost:** one more repository with CI and a release workflow, about 10k lines moved (not new), one cross-repository job. Gain: about 284K unguarded vendored files disappear, along with 460 duplicated cases, two grammar pipelines, two copies of the patches and three MCP server implementations (Jarl, Grain and Horde's future one).
- **Risk:** Runes as a dumping ground (§13, R1). It is guarded by the entry rule from §5.1 and the words test.

### 5.8 Place in the family's documents

- Runes does not enter the family canon (the `CANON:FAMILY-SECTION` block), the canon sync check (now `ws check canon-sync`) or the family tables.
- In `family/map.md` (the tool map) it gets a row in a new section "Infrastructure (not a family member)".
- `family/canon.md` (the family canon) gets one sentence outside the canon block, at the dependency graph: "Runes is shared code, vendored or installed; it is not a family member and adds no edge."
- The family's release procedure gets a step "Runes pins consistent across all of the release's repositories, before the version bump".
- The boundary rail changes nothing: Runes is generic and names no private party. The existing document type already covers the family's folder, so no new region is needed.
- Family Contracts gets no rows, because Runes produces no documents.

### 5.9 The Runes schedule

- **Not in 6.1.0** as a release dependency. Yggdrasil 6.1.0 with a new runtime dependency on a week-old repository would multiply the risk of a release that is meant to close.
- **Yes in 6.1.0 (S):**
  - resync Grain's `vendor/relations` with Yggdrasil `release/6.1.0` through the present `build-relations.mjs`;
  - add to Grain's seam job a step "regenerate from the Yggdrasil checkout and `git diff --exit-code engine/vendor/relations`". It is the precursor of the Runes gate, it closes today's invisible race and it does not change the architecture.
- **The Runes bootstrap (0.x)** can start right after the 6.1.0 release, or in parallel if it touches only the Runes repository and no `release/6.1.0` branch. That is the owner's decision; I recommend "after the release".

### 5.10 Does Runes change the answer to "engine or library"?

It strengthens the library, but it does not move the record. The record (issue, ruling, question) is Jarl's nouns. If it lay in Runes, Jarl would not own its own format, and every format change would go through two repositories, which is exactly the routing through a central repository that the owner does not want. That is why Horde vendors the record **from Jarl**, along the Horde → Jarl edge, with the same tool and the same gate. Runes gives the vendoring mechanics, not a change of owner.

---

## 6. Decisions and knowledge

### 6.1 Four stores, one precedence rule, homes by reach

I do not create one physical register. The stores have different life cycles, and a shared register would require shared domain code in Runes, which §5.1 forbids. Instead I introduce one division by reach and one order.

| Reach | Canonical home | Who writes | Life cycle |
|---|---|---|---|
| a code area (a type and its subtree) | `yg log --type` | the agent after the client's ratification (§6.2), Horde itself, Jarl through distillation | durable; only the binding entries in context |
| one node | `yg log --node` ("why") | the agent working in the node | durable; enforceable through `log_required` |
| a rule's history | `yg log --aspect` | whoever changes the rule | outside the context |
| a loop or a mission | Jarl's `decisions.md` (Horde through Jarl's record) | the coordinator and the owner | a loop on a branch dies with the loop, a permanent one stays as the record |
| measurement calibration | `.grain/seeds.jsonl` (`steer`, `waive`) | the maintainer | durable |
| an import boundary | a Yggdrasil rule if there is a graph; otherwise a `boundary` seed | as above | promotion through `advise kind: rule` |

**Precedence on disagreement:** an enforced rule > a type decision (the nearest type first) > a loop ruling > a Grain seed. The lower one yields. Detecting contradictions: where it can be done deterministically, §6.3 does it. The rest I leave to the integrator, "for later" (437).

### 6.2 Consent and the context budget: reach decides, not hardness

The review claims that a soft artefact (a type decision) requires more consent than a hard one (a rule), so the thesis is inverted, and "consent" is in fact a budget. Fact 11 from §1 shows something else. **A rule pinned to a type also requires the client's consent**, because it lives in `yg-architecture.yaml`. A rule pinned to a node does not. A node log does not require consent; a type log does. The consistent principle therefore reads:

> **A type is shared vocabulary. Everything that reaches every file of the type, law and decision alike, is admitted by the client. A node is territory. The agent that works in it raises law and writes the "why" freely.**

The context budget is the effect, not the cause. A type entry falls into the context of every agent in the subtree and cannot be proven, so it enters only through a human.

**Under the mandate "stop asking" (translated from Polish)**, a coordinator's ruling is not consent. The type entry is filed as a `ratify` question (that kind exists in Jarl **[built]**) and is ratified in a batch at closing (§6.4). Work does not stop, because the decision acts in the loop as a ruling at once, and enters the shared vocabulary only after ratification.

**Text for VISION** (in place of "Law is raised … freely and without a signature"): *"Within its territory, law is raised freely by the agent working it. Law or decisions that reach a whole type are shared vocabulary: the client admits them, in one batch, when the work closes."*

The consequence when working "mainly on types" (translated from Polish): most of the law passes through the owner. That is why ratification by batch must be cheap, that is, one list and one "yes".

### 6.3 `--supersedes`: failure modes and guards

| Failure mode | Guard | Cost |
|---|---|---|
| The writer did not read an earlier entry and appends a contradicting one | `yg log add --type` shows the live entries of the type and of its ancestors, and refuses when there are any and neither `--supersedes <id>` nor `--adds` (a conscious "I am adding, not replacing") was given | S; to be wired into 433, which is in progress |
| `--supersedes` points at an entry that does not exist | refusal (433's acceptance) | [in progress] |
| The wrong, but existing, entry is superseded | not detectable deterministically; the integrator, later | — |
| A supersession cycle | impossible: only an entry earlier in the same log can be superseded | S |
| Two branches supersede the same entry | the merge driver and `merge-resolve` report "two entries supersede X" as a conflict for decision | S |
| A descendant departs from an ancestor's decision | that is not supersession; the descendant writes its own entry, both are in context, the nearest first | documentation |
| A partial change of a decision | the new entry repeats the part that stays | a convention in prime |
| Context bloat | `yg advise` reports a type with more than 7 live decisions, or with their text above a token threshold | S |

### 6.4 Distillation at closing

**[proposed, S]** `jarl decide --area <text>` marks a ruling as concerning an area. `jarl close` and `jarl resume` list such rulings as "to move into the area's durable home". Jarl's skill (prose, not code) says that if the repository has Yggdrasil, the home is `yg log add --type … [--supersedes]` after ratification. Horde does the same at a mission's `done`, but it performs the write itself after the client's answer (Horde's half of 436). The "only the coarse ones" filter is the owner's test from the ruling on the type log and context: does an agent touching another file of this type need to know it.

### 6.5 The integrator

It stays "for later", as the owner wants. When it is built, it will be a cache, not a source: regenerated, never cited. Every sentence of it cites an entry id, and a deterministic test checks that the cited entries exist and are not superseded.

---

## 7. Nodes and types

**Resolution:** the type is the default unit, and the node is optional and first-class. Yggdrasil's prime already says so: you write a node "where you have something to say beyond the type — a curated relation, a log of *why*, participation in a flow". Every function of Yggdrasil and of the family declares whether it works at the type level. Node-only functions stay node-only consciously, and the documentation states the price.

**Consequences:**

- **The enforced "why"** stays a node feature (`log_required`). A graph with types only has no enforced "why", and that is the honest price of fewer files. The rule in the documentation reads: "want a gate on the 'why'? name a node". I do not move the "why" into the type log, because the owner defined the type log as decisions, not as comments on changes.
- **Horde's territory** is the file's owning unit: a node when one exists, otherwise `type:<name>@<top-level directory>`. It requires a batch `yg owner --files` (447, widened), which returns the unit also for files covered only by a type. A ticket without `Files` locks its declared unit. The architect's veto covers changes to `yg-architecture.yaml`, which require the client's consent anyway: the architect proposes, the client confirms.
- **`grain propose`** gets `--shape types` in 7.0: types with `when`, rules on types, and nodes only where a place needs an identity (a curated relation, or a file that matches two types). The default shape switches when `grain oracle score` on the corpus shows that types lose nothing against nodes. That is the owner's decision; I recommend switching after the measurement.
- **Horde's legislation in a repository without nodes** proposes type rules for ratification at the close of the wave (§6.2), instead of introducing them itself.

---

## 8. MCP

- **One adapter, one server per plugin.** There is one adapter (`runes/mcp`), because parity is a feature of the generator, tested once (`runes/testkit/parity`). There are as many servers as plugins, because plugins install independently and start separately **[built: Jarl, Grain; `mcp.json` starts with the plugin]**. Jarl and Grain move to the adapter only once their existing MCP tests pass unchanged.
- **Context budget:** today 12.7k (Jarl) and 9.5k (Grain) tokens of `tools/list`. I propose a limit of 6k per server, checked in CI by the testkit. A tool description has one sentence and the flags, and the full usage comes from a `help: true` field or the CLI's `--help`.
  - Some hosts (Claude Code) defer MCP schemas when there are many tools, as can be seen in this session. Other hosts do not, so I do not rely on it.
- **Parity and profiles:** profile fields go through a general `--field "<Name>=<value>"` **[built in 441]**, so `tools/list` is static and does not depend on the loop. Validation happens at call time, based on the profile.
- **Horde:** an MCP server in 7.0, generated by the adapter from a new command table, with parity for Horde's commands. The record is served by Jarl's server.

> **Disagreement about timing.** The ruling `mcp-horde` says "Horde too" in 6.1.0. Given the stop on rebuilding and the fact that a third of Horde's surface changes owner in 7.0, I recommend 7.0. Options: (a) 7.0 with the adapter (recommendation); (b) 6.1.0 only for the scripts that survive, which means a hand-written server to be thrown away; (c) as in the ruling, full parity in 6.1.0.

- **Yggdrasil without MCP** (the owner's decision). Yggdrasil works in hooks and in CI, and prime teaches the CLI. A server with about 40 commands would cost context in every session. Options: (a) no server (recommendation); (b) a server generated by the adapter from the `commander` tree.

---

## 9. Adoption and the "doors" message

**Facts:** there is no data about an outside adopter who has walked any ladder. The observed path is the owner's path: Jarl, then Yggdrasil by hand, then mainly types. "Grain first" is a designed path, not an observed one. The coordinator has already softened it (the ruling on a standalone Yggdrasil quickstart).

**Recommendation: entry by pain.**

| Pain | Block |
|---|---|
| too many problems for one agent | Jarl |
| the agent breaks agreements | Yggdrasil |
| we do not know what agreements we have | Grain, best right before writing law |
| a mission that must stay in law | Horde |

**A new message in place of "two doors"** (in English, for the canon): *"Jarl is the loop. Yggdrasil is the law. Grain is the survey. Horde is the loop with the law switched on, and the survey in the architect's hands."* The sentence is true today and after every variant of 7.0. "Adoption runs Grain first" changes into "Grain earns its keep the moment you are about to write law". Plus one sentence of honesty: "no outside adopter has walked this path yet".

---

## 10. The signal from production

- **Seat:** `yg incident` **[built]**, that is, the register of what escaped enforcement, connected to rule health.
- **Work:** an `incident` issue template in Jarl **[proposed, S]**. For now it is a convention, with no new code. Its acceptance requires a `yg incident add` entry if the repository has Yggdrasil, and either a rule change or a recorded reason why a rule cannot express it.
- **Horde:** `retro` reads the incidents since the mission's base.
- **Grain (later):** an escape rate per area.
- **Honestly:** an inflow from telemetry does not exist. That sentence stays at the front of VISION.

---

## 11. Answers

### 11.1 The coherence review's fifteen questions

| # | Question | Answer |
|---|---|---|
| 1 | Independent products, or modules of one? | Usable on their own, released together under one number. Compatibility is carried by schema ids and pins (§3.4). |
| 2 | What does Horde give someone who has Jarl and Yggdrasil's CI? | A mission plan on the graph before the work (one architect judgment, measured), a gate that holds a change to the law and to the mission's promises (evidence, a revert test, law guards), and turning what the mission learned into law. **Unmeasured.** The benchmark from §12, phase A, measures it. |
| 3 | Why not Horde in this release? | The work spanned several repositories and was full of rulings made in conversation. Three of the four tool repositories have no graph, and Horde requires one. Horde was used once (09-05/06). For 7.0 the condition is a mission in one repository with a graph (Yggdrasil), measured. |
| 4 | Which trust doctrine? | One: the mechanical gate decides, review can only subtract and is testimony (§4.3, text for VISION). |
| 5 | Where does a decision live, and who wins? | A home by reach. Precedence: rule > type > loop ruling > seed (§6.1). |
| 6 | Are nodes first-class? | Yes, but optional. The type is the default. Consequences for territory, the "why" and `propose` in §7. |
| 7 | Who gives consent under the "don't ask" mandate? | Not the coordinator. A type entry becomes a `ratify` question, ratified in a batch at closing. In the loop it acts at once as a ruling (§6.2). |
| 8 | What detects two contradicting live decisions? | Showing the live entries at write time with a forced choice of `--supersedes`/`--adds`, the double-supersession conflict at merge, and the budget signal in advise. A semantic contradiction will be detected by the integrator, later (§6.3). |
| 9 | The integrator page: source or cache? | Cache, never cited, regenerated, with a citation test (§6.5). |
| 10 | Who owns the merge? | In Jarl the merger, in Horde `land.mjs`. Conflicts are resolved for everyone by the merge drivers of the file's owner (§2.7). |
| 11 | A second consumer of Jarl's ports? | There is none, so the command ports are not built. The data profile (441) and two done flags remain (§4.1). |
| 12 | MCP context budget? | 6k tokens per server, checked in CI. Today it is 12.7k and 9.5k (§8). |
| 13 | Where does the production signal land? | In `yg incident` (built); the work is carried by an `incident` issue (§10). |
| 14 | "Grain first" for an outside adopter? | Nobody has walked it. Entry by pain replaces it (§9). |
| 15 | The 6.1.0 stop rule? | §12.1. |

### 11.2 The mapping report's thirteen decisions

| # | Decision | Coordinator's ruling | My recommendation |
|---|---|---|---|
| 1 | Does "What Jarl will not grow" stay? | reword it: the profile can install commands | The five-point list stays, and the paragraph reads: "the profile is data only". **A change against the coordinator.** |
| 2 | Who merges? | `land.mjs` and a write to Jarl | Agreed, plus merge drivers for everyone and a vendored record instead of CLI calls. |
| 3 | Approve for Horde? | a done policy in the profile | Agreed, in the form of data: `approve: none` + `requires-merged`. The doctrine as in §4.3. |
| 4 | What satisfies a dependency? | per status in the profile | Agreed, **built** (the `settles-dependents` flag). |
| 5 | One loop per horde? | through `--root` | Agreed. |
| 6 | Can a block call a block? | no; effects through hooks | The testable rule from §3.2: calls only along edges, documents in every direction, **without** event hooks. |
| 7 | Grain required for Horde? | required | Required in 7.0 **on condition** that the benchmark shows the cut with Grain is better than without it. Otherwise optional, as today. **Disagreement about making it unconditional:** Grain's evidence on co-change is moderate (on files no better than popularity, on nodes 0.254 against 0.184). Options for the owner: (a) conditionally (recommendation); (b) unconditionally, as in his words. |
| 8 | Jarl in the core, and the number? | in 6.1.0 | In the core from **7.0.0**, together with the canon rewrite. 6.1.0 ships Jarl as the add-on 0.2.0, because the canon is to describe what the release ships. **A change of timing.** |
| 9 | 431 in 6.1.0? | parity through Jarl's tools and the surviving scripts | 7.0, with the Runes adapter (§8). |
| 10 | Jarl's half of 436? | a general `decided` hook | No hook: `decide --area` and the list at closing (§6.4). Horde's half in 7.0. |
| 11 | Grain's gaps? | all in 6.1.0 | In 7.0: `cochange --partition` (M), `measure --from --to` (M), `advise kind: rule` (M) and `yg owner --files` with the unit (S). `completeness --json` is **built** (426, `grain-completeness/1`). |
| 12 | Missions on the version boundary? | they finish on 6.x | Agreed. |
| 13 | Horde's defects from 1.5? | filed | Agreed: 450 in 6.1.0. |

---

## 12. Stage plan

### 12.1 Release 6.1.0: close it without a rebuild

**The stop rule [proposed as a ruling that replaces the ruling that everything goes into 6.1.0 without asking]:**

- **An issue enters 6.1.0 only if it meets one of four conditions:**
  1. a regression against 6.0.0 on `release/6.1.0`;
  2. a crash, data loss or a wrong result in shipped behaviour;
  3. text (docs, knowledge, prime) that contradicts shipped behaviour, settled according to `code-docs-conflicts`;
  4. a blocker of the release checklist.
- **Everything else** is filed straight into the 7.0.0 loop (planned at the time).
- **Who says "no":** the coordinator applies the rule mechanically and writes one line of reason in the log. The owner can override it with his word.
- **Exit:** zero open P1–P2 issues and green CI on all `release/6.1.0` branches. The remaining P3 issues move to 7.0 automatically. The release still starts only on the owner's word (`release-last-on-owner-word`).
- **Convergence metric:** the number of open issues falls from day to day. Two days of growth in a row mean that the coordinator stops filing into 6.1.0 and asks.

**Items for 6.1.0:**

| Order | Item | Cost | Evidence |
|---|---|---|---|
| 1 | Triage of the 62 open and 17 in-progress by the stop rule | S | a list of those moved to 7.0, with the reason in the log |
| 2 | 434 (Horde on `yg log --aspect`) | S | Horde 6.1.0 green on Yggdrasil 6.1.0 |
| 3 | 432, 433, 435 (log), and in 433 showing the live entries and `--supersedes`/`--adds` | S | the e2e from 433's acceptance and a refusal case without a choice |
| 4 | 450 (Horde's defects) | M | lock race tests and an "answer consumed before the gate" case |
| 5 | Resync of Grain's `vendor/relations` and the diff in the seam job | S | the seam job red on a hand-changed copy file (a mutation test) |
| 6 | Close 442–449, 431 and 436 with a reason: 442–444 rejected (no second composer), 445 superseded by the library convergence in 7.0, 446–449, 431 and Horde's half of 436 moved to 7.0 | S | log entries |
| 7 | The canon unchanged (Jarl as the add-on 0.2.0) | — | the canon sync check (now `ws check canon-sync`) green |

### 12.2 Release 7.0.0

**Phase A: measurement first**

| Item | Cost | Evidence |
|---|---|---|
| A1. `jarl report --json` with loop metrics: cycle time, rounds, reopenings, review provenance, red CI after merge, follow-up issues within 7 days | S | automatically reproduces the numbers of the manual analysis of the 6.1.0 loop (e.g. "17 fresh out of 221") exactly |
| A2. A Horde benchmark: one mission of 8–15 tickets on Yggdrasil (a repository with a graph), made of Yggdrasil items from 7.0 (merge drivers, `yg owner --files`, log guards). Metrics registered **before** the start: rework (follow-ups and reopenings within 7 days), rounds per ticket, red CI after merge, owner interventions per ticket, cost and time per ticket, gate refusals that were real defects. Reference point: the Yggdrasil packages from the 6.1.0 loop, counted by A1. | M | The decision rule is fixed in advance: the full rewiring of Horde (D2 below) starts if Horde improves rework or escapes by ≥30% at a cost of ≤1.5× Jarl's. Otherwise 7.0 for Horde shrinks to Runes and MCP. Honestly: n=1, so it is directional evidence. |

**Phase B: Runes (in parallel with A)**

| Item | Cost | Evidence |
|---|---|---|
| B1. The repository, TS, a committed `dist`, CI, the words test, `tools/vendor.mjs`, publication to npm from a tag | S–M | tag 0.1.0 on npm; the gate red on a hand-changed copy |
| B2. Moving the relations, AST, the grammar recipe (with the PHP decision), the catalogue of 460 and the unit tests; runtime injected | L | the Runes suite green; consumer smoke green |
| B3. Yggdrasil imports from `@chrisdudek/runes` | M | full suite green; the `yg check --json` output on Yggdrasil and on a second real graph identical before and after (golden diff) |
| B4. Grain: the Runes vendor and gate in place of `build-relations`/`build-grammars` | M | `grain export` edges on the corpus (express, spring-petclinic) identical before and after; −284K unguarded copies |
| B5. `fs`, `cli`, `mcp`, `testkit`, and moving Jarl and Grain onto the adapter | M | the existing MCP tests of both pass unchanged; lines removed |
| B6. MCP budget: short descriptions, `help`, the 6k limit in CI | S | Jarl ≤6k and Grain ≤6k tokens of `tools/list` |

**Phase C: law and knowledge**

| Item | Cost | Evidence |
|---|---|---|
| C1. Yggdrasil's merge drivers (`log.md`, locks) installed by `yg init`; `merge=union` for `CHANGELOG.md` and Jarl's logs | S–M | replaying the conflicting merges from the 6.1.0 loop: ≥80% without a manual edit |
| C2. Double supersession in `merge-resolve`; the budget signal in `yg advise` | S | test cases; a run on a real graph |
| C3. `jarl decide --area`, the list at `close`, ratification by batch | S | closing the 7.0 loop yields one list, and the owner ratifies it in one pass |
| C4. `yg owner --files` with the unit (node or type) | S | one graph load per batch; correct units for files covered by a type |
| C5. `grain propose --shape types` | M | `grain oracle score` on the corpus no worse than the node shape |
| C6. `advise kind: rule` (promotion of `boundary`, rule drafts for an existing graph) | M | precision of the drafts measured as in the coupling evaluation (the maintainer's label on the top 20) |

**Phase D: the composer (only after A2)**

| Item | Cost | Evidence |
|---|---|---|
| D1. Horde's command table and MCP through the adapter (431) | M | parity test; budget ≤6k |
| D2. Horde's convergence on Jarl's vendored record, Horde's profile, `done-gate` in Jarl, the format marker | L | about 721 Horde tests green (`land.test` setup rewritten, assertions unchanged); the drill corpus re-recorded; Horde's scripts shorter by ≥4k lines; `jarl resume --root .horde/hordes/<h>` correctly shows a live mission |
| D3. Territory by the owning unit (types) | M | a mission in a repository without nodes locks the right files |
| D4. The architect measures with Grain: `grain cochange --partition` (446) and `grain measure --from --to` | M+M | benchmark: the cut with Grain against the cut without it (the condition of decision 7) |
| D5. Horde writes ratified type decisions to `yg log --type` (Horde's half of 436) | S | ratification e2e |

**Phase E: the canon**

| Item | Cost | Evidence |
|---|---|---|
| E1. VISION (the trust doctrine, the reach principle, Jarl's row in the stage table, the dependency graph), `family/canon.md`, the READMEs, the "will not grow" lists, Jarl at 7.0.0, Runes in `family/map.md` | S–M | the canon sync check (now `ws check canon-sync`) green; zero hits for withdrawn sentences (the list in `family/canon.md`, with "two doors" added) |

Order: A1 → A2; in parallel B1 → B2 → B3/B4 → B5 → B6; in parallel C1–C4. D starts after A2. C5, C6 and D4 after B. E at the end.

---

## 13. Risks of this design

| # | Risk | How it is bounded |
|---|---|---|
| R1 | Runes becomes a dumping ground ("it's shared, so I'll throw it in") | the entry rule (two consumers, zero domain words), the Runes words test, the "never into Runes" list in the Runes README |
| R2 | A vendored copy drifts from its source | the `check` gate in `npm test` and strictly in CI; a pin with commit and sha256; a mutation test of the gate |
| R3 | A Runes release breaks a consumer | consumer smoke as a condition of the tag; the consumer bumps the pin itself, in one commit, with full CI |
| R4 | A record version mismatch between the installed and the vendored Jarl | the format marker and the refusal of an unknown profile key (built): a loud failure, not a silent one |
| R5 | An n=1 benchmark settles nothing | metrics and threshold registered before the start; an "inconclusive" result means the smaller variant of 7.0 (without D2) |
| R6 | The reach principle shifts a lot of ratification onto the owner ("mainly types" (translated from Polish)) | ratification in one batch at closing; the decision acts in the loop at once |
| R7 | Merge drivers are not configured in the clone (configuration does not travel with the repository) | `yg init` configures them; a missing driver should fall back to an ordinary conflict, not to a wrong result, which has to be confirmed by a test at C1 |
| R8 | A sixth entity for one person to maintain | Runes has no users and no product documentation; automated releases; one cross-repository job; a net gain in lines and duplicates (§5.7) |
| R9 | Code written by agents drifts from knowledge again (`code-docs-conflicts`) | every plan item has mechanical evidence (golden diff, parity, gate, words test), not a description; the owner judges decisions, not code |
| R10 | Types as the default lose the precision of Horde's territory | the node stays available; C5 switches the default shape only after measurement |
| R11 | One number masks the blocks' independence | the canon says plainly "usable on their own, released together"; compatibility in schema ids |
| R12 | The 7.0 plan bloats again, as 6.1.0 did | the stop rule applied from the first day of the 7.0 loop; phase D conditional |

---

## 14. The owner's decisions to make (in order of importance)

1. Horde's model on Jarl: (a) a library and a data profile, ports with a second composer (recommendation); (b) ports 442–444; (c) only Runes, Horde's record kept separate.
2. The 6.1.0 stop rule in place of the ruling that everything goes into 6.1.0 without asking: yes (recommendation) or no.
3. The reach principle for consent (type: client, node: agent) with ratification by batch, and the text for VISION: yes (recommendation), or consent per entry as today.
4. Grain required for Horde: (a) conditionally, after the benchmark (recommendation); (b) unconditionally.
5. Jarl in the core: (a) from 7.0.0 (recommendation); (b) from 6.1.0.
6. The Runes gate: (a) dev and strictly in CI (recommendation); (b) dev only.
7. The Runes bootstrap: (a) after the 6.1.0 release (recommendation); (b) in parallel, only in the Runes repository.
8. Horde's MCP: (a) 7.0 (recommendation); (b) 6.1.0 partially; (c) 6.1.0 in full.
9. Yggdrasil's MCP: (a) no (recommendation); (b) yes, from the adapter.
10. The default shape of `grain propose`: (a) types after measurement (recommendation); (b) types right away; (c) nodes.
11. The "doors" message and entry by pain in the canon: yes (recommendation), or "Grain first" stays.

---END---

- **The decision condition of the benchmark (≥30% at ≤1.5× the cost).** The threshold is mine and arbitrary. With n=1 the mission may settle nothing, and the whole of phase D depends on it.
- **Merge drivers as the answer to the "missing block".** I did not check live that an undefined driver falls back to an ordinary conflict in every git version. Nor did I count what share of the manual conflicts in 6.1.0 were in files that a driver will resolve (CHANGELOG, logs, locks) and what share were real code conflicts. The 80% threshold in C1 is a hope, not a measurement.
- **Horde vendoring Jarl's record without ports.** I assumed that the differences from the mapping report (holding questions, port edges, the log with ms, sidecars) can be kept on Horde's side, next to Jarl's record, without breaking Jarl's views. The least certain part is whether `jarl next`/`queue` on a Horde loop, showing a different readiness than `tick`, will in practice be only informational, or will start to confuse the director.
