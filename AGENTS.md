# Althing: the operating doc

Every agent working in this repository follows this file. It is complete on its own: an agent started here needs nothing from anywhere else. Claude Code reads it through `CLAUDE.md`, which adds only what is specific to Claude Code.

## 1. What Althing is

Althing is the layer above the Yggdrasil family of tools: the thesis, the canon, the method, the standing rulings, every release loop from 6.2.0 on, the research, the triage of reports for every tool, and the workspace that checks a release's exact commits together. The front page is [README.md](README.md). The tools' code lives in their own repositories (the core: Yggdrasil, Grain, Jarl, Horde; the add-ons: Ratatoskr, Urd, Researcher; Runes, their shared code). Althing holds no tool code and never writes to a tool from its own code.

What exists today and what is still being written is listed under "State" in the README. Where a rule below points at a file not yet written (the thesis `VISION.md`, the canon `family/canon.md`, the rulings ledger `method/rulings.md`, `method/INDEX.md`), that file is an issue in the open release loop, and until it lands the open loop's `decisions.md` holds the rulings this file cites by slug.

## 2. Session start

1. `yg check`. If it is red, fix that first.
2. `node workspace/ws.mjs doctor`. It names anything this machine lacks, including the names key.
3. `node workspace/ws.mjs status`: each repository's branch against the one its release declares, and the open loop's counts.
4. If a release loop is open, `node workspace/ws.mjs jarl resume`: the goal, the rulings in force, the work in flight, what waits, the merge queue and the log's tail. Never re-derive what the record already says.
5. Read the skill for the moment you are in (section 5 lists them).

## 3. Language

- Everything written into this repository is English: files, commit messages, branch names, slugs, tags, issue text, rulings, evidence and briefs. The rule binds what is written into the repository, not the language of conversation.
- The owner's words, when recorded, are translated faithfully and keep his register and his firmness, written as `Krzysztof, YYYY-MM-DD (translated from Polish): "…"`. A swear word becomes a neutral word. A reaction that carries no decision is not recorded in a ruling at all (ruling `ask-011`).
- When he picked an option label, the ruling names the options and says the label is not his wording.
- Meaning over words. Numbers, paths, code, slugs, commands and option labels stay as they are. An uncertain rendering is flagged to him, never smoothed over. A wrong one is corrected by a superseding ruling, never by an edit.
- Never commit the original-language text.
- The glossary of the family's terms and the reasons for all of this: [method/language.md](method/language.md).

## 4. The boundary

- Althing names no client, client project, client person, client system or private repository, and links nothing private. It reads nothing outside itself, the public repositories of its registry and the sibling checkouts of those same repositories.
- Material from private work arrives only as a distilled field report: generic, with no client, project, person, system or place named.
- If you hold private context from elsewhere, it stays out of every file, commit and message.
- No binary file enters: a text scan cannot read a screenshot, and a screenshot is the easiest leak.
- The keyed names check runs on every commit and push. Never weaken it, and never add a name to an allow-list to get past it.
- If a private name or private text is noticed in a committed file: stop, do not push, tell the owner, and follow the leak response in [method/boundary.md](method/boundary.md).

## 5. Where things live

One question: what is it?

| It is | It lands in |
|---|---|
| a sentence that describes the family to the outside | `family/canon.md` first, then every surface that quotes it |
| a fact about which repositories exist and how they build | `family/registry.json` (schema `family-registry/1`) |
| a principle of how the family is developed | `method/<topic>.md`, flat, kebab-case |
| the owner's decision that outlives a release | `method/rulings.md`, a pointer to the loop that holds its text |
| work to be done in any repository, Althing included | an issue in the open release loop, `releases/<version>/.jarl/issues/` |
| a decision taken inside a release | that loop's `decisions.md`, through `ws jarl decide` |
| a plan or an architecture review for a release | `releases/<version>/plans/`, kebab-case `.md` |
| a role brief for a release | `releases/<version>/briefs/`, a template with `{{placeholders}}` |
| an investigation, design, critique, measurement or bug hunt | `research/YYYY-MM-DD-<slug>/`, a `README.md` opening with Question, Method, Status, Conclusion |
| raw input the owner did not write (a report, a list) | `research/YYYY-MM-DD-<slug>/source.md`, verbatim if English, translated and marked if not, before anything else is written |
| code that checks the family together | `workspace/`, Node, no dependencies |
| code that checks Althing itself | `rails/`, Node, no dependencies |
| a procedure an agent follows at a moment | `.claude/skills/<name>/SKILL.md` |
| a rule that applies on every turn | this file, with its reasons in `method/` |
| an image, a screenshot, a recording, a PDF, an archive | nowhere: draw a diagram as SVG or text, link a public picture where it is public |
| anything from private work | nowhere, until it is distilled into a field report |
| a thing with no row above | an issue in the open loop, tagged `placement`, asking where it belongs |

Unsure: file an issue in the open loop and ask. Never invent a top-level directory. A file outside every region belongs to no Yggdrasil node and turns the gate red. A region's node is created with its first file; a release directory and its nodes come from `node workspace/ws.mjs release open`.

The procedures, one per moment:

| When | Skill |
|---|---|
| a session starts while a release loop is open, or files, briefs, reviews or merges work in it | [directing-a-release-loop](.claude/skills/directing-a-release-loop/SKILL.md) |
| a release or a patch is opened, planned, renumbered, shipped or closed | [releasing-the-family](.claude/skills/releasing-the-family/SKILL.md) |
| the family's tools are built or checked together, or `ws` itself is set up, read or extended | [family-workspace](.claude/skills/family-workspace/SKILL.md) |
| a question needs an investigation: a review, an audit, a design, a critique, a measurement, a bug hunt | [researching-the-family](.claude/skills/researching-the-family/SKILL.md) |
| a report about any tool arrives (a GitHub issue or pull request, a bug, a finding, a field report) | [handling-issues](.claude/skills/handling-issues/SKILL.md) |
| the wording that describes the family changes or is checked | [keeping-the-canon](.claude/skills/keeping-the-canon/SKILL.md) |

## 6. The owner's word

The owner is Krzysztof Dudek. His word is needed for:

- publishing anything (npm, plugin marketplaces, GitHub releases);
- creating or moving a tag;
- pushing to any remote, unless a ruling in the open loop grants standing permission for that branch. After Althing's first push, which is his word, Althing's `main` is pushed by the jarl whenever the pre-push rails are green (ruling `ask-012`). Pushes to a tool repository stay on his word, except the one branch a ruling names (`runes-push-branch`);
- merging a release branch into a tool's `main`;
- starting the release issue;
- deleting remote branches;
- changing GitHub descriptions, topics or settings;
- commenting on, closing or labelling public GitHub issues and pull requests;
- ratifying a rule that reaches a whole type (`yg log add --aspect <id> --ratify`), any `yg-suppress`, any `review_by` change, and any change to `.yggdrasil/yg-architecture.yaml`;
- anything irreversible.

Everything else is decided under the standing mandate below.

## 7. Standing policy

Each item names its ruling; the slug resolves in the open loop's `decisions.md`, and in `method/rulings.md` once the ledger is written.

- **Autonomy when the owner is away, quality first** (`autonomy-quality`). At every trade-off choose fewer false greens and false reds, fuller tests and a more honest message, even at the cost of a longer loop. Record each such decision with `ws jarl decide <slug> "…" --by jarl`, and when it is a choice that is his, file it for ratification in the same move (`ws jarl ask --kind ratify`). Effort is never a reason to cut scope; scope is cut only for quality, risk or truth, and never estimated in days (`no-effort-estimates`).
- **Questions to the owner, one at a time.** Give the context (what the code does, with `file:line`), the question, and two or three options with what each costs, in plain words without loop jargon. File it with `ws jarl ask` first, then show it to him. Record his answer with `ws jarl answer <id> "…" --by owner`, then the ruling. Five topics are five turns.
- **When code and docs disagree, neither is assumed true** (`code-docs-conflicts`). A real choice of behaviour goes to the owner. An obvious error is fixed.
- **Every finding becomes an issue**, filed directly (`findings-become-issues`). Nothing planned or being done goes untracked. Issues of every family repository live only in Althing's loops (`issues-live-in-althing`).
- **Evidence before done** (`fresh-reviewer-required`). No code closes without a fresh reviewer's word. Where a repository has a check, the check decides what lands, and a review is testimony.
- **The repository is the memory.** Use no agent memory store. Every durable fact, preference, decision or piece of context goes to its home here.
- **One home per fact, then links.** Never restate the thesis, the canon or a ruling; link to it.
- **Built today versus where it is going.** Keep that line explicit. Honesty over hype.

## 8. Subagents

Every spawn names its model explicitly: Opus for research, review, design, translation and every content task; Sonnet only for cheap mechanical work. Never the default model and never any other. An issue's `Tier:` is its model: `strong` is Opus, `standard` is Sonnet.

## 9. Commits

- The identity is `Krzysztof Dudek <me@chrisdudek.com>`, set as this repository's local `user.email`, and in every checkout and container that commits family work.
- Messages are English. The subject names the area and the change (`6.2.0 loop: …`, `canon: …`, `rails: …`, `workspace: …`, `skills: …`, `method: …`, `research: …`). The message ends with the attribution trailer the session's harness provides and nothing else: no session URL, no link to a private host, no other trailer. The commit-message rail refuses them.
- In Althing, commit on `main` whenever a coherent piece of work is done. Prose issues are worked in the one checkout, each touching only its own `Files:`; code issues in `workspace/` and `rails/` get a worktree under `~/.jarl-wt/Althing-<NNN>`. In a tool repository each issue lands as its own commit, and each fix a reviewer asks for is a further commit, never an amend.
- Never hard-wrap prose. A paragraph, a list item or a table row is one line, in every file and in commit bodies.

## 10. The gate

- What each rail catches, and the fix for each refusal, is in [rails/README.md](rails/README.md). A refusal prints the rail's name and the file and line.
- Never use `--no-verify`.
- Never write a `yg-suppress` without the owner's word. An architecture change (`.yggdrasil/yg-architecture.yaml`) needs his confirmation, and ratification is his.
- A rule that reaches a whole type stands advisory until he ratifies it; then it is enforced. Never record a ratification he did not give.
- On a false positive, propose the narrowest allow-list entry in a commit of its own, with its reason. A deny-list hit is never a false positive: the text changes, not the list.
- An unverified script pair clears with `yg check --approve --only-deterministic`, which is free; a bare `yg check` here does the same.
- A new release directory comes from `ws release open`, which writes its nodes; a new region is an architecture change.
- The names key on a new machine comes from the owner (`ws doctor` says what is missing and where it goes). Never generate one.

## 11. The honesty line

A green gate proves that the rails passed: the files are English, carry none of the deny-list's names, keep their structure, and leak no machine paths, binaries or secret shapes. It does not prove that nothing private leaked (a paraphrase can identify a client without naming one), that a translation is faithful, or that a release is good. Never present a green check as "safe to publish" or "the release works".

## 12. Yggdrasil

The block below is managed by `yg init` and rewritten by `yg init --upgrade`; this operating doc stays outside its markers.

<!-- yggdrasil:start -->
<!-- yggdrasil:digest cli=6.1.0 sha256=7f693ffa5729a5f62118e18f92137b194273675e185fc77d12da7f5604b9193d -->
## Yggdrasil

This repository is managed by Yggdrasil — continuous architecture enforcement.
An architecture graph in `.yggdrasil/` defines the rules; the reviewer and local scripts verify
source code against them, and `yg check` blocks CI whenever an enforced rule
is violated or unverified.

**Required first step:** run `yg prime` and follow the protocol it prints
before making any change. The full, current operating manual comes from the
installed CLI — this block is only the short summary. If `yg prime` is not
a recognized command, the installed Yggdrasil CLI predates this integration:
update the `@chrisdudek/yg` package before proceeding.

Non-negotiable invariants (they hold even before reading the manual):

- Never write a `yg-suppress` marker without the user's explicit
  confirmation. Every rule honors suppressions unconditionally — an
  unauthorized suppress silently disables a rule.
- Never change a rule's `review_by:` date; renewing or retiring a rule is
  the user's decision.
- Treat `yg advise` items and incidents as proposals: dismissing, deferring,
  or recording one requires the user's approval. Never fabricate an incident.
- Changes to `.yggdrasil/yg-architecture.yaml` require the user's
  confirmation.
- Log entries (`yg log add`) carry WHY in self-contained prose — no
  references to plans, file paths, steps, or conversation state.
- Never hand-edit `.yggdrasil/` lock files.
- If the user explicitly requests a code-only change without graph updates,
  comply but warn: the affected rules stay unverified and CI stays red. Run
  `yg check --no-approve`, not a bare `yg check` — where this repo's config
  sets `auto_approve`, a bare check fills verdicts by itself. Never run
  `yg check --approve` either.

Start every session with `yg check`; re-print the manual any time with
`yg prime`.
<!-- yggdrasil:end -->
