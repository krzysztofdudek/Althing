# Yggdrasil 6.1.0: questionable code and architecture

Scope: `source/cli/src` and `.yggdrasil/` on `release/6.1.0` at `007473ad`. Four angles contributed: correctness hazards (CH), concurrency and I/O (CIO), architecture and design (F), and graph versus code (GVC). Each surviving finding was re-verified independently, mostly by re-running the container dist in fresh scratch projects. Nothing already in flight is repeated here.

## 1. Verdict

The CLI is layered better than its size suggests:
- `core/`, `io/` and `utils/` never import `cli/`, and `core/` never calls `process.exit`.
- The relation allow-list really fires on an engine-to-command import.
- Atomic renames and per-pair persistence survive a SIGKILL during a fill.
- The repo's own graph passes: 473 nodes, 5663 verified.

The defects sit where the code meets its environment:
- **Line endings.** On a CRLF checkout, log integrity reports a rewritten history, and the fix it prints does not work (B1).
- **Nested `.gitignore` files** are not honoured by the mapping walk (M1).
- **Graphs below the git root** break `yg log merge-resolve` and `yg drill add` (M2).
- **Closed pipes** crash the run, both the process's own output and the reviewer's stdin (M3, M4).
- **Runaway rule scripts.** A deterministic check that never returns hangs the keyless gate with no message (M5).

A second group of defects is invisible to the green self-check:
- **Duplicated truths drift apart.** Copies of the `.gitignore` logic, the coverage split and the log gate each disagree with the canonical version (M1, M9, m9).
- **Several self-governance rules are hollow.** They key on literal file lists or single files that no longer match the code (M11, m14, m15, m16).
- **A test enforces the wrong behaviour.** The portal parity test asserts the numbers that diverge from `yg check` (M9).

Totals: one blocker, twelve majors and twenty-five minors. The blocker is B1, the CRLF log-integrity failure, which leaves Windows users on the Git default settings stuck. None of the others loses committed data. Several do lose paid reviewer work or keep CI red with a message that points at the wrong cause.

## 2. Cross-cutting themes

1. **One truth, several implementations, silent drift.** Each item is a copy or a transform that lives outside its canonical module, so its surface disagrees with `yg check`:
   - M1: `hash.ts` keeps its own copy of the `.gitignore` stack.
   - M9: the coverage split runs only inside the CLI `check` action.
   - m9: `build-context.ts` mirrors the log gate.
   - m20: eight literal `DEFAULT_PORT_NAME` copies.
   - m6: three readers of the `version` field.
   - m8: the file-system model and the text model of mapping ownership disagree.
   - M10: a server handler reaches the CLI's `process.exit` preamble.
2. **Hash and identity inputs are incomplete or not normalized.** The log prefix hash uses raw bytes (B1). Ignored files enter the fingerprint (M1). The rule hash omits modules that `check.mjs` imports (M7). Mapping paths are not canonicalized (m8). Each one produces "green here, red in CI" or the reverse.
3. **Error paths around child processes and streams have no handlers and no bounds.** Affected: M3, M4, M5, m1, m3, m4 and m5. The common failure is a raw Node stack or an unbounded hang instead of a message that names the provider, the rule or the file.
4. **Git and platform path semantics.** `git show <ref>:<path>` resolves from the repo root while the callers work from cwd (M2). Windows gets CRLF (B1) and `.cmd` shims (m5). On case-insensitive file systems, mapping paths are not case-checked (m8).
5. **Persistence design.** Every verdict rewrites the whole lock (M12). One failed write poisons the rest of the run (m1). Nothing prevents two processes from writing at once (m2). Append-only files grow without bound (m24).
6. **Hollow self-governance behind a green check.**
   - Rules keyed to literal lists or single files: M11, m14, m15, m16.
   - Type contracts the code does not honour: m13, m17.
   - Enforcement that sees only one syntax: m12.
   - Descriptions that contradict the code: m18.
   - Advice built on local-only evidence: M8.
7. **"Read-only" paths that write.** A plain `yg check` edits the tracked `.gitignore` (m10). `--only-deterministic` writes an aspect's `log.md` (m11).

## 3. Findings

| id | sev | title | where | suggested fix |
|---|---|---|---|---|
| B1 | blocker | `log.md` prefix hash uses raw bytes, so a CRLF checkout fails log integrity and the printed fix recreates the failure | `core/log/log-gate.ts:118-128`, `core/log-integrity.ts:36-39`, `io/graph-fs.ts:12-13` | Normalize line endings before offsets and hash on both write and validate; add a `log.md text eol=lf` rule to `.gitattributes` on init and upgrade |
| M1 | major | Mapping expansion ignores `.gitignore` files between the repo root and the mapped directory, so ignored files are hashed and reviewed, and CI goes red | `io/hash.ts:118-128, 212-225, 293-297, 334-339` vs `io/repo-scanner.ts:55-99` | Delete the copy in `hash.ts`; share one root-to-directory `.gitignore` stack; add a regression test |
| M2 | major | `yg log merge-resolve` and `yg drill add` fail for any graph below the git root | `utils/git-introspect.ts:59-89, 114-155`; callers `log-merge-resolve.ts:111-123`, `cli/log.ts:262`, `cli/drill-add.ts:101` | Use `<ref>:./<path>` or prefix the path from `getToplevelAndPrefix()`, the same for `show` and `ls-tree` |
| M3 | major | A closed output pipe (`yg check --approve 2>&1 \| head`) kills a running fill and loses the report and verdicts | `bin.ts:78-89` | Ignore EPIPE on process stdout and stderr; finish persisting before exit |
| M4 | major | A reviewer that exits without reading stdin crashes `--approve` with an unhandled EPIPE | `llm/cli-base.ts:274-276` | Attach `child.stdin.on('error')` and classify the error as infra |
| M5 | major | Deterministic checks have no time limit, so a spinning `check.mjs` hangs the keyless gate with no heartbeat | `structure/det-worker-pool.ts` (terminate only at :199) | Per-task wall-clock budget, terminate and respawn the worker, record a runtime-error disposition, heartbeat for the deterministic phase |
| M6 | major | A trailing `// yg-suppress(...)` waives the next line, not its own; the raw scan does not see it at all | `ast/suppress.ts:311-325, 355-357` vs `:336-341` | Reject trailing markers with a diagnostic, or waive the same line; have `yg suppressions` print the resolved range |
| M7 | major | The deterministic rule hash covers only the `check.mjs` bytes, so a change to a module it imports leaves a stale cached verdict | `core/pair-inputs.ts:45-47`, `core/pair-hash.ts:212-231` | Hash the whole aspect directory (plus the CLI or grammar digest), or reject local imports at load time |
| M8 | major | `yg advise` ignores the committed drill corpus and proposes demoting a secret-redaction rule on every fresh clone | `core/aspect-health-signals.ts:239-266, 319-326` | Count committed `violates-*` cases as drill evidence; report "drills exist, not run here" |
| M9 | major | Portal file counts differ from `yg check`, and a test locks in the difference | `cli/check.ts:86-92, 499, 560`; `portal/engine-api.ts:170-190`; `tests/integration/portal-extract.test.ts:404` | Move `applyHonestCoverageSplit` into core `runCheck`; test parity on a fixture with mapped and excluded files |
| M10 | major | The portal server exits for good when the graph cannot be loaded (its handlers call the CLI `process.exit` preamble) | `portal/engine-api.ts:4, 117-122`; `cli/preamble.ts:59-115` | Throwing core loader plus a thin exiting CLI wrapper; the portal renders an error page or returns 500 |
| M11 | major | Rule scripts in nested aspect folders (21 of 57) are ungoverned | `model/graph-rules/yg-node.yaml:7`; `yg-architecture.yaml:553` | Map `.yggdrasil/aspects/**/check.mjs` minus drills; add a test that every rule script has an owner |
| M12 | major | Lock I/O is quadratic: every verdict re-serializes, re-reads and rewrites the whole lock | `core/fill-writer.ts:147-173`; `io/lock-store.ts:575-610, 719-726, 784-812` | Coalesce writes (dirty flag, periodic flush plus final flush), keep a digest of the last write, write only changed partitions |
| m1 | minor | One failed lock write poisons the write chain; later verdicts are discarded and misreported | `core/fill-writer.ts:148-151`; `core/fill-pool.ts:33-45` | `writeChain.catch(noop).then(write)`; retry rename on EPERM/EBUSY; classify as an environment error |
| m2 | minor | No exclusion between processes: concurrent `--approve` (including the portal Approve button) and concurrent `yg log add` lose writes and report success | `core/fill.ts:212`; `portal/server/approve.ts`; `core/log/log-add.ts:72-79` | Lockfile around the read, fill and write cycle; portal returns 409 while a run is active; re-read after append |
| m3 | minor | The reviewer timeout does not bound a call when a grandchild process holds the pipes | `llm/cli-base.ts:221-272` | Spawn detached and kill the process group; settle on `exit` plus a bounded drain; `setEncoding('utf8')` |
| m4 | minor | gemini-cli passes the prompt in argv; E2BIG is reported as a network or credential problem | `llm/gemini-cli.ts:6-7`; `llm/cli-base.ts:256-259` (dead branch) | Send the prompt on stdin; wrap `spawn()` in try/catch |
| m5 | minor | Windows: the availability probe resolves `.cmd` shims but the reviewer spawn cannot start them | `utils/binary-check.ts:25-29`; `llm/cli-base.ts:210` | Move copilot-cli's shim handling into the shared CLI provider base |
| m6 | minor | The schema-version gate fails open for unquoted numbers and for a missing `version:`; three readers disagree | `core/migrator.ts:23-36`; `core/graph-loader.ts:137-150`; `cli/simulate.ts:207` | One reader; a non-string or absent version is an error |
| m7 | minor | Unknown top-level keys in `yg-config.yaml` are silently ignored | `io/config-parser.ts:194-247` | Known-keys check with a did-you-mean suggestion |
| m8 | minor | Mapping entries are not canonicalized (`src//app`, case mismatch), so the file-system and text ownership models split | `utils/mapping-path.ts:13-19` | `path.posix.normalize`; reject `..`; case-mismatch error |
| m9 | minor | The log gate is duplicated in `yg context` and diverges from it; `yg check` misdiagnoses an unreadable mapped file | `cli/build-context.ts:340-370` vs `core/log/log-gate.ts:43-72` | Export one `computeLogGateState`; emit `file-unreadable` |
| m10 | minor | A plain `yg check` rewrites the tracked `.yggdrasil/.gitignore` | `core/feature-index-write.ts:397-429` | Leave the edit to init/upgrade; emit a notice instead |
| m11 | minor | `--only-deterministic` writes an aspect's `log.md`, contrary to the docs and the code comment | `core/fill.ts:396-405`; `docs/the-lock.md:80` | Defer the entry to the full approve, or correct the docs |
| m12 | minor | The engine reads the clock and process state in forms the mechanical check cannot see | `core/fill.ts:130-137`; `core/check.ts:493`; `aspects/no-nondeterminism-direct/check.mjs:4` | Flag `new Date()`, `Date.now` references and `process.std*`; make `now`, `isTTY` and `write` required |
| m13 | minor | The "no I/O" layer contracts are hollow: utilities spawn git (including a network clone), and an engine module runs git and writes the lock | `yg-architecture.yaml:87, 179, 355`; `utils/git*.ts`; `core/log/log-merge-resolve.ts:230` | Split out a process-adapter type, or rewrite the descriptions |
| m14 | minor | `instrument-import-fence` gating list is behind the check split; its description misstates `cli/log.ts` | `aspects/instrument-import-fence/check.mjs:60-74, 84-88` | Derive the gating set from globs; regenerate the description |
| m15 | minor | `sibling-test-file` checks only `files[0]` of a node, yet declares `errs: exact` | `aspects/sibling-test-file/check.mjs:3` | Iterate over every command file in the node |
| m16 | minor | `command-exit-codes` and `count-parity-via-reuse` are narrower than their descriptions; the parity rule's positive check silently disappears on a node rename | `aspects/command-exit-codes/check.mjs:13-19`; `aspects/portal/count-parity-via-reuse/check.mjs:24-26` | Fail closed on an unknown node id; correct the descriptions |
| m17 | minor | The `when:` patterns of `ci-config` and `repo-config` overlap despite a comment claiming they are disjoint; a YAML-only rule is attached to TS/JS nodes | `yg-architecture.yaml:479-481, 503-506, 531-534` | Remove the duplicate entries; scope `ci-actions-pinned` |
| m18 | minor | Stale graph descriptions: the removed external-judge channel in four nodes; `example-self-contained` "never blocks" while enforced | `model/cli/core/review-package`, `reviewer-dispatch`, `formatters`, `tests/unit/cli/graph`; `aspects/example-self-contained/yg-aspect.yaml:12-15` | Sweep and rewrite; add a check for names of removed commands |
| m19 | minor | `yg aspects` labels hierarchy inheritance as "implied" | `cli/aspects.ts:104-111` | Add an `inherited` bucket |
| m20 | minor | Relation rules push code into literal copies and pass-through wrappers; type-only imports are invisible to the graph | 8× `DEFAULT_PORT_NAME`; `portal/server/page.ts`; `portal/engine-api.ts` | Whitelist leaf model modules, or count type imports as edges; delete the copies |
| m21 | minor | God functions, and CLI action bodies that hold engine logic | `io/aspect-parser.ts:117` (620 lines), `relations/pass.ts:219` (604), `cli/check.ts:124` (453), `cli/impact.ts:53` (453) … | Action bodies only parse, call core and render; enforce a length cap |
| m22 | minor | Exported production code with no production caller | `relations/audit.ts`, `llm/aspect-verifier.ts:93`, `io/hash.ts` `hashPath` and `perFileHashes`, and more | Delete or move to test support; add a dead-export check to CI |
| m23 | minor | Portal regex-parses human CLI text; `exitAfterFlush` is used by 9 of about 25 command files; `drill` and `drill-add` import each other | `portal/server/approve.ts`; `cli/simulate.ts:849-851`; `cli/drill.ts:2` ↔ `cli/drill-add.ts:7` | Machine-readable dry-run budget; route exits through `exitAfterFlush`; extract a drill-core module |
| m24 | minor | Events sidecar never rotates (the reader's `.1` branch is dead), the committed stream grows forever, and "every file is written by rename" is false | `io/events-store.ts:100-111`; `io/events-reader.ts:97-113`; `docs/concurrency.md:21, 67` | Implement rotation or remove the reader branch; narrow the docs claim |
| m25 | minor | Content predicates scan only the first 256 KiB with no trace, and a misnamed `timeout` flag is set and then dropped | `core/file-when-evaluator.ts:29-36, 226` | Report truncation in the predicate trace; remove the flag or pass it on |

## 4. Details: blocker and majors

### B1: CRLF checkout breaks log integrity, and the printed fix repeats the failure

- **Evidence.**
  - `log-gate.ts:118-128` hashes `Buffer.from(content,'utf-8').subarray(0, newest.offsetEnd)`.
  - `log-integrity.ts:36-39` validates against the same raw bytes.
  - `readTextFile` does no normalization. `io/hash.ts:26-38`, by contrast, normalizes CRLF for every other hash so that a verdict survives a line-ending change.
  - The verifier used a real autocrlf checkout (`git config core.autocrlf true; rm log.md; git checkout -- log.md`). `od` showed `\r\n`, and `git status` was clean.
  - `yg check --no-approve` then failed with `Log integrity broken (prefix_modified)` and `Fix: Restore from git: git checkout HEAD -- …`. Following that Fix exactly still fails.
  - The `.gitattributes` written by init has no eol rule for `log.md`.
- **Impact.** Git for Windows installs with `autocrlf=true` by default. Every node with a baselined log fails `yg check` on a clean clone, with a message that accuses the user of tampering with history, and there is no way out.
- **Fix.** Normalize line endings before computing offsets and the hash, on both the baseline write and the validation. Existing LF baselines hash the same after normalization, so no migration is needed. Also add `/.yggdrasil/model/**/log.md text eol=lf` in init and `--upgrade`.
- **Verifier.** Reproduced with a real autocrlf checkout, not simulated with sed. Not in flight.

### M1: Nested `.gitignore` files are ignored by mapping expansion

- **Evidence.**
  - `src/.gitignore` holds `*.gen.ts`, and the node maps `[src/app]`. The check refuses on `src/app/x.gen.ts:2`, while the coverage header counts `3/7 files` (the coverage walk does exclude the file).
  - Approving with the ignored file present and then deleting it leaves `git status` empty but gives `unverified (not yet reviewed)`. That is exactly what a fresh CI clone sees.
  - `hash.ts:118-128` loads only the root `.gitignore`. Its comment at :136-137 says it "Mirrors the C-27 fix in io/repo-scanner.ts", so the duplication is known.
- **Impact.** Generated or ignored files are fingerprinted, fed to deterministic rules and to LLM reviewers, and make approved locks stale on every clone. The result for the same file depends on whether the mapping is `src` or `src/app`.
- **Fix.** Use one shared `gitignoreStackFor(projectRoot, dir)` taken from `repo-scanner`, and delete the copy along with the dead `hashPath` and `perFileHashes`.
- **Verifier.** Reproduced. Downgraded from blocker because the trigger is narrow (a `.gitignore` strictly between the root and the mapping) and there is a workaround (move the pattern to the root `.gitignore`).

### M2: A graph below the git root breaks `merge-resolve` and `drill add`

- **Evidence.**
  - In a monorepo with the graph in `app/`, the ours and theirs branches each ran `yg log add`. The merge conflicted and was resolved by union.
  - `cd app && yg log merge-resolve --node svc` then prints "Could not read … Check the refs with git rev-parse" and exits 1.
  - From `app/`, `git show HEAD:.yggdrasil/model/svc/log.md` gives `fatal: path 'app/…' exists, but not '…'`, while `ls-tree` lists the blob. `getFileAtRef` finds the file with `ls-tree` and rethrows the `show` error.
  - `readFileAtCommit`, which `drill add` uses, has the same mismatch (the researcher ran it; the verifier read the code).
- **Impact.** Monorepo and nested-graph users cannot use the documented log-merge tool or add drill cases. The error message sends them to refs and paths that are fine.
- **Fix.** Use `<ref>:./<path>`, or prefix the path with the value from `getToplevelAndPrefix()`, and use the same path for `show` and `ls-tree`. Add tests that run from a subdirectory graph.
- **Verifier.** Reproduced; not in flight.

### M3: A closed output pipe aborts a fill

- **Evidence.**
  - `bin.ts:78-89` handles `unhandledRejection` and nothing else; there is no error listener on `process.stdout` or `process.stderr`.
  - `(yg check --approve) 2>&1 >$TMPDIR/o | head -2`: the report file was 0 bytes and `yg-lock.nondeterministic.json` was never created, so 0 of 40 LLM verdicts landed.
  - `yg check --json | head -c 50` gives `PIPESTATUS=1 0` and prints `Error: write EPIPE`.
- **Impact.** Agents routinely pipe output through `| head`. Doing that to an approve aborts a paid fill, orphans reviewer children that are still being billed, and forces exit code 1.
- **Fix.** Ignore EPIPE on stdout and stderr (stop writing, keep working), and make `--approve` persist its verdicts before exiting.
- **Verifier.** Reproduced; not in flight.

### M4: EPIPE on the reviewer's stdin crashes `--approve`

- **Evidence.**
  - `cli-base.ts:274-276` calls `child.stdin.write(prompt); child.stdin.end();` with no error listener on `child.stdin`.
  - A fake `claude` that answers `--version` but exits without reading stdin: 3 out of 3 runs died with `Unhandled 'error' event … write EPIPE at ClaudeCodeProvider.verifyAspect`, exit 1, no report and no lock written.
- **Impact.** A reviewer that fails fast (expired login, rejected flag) produces a raw Node stack instead of an infra message that names the provider. GC and closure steps are skipped, and sibling reviewer calls are orphaned.
- **Fix.** Add a stdin error handler that folds the error into the infra classification and lets `close` settle the promise.
- **Verifier.** Reproduced 3 of 3. It is distinct from the in-flight item about lost stderr.

### M5: No time limit on deterministic checks

- **Evidence.**
  - An aspect with `check(ctx) { while (true) {} }`: `timeout 40 yg check --approve --only-deterministic` gives exit 124.
  - The last output is "1/2 filled (1 ok)", with no heartbeat naming the aspect.
  - `det-worker-pool.ts` has no per-task timeout; `terminate` appears only in `destroy` (:199).
- **Impact.** The free keyless CI and pre-commit gate hangs until the CI job's own timeout and gives no hint which rule is to blame. Catastrophic regex backtracking in a rule copied in by `yg pack add` is a realistic trigger.
- **Fix.** A configurable per-task budget. On expiry, terminate and respawn the worker, record a runtime-error disposition naming the aspect and unit, and extend the heartbeat to the deterministic phase.
- **Verifier.** Reproduced.

### M6: A trailing suppress marker waives the wrong line

- **Evidence.**
  - Line 2 is `const a = fs.readFileSync("x"); // yg-suppress(no-sync) …` and line 3 is `const b = fs.readFileSync("y");`. The check reports only line 2, so line 3 was silently waived.
  - `yg suppressions` shows `line 2: single(no-sync)` and never names the line actually waived.
  - The AST path (`suppress.ts:311-325`) accepts a marker after code. The raw path (:328-341) says a marker-shaped token after code is not a marker. The two paths disagree.
- **Impact.** The most common idiom from other linters (`eslint-disable-line`, `# noqa`) leaves the intended line red and silently waives an unrelated one. That undermines the gate itself.
- **Fix.** Detect a comment node that shares its row with code, and reject it with a diagnostic (or waive that same line). Have `yg suppressions` print the resolved range.
- **Verifier.** Reproduced. It is distinct from the in-flight reason-less marker item.

### M7: The rule hash ignores modules imported by `check.mjs`

- **Evidence.**
  - `check.mjs` imports `./limit.mjs`. Changing `LIMIT` from 100 to 1 leaves both `--no-approve` and `--approve --only-deterministic` at "2 verified", and the rule does not re-run.
  - Adding one comment line to `check.mjs` makes it refuse.
  - `pair-inputs.ts:45-47` hashes only `check.mjs`. Neither the CLI's own `@chrisdudek/yg/ast` version nor the grammar wasm files are in `computeDetInputHash` (read from code only).
- **Impact.** Tightening a factored rule does nothing locally, because the gitignored cache keeps the old verdicts, while a fresh CI clone re-runs the rule. The result is green locally and red in CI, or the reverse, with no signal about why.
- **Fix.** Hash the whole aspect directory plus a CLI or grammar digest, or reject any import other than `@chrisdudek/yg/*` and node builtins.
- **Verifier.** Reproduced. Nothing in the docs or the source says whether relative imports are allowed.

### M8: `yg advise` demotes a rule while ignoring its committed drills

- **Evidence.**
  - On a fresh clone, `yg advise` proposes demoting `provider-redaction-cascade` because it has "no regression drill on record".
  - The repo commits `drills/violates-raw-prompt-log` and `satisfies-metadata-only` for that aspect.
  - `computeDrillStatus` (`aspect-health-signals.ts:239-248`) reads only the gitignored `.drill-results.jsonl`, and `demotionCorroborated` (:325-326) treats `none` as corroboration.
- **Impact.** The anti-Goodhart gate passes by default on every clone and CI job. The tool recommends weakening a secret-redaction rule that has committed proof it works, and tells users to add a drill that already exists.
- **Fix.** Treat committed `violates-*` cases as evidence, or report "drills exist, not run here".
- **Verifier.** The demotion half reproduced on a fresh clone. The promotion half (n=2 on an intentionally advisory rule) depended on the reporter's local fill and was not reproduced.

### M9: Portal counts differ from `yg check`

- **Evidence.**
  - Setup: `coverage.excluded: [src/gen]`, node mapping `src`.
  - `yg check` prints `3/7 files (1 node-owned, 0 type-covered, 2 excluded)`.
  - `yg portal --static` embeds `coveredFiles:3, excludedFiles:0`.
  - `applyHonestCoverageSplit` has two callers, both inside the CLI action (`check.ts:499, :560`).
  - `portal-extract.test.ts:404` asserts that the portal reads `CheckResult` unmodified.
- **Impact.** The organization-facing view overstates enforced coverage, which is exactly what the split exists to prevent. The parity rule (`runcheck-injected-input-parity`) only polices inputs to `runCheck`, so it cannot see a transform applied after it.
- **Fix.** Compute the split inside core `runCheck`, delete the CLI-side mutation, change the test to assert equality with the CLI header, and extend the rule to forbid mutating the counters outside `core/check`.
- **Verifier.** Reproduced; not in flight.

### M10: The portal server exits when the graph cannot be loaded

- **Evidence.**
  - `engine-api.ts:4` imports `loadGraphOrAbort` from `cli/preamble.ts`, which calls `process.exit(1)` at lines 59, 68, 77, 90 and 115.
  - Repro: the first `/data` returns 200. After writing a flow with `nodes: []`, `/data` and `/` both return 000, and the portal log ends with `EXIT=1`.
  - The router's try/catch (`router.ts:147-157`) cannot catch a `process.exit`.
- **Impact.** An ordinary edit (a half-written flow file, an `--upgrade`, a branch switch) kills the server whose job is to stay up while the graph is edited, and the browser gets no error page. The graph declares the portal → `cli/preamble` edge, so no rule flags it.
- **Fix.** Split the preamble into a throwing core (a typed `GraphLoadError` carrying the message) and a thin CLI wrapper that prints and exits. Remove the edge from the graph, and add a rule that nothing under `portal/server` reaches `process.exit`.
- **Verifier.** Reproduced; not in flight.

### M11: Nested rule scripts are ungoverned

- **Evidence.**
  - `graph-rules` maps `.yggdrasil/aspects/*/check.mjs`, one level only. 21 of the 57 non-drill rule scripts sit deeper (16 under `portal/*`, 5 under `reference/*`).
  - `yg owner` on `aspects/portal/loopback-only/check.mjs` says "excluded from graph coverage by design … No action needed".
  - `yg type-suggest` on those paths says they are auto-exempt, so the `rule-script` type's `when:` never classifies anything.
  - The glob in `no-nondeterminism-direct` is also single-level, although its comment says "including nested".
- **Impact.** Security-flavoured rules (`no-secrets-import`, `loopback-only`, `approve-shells-cli-only`, `no-secrets-strings`) escape `deterministic`, `no-direct-fs`, `no-side-effects-on-import` and `source-hygiene`. Nothing reports the gap, and the node description claims full coverage.
- **Fix.** Use `.yggdrasil/aspects/**/check.mjs` minus `**/drills/**` in both the mapping and `when:`, and add a test that every non-drill rule script has an owner.
- **Verifier.** Reproduced. Rated major because 37% of the graph's own rule scripts are misdescribed and nothing signals it.

### M12: Quadratic lock persistence

- **Evidence.**
  - `setEntry` awaits `persistLock` for every verdict (`fill-writer.ts:147-173`). `writeLock` sorts and serializes each partition in full, reads the file back to compare, and renames.
  - Two measurements on a clone of the repo (5663 pairs, 4383 deterministic, deterministic cache removed): 2524 renames and 837 MB, and in the re-run 2885 renames and 993 MB, to produce an 834 KB file in 50 s.
  - A CPU profile puts `writeLock` at 109 ms of 4.2 s at 500 pairs, 1.67 s of 15.9 s at 2000 pairs, and 13.3 s of 73 s at 4000 pairs.
- **Impact.** Cost grows with pairs times lock size. A cache miss on a large graph pays minutes of pure serialization, which undercuts the "cheap CI gate" claim, and the disk churn inside a watched repo triggers IDE and watcher storms.
- **Fix.** Coalesce writes (a dirty flag, flush on a timer or every N verdicts, a final flush on `drain` and on SIGINT). Emit events after the flush that contains them, to keep the ordering guarantee.
- **Verifier.** The two angles disagreed: the CIO verifier rated it minor because the claimed 46% wall-time share is overstated (about 18% CPU at 4000 pairs), and the F verifier kept it major. The byte churn and the quadratic growth are confirmed by both. It is kept as major as a performance cliff that current sizes only begin to show. The per-verdict write is deliberate for interruption safety, so any fix must keep that property.

## 5. What is solid

- **Layering.** No `core/`, `io/`, `utils/` or `model/` module imports `cli/`. `core/` has no `process.exit`. The only `io` → `core` edge is one type-only import. The only upward edge is portal → `cli/preamble` (M10).
- **Relation enforcement is real.** An injected engine-to-command import produced `relation-undeclared-dependency`. All deterministic drills pass.
- **Crash safety of the lock.** Temp names are unique and renames are atomic. A SIGKILL during a fill kept 2639 deterministic verdicts and a lock that parses. Per-pair persistence survives interruption as documented.
- **Loud failure on unreadable graph or lock files.** These are not swallowed.
- **Scale basics.** No EMFILE with 6000 mapped files at `ulimit 256`. Porcelain and `diff -z` parsing is correct.
- **Config sub-blocks reject unknown keys** with a clear reason (only the top level lacks this check, m7).
- **Approve works without commits and without git.**
- **The repo's own graph passes:** 473 nodes and 5663 pairs verified under `--only-deterministic`.

## 6. Completeness critique

- **Windows was never run.**
  - B1 was reproduced with Linux git configured for autocrlf. m5 (`.cmd` shims) and the Windows half of m4 (32,767 characters) were read from code only.
  - To close: a Windows CI runner with default Git for Windows settings, running init → log add → approve → clone → check, with npm-installed `claude`, `codex` and `gemini` shims.
- **The macOS case-insensitive half of m8 was not reproduced,** because the host dist is stale. Also untested: Unicode NFC/NFD file names on APFS and symlinks inside mappings. To close: a fresh host build plus a fuzz pass over mapping spellings.
- **No keyed LLM run.**
  - m2 (concurrent `--approve` losing paid verdicts) and m3 (real providers leaving helper processes behind) rest on fakes or on code reading.
  - To close: a smoke fill against a cheap real model with two concurrent approves, plus a process-tree dump at timeout.
- **Not covered by any angle.**
  - The package system, except incidentally in M5 and M7; it has its own audit.
  - Portal HTTP security beyond the approve path: the `X-Yg-Portal` header as a CSRF guard, DNS rebinding against loopback.
  - Correctness of the relation extractors per language (the 344-line C# extractor is flagged only for size).
  - Progressive mode with shallow clones.
  - Migrating real 6.0.0 graphs through `--upgrade`.
  - SIGINT during the LLM phase.
  - Git worktrees and submodules; memory use on very large repos.
- **Test-suite quality was only sampled.** M9 shows a test that locks in the wrong behaviour, which suggests others exist. To close: mutation testing on the parity, log-gate and hash modules, and a lint that flags tests asserting "unmodified" reads of a result that another surface adjusts.
- **Self-governance was probed rule by rule, not swept.** M11 and m14–m16 were found by hand. To close: a meta-check that every aspect's `when`, glob or literal list matches the files of the nodes it claims, and that every `errs: exact` rule has a drill per file of a multi-file node.

## 7. Refuted or narrowed claims

No finding was refuted outright. The verifiers narrowed these sub-claims:
- **CIO-4 (now M12):** "46% of wall time in `writeLock`" is overstated because async durations overlap with worker execution. About 18% CPU at 4000 pairs.
- **CIO-5 (now m11):** "CI gets committed-file churn" is refuted. A fresh CI checkout has no deterministic cache, so every rule is a first sighting and nothing is written.
- **F3 (now m6):** "A newer graph silently evaluated as 6.x" is unlikely. Any version the CLI writes is three-part semver, which YAML keeps as a string; only a hand edit to a bare number bypasses the gate.
- **F5 (now m2):** the core concurrent-approve hazard is a documented limitation (`docs/concurrency.md`). Only the unguarded portal Approve button is new.
- **F11 (now m25):** "the 256 KiB limit is undocumented" is false. `templates/schemas/architecture.ts:27` documents it.
- **GVC-2 (now m10):** the `.gitignore` rewrite is a deliberate backstop that has shipped since 6.0.0 and fires at most once. It was downgraded from a defect to doc drift plus a one-time edit.
- **GVC-3 (now m12):** "the LLM `deterministic` rule wrongly approved" is refuted. Its `content.md` exempts observability timestamps, and none of the ambient reads changes a verdict.
- **GVC-8 (now M8):** the promotion half (n=2 on an intentionally advisory rule) was not reproduced on a fresh clone.
- **GVC-12 (now m16):** "`command-exit-codes` is hollow" is weakened. It declares `errs: under`, so skipping exits with a variable argument is a documented under-approximation.
- **CIO-8 (now m4):** "fails below the default cap" holds only on Windows. On Linux and macOS the default (50,000) and the suggested value (100,000) are both below the 128 KiB per-argument limit.
