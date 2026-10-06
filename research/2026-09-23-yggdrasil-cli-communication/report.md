# Yggdrasil 6.1.0: CLI communication and UX system

## 1. Verdict

What the CLI says is mostly right, but how it says it has no system behind it. Nearly every diagnostic carries a what/why/next, codes are stable, header counts and exit codes stay true across every view, and the TTY rendering of `yg check` is compact (34 lines for a 4,377-pair backlog). What is missing is one layer that owns presentation. There are 258 `stdout.write` and 145 `stderr.write` sites across 30-plus files, 90 hand-copied `Error: ${buildIssueMessage(...)}` lines, and engine modules that write finished prose. As a result, one `yg check` report mixes at least three block layouts, the next step has seven spellings, and the rule that decides volume is inverted: the member cap applies only on a TTY. Humans at a terminal get the short report, and agents in a pipe, the main reader, get 338 KB. Text and JSON each drop facts the other has. The report ranks fillable bookkeeping above errors that make the whole run invalid. `Next:` is prose with no contract, and in cascades it names a symptom ("create the missing node" for a node that only failed to parse). Nothing here is a blocker: no wrong exit code, no data loss, no stuck adopter. There are 12 majors, and together they explain the owner's "checks are hard to read" exactly. A clean, consistent system fits inside 6.1.0 if the work is split in two. Renderer-only and additive-JSON fixes (caps, units, tiering, the gate abort, structured JSON) can land without breaking anyone. The grammar change (labels, block layout, the Next contract) breaks text parsers, and one exists today in Horde, so it has to ship together with Horde's fix.

## 2. Cross-cutting themes

- **T1. There is no output layer, and the other themes follow from that.** Presentation lives in 30-plus command files and in the engine (`core/fill-progress.ts`, `core/fill-report.ts` write finished text). `formatters/message-builder.ts` is `${what}\n${why}\n${next}`. Every command invents its own layout, prefix, plural and cap, and 101 "byte-identical" comments plus indentation-keyed tests freeze the result. Findings: M11, M6, M7, m4.
- **T2. The terminal decides the volume, not the question.** Member caps are TTY-only (`check-render-groups.ts:466`). `--top` and `--summary` do not bound a large group, JSON cannot be narrowed, and `yg tree` prints whole descriptions. Output size grows with repo size rather than with the size of the decision. Findings: M1, M3, M10, M12, m5, m10.
- **T3. The hierarchy is inverted.** Fillable `unverified` groups come first. Graph-invalidating errors are buried, and the rest of the report is quietly computed on a degraded graph. Standing notices sit above the findings. The most important finding, a refusal, is headed by a status word (`enforced`). Findings: M2, M8, m1, m6.
- **T4. Text and JSON each lose something.** Text drops the file unit, drops the `Then:` line, and cuts `what` to its first line. JSON holds violations, edges and file lists only inside prose, truncates `uncovered-advisory` at 5, and emits nothing on abort paths. Findings: M3, M6, M10, M4.
- **T5. `Next:` is prose, not a contract.** It is sometimes a command, sometimes a restated code, sometimes a placeholder the CLI could fill. It is multi-line in JSON and first-line-only in text. It names symptoms in cascades, drops the user's flags, and repeats the Fix line word for word. Findings: M9, M2, M4.
- **T6. The vocabulary drifts.** One fact goes by `enforced`, `refused`, `aspect-violation-enforced` and `is refused on node:x`. The same pair appears as `node  aspect 'x'`, `x on node:y` and `unit: "file:…"`. Output leaks jargon ("type-level lattice", "oracle", "deterministic-free"), and "your approval" has no clear addressee. Findings: M8, M5, m1, m8, m11, m13.

## 3. Findings table

| id | severity | title | where | suggested fix | sources |
|---|---|---|---|---|---|
| M1 | major | Agents (non-TTY) get uncapped check output, and the sanctioned narrowing flags `--top`/`--summary` do not bound it | `cli/check-render-groups.ts:466`, `cli/check-render-views.ts:121`, `templates/rules.ts:96` | Cap members in every sink, and give each overflow line a runnable drill. `--top N` caps members too. `--summary` becomes a rollup by code. Full enumeration only in `--details`/`--json` | CO-1, UX-01, AC-1, DB-3, DB-12 |
| M2 | major | Graph-invalidating errors are buried, the report is computed on a degraded graph with no banner, and Next names a symptom (a node that failed to parse is reported as "non-existent") | `cli/group-issues.ts:176-206`, `core/check-suggested-next.ts:~180-204`, `check-render-views.ts` formatOutput | Add a T0 tier (config/architecture/yaml/lock invalid) at the top plus a "partial result" banner. Annotate dependent findings. Next names the root fix. Separate parse-error text from schema-error text | CO-3, AC-4 |
| M3 | major | File-scoped pairs render as byte-identical bullets (592 duplicate lines on the repo clone), and pair notation differs across report, progress and JSON | `cli/check-render-groups.ts:443-455, 481-487` | Render the file unit and collapse same (node, aspect) rows into `N files`. Use one pair notation everywhere. Add a test that forbids duplicate member lines | CO-4, AC-3, DB-4 |
| M4 | major | The `--approve` gate abort (log gate) prints 24 unlabelled 3-line blocks to stderr, nothing to stdout, no JSON document, says "drifted" for never-verified nodes, and drops `--only-deterministic` from the hint | `cli/check.ts:485/527`, `check.ts:569-573`, `core/fill-log-gate.ts:45-50`, `formatters/message-builder.ts:11` | Route through the grouped renderer with an `ABORTED` verdict line, write yg-check/1 with `exit.status: "aborted"`, word the why conditionally, and keep the user's flags in Next | CO-2 |
| M5 | major | aspect-status-downgrade blames the node ("Node X attaches…") and names the downgrading type as the cascade source; one type-level fault is reported 24 times | `core/checks/aspect-contracts.ts:753,771-777`, `formatters/aspect-status-messages.ts:54` | Name the declaring site and the real anchor (the aspect default), and report once at the declaring site | CO-5 |
| M6 | major | One check report uses three block grammars (unlabelled Why in groups, member bullets after Fix that read as YAML, dangling-colon members), and text drops content JSON has | `cli/check-render-groups.ts:186-200, 247, 340, 394, 455`, `group-issues.ts:117` FULL_WHAT_CODES, `renderUnmappedBlock` next.split | Use one block template: heading, then where (members), then why, then fix, always labelled. Render every line of `what`/`next` or split summary from detail in the model. Fence remedy snippets | UX-03, DB-2, DB-5, CO-9, CO-10, AC-7 |
| M7 | major | No shared diagnostic grammar across commands: `Error:` prefix sometimes, never, or lowercase from commander; seven next-step labels; stderr contract varies | `formatters/message-builder.ts:11`, `log.ts`, `impact-handlers.ts`, `type-suggest.ts:109`, commander defaults, 7 local `failWith`/`emitError` helpers | Add one `fail(diag)` that renders `error[code]: what` plus `why:` and `next:`, and route commander through `configureOutput`/`exitOverride` | UX-06, DB-2, AC-10 |
| M8 | major | Views disagree on header and Next, `--summary` erases every non-pair error into `other`, and group labels do not match JSON codes (`enforced` vs `aspect-violation-enforced` vs `refused`) | `cli/check-render-views.ts:254, 430-495`, `cli/group-issues.ts:227-249` | One header and one Next for every view. `--summary` becomes a rollup by code. A code registry supplies the label, and JSON carries it | UX-05, AC-6, DB-8, DB-12, CO-7, UX-02 |
| M9 | major | `Next:`/`suggestedNext` has no contract: runnable command, restated code (`Fix flow-node-broken in .yggdrasil`), unresolved placeholders, multi-line JSON versus first-line text, a residual count only in text, byte-identical to Fix | `core/check-suggested-next.ts:120,147,156,162,197-217`, `check-render-views.ts:89,107-110` | Add a structured `next` (command argv, text, target, cost, remaining) and render text from it. Fill placeholders the CLI can resolve. Never emit `Fix <code> in <x>`, never repeat Fix | AC-5, DB-6, CO-7, CO-12, UX-04 |
| M10 | major | JSON is prose, not structure (violations, edges and file lists sit inside strings), sometimes less complete than text, repeats `why` in every issue (4.79 MB), covers 7 of about 28 commands, and has no error envelope | `formatters/check-json.ts:73-82`, `core/check-coverage-tiers.ts:134,199`, `core/advise-nominations.ts`, `cli/preamble.ts` | Additive in yg-check/1: `violations[]`, `edges[]`, `files[]`, an object `unit`, a `groups[]`/`codes` dictionary. A `yg-error/1` envelope on stdout under `--json`. `--json` on tree, owner, find, log read, structure | CO-6, AC-7, UX-07, DB-11, AC-2 |
| M11 | major | There is no output layer: 258 stdout and 145 stderr writes in 30-plus files, chalk picked ad hoc in 29 files, the engine writes finished text, and tests pin layout by indentation | `source/cli/src/cli/*.ts`, `core/fill-progress.ts:138-139`, `core/fill-report.ts:243`, `check-render-views.ts:400-403` | Add `src/cli/output/` (Diagnostic model, primitives, three sinks, code registry). The engine emits events. Tests assert on the document tree plus a few golden files | DB-1 |
| M12 | major | `yg tree` prints 290 KB and 492 lines for 473 nodes (longest line 4,409 chars) with spilled description lines and no compact or JSON form, yet prime and error hints send agents to it | `cli/tree.ts:168-178`, `formatters/truncate.ts` (unused here) | Default to `path [type] — first sentence`, add `--long` and `--json` (`yg-tree/1`), and point hints at `yg find` first | AC-9, DB-10 |
| m1 | minor | The refusal block explains the cache instead of the rule, reads `Fix: Fix the listed violations`, leaves a dangling `Violations:`, and the fill ends "all expected pairs hold valid verdicts" on a FAIL | `formatters/lock-issue-messages.ts:74-76`, `core/fill-report.ts:243` | Why = first sentence of the aspect description. Put the list under the node. The closing line counts approved/refused/failed | CO-7, UX-02, AC-10 |
| m2 | minor | `expected:`/`actual:` payloads are two unwrapped lines of 500 to 1,500 chars differing by six words | violation contract (free-text `message` only) | Optional structured `expected`/`actual` in the check.mjs contract, and a word-diff with context elision in text | CO-8 |
| m3 | minor | Engine messages carry renderer whitespace and splice hacks: relation-broken lines at column 5, `Did you mean 'app'?` for `app/svc-99`, a run-on unmapped Fix, yaml-invalid with what/why swapped | `core/checks/relations.ts:51,53`, `core/check-coverage-phase.ts:62-66`, yaml-invalid message | Plain sentences plus structured extras (`data.existing[]`, `data.files[]`, `next[]`). Lint that no messageData has a newline followed by spaces | CO-9, AC-4 |
| m4 | minor | Counts, plurals and caps are hand-rolled: `1 pairs  1 nodes`, `pair(s)`, `pairs` for non-pairs, six copies of cap=12, four overflow spellings, `--top 0` "non-negative" | `check-render-groups.ts:239,387`, `fill-report.ts:231,239`, `fill-dry-run.ts:89`, `impact-handlers.ts:303,392` | `count(n, noun)` with per-code nouns, one cap constant, one overflow format that includes a drill | CO-10, UX-09, DB-7 |
| m5 | minor | Repetition where a template would do: 24 per-member Fix lines differing by one token, ~250-char whys repeated because one word differs, inherited baseline listed in full | `check-render-groups.ts` emitDivergentDetail / divergentWhy | Detect one-token divergence, render one templated fix plus the member list, and collapse the baseline to one counted line | CO-11, AC-12 |
| m6 | minor | A fresh project's first check is mostly noise: 4 of 5 uncovered files are yg's own (AGENTS.md, CLAUDE.md, .clinerules, .gitattributes), and two standing paragraphs sit above the findings | `core/check-coverage-*.ts`, `check-render-header.ts` notices | Treat installed rules artifacts as tool-owned. Notes go after the findings, one line each | CO-12, UX-04, DB-9 |
| m7 | minor | The plain view hides what `--approve` will cost (free vs reviewer calls) | `check-render-groups.ts` unverified members, Next composition | Put the cost class on the unverified block's fix and on Next | AC-12, DB-12 |
| m8 | minor | Entities are rendered differently per command (type brackets, display names vs ids, `->` vs `→`, location formats, path bases) | `tree.ts`, `node.ts`, `formatters/context-*.ts`, `impact-handlers.ts`, `owner.ts`, `aspect-test.ts` | Shared `entity()`, `unit()`, `location()`, `path()` helpers, with ids everywhere | UX-08 |
| m9 | minor | Empty states are inconsistent: `yg flows`/`yg aspects` print nothing and exit 0, others print a sentence or stray blank lines, the knowledge list column overflows | `flows.ts`, `aspects.ts`, `tree.ts`, `knowledge.ts`, `type-suggest.ts` | One empty-state line with a next step, no leading blank lines, columns sized to the longest key + 2 | UX-10 |
| m10 | minor | The dry run prints a `FAIL` header with exit 0 and says "Filling" for a run that fills nothing. On the clone that is 4,383 `— free` lines plus the full report (9,219 lines). A zero-work fill still prints two lines | `core/fill-dry-run.ts:89`, `fill-report.ts` | Head it `Dry run — would fill`, list billed pairs only, skip the report, print nothing when there is nothing to fill | UX-11, CO-11, spot check |
| m11 | minor | Jargon leaks into first-level output, and `yg structure` claims "jumps 2 levels … no declared contract" for root siblings that do have a declared `uses` relation | `tree.ts` trailer, `--summary`, `structure.ts`, `advise.ts`, `incident --help` | Run a glossary pass over output strings. Phrase the structure claim as "no port declared on core" and fix the level arithmetic | UX-12 |
| m12 | minor | `--help` is a flat list of 28 commands with descriptions up to 10 lines long, mixed option casing and quoted numeric defaults | `bin.ts` command registration | Group commands, one-line descriptions, examples, one option style | UX-13 |
| m13 | minor | Mixed addressee in one feed ("requires your approval" vs "their approval"); the relation fix leads with an action the next line calls impossible | `core/advise-nominations.ts:434,959`, `advise-architecture-cut.ts:38`, `relations/messages.ts:61-68` | "you" always means the operator. Human sign-off is always written "ask the user to approve". Lead with the possible action | AC-8 |
| m14 | minor | Looking up one flag costs about 23k tokens (cli-reference is 94 KB, no section read). Prime never mentions `--help`, and inline command spans are split across lines | `templates/rules.ts`, `templates/knowledge/*.ts`, `cli/knowledge.ts` | `yg knowledge read <topic> --section`, point flag lookups at `yg <cmd> --help`, one wrap policy, never break a code span | AC-11 |

## 4. Details: majors

There are no blockers. M2 comes closest: when an invalid parent `app/yg-node.yaml` produced `0 nodes · 0/32 files`, every child was silently dropped and the report shrank. The exit code stayed 1, though, so the gate did not lie. It is a misleading report, not a wrong result.

### M1. Agent output is unbounded

- **Evidence:** On a fresh clone of the Yggdrasil repo (4,377 unverified pairs), piped `yg check` gave 4,398 lines / 338,416 bytes. Under a pseudo-TTY it gave 34 lines / 2,114 bytes, ending in `... and 4365 more`. Piped `yg check --top` gave 4,389 lines / 337,801 bytes. `--top 3` gave 4,398 lines, bigger than plain. `--summary` gave 448 lines, one per node (`cli/adopt-transaction  12 unverified (12 deterministic-free, 0 LLM), 0 refused`). `--details` gave 17,539 lines / 1.8 MB. `--json` gave 4.79 MB. In code, `const truncate = opts.isTTY && blockMembers.length > CAP_NODES;` (check-render-groups.ts:466), with `isTTY: process.stdout.isTTY ?? false` (check-render-views.ts:121). Prime says: "never pipe it through `| grep`, `| head`, or `| tail` … the SANCTIONED way to narrow it further is `yg check --summary` … or `yg check --top [N]`".
- **Impact:** About 85k tokens to learn one uniform fact ("4,377 free pairs need filling"). The protocol forbids the one escape hatch that works. Humans and agents see structurally different reports of the same run.
- **Fix:** Tie the cap to the view, not the terminal. Cap members at 12 in every sink, with `… +K more  (yg check --aspect <id>)`. `--top N` bounds members too. Collapse uniform unverified groups to aspect × lane counts. `--summary` becomes one row per code. `--details`, `--all` and `--json` are the explicit full views.
- **Verifier note:** The TTY-only cap is deliberate and documented (docs/cli-reference.md:384-389). The same passage also promises "The grouped view caps itself, so it is not an exhaustive dump" and an overflow with `(yg check --aspect <id>)`. The TTY overflow has no drill in code-only groups. Downgraded from blocker because nothing is wrong or lost; the cost is tokens.

### M2. Degraded graph and cascades

- **Evidence:** (a) After appending `quality: [` to yg-config.yaml, `config-invalid` first appears at line 73 to 86, after the unverified and enforced groups. The header changes to `26/33 files (79%)`, unmapped grows from 2 to 7 because `coverage.required` was lost, there is no banner, and the last line is `Next: yg check --approve  (fills 24 unverified; 13 errors remain — need code/graph fixes)`. (b) With an arch type missing its description, the report goes from `Errors (101) in 6 groups` to `Errors (4) in 2 groups`, and the text says `Why: yg-architecture.yaml failed to parse` / `Fix: Fix the YAML syntax` for a schema error. (c) In checkout-flow with `bad: [unclosed` in `model/cart/yg-node.yaml`, the report shows `flow-node-broken … references non-existent node 'cart' … Fix: Fix the nodes list in yg-flow.yaml or create the missing node.` and `Next: Fix flow-node-broken in .yggdrasil`, while JSON orders yaml-invalid first. The fallback in `check-suggested-next.ts` takes the alphabetically first structural code and falls back to `.yggdrasil` as the location.
- **Impact:** The report gets greener when the architecture breaks. An agent following Next records verdicts against fallback config, or creates a duplicate node.
- **Fix:** Make T0 codes render first under a banner (`partial: yg-config.yaml did not parse — defaults used; 1 node not loaded`). Annotate dependent findings (`(node 'cart' failed to load — see yaml-invalid)`). Next names the T0 fix with its file. Give parse errors and schema errors different texts. In yaml-invalid, put the parser message in `what`, indented.
- **Verifier note:** Reproduced all variants. The invalid-parent case (0 nodes) is worse than first reported.

### M3. File-scoped pairs collapse into identical bullets

- **Evidence:** `- cli/ast/report  aspect 'self-contained-references'` appears 6 times and `- graph-rules  aspect 'self-contained-references'` 36 times. `sort | uniq -d` finds 128 distinct duplicated lines, 592 extra lines in total. In JSON they are distinct: `"unit": "file:source/cli/src/ast/file-path.ts"`, `…/find-comments.ts`, and so on. The renderer sends only `m.nodePath === undefined && unitKey file:` members to the file block, so a node-owned file member loses its file. The dry run names the same pair `[det] self-contained-references on file:source/cli/src/ast/file-path.ts — free`.
- **Impact:** The lines look like a rendering bug and give an agent no file to act on. The same pair is written three ways.
- **Fix:** Subject = unit (`node › file`). Collapse to `graph-rules  self-contained-references  36 files`. Use one notation `<aspect> @ <unit>` in report, progress, dry run and JSON. Add a test that forbids duplicate member lines in a group.
- **Verifier note:** The comment next to the code states the goal is to stop members "looking identical".

### M4. The gate abort is the least readable output the CLI produces

- **Evidence:** `yg check --approve --only-deterministic` with 24 `log_required` nodes gives stdout 0 bytes and stderr 73 lines / 14,418 bytes: `Filling 50 unverified pairs…` and then 24 bare blocks like `No fresh log entry for node 'app/svc-01' — mandatory before recording verdicts when its source drifted.` / a ~400-char why ("This component's source has drifted from the state its recorded verdicts were written over…") / `yg log add --node app/svc-01 --reason '<justification>', then re-run: yg check --approve`. There is no header, count or labels. With `--json`, stdout is 0 bytes. check.ts:527 sends emitIssue to stderr, and the FillGatingError branch (check.ts:569-573) only calls `exitAfterFlush(1)`. Plain `yg check` describes the same condition differently ("its source changed but no justification entry exists").
- **Impact:** This is the most common first `--approve` failure on a `log_required` graph. A JSON consumer (Horde reads yg-check/1) gets no document at all. The hint moves the agent from the keyless lane to the paid lane.
- **Fix:** See mock-up 8.C. Emit the yg-check/1 document with `exit.status: "aborted"` and the gating issues. The why is conditional (never verified vs drifted). Next preserves the user's flags.
- **Verifier note:** Reproduced after removing the LLM aspect, so the in-flight keyless abort was not the cause. This is distinct from the in-flight suggestedNext item.

### M5. aspect-status-downgrade names the wrong actor

- **Evidence:** The only attach is `service.aspects: - id: header-comment, status: advisory` on the type. The output is 24 bullets of `Node 'app/svc-01' attaches aspect 'header-comment' with status 'advisory', but the aspect cascades onto this node with status 'enforced' from type:service.` In code, aspect-contracts.ts:776 passes `origin: source.origin` (the downgrading source) into the "cascades … from" clause. The anchor is actually the aspect default (`aspectDef?.status ?? 'enforced'`, :753).
- **Impact:** This teaches the wrong model. An agent edits node files that contain no attachment, or treats type:service as the enforcer. The one real fix is never named.
- **Fix:** `type:service declares header-comment advisory, below its default enforced (yg-aspect.yaml). Set the default, or drop the override.` Report once at the declaring site.

### M6. Three block grammars in one report, and text loses content

- **Evidence (live, `$TMPDIR/uxsweep-a`):** The grouped block prints its why with no label (`A dependency on another component must be ...`), while `uncovered` prints `Why: Not under a coverage.required root…`. The member bullet `- app  src/b.ts:1 → core` directly follows the YAML snippet `relations: / - target: core / type: uses` and reads as a third YAML item. type-without-when members end in `but mapping is not empty:` with nothing after, in both grouped and `--details` views, while JSON has `…not empty:\n  mapping:\n  - src/b.ts`. The unmapped Fix prints only `md.next.split('\n')[0]`, dropping `Then: add to existing node mapping, or create a new node.`. Extra `what` lines render only for codes in a hand-kept allow-list (`FULL_WHAT_CODES`, group-issues.ts:117).
- **Impact:** The reader has to relearn the layout for each group, the member list (the "where") comes after the remedy, and the text view silently loses lines.
- **Fix:** Use one template (section 8.3). Keep `summary` and `detail[]` separate in the model. Until then, apply `nextPointer`'s "line ends in `:` means heading" rule to `what` as well.

### M7. No diagnostic grammar across commands

- **Evidence:** One condition, four renderings. `yg node nope`: `Error: Node 'nope' does not exist in the graph.` `yg impact --node nope`: `Error: Node not found: nope` / `Run: yg tree — to list all nodes.` `yg log add --node nope --reason x`: `Node not found: nope` / `Node must exist in the graph before log entries can be added.` / `Create yg-node.yaml first, or fix the --node argument.` (no prefix, exit 1). Commander: `error: unknown option '--message'`, `error: required option '--tag <cause>' not specified`. Next-step labels: `Next:`, `Next (this group):`, `NEXT`, `Run:`, `Re-run as:`, `Fix:`, `Then:`, or unlabelled prose. Prefixes: `Notice:`, `Note:`, `Warning:`. Contradictions: `--top 0` gives `expects a non-negative whole number; got "0"`, and `yg init --upgrade` prints `Agent rules already up to date — nothing changed.` then `All changes are plain files — review them with git diff before committing.`
- **Impact:** No single pattern pulls out "the error" or "the next command". The `command-error-via-buildissuemessage` aspect enforces the helper, not the presentation.
- **Fix:** Use `fail(diag)` with the format in section 8.9, and route commander through it.

### M8. Views disagree, and labels are not codes

- **Evidence:** One state gives four answers. Default: `Errors (4) in 3 groups:` … `Next: yg check --approve  (fills 1 unverified; 3 errors remain — need code/graph fixes)`. `--summary`/`--top`: `Errors (4):` … `Next: yg check --approve`. `--summary` rows: `app  0 unverified (0 deterministic-free, 0 LLM), 0 refused, 2 other`, which is the relation plus type-without-when errors. `--aspect no-todo`: `FAIL  (aspect 'no-todo' — 1 of 4 errors)` with no `yg check:` prefix and a `Next (this group):` footer. Labels: `enforced  1 pairs  1 nodes  aspect 'no-todo'`, while JSON says `aspect-violation-enforced` and progress says `— refused`. `unmapped (1)` vs `unmapped-files`. `getIssueLabel` maps only two codes and passes the rest through.
- **Impact:** Switching views to save tokens changes the answer to "what next". The summary cannot say what is wrong. No shared key links text and JSON.
- **Fix:** Use one header builder and one Next, identical in every view, plus a `view:` tag. `--summary` is a rollup by code (section 8.10). A code registry supplies the label, and JSON gains `label`.

### M9. Next has no contract

- **Evidence:** Observed values: `yg check --approve`. `Fix relation-undeclared-dependency in web`. `Fix the listed violations, then: yg check --approve` (identical to the Fix line above it). `yg log add --node cli/ast/report --reason '<justification>', then re-run: yg check --approve`. `Map these files to a node, or add their root to coverage.required to make this an error. yg type-suggest --file <path> can help…` on a green run, identical to Fix (spot-checked live). The source builds `yg context --file <uncovered-path>` although the path is known. JSON `suggestedNext` is the raw multi-line string (`"Fix relation-undeclared-dependency in web\n  1 of 1 structural error"`). The residual count (`fills 3 unverified; 4 errors remain`) exists only in text. Control flow keys on prose: `startsWith('yg check --approve')`, `messageData.next === 'yg check --approve'`, and `msg.includes('No .yggdrasil/ directory found')` (check-render-views.ts:108, check-suggested-next.ts:120/147, preamble.ts:106).
- **Impact:** An agent cannot tell whether to execute Next or read it. Rewording a message changes behaviour, which is why the wording cannot be polished safely.
- **Fix:** See section 8.7. Branch on codes and fields, never on text. Throw typed errors.
- **Verifier note:** This overlaps the in-flight item (Next after infra failures and mid-merge) only in module. The contract is new work.

### M10. JSON is prose

- **Evidence:** `"what": "Aspect 'no-secret-in-logs' is refused on node:payments by a deterministic check.\nViolations:\nsrc/charge.ts:53: …"`. `"what": "Node 'web' has undeclared dependencies on other nodes:\nsrc/web/rideHandler.ts:5 → data"`. `"what": "2 source files not covered by any node.\n  src/orphan/a.ts\n  src/orphan/b.ts"` has no files array. `uncovered-advisory` truncates at 5 (`… and 6 more`) while text lists 10. `issue.unit` is `"node:payments"` while `pair.unit` is `{"kind":"node","path":"payments"}`. One distinct `why` is repeated across 4,383 issues (4.79 MB). advise `--json` ("every item, uncapped") contains `Evidence: …, +7 more`, and `attention` is prose strings (`"1 dependencies jump across…"`). Only 7 of about 28 commands take `--json`. Under `--json`, `yg check` in an uninitialised dir and `yg check --json --top` both write 0 bytes to stdout and text to stderr, exit 1. By contrast, `yg suppressions --json` is properly structured (`{"file","line","kind"}`).
- **Impact:** Consumers regex English whose wording the JSON header says may change. The machine channel is sometimes poorer than the human one.
- **Fix:** Additive within `/1` (section 8.11).
- **Verifier note:** AC-2's "agents should prefer JSON" premise was not upheld. The stated audience is the layer above the agent, and prime never recommends `--json`. The size is an efficiency cost for that layer, which Horde is.

### M11. No output layer

- **Evidence:** 258 `process.stdout.write` / 145 `process.stderr.write` calls in 33/29 files and 0 `console.*`. chalk is imported in 29 files (red 93, green 37, dim 26, yellow 24, bold 7). `Error: ${buildIssueMessage` appears at 90 sites in 20 files. Six `failWith` copies plus one `emitError`. The engine writes text: `core/fill-progress.ts:139` writes `  [${kind}] ${aspectId} on ${unitKey} — ${verdict}`, `:138` writes a raw `\r\x1b[2K`, and `core/fill-report.ts:243` writes `0 reviewer calls made — all expected pairs hold valid verdicts`. Tests key on indentation: check-render-views.ts:400-403 says "Indented FOUR spaces on purpose: group blocks start at a two-space indent and block-counting parsers key on that". There are 101 "byte-identical/byte-for-byte" comments.
- **Impact:** Every other finding here recurs until this exists, and every cleanup breaks tests.
- **Fix:** See section 9, step 2.

### M12. `yg tree` is a 70k-token orientation tool

- **Evidence:** 492 lines, 290,635 bytes, longest line 4,409 chars. 473 lines match `path [type] — `, and 19 are spilled description paragraphs. `--depth 1` gives 26,867 bytes. The only options are `--root` and `--depth`. `truncateDescription` exists but only the context formatters call it. Prime says "fall back to `yg tree` for full graph overview", and `yg impact --node nope` says `Run: yg tree — to list all nodes.`
- **Fix:** First sentence by default, plus `--long` and `--json`. Hints point to `yg find` first.

## 5. What is solid

- The content model is right. Almost every diagnostic has a what/why/next, codes are stable, and the header's counts and exit code stay the TRUE whole-run values in every view (`--top`/`--summary` never lie about totals).
- On a TTY the default report is compact and well capped (34 lines for 4,377 pairs). A green check on a clean repo is one line (119 bytes). A realistic two-file edit is 48 lines (3.6 KB).
- The priority order of the default Next is a sound idea (fill free work, then report the residual), and the residual annotation `(fills N unverified; M errors remain — need code/graph fixes)` is the right kind of information. It is just not in JSON.
- Refusals show real `file:line: message` violations in text. Relation fixes include a paste-ready YAML snippet. Progressive mode separates in-scope findings from baseline.
- `--approve --dry-run` gives a free, honest budget before spending, and `--only-deterministic` is a clean keyless lane.
- yg-check/1 is versioned, and its `totals`/`exit` blocks are trustworthy. Refusing `--json --top` to protect count honesty is a defensible choice. `yg suppressions --json` is the model the other documents should follow.
- The colour and emoji gate respects `NO_COLOR` and chalk level, so plain text never depends on decoration.
- `yg aspects` pluralises correctly (`Used by: 1 node (direct: 1)`), which shows a helper-based approach works where it is used.

## 6. Completeness critique

- **The LLM lane was not exercised.** There were no keys, so no angle saw reviewer progress, consensus, reviewer-cost lines, external-judge output or a mixed det+LLM fill report. Close it with a local openai-compatible stub server in the container that returns scripted verdicts, then capture fill, retry and consensus output.
- **Colour and width were not judged.** One `FORCE_COLOR` run and one pseudo-TTY run were captured, but nobody evaluated the colour semantics, 80-column and narrow terminals, emoji width in tmux/Windows Terminal, or `\r\x1b[2K` progress when stderr is a TTY and stdout a file. Close it with a render matrix (TTY × NO_COLOR × COLUMNS=60/80/140 × TERM=dumb) and screenshots.
- **Mixed-stream consumers were not tested.** Horde concatenates `run.out + run.err` (Horde `node.mjs:494`), so interleaving between the progress stream and the report matters to a real consumer. Nobody measured it.
- **Interactive and secondary surfaces are thin.** `yg init` prompts, `yg adopt`, `yg log merge-resolve`, `yg incident add`, pack/marketplace with real packages, and the portal UI got at most a help page or an error. Close it with one scripted walk per command through a happy path, an error and an empty state.
- **There is no behavioural evidence.** The findings measure bytes and wording, not whether agents actually misact. Close it with an eval: replay about 10 canonical agent tasks (fresh init, cascade, log gate, refusal, 4k-pair backlog) against the current renderer and the proposed one, counting tokens, wrong follow-up commands and forbidden actions.
- **External text parsers were not inventoried by the angles.** The synthesis spot check found Horde parsing yg text output (section 9). The other family repos were only grepped for spawn sites. Close it with a family-wide contract list of every regex over yg output.
- **Exit-code classes** (usage vs gate vs infra) were raised but not designed. The 0/1 model is documented. Decide it explicitly in the spec.

## 7. Refuted or corrected claims

- UX-01: "`--top` help is untrue". Overstated. `--top` does limit blocks, just not members.
- UX-02: "the fill summary calls the run healthy". Overstated. The line above says `1/1 filled (0 ok, 1 refused)` and the exit code is 1. The fault is misleading wording only, kept as m1.
- UX-11: "the dry run writes its budget to the wrong stream". Refuted as a defect. docs/cli-reference.md:474-481 documents stdout as deliberate, and 612 documents exit 0. Only the wording remains, as m10.
- AC-2: "JSON is the form agents should prefer". Refuted premise. Prime never recommends `--json`, and the documented audience is dashboards, CI and Horde. Downgraded to minor and folded into M10.
- CO-8: "Yggdrasil renders the expected/actual layout". Refuted. The check authors write it (the fixture's check.mjs and the family's canon sync check, `family-sync-check.mjs:200`, now `ws check canon-sync`). Kept only as a missing structured-diff feature (m2).
- DB-1 counts: `Error: ${buildIssueMessage` is 90 sites in 20 files, not 96 in 21, and there are 101 byte-identical comments, not 104.
- DB-1: "the engine violates the what-why-next aspect". Holds in spirit only. The engine does not call `buildIssueMessage`, it writes free text through write callbacks.
- DB-7: the plural-ternary count is 56 in 22 files, not 68 in 21.
- DB-11: "4.79 MB JSON from a check with zero findings". Wrong. That run had 4,383 issues.
- DB-5, DB-6, DB-9, DB-11: downgraded to minor or folded in. No current misbehaviour was shown beyond readability, or the lost detail was covered by the Fix line.
- CO-4: undercounted. `graph-rules` repeats 36 times, not 14.

## 8. Proposed communication system

### 8.1 Principles

1. **One grammar, three sinks.** `tty` (colour + glyphs), `plain` (identical words and layout, no decoration), `json`. There is no separate "agent mode" text grammar, because two text grammars drift. `plain` is the agent mode, and it is stable enough to grep.
2. **The view decides volume; the terminal decides decoration.** Caps, collapsing and ordering never depend on `isTTY`. Colour, glyphs, wrapping and the rewriting progress line do.
3. **Hierarchy is fixed:** verdict → banner (if the result is partial) → findings by tier → notes → next.
4. **Every finding answers what, where, why, fix, in that order, always labelled.**
5. **Parity:** every fact in text exists in JSON, and JSON never truncates. Text may elide, but always with a runnable drill.
6. **The engine emits data; the renderer owns words, layout and counts.** No engine string contains a newline followed by indentation.

### 8.2 Line types (every output line is exactly one of these)

| type | shape | stream |
|---|---|---|
| verdict | `yg check: FAIL  37 errors · 1 warning   25 nodes · 26/32 files owned · 30 pairs verified` | stdout |
| banner | `partial: yg-config.yaml did not parse — defaults used; results below are incomplete` | stdout |
| block heading | `error[relation-broken] app/svc-05 relates to a node that does not exist` | stdout |
| field | two-space indent, label padded to 6 columns: `  at:   `, `  why:  `, `  fix:  `, `  see:  ` | stdout |
| continuation | aligned under the field value (column 9) | stdout |
| snippet | indented 4 past the field column, preceded by the fix text ending in `:` | stdout |
| overflow | `… +K more  (yg check --aspect no-todo)`, always with a drill | stdout |
| note | `note: …`, one line, after all findings, max 3 | stdout |
| next / then | `next: …` and optionally `then: …`, always last | stdout (reports), stderr (errors) |
| progress | `fill  37/50  no-todo @ app/svc-12` | stderr only |
| error | `error[code]: …` + fields | stderr |

The verdict line keeps the existing `yg check: ` prefix, because it is the one anchor external parsers use today (Horde `node.mjs:495`).

### 8.3 Block template and ordering

```
<severity>[<label>] <subject sentence>
  at:   <member>  <unit>  <message>
        <member>  <unit>  <message>
        … +K more  (<drill command>)
  why:  <one sentence: the rule's intent, not engine mechanics>
  fix:  <one imperative sentence or command>[:]
            <optional snippet>
```

Tiers, in order:
- **T0 graph-invalid:** `config-invalid`, `architecture-invalid`, `yaml-invalid`, `lock-invalid`. These also raise the banner and annotate their dependents.
- **T1 code and graph errors:** refusals (enforced), relations, coverage-required, structural codes.
- **T2 gate prerequisites:** `log-entry-missing`.
- **T3 pending:** `unverified`, which is fillable. This is the only tier `--approve` fixes.
- **Warnings:** same template, severity `warning`.
- **Notes.**

Within a tier, blocks sort by member count (descending) then code. Section subheaders (`Errors (37) in 5 groups:`) are dropped. The verdict line carries the counts, and each block carries its own severity.

### 8.4 Vocabulary

- **Severities:** `error` (blocks exit), `warning` (listed, never blocks), `note` (context, never a finding). No other prefixes: `Notice:`, `Note:` and `Warning:` go away.
- **Labels** come from a code registry (code → label, gloss, count noun, knowledge topic):
  - `aspect-violation-enforced` → `error[refused]`
  - `aspect-violation-advisory` → `warning[refused]`
  - `unverified` → `error[unverified]`
  - `unmapped-files` → `error[unmapped]`
  - `uncovered-advisory` → `warning[uncovered]`
  - other codes keep their code as the label

  JSON carries both `code` and `label`, and `--details` prints the full code.
- **Pair notation** is `<aspect> @ <unit>` in every mode: report, progress, dry run, JSON text fields.
- **Addressee:** "you" is the operator (agent or human). Human sign-off is always "ask the user to approve …".
- **Glossary** (enforced by a word list): "script rule"/"reviewer rule", not "deterministic-free"/"LLM" in first-level text. No "lattice", "oracle", "tower" or "regime".

### 8.5 Symbols, colour, NO_COLOR, non-TTY

- **Glyphs** appear only in `tty`: `✗` before `error[`, `!` before `warning[`, `✓` before PASS. No emoji (❌ ⚠️ ✅ render at inconsistent widths).
- **Colour:**
  - red: the `error` token and `FAIL`
  - yellow: `warning` and `WARN`
  - green: `PASS`
  - dim: field labels, counts, overflow and drill hints
  - bold: the block subject

  Prose is never coloured, and neither is a whole block.
- **Colour is off when:** `NO_COLOR` is set (any value), stdout is not a TTY, `TERM=dumb`, or `--color=never`. `--color=always` or `FORCE_COLOR` turns it on. Glyphs follow colour. Meaning is always in words.

### 8.6 Width, wrapping, counts

- **tty:** prose wraps at `min(columns, 100)` with a hanging indent to column 9. Command spans and paths never break.
- **plain:** never wraps. One logical line is one physical line, so grep and token cost stay predictable.
- **Long payloads** (`expected`/`actual`) render as a word diff with 40 characters of context: `… first[-,-]{+ — install it day zero —+} then …`.
- **Counts:** `count(n, noun)` only. Each code declares its noun (pair, file, node, finding, entry). Literal `(s)` is banned, and so are zero segments (`0 flows`, `0 type-covered`). The verdict counts findings, and each block counts its own unit.
- **Caps:** one constant (12) for groups and members, the same in every text sink. `--details` and `--all` uncap.
- **Collapsing:**
  - Identical (node, aspect) file members become `graph-rules  self-contained-references  36 files`.
  - Uniform unverified groups become `self-contained-references  1,523 pairs · 435 nodes · script`.
  - A fix that differs across members only by the subject becomes one templated fix: `yg log add --node <node> …  for each node above`.

### 8.7 The Next contract

- At most one `next:` and one `then:`, always the last lines of the output.
- `next:` starts with `yg ` (runnable) or with an imperative that names a concrete location (`edit src/a.ts:1`). Placeholders only for values a human must supply (`<why>`). Everything the CLI knows is filled in (path, node, the user's own flags such as `--only-deterministic`).
- Next is the first step of the highest tier present, never T3 when T0 to T2 exist. It never repeats a block's `fix` verbatim; if that is all it could say, it is omitted. On PASS with no warnings, there is no Next.
- Fill commands carry a cost class: `(24 pairs · free)` or `(3 reviewer calls)`.
- **JSON:** `next: {command: string[] | null, text: string, target: {node?, file?}, cost: {free: n, reviewerCalls: n}, remaining: {needsFix: n, fillable: n}}`. `suggestedNext` (string) stays in `/1` for compatibility and is rendered from the same object.

### 8.8 Progress

- Progress goes to stderr only.
- **tty:** one rewriting line: `fill  37/50  no-todo @ app/svc-12`.
- **plain:** a start line and an end line only. Per-pair lines only under `--verbose`.
- The end line counts outcomes: `fill  done in 3.1s — 49 approved · 1 refused · 0 failed · 0 reviewer calls`. It never says "valid" or "healthy" when anything was refused.
- A fill with nothing to do prints nothing.
- The engine emits `{pair, outcome}` events, and the sink writes the text.

### 8.9 Errors (every command)

- stderr, exit 1:

  ```
  error[code]: <what>
    why:  <why>
  next: <step>
  ```

- Commander usage errors are routed through the same format with `code: usage` and a `next:` that names `yg <cmd> --help`.
- Under `--json`, stdout also receives `{"schema":"yg-error/1","code","what","why","next":{…}}`.
- Exit codes stay 0/1 (documented). `exit.status` in JSON and `code` in yg-error/1 are the machine distinction.

### 8.10 Levels and views

- **`-q`:** verdict line and `next:` only.
- **Default:** tiered blocks, capped.
- **`--top N`:** the first N blocks, each capped, and the same verdict and Next as default, with a `view: top 3` tag on the verdict line.
- **`--summary`:** one row per label, terraform-style:

  ```
  refused 10 · relation-broken 1 · description-missing 1 · unverified 24 (free 0 · reviewer 24)
  ```

  `--summary=nodes` gives the per-node table without zero fields.
- **`--aspect <id>`:** the same verdict line plus `view: aspect no-todo`.
- **`--details`:** every member.
- **`--json`:** full.

### 8.11 JSON parity and schema stability

- Additive within `yg-check/1` (adding fields is free per the family contracts):
  - `issues[].label`
  - `issues[].violations[{file,line,column,message,expected?,actual?}]`
  - `issues[].edges[{file,line,target}]`
  - `issues[].files[]` (never truncated)
  - `issues[].unitRef` (object, same shape as `pairs[].unit`)
  - `groups[{label,code,severity,why,fix,members:[issueIndex]}]`
  - `next{…}`
  - `exit.status: "aborted"` for gate aborts
  - `banner` for degraded runs
- `what`/`why`/`next` strings stay as prose renderings in `/1`.
- `/2` (not in 6.1.0) drops the embedded lists from `what`, dedupes `why` via `groups`, and scopes `pairs` to non-approved by default.
- advise: `attention[{code,count,next}]` and `evidence{files[],window}`.
- New documents: `yg-tree/1`, `yg-owner/1`, `yg-find/1`, `yg-log/1`, `yg-error/1`.

### 8.12 Mock-ups

#### A. Failing check with mixed errors

BEFORE (real, `$TMPDIR/chkout-b` copy, `yg check --no-approve`, 125 lines, abridged with `[…]`):

```
yg check: FAIL  25 nodes · 26/32 files (26 node-owned, 0 type-covered, 0 excluded) · 4 aspects · 0 flows · 30 verified (30 deterministic, 0 LLM)

Errors (37) in 5 groups:

  unverified (not yet reviewed)  24 pairs  24 nodes
            The lock holds no entry for this pair, or its inputs changed since the verdict was recorded (source edit, aspect edit, or a fill that did not complete). A verdict is valid only while its inputs hash to the stored value.
            Fix: yg check --approve
            - app/svc-01  aspect 'readable-names'
            […22 more identical-shape lines…]
            - app/svc-24  aspect 'readable-names'

  enforced  2 pairs  2 nodes  aspect 'canon-sync'
            A deterministic check recorded these violations. The result is cached — the same inputs reproduce the same verdict, so the check is not re-run.
            Fix: Fix the listed violations, then: yg check --approve
            - app/svc-01  Violations:
              src/svc-01/README.md:3: [canon-sync] src/svc-01/README.md:3 differs from canon
                  expected: "Three jobs, one core, in layers. […~480 chars…] Adoption runs Grain first, then Yggdrasil as the core you keep long term."
                  actual:   "Three jobs, one core, in layers. […~480 chars…] Adoption runs Grain first — install it day zero — then Yggdrasil as the core you keep long term."
            […same for app/svc-02…]

  enforced  8 pairs  8 nodes  aspect 'no-todo'
            A deterministic check recorded these violations. The result is cached — the same inputs reproduce the same verdict, so the check is not re-run.
            Fix: Fix the listed violations, then: yg check --approve
            - app/svc-03  Violations:
              src/svc-03/index.ts:1: TODO marker left in shipped code — move it to the tracker
            […]

  relation-broken  1 pairs  1 nodes
            This node declares a dependency that cannot be resolved.
     Existing nodes under app: svc-01, svc-02, […], svc-24
            Fix: Fix the target path in yg-node.yaml relations.
                 Did you mean 'app'?
            - app/svc-05  Relation target 'app/svc-99' does not exist.
[…]
Next: yg check --approve  (fills 24 unverified; 13 errors remain — need code/graph fixes)
```

AFTER (plain sink; the aspect `why` texts and the reviewer/free split are illustrative):

```
yg check: FAIL  37 errors · 1 warning   25 nodes · 26/32 files owned · 30 pairs verified

error[relation-broken] app/svc-05 relates to a node that does not exist
  at:   app/svc-05  relation → app/svc-99
  why:  A relation must name an existing node, or its contract cannot be checked.
  fix:  Correct the target in .yggdrasil/model/app/svc-05/yg-node.yaml (nodes under app: svc-01 … svc-24).

error[refused] no-todo — 16 violations in 8 nodes
  at:   app/svc-03  src/svc-03/index.ts:1  TODO marker left in shipped code — move it to the tracker
                    src/svc-03/index.ts:2  TODO marker left in shipped code — move it to the tracker
        app/svc-06  src/svc-06/index.ts:1  TODO marker left in shipped code — move it to the tracker
        … +13 more in 6 nodes  (yg check --aspect no-todo)
  why:  Unfinished work belongs in the tracker, not in shipped code.
  fix:  Change the code at these lines, then re-run yg check.

error[refused] canon-sync — 2 violations in 2 nodes
  at:   app/svc-01  src/svc-01/README.md:3  differs from canon
                      … Adoption runs Grain first[-,-]{+ — install it day zero —+} then Yggdrasil …
        app/svc-02  src/svc-02/README.md:3  differs from canon (same change)
  why:  <first sentence of canon-sync's description>
  fix:  Restore the canonical paragraph, or change the canon, then re-run yg check.

error[description-missing] […one block…]

error[unverified] 24 pairs have no verdict yet
  at:   readable-names @ app/svc-01 … app/svc-24  (24 nodes)
  why:  A rule counts only once a verdict is recorded for the code as it stands.
  fix:  yg check --approve   (24 reviewer calls)

warning[uncovered] […]

next: edit .yggdrasil/model/app/svc-05/yg-node.yaml (relation-broken) — 1 of 13 errors that need a code or graph fix
then: yg check --approve   (24 reviewer calls)
```

#### B. Passing check with a warning

BEFORE (real, `$TMPDIR/uxsweep-a` copy, exit 0, 16 lines):

```
yg check: PASS (1 warning)  2 nodes · 2/6 files (2 node-owned, 0 type-covered, 0 excluded) · 2 aspects · 0 flows · 2 verified (2 deterministic, 0 LLM) · 1 draft

Nothing is required to be covered, so the 4 uncovered files this run lists can never fail a check — only ever be listed. Name a path under coverage.required in .yggdrasil/yg-config.yaml to make files under it block until a component owns them.

Warnings (1):

  uncovered (4)
            .clinerules/yggdrasil.md
            .gitattributes
            AGENTS.md
            CLAUDE.md
            Why: Not under a coverage.required root — visible but non-blocking. Bring an area under graph coverage to enforce it. Your architecture has no type for this file yet.
            Fix: Map these files to a node, or add their root to coverage.required to make this an error. yg type-suggest --file <path> can help design one before you decide where it belongs.

Next: Map these files to a node, or add their root to coverage.required to make this an error. yg type-suggest --file <path> can help design one before you decide where it belongs.
```

AFTER. With yg's own rules artifacts treated as tool-owned (m6), the same state is one line:

```
yg check: PASS  2 nodes · 2/2 files owned · 2 pairs verified · 1 draft rule
```

With a real unowned file (illustrative `src/tools/gen.ts`):

```
yg check: PASS  1 warning   2 nodes · 2/3 files owned · 2 pairs verified · 1 draft rule

warning[uncovered] 1 file belongs to no node — not under coverage.required, so it never blocks
  at:   src/tools/gen.ts
  fix:  Map it to a node, or add its root to coverage.required to make it block: yg type-suggest --file src/tools/gen.ts
```

(No `next:`, because it would repeat the fix. The "Nothing is required…" paragraph is folded into the heading.)

#### C. `yg check --approve` fill run, and the gate abort

BEFORE, fill (real strings from `$TMPDIR/uxsweep-a`), stderr:

```
Filling 1 unverified pairs across 1 nodes — 1 deterministic (no cost), 0 reviewer calls (consensus included)
  [det] no-todo on node:core — refused
... 1/1 filled (0 ok, 1 refused)
0 reviewer calls made — all expected pairs hold valid verdicts
```

stdout: the full report headed `yg check: FAIL`, with `enforced  1 pairs  1 nodes  aspect 'no-todo'` and `Next: Fix the listed violations, then: yg check --approve`.

BEFORE, gate abort (real, `$TMPDIR/chkout-b`, stdout empty, one of 24 identical stderr blocks):

```
No fresh log entry for node 'app/svc-01' — mandatory before recording verdicts when its source drifted.
Node type 'service' has log_required: true — every source change needs a justification entry capturing WHY. This component's source has drifted from the state its recorded verdicts were written over, which earlier commits can be as much the cause of as anything in progress now. Recording answers for the code as it stands, so it stops here and approves nothing this run until a fresh entry exists.
yg log add --node app/svc-01 --reason '<justification>', then re-run: yg check --approve
```

AFTER, fill. stderr (plain; tty uses a single rewriting line):

```
fill  1 pair · 1 script (free) · 0 reviewer calls
fill  done in 0.4s — 0 approved · 1 refused · 0 failed
```

stdout:

```
yg check: FAIL  1 error   2 nodes · 2/2 files owned · 1 pair checked

error[refused] no-todo — 1 violation in 1 node
  at:   core  src/a.ts:1  TODO comment left in source
  why:  Unfinished work belongs in the tracker, not in shipped code.
  fix:  Remove the TODO, then re-run yg check.

next: edit src/a.ts:1
```

AFTER, gate abort. stdout (and yg-check/1 with `exit.status: "aborted"` under `--json`):

```
yg check --approve: ABORTED  nothing recorded — 24 nodes need a log entry first

error[log-entry-missing] 24 nodes changed with no log entry (type service has log_required: true)
  at:   app/svc-01 … app/svc-12
        … +12 more  (yg check --details)
  why:  These nodes have never been verified, and their type requires an entry explaining why their code exists.
  fix:  yg log add --node <node> --reason '<why>'   for each node above

next: yg log add --node app/svc-01 --reason '<why>'
then: yg check --approve --only-deterministic   (50 pairs · free)
```

#### D. `yg advise`

BEFORE (real, `$TMPDIR/uxsweep-a` copy):

```
Attention

  0 incidents on record — the only external oracle; see .yggdrasil/incidents.md
  1 dependencies jump across distant parts of the architecture — run yg structure to see them

Nominations

  No nominations right now.
```

AFTER:

```
yg advise: 2 attention items · 0 nominations

attention
  incidents   none recorded — incidents are the only outside evidence that a rule missed something (.yggdrasil/incidents.md)
  structure   1 dependency crosses distant parts of the tree: app → core
              next: yg structure

nominations
  none right now
```

A nomination, when present, uses the block template: `nomination[demote-rule] …`, then `at:`/`why:`, then `next: ask the user to approve …`.

#### E. `yg log add` errors

BEFORE (real):

```
Node not found: nope
Node must exist in the graph before log entries can be added.
Create yg-node.yaml first, or fix the --node argument.
```

```
Exactly one of --reason or --reason-file is required
Cannot provide both, cannot provide neither.
Pass --reason "<text>" OR --reason-file <path>.
```

AFTER (stderr, exit 1):

```
error[node-not-found]: node 'nope' is not in the graph
  why:  A log entry belongs to a node, so the node must exist first.
next: yg find "nope"
```

```
error[usage]: yg log add needs exactly one of --reason or --reason-file
next: yg log add --node core --reason '<why this change was made>'
```

Under `--json`, stdout receives: `{"schema":"yg-error/1","code":"node-not-found","what":"node 'nope' is not in the graph","why":"…","next":{"command":["yg","find","nope"],"text":null}}`.

#### F. A `--help` page

BEFORE (real, `yg --help` excerpt):

```
Commands:
  init [options]                  Initialize Yggdrasil graph in current project
  adopt [options] <proposal-dir>  Accept a proposed architecture graph into this
                                  repository, baseline it, and record who
                                  accepted what
  context [options]               Assemble a context package for one node
  tree [options]                  List graph nodes as a flat list of full paths
                                  with type and description (each parent before
                                  its children)
  […]
  aspect-test [options]           Run an aspect check without modifying the lock
                                  — against a graph node (--node), a file
                                  […7 more wrapped lines…]
```

AFTER:

```
yg — architecture rules for AI agents, checked on every change

Daily
  check      Run the gate: rules, coverage, relations
  context    Everything an agent needs before editing one node or file
  log        Record why a node's code changed
  prime      Print the agent protocol

Explore
  find       Find nodes by keyword
  owner      Which node owns a file
  node       One node: what it owns, depends on, publishes
  impact     What depends on a node, aspect, flow or type
  tree       All nodes, one line each

Rules
  aspects    List rules and where they apply
  aspect-test  Run one rule without touching the lock
  drill      Re-run a rule over its test cases
  simulate   Replay history against a rule change

Setup
  init · adopt · pack · marketplace · portal · knowledge · schemas

Examples
  yg check                       read-only gate
  yg check --approve --only-deterministic   record every free verdict
  yg context --file src/a.ts     before editing a file

Run yg <command> --help for options.
```

Per-command help: one-line description, options in one style (capitalised, no trailing period, unquoted numeric defaults), and 2 to 3 examples.

## 9. Migration plan inside 6.1.0

1. **Get the owner's consent on the governing rules first.** The repo's own aspects encode the current conventions: `what-why-next` (LLM, allows unlabelled rendering, exempts report output) and `command-error-via-buildissuemessage` (deterministic, mandates `buildIssueMessage`). Changing them, and adding output lint aspects, is a graph and architecture change that needs Krzysztof's confirmation under the Yggdrasil invariants.
2. **Freeze a golden corpus before touching anything.** Capture the current text and JSON for about 10 fixture states: fresh init, the 24-node synthetic graph, the log gate, the cascade, config-invalid, the progressive run, the 4k-pair clone, advise, log errors, tree. Every later step then produces a reviewable diff instead of silent drift.
3. **Build `src/cli/output/` with no visible change.** It holds the Diagnostic model (`severity, code, label, subject, summary, detail[], why, fix{command?, text}`), the code registry, `count()`, `list({cap, drill})`, `block()`, `verdict()`, `next()`, `fail()`, and the three sinks. Port `message-builder`, the 7 `failWith`/`emitError` helpers and the 90 `Error: ${buildIssueMessage…}` sites to `fail()`. Move the engine's text writes (`fill-progress.ts:138-139`, `fill-report.ts:243`) to events.
4. **Non-breaking fixes (renderer-only or additive JSON). These can land independently:**
   - M1: cap members in every sink. This changes non-TTY bytes only and matches the documented promise.
   - M3: file unit on members.
   - M6: render all `what`/`next` lines.
   - M2: T0 tier plus banner, and the Next root cause.
   - M4: gate abort through the renderer, plus the yg-check/1 `aborted` document.
   - M5: message text.
   - M10: additive JSON fields, `yg-error/1`, `--json` on read commands.
   - M12: tree default truncation, plus `--long`/`--json`.
   - m4: plurals.
   - m6: tool-owned rules artifacts.
   - m10: dry-run wording.
5. **The breaking grammar change, as one coordinated step:** block template and labels (M6/M7/M8), the Next contract (M9), `--summary` rollup, dropping `Errors (N) in G groups:` subheaders, and lowercase field labels. What breaks for text parsers:
   - **Horde** `skills/horde/scripts/node.mjs:495-496` finds `^yg check:`, which is kept unchanged on purpose, and `^(enforced|Errors)\b` as a fallback, which breaks.
   - **Horde** `node.mjs:557` `PENDING_RE = /No valid verdict for aspect '([^']+)' on (file|node):(.+?)\.\s*$/` over `yg check --details`, which breaks. Move Horde to `check --json` pairs filtered by verdict before this step.
   - **Horde** `node.mjs:739` `DRILL_SUMMARY_RE` over `yg drill`, and `audit.mjs:194` over a table header `aspect … signal`. Freeze both or give them JSON first.
   - Any adopter script keyed on `Why:`/`Fix:`/`Next:`, on 2-space group indentation (the comment at `check-render-views.ts:400-403` names "block-counting parsers"), or on `enforced` as a group label.

   Ship the Horde change in the same family release, and list all of this under a `### Breaking` heading in CHANGELOG `[Unreleased]` (that section is already in flight for other items).
6. **Enforce the system so it cannot regress:**
   - a deterministic aspect over `src/cli` that bans `(s)`, `${…} pairs|nodes|files` templates, `process.stdout.write`/`stderr.write` outside `output/`, and `chalk` outside `output/`
   - a unit test that no member line repeats within a group
   - a test that no `messageData` string contains `\n` followed by spaces
   - a parity test that every `files[]`/`violations[]` item in JSON appears in `--details` text and vice versa
7. **Tests that pin output bytes today, and will need rewriting:**
   - Unit renderer suites:
     - `tests/unit/cli/check-render-groups.test.ts` (725 lines)
     - `check-render-header.test.ts` (1,114)
     - `check-render-views.test.ts` (1,109)
     - `group-issues.test.ts` (466)
     - `tests/unit/core/fill-progress.test.ts` (496)
     - `fill-prune-summary.test.ts`
     - `tests/unit/formatters/message-builder.test.ts`
     - `tests/unit/cli/tree.test.ts`
     - `tests/unit/relations/messages.test.ts`
     - the advise unit tests
   - JSON e2e: `tests/e2e/cli-check-json.test.ts` and `cli-check-json-filled.test.ts`. These stay green under additive changes.
   - 43 test files contain literal `'Why: '`, `'Fix: '`, `'Next: '` or `yg check: PASS|FAIL` strings, mostly e2e: `cli-check-views`, `cli-check-quiet`, `cli-progressive-*`, `cli-log-gate-extended`, `cli-greenfield-init`, `cli-examples`, `cli-lock-lifecycle`, and others.
   - The source carries 101 "byte-identical/byte-for-byte" comments that guard legacy shapes.

   Replace indentation-keyed assertions with assertions on the output document tree, plus the golden corpus from step 2 regenerated deliberately.
