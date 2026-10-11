# Rulings

The owner's standing rulings: the decisions that outlive the release they were taken in. Each has one entry, under its slug, and the slug is what the operating doc, the skills and the rest of the method cite. A ruling is never edited. A changed ruling is a new one that supersedes the old, and the old entry's status says so.

Each entry opens with one line: its date, its status (`standing`, `superseded by <slug>` or `retired`) and its origin. The rail `rulings/ledger` checks the shape of every entry and that every pointer resolves ([the rails](../rails/README.md)).

- **Origin `releases/<version>`** is a pointer. The ruling's text is the ruling of that slug and date in `releases/<version>/.jarl/decisions.md`, and nothing of it is copied here.
- **Origin `private <version> loop, translated`** is a ruling from a loop whose record is not public (6.1.0 and before). This ledger is its only public home, so its text is carried in full below the line, translated.

**How the text reads.** The owner's words are translated from Polish faithfully, without swear words, and marked `Krzysztof, YYYY-MM-DD (translated from Polish): "…"`; a reaction that carries no decision is left out ([language](language.md)). Where he picked an option, the entry names the options and says that the label is not his wording. Square brackets mark an editorial replacement, and […] a cut. Before 2026-10-05 the family's layer was a private repository, called the hub in these rulings; where a ruling named it, the text reads [the hub]. Issue numbers of a private record are left out where they point at nothing a reader can open. "The coordinator" is the agent that directed the 6.1.0 loop, the role now called the jarl.

**What is carried.** Every ruling of the 6.1.0 and 6.2.0 loops was classified as standing (it still binds the family's work), release-scoped (it set that release's scope, numbering or timing, recorded a one-time act or an acceptance of that release's changes, or was an implementation choice whose home is now that tool's code and documentation) or superseded (a later ruling replaced it). Only the standing ones are here.

| Loop | Rulings | Standing | Release-scoped | Superseded |
|---|---|---|---|---|
| 6.1.0 | 122 | 48, carried as 47 entries | 65 | 9 |
| 6.2.0 | 38 | 9 | 28 | 1 |

Two pairs of 6.1.0 rulings of the same day are carried as one entry each (`code-docs-conflicts`, `quality-first-mandate`), and one 6.1.0 ruling that decided two things is carried as two entries (`companion-key-refused`, `questions-wait-for-the-owner`).

**The 6.2.0 rulings that stand.** Their text is in the 6.2.0 loop. Until that loop is in this repository at `releases/6.2.0/`, with its English slugs, they are listed here instead of written as entries, because the rail checks that every pointer resolves. When it lands, each row becomes an entry with the origin `releases/6.2.0`.

| Slug | Date | What it rules |
|---|---|---|
| `patch-per-repo` | 2026-10-02 | a patch is not the family's release process: each repository patches on its own, and nothing ships without the owner's word |
| `ask-001` | 2026-10-02 | a fix that closes a false green ships blocking at once, with a "Before you upgrade" note in the CHANGELOG |
| `autonomy-quality` | 2026-10-05 | when the owner is away the jarl decides and records it, quality over speed and cost; publishing, releasing, pushing and anything irreversible stay his word |
| `jarl-pinned-in-loop` | 2026-10-05 | one Jarl writes a release loop's record from start to close, from a checkout that never switches branches during the release |
| `one-loop-per-directory` | 2026-10-05 | one `.jarl/` directory is one loop; several loops at once are several directories |
| `skald-leaves-family` | 2026-10-05 | Skald is no longer a member of the family; the add-ons are Ratatoskr, Urd and Researcher |
| `althing-family-layer` | 2026-10-05 | Althing is the family's public layer above its tools, and everything in it is English |
| `ask-011` | 2026-10-05 | the owner's words are translated faithfully and without swear words; a reaction that carries no decision is not recorded |
| `ask-012` | 2026-10-05 | after Althing's first push, the jarl pushes Althing's `main` whenever the pre-push rails are green |

**By theme**, the entries below (which run in date order):

| Theme | Rulings |
|---|---|
| How the family is developed | `issues-live-in-althing`, `findings-become-issues`, `free-way-of-working`, `fresh-reviewer-required`, `code-docs-conflicts`, `no-effort-estimates`, `questions-wait-for-the-owner`, `quality-first-mandate` |
| Releases, branches and loops | `released-version-is-final`, `releases-run-as-jarl-loops`, `loop-in-release-directory`, `release-branch-everywhere`, `remote-keeps-main-and-release`, `release-last-on-owner-word`, `changelog-erratum-in-place`, `promises-on-family-number` |
| The machine | `yggdrasil-in-devcontainer`, `worktrees-outside-tmp` |
| What the family is | `one-judge`, `mcp-parity`, `blocks-and-composer`, `shared-code-vendored`, `horde-on-jarl-record`, `conditional-trust`, `consent-by-reach`, `entry-by-pain`, `family-composition` |
| Yggdrasil | `type-imports-are-dependencies`, `agent-may-run-paid-approve`, `log-comments-code-changes`, `log-no-first-entry`, `mapping-change-is-code-change`, `parents-define-hierarchy`, `log-targets-and-context`, `reviewer-key-warning-only`, `architecture-descriptions-kept-true`, `companion-key-refused` |
| Grain | `family-candidates-as-product`, `family-candidates-file-per-producer`, `grain-ignores-authorship` |
| Jarl | `loop-outside-git-by-default`, `jarl-archive`, `handoff-from-cli` |
| Horde | `horde-review-role`, `fresh-tree-without-prepare`, `paid-reviewer-in-horde`, `horde-default-constants` |

## released-version-is-final
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "6.0.0 is already released. Now we are designing release 6.1.0." and "Why do you want to do some re-release of 6.0.0 when it is already released?" A released version is not released again. Work found after it goes into the next release. That day it retired a plan of Horde's corrections loop to release 6.0.0 a second time; that loop's work shipped in 6.1.0.

## releases-run-as-jarl-loops
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "In general, within this workspace, let's do it so that we use JARL for designing releases.", "Jarl is the tool for organising the work of issues and so on.", "And so rewrite whatever in [the hub] is about releases now. That is what JARL was created for" and "Open issues for everything we plan to do or are doing, so that we have a clean backlog." The index of decisions with its table, the runbook and the two-stage consent of 6.0.0 are retired. The backlog and the rulings of a release live in its Jarl loop.

## issues-live-in-althing
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "In general, issues are kept in [the hub] and never in the specific repositories." and, about Grain: "In general, what is in .system should not be in Grain's repository either." The loop records and director notes that lived in tool repositories were moved out of them and kept as history; of Horde's corrections loop he said: "Let it stay for history, because the work was tracked and carried out there." Since `althing-family-layer` the family's layer is Althing, so the issues of every family repository live only in Althing's release loops.

## loop-in-release-directory
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Asked where the loop lives (a: `.jarl/` at the root of [the hub], with an entry added to its root layout guard; b: `.jarl/` in the release's directory, reached through `--root`), Krzysztof answered "1. B" (an option label, not his wording). The loop lives in its release's directory, the tool is called with `--root` pointing there, the root guard is unchanged, and the directory stays as the release's record: it is never closed away. In Althing that directory is `releases/<version>/`; Jarl's permanent mode, added since, keeps the directory when the loop is closed.

## release-branch-everywhere
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "A) release/6.1.0 everywhere, that name; for Horde change the branch's name." In every family repository the work of a release goes to `release/<version>`, the workers' branches are merged into it, and the merge to `main` is part of the release. Horde's branch was renamed the same day.

## remote-keeps-main-and-release
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "In general, ultimately I would like to delete all branches from the remote except the main one and the 6.1.0 release." and, about branches with unique content: "Drop, except the ones from a PR." A remote keeps `main`, `release/<version>` and the branches of open pull requests. Before a branch is deleted, its unique content goes to `refs/archive/<date>/` in the local clone.

## yggdrasil-in-devcontainer
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "With Yggdrasil, the way it is done, the commands always go through the devcontainer, because the environment is ready there. For the other repositories I have not made devcontainers yet." Commands in Yggdrasil run inside its devcontainer (`docker exec -w /workspaces/Yggdrasil yggdrasil-devcontainer …`); the other repositories run on the host.

## horde-review-role
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

After an agent's proposal of 2026-09-15, Krzysztof chose the option "Add a fifth role: review" (the label of an option put to him, not his own words) over writing into Horde's `model.md` that landing is checked only mechanically. The review role is one-off per ticket, after the worker and before landing, and gives no verdict of consent.

## release-last-on-owner-word
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "Put the release itself at the very end and only on my confirmation; for now we have an open backlog to work through". The release issue waits at the end of the queue and starts only on his word. The backlog stays open to new matters.

## family-candidates-as-product
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Asked whether `.family-candidates.json` is a product feature (A: `grain propose` writes it) or a research instrument (B: the register says so honestly), and after it was explained what A does in Grain, Krzysztof said (translated from Polish): "If A does it well, then why not." A, on the condition that its result is of good quality on real repositories.

## loop-outside-git-by-default
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-16 (translated from Polish): "Let every .jarl create a gitignore for itself with * + **/* so as not to litter, and leave a door open for our use case, where it is committed". By default `.jarl/` stays out of git. The committed mode is an explicit choice, and the family's release loops make it.

## changelog-erratum-in-place
**Date:** 2026-09-16 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

The jarl's ruling, not the owner's words, within his principle "Why do you want to do some re-release of 6.0.0 when it is already released?" (`released-version-is-final`). A published section of a CHANGELOG is not rewritten with changes from later work, but a sentence that wrongly described that release itself may be corrected in place, as an erratum. The case was Horde's `[6.0.0]` section: "Needs Yggdrasil 6.x — the same major, refused otherwise." The `v6.0.0` code (`node.mjs:160`, a check by schema name) never enforced the same major version. The corrections loop's fix stays, and the test `docs.test.mjs` guards it. A worker that stopped on the conflict between its acceptance line and that test was right to stop.

## worktrees-outside-tmp
**Date:** 2026-09-21 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-21, to the proposal to resume work (an order of seven issues; starting Yggdrasil's container; workers' worktrees outside the system temporary directory) (translated from Polish): "Ok, prepare everything for the start." It is one answer to three things at once, so it is not a choice of each option on its own; the container start and the order are taken as accepted, because that is what the question was about. The reason for the ruling: on 2026-09-21 the system emptied its temporary directory, the session scratchpad with it, and took the worktrees of six workers and all their uncommitted work (two issues entirely). The ruling: workers' worktrees go in `~/.jarl-wt/<repo>-<id>`, never in the system temporary directory or a session scratchpad, and a worker commits on its branch after each stage (red test, green test, documentation), not once at the end, because only a commit survives losing the directory.

## fresh-tree-without-prepare
**Date:** 2026-09-22 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

On three options from a research report (A: a `worktree.prepare` key that Horde runs in every tree; B: no prepare, a correct brief; postpone), Krzysztof answered "B: no prepare, a correct brief", the label of option B. The rule stays that the test environment comes from outside and Horde does not build it. Horde's README says that the gate commands prepare a fresh tree themselves or use `worktree.copy` (the dependency cache). The worker's brief gets one exception: a fast check that failed before it ran anything is reported by the worker as "no environment", not "bad base".

## jarl-archive
**Date:** 2026-09-22 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-22, four design questions in turn (translated from Polish):

1. The shape: "A separate `archive <slug>`". `jarl archive "<slug>"` moves the current loop to `.jarl/archive/<yyyy.mm.dd>-<slug>/`, then an ordinary `init` follows. `init` still refuses on a live loop.
2. The scope: "The whole loop except archive/ and the mode markers". The mode markers (`.gitignore`, `.permanent`) stay, so `init` accepts a `.jarl/` that holds only them and `archive/`.
3. Asking about archiving: "Once, at the first contact in a session". Jarl's SKILL.md says to ask once, and `status` shows the goal, the opening date and the last activity.
4. The modes: "All modes the same".

## family-candidates-file-per-producer
**Date:** 2026-09-23 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-23 (translated from Polish): "A file per producer". Every producer of candidate families writes its own file (Grain and Yggdrasil's miner separately), and `yg advise` reads all of them. The format inside a file is unchanged, and nobody overwrites anybody else's.

## one-judge
**Date:** 2026-09-23 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-23 (translated from Polish): "Nowhere did I want to have two judges. Yggdrasil has its reviewer on check approve, and there is to be no other." Asked about the scope (A: remove the `yg verdict package/record/read` channel, the `config.judge` one-shot mode in Horde and the measurement of two judges in the retro; B: the measurement only), he answered "Yes, exactly" after A was recommended. Prose rules are judged only by the reviewer configured in `yg-config.yaml`, through `yg check --approve`. A repository with no reviewer has nobody to judge its prose rules: their pairs stay unjudged, and Horde refuses to land and says to configure a reviewer. Verdicts recorded earlier through the outside judge's channel that still match their hash stay valid, so an adopter's lock does not break; no new ones can be recorded.

## type-imports-are-dependencies
**Date:** 2026-09-25 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-25, on the policy for type-only imports in TypeScript and JavaScript, after a fix had merged silence as a stopgap (translated from Polish): "I think so too. It should be like everything else, required." An import of a type alone (`import type`, `typeof import('x')`, the annotation `import('x').T`, `import type X = require()`, a type on the `as` or `satisfies` side, a type argument) is a dependency between nodes, just like an import of a value. It yields an edge, and a blocking `relation-undeclared-dependency` when the relation is missing. It holds in Yggdrasil and in Grain, which read imports with the same resolvers.

## promises-on-family-number
**Date:** 2026-09-25 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-25, about the version of the `promises` rule package, which was 0.2.0 (translated from Polish): "And can't promises be 6.1.0 too? :P" The package carries the family's release number, because it ships with Horde and Horde ships with the core: `6.1.0`, tag `pack/promises@6.1.0`. Installations from Horde 6.0.0 (recorded as 0.1.0) move to 6.1.0 through `yg pack update promises`. Whether the package takes the family's number in every release or only when `packages/promises/` changes is an open question to the owner in the 6.2.0 loop (a-003).

## findings-become-issues
**Date:** 2026-09-25 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-25, in the evening, about a round of research (Yggdrasil's consistency, Grain's mathematics, Jarl, Horde) (translated from Polish): "Whatever you find, you add to jarl and do autonomously. I'm going to bed, and that is why I commission such big things :)" Every confirmed finding becomes an issue in the loop and is worked without asking, with the full gate and green CI on the release branches. The release still waits for his word. Questions that need his decision are collected for the morning instead of blocking the work.

## free-way-of-working
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-24 (translated from Polish): "I don't get the question; do the work, I don't care how." The way of working is free: Opus workflows and workers, worktrees in the container or under `~/.jarl-wt`, as long as there is evidence, green CI and a record in the loop. The review before a merge is a fresh Opus reviewer, as adopted in practice on the night of 2026-09-25. It replaced a ruling of 2026-09-16 under which one agent ran the loop alone, with no subagents.

## agent-may-run-paid-approve
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-26, to the issue that asked (translated from Polish): "233: it may." An agent may run the paid `yg check --approve` without asking the user for consent. `yg prime` already said so; the CLI (its next and then lines, context, `aspects --health`, impact) was to stop telling agents to ask.

## grain-ignores-authorship
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

The question: Grain counted a person's commit with an agent co-author as an agent's (agent weight 0.15); the alternative was a separate, intermediate prior for paired commits; on Yggdrasil the effect was an agent share of 0% becoming 95%, and 138 conventions becoming 76. Krzysztof, 2026-09-26 (translated from Polish): "weights: b, you won't tell them apart anyway." Grain does not distinguish authorship: every commit has weight 1 when norms are learned, and the agent weighting (0.15), the agent-share alarm and the "human-authored" labels go.

## log-comments-code-changes
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-26 (translated from Polish): "the log, the way I designed it, meant that you always comment on some change, not on none". A log entry is due if and only if the node's own code (its source) changed since the last entry; never for a change of a rule, the graph, a relation, the lock or verdicts with no change to the node's code. The fill stops on the components it would fill that have changed code and no entry; the other changed nodes without an entry stay red. The texts (docs, knowledge, prime) are aligned with this.

## paid-reviewer-in-horde
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-26 (translated from Polish): "305: it spends when there is a reviewer, and that's that." In Horde, paid reviewer runs always go ahead when a reviewer is configured. The client's single "go" does not list them and they need no separate consent; workers run `--approve` without asking, consistent with `agent-may-run-paid-approve`.

## fresh-reviewer-required
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-26, answered a question with two options ((a) a fresh reviewer before every merge, as a hard rule of Jarl; (b) a default rule, with the coordinator's review enough for trifles) with "a". A fresh reviewer, an agent that did not write the code, approves every branch before it is merged. The canon keeps saying so; Jarl refuses an approve from the worker (it already did), and the coordinator's approve is not enough for a merge.

## log-no-first-entry
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Asked whether a first log entry is due once `log_required` is turned on for a node type (options: (a) no, Yggdrasil remembers the code fingerprint of every node and an entry is due only at the first real change of code; (b) yes, as today), Krzysztof answered on 2026-09-26 "a". The option label is not his wording.

## mapping-change-is-code-change
**Date:** 2026-09-26 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Asked whether moving a file between nodes (a change to `mapping:` alone) is a change of the node's code that needs a log entry (options: (a) yes, it stays as today; (b) no, only the content of files counts), Krzysztof answered on 2026-09-26 "a". The option label is not his wording.

## horde-default-constants
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Asked about six default constants of Horde that had no recorded source (`parallelism`, `tick.interval`, `territory.maxBytes`, `law.retireAfterWaves`, `law.qualityDropAsk`, `WAVES_CLEAN_FOR_ENFORCED`; options: (a) approve the current values as a dated ruling, (b) leave them "Not recorded" and measure, (c) change them), Krzysztof answered on 2026-09-27 "a". The current values are approved as starting values, and this ruling is their source in Horde's documentation. The option label is not his wording.

## code-docs-conflicts
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "Better that you ask me questions, because I don't know what is the truth, the implementation or the documentation. […] The code and the knowledge were written in parallel by agents; either one can be mixed up and wrong." When code and the knowledge, the schemas or the docs disagree, neither side is the truth in advance. When it is a real choice of behaviour (not a typo or an obvious error), the question goes to Krzysztof, one at a time, with its context and options. Obvious errors (a crash, a contradiction with itself, an untrue message) are fixed without asking. This replaced a ruling of the same day that treated the knowledge and the schemas as the primary truth.

The same day he added (translated from Polish): "In general you can probably tell by feel which option 'fixes Yggdrasil' and which makes it worse, but you can always ask". The coordinator settles a conflict between code and docs itself when one option clearly fixes Yggdrasil and breaks nothing for adopters, and asks when the choice breaks existing graphs or behaviour, or when it is not sure. (Two rulings of 2026-09-27, carried as one entry.)

## parents-define-hierarchy
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "through parents you define the hierarchy. The topmost one has no parent; there can be many topmost ones", and "yes" to the recommendation: the `parents:` rule is checked at the top level too (a type with `parents:` may not sit at the top), and in Yggdrasil's own graph six types (module, example, rule-script, build-script, repo-config and the type of the tools node) may be topmost, instead of their nodes being moved under the root, which would have opened about 1,400 paid verdicts. That was his consent to the change of `yg-architecture.yaml`. The mechanism is the coordinator's choice: a type that may be both topmost and nested lists `root` among its parents, a type without `parents:` behaves as before, and `architecture-cycle` stops claiming wrongly that a type cannot be placed.

## handoff-from-cli
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "Instead of a handoff file, better that the CLI supports it directly, and that's it". Jarl requires no hand-written handoff file. The CLI assembles the state for resuming work live from the loop: the goal, the rulings in force, the work in progress with its leases, what waits, the questions and ratifications, the next and queue order, merges and CI, the repositories' tips and the latest events of the log. Intentions live in their own places: order in priorities and `After`, reasons in `decisions.md` and in the issues' text.

## mcp-parity
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "And does MCP have the same set as the CLI? I mean, I would like there to be parity". Every family tool that has an MCP server exposes every command of its CLI through MCP, the ones that write and generate files included, with the same fields. The tool set is generated from one source with the CLI, a test guards the parity, and the skill directs agents to the MCP tools, with the CLI as the fallback.

## log-targets-and-context
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27, answered questions about Yggdrasil's log point by point, then said "Sounds good. Nice." to the coordinator's proposal (his words translated from Polish). `yg log` has the targets `--node`, `--type` and `--aspect`; `--aspect` replaces `yg aspects log`, a break of the CLI accepted on purpose ("let's ignore that"). The log goes into context: a node's log is trimmed only when the node enforces entries, otherwise it goes whole; a type's log goes whole, cascading up the type hierarchy ("On purpose. A decision may be global for a subtree"). `--type` holds decisions explicitly, not "why", and an entry there is not enforced ("You can always add a log entry, but you don't have to"). A rule's log does not go into context ("it is not to go in"). A log entry does not invalidate verdicts. The growth valve is `--supersedes <entry>`: the context holds only the decisions in force, and the history stays in the file. What goes to a type is decided by the test "does an agent touching another file of this type need to know this"; an agent writes a type decision itself only after the user's consent ("only the BIG ones would go there, rather"). Horde and Jarl write the rulings that concern an area of code ("Jarl and Horde could write such decisions to the log explicitly"), Jarl only when the repository has Yggdrasil. Horde was fixed in the same release ("Then let's fix Horde"). An integrator or summariser of the log through a model is an idea for later.

## blocks-and-composer
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

The coordinator's ruling, under the owner's mandate of that day to settle the release's open matters itself, and on his words (Krzysztof, 2026-09-27, translated from Polish): "Then Yggdrasil, Grain, Jarl are the blocks and Horde is the composer. Horde's architect would have Grain for measurements too." It settled the thirteen decisions of the blocks-and-composer research of 2026-09-27:

1. "What Jarl will not grow" is reworded: Jarl itself has no gate, planner or running lease, but a profile may install them as commands. (Replaced the same day by `horde-on-jarl-record`.)
2. The merge is done by Horde's `land.mjs`, which records it in Jarl; Jarl gets a guard against bypassing done.
3. The done policy is declared in the profile: for Horde, "landed through the gate"; without a profile a fresh approve stays.
4. What satisfies a dependency is declared per status in the profile (Horde: merged only).
5. One Jarl loop per horde under `.horde/hordes/<h>/`, through `--root`; leases between hordes stay in Horde.
6. The blocks do not call one another at run time; effects between blocks go through hooks that the composer or the user configures.
7. Grain is required for Horde: the architect always measures (the owner's words).
8. Jarl joins the core and takes the family's number already in 6.1.0.
9. Horde's MCP is Jarl's tools for the loop plus parity for the scripts that stay in Horde; full parity is reached with no work on scripts that disappear.
10. Horde's side writes to `yg log`; Jarl's side is a general `decided` hook.
11. Grain's gaps (cochange with a score of the split, `completeness --json`, rule items in advise for an existing graph, measurement at a commit) and a batch `yg owner` all go into 6.1.0.
12. Missions opened on 6.0.x finish on 6.0.x, and Horde 6.1.0 refuses an old mission with a clear message.
13. Horde's known defects are filed at once.

## shared-code-vendored
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27, on the blocks-and-composer concept after its coherence review (translated from Polish): "I would like to do what I said as far as possible, BUT I need the whole vision to be thought through perfectly." On sharing code between Horde and Jarl: "the script clones into some gitignored directory and the comparison happens there", "I mean only within development, something like that as a gate checking whether it is ok", "I would not want to go through [the hub] with every piece of development", and "As for this vendoring, in a sense it is simpler to maintain shared things automatically". The direction: Yggdrasil, Grain and Jarl as the blocks, Horde as the composer, done as far as possible; first one complete, thought-through design of the whole vision, confronted with critics, for his analysis, with the rebuild paused until his decision on it. Shared code is vendored, and a development gate in the repository that vendors checks the copy's parity (a clone of the source into a gitignored directory, and a comparison), with no work in [the hub].

## no-effort-estimates
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27, on a design critic's estimate in working days ("52 days, 3–5 months") (translated from Polish): "I don't care about your estimates. We work with agents". Designs and plans do not weigh scope by the cost of the work or by days: agents do the work. Scope is cut only for reasons of quality, risk and truth (what will break, what cannot be checked), never for effort.

## horde-on-jarl-record
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Question 1 of the family vision design had three options: (a) Jarl's record module `record.mjs` plus a data profile, without command ports; (b) command ports; (c) Runes only, with Horde's record kept separate (the option labels are not his words). Krzysztof, 2026-09-27, asked (translated from Polish): "which is better, so that we don't duplicate ourselves but keep the differences?", and after the explanation: "then A". Horde stands on Jarl through an explicit module, `record.mjs` (vendored, with a pin), and a data profile (set-by, external-scheduler, done-gate, format). Horde's differences (its schedule, gate, merge, leases and holding questions) stay in Horde, and the command ports are not built. It replaces point 1 of `blocks-and-composer`.

## conditional-trust
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

The trust doctrine of the family vision design, with three options: (a) conditional, (b) the gate always, (c) unchanged (the labels are not his words). Krzysztof, 2026-09-27, answered "a". Where a repository has a check, the check decides what lands, through both doors (Horde and Jarl). A review can only stop a change, and it is recorded as testimony, not proof. A Jarl loop in a repository with no check lands on testimony alone and says so outright, in its status and report, with a metric of the share of fresh reviews. The thesis took its wording from the design's section 4.5.

## consent-by-reach
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Consent for law and for decisions that reach a type, with three options: (a) by reach, with ratification in a batch; (b) freely, on types too; (c) consent per item (the labels are not his words). Krzysztof, 2026-09-27, answered "1", the first option, a. A node: the agent decides alone. A type: the rule comes in at once as advisory, and a type decision lives as a ruling of the loop; at closing comes a ratification batch (at most ten items, each one sentence plus a count of files, each rejected with one word), and the approved ones harden to enforced and go to `yg log --type`. A missing ratification never blocks closing, and `yg check` reports `type-law-unratified`. The thesis took its sentence from the design's section 7.2.

## entry-by-pain
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

The family's story, with three options: (a) a new sentence and entry by pain, without "Grain first"; (b) a new sentence, with "Grain first" kept; (c) "two doors", with an addition (the labels are not his words). Krzysztof, 2026-09-27, answered "a". The canon's sentence: "Jarl is the loop. Yggdrasil is the law. Grain is the survey. Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law — on Jarl's loop, with Grain in the architect's hands." A table of pains replaces the adoption ladder; "Grain first" becomes "Grain earns its keep the moment you are about to write law"; and the thesis carries one metaphor, the firm.

## family-composition
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "So the family is about programming: Yggdrasil, Grain, JarlSkill, Horde (skill). The add-ons are Ratatoskr, Urd, ResearcherSkill and a new one, a prototype (being added now […])". The core of the family, about programming and on one shared version number: Yggdrasil, Grain, Jarl, Horde. The add-ons, each on its own number: Ratatoskr, Urd, Researcher and a new prototype, since left. Runes is shared code, not a member of the family. The prototype left the family on 2026-10-05 (`skald-leaves-family`); the rest stands.

## reviewer-key-warning-only
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "Let me put it this way: when a key for the reviewer is put into yg-config, you only print a warning. That's all. You allow it." Yggdrasil blocks nothing about the reviewer's key. A key written into a committed `yg-config.yaml` works and gives only a warning. A developer's key (from the environment or `yg-secrets`) also goes to an endpoint written in the committed config, with a warning and with no requirement of consent in `yg-secrets.yaml`. A block on sending, which a worker had added beyond its issue's title ("warn locally") without his decision, went back to the warning alone.

## architecture-descriptions-kept-true
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27 (translated from Polish): "Fix what you think you should. We are not releasing anything yet." It answered a question about the stale descriptions of the `relations` and `reference-catalogue` types in Yggdrasil's `yg-architecture.yaml` (options: 1, consent to both changes; 2, leave them; the labels are not his words). The coordinator corrects the descriptions of types in Yggdrasil's `yg-architecture.yaml` when they stop telling the truth about the repository. Changes to what a type rules (its rules, relations and scope) still go to him.

## companion-key-refused
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27, answered "1" to three options (1: refuse the `companion:` key in `yg-aspect.yaml` wherever `companion.mjs` is refused, that is on a script rule, a bundle or a rule without `content.md`, and describe it; 2: a warning; 3: ignore it silently and describe that; the labels are not his words, and the coordinator had recommended 2). `companion:` outside a reviewer rule is refused, and the CHANGELOG lists it under Breaking with a step in "Upgrading from 6.0.0". The same answer set `questions-wait-for-the-owner`.

## questions-wait-for-the-owner
**Date:** 2026-09-27 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

Krzysztof, 2026-09-27, in the answer recorded under `companion-key-refused` (translated from Polish): "if anything, I'm going to bed; leave the things that need my answer for the end". Questions to the owner are collected in the loop (`ask`) and put to him together when he is back, and the work goes on meanwhile.

## quality-first-mandate
**Date:** 2026-09-28 · **Status:** standing · **Origin:** private 6.1.0 loop, translated

On a question about a seam between Yggdrasil's layers (options: A, leave the seam from structure to core; B, move the hashing module to the io layer with a change of architecture; C, split it, so that structure builds pure keys and the caller injects the hash; the labels are not his words), Krzysztof, 2026-09-28 (translated from Polish): "It has to be done in line with the truth and good architecture. Think about how it will be, quality-wise". In architectural choices the best and truest solution wins, the one whose layer boundaries are actually held, not the cheapest one and not the one where "nothing is red"; the coordinator chooses itself when the quality is unambiguous. Here, C, with no change to `yg-architecture.yaml`.

The same day (translated from Polish): "And if I tell you it has to be of maximum quality, do you still have questions?" The mandate: the coordinator settles every technical, architectural and product choice itself, by maximum quality and truth, without asking. Outside the mandate stay only the acts of consent that the tools' law forbids an agent: ratifying a rule that reaches a type (`yg log --ratify`), changing a `review_by`, a `yg-suppress`, publishing on npm and starting a release. (Two rulings of 2026-09-28, carried as one entry.)
