# Mimir in release 6.2.0: the state it pauses in, and the plan to resume

Written 2026-10-29, when the owner paused Mimir so that Gard is built first (ruling `gard-first-mimir-paused`). The design is `research/2026-10-29-mimir-and-gard/mimir-specification.md`, the split is `research/2026-10-29-mimir-and-gard/README.md` of the same folder. Every Mimir issue of this loop waits on 426, which the owner settles.

## State on 2026-10-29

- **Repository**: `krzysztofdudek/Mimir`, public and empty on GitHub. All work is local, on the first build branch `faza-0` at `10257cd`, never pushed. The branch becomes `release/1.0.0` (issue 427).
- **Check**: the last full run, in Mimir's dev container through `scripts/dx run -- npm test`, passed 2598 of 2601 tests with 3 skipped and none failing.
- **Package**: `@chrisdudek/mimir`, `1.0.0-alpha.1`, prepared in full (pack, a tarball install test, a dry run of publish) and never published; the licence is MIT.
- **Use**: the owner runs it live through a development install that links to the checkout, for Claude Code on macOS.
- **History**: files and some commit messages of `faza-0` name companies and products from the owner's work; they are removed from the whole history before the first push (issue 459).

## What is built

Grouped by subject; M-numbers are the issues of Mimir's first loop, listed below.

- **Foundation**: one command table on Runes, a JSON envelope, a registry of error codes and manifest keys where a new code or key is a new file (M1, M2, M102); `yaml` and Runes as ordinary dependencies (M128); an architecture graph in Yggdrasil with every file mapped (M101, M154); an injected clock (M159); CI on macOS, Ubuntu, Windows and musl (M91).
- **Areas and the Desk**: `init` with no questions and a first commit (M3, M161); attaching areas, repos and directories where they lie; the scan of nested areas, the cache, id conflicts and `area create` (M14); `repos[].dir` and the managed block of a parent's `.gitignore` (M106, M103); cloning and `sync` of what is missing (M58); the lifecycle of areas: rename, move, remove, detach, migrate (M60, M162, M172); aliases (M59); four layers of configuration with `area.local.yaml` and `show --why` (M57); the rules engine with `RULE_CONFLICT` and one shared secret check (M105, M168); a backup copy of the Desk reported by `doctor` and restored by `init --from` (M131); versions across computers with `VERSION_BEHIND` (M141).
- **Addresses and browsing**: the `mimir://` grammar, short names and file membership (M5); `read`, `ls`, `show`, `grep`, `find`, `doctor` (M6, M19); `follow` and `log` (M61); links readable without Mimir (M139); reading resources and `check --portable` statically (M107).
- **Writing**: the git runner with an allow list (M30, M47); the commit built beside the checkout (M39, M54); `move`, `delete` and edge cases (M40); push, the queue, session and conflict branches, pull requests (M31, M99, M175); `integrate` (M41); `sync` (M42); packing an agent's changes (M32); `undo` (M137); consents and the hook on writes between areas (M44).
- **Sessions, topics and worktrees**: session ids and files (M38); topics from start to finish with one question (M34, M35, M122, M152); reads and writes in a topic's session (M36, M43); worktrees at a fixed place with orphans in `doctor` (M33, M53, M120); the pair of branches of code and shell (M64).
- **Search**: incremental keyword search on SQLite FTS5 with Polish inflection (M7, M72); a benchmark and a query set on real notes (M25, M70, M179); semantic and hybrid search with Ollama, the auto mode and exact hits promoted (M71, M109, M181, M183); filters `--since`, `--until`, `--kind`, `--level` (M118).
- **MCP and the plugin**: MCP over stdio with five tools, context, read, search, write and workspace (M8, M37, M127, M157); MCP servers of an area generated into the tool's configuration with a prefix (M108); the Claude Code plugin and its install (M15, M98, M116, M143, M170); skills of the Desk and of every area in the chain (M10, M18, M63).
- **Hooks**: the session header and the dispatcher (M9, M24, M153); hooks of areas, fail-open with a time limit (M62); the rules of order (the `.temp` block, the ban on throwaway scripts, the guard of the disk, host-run), moved out of the core into a module of the owner's (M13, M23, M28, M45, M55, M56, M100, M130, M171); Windows rules for hooks and scripts (M93); the git gate with stubs, chain mode, a snapshot and `doctor` (M163 to M166, M178, M180).
- **Jobs and extensions**: the runner of area jobs with state, results, logs and the MCP tool `action` (M66, M67); the skeleton of extensions (M73); the session archive and the kind `session` with `#m=` addresses (M74, M75, M110).
- **Products and cleanup**: products per topic, recipes, originals never deleted automatically (M65); the cleanup report with removal on an explicit command (M29, M156).
- **Windows**: atomic writes with retries, the path layer, case collisions, line endings, the minimal git version (M92, M114, M16).

## What moves to Gard

Nothing leaves Mimir before Gard can take it; then 433 removes Mimir's copies.

| In Mimir | Goes to |
|---|---|
| the dev container and `scripts/dx` (M12, M20, M22, M52, M155) | 368, 387 |
| the area's `exec` and its use (M27) | 387, 430 |
| shells: `source/`, the managed block, the hook against a team's devcontainer (M80, M103) | 376, 400, 429 |
| the rules of order (M9, M13, M23, M28, M45, M55, M56, M93, M100, M130, M171) | 394 to 401 |
| the pair of branches (M64) | 412 |
| the tools container and the pull-request command (M82, M177) | 407, 408 |
| cleanup of Docker and scratchpads (M29, M156) | 414, 415 |
| the git gate's engine (M163 to M166, M178, M180) | 402 to 406 |
| worktrees in a container (M120) | 386 |

## The open work, renumbered

| M | Now | Subject |
|---|---|---|
| M184 | 434 | vectors stop for good on HTTP 413 |
| M182 | 435 | search finds messages of extension kinds |
| M21 | 436 | attaching through MCP within allowed roots |
| M119 | 437 | resource verbs that write the manifest |
| M121 | 438, and 407 for host or container | MCP servers of an area |
| M124 | 439 | a ready index of an area |
| M125 | 440 | `check --portable --clean` |
| M76 | 441 | the diary, part one |
| M77 | 442 | the diary, part two |
| M78 | 445 | an ingest job with a replaceable fetcher |
| M95 | 444 | tools to plan taking an older repository apart |
| M85, M111, M112 | 446, 447, 448 | probes of the agent tools |
| M113 | 449 | the matrix table |
| M86 | 450 | hook protocol adapters |
| M87, M88, M89 | 451, 452, 453 | plugins for Copilot, Codex, Cursor |
| M90 | 454 | the degraded mode |
| M117 | 455 | the harness of agent scenarios |
| M135 | 456 | the threat model |
| M97 | 457 | the README |
| M96 | 428 | the specification after the split |
| M115 | 458 | the specification's closing part |
| M160 | 459 | the history without private names |
| M126 | 460 | a field trial with a log of refusals |
| M79 | 384 | the layered container (Gard) |
| M81 | 413 | Yggdrasil in a shell (Gard) |
| M123 | 398, 399 | the scratchpad limit and stray writes (Gard) |

New for Mimir in this loop: 426 (resume), 427 (the release branch and the archive of the first loop), 429 to 433 (Mimir with Gard), 443 (one command for every job), 461 (an independent review of the code that deletes data), 462 (1.0.0 prepared).

**Not carried over.** Deferred in the first loop: the portal and its views (M51, M83, M84; the local server was removed, M173), MCP over HTTP (M68) and the thin client of hooks in a container (M69), until a real user needs them. Dropped there by the owner or under the rule of proportionate protection: a ledger of code provenance in git notes (M129), a secret scanner on writes (M133), confidentiality domains in search (M134), a log of operations (M136), a conflicts command (M138), a budget of the diary (M140), the author of a topic (M142), visibility derived from a remote (M144), identity keys in data (M145), a write guard on Mimir's own files (M146), and five proposals of a review (M147 to M151). The log of refusals (M104) comes back as Gard's 463.

## Resuming

1. 426 on the owner's word, then 427: `release/1.0.0` at the tip of the first build branch, its check green, the first loop archived privately.
2. 428: the specification brought to the split and to what is built; every planned item without an issue gets one.
3. 434 first among the rest, because search by meaning stays at keyword search until vectors can be built.
4. Once Gard's run, worktrees and gate are merged: 429 to 432, then 433 when the owner's setup runs Gard.
5. The rest by priority; the probes and the agent tools (446 to 455) only after the owner allows real accounts.
6. Before anything is pushed: 459. Before publication: 461, 456, 457, then 462 and the release issue on the owner's word.
