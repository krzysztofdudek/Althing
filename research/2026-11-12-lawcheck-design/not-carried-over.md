# 10. What is not carried over, and what replaces each protection

Yggdrasil is reference material for Lawcheck, not its ancestor in code. This part is the ledger: what was taken, what was left behind and why, and for every protection Yggdrasil gives today, what Lawcheck gives instead, or the plain statement that it gives nothing.

Counts are from Yggdrasil's own graph at `360864946` (520 components, 73 rules, 38 types, 20 flows) and Althing's at `47209c002` (17 components, 19 rules, 14 types).

## 10.1. Carried over, because it proved itself

| Concept | Evidence that it worked |
|---|---|
| A type given by a path pattern and a content pattern | In the audit's trial on two outside projects, one type with a wide pattern and one rule per file gave the first value fastest. Althing's 19 rules are all attached to types |
| A rule as one sentence of why plus one way of checking | The `why:` line under a finding was the owner's sentence, and the finding pointed at the line |
| A script rule as a function that returns findings, with a syntax tree | 60 such scripts in Yggdrasil's graph, 52 of them walking a tree |
| A reviewer rule judged by a model, recorded | 12 rules and 1,576 recorded verdicts in Yggdrasil's graph |
| A verdict valid only for the content it was given for | It is what lets CI verify without a key (`core/pair-hash.ts`) |
| Uses read from the code and checked between types | Built and live in Yggdrasil (`relations/type-gate.ts`) on the readers of Runes, with a catalogue of 522 cases |
| The error grammar: what, why, next | Uniform across every command the audit misused |
| An unknown key refused by name with the nearest known one | The same audit |
| A schema field on every JSON document | The same audit |
| A waiver comment with a required reason | `core/check.ts:180` |
| When in doubt, block and say why | A parser that fails is not "no uses" (`relations/pass.ts`) |
| Judging the change, not the project | Progressive mode; the owner made it the default on 2026-11-12 |
| All nine providers and all the languages | The owner's ruling `yggdrasil-successor-new-repo` |

## 10.2. Not carried over

### The second model of the code

| Left behind | Why |
|---|---|
| Components (`yg-node.yaml`), their `mapping`, names and descriptions | A hand-written copy of what the file tree already says. 332 of Yggdrasil's 520 components map one file each |
| Relations declared between components | 1,873 declarations that restate what the code's own imports say |
| Ports, and rules laid on whoever consumes a port | One port in 520 components |
| Flows, and rules attached through a flow | A second way to attach a rule to a hand-picked set of files |
| Events (`emits`, `listens`) and their pairing | Nothing in the code shows them, so nothing could check them |
| Parent and child components | The type tree carries the hierarchy |
| The limit on a component's relations | A number about the hand-written model |

### History and process

| Left behind | Why |
|---|---|
| Decision logs for components, types and rules; `log_required` | The owner, after a year: they had no effect on the quality of the work and left files behind (ruling `yggdrasil-log-removed`) |
| Ratification of a rule that reaches a whole type | A process step around the law. Who may change the law is settled where every other change is: in review of the repository |
| `review_by` dates and the overdue warning | Removed by ruling `yggdrasil-review-by-removed` |
| Incidents, advice, rule health, the structure report | None of them affected whether a change passes (ruling `yggdrasil-attention-layer-removed`) |
| Drills kept in the repository | Removed by ruling `yggdrasil-drills-removed`; `lawcheck try` runs a rule on chosen files and writes nothing |

### State

| Left behind | Why |
|---|---|
| Four lock files | One file of facts for reviewer verdicts. Script rules need no record: they run |
| The step that records script verdicts (`--approve --only-deterministic`) | It made "check does not check" possible. `lawcheck check` runs the scripts |
| Event logs, copies of refused files, the feature index | Written for a layer that is gone, or for another tool |
| Merge drivers, the post-merge hook, git configuration | Facts merge as a union; nothing needs a driver |
| Entries in the root `.gitattributes`; files for agents (`AGENTS.md`, `CLAUDE.md`, `.clinerules`) | Lawcheck writes nothing outside `.lawcheck/`; the plugin reaches the agent |
| Migrations and `init --upgrade` | An update document an agent follows (ruling `yggdrasil-upgrades-by-update-doc`) |

### Layers on rules

| Left behind | Why |
|---|---|
| The status `draft` | A rule attached to no type is legal and silent |
| Status set where a rule is attached, and the strongest status winning across channels | One status, on the rule |
| A rule's own `when`, a `when` where a rule is attached, a rule's `scope.files` | A finer type is the one way to narrow. All 9 rules with a `when` in Yggdrasil's graph narrow by component type, which is attaching the rule to that type |
| Bundles and `implies` | Four rules use `implies` in Yggdrasil's graph and none in Althing's. The largest set is attached to 25 types only because no parent type "source" exists; a parent type holds it once |
| `enforce: strict` on a type | It compared what a component was declared to be with what its files look like. With no declaration there is nothing to compare |
| Companion files for the reviewer | No rule in either graph has one |
| Reviewer tiers and majority votes | One tier and one vote in Yggdrasil's own configuration |
| Groups of files for a reviewer rule | No reviewer rule in either graph judges a group; a group would not fit the prompt limit and would make every merge leave an unjudged group |

### Commands and views

| Left behind | What answers the same question |
|---|---|
| `owner`, `node`, `context`, `type-suggest` | `lawcheck explain <path>` |
| `aspect-test`, `simulate`, `drill` | `lawcheck try` |
| `impact` | `lawcheck check --review --dry-run` for the cost of a review. Who uses a file is a question for Grain |
| `tree`, `find`, `aspects`, `flows`, `structure` | `law.yaml` is one file; an agent reads it |
| `suppressions` | Findings about waivers inside `lawcheck check`, and new waivers reported in every run |
| `knowledge`, `schemas` | `lawcheck docs` |
| `log`, `incident`, `advise`, `adopt`, `pack`, `marketplace`, `portal`, `merge-driver` | Nothing; the things they served are gone |

## 10.3. Every protection of today, and what replaces it

"Nothing" is written where nothing replaces it.

| Yggdrasil protects against | How, today | In Lawcheck |
|---|---|---|
| Code that breaks a rule a program can check | script rules | script rules |
| Code that breaks a rule that takes judgment | reviewer rules with a recorded verdict | reviewer rules with a recorded verdict |
| A verdict reused for code that changed | the hash of the inputs | the hash of the inputs |
| A dependency between kinds of files that the architecture forbids | the type gate over imports | `may_use` on the same readers |
| A dependency between two particular modules that neither declared | relations declared per component; an undeclared one is a finding | **Less.** Any file of a type may use any file of an allowed type. The same precision comes back only through finer types |
| A file nobody has classified | `coverage.required` | `required:` and `untyped-file` |
| A file that claims to be one kind and looks like another | `enforce: strict` | A script rule on the type given by path ("every file here exports ..."). The built-in comparison: nothing |
| A use through a file that has no type, to get around a closed list | not evaluated: such a use passes | **More.** A use of an untyped file from a type with `may_use` is a finding |
| A language whose imports cannot be read, passing as "uses nothing" | a blocking parse failure | `parser-failed`, and `uses-not-read` where the language is not read at all |
| A waiver with no reason | a warning in `yg check` | an error in `lawcheck check` |
| A waiver that names no real rule, waives everything, or never ends | reported only by `yg suppressions` | **More.** Errors in `lawcheck check`; a waiver for everything cannot be written |
| A waiver added quietly | nothing | Every run counts and lists the waivers the change adds |
| A rule that crashes being read as a pass | a blocking failure | `rule-crashed`, exit 2 |
| Running a fork's code in CI | `yg check --no-approve` | `lawcheck check --no-scripts`, with the skipped rules listed |
| A branch moving its own base to hide its change | a base handed in from outside outranks the committed file | the same order |
| A shallow clone silently judging nothing | falls back to the whole project | stops with `base-unreachable` and the fix; neither nothing nor everything is judged in silence |
| A developer's key sent to an endpoint the committed file chose | a warning on every check | **More.** A key goes only to the provider or the URL it was stored for |
| A key or a token shown in output | removed by the owner's rulings | nothing, by the same rulings |
| A rule changed without a recorded reason | the rule's log, the status-change line | Nothing in Lawcheck. The repository's own history holds who changed the law and when |
| A rule nobody has looked at for a year | `review_by` | Nothing, by ruling |
| A rule reaching a whole type before the owner agreed | ratification | Nothing in the tool. The agent is told in `prime` that a rule's status and reach are the user's, and the change to `law.yaml` is in the diff |
| A component growing too many dependencies | `max_direct_relations` | Nothing built in. A script rule can count `file.uses()` |
| A model's flaky verdict | majority votes | Nothing built in. A failure is kept, and `--again` is the user's to use |
| The agent not knowing the tool | a 71 KB manual and a block in three agent files | A primer under 8,000 characters that holds the repository's own law, delivered by the plugin |
| The agent not knowing what a file is for | the component's description | The type's `about` line. A description of each single file: nothing |
| A reviewer bill that surprises | a cost preview | `--dry-run`, and `reviewer.max_calls` that stops a run before its first call |

Three rows say "less" or "nothing" where something real is given up, and they are the ones to weigh:

1. **Dependencies between two particular modules.** A team that relied on per-component relations gets coarser control until it writes finer types.
2. **A record of why a rule changed.** It moves from the tool to the repository's history and review.
3. **A description of each file's purpose.** It is gone, and the type's one line does not replace 520 hand-written paragraphs. Nothing in a year of use showed those paragraphs changed an outcome, but an agent did read them.

## 10.4. For a repository that has a Yggdrasil graph

Nothing in Lawcheck reads `.yggdrasil/`. `lawcheck docs from-yggdrasil` is a guide for an agent: which type becomes which type, what happens to a rule that hung on hand-picked components or on a flow (a subtype by content, a path list, or a question to the user), how a script is rewritten to the new contract, and that reviewer rules are reviewed once more because nothing of the old lock carries over. It is a document, written and proved on real graphs, not a command.
