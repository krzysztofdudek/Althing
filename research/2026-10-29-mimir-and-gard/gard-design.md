# Gard: design of the target state

> 29 October 2026. The design of Gard 1.0.0, the tool that holds the place where an agent's work happens. It is the target the issues of the 6.2.0 loop tagged `gard` build, and every one of them can be read against it. The reasons for each decision are in [README.md](README.md); the rulings that carry them are in the loop's `decisions.md`. Nothing here is built yet; the parts that already exist in Mimir and move to Gard say so.

## What Gard is

Gard keeps the work on a repository in the place it belongs and leaves nothing on the computer but code. It does that with a **shell**: a repository around the code repositories of one application, which holds the environment the user wants (a dev container, a harness for agents, an architecture graph, end-to-end tests, recording tools) without putting any of it into the team's repositories. From one shell a container can bring up the whole application, every piece of work gets a complete copy of the application in its own state, every command runs in the container, and an agent that tries to install a package or run a throwaway script on the host is stopped and handed the command that does it in the container.

Gard is for one person, for a team that shares a shell, and for anyone who only needs the application running: a product owner can clone a shell, bring the application up with one command and record material from it.

Gard is not a store of knowledge (that is Mimir), not the law of a repository (Yggdrasil), not a loop of issues (Jarl), and not a supervisor of agent sessions. It depends on no family tool. Mimir uses it when both are installed.

## Words

- **Root**: a directory Gard manages. Usually a shell; a single repository that carries its own environment is a root on its own (the thin case).
- **Shell**: a git repository around one or more code repositories of one application. Each code repository is cloned into a subdirectory of the shell at any depth (`backend/`, `frontend/`, `own/api/`, `external/billing/`), and the shell's git ignores those directories. The shell holds the environment. A shell may have a remote or not; a team may keep one shell and share it.
- **Repo**: a code repository inside a shell, named by its directory relative to the shell (`own/api`).
- **Topic**: a named piece of work, `yyyy-mm-dd-<slug>`. For Gard a topic is only a name; Mimir's topic maps onto it one to one.
- **View**: one complete state of the application within a topic. Every topic has the view `topic`, which follows the topic's branch; every piece of work inside it (one issue of a Jarl loop, for example) gets a view of its own.
- **Worktree**: a git worktree of one repo inside one view.
- **Container**: the dev container of a root or of a view. Besides it there is the **CI container** of a shell and the **tools container** of a company or a team.
- **Guard**: a rule of the agent's hooks that refuses an action and names the action to take instead.
- **Gate**: `gard commit` and `gard push`, which run rules before they call git.
- **Rule directory**: a directory of gate rule modules.

## Principles

1. **The team's repository stays clean.** Gard writes nothing into a code repository: no hooks, no configuration, no entries in `.git/info/exclude`. The gate runs through `gard commit` and `gard push` instead (the owner's ruling `git-through-gard`). A devcontainer is added to a team's repository only when the team decides so; a guard warns when one is about to be added from a shell.
2. **The host keeps only code.** Dependencies, caches, build output and temporary files live in the container and its volumes, never in a checkout or elsewhere on the host. Worktrees are code and live on the host, inside the shell.
3. **The full range, and the author's job.** Gard gives every mechanism an application could need to come up: from sources or from prebuilt images, with services, data, ports and seeds. Making an application come up that way is the work of its author; Gard does not limit what can be declared.
4. **No dependencies on the family.** Gard needs none of the family's tools. An optional consumer (Mimir, Althing's workspace, a Jarl brief) calls Gard's commands; Gard never calls them.
5. **Native mechanisms.** git, the dev container specification, compose, `~/.ssh`, git's `url.<base>.insteadOf` and the system's keychain. Gard has no secrets of its own.
6. **Determinism.** Every action is a command with a JSON answer, `{ ok, data, next, warnings, errors }`, and every error has a code and a fix. No mechanism needs an agent.
7. **Hooks never get in the way by themselves.** A guard or a gate rule that fails or runs out of time lets the call through with a warning, unless the rule is declared as one that must run. The agent's hooks have a time budget and their p95 is measured.
8. **Proportionality.** Gard protects against the loss of someone's work, against deletion and overwriting, against what blocks or slows the work, and against secrets leaking in ordinary flows. It does not harden internal tooling against hostile input.
9. **Systems and tools.** macOS, Linux and Windows. In 1.0.0 the agent tool is Claude Code; GitHub Copilot, Codex and Cursor follow once probes on real accounts are allowed.
10. **Self-describing code.** Code, comments, names, tests and fixtures are English and point at nothing outside the repository.

## Layout

```
Example Application/                  the shell (its own git repository)
├─ gard.yaml                          the manifest
├─ backend/  frontend/  own/api/      repos on their main branches, ignored by the shell's git
└─ .worktrees/                        ignored by the shell's git
   └─ 2026-10-29-onboarding/          a topic
      ├─ topic/                       the topic's view: its branch in every repo it changes
      │  └─ backend/  frontend/  own/api/
      ├─ 012-login-form/              the view of one piece of work
      │  ├─ frontend/                 on the work's branch
      │  └─ backend/  own/api/        on the topic's commit, detached
      └─ 015-api-rate-limit/
         ├─ backend/  own/api/        on the work's branch
         └─ frontend/                 on the topic's commit, detached
```

- **Worktrees live in `.worktrees` of the nearest root**: the shell when the repo is in one, otherwise the repo itself.
- **A view mirrors the shell's layout**, so one container definition works in every view, and `own/api` never collides with `external/api`.
- **Every view is the whole application.** It has a worktree of every repo it runs. A repo the piece of work does not change stands on the topic's commit without a branch, because git keeps one branch in one worktree only; `gard worktree refresh` moves such worktrees to the topic's newest commit.
- **When a change also touches the shell**, the view gets a worktree of the shell itself on the same branch, and its container is built from the shell in that state.
- **The thin case**: a repository with its own environment and no shell has `.worktrees/<topic>/<view>/` inside itself, under the same rules.

## The manifest

`gard.yaml` at the root of the shell, committed. `gard.local.yaml` beside it, ignored by git, holds one user's additions and may only add features, mounts and switches, never repos.

```yaml
gard: 1                               # version of the schema
name: example-application             # the technical name: containers, volumes and networks derive from it
repos:
  - dir: backend                      # relative, inside the shell, at any depth
    url: https://github.com/acme/backend.git
    branch: main                      # when it differs from the remote's HEAD
  - dir: own/api
    url: https://github.com/acme/api.git
container:
  base: backend/.devcontainer/devcontainer.json   # the team's container, when there is one
  features: {}                        # additions of the shell
  user: node
app:
  compose: compose.yaml               # the services of the whole application
  images: {}                          # optional: services run from prebuilt images instead of sources
  ports: [3000, 5173]                 # ports the application publishes; Gard maps them per view
checks:                               # what "the shell works on this commit" means
  - { name: architecture, run: "yg check" }
  - { name: tests, run: "npm test", in: backend }
guards: {}                            # switches, see Guards
gate:
  rules: [gate/]                      # rule directories of the shell
tools: {}                             # tools containers, see Identities
```

Paths of a computer never stand in the manifest. The clone address of a repo is the one the world knows; a user who reaches a host through another key writes git's own `url.<base>.insteadOf` on that computer, and Gard uses it as git does.

The settings of one computer live in `~/.gard/config` (on Windows `%USERPROFILE%\.gard\config`, changeable with `GARD_HOME`): the thresholds of the guards, the range of host ports, the switches that win over a shell's, and the list of rule directories that other tools add to. The state Gard keeps (ports given to views, the commit each repo was last verified on) lives in `~/.gard/state/`.

## Commands

| Command | What it does |
|---|---|
| `gard init [<dir>]` | makes a directory a shell: git, `gard.yaml`, the managed block of `.gitignore`; idempotent |
| `gard repos sync` | clones every declared repo into its directory, or reports one that is missing or foreign |
| `gard where [--at <path>]` | the root, the repo, the topic and the view of a path; what an agent or Mimir asks first |
| `gard worktree add --topic <t> --view <v> [--branch <b>] <repo>...` | a view, or more repos in it |
| `gard worktree list` · `remove` · `refresh` | the views and their state; removal refuses uncommitted work unless told |
| `gard run [--view <v>] -- <command>` | runs a command in the container of the current root or view |
| `gard up` · `down` · `status [--view <v>]` | the whole application of a view |
| `gard ports [--view <v>]` | the host ports a view got |
| `gard check [--view <v>]` | the shell's checks, in the CI container |
| `gard drift` | which repos moved past the commit the shell was last verified on |
| `gard commit [git's arguments]` · `gard push [git's arguments]` | the gate: the rules first, then git, in the root's container where it has one |
| `gard gate clean [--apply]` | finds and removes hooks an earlier gate left in a code repository |
| `gard tools run <name> -- <command>` | a command in a tools container |
| `gard cleanup [--apply]` | what is left over, and its removal on one approval |
| `gard verify host-clean` | proves that a command left nothing on the host |
| `gard doctor` | everything this computer lacks for the current root, each with a fix |
| `gard install` · `uninstall` | the plugin of the agent tool and the command on the PATH |

## Containers

- **Layers.** The container of a shell is generated from the team's container (`container.base`, when the team has one), the shell's features and the user's local additions. Lists are added, scalars of the shell win over the base, and the user's win over the shell; a conflict is shown with where each value came from. The generated definition lies in `.gard/` of the shell, ignored by git. A shell with no base builds from its own features alone.
- **Names.** Containers, compose projects, networks and volumes are named from the shell's name, the topic and the view (`example-application-2026-10-29-onboarding-012-login-form`), shortened with a hash when they would exceed Docker's limits, and never from a directory name. The same inputs always give the same names.
- **One volume per worktree** holds that worktree's dependencies; no two views share one. A shared cache of the package manager may be switched on, because npm and pnpm are made for concurrent use. Databases and other data of a view live in volumes of that view.
- **The shell is mounted at its path on the host**, so the absolute paths git writes into worktrees hold on both sides.
- **Nothing on the host.** Every directory a tool writes under a checkout is a volume over that path; the package manager's cache and `TMPDIR` live in the container; a post-start step empties the temporary folder; commands run as the container's user. `gard verify host-clean` runs a command and compares `git status --ignored` of every repo before and after.
- **From sources or from images.** A service of `app` runs from the view's worktree or from a prebuilt image, as declared.
- **Ports.** Inside containers ports never collide. On the host each view gets its own mapping from a range in the computer's config, recorded so that it stays the same across runs.
- **The CI container** is wider than the application's: it adds what the shell's checks need (the architecture graph's tool, the loop's tool, a browser for end-to-end tests). `gard check` runs the checks in it locally, and the same definition serves the shell's CI.

## Guards

The hooks of the agent tool, shipped as Gard's plugin. Each guard has a switch (in the shell, in the computer's config, which wins) and names, in its refusal, the exact command to run instead.

| Guard | Refuses | Lets through |
|---|---|---|
| host-run | installing packages or running a project's script on the host of a root that has a container; answers with the `gard run` command | the same command through `gard run`; commands in a root without a container |
| script-ban | a throwaway script written on the fly and run at once: code passed to an interpreter in a shell command, a pasted script, a file generated for one run | named, deterministic commands that can be approved once: a tool's commands, scripts saved in a repository, `gard run` with its flags |
| temp | writing into `.temp` and similar folders a repository's own instructions ask for, in roots Gard knows; names where to write instead | everything in directories Gard does not know |
| disk | writes when free space is below the user's threshold, or when a session's scratchpad is over the user's limit, with the largest files listed | cleaning (`gard cleanup`, `docker system prune`) always |
| stray | products written into random directories of a repository | the repository's own source directories and a declared allow list |
| team-devcontainer | warns when a `.devcontainer` is about to be added to a team's repository from a shell | off by default |
| direct-git | an agent's `git commit` or `git push` in a shell's repo, and an agent's `--allow-once`; answers with the `gard commit` or `gard push` call | every other git command, and git outside any shell |

The thresholds are values the user gives; with none given the guard does nothing. At the start of a session the plugin adds one line saying which container the current root runs in and how to run a command there.

## The git gate

The owner ruled (`git-through-gard`) that nothing is wedged into the application's repository: Gard is a git intermediary for the two operations the rules gate, and plain git does the rest. The rule engine moves from Mimir, where it is built; Mimir's stubs, chain mode and snapshot, described in [git-gate-design.md](git-gate-design.md), are not carried over.

- **`gard commit`** takes git commit's arguments, runs the `pre-commit` rules on the staged changes and the `commit-msg` rules on the message (from `-m` or `-F`, or written in the editor git would open, before git sees it), and then calls `git commit -F` with that message. **`gard push`** works out the pushed range from its arguments, runs the `pre-push` rules and then calls `git push`.
- **Where the root has a container**, the final git call runs in it through `gard run`, so the team's own hooks (husky, lefthook, anything in the repository) run once, where their tools are. Gard's generated container carries `gard` itself and a read-only view of the rule directories, so a commit started inside the container is gated the same way.
- **A rule** is a module with `meta: { api, events, mustRun, timeoutMs }` and `check(ctx)`, which returns a verdict to block with a message and a fix, or nothing. A blocked call exits 1 with the rule, its message and its fix; a rule past its time is skipped with a warning unless it must run.
- **Rules come from** the rule directories of the shell and from the list in the computer's config. Mimir, when installed, adds the rule directories of the area chain of a repository to that list, so a rule written in a company's area applies to every repository of that company.
- **`--allow-once <rule>`** lets one call through on a person's word; the guard direct-git refuses it from an agent, as it refuses an agent's plain `git commit` and `git push` in a shell's repository.
- **What this does not gate**: a person's commit outside Gard (an editor's commit button, a terminal). The owner accepts that; agents cannot go around it.
- **Leftovers**: `gard gate clean` recognises what Mimir's gate installed in a repository (stubs, a hooks path, an exclude entry, a chain in front of a hook manager) and removes exactly that on the user's word.
- One optional rule ships with Gard and is off by default: a commit message may not name an AI tool as its author or co-author.

## Identities of a company

- **A tools container** per company or team holds the command-line tools that sign in to it (`gh`, `az`, the API of a code-quality service), so that company logins never land on a private host. The user signs in inside it, and the login lives in its volume. `gard tools run <name> -- <command>` runs a command there.
- **A pull request** is opened with the command a setting names, run where the setting says, so a repository whose pull requests can only be opened with the company's login gets them from the tools container.
- **A browser profile** per company lives in a volume of its tools container and serves browser automation there, never in the host's browser profiles.
- **Secrets** come from environment variables and native stores only. Gard writes none of them, and `gard doctor` names a missing one without showing any value.

## The shell and the code together

A shell depends on the state of the code it wraps: the runtime version, the package manager, the files the architecture graph maps, the screens the end-to-end tests click. The code moves on, and a shell nobody keeps up with rots without a sound.

- **Verified on a commit.** The shell records, per repo, the commit its checks last passed on. `gard drift` shows the repos that moved past it and runs the checks on request. It reports and never blocks.
- **A pair of branches when needed.** A change that touches both the code and the shell has the same branch on both sides. Gard records the pair, shows its state and detects a pair that diverged after a squash merge. The state of pairs is built in Mimir and moves to Gard.
- **Yggdrasil in a shell.** The architecture graph of a shell maps the files of the repos inside it. Whether `yg` sees changes in a nested repository that the shell's git ignores is measured once before the rest of that work; the progressive mode and a job that reports disagreement with the team's main branch follow. Yggdrasil itself is one of the shell's checks and nothing in Gard knows it.

## Cleanup

`gard cleanup` lists what is left over: containers, volumes, images and networks of views that no longer exist, views whose branches are gone, and scratchpads of sessions that ended. Nothing is removed without one explicit approval (`--apply`). A running container is never stopped and never removed by force, and a computer without Docker, or with one that does not answer, gets one warning and the rest of the report. The cleanup of a session's scratchpad and of Docker is built in Mimir and moves to Gard.

## Contracts with other tools

Every edge points one way: other tools call Gard, and Gard calls none of them.

- **Mimir → Gard, optional.** Mimir asks `gard where` and gives the agent Gard's run prefix; it adds the rule directories of the area chain to Gard's list; at the end of a topic it asks Gard to remove the topic's views. Without Gard, Mimir says how commands are run and enforces nothing.
- **Jarl, through its briefs.** A worker's brief tells it to cut its worktree with `gard worktree add --topic <topic> --view <NNN-slug> <repo>...`; Jarl names the branch as always. Jarl's code knows nothing of Gard. The merger removes an issue's view after the merge; the topic's view is the branch the loop merges into.
- **Althing's workspace** runs the family's repositories through `gard run` instead of a run command of its own.
- **Yggdrasil**: no edge. It is a command among the shell's checks.

## Release

Gard ships in the family's release 6.2.0 under its own number, 1.0.0, as one npm package with the command `gard`, under the MIT licence. Its kind in the family's registry is new: a tool of the workplace, beside Mimir, with a version of its own and no dependency on the core. Before the first publish the name of the command is checked against other programs of that name on the PATH, and nothing is published, tagged or pushed without the owner's word.

## Open decisions

The decisions taken under the mandate, waiting for the owner's word, are ratify items in the loop. The ones that shape this design are: the new kind of the registry and its wording in the canon; how Gard's place for worktrees meets the 6.2.0 issues on dev containers; Claude Code alone in 1.0.0; and the version numbers. The gate's form is decided: commits and pushes through Gard, with Mimir alone having no gate.
