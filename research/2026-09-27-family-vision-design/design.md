# The family as blocks and a composer: the design of the whole, version 2 (issue 459)
*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

**Status:** a proposal for the owner's decision, version 2. I corrected version 1 according to three critiques (A: fidelity to the owner, B: technical, C: the economics of maintenance) and two new owner rulings:

- **The ruling that everything goes into 6.1.0 with no stop:** the whole rollout goes into 6.1.0, with no stop rule and without moving scope to the next release;
- **`no-effort-estimates`:** scope is not weighed by effort; it is cut only for reasons of quality, risk and truth.

**Date:** 2026-09-27. **Basis:**

- `VISION.md`, `family/canon.md` and `family/map.md`;
- the reports from `research/2026-09-27-*` (the mapping report, the coherence report, the Grain couplings report);
- the rulings of the 6.1.0 loop;
- the code on `release/6.1.0`: Yggdrasil b4ea723a3, Grain a53bb0f, JarlSkill 79020ef, Horde bbd50bb;
- critic B's experiments in the session scratchpad, since lost.

**Convention:** **[built]** means the thing exists in code, **[proposed]** is design, and **[in progress]** is an issue open in the loop. For every decision I write whose words it overrides: the owner's, the coordinator's, or no one's. Where a critic says something other than the owner, the owner wins, and the design itself limits the risk.

---

## 0. A one-page summary

The direction is the owner's, and the design implements it in full, in 6.1.0:

- Yggdrasil (law), Grain (measurement) and Jarl (loop) are blocks, and Horde is the composer.
- Horde's architect always measures with Grain.
- Shared code lives in **Runes**. The skill blocks vendor it; Yggdrasil installs it from npm.
- Every tool with MCP has full parity with the CLI, generated from the command table. This applies to Horde too.
- Jarl enters the core at number 6.1.0.

My changes concern the *how*, not the direction, and each has a quality reason or a truth reason.

| # | Decision | Recommendation | Overrides |
|---|---|---|---|
| D1 | Blocks | Yggdrasil, Grain and Jarl. Each has a "what it will not grow" list. | nothing |
| D2 | Horde | A product, not a distribution. "It plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law." | nothing |
| D3 | Horde on Jarl | Horde takes from Jarl an **explicit record module** (`record.mjs`, vendored) and a **data profile** (441 plus four new data keys). There are no command ports 442–444. The rebuild is unconditional. | the coordinator's (`blocks-and-composer` point 1 and the 442–444 plan) |
| D4 | Measurement | A regression check, not a veto: a replay on known truth before the rebuild and after it. A regression blocks the release of the rebuilt Horde until it is fixed. It never reverts the rebuild. | nothing |
| D5 | Runes | Source in TS, with a committed `dist` (ESM and `.d.ts`) in git, and a package on npm. Inside: relations, AST, the grammar recipe with a runtime pin, the 460-case catalogue, the lock, the command table, the MCP adapter, the testkit and **shared skill fragments**. Jarl's record stays in Jarl. | nothing (the owner decided on Runes) |
| D6 | Vendoring | A pin in the form of a tag, a commit and the sha256 of the files. The sha check always runs, offline too. A fresh clone and `rev-parse` are done only by CI. Yggdrasil has Runes as a runtime dependency with an exact pin, without bundling. | nothing (this is a reading of "only in development" (translated from Polish), to be confirmed) |
| D7 | Conflicts | There is no landing block. There are merge drivers passed through `git -c` on every merge: a purely textual one for `log.md` and a direction-independent one for the lock, and a separate step regenerates the lock after the merge. Jarl's `decisions.md` gets its own driver, never union. | nothing |
| D8 | Contracts | Three channels: documents, native hooks, and code from Runes or along an edge. The guard checks identifiers, imports and calls, not words. | nothing |
| D9 | Edges | Horde → Yggdrasil, Grain (required) and Jarl (code). Grain → Yggdrasil optionally. **Jarl → Yggdrasil optionally**, solely to write ratified area decisions. | nothing (these are the owner's words from the ruling on the type log and context) |
| D10 | Versions | One family number for the four blocks, from 6.1.0. Runes has its own semver. Compatibility is carried by schema ids and pins. | nothing |
| D11 | Trust | A conditional doctrine: where the repository has a check, the check decides in both doors. Review can only stop, and it is testimony. A Jarl loop without a check lands on testimony alone and says so plainly. | nothing (a change of the VISION text) |
| D12 | Consent | Reach decides. A type is shared vocabulary, so the client gives consent; a node is territory, so the agent decides. Type rules run as `advisory` before ratification. Ratification: at most 10 items, each cheap to reject, never blocks closing. | nothing (a change of the thesis in VISION, the owner's decision) |
| D13 | Nodes and types | Type by default, node optional and first-class. The enforced "why" stays a feature of the node. | nothing |
| D14 | MCP | One adapter and a server per plugin. Horde gets its own server for the commands that stay in it. The budget is measured honestly (the weight lies in the parameter descriptions), and cutting descriptions comes in only after a call-accuracy test. | nothing |
| D15 | Plan | Everything in 6.1.0, in seven phases ordered by dependency, each with evidence. The release goes out on the owner's word. | nothing |

---

## 1. The facts the design stands on

The facts are corrected according to critique B. The state of the loop changes every hour; at the time of the critique there were 460 issues, 57 open and 23 in-progress.

1. **Grain, Horde and JarlSkill have no Yggdrasil graph** (0 `.yggdrasil/` files). Yggdrasil has 519 nodes. Horde, however, **does not require** a ready graph: `horde init` sets one up itself through `yg init` and Grain, and refuses only without the Yggdrasil CLI. The barrier for Horde in the 6.1.0 work was **the multi-repository nature of the work**, because Horde works on one repository, not the lack of a graph. Horde was used once for a family mission, 2026-09-05/06 (`family/map.md`).
2. **Grain vendors Yggdrasil's relations code without any guard [built].** Since the pinned `3cedc47f8`, 5 commits have gone into `source/cli/src/relations`, but none of them touches the vendored files. Regeneration differs only in headers. So the problem is the lack of a guard, not drift.
3. **The 460-case relations catalogue exists in two copies**, in Yggdrasil and in Grain, byte for byte (only the schema and the runner differ).
4. **Grammars.** 15 of Yggdrasil's 16 pins have an identical sha in Grain's manifest, and the four TypeScript patches are identical. PHP differs: Yggdrasil uses `php_only`, Grain `php`, so Grain runs Yggdrasil's PHP extractor on a different grammar. Grain additionally has 7 languages and a PHP variant. The `web-tree-sitter` version is 0.27.0 in both, but nothing enforces it.
5. **Code that is a candidate for Runes:** the extractors are 7,764 lines; `symbol-table`, `resolver`, `resolve-path`, `repo-layout`, `ast/walk`, `ast/parser`, `parse-cache` and `language-registry` are 2,294. There is one meaningful import of `web-tree-sitter` in the relations code (`kotlin-recover.ts`), and `ast/parser.ts` needs the runtime identity for the cache hash.
6. **MCP today:** Jarl has 38 tools (≈12.7k tokens of `tools/list`), Grain 25 (≈9.5k). The weight lies in the parameter descriptions (≈200 in Jarl, ≈150 in Grain), not in the tool descriptions. Yggdrasil has neither a server nor a plugin.
7. **`yg incident add|read` [built]** is a committed register of escapes with a cause tag and an optional `--aspect`.
8. **Loop profile 441 [built]:** statuses with flags, declared fields, `--field`, rejection of an unknown key. **There is no transition graph**, so `jarl set` will let any status in. `queue` shows only issues with a live approve.
9. **`jarl.mjs` has 142 exports** and is importable, but it does not declare which of them are stable API.
10. **Jarl's word test [built]** forbids the words wave, architect and node in `jarl.mjs` and `jarl-mcp.mjs`. Yggdrasil carries the word "Horde" in **message literals**: `io/node-parser.ts:372,377` and `utils/file-formats-graph.ts:56-57`.
11. **Consent to type law is prose today, not a mechanism.** Pinning an aspect to a type lives in `yg-architecture.yaml`, and prime says "Changes require user confirmation". The content of the rule, however, lives in `.yggdrasil/aspects/*/yg-aspect.yaml` without any gate, so an agent will change the law of a whole type without touching `yg-architecture.yaml`.
12. **`yg log` has only `--node` today [built].** `--type` with `--supersedes` is 433 [in progress], and `--aspect` is 434 [in progress].
13. **Merge drivers (git 2.50.1, experiment B):**
    - an undefined driver gives an ordinary conflict with markers;
    - a driver that is defined but has no binary gives a `UU` file **without markers, with only the "ours" side**, so `git add` silently loses "theirs";
    - a driver that exits with code 0 without writing gives a clean merge with a wrong result;
    - `merge=union` on Jarl's `decisions.md` attached a `**Superseded by:**` line to the wrong ruling and bypassed the "already superseded" invariant.
14. **Yggdrasil's `merge-resolve` writes `yg-lock.logs.json`** (`prefix_hash`), and a git driver is a pure function of one file.

---

## 2. Boundaries: blocks, the composer, Runes

The "what it will not grow" lists go into each tool's README or SKILL. Every issue filed out of a need of the composer is first checked against them.

### 2.1 Yggdrasil: law

- **Owns:** the graph (types, nodes, relations, ports, flows), rules, `yg check` with the lock, the log (`--node` [built], `--type` and `--aspect` [in progress]), the incident register, rule packs, the `yg-*/N` documents.
- **Promises on its own:** every change satisfies the rules that cover it, which is checked before going any further and again in CI without a key.
- **Will not grow:**
  1. a work loop;
  2. statistics from history;
  3. performing merges (but it supplies drivers for its own files, §6);
  4. agent orchestration;
  5. the names of Horde and Jarl in code and in messages (the four "Horde" literals go, phase 1);
  6. an MCP server (the owner's decision, §9).

### 2.2 Grain: measurement

- **Owns:** the index, conventions with a denominator, co-change, `propose`, `advise`, selftest and oracle, calibration seeds.
- **Promises on its own:** every claim has evidence and the number of places that break it, and it never blocks anything.
- **Will not grow:**
  1. blocking;
  2. new kinds of `decide`;
  3. its own graph format;
  4. a work loop;
  5. reading `.jarl/` and `.horde/`;
  6. its own copy of the extractors (after Runes).

### 2.3 Jarl: the loop

- **Owns:** the loop record (issues, log, rulings with supersession, questions, ratifications), roles, views, the profile as data and the explicit `record.mjs` module.
- **Promises on its own:** every problem has an issue, every issue has one worker in its own worktree, and nothing is closed without evidence and a fresh review.
- **Will not grow:** the current five-point list stays. I change the paragraph under it to: "the profile is data only; Jarl does not execute commands supplied by the profile". The only Jarl code that calls another tool is the optional write of ratified decisions to Yggdrasil (§7.5).

### 2.4 Horde: the composer as a product

Horde is a product, not a distribution. Plugins have no dependencies, so the distribution is the plugin catalogue.

**Promise** (critic C's sentence, because it hits what Jarl with a `yg check` hook does not give): *"Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law."*

Horde's irreducible parts:

- the architect (one verdict, always with Grain's measurement);
- `refine`;
- the gate with nine items and a transactional merge;
- leases between hordes;
- `legislate`, `audit`, `drill`, `retro`, `escalate`, `blame`, the client report.

**Will not grow:** its own loop record (it takes it from Jarl), its own law format or its own statistics.

### 2.5 Runes: infrastructure

For the user, Runes is not a member of the family. For the owner, it is an extra repository with CI and releases. Details in §5.

### 2.6 Law and measurement: two blocks, one rule surface

I do not merge Grain into Yggdrasil, for four reasons:

1. the "measured" / "established" boundary is a boundary of honesty that VISION puts forward;
2. the failure modes are opposite;
3. Grain has value without Yggdrasil;
4. the cadences are different.

One rule surface comes from **boundary promotion** [proposed]. `grain advise --json` exposes `decide boundary` as `kind: rule`, that is, a draft Yggdrasil rule with a violation count. Once it is accepted, the seed gets a `promoted` marker and Grain stops flagging that boundary. `steer` and `waive` stay in Grain as calibration of the instrument. Precedence is described in §7.1.

### 2.7 The landing gate: not a block, only drivers and Horde's merge

Conflicts are resolved by merge drivers that belong to the file's owner (§6). The transactional merge stays in Horde, because it has one consumer. Jarl's merger is serial and uses the same drivers.

---

## 3. Contracts

### 3.1 Three channels

1. **Documents with a schema id**, registered on Family Contracts [built: the page and the guards]. New rows: `jarl-profile/1`, the `jarl-record/1` API (§4.2) and Jarl's `--json` views read by Horde.
2. **Native hooks:** git hooks and drivers, and agent-host hooks declared by a plugin. There are no event hooks between tools.
3. **Code:** from Runes, or vendored along an edge (Horde from Jarl).

### 3.2 The call rule, testable on identifiers, not on words

> Code shipped by tool X does not **import** a package or module of another family tool, does not **run** its executable (`spawn`/`exec` with `yg`, `grain`, `jarl`, `horde` as the command) and does not **build a path** to its state directory (`.yggdrasil/`, `.grain/`, `.jarl/`, `.horde/`), unless the pair (X, that tool) is an edge from §3.3. Reading another tool's document is free if its schema id is registered.

**Test [proposed]:** `runes/testkit/guard` analyses imports, `spawn`/`exec` calls and path literals. Comments and words in prose do not concern it, because a lexical ban on words is unworkable: the relations code has 520 occurrences of `node` as a tree-sitter node. Each repository has a `guard.allow` with the permitted places, reviewed like code. Jarl's word test stays as its own, narrower guard. Message literals with the name of another tool are removed, because a message about another tool ages along with it.

### 3.3 The dependency graph

| Edge | Kind | State |
|---|---|---|
| Horde → Yggdrasil | required: CLI and documents | [built] |
| Horde → Grain | **required** (the architect always measures) | [proposed]; optional today through `grainCommand` |
| Horde → Jarl | code (`record.mjs`, pin) and the `.jarl/` format; Jarl's plugin recommended | [proposed] |
| Grain → Yggdrasil | optional: `yg drill` and documents | [built]; the relations copy moves to Runes |
| Jarl → Yggdrasil | **optional, only `yg log add --type` for ratified area decisions, when a graph and a working `yg` are detected** | [proposed] |
| Yggdrasil → anything | none; only reading Grain's documents by schema id | [built] |
| Each → Runes | code (vendor or npm); this is not a family edge | [proposed] |

### 3.4 Versions

Yggdrasil, Grain, Jarl and Horde have **one number from 6.1.0**. Jarl jumps from 0.2.0 to 6.1.0. The number means a set built and tested together, not a compatibility promise (`family-contracts.md` already says so). Compatibility is carried by:

- schema ids;
- `jarl-profile: N` and the record format marker;
- the `jarl-record/N` API version;
- exact pins.

Runes has its own semver. The add-ons (Ratatoskr, Urd, Researcher) have their own numbers. The canon says: "Four blocks, each usable on its own, released together as one tested set". In releases in which Jarl does not change, Jarl's CHANGELOG says plainly "no changes in Jarl".

---

## 4. Horde on Jarl

### 4.1 The model: a record module and a data profile, unconditionally

Horde stands on Jarl through two things:

- an **explicit record module**, vendored from Jarl;
- the **profile as data**, where a mission is a real Jarl loop in `.horde/hordes/<h>/.jarl/` through `--root` [built].

The command ports 442–444 are not built. An interface extracted from one consumer would be a frozen API in the shape of Horde, and a Jarl without the profile would pay for it in documentation, flags and MCP schemas. This is a quality reason.

**It overrides the coordinator's ruling** (`blocks-and-composer` point 1 and the 442–444 plan), not the owner's words. "Each block builds on another" is satisfied by Jarl's format, lock, rulings, questions and views under a Horde mission.

### 4.2 The explicit `record.mjs` contract

Out of the 142 implicit exports of `jarl.mjs`, Jarl separates a `record.mjs` module with an **enumerated list of exports**:

- opening and reading a loop;
- parsing and rendering an issue;
- reading and validating the profile;
- `withLock` (from Runes);
- operations on the record: a new issue, a status change with a profile check, fields, sections, evidence, `merged`, `round`, `decide` with supersession, `ask`, `answer`, the log;
- the `resume` and `status` data.

`jarl.mjs` is a CLI over this module. In Jarl's suite a contract test checks that the list of exports and their signatures are exactly as declared. A change to the list bumps `jarl-record/N`, and a row goes onto Family Contracts. Horde vendors **only** `record.mjs` with its dependencies, under the `jarl.pin.json` pin.

### 4.3 The profile: four new data keys

The keys follow from critique B: Jarl's views must not lie about Horde's loop.

| Key | Meaning | Why |
|---|---|---|
| `"set-by": "record"` on a status | a status not reachable through `jarl set` or `jarl_set`, only through a library call | without it `jarl_set N queued` bypasses the architect's veto |
| `"external-scheduler": "<command to show>"` on the loop | `next`, `queue` and readiness in `resume` do not compute anything on their own, they only say "the schedule is run by the composer: <command>" | otherwise they show tickets blocked by port edges as ready, and `queue` with `approve: none` is always empty |
| `"done-gate": { "approve": "fresh" \| "none", "requires-merged": bool }` | `approve: none` is allowed only together with `requires-merged: true`; then entering `closes-record` requires `Merged` with a sha that is an ancestor of the base | closes the "done without landing" bypass with data, not with a command |
| `"format": N` | a record format marker; the vendored and the installed Jarl refuse an unknown one | a version mismatch ends loudly |

### 4.4 What moves, what is shared, what stays

| Part | Fate |
|---|---|
| Lock, atomic write, root | Runes `/fs`, modelled on Jarl's lock (pid + host + age) |
| Ticket record, rulings with supersession, log, `resume` data | from Jarl's `record.mjs` |
| `handoff.mjs`, `decide.mjs`, the record part of `tk.mjs`, the `status.mjs` counters | disappear |
| Horde's states | Horde's profile: `proposed` (no flags, `set-by: record`), `queued`, `running`, `landed`, `changes`, `blocked`, `merged` (`closes-record`, `settles-dependents`), `dropped` |
| Questions with holding, the scheduler (`tick`), port edges, the comparator, the round limit, reconcile, leases between hordes, the per-ticket log with ms, sidecars | stay in Horde, next to the record |
| `land`, `refine`, `node`, `law`, `audit`, `drill`, `retro`, `escalate`, `wave`, `blame`, `brief`, `report` | stay; `land` writes the merge through `record.mjs` |
| The t-/g-/a- counter | tickets are numbered by Jarl, g- and a- by Horde; the "one number" invariant becomes a "one prefix" invariant |

Missions open on 6.0.x finish on 6.0.x (the coordinator's ruling, point 12). Horde 6.1.0 refuses a mission without a Jarl loop and names the version in which it has to be finished. `blame` keeps a reader for archives in the old format.

### 4.5 The trust doctrine: a conditional text

The sentence from v1 ("mechanical gate in both doors") is false for Jarl in a repository without a check. The v2 version for VISION (in English):

> *"Where the repository has a check, the check decides what lands, in both doors. A fresh reviewer can only stop a change, never make a failing check pass; its word is recorded as testimony. A Jarl loop in a repository with no check lands on testimony alone, and says so."*

To make "says so plainly" a mechanism, `jarl status` and `jarl report` flag a loop without a declared check, and the loop metrics (§12) count the share of fresh reviews mechanically. So far, 17 out of 221 showed that "freshness" was a declaration. Jarl's approve means "a recorded absence of objection from a fresh reviewer". The `fresh-reviewer-required` ruling stays.

### 4.6 Who merges

- **Jarl:** the merger (prose in SKILL, no new command), with the drivers passed through `git -c` (§6).
- **Horde:** `land.mjs` with the same drivers. Its own resolver of known conflicts shrinks to a git call with these drivers.

---

## 5. Runes

### 5.1 What goes in

**Entry rule:** at least two consumers (or an existing duplicate) and no exported identifier from the domain of a family tool.

| Subpath | Contents | Consumers |
|---|---|---|
| `relations` | the extractors for 11 languages, `symbol-table`, the three-state resolver, `resolve-path` without `guardedResolve`, `repo-layout`; `ownerNode` → `owner` | Yggdrasil (npm), Grain (vendor) |
| `ast` | `walk`; a parser with an **injected parser factory and runtime identity** | as above |
| `grammars` | the pin manifest (the union of both sets), **a pin of the `web-tree-sitter` version and of the grammar npm packages**, the patches, a build script with sha256 verification | as above |
| `reference/relations` and the runner | the 460-case catalogue | Runes tests |
| `fs` | `withLock`, `writeAtomic`, the root through the git common dir | Jarl, Horde, Grain |
| `cli` | the command table schema, `parseArgs`, the `<tool>-error/1` error document, the one `--json` block principle | Jarl, Grain, Horde |
| `mcp` | a stdio server from the table, with two executors (in-process and through spawning the CLI) | Jarl, Grain, Horde |
| `testkit` | git env (`maintenance.auto=false`, `gc.auto=0`, identity), CLI↔MCP parity, the identifier and import guard (§3.2), `tools/list` measurement, the consumer's runtime matching the pin | everyone |
| `skills/` | **shared skill fragments** (§5.2) | Jarl, Grain, Horde |
| `tools/vendor.mjs` | vendoring and the gate | everyone who vendors |

**Never into Runes:**

- Jarl's record (these are Jarl's nouns);
- anything that knows a graph, an aspect, a convention, a loop, a mission or a ticket;
- `owner-index`, `type-gate`, `verifier`, `pass`, `facts-cache`;
- Grain's convention extraction;
- the transactional merge, as long as it has one consumer;
- checking the family canon (it runs at release);
- executables;
- network access at runtime;
- runtime dependencies (`web-tree-sitter` is an optional `peerDependency` for the types).

### 5.2 Shared skill fragments

The owner: "Yggdrasil may have things installed but skills vendored" (translated from Polish). I read this above all as a way of distributing code: the skills vendor, Yggdrasil installs. Critic A reads it more broadly, as shared *content* of the skills. I do both.

**Candidate fragments [proposed]:**

- the protocol for working with Yggdrasil in a skill (when to run `yg check`, how to read `next:`);
- the "MCP tools first, CLI as a fallback" paragraph;
- the rules for the worker's worktree and branch;
- the evidence vocabulary (`--ran`/`--saw`).

**Mechanism:** a fragment lives in `Runes/skills/<name>.md`. In the consumer's `SKILL.md` it sits between the markers `<!-- RUNES:<name>:START -->` and `<!-- RUNES:<name>:END -->`. The pin covers `skills/**`, and the gate compares the block between the markers with the pinned fragment. It is the same pattern the family canon check already uses today.

### 5.3 Language, build, packaging

- Source in TypeScript.
- Built to ESM `.mjs` with `.d.mts`, **target Node 22**. Node 18 has been EOL since April 2025, so Jarl's `engines` goes up to 22, as in Yggdrasil and Grain.
- `dist/` is committed, because vendoring happens through a clone. CI checks that it is fresh (a rebuild and `git diff --exit-code`).
- Published on npm as `@chrisdudek/runes`, with subpaths in `exports`.

### 5.4 Grammars: a recipe and pins, not bytes

Runes holds the manifest, the patches, the build script and the runtime pins. It does not hold the WASM files (22–32 MB would grow in the history with every pin change). Byte identity is guaranteed by sha256 and a reproducible build, which Yggdrasil has already proven. The consumer picks a subset (`--only`), and the testkit checks that its `web-tree-sitter` and grammar npm packages have the versions from the manifest. Without this, the 460 catalogue in Runes' CI would pass on a different runtime than the consumer's. PHP has to be unified to one grammar, and the evidence is the catalogue passing in both consumers.

### 5.5 Unifying the extractor

- **Relations** are already the same code today. What was missing was governance, and Runes provides it.
- **Grain's convention extraction** (`extract.mjs`, language-independent) is a different task and stays in Grain.

**The gain from one extractor:**

1. an edge in Grain's proposal is an edge that `yg check` sees, so `yg adopt` is green on relations by construction;
2. `grain advise` and `relation-undeclared-dependency` talk about the same pairs;
3. one fix reaches both tools through one tag.

### 5.6 Vendoring: the mechanics

The layout at a consumer, taking Grain as the example:

```
Grain/plugins/grain/engine/vendor/runes/          # committed copy of selected files from dist/ and skills/
Grain/plugins/grain/engine/vendor/runes.pin.json  # { source, tag, commit, paths, files: { <file>: <sha256> } }
Grain/plugins/grain/scripts/runes.mjs             # copy of Runes tools/vendor.mjs, itself under the pin
Grain/.runes/                                      # in .gitignore; used only in CI
```

| Command | When | What it does |
|---|---|---|
| `runes.mjs check` | always: `npm test`, pre-commit, offline | the sha256 of every file of the copy and of every skill fragment block against the pin; a hand edit, a missing file or an extra file is exit 1 |
| `runes.mjs check --ci` | CI (`CI=true`) | additionally a **fresh** shallow clone of the tag (no cache), `rev-parse HEAD == commit`, a comparison with the clone's `dist/` and `skills/`; a moved tag or a pin that does not match the tag is exit 1 |
| `runes.mjs update [--tag vX.Y.Z]` | by hand | fetches the tag, copies `paths`, rewrites the pin, lists the changed files and the Runes CHANGELOG between the tags |
| `RUNES_DIR=../Runes runes.mjs check --local` | co-development before a tag | a report only, never "green" |

The sha check in development is always on, and the clone happens only in CI. I read "only within development" (translated from Polish) as the opposite of runtime, not as the opposite of CI. I ask for confirmation of this reading. The clone requires a public Runes repository.

**Consumers:**

| Consumer | How it gets Runes |
|---|---|
| Yggdrasil | `"@chrisdudek/runes": "X.Y.Z"` (exact) in `dependencies`, **without bundling**. tsup treats `dependencies` as external by default, and the package carries the types. The gate is the integrity of the npm lockfile and an "installed version == pin" test. |
| Grain | vendor: relations, ast, grammars (the recipe), mcp, fs, testkit, skills; `build-relations.mjs` and `build-grammars.mjs` disappear |
| Jarl | vendor: fs, cli, mcp, testkit, skills |
| Horde | vendor: fs, cli, mcp, testkit, skills; a second pin, `jarl.pin.json`, on `record.mjs` |

**Extractor consistency at release:** Grain's seam job (which checks out Yggdrasil) checks that the tag in Grain's pin equals the Runes version in Yggdrasil's `package.json`. On branches this is a warning, on `release/*` a block.

### 5.7 Tests

**Moving to Runes:**

- `Yggdrasil/reference/relations/**` with the runner;
- the 34 files `tests/unit/relations/extractors/*`;
- the tests of `symbol-table`, `resolver`, `resolve-path`, `registry`, `candidate-parity`, `csharp-parity`, `extractor-rev`;
- the grammar pipeline tests.

The copy of the catalogue in Grain is removed.

**Staying as seam tests:**

- **Yggdrasil:** `tests/e2e/relation-<lang>.test.ts` (they run the CLI and check resolution onto the node model), slimmed down by the cases the catalogue covers, with at least one case per language. On top of that, `cli-relations*` and the unit tests of `owner-index`, `type-gate`, `verifier`, `facts-cache`, `feature-vector` and `messages`.
- **Grain:** `tests/relations/e2e`, `e2e-cli` and `csharp-project-scope-check`.

**Consumer smoke in Runes' CI:** a checkout of Yggdrasil and Grain (the branch with the same name, otherwise `main`), slotting in the Runes build, and running their relations seam suites and the MCP tests of Jarl and Grain. The tag workflow depends on this job.

**The path of a change:**

1. a tag (Runes' CI green, smoke green, publication on npm);
2. bumping the pin in every consumer, in one commit;
3. the `check` gate at the consumer;
4. the consumer's full CI.

At a family release, all pins point to the same Runes version.

### 5.8 Ownership and place in the family's documents

- **Versions and releases:** semver, one version for all subpaths, automatic releases from a tag, a CHANGELOG with one line per change.
- **The family documents:** a row in `family/map.md` in the section "Infrastructure — not a family member for users; an extra repository for the maintainer". One sentence in `family/canon.md` outside the canon block ("Runes is shared code, vendored or installed; it adds no edge between blocks").
- **The family release procedure:** a new step, "Runes pins consistent before the version bump".
- **The boundary rail:** no change, because Runes is generic. Family Contracts gets no rows.

---

## 6. Merge drivers

This section is rewritten according to critique B. Everything here is [proposed].

1. **How they are run.** Jarl's merger and `land.mjs` pass the drivers through `git -c merge.<n>.driver=… -c merge.<n>.name=… merge …` **on every call**. They do not rely on the clone's configuration. `.gitattributes` is committed in the repository.
2. **Yggdrasil's `log.md`:** a **purely textual** driver. It merges the entries of both sides by timestamp and refuses (markers, exit 1) when the shared history has been rewritten. The lock is not touched.
3. **Yggdrasil's lock:** a **direction-independent** driver. It takes the union of the keys; a key with different values drops out, so the pair stays unverified. The next `yg check --approve` fills it.
4. **Regenerating the lock after the merge:** a separate step in the post-merge hook and in the merger/`land` after the merge. `yg log merge-resolve` in "after the merge, no refs" mode recomputes `prefix_hash` for the changed logs. The driver cannot do this, because it is a function of one file.
5. **Jarl's `decisions.md`:** **never union.** Jarl supplies its own driver (`jarl merge-driver decisions %O %A %B`). It parses the ruling blocks, joins the new blocks of both sides, and refuses (markers, exit 1) on a double supersession of the same ruling and on a duplicated slug. The fallback variant, if the owner prefers simplicity: an ordinary conflict.
6. **Union** only where a line is a self-contained entry: `.jarl/log.md` and `CHANGELOG.md`. In the CHANGELOG both sides append under `[Unreleased]`, and only the release writes the version headings. A test checks that union does not interleave sections.
7. **The "defined driver without a binary" trap:**
   - `yg init` and Jarl write the local configuration solely as a command with a fallback: `sh -c 'npx --no-install yg merge-driver … "$@" || git merge-file -L ours -L base -L theirs "$1" "$0" "$2"'`. A missing `yg` therefore gives a conflict with markers, not a silent loss of "theirs".
   - A test checks each of the three paths from fact 13.
8. **What it will not do:** the merge button on GitHub does not run the drivers. The documentation says so, and Jarl and Horde merge locally.

---

## 7. Decisions and knowledge

### 7.1 Homes by reach, and precedence

| Reach | Home | Who writes | State |
|---|---|---|---|
| an area of code (a type and its subtree) | `yg log --type` | after ratification: Horde, Jarl (optional edge), the agent | [in progress] 433 |
| one node | `yg log --node` (the "why") | the agent in the node | [built] |
| the history of a rule | `yg log --aspect` | whoever changes the rule | [in progress] 434 |
| a loop or a mission | Jarl's `decisions.md` (Horde through the record) | the coordinator, the owner | [built] |
| calibration of the measurement | `.grain/seeds.jsonl` | the maintainer | [built] |
| an import boundary | a Yggdrasil rule; without a graph, a `boundary` seed | as above | promotion [proposed] |

**Precedence:** an enforced rule > a type decision (nearest type first) > a loop ruling > a Grain seed.

### 7.2 Consent by reach, for type rules too

**Principle:** what reaches every file of a type, law and decision alike, is admitted by the client. What stays within a node, the agent raises freely. The context budget is a consequence of this principle, not its cause.

Until now the principle was incomplete and had no mechanism (fact 11). The completion [proposed]:

- **A type rule before ratification** runs at once as `status: advisory`: it is visible in `yg check` but does not block. An autonomous loop does not stop, and the law works from the first commit.
- **Hardening to `enforced`** a rule that reaches a type (by pinning it in `yg-architecture.yaml` or by changing the content of an aspect already pinned to a type) requires a `yg log --aspect` entry with an annotation of the client's ratification.
- `yg check` reports `type-law-unratified` when an aspect that reaches a type has the status `enforced` and its latest content change has no ratification.
- An unratified type decision lives as a loop ruling and does not enter the vocabulary.

Under the "don't ask" mandate, a coordinator's ruling is not consent: it works in the loop, and it enters the vocabulary through ratification.

**Honestly about the thesis.** The owner works mainly on types, so in his repositories the agent mostly **proposes**, and the client **admits in a batch**. VISION has to say this plainly, not in a footnote. The proposed text:

> *"Within its territory, law is raised freely by the agent working it. Law or decisions that reach a whole type are shared vocabulary: the agent proposes them and they run as advice at once; the client admits them, in one batch, when the work closes. In a graph made mostly of types, that is most of the law."*

### 7.3 Ratification: not a rubber stamp, and it never blocks

- A batch has **at most 10 items**, ordered by reach (the number of files of the type).
- Each item is one sentence, a quote of the ruling and the number of files. Each can be rejected with one word.
- **A missing ratification never blocks `close`.** The unratified ones stay loop rulings (in a permanent loop forever; in a branch loop they disappear with it) and do not enter the vocabulary.
- Items over the limit are not proposed in this batch and wait for the next close. The limit of 10 is the owner's decision.

### 7.4 `--supersedes`: guards

| Failure mode | Guard |
|---|---|
| the writer did not see an earlier entry | `yg log add --type` shows the live entries of the type and its ancestors; when they exist, it refuses without `--supersedes <id>` or `--adds` |
| a nonexistent target | refusal (the acceptance criteria of 433) |
| a cycle | impossible, because only an earlier entry in the same log can be superseded |
| two branches supersede the same entry | the `log.md` driver (§6.2) and `merge-resolve` report a conflict |
| a descendant departs from an ancestor | this is not supersession; both entries live, nearest first |
| a wrong but existing item is superseded | this cannot be detected deterministically; the integrator, later |
| context bloat | `yg advise` at more than 7 live type decisions or after a token threshold is crossed |

### 7.5 Distillation at close, and the Jarl → Yggdrasil edge

- `jarl decide --area <type>` marks a ruling as concerning an area.
- `jarl close` assembles the ratification batch (§7.3) as `ratify` questions [built: the `ratify` kind].
- After ratification, Jarl, **if** it detects `.yggdrasil/` and a working `yg` (the probe `npx --no-install yg --version`), writes `yg log add --type <type> --reason <ruling> [--supersedes …]`.
- One place in the code, one entry in `guard.allow`. A failed write is reported, and the ruling stays in `decisions.md`.
- Horde does the same at a mission's `done`, with its own code. This is Horde's half of 436.
- The "only the coarse ones" filter is the owner's test: does an agent touching another file of this type need to know this.

### 7.6 The integrator

It stays "for later" (437). When it is built, it will be a cache, never a source, with a citation test.

---

## 8. Nodes versus types

**Ruling:** the type is the default unit, and the node is optional and first-class. A node is written where a place needs an identity: a curated relation, a "why", a flow, or a ruling between two matching types. Yggdrasil's prime already says so today.

**Consequences:**

- **The enforced "why"** stays a feature of the node (`log_required`). A graph made only of types does not have it, which is the price of fewer files, and the documentation states that price plainly.
- **Horde's territory** is the file-owner unit: a node or `type:<name>@<top-level directory>`. This requires a batch `yg owner --files`, with a unit also for files covered by a type alone (447, widened).
- **The architect's veto** covers changes to `yg-architecture.yaml`: the architect proposes, the client ratifies.
- **`grain propose --shape types`:** types with `when`, rules on types, and nodes only where they are needed. The default shape switches when `grain oracle score` on the corpus shows no loss. This is a quality reason, because the proposal must not be worse.
- **Horde's legislation** in a repository without nodes exposes type rules as `advisory`, for ratification (§7.2).

---

## 9. MCP

- **One adapter (`runes/mcp`), a server per plugin.** Parity is a feature of the generator and is tested once. Jarl and Grain move to the adapter only when their existing MCP tests pass unchanged.
- **Horde:** a command table and a server generated by the adapter for the commands that stay in Horde (`land`, `refine`, `node`, `law`, `audit`, `drill`, `retro`, `escalate`, `wave`, `blame`, `brief`, `report`, `horde`, `tick`, `queue` in its non-record part). The record commands are served by Jarl's server. `mcp-horde` delivers this.
- **Parity and profiles:** fields go through `--field` [built], so `tools/list` is static.
- **The budget, counted honestly:**

  | Server | Today | Tool description cut to 1 sentence | Without parameter descriptions |
  |---|---|---|---|
  | Jarl | ≈12.7k tokens | ≈8.4k | ≈2.4k |
  | Grain | ≈9.5k | ≈6.2k | ≈1.8k |

  - Step 1: shorten the tool descriptions. This does not hurt quality, and the full usage is given by `help: true` and `--help`.
  - Step 2: trim the parameter descriptions down to type and enum. Only when a call-accuracy test (a set of tasks, the choice of tool and fields, before and after) shows no drop. Context is a quality resource, but so is accuracy.
  - The testkit measures `tools/list` in CI and reports it. Exceeding the target (8.5k per server after step 1) is a warning, not a block.
- **Yggdrasil without MCP** (the owner's decision). It works in hooks and in CI, and prime teaches the CLI.

---

## 10. The story and adoption

The company metaphor from VISION stays the only one: Horde is the software house, Jarl is the foreman. Instead of "two doors":

> *"Jarl is the loop. Yggdrasil is the law. Grain is the survey. Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law — on Jarl's loop, with Grain in the architect's hands."*

**Entry by pain**, without a ladder, because nobody from outside has climbed any ladder yet:

| Pain | Block |
|---|---|
| too many problems for one agent | Jarl |
| the agent breaks what was agreed | Yggdrasil |
| we don't know what we have agreed on | Grain, ideally right before writing law |
| a task too big for one head to plan out up front, in a repository that already has law | Horde |

---

## 11. The signal from production

- **Home:** `yg incident` [built].
- **Work:** an `incident` issue template in Jarl [proposed]. Acceptance requires a `yg incident add` entry, if the repository has Yggdrasil, and a rule change or a recorded reason why a rule cannot express it.
- **Horde:** `retro` reads the incidents since the mission's base.
- **Honestly:** an inflow from telemetry does not exist, so the sentence stays on VISION's front.

---

## 12. Measurement: a regression check, not a veto

The rebuild is unconditional. The measurement checks whether Horde after the rebuild is not worse than before it, and along the way it honestly measures Horde's value for the canon.

1. **Loop metrics** (`jarl report --json`): cycle time, rounds, reopenings, **the share of fresh reviews** and their provenance, red CI after the merge, follow-ups within 7 days. Where the record has no data (reviews from before `--by`), the metric says "no data", not zero.
2. **Replay on known truth.**
   - The set: 8–10 **closed** Yggdrasil tickets from 6.1.0 that have known later defects (a follow-up or a reopening), replayed from the same base sha.
   - The set is disjoint from the work of phases 4–5 (critique B, point 15).
   - The runs:
     - (i) Horde before the rebuild, a baseline run done **before** any change to Horde;
     - (ii) Horde after the rebuild;
     - (iii) Jarl with the repository's check, only as a measurement of value.
3. **Metrics registered before the start:**
   - main: the owner's minutes per ticket;
   - known defects caught before landing;
   - red CI after the merge;
   - a blind assessment of the diffs by a fresh reviewer who does not know which run a diff comes from.
4. **Rule:** (ii) worse than (i) on the main metric or on caught defects is a regression. A regression blocks the release of the rebuilt Horde until it is fixed. For a reason of quality, not of cost, and it never reverts the rebuild.
5. **The canon according to the result of (iii) against (ii):**
   - if Horde catches defects that Jarl with a check does not catch, the canon says so and gives the numbers;
   - if it does not, the canon writes that Horde's value is not measured yet, and Horde stays the composer. Honesty over hype.
6. **Honestly:** n is small, and the operator is the coordinator's agent. The blind assessment and the disjoint set limit the bias, but do not remove it.

---

## 13. Answers

### 13.1 The fifteen questions of the coherence review

| # | Question | Answer |
|---|---|---|
| 1 | Independent, or modules? | Usable separately, released together under one number from 6.1.0. Compatibility is carried by schema ids, the profile, `jarl-record/N` and the pins. |
| 2 | What does Horde give over Jarl and Yggdrasil's CI? | A plan on the law before the work, a gate the agent cannot win against, and what the mission learned turned into law. Its value is measured by §12 point 5. |
| 3 | Why not Horde in 6.1.0? | The work spanned several repositories, and Horde works on one repository (it does not require a graph, it sets one up itself). Horde was used once, 09-05/06. |
| 4 | The trust doctrine? | Conditional (§4.5): the check decides where there is one; review stops and is testimony; Jarl without a check says so plainly. |
| 5 | Where does a decision live? | A home by reach, and the precedence from §7.1. |
| 6 | Nodes? | Optional, first-class; type by default (§8). |
| 7 | Consent under the mandate? | Not the coordinator. A type rule runs as `advisory`, a decision as a ruling, and ratification comes in a batch at close and does not block (§7.2–7.3). |
| 8 | Contradictory live decisions? | The guards from §7.4; the integrator will detect semantic contradiction later. |
| 9 | Integrator: source or cache? | Cache. |
| 10 | Who merges? | Jarl's merger and `land.mjs`, both with the drivers through `git -c` (§6). |
| 11 | A second consumer of the ports? | There is none, so there are no command ports. There are profile data keys (§4.3). |
| 12 | MCP budget? | Measured, with a warning. Cutting parameter descriptions only after the accuracy test (§9). |
| 13 | Production? | `yg incident` and the `incident` template (§11). |
| 14 | "Grain first"? | Replaced by entry by pain (§10). |
| 15 | Stop rule? | None, by the owner's will (the ruling that everything goes into 6.1.0 with no stop). Convergence comes from the order of the phases, the evidence at each phase, and the release on the owner's word (§14). |

### 13.2 The thirteen decisions of the mapping report

| # | Decision | Now |
|---|---|---|
| 1 | "What Jarl will not grow" | The list stays; the paragraph "the profile is data only". A change against the coordinator's ruling. |
| 2 | Who merges | `land.mjs` and Jarl's merger; drivers through `git -c`; the write through `record.mjs`. |
| 3 | Approve in Horde | `done-gate` in the profile (`approve: none` + `requires-merged`). |
| 4 | What settles a dependency | The `settles-dependents` flag [built]. |
| 5 | One loop per horde | Yes, through `--root` [built]. |
| 6 | Calls between blocks | A rule on imports, calls and paths, only along edges; a new Jarl → Yggdrasil edge (§3). |
| 7 | Grain for Horde | **Required.** Signals with weaker evidence (co-change on files) enter the architect's verdict as advisory, with a denominator. Today's numbers: certified undeclared partner 0.262 versus 0.194 (31 directions won, 7 lost); all certified 0.299 versus 0.135; after filtering out pairs with a test, precision 0.80. |
| 8 | Jarl in the core | Yes, at number 6.1.0. |
| 9 | 431 | In 6.1.0, from the adapter, for the commands that stay (§9). |
| 10 | Jarl's half of 436 | The optional edge for writing ratified decisions (§7.5), without a hook. |
| 11 | Grain's gaps | In 6.1.0: `cochange --partition`, `measure --from --to`, `advise kind: rule`, `propose --shape types`; `yg owner --files` with a unit. `completeness --json` [built]. |
| 12 | Missions on the boundary | Missions from 6.0.x finish on 6.0.x. |
| 13 | Horde's defects | 450 in 6.1.0. |

---

## 14. The plan: phases inside 6.1.0

Everything is in 6.1.0. The phases are ordered by dependency, and within a phase the items run in parallel. The rest of the 6.1.0 backlog carries on independently of this plan. Every item has evidence.

**Phase 0. The owner's decisions on this design** (§16). Without them, nothing from phases 1–6 starts.

**Phase 1. Foundations without dependencies**

| Item | Evidence |
|---|---|
| 1.1 The Runes repository: TS, `dist` with a freshness test, CI on Node 22 and 24, the identifier guard, `tools/vendor.mjs`, publication from a tag, a manifest with a runtime pin | tag 0.1.0 on npm; the gate red on a hand-modified copy; the sha check works offline |
| 1.2 Yggdrasil's log: 433 (`--type`, `--supersedes`, showing the live entries, `--adds`), 434 (`--aspect`, Horde re-pointed), 432, 435 | e2e from the acceptance criteria; the refusal case without a choice |
| 1.3 `record.mjs` in Jarl with an export list and a contract test; the `jarl-record/1` row; `engines` ≥ 22 | the contract test red on an added or removed export |
| 1.4 `jarl report --json`: loop metrics with the share of fresh reviews | the numbers from the 6.1.0 loop match a manual analysis where the record has data |
| 1.5 The baseline replay run, that is (i) from §12, on Horde before any change | a recorded report with the metrics registered before the start |
| 1.6 Removing the "Horde" literals from Yggdrasil's messages | the identifier guard green in Yggdrasil |
| 1.7 450 (Horde's defects) | lock race tests and the "answer consumed before the gate" case |

**Phase 2. The content of Runes** (depends on 1.1)

| Item | Evidence |
|---|---|
| 2.1 Moving the relations, AST, the grammar recipe (unifying PHP), the 460 catalogue and the unit tests; the parser factory and the runtime identity injected; `ownerNode` → `owner` | the Runes suite green; the 460 catalogue passes on the pinned runtime |
| 2.2 `fs`, `cli`, `mcp` (two executors), `testkit` (git env, parity, guard, measurement, runtime compatibility), `skills/` with the first fragments | its own tests; consumer smoke green |

**Phase 3. Consumers on Runes** (depends on 2)

| Item | Evidence |
|---|---|
| 3.1 Yggdrasil: a runtime dependency with an exact pin | the full suite green; `yg check --json` on Yggdrasil and on a second real graph identical before and after |
| 3.2 Grain: vendor and the gate in place of `build-relations`/`build-grammars`; an assertion that the pin matches Yggdrasil's | the `grain export` edges on the corpus (express, spring-petclinic) identical before and after |
| 3.3 Jarl and Grain: MCP servers on `runes/mcp`, step 1 of the budget | the existing MCP tests unchanged; `tools/list` measured before and after |
| 3.4 Horde: a command table and an MCP server from the adapter for the commands that stay | a parity test; a budget measurement |
| 3.5 Skill fragments inserted into the SKILL of Jarl, Grain and Horde | the gate red on a hand-modified block |

**Phase 4. Law and knowledge** (depends on 1.2; 4.1 is independent of Runes)

| Item | Evidence |
|---|---|
| 4.1 Merge drivers: a textual `log.md`, a direction-independent lock, lock regeneration after the merge, `git -c` in the merger and `land`, configuration with a fallback, the `decisions.md` driver in Jarl, union only for logs and the CHANGELOG | tests of the three paths from fact 13; a double-supersession test; a replay of the conflicting merges from the 6.1.0 loop, with the number resolved without a hand edit and the number the drivers do not apply to |
| 4.2 `yg owner --files` with a unit | correct units for files covered by a type; one graph load per batch |
| 4.3 Consent for type law: `advisory` until ratification, ratification in `yg log --aspect`, `type-law-unratified` | test cases on a real graph |
| 4.4 `jarl decide --area`, the ratification batch at `close` (limit, order, rejection, never blocks), the optional write to `yg log --type` | e2e: a close with Yggdrasil and without it; `close` passes without ratification |
| 4.5 Double supersession in `merge-resolve`; the budget signal in `yg advise` | test cases |
| 4.6 Grain: `advise kind: rule` (`boundary` promotion), `propose --shape types`, `cochange --partition`, `measure --from --to`, the filter for pairs with a test (456) | the precision of the rule drafts on the top 20, labelled by the maintainer; the `oracle score` of the type shape no worse than of the node shape |

**Phase 5. Horde on Jarl** (depends on 1.3, 2, 3.4, 4.1, 4.2, 4.4 and 4.6)

| Item | Evidence |
|---|---|
| 5.1 Jarl's profile: `set-by`, `external-scheduler`, `done-gate`, `format` | `jarl_set` refuses `queued` on a Horde loop; `next` and `queue` speak of the external schedule; `done` without a merge is rejected |
| 5.2 Horde on `record.mjs` with the `jarl.pin.json` pin; Horde's profile; territory by unit; the architect with Grain as a required edge; writing ratified type decisions at `done` | about 721 Horde tests green (setup rewritten, assertions unchanged); the drill corpus recorded anew; `jarl resume --root .horde/hordes/<h>` correctly shows a live mission |
| 5.3 Replays (ii) and (iii) from §12 | a regression against (i) blocks the release of the rebuilt Horde until it is fixed; the result of (iii) against (ii) goes into the canon |

**Phase 6. The canon** (depends on 5.3)

- VISION: the trust doctrine from §4.5, the reach principle from §7.2, Jarl's row in the stages table, the dependency graph.
- `family/canon.md`, the READMEs (with the "what it will not grow" lists), `family/map.md` with Runes, a step in the family release procedure.
- Numbers: Jarl, Grain, Horde and Yggdrasil at 6.1.0; `promises` at the family number.
- **Evidence:** the canon sync check (now `ws check canon-sync`) green; zero hits of retired sentences (the list in `family/canon.md`, with "two doors" and "Grain first" added).

**Phase 7. The release** (issue 022) on the owner's word (`release-last-on-owner-word`).

---

## 15. Risks of this design

| # | Risk | How it is limited |
|---|---|---|
| R1 | Runes becomes a dumping ground | the entry rule, the identifier guard, the "never into Runes" list in the Runes README |
| R2 | The copy drifts from the source | sha always, a fresh clone in CI, a mutation test of the gate |
| R3 | A Runes tag breaks a consumer | smoke as a condition of the tag; the consumer's full CI after the pin bump |
| R4 | Jarl version mismatch: installed versus vendored | `format`, `jarl-record/N`, refusal of an unknown profile key (built) |
| R5 | Jarl's views lie about Horde's loop | `set-by`, `external-scheduler`, a test of every view on a loop with Horde's profile |
| R6 | A merge driver silently loses data | `git -c` on every merge, fallback to markers, no union on structured files, tests of the three paths from fact 13 |
| R7 | The lock is stale after the merge | a separate regeneration step in the merger/`land` and in the post-merge hook; `yg check` detects the rest |
| R8 | Ratification becomes a rubber stamp or a blockade | a limit of 10, ordering by reach, cheap rejection, never blocks `close` |
| R9 | Type law comes in without consent (today consent is prose) | `advisory` until ratification, and `type-law-unratified` |
| R10 | The replay is biased or too small | a set disjoint from the work, blind assessment, metrics registered up front, an honest n in the report |
| R11 | Cutting the MCP descriptions hurts accuracy | step 2 only after the accuracy test |
| R12 | The agents' code drifts from the knowledge again | every item has mechanical evidence (golden diff, parity, gate, contract tests); the owner judges decisions, not code |
| R13 | One release carries a rebuild of the whole family | phases ordered by dependency, evidence at every item, regression measurement before Horde's release, the release only on the owner's word |

---

## 16. The owner's decisions, the complete list in order

For each one: whose words it overrides, and what the variant consistent with his words is, with the risk limited.

| # | Decision | Recommendation | Overrides | Variant consistent with the owner's words, with the risk limited |
|---|---|---|---|---|
| 1 | The Horde–Jarl model | the `record.mjs` module + a data profile, without ports 442–444, unconditionally | the coordinator's (`blocks-and-composer` point 1, the 442–444 plan) | ports as profile commands, with a contract and a second toy composer in the tests |
| 2 | Measurement | a regression check (§12), never a veto | nothing | — |
| 3 | Runes: contents | as in §5.1, with skill fragments | nothing | code modules only, without prose fragments |
| 4 | Runes: Yggdrasil | a runtime dependency with an exact pin, without bundling | nothing | a devDependency with `noExternal` and a `.d.ts` check |
| 5 | Vendoring gate | sha always, a clone only in CI | the reading of "only in development" (translated from Polish), to be confirmed | no clone in CI, the sha check alone |
| 6 | Merge drivers | §6, with its own `decisions.md` driver | nothing | `decisions.md` as an ordinary conflict |
| 7 | Trust doctrine | the conditional text from §4.5 into VISION | nothing (a change of VISION) | — |
| 8 | Consent by reach, and type rules as `advisory` | §7.2, with the honest sentence in VISION | nothing (a change of the VISION thesis) | consent per entry, as today; type rules with no change of mechanism |
| 9 | Ratification | a limit of 10, never blocks | nothing | a different limit |
| 10 | The Jarl → Yggdrasil edge | writing ratified area decisions only | nothing (these are the owner's words) | — |
| 11 | Grain required | yes, weak signals advisory, with a denominator | nothing (these are the owner's words) | — |
| 12 | Jarl in the core at 6.1.0 | yes | nothing | — |
| 13 | Horde's MCP | from the adapter, for the commands that stay | nothing (`mcp-horde`) | — |
| 14 | MCP budget | a warning; cutting parameters after the accuracy test | nothing | a block in CI |
| 15 | Yggdrasil's MCP | no | nothing | a server from the adapter, from the `commander` tree |
| 16 | Nodes and types | type by default; `propose` switches the default shape after measurement | nothing | types by default right away |
| 17 | "The profile is data only" in Jarl's SKILL | yes | the coordinator's (the paragraph added at 441) | — |
| 18 | The story: the sentence about Horde, entry by pain, no "Grain first" | §10 | nothing (a change of the canon) | "Grain first" stays as one of the ways in |
| 19 | Jarl's `engines` ≥ 22 | yes | nothing | — |

---

## 17. What I am not sure of

1. **Whether "skills vendored" covers prose.** I read the owner's sentence mainly as a way of distributing code, and I add the skill fragments following critic A. If the owner meant only code, `skills/` in Runes is unnecessary.
2. **Merge drivers in practice.** I have not counted what share of the manual conflicts in 6.1.0 are in files the drivers will cover. Regenerating the lock after the merge in every place where someone merges (the merger, `land`, a human) is also the weakest link: a human can skip it, and then only `yg check` will show the problem.
3. **Jarl's views on a Horde loop.** `set-by` and `external-scheduler` close the known lies of the views. I am not certain these are all of them: `tips`, `branches` and `report` read built-in status words (`dropped`, `deferred`), as the SKILL describes. Phase 5.1 has to test every view, not only these three.
4. **The reach principle in repositories "mainly on types".** Mechanically it is consistent, but it changes the VISION thesis so that the agent mostly proposes law rather than raising it. I do not know whether the owner will accept such a change of the thesis, or prefers to leave the agent free at the type level as well.
5. **The power of the replay.** With 8–10 tickets and one operator, a small-scale regression may go unnoticed. The measurement will catch only a clear deterioration.

---END---

**Changes v1 → v2:**

- **Scope and plan.**
  - Removed the stop rule and the 6.1.0/7.0 split. Everything is in 6.1.0 as phases 0–7 by dependency, each item with evidence.
  - Removed all S/M/L estimates and cost arguments (`no-effort-estimates`).
  - Rejected critic C's cost cuts (cutting Runes, "a minimal 7.0").
- **Fidelity to the owner.**
  - The Horde rebuild is unconditional; the benchmark is only a regression check and is not a veto.
  - Grain required, with today's numbers.
  - Jarl in the core at 6.1.0.
  - Horde's MCP now, from the adapter, for the commands that stay in it.
  - A new Jarl → Yggdrasil edge for ratified decisions.
  - Shared skill fragments in Runes.
  - Labels corrected: 442–444 and the profile paragraph override the coordinator's ruling, not the owner's.
  - A full, ordered list of 19 decisions with the "overrides" and "consistent variant" columns.
  - Uncertainties in a separate section 17.
- **Technical corrections (critique B).**
  - A new design of the merge drivers: `git -c` on every merge, a textual `log.md`, a direction-independent lock, lock regeneration after the merge, a fallback with markers, no union on `decisions.md` (Jarl's driver or an ordinary conflict).
  - Horde on Jarl with the keys `set-by`, `external-scheduler`, `done-gate` and `format`; an explicit `record.mjs` contract instead of 142 implicit exports.
  - A guard on imports, calls and paths instead of a word test; `ownerNode` → `owner`; removal of the "Horde" literals from Yggdrasil.
  - Yggdrasil has Runes as a runtime dependency, with no contradiction with tsup.
  - The `web-tree-sitter` runtime pin in Runes; target Node 22.
  - The gate: sha always, a fresh clone only in CI.
  - Honest arithmetic for the MCP budget.
  - Replay on a set disjoint from the work.
- **Factual corrections.**
  - Horde sets up the graph itself, and the barrier was the multi-repository work.
  - Fact 3: "no guard", not "drift".
  - Fact 11 only half true, completed with the `advisory` and ratification mechanism.
  - `--type` and `--aspect` marked as [in progress].
  - Loop state updated.
- **Substantive points of critique C that stayed.**
  - The conditional sentence about trust, with a mechanical counter of fresh reviews.
  - Consent for type rules as `advisory` until ratification, with an honest change of the thesis.
  - Ratification with a limit, cheap rejection and no blocking of `close`.
  - The design of the replay on known truth, with the owner's minutes as the main metric and a blind assessment.
  - No union on `decisions.md`.
  - A new sentence about Horde within the one company metaphor.
