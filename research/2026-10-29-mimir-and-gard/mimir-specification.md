# Mimir: specification of the target state

> Written on 26 October 2026. It consolidates the earlier specification (which was in Polish), the notes on layers and on the owner's setup, the original design documents, the decisions the owner took while Mimir was being built, and three independent reviews. It describes the TARGET state of Mimir: the core, which is an open tool for one person, a team or a company, and the owner's own setup, which is built on top of the core as extensions and area content.
>
> The specification is written to be read on its own. It does not point at section numbers, task numbers or decision names: another chapter is named by its title, and a decision is stated as a sentence with its reason.
>
> **In Althing, 29 October 2026.** Ported from the development documents of Mimir's first build. Every private name is replaced by a neutral one (`acme`, `app-web`, `second-app`), and the chapter on the owner's own setup is left out: a personal setup built on the core is described only in general terms, in the chapter A personal setup. Two things changed after it was written. The markers record 26 October; what is built on 29 October is listed in `releases/6.2.0/plans/plan-mimir.md`. And on 29 October the owner moved shells, containers, running commands in them, the rules of order and the engine of the git gate out of Mimir into a tool of their own, Gard ([gard-design.md](gard-design.md), and the decision in [README.md](README.md)). Every sentence below about those subjects describes Mimir before the split; reconciling them is an issue of the 6.2.0 loop.

## How to read the markers

Every part that is not simply a rule of the design carries one of four markers, so that nobody mistakes a plan for a fact.

- **[built]**: present in the code that exists on the build branch on 26 October 2026, and covered by tests there.
- **[partly built]**: some of it is in the code; the text says which part.
- **[planned]**: decided, not yet in the code.
- **[undecided]**: the owner has not decided it; the chapter Open decisions lists it with the options.

"Must" is a requirement, "should" a recommendation. Where nothing is marked, the sentence states a design rule that holds for the whole of the part it stands in.

Part b of this specification (the complete error table, the tool matrix of the four agent tools, and the closing of the remaining proposals) is written later, after the build. Its place is marked in the chapters Errors and The MCP surface and at the end, in the chapter Reserved for part b.

## Scope and principles

**Systems and tools.** The target is macOS, Linux and Windows, and the agent tools Claude Code, GitHub Copilot, Codex and Cursor. The owner set the complete target as the goal, not a first slice, and left the order of the build to the builder. State today: the code is written and tested for Claude Code. Development happens on macOS, with tests run in a Linux container. The Windows work (path layer, atomic writes with retries, running without a POSIX shell, rules for cmd and PowerShell, a CI matrix) is part of the build now, because Windows is in the target; it carries the mark alpha until its tests pass on a real Windows runner. **[partly built]**

**It works without being mentioned.** After installation the user never has to say "Mimir". The plugin tells the agent: the hook at the start of a session gives a short header with the context, the MCP server lists the tools, and skills describe what is possible. **[built for Claude Code]**

**The user may be technical, but need not be.** Mimir does not ask about git (whether to commit, whether to push), because the answer would always be "do it". It does it by the rules of this specification. A technical user can go lower and work with plain git in the paths Mimir hands out.

**Names are for people.** Titles of the Desk, of areas and of topics are written normally. Mimir derives the technical form (id, directory, branch) from them.

**No remote server.** Synchronisation and permissions are git. Everything works locally, and without a network the writes wait in a queue.

**Determinism.** Every action is a command with JSON output. The library, the CLI and MCP are built from one command table, and MCP exposes a small, explicitly chosen subset of it. No mechanism needs an agent to work. Where a step does need an agent (the end of a topic is the case), the chapter says so in so many words.

**Native mechanisms.** Mimir uses git, `~/.ssh`, the logins of the tools and the keychain of the system. It has no implementation of secrets of its own. Isolation of a client's identity in containers is the owner's preference and belongs to the owner's setup.

**Git without a proxy.** Mimir does not wrap git. For git operations it hands out a path (the checkout of an area, a repo or a worktree), and the agent works there with plain git. Mimir itself performs only its own writes (see Write protocol), worktrees (see Worktrees) and topic branches (see Topics). Every git call that Mimir makes passes through one list of what it may run; forced pushes, resets, checkouts in the user's tree, stashes, rebases, pulls and other calls that could destroy somebody's work are refused by name. **[built]**

**The core and the owner's setup are separate.** The core is an open tool that anyone can install. What belongs to the owner alone (archive of Claude Code sessions, the diary, ingest of the company's mail and chat, isolation of client identities, Yggdrasil in project shells, and rules of order for files and disk) is extensions and area content of the owner, never the core. The core keeps only the mechanism that such things need.

**Trust in what is cloned.** Mimir trusts everything the user has cloned: hooks, jobs, extensions and skill scripts of a cloned area run without a further approval. The owner chose this, over trusting only on a change and over a list of trusted areas, because a cloned area must work at once and an approval at every change would be a constant interruption. A review pointed at the cost: unlike a plain clone, which git never runs, the code of an area runs after a plain pull, so a taken-over account of a colleague means code on every machine that pulls. Therefore the risk is described openly in the threat model and in the README, and areas from untrusted sources must not be cloned. Content of shared areas reaches the agent marked with its source, as material and not as instructions.

**Packages on the host.** Packages may be installed on the host. The rule "packages only in a container" applies to the repos of teams and to projects that have a devcontainer, not to Mimir itself or to the owner's tools. Consequence: Mimir may use ordinary npm dependencies instead of vendoring them, and the development install may use `node_modules` installed on the host in the Mimir repo. The host-run rule and the other rules of order still apply in repos with a devcontainer, where the owner switches them on. At present two dependencies (the YAML parser and the command-table library) are vendored; moving them to ordinary dependencies is **[planned]**.

**Implementation.** Node.js (the code requires 22.13 or newer), one npm package. The package is `@chrisdudek/mimir`, version `1.0.0-alpha.1`, command `mimir`. The package is prepared completely (pack, a test that installs the tarball, a dry run of publish) and is not published: publication happens only on the owner's word. Before publication the name of the command must be checked against the Grafana Mimir binary in `PATH`, and the README explains the difference between the two projects. Availability of the package name is checked only by reading (`npm view`). Mimir is released under the MIT licence. The owner chose it after a review, over Apache-2.0 and over keeping the code private. The licence field in the package is still a placeholder (`UNLICENSED`) and is replaced when the licence file is introduced; the owner confirms the name and the year in that file.

**Documents and self-description.** The Mimir repo holds no documents except the README and the licence file. This specification, the description of the architecture, the threat model and other development documents live outside the repo and exist only for the time of development; when the build is finished, the real documentation is written afresh from what was built. Development documents and the README are in English. The code, comments, names of files, directories, tests and fixtures, and the text of the README are self-describing: they do not refer to things that are not in the repo (section signs and section numbers of a specification, numbers of tasks, names of decisions, marks of reviews). A reference to another document in the repo goes through its title or a link to its heading. Mimir as a tool may name the loop tool Jarl as an integration (a driver, a worktree name) but never its numbers. A test in the repo, backed by an aspect in the architecture graph, fails on a forbidden pattern. The exception is third-party code.

## Glossary

- **Desk**: the user's main area. Its type is `desk` and it is always personal. It holds the owner's rules, places with a purpose, attachments of repos and external directories, and preferences. It is the root of the logical hierarchy.
- **Area**: a directory with an `area.yaml`, versioned in a git repo. Knowledge, topics, skills, hooks, MCP, jobs and rules live in areas. An area is a unit of knowledge and work.
- **Repo and copy**: a repo is the code repository as the world knows it (an address); a copy is its clone on one computer. Mimir identifies a repo by its address and so does not allow two copies of the same repo on one computer.
- **Shell**: an area whose `repos[].dir` is `source`. A shell keeps the clean repo of a team in its subdirectory `source/` and keeps the owner's environment (devcontainer, volumes, run scripts, agent configuration) beside it, so that the repo of the team stays clean. The repo in `source/` is a nested repo, which the git of the parent ignores. A shell is an ordinary area: it has a parent like any other. Where the repo of a team already has the harness and nothing needs to be kept beside it, a thin area around the repo is enough, and no shell is needed. This is the only definition of a shell.
- **Overlay**: a private layer on top of somebody else's area, for example the owner's private layer over a company area, which holds the owner's ingests, notes and private topics. An overlay lists the area it covers in `overlays`, and its settings come right after those of the area it covers (see Algorithms). An overlay is nothing more than that; in particular it is not a shell with a harness.
- **Topic**: a unit of work. It has a title with a date, a status and a minimal contract; it may have branches in several repos and areas.
- **Place**: a named place with a purpose. The name and the purpose live in the Desk; the path lives in the file of the computer.
- **Attachment**: any directory attached to the index and to browsing, with a purpose.
- **Resource**: everything Mimir manages. A resource has an address, declared fields, effective fields, the origin of each field and a state (available, or unavailable with a reason).
- **Rule**: a resource that selects other resources and overrides their fields.
- **Job**: a runnable script declared in an area.
- **Product (output)**: a file that work makes and that is worth keeping: a recording, a render, an export. See Files and schemas for the difference between the `outputs` key and the place called `outputs`.
- **Recipe**: the small file next to a reproducible product that says how it was made.
- **Session**: one run of an agent tool. Mimir keeps a small file per session.
- **Main checkout**: the checkout of a repo that stands on its main branch and is where Mimir's own writes go.
- **Session branch**: a branch named after the work done in a session, where writes go when the main branch cannot take them.
- **Queue**: the commits of Mimir that the remote does not have yet.
- **Beside commit**: a commit that Mimir builds from the content to be written without touching the files in the user's tree (see Write protocol).

## Data model

### Area

- A directory with `area.yaml` inside a git repo. An area may have a repo of its own, or lie in a subdirectory of the repo of another area.
- **The hierarchy is logical, not by directory.** The parent is named by a declaration, not by where the directory lies on the disk. An area, a code repo or a Desk may lie where it already lies (for example everything under `~/repos`) or be nested. This is how the owner works with a disk that is already laid out. **[built]** for the registry and the resolution by path.
- **Id.** Short, chosen by the owner in the manifest, written as a path separated by `/` (for example `acme`, `acme/app`). It is the technical key used in addresses. It is unique on a computer; when two areas collide, a local alias resolves the clash. The id contains no segment that Windows reserves for devices (`con`, `nul`, `com1`...). **[built]** for the id; **[planned]** for aliases.
- **Title.** The name for people, written normally. The header, the portal and lists show the title; addresses use the id.
- **Type.** A free label. Typical values are `desk`, `personal`, `org`, `team`, `project`. The core distinguishes only `desk`. The type does not choose a template when an area is made; `area create --type` stores the label and nothing else. This is decided: a template per type was in an earlier draft, but nothing needs it, and a label is enough. **[built]**
- **Visibility.** `shared` or `personal`; it tells the agent whether the area is common. The default is `shared`, and `personal` for a Desk. The value is a statement made by the author and Mimir does not verify it. **[built]**

### Desk

The main area of the user (type `desk`, always `personal`). It holds the owner's rules, places with a purpose, the attachments of repos of teams and of external directories, and preferences.

- The id of a Desk is unique (for example `desk-me`); `init` proposes it from the user name. The word `desk` in commands is a reserved shortcut for "my Desk" and is never stored in written content: `write` replaces it with the full id.
- Without a declared parent an area belongs to the Desk.
- A copy of the Desk: the copy will be a private repository on GitHub, made later, when the owner wants it. Until then `mimir doctor` reports that there is no copy (code `BACKUP_MISSING`) with a fix, and once a remote exists it watches for unpushed changes. Mimir never creates a remote of the Desk by itself. The owner chose a private repository over a bundle on an external disk and over no copy. **[planned]**

### Resource

```json
{ "address": "mimir://acme/app:repo/app-web",
  "kind": "repo", "name": "app-web", "area": "acme/app", "title": "App webapp",
  "declared": { "...": "fields from the manifests, layer by layer" },
  "effective": { "...": "fields after the rules are applied" },
  "why": { "url": [ { "layer": "owner-rules", "rule": "mimir://desk-me:rule/acme-ssh" },
                    { "layer": "area", "source": "mimir://acme:file/area.yaml#L12" } ] },
  "state": { "available": true, "path": "~/repos/github.com/acme/app-web" } }
```

For an unavailable resource, `state` is `{ "available": false, "reason": "...", "fix": "<command>" }`. When something is missing on a computer (an area not cloned, a place without a path or with a disconnected disk, an identity or a container), Mimir returns this state with the command that would put it right and repairs nothing by itself; the rest works with what exists. **[built]** for state with reason; the `declared`, `effective` and `why` parts come with the layers of configuration, **[planned]**.

### Kinds of the core

| Kind | What it is | Source | Status |
|---|---|---|---|
| `area` | an area | manifest and registry | built |
| `file` | a file in the directory of an area (not in nested areas or ignored paths) | file system | built |
| `repo` | a code repo assigned to an area | `repos` of the manifest, or an attachment in the Desk | built |
| `worktree` | a worktree of a repo or area managed by Mimir | registry and git | built |
| `place` | a place with a purpose | Desk and the file of the computer | built |
| `attach` | an external directory | Desk and the file of the computer | built |
| `topic` | a topic | `topic.yaml` in the directory of topics | planned |
| `skill`, `hook`, `mcp`, `job` | elements of an area | `area.yaml` and the role directories | planned (skills of the Desk are built) |
| `rule` | a rule | `rules` of a manifest or of the file of the computer | planned |

Extensions add kinds of their own, for example `session` (see Extensions).

## Files and schemas

### area.yaml

```yaml
mimir: 1                        # version of the schema (required)
requires: ">=1.0"               # minimal version of Mimir (optional)
id: acme/app                  # required; the technical key
title: App                      # name for people
type: project                   # a label
visibility: shared              # shared | personal
parent: acme                  # optional; id of the parent
formerly: []                    # earlier ids after a rename
overlays: []                    # addresses of areas or repos that this area overlays
reads: []                       # addresses of areas read without belonging to them
roles:                          # where things are; these are the defaults
  knowledge: knowledge/
  topics: topics/
  skills: skills/
  hooks: hooks/
  jobs: jobs/
  sources: sources/
areas:                          # sub-areas to clone (optional)
  - id: acme/app-mobile
    url: https://github.com/acme/app-mobile-knowledge.git
repos:                          # code repos of this area; only separate repos, no submodules
  - name: app-web
    url: https://github.com/acme/app-web.git
    dir: source                 # directory in the area where the repo is cloned (shell layout)
    branch: null                # main branch when it differs from origin/HEAD
    pin: null                   # a recorded version
    skip: false                 # true: do not clone on any computer
    integrate: pr               # push | pr; a code repo takes a pull request unless it says otherwise
integrate: push                 # push | pr; for the repo of the area itself; push unless written
autopack: false                 # whether Mimir packs the agent's changes into a commit at the end of a session
exec:                           # how the commands of the project are run
  command: "scripts/dx run --"
  container: app
  cwd: source/
  note: "Run project commands through the container."
hooks: { temp-block: off }      # switches of the hook blocks for this area
outputs:                        # products: class of product to a place and a path
  generated: place:outputs/acme/app
needs:                          # places this area needs (name to purpose)
  outputs: "Renders and screen captures of App"
container:                      # optional, for a shell; see Area elements
  base: mimir://acme/app:repo/app-web#.devcontainer
  features: []
mcp: {}                         # MCP servers of the area
jobs: {}                        # jobs
rules: {}                       # rules
extensions: []                  # extensions that add kinds
```

Status of the keys. **[built]**, validated by `check`: `mimir`, `requires`, `id`, `title`, `type`, `visibility`, `parent`, `overlays`, `reads`, `roles`, `repos` (with `name`, `url`, `branch`, `pin`, `skip`, `integrate`), `integrate`, `autopack`, `exec`, `hooks`. **[partly built]**: the keys `formerly`, `areas`, `outputs`, `needs`, `container`, `mcp`, `jobs`, `rules`, `extensions` and `mounts` are part of the schema and are accepted and kept as written, but nothing reads them yet. **[planned]**: `repos[].dir` (without it `sync` has nowhere to clone a repo into the shell, so it comes with cloning).

Rules of the manifest:

- The manifest of a shared area holds no path of a computer. Where an area or a repo lies on a computer is in the registry and in the file of the computer (see below). Paths in `roles` are relative to the directory of the area and may not leave it.
- **An unknown key** is an error in `check` and a warning in ordinary work, with the nearest known name offered. Keys that start with `x-` are always allowed. **[built]**
- **The `exec` key** names the prefix with which a command of the project is run in its container. Mimir tells the agent the prefix in the header and enforces nothing by itself; the policy "run project commands only in the container" is the owner's rule (see A personal setup). **[built]**
- **Defaults of integration.** The top-level `integrate` concerns the repo of the area itself and is `push` when it is not written. A code repo listed in `repos` is `pr` unless it says otherwise; the key of the area does not reach it. `check` warns when an area says `integrate: push` and a repo does not state its own value. **[built]**
- **`autopack`** is off unless written. With it off, the end of a session only reminds that there is something to pack. Code repos are never packed; only files of knowledge are, only text files, and only up to a size limit (256 KB unless the file of the computer says otherwise under `commit: max-bytes`); binary files are never packed. **[partly built]**: the key and the limit exist, the `commit` command and the packing do not.
- **Secrets are never written in a manifest.** In `mcp.*.env`, `mcp.*.headers`, `mcp.*.args` and `rules.*.set`, the value of any key whose name matches `key`, `token`, `secret`, `pass` or `auth` (ignoring case) must be a reference of the form `${NAME}`. A literal value is a schema error with a fix. One shared function performs this check. **[planned]**

### Versions and compatibility

`mimir` is the version of the schema. `requires` is the minimal version of the program. The decision: there is no read-only mode for an older Mimir. An older Mimir that meets a manifest of a newer schema gives one warning (`SCHEMA_READ_ONLY`), reads what it knows, ignores what it does not know, and migrates nothing. The earlier draft described a read-only mode for this case; the owner decided against it for now, so a read-only mode is not part of the target. **[built]** Migration is only explicit (`area migrate`), is an ordinary write with provenance, and is **[planned]**. Whether an older Mimir should refuse writes into an area whose `requires` is above its version is **[undecided]** (see Open decisions).

### Fields only in the Desk

```yaml
places:
  outputs:
    purpose: "Valuable products to keep, by area and topic: screen captures, voice-over takes, renders, exports. Large files."
    when-missing: ask           # ask | stop | use | use:<other place>
  session-archive:
    purpose: "Archive of agent sessions"
attach:                         # external directories with a purpose
  repos-old: { purpose: "Old ~/repos during the migration", readonly: true }
links:                          # attachments of repos that the owner does not own
  - repo: https://github.com/acme/app-api.git
    area: acme/app            # the area it logically belongs to
mounts:                         # areas outside the Desk to clone (id to source)
  other: { url: "git@github.com:me/other-desk.git" }
aliases:                        # local aliases when ids collide
  acme-platform: { id: platform }
prefs:
  language: pl
  timezone: Europe/Warsaw
  hooks: { host-run: redirect, host-allow: ["node scripts/ok.mjs"], script-ban: on }
```

**[built]** for `places`, `attach`, `links`, `aliases` and `prefs.hooks`; `mounts` and the use of `language` and `timezone` are **[planned]**. These keys are validated only in the owner's Desk and ignored with a warning elsewhere.

`links` holds the attachment of a repo of a team to which a manifest cannot be added: the attachment lives on the owner's side and not in that repo.

`prefs.hooks` holds the switches of the hook blocks and the rules of the owner (see Session). Each switch is `on` or `off`, and a block is on unless a switch says otherwise.

### Outputs: the key and the place

Two things carry the name `outputs` and they are different. They are described here and nowhere else.

- **The place `outputs`** is a place with a purpose, a directory on a computer: the home of valuable products to keep, laid out as `<place>/<area>/<topic>/<name>`. The owner chose this name because not everything that is kept is a recording, and the first drafts used a narrower one. A Desk written with the narrower name (`recordings`) is renamed in a migration step; this sentence is the only place where that name appears.
- **The key `outputs` in a manifest** is the list of product classes of the area, each mapped to a destination in a place, for example `generated: place:outputs/acme/app`.

So the key says where the products of an area go, and the place says where on this computer that is. A product has one of two classes:

- **Reproducible**: it has a recipe next to it, in a file `<name>.recipe.yaml`, which says what it was made from (repo and version), by which command, from which inputs and when. It may be deleted at any time and made again.
- **Original**: it has no recipe, so it is an original and Mimir never deletes it automatically. Originals are saved as early as possible.

The recipe file is **[planned]**.

### topic.yaml

A topic lives in `<role topics>/<slug>/topic.yaml`. The slug is derived from the title and is the id of the topic in addresses. **[planned]**

```yaml
title: "2026-10-26: Description of the release process"   # always with a date prefix
status: active                  # active | paused | done
outcome: null                   # after the end: merged | kept | trial
formerly: []                    # earlier slugs after a rename
touches: [acme/app, acme/app:repo/app-web]
reads: []
tracks: null                    # for example JIRA-1234 or a URL
branches:                       # topic branches, in code repos and in areas
  - repo: mimir://acme/app:repo/app-web
  - repo: mimir://acme
driver: none                    # none | jarl | horde | <own>
```

- The **title** has the form `yyyy-mm-dd: Name written normally`. The date is the day the topic was made, and it keeps topics from turning into a heap.
- The **slug** is the date and the name reduced to the characters allowed in branch and directory names, for example `2026-10-26-description-of-the-release-process`. Polish letters are transliterated; spaces and colons become dashes. The topic branch in every repo has the name of the slug, with no prefix. A branch with that name that Mimir did not make is never written into; the new branch gets a suffix.
- A change of the title (`topic rename`) changes the slug and the directory, and the old slug goes to `formerly`.
- A topic is not tied to any tool of the loop: `driver` is optional, and Jarl is one possible driver.

### area.local.yaml

The same schema as `area.yaml`, ignored by git (an entry in `.git/info/exclude`). It may only override: `repos[].skip`, `repos[].branch`, `outputs`, `rules` and `integrate`. It cannot introduce new areas or change `id`. The restriction is a choice made by this specification. **[planned]**: the file is not read by the code yet.

### The home of Mimir on a computer

`init` asks nothing. The home is `~/.mimir/` (on Windows `%USERPROFILE%\.mimir\`), changeable with `MIMIR_HOME`.

```
~/.mimir/
  config            # file of the computer (YAML)
  registry.json     # the registry: what Mimir has and where
  bin/              # the pointer to the installed program (see Installation and tools)
  desk/             # the Desk, when Mimir made or cloned it
  areas/<id>/       # areas that Mimir made or cloned
  repos/<host>/<path>/   # code repos that Mimir cloned
  index/            # the search index
  cache/            # caches of resolution, of the registry and of the queue numbers
  sessions/         # session files and their journals
  locks/            # locks of jobs
  logs/             # logs of jobs and of the server
  tmp/              # temporary indexes made while building commits beside
  worktrees.json    # the record of worktrees
  write-state.json  # what Mimir remembers about the repos it writes to (for example a protected branch)
```

The layout below the home is a proposal that the owner accepted by not objecting; it is **[built]** except `repos/` and `logs/`, which come with cloning and jobs.

The `config` file:

```yaml
places:  { outputs: /Volumes/External/mimir/outputs, session-archive: /Volumes/External/mimir/archive }
attach:  { repos-old: ~/repos }
repos:                          # where a repo lies on this computer (url to path)
  https://github.com/acme/app-web.git: ~/repos/github.com/acme/app-web
clone-roots: [~/repos]          # where to look for existing clones before cloning
worktrees:                      # where worktrees of external repos go
  default: "{repo}/.worktrees"
  rules: []
rules: {}                       # rules of the computer (a layer of configuration)
hooks: { disk-guard: off }      # switches of the hook blocks; the config wins over the Desk
commit: { max-bytes: 262144 }   # largest file that is packed by itself
git: { lock-stale-ms: 30000 }   # time after which a lock that nobody renews is stale
pr-command: "gh pr create --head {branch} --base {base} --title {title} --body {body}"
serve: { port: 47100, bind: [127.0.0.1] }
tools:  { claude-code: { plugin: installed } }
```

**[built]** for `places`, `attach`, `repos`, `worktrees`, `hooks`, `commit`, `git`, `pr-command` and `serve`; `clone-roots` and `rules` are **[planned]**.

### Jobs

```yaml
jobs:
  acme-ingest:
    run: node jobs/acme-ingest.mjs       # invoked relative to the directory of the area
    writes: sources/acme/                # where it writes (a role or a place)
    incremental: true
    on: manual                             # manual | session-start
    state: repo                            # repo | local
    needs: [outputs]                       # required places
```

All of this is **[planned]**: the key `jobs` is accepted and kept, nothing runs it yet.

- **State.** A small file (`lastRun`, `cursor`, `result`, `host`). With `state: repo` it lives in `.mimir/state/<job>.json` in the repo of the area, is versioned and travels between computers. With `state: local` it lives in `~/.mimir/state/`. The default is `repo`, except for jobs with `on: session-start` and for the index, which are `local`. In an area that integrates by pull request the state of jobs is `local` by default, so that a job does not open a pull request at every run.
- **Disagreement of hosts.** When the state in the repo was written by another host since the last run, the job warns instead of silently overwriting.
- **Results.** After exit code 0 or 1 Mimir commits the state and the `writes` in one write with provenance, always on the main branch of the area.
- **Logs.** `<place job-logs or ~/.mimir/logs>/<area>/<job>/<timestamp>.log`, outside git.
- **Environment of a job.** `MIMIR_AREA`, `MIMIR_AREA_DIR`, `MIMIR_STATE`, `MIMIR_OUT`, `MIMIR_PLACE_<NAME>` and `MIMIR_PLACES` (JSON). A place name is upper-cased with `-` turned into `_`. `check` detects names that collide after this normalisation.
- **Exit codes.** 0 success, 1 partial (recorded in the state), 2 requirements missing (for example a place), 3 busy (the lock of the job).
- **Lock.** One run of a given job at a time on a computer; the lock lives in `~/.mimir/locks/` and expires like the lock of a repo.
- **Jobs with `on: session-start`** run in the background, with a time limit, never in the path of the start hook.
- Jobs are started from the portal, from the CLI or by an agent. The core has no schedule.

### Ignored entries

- **Worktrees.** `.worktrees/` goes to `.git/info/exclude` of the repo, never to `.gitignore`, so the repo of a team is not changed. **[built]**
- **Nested repos.** When a code repo or an area with a repo of its own lies inside the directory of another area (the `source/` of a shell is the usual case), Mimir adds that directory to the `.gitignore` of the parent in a block marked `# mimir:managed`. Hand-written entries are left alone. Where the nested repo lies outside the repo of the parent, nothing is added. **[planned]**

## Algorithms

### The registry: what Mimir has

Mimir keeps the list itself, because it makes, clones and attaches. The user registers nothing. **[built]** for attaching and creating; cloning is **[planned]**.

1. **Roots** are written by the commands `init`, `area create`, `area attach`, `repo attach` (and, when they exist, `area clone` and `repo clone`). An entry holds the id or the address, the path on this computer and the kind.
2. **Sub-areas** inside the repos of the roots are found by Mimir itself, by scanning the directory of the repo in depth and skipping the paths of code repos in the registry, `.worktrees/`, ignored directories and nested repos registered separately. So an area that a colleague added appears after a pull with no step in between.
3. **The cache** of the registry and of the scan lives in `~/.mimir/cache/`, keyed by the HEAD of the repo and the modification times of manifests. Commands that write, and `sync`, invalidate it. A damaged registry is recovered from its earlier copy with a warning (`REGISTRY_RECOVERED`); if there is no copy the error is `REGISTRY_BROKEN`.
4. **Identity of a repo** is its normalised address: the host of an ssh alias is resolved with `ssh -G`; a repo with no remote is known by its path and `doctor` says so. A repo that is already on the computer is attached where it lies, not cloned a second time. Before cloning a repo Mimir looks in `config: repos` and in the directories of `clone-roots`, comparing `origin`.
5. **`doctor`** shows manifests and repos found beside the registry but not in it, with the command that attaches them.

### Resolving the current area

1. Start from the directory of the session (or the path given with `--at`). In a container the path is translated by the client (see Session).
2. The **longest matching path prefix** in the registry names the resource: an area, a code repo or a worktree. The position of the parent directories is irrelevant.
3. A **worktree** is resolved like its repo and additionally as a worktree (with branch and topic, if there are any).
4. A **code repo** belongs to the area that declares it in `repos` or in `links` of the Desk. The current area is that area, and the context includes the repo.
5. The **parent** of an area is `parent` from the manifest. Without it, it is the area that contains it in the same repo, if any, and otherwise the Desk.
6. `overlays` (overlays on this area and on its ancestors) and `reads` are added to the chain.
7. Outside any registered path the context is the Desk.
8. **Errors.** Two areas with the same id give `AREA_ID_CONFLICT`. A cycle in `parent`, `overlays` or `reads` gives `AREA_CYCLE`. An unavailable parent or overlay is an `UNAVAILABLE` entry in the chain, not an error of the whole area.

**[built]** for steps 1 to 8 except that aliases are not resolved yet (the fix of a conflict is to change an id).

### Effective configuration

**[planned]**: the manifests are validated and read one by one today; the layers and the rules below are not applied yet. The owner decided that the rules engine is built in full, rather than reduced to a few fixed settings plus native git features. The reason: shared areas must be able to give defaults for identity, the pull-request command and places, and the owner must be able to override them locally with the origin of each value visible, and a general mechanism does this once for all kinds.

1. **Order of layers**, the later wins: (a) manifests from the Desk down to the current area, the closer one wins, with overlays right after the area they cover, in alphabetical order of id; (b) the owner's rules from the Desk (`rules` in the manifest of the Desk); (c) rules from the file of the computer; (d) `area.local.yaml` of the current area. The fields of the manifest of the Desk (for example `places`) belong to layer (a) like those of any ancestor, and its `rules` are layer (b). The reason for this order: a team gives defaults, and the owner can always override them locally.
2. **A rule** has `match` (a kind plus patterns of fields) and `set` (fields). Patterns are globs with named fragments `{name}` or `{name:glob}`; fragments may be inserted in `set`.
3. **One pass.** `match` looks at the values written in the manifests (layer a), not at the results of other rules. Rules do not chain.
4. **Reach of a rule**: the area in which it is declared and its descendants. Rules of the Desk and of the computer apply to everything.
5. **Conflict.** Two rules from the same file (the same level) setting the same field of the same resource are the error `RULE_CONFLICT`, with the addresses of both rules. Nothing decides it silently by being more exact or later. Between levels there is no conflict, because the later wins.
6. **Settable fields.** Every kind has a schema of fields marking which may be set by a rule (for example `repo.url`, `repo.branch`, `repo.identity`, `place.when-missing`). Another field in `set` is a `SCHEMA` error.
7. **`why`** lists for every field the sources from the final to the written one, each with the layer and an address.
8. Rules reach git through a provider: the kind `repo` has the provider `git`, which turns rules into git mechanisms (an address substitution, an identity by address, the configuration of one repo). The core does not know git addresses.

### Addresses

```
address = "mimir://" area-id [":" kind "/" name] ["@" version] ["#" anchor]
area-id = segment *("/" segment)        ; segment = [a-z0-9][a-z0-9-]*
kind    = [a-z][a-z0-9-]*
name    = a path or an identifier of the kind (may contain "/"), percent-encoded
version = a commit (pins the content)
anchor  = L<from>-L<to> | h=<heading> (file), m=<uuid> | from=<uuid>&to=<uuid> (session), <field> (others)
```

- **The address is the same for everyone**, because the area in it is the id from the manifest and not a directory.
- **The scheme `mimir://` is required in free text** (messages, the diary, documents, the portal). In commands and manifests a short name is enough, looked for from the current area upwards.
- **Encoding.** Characters outside the safe set are percent-encoded (RFC 3986, UTF-8); the displayed form may show Polish letters.
- **Stable anchors.** `#h=<heading>` survives an edit of the file. `@<commit>` pins the version. The diary and other long-lived records use pinned addresses.
- **Short form.** A kind needs a colon (`:repo/app-web`) or the flag `--kind`; without a colon the text is an area id.
- **A short name on a read** is looked for from the current area upwards. The first match wins, and a shadowing gives the warning `SHADOWED`. Several matches at one level give `AMBIGUOUS_ADDRESS`.
- **A short name on a write** (`write`, `move`, `delete`) must have exactly one match in the whole chain, or the answer is `AMBIGUOUS_ADDRESS`. Every answer carries the resolved full address.
- **A file belongs to the nearest area upwards.** Listing the files of an area stops at directories with an `area.yaml`, so a file has one address.
- **Aliases** apply to a prefix of ids (the whole sub-tree) and match by id and by path of the clone. The decision on aliases and content: Mimir never rewrites the stored content of a file, because a hash for `--if-match` and a patch must refer to the stored bytes. So an alias is translated only in arguments of commands, in the metadata of results and in the view of the portal; the hook of writes warns when a file of a shared area contains an address with a local alias. The earlier draft translated addresses inside the content in both directions; that cannot be reconciled with patches and hashes. **[planned]**
- The parser, resolution, `@version` and anchors are **[built]**; the part about aliases is **[planned]**.

### Places

`place:<name>/<path>` expands through `config: places`. A place has a marker file `.mimir-place` in its root, holding the name and a UUID that the config knows. A missing path, a missing marker or another UUID gives `UNAVAILABLE` with a reason such as "this is not that disk". On a write the `when-missing` of the place applies: `ask` returns an error with a question for a human (the code `PLACE_REQUIRED`), `stop` returns an error, `use` writes to a fallback directory, and `use:<other>` redirects to another place. A hook refuses a write into the folder of a place that is not there. **[built]** except the code `PLACE_REQUIRED`, which is **[planned]**.

Without the disk connected, the owner's place `outputs` asks whether a product may be written to `~/Generated/<area>/<topic>/<name>`.

### Cloning and attaching

`mimir area clone <url|id> [--as <alias>] [--record]`, `mimir repo clone <url|address>`, `mimir area attach <path>`, `mimir repo attach <path> [--area <id>]`.

1. `clone` first fetches only the manifest (shallow), to learn the id, the title and the needs.
2. **Where to put it.** First look for an existing clone (see the registry); if there is none, the default location is under `~/.mimir/` (`areas/<id>`, `repos/<host>/<path>`), or the directory given by `repos[].dir`; the path can be given with `--path`. Nothing asks about it. New clones of the repos of teams are made into the shell layout (see A personal setup).
3. **`attach`** attaches a directory where it lies, without moving it. For a repo that the owner does not own, the attachment goes to `links` in the Desk.
4. `--record` adds the area to `areas:` of the parent manifest as a write with provenance.
5. The command asks about places from `needs` that this computer lacks.
6. It prints where it cloned or what it attached.

**[built]** for `area attach`, `repo attach`, `area create` and `place mark`; cloning, `--record` and `repos[].dir` are **[planned]**.

### Sync

One meaning: `sync` clones the missing `areas` and `repos` of the current area (with `--deep` also the sub-areas), fetches everything, fast-forwards only clean checkouts that stand on their main branch, pushes the queue of Mimir's writes, opens the pull requests of session branches whose branch is on the remote, and reports: writes in the queue and open pull requests; topic branches behind which the main branch has moved on; orphaned worktrees; repos with a `pin` that have drifted (a warning only). `sync` never merges, rebases or checks out in a code repo. **[planned]** as a command; its parts exist inside the write layer.

### Freshness of the working branch

The core instructions for the agent contain this rule: before work on a topic branch, fetch and check that you work on current material; when the user says that something exists and it is not on the working branch, look at the main branch first and merge it if needed, instead of saying that it is not there. Mimir supplies data for it: the header and `context` show how far the main branch is ahead of the working branch. **[planned]**

### Lifecycle of an area

`area rename|move|remove|detach`. `rename` changes `id` and puts the old one in `formerly`; an address with the old id resolves with the warning `ADDRESS_MOVED` and the new address; `check` lists references to old and nonexistent ids in all areas. `move` moves the directory and updates the registry, the config and the managed block. `remove` removes the area from the computer and cleans the registry, the index and aliases; `detach` unregisters without deleting files. **[planned]**

## Commands

Every command prints one JSON envelope with `--json`:

```json
{ "ok": true, "data": {}, "next": "<cursor or null>",
  "warnings": [ { "code": "...", "message": "..." } ],
  "errors":   [ { "code": "...", "message": "...", "fix": "<command or null>" } ] }
```

### System

| Command | Input | Result | Status |
|---|---|---|---|
| `init` | `--from <url\|path>` (optional) | Desk, config | built |
| `install` | `--dev`, `--allow` | pointer, plugin, permissions | built (see Installation and tools) |
| `doctor` | | shortcomings, state of tools, places, unknown areas, orphaned worktrees | built |
| `context` | `--at` | current area, chain, repo, worktree, topic, shortcomings, state of branches | built (topic and branch state planned) |
| `serve` | `--port`, `--open` | local address | built (see Session) |
| `index` | | builds the search index | built |
| `cleanup`, `cleanup-apply` | | report and approved cleaning of scratchpads, worktrees, containers | built |
| `skills sync` | | links of the Desk's skills | built |
| `update`, `uninstall` | | | planned |

`init` without options makes a new Desk in `~/.mimir/desk/`. With `--from` it clones an existing Desk or attaches a directory in place.

### Browsing (read only)

| Command | Input | Result | Status |
|---|---|---|---|
| `ls <address>` | `--depth`, `--kind` | children with addresses and state | built |
| `read <address>` | `--from`, `--limit`, view | content in chunks, `next` for the rest | built |
| `find <pattern>` | `--scope` | addresses | built |
| `grep <pattern>` | `--scope`, `--regex`, `--context` | hits with address and anchor | built |
| `search <query>` | `--mode`, `--scope` | hits with a score, a level, an address and a fragment | built for words, exact and regex; filters `--since`, `--until`, `--kind`, `--level` planned |
| `show <address>` | `--why` | the resource | built; `--why` with layers planned |
| `follow <address>` | `--back` | links out, or back-references | planned |
| `resolve <address\|path>` | | a path, or an address | built |
| `log <address>` | `--limit` | changes with provenance (trailers) | planned |

**Units.** `read` counts in lines for `file` and in units of the kind for extensions (for example messages for `session`). The cursor holds a hash of the version, so when the content changes the answer carries the warning `STALE_CURSOR`. Every answer of `read` carries the hash of the version, for `--if-match`.

### Writing

| Command | Input | Effects | Status |
|---|---|---|---|
| `write <address>` | content or a patch, `--why` (required), `--if-match <hash>`, `--target`, `--branch-name`, `--dry-run` | a write by the protocol in Write protocol | built |
| `move <address> <address>` | `--why` | like `write`; between repos it is two writes with the same reason, not one atomic operation | planned |
| `delete <address>` | `--why` | like `write` | planned |
| `commit` | `--why`, paths (optional) | packs the agent's own changes in the current area | planned |
| `session pr` | | opens the pull requests of the session branches | built |

A **patch** is a list `{ "old": "...", "new": "..." }` with exact matching. Every `old` must occur exactly once, as in the editing tools of agents.

### Worktrees, topics and integration

| Command | Input | Effects | Status |
|---|---|---|---|
| `worktree open <repo\|area>` | `--slug`, `--issue <driver id>`, `--branch` | a worktree in the fixed place (see Worktrees); prints the path | built |
| `worktree close <address>` | `--force` | removes the worktree when nothing is lost | built |
| `worktree list` | | worktrees with their state (active, orphaned) | built |
| `topic start "<title>"` | `--in <addresses>` | a topic; optionally branches and worktrees in chosen repos | planned |
| `topic finish <address>` | `--outcome merged\|kept\|trial` | see Topics | planned |
| `topic rename`, `topic use` | | rename; choice of the topic of the session | planned |
| `integrate <address>` | | push or PR of a branch, by `integrate` | planned |
| `sync` | `--deep` | see Algorithms | planned |

Plain git operations (committing code, merge, rebase, log, diff) are done by the agent with git, in the path Mimir hands out.

### Resources and areas

`mimir <kind> list|show|add|remove|set|check|sync|actions` and `mimir <kind> <action> <address>` (for example `job run`, `mcp test`) are **[planned]**. `check` without a kind checks everything, and `check --portable` checks that a shared area is portable (see Tests); `check` is **[built]** for manifests, and `--portable` is **[planned]**. `check --portable --clean` clones into an empty home, runs `init --from`, `doctor`, `ls` and `search`, and is **[planned]**. Areas: `area create` and `area attach` and `repo attach` and `place mark` are **[built]**; `area clone|list|rename|move|remove|detach|migrate`, `repo clone` and `alias add` are **[planned]**. `container build` is **[planned]** (see Area elements). `hooks report`, a log of refusals and questions of the hooks, is **[planned]**; it exists so that the owner can see after a week of work which refusals were false.

### Common rules

- paging with a cursor, never silent truncation;
- every result has addresses;
- times are UTC ISO in JSON and local in the CLI for people;
- the result does not depend on the order of files in a directory (it is sorted).

## The MCP surface

MCP does not expose the whole table. It exposes a small, explicit set of tools, to match the short start of a session. The owner's decision is that the set contains a tool `action` for actions of extensions and jobs next to `context`, `search`, `read`, `workspace` and `write`. The final number of tools, and how the skills of areas reach the agent (a separate tool `skills`, or natively through the tool), are settled after the probes of the agent tools, with a budget for the schemas measured in agent scenarios. **[undecided]** for the skills route.

| Tool | Maps to | Status |
|---|---|---|
| `context` | `context` | built |
| `search` | `search`, `grep`, `find` (parameter `mode`: keyword, exact, regex, find) | built |
| `read` | `read`, `show`, `ls` (parameter `view`: content, ls, show); `follow` and `log` are added | built for content, ls and show |
| `workspace` | one command chosen by `action`: today `doctor`, `check`, `area-attach`, `repo-attach`, `area-create`, `place-mark`; the target adds the worktree and topic actions, `integrate` and `sync` | partly built |
| `write` | `write`, `move`, `delete`, `commit` | planned (the CLI `write` is built; MCP does not offer it yet) |
| `action` | `<kind> <action>` of extensions and jobs | planned; belongs with the runner of jobs |
| `skills` | list and content of area skills | undecided |

The tools of the server do not include `init`, `serve`, `update`, `uninstall` or the installation commands. Every call becomes the argv of the real command, always with `--json`, so the answer is the envelope of the CLI unchanged. The cost of the schemas in tokens is measured, kept as a constant in the tests, and every added tool changes the constant in the same change. The instructions of the server have a budget in tokens too; it is nearly used up, and raising it is a decision of the owner.

A tool refuses an action that does not exist and a field that the action does not take. A tool whose command writes says so in its description.

**Part b: the tool matrix of the four agent tools is reserved here** (see Reserved for part b).

## Write protocol

This chapter describes Mimir's own writes into areas. It is the part of the system with the highest risk of losing somebody's data, so it is described from the code that exists. **[built]** for the whole of `write`, including the queue, the push and the session branches; **[planned]** for topic branches and for `commit`.

### Where a write goes

1. **The repo** is the git repo in which the target file lies; the path must be inside the area and inside that repo.
2. **The branch.**
   - **A topic with a branch in this repo:** the write goes to the topic branch, in its worktree, and enters with the topic. **[planned]**
   - **Outside a topic:** the write goes to the main branch in the main checkout. The main checkout stands on the main branch and is in the middle of nothing (no merge, rebase or cherry-pick). When it stands on another branch because the user wants so, Mimir refuses with `WRONG_BRANCH` and the reason.
   - **Outside a topic, in a repo with `integrate: pr` or with a main branch that does not accept pushes:** a session that wrote something gets a branch named after the work done (the name is given by the agent, with no prefixes and without "mimir" in it, followed by a random suffix; Mimir never adds a commit to a branch that it did not make, even if the name is the same). The write goes onto that branch, which no checkout holds, so the checkout of the user is not touched; the pull request is made when the session ends. The owner decided that there is no catch-all topic of general fixes.
3. `--target` can send a write to the session branch whatever the repo says; `MIMIR_PUSH=off` makes Mimir send nothing, so commits wait on the computer as when there is no network.

### The lock

The lock lives in `$(git rev-parse --git-common-dir)/mimir.lock`, so there is one for all the worktrees of a repo. It is taken exclusively, holds its owner and a time, and is renewed every few seconds. It is taken over only after it has expired, never on the basis of a process id from another host. A write waits up to ten seconds, then gives `LOCKED`. The network (a fetch) is done outside the lock; the only network question asked with the lock held is whether the name of a new session branch is free on the remote.

### Steps

1. **Checks.** The address is a file of a registered area, the main checkout stands on its main branch, and the path is a literal path of a file (no pattern, no folder, nothing in `.git` or `.worktrees`).
2. **Fetch** with a short limit (ten seconds). With no network the answer carries the warning `OFFLINE` and the write goes on locally.
3. **Lock** (see above).
4. **Choice of the base.** Under the lock, the state of the branch against the remote chooses the commit to build on. The content is checked against `--if-match` (a hash of the version that `read` gave) or the patch; if the file changed since, the write gives `WRITE_CONFLICT` and writes nothing.
5. **The commit is built beside the checkout, not in it.** Mimir reads the tree of the base into a temporary index of its own (in `~/.mimir/tmp`, never the index of the repo), stores the new content as an object, sets it in that index at the path with the mode the file already has, writes the tree and makes the commit whose parent is the base. Until now nothing in the repo has changed but its objects. The reason for this design: Mimir writes into repos where people and other sessions work, so it must never change their files in order to make a commit. A method that rebases or stashes in the user's tree leaves conflict markers in files that are being edited, and a method that commits named paths from the disk takes the user's unsaved edits with it. The subject of the commit is `<area id>: <reason>`, at most 72 characters, and the trailers are:
   ```
   <area id>: <short description>

   Mimir-Session: <session id>                   (if there is one)
   Mimir-Topic: mimir://<area>:topic/<slug>      (if there is one)
   Mimir-Why: <reason>
   ```
   The session trailer holds the session id alone, with no address of the Desk, because other people read a shared repo.
6. **The checkout is brought in line, and no further.**
   - An interrupted write is finished or undone first, from a small record of intent that is kept while the steps run; so a process that dies in the middle leaves a state the next write mends.
   - The index of the checkout is set for the written paths only, so `git status` does not show the write as a change back. A lock on the index that stays gives `GIT_BUSY` with nothing written.
   - The branch is moved to the new commit with a compare-and-swap (the old value is always given), so a branch that somebody else moved meanwhile is never overwritten.
   - The file in the work tree is replaced only if the user has not touched it. A file with changes of the user is not written over and the write gives `WRITE_CONFLICT`, unless it already holds the content to be written. The file is read again just before it is replaced; if the user saved it meanwhile, the branch and the index go back and the write is refused.
   - When the branch moves to a commit that is more than Mimir's own (the base was the remote branch), the checkout follows it by a fast-forward that never lets git set aside the user's edits. When git would not do it, the branch stays where it was, the commit is kept in a ref of Mimir's (`refs/mimir/queue/<branch>`), and the answer carries `STALE_CHECKOUT`.
7. **Push** (see below), after the lock is released.

### Push

- Only Mimir's commits are sent, never one the user made and has not pushed; they are made again on the tip of the remote in memory, one after another, and the push names the commit by its full id. A commit whose change is already on the remote (a squash merge took it, the user rebased it) is dropped from the chain.
- **Success:** done.
- **Rejected because somebody was faster (non-fast-forward):** the remote is fetched and one more attempt is made. A commit that does not apply to the remote is a conflict: it goes onto a branch of its own with a report, and the rest goes on; a queue with a conflict never blocks the repo.
- **Rejected because the branch is protected:** the code `PUSH_PROTECTED`. This is not a conflict and is not retried. The commits of the session move to the session branch with a pull request, the local main branch goes back to the remote's state, and Mimir remembers on this computer that the branch is protected, so later writes go straight to the session branch.
- **No network:** the commit waits in the queue.

### Integration: push or pull request

- `integrate: push` (the default for the repo of an area): a write lands on the main branch by push.
- `integrate: pr`: Mimir pushes the branch and opens a pull request through the command of the file of the computer (`pr-command`, with `{branch}`, `{base}`, `{title}` and `{body}`), which a rule of the Desk can also set, because the firm's logins of `gh` and `az` may live in a tools container and not on the host; or through the native tool of the host (`gh`, `az`, `glab`) when it is present and logged in; or Mimir prints the link that opens the pull request. When the command fails, the branch stays pushed and the answer carries `PR_FAILED` with the link.
- **Writes to shared areas of a team enter through pull requests, one pull request per topic by default**, opened the way anyone would open one. The owner decided not to design collective daily pull requests or a pull request for every session as the default; what remains for the rest is: integration is declared per area and per repo, a pull request is forced where the area declares it, and a session branch is used when the main branch is protected. The reason: a pull request per session floods colleagues, and a daily batch is machinery that nobody asked for.
- The session branch gets its pull request at the end of the session (the end hook, where the tool has one), and at the latest at the next `sync`. The header shows open pull requests of writes.
- The user is never asked about push or a pull request.

### The queue

The queue is computed from git and from nothing else: the commits on the branch (or kept for a checkout that could not follow) that carry the trailer `Mimir-Why` and are not on the remote. It is therefore right after a plain `git pull --rebase`, a fetch, a squash merge on the host, and a clone on another computer. The numbers that a hook shows are kept in `cache/queue.json` by every write, push and `sync`, so a hook starts no git. `sync` and every next write into the repo try to push the queue.

### Writes by the agent's own tools

- **A write into an area other than the current one** goes through Mimir: the hook refuses the agent's ordinary tool with a hint to use `write`. This applies only to knowledge files of an area other than the current one; it does not apply to code repos, to worktrees, to areas that the current topic lists in `touches`, to `.temp`, or to hidden directories. **[built]**
- **In the current area** the agent writes with its own tools. `commit` packs those changes with provenance. The list of paths comes from the journal of hooks, which records the tools used in this session; where there is no journal (a tool without hooks, changes made through a shell), explicit paths are required. **[partly built]**: the journal exists; `commit` does not.
- **Without asking the user:** unpacked changes of the agent in an area are packed at the end of a session and at `topic finish` when the area has `autopack: true`; otherwise the end of the session only reminds. Only text knowledge files are packed, up to the size limit, and never binary files. **[planned]**

### Provenance of code commits

Code commits that the agent makes with plain git (session, topic, reason) are recorded in a local ledger or in git notes (`refs/notes/mimir`, which Mimir never pushes), filled by a hook of the local clone or by a hook after the `git commit` command. The history of the repo of a team stays untouched, and there are no trailers in code commits. Writes of Mimir into areas keep their trailers. The owner chose this over trailers in code commits and over provenance of knowledge only. The reason: provenance is a goal of the whole system, and code is the largest part of the work, but a team did not agree to anything in its history. Which of the two stores is used is decided in the build and recorded. **[planned]**

## Worktrees

### Place

A worktree always lies in one place:

- **Default:** `<repo>/.worktrees/<slug>`, or `<repo>/.worktrees/<driver id>_<slug>` for work led by an issue of a loop tool (Jarl is the driver that exists). `.worktrees/` is in `.git/info/exclude`.
- **External repos:** the place is configured separately in `config: worktrees`, for example when a repo of a team may not have a directory inside it.
- Worktrees stay inside the repo of the code and not outside it. The cost is that tools that read the whole tree (`docker build`, linters) see them; `doctor` checks `.dockerignore` and the configuration of linters. **[planned]** for the `doctor` check.

### Commands

`worktree open` fetches the remote (outside the lock; no network is a warning and the branch then starts from the main branch as the computer last saw it), then, under the lock of the repo, picks a folder and a branch such that nothing that exists is reused (a taken name gets `-2`, `-3` and the warning `BRANCH_EXISTS`; a taken `--branch` is `BRANCH_EXISTS` and nothing is made), adds the place to the exclusion file, makes the worktree with a branch that tracks nothing, records it in `worktrees.json`, and prints the path. Nothing in the main checkout is touched. The agent then works there with plain git. `worktree close` removes the worktree and the local branch only when nothing is lost (the branch is merged or pushed); otherwise it refuses with the reason (`WORKTREE_DIRTY`, `BRANCH_UNMERGED`) unless `--force`. **[built]**

### Tidying

Hooks and `doctor` report tidying matters to the agent: an **orphaned worktree** (its branch is merged, its topic is finished, or its loop issue is closed; when the driver is Jarl, Mimir asks Jarl for the status), a **worktree outside the fixed place**, and a **topic branch** behind which the main branch has moved far. The report says what is wrong and which command tidies it. Mimir removes nothing by itself. **[built]** for worktrees; topic branches **[planned]**.

### Worktrees in a container

A worktree made on the host has a host path in its `.git`, which a devcontainer does not have. Two ways are possible: mount the repo in the container under the same path as on the host, or use the relative worktree paths of git 2.48 and later. `doctor` detects a broken `gitdir`. **[planned]**

## Topics

**[planned]** as a whole: there is no `topic` command in the code yet. The decisions below are firm.

### Principle

A topic is a theme of work that develops the whole workspace: the Desk and the areas. A topic that is not pulled into the main branch may, but need not, mean a loss: sometimes it is enough to extract the lesson, sometimes the work must be merged.

### Branches

- **Topic branches are allowed in every area and every code repo, including areas of knowledge, but they are optional ("may, need not").** The owner chose this over limiting branches to code repos. The reason: a team that puts everything behind a pull request wants a topic branch also in an area of knowledge, and the others lose nothing when it is optional.
- As a rule, the work of a topic enters through a pull request. Any area or repo can force pull requests with `integrate: pr`; this depends on the area.
- `topic start --in <addresses>` makes a topic branch (named by the slug) and a worktree only in the named repos and areas, not always in all of them. Two themes are two worktrees and two sessions in parallel. General fixes outside a topic go to the main branch (see Write protocol).
- **The state of a topic is on the main branch and its content on the branch.** `topic.yaml` always lies on the main branch of the area, so other sessions, the portal and `ls` see the topic, and dropping a topic does not delete its state. The content of the work lies on the topic branch in its worktree; `read` and search in the session of that topic read the version from the topic branch, so that after a write the session does not read old content (the hash for `--if-match` comes from the same version). A write in a topic session has an explicit target (main or topic), so moving knowledge to the main branch at the end has a way. A topic covers only the areas it names; writes to other areas of the same repo go to the main branch and not to the topic branch.
- **Where the topic lives** depends on where it should go, and the agent asks the user when the topic is made. Three cases: shared in an area, on the main branch and visible to others; in an area on its own branch, when it evolves (it enters at the end); or only local in the Desk. The code of a topic goes on a branch in the repo of the project in any case, products go to places, and drafts and mirrors go to the private part of the Desk or an overlay.
- **A pair of branches (code and shell).** The field `repo` of `branches` names a git repo and not an area. For a change of architecture a topic can keep two branches of the same name, one in the code repo and one in the shell; `check` and the portal show the state of the pair, and a job warns when the code was merged and the shell was not. `check` warns when several areas share one repo. The disagreement is found with `git cherry` and patch ids, which covers a squash merge, and optionally through the API of the hosting with the native login. The pair of branches waits for one measurement (whether Yggdrasil sees changes in a nested code repo; see Open decisions).

### The end of a topic

`topic finish` is a sequence in which some steps are done by the agent and some by Mimir. The core works without an agent; the end of a topic is the place where it needs one, because only an agent can judge what knowledge is worth moving.

1. **The agent** always moves the knowledge of the topic onto the main branch of the area, as writes with provenance and an explicit target (see Write protocol). For the outcome `merged` the knowledge enters together with the branch.
2. **The agent** asks the user one question in plain words: "does this stay in the shared materials, is it a one-off result to keep, or was it a trial?". This is a question about the work, not about git, and it comes before any integration.
3. **Mimir**, according to the answer given as `--outcome`:
   - `merged`: the branches of the topic are integrated (push or pull request, see Write protocol);
   - `kept`: the result stays without being merged; the branch stays pushed and marked as kept, and the worktree is closed;
   - `trial`: the branches and worktrees are closed and only the moved knowledge remains.
4. **Mimir** sets `status: done` and the `outcome` in `topic.yaml`. Finished topics have a lower weight in search, and `ls` skips them by default.

Mimir cannot check that step 1 happened. The command takes the outcome as an argument and records whether the knowledge step was declared done or explicitly skipped; the names of the flags are decided in the build.

## Session

### Header

Injected at the start of a session (the start hook, or the instructions of the MCP server, depending on the tool). At most about six lines, with titles for people. **[built]** for Claude Code, except where the text says otherwise.

```
Mimir: area "App" (acme/app; project; shared). Chain: acme/app > acme > desk-me.
Missing: place outputs (the disk is not connected); when missing: ask the user before writing a product.
Waiting: 2 writes not pushed, 1 pull request of writes open.
Topic "2026-10-26: Description of the release process": the main branch is 3 changes ahead.
Rules of order and the scratchpad of this session.
Look: knowledge: search; code: grep. Where am I: mimir context.
```

- Lines appear only when they have something to say. The numbers of the queue come from the cache that the last write left, because the hook starts no git. The line about the topic and the distance of the branch is **[planned]**, as are the lines for jobs and for the age of the archive; extensions add lines through their own interface (see Extensions).
- The line about searching depends on the context: in a code repo it says "knowledge: search; code: grep", elsewhere "before grep, use search".
- In a folder that Mimir does not know, the header has three lines: that the folder is not known so its area and `.temp` rules do not apply, the path of the CLI, and how to look.
- If the area declares `exec`, a line "run: <prefix> <command>" is added.
- Mimir's CLI is given by its absolute path, because `mimir` is not necessarily on `PATH` (the installer is to put it there; see Installation and tools).
- **The language of the header follows `prefs.language` of the Desk.** This is a requirement of the target. Today the header is in English whatever the setting says, so it is not met yet; changing the code of the header is a separate piece of work to be done after the owner decides how the other texts of Mimir should follow the language (see Open decisions). **[planned]**

### The dispatcher hook

One hook in each tool that supports hooks. On every event it (1) works out the context (from a cache keyed by cwd and the modification times of manifests), (2) runs the hooks of the core, (3) runs the hooks of areas in the chain, from the Desk down to the current area. **[built]** for core hooks; hooks of areas are **[planned]** and are only declared by the key `hooks` for the switches of blocks today.

Rules:

- **Budget.** The whole hook has a goal of p95 below 100 ms without area hooks; the test holds a looser limit and the measured time is printed. A hook of an area has a time limit (about two seconds).
- **Combining.** The first refusal ends the pass and carries the reason for the agent.
- **A failure of the hook** (an exception, a timeout, a damaged registry) lets the call through with a warning for the agent. Therefore the hooks are barriers, not guarantees: the owner can switch them off, and a shell command is read heuristically (`sed -i`, `>`, `tee` may get round a block). The description says so openly.
- **Switches.** Besides `MIMIR_HOOKS=off`, which switches all blocks off, each block has its own switch (`temp-block`, `script-ban`, `disk-guard`, `places-guard`, `cross-area-write`), set under `prefs.hooks` of the Desk or `hooks` in the config of the computer (the config wins), and, for blocks whose reach is an area, in `hooks` of its `area.yaml`. A false refusal is not an accident to be endured: the log of refusals and questions makes it visible.
- **Protection of the barriers.** The file `~/.mimir/config` and the files of the plugin should be protected against a write by the agent's own tools. **[planned]**
- The events: SessionStart, SessionEnd, PreToolUse and PostToolUse for Claude Code. **[built]**

| Event of Mimir | Claude Code | Copilot | Codex | Cursor |
|---|---|---|---|---|
| start of a session | SessionStart | undecided | undecided | undecided |
| before a write | PreToolUse (Write, Edit, MultiEdit, NotebookEdit) | undecided | undecided | undecided |
| before a command | PreToolUse (Bash) | undecided | undecided | undecided |
| after a tool | PostToolUse | undecided | undecided | undecided |
| end of a session | SessionEnd | undecided | undecided | undecided |

The three other columns come from probes of the real tools, which need the owner's consent for accounts and costs (see Open decisions). Guarantees that depend on hooks apply only in tools that have hooks; where hooks are lacking, Mimir says so in `doctor` and works in a degraded mode (see Installation and tools).

### Instructions

The short rules of the core (this chapter's freshness rule, the rule for the agent's own writes, where files go) reach the agent through the instructions of the MCP server, or, if the tool does not support them, through the tool's global instruction files. **[partly built]** for Claude Code.

The core's text for the agent says where files go: text that the owner will read later goes to a topic or to the knowledge of an area, products go to places, and working files go to the scratchpad of the tool and never to `.temp` in a repo. Some repos carry a contrary instruction in their agent file (a standard harness tells the agent to write to `.temp`). Where Mimir knows such a repo, the header states in one sentence which rule holds. The source of the contradiction is the template of the harness, which must be changed to point to the scratchpad or to a directory of the session; until then the sentence in the header is the remedy. For tools without a scratchpad (the others of the four), the header names a directory of the session, `~/.mimir/scratch/<session>`, which the cleaner removes after some days. **[planned]**

### Container

**This mode is deferred until the first real user needs it.** The owner decided so, after a review. The owner's main mode does not depend on it: the session runs on the host, and the commands of the project run in the devcontainer of the project. The mode "the agent in a container connects to the Mimir of the host" (MCP over HTTP, a thin hook client) stays in the design, but is not built now. The reason: the whole machinery (a token, a client, a translation of paths) would serve a mode that nobody uses yet, and it opens the host to the place where foreign packages run.

When it is built it works like this, and these rules are fixed in advance:

- **Host.** `mimir serve` exposes MCP over HTTP and an API for the client. The Desk, the registry, the index, the locks and the writes live on the host only.
- **Container.** The tool of the agent connects to the MCP of the host (`host.docker.internal` or the address of the bridge). The hooks in the container are a thin client (the same package in a mode `MIMIR_REMOTE=<url>`) that forwards the event to the host.
- **Paths.** The client translates only the working directory and the workspace directory, using the pair `workspaceFolder` and `localWorkspaceFolder` of the devcontainer. No other path of the host is translated, so in this mode `context` and `resolve` give no path of a file of the host (a path that does not exist in the container would only make the agent's read fail); they say "use `read`".
- **Token.** Required. It is limited to the chain of areas of the workspace of the container, it is read-only by default, and it permits no administrative actions over HTTP, so a script run by a package in the container cannot read the whole Desk or write into any area. It reaches the container through an environment variable or a mounted file.

### Session id and the current topic

**[built]** for the id, the file and `MIMIR_SESSION`; the topic is **[planned]**.

- The start hook writes `~/.mimir/sessions/<id>.json` with the id, the tool, the cwd and the topic. Where the tool allows a hook to set the environment of the agent's commands (Claude Code does, through a file of `export` lines), it sets `MIMIR_SESSION`. A session that starts again (resume, clear, compact) reopens its file, and sessions of the same folder that never ended and have been idle for some hours are closed as superseded.
- The CLI and MCP take the id from `MIMIR_SESSION`, and second from matching the cwd with a session file. Two candidates give `AMBIGUOUS_SESSION`.
- An id is 1 to 100 letters, digits, `_` and `-`, and not a name Windows reserves for a device. File names are made from it by a stem that stays different for different ids on disks that ignore case.
- The current topic follows from the worktree of a topic or from `topic use`.
- No id or no topic means no trailer, with no guessing.

### The server: portal and MCP over HTTP

One server, `mimir serve`, serves the portal and, once the container mode is built, MCP over HTTP and the API of the client. **[built]** for the server and its read-only API.

Security is kept as it is. The owner closed the hardening of the server at the level that exists: a token always required (in the portal in a cookie set by `--open`, in an API in a header), checks of `Host` and `Origin`, no CORS, actions that change state only by POST with a token from a page of the server, sanitised markdown with a restrictive CSP, and listening on `127.0.0.1` (and the bridge address when `serve.bind` names it). Further remarks on the security of the server are taken only if they break work or lose data; the reviewers work with the calibration "a trusted environment of a developer". The token is a file with mode 0600 in the Mimir home.

The views of the portal, in this order: search, browsing and reading, the reader of sessions and the diary (views of the `session` extension), topics with the state of their branches, jobs, the state of the computer, diagnostics. The portal only shows and starts jobs; its only action is `job run`, and it is the only button on all systems, with no menu-bar item and no tray icon. A first page of the portal exists; the views are **[planned]**. The accessibility of the portal (axe without critical errors, full keyboard control, AA contrast in both themes) is a requirement of its acceptance.

## Search and index

- **Location.** `~/.mimir/index/`, local to the computer. **[built]**
- **Scope.** All text files of the roles `knowledge`, `topics` and `sources` of all available areas, attachments, and the content of kinds from extensions (for example `session`). Binary files, code repos (code has its own tools), worktrees and ignored directories are skipped. The index of a mounted copy of the code is not made: an attached `~/repos` does not pull code into the index. The index sees files of every area, and so a search from one client's area can return content from another's; whether the default scope should be limited to the chain of the current area is **[undecided]**.
- **Incremental.** By content hash and by the times of files and folders. The index is brought up to date in steps (what may have changed, the plan, then applying it in one transaction with a deadline). The job `index` (`on: session-start`, `state: local`, in the background) and a full rebuild on demand. **[built]** for the index and `mimir index`; the job form is **[planned]**.
- **Fragments with metadata:** an address with an anchor, area, kind, level (`curated` for knowledge and topics, `generated` for summaries, ingests and sources), time, topic status.
- **Ranking.** Today words: full-text search through SQLite FTS5 in `node:sqlite`, with folding of diacritics (Polish letters included), the last word of a query taken as a prefix, `bm25` scoring, a boost for `curated` fragments and a boost for areas in the current chain **[built]**; Polish inflection (word forms) is **[planned]**. The target is a hybrid of words and meaning; `curated` before `generated` at a similar score; finished topics lower. A generated map of the knowledge of each area (headings, main concepts, recent changes) that the header points to is a cheap complement to be considered before embeddings. **[planned]**
- **Concurrency.** One writer (the process of the host) and reads that do not block (WAL). A container does not write the index; it asks the host.
- **The engine of search by meaning is undecided.** The requirements: incremental work at about 14 GB of sessions a month, one writer with reads that do not block, work on three systems, an installation that needs no compiler on the user's computer. The planner's recommendation is an adapter over SQLite with FTS5, vectors stored as blobs, and providers Ollama or onnx; the choice is made after a benchmark on the owner's real data (a set of questions on which grep fails, with a judgement of relevance, on a pinned copy of the corpus). Thresholds proposed for the benchmark: the top five hits no worse than the baseline, p95 of a query at most twice the baseline, the index at most three times the corpus.
- **Filters** `--since`, `--until`, `--kind`, `--level` are **[planned]**; they are needed to find raw material for films.
- **A ready-made index of an area:** an optional file in the repo of the area built by CI; import skips fragments changed locally. **[planned]**

## Area elements

### Hooks of an area

Modules in the role `hooks`, run by the dispatcher hook (see Session). **[planned]**

### Jobs

See Files and schemas. **[planned]**

### MCP of an area

MCP servers from `area.yaml: mcp` are given to the tool when the session is in that area, in the form of a generated configuration of the tool with a prefix, with secrets only as `${NAME}` references. The route (registered in the tools with a prefix, or passed through the MCP of Mimir) is **[undecided]** until the probes. Atlassian of the company and a local speech app are the first users. Whether Atlassian runs on the host or in a container is also **[undecided]**. **[planned]**

### Skills of an area

Skills of the Desk are linked into the skills directory of Claude Code as `mimir-desk-<name>` by `mimir skills sync`; `doctor` and the header report links that are out of date. **[built]** for the Desk. The target: skills of every area in the chain are available from any place, natively in Claude Code, named `<area>:<skill>`, with the nearer area shadowing a skill of the same name and `why` showing it; copies have a manifest that `sync` and `doctor` reconcile, and they go away with the area. For tools without this route, MCP is the degraded variant. **[planned]**

### The layered container of a shell

The devcontainer specification has no inheritance, so `mimir container build` generates `.mimir/devcontainer/devcontainer.json` from `base` and `features`. The command is in the target scope. The rules of merging: lists are added, scalars of the shell win, and a conflict is shown with `why`. A job warns when the base of the team changes. The container of a shell mounts only the output directory of its area, so renders go from the container straight to the disk of the place and do not pass through the repo or the internal disk. A container with no `base` is made from the `features` alone. Containers and volumes get names derived from the area, so two worktrees of the same repo get the same volume names (otherwise every worktree gets a new set of packages, which is the pain this removes). **[planned]**

## Extensions

A JS module named in `area.yaml: extensions`, loaded with trust in the cloned area (see Scope and principles):

```js
export default {
  apiVersion: 1,
  kinds: {
    session: {
      list(scope, opts) {},          // resources with addresses
      read(address, range, view) {}, // content in chunks
      grep(pattern, scope, opts) {}, // hits with anchors
      chunks(address) {},            // fragments for the index, with metadata
      actions: { },                  // for example "replay"
      anchors: "m=<uuid>|from=<uuid>&to=<uuid>"
    }
  },
  header(ctx) {},                    // header lines (at most one or two)
  doctor(ctx) {},                    // problems with a repair command
  portal: { views: [] }              // views that render the data of the kind
}
```

The core gives kinds from extensions addresses, `ls`, `read`, `grep`, `search`, `follow`, the portal, and the "unavailable" states. An extension cannot change the behaviour of core kinds. Mimir refuses an extension with an unknown `apiVersion`. **[planned]**: the key `extensions` is accepted and nothing loads a module yet.

**Where the code lives.** The code of the owner's rules of order (the ban on throwaway scripts, the guard of the disk, the `.temp` block and the host-run rule) lives as a module in the Mimir repo, outside the core, in the directory `extensions/owner-guards` with its own tests and fixtures, and is loaded only when the owner's Desk switches it on. The core imports nothing from it. The owner chose this over code in the Desk and over a separate repo. The reason: the code is tested and versioned together with the core it plugs into, and other users do not receive it. The same pattern is provisionally assumed for the owner's other extensions (the session archive, the diary, the ingest), to be confirmed by the owner when they are built; the recommended name of the directory for them is `owner-setup/`. **[undecided]**

**Today** the ban on scripts, the guard of the disk, the `.temp` block and the host-run rule are inside the core (`src/hooks`) and are on by default. Moving them out of the core is **[planned]**; until it is done the statement "the core ships none of them" is not yet true of the code. What the core keeps is the mechanism: the dispatcher of hooks, the header at the start of a session, the session marker, hooks of areas with a time limit and the rule of letting a call through on an error. The reason for this split: the ban on scripts exists because of the way the owner approves commands, and the threshold of the disk because of the owner's disk; a new user with 12 GB free would get a refusal of every write right after installing.

**Requirements for the owner's extensions** (session archive, the diary):

- The archive covers only Claude Code, works on demand and fetches the whole backlog. It is steered by a script, not by an agent. The owner watches the retention of Claude Code sessions and the rebuilds of containers; Mimir does not mount `~/.claude/projects`, does not change `cleanupPeriodDays` and does not archive automatically before a rebuild. The archive reads a list of source directories (the Mac, containers including stopped ones, and another computer over SSH), not a single directory.
- A day of the diary has `generated-hash` and `sources` (sessions with their number of messages) in its front matter, and the model and the version of the prompt used. When the hash does not match because a day was corrected by hand, the new content goes to `<day>.addendum.md`. A day is counted in the time zone of `prefs.timezone`, and a message belongs to the day of its timestamp. Links in the diary are pinned. For a kind without git such as `session`, the pin `@` is a prefix of the sha-256 of the archive file at the time the day was generated; reading with another hash returns the message with a warning (the archive is only appended to, so message ids stay valid).
- The facts are drawn from the messages by Claude Haiku 5.5 in chunks under 100 thousand tokens; the day is written by Haiku or Sonnet 5.5. The comparison of models on two or three real days happens only when real sessions are imported, not during the build; the build delivers a replaceable model and a test on synthetic data. The model is called through the owner's own login of the tool, with an API key as a variant; the diary has a dry run that estimates tokens, and a limit in the config.

## Errors

Every error and every warning has a code, a message and a fix. The envelope carries them (see Commands). The code is the same wherever it is raised; whether it is an error or a warning depends on the place (for example `SCHEMA` is an error in `check` and a warning in ordinary work). Every code used in the source is declared in one place, with its usual level, its meaning and a template of the fix, and a test fails on a code that is not declared. A fix is never half a sentence: a template with an open placeholder is refused. **[built]**

The codes that exist span the registry and the resolution (`NO_DESK`, `AREA_NOT_FOUND`, `AREA_ID_CONFLICT`, `AREA_CYCLE`, `AMBIGUOUS_ADDRESS`, `ADDRESS_MOVED`, `SHADOWED`, `UNAVAILABLE`, `SCHEMA`, `SCHEMA_READ_ONLY`, `REGISTRY_BROKEN`, `REGISTRY_RECOVERED`), the arguments (`BAD_ARGS`, `BAD_ADDRESS`, `USAGE`, `NOT_FOUND`), the index (`INDEX_MISSING`, `INDEX_STALE`), the server (`UNAUTHORIZED`, `FORBIDDEN`, `METHOD_NOT_ALLOWED`, `TOO_LARGE`, `TRUNCATED`), and the write layer (`LOCKED`, `GIT_BUSY`, `WRONG_BRANCH`, `WRITE_CONFLICT`, `PUSH_PROTECTED`, `OFFLINE`, `STALE_WORKTREE`, `STALE_CHECKOUT`, `REMOTE_AUTH`, `NO_PERMISSION`, `MERGE_CONFLICT`, `TOPIC_DIRTY`, `WORKTREE_DIRTY`, `BRANCH_UNMERGED`, `BRANCH_EXISTS`, `PR_FAILED`, `AMBIGUOUS_SESSION`), and a few more for the repos and the computer. Named in this specification but not yet declared: `RULE_CONFLICT`, `PLACE_REQUIRED` and `BACKUP_MISSING`. `NOT_PORTABLE` is declared and raised by `doctor` for names that differ only in case.

**Part b: the complete error table (each code with its meaning, its fix, where it is raised, and a test that holds the table and the code to each other in both directions) is reserved here** (see Reserved for part b).

## Installation and tools

### Installation

Mimir is an ordinary npm package (`@chrisdudek/mimir`). Installing, updating and uninstalling the program go through npm, with no directory of versions and no update mechanism of Mimir's own.

- `mimir install` makes a pointer, `~/.mimir/bin/mimir`, with the absolute path to Node and to the installed package. It is the only file of Mimir outside the data under `~/.mimir`. Plugins, hooks and the MCP configuration of tools call the pointer by an absolute path, with no `npx` and without relying on `PATH` (the `PATH` of graphical applications and the Node version of nvm differ from those of the shell).
- After an update of the package or a change of the Node version, `mimir install` makes the pointer again, and `doctor` reports a pointer that points at nothing.
- `install` also renders the plugin for Claude Code from a template into the Mimir home (which is also a local marketplace), and with `--allow` writes permission rules into the settings of Claude Code: the default profile is "trusted", which allows all the MCP tools of Mimir (including `write` and `workspace`) beside read-only Bash rules; the narrow profile (`context`, `read`, `search`) needs an explicit option. Without `--allow` the rules are printed and no settings file is touched. It prints the commands that add the plugin and does not run them.
- In the first build `mimir install --dev` points the pointer at the code in the repo. Publication to npm is a separate step after the owner's word.
- The plugin and the CLI check the version of the protocol. On a mismatch the hook lets the call through and warns.
- **Planned:** `uninstall` (removes the plugin and the pointer and, with confirmation, `~/.mimir`; the package itself is removed by npm), the repair of `PATH` (`mimir` on `PATH` for bash, zsh, fish and PowerShell), and the one-command start (a clean home and an npm prefix, one `mimir init` after installing the tarball makes the Desk, the pointer and the plugins of detected tools). The pointer must never point at the cache of `npx`.

### The four tools

The plugin is packed according to the scheme of the author's earlier plugins (a manifest for each tool). `init` detects the tools and installs. Parity between the tools is not assumed: after the probes of the real tools (their hooks, MCP, skills, instruction files and cwd), this specification gets a table of what works in which tool and a description of the degraded mode for what is lacking, and the guarantees move from hooks to MCP and the CLI where the tool has no hooks. **[built]** for Claude Code; **[planned]** for Copilot, Codex and Cursor, in the degraded mode first.

Agents in the cloud (the Copilot coding agent, Codex cloud, Claude Code on the web) cannot reach a local Desk. A snapshot of an area written in a form that matches `AGENTS.md` could serve them; the table of tools would then say "cloud: snapshot only". **[undecided]**

Probes of the tools run in a test container, without a model. A probe that needs the network is skipped with a reason when there is none, and the table can be built from data without the probes. The probes of real accounts need the owner's consent (see Open decisions). Scenarios with a model are run only on the owner's word, because of their cost.

## Systems

- Paths are `/` inside, and the conversion happens at the border with the system. On Windows: long paths and drive letters.
- File systems that do not tell case apart (macOS, Windows): collisions of file names in addresses are detected by `check` and `doctor` (`NOT_PORTABLE`). **[built]** for `doctor`.
- Line endings: a write keeps the style of the file or `.gitattributes` (the content is stored through the filters of the repo for that path).
- Symbolic links: Mimir does not follow them out of an area without `attach`; a write never goes through a link.
- Windows: retries of an atomic write on `EPERM`, `EBUSY` and `EACCES`; running without a POSIX shell; the generated pointer as `.cmd`; rules of the script ban for cmd and PowerShell. The installer refuses on Windows today. **[planned]** (marked alpha)
- **One minimal version of git: 2.40.** It is a single constant, in the check of `doctor`. The reason is the command that needs it: Mimir re-applies its queued commits on the tip of the remote in memory with `git merge-tree --merge-base`, and that option arrived in 2.40. `doctor` warns about an older git, because the writes cannot be sent. The relative paths of worktrees (see Worktrees) need 2.48, and are optional. **[built]**
- Hooks and jobs: Node, with no dependence on the shell.

## Tests

| Kind | Scope |
|---|---|
| Contract | every command on a model Desk: areas on three levels, an area in a subdirectory of the parent repo, a separate repo, everything flat in `~/repos` with attachment, a repo of a team through `links`, an overlay, an alias on a collision, a missing place, an unavailable area, a cycle, an extension with the kind `session` |
| Layers | four layers (manifest, the owner's rules, the file of the computer, `area.local.yaml`) and the order of overlays |
| Systems | macOS, Linux and Windows in CI; on Linux the Windows logic is tested through a path layer written for it, an injected `EPERM`/`EBUSY`/`EACCES`, and generated `.cmd` and PowerShell files checked against a golden file; passing on a real Windows runner is a separate manual line of evidence that does not block a merge |
| Concurrency | N parallel `write` calls to one area from several worktrees: no lost writes, trailers in every commit, no foreign files in commits; a race of locks across many processes |
| Git | a rejected push (non-fast-forward and protected), a conflict of fast-forward, a dirty work tree, a main checkout on another branch, a topic worktree, no remote, no network and the queue; a write interrupted at each step |
| Worktrees and topics | `worktree open/close`, an orphaned worktree, `topic start/finish` with the three outcomes, a disagreement of branches after a squash merge |
| Container | host and container on one repo; worktrees under another path prefix; when the container mode exists: MCP over HTTP, the thin client, translation of paths, the token and its limits |
| Security of the server | CSRF, DNS rebinding, XSS from the content of an area |
| Compatibility | an older Mimir on a newer schema: a warning, reading, no migration |
| Performance | time of the hook (p95), cost of the MCP schemas in tokens, the budget of the instructions |
| Portability | `check --portable`, also in a clean container |
| Self-description | a test in the repo that looks at the paths and content of tracked files and fails on a section sign, a number of a task, or a name of a decision; no test in the repo reads a document outside the repo |
| Agent scenarios | in a test container, in the four tools: "find and quote", "write a decision into a shared area", "work in App and reach the knowledge of Acme", "the user says something exists but it is not on the branch", and "we record a demo of App", said in any directory. A parser of the metrics is tested on recorded transcripts; real runs are done only on the owner's word. The main measure is the number of interruptions per hour (questions and refusals), besides completion, the number of steps and escapes to grep |
| Search | a set of questions on the owner's real data on which grep fails, with a judgement of relevance, on a pinned copy of the corpus |
| Real use | a week of work of the owner with the refusals of hooks logged; the false ones become tasks |

## Build order

The target is the complete state. The order follows dependencies and risk. The target environment is built to the end without importing data from the owner's computer: mechanisms, structures, jobs and tests work on test data, so that the place for the owner's data is ready and symmetrical. Data of the owner (an older knowledge repository, Claude Code sessions, the ingest of the company, files from the disk) enter later, only on the owner's word, step by step. Until then nothing reads or processes real sessions, mail or archives.

State of the build on 26 October 2026: the first build for Claude Code is done as far as navigation, keyword search, the hooks of order, skills of the Desk, the model Desk, the server and the core of the write layer; the rest is planned.

1. **Probes of risk.** Agent tools (hooks, MCP, skills, instruction files, cwd), search on real data, a measurement of whether Yggdrasil sees a nested code repo. The results may change Session, Area elements and Installation and tools.
2. **Foundation.** The registry of keys and codes (one place for each), layers and rules with `why`, the lifecycle of areas, aliases, the block `# mimir:managed`, `repos[].dir`.
3. **Browsing and writing.** `follow`, `log`, `move`, `delete`, `commit`, the verbs of resources; the write layer is done and is hardened rather than extended.
4. **Worktrees and topics.** `topic`, `integrate`, `sync`, tidying, the pair of branches.
5. **Integration with the tools.** The adapters and probes for Copilot, Codex and Cursor, the degraded mode, a harness of agent scenarios, the log of refusals and `hooks report`.
6. **Search by meaning**, after the benchmark; the filters of search; the generated map; a ready-made index.
7. **Jobs and extensions**, the runner, the stored state, the tool `action`; moving the rules of order out of the core.
8. **The server and the portal**, the views; the container mode only when it is needed.
9. **Portability and lifecycle.** `check --portable --clean`, `area rename|move|remove`, migrations.
10. **The owner's setup.** The Desk, places, the archive and the kind `session`, the diary, Acme with shells and `container build`, Yggdrasil in a shell, the tools container and identities, the migration of an older knowledge repository.
11. **Packaging.** The npm package, the README and the final documentation written afresh; publication only on the owner's word.

## A personal setup

A personal setup is the layer one user builds on top of the core, and nothing in the core depends on it. It is made of area content and extensions: a Desk with the user's places and rules, areas for the companies and teams the user works with, a private overlay over a company area, and extensions such as the session archive and the diary. A typical tree:

```
Desk (~/.mimir/desk, a private repo)
├─ Me          the user's own projects, attached from ~/repos where they already lie
├─ Acme        knowledge of a company
│  └─ projects/    shells of the company's applications (since the split, Gard's)
│     ├─ app          a thin area: the team's repo already has its harness
│     └─ second-app   a shell with the user's environment beside a clean clone of the team's repo
└─ Acme-me     a private overlay on Acme: ingests, notes, private topics
```

Places with a purpose map to directories of one computer (an external disk for products, an archive of sessions, logs of jobs); when a place is missing, the agent asks before writing elsewhere. The rules of order (the ban on throwaway scripts, the guard of the disk, the `.temp` block, the host-run rule) are switched on by the user, and since the split they are Gard's guards. Company identities stay out of the private host: the command-line tools of a company run in a tools container of its own, and a pull request is opened through it.

## Rulings of 26 October 2026

These are the decisions the owner took on 26 October 2026, with the reasons, as plain sentences. Each also stands in the chapter where its subject is. Decisions marked "recommended by the planner" were taken by the builder of the loop and stand until the owner objects; they are listed again in Open decisions.

**By the owner.**

- Topic branches are allowed in every area and every code repo, also in areas of knowledge, but are optional. Reason: a team that wants everything behind a pull request wants them everywhere, and nobody loses when they are optional. As a rule, the work of a topic enters through a pull request, and an area or a repo may force it (see Topics).
- The rules engine is built in full: `match` and `set`, named fragments, one pass, reach, a fixed list of settable fields, `RULE_CONFLICT` and `why`. Reason: one general mechanism serves identity, the command of a pull request and places for every kind, with the origin of each value visible; the alternative of three fixed settings plus native git was rejected (see Algorithms).
- The provenance of code commits made with plain git is kept in a local ledger or in git notes that Mimir never pushes, so the history of a team stays untouched (see Write protocol).
- Mimir trusts everything that is cloned: hooks, jobs, extensions and skill scripts run without a further approval. Reason: a cloned area must work at once, and an approval at every change would be a constant interruption; the review that pointed at the risk (code runs after a plain pull) was answered by stating the risk openly and areas from untrusted sources are not cloned (see Scope and principles).
- The rules of order (the ban on non-deterministic scripts, the guard of the disk, the `.temp` block, the host-run rule) are the owner's setup and not the core. Reason: they exist for the way this owner works and for this owner's disk. The core keeps the mechanism (the dispatcher, the header, the session marker, hooks of areas with a time limit and passing a call on a failure). Anyone who wants such rules builds them with hooks of an area or of the Desk (see Extensions).
- The code of those rules lives as a module in the Mimir repo, outside the core, loaded only when the Desk of the owner switches it on, and the core imports nothing from it. The same pattern is provisional for the owner's other extensions (see Extensions).
- Writes to shared areas of a team enter through pull requests, one per topic by default. Collective daily pull requests and a pull request for every session are not designed as the default (see Write protocol).
- The copy of the Desk will be a private repository on GitHub, made later; until then `doctor` reports the lack of it. Mimir never makes a remote of the Desk (see Data model).
- The mode "the agent in a container connects to the Mimir of the host" is deferred until the first real user needs it, and then it is read-only with a token limited to the chain of areas of its workspace, and only the working directory and the workspace directory are translated (see Session).
- The name stays Mimir, the package `@chrisdudek/mimir`, the command `mimir`. Before publication the command is checked against the Grafana Mimir binary in `PATH`, and the README explains the difference. Publication happens only on the owner's word.
- Mimir is released under the MIT licence; the owner confirms the name and the year in the licence file.
- Packages on the host are allowed except in repos of teams and in projects that have a devcontainer. Reason: the hindrance came from packages that belong in a container, not from Mimir's own dependencies (see Scope and principles).
- The code, comments, names, tests, fixtures and the documents in the repo are self-describing and do not refer to anything that is not in the repo. The repo holds only a README and a licence file, and development documents live outside it and are in English (see Scope and principles).

**Recommended by the planner, standing until the owner objects.**

- The tool `action` (actions of extensions and jobs) joins the MCP tools; the final count of the tools and the route of area skills are settled after the probes (see The MCP surface).
- `container build` is in the target scope (see Area elements).
- The diary uses Haiku 5.5 for facts and Haiku or Sonnet 5.5 for the day; the comparison happens only on real data (see Extensions).
- Windows enters the build now, marked alpha until its tests pass on a real runner (see Systems).
- One measurement decides whether Yggdrasil sees a nested code repo, before the rest of that work (see A personal setup).
- The package is prepared in full and never published without the owner's word (see Scope and principles).
- The recipe of a reproducible product lies next to it in `<name>.recipe.yaml`; a product with no recipe is an original and is never deleted automatically (see Files and schemas).

**Earlier decisions of the owner that this specification builds on** (they are stated in the chapters where they apply): the layout of shells with `source/` inside; new clones in shells and old clones left alone; the rulings on taking an older knowledge repository apart; the commit built beside the checkout; the state of a topic on the main branch and its content on the branch; the declared integration per repo; the finish of a topic with one question; the place called `outputs`; the default of "trusted" permissions; the rule that a write to another area goes through Mimir and covers knowledge files only; the end of hardening of the server.

## Open decisions

Everything here is undecided, or decided only by the builder and awaiting confirmation. Nothing in this list is built on the assumption that the answer is known.

1. **The engine of search by meaning**, after the benchmark (see Search and index).
2. **Where the owner's other extensions live.** The guards are in `extensions/owner-guards`. For the archive, the diary and the ingest, the recommendation is a directory `owner-setup/` in the Mimir repo; confirmation is needed when they are built.
3. **Accounts and cost for the probes of tools**, and a Linux machine to run them on: the owner's consent is needed before probes that use real accounts of Copilot, Codex and Cursor, and before any real run of agent scenarios.
4. **A sample of the structure of one real Claude Code session** (the keys only), needed by the archive and the kind `session`.
5. **Confirmation of earlier decisions marked as taken by the builder:** the decisions that the loop recorded without the owner (the tool `action`, `container build`, the models of the diary, Windows now, one Yggdrasil measurement, no publication, the recipe next to the product), and the earlier set accepted "per recommendation": the end of a topic with the question before integration; skills and MCP of areas available from every place, natively in Claude Code; the location of new clones and refresh through `sync`; worktrees inside the repo with a check of `.dockerignore`; the layout of `~/.mimir`, `area.local.yaml` and `uninstall`; a lighter hardening of the server and a version of the schema with a warning and no read-only mode.
6. **Confirmation of the rulings on an older knowledge repository** (the original attached for reading and searching after switches exist; taken apart gradually; a test copy for trials of writing).
7. **Refusing writes by an older Mimir** in an area whose `requires` is above its version (the reviewers asked for a code `VERSION_BEHIND`); today it warns and goes on.
8. **The route of area skills and area MCP**, and the final number of MCP tools (see The MCP surface).
9. **Atlassian on the host or in a container.**
10. **The store of provenance of code commits:** the local ledger or git notes.
11. **The language of all texts of Mimir** that the user reads, after the header (see Session).
12. **Default scope of search** (the chain of the current area, or everything), and the truth of `visibility` for an area that lies in a repo with no remote (a `check` that refuses `shared` there).
13. **Questions of the agent to the user.** The agent asks about the place of a topic, the end of a topic, a missing place and local copies of external objects; reviewers noted that these add up to many interruptions. A default that can be undone, plus a place where the questions wait, is an option; no decision yet.
14. **Cloud agents** (a snapshot of an area for tools that cannot reach a local Desk).
15. **The name and the year in the licence file.**

## Reserved for part b

Part b of this specification is written after the build, once all the waves are in:

- the complete table of errors and warnings, each with its meaning, its fix, the place it is raised from, and a test that holds the table and `src/errors.mjs` to each other in both directions;
- the matrix of tools: for each of the four agent tools, what works (hooks, MCP, skills, instruction files, cwd), from the probes, and the description of the degraded mode;
- the closing of the remaining proposals of the earlier specification (the default visibility, what `area.local.yaml` may hold, the layout below the home, the places searched for existing clones, and the moment a session pull request is opened), each with a final answer.

Nothing in this chapter is a decision; it only keeps the place.
