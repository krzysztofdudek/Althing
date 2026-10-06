# Yggdrasil knowledge and schemas audit: 6.1.0 (`release/6.1.0` @ b428ccfa9)

## Verdict

The knowledge is a usable foundation. Its core model holds together across topics: pairs and units, the hash and its exclusions, status severity and the `max()` rule, when-grammar sites, fail-closed caching and the log gate. The three shared-text fragments (`shared-text.ts`) visibly keep their facts from drifting.

It is not yet coherent. There are several self-contradictions between topics: whether the logs lock file is written, whether a bare relation carries aspects, and what a drill hands `ctx`. Several schemas contradict their own annotated example or their field table. The worst case is the `aspect-adapt` example, which fails against the real parser.

The logic gaps sit at the edges where two rules meet: a consensus tie versus "refusals are final", `parents:` versus top-level placement, and `scope.files` versus `.yggdrasil/` files. The issue-code registry's meaning and fix strings are knowledge too, and they drift from the schemas as much as the topics do.

Under the refined ruling, the table below gives plain fixes only for clear defects. Real behaviour conflicts go to the decision briefs after it, which do not pick a winner.

## Findings

K = `source/cli/src/templates/knowledge/`, S = `source/cli/src/templates/schemas/`, R = `source/cli/src/utils/issue-code-registry.ts`.

| id | cl | sev | where | contradiction / gap (quoted) | wrong side | fix |
|---|---|---|---|---|---|---|
| F1 | 1 | med | K/log-management.ts:100-102, K/verification-and-lock.ts:171-172 vs log-management.ts:95-98, v&l:152-155 | "one with no `log_required` node and no `log.md` has no `yg-lock.logs.json`" vs "recorded for every node with mapped source". Verified: a scratch repo with no log_required type and no log.md got `yg-lock.logs.json` with `nodes.a.source` after `--approve`. | knowledge (the no-file sentence) | "The file is omitted only when no node has mapped source and none owns a log.md." |
| F2 | 1 | med | K/ports-and-relations.ts:8-10, 93-97 (also 225) vs 174-193, 231-232 | "bare relations … do NOT carry aspects across the boundary" and "does NOT propagate the target's aspects" vs "A relation that names nothing normalizes to `portNames: [default]` … put the aspect on `default`". Also "`default` binds every caller uniformly" vs "a relation that names a specific port enters ONLY through that port". | knowledge (8-10, 93-97, 225) | Replace with: a relation carries the aspects of the port it enters, which is `default` when it names none. Only a target with no aspects on that port carries nothing. |
| F3 | 1 | med | K/writing-deterministic-aspects.ts:26-30 vs packages-and-marketplaces.ts:263-266, cli-reference.ts:640-642 | "hands the check only `ctx.files`. A check that reads … `ctx.subject` … cannot run there" vs "A drill DOES supply `ctx.subject` … and `ctx.config`". The code supplies both (`src/ast/runner.ts:198-201`, 228). | knowledge (wd) | Say the graphless runner supplies `files`, `subject` and `config`, and list only `node`/`graph`/`fs`/parsers as unsupported. |
| F4 | 1 | med | K/cli-reference.ts:1025-1027 vs 1033 and `--help` | "a rule log takes `--limit` (default: whole history) and `--json`; a node log … has no `--json`". Actual: the rule log takes `--top`/`--limit` alias/`--all`/`--json`, and `yg log read` HAS `--json` (yg-log/1). The "no --json" claim was already flagged on 09-25 and is still there. | knowledge | Rewrite from the commander tree. |
| F5 | 1 | low | K/working-with-architecture.ts:188-191 vs aspect-status.ts:120-126, node/flow/arch schemas | "that status applies … unless explicitly overridden at the node or channel level" vs "bump up OK, downgrade is error". | knowledge | "…unless raised at another site; a lower status there is `aspect-status-downgrade`." |
| F6 | 1 | low | K/configuration.ts:64 vs :361, schema `debug` | "Applies during yg check --approve or when auto_approve triggers a fill" vs "every command appends its output". The code calls `initDebugLog` in 12 commands. | knowledge (:64) | Drop the fill-only clause. |
| F7 | 1 | low | R `config-tier-config-missing` (l.151) vs K/configuration.ts:134-142, `file-formats-config.ts:17` | "(claude-code alone takes no model)" vs a fallback for claude-code, codex and gemini-cli. configuration.ts:187 also says `model` is "Required." with no exceptions. | registry, cfg table | Name all three providers in both places. |
| F8 | 1 | low | R `aspect-adapt-key-not-adaptable` (l.215) vs S/aspect-adapt, packages-and-marketplaces.ts:159-161, 188 | "a key a package rule does not let a consumer change (its content, its check, its scope)". `scope` IS adaptable; the refused keys are name, description, implies, errs and when. | registry | Generate the list from `ASPECT_ADAPT_ROOT.refused`. |
| F9 | 1 | low | R `aspect-scope-invalid` (l.173) vs conditional-aspects.ts:213-223, aspect schema | Fix text "`files: [<glob>]`" vs `scope.files` being a file predicate (`path`/`content`/combinators). | registry | "files: <file predicate>". |
| F10 | 1 | low | K/aspect-status.ts:11-13 vs cli-reference.ts:346-347, 332 | "skip that unit's paid review" vs "a node with an enforced script refusal has its reviewer fills skipped". The code keys by component (`fill-contract.ts:254`). cli:332 "a run fills every pair it is answering for" ignores the skip. | knowledge (aspect-status; cli:332) | Say "node" (unit only when the unit has no node), and add the det-gate exception to cli:332. |
| F11 | 2 | high | S/aspect-adapt.ts:17-20 example vs its field table (`reviewer.type` and `scope.per` "yes, when … present") and "merged key by key; type stays the package's" | The schema contradicts itself, and the example fails. Verified in scratch: `reviewer: {tier: deep}` gives `aspect-reviewer-type-missing`; `scope: {files: …}` gives `aspect-scope-invalid` blaming the copy's `yg-aspect.yaml`, which the consumer must not edit. | **Brief B1** | See B1. |
| F12 | 2 | med | S/config.ts:137 vs the same schema's table, K/configuration.ts:190 | "(default 300). CLI providers and ollama; other API providers ignore it" vs "honored by every provider … 60 for the hosted APIs". The code honors it (`llm/anthropic.ts:21`, `api-utils.ts:77`). | schema comment | Copy the table wording. |
| F13 | 2 | med | S/config.ts:50 and `CONFIG_COVERAGE.excluded` vs K/configuration.ts:291 | "roots where an uncovered file is SILENT" / "Roots no coverage is asked of" vs "a supreme, global filter … no review pair … even when a node's own mapping names that exact path". The schema reads as coverage-only. It also omits `.git` subtrees from the auto-skip. | schema | State the global-exclusion semantics and the `.git` rule. |
| F14 | 2 | med | secrets table (`file-formats-config.ts:141-152`) vs S/secrets.ts example | The overlay table marks `reviewer.tiers`, `provider`, `consensus`, `config` as "yes". The example sets only `api_key`/`model`, and the parser accepts that (verified). `optional()` is applied to the top level only. | schema object | Apply `optional()` recursively. |
| F15 | 2 | low | `CONFIG_ROOT.auto_approve` type vs K/configuration.ts:480-481 | "boolean or `deterministic` \| `full`" admits `true`. The topic and the parser refuse it (verified: `auto_approve must be false, 'deterministic', or 'full' (got true)`). | schema object | Type `false \| deterministic \| full`. |
| F16 | 2 | low | K/configuration.ts:413-415 vs S/flow + parser | "(flow files are not held to this yet)". Verified: `bogus_key` in `yg-flow.yaml` is `yaml-invalid`. | knowledge (stale) | Delete the parenthesis. |
| F17 | 2 | low | S/aspect.ts `when` grammar (~l.170-174) vs conditional-aspects.ts:59, 71-74 | The node atom list omits `id`; the parser accepts it (`when-parser.ts:183`), and node/flow/arch schemas point here "for grammar". | schema | Add `id: <path> \| [<path>…]`. |
| F18 | 2 | low | S/node.ts:58 vs K/ports-and-relations.ts:180-183 | "BLOCKING ERROR (port-names-empty)" vs "surfaces as `code: yaml-invalid` … filtering or suppressing on it matches nothing". | schema | Say `yaml-invalid`. |
| F19 | 2 | low | S/aspect.ts companion section vs K/writing-llm-aspects.ts:259-263 | Subject-path dedupe "For scope.per: node" vs "regardless of scope". The code dedupes per unit either way (`core/companion-resolve.ts:157-166`). | schema | Drop the qualifier. |
| F20 | 3 | med | K/configuration.ts:158-161 + v&l:368-379, 385-390 | "A tie refuses" + "refusals are FINAL" + "every infra disposition writes nothing". With consensus 3, one provider error leaves 2 votes (still a majority of 3); a 1-1 split then becomes a permanent refusal caused by infrastructure, and the only exits are the edits v&l calls laundering. | **Brief B2** | |
| F21 | 3 | med | R `architecture-cycle` (l.226); no topic defines `parents:` at the top level | "can never be placed"; "rootable" is never defined. Verified: a node of a cycle type sits at the root with no `parent-type-forbidden`. The code skips root nodes (`core/checks/architecture.ts:503`). | **Brief B3** | |
| F22 | 3 | med | K/writing-deterministic-aspects.ts:356-358, 377-380, 481-488 | An undeclared `ctx.graph.node` read "is a Violation", while an undeclared `ctx.fs` read is infra with a graph remedy. Verified: at fill the graph read is also infra (`not judged`, `aspect-check-runtime-error`), and its message says "Fix .yggdrasil/aspects/sib/check.mjs", the false remedy the fs path's own code comment rejects (`structure/runner.ts:115-120` vs 137-147). | **Brief B4**; the message is a plain defect | Route `UndeclaredGraphReadError` through `StructureRunnerError` with the "add a relation" next. |
| F23 | 3 | med | K/meta-modeling.ts:75-88, 110-114 vs conditional-aspects.ts:213, aspect schema "Subject set = mapped files ∩ filter" | `scope.files` is silently bypassed for `.yggdrasil/` files: the classification auto-exempt (`core/file-when-evaluator.ts:60-69`) also runs for `scope.files`. A general rule carries an undocumented exception everywhere except meta-modeling. | **Brief B5** | |
| F24 | 3 | low-med | K/working-with-architecture.ts:158-164, S/architecture `log_required` vs log-management.ts:71-79 | "demands a fresh log entry whenever its mapped source changed since … last positive closure". Where `--only-deterministic` is the only fill, one entry answers forever. The only signal is the `log-cycle-open` warning (verified), which log-management never names. | **Brief B6** | |
| F25 | 3 | low | R `aspect-status-changed-outside-cli` (l.271) + v&l:156-167, cli:1044-1048 | "its own log records no reason", "noticed once". The read path (`findStatusDrift`) never reads the rule log, and the remembered status lives in the per-checkout gitignored cache. Every other checkout therefore warns about a change already committed to the rule's log, until its own full fill. | false message: plain fix | Have the classify path apply the same `lastRecordedStatus(log) === to` test the record path uses (`core/log/aspect-status.ts:190`). |
| F26 | 3 | low | K/writing-llm-aspects.ts:351-358 | The companion example probes `docs/scenarios/<stem>.md` via `ctx.fs.exists`, which is outside the allowed reads unless mapped and relation-reachable. That would be an infra fail. Not run; reasoned from :285-288. | knowledge | State the prerequisite (map `docs/scenarios`, declare the relation). |
| F27 | 3 | low | aspect schema `companion:` key; `errs`; "rootable"; "constitution" (aspect schema review_by) | Terms and keys used without definition in any topic. `companion:` interactions are undefined: with `check.mjs`, without `content.md`, alongside `companion.mjs`, and whether modules it imports fold, given that RULE_SUPPORT_FILES says outside-dir imports do not. | knowledge | Add them to aspects-overview / writing-llm. |
| F28 | 3 | low | K/onboarding.ts:346-347; K/configuration.ts:37, 290 | A dangling "(see the C2 known-limitation note)". The configuration topic gives the `required` default `["/"]` but never says `yg init` writes `required: []` (verified in the scaffold). | knowledge | Remove the reference; add the init fact. |

## Decision briefs (class 4, ordered by impact; the brief does not pick a winner)

**B1: Adaptation of partial `reviewer:` / `scope:` blocks (F11)**
- **Code:** `mergeAdaptOverAspect` merges one level deep, then validates the result as a whole `yg-aspect.yaml`. A package rule whose kind is inferred (no `reviewer:`) or with no `scope:` therefore gets `{tier}` or `{files}` alone, and that fails `aspect-reviewer-type-missing` / `aspect-scope-invalid`, with the message pointing at the uneditable copy.
- **Knowledge:** the adapt example (`reviewer: tier: deep`), "type stays the package's", "mappings … merge key by key", and packages topic ":159 its granularity, its reviewer". The adapt table says the opposite ("yes, when reviewer: is present").
- **Options:**
  - (a) Fill `reviewer.type` from the inferred kind and `scope.per` from the package default (`node`) before validating. Adopters' natural adaptations work, no existing graph breaks, and "type stays the package's" becomes literally true.
  - (b) Keep the code and change the example and table to require `type`/`per`. The consumer then restates facts that "stay the package's", and a restated `type` can silently diverge after a package update.
  - (c) Refuse `reviewer.type` in adaptations entirely and inject it. This is stricter; adapt files that already restate it would break.
- **Recommendation:** (a), plus a plain fix so the message names `yg-aspect.adapt.yaml`.

**B2: Consensus tie after provider errors (F20)**
- **Code:** `llm/aspect-verifier.ts:80-98` drops provider-error votes and requires more than half of `consensus` to have answered. A tie among the remaining verdicts then returns `codeViolation`, which is written and cached as final.
- **Knowledge:** "A tie refuses" (configuration.ts:161), which is consistent with the code but in conflict with fail-closed and refusal finality.
- **Options:**
  - (a) Treat a tie as infra (nothing written). This is consistent with "only verdicts vote", and it costs a re-run.
  - (b) Keep refusing, but do not cache a refusal that had fewer verdicts than asked. That adds a new lock state.
  - (c) Require all `consensus` calls to return. This is stricter and makes infra misses more frequent.
- **Recommendation:** (a). A tie is only reachable through missing votes, so it is evidence of infra, not of the code.

**B3: `parents:` and top-level nodes (F21)**
- **Code:** a root node ignores its type's `parents:`, yet `architecture-cycle` errors with "can never be instantiated".
- **Knowledge:** silent on top-level placement; the registry premise assumes it is forbidden.
- **Options:**
  - (a) A type declaring `parents:` may not sit at the top level (a new `parent-type-forbidden` case). This is coherent with the cycle check; existing graphs with such root nodes turn red and need a user decision.
  - (b) Root is always allowed. Drop `architecture-cycle`, or demote it to a warning about types that are unplaceable below the root.
- **Recommendation:** (a) behind an explicit changelog entry. Either way, define "rootable".

**B4: Out-of-boundary `ctx.graph` read (F22)**
- **Code:** infra at fill; a Violation-kind line in aspect-test; a "fix check.mjs" message.
- **Knowledge:** says it is a Violation (a cached, final refusal).
- **Options:**
  - (a) Both boundaries are infra with the graph remedy. This is uniform, and the knowledge text changes.
  - (b) Make the graph read a real cached refusal as the knowledge says. It is then final until an input changes: an adopter who adds the relation may or may not see the pair re-open, depending on what was observed. Not settled: in my scratch run the pair did re-open after the relation edit.
- **Recommendation:** (a). The message bug is a plain fix either way.

**B5: `scope.files` on `.yggdrasil/` files (F23)**
- **Code:** auto-exempt, so the filter always passes.
- **Knowledge:** the general rule says the filter always applies; meta-modeling documents the exception.
- **Options:**
  - (a) Apply the auto-exempt to type classification only. Meta aspects become filterable, and existing meta nodes may lose subjects: their pairs are pruned and re-opened.
  - (b) Keep it, and state the exception in conditional-aspects and the aspect schema.
- **Recommendation:** (a). The exemption exists to stop `type-when-mismatch`, not to disable an author's filter.

**B6: Log gate re-arming without a full fill (F24)**
- **Code and knowledge:** agree (`log-cycle-open` warning).
- **Conflict:** the type-level promise in working-with-architecture and the architecture schema.
- **Options:**
  - (a) Rewrite the promise with the condition ("…since the last full fill that closed it") and name `log-cycle-open`.
  - (b) Let `--only-deterministic` advance the baseline for nodes with no reviewer rules. This breaks its "zero committed writes" contract.
- **Recommendation:** (a).

## Structural recommendations

1. **Derive schema variants recursively.** The adapt table reuses the aspect fields' nested `required`, and the secrets overlay makes only its top level optional. Both produce wrong tables (F11, F14).
2. **Round-trip every annotated schema example through its parser in a test.** It would have caught F11 and F15. The 09-25 report recommended this; it is still not in place for the adapt example.
3. **Treat registry `meaning`/`fix` strings as knowledge.** Build the lists they name (adaptable keys, providers with a model fallback, `scope.files` shape) from the schema objects (F7-F9).
4. **Move facts stated in more than one topic into `shared-text.ts`,** the way `RULE_SUPPORT_FILES` already is: logs-file existence, drill ctx, bare-relation semantics, det-gate granularity, flow strictness (F1-F3, F10, F16).

## Commands used

- `git -C …/Yggdrasil log -1`
- Read every file in `templates/knowledge/*.ts` (index, shared-text, all 15 topics plus the generated issue-code table) and `templates/schemas/*.ts`; read `utils/file-formats-{config,graph,package}.ts`.
- In the dev container: `yg knowledge list/read cli-reference`, `yg schemas read <all 10>`, `yg aspects log read --help`, `yg log read --help`.
- In the dev container scratch repos `$TMPDIR/kaud/{r1,r2,mk}`:
  - `yg init --no-reviewer`
  - `yg check`, `--approve`, `--approve --only-deterministic`
  - `yg log add`
  - `yg pack add $TMPDIR/kaud/mk#p1 --as acme/mk` with adaptation variants
  - a flow with an unknown key
  - a parents-cycle architecture
  - a secrets overlay
  - `auto_approve: true`
  - a script rule reading an undeclared graph node, caught and uncaught
- Source reads: `config-parser.ts`, `llm/{anthropic,api-utils,cli-base,aspect-verifier}.ts`, `debug-log.ts` and its init sites, `structure/{ctx-graph,runner}.ts`, `core/fill-det.ts`, `fill-contract.ts`, `ast/runner.ts`, `io/aspect-adapt-parser.ts`, `core/check-aspect-status.ts`, `core/log/aspect-status.ts`, `core/checks/architecture.ts`, `core/companion-resolve.ts`, `utils/when-parser.ts`, `core/file-when-evaluator.ts`.

## Not verified

- **F26** is reasoned, not run.
- **B5:** I read the auto-exempt code but did not confirm by running which callers of the file-when evaluator it covers.
- **B4:** the re-open behaviour after the relation edit is observed but not explained.
- **B2:** the tie path is from code reading, not a live consensus run.
