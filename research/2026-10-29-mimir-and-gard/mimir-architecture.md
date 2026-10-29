# Architecture of the Mimir repository

> **In Althing, 29 October 2026.** Ported from Mimir's development documents with every private name replaced by a neutral one; M-numbers name issues of Mimir's first loop, as in [git-gate-design.md](git-gate-design.md). It describes the Mimir repository on its first build branch before the split into Mimir and Gard ([README.md](README.md)). Mimir's word "shell" names what Gard calls a rig (ruling `rig-is-the-name`). Ids such as rv-010, rv2-026 or faza0-cov-013 name findings of reviews of that build, which are not ported; a D-number names a row of section 12 of this document.

> As of 2026-10-26 (M101). A development document: it lives outside the repository on purpose and is written in
> English. The architecture graph itself is in the repository, in `.yggdrasil/`, and Yggdrasil (`@chrisdudek/yg`, a
> devDependency) checks it. The graph is self-contained: every rule, node and type says what it means in its own words,
> so nothing in the repository points at this document. This document says how the repository is laid out and why,
> where new code goes, which rules the graph keeps, where the code still departs from them, and what that means for the
> issues in the queue.
>
> **State at the end of M101** (branch `jarl/101-architektura`, commit `da4d742`, faza-0 `155221b` merged):
> `npx yg check` PASS, 47 nodes, 506/506 tracked files covered, 345 script pairs verified, 20 warnings (the advisory
> exceptions of section 12); `npm test` 1427 tests, 1425 pass, 2 skipped.
>
> **Checking** (everything in the container, through `scripts/dx`):
>
> - `scripts/dx run -- npx yg check --approve --only-deterministic` fills the verdicts of the script rules (free, no key,
>   no model) and reports the whole graph. A worker runs it before handing in a change; CI should run the same.
> - `scripts/dx run -- npx yg check` only reads: it recomputes dependencies and coverage and checks the recorded verdicts.
> - `scripts/dx run -- npx yg context --file src/<module>/<file>.mjs` before editing a file: its node, the rules that
>   bind it, and the modules it may depend on.

## 1. Why a graph

Two goals, both from the owner:

1. **Keep the repository in good condition.** Every file git tracks belongs to a node of the graph through a wildcard;
   a file no node maps is a `yg check` error (`coverage.required: ["/"]`). Every import between modules must be a
   declared relation that the layer types allow, and relations form a graph without cycles. Cross-cutting rules
   (aspects) are scripts run on every `yg check --approve --only-deterministic`.
2. **Pull the code up to the architecture.** What could be done without changing behaviour was done in M101
   (section 11). The rest is in section 12 as deviations with proposed issues; the rules those places break are
   advisory on their nodes (a warning) and enforced everywhere else.

## 2. Granularity rule

"As granular as makes sense." A node exists where a unit has **at least one** of three things:

- **a responsibility of its own**: it can be described in one sentence without an "and" that joins two different
  concerns;
- **a public surface of its own**: other modules use it through a few named exports, not through any of its files;
- **dependency rules of its own**: a different "may / may not import" list than its neighbours, or a different
  cross-cutting rule.

Four practical consequences:

- **A node is a folder.** A product module is `src/<module>/`, and its node maps `src/<module>/**`. A new file in that
  folder is covered without editing the graph. A file directly in `src/` belongs to the kernel (`mimir/kernel`), so only
  what every layer needs goes there.
- **No split for symmetry, per file, or because a file is big.** File size is a review matter, not a graph matter.
- **Split when a folder holds two responsibilities with different rules.** First a separate folder, then a node.
  Examples: the identity of a repo (normalising a remote URL) is to leave the registry; the owner's guards are to leave
  the hook dispatcher (section 7). A node may map single files when a file inside a folder has different rules than its
  folder (the owner's guards in `src/hooks`, the hook switches in `src/hooks/blocks.mjs`); that is always a temporary
  state, named as a deviation.
- **Layers and groups are organisational nodes** (no files). A relation to a layer sanctions a dependency on every
  module in it; only `commands` and the test suites use that.

## 3. Layers and the direction of dependency

Dependencies go down only. Node types in `.yggdrasil/yg-architecture.yaml` say to which types a relation may be
declared (`default: deny` for everything else); a node's relations in its `yg-node.yaml` say which modules it really
depends on. Structural relations must form a DAG (Yggdrasil refuses a cycle).

```
                 entry            bin/mimir.mjs
                   |
                commands          src/commands/<command>.mjs   (nobody imports them; the contract loads them)
                   |
               application        src/doctor, src/check
                   |
               integration        src/hooks, src/mcp, src/serve + portal/, src/install, src/skills,
                   |   \          src/tools/<tool> + plugin/
                   |    cli       src/cli  (the command contract: table, arguments, JSON envelope, execution)
                   |    |
                 domain           src/manifest -> registry -> places, context -> address -> session, worktree, topic,
                   |              write, browse, search, cleanup   (planned: rules, jobs, extensions, sync, provenance)
                   |
                platform          src/git, src/lock, src/platform
                   |
                 kernel           src/*.mjs (errors, config, slug, deadline, self), src/text
```

| Layer (type) | May depend on | May not |
|---|---|---|
| kernel | kernel, vendor | anything above |
| platform | kernel, platform, vendor | domain and above; knows no areas, addresses or commands |
| domain | kernel, platform, domain (no cycles), vendor | cli, integrations, application, commands |
| cli (contract) | kernel, platform, vendor | domain (it loads commands at run time) |
| integration | kernel, platform, domain, cli, integration, vendor | application, commands |
| application | everything below | commands |
| commands | every layer | - (the top; nobody imports them) |
| entry | kernel, platform, cli, integration | domain directly |
| tests | everything | - (the product never imports tests) |
| tooling (scripts, devcontainer, CI) | kernel, platform, domain, vendor | - (the product never imports a script) |

Order inside the domain (bottom up): `manifest` (the schema of one file) -> `registry` (what the computer has) ->
`places`, `context` (where a path is) -> `address` (`mimir://` addresses) -> `session` -> `worktree`, `topic`, `write`,
`browse`, `search`, `cleanup`. The exact edges are the node relations; a new edge is an edit of `yg-node.yaml`, visible
in review.

## 4. Modules and their public surfaces

| Node | Files | Responsibility | Public surface |
|---|---|---|---|
| `mimir/kernel` | `src/*.mjs`, `src/text/**` | the error-code registry, the home of Mimir and the config of the computer, the home folder of the user, slugs, the hook deadline, what Mimir knows of its own installation, the shared rules text for agents, quoting a shell word | `errors.mjs` (CODES, MimirError, errorEntry, warningEntry, fixFor), `config.mjs` (homeOf, mimirHome, mimirPaths, readConfig, FALLBACK_NAME), `slug.mjs`, `deadline.mjs`, `self.mjs` (PACKAGE_ROOT, MIMIR_BIN, mimirVersion), `text/rules.mjs`, `text/shell-word.mjs` |
| `mimir/platform/git` | `src/git/**` | the only place git starts, the allow-list, fetch and push with classified errors, update-ref with compare-and-swap | `src/git/index.mjs` |
| `mimir/platform/lock` | `src/lock/**` | locks with expiry, the repo write lock | `lock.mjs`, `repo.mjs` |
| `mimir/platform/os` | `src/platform/**` | the operating system: atomic writes, starting programs other than git, runtime probes (Node, SQLite); later the Windows path layer | `atomic.mjs`, `process.mjs`, `runtime.mjs` |
| `mimir/cli` | `src/cli/**` | the command contract shared by CLI, MCP and the server: table, parsing, envelope, execution, help text | `table.mjs`, `commands.mjs`, `parse.mjs`, `output.mjs`, `run.mjs`, `usage.mjs` |
| `mimir/domain/manifest` | `src/manifest/**` | `area.yaml`: loading, validation of keys, words of problems | `load.mjs`, `validate.mjs`, `problems.mjs`, `integrate.mjs` |
| `mimir/domain/registry` | `src/registry/**` | what the computer has: `registry.json`, the area scan, cache, files of an area, Mimir's worktree record, links in the Desk, init/attach/create | `registry.mjs`, `scan.mjs`, `cache.mjs`, `gitdir.mjs`, `files.mjs`, `worktrees.mjs` |
| `mimir/domain/places` | `src/places/**` | places with a purpose: marker, state, `place mark` | `places.mjs`, `mark.mjs` |
| `mimir/domain/context` | `src/context/**` | where a path is: repo, area, worktree, chain, the `context` answer | `locate.mjs`, `context.mjs`, `chain.mjs`, `owner.mjs` |
| `mimir/domain/address` | `src/address/**` | the only reader of the `mimir://` grammar and the resolution of addresses | `parse.mjs` (parseAddress, formatAddress, isAddressText), `resolve.mjs`, `world.mjs` |
| `mimir/domain/session` | `src/session/**` | agent sessions: id, session file, journal of writes, which session a call is | `store.mjs`, `resolve.mjs`, `journal.mjs` |
| `mimir/domain/worktree` | `src/worktree/**` | worktrees in their fixed place: open, close, list, orphans | `open.mjs`, `close.mjs`, `list.mjs`, `notice.mjs` |
| `mimir/domain/topic` | `src/topic/**` | topics: start, use, list, show, rename, move, branches, check of a topic.yaml | `src/topic/index.mjs` |
| `mimir/domain/topic/records` | `src/topic/{names,schema,load,store,line,state,current}.mjs` | what a topic is on disk and to this computer, with no operation (read by address, browse, context) | `names.mjs`, `store.mjs`, `line.mjs`, `current.mjs` |
| `mimir/domain/address/grammar` | `src/address/parse.mjs` | the grammar alone, below topics and worktrees | `parse.mjs` |
| `mimir/domain/context/answer` | `src/context/context.mjs` | the answer of `mimir context`, above sessions and topic records | `context.mjs` |
| `mimir/domain/write` | `src/write/**` | the write core with provenance: commit beside the checkout, CAS, intent, queue, push, session branch, PR | `index.mjs`, `command.mjs` |
| `mimir/domain/browse` | `src/browse/**` | the read side: ls, read, show, grep, find | `ls.mjs`, `read.mjs`, `show.mjs`, `grep.mjs`, `find.mjs` |
| `mimir/domain/search` | `src/search/**` | the index and search | `run.mjs` |
| `mimir/domain/cleanup` | `src/cleanup/**` | the cleaner's report and its approved apply | `run.mjs`, `apply.mjs` |
| `mimir/integration/hooks` | `src/hooks/**` | the hook dispatcher: entry with a time limit, header, session file, background index | `entry.mjs` |
| `mimir/integration/hooks/owner-guards` | the guards in `src/hooks` | the owner's setup, still in the core (section 7) | - |
| `mimir/integration/hooks/switches` | `src/hooks/blocks.mjs` | the names of the hook blocks and how their switches are read (kernel type) | `blocks.mjs` |
| `mimir/integration/mcp` | `src/mcp/**` | the MCP server (stdio) over the command contract | `server.mjs` |
| `mimir/integration/serve` | `src/serve/**` | the local server: token, Host/Origin, CSP, read-only API | `run.mjs` |
| `mimir/integration/portal` | `portal/**` | the portal pages | - |
| `mimir/integration/install` | `src/install/**` | the shim, the plugin from its template, the entries in the tool's settings | `install.mjs` |
| `mimir/integration/skills` | `src/skills/**` | the Desk's skills made native in the tool | `sync.mjs`, `manifest.mjs` |
| `mimir/integration/claude-code` | `src/tools/claude-code/**`, `plugin/**` | everything specific to Claude Code | `config.mjs` |
| `mimir/application/doctor` | `src/doctor/**` | the state of the computer: one file per check | `run.mjs` |
| `mimir/application/check` | `src/check/**` | `mimir check`: validation of an area's manifest and topics | `run.mjs` |
| `mimir/commands` | `src/commands/**` | one command = one file | - |
| `mimir/entry` | `bin/**` | the executable | - |
| `vendor` | `vendor/**` | third-party code copied into the repo (yaml, Runes); replaced in an issue of its own | - |
| `tests/suites`, `tests/helpers`, `tests/fixtures` | `test/*.test.mjs`, `test/helpers/**`, `test/fixtures/**` | tests, test worlds, data | - |
| `repo/tooling`, `repo/package`, `repo/docs` | `scripts/**`, `.devcontainer/**`, `.github/**`; `*.json`, `.git*`; `README.md` (+ a licence file) | repo tools, configuration, the README | - |

A module with an `index.mjs` (git, write, topic) exposes its surface through it; a new use from outside goes through
`index.mjs`, not through an internal file.

## 5. Forbidden dependencies and how they are kept

| Forbidden | Kept by |
|---|---|
| A lower layer imports a higher one (domain -> cli, domain -> hooks, platform -> domain) | types in `yg-architecture.yaml` (`default: deny`); `yg check` refuses the relation and the undeclared import |
| A cycle between modules | Yggdrasil (`structural-cycle`) |
| Anyone imports a command | types (nobody but tests may relate to `mimir/commands`) |
| git started outside `src/git/run.mjs`; `node:child_process` outside the two launchers | aspect `process/launch-through-platform` + `test/git-runner.test.mjs` |
| The hook path statically imports the write layer, search, YAML, SQLite, Runes, front ends | aspect `hooks/light-and-fail-open` + `test/helpers/loaded-modules-hooks.mjs` |
| A repo change (commit, ref, index, push, branch, worktree) outside its owner | aspect `write/core-owns-repo-changes` |
| The core imports the owner's setup | aspect `core/no-owner-setup` |
| Code outside `src/address` reads the `mimir://` grammar | aspect `address/one-parser` |
| A document other than the README in the repo | coverage: the docs node maps only `README.md` (and a licence file) |
| An extension (planned) imports anything but the extension API | a future `extension` type with a relation only to `src/extensions/api.mjs` (section 6) |

## 6. Where new code goes (target state)

Before creating a file: `scripts/dx run -- npx yg context --file <path>` (for a new folder: read the types in
`.yggdrasil/yg-architecture.yaml`). A new folder in `src/` needs a new node, or `yg check` reports unmapped files; the
node's type follows from its layer.

| Planned feature (issue) | Place | Layer, dependencies |
|---|---|---|
| Rules engine and config layers, `show --why`, `RULE_CONFLICT` (57, 105) | `src/rules/`: a pure engine (pattern matching with fragments, `set`, one pass, conflicts, `why`, no I/O); collecting the layers (chain manifests, Desk rules, computer config, `area.local.yaml`) in `src/context/layers.mjs`, because the order of layers follows the area chain; settable fields and the secret function in `src/manifest/` | domain; `rules` depends only on kernel and manifest; context depends on rules, never the reverse |
| Registry of manifest keys and error codes (102) | `src/manifest/keys/<key>.mjs`, `src/errors/codes/<module>.mjs`; `src/errors.mjs` stays the facade | manifest, kernel; the hook path does not load the registries |
| Area lifecycle: rename, move, remove, detach, migrate (60) | `src/registry/`; manifest writes through the write core | domain |
| Cloning and syncing the missing (58), sync (42) | clone: `src/registry/clone.mjs` through the git runner; `src/sync/` as its own domain module over write and worktree | domain |
| Job runner, job state (66, 67) | `src/jobs/`; the job process through `src/platform/process.mjs`, the lock through `src/lock`, the result through the write core | domain |
| Extension skeleton (73) | `src/extensions/`: `loader.mjs`, `registry.mjs` (resource kinds), `api.mjs` (the only surface for extension code) | domain; address, browse, search, hooks (header), doctor and serve ask the kind registry, they do not know extensions by name |
| `session` kind, session archive, journal (74-77), Acme ingest (78) | the owner's extensions in this repo, outside the product: `extensions/<name>/` (like `extensions/owner-guards`, M130) | type `owner-setup`; they import only `src/extensions/api.mjs` and the area hook API |
| Semantic search (71, 109) | `src/search/providers/<provider>.mjs` behind one interface | domain/search; network only in the adapter |
| Hook protocol adapters (86) and Copilot, Codex, Cursor plugins (87-89) | `src/tools/<tool>/`: `hook-protocol.mjs`, `plugin.mjs`, `instructions.mjs`; template beside it, like `plugin/` for Claude Code | integration; the hook core takes normalised events and knows no tools |
| Degraded mode (90) | guarantee-level data in `src/tools/<tool>/`, read in doctor | integration, application |
| Windows: path layer, write with retry (92), start without a shell (93) | `src/platform/paths.mjs`, `src/platform/atomic.mjs`, `src/platform/process.mjs` | platform |
| MCP over HTTP (68), deferred | transport in `src/mcp/http.mjs`, mounted by serve | integration |
| Thin hook client in a container (69), deferred | `src/hooks/remote.mjs` (no domain imports: the event goes to the host over HTTP) | integration |
| Provenance ledger of code commits (129) | `src/provenance/` (notes in `refs/notes/mimir` through the git runner) | domain |
| Portal views (51, 83, 84) | `portal/` (pages), `src/serve/` (API); extension views from the extension registry | integration |
| Area hooks in the dispatcher (62) | `src/hooks/area.mjs` (chain from the Desk, time limit, fail-open) | integration |
| Packing an agent's changes (32) | `src/write/pack.mjs`; the hook only journals and starts `mimir` in the background | domain, integration |
| integrate (41) | `src/write/integrate.mjs`; `branchState` from `src/worktree/branch-state.mjs` | domain |

## 7. The core and the owner's setup

Owner rulings: the throwaway-script ban, the disk guard (free-space threshold, scratchpad limit, cleanup list), the
`.temp` block and the host-run rule are the owner's setup, not the core. The core does not ship them, not even in a
warning mode; the core gives the mechanism: the hook dispatcher, the header, the session file and heartbeat, area hooks
with a time limit that fail open. Their place: the module `extensions/owner-guards` in this repo, outside the product
(M130).

In the graph:

- **Today** the guards sit in `src/hooks/` and are the node `mimir/integration/hooks/owner-guards` (type `owner-setup`),
  which maps only their files (`scripts`, `disk`, `cleanup`, `host-run`). The `.temp` block is spread over `target.mjs`
  (`tempFoldersOf`), `messages.mjs` (`tempRefusal`), `known.mjs` and `handle.mjs` (`heldTemp`), so the node does not yet
  cover it. The hook core imports the guards directly; `core/no-owner-setup` reports each such import and is advisory
  on the hook nodes until M130. The guard files were not moved in M101 (only their comments were cleaned).
- **After M130** the code moves to `extensions/owner-guards/**`; the node becomes the top-level
  `extensions/owner-guards` (same type, outside `mimir/`), related to the core only through the area hook API (62) and
  the extension API (73). The core imports nothing from it (the aspect becomes enforced on the hooks), and `package.json`
  `files` does not pack it. The guard fixtures (`test/fixtures/hooks/{scripts,disk}/**`) move with it as
  `test/fixtures/owner-guards/**` or `extensions/owner-guards/test/**`.
- If the owner ever moves the module into his Desk or another repo, the node disappears and the aspect still keeps the
  core from importing anything in its `OWNER_SETUP` list.

## 8. Aspects (cross-cutting rules)

Each aspect is a script rule (`check.mjs`, no model, no key) in `.yggdrasil/aspects/<group>/<name>/`. Shared source
readers: `.yggdrasil/lib/`. An aspect is `advisory` by default; the node `mimir` raises it to `enforced` for every module
except those with a deviation in section 12 (there it is excluded and attached advisory on the module itself, so it
warns). Rules are attached to nodes, not types, so they need no type ratification.

| Aspect | Rule | Why (evidence) | Enforcement |
|---|---|---|---|
| `process/launch-through-platform` | `node:child_process` only in the git runner and `src/platform/process.mjs`; git only through the runner | reviews: push carrying someone's commits, `rebase --autostash` with conflict markers, a killed fetch with its lock, a login prompt read as OFFLINE (rv-001, rv2-001, rv2-021); five places started processes with different limits; Windows (92, 93) needs one place | yg + `test/git-runner.test.mjs` |
| `process/no-shell` | argv, never a command line through a shell | addresses, titles and paths come from people and repos; Windows has no POSIX shell | yg |
| `write/core-owns-repo-changes` | repo changes only by their owner; commit, ref, index, push only by the write core | litter in shared areas and lost work when writing beside a person (rv-001, rv-025, rv2-008) | yg |
| `output/one-envelope` | one JSON envelope; streams and process exit only in the front-end printers | one shape for CLI, MCP and the server | yg |
| `errors/one-registry` | codes only from `CODES` in `src/errors.mjs`, each with a `fix` template | codes invented separately by workers (faza0-cov-014, rv2-028) | yg + `test/errors.test.mjs` |
| `deps/pinned-on-purpose` | runtime dependencies pinned to one exact version and named with why in the rule's `allowed.mjs` | owner ruling: ordinary npm deps allowed; the hook starts a fresh process on every event | yg (on `package.json`) |
| `world/injected-environment` | `process.env`, `process.cwd()` only as parameter defaults; the user's home only through `homeOf(env)` | isolation of ~1380 tests from the real Desk (faza0-cov-013) | yg + test guards |
| `world/injected-clock` | clock and randomness that decide behaviour as a parameter | flaky timing tests (M46, M48) | yg (advisory until the proposal in section 12) |
| `hooks/light-and-fail-open` | the hook passes on its own error and time limit; the hook path imports only light modules statically | hook p95, false refusals (rv-032, rv2-022) | yg (imports) + `test/hooks.test.mjs`, `test/helpers/loaded-modules-hooks.mjs` |
| `address/one-parser` | only `src/address` reads the `mimir://` grammar | aliases translated once one way, a write into the wrong area (rv-010, rv-030) | yg |
| `files/delete-only-own-or-approved` | delete only Mimir's own files or what a person approved | `uninstall` deleting a Desk, `--force` teaching data loss (rv2-026, rv2-015) | yg (list of places with reasons in the rule) |
| `core/no-owner-setup` | the core does not import the owner's setup and does not name his world in texts | owner ruling on guards; Acme in core examples | yg |
| `tests/isolated-world` | a test touches only its own world; the real home only in the guard runners | "they hold mechanisms, not text"; faza0-cov-013 | yg + guard runners (`test/helpers/*-run.mjs`) |
| `repo/self-describing` | no tracked file points outside the repository. Ten forms in `test/helpers/outside-references.mjs`: the section sign; "spec 3.4"; issue/task/ticket/zadanie numbers (not the `--issue` flag); "(#46)"; ruling names (also across a line break); development documents by file name (warstwy.md, spec.md, ...); "the spec" as a document (never a bare `spec`, an identifier); decision/review marks (D8, G36); plan phases ("phase 0", "phase-0", "a later/first/next phase", waves); review finding ids (rv-001, faza0-cov-014). Exceptions: package-lock.json, the forms file, the test, a squash-merge title "(#7)", the Jarl issue ids of the orphan report | owner ruling: the repo describes itself; development docs live outside it | yg + `test/self-describing.test.mjs` |

Rules not made aspects, and why:

- "Scratch files never in the repo": coverage keeps it. `coverage.required: ["/"]` makes every tracked file belong to a
  node, and the mappings cover only known places; a stray `.temp/x` is a `yg check` error.
- "Paths normalised at one boundary": the boundary does not exist yet; it arrives with `src/platform/paths.mjs` (92) and
  then gets an aspect (`paths/one-boundary`).
- "Texts for people in plain language": not checkable by a script without false alarms, and a reviewer model costs; the
  mechanical part (every refusal has a code and a `fix`) is in `errors/one-registry`.
- "No secrets in Mimir": the core has no secrets code today; the manifest rule (`${NAME}` instead of a value) belongs to
  manifest validation (63, 82), not to the graph.

## 9. Mapping and naming rules

- **Product:** each module is a folder `src/<module>/`; its node maps `src/<module>/**`. Files directly in `src/` are
  the kernel. A command: `src/commands/<name-with-dashes>.mjs`. A doctor check: `src/doctor/checks/<name>.mjs`. An agent
  tool adapter: `src/tools/<tool>/`.
- **Tests:** `test/<module-or-feature>.test.mjs`, flat (`write.test.mjs`, `push.test.mjs`, `hooks-places.test.mjs`);
  helpers in `test/helpers/`, data in `test/fixtures/<module>/`. A new subfolder `test/<x>/` needs a node (like the
  search query set of M25).
- **Outside the product:** `scripts/**`, `.devcontainer/**`, `.github/**` (tooling), `*.json` and `.git*` at the root
  (configuration), `README.md` (and a licence file), `plugin/**` (the Claude Code plugin template), `portal/**`
  (portal pages), `vendor/**` (third-party code, temporary).
- **Excluded from coverage:** `.grain/`, `.jarl/`, `.worktrees/` (local, untracked) and `.yggdrasil/` (the graph).
- **No other documents in the repository.** Development documents live outside the repository; in the family they are in Althing, in the research folder on Mimir and Gard.

## 10. Runtime dependencies

None today. The product uses Node built-ins (including `node:sqlite`) and code copied into `vendor/` (yaml, Runes),
which an issue of its own replaces with ordinary npm dependencies. A dependency added to `dependencies` needs an exact
version in `package.json` and a line in `.yggdrasil/aspects/deps/pinned-on-purpose/allowed.mjs` (name -> why it is
needed and why Node alone does not do the job); `deps/pinned-on-purpose` refuses it otherwise. Development tools go to
`devDependencies` (today: `@chrisdudek/yg`, the graph and its rules) and never ship.

## 11. Moved files

All moves are behaviour-preserving (imports and comments follow; no command, JSON field or error code changes).

| Old | New | Why |
|---|---|---|
| `src/table.mjs` | `src/cli/table.mjs` | the command table is the contract |
| `src/commands/index.mjs` | `src/cli/commands.mjs` | the loader of the command files is the contract; nothing imports a command |
| `src/cli/runtime.mjs` | `src/platform/runtime.mjs` | runtime probes are the OS, not the contract (search no longer imports cli) |
| `src/install/atomic.mjs` | `src/platform/atomic.mjs` | atomic writes are the OS (session, write, places, worktree, skills no longer import the installer); the registry's own copy of writeAtomic removed |
| `src/write/program.mjs` | `src/platform/process.mjs` (with `runProgramSync`, `startProgram`) | one launcher for every program but git |
| (new) | `src/self.mjs` | package root, `bin/mimir.mjs` path and version, read in one place instead of four |
| (new) | `src/text/shell-word.mjs` | one `shellWord` for install, worktree, cleanup and doctor (worktree no longer imports the installer) |
| `src/claude-config.mjs` | `src/tools/claude-code/config.mjs` | the adapter of the one agent tool |
| `src/files.mjs` | `src/registry/files.mjs` | the kernel imported the registry; the files of an area are the registry's |
| `src/worktree/store.mjs` | `src/registry/worktrees.mjs` | the record of Mimir's worktrees is what the computer has; address no longer depends on worktree |
| `src/write/queue-cache.mjs` | `src/context/queue-cache.mjs` | the reader of the waiting numbers serves context and the header; context no longer depends on write |
| `src/manifest/check.mjs` | `src/check/run.mjs` (+ `src/manifest/problems.mjs` for `shown`, `problemEntries`) | `mimir check` reads the registry and topics, so it is application; the manifest no longer depends on registry or topic |
| `plainBlobId` in `src/write/git.mjs` | `src/git/blob-id.mjs` (exported by `src/git/index.mjs`, re-exported by `src/write/git.mjs`) | browse no longer depends on the write core |
| `FALLBACK_NAME`, `FALLBACK_REASON` in `src/places/places.mjs` | `src/config.mjs` | the manifest no longer depends on places |
| four copies of the home-folder expression | `homeOf(env)` in `src/config.mjs` | one place turns an environment into a home folder |
| a copy of the address test in worktree close and repos | `isAddressText` in `src/address/parse.mjs` | one reader of the grammar |
| `docs/architektura.md` | this file, outside the repository | the repository holds no documents but the README |

## 12. Deviations and proposed issues

Places where the code breaks the graph and that could not be fixed without changing behaviour (or without touching
files M101 was not allowed to touch). The rule they break is excluded for their node on `model/mimir/yg-node.yaml`
and attached advisory on the node itself (a warning in `yg check`), enforced everywhere else; when the proposal is done
the exception goes. Severity: high (can lose work or data, or is a security hole), medium (breaks a boundary that the
next issues build on), low (order).

| No. | Where | What | Severity | Proposed issue (title; one testable acceptance line) |
|---|---|---|---|---|
| D1 | `src/serve/open.mjs:10` | on Windows the browser starts through `cmd /c start "" <url>`: a shell reads the URL (`process/no-shell`) | medium | "serve --open on Windows without cmd"; a test with `platform: 'win32'` shows an argv without `cmd`/`powershell`, the URL one element of it |
| D2 | `src/context/chain.mjs:16` | `areaIdOfAddress` reads `mimir://` with its own regex (`address/one-parser`); context lies below address, so it cannot call the parser without moving the grammar lower | medium | "The address grammar below context": `parse.mjs` as a module without dependencies, used by chain.mjs; the chain of a fixture with anchored and kinded addresses in `parent`/`overlays`/`reads` is unchanged and `src/context` has no regex on `mimir://` |
| D3 | `src/worktree/close.mjs:74` (and the branch moves around it) | the worktree module creates `refs/mimir/closed/*` with `update-ref` and moves branches (`write/core-owns-repo-changes`) | medium | existing M53 (deleteMergedBranch in `src/git`) |
| D4 | `src/hooks/handle.mjs`, `src/hooks/messages.mjs` import `scripts`, `disk`, `host-run`, `cleanup` | the core knows the owner's setup (`core/no-owner-setup`) | medium | existing M130 |
| D5 | `src/manifest/validate.mjs` (examples), `src/mcp/instructions.mjs:11`, `src/commands/resolve.mjs:4`, `src/browse/scope.mjs:35` | texts for agents and people use the owner's client names (`acme/app`) as examples (`core/no-owner-setup`); changing them changes output | low | "Neutral examples in product texts (acme/app)"; `core/no-owner-setup` passes on every node, tests expect the new examples |
| D6 | `src/write/beside.mjs`, `src/write/worktree.mjs`, `src/write/intent.mjs`, `src/write/push.mjs`, `src/write/branches.mjs`, `src/registry/registry.mjs`, `src/lock/repo.mjs`, `src/search/indexer.mjs`, `src/search/run.mjs`, `src/worktree/doctor.mjs`, `src/worktree/open.mjs`, `src/doctor/checks/sessions.mjs`, `src/hooks/entry.mjs`, `src/browse/regex.mjs` | the clock read directly (`world/injected-clock`, advisory everywhere; 28 places) | low | "Clock as a parameter in the write core, locks, search and worktrees"; `world/injected-clock` enforced with no exceptions, and the lock test takes over a stale lock without waiting for real time |
| D7 | `src/registry/links.mjs`, `src/registry/create.mjs`, `src/registry/init.mjs` | manifests written directly, without a commit and provenance (the write core should be the only way into an area repo) | medium | "attach, area create and init write the manifest through the write core" (with 119); after `repo attach` the Desk repo has a commit with a `Mimir-Why` trailer and a clean `git status` |
| D8 | `src/registry/registry.mjs` (`withLock`) beside `src/lock/lock.mjs` | two lock implementations (O_EXCL with mtime expiry, and the lock with heartbeat and takeover) | low | "One lock": registry, config and worktrees use `src/lock`; a test of 8 processes on `registry.json` loses no entry |
| D9 | `src/write/run.mjs` imports `src/write/push.mjs` (`settleConflicts`) | the commit core depends on publishing (push, queue, PR), so `src/write` cannot be split into two modules with one direction today | low | "Split src/write into commit and publish": `src/write` (commit beside, intent, CAS) and `src/publish` (push, queue, session branch, PR), relation only publish -> write; afterwards no file of `src/write` imports `src/publish` |
| D10 | `src/hooks/skill-links.mjs` | the skill-link logic lives in the hooks, and `src/skills/sync.mjs` and doctor use it (skills depends on hooks) | low | with 130 or alone: "Skill links in src/skills"; `src/skills` does not import `src/hooks` |
| D11 | `src/hooks/background.mjs`, `src/search/run.mjs` | two background starts of `mimir index` with different options (one drops the hook deadline, has `windowsHide` and an error listener, the other not); both now go through `startProgram` | low | "One background start of Mimir": `src/platform/process.mjs` gives `startMimir(args)`; both call it, a test checks the options |
| D12 | `src/registry/git.mjs` | a module that only re-exports the git runner (a test holds that it is the same object) | low | "No second door to the git runner": imports go to `src/git/index.mjs`, the file and its test go |
| D13 | `src/hooks/protocol.mjs` | Claude Code event and tool names in the hook core | low | existing M86 (adapters in `src/tools/<tool>/`) |
| D14 | `src/hooks/blocks.mjs` | kernel-type data (block names and switches) in the folder of an integration; mapped by its own node `mimir/integration/hooks/switches` of kernel type so the manifest may read it | low | with 130: "Hook switches beside the manifest schema": the file moves to `src/manifest/hook-switches.mjs` (or the kernel), the node and the extra parent of the kernel type go |
| D15 | `src/browse/content.mjs` | a third shell-word quoting (with a Unicode set) beside `src/text/shell-word.mjs`; different output, so not merged | low | "One shell-word quoting": `src/text/shell-word.mjs` takes an option for Unicode letters; content and install quote through it; their outputs are unchanged in tests |
| D16 | `src/address/cli.mjs:11`, `src/worktree/repos.mjs:17` | two `expandHome` with a `'~'` fallback, besides `homeOf` (which falls back to the system's home) | low | "One expansion of ~": `src/config.mjs` exports `expandHome(text, env)`; both use it; a test with no HOME and no USERPROFILE keeps today's output |
| D17 | `src/topic/find.mjs:16`, `src/topic/schema.mjs:136` | topics tell an address from a slug by "contains a colon" and cut `mimir://` off a repo address themselves (`address/one-parser`) | low | "Topics read addresses through src/address": `isAddressText` (or a sibling that keeps the colon rule) and `parseAddress` used; the topic tests pass unchanged and `address/one-parser` is enforced on both topic nodes |
| D18 | `src/topic/branches.mjs:28`, `src/topic/start.mjs:69`, `src/topic/schema.mjs:95,102,106,132`, `src/commands/topic-start.mjs:4` | the topics brought more owner client names into examples (`acme/app`) | low | part of D5 |
| D19 | `src/topic/{names,schema,load,store,line,state,current}.mjs`, `src/address/parse.mjs`, `src/context/context.mjs` | files whose dependencies differ from their folder are child nodes that map single files | low | "Records of topics, the address grammar and the context answer in folders of their own": `src/topic/records/`, `src/address/grammar/`, `src/context/answer/` (or equivalent); the child nodes map folders, no node maps a single file but the guards |
| D20 | `test/dx.test.mjs:555` | the race test "two suites that start at the same instant" failed once under load in a full run, and its failure left its two child dx processes waiting on a hold file, so `npm test` hung until stopped (it passes alone: 30/30) | medium | "A failing dx race test does not hang the suite": the test writes the hold file in a `finally`/`t.after` and kills its children; a forced assertion failure in it ends the file within its timeout |

## 13. Impact on the queue

Paths are after the moves of section 11. Every issue that creates a new folder in `src/` or `test/` adds a node (or a
mapping) under `.yggdrasil/model/` in the same commit, or `yg check` and `test/graph-coverage.test.mjs` report unmapped
files; every new import from another module is a relation in `yg-node.yaml`. Every issue keeps its code, comments, test
titles and fixtures free of issue numbers, spec sections, ruling names and review marks (`test/self-describing.test.mjs`);
briefs should say so, since many existing issue bodies ask for comments like "(spec §5.6)".

| Issue | What changes |
|---|---|
| 31, 34, 56, 91, 94 (merged) | nothing; their files are in the graph (31: `src/write/**`; 34: node `mimir/domain/topic`; 56: the guards in `owner-guards`; 91: `.github/**` in `repo/tooling`; 94: the package test also checks that `.yggdrasil` never ships) |
| 25 | `Files`: the query set as `test/search-eval/**` needs a node `tests/search-eval` (type `test`); add `.yggdrasil/model/tests/search-eval` to Files |
| 32 | `src/write/pack.mjs` as planned; in `src/hooks` only the path journal and starting `mimir` in the background (the hook does not import `src/write`, aspect `hooks/light-and-fail-open`) |
| 40, 54 | no path changes; new deletion of temporary files (`.mimir-tmp-*`) fits `src/write/` in the list of `files/delete-only-own-or-approved` |
| 41 | `branchState` is already in `src/worktree/branch-state.mjs`; integrate uses it from there (write -> worktree is allowed; the reverse may not be added) |
| 42 | `src/sync/` is a new domain module: add node `mimir/domain/sync` with relations to write, worktree, registry, git |
| 53 | fits the graph: afterwards `src/worktree/close.mjs` runs neither `update-ref` nor `branch -D`; `write/core-owns-repo-changes` becomes enforced on the worktree node (remove the exception in `model/mimir/yg-node.yaml`) |
| 57 | `src/manifest/layers.mjs` -> `src/context/layers.mjs`: the order of layers depends on the area chain, which the manifest does not know (manifest lies below registry and context); `src/manifest/local.mjs` (reading `area.local.yaml`) stays in manifest |
| 58, 106 | `src/registry/repo-url.mjs` and `ssh-host.mjs` are the repo identity (planned `src/repo-id/`); the clone location function in `src/registry/clone-dir.mjs` as planned |
| 60, 103 | no path changes (`src/registry/`); manifest writes through the write core |
| 62 | `src/hooks/area.mjs` (the area hook chain); the mechanism through which M130 takes the guards out |
| 65 | `outputs` as a key in the key registry (102); deleting reproducible outputs only in `src/cleanup/` |
| 66, 67 | `src/jobs/` as a new domain module with a node; the job process through `src/platform/process.mjs`, the lock through `src/lock/`, the result through the write core |
| 68, 69 | deferred; places in section 6 |
| 71, 109 | provider adapters in `src/search/providers/` behind one interface; network only there |
| 73 | `src/extensions/` (loader, kind registry, `api.mjs`); add node `mimir/domain/extensions` and a type for extension code (relation only to `api.mjs`) |
| 74, 75, 110, 121 | `owner-setup/...` -> `extensions/<name>/` as for `extensions/owner-guards`; nodes of type `owner-setup` outside `mimir/` |
| 85, 111, 112 | probes `test/probes/*.probe.mjs` need a node `tests/probes` (type `test`); data `docs/tools-matrix/*.json` cannot live in `docs/` any more (the repo holds no documents): put the matrix data under `test/fixtures/tools-matrix/` or in the handoff folder |
| 86-89 | adapters in `src/tools/<tool>/` (hook protocol, plugin generator, instructions), not in `src/hooks` or `src/install`; `src/hooks/protocol.mjs` loses the Claude Code event names to `src/tools/claude-code/hook-protocol.mjs` |
| 92 | one atomic write with retry in `src/platform/atomic.mjs` (not in `src/write`): used by the write core, sessions, the registry and the installer; `Files`: `src/platform/atomic.mjs` instead of `src/install/atomic.mjs` |
| 93, 116 | shim and PATH in `src/install/`; starting programs without a shell in `src/platform/process.mjs` (`.cmd` -> real program there); opening the browser on Windows without `cmd /c` (deviation D1) |
| 98 | no change; the package version comes from `src/self.mjs` (`mimirVersion`) |
| 102 | `src/errors/codes/` is mapped by the kernel type (`src/errors/**`) — add it to the `mimir/kernel` node mapping; `src/manifest/keys/` is inside `src/manifest/**` |
| 104 | the refusal log is a core mechanism (`src/hooks/refusal-log.mjs`), but the blocks it shows today are the owner's guards; after 130 it records refusals of area hooks |
| 105 | the rules engine as a pure module `src/rules/` (matching, `set`, conflicts, `why`; no I/O; depends only on kernel and manifest), not `src/manifest/rules.mjs`; `settable.mjs` and `secrets.mjs` stay in manifest (schema); layers collected in `src/context/layers.mjs` (57). Add node `mimir/domain/rules` |
| 107, 125 | the check command now lives in `src/check/` (`run.mjs`; later `portable.mjs`, `portable-clean.mjs`); a workflow template beside its module: `src/check/templates/` instead of `templates/` |
| 108 | `src/mcp/` is Mimir's MCP server; writing area.mcp into the tool's config belongs to the tool adapter: `src/tools/claude-code/area-mcp.mjs`, not `src/mcp/area-config.mjs` |
| 114 | `src/fs/paths.mjs` -> `src/platform/paths.mjs`; `src/files.mjs` is now `src/registry/files.mjs` |
| 117 | the transcript parser is a test tool, not product: `test/helpers/agent-metrics.mjs` and `scripts/agent-scenarios.mjs`, not `src/agent-metrics/` |
| 119 | fits (`src/manifest/edit.mjs` pure, writing through the write core) |
| 123 | into `extensions/owner-guards` (per the notes, against its Files field) |
| 124 | the workflow template in `src/search/templates/` instead of `templates/` (otherwise a new node and an entry in the package `files`) |
| 128 | removing `vendor/` removes the `vendor` node and the relations to it; each new dependency gets an exact version and a line in `.yggdrasil/aspects/deps/pinned-on-purpose/allowed.mjs`; the test "no source file imports a package" is replaced by a test of pinned versions |
| 129 | `src/provenance/` as a domain module; notes through the git runner, so `write/core-owns-repo-changes` gets the owner `src/provenance/` (command `notes`) |
| 130 | fits: after the move `owner-guards` becomes `extensions/owner-guards` (outside `mimir/`), and `core/no-owner-setup` on the hooks becomes enforced |
| 131 | no path changes |
| all issues with "docs/..." in Files | the repository holds no documents but the README: development notes go to the handoff folder |

## 14. Working with the graph

- **Before editing a file:** `scripts/dx run -- npx yg context --file <path>`; read the `check.mjs` of the rules listed
  under `read:`.
- **A new import from another module:** add `- { target: <node>, type: uses }` to your node's `yg-node.yaml`. If the
  type does not allow it, that is an architecture decision (a question to the owner), not something to work around.
- **A new module:** a folder `src/<module>/` and a node `.yggdrasil/model/mimir/<layer>/<module>/yg-node.yaml` with the
  layer's type, a description, the mapping `src/<module>/**` and relations.
- **Before handing in:** `scripts/dx run -- npx yg check --approve --only-deterministic` exits 0.
- **Node logs:** the graph needs no `yg log` entries (`log_required` off).
- **CI:** add a step `npx yg check --approve --only-deterministic` (in the container or on a Linux runner) with the yg
  version pinned by the lock file. It is free and needs no key. A `yg:check` script in `package.json` would be the
  natural entry, but M101 was not allowed to change `package.json` beyond the devDependency.
- **Git hook:** no hooks are added to the repo. Whoever wants one adds to their local `.git/hooks/pre-commit` a call of
  `scripts/dx run -- npx yg check --approve --only-deterministic`. Note: `yg init` and `yg adopt` install merge drivers
  and a `post-merge` hook in `.git/` with the path of the CLI inside the container, which does not exist on the host; so
  the graph in this repo was written by hand, without those commands.
