# Yggdrasil 6.1.0: surface truth audit

## 1. Verdict

No. Nothing keeps the five surfaces consistent with each other or with the implementation. The knowledge topics, the docs site, `yg prime`, the schemas and `--help` are each written by hand, and they drift apart on their own. The audit found only narrow guards: the prime digest block matches its installed copies, and a few docs samples are regenerated from the CLI. None of them compares claims across surfaces.

Eight audit areas checked 1,081 claims against source (release/6.1.0) and against the live 6.1.0 CLI in scratch projects. They kept 212 findings. After merging duplicates found in more than one area, about 185 distinct defects remain:

- 1 blocker (escalated here, see B1)
- 30 majors
- about 154 minors

Roughly a third are implementation defects, where the surfaces describe the intended behaviour and the code does something else. Examples:
- a stale API key sent to a new provider
- nodes silently dropped while `yg check` passes
- `yg marketplace check` saying "Ready to publish" for packages that cannot be installed
- `--approve` writing a committed fingerprint over a conflicted log
- `next.command` values that the CLI itself refuses

The remaining two thirds are surfaces that are stale, contradict each other, or are silent.

How far each surface can be trusted:

- **Live CLI and code.** The reference truth, but not internally consistent. It contradicts its own notices (F9, LOG-09, AS-10) and builds `next:` commands the CLI then refuses (F3, PK-02).
- **docs/\*.md.** The most complete and usually the most accurate surface. When docs and knowledge or prime disagree, docs is usually right (CI hold-back, trailing suppress markers, the narrower context JSON, the dry-run lines). Its known weak spots:
  - stale samples
  - absolute claims ("fills nothing at all", "writes nothing", "only verifies")
  - the threat-model table
  - issue-code tables that cover only a slice of the emitted codes
- **Knowledge topics.** The least reliable. `cli-reference.ts` is a near-copy of the docs page that falls behind it. It still says `--health --json` is refused and `yg log read` has no `--json`. Its hash formula omits support files, it never mentions the CI hold-back, and its code table has fewer rows than the docs table.
- **`yg prime`.** Few errors, but the ones it has are high-impact, because agents read it every session. It is stale on the log gate, trailing suppress markers, the missing-reviewer abort, "status is rendering only", "advisory never blocks", and the list of commands that write logs.
- **Schemas.** Short files with a high error density:
  - timeout "ignored" by API providers
  - "any .md" reaching the reviewer
  - `port-names-empty` presented as an issue code
  - "bare string always effective"
  - a `log` node field that does not exist
  - "tracked" files for coverage
  - symlinks "followed"
  - no schema at all for the four package file formats
- **`--help`.** Flag names are reliable: a scripted scan found no nonexistent flag. Descriptions are not reliable (`--dry-run`, `--quiet`, `--platform`, `--check-determinism`). Two examples fail when run, and required options carry no marker.
- **CHANGELOG [6.1.0].** Mostly right. Six errors:
  - a nonexistent `yg marketplace new`
  - "declaring relations re-opens nothing"
  - `aspect-check-runtime-error` as an issue code
  - the position of `auto-filled`
  - the scope of `yg context` refusals
  - the log-cycle-open trigger
- **JSON contracts.** yg-check/1 is broadly right, but its edges on `-outside` findings, `next.target`, `suggestedNext` and the aborted `remaining` do not match the docs. yg-node/1 emits the deprecated `consumes` and emits `event_name` on structural relations. The fields of yg-log/1 and yg-aspect-log/1 are undocumented.

| Area | Claims checked | Findings kept | Major (verified) |
|---|---|---|---|
| check / fill / lock | 124 | 31 | 4 |
| config / reviewers | 142 | 26 | 5 (one escalated to blocker here) |
| graph model | 118 | 21 | 5 |
| relations | 78 | 17 | 2 |
| aspects / rules | 185 | 36 | 5 |
| packages | 150 | 27 | 4 |
| logs / merge | 94 | 20 | 3 |
| agent surfaces | 190 | 34 | 4 |
| **Total** | **1,081** | **212** | **32 raw; 1 blocker + 30 majors after merging** |

## 2. Cross-cutting causes

1. **One fact, many hand copies.** The same behaviour is written separately into docs/cli-reference.md, templates/knowledge/cli-reference.ts, rules.ts (prime), schema comments, commander help strings and the CHANGELOG. A 6.1.0 behaviour change typically reached docs and the CHANGELOG, while prime, knowledge and the schemas kept the old text:
   - CI hold-back of `auto_approve: full` (F7/CFG-10)
   - trailing suppress markers (AS-02)
   - support-file hashing (AS-06)
   - per-pair dry-run output (F16/AS-07)
   - `yg log read --json` (ASP-04/LOG-04/AS-16)
   - the missing-reviewer abort (F27/AS-23)
2. **No issue-code registry.** Codes are string literals scattered across emitters. check-codes.ts has partial sets (STRUCTURAL, APPROVE_GATING, SCOPED), but no catalogue of code, severity rule, stage and fix. As a result:
   - the docs and knowledge tables cover a small, different subset of codes each (F24)
   - more than 60 emitted codes have no reference entry: config-\* (CFG-22), graph (GM-13), relation (REL-08), log (LOG-06), package and adapt (PK-13), runner (ASP-25), and lock-environment, graph-load-failed, no-coverage and aspect-status-changed-outside-cli
   - a code that no longer exists is still documented (F2)
   - yg-error `code` is guessed by a regex over message wording (CFG-19, LOG-14, AS-25)
3. **Commands inside prose.** Remediation text hard-codes `yg check --approve` (F3, F4), and the `next:` line is recovered from prose by a parser (`leadingCommand`). Invoked flags get lost, and positional arguments are cut off, so `next.command` sometimes names a command the CLI refuses (PK-02) or turns a free run into a paid one (F3).
4. **Parallel implementations of one concept.** Each pair below implements the same concept twice, and the two copies disagree:
   - drill cases: drill runner vs marketplace check vs drill add (ASP-01, ASP-22, PK-16)
   - globs: mapping-entry glob vs `when.path` (GM-07)
   - file ownership: impact's resolver vs check's (GM-02, GM-06)
   - lock staleness: portal vs CLI (LOG-18)
   - directory filter: marketplace check vs install (PK-01, PK-08)
   - the log-gate set vs the documented set (M1)
   - ctx construction: drill vs aspect-test `--files` (ASP-09)
   - debug-log setup, done per command (CFG-09)
   - the node-not-found helper, used by some commands only (AS-05)
5. **Parsers of uneven strictness.** yg-node.yaml, the architecture top level, yg-aspect.yaml, `quality:` and tier config values accept unknown keys or wrong types silently. node_types entries, adapt files and the other config blocks reject them. Because there is no schema object per file format, `yg schemas` output, the docs field tables and the parser cannot be derived from one definition, and typos quietly turn off enforcement (GM-04, ASP-27, CFG-08, CFG-23).
6. **Absolute wording.** Examples: "fills nothing at all", "writes nothing", "never calls the model", "only verifies", "zero false positives by design", "never adds an edge from inside an ERROR", "exactly … untouched". Each is false at some edge the code handles differently, and those edges are what adopters hit.
7. **Hand-pasted samples.** Output samples in the docs predate the 6.1.0 output grammar (AS-19, ASP-31).

**Surfaces that should come from one source:**
- **Issue codes.** A registry generates the docs and knowledge code tables. Emitters may only use registered codes.
- **Flags.** The commander tree generates the flag sections of docs/cli-reference and knowledge cli-reference.
- **File formats.** One schema object per file format (all 8 YAML formats, including the package files) drives parser validation, `yg schemas read`, and the docs field tables.
- **JSON documents.** Types for the yg-\*/1 documents generate JSON Schema and the field lists in family-contracts.
- **The CLI reference.** Knowledge cli-reference becomes a rendering of the docs page, or a pointer to it, not a second hand-written copy.
- **Prime.** Prime keeps only protocol rules. Any behavioural statement links to or is built from the same fragment the knowledge topic uses.

## 3. Findings by area

Legend. Surfaces: D = docs page, K = knowledge topic, P = prime, S = `yg schemas`, H = `--help`, C = CHANGELOG, R = README, J = emitted JSON, CLI = runtime message or output. Severity: B = blocker, M = major, m = minor. "→ Mx" means the finding is merged into the consolidated major Mx in section 4.

### 3.1 check / fill / lock

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| F1 | m → M1 | D:the-lock, P, K:log-management | Any drifted log_required node → `--approve` fills nothing | Gate covers only nodes that own an unverified pair | See M1 |
| F2 | M → M4 | D:cli-ref table, K:cli-ref, K:configuration, K:writing-det, C | `aspect-check-runtime-error` is an issue code | Finding is `unverified`, cause `check-failed-to-run`. The token survives only in prose | Remove or rename rows; name the cause |
| F3 | M → M5 | D:cli-ref, C vs CLI and J | Infrastructure causes' `next` names the real fix | After a check.mjs failure, `next` is a bare `yg check --approve` with requiresUser false; drops `--only-deterministic` | `next` = edit check.mjs; retry with invoked flags |
| F4 | M → M6 | D:cli-ref, C | Every "then re-run" line keeps the invoked flags | Only the ABORTED path does. The log-entry-missing fix, the check.mjs fix and the approve-lock message hard-code `yg check --approve` | Thread the retry command through |
| F5 | m | D:cli-ref, K:cli-ref | `--approve` leaves .feature-field.json alone | `--approve` rewrites it. Only `--dry-run` and internal re-checks leave it alone | Reword |
| F6 | M → M7 | D:the-lock, D:cli-ref, D:configuration, H, K | `--only-deterministic` / `auto_approve: deterministic` touch no committed file | A hand status change writes the committed aspects/\<id\>/log.md | Say "no committed lock file", or skip under onlyDeterministic |
| F7 | m → M8 | D:the-lock, K ×3, P, S:config | `full` ⇒ `--approve`, no exception | Held back when CI is set | See M8 |
| F8 | m | D, K, H | `--dry-run` alone is a usage error | Valid when auto_approve makes the bare check a fill | Document |
| F9 | m | CLI vs CLI | Usage error says `full` fills | Contradicts the CI notice printed just above it | Use isCiEnvironment at check.ts:454 |
| F10 | m | D:cli-ref, D:family-contracts | `suggestedNext` = the `next:` line, or null; annotated with cost | Set even when text prints no `next:`; no annotation | Emit null, or document the fallback |
| F11 | m | D:cli-ref | `remaining` puts every error in one bucket | In an aborted document it covers the gate only; cost is 0 | Compute over all blocks, or document |
| F12 | m | D:concurrency | "Another approval is already running" | "Another fill is already running (…)" | Fix the quote (also LOG-07) |
| F13 | m | all silent | Command error codes listed | `lock-environment`, `graph-load-failed` undocumented | Add |
| F14 | m | D:the-lock, K:v&l | lock-invalid → yg-check/1 with restore-or-delete `next` | Fill path emits yg-error/1; conflict markers get take-one-side | Document both paths |
| F15 | m | D:configuration, K:configuration | Header shows `(auto-filled)` | Bare `auto-filled`, after the counts (also AS-18; C says "after the verdict word") | Fix all three |
| F16 | m | H, P, K | Per-node/per-aspect breakdown | One line per paid pair (cap 12); script pairs counted in one line | Align (also AS-07) |
| F17 | m | K:cli-ref | Dry run ends with a report showing log-entry-missing | No report; owed entries are listed under a note | Match docs |
| F18 | m | H, K | `--quiet` leaves only the report | Warnings and fix blocks still go to stderr | Reword |
| F19 | m | D, K | Four view tags; `--summary` takes `nodes` or nothing | Fifth tag `summary by node`; `--summary codes` accepted | Document or reject |
| F20 | m | D:cli-ref | A later plain read shows never-reviewed or stale | Script pairs show `deterministic-not-run` | Add |
| F21 | m → M30 | K:v&l, D:reviewers | rule hash = content.md or check.mjs; upgrades never invalidate | Support files, contract 2, kind, config observations; 6.1.0 re-opened verdicts | See M30 |
| F22 | m | D:the-lock, C | Hash exclusion list | Also `node_modules` at any depth | Add |
| F23 | m | D, K code tables | companion-runtime-error is an error | Error when enforced, warning when advisory | Fix |
| F24 | m | K:cli-ref table | log-entry-missing = `--approve` gate fired | Blocks every plain check; knowledge table lacks 5 codes the docs table has | Sync (also LOG-05) |
| F25 | m | all silent | — | `aspect-status-changed-outside-cli` warning undocumented | Add |
| F26 | m | R, H, D | Bare check never calls the model and writes nothing | `full` outside CI fills (paid); gitignored caches always written | Qualify (also CFG-21) |
| F27 | m | P, K:v&l | Missing reviewer = per-pair outcome | Full `--approve` aborts on config-reviewer-missing | Add abort (also AS-23) |
| F28 | m | D, K | Per-pair "not judged" line | Unavailable tier → aggregate warning only | Document |
| F29 | m | R, D:getting-started, D:configuration | CI step 1 rebuilds the cache, step 2 is the gate | Step 1 already exits 1 on any blocking finding | Reframe |
| F30 | m | D:cli-ref | `next.target` names what the step acts on | First member's node for a project-wide step | Leave empty or document |
| F31 | m | P | Interrupt is safe; only in-flight pairs lost | A hard kill can lose up to 2 batches of free script verdicts | Qualify |

### 3.2 config / reviewers

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| CFG-01 | **B** | CLI init, K:cli-ref, D:configuration | Provider switch: "will call … without [a key]"; a key never travels to another provider | Stale `api_key` in yg-secrets.yaml survives and outranks env. Live capture: Anthropic key sent as Bearer to an openai-compatible endpoint | Clear or replace on switch; fix the message |
| CFG-02 | M | D:getting-started, wizard | Env key used "without copying it to disk" | Flag path writes it to yg-secrets.yaml, where it then outranks env | Never persist env keys, or document |
| CFG-03 | m | CLI init | OPENAI_COMPATIBLE_API_KEY is also read by `openai` | `openai` reads OPENAI_API_KEY only | Delete the sentence |
| CFG-04 | m | D:configuration, D:cli-ref (self-contradictory) | Configuring a reviewer drops all config comments | Comments kept; secrets file re-serialized; `parallel: 4` added | Remove the warnings (also AS-09) |
| CFG-05 | m | S:config | API providers ignore `timeout` | All providers honour it; API default 60 s | Fix the comment |
| CFG-06 | m | D:configuration, D:reviewers | Only 429 is retried; one call per pair | Timeouts and network errors retried once: 2× wall time, 2 requests | Document, or retry only on connect errors |
| CFG-07 | m | K:configuration | `consesnsus:` → config-tier-unknown-key | → config-tier-consensus-invalid | Change the example |
| CFG-08 | m | D:configuration tip | Tier `config:` is the only lenient block | `quality:` typos also pass silently | Reject or document |
| CFG-09 | M | K (self-contradictory), D, CLI hint | `debug: true` logs every command; aspect-test and drill point to .debug.log | Only 12 commands set up the log; aspect-test and drill never write it | Set up in all commands; fix the text |
| CFG-10 | M → M8 | K:configuration, K:cli-ref, S, P | `full` ⇒ `--approve` | CI hold-back; triage views are read-only | Add |
| CFG-11 | M | D:the-lock threat table, D:reviewers | only-deterministic runs check.mjs only; adopt calls the reviewer | only-deterministic and adopt also run companion.mjs; adopt never calls a reviewer | Fix table or code |
| CFG-12 | m | D:the-lock, K:writing-llm | impact runs the resolver on cold companions | Never runs a companion; reports a potential upper bound | Reword |
| CFG-13 | m | D:reviewers, D:the-lock | Only the listed commands execute repository code | `yg simulate` runs the candidate check.mjs; the served portal's Approve runs `--approve` | Add both |
| CFG-14 | m | D:reviewers, K:configuration | CLI reviewers get "no tools" | copilot-cli denies 4 tool kinds and runs in the shared tmpdir | Reword |
| CFG-15 | m | CLI | Errors name the file they are in | Overlay syntax and value errors are blamed on yg-config.yaml | Attribute to the overlay |
| CFG-16 | m | K, D, S | An overlay never invalidates baselines | Overlay `reviewer.default`, tier set or coverage changes identity | Narrow |
| CFG-17 | m | D:cli-ref, D:getting-started | No network call / only a PATH check | codex and gemini-cli run a real probe call | Align with configuration.md |
| CFG-18 | m | H `init --platform` | "Only prints a notice" | Refreshes the rules on an existing repo without a TTY | Fix help |
| CFG-19 | m | D:cli-ref | Flag misuse → `usage` | init flag misuse → `command-error` | Pass `usage` |
| CFG-20 | m | D:configuration | Committed key: "revoke it — it is in the history" | Message branches; an uncommitted key → move it | Document both |
| CFG-21 | m | D, K, S | Plain check writes nothing | Writes gitignored caches (P is correct) | Align (also F26) |
| CFG-22 | m | all silent | Config codes documented | About 16 config-\* codes undocumented; each drops the whole config to defaults | Add a code table |
| CFG-23 | m | D, K, S | Tier config fields apply per tier | CLI providers ignore temperature, endpoint and api_key; bad types coerced silently; `config:` mandatory | Document or validate |
| CFG-24 | m | K:configuration | "standard \*_API_KEY" fallback | Variable per provider; openai-compatible has its own and may run without a key; ollama takes none | List them |
| CFG-25 | m | CLI wizard | "CLI — free" | Uses the subscription quota; the probe spends a call | Reword |
| CFG-26 | m | K:configuration | max_prompt_chars includes the node descriptor | Node path only; line numbers and suppressed ranges count | Fix |

### 3.3 graph model

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| GM-01 | M | S:node, P, D:nodes, D:glossary | Any directory with a yg-node.yaml is a node | Dropped silently under a directory with no node, or under an unparseable node; check passes | Error, or walk through; document |
| GM-02 | M | D:nodes, D:showcase, D:cli-ref | `impact --type` previews strict gaps before the flip | Shown only after strict is set; directory and glob mappings listed as orphans; misplaced never found | Reuse check's resolver |
| GM-03 | m | D:nodes | file-mapping-gitignored = untracked file | Keyed on .gitignore | Reword |
| GM-04 | M | S:node, D:nodes, K | Typos rejected loudly | Unknown node and top-level architecture keys ignored; scalar `aspects`/`parents` dropped | Reject |
| GM-05 | M | S:flow, K:flows, D:rfp | Flow files validated like others | One bad or missing flow file aborts every command with `graph-load-failed` and an absolute path | Per-flow finding; document |
| GM-06 | M | D:rfp, K:flows, D:cli-ref | Participants include descendants; impact reports flows | impact matches exact paths only | Resolve descendants |
| GM-07 | m | D:nodes, K, P, S, D:configuration | Mapping entries are minimatch, like `when.path` | Only `*` makes an entry a glob | Document the split |
| GM-08 | m | D:nodes, S:arch, D:showcase, CLI | `parents` limits nesting; cyclic types never instantiable | Top-level nodes are never checked | Enforce or document |
| GM-09 | m | S:node | `port-names-empty` is a blocking code | `yaml-invalid`; node dropped (also REL-10) | Reword |
| GM-10 | m | K:working-with-arch | No dedup with unmapped-files | Dedup under type_level (the init default) | Add the exception |
| GM-11 | m | D:nodes, S silent | Strict errors reported with the others | Architecture-fatal codes hide all per-node findings | Document or add a banner |
| GM-12 | m | D:nodes | Child wins; otherwise overlapping-mapping | Identical entries → `file-duplicate-mapping` | Document |
| GM-13 | m | all | Graph codes documented | About 12 graph codes have no entry | Add a table |
| GM-14 | m | D:rfp, K:flows | `nodes` and `participants` are full aliases | With both present, `participants` is silently ignored | Refuse both |
| GM-15 | m | S:node, S:arch | A bare attachment is always effective | The aspect's own `when` still applies | Reword |
| GM-16 | m | D:showcase | `node_type:` atom; `has_port` trivially true; `target` pins a node | None of these is true | Fix |
| GM-17 | m | D:glossary | Type-covered / port definitions | A strict match makes an orphan; the default port is implicit | Fix |
| GM-18 | m | D:nodes | A node with no aspects records nothing | Other channels give it verdicts; the logs lock always has an entry | Narrow |
| GM-19 | m | S:node, D:rfp vs J | `portNames` is the field | yg-node/1 emits `consumes` | Document or add |
| GM-20 | m | S:config | Uncovered *tracked* file; only nested .yggdrasil skipped | Disk walk including untracked files; nested .git also skipped | Fix |
| GM-21 | m | D:nodes, S:node, init template | `content:` regex over the file; `log` field; type keys | First 256 KiB, over 5 MB blocks; no `log` field; `relations`/`log_required` missing from the template | Fix |

### 3.4 relations

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| REL-01 | m | K ×2, P, D ×2 | Check independent of the lock | lock-invalid withholds relation findings | Move the pushes out of the lock try-block |
| REL-02 | M | D:rfp, K:p&r, P | Declare with an allowed type; event types for two-way links | Any type, emits/listens included, satisfies conformance | Restrict or document |
| REL-03 | M | D:getting-started, C (Breaking, Upgrading 7) | Declaring relations re-opens nothing; free | ctx.graph verdicts, including paid companion ones, go stale | Reword |
| REL-04 | m | D:cli-ref | `edges` on relation findings | null on `-outside` | Normalise |
| REL-05 | m | D:rfp | Never adds an edge from an ERROR | Rescans recover edges (same page says so) | Fix |
| REL-06 | m | D:rfp, K, P | Build layout matters for two languages | At least 8; Python/Go/Rust/C#/Ruby described only in C | Add sections |
| REL-07 | m | K, P | Recomputed from scratch, not cached | Parse facts cached in .ast-cache | Reword |
| REL-08 | m | D, K, P | Relation codes documented | 7 missing; 2 named nowhere | Add |
| REL-09 | m | D, K, S | `event_name` only on event types | Echoed on any type | Drop or document |
| REL-10 | m | S:node | See GM-09; the rule id cited is not in yg-check/1 | — | Same |
| REL-11 | m | D:rfp grammar table | Known gaps listed | No Rust row; JS `import defer` also ERRORs | Add |
| REL-12 | m | D:rfp, CLI | relation-parse-failed = parser load; reinstall | Also a single-file parser trap | Split the message |
| REL-13 | m | D:cli-ref | `edges` has one shape | `target` is a node or a file; `line` null for the type gate | Document |
| REL-14 | m | C | Context refuses narrowly | Also relation targets' ancestors and any nodeless error | See M29 |
| REL-15 | m | P, K, D:rfp | "Zero false positives by design"; "two properties" | 6.1.0 fixed false edges; three bullets | Reword |
| REL-16 | m | D:getting-started, D:glossary | No cycles; dependencies "match" | Structural types only; detected ⊆ declared | Fix |
| REL-17 | m | D:rfp | paths → baseUrl → package | A matched but unresolved pattern skips baseUrl; also typings/module; appended extensions | Fix |

### 3.5 aspects / rules

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| ASP-01 | M | D, K, P | drill add measures and exits non-zero on a miss | A .md case prints success, exits 0, the log contradicts it, and it is never run | Refuse or undo |
| ASP-02 | M | D:cli-ref, D:reviewers, CLI, K | A reasonless marker fails a pair on the first violation in its range | Poisons the whole file for every rule; reviewer pairs fail with no violation | Scope or document |
| ASP-03 | M | K:cli-ref | `--health --json` refused | Emits yg-aspects-health/1 | Replace |
| ASP-04 | m | K, D table | Rule log: `--limit` only; node log: no `--json` | `--top`/`--limit`/`--all`/`--json`; `yg log read --json` exists | Fix (also LOG-04, AS-16) |
| ASP-05 | m | P, D, H | `--check-determinism` is for script rules only | Not refused on a reviewer rule; makes a paid call | Refuse |
| ASP-06 | m | D:aspects, K | A recorded change is not warned about | Warning persists until the next fill; its fix is refused | Compare against the log |
| ASP-07 | M | S:aspect | Any .md file reaches the reviewer | Only content.md | Fix |
| ASP-08 | m | S, D:aspects, K | Script rules take ctx.config | Package rules only; `config:` key undocumented | Qualify (also PK-18) |
| ASP-09 | M | K:writing-det vs K:cli-ref | Graphless runner gives ctx.files only | drill gives subject/config; `aspect-test --files` doesn't, so a correct check reads as a bug | Unify ctx |
| ASP-10 | m | K, D | `drills/` reserved inside a rule directory | Skipped at any depth → aspect-undefined with a wrong fix | Scope it |
| ASP-11 | m | K, D:reviewers | `parseAst(file, language)` | Language ignored | Document |
| ASP-12 | m → M30 | K:v&l, D:the-lock | Hash formula and exclusions | Support files, `config:` observations, node_modules | See M30 |
| ASP-13 | m | P, K:writing-llm | Status is rendering only | enforced gates the det-skip and closure | Align |
| ASP-14 | m | P | Advisory never blocks | prompt-too-large blocks | Add |
| ASP-15 | m → M28 | P | Marker waives the line below | A trailing marker waives its own line | See M28 |
| ASP-16 | m | P, K, D | 4 suppressions warning codes | Plus `missing-reason` | Add (also AS-15) |
| ASP-17 | m | P | Log writers | drill add also writes | Add |
| ASP-18 | m | D, K | Health kind llm/det/aggregate; `label` column | "script rule"/"reviewer rule"; `signal` | Fix |
| ASP-19 | m | D | `Used by: (architecture/direct/implied/flow)` | Also inherited, port, type-covered; non-zero counts only | Fix |
| ASP-20 | m | D:aspects, D:cli-ref | A no-op status change is refused | Recorded, with from = "an unrecorded status"; yg-aspect-log/1 fields undocumented | Fix |
| ASP-21 | m | H, K | `--case` is a repo-relative glob | Corpus-relative, extension stripped | Fix |
| ASP-22 | m | K, D | Every file is a case | .md and yg-aspect.yaml excluded | Document |
| ASP-23 | m → M4 | D:cli-ref | Runtime-error codes are errors | Stderr token; severity follows status | See M4 |
| ASP-24 | m | D:reviewers, CLI | SUPPRESS_MARKER_MISSING_REASON | Four names for one failure; J uses `suppress-marker-invalid` | Pick one |
| ASP-25 | m | K:writing-det | Runtime error table complete | More than 12 codes and the arity-1 rule undocumented | Extend |
| ASP-26 | m | CLI | See .yggdrasil/aspects/README.md | File absent in adopters' repos (also AS-27) | Point to schema/knowledge |
| ASP-27 | m | S, D silent | — | Unknown yg-aspect.yaml keys (`stauts`) ignored | Reject |
| ASP-28 | m | S:aspect | References resolve "after symlink follow" | Symlinks are refused | Fix |
| ASP-29 | m | D:configuration, K | Every check has a 120 s budget | Only fills | Scope it |
| ASP-30 | m | K:aspects-overview | Runs in the main Node process | Worker threads during fills | Reword |
| ASP-31 | m | D:reviewers | aspect-test output sample | 6.1.0 grammar plus footer | Regenerate |
| ASP-32 | m | D, K | Suppressions kind vocabulary; `range` | `range.from` = marker line; single markers carry no waived line in JSON | Document or add |
| ASP-33 | m | D:glossary | "Not called: file-level"; one rule | The CLI label is `file-level`; lists and wildcard | Reconcile |
| ASP-34 | m | D:aspects | One call per check (paid) | Per unverified pair per fill, × consensus | Fix |
| ASP-35 | m | CLI | "no reviewer.type declared" | Also shown when aggregate was declared explicitly | Branch the wording |
| ASP-36 | m | H | — | Required options not marked | Add |

### 3.6 packages

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| PK-01 | M | D:packages, K:p&m, D:cli-ref | `marketplace check` is the pre-publish gate | "Ready to publish" for version mismatch, a bad `requires.yg`, symlinks, binaries, node_modules; install refuses all of them | Add the checks |
| PK-02 | M | CLI `next:`, J `next.command` | `next` is the runnable fix | Bare `yg pack update`, which is refused on an edited copy | Keep positional arguments |
| PK-03 | m | D, C, K | Summary shown before the swap | Shown after | Reorder or reword |
| PK-04 | m | D:packages | `pack add` refuses a same-name rule | Overwrites a rule at the install path | Refuse |
| PK-05 | M | D:packages, K | list/verify report the copy's integrity | Ignore unrecorded files; dot-files ignored by every check | Fix |
| PK-06 | M | D, K, CLI list/advise | "Take the newest" advice | The suggested `--to` pins a following package | Suggest a plain update |
| PK-07 | m | D:packages, D:cli-ref | Attention item; 12 classes | Nomination `package-update`, missing from the list (also AS-22) | Fix |
| PK-08 | m | CLI marketplace check | A dot directory must be declared | The consumer ignores it, so the suggested fix breaks install | Filter dot directories |
| PK-09 | m | C | `yg marketplace new` | Does not exist; `init` (also AS-30) | Fix |
| PK-10 | m | adapt stub | Not-adaptable list | Omits `description` | Add |
| PK-11 | m | P notice | Consumer ⇔ record file exists | An emptied record still triggers the notice | Check it is non-empty |
| PK-12 | m | CLI parser messages | "Re-run yg pack add" | Fails on the same parse error | Restore from VCS |
| PK-13 | m | D, K, glossary, R | Code references complete | `package-file-modified` and about 9 adapt codes undocumented; no glossary or README entry | Add |
| PK-14 | m | D, CLI | "The graph refuses to load" | Only the rule fails to load | Reword |
| PK-15 | m | K, CLI | dir-unlisted = directory not named | `./` or a trailing slash gives a false flag | Normalise |
| PK-16 | m | K, marketplace check vs drill runner | Case definition | Check counts directories only; the two disagree both ways | Reuse discovery |
| PK-17 | m | D:family-contracts | yg-marketplace/1 producers and consumers | `list` does not read it; verify, new and init do | Fix the row |
| PK-18 | m | S, D:aspects | ctx.config for script rules; schemas list | Local rules cannot set it; adapt files apply to own rules (undocumented); no package schemas | Add |
| PK-19 | m | D, CLI | Rule removed "with its adaptation" | adapt.log.md history also deleted silently | Mention |
| PK-20 | m | D, K | `--to` pins | Moved-tag `--to` exits 0 with no pin; `--to latest` records nothing | Fix |
| PK-21 | m | D trust model, C | No credentials recorded | Echoed in errors; 6.0.0 records keep tokens | Mask; add a scrub step |
| PK-23 | m | C Upgrading 11 | Upgrade covered | A stray 6.0.0 log.md: the "delete" advice loses history | Add a step |
| PK-24 | m | CLI advise | — | Nominations suggest hand-removing an installed rule | Name `pack remove` |
| PK-25 | m | CLI "why" | Two sources never collide | They collide (refused) | Reword |
| PK-26 | m | K | "Two consequences" | Four listed | Fix |
| PK-27 | m | CLI | Names the file at fault | Names a deleted temp path | Use a relative path |
| PK-28 | m | D:configuration | `*.tmp` = atomic write | Also pack fetch clones and the pack lock | Add |

### 3.7 logs / merge

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| LOG-01 | M → M1 | K, P, D:the-lock, D:cli-ref, D:progressive | Log gate is all-or-nothing | Gate set = nodes that own an unverified pair | See M1 |
| LOG-02 | M | C, D:cli-ref, K:cli-ref, CLI lock-invalid text | A conflicted log.md stops `--approve` | Not gating; closure advances the committed `source` over conflict markers | Gate it, or fix the text |
| LOG-03 | M | K ×2, D:the-lock, D:cli-ref, CLI | The merge recipe ends clean | merge-resolve moves only the baseline, so a new entry is owed; the recipe ends red | Document or fix |
| LOG-04 | m | K, D table | Node log has no `--json` | yg-log/1 exists | Fix |
| LOG-05 | m | K table, D add bullet, S:arch | log-entry-missing = the `--approve` gate | Raised by every plain check | Fix (also F24) |
| LOG-06 | m | D, K, P | Log codes documented | log-conflict, log-integrity, log-format (7 reasons) and log-cycle-open missing | Add |
| LOG-07 | m | D:concurrency | "Another approval…" | "Another fill…" (also F12) | Fix |
| LOG-08 | m | D:concurrency, P | Every log write holds .yg-log.lock | merge-resolve writes without a lock; writer list incomplete | Lock or document |
| LOG-09 | m | C, D:cli-ref, CLI | log-cycle-open appears only after only-deterministic runs | Appears in the ordinary loop, on never-verified nodes, mid-merge | Suppress or reword |
| LOG-10 | m | D:progressive, K | A malformed file always blocks | Log codes demoted to `-outside` | Document |
| LOG-12 | m | K, D:the-lock | Typo window lasts until closure | Until any full approve (non-log_required nodes) | Fix |
| LOG-13 | m | K | Sub-headings must be level 3+ | Only `##` is banned; check enforces more rules | Fix |
| LOG-14 | m | D:cli-ref | `usage` / `lock-invalid` codes | `command-error` in log read and merge-resolve | Pass codes |
| LOG-15 | m | CLI | A failed merge-resolve writes nothing | Writes the union before the lock read fails | Reorder |
| LOG-16 | m | CLI fix vs K | Never check out the whole lock | The log-integrity fix does exactly that | Target the node |
| LOG-17 | m | D, K | "Two modes"; "only verifies" | Three modes; always rewrites the baseline | Fix |
| LOG-18 | m | D:concurrency | Portal follows the same lock and 12 h rule | Portal has no age check | Reuse the CLI logic |
| LOG-19 | m | D:glossary | — | No log vocabulary; the lock entry omits the logs lock | Add |
| LOG-20 | m | D:cli-ref (init) | One .gitattributes entry | 5 lines, including `log.md eol=lf` | List them |
| LOG-21 | m | D:cli-ref, D:family-contracts | yg-log/1 fields | `schema` and the event object fields undocumented | Document |

### 3.8 agent surfaces

| id | sev | surfaces | claim | truth | fix |
|---|---|---|---|---|---|
| AS-01 | M → M1 | P, K, D:the-lock | Log gate is all-or-nothing | See M1 | — |
| AS-02 | M → M28 | P | Single-line marker waives the line below | A trailing marker waives its own line | See M28 |
| AS-03 | M → M29 | code vs C, P workflow | Context refuses only over relevant errors | Refuses over config-unknown-key, even from the local secrets file | See M29 |
| AS-04 | m | H examples | `yg incident list`; `yg simulate .yggdrasil/aspects/no-todo` | Both fail | Fix the examples |
| AS-05 | m | D:cli-ref, C | Uniform node-not-found | simulate replays and exits 0; aspect-test and tree use the old wording | Route through one helper |
| AS-06 | M → M30 | K:v&l, P | Rule hash = content.md or check.mjs | Support files folded in | See M30 |
| AS-07 | m | H, P, K | Per-node breakdown | Per paid pair (also F16) | Align |
| AS-08 | m | CLI init | "Nothing changed" | rules_artifacts written | Count it |
| AS-09 | m | D:cli-ref | Comments dropped | Kept (also CFG-04) | Remove |
| AS-10 | m | D:cli-ref, C | `next:` is the single last line; notices headed | context prints two `next:` lines mid-output; `then:` without `next:`; unheaded notices | Render per grammar |
| AS-11 | m | CLI context | `read:` paths can be opened | flows/model paths lack `.yggdrasil/` | Prefix |
| AS-12 | m | CLI `context --file` | Dependencies with ports | Dangling em-dash | Omit |
| AS-13 | m | H context | `--json`: "Same facts" | Narrower (D and K say so) | Fix help |
| AS-14 | m | P | Graph and log writers | pack and init write graph files; adopt and drill add write logs | List them |
| AS-15 | m | P, K, D, CLI "why" | 4 suppressions codes; "nothing else reports it" | 5 codes; check does report it | Fix |
| AS-16 | m | D table | `yg log` has no machine output | `--json` | Fix |
| AS-17 | m | P claim, K | Every flag is in the knowledge topic | At least 7 flags missing | Add or soften |
| AS-18 | m | K, D, C | `(auto-filled)` after the verdict word | Bare word after the counts | Fix |
| AS-19 | m | D samples | impact/tree/owner samples | Stale wording | Regenerate |
| AS-20 | m | C | Counts agree with nouns | "1 dependencies", "1 … pair belong", "2 nodes" for aspects | Fix |
| AS-21 | m | D, K | Hot spot = changes often | One (creating) commit is enough | Raise the floor |
| AS-22 | m | D advise list | 12 classes | 14 (package-update, imported) | Add |
| AS-23 | m | P | Missing reviewer is per-pair | Full `--approve` aborts (also F27) | Fix |
| AS-24 | m | D:platforms, R | Gemini CLI retired; Claude Code and Cline read AGENTS.md | gemini-cli is a live provider; those two need CLAUDE.md / .clinerules | Fix |
| AS-25 | m | D:cli-ref | Flag combinations → `usage`; code list | Several give `command-error`; `no-coverage` and `graph-load-failed` undocumented | Fix |
| AS-26 | m | K | incident exit codes; count at 0 | Unknown `--aspect` and missing `--reason` exit 1; "no incidents on record" | Fix |
| AS-27 | m | CLI | errs README pointer | Missing file (also ASP-26) | Repoint |
| AS-28 | m | H summary | type-suggest "designs" a type | Only matches existing types | Fix |
| AS-29 | m | D:cli-ref | Core workflow (6); grouping | 5; groups differ from `--help` | Fix |
| AS-30 | m | C | `yg marketplace new` | `init` (also PK-09) | Fix |
| AS-31 | m | P | A check report ends with `next:` | Omitted when the single block's fix is the step | Fix |
| AS-32 | m | P | Kind node/aspect | Also `Kind: file` | Add |
| AS-33 | m | D, K | Two non-comparable causes | Third: node or file absent at that commit | Document |
| AS-35 | m | D:cli-ref, C | Every `--help` has examples; unknown command = usage error | Subcommands have none; `yg foo --help` exits 0 | Fix |

## 4. Blocker and majors in detail

### B1 (CFG-01): a stale API key is sent to a newly configured provider
- **Surfaces say:**
  - init prints "No API key found in $OPENAI_COMPATIBLE_API_KEY; the reviewer will call http://localhost:9999/v1 without one."
  - K:cli-ref says "A missing key is non-fatal: the config is written anyway and can be fixed later by exporting the variable".
  - D:configuration:211 says openai-compatible "never reads OPENAI_API_KEY … an OpenAI key must not travel to it".
- **Implementation:**
  - init.ts:331-336 writes the secrets file only `if (apiKey)` and never clears an old key.
  - writeReviewerConfig replaces only the committed section.
  - api-utils.ts:17-20 does `if (config.api_key) return config.api_key;` before looking at any env var.
  - A live capture server received `"auth":"Bearer sk-ant-STALE-<fake, from the previous provider>"`.
- **Truth:** after a provider switch, the previous provider's secret goes to an arbitrary endpoint while the CLI says no key is used. Exporting the new variable does not help.
- **Why it is escalated to blocker:** it discloses a credential to a third party and contradicts a stated security property.
- **Fix:** on `--provider` or a wizard switch, remove or replace `reviewer.tiers.<bootstrap>.config.api_key` in yg-secrets.yaml. Make the "no key" message consult the overlay. Document the precedence overlay > env.

### M1 (LOG-01, AS-01, F1): the log gate is not all-or-nothing
- **Surfaces say:**
  - P rules.ts:283: "if ANY `log_required` node's source drifted with no fresh entry, `--approve` fills NOTHING that run".
  - D:the-lock:135: "the run fills **nothing at all** — no pair on any node, related or not".
  - K:log-management:111 says the same.
- **Implementation:** fill-classify.ts:232-236 says "The log gate's set: every component owning an unverified pair … nodeSet.add(p.nodePath)", and fill.ts:411 gates only that set. Live: pay (log_required, no pairs, no entry) did not stop "fill 1 pair · 1 script (free) … 1 passed", and error[log-entry-missing] appeared only afterwards.
- **Fix:** decide the contract. Either gate every drifted log_required node, or reword all five surfaces: "the fill stops when a component it would fill owes an entry; others keep the report red".

### M2 (LOG-02): a conflicted log.md does not stop `--approve`, and closure writes over it
- **Surfaces say:**
  - C:145: "puts a conflicted `log.md` … ahead of unverified pairs, since each stops the `--approve`".
  - D:cli-ref:538 lists log-conflict among the "gate prerequisites".
  - The lock-invalid fix says merge-resolve must run "before any `yg check --approve`".
- **Implementation:** log-conflict is absent from APPROVE_GATING_CODES (check-codes.ts:205). Live: `svc.source` moved from ee77b439… to b75e6099… while log.md still held conflict markers.
- **Fix:** add log-conflict (and log-integrity/log-format) to the pre-dispatch gate, or at least never advance `source` for a node whose log has markers.

### M3 (LOG-03): the documented merge recipe ends red
- **Surfaces say:** K:log-management gives the order "resolve the lock → `yg log merge-resolve --node <path>` → `yg check --approve`". The CLI after merge-resolve prints "next: git add … then: git commit, then yg check".
- **Implementation:** recordBaseline (log-merge-resolve.ts:375-377) sets only `entry.log`. Live: after the recipe, both `yg check` and `--approve` report error[log-entry-missing] at svc.
- **Fix:** document that merging a log_required node owes a new entry (the user's reason for the merge), or have merge-resolve keep the kept side's baseline so the union's newer entry counts as fresh.

### M4 (F2, ASP-23): `aspect-check-runtime-error` is documented as an issue code but never emitted as one
- **Surfaces say:**
  - D:cli-ref:846: "| `aspect-check-runtime-error` | error (`--approve` only) |".
  - C:44: "stopped and reported as `aspect-check-runtime-error`".
  - K:cli-ref:1715 and K:configuration:335 say the same.
- **Implementation:** live `--json` gives `('unverified','check-failed-to-run')`. The string occurs only in prose (fill-det.ts:291, fill-report.ts:75/191), and its severity follows the pair's status.
- **Fix:** replace the rows with `unverified` / cause `check-failed-to-run`, severity by status. Drop the legacy token from messages.

### M5 (F3): after a check.mjs failure, `next` escalates to a paid fill
- **Surfaces say:** D:cli-ref:380: infrastructure causes' `next` "names the real fix … rather than back at the command that just failed". The Next contract says `yg check --approve` is named only with its cost and "ask the user to approve it first".
- **Implementation:** live after `--approve --only-deterministic`: `"next": {"command":["yg","check","--approve"],"requiresUser":false}`. Source: ast/runner.ts:235 and structure/runner.ts:181, "Fix the bug in check.mjs, then re-run: yg check --approve".
- **Fix:** make `next` "edit \<check.mjs\>", with `then:` carrying the invoked command.

### M6 (F4): "then re-run" lines drop the invoked flags
- **Surfaces say:** D:cli-ref:727: "Every 'then re-run' line … names the command as it was invoked — `--only-deterministic`, `--dry-run` and `--full` included". C:145 says the same.
- **Implementation:** these three places hard-code the bare command:
  - check-log-state.ts:203: "Then re-run yg check --approve."
  - the runner's check.mjs fix
  - lock-store.ts:96
- **Fix:** pass the retry command through all three, or narrow the claim to the ABORTED report.

### M7 (F6): the free CI step writes a committed file
- **Surfaces say:** D:the-lock:83: "without ever needing a key or touching a committed file". D:cli-ref: "writes **only** the gitignored `.yg-lock.deterministic.json` cache".
- **Implementation:** fill.ts:536-540 calls recordAspectStatuses regardless of onlyDeterministic. Live: "rule 'readable' now stands at draft … written into its own log", and git showed `?? .yggdrasil/aspects/readable/log.md`.
- **Fix:** skip status recording under onlyDeterministic, or reword to "writes no committed lock file" and document the log write.

### M8 (CFG-10, F7): the CI hold-back of `auto_approve: full` is missing from every agent surface
- **Surfaces say:**
  - K:configuration:53: "\"full\": behaves as yg check --approve".
  - K:cli-ref:314: "bare `yg check` triggers a full fill".
  - S:config:31-33 says the same.
  - P rules.ts:118: "`full` like `--approve`".
  - D:the-lock:7 says the same, and D:how-it-works points to it for "the full `auto_approve` story".
- **Implementation:** check.ts:77 `if (autoApprove === 'full' && !isCiEnvironment(env))`. Live with CI=1: "note: auto-approve: full ignored — CI is set …". This is a documented 6.1.0 Breaking change in D:configuration and C. Triage views are also forced read-only (check.ts:424-428).
- **Fix:** add the hold-back and the triage-view override to the-lock, both knowledge topics, the config schema and prime.

### M9 (CFG-02): the flag path copies the env key to disk
- **Surfaces say:**
  - D:getting-started:35: "init uses it … without copying it to disk".
  - The wizard: "it is not copied to disk".
  - Code comment l.58-62: "never copied to disk".
- **Implementation:** init-reviewer-setup.ts:521-523 reads the env var, and init.ts:333-334 `if (apiKey) { await writeSecretsFile(...) }`. Live: yg-secrets.yaml contained `api_key: sk-ant-test-FAKE123`. This is the root cause of B1, and it also means a rotated env key is silently ignored.
- **Fix:** never persist a key taken from the environment.

### M10 (CFG-09): the debug hint points to a log that is never written
- **Surfaces say:**
  - K:configuration:58-59 limits the debug log to fills, while l.340 says "every command". The topic contradicts itself.
  - D:configuration:32: "append all CLI output".
  - aspect-test and drill print "set `debug: true` … it is written to .yggdrasil/.debug.log".
- **Implementation:** initDebugLog is called in only 12 command files. Live: with `debug: true` set, aspect-test printed the hint and no .debug.log was created.
- **Fix:** set up the log in every command after the graph loads. Fix the knowledge text.

### M11 (CFG-11): the threat-model table is wrong in both directions
- **Surfaces say:** D:the-lock:101-103: `--approve --only-deterministic` runs "every `check.mjs`" only; `yg adopt` runs check.mjs and companion.mjs "and the reviewed source is sent to the configured reviewer".
- **Implementation:** fill.ts:587-590 runs the post-fill report with `runCompanionHooks: true` whatever onlyDeterministic is. Live: a marker file was written by a companion.mjs during `--only-deterministic`. adopt.ts:336 runs `onlyDeterministic: true`, so adopt never calls a reviewer.
- **Fix:** disable companion hooks under onlyDeterministic, or correct the table and the CI guidance.

### M12 (GM-01): nodes are silently dropped while check passes
- **Surfaces say:**
  - S:node:4-6: "Every node is a directory under .yggdrasil/model/ containing this file".
  - D:nodes:76: "Nodes nest by directory".
- **Implementation:** graph-loader.ts:306-311 stops the walk at a directory with no yg-node.yaml, and :344 skips the children of an unparseable node. mapping.ts:619-633 raises node-yaml-missing only for directories that hold files. Live: "yg check: PASS 2 nodes"; the dropped node's file became type-covered.
- **Fix:** add a blocking finding for a node that is unreachable or dropped. Document that every ancestor directory must be a node.

### M13 (GM-02): `impact --type` gives no preview, and wrong gaps once strict is set
- **Surfaces say:** D:nodes:156: "Run `yg impact --type <id>` before you flip the flag; it previews which files would come out as orphans or misplaced". D:showcase:57 says the same.
- **Implementation:** impact-handlers.ts:715 `if (def.enforce === 'strict' && def.when)`. Owners are built from literal mapping strings (:724-737). Live: impact reported 3 orphans where check reported 1 orphan and 1 misplaced file.
- **Fix:** compute the gap for any type with `when`, labelled as a preview, using check's resolver.

### M14 (GM-04, with ASP-27, CFG-08, CFG-23): unknown keys silently disable enforcement
- **Surfaces say:** architecture-parser.ts:12-20 gives the stated rationale: "a silently-ignored typo drops an intended architectural constraint … Rejecting loudly". No schema says any file is lenient.
- **Implementation:**
  - node-parser ignores unknown keys: `relation:`, `aspect:` and a node-level `log_required` pass silently.
  - architecture-parser.ts:39 reads only `node_types`.
  - Lines :82 and :100 drop a scalar `aspects`/`parents`.
  - yg-aspect.yaml `stauts:` loads as enforced.
  - `quality:` typos and `temperature: hot` pass.
- **Fix:** strict per-file schemas with unknown-key and type errors, applied uniformly.

### M15 (GM-05): one bad flow file stops every command
- **Surfaces say:** S:flow says `nodes` is "required, non-empty". K:flows:39-40 says a missing description gives `description-missing`, which implies per-file findings.
- **Implementation:** graph-loader.ts:571-592 throws FlowLoadError, and preamble.ts:60 turns it into `graph-load-failed`. Live: an empty `flows/f2/` gives, for every command, "error[graph-load-failed]: Flow file $TMPDIR/…/yg-flow.yaml could not be loaded: ENOENT". The code is documented nowhere.
- **Fix:** report per-flow findings like nodes. Document that flows are one level deep and document the code.

### M16 (GM-06): impact ignores flow descendants
- **Surfaces say:** D:rfp:203: "Declaring a parent node as a participant includes all of its descendants". K:flows:92: `yg impact --flow` covers "all participating nodes (with descendants)".
- **Implementation:** impact.ts:303 `flow.nodes.includes(nodePath)`. Live: `impact --node a/b` → "Flows: (none)", while `context --node a/b` → "Participates in (1 flow): f1". `impact --flow` → "Blast radius: 2 nodes" but "All 1 participant would become unverified".
- **Fix:** use the same descendant-aware resolution as `yg context`.

### M17 (REL-02): any relation type sanctions an import
- **Surfaces say:** D:rfp:62: "Declare the relation … with a type the architecture allows". K and P rules.ts:112: emits/listens "are the sanctioned way to model a genuinely bidirectional relationship".
- **Implementation:** pass.ts:617-619 maps relations to target only. Live: declaring an emits/listens pair silenced relation-undeclared-dependency, with "PASS, issues []".
- **Fix:** restrict conformance to structural types (or architecture-allowed types), or document that any type counts and warn against the event-pair dodge.

### M18 (REL-03): declaring relations re-opens verdicts
- **Surfaces say:** D:getting-started:304 and C:31: "Declared relations are not an input to any verdict, so declaring them re-opens nothing". C:104 (Upgrading 7): "(free — …)".
- **Implementation:** ctx-graph records `graph:<node>`, and verify-lock.ts:776-783 hashes that node's yg-node.yaml. Live: `{"code":"unverified","cause":"stale","aspect":"reads-graph"}` after adding a relation. Companion-backed reviewer verdicts re-open the same way, and those are paid.
- **Fix:** "not an input unless a rule read the graph (ctx.graph or a companion); those pairs re-open".

### M19 (ASP-01): drill add reports success for a case it never measures
- **Surfaces say:** D, K and P: drill add "runs the rule over it"; a missed escape "exits non-zero"; an unmeasurable case "is taken back out".
- **Implementation:** drill-runner.ts:258-259 skips `.md` and yg-aspect.yaml. Live: "The rule 'no-b' behaves as expected on the new case", exit 0, while log.md says "The rule does NOT refuse it". The case never runs.
- **Fix:** refuse such paths up front, or treat zero measured cases as unmeasurable (undo and exit 1).

### M20 (ASP-02): a reasonless suppress marker poisons the whole file
- **Surfaces say:** D:cli-ref:852: "the first violation in its range makes the fill reject it". D:reviewers:599 says the same.
- **Implementation:** structure/runner.ts rangesFor parses the whole file on the first violation anywhere, and parseMarker throws for any reasonless marker. suppress-ranges.ts does the same for reviewer pairs with no violation at all. Live: `// yg-suppress(zzz)` (nonexistent aspect) left 4 pairs of different rules unverified.
- **Fix:** scope the failure to the marker's own aspect and range, or document the file-wide and reviewer-wide blast radius.

### M21 (ASP-03): knowledge says a working mode is refused
- **Surfaces say:** K:cli-ref:940-941: "`--health` … is refused together with `--json` rather than folded into the same schema".
- **Implementation:** live `{"schema":"yg-aspects-health/1","rules":[…],"wildcardMarkers":0,"telemetry":…}`, documented in D:cli-ref:1164 and family-contracts.
- **Fix:** replace the sentence with the schema description.

### M22 (ASP-07): the aspect schema misstates what the reviewer sees
- **Surfaces say:** S:aspect:4-14: "any number of .md content files … The .md content files are what the reviewer checks against source code".
- **Implementation:** only `contentFor(aspect,'content.md')` enters the prompt. Other files are hashed (edits re-bill) but never shown. Live dry-run: guidance.md was absent from the prompt.
- **Fix:** "exactly one content.md; other files are hashed, never shown".

### M23 (ASP-09): drill and `aspect-test --files` build different ctx
- **Surfaces say:** K:writing-det:26-30: the graphless runner "hands the check only ctx.files … ctx.subject … cannot run there". K:cli-ref:627: "A drill DOES supply ctx.subject … and ctx.config". The two topics contradict each other.
- **Implementation:** ast/runner.ts:196-213 adds subject/config only when graphAccessTrap is set, and only drill sets it. Live: `aspect-test --files` → "TypeError: Cannot read properties of undefined (reading 'length') … Fix the bug in check.mjs".
- **Fix:** one ctx builder for both commands. Correct both topics and the unsupported-capability message.

### M24 (PK-01): `marketplace check` passes packages that cannot be installed
- **Surfaces say:** D:packages: the check verifies "that the two manifests agree … that every rule loads under the same loader a consumer will use". K:p&m puts "raise version in both" right before "`yg marketplace check`", which implies the check catches a mismatch.
- **Implementation:** checkOnePackage (marketplace-check.ts:220-281) never compares versions and never checks `requires.yg`. It has no symlink or binary walk, and :247 exempts node_modules while install does not. Live: "Ready to publish", exit 0, then install refused four different ways.
- **Fix:** make the check a superset of the install refusals. Test it as a property: if check passes, install succeeds.

### M25 (PK-02): `next.command` is a command the CLI refuses
- **Surfaces say:** the finding's fix says "yg pack update house-style --reinstall", and the `next:` contract says it is the runnable step.
- **Implementation:** check-render-views.ts:120 leadingCommand stops at the bare positional argument. Live: `"next":{"command":["yg","pack","update"]}`, and running it gives "error[command-error]: The copy of 'house-style' has been changed … Nothing was updated".
- **Fix:** keep positional arguments for known subcommands, or carry `next.command` structurally from the emitter instead of parsing prose.

### M26 (PK-05): list and verify vouch for a copy that check blocks
- **Surfaces say:** D:packages: verify "the copy is exactly …"; list shows "whether each copy is still untouched"; refusal table: "A file among the copies that no package installed → `yg check` blocks".
- **Implementation:** isCopyIntact (packages.ts:53) ignores `drift.unknown`. package-store.ts:113 skips dot-files for every check. Live: list says "copy untouched", verify exits 0, check fails. `.hidden.mjs` was flagged by nothing, and `--reinstall` deleted both extra files silently.
- **Fix:** count unknown files in list and verify. Decide on dot-files and document the choice. Name deleted files on reinstall and remove.

### M27 (PK-06): the tool's own advice pins a following package
- **Surfaces say:** D:packages: "A package installed without a version follows the newest one … moved with `--to`, is pinned". Advise: "the command that takes the newest version (`yg pack update <name> --to <version>`)".
- **Implementation:** live list says "take one with: yg pack update house-style --to 0.2.0". Running it gives `requested: "0.2.0"`, now pinned.
- **Fix:** for a `requested: latest` package, suggest plain `yg pack update <name>`.

### M28 (AS-02, ASP-15): prime gives the 6.0.0 rule for trailing suppress markers
- **Surfaces say:** P rules.ts:453: "A single-line marker waives ONLY the line directly below it".
- **Implementation:** K:suppress-syntax says "a trailing single-line marker waives the line it sits on (never the line below)". C lists this as a 6.1.0 Breaking change. Live `yg suppressions`: "line 1: single(no-todo) → waives line 1".
- **Fix:** update prime, including trailing disable/enable.

### M29 (AS-03, REL-14): `yg context` refuses over unrelated config errors
- **Surfaces say:** C:147: "`yg context` refuses only over errors that affect the context it assembles … the context is given". P makes `yg context` mandatory before every edit.
- **Implementation:** build-context.ts:117-121 exempts only three codes, and affectsContext returns true for every other nodeless code. Live: `yg context --node pay` refused with exit 1 over `config-unknown-key … yg-secrets.yaml: unknown top-level key 'reviewr'`, saying "these errors leave part of that graph unreadable". It also refuses when a relation target's ancestor is in a cycle.
- **Fix:** replace the three-code exemption with an allow-list of the codes that actually change a node's context.

### M30 (AS-06, F21, ASP-12): the documented rule hash omits helper files
- **Surfaces say:**
  - K:v&l:211: "rule: sha256(content.md | check.mjs bytes)", with no `config:` observations.
  - K:v&l:302-304: "upgrading Yggdrasil must not invalidate verdicts".
  - P rules.ts:116 lists the inputs as subject files, content.md/check.mjs, scope and tier.
- **Implementation:**
  - pair-inputs.ts:53-61 folds every support file into the rule hash.
  - pair-hash.ts:227 sets DET_HASH_CONTRACT = 2 plus `kind`.
  - Observations include `config`.
  - artifact-reader.ts:74 skips node_modules.
  - D:the-lock:51 and C:33-35 document all of this, and say that 6.1.0 re-opened verdicts.
- **Fix:** update the frozen-contract block, the observation table and the exclusions; replace "must not invalidate" with the-lock's wording. Add support files to prime's input list and cost section, and to reviewers.md.

## 5. Structural recommendations

1. **Issue-code registry (highest leverage).**
   - One module lists each code: severity rule (fixed or by status), stage, gating membership, scoped/progressive eligibility, public cause names, a one-line meaning and a fix template.
   - Emitters must reference registry entries: a typed union, so an unknown literal fails `tsc`.
   - Generate the docs code tables and the knowledge code table from it.
   - A test fails if any registered code is missing from either rendered table, or if any documented code is not registered. That catches F2, F24, F25, GM-13, REL-08, CFG-22, LOG-06, PK-13 and ASP-25.
   - Retire regex inference of yg-error codes (`inferErrorCode`) in favour of explicit codes.
2. **Structured `next`.**
   - Emitters return `{argv, requiresUser, cost}`, not prose, and the text renders from it.
   - A fixture test executes every `next.command` produced by a corpus of broken states, and asserts it is not refused with `usage`/`command-error` and does not escalate cost beyond the invoked mode (F3, F4, PK-02).
3. **One schema object per file format.**
   - Covers yg-config, yg-secrets, yg-node, yg-aspect, yg-aspect.adapt, yg-architecture, yg-flow, yg-package, yg-marketplace and yg-packages.
   - It drives parsing, with unknown-key and type errors; `yg schemas list/read`, including the package files; and the docs field tables.
   - A test parses every example YAML block in docs and knowledge through the real parser (GM-04, ASP-27, CFG-08, CFG-23, GM-21, PK-18).
4. **JSON contract schemas.**
   - Derive JSON Schema from the TypeScript types of every yg-\*/1 document.
   - Validate emitted documents from a fixture matrix with `additionalProperties: false`.
   - A test asserts every schema field is named in family-contracts or cli-reference (GM-19, REL-04, REL-13, LOG-21, ASP-20, F10, F11, F30).
5. **One CLI reference, rendered twice.**
   - Make docs/cli-reference.md (or a structured source) canonical, and generate knowledge cli-reference from it, or reduce the knowledge topic to a pointer plus agent-specific guidance.
   - Generate flag tables from the commander tree; mark required options in help.
   - Keep the existing scripted scan of `yg <cmd> --flag` mentions as a CI test, and extend it to run every help example in a fixture (AS-04).
6. **Prime built from fragments.** Behavioural sentences in rules.ts (log gate, suppress semantics, reviewer absence, status semantics, log writers, `auto_approve`) should be imported from the same fragment modules the knowledge topics render. Prime then cannot keep a rule that knowledge has already changed (M1, M8, M28, ASP-13/14, AS-14).
7. **Quoted-output lint.**
   - Every backticked CLI message quoted in docs, knowledge, prime or the CHANGELOG must match a string or template in source (F12/LOG-07, F15/AS-18, PK-09/AS-30).
   - Docs output samples become golden files regenerated by a test from a fixture repository (AS-19, ASP-31).
8. **Claim tests for the invariants the docs sell.** Each should be a named test that cites the docs line it protects:
   - Log-gate scope: a drifted node with no pairs does or does not stop the fill (whichever is decided).
   - `--only-deterministic` and a bare check leave `git status` clean of committed files.
   - `--approve` refuses to run, or refuses to advance `source`, over a conflicted log.md.
   - After the documented merge recipe, `yg check` is green (or owes exactly one documented entry).
   - `marketplace check` passing implies `pack add` succeeding, on a matrix of malformed packages.
   - `pack list`/`verify` agree with the `package-file-modified` rail.
   - `impact --type` gaps equal check's strict findings; `impact --node` flows equal `context` flows.
   - drill add of any path either measures a case or refuses.
   - A provider switch never leaves a key that will be sent to the new endpoint.
9. **Wording policy.** Ban unqualified absolutes ("never", "nothing at all", "only", "zero … by design") in surfaces unless a claim test backs them. A simple lint can flag them for review.
10. **Release gate.** Run the cross-surface checks above (registry coverage, schema round-trip, next-command execution, quoted-output lint, claim tests) as a required step in the family release loop. Record any surface-drift findings in the release's issue loop before tagging, so a 6.1.x cannot ship a Breaking change documented on only two of the five surfaces.
