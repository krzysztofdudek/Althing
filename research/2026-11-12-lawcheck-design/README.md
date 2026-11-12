# Lawcheck: the public surface, the user experience and the agent experience

**Question:** What is the complete public surface of Lawcheck, the successor of Yggdrasil built from zero (its notions, files, commands, output, rule contracts, providers, languages and plugin), and what do a person and an agent experience when they use it?

**Method:** A design from first principles by the reviewer that wrote the surface audit, the decision review and the design from zero. Evidence only, never a constraint: Yggdrasil at `release/6.2.0` (commit `360864946`), Runes at `release/1.1.0` (commit `b326704fa`), Grain at `release/6.2.0` (commit `4c7a32ef7`), Althing's own graph at `47209c002`, the rulings of 2026-11-12 in the open loop from `yggdrasil-init-defaults-light` to `design-work-goes-to-fable`, a count of what both graphs use, and timings of `yg check` 6.1.0 on a scratch clone of the Yggdrasil repository. Nothing in this folder was run as Lawcheck: no line of it exists yet.

**Status:** open

**Conclusion:** pending: the design below is a proposal. It waits for three critiques (fidelity to the owner's intent, technical soundness, cost of maintaining it) and for the owner's answers to the sixteen questions in [open-questions.md](open-questions.md), in the order given there.

## What Lawcheck is

Lawcheck is a linter for architecture, written for agents and for any language. A repository states its law in one file: the types of files it has, the rules each type must keep, and which types may use which. `lawcheck check` reads the code and says what in the current change breaks the law, with the file, the line, the reason and the next step.

A rule is checked in one of two ways. A script rule is a small JavaScript function that returns findings; it is free and gives the same answer every time. A reviewer rule is a paragraph of prose that a model judges against one file; it costs a call, so a pass is recorded as a fact about that exact content and never asked for again.

Three things make it more than a linter with custom rules: one description for every language, delivery to the agent before and after it writes, and judgment rules with proof in the repository. Everything in this design protects those three and removes what does not serve them.

## The principle the design rests on

**Lawcheck keeps no model of the code.** It reads the code (paths, text, what each file uses) and the law. Everything else is worked out on each run.

Yggdrasil spent a year building a second, hand-written model of the code beside the code: in its own graph 520 component files and 1,873 declared relations, with 280 decision logs and 20 flows. That model had to be maintained, drifted from the code, and made the tool check the model against the code instead of the code against the rules. Every notion below was tested against this principle, and every notion that needed stored knowledge about the code was dropped, with one exception named plainly: the reviewer's verdicts, which are stored because a model's answer costs money.

## 1. Concepts and vocabulary

One word per notion, the same in prose, keys, flags, codes and JSON.

| Word | What it is | Where a user meets it |
|---|---|---|
| **law** | The whole description: the types and the rules. | `.lawcheck/law.yaml` and `.lawcheck/rules/` |
| **type** | A kind of file, given by path patterns and optionally by content. Types nest: a subtype inherits the rules of its parent. A file has one type, the deepest one that matches it. Messages say "file type" so nobody reads it as a type of the programming language. | `types:` |
| **rule** | One sentence that says why, and one way to check it. Attached to types. | `rules:` |
| **script rule** | A rule checked by a JavaScript function. Free, repeatable. | `.lawcheck/rules/<id>.mjs` |
| **reviewer rule** | A rule checked by a model reading prose and one file. Paid, recorded. | `.lawcheck/rules/<id>.md` |
| **use** | One file depending on another, as its language shows it: an import, an include, a reference to a name of the same package. | `may_use:` on a type |
| **finding** | One place where the code breaks a rule: a file, a line, a message. | the output of `lawcheck check` |
| **status** | Whether a rule's findings block (`enforced`, the default) or only warn (`advisory`). Set on the rule and nowhere else. | `status:` on a rule |
| **change** | The files that differ from the base branch, committed or not. Lawcheck holds a run accountable for its change. | the default of `lawcheck check` |
| **base** | The branch the change is measured against. | `base:`, `--base` |
| **debt** | Findings outside the change. Shown on request, never blocking unless asked. | `--full`, `--strict` |
| **verdict** | A recorded pass of a reviewer rule on one exact content. A fact, not an entry about a file. | `.lawcheck/verdicts` |
| **waiver** | A comment in the code that exempts lines from one named rule, with a reason. | `lawcheck-waive` |
| **reviewer** | The model that judges reviewer rules. | `reviewer:` |
| **provider** | The service or program through which the reviewer is reached. | `reviewer.provider` |

Words that do not exist in Lawcheck: node, component, aspect, graph, mapping, relation, port, flow, bundle, tier, pair, unit, owner, lock, fill, approve, drill, log, ratification, progressive.

The key for dependencies is `may_use`, not `may_import` as the earlier design report had it. Java and Kotlin files of one package use each other with no import statement, C# reaches names through namespaces, and C includes. "Use" is true in every language Lawcheck reads; "import" is true in some.

## 2 to 11. The parts

| Part | File |
|---|---|
| 2. Every file a user or the tool writes, the schemas, the defaults, a complete example project | [files.md](files.md) |
| 3. Every command and flag, the exit codes, the human output, the JSON documents, the error grammar | [commands.md](commands.md) |
| 4. The script-rule contract, the reviewer-rule format, verdicts across branches, the default mode and CI | [rules-and-verdicts.md](rules-and-verdicts.md) |
| 5. The nine providers: settings per machine and per project, and where keys live | [providers.md](providers.md) |
| 6. Languages: what each is read for | [languages.md](languages.md) |
| 7. The plugin and the content and size budget of `lawcheck prime` | [plugin.md](plugin.md) |
| 8 and 9. The user experience and the agent experience | [experience.md](experience.md) |
| 10. What is not carried over from Yggdrasil, and every protection of today with what replaces it | [not-carried-over.md](not-carried-over.md) |
| 11. The open questions for the owner, in the order to answer them | [open-questions.md](open-questions.md) |

## The surface on one page

**Files a user writes:** `.lawcheck/law.yaml` (types and rules) and one file per rule in `.lawcheck/rules/`. Optional: `.lawcheck/config.yaml` when a setting differs from its default.

**Files the tool writes:** `.lawcheck/verdicts` and one line in `.lawcheck/.gitattributes`, both from the first review on; caches under `.lawcheck/.local/`. Nothing outside `.lawcheck/`, ever.

**Commands:** `init`, `prime`, `check`, `explain`, `try`, `docs`, `doctor`. Seven, against Yggdrasil's 27 commands and 21 subcommands.

**Exit codes:** 0 clean; 1 the code breaks the law; 2 Lawcheck or the law itself cannot run. An agent that sees 1 fixes the code. An agent that sees 2 fixes what the error names and leaves the code alone.

**One grammar for every message:** where, `error[code]` or `warning[code]`, what; then `why:`; the run ends with one `next:`.

**The default mode:** `lawcheck check` judges the change. Only what rules find in changed files blocks. A change to the law never widens that.

## What this design adopts from the earlier pushbacks

The owner has not ruled on these. The design takes them and lists each as a question in [open-questions.md](open-questions.md).

| Pushback | In this design |
|---|---|
| No commit messages for the reviewer | The reviewer gets the rule, optional context files named by the rule, and one file |
| What the version number means | `lawcheck:` in the law is the last version whose update document was applied; the tool speaks only when an update document lies between it and the CLI |
| No bundles | Rules are listed on types; a parent type carries what its subtypes share |
| The reviewer judges one file | Groups exist for script rules only |
| A fixed list of runner forms for the plugin | `runner:` takes `global`, `npx`, `pnpm`, `yarn` or `bun` |
| `init` asks nothing | The reviewer is set up when the first reviewer rule is written |
| The three conditions on the default mode | Only changed files block; `--full` shows debt as warnings; a base that is named but cannot be reached stops the run instead of silently widening it |
| No `owner` command | `lawcheck explain <path>` answers what a file is and what binds it |

## Overruled, and followed here

- Lawcheck is a new tool in a new repository (`krzysztofdudek/Lawcheck`, npm package `lawcheck`), not a folder beside Yggdrasil's code.
- It supports all nine reviewer providers and every language Yggdrasil reads, from its first release.
- Nothing is compatible with Yggdrasil. A guide for moving a `.yggdrasil` graph to a law is a document for an agent, not a promise of the tool.

## Honesty

- **Built today** means it exists in Yggdrasil or Runes at the commits above and can be read there. **Proposed** means everything else, which is nearly all of this folder. Each part marks the difference where it matters.
- The speed targets in [experience.md](experience.md) are targets. The measurements behind them were taken on Yggdrasil 6.1.0, not on Lawcheck.
- The hook behaviour of Claude Code was read from its documentation on 2026-11-12. The other three hosts were not checked.
- This is one designer's proposal. It has not met its critics yet.
