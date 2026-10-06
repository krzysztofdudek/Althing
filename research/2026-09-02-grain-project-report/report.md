# Grain — comprehensive report

> **Provenance.** Written by Grain's own director agent on 2026-09-02, on Krzysztof's instruction, the day he stopped the project. Its only other copy sat in Grain's gitignored `.temp/docs/`. Grain's state at the time: local `main` at `821ea71` ("experiment ended by the user"), remote `main` at `601aa23`, one public tag `v0.1.0`. The original was Polish and was kept verbatim as the evidence record of the experiment; this is a faithful English translation of it, and the Polish original is not public. The standing status lives in the tool map (`family/map.md`).

A report for the scribe · drawn up on 2 September 2026 · covers the whole project from 24 August to 2 September 2026

## Summary

Grain is a plugin for coding agents that builds a mathematical model of a repository's conventions from syntax trees and git history and answers the questions "how is X done here", "where should this live", "does this diff break the local habits". In ten days it went from prototype to version 0.4.0: 23 grammars, 26 commands, 2184 tests, a mathematical constitution with a single constant, seven honesty instruments in CI, a corpus of 25 repositories. Publicly only 0.1.0 exists (26 August); the remote branch stands at 0.2.1; everything from 0.3.0 upward sits only locally.

To the question that decides whether the project makes sense — does an agent with Grain work better than without it — the answer as of today is: **not shown**. The third trial on a private monorepo (26 August) produced one documented effect (four files moved); two paired trials on 0.4.0 (2 September) produced 0 changed diffs in 25 runs. The experiment was ended by the owner's decision on 2 September 2026.

## Where it came from

Grain grew out of the `roots2.mjs` prototype in the Yggdrasil project: 790 lines that extracted conventions from a repository. Yggdrasil had a plan for a plugin (17–22 August: four increments, spec v5.2 → v6, seventeen review rounds of the fourth increment), but none of the plugin's increments was built there. On 24 August Grain became a separate repository. Four lesson-extraction reports (`.system/research/01–04`) carried over from Yggdrasil what was worth carrying over: the shape of the plugin (one core, thin adapters per host, hooks whisper and never veto), sparse boolean facts with domains of applicability, history replay as a set function, resuming a run from the last SHA.

## Timeline

| Date | What happened | Tests |
|---|---|---|
| 24 Aug | Standalone plugin. Architecture enforcement in `check`, tsconfig aliases as edges, a post-edit hook, CI on node 22 and 24, placement at file creation ("the name's relatives already live somewhere"). | — |
| 25 Aug | Two constitutional decisions: **"code is code"** (the end of the test/example axis, only raw AST and directories) and **"git decides what is code"** (the tracked tree is the universe, gitignore is the fence). Superposition, stage 0: a cluster anti-unifies into one template with counted holes. | — |
| 26 Aug | Mathematical constitution closed: a language bridge from commit messages, template extraction from the remainder, template history, **six thresholds collapsed into one constant λ**, directory cuts by MDL ("dead name lists are reborn as mathematics"). Truth audit no. 2. Placement **before** the write. README rewritten around evidence, `docs/` with the results. **v0.1.0 released**, the only public tag. | 903 → 916 |
| 28 Aug | **0.2.0**: six integrity bugs from the field report (generic arguments as phantom base types, constructors as types, a lexical collision at full confidence). New: layering norms on the module graph, constructor shape, two-sided marker alternatives, author concentration. Surfaces: `review`, `rules`, `completeness`, an MCP server with no dependencies. | 1029 |
| 31 Aug | **0.2.1**: a workflow of 18 agents, one per language, on real public repositories; **22 real bugs** (stack overflow on deep expressions, a fabricated empty index for a non-existent path, files with non-ASCII names lost, a symbol named `constructor` zeroing the whole graph, counters inflated 35×). | 1109 |
| 1 Sep | **0.3.0**: four rounds of field tests in thirteen languages, 53 issues, 41 closed, every fix checked by reverting its own hunk back to red. Macros re-parsed with their own grammar (0 phantoms in 866 names), `.h` with both grammars (+1090 types), Solidity modifiers, receivers in Go and Rust. `selftest --where`: **`where` loses to path matching on seven of eight repositories** — "this number is here so that we have it". The baseline of the experiment; never pushed. | 1825 |
| 1–2 Sep | **Loop v2 and the director**: seven failure classes with instruments, a corpus of 25 repositories, director + lead + workers in worktrees, state in a committed `.system`. **0.4.0** locally. 204 commits, 92 tickets (81 fixed), the engine reformatted. Question catalogue, `obligation`, `where` (named layer) +0.184. Two paired trials: **0 changed diffs out of 25**. Experiment ended. | 2184 |

## What Grain is

The **engine** has four layers. Extraction: tree-sitter, 23 grammars, predicates derived from `node-types.json`, no lists of names or languages (the only per-language datum is the extension mapping). Model: one objective function, two-part MDL; a convention is accepted when the predictive KT error does not exceed 1/λ at λ = 8; directory cuts, role clusters, template anti-unification — everything earns its place through compression. History: a full git walk with a blob cache, replay as a set function, a language bridge from commit messages, co-changes, obligations. Surfaces: 26 commands, pre-write and post-edit hooks (Claude Code, Codex, Cursor, Copilot), an MCP server, `export` as a published contract for training.

**Four principles** that survived everything: code is code (no recognising things by their names); git decides what is code; one loss constant instead of tuned thresholds; honesty before reach — what Grain cannot see, it says it cannot see, and a confident wrong answer is worse than silence.

**What it can do** (one sentence per command): `where` — where in this repo such a thing lives; `what` — where this file comes from, who uses it, what tests it; `how` — show how X is done here, by example; `check` and `review` — whether this file or a whole diff breaks the practised conventions and layering norms; `completeness` — what usually changes together with this file, and what is missing; `obligation` — what the repository requires of me when I create a file under this module; `report`, `map`, `rules` — the picture of the whole, the modules, a generated document of rules; `explain`, `spectrum`, `status`, `selftest` — why, how strongly, whether the index is fresh, whether Grain assesses itself.

## Evidence, the whole project

**Truth audits.** Two independent sessions with no context checked the printed claims with grep and git. Audit 1 (before the rebuild): 15 claims, 13 exactly true, 2 true but imprecise, 0 false. Audit 2 (after the rebuild): 39 claims, 28 exact, 8 imprecise, 2 unverifiable, **one false class** (outlier counts drawn from a different population than the percentage beside them: "100% of 29, 6 outliers"), fixed the same day at the source. Once Grain outdid the auditor: it pointed to the only true outlier where the auditor's grep had been fooled by a comment.

**Three trials on a private monorepo** (TypeScript, history after the model's knowledge cutoff, tasks taken from the repository's history, diffs scored 0–5 against the author's diff). Trial 1 (the advertisement alone at session start): the agent did not call Grain even once; the index was right about both placement errors. Trial 2 (plus the post-edit hook): 0 notes on 27 files, checked three times as correct silence — a line-level check is blind to the class of error the trials actually show, namely placement. Trial 3 (plus placement at creation): four notes, the agent moved four files, writing in the transcript "Following grain's placement signal". **The first documented effect on a diff.** The files, however, landed beside the author's choice, for two named reasons; both fixed (the note before the write, competitors in one note).

**Corpus of twelve public repositories** (0.1.0): cold build from 5.9 s (spring-petclinic, 1040 commits) to 2.9 min (typeorm), peak memory up to 1.5 GB, median query 83–312 ms. Mutation harness (injected convention violations): nest 26 detected, 2 missed, 0 false; in total 0 false alarms across twelve repositories. `how` against grep: median precision 0.154 against 0.033, F1 0.223 against 0.064, at a lower recall (0.442 against 1.0). 25 hostile repositories: "degrade, never crash".

**Field tests 0.2.0–0.3.0**: a field report (6 integrity bugs), a bug bounty of 18 agents (22 bugs), four rounds in thirteen languages (53 issues). The pattern: every new language produced high-severity defects at first contact; three fabricated supertypes were found three separate times. Hence the instruments.

**Instruments A–F on 25 repositories** (2 September): a claims auditor, declaration coverage against an oracle derived from `node-types.json`, a surface cross-check, disclosure fixtures, a ranking harness with automatic ground truth from history, a scale ladder. Result after one run: 0 new defects in C, C++, C#, Java, JavaScript, TypeScript, Go, PHP, Ruby, Scala; three high-severity fabrication classes in Python, Kotlin and Rust (qualified inheritance, the `by` delegate, `'static` as a trait) — all fixed the same day. Declaration recall 0.74–1.00. Symfony with its full history (82,946 commits) passes all commands loudly; cold build 33.1 → 24.1 min after the shard-width fix.

**Question catalogue** (1 September): 19 paired agent runs, 5 repositories, 1277 tool calls → 19 question types. An agent spends on average 39 calls before its first write, 99 on realistic tasks — that is the market. Grain: 5 types well, 3 partly, 1 worse than grep, 5 not at all. Of 16 commands the agents used two. The gap in one sentence: Grain is excellent at "what does the existing code look like" and absent from "what does this repo require of me".

**Directional track** (1–2 September, every result in writing): `where` in the named layer +0.184 hit@3 on 12 repositories with one constant removed; obligations from history ("adding a file under a module and suffix also touches O") precision 0.958 at coverage 0.048, both attempts to raise coverage rejected; promoting co-changes in `where` rejected (it always points at the hub); a new directory has no signal in history; the reachability law: 63 of 63 calls went to commands named in the advertisement, 0 to the twelve unnamed ones.

**Paired trials on 0.4.0** (2 September, 25 runs with Grain): adoption fixed (1 → 11 calls per run), reach unchanged — calls before the write flat, **0 diffs changed by Grain's answer**. After `obligation` was made reachable: 4 calls, 0 certifications, the hook stayed silent 14 times.

## Verdict

> On the measured tasks the agent with grep and cat made the same diff, in the same place, in the same number of steps. Grain told the truth that nobody needed.

The engine is in the best state it has ever been in, and apart from one trial on 26 August there is no evidence that it helps anyone. Both things are true at once.

**Why zero.** First, easy tasks were measured (about 16 calls before the write), on which the agent makes no mistake; an answer cannot improve a diff that is already correct. Second, after each trial the indicated mechanism was fixed instead of taking the trial apart run by run ("where did the agent go wrong and what one sentence would have turned it back"); the maintenance track absorbed most of the attention and did not move the target. Third, a structural hypothesis, consistent with all five trials since 26 August: **the agent does not ask questions it does not know it has.** The only documented effect in the project's history came from a note that spoke up on its own, before the write — not from an answer to a question.

## Process and organisation

Three phases. **Solo sessions** (24–26 August): one model, the constitution, the release. **Field tests** (28 August – 1 September): multi-agent workflows, one agent per language, every result verified independently before it landed. **The director and loop v2** (1–2 September): the director (Fable, decisions only), the lead (Sonnet, long-lived), workers in separate worktrees, Opus for measurements; all state in a committed `.system` (92 tickets, a queue, 21 escalations, ~45 rulings, a handoff, a wave log) mutated only through the skill's eight tools; a list of eight matters the lead does not decide; an audit sampled once per wave. The `director` skill in the repo recreates this role in any new session.

What worked: measurement before decision (four capabilities rejected by the numbers), escalations (merge conflicts went to the director instead of being resolved on the spot), a register of lessons from its own mistakes (three of the director's hypotheses disproved by measurement and recorded). What failed: leads stalled waiting on monitors (one was replaced), worktrees were born from a fixed base, a blind sed across versions broke a dependency, two lead sessions once raced each other for the queue — each of these events has a rule in the rulings. Known costs of the trials: 10.47 USD and 7.08 USD for the two paired trials; the rest uncounted.

## What was left open

- **A trial on hard tasks** with a per-run counterfactual table (ticket 092; brief ready, not started). The only measurement that can show an effect or rule it out.
- **Product form**: a guard at write time ("you are writing X, and this repo does Y") instead of an oracle. The only effect in the project's history came exactly this way.
- **Precision of obligations at floor 4** (091); `where` with a path as the query (090).
- **Small items**: disclosures in JSON landed, not merged (089); extraction key g33 for fixes 082–086; 71 worktrees to clean up; a question about Grain's public history from before 26 August, which was the owner's to decide and was not acted on.

## State at the end and how to come back

Locally: `main` at 0.4.0, 204 commits since 0.3.0, the suite of 2184 green, worktree clean. Publicly: tag v0.1.0; the remote branch at 0.2.1. Nothing was pushed during the experiment. The handoff file in `.system` says where things stopped and that nothing is authorised. A return starts with two questions, not with another wave of fixes: does Grain change the diff where the agent is demonstrably wrong, and is the right form a guard instead of an oracle.

## Lessons

- **Honesty is a necessary condition, not a value.** Two audits, seven instruments, 0 false alarms — and zero effect. A true answer that does not change a decision is worth zero.
- **The effect comes unasked.** The only diff change in the project's history is a note that spoke up on its own, before the write. The oracle loses on timing, not on knowledge.
- **First find the task on which someone gets it wrong.** Only then build the answer. The reverse order cost the last full day.
- **Every new language means new fabrications.** Thirteen languages, three waves of high-severity defects at first contact. "23 grammars" is not a declaration of support; support is proven by instruments.
- **Measurement before decision works**, and "do not ship" backed by numbers is a fully valid result.
- **A busy team is not progress.** The target metric belongs in every report.

---

Drawn up by the project director on the owner's instruction. Sources: git history (16fa901 → 821ea71), `docs/validation.md`, `README.md`, `.system/research/` (reports 01–04, the question catalogue, the `where` and obligations designs, both 0.4.0 trials, command reachability), `.system/decisions.md`, the ticket ledger. No names of private repositories and no machine paths.
