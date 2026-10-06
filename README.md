# Althing

Althing is where the Yggdrasil family of tools is developed in the open. It holds the family's thesis, the wording that describes the family, the method we work by, the owner's standing rulings, every release loop from 6.2.0 on with its full record, the research, the triage of reports for every tool, and the workspace that checks a release's exact commits against each other. The tools' code lives in their own repositories. Althing holds none of it and never writes to a tool from its own code.

**What a green run does not prove.** A green gate here means the rails passed: the files are English, they carry none of the names on a private deny-list, their structure is in place, and they leak no machine paths, binary files or secret shapes. It does not prove that nothing private leaked. A paraphrase can point at a client without naming one, and a translation can read well and still be wrong. It also says nothing about whether a release is good. Never read it as "safe to publish" or "the release works".

## Where things are

| Region | What it holds |
|---|---|
| `family/` | the canon (the one place the family's public wording is written), the registry of repositories, the tool map, the contracts index, the inventory, parked ideas, the history |
| `method/` | how the family is developed, the standing rulings ledger, and the record of how this repository is organised |
| `releases/<version>/` | one release: its manifest, plans, brief templates and its one Jarl loop |
| `research/` | dated investigations, each with its question, method, status and conclusion |
| `workspace/` | `ws`, the command that builds the family's tools together and checks them against each other |
| `rails/` | the detectors behind the gate, with their tests |
| `.claude/skills/` | the procedures an agent follows at a given moment |

## State

Built today: the gate (the rails in `rails/`, the Yggdrasil graph in `.yggdrasil/`, the git hooks and CI), a first `ws` with `doctor`, `status`, `jarl`, `brief`, `index`, `freeze`, `release open` and `check canon-sync`, the operating doc, the thesis ([VISION.md](VISION.md)), the method ([method/INDEX.md](method/INDEX.md)) with the rulings ledger ([method/rulings.md](method/rulings.md)), the family region with the canon ([family/canon.md](family/canon.md)) and the registry, the release region with the 6.1.0 and 6.2.0 manifests and the brief templates (`releases/`, indexed in [releases/INDEX.md](releases/INDEX.md)), the six skills, one per moment, and the family's research, dated and English (`research/`, indexed in `research/INDEX.md`). Being written: the 6.2.0 loop moved here and translated (until it lands, the ledger lists the 6.2.0 rulings that stand as rows rather than checked entries), and the cross-tool checks. Until they land, a sentence here that names one of them describes where it is going, not what is in the tree.

## Start here

An agent starts with [AGENTS.md](AGENTS.md), the operating doc (Claude Code reads it through `CLAUDE.md`). A person starts with the thesis, [VISION.md](VISION.md), and then the canon, [family/canon.md](family/canon.md).

On a machine that works on the family, the one command to run first is ([the workspace](workspace/README.md) has the rest):

```
node workspace/ws.mjs doctor
```

## The four modes of the workspace

| Mode | Which commits it checks | What it can block |
|---|---|---|
| dev | the declared branches of each tool; advisory | nothing |
| candidate | the exact commits a release manifest names | the family's tags |
| adopter | the published packages, after a publish and weekly | nothing |
| upgrade | the previous release to the candidate, inside every candidate run | nothing |

## Reporting a problem with a tool

Open an issue on that tool's own GitHub repository. Every report is reproduced and triaged into a release loop here. Althing has no issue tracker of its own.

## License

MIT, as every family repository. See [LICENSE](LICENSE).
