# The tool map

What each tool of the Yggdrasil family is for and where it lives. Each tool is developed in its own public repository; its internals are documented there, so this map only says where each one sits and links it. The family's wording is authored in [the canon](canon.md), and the list of repositories is [the registry](registry.json): when the two disagree with this map, they are right and this map is stale.

## The family

Seven tools, one system, and one human in it: **the client**, who orders an outcome, is the final decision-maker on what gets built and on whether it turned out right, and does not run the process. Four of the seven are the core, on one version number (Jarl on it from 6.1.0), and they read in one breath: **Jarl is the loop. Yggdrasil is the law. Grain is the survey. Horde plans the mission onto the law before anyone writes, lands every change through a gate no agent can argue with, and turns what the mission learned into law, on Jarl's loop, with Grain in the architect's hands.**

**Start at the step where it hurts.** More issues than one agent can hold: Jarl. The agent keeps breaking what was agreed: Yggdrasil. Nobody knows what was agreed: Grain, which earns its keep the moment you are about to write law. A task too big for one head to plan up front, in a repository that already has law: Horde. Entry is not rank: whichever tool comes first, Yggdrasil stays the law. Where a repository has a check, the check decides what lands in both Horde and Jarl, and a reviewer's word is testimony.

**Every dependency edge points one way.** Horde requires Yggdrasil and Grain, 6.1.0 or newer, and carries Jarl's record library inside it, so a mission is a Jarl loop. Grain uses Yggdrasil when it is present. Jarl records what the client ratified in Yggdrasil's logs when the repository has a graph, and needs nothing else. Yggdrasil depends on none of them, and the add-ons depend on nothing. Installing the whole family is the recommendation, never the requirement. The edges in full are in the canon's dependency graph.

| Tool | Role in the family | Repository |
|---|---|---|
| **Jarl** | **the loop.** Everything seen becomes an issue, a worker per issue in its own worktree, evidence and a fresh reviewer's word before each merge; the repository's check, where there is one, decides what lands. Horde runs each mission on it. The family's own releases run as Jarl loops, here in Althing. | [krzysztofdudek/JarlSkill](https://github.com/krzysztofdudek/JarlSkill) |
| **Yggdrasil** | **the law.** Enforced rules: the rails the agent cannot ignore, the graph everything else reads, and the log of why; law that reaches a whole type runs as advice until the client ratifies it. Althing's own gate runs on it. | [krzysztofdudek/Yggdrasil](https://github.com/krzysztofdudek/Yggdrasil) |
| **Grain** | **the survey.** Mines a proposed graph (node types, nodes, relations, cycles, and the rules the repository's own code can prove, each carrying its evidence) for a repository with no graph yet; `yg adopt` is the acceptance. It measures and never blocks; Horde's architect measures with it on every mission. Its older agent-facing surface (where does this belong, does my change conform) still works and needs nothing else installed. | [krzysztofdudek/Grain](https://github.com/krzysztofdudek/Grain) |
| **Horde** | **the mission on the law.** A one-shot architect plans the whole mission onto the graph once, measuring with Grain; a worker per ticket; every change lands through a nine-item gate; what the mission learned becomes law. Its record is a Jarl loop. Requires Yggdrasil and Grain 6.1.0 or newer. | [krzysztofdudek/Horde](https://github.com/krzysztofdudek/Horde) |

Three **add-ons** attach to the agent rather than to the graph. They are disciplines, not machinery; each works alone, keeps its own version, and depends on nothing in the family. Horde uses Ratatoskr, Urd and Researcher when they are there instead of assuming them.

| Add-on | Stage | Role | Repository |
|---|---|---|---|
| **Ratatoskr** | request → intent | the account manager: reads intent back in plain words, holds consent, and is the only bridge between the client and the agents | [krzysztofdudek/RatatoskrSkill](https://github.com/krzysztofdudek/RatatoskrSkill) |
| **Urd** | intent → code | professional discipline: ask or consult the source instead of guessing when the spec runs out | [krzysztofdudek/UrdSkill](https://github.com/krzysztofdudek/UrdSkill) |
| **Researcher** | code → measured result | the laboratory: settle claims by experiment, not assertion | [krzysztofdudek/ResearcherSkill](https://github.com/krzysztofdudek/ResearcherSkill) |

**Runes** ([krzysztofdudek/Runes](https://github.com/krzysztofdudek/Runes)) is infrastructure, not a member of the family: the code the core tools share (relation extractors, the parser host and grammar recipe, the lock, the command table, the MCP adapter, the test kit, shared skill fragments). Grain, Jarl and Horde commit a pinned copy of the parts they use and Yggdrasil installs `@chrisdudek/runes` at an exact version; it has its own semver, its own CI and its own releases, and adds no edge between the tools. Nobody installs it to get work done.

## Grain's pause, and why it came back

Grain stopped on 2026-09-02 after ten days, on a number. The engine was at its best state (23 grammars, 26 commands, 2184 tests, zero false alarms across a 25-repository corpus), and the question that decides whether the tool is worth anything, *does an agent with Grain produce a better change than an agent without it*, came back **not demonstrated**: one documented effect on 26 August, then no changed diff across 25 paired runs. The record written the day it stopped is the research folder `2026-09-02-grain-project-report`.

What restarted it was not another wave of fixes but the lesson that report itself named: **a true answer that changes no decision is worth zero**. Correctness was never the constraint; reach was. So the objective moved. Grain no longer competes for the agent's attention mid-edit; it produces the artifact another tool consumes, and the graph it proposes changes a decision the moment it lands. `grain propose` shipped in 0.4.0 on 2026-09-07, and the mission that made the three tools of the time one system ran through Horde on 2026-09-05 and 06.

## Outside the current frame

Two earlier embodiments of the same thesis, a greenfield entry (fork a governed environment) and a brownfield one (arm an existing repository with one), are dormant: neither has been touched since mid-2026, neither is public, and nothing has been decided about them. Grain now covers the brownfield entry from the other side, by mining the graph instead of installing a harness.

## The public face

| Surface | Role | Where |
|---|---|---|
| **Website** | where the thesis and the family are told to the world; it is built from a private repository the owner drives, and the canon is its source | [chrisdudek.com](https://chrisdudek.com) |
| **Profile** | identity and where this is going | [krzysztofdudek/krzysztofdudek](https://github.com/krzysztofdudek/krzysztofdudek) |

## The registry

[registry.json](registry.json) (schema `family-registry/1`) declares each family repository once, and everything that lists repositories (this map, the canon's drift check, the inventory and `ws`) derives from it. Each entry under `repos`, keyed by its registry name, carries:

| Field | Meaning |
|---|---|
| `display` | the name the canon and the READMEs use |
| `github` | `owner/repository` on GitHub |
| `kind` | `core` (on the family's version number), `add-on` (its own number) or `shared` (Runes: infrastructure, not a member) |
| `build` | the commands that build one commit, run in its tree; empty when nothing needs building |
| `bin` | the programs a built tree yields, by name, relative to the tree |
| `env` | the environment variables this repository supplies to the others' suites; `{tree}` stands for the absolute path of the built tree |
| `npm`, `plugin` | the published package, or the plugin and its marketplace, without a version |

`surfaces` names the public places that quote the canon and are never built: the profile repository and the website. `retired` lists the names that have left the family; the rail `canon/registry-consistent` refuses any of them in the canon's block, this map or the contracts index.
