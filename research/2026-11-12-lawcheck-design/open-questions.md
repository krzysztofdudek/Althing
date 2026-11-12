# 11. Open questions for the owner

Sixteen questions, in the order to answer them: the first ones decide the shape of everything after them. In each, the first option is the one this design takes and recommends. "Costs" names what the option gives up; none of it is an estimate of effort.

Questions 3, 5, 6, 9, 10, 11, 12 and 13 are the earlier pushbacks the owner has not ruled on.

## 1. Does a file have exactly one type?

The whole model rests on this. In Yggdrasil's graph 20 rules hang on hand-picked components and more arrive through 18 flows; the largest, about printed paths, sits on 22 files spread over five types. Such a set is not the shape of one type.

| Option | What it means | Costs |
|---|---|---|
| **A. One type per file, the deepest that matches (recommended)** | A rule for a scattered set of files becomes a subtype by content in each parent, or the rule goes on the parent and its script skips what it does not concern | More types for cross-cutting rules. A reviewer rule on a parent pays for files it does not concern |
| B. A file may have several types | A file is `engine` and also `prints-paths`; rules of both apply | A second axis returns. "Which types may use which" needs an answer for a file with two types, and `explain` has to show several chains |
| C. One type per file, plus named sets of paths that a rule can be attached to | Types stay a tree; a set is only a list of patterns for rules | A second notion beside types, with its own key and its own questions about overlap |

## 2. What is Lawcheck written in, and so what are script rules written in?

The surface in this folder does not depend on the language of the tool, with one exception: script rules. The measurement on Yggdrasil 6.1.0 showed the time going to the model (component mapping and repeated pattern compilation, over a third of a warm check) and to user scripts (56 processor seconds for all of them), with syntax trees at 3% of a warm check and 41% of a cold one.

| Option | What it means | Costs |
|---|---|---|
| **A. TypeScript on Node, on Runes; script rules in JavaScript (recommended)** | The readers of uses for all languages and their 522 cases are used as they are. Agents write rules in the language they write best | Node 22 is required. A cold run in CI stays slower and heavier in memory than a native tool would be |
| B. A native core (Rust), script rules still in JavaScript run by Node | A fast core for types, uses and verdicts | The readers of uses are written a second time or Runes is rewritten, and Grain follows. Node is still needed wherever a script rule exists, and trees are built twice |
| C. A native core and rules in another form (tree queries, or any program speaking JSON) | No Node at all | Every rule anyone has is rewritten, and rules with nuance become harder to write |

If the answer is A, the contract keeps the door to B open at no cost: scripts receive data and import their helpers from the package, so the core can be replaced later without touching a user's rule.

## 3. The default mode: what blocks, and what happens without a base?

| Option | What it means | Costs |
|---|---|---|
| **A. Only findings in changed files block. `--full` lists the rest as debt, `--strict` makes it block. A base that is named but unreachable stops the run with exit 2 (recommended)** | One rule, no exceptions; a law change never turns old code red | Every CI setup needs history deep enough to find the merge base, once, and the error gives the line to add. The base branch is green by construction unless a team runs `--strict` there |
| B. As A, but an unreachable base falls back to judging the whole project | No CI setup needed | A shallow clone turns all debt, and every unjudged merge, into a red build |
| C. As A, but an unreachable base falls back to judging nothing, with a warning | Never a red build for the wrong reason | A pull request passes unchecked in the commonest CI setup, and a warning in a log is easy to miss |

## 4. What is stored about reviews, and where?

| Option | What it means | Costs |
|---|---|---|
| **A. Passes only, committed, as facts about content (recommended)** | One sorted line per pass; merges are unions; CI verifies with no key | Another person cannot tell "judged and failed" from "not judged" for an advisory rule. The file proves a recorded pass, not that a model gave it |
| B. Passes and failures committed | Everyone sees the reviewer's findings on every machine and in CI | Failing content gets committed with its failure; two lines for one content need a rule about which wins; the file grows with text |
| C. Nothing committed; each machine and CI review with their own key and cache | No file in the repository at all | CI needs a key and pays; every change is paid for at least twice |

## 5. What is the reviewer given?

| Option | What it means | Costs |
|---|---|---|
| **A. The rule, context files the rule names, and one file (recommended)** | A verdict is about content only, so its hash covers everything the reviewer saw | A rule cannot weigh the intent of a change, and cannot judge several files against each other |
| B. As A, plus the latest commit messages for the file | The reviewer knows what the author meant | The verdict depends on text outside the content: a squash, a rebase or a shallow clone re-opens or invalidates paid verdicts, and the author can tell the reviewer what to think |
| C. As A, plus groups of files (a directory or a whole type in one review) | Rules about consistency across files | A group rarely fits the prompt limit, and every merge that touches two files of a group leaves it unjudged. No reviewer rule in either graph needs it today |

## 6. One reviewer per project, or several?

| Option | What it means | Costs |
|---|---|---|
| **A. One reviewer, one answer per review (recommended)** | `reviewer:` holds one provider and model | No cheaper model for simple rules and stronger one for hard rules. No majority vote against a flaky answer |
| B. Named reviewers; a rule may name one | A rule says `reviewer: strong` | A second notion and a key on rules; the law starts to depend on how a project is billed |
| C. As A, with an optional number of votes | `reviewer.votes: 3` | Three times the cost where it is used, and a rule about ties |

## 7. May the agent pay for reviews without asking?

| Option | What it means | Costs |
|---|---|---|
| **A. Yes, for its own change, up to `reviewer.max_calls` per run (recommended)** | Work does not stop while the owner is away; the limit bounds a mistake | Money is spent without a question each time |
| B. Only after the user agreed once in this repository (a setting) | A committed or local `reviewer.auto: true` | One more setting, and a first session that stops to ask |
| C. Never without asking each time | The agent reports the number of calls and waits | Work stops whenever a reviewer rule is involved |

## 8. Which hooks does the plugin have beyond the start of a session?

| Option | What it means | Costs |
|---|---|---|
| **A. After each edit and at the end of a turn, both on, both switchable (recommended)** | Findings reach the agent the moment it writes them, and it cannot report work as done over a failing check | A check on a half-finished change of several files shows findings that the next edit would fix. Each host has to have the events |
| B. Both exist, both off until the user turns them on | Nothing happens that was not asked for | Most users never turn them on, and the agent checks only when it remembers |
| C. Session start only | The smallest plugin | The agent's loop depends on its discipline alone |

## 9. How does a project redirect the plugin to its own Lawcheck?

| Option | What it means | Costs |
|---|---|---|
| **A. `runner:` takes one of `global`, `npx`, `pnpm`, `yarn`, `bun` (recommended)** | The plugin builds the command itself | A project with an unusual way of starting tools cannot express it |
| B. A free command string | Any setup works | Opening a session in a fresh clone runs whatever the repository's author wrote there |

## 10. Does `init` ask about the reviewer?

| Option | What it means | Costs |
|---|---|---|
| **A. `init` asks nothing (recommended)** | The first experience is a free linter; the reviewer is set when the first reviewer rule is written, and `check` says how | A person who came for reviewer rules meets the setup one step later |
| B. `init` asks which provider to use | The reviewer is ready from the start | A newcomer chooses a model provider before seeing one rule, and non-interactive runs need flags |

## 11. What does the version line in the law mean?

| Option | What it means | Costs |
|---|---|---|
| **A. The last version whose update document was applied; Lawcheck speaks only when a document lies between it and the CLI (recommended)** | No edit and no message on a patch release | The line can be older than the CLI in use, which is correct but has to be explained once |
| B. One to one with the CLI, as ruled for Yggdrasil 7.0.0 | The line always names the CLI the project runs | A commit with no content in every project at every release, and two people on different versions rewrite it back and forth |

## 12. Are there rule sets?

| Option | What it means | Costs |
|---|---|---|
| **A. No. Rules are listed on types, and a parent type carries what its subtypes share (recommended)** | Two notions a user writes: types and rules | Types with no common parent repeat a list |
| B. A named list of rules that a type can reference | `sets:` in the law | A third notion, and one more answer to "where did this rule come from" |

## 13. The set of commands

| Option | What it means | Costs |
|---|---|---|
| **A. Seven: `init`, `prime`, `check`, `explain`, `try`, `docs`, `doctor` (recommended)** | `explain` answers what `owner` and `context` answered; `try` is the rule test that writes nothing; `doctor` checks a setup, the nine providers included | No answer to "who uses this file"; that is left to Grain |
| B. As A, plus `impact` | The files that use a file, and the cost of re-reviewing after an edit | A command that reads the whole repository to answer, in a tool built to answer per file |
| C. As A, without `doctor` | Six commands | A wrong provider setup shows up only on a paid review |

## 14. A use of a file that has no type

| Option | What it means | Costs |
|---|---|---|
| **A. From a type with `may_use`, it is a finding (recommended)** | A closed list cannot be walked around through an untyped file | In a repository that is half described, the first `may_use` asks for types on whatever that code uses |
| B. It is allowed, as in Yggdrasil today | No friction while a law is young | `may_use` restricts only what has a type; the rest is a hole |

## 15. Are script rules written only in JavaScript?

Follows from question 2.

| Option | What it means | Costs |
|---|---|---|
| **A. JavaScript only in the first release (recommended)** | One contract, with a syntax tree and the uses handed to the script | A team in another language reads and reviews rules in JavaScript |
| B. Also a rule that is any program: it gets paths on standard input and prints findings as JSON | A rule in Python, Go or shell | A second contract. Such a rule has no tree and no uses from Lawcheck, and its inputs cannot be tracked for the cache |

## 16. The names a user sees

| Name | Chosen here | Alternatives considered |
|---|---|---|
| The folder and the law file | `.lawcheck/law.yaml` | `.lawcheck/architecture.yaml`; one `lawcheck.yaml` at the root (rules would then need a second place) |
| The key for dependencies | `may_use` | `may_import` (not true for Java, Kotlin, C# and C), `depends_on` (reads as a statement, not a permission) |
| The comment that exempts code | `lawcheck-waive` | `lawcheck-ignore`, `lawcheck-disable` (both hide that it needs a reason and the user's word) |
| The kind of file | `type`, in messages "file type" | `kind` (no natural word for a child, and collides with JSON's usual `kind` field), `role` (collides with user roles in applications) |
| A reviewer's recorded pass | `verdict`, in the file `verdicts` | `review`, `pass` |

Confirm the set, or change a name. Changing one now costs a search and replace in this design; changing one after the first release costs every user an update document.
