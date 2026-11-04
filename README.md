# Althing

Althing is not a tool and installs nothing. It is where the Yggdrasil family of tools is planned, released and researched in the open: [Yggdrasil](https://github.com/krzysztofdudek/Yggdrasil), [Grain](https://github.com/krzysztofdudek/Grain), [Jarl](https://github.com/krzysztofdudek/JarlSkill), [Ratatoskr](https://github.com/krzysztofdudek/RatatoskrSkill), [Urd](https://github.com/krzysztofdudek/UrdSkill) and [Researcher](https://github.com/krzysztofdudek/ResearcherSkill), with [Runes](https://github.com/krzysztofdudek/Runes) as their shared code.

If you want to use a tool, go to that tool's repository. If you want to read how the tools are built, released and checked together, start below.

## Words used here

- **Canon**: the one file, [family/canon.md](family/canon.md), where the family's public wording is written. Every README that describes the family quotes it.
- **Ruling**: a decision of the owner that outlives the release it was taken in, kept in the [rulings ledger](method/rulings.md).
- **Release loop**: one release's backlog and record, kept as a [Jarl](https://github.com/krzysztofdudek/JarlSkill) loop in `releases/<version>/.jarl/`: its issues, its rulings and its log.
- **Rail**: a deterministic check of this repository itself (language, structure, links, private names, machine paths, secrets), with no model in it. The rails together are the gate.
- **Workspace**: `ws`, the command in `workspace/` that sees the family's repositories together.

The rest of the vocabulary is in the [glossary](method/language.md#glossary).

## Where things are

| Region | What it holds |
|---|---|
| `family/` | the canon (the one place the family's public wording is written), the registry of repositories, the tool map, the contracts index, the inventory, parked ideas |
| `method/` | how the family is developed, the standing rulings ledger, and the record of how this repository is organised |
| `releases/<version>/` | one release: its manifest, plans, brief templates and its one Jarl loop |
| `research/` | dated investigations, each with its question, method, status and conclusion |
| `workspace/` | `ws`, the command that builds the family's tools together and checks them against each other |
| `rails/` | the detectors behind the gate, with their tests |
| `.claude/skills/` | the procedures an agent follows at a given moment |

## State

Built today: the gate (the rails in `rails/`, the Yggdrasil graph in `.yggdrasil/`, the git hooks and CI), a first `ws` with `doctor`, `status`, `jarl`, `brief`, `index`, `freeze`, `release open`, `release nodes` and `check canon-sync` (`node workspace/ws.mjs --help` lists them), the operating doc, the thesis ([VISION.md](VISION.md)), the method ([method/INDEX.md](method/INDEX.md)) with the rulings ledger ([method/rulings.md](method/rulings.md)), the family region with the canon ([family/canon.md](family/canon.md)) and the registry, the release region with the 6.1.0 and 6.2.0 manifests and the brief templates, and the 6.2.0 release loop with its full record (`releases/`, indexed in [releases/INDEX.md](releases/INDEX.md)), the six skills, one per moment, and the family's research, dated and English (`research/`, indexed in `research/INDEX.md`).

Being written: the cross-tool checks. Until they land, a sentence here that names one of them describes where it is going, not what is in the tree.

## Start here

**To read.** Start with the thesis, [VISION.md](VISION.md). Then read the canon, [family/canon.md](family/canon.md), and the release record, [releases/INDEX.md](releases/INDEX.md).

**To work on the family.** An agent starts with [AGENTS.md](AGENTS.md), the operating doc (Claude Code reads it through `CLAUDE.md`). On a machine that works on the family, run the following first, and read [the workspace](workspace/README.md) for the rest. Git hooks that run the rails are set with `node workspace/ws.mjs doctor --fix`.

```
node workspace/ws.mjs doctor
```

**What a green run does not prove.** A green gate here means the rails passed: the files are English, they carry none of the names on a private deny-list, their structure is in place, and they leak no machine paths, binary files or secret shapes. It does not prove that nothing private leaked. A paraphrase can point at a client without naming one, and a translation can read well and still be wrong. It also says nothing about whether a release is good. Never read it as "safe to publish" or "the release works".

## The four modes the workspace is going to run (not built yet)

Nothing in this table exists as a command yet: `ws` has no way to run a mode, and no command gives a verdict on a release. It is the plan the workspace packages in the open release loop are filed against ([workspace/README.md](workspace/README.md) separates what is built from what is planned).

| Mode | Which commits it will check | What it will be able to block |
|---|---|---|
| dev | the declared branches of each tool; advisory | nothing |
| candidate | the exact commits a release manifest names | the family's tags |
| adopter | the published packages, after a publish and weekly | nothing |
| upgrade | the previous release to the candidate, inside every candidate run | nothing |

## Contributing

You can clone this repository, work in it and push to your own fork without any secret. Run `node workspace/ws.mjs doctor` first: it sets nothing up by itself (`--fix` points git at the repository's hooks), and a missing names key shows as a warning, not a failure. That key belongs to the maintainer; it unlocks one check, the scan for private names, which only the maintainer's machine and CI can run. Without it your commits say they are unscanned, a push to your fork goes through with one line saying the same, and the maintainer scans a pull request's commits with the key before merging it, and CI scans every push to this repository. Every other rail (English, paths, secrets, binaries, structure, commit messages) runs on your machine. Commit messages may carry standard trailers such as `Signed-off-by`, `Reviewed-by`, `Fixes` and `Refs`; they may not link an agent session or a private host. Tests run with `npm test`. The rules and the fix for each refusal are in [rails/README.md](rails/README.md); never bypass the hooks with `--no-verify`.

## Reporting a problem with a tool

Open an issue on that tool's own GitHub repository. Every report is reproduced and triaged into a release loop here. The planning record of the family is the release loops under `releases/`, and anyone who wants to contribute to this repository reads [AGENTS.md](AGENTS.md) first.

## License

MIT, as every family repository. See [LICENSE](LICENSE).
