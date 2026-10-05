# The workspace

`ws` is the one command that sees the family's repositories together: Node 22 or later, no dependencies, run as `node workspace/ws.mjs <command>`. It verifies and records. It never pushes, tags, publishes or writes to a tool repository; the rail `code/read-only-to-tools` holds that line.

## Built today

| Command | What it does |
|---|---|
| `doctor [--fix]` | checks this machine: Node, git, gh, the hooks path (`--fix` sets it), the installed `yg` against the hooks' pin, Yggdrasil's merge drivers, the names key, each sibling checkout and its branch, the worktree root, the Yggdrasil devcontainer, the installed Jarl and Grain plugins, and the driver Jarl's pin for the open release |
| `status [<version>]` | per repository of the open release: its branch (named when it is off the declared one), HEAD, the manifest's version, the latest tag, whether `[Unreleased]` has entries; then the loop's counts |
| `jarl <command> [args] [--release <version>]` | the release loop's driver Jarl, with `--root` set; a writing command is refused while the driver checkout is not on the commit the manifest pins |
| `brief <role> [--repo <name>] [--issue <id>] [--trailer "<line>"]` | renders a brief template of the open release for this machine; the rendered text is what a spawn receives |
| `index [--check]` | writes, or compares, `releases/INDEX.md` and `research/INDEX.md` |
| `freeze <releases/<version> \| research/<folder>>` | writes `FROZEN.sha256` for a closed release or a cited research folder |
| `release open <version> --previous <version> --goal "<text>"` | a new release directory: the manifest, the nodes, the permanent loop with one `Check:` line per repository, and the release issue tagged `release, needs-owner` |
| `release nodes <version>` | (re)writes a release's Yggdrasil nodes and the index node |

This machine's sibling checkouts, how each one is run and where worker worktrees go are in `ws.local.json` at the root, which is never committed; `method/environment.md` shows its shape.

## Where it is going

The four modes, each a set of commits checked together:

| Mode | Which commits | What it can block |
|---|---|---|
| dev | the declared branches of each tool; advisory | nothing |
| candidate | the exact commits a release manifest names | the family's tags |
| adopter | the published packages, after a publish and weekly | nothing |
| upgrade | the previous release to the candidate, inside every candidate run | nothing |

The commands that run them (`env`, `up`, `check`, `run`, `pin`, `verify-publish`, `order`, `inventory`, `plan`, `verdict`) and the cross-tool checks arrive with the workspace packages filed in the open release loop. Until then, no command here gives a verdict on a release.

**What a green verdict will not prove.** That the tools work for an adopter in every repository, that a translation is faithful, or that nothing private leaked. It proves that the named commits passed the named checks together.
