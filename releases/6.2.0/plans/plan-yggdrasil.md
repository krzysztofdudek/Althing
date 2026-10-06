# Yggdrasil 6.1.1: fix plan for loop release-6.1.1

This was a read-only planning pass over `../../../Yggdrasil` on `release/6.1.1`. That branch equals `main` and `2493aa16d`, and the working tree is clean. The loop is `releases/6.2.0/.jarl`. The decisions in force are `patch-per-repo`, `fixes-on-word` and `fixes-start`: each repository fixes on its own local branch, nothing is pushed, tagged or released, and design questions go to the owner as questions.

Scope: the 55 open issues whose **Repo:** ends in `/Yggdrasil`. They are 002, 004–008, 019–034, 063–072 and 076–098. The 13 Runes issues (009–018, 073–075) are covered here only as links (section 4) and as one follow-up package for the consumer side (section 1, "after the 55"). `plan-runes.md`, next to this file, covers the Runes side.

## 0. Package overview, in order

| # | Branch | Issues | Prio | Size | Waits for |
|---|---|---|---|---|---|
| 1 | `jarl/004-walk-mapping` | 004, 068, 022, 019, 078, 081 | P1 | L | none |
| 2 | `jarl/023-merge-hooks-lock` | 023, 024, 026, 027, 072, 067 | P1 | L | none |
| 3 | `jarl/002-adopt` | 034, 084, 002 | P1 | M | none |
| 4 | `jarl/065-relations` | 065, 098 | P1 | M | none (D3 for 065) |
| 5 | `jarl/063-local-writes` | 063, 070, 091 | P1 | M | none |
| 6 | `jarl/020-config-errors` | 020, 064, 076, 080, 090 | P3 (unblocks 8 and 030) | M | none |
| 7 | `jarl/005-progressive-scope` | 005, 006, 007, 071, 008 | P2 | L | none (D2 for 008) |
| 8 | `jarl/032-check-report` | 032, 095, 096, 077 | P2 | M–L | 077 only: 7 (if it edits `io/aspect-parser.ts`) |
| 9 | `jarl/069-reviewer-subjects` | 069, 097 | P2 | M | none |
| 10 | `jarl/031-portal` | 031, 033, 089 | P2 | M | none |
| 11 | `jarl/028-packages` | 028, 029, 085, 086, 094, 030 | P2 | L | 030 only: 6 (`core/graph-loader.ts`) |
| 12 | `jarl/021-navigation` | 021, 093, 088, 025 | P2 | L | 2 (`cli/log.ts`, cli-reference §init) and 6 (`core/validator.ts`, `core/graph-loader.ts`, `cli/init.ts`) |
| 13 | `jarl/066-nested-roots` | 066, 083 | P3 | M | 1 (`io/repo-scanner.ts`, `core/checks/mapping.ts`, `io/paths.ts`) and 3 (`cli/adopt-transaction.ts`) |
| 14 | `jarl/079-arch-relations-null` | 079 | P3 | S | none |
| 15 | `jarl/082-claude-md-symlink` | 082 | P3 | S | none |
| 16 | `jarl/087-advise-suppressed` | 087 | P3 | S | none |
| 17 | `jarl/092-incident-header` | 092 | P3 | S | none |
| after the 55 | `jarl/runes-101-pickup` | Yggdrasil half of Runes 009–018, 073–075 | — | M | 1, 4, Runes 1.0.1 published |
| last | version bump commit on `release/6.1.1` | — | — | S | Krzysztof's word |

The table has 55 issue slots, and each issue appears exactly once.

**Order rationale.** The five P1 packages come first. The order among them: 1 unblocks 13, gives the `runes-101-pickup` its ignore predicate, and is the reviewer-leak fix. 2 unblocks 12. 3 is what Grain 6.1.1's `propose` preview stands on. 4 unblocks the Runes pickup. 5 has no dependents. 6 comes next even though it is all P3, because it unblocks 12 (P2) and 030. 7 unblocks 077 in 8. The singletons (14–17) conflict with nothing and fill idle slots at any time.

**Concurrency.** The container has 14 CPUs and 29 GB of RAM, and every commit runs the full `repo-check.sh` (vitest with coverage, plus Playwright and Chromium). Run 3 workers at a time, or 4 at most. Wave A: 1, 2, 3, 4. Wave B as slots free up: 5, 6, 7, then 8, 9, 10, 11. Wave C: 12 and 13 once their predecessors are merged. Singletons go wherever a slot is idle.

### Shared files: the rule and its stated exceptions

Source files under `source/cli/src/` and tests are owned by exactly one package. The "Waits for" column chains every case where two packages need the same source file. The exceptions below are files every package must touch, or files edited in disjoint sections. The merger handles them as described:

- **`CHANGELOG.md`** has `merge=union` in `.gitattributes`, so parallel additions under `## [Unreleased]` merge cleanly. Before cutting worker branches, the director should add the empty subsection headings once on `release/6.1.1` (`### Fixed`, `### Security`, plus `### Before you upgrade` if D3 or D1 lands as blocking). Workers then add bullets only. Two branches that each add the same heading produce duplicate headings under union merge.
- **Graph metadata:** `.yggdrasil/model/**/log.md`, `.yggdrasil/yg-lock.logs.json`, `.yggdrasil/yg-lock.nondeterministic.json` and `.yggdrasil/yg-events.llm.jsonl`. Every package writes these through `yg log add` and `yg check --approve`. The yg-log and yg-lock merge drivers are **not configured** in this clone, on the host or in the container (`git config --get-regexp '^merge\.'` is empty). A conflict is therefore resolved by hand, the way the 6.1.0 merger did it: `log.md` as a chronological union of both sides, the lock files taken whole from one side, then `node source/cli/dist/bin.js check --approve` re-fills them. `yg-events.llm.jsonl` is `merge=union`.
- **The code registry and generated tables:** `model/issue-code.ts`, `utils/issue-code-registry.ts`, `utils/check-codes.ts`, and the code tables rendered into `docs/cli-reference.md` and the knowledge cli-reference topic. Packages that add a code: 1 (022 `file-mapping-symlink`, possibly one for 019/081), 11 (possibly 028/029) and 13 (066). Each adds its entry beside its own family: Check codes, Package codes or Marketplace codes. After a merge, the merger re-runs `npm run codes:update` in `source/cli`. Package 10 (089) must reuse the existing `command-error` and `usage` codes and add none.
- **Large docs pages, by section:**
  - `docs/the-lock.md`: 1 owns §52, 2 owns §139/§151/§179, 5 owns the §97–§109 paragraph.
  - `docs/cli-reference.md`: 1 owns the codes table, 2 owns §1073, §2355, §2514 and §2524, 3 owns the `yg adopt` section, 12 owns the context/impact `--file` text. 12 is already chained after 2 for §2355.
  - `docs/configuration.md`: 1 owns §306/§325, 6 owns §20 and §39–41, 5 owns the `debug` key.
  - `docs/progressive-mode.md`: 7 owns the state table row, 10 owns a note about the portal.
  - `docs/family-contracts.md`: 8, 11 and 16 may each append a correction paragraph to the corrections list after line 88.
  - `docs/relations-flows-ports.md`: 4 owns §67 and §111, and the Runes pickup owns the rest. The pickup is chained after 4.

  Two packages never edit the same paragraph, so git's 3-way merge stays clean.

---

## 1. Packages

### Package 1 · `jarl/004-walk-mapping` · 004, 068, 022, 019, 078, 081 · P1 · L

**Files (owned):** `io/repo-scanner.ts`, `utils/git-introspect.ts`, `io/hash.ts`, `core/checks/mapping.ts`, `io/graph-fs.ts`, `io/node-parser.ts`, `utils/mapping-path.ts`, `io/paths.ts` (only if 019 needs it). `io/artifact-reader.ts` needs no edit, because `symlinkOnPath` is already exported at :323. Also the new-code registry entries, `docs/nodes.md`, `docs/the-lock.md` §52 and `docs/configuration.md` §306/§325. Tests: unit `tests/unit/io/repo-scanner*.test.ts` and `hash*`; new e2e files such as `cli-ignore-sources.test.ts` and `cli-mapping-symlink.test.ts`.

**What this package fixes.** It decides which files a walk and a mapping yield, and what the diagnostics about them say:

- **004 and 068 (one mechanism; 068 is part C of the same finding).** Every ignore stack starts in `loadRootGitignoreStack(projectRoot)` (:52) and in `gitignoreStackFor` (:122). `gitignoreStackFor` returns `[]` when `dir === projectRoot`, so the repo walk at :313 and `hash.ts` both start from there. Add a run-cached "base" layer under every stack, made of two parts:
  - **Committed and deterministic:** every `.gitignore` from `git rev-parse --show-toplevel` down to `projectRoot` (exclusive), each entry with its own `dir`. This is 068.
  - **Per-machine:** `$GIT_COMMON_DIR/info/exclude` and `git config --path core.excludesFile`, which defaults to `$XDG_CONFIG_HOME/git/ignore`. This is 004. These sources must drop **only untracked** files. A tracked file that a developer's global `*.log` happens to match must stay a subject on every machine, otherwise verdict hashes turn machine-dependent (the reverse of the bug). The cleanest way is the existing probe `listIgnoredUntrackedPaths` (`git-introspect.ts:760`; `git ls-files --others --ignored --exclude-standard --directory`). Run it once per run from the toplevel, filter it to `projectRoot`, and test each walked path and directory prefix against the resulting set. Outside git it is a no-op.

  Then make `gitignoreStackFor(projectRoot, projectRoot)` return the base layer instead of `[]`. `hash.ts` (:139, :194, :240), `artifact-reader.ts` (:264), the coverage scan and `isFileGitignored` all inherit the fix without edits. Red→green: an e2e with an isolated `GIT_CONFIG_GLOBAL` and `XDG_CONFIG_HOME` covering global `.env`, `info/exclude` `notes.txt`, global `*~` beside a rule's `content.md`, and a graph in `packages/app` with `dist/`, `node_modules/` and `.env` ignored only at the git root. Assert that `yg context` does not list them, that the reviewer prompt (`aspect-test --dry-run`) does not contain them, that a fresh-clone `check --no-approve` passes, and that the log fingerprint is stable. Docs: nodes.md:67/71 and the-lock.md:52 say "what git ignores".
- **022.** In `expandMappingPaths` (`hash.ts:233-247`), refuse to follow symlinks. Run every non-glob entry and every glob base through `symlinkOnPath(root, rel)` (lstat on each segment) before `stat`. In `walkDirectoryFiles`, never descend into a symlinked base: it already skips symlinked children because `isFile()` and `isDirectory()` are false for a link. Add a structural finding `file-mapping-symlink` (error) in `core/checks/mapping.ts`, and add it to `APPROVE_GATING_CODES` so it stops `--approve` before any fill, like `aspect-reference-symlink`. `checkFileMappingGitignored` (`mapping.ts:45-99`) must lstat (`graph-fs.ts` gains an `lstatPath`), so a symlink is no longer blamed on `.gitignore`. Red→green: an e2e with a local capture server playing an openai-compatible reviewer and four shapes (file link, directory link, `shared/**`, `shared/secret.env`). Before the fix the out-of-repo bytes are in the request body; after it they are not, and a single named error appears.
- **019.** The parser lets `/`, `//`, `./` and `.` through. The recommended fix (D1, option a) refuses all four in `validateRelativePath` (`node-parser.ts:265`), checking the normalized form through `normalizeMappingPath`. The message names the entry and points at listing directories, or at `**` with its documented `.yggdrasil` caveat. With that in place, `normalizeMappingPaths` and `architecture.ts` never see an empty entry, so `architecture.ts` stays untouched (it is package 6's file). Red→green: for each spelling, a fresh project where an enforced rule refuses everything. Before: PASS with 0 subjects. After: a named load error and exit 1. For `.`, `yg owner` and the subjects agree. Docs: configuration.md:306/325 and nodes.md:47 say root entries are not mapping entries. If Krzysztof picks D1 option b instead, this issue grows to M and touches the owner index and coverage. Re-plan it in that case.
- **078.** In `hash.ts:246`, push the normalized spelling for an exact file: `pushContained(normalizeMappingPath(mp))` in place of `toPosixPath(mp)`. `checkTypeWhenMismatch` then receives `src/a.ts`. Red→green: an e2e over `./src/a.ts`, `src/../src/a.ts` and `src/./a.ts` with `when.path: "src/**"`. Before: type-when-mismatch, exit 1. After: PASS.
- **081.** `checkFileMappingGitignored` emits only on positive proof: `isFileGitignored(projectRoot, entry)`, which uses the base stack from 004, or `git check-ignore`. If case, NFC/NFD or a symlink explain the absence instead, emit nothing, so the concrete `mapping-path-case-mismatch` drives `next:`. For an NFD-on-disk/NFC-in-mapping pair, a dedicated message: reuse `mapping-path-case-mismatch` wording, or add one code in the same commit. Red→green: e2e cases (A) `src/Util.ts` vs `src/util.ts`, (B) NFD `café.ts`, and a control with a real `.gitignore` rule.

**Risk.** Medium. Subject sets change wherever ignored files or links sat in mapped directories, so affected pairs are re-verified once. That is intended and belongs in the CHANGELOG. The git probe adds one `git ls-files` per run, so measure it on a large repo. The tracked-vs-untracked distinction is the subtle part. 019 tightens behaviour (see D1). In this repository's own graph, the subject sets of `source/` nodes may shrink if any developer-ignored files exist under them in the container.

### Package 2 · `jarl/023-merge-hooks-lock` · 023, 024, 026, 027, 072, 067 · P1 · L

**Files (owned):** `core/log/log-merge-resolve.ts`, `cli/log.ts` (023's staging line only; package 12 waits), `cli/init-scaffold.ts`, `io/lock-store.ts`, `core/check-log-state.ts` and `core/log/log-gate.ts` (024, only if needed), `templates/knowledge/log-management.ts`, `templates/knowledge/verification-and-lock.ts`, `docs/the-lock.md` §139/§151/§179, `docs/cli-reference.md` §1073/§2355/§2514/§2524. Tests: `tests/unit/core/log-merge-resolve.test.ts`, `tests/unit/io/lock-store-merge.test.ts`, `tests/e2e/cli-merge-driver.test.ts`.

**What this package fixes.** The post-merge hook and the lock merge driver:

- **023.** In `logMergeResolveAll`'s commit branch (:764), take the commit branch only for a merge made in this clone: `HEAD@{1}` (or `ORIG_HEAD`) equals `HEAD^1`. Otherwise return a new `merge: 'elsewhere'` with the line "HEAD is a merge made elsewhere (arrived by fast-forward) — nothing to reconcile; name the sides with --ours/--theirs to check it". The guard lives in TS, so existing installed hooks pick it up with the new CLI and no `yg init --upgrade`. Scripted callers that run `git merge` and then `yg log merge-resolve` keep `HEAD@{1} == HEAD^1`. Verify this against Jarl's merger and Horde's `land`; Horde merges through `update-ref` in scratch trees, so add a seam test or a manual run. In `cli/log.ts:525`, build the `git add` list only from lock files that exist or were written. Red→green: e2e cases 1, 1b, 2 and 3 from the issue, with a teammate clone using `core.hooksPath`, pulled `--ff-only`; plus a `git add` line run verbatim in a project with no type log.
- **026.** `postMergeHook(cli)` takes the graph's path relative to the toplevel and emits `cd "<rel>" || exit 0` before the call. With several graphs in one repository (a root graph plus an overlay), the hook keeps one marked line per graph: read the existing ours-hook, merge its lines, and drop the `existing === hook` short-circuit at :250. Rephrase cli-reference §2355. Red→green: a graph in `packages/app` plus the overlay variant; after a merge, the subgraph's baseline is recorded and `graph-missing` is gone.
- **027.** In `ensureMergeDrivers`, when `core.hooksPath` ends in `/_` and `<dir>/h` exists (husky v9), name `<dirname(hooksPath)>/post-merge`. Also never name a file that `git check-ignore` reports. Red→green: a fixture with a fake husky layout (`.husky/_/h` and `core.hooksPath=.husky/_`). No npm install is needed.
- **024.** In `io/lock-store.ts`, make the lock driver kind-aware. For `yg-lock.logs.json`, when both sides moved a log baseline, keep the **base** baseline instead of dropping the key. The shared history is byte-identical, so it is a valid prefix of the union the yg-log driver writes. That covers rebase, `pull --rebase`, `--squash` and conflict-stopped merges, because git runs the driver in all four. No post-rewrite hook is needed. Red→green: the issue's cases 1–4 (rewrite the first entry after integration). Before: PASS. After: `error[log-integrity]`. Plus the entry owed for the merge is still required.
- **072.** In `mergeLeaf`, for verdict leaves of the verdict locks only, compare `hash` and `verdict`. On equality, keep one record chosen independently of direction, for example the canonically smaller one, so `filledAt`, `filledSha`, `promptChars`, `reason` and `judge` stop dropping the key. Red→green: fixtures in `lock-store-merge.test.ts` with equal hash and verdict and different `filledAt`, `filledSha`, `promptChars` and `reason`.
- **067.** Rewrite "Reverting a change you regret" (`log-management.ts:248-266`), "Reverting a node" (`verification-and-lock.ts:451-457`) and the-lock.md:139 into this recipe: revert the source with git, add `yg log add --supersedes <the regretted entry>`, then `yg check --approve`. Remove every `git checkout … log.md` recipe. Red→green: an e2e running scenario A of the recipe verbatim after a full approve and commit, ending in PASS.

**Risk.** Medium–high. These are merge semantics that adopters run on every `git pull`. The 023 guard must not break Jarl's merger or Horde's land, so test those paths explicitly. The 024 change alters the lock driver's documented contract ("a key both sides changed drops out"), so update the-lock.md:179 and cli-reference:2514 in the same commit. The hook text from 026 changes, so adopters with the old hook get the subdirectory fix only after `yg init --upgrade`. Say that in the CHANGELOG.

### Package 3 · `jarl/002-adopt` · 034, 084, 002 · P1 · M

**Files (owned):** `cli/adopt.ts`, `cli/adopt-transaction.ts`, `tests/unit/cli/adopt.test.ts`, `tests/e2e/cli-adopt.test.ts`, and the `yg adopt` section of `docs/cli-reference.md`.

**What this package fixes.**

- **034.** After the existing preflight (`adopt.ts:232`), and before the dry-run branch, run a second `validate()` over the same in-memory proposal rebased to the destination: `{ ...proposed, rootPath: path.join(repoRoot, '.yggdrasil') }`. Keep only the `DEFERRED_UNTIL_IN_PLACE` codes from that pass and refuse with them, the same way the real adopt does (exit 1). Every deferred check derives its project root as `path.dirname(graph.rootPath)` (38 sites), so this needs no copy and no edit outside `adopt.ts`. Do the same for the real path, so the non-dry-run refuses before `installGraph`. Red→green:
  - a mapped-but-missing `CLAUDE.md` (no Grain needed);
  - a committed symlink `CLAUDE.md -> AGENTS.md`;
  - a bracket directory `app/[locale]/` with an unescaped `when`;
  - a parity test over every proposal fixture in the adopt tests: dry-run verdict and codes equal real-adopt verdict and codes.

  ripgrep @3fce3b5 is evidence only, not a committed test.
- **084.** After `resolveProposal`, compare `realpath(proposal.graphDir)` with `realpath(<repo>/.yggdrasil)`. If they are equal, return a what/why/next refusal before the dry-run branch and before `installGraph`. Red→green: a unit test for `.`, `.yggdrasil` and the absolute path.
- **002.** `rootComponentPath` (adopt-transaction.ts) prefers a node of type `project`, then a node that maps files at the repository root. When neither exists, it falls back to a documented deterministic choice, such as the shallowest node and then the lexicographically first. The dry-run prints that choice, and cli-reference describes it. Red→green: a unit test with a Grain-shaped proposal (`__tests__`, `dot-github`, `docs`, `repo-root`).

**Risk.** Low–medium. The second validate pass runs non-deferred checks over the wrong root, so their noise must be filtered out (keep only deferred codes). Coordinate with Grain: Grain's 6.1.1 `propose` exit code already relies on the preview.

### Package 4 · `jarl/065-relations` · 065, 098 · P1 · M

**Files (owned):** `relations/verifier.ts`, `relations/pass.ts`, `templates/knowledge/ports-and-relations.ts`, `docs/relations-flows-ports.md` §67/§111, `tests/unit/relations/verifier.test.ts`. The package must not edit `relations/messages.ts` beyond calling `importRelationsAllowed`. `relations/facts-cache.ts` belongs to package 5.

**What this package fixes.**

- **065.** Extend `RelationGraphView` (verifier.ts:2-6; built in `makeGraphView`, pass.ts:750) with `structuralAllowed(fromNode, toNode)`. It answers true when the architecture allows at least one of `calls`, `uses`, `extends` or `implements` from `type(from)` to `type(to)`, reusing `importRelationsAllowed(graph, from, to)`. The ancestor-sanction line (verifier.ts:17) then also requires `g.structuralAllowed(nodeId, m)`. Otherwise the dependency is reported, and the existing dead-end text ("none can be declared") applies. Red→green:
  - a verifier unit test with types, where the ancestor sanction passes when the descendant's type is allowed and refuses when it is not;
  - an e2e of repro case 3 (api → data/db under data);
  - the moved `examples/layered-architecture` case.

  Update knowledge `ports-and-relations.ts:100` and docs §67. This is a tightening, so D3 decides whether it ships blocking.
- **098.** At pass.ts:357 and :383, read files as `Buffer`. When there is a BOM `FF FE` or `FE FF`, decode with `TextDecoder('utf-16le' | 'utf-16be')`. A decoded text that still contains NUL, or a tree that is all ERROR nodes, yields `relation-parse-failed`, never zero edges. Red→green: the three repro scripts (TS LE/BE and C# LE) turned into e2e fixtures, giving an edge → data for the UTF-16 files and a FAIL where before there was a green pass.

**Risk.** 065: existing graphs that relied on the loophole turn red, and Grain 054 parity must follow (section 4). 098: low. The facts cache invalidates by key, but check whether a decoding change needs an extractor-independent cache bump in `facts-cache.ts`. If it does, coordinate with package 5, which owns that file.

### Package 5 · `jarl/063-local-writes` · 063, 070, 091 · P1 · M

**Files (owned):** `io/atomic-write.ts`, `utils/debug-log.ts`, `io/debug-log-writer.ts`, `io/type-class-cache.ts`, `relations/facts-cache.ts`, `docs/the-lock.md` §97–§109, and the `debug` paragraph of `docs/configuration.md`.

**What this package fixes.**

- **063.** One guard for every write of gitignored local state. In `atomicWriteFile`, find the `.yggdrasil` segment of the target path and lstat each segment below it. If any is a symlink, or the realpath leaves `<root>/.yggdrasil`, refuse the write. That guard covers `.type-class-cache`, `.ast-cache`, `.feature-field.json`, the deterministic lock and every other atomic write without touching their callers. `initDebugLog` and `appendToDebugLog` get the same lstat check. When the guard fires, skip the debug log and print one `note:`. Do not edit `preamble.ts`; package 12 owns it. Red→green: an e2e with a committed `.yggdrasil/.debug.log` that points out of the repository (absolute and relative, existing and missing target) under `debug: true`. `check`, `check --no-approve`, `tree` and `owner` write nothing outside. A second case covers a committed `.type-class-cache` directory link.
- **070.** Make `writeFacts` (facts-cache.ts:237-257) best-effort: catch the error, write a debug line, and continue, as the type-class cache already does. Move `ensureRevisionMarker` inside its try. Do not edit `relations/pass.ts` or `core/check.ts`. Red→green: an e2e running `chmod -R a-w` on a fresh clone of a repo without script rules. Before: `error[internal]`. After: PASS. It also covers an existing `.ast-cache` plus a new source file.
- **091.** Make the-lock.md:109 say what :97 and configuration.md:268 say: a key is sent to the committed endpoint, and yg only warns `reviewer-endpoint-committed`. After the fix, `grep 'goes only to the provider' docs/` finds nothing. 063's note about `--no-approve` writing local state belongs in the same paragraph.

**Risk.** Low–medium. The atomic-write guard runs on every write. Keep it to lstat calls below `.yggdrasil` and never realpath the repo root itself, because macOS's temporary directory resolves through a symlink into /private and container bind mounts would trip it.

### Package 6 · `jarl/020-config-errors` · 020, 064, 076, 080, 090 · P3 · M

**Files (owned):** `io/config-parser.ts`, `io/secrets-parser.ts`, `core/graph-loader.ts`, `core/validator.ts`, `core/checks/aspect-contracts.ts`, `core/tier-selection.ts`, `core/checks/architecture.ts`, `utils/file-schema.ts`, `core/migrator-runner.ts`, `cli/init.ts` (090 only; package 12 waits), and `docs/configuration.md` §20/§39–41.

**What this package fixes.**

- **020.** `parseConfigInner` (:404-405) wraps read and parse errors in `ConfigParseError`, as `readOverlay` does. `diagnoseGraphLoadError` (graph-loader.ts ~669) maps it to `config-invalid` with the file name and the line. A missing file gets its own what/next ("restore it from version control, or `yg init --upgrade`"), and validator.ts:122-126 stops saying "syntax error" about a missing file. Red→green: an e2e over `tree`, `context`, `owner`, `aspects`, `flows`, `structure`, `suppressions` and `impact` with conflict markers, a tab, and a missing file. Each gives `config-invalid`, never `internal`.
- **064.** Call `parseYaml(content, { prettyErrors: false })` in secrets-parser.ts:52 and build the message from `err.linePos` (file, line and column only). As belt-and-braces, pass the overlay error detail through `redactSecrets`. Do not reuse the deferred `jarl/514-pkg-redaction-contracts` branch. Red→green: an e2e over the four broken shapes that greps stdout and `--json` for the key.
- **076.** Use `Object.hasOwn` for tier lookups (config-parser.ts:874, aspect-contracts.ts:638, tier-selection.ts:41/67) and for `node_types[...]` (architecture.ts:195/243/462/526). Red→green: e2e cases `tier: toString`, `constructor`, `valueOf` and `hasOwnProperty` give `aspect-tier-unknown`, `reviewer.default: constructor` gives `config-default-tier-unknown`, and `type: toString` gives only `type-undefined`. `--approve` never reaches the provider factory.
- **080.** Five message texts:
  - fix lines that print `KNOWN_PROVIDERS.join(', ')` (:980);
  - a dedicated why and fix for an unknown key under `type_law`;
  - `version` null, empty or boolean described as what it is;
  - `.inf` and `.nan` shown as written (:1027 and file-schema.ts:123);
  - configuration.md:39-41 counting twelve keys.

  Red→green: one message test per case.
- **090.** In `diagnoseGraphLoadError`, when `CLI_SUPPORTED_SCHEMA < declared ≤ cliVersion()`, advise restoring `version: "6.0.0"`, not upgrading the CLI. `init --upgrade` in that range rewrites the version, with a note. Keep the upgrade advice for declared versions above `cliVersion()`. Messages say "graph schema 6.0.0", not "this CLI (6.0.0)". The migrator refuses (exit 1) when `fromVersion` is newer than its target, never returning silently. Red→green: tests for "6.1.0" and "5.9.0".

**Risk.** Low. These are message changes, plus an own-property lookup that a test pins.

### Package 7 · `jarl/005-progressive-scope` · 005, 006, 007, 071, 008 · P2 · L

**Files (owned):** `core/progressive-scope.ts`, `core/graph/impact-graph.ts`, `core/progressive-scope-resolve.ts`, `core/progressive-preflight.ts`, `io/aspect-parser.ts` (071; package 8's 077 waits), `tests/unit/core/progressive-scope.test.ts`, and the state table in `docs/progressive-mode.md`. The package does **not** edit `io/config-parser.ts` (008's spelling check moves to resolve time).

**What this package fixes.** Every issue here is a missing row or key in `computeBurnSet`'s inverted indexes:

- **005.** The rule-folder row (:607-613) cuts at the first slash. Resolve the **longest known aspect-id prefix** of `rest` instead, via a sorted id list or a trie built once per run. A file directly under a package root (`yg-package.yaml`, `yg-aspect.adapt.yaml`) with no rule id burns every rule under that prefix. Red→green: unit tests for `security/no-bad` and `packages/<o>/<r>/<pkg>/<rule>`, plus the issue's scenarios (a), (b) and (c) as e2e: FAIL at the PR step.
- **006.** `observationKeyCandidates(file)` also proposes `node-files:N` and `graph-files:N` for every node whose mapping matches the file, ancestors included, resolved by pattern so that a deleted path still matches (use `ownerOf` and the owner index). `touchedReferencesFile` (impact-graph.ts:294-362) takes an optional mapping matcher and gains the two cases. `yg impact` passes the same matcher. Red→green: the sibling-test scenario in both directions (delete and add), checked warm with `check --no-approve`.
- **007.** Build an index from each rule's `aspect.supportFiles`, resolved to repository paths (posix-normalize the rule dir joined with the relative path), to the aspect id. A change to such a file burns that rule's pairs and its implies closure. Red→green: case A (`tools/x.mjs`) and case B (`.yggdrasil/aspects/shared/x.mjs`) as e2e, plus a unit test.
- **071.** Normalize reference paths at parse time in `aspect-parser.ts:258` with `normalizeMappingPath`, keeping escape detection on the result, so the duplicate guard (:288), the hash and the scope agree. Red→green: an e2e over `./docs/style.md`, `docs//style.md` and `docs/x/../style.md` giving two reviewer calls and FAIL, plus a duplicate test.
- **008.** Recommended per D2:
  - In `probeProgressiveState`, a reference that is HEAD-relative (`HEAD`, `@`, `HEAD~N`, `HEAD^…`, `ORIG_HEAD`, `FETCH_HEAD`) gives whole project plus a notice.
  - When `mergeBase === HEAD`, compare the `progressive` block in the working config with the block in the config of every parent of HEAD (`getFileAtRef(HEAD^1)`, and `HEAD^2` for a PR merge commit). Any difference gives whole project plus the existing "block changed" notice.
  - A new row goes in the progressive-mode.md state table.

  Red→green: an integration test for a committed switch to `HEAD` and to the branch's own name with BAD in `src/a.ts`, giving FAIL. The documented "nothing has moved" state on the reference branch keeps passing.

**Risk.** Medium. Every change widens scope, the fail-closed direction, so the risk is noise, not false green. 071 changes the hash input only where a non-canonical reference spelling is used, which means one re-verification there. 008 depends on D2.

### Package 8 · `jarl/032-check-report` · 032, 095, 096, 077 · P2 · M–L

**Files (owned):** `formatters/check-json.ts`, `core/check-json.ts`, `core/check-pair-issues.ts`, `core/check-lock-phase.ts`, `model/check-issue.ts`, `formatters/check-render-groups.ts`, `core/check.ts`, `formatters/check-render-header.ts`, `portal/derive-counts.ts`, `core/fill-report.ts`, `core/fill-llm.ts`, `core/fill-llm-phase.ts`, `formatters/check-render-views.ts`, `formatters/aspect-status-messages.ts`, and `tests/e2e/cli-next-executes.test.ts`. The package must not edit `io/lock-store.ts` or `model/lock.ts`, which would mean no lock format change in a patch.

**What this package fixes.**

- **032.** Script part: in `check-pair-issues.ts`, where the refused issue is built (:86-97), parse the stored reason **anchored on the pair's own subject file set**. A line starting with `<subject>:<n>: ` or `<subject>: ` opens a violation; any other line continues the one above. Attach the result as structured `violations` on the `CheckIssue`, and have `formatters/check-json.ts` and the text renderer read that field instead of regexing `what`. Relation part: `check-lock-phase.ts:190` attaches `nv.violations` (fromFile, line, ownerNode), so `edgesOf` (core/check-json.ts:111) projects edges without `(\S+)`, and `allowedRelations` is looked up by the exact target. Red→green: part A (two file-level violations, then two rows with line null, and the text report counts 2) and part B (target `data store`, `allowedRelations` `[]` for web and `['calls']` for domain). Record the correction in family-contracts.md's corrections list.
- **095.** `countDraftAspectsAcrossGraph` (check.ts:681) counts only the rules none of whose expected-pair units stands above draft, derived from the computed expected pairs that check.ts already has. Do not import `raisedAboveDraft` from `cli/adopt.ts`, which is package 3's file. Red→green: case A gives `draftSkipped` 0, case B gives 1, and case C is not skipped.
- **096.** The grouping key in `fill-report.ts` keeps each distinct provider cause. The group renders `N × <cause>` per distinct `what` cause. `FillTotals.infraReport` gains `reason`, and the summary warning prints it. Red→green: the grouping test with the reason in `what`, the way `fill-llm.ts:146-150` produces it, covering scenario B (ECONNREFUSED in the text) and scenario C (both 401 and 503).
- **077.** `aspect-status-messages.ts` gives the step as data (`IssueMessage.step` "edit `<repo-relative>/yg-aspect.yaml`", or the flow file). `leadingCommand` (check-render-views.ts:124-137) never truncates a positional argument: an incomplete command yields `null`. Relativizing `aspectDir` needs the graph root, which comes from `io/aspect-parser.ts`, so that one edit waits for package 7. If the worker can relativize in the formatter instead, no wait is needed. Red→green: the two repro cases added to `cli-next-executes.test.ts`, where `next.command` is runnable or null.

**Risk.** Medium for 032: the `yg-check/1` rows change for file-level script refusals, which is the fix. Horde reads `yg-check/1` (`promote`, `demote`, `ladder`), so check whether it reads `violations[]` before merging. Low for the rest.

### Package 9 · `jarl/069-reviewer-subjects` · 069, 097 · P2 · M

**Files (owned):** `core/pairs.ts`, `structure/hook-loader.ts`, `utils/binary-extensions.ts`, `io/file-content-cache.ts`. The package must not edit `io/graph-fs.ts` (package 1) or `core/check-pair-issues.ts` (package 8).

**What this package fixes.**

- **069.** At pairs.ts:502-507 and :694, drop a reviewer-rule subject when the existing NUL sniff over the first 8 KiB says binary. `isBinaryBuffer` (file-content-cache.ts:101) is reached through the `FileContentCache` that pairs.ts already holds, and the sniff applies whatever the extension. Keep the extension list as a fast path. Script rules keep receiving binary files unless a test shows otherwise. The second acceptance (naming the binary contributor in prompt-too-large) becomes moot once binaries never enter a prompt. If it is still wanted, do it where the prompt size is measured, not in check-pair-issues.ts. Red→green: e2e scenarios B, C and D from the issue. No `&#x00;` remains, and C and D pass at 50000.
- **097.** In `buildOwnFiles` (hook-loader.ts:141-146) and the type-covered path (:596-601), a read or decode failure stops being `continue`. It marks the unit's input incomplete, and the pair gets `file-unreadable` or `unverified`, never `approved`. Step 2.5 in pairs.ts (:509-547) also refuses a subject whose `stat().size` exceeds `buffer.constants.MAX_STRING_LENGTH`. Red→green: a sparse 600 MB `.sql` fixture created at test time (sparse, so it is cheap) in scenarios A, B, C and the nodeless variant, ending with exit 1 and no `approved` in the lock.

**Risk.** For 069, subject sets change on nodes holding tracked binaries, so those reviewer pairs are re-reviewed once (paid). Say so in the CHANGELOG. 097 has low risk. Keep the sparse-file test fast.

### Package 10 · `jarl/031-portal` · 031, 033, 089 · P2 · M

**Files (owned):** `templates/portal/js/bootstrap.js`, `templates/portal/js/consumer.js`, `templates/portal/js/views/overview-view.js`, `portal/server/approve.ts`, `portal/server/router.ts`, `portal/server/server.ts`, `portal/serializer.ts`, `portal/engine-api.ts` (033's meta flag, if needed), `cli/portal.ts`, `docs/portal.md`, a note in `docs/progressive-mode.md`, and `tests/portal-e2e/*.spec.ts`.

**What this package fixes.**

- **031.** The client reads `{ok, exitCode, stdout}`. On `ok:false` it shows "nothing was recorded" plus the gate reason. `consumer.js:131` tells the 409 `approve-in-progress` response ("another fill is running") apart from the 409 `view-only` response. `approve.ts` checks `exit.status === 'aborted'` before `parseDryRunBudget`, and `/approve/dry-run` returns the reason and the structural findings, never 500 `internal`. Red→green: Playwright and Chromium specs for A (log_required plus an edited source file), B1/B2 (lock held, live fill) and C (unknown provider). The `served-refresh-approve` assertion tightens from `/Approved|re-checked/` to the success-only text.
- **033.** portal.md says the portal always answers like `yg check --full`, progressive-mode.md gets a note, and under a configured `progressive.reference` the overview says "whole project, not the change gate". `runPortalCheck` stays unscoped, and `progressive-scope-divergence.spec.ts` keeps passing.
- **089.** `cli/portal.ts` classifies `EADDRINUSE`, giving `command-error` "port N is in use" with `next: yg portal --port <n>`. An `--out` that names an existing directory gives a `usage` error that names the path. Neither is routed through `abortOnUnexpectedError`, and `preamble.ts` is not touched. Red→green: e2e for both cases.

**Risk.** Low. The portal e2e is slow, so run the targeted Playwright specs locally first. The `portal/every-surface-has-e2e` rule requires a spec for every changed surface.

### Package 11 · `jarl/028-packages` · 028, 029, 085, 086, 094, then 030 · P2 · L

**Files (owned):** `cli/pack-source.ts`, `cli/pack-update.ts`, `cli/pack.ts`, `model/packages.ts`, `io/package-versions-cache.ts`, `io/package-manifest-parser.ts`, `io/package-store.ts`, `core/marketplace-check.ts`, `cli/marketplace.ts`, `templates/knowledge/packages-and-marketplaces.ts`, `core/checks/aspects.ts`, `docs/packages.md`, the yg-packages schema/row in `docs/family-contracts.md`, `tests/unit/cli/marketplace.test.ts`, and the e2e `cli-pack-*`. It also edits `core/graph-loader.ts`, but only in 030's commit, after package 6 has merged. Rebase first.

**What this package fixes.**

- **028.** On install, record a normalized publisher next to the record's `identity`: the host plus the full repository path, with ssh, https and scp forms of one host equal. This is a new **optional** yg-packages/1 field, read leniently when it is absent. `pack update` compares it and refuses a change of host or parent group. A legitimate move is `pack remove` then `pack add`, documented. `pack add` refuses a second repository with the same `<owner>/<repo>` tail as an installed one. packages.md:91-93 and :104-107 describe the real scope. Red→green: e2e next to R2 (cli-pack-versions.test.ts:581) for a host change and a GitLab subgroup change, using `url.insteadOf` in an isolated `GIT_CONFIG_GLOBAL`.
- **029.** `marketplace check` follows the literal relative imports of `check.mjs` and `companion.mjs` with `readSupportFileHashes`, which needs no edit. It refuses a package whose rule reaches a file outside `inspectPackageTree(pkgDir).files`, naming the import. The docs and the knowledge topic say one thing about dot-named code files. D4 settles whether an in-package shared-helper place comes later. Red→green: the dot and outside variants no longer get "Ready to publish".
- **085.** A top-level directory under `packages/` counts as claimed when an entry equals it or starts with `${dir}/`. An unclaimed directory is reported at its real depth. Red→green: layout B passes, and a stray `packages/web/other` is named.
- **086.** `pack remove` deletes the cache entry, and so does `pack add` or `pack update` from a source that cannot be asked (`fetched.published === null`). `cli/advise.ts` is not edited (it is package 16's file). Red→green: an e2e for remove plus re-add of the same name from a plain directory, after which no package-update nomination appears.
- **094.** `ciWorkflowText()` pins `@chrisdudek/yg@${cliVersion()}` and adds a comment to raise it in its own commit. marketplace.test.ts:91 pins the version.
- **030 (last).** Change the loader's dot skip (graph-loader.ts:486/490/494) so that only owner-level `.staging-*` and `.replaced-*` names are skipped. Repo and package directories may start with a dot. `aspect-undefined` (`core/checks/aspects.ts:28`) tells "recorded in yg-packages.yaml but not loadable" apart from "not installed". `pack new` and `marketplace check` refuse a package name that git cannot use in a tag (`git check-ref-format`). Red→green: an origin `acme/.github` gets listed by `yg aspects`.

**Risk.** Medium. 028 adds a field to a committed record format in a patch: it is additive and lenient on read, and family-contracts lists no external consumer. 029 may turn a published package red in `marketplace check`, which is intended.

### Package 12 · `jarl/021-navigation` · 021, 093, 088, 025 · P2 · L · waits for packages 2 and 6

**Files (owned):** `cli/tree.ts`, `cli/build-context.ts`, `cli/impact.ts`, `core/log/log-add.ts`, `cli/find.ts`, `cli/owner.ts`, `formatters/context-file.ts`, `cli/output.ts`, `utils/terminal-safe.ts`, `cli/log.ts` (088's JSON writes), `cli/init.ts` (025), `cli/preamble.ts` (025), and the helper half of `core/validator.ts`/`core/graph-loader.ts`. Also `docs/cli-reference.md` §2355 and the context/impact `--file` text.

**What this package fixes.**

- **021.** Extract the node-path to `nodeParseErrors` matching logic (exact path or ancestor prefix, validator.ts:313-329) into one helper. When the asked-for node or one of its ancestors failed to load, `context --node`, `impact --node`, `log add --node` and `tree --root` report `yaml-invalid` with the file and the parse problem. `tree` marks unloaded nodes instead of printing "no nodes yet". `owner` and `context --file` stop advising "add a yg-node.yaml" when a broken one maps the file, and `find` names the broken node. Red→green: e2e over the two repro graphs (a schema typo, and a syntax error with healthy children).
- **093.** `context` and `impact` check that the resolved file exists, as owner.ts:413 does. A missing file gets "no such file relative to the repository root `<root>`", plus "did you mean `<rel-from-root>`" when the path exists relative to cwd. The `--help` text of both commands says the path is relative to the repository root. Red→green: an e2e run from `src/orders` with a nonexistent path.
- **088.** Add one serializer helper in output.ts that escapes U+007F–U+009F, U+2028 and U+2029 as `\u` sequences. `writeJsonDocument` and every direct `writeOut(JSON.stringify(...))` use it: tree.ts:109, find.ts:105, log.ts:187/331, owner.ts:360/395, plus check's JSON writer if it bypasses `writeJsonDocument`. The stream filter stays for text. Red→green: a unit test with DEL and C1 characters, plus an e2e where `JSON.parse` of `tree --json` gives the YAML description back and a path from `check --json` exists on disk.
- **025.** The `--upgrade`, `--provider` and existing-repo menu paths (init.ts:1015, :1121-1135) find the root through `findYggRoot`. The next step for `graph-missing` says to run from the repository root. A fresh `yg init` under a graph that already exists warns, or asks, and names that graph. Red→green: an e2e from `src/` where the root graph gets upgraded and configured, and no `src/.yggdrasil` appears.

**Risk.** Medium. Many command entry points change. The 088 JSON bytes change only for DEL and C1 characters. Note it in family-contracts corrections if the bytes of `yg-*/1` documents are considered part of the contract.

### Package 13 · `jarl/066-nested-roots` · 066, 083 · P3 · M · waits for packages 1 and 3

**Files:** `io/repo-scanner.ts`, `io/paths.ts`, `core/checks/mapping.ts`, `cli/adopt-transaction.ts`, the registry (066's new code), and `tests/e2e/cli-adopt.test.ts` (e2e 4).

**What this package fixes.**

- **066.** `walkForNestedProjectRoots` (:334) treats a directory as a nested project only when its `.yggdrasil/` holds `yg-config.yaml`, and `findYggRoot` gets the same rule. A stray `.yggdrasil/` gets a warning finding that names its path, and the subtree stays in the parent graph. `mapping-path-missing` names the nested root that cut the files. Red→green: the `.gitkeep`-only fixture gives `error[refused]` at `src/pay/sub/b.ts:1`, in a fresh clone too.
- **083.** The repo walk and `isCoverageExcludedPath` skip root-level `.yggdrasil.replaced-*` the way they skip `.yggdrasil`. adopt writes `/.yggdrasil.replaced-*/` to `$GIT_COMMON_DIR/info/exclude`, which is local and never committed, and which package 1 makes the walk honour. Red→green: e2e 4 in `cli-adopt.test.ts` runs `yg check` after `--replace` with `coverage.required ["/"]`.

**Risk.** Low–medium. 066 changes which trees are nested-project boundaries, but only for directories without a config.

### Package 14 · `jarl/079-arch-relations-null` · 079 · P3 · S

`io/architecture-parser.ts:182-193` treats `relations: null`, whether empty or `~`, as absent, consistent with `aspects` and `parents`. No architecture error ever surfaces as a raw TypeError: wrap the per-type parse and name `node_types.<type>.<key>`. The side issue of `log_required: null` saying "got object" gets the same fix. Red→green: parser tests for an empty value and `~`.

### Package 15 · `jarl/082-claude-md-symlink` · 082 · P3 · S

`templates/platform.ts` `installRules` compares `fs.realpath` of CLAUDE.md and AGENTS.md (:295, :323). When they are the same file, skip the import line, say so, and never write through a link without naming the real target. The rules-digest-stale check reads the same way. Red→green: e2e cases A (CLAUDE.md → AGENTS.md) and B (the reverse), where neither file contains `@AGENTS.md`.

### Package 16 · `jarl/087-advise-suppressed` · 087 · P3 · S

`core/advise-feed.ts` `applyDecisions` returns each hidden nomination together with its decision, and `cli/advise.ts` `project()` maps it to `suppressed: { action, until?, reason }`. `formatters/advise-json.ts`'s type already declares the field. Red→green: dismiss plus defer, after which `advise --json` carries both decisions and validates against `yg-advise-1.schema.json`.

### Package 17 · `jarl/092-incident-header` · 092 · P3 · S

`io/incidents-store.ts` exports a predicate built on `HEADER_RE` (:114). `cli/incident.ts` refuses a `--reason` containing a line that would parse as an entry header outside a code fence, the way `yg log add` refuses. Red→green: an e2e in `cli-aspects-health.test.ts` (:555 area) with a full header line, after which the ledger has exactly one entry and health, advise and check see no forged entries.

### After the 55 · `jarl/runes-101-pickup` (Yggdrasil half of the Runes issues)

This package is not one of the 55, but it touches files owned above, so it waits for packages 1 and 4 and for Runes 1.0.1 being published:

- In `source/cli`, `npm install @chrisdudek/runes@1.0.1 --save-exact`, so `package.json:86` and `package-lock.json` resolve from `registry.npmjs.org`, and `node scripts/runes-pin.mjs --publish` passes.
- 010's Yggdrasil half: `relations/resolve-path.ts` `guardedResolve` and `relations/owner-index.ts` take the git-ignore predicate package 1 introduces, so ignored build output neither resolves nor is owned.
- `docs/relations-flows-ports.md` lines cited by 011, 012, 015, 016 and 018.
- The bug-hunt repro scripts re-run as evidence.
- A CHANGELOG line saying that new edges (C# DI, Rust, Kotlin, TS aliases) can turn existing graphs red.

The Runes plan's P2 for 011 needs no `pass.ts` change. 014's C# reachability is deferred to 1.1.0 (Runes D7).

`npm install` changes the **shared** `source/cli/node_modules` volume, so run it only while no other worker's hook is running. The 6.1.0 loop records a one-minute window with an empty `node_modules`. Then run `npm ci` in the volume after the merge.

---

## 2. Owner decisions

**D1 · 019: what a mapping entry naming the repository root means.** Today `/`, `//` and `./` map nothing, so an enforced rule silently enforces nothing. `.` maps the whole repository, `.yggdrasil/` included, for subjects, while ownership says nobody owns those files.
- (a) Refuse all four spellings at parse time with a clear message. Cost: a graph that uses `.` today stops loading at that node. Probably nobody does it, but it is a break inside a patch. S.
- (b) Make all four mean "the whole repository except `.yggdrasil/` and nested projects", consistently for subjects, ownership, coverage and overlap. Cost: M–L, touching the owner index, overlap checks and child-precedence. New semantics in a patch.
- (c) Refuse `/`, `//` and `./`, which never worked, and keep `.` with its inconsistency documented. Cost: leaves a known false-ownership bug.

Recommendation: (a) for 6.1.1, and (b) as a 6.2.0 feature if anyone asks for whole-repository rules.

**D2 · 008: how far 6.1.1 closes "a PR re-points `progressive.reference` at itself".** The trust root, the reference, is read from the very tree being judged.
- (a) Partial patch: a HEAD-relative reference gives whole project plus a notice. When the reference resolves to HEAD, compare the `progressive` block with the config of each parent of HEAD; any difference gives whole project. Cost: S–M. It closes the persistent `reference: HEAD` hole and the usual single-commit or PR-merge-commit shape. An own-branch-name switch spread over several pushed commits on a push build still passes once, and the `--full` leg on `main` turns red after the merge.
- (b) A full history walk to find the previous reference and measure from its merge base. Cost: M–L, edge cases (old reference deleted, rewritten history), a git walk on every run.
- (c) An out-of-tree trust root: CI passes the reference (`yg check --reference origin/main` or an environment variable), and it overrides the config. Cost: a new CLI surface and docs, which makes it a minor.

Recommendation: (a) in 6.1.1, (c) in 6.2.0, with progressive-mode.md saying plainly that until then the config file should be review-protected (CODEOWNERS).

**D3 · 065: ship the tightened ancestor sanction as blocking in a patch?** The docs and the README's first rule already promise it. Repositories that today pass through a relation to an ancestor of a forbidden-type node turn red after the upgrade.
- (a) Blocking in 6.1.1 under a "Before you upgrade" note. Cost: some adopters get new red. Grain 054 has to follow.
- (b) A new warning in 6.1.1, blocking in 6.2.0. Cost: a temporary code, plus the false green stays one more release.
- (c) Hold to 6.2.0.

Recommendation: (a). It is a false green on the flagship rule.

**D4 · 029: is there a legitimate place for a helper that several rules of one package share?** Today `marketplace check` rejects `packages/<pkg>/shared/` as an undeclared directory, while the two layouts it accepts break every consumer.
- (a) In 6.1.1, only refuse unshipped imports and say plainly in the docs and the knowledge topic that a package has no shared-helper place yet.
- (b) Define one now, for example a reserved `packages/<pkg>/_shared/` that install copies and the hash folds in. Cost: a package-layout contract change and installer changes. That is a minor.

Recommendation: (a) now, (b) as a 6.2.0 design issue.

Not decisions, and decided in the sketches instead: 024 (keep the base baseline; no post-rewrite hook), 072, 090 (init repairs the version inside the safe range), 095 case C (partly raised means not skipped), 066 (a stray `.yggdrasil` is a warning, and its subtree stays in the parent graph), 097 (`file-unreadable`), 004/068 (per-machine ignore sources drop only untracked files, for determinism), 028 (a host move goes through remove plus add; no new flag).

## 3. Not patch-sized

What the issues ask for in full, and the patch-sized part instead:

- **008, the full closure:** an out-of-tree reference (D2c) is a new CLI surface. Patch: D2a, plus a doc note.
- **019 option (b):** whole-repository mapping semantics. Patch: refusal (D1a).
- **028, putting the host into the package identity:** the issue itself notes this would rename `packages/<owner>/<repo>/` and every rule id, which is breaking. Patch: a separate recorded publisher, compared on update and refused on a same-tail collision.
- **029, an in-package shared-helper location:** a layout contract change (D4b). Patch: refusal plus honest docs.
- **024 via a post-rewrite hook:** a new hook installed in every adopter repository. It is not needed, because the driver keeping the base baseline covers rebase and squash. Not planned.
- **Runes 014 and 075 part b (C# reference closure):** a new option on Runes' resolver, which is Runes 1.1.0 (Runes D7). Yggdrasil filtering after resolution would leave Grain out.
- **Runes 010, recall half (outDir → rootDir):** a new resolution rule (Runes D3). Yggdrasil does only the ignore half, after package 1.

Every Yggdrasil issue in the 55 has a patch-sized path. None needs to be dropped.

## 4. Duplicates and cross-repo links

**Same defect, or same fix, inside Yggdrasil:**
- 068 is part C of 004's finding. The mechanism is the same (the ignore stack and the git probe), so they go in one package. 068's scenario joins 004's tests.
- 081 case (C) (a symlink blamed on `.gitignore`) is fixed by 022's acceptance. 034's "excluded by .gitignore" for a symlink is the same message.
- 078's `SRC/a.ts` half is 081 (A).
- 019, 078 and 071 belong to one family (`./`, `..` and `//` spellings) on three code paths: a mapping root, an exact-file mapping, and a reference path. Each fix uses `normalizeMappingPath`.
- 024 and 072 share `io/lock-store.ts` `mergeLeaf`. 023, 026 and 027 share the post-merge hook writer. 005, 006, 007 and 071 share `computeBurnSet`.
- 020, 070, 076 and 089 share a class: environment or config errors reported as `internal`. They are separate fixes.
- 066 is related to 025: a stray marker versus a nested graph created by mistake.

**Cross-repository:**
- **034 ↔ Grain 035, 060.** Grain is where those proposals get written (symlinks, unescaped `[locale]`). Grain 6.1.1's `propose` exits 1 only when `yg adopt --dry-run` refuses, so Grain's guard catches nothing until 034 lands. Grain's CHANGELOG promise ("every proposal Grain writes is one Yggdrasil can accept") depends on 034.
- **022 ↔ Grain 035.** Grain stops writing symlinks into mappings, and Yggdrasil refuses them by name.
- **004/068 ↔ Grain 035 and Runes 010.** Grain's file set (`git ls-files … --exclude-standard`) equals yg's walk only once yg honours `info/exclude`, `core.excludesFile` and ancestor `.gitignore` files. Runes 010's determinism half becomes real only when Yggdrasil passes git-ignored paths in `isExcluded`, which is the `runes-101-pickup` built on package 1's predicate.
- **065 ↔ Grain 054.** Grain's `measure` counts "target or its ancestor" as a declaration. If D3a ships, Grain 054's acceptance must add the same type condition, or Grain and yg disagree again.
- **002 ↔ Grain.** Grain proposals have several top-level nodes, and Grain cannot fix the adoption-entry placement without renaming them.
- **069 ↔ Grain 100.** Same lesson (binary content behind an extension), different code. Possibly worth a probe: whether Yggdrasil's relation pass also parses a binary `*.ts`. Not filed.
- **098 ↔ Runes 074.** Similar BOM handling, different files. Both stay as filed.
- **Runes 009–018 and 073–075 → Yggdrasil:** each needs the pin bump to Runes 1.0.1 (`source/cli/package.json:86` plus the lock). 010 and 012 have Yggdrasil code in `relations/resolve-path.ts` and `owner-index.ts`. Docs lines in `relations-flows-ports.md` are cited by 011, 012, 015, 016 and 018. All of this is the `runes-101-pickup`. **None of the 55 Yggdrasil issues waits on a Runes fix.** Grain 053 (Java same-package refs) would reach Yggdrasil only through Runes in a minor (Runes D8).

## 5. Repo mechanics for a worker (verified by reading)

- **Where things run.** Everything runs in the devcontainer, as `node`: `docker exec -u node -e PATH=~/.local/bin:/usr/local/bin:/usr/bin:/bin -w <worktree> yggdrasil-devcontainer …`. The container is running (`docker start yggdrasil-devcontainer` if it is not).
  - As root, the permission tests (`chmod 000`) pass falsely, Chromium is missing (it is installed only for `node` under `~/.cache/ms-playwright`), and root-owned files land in the volumes. The 6.1.0 loop's issue 088 was exactly this mistake.
  - `claude` is at `~/.local/bin/claude`. It is the repository's reviewer (`provider: claude-code`, `model: sonnet`), and `.yggdrasil/yg-secrets.yaml` holds only comments.
  - The container's global identity is `Krzysztof Dudek <me@chrisdudek.com>`, which is right.
- **Worktrees.** The main checkout `/workspaces/Yggdrasil` (virtiofs from the host) is on `release/6.1.1`. Its `source/cli/node_modules`, `source/cli/dist` and `docs/node_modules` are docker volumes, not host directories. Create a worker tree with:

  ```
  git -C /workspaces/Yggdrasil worktree add ~/wt/<NNN>-<slug> -b jarl/NNN-<slug> release/6.1.1
  ```

  Then link the dependencies exactly as the surviving 6.1.0 tree `~/wt/514-pkg` does:
  - `ln -s /workspaces/Yggdrasil/node_modules node_modules` (it holds only `@mapbox`);
  - `ln -s /workspaces/Yggdrasil/source/cli/node_modules source/cli/node_modules`;
  - `ln -s /workspaces/Yggdrasil/docs/node_modules docs/node_modules`.

  `dist/` is **not** linked. It is built per tree: `(cd source/cli && npm run build)`, and the hook rebuilds it.
- **Which CLI to run.** Use the tree's own `node source/cli/dist/bin.js …`, never the global `yg`. The global one is `npm link`ed to the main checkout's dist volume (`.devcontainer/post-create.sh`), so it runs the unpatched code.
- **Things that look harmless and are not.**
  - Never run `git worktree prune` from the host: container trees look "prunable" there and are not.
  - Leave `jarl/514-pkg-redaction-contracts` and `~/wt/514-pkg` alone. That work was deferred by Krzysztof on 2026-09-28, and 064 must not borrow its redaction detector.
  - Never run `npm ci` or `npm install` in the shared volume while another worker's hook runs. Only the Runes pickup changes the lock.
- **Check and hook.** `.git/hooks/pre-commit` runs `scripts/repo-check.sh` from the tree's toplevel. It takes about 15 minutes and has 18 steps, fail-fast per step:
  - install drift, typecheck, the e2e typecheck, lint, dead exports, build, the dist guard and pack-smoke;
  - `check --approve --only-deterministic` as a test prerequisite;
  - vitest with coverage of at least 90% on every metric, under an identity-less `GIT_CONFIG_GLOBAL` (fixture commits must use `tests/support/git-fixture.ts`);
  - the AST-cache audit, the Chromium guard and the portal Playwright run;
  - the docs build (vitepress) and markdownlint;
  - digest freshness (root, `examples/*/`, and fixtures with an anchor), prompt headroom, and finally `check --approve --only-deterministic` as the gate.

  Do not run it by hand before a commit; the hook does. Never use `--no-verify`.
- **Graph steps before every commit.** Unverified reviewer pairs fail the final gate step:
  1. `yg log add --node <n> --reason "<self-contained why>"` for each touched node of a `log_required` type. 12 types have it. The reason carries no file paths, issue numbers or plan references.
  2. Map any new source file. `coverage` is absent from `yg-config.yaml`, so the default `required: ["/"]` applies and an unmapped file is an error.
  3. `node source/cli/dist/bin.js check --approve`, which fills the reviewer pairs through `claude-code`. The graph has 12 reviewer rules and 63 script rules.
  4. Commit.

  Changes to `yg-architecture.yaml`, suppress markers and `review_by` dates need Krzysztof's word.
- **Merging into `release/6.1.1`.**
  - Run `git merge --no-ff --no-commit jarl/X`, then `git commit`. A clean `git merge` runs only `pre-merge-commit`, which does not exist here, so without this the gate never runs on the merged tip.
  - The yg-log and yg-lock drivers and the post-merge hook are not configured in this clone. Resolve `log.md` conflicts as a chronological union. Take the lock files from one side, then run `check --approve`. Re-run `npm run codes:update` when codes were added.
  - Do not "fix" the missing drivers with `yg init --upgrade`: it would install the very post-merge hook that 023 fixes.
- **CHANGELOG.** Entries go under `## [Unreleased]` in `CHANGELOG.md` (currently empty). The house style for patches is `### Fixed`, `### Security` and `### Changed` with bold lead sentences, as in 5.7.1 and 5.7.2. The language is product-only: no module, function or file names; commands, flags, keys and visible output only. One entry per user-visible change. The file is `merge=union`, so add bullets under pre-created headings. Notes worth adding:
  - re-verification costs from 1, 9 and 7 (071);
  - the hook needs `yg init --upgrade` for 026;
  - tightenings (D1, D3) go under "Before you upgrade".
- **Version bump for 6.1.1** (only on Krzysztof's word, after the Runes pickup if any). One green commit on `release/6.1.1`:
  1. `source/cli/package.json` `"version": "6.1.1"`, then `npm install` in `source/cli`, which updates the two version fields of `package-lock.json`. Coordinate with other workers, because it is the shared volume.
  2. `CHANGELOG.md`: `## [Unreleased]` becomes `## [6.1.1] - <date>` with a fresh empty `[Unreleased]` above it. `.github/workflows/release.yml` builds the release page from that section and fails without it.
  3. Refresh the digest labels with `node <repo>/source/cli/dist/bin.js init --upgrade` at the root, in each of the 7 `examples/*/` and in `source/cli/tests/fixtures/portal-coverage-only/`. The `cli=6.1.0` label lives in `AGENTS.md` and `.clinerules/yggdrasil.md`. The 6.1.0 bump commit `a6fa7cb04` shows the full set: 37 files, including the `.gitattributes` and `.yggdrasil/.gitignore` lines that `init --upgrade` added in the examples and the fixture.
  4. Optionally, the `@chrisdudek/yg@6.1.0` CI pins in `README.md` (51, 84, 170-171) and docs (`getting-started.md`, `the-lock.md`, `reviewers.md`). Find them with `git grep -n '@chrisdudek/yg@6.1.0'`.

  **Do not** touch `CLI_SUPPORTED_SCHEMA` (`core/graph-loader.ts:28`) or the `version:` in `templates/default-config.ts`. Both stay `6.0.0`, because the graph schema is unchanged. Before any release, run `npm run surface-truth` in `source/cli` on the tip. It is not part of `repo-check.sh`.
- **Other traps.** No package edits `templates/rules.ts` or `templates/digest.ts`, so no digest regeneration happens before the bump. Design notes go in the gitignored `.plans/`. CLI problems found on the way go to `.temp/dogfood-report.md` per AGENTS.md. Workers are spawned with an explicit model (opus) per the operating doc's rule.

Renumbering (2026-10-05): this loop now ships as family release 6.2.0 (Runes 1.1.0). The loop lives in releases/6.2.0 (use that --root), and the feature branches are release/6.2.0 in Yggdrasil and Grain and release/1.1.0 in Runes — read every "release/6.1.1" above as "release/6.2.0". Behaviour changes are allowed (ruling release-6-2-0), each with a `### Before you upgrade` CHANGELOG note when it can turn a repository red.
