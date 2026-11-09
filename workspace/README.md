# The workspace

`ws` is the one command that sees the family's repositories together: Node 22 or later, no dependencies, run as `node workspace/ws.mjs <command>`. It verifies and records. It never pushes, tags, publishes or writes to a tool repository; the rail `code/read-only-to-tools` holds that line.

## Built today

| Command | What it does |
|---|---|
| `doctor [--fix]` | checks this machine: Node, git, gh, the hooks path (`--fix` sets it), the installed `yg` against the hooks' pin, Yggdrasil's merge drivers, the names key, each sibling checkout and its branch, the worktree root, the Yggdrasil devcontainer, the installed Jarl and Grain plugins, and the driver Jarl's pin for the open release |
| `status [<version>]` | per repository of the open release: its branch (named when it is off the declared one), HEAD, the manifest's version, the latest tag, whether `[Unreleased]` has entries; then the loop's counts |
| `jarl <command> [args] [--release <version>]` | the release loop's driver Jarl, with `--root` set; the manifest's `driver.jarl.repo` names the source in `ws.local.json`, so each loop keeps its own driver; a writing command is refused while the driver checkout is not on the commit the manifest pins |
| `brief <role> [--issue <ids>] [--repo <name>] [--slice <coordinator>] [--trailer "<line>"] [--release <version>]` | for a loop of the current format, the tool's own brief for a worker, a reviewer or the merger (`--issue` takes the issues of one lease), then what `releases/<version>/briefs/` adds, rendered for this machine; for a loop of an older format, its complete template; the printed text is what a spawn receives |
| `index [--check]` | writes, or compares, `releases/INDEX.md` and `research/INDEX.md` |
| `freeze <releases/<version> \| research/<folder>>` | writes `FROZEN.sha256` for a closed release or a cited research folder |
| `release open <version> --previous <version> --goal "<text>" [--version <repo>=<x.y.z>]... [--driver-sibling <commit> [--driver-source <name>]]` | a new release directory: the manifest, the nodes, the permanent loop with one `Check (<name>):` line per repository, and the release issue tagged `release, needs-owner`. The driver is the source the previous release names, unless `--driver-source` names another; a failure leaves nothing behind |
| `release nodes <version>` | (re)writes a release's Yggdrasil nodes and the index node |
| `check canon-sync [--source repos\|local\|github] [--ref <ref> \| --ref <name>=<ref>]` | compares each family README's family section and headline with `family/canon.md`, for every core tool and add-on in `family/registry.json`, and names the repository and the line where they part; it reads each README from a committed ref (`main` unless `--ref` says otherwise): the workspace's clone in `repos/` when there is one, otherwise GitHub, or the sibling checkouts with `--source local` |

This machine's sibling checkouts, how each one is run and where worker worktrees go are in `ws.local.json` at the root, which is never committed; `method/environment.md` shows its shape.

## Where it is going

The four modes, each a set of commits checked together:

| Mode | Which commits | What it can block |
|---|---|---|
| dev | the declared branches of each tool; advisory | nothing |
| candidate | the exact commits a release manifest names | the family's tags |
| adopter | the published packages, after a publish and weekly | nothing |
| upgrade | the previous release to the candidate, inside every candidate run | nothing |

The commands that run them (`env`, `up`, `run`, `pin`, `verify-publish` and `order`) and the other cross-tool checks under `check` arrive with the workspace packages filed in the open release loop. Until then, no command here gives a verdict on a release.

**What a green verdict will not prove.** That the tools work for an adopter in every repository, that a translation is faithful, or that nothing private leaked. It proves that the named commits passed the named checks together.
