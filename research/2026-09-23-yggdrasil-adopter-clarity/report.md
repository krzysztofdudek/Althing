# Yggdrasil 6.1.0: how clearly it operates for an adopter

Scope: release/6.1.0 at tip `007473ad`. Six angles (first hour, daily loop, reviewer setup, agent layer, reference truth, failure and upgrade) each exercised the live CLI in the dev container, and a verifier re-checked every finding. I merged duplicates across angles into the consolidated IDs below (M = major, m = minor). Each one lists the original finding ids it came from. The synthesizer spot-checked three claims against the repo: `rules.ts:20`/`:131` still names `yg verdict record`, `fill.ts:190-204` applies the structural gate before any `--only-deterministic` handling, and `README.md:153` and `getting-started.md:292` use a bare `yg check` as the CI gate.

## 1. Verdict

For one problem at a time, Yggdrasil 6.1.0 is clear. A keyless `yg init` states what works. The first check is green and says why. Deterministic refusals, undeclared relations, conflicted lock files, overdue `review_by` dates and a mistyped `check.mjs` export each print what went wrong, why, and a command that fixes it. Clarity breaks down in three places:

- **When failures stack or a fill fails partway.** The closing `Next:` line and the `--json` `suggestedNext` field keep pointing at `yg check --approve`, even when that command is certain to abort or has just failed for a reason that appeared only on stderr.
- **In the story told to agents and to CI.** `yg prime` is the manual every agent must read first. It still teaches the removed `yg verdict record` as a second judge, which contradicts the release's own one-judge model. The docs also describe the CI gate three different ways: it "executes no adopter code", it is "unaffected by auto_approve", and it is "free and keyless". None of the three holds in every documented configuration.
- **In the keyless and brownfield paths that the README promotes.** One judgment rule in a project with no reviewer stops even the free deterministic fill. "Cheap" aspect-less nodes switch on blocking relation checks.

No finding survived verification as a blocker. In every case the adopter could eventually recover from the CLI's own messages. Nine majors remain, and each one teaches a wrong mental model or costs real time. They cluster around the next step the CLI suggests, the keyless and CI trust model, and reviewer diagnostics.

## 2. The mental-model gaps

1. **The one-judge release still teaches two judges to agents.** 6.1.0 removed the external-judge channel (CHANGELOG [Unreleased] › Removed; `docs/the-lock.md:122`). `yg prime` still lists `yg verdict record` as a writer of the lock, in two places. `yg knowledge list` still advertises `verdict` in the cli-reference topic. The graph's own node log (`.yggdrasil/model/cli/templates/log.md:200`) claims the rules template was cleaned, which is false. The CHANGELOG has no Breaking block and no upgrade step. Five of six angles found this independently. Findings: M1, m29, m30.
2. **"Keyless" is sold as a mode, but the CLI does not treat it as one.** The README and getting-started call "None for now" a real answer: "script rules, dependency control and the CI gate all work… with no key". The CLI instead treats a missing `reviewer:` section as a structural error that gates the whole run. That covers `--only-deterministic`, `--dry-run`, and advisory-only prose rules. The remedy it suggests is an interactive wizard, which an agent cannot use. The onboarding playbook's keyless branch has the agent hand-write config and a `.gitignore` that is already stale. Findings: M2, m1, m6, m16.
3. **`Next:` does not always point at a working next step.** Plain `yg check` computes `suggestedNext` from the "unverified" count, not from the highest-precedence blocker. It points at `--approve` in several situations where that command cannot help:
   - no reviewer is configured;
   - the reviewer is unreachable;
   - a `check.mjs` failed to run;
   - a `yg-suppress` marker has no reason;
   - a log conflict is mid-merge.

   Retry lines also drop the flags the user actually ran (`--only-deterministic`, `--dry-run`). The agent manual says "`suggestedNext` … Follow it", so these gaps turn into agent loops. Findings: M2, M8, M9, m7, m24.
4. **The CI trust model is stated three ways, and each is wrong somewhere.**
   - "CI executes no adopter code" is false: the documented recipe runs every `check.mjs`, including installed packages.
   - "CI scripts always use explicit flags and are unaffected" is false: the README/getting-started gate is a bare `yg check`, which honours a committed `auto_approve: full`.
   - "Free and keyless" is false in two ways. One prose rule in a keyless project aborts it. A project whose only recording run is `--only-deterministic` quietly stops enforcing `log_required`.

   On a fresh clone, cache misses read as "not yet reviewed". Findings: M3, M4, M2, m4, m6.
5. **The brownfield model teaches "free labels and free nodes", then charges for them later.**
   - Getting-started says aspect-less nodes "produce no pairs … count as covered for free", and that CI is then green. Mapping them actually switches on blocking `relation-undeclared-dependency` checks, and those may need architecture edits.
   - With the `node_types: {}` that init writes, any type string is accepted. The first real type then turns every existing node red at once.
   - The agent manual's only no-nodes guidance is "Greenfield: Graph before code".
   - The first `Next:` tells the adopter to map Yggdrasil's own files (AGENTS.md, CLAUDE.md, .clinerules/, .gitattributes).

   Findings: M5, M6, m2.
6. **Every reviewer failure produces the same message.** A missing binary, a missing API key, a bad key, a bad model name and a timeout all become one of three strings: "endpoint did not respond", "Reviewer unavailable" or "Anthropic request failed". Stderr and HTTP status are dropped, even with `debug: true`. The Copilot-specific "not found / YG_COPILOT_BIN / VS Code stub" text exists in `copilot-cli.ts` but is never reached. The non-interactive `yg init --provider` accepts a reviewer that cannot run and reports success. The docs also disagree on which model a default config uses (haiku or sonnet). Findings: M7, m9, m10, m11, m12.
7. **The core vocabulary is undefined or used loosely.** The first-hour path never defines "pair" or "lock". The report nonetheless counts `yaml-invalid`, `type-undefined` and `relation-undeclared-dependency` as "N pairs". "Unverified (not yet reviewed)" covers three cases: never judged, stale, and a local-cache miss. "All expected pairs hold valid verdicts" prints directly above a FAIL. Follow-on errors from a broken graph are misattributed: schema errors are called "YAML syntax", and aspects that are in use are called orphaned. Findings: m3, m4, m5, m22.
8. **The agent protocol contradicts itself.**
   - The subagent template demands "graph nodes for every new/modified source file"; the node model says one node per feature area, and a type-covered file needs no node at all.
   - A ban on system terms sits next to consent requests that must name a rule.
   - The onboarding playbook writes architecture "silently", against the digest's invariant that architecture edits need the user's confirmation.
   - The log gate's fix invites the agent to invent a WHY for someone else's change.
   - The manual runs to about 10k words with duplicated sections.

   Findings: m13–m19.
9. **Secondary reference surfaces have drifted.**
   - `simulate --file` is missing from the simulate reference.
   - `--top 0` is rejected as "not non-negative".
   - `aspects log read` is called the "exact counterpart" of `log read` but takes different flags.
   - Several `--help` texts leave out behaviour the reference states.
   - Flag implication is silent: `--only-deterministic` alone fills, and `--approve --no-approve` depends on order.

   Findings: m8, m25–m28.

## 3. Findings ranked by severity

Blockers: none survived verification.

| id | severity | title | where | suggested fix |
|---|---|---|---|---|
| M1 | major | The agent manual (`yg prime`) and the knowledge index teach the removed `yg verdict record` as a second verdict writer | `source/cli/src/templates/rules.ts:20`, `:131`; `templates/knowledge/cli-reference.ts:2`; `.yggdrasil/model/cli/templates/log.md:200` | Delete both mentions. Lock writers become `--approve`, `log merge-resolve` and the upgrade migration. Drop `verdict` from the topic description. Add a test that fails when prime or knowledge output names an unregistered command. Correct the node log. |
| M2 | major | Keyless project plus one judgment rule: `--approve --only-deterministic` and `--dry-run` abort the whole run, and `Next:` and the retry line lead back into the abort | `source/cli/src/core/fill.ts:190-204`; `docs/cli-reference.md:565-567`, `:623-631`; `docs/the-lock.md:76-80`; `README.md:31`, `:56`; `rules.ts` (prime "free, keyless CI gate") | Exempt `--only-deterministic` and `--dry-run` from `config-reviewer-missing`, or document the abort everywhere. Rank `config-reviewer-missing` above `unverified` in `suggestedNext`. Echo the invoked flags in the retry line. Lead the fix with `yg init --provider <name>`. |
| M3 | major | The CI recipe uses a bare `yg check`, which honours a committed `auto_approve` and calls the reviewer in CI | `README.md:153`; `docs/getting-started.md:292` vs `:311-313`; `docs/how-it-works.md:39-44`; `docs/configuration.md` CI note | Make the gate step `yg check --no-approve` in README and getting-started. Optionally refuse config-driven fills when `CI` is set. |
| M4 | major | The knowledge topic says "CI executes no adopter code", while the recommended recipe runs every `check.mjs`, packages included | `source/cli/src/templates/knowledge/writing-deterministic-aspects.ts:33-35` | Say that plain check never executes checks, and that the recipe's cache-rebuild step does run every `check.mjs`, including installed packages. |
| M5 | major | Brownfield guide promises "cheap", pair-free, green aspect-less nodes, but mapping them turns on blocking relation conformance | `docs/getting-started.md:248-270` | Add a "declare relations" step, explain `relation-undeclared-dependency` and possible architecture edits, or point to progressive mode for inherited debt. |
| M6 | major | No brownfield path for the agent: prime says "Greenfield: Graph before code", and the first `Next:` says to map Yggdrasil's own plumbing files | `rules.ts:209`; first `yg check` after `yg init`; `docs/platforms.md:41-42`; `docs/getting-started.md:225-231` | Add a brownfield bullet to prime. Have `yg init` write plumbing paths to `coverage.excluded`, or group them as "exclude, don't map". |
| M7 | major | Reviewer failures collapse into generic messages: stderr, HTTP status and the Copilot-specific cause are all lost | `source/cli/src/llm/cli-base.ts:217`, `:263-270`; `llm/anthropic.ts:22`, `:42-58` (and openai, google); `core/fill-llm-phase.ts:155-172`; `llm/copilot-cli.ts:99-118` | Give each provider its own unavailable reason. Put a redacted stderr tail, exit code or timeout, and a classified HTTP status in the reason. Say "no API key: set X" when the key is missing. Name `debug: true` in the next line. |
| M8 | major | After an infrastructure failure the stdout report and `--json` say only "unverified → `yg check --approve`"; the cause lives only on stderr | `yg check --approve` with an unreachable reviewer, a `check.mjs` runtime error, or a reason-less suppress marker; `check-render-groups.ts` | Carry the infra disposition into the report and `yg-check/1` (e.g. `reviewer-unreachable`, `check-failed-to-run`). Point `suggestedNext` at that fix. Consider caching the last infra reason per pair for plain check. |
| M9 | major | Mid-merge log conflict dead end: the Fix command refuses to run, the working path is undocumented, and the docs contradict each other on whether merge-resolve unions | `yg check` log-conflict → `yg log merge-resolve`; `docs/the-lock.md:114` vs `docs/cli-reference.md:718-724` | Have the message give the real sequence (keep both sides, remove markers, order by date, commit, then merge-resolve), or have merge-resolve read `MERGE_HEAD` and write the union. Rank log-conflict above unverified. Reconcile the two docs. |
| m1 | minor | An advisory prose rule turns the build red when no reviewer is configured, contrary to "advisory never blocks" | `docs/aspect-status.md:41`; getting-started advisory tip | Make `config-reviewer-missing` follow the strictest affected status, or list it as a status-independent exception. |
| m2 | minor | With `node_types: {}`, any node type string is silently accepted, then goes red when the first type is added | `core/checks/architecture.ts:316-320`; `docs/getting-started.md:142` | Run the type-existence checks on an empty architecture, or warn about the deferred requirement. |
| m3 | minor | "Pair" and "lock" are undefined on the first-hour path; non-pair structural errors are counted as "N pairs" | README, how-it-works, getting-started Core list; grouped renderer | Define pair and lock in getting-started Core. Use "N issues" for non-pair codes. |
| m4 | minor | One label, "unverified (not yet reviewed)", for never-judged, stale and fresh-clone cache-miss pairs, with one generic fix | `check-render-groups.ts:266`; `docs/cli-reference.md:289-292` | Split into stale / never reviewed / "deterministic cache not built → `--approve --only-deterministic` (free)". Add `stale` to the states in the agent rules. |
| m5 | minor | "0 reviewer calls made — all expected pairs hold valid verdicts" printed right above FAIL | `yg check --approve` summary; `fill-report.ts:220-244`; `docs/cli-reference.md:576-578` | Print it only when nothing was filled, as documented. Otherwise report the counts of approved and refused pairs. |
| m6 | minor | `log_required` quietly stops asking for entries when the only recording run is `--only-deterministic` | `docs/nodes.md:109` vs `docs/the-lock.md:82` | Emit an advisory finding when the log cycle never closes. Mention the caveat next to `log_required`. |
| m7 | minor | The log gate stops the free gate after printing a "Filling N pairs" header, and its retry names the full `--approve` | `yg check --approve --only-deterministic` with a missing log entry | Stop before the header. Echo the invoked flags. Document the gate in the `--only-deterministic` section. |
| m8 | minor | Flag contract drift: `--only-deterministic` alone fills, `--approve --no-approve` depends on order, and the `--dry-run` error text is wrong under `auto_approve` | `check.ts:45-47`, `:100`; `yg check --help` | Help: "implies --approve". Reject contradictory approve flags. Qualify the `--dry-run` message. |
| m9 | minor | `yg init --provider X` writes a reviewer whose binary is absent (or whose model name is invalid) and exits 0; the CHANGELOG says init checks for the CLI | `cli/init.ts:300-325`; `init-reviewer-setup.ts:193`; CHANGELOG [Unreleased] Added | Run `testCliProvider` in the flag path as a warning, or narrow the CHANGELOG claim. |
| m10 | minor | `yg init --provider` on an existing repo silently strips every explanatory comment from `yg-config.yaml`, including the "absent coverage = whole repo" note | `yg init --provider copilot-cli --model auto` | Use a comment-preserving YAML edit, or announce the rewrite. |
| m11 | minor | Default-model docs split: haiku in configuration.md, sonnet from init. The codex `--model` error contradicts configuration.md. The copilot error omits `auto`. Getting-started omits Copilot from its list of agent CLIs | `docs/configuration.md:192`; `docs/getting-started.md:30`, `:74`; `config-parser.ts:182-186`; init errors | Reconcile init-written vs runtime defaults in configuration.md. Add "(e.g. auto)" to the copilot error. List Copilot CLI in getting-started. |
| m12 | minor | openai-compatible silently reads `OPENAI_API_KEY` (and requires it even for keyless local servers); hosted API calls have an undocumented fixed 60s timeout | `docs/configuration.md:195`, `:208`; `llm/api-utils.ts:8`, `:18`; `openai.ts:53` | Document the key source and the requirement (or make the key optional). Document or make configurable the 60s timeout. |
| m13 | minor | The subagent template demands "graph nodes for every new/modified source file", against the node model | `rules.ts:535` | Reword to "every file covered (node mapping or type-covered); new nodes only for new feature areas". |
| m14 | minor | "Never use system terms (aspect, node, pair…)" with the user, yet consent requests must name rules | `rules.ts:293` | Scope the ban to business-feature summaries. Require exact rule ids in authorization requests. |
| m15 | minor | The onboarding playbook writes the first node type "silently" and forbids opening with plain `yg check`, against the digest invariants | `templates/knowledge/onboarding.ts:165`, `:174` | Ask one confirmation for the architecture edit. State that digest invariants win over playbook style. |
| m16 | minor | The onboarding keyless branch hand-writes config and a stale `.gitignore` list (missing `.family-candidates*`) | `templates/knowledge/onboarding.ts:327-334` | Replace it with `yg init --no-reviewer`. |
| m17 | minor | "Fix errors before any other work" plus the log gate pushes the agent to write a WHY for a change it did not make | `rules.ts:188`; log-entry-missing Fix | Rule: an unlogged change the agent did not make goes to the user. Say so in the Fix line. |
| m18 | minor | The prime manual is about 10k words and 63 KB, with duplicated sections, and every subagent must load it | `yg prime` (619 lines) | Keep the decision protocol plus pointers. Move mechanism detail to knowledge topics. Consider `--subagent`. |
| m19 | minor | The `yg advise` NEXT text addresses agent and human at once ("This requires your approval") and has no `Next:` label | `core/advise-nominations.ts:434` | Say "Requires the user's approval". Label the line. |
| m20 | minor | An async `check.mjs` that throws kills the `--approve` run with a bare `Error:` and no report | `yg check --approve` | Catch the returned Promise before classifying it as infra. |
| m21 | minor | A reason-less `yg-suppress` marker passes `yg suppressions` and `yg check`, and fails only once a violation lands in its range | `yg suppressions`; `docs/reviewers.md:578` | Warn on missing reasons in `yg suppressions` and at check time. |
| m22 | minor | A broken graph file produces misattributed follow-ons: schema errors are called "YAML syntax", in-use aspects are called orphaned, and a false "no `when:`" banner appears | `yg check` with an invalid yg-node/yg-architecture file | Suppress follow-ons while load errors exist. Give schema errors their own why/fix. |
| m23 | minor | A family-candidates file with an unknown `v`, or unparseable JSON, is dropped with no message | `cli/advise.ts:138-170`; `docs/family-contracts.md:38` | Add an Attention line naming each skipped file, why it was skipped, and the next step. |
| m24 | minor | The `unmapped` Fix line runs two commands together; "the protocol" is undefined; `yg advise` cites an `incidents.md` that does not exist | `yg check` unmapped; `yg advise` | Split the commands. State the concrete consequence. Do not cite absent files. |
| m25 | minor | The simulate reference says `--node` is "Required" and omits `--file`; the survivorship caveat prints twice | `docs/cli-reference.md:1507-1518`; knowledge cli-reference | Document "exactly one of `--node`/`--file`". Print the caveat once. |
| m26 | minor | `--top 0` is rejected as "not a non-negative whole number" | `yg check --top 0` | Say "positive whole number (1 or more)". |
| m27 | minor | `yg aspects log read` is called the "exact counterpart" of `yg log read` but takes different flags | `docs/cli-reference.md:964-975` | Align the flags or list the differences. |
| m28 | minor | `--help` texts omit documented behaviour (tree "hierarchical" vs flat; portal defaults and the root-level write; `init --upgrade` migrations); empty `tree`/`flows` print nothing | `docs/cli-reference.md:746`, `:1267-1276`, `:1669-1675` | Sync the help text. Print "(no nodes yet)" / "(no flows defined)". |
| m29 | minor | The CHANGELOG has no Breaking block, files a required migration under Fixed, gives no `yg init --upgrade` instruction; `init --upgrade` adds `.gitignore` lines yet prints "nothing changed" | `CHANGELOG.md:14-38` | Add Breaking and "Upgrading from 6.0.0" sections. Add a hidden `verdict` stub pointing to `--approve`. Report `.gitignore` top-ups. |
| m30 | minor | The CHANGELOG removes `yg-review/1` and, in the same release, lists Horde `retro` as a new consumer of it | `CHANGELOG.md:16` vs `:31`; `docs/family-contracts.md` | Drop or rewrite that half of line 31. |

## 4. Details for the majors

### M1 — The agent manual teaches the removed `yg verdict record`

- **Source findings:** prime-documents-removed-verdict-record, agent-rules-cite-removed-verdict-command, stale-yg-verdict-in-prime, prime-references-removed-verdict-record, prime-teaches-removed-verdict (reported by two angles).
- **Evidence:**
  - `yg prime` line 7: "The lock is written by `yg check --approve`, `yg log merge-resolve`, and `yg verdict record` (the external-judge channel — a judgement recorded straight into the committed lock…)".
  - `yg prime` line 118 (the `--approve` row): "(The one other writer of verdicts is `yg verdict record`… without running the configured reviewer…)".
  - `yg knowledge list`: "cli-reference … check, check --approve, context, node, verdict, adopt, …".
  - `yg verdict record` → `error: unknown command 'verdict'` (exit 1), with no pointer to a replacement.
  - `docs/the-lock.md:122` and CHANGELOG [Unreleased] › Removed both say the channel is gone.
  - The knowledge topic's own `--approve` section calls it "the only writer of verdicts".
  - `.yggdrasil/model/cli/templates/log.md:200` claims the rules template no longer describes these commands.
  - Synthesizer spot-check: `git grep` at `007473ad` confirms `rules.ts:20` and `:131`.
- **Impact:** AGENTS.md makes `yg prime` the required first read. The agent learns that a prose rule can be settled without the configured reviewer, which is the exact model 6.1.0 removed. An agent stuck with no reviewer, or facing a refusal it dislikes, will reach for the command and hit a bare commander error. The shipped manual also contradicts itself.
- **Fix:** Remove both clauses. Drop `verdict` from the topic description. Add a test that every command named in the rendered prime and knowledge text is registered in `bin.ts`. Consider a hidden `verdict` stub: "removed in 6.1.0; prose rules are judged only by the configured reviewer via `yg check --approve`". Correct the node log entry.
- **Verifier note:** Reproduced by five angles. Rated major, not blocker: the failure is loud, nothing can be recorded out of band, and the main `--approve` path still works. The damage is the mental model, not a stuck adopter.

### M2 — The keyless "free gate" aborts once one prose rule exists

- **Source findings:** keyless-free-gate-aborts-on-first-prose-rule, no-reviewer-abort-contradicts-prime, keyless-llm-rule-aborts-deterministic-fill, keyless-content-md-aborts-deterministic-fill, keyless-path-flagship-rule-is-judgment, next-step-loops (no-reviewer half), no-reviewer-fix-interactive-only.
- **Evidence:**
  - Setup: `yg init --no-reviewer` (or a non-TTY `yg init`) prints "Working now, free: script rules, dependency control, yg check in CI." One `check.mjs` aspect and one `content.md` aspect were then added.
  - `yg check --approve --only-deterministic` → "yg check --approve aborted — 1 problem must be fixed before anything runs … nothing ran and nothing was written. Fix the errors below, then re-run: yg check --approve / A judgment rule has no judge…" (exit 1). The deterministic pair stays unverified.
  - `--approve --dry-run` aborts the same way, although `cli-reference.md:612-614` says a preview "always exits 0". The same page does allow for "a broken configuration".
  - Plain `yg check` just before ends with "Next: yg check --approve (fills 2 unverified; 1 error remain — need code/graph fixes)". The remaining error is a config problem, not a code or graph one.
  - The docs promise otherwise:
    - `cli-reference.md:566`: "no reviewer configured … write nothing and leave the pair unverified", i.e. per pair.
    - `cli-reference.md:629-631`: `--only-deterministic` rematerializes the cache "without a key".
    - `the-lock.md:78`: "no provider key, no LLM call, no cost".
    - Prime: "the free, keyless CI gate (no reviewer at all)".
  - The README quickstart's flagship rule (`README.md:52-56`, a payments audit rule) is itself a judgment rule.
  - The suggested remedy, "Run yg init and pick 'Configure reviewer'", is a menu. A non-TTY `yg init` then answers "Pass one: --provider <name>", which costs an extra round-trip.
  - Synthesizer spot-check: `fill.ts:190-204` applies `APPROVE_GATING_CODES` before any `onlyDeterministic` branch.
- **Impact:** A keyless adopter who adds a first judgment rule, or accepts a pack or Grain proposal containing one, loses the free script-rule fill in CI as well. `Next:` and the abort's own retry line both point at a command that is certain to abort. Prime says nothing about whether the agent may configure a reviewer itself, so the agent either stalls or runs `yg init --provider claude-code` unasked. That sends code to a provider on the user's plan without consent.
- **Fix:** Pick one behaviour. Either exempt `--only-deterministic` and `--dry-run` from `config-reviewer-missing`, leaving LLM pairs unverified per pair as documented, or document the whole-run abort in README, getting-started, cli-reference and prime. Either way:
  - make `config-reviewer-missing` outrank `unverified` in `suggestedNext`;
  - lead its fix with the literal `yg init --provider <name> [--model <m>]`;
  - echo the invoked flags in the retry line;
  - add to prime: "configuring a reviewer is the user's decision; propose it or set the rule to `status: draft`".
- **Verifier note:** Four angles rated this major and first-hour rated it minor. Recovery takes one or two clear hops: getting-started says to add a judge with the first judgment rule, and the abort names the cause. The synthesis keeps major because the documented free gate demonstrably does not do what three docs and the agent manual promise, and the suggested next step walks into the abort.

### M3 — The CI recipe's bare `yg check` honours `auto_approve`

- **Source findings:** ci-recipe-bare-check-vs-auto-approve, ci-recipe-bare-check-honours-auto-approve.
- **Evidence:**
  - README (`:153`) and getting-started (`:292`): `run: npx @chrisdudek/yg check`, with no flag.
  - getting-started `:311-313`: "CI scripts always use explicit flags and are unaffected."
  - `how-it-works.md:39-44` uses `yg check --no-approve` and says "the CI recipe spells them out". `configuration.md`'s CI note agrees.
  - Fresh clone with `auto_approve: full` committed: `CI=true yg check` → "auto-approve: full — bare 'yg check' will call the reviewer. Filling 1 unverified pairs…".
  - There is no CI detection in the source (`git grep process.env.CI` finds nothing).
- **Impact:** `yg-config.yaml` is committed, so one teammate's "local convenience" setting reaches CI. There CI either fails for lack of keys, or records fresh verdicts on unreviewed changes instead of refusing them. That breaks the guarantee that a green build can't lie, and the docs say it cannot happen.
- **Fix:** Change the gate to `yg check --no-approve` in README and getting-started. Optionally refuse config-driven fills when `CI` is set.
- **Verifier note:** first-hour rated major, daily-loop minor: it needs a committed `auto_approve: full`, the gitignored `yg-secrets.yaml` overlay exists for local settings, and the CI log's first line names the cause. The synthesis keeps major, because the consequence is a weakened gate that the docs explicitly promise cannot happen, and the fix costs one word.

### M4 — "CI executes no adopter code" is false

- **Source finding:** ci-executes-no-adopter-code-claim.
- **Evidence:**
  - `yg knowledge read writing-deterministic-aspects` (`writing-deterministic-aspects.ts:33-35`): "Plain `yg check` never executes a deterministic check … So CI executes no adopter code".
  - The recipe's first step is `yg check --approve --only-deterministic`. Live, it printed "[det] requires-audit on node:payments … 1/1 filled", which means it executed `check.mjs`.
  - The `yg pack` help itself says installing a package "runs its author's code on every check".
- **Impact:** This is a wrong trust statement in the agent's knowledge base, exactly where a user decides whether to run CI on untrusted PRs or install third-party rule packages.
- **Fix:** "Plain `yg check` never executes a check; the CI recipe's cache-rebuild step runs every `check.mjs`, including installed packages, because the deterministic cache is gitignored."
- **Verifier note:** Confirmed. The first half of the sentence is true; the CI conclusion is false for the recommended pipeline.

### M5 — Aspect-less brownfield nodes are not free

- **Source finding:** brownfield-aspectless-nodes-not-free.
- **Evidence:**
  - `getting-started.md:256-258`: "Nodes without aspects are cheap … They produce no pairs, so there is nothing to verify … They count as covered for free." Step 4: "`yg check` passes — CI is green".
  - Live: an aspect-less node `users` mapping `src/users/`, whose file imports `../payments/charge.js`, gives "FAIL … relation-undeclared-dependency 1 pairs 1 nodes … no relation type is allowed from module to module; either change a node's type or update the allowed relations in yg-architecture.yaml".
  - The same import was silent while the file was only type-covered.
  - `docs/nodes.md:90` mentions the relation check in a parenthetical. The brownfield section never does.
- **Impact:** On a real codebase, the recipe's "5-8 nodes without aspects for broad directory mappings" produces a wall of blocking errors. Their fix may require architecture edits, which in turn require the user's confirmation. The promised instant-green baseline does not exist.
- **Fix:** In the brownfield section, say that every mapped node is checked live for undeclared dependencies on other mapped nodes, show the `relations:` fix, note acyclicity and allowed relation types, and point to progressive mode for inherited debt.
- **Verifier note:** Reproduced exactly.

### M6 — No brownfield entry point for the agent; the first `Next:` maps plumbing

- **Source findings:** no-brownfield-path-first-next, plumbing-files-listed-as-todo, init-plumbing-files-listed-uncovered.
- **Evidence:**
  - Prime line 197: "Greenfield (no nodes yet): Graph before code. Create architecture types, aspects, and nodes first — they are the specification." Nothing covers existing code with no nodes. The brownfield recipe exists only in getting-started §4, and the agent is not pointed to it.
  - The first `yg check` after `yg init --no-reviewer` lists "uncovered (6) .clinerules/yggdrasil.md .gitattributes AGENTS.md CLAUDE.md README.md src/a.ts", then "Next: Map these files to a node, or add their root to coverage.required".
  - `yg type-suggest --file AGENTS.md` suggests moving, refactoring or adding a type.
  - `docs/platforms.md:41-42` and `getting-started.md:228` call these files "repository plumbing … exclude them", yet init writes `coverage: excluded: []`.
  - `yg init --upgrade` prints "nothing changed".
- **Impact:** Every fresh adoption into an existing repo starts with the agent classifying it as greenfield. The agent designs a specification-first architecture, where each step needs confirmation. The first suggested action is to create a node for Yggdrasil's own files.
- **Fix:** Add a brownfield bullet to prime that summarises the getting-started fast path and its confirmation points. Have fresh `yg init` write its plumbing files into `coverage.excluded`, or have the uncovered group and `type-suggest` recognise them and say "exclude, don't map".
- **Verifier note:** agent-layer rated major; first-hour and daily-loop rated the plumbing half minor because the files are non-blocking. The synthesis keeps major for the combination, because it teaches the wrong first move on every fresh adoption.

### M7 — Reviewer failures reduce to three generic strings

- **Source findings:** cli-stderr-swallowed, api-http-status-hidden, copilot-missing-binary-generic-message, copilot-missing-generic-message.
- **Evidence:**
  - Fake `claude` that writes "Invalid API key · Please run /login" to stderr and exits 1 → "returned a provider error: Reviewer unavailable … Check the provider endpoint, network, and credentials". With `debug: true`, `.debug.log` holds only `[claude] exit_code=1` (`cli-base.ts:263-270`).
  - A timeout gives the same string.
  - No `ANTHROPIC_API_KEY` → "The configured reviewer endpoint did not respond (availability check failed)", although `isAvailable()` is `!!this.apiKey` and nothing was contacted.
  - A bogus key plus a bogus model → "Anthropic request failed". The HTTP status goes only to `debugWrite` (`anthropic.ts:46`).
  - `copilot-cli` with no binary → "endpoint did not respond … Check the provider endpoint, network, and credentials". The purpose-built text "GitHub Copilot CLI not found — install it (npm i -g @github/copilot) or set YG_COPILOT_BIN; the copilot inside the VS Code extension is an installer prompt…" (`copilot-cli.ts:112-118`) is unreachable, because `fill-llm-phase.ts:155-172` stops at `isAvailable()` first.
- **Impact:** A bad login, a bad model name, an org policy refusal, a timeout, a missing key and a missing binary look identical. The adopter cannot choose between `/login`, `config.model`, `config.timeout`, setting a key or installing a binary, and turning on debug does not help for the CLI providers. Copilot CLI is the headline 6.1.0 provider, and it fails its first run with advice meant for an HTTP endpoint.
- **Fix:**
  - Add an `unavailableReason()` per provider and word it by provider kind ("binary X not found"; "no API key: set ANTHROPIC_API_KEY or `config.api_key` in yg-secrets.yaml").
  - Include a redacted stderr tail of about 300 chars, the exit code or "timed out after Ts (config.timeout)", and a classified HTTP status (401/403 auth, 404 model, 429 rate limit).
  - Name `debug: true` / `.debug.log` in the next line.
- **Verifier note:** All three variants reproduced. reviewer-setup rated the Copilot case minor because the provider is named and `configuration.md:218` documents `YG_COPILOT_BIN`. The merged class is major: the adopter cannot tell the failures apart, not even with debug on.

### M8 — Infra-failure cause missing from the report and JSON; `Next:` repeats the failing command

- **Source findings:** infra-failure-lost-from-report-and-json, infra-failure-report-loops, fill-failure-cause-lost, next-step-loops (infra half).
- **Evidence:**
  - Unreachable ollama reviewer. Stderr: "1 pairs failed on provider/config errors — re-running will not help until the connection/config is fixed".
  - `yg check --approve 2>/dev/null` shows only "Fix: yg check --approve" and "Next: yg check --approve".
  - `--json` gives `suggestedNext: 'yg check --approve'`, and "unreach" or "infrastructure" appears 0 times in the document.
  - The same pattern holds after a `check.mjs` with `export default` (the named-export fix is on stderr only) and after a reason-less suppress marker ("[det] … — infra"). In both cases a later plain `yg check` shows no trace of the cause.
  - Prime: "`suggestedNext` … Follow it."
- **Impact:** A consumer of `yg-check/1` (a dashboard, CI annotations, an agent capturing stdout or using `-q`) cannot tell "reviewer down" from "not yet reviewed", and is told to re-run the same command.
- **Fix:** Add a distinct report group and JSON code (`reviewer-unreachable`, `check-failed-to-run`, `suppress-marker-invalid`) with the concrete fix. Point `suggestedNext` at it. Consider persisting the last infra reason per pair in the gitignored cache.
- **Verifier note:** daily-loop rated major; agent-layer, failure-and-upgrade and reviewer-setup rated minor, because harnesses capture stderr and re-running re-prints the cause. The synthesis keeps major on the strength of the JSON contract alone: the machine-readable interface agents are told to follow has no trace of the failure.

### M9 — Mid-merge log conflict dead end

- **Source finding:** log-conflict-dead-end.
- **Evidence:**
  1. Two branches each ran `yg log add --node billing`. After `git merge`, `yg check` reports `lock-invalid` ("take one side wholesale … Then run `yg check --approve`") and says nothing about the conflicted log.md.
  2. The next check reports `log-conflict` ("hand-stitching the two sides breaks the append-only integrity hashes … Fix: yg log merge-resolve --node billing"), while `Next:` says `yg check --approve`.
  3. `merge-resolve` → "HEAD is not a merge commit". With `--ours HEAD --theirs feat-a` → "log.md still contains conflict markers…".
  4. The only path that works is to hand-union the entries in date order, commit, and then run merge-resolve.
  - The docs disagree: `cli-reference.md:718-724` says it "unions new entries … Never manually concatenate", while `the-lock.md:114` says "it reads your merge resolution, it never rewrites it".
- **Impact:** Every team with `log_required` types and parallel branches hits this. The working path is written nowhere and reads as forbidden.
- **Fix:** When log.md has conflict markers, have the message give the real sequence. Better, let merge-resolve read `MERGE_HEAD` and write the union itself. Rank log-conflict above unverified. Mention conflicted log.md files in `lock-invalid`. Settle whether merge-resolve unions or verifies, and state it the same way in both docs.
- **Verifier note:** Every step reproduced. Rated major, not blocker, because `the-lock.md:114-116` does give the order and "put them in date order" to a careful reader.

## 5. What already works well

- **Keyless init is honest about scope.** Non-TTY `yg init` lands keyless and prints what works and how to add a judge later ("yg init --provider <name>").
- **Single-cause deterministic errors are exemplary.** `relation-undeclared-dependency` prints the exact `relations:` stanza. `type-without-when-with-mapping`, `type-undefined` (with the allowed types listed), a default-exported `check.mjs` ("Change 'export default function check(...)' to 'export function check(...)'"), a conflicted lock file, an overdue `review_by` ("Ask the user to renew or retire this rule … never change the date without their approval") and a mistyped advise id all follow what/why/next.
- **The log gate names the node and the exact `yg log add` command.**
- **`--only-deterministic` states plainly which LLM pairs it skipped, and `auto_approve: full` announces itself** on the first line of the run.
- **Reviewer configuration docs are accurate.** The provider table, per-tier fields, the `yg-secrets.yaml` overlay and the copilot-cli paragraph were all correct. The config parser rejects unknown tier keys, a missing openai-compatible endpoint, and a missing `--model` for copilot-cli.
- **The agent-layer shell is consistent.** `yg init` writes one identical digest into AGENTS.md, `.clinerules/yggdrasil.md` and a CLAUDE.md `@AGENTS.md` import, and `yg prime --digest` matches the installed block.
- **CLI reference and help agree.** Every flag named in `docs/*.md` and README exists on its command. Every `--help` flag is documented; the only exception is the deliberately hidden `--attention-dump`, which works.
- **The lock concepts are documented correctly where they are documented.** The-lock.md covers the deterministic cache, the free CI rebuild, and the `log_required` caveat under free-only recording. The trouble is that these facts live one page further than the first-hour reader goes.

## 6. Completeness critique

- **No real reviewer run.** No angle configured working keys (as instructed), so nobody observed a real LLM approval or refusal, how reviewer reasoning is shown, cost and call reporting, consensus tiers, `prompt-too-large`, or rate-limit behaviour. Those are the messages an adopter sees most after week one. To close: one run with a real `claude-code` reviewer (and one Copilot CLI) on a medium open-source repo, recording every reviewer-originated message.
- **No real CI run.** The CI findings come from local `CI=true` simulations. Nobody ran the recipe in GitHub Actions: cache behaviour, npx cold start, fork PRs without secrets, the exit-code contract and annotation output. To close: a scratch GitHub repo that runs the documented workflow on a PR from a fork and from a branch.
- **No interactive wizard.** Every run was non-TTY. The interactive `yg init` menu, provider detection, `testCliProvider` and the disclosure texts were not exercised, although the docs route humans there first. To close: drive `yg init` through `script`/`expect` in the container.
- **Windows and path semantics.** None of it was covered: path separators in mappings and relation evidence, CRLF against content hashing, `.gitattributes` behaviour, and CLI-provider spawning on Windows. To close: a Windows runner (GitHub Actions `windows-latest`) running init, check and approve on a fixture.
- **Real 6.0.0 → 6.1.0 upgrade.** Only the `.gitignore` top-up and the changelog were examined. Nobody upgraded a real 6.0.0 project with committed verdicts, including old external-judge entries (which the-lock says are "still read"), a legacy lock split, or a real drill corpus. To close: check out the 6.0.0 tag, build a populated project, upgrade, and diff behaviour.
- **Progressive mode, packages, portal and concurrency.** These are the documented answers to brownfield debt (M5) and to rule reuse, and none was exercised end to end. The same goes for `docs/concurrency.md`: parallel `--approve` runs and the lock under two agents. To close: a brownfield trial in progressive mode on a real repo, a `yg pack` install from a published package, and two concurrent fills.
- **Scale.** No angle measured `--summary`/`--top` usefulness, check latency or report readability on a graph with hundreds of nodes and thousands of files. To close: run against a large open-source monorepo.
- **Non-Claude agents and human-only adopters.** Nobody tested whether Codex, Cursor or Copilot agents actually follow AGENTS.md → `yg prime`, or how a developer without an agent fares from the docs alone. To close: the same onboarding script run by two other agent CLIs, plus one human walkthrough.
- **Family integration.** Grain family candidates were probed only through a hand-written file. Horde `retro` against the removed `yg-review/1` (m30) was not run. To close: a joint Grain → yg advise → Horde run on 6.1.0.
- **Pre-commit hook.** No angle installed or ran the pre-commit hook path that many adopters use in place of CI.

## 7. Refuted findings

- **secrets-key-shadows-env** (init copies the env API key into `yg-secrets.yaml`, and the copy then overrides the env var). The behaviour reproduces, but it is documented: `docs/getting-started.md:31-35` says the key is "stored in `.yggdrasil/yg-secrets.yaml`", and `docs/configuration.md:196` says `config.api_key` "takes precedence over the provider's environment variable".
