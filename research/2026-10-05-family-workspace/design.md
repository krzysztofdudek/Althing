# The family workspace — design
*Moved into Althing on 2026-10-06 from the private repository the family was run from, scrubbed: its links into that repository became plain references, and private details were removed. The owner's decision of 2026-10-05 to make Althing the whole family layer (ruling `althing-family-layer`) superseded its recommendations on where the record, the canon and the thesis live; its workspace part was carried into Althing (`workspace/`, `method/environment.md`).*

Proposal, 2026-10-05, written at the owner's request by the architect of the family's engineering setup. Read-only pass: nothing was created, pushed or changed anywhere except this file. Inputs: the operating doc and architecture record of the repository the family was run from, the thesis, the tool map, the canon, the inventory, the parked ideas and the releasing-the-family skill; the 6.2.0 loop (goal, rulings, asks, log, issues 184, 239 and 254–259) and its plans (`plan-6.2.0.md`, `jarl-architecture-6.2.0.md`, `plan-grain.md`, now in `releases/6.2.0/plans/`); the CI workflows, vendoring pins and operating docs of Runes, Yggdrasil, Grain, JarlSkill, Horde and the three add-ons on their current branches; the Grain gate environment rebuilt by hand in the session scratchpad after today's reboot. The family is as the owner set it today: the core (Yggdrasil, Grain, Jarl, Horde), the add-ons Ratatoskr, Urd and Researcher, and Runes as shared code. That is eight repositories.

## The short version

1. **Name: Althing**, "the assembly of all". It was the assembly where the law was recited and disputes were judged. In the Prose Edda the gods ride over the rainbow bridge every day to sit in judgment at Urd's well beneath Yggdrasil. The name is free under `krzysztofdudek` (section 6).
2. **What it is.** A public repository with no tool code in it. It holds a registry of the eight repositories, one manifest per release naming which commit of which repository forms it, and a zero-dependency CLI. The CLI clones the repositories into a gitignored `repos/`, builds each commit once into a cache keyed by its SHA, and exports the environment the tools' own suites already read. Beside that sit the cross-tool checks nobody owns today.
3. **The line.** A test belongs to the repository whose commit must change when the test's expectation changes. Runes' edge goldens and resolver oracles move with Runes commits, so they stay in Runes. Jarl reading its own older records stays in Jarl. The workspace takes what needs two or more repositories' commits at once: the stack scenario, the three-way parity, the upgrade path, one Runes across the family, contract shapes, the plugins installed together, and every tool's suite run with nothing skipped.
4. **Four modes.** Dev runs the working branches, nightly, and only advises. Candidate runs the exact SHAs from the release manifest and is the gate. Adopter runs the published npm and marketplace artifacts. Upgrade goes from the previous release to the candidate.
5. **A gate that is not a single point of failure.** No tool's everyday CI reads the workspace. Only the step that tags a family release reads it, publicly and read-only, with no secret. It asks one question: does the latest manifest for this version name my exact SHA, and is the workspace's verdict on that manifest commit green?
6. **6.2.0.** Build it now, local-first. C1 stays in Runes as planned. C2 (239) and 254–259 are built in the workspace instead of in Grain and the scratchpad. CI follows the day the owner creates the GitHub repository. In 6.2.0 a person reads the verdict; the release workflows start reading it in 6.3.0. D11 is in the ratify batch a-004 and should be answered as changed.
7. **The record.** The 6.2.0 loop finishes where it is, on Jarl 6.1.0. From 6.3.0 on, a release directory in the workspace holds the manifest, the plans and the one loop (`releases/<version>/.jarl`). The previous release's Jarl drives it. The record gets a git remote, and the loop stops running the Jarl it changes. This depends on the owner accepting that his verbatim rulings become public.
8. **For the owner.** Decide the name, the visibility, whether release loops go public, the timing and D11. Then run one `gh repo create`. No secrets are needed.

## 1. Purpose and boundaries

### What today's setup costs

- **The compatibility environment lives in a session scratchpad.** Today's reboot wiped it, and it was rebuilt by hand under `<session scratchpad>/grain-611/`: a Yggdrasil copy built on the host at `d63857afc`, Horde at `0f6ccba`, eight corpus clones, and a `full-gate.sh` that exports `YG_BIN`, `HORDE_DIR` and `GRAIN_CORPUS_CLONES`. Every worker brief now carries its `$TMPDIR/…` paths. The reviewers' comparison scripts and the bug-hunt repros that proved the 6.1.1 fixes did not come back. The plan now asks every acceptance to be re-derived from the issue's text.
- **The suites already know how to test against each other. They skip when nobody supplies the other tools.**
  - `YG_BIN` is read in 253 places across Grain's, Horde's and Jarl's tests. They also read `YGG_DIR`, `HORDE_DIR`, `HORDE_TEST_YG`, `HORDE_TEST_GRAIN`, `HORDE_TEST_JARL`, `HORDE_TEST_RATATOSKR_DIR`, `GRAIN_CORPUS_CLONES` and `JARL_LIVE_LOOP`.
  - On CI only Grain's `seams` job and Horde's suite fill some of them.
  - Jarl's real-loop test in `resume.test.mjs` is skipped everywhere, CI included. It looks for its loop at a relative path into a private repository, written in a public repository.
  - A skipped test proves nothing, and plan-grain §5 says so for Grain.
- **The cross-tool matrix grew by accident.**
  - Grain's `seams` job describes itself as the place where "the compat matrix … starts". Horde's CI checks out Yggdrasil, Grain, Jarl and Ratatoskr.
  - The rule "the sibling's branch of the same name, else the base branch, else `main` or the pin" is copied seven times in shell: six times in Horde's `ci.yml` and once in Grain's.
  - None of the copies tests exact SHAs. They test whatever branch tips exist when the run starts. That is why the skill has to say "after every Yggdrasil push, re-run the latest Horde and Grain CI runs".
- **Issues 254–259 have no home.** 258's acceptance says so directly: the script goes "in the place set by the decision about the family workspace".
- **Every release record lives on one disk.** The repository that holds them has no git remote (jarl-architecture §3.4).

### What the workspace owns

1. **The registry.** Each family repository is declared once: its name, its GitHub repository, its kind (core, add-on or shared), how to build a commit, which binaries it yields, and which environment variables it supplies to the others.
2. **The release manifests.** For each family release and each patch: which commit of which repository forms it, with the tag and the published artifact each becomes.
3. **The environment.** One command turns a manifest into clones, per-SHA builds and an exported environment, locally and in CI. Every tool's own suite then runs with nothing skipped for want of a sibling.
4. **The cross-tool checks:**
   - the stack scenario and the three-way edge parity on the real-repository corpus (239);
   - each tool's suite in the full environment (254, and the same for Grain and Jarl);
   - contract shapes, previous release against candidate (255);
   - the upgrade path (256);
   - the cross-tool half of the real-loop check (257);
   - the pins check: one Runes, Horde's Jarl on Jarl's commit, the version floors (258);
   - the plugins installed together, with every MCP server answering (259);
   - the README canon drift check, once it moves in.
5. **The real-world corpora that are no single tool's fixture.** These are the list of corpus entries that run the stack scenario, with their documented exceptions, and scrubbed frozen Jarl loops.
6. **Release orchestration that reads and reports:**
   - `status` shows each repository's branch, manifest version, `[Unreleased]`, tag and npm version. That is the skill's session-start step as a command.
   - `pin` fills a candidate's SHAs from the release branches.
   - `verify-publish` is the skill's "verify the publish, never trust a green run" as a command: it checks npm dist-tags, GitHub releases, `pack/promises@<v>` and the add-ons' tags.
   - `order` prints the order to `main` and checks its preconditions: Runes on npm before Yggdrasil, Horde's Jarl pin on Jarl's tag.
7. **From 6.3.0 on, if the owner agrees: the release record.** `releases/<version>/` holds the manifest, the plans and the loop (section 5).

### What it never owns

- **A tool's own material:** its code, unit tests, fixtures, vendored copies or operating doc.
- **A tool's own gate.**
  - Each tool's `ci.yml` keeps running on its own, including Grain's `seams` job and Horde's sibling checkouts. The workspace adds exact-SHA checks on top.
  - It ships no reusable action that a tool's workflow must `uses:`. That would make every tool's push depend on it.
- **Checks that belong to one tool:** Runes' corpus goldens and resolver oracles (C1), and Yggdrasil's `surface-truth`.
- **Yggdrasil's family-contracts page.** That registry of documents stays in Yggdrasil's docs; the workspace reads it.
- **Any write to a tool repository.** It never pushes, tags or opens a pull request in one, and it holds no token that could.
- **Anything outside the family's engineering:** the thesis, and anything private.

### The line, as one rule

**A test belongs to the repository whose commit must change when the test's expectation changes. When an expectation can only change through commits in two or more repositories, the test belongs to the workspace.** Data is a separate matter. The workspace may supply real-world data to a tool's own test through the environment, the way `GRAIN_CORPUS_CLONES` and `JARL_LIVE_LOOP` already work.

Applied to today's cases:

- **Runes' edge goldens → Runes.** They change in the same commit as the extractor change that moves them, and a reviewer must see both together.
- **Runes against `tsc`, `importlib` and `tomllib` → Runes.**
- **`grain propose` → `yg adopt` → `yg check --full` → workspace.** Its expectation moves with Grain or with Yggdrasil.
- **Jarl 6.2.0 reading a loop Jarl 6.1.0 wrote → Jarl.** The test is Jarl's (the architect's J5); the real loops are supplied by the workspace.
- **A Horde mission → workspace.** The mission is written through the vendored record, read by the candidate Jarl, and run by a Horde re-vendored from that Jarl.

### Where the line falls

In this proposal the thesis, strategy notes and older release history stayed private (the thesis moved here later, under `althing-family-layer`); only the family's engineering moves here.

### Carrying clean-core over

The workspace is meant to be public, so its boundary is strict. **It never names a client or client work, and it never links or describes a private repository.** Grain's and Horde's operating docs already state the same rule. Whatever must point at private material stays private.

The enforcement must not write the leak into the repository: a hard-coded client name in a publish-bound check would itself be the leak. So the workspace runs two layers:

- **In CI, name-free rules:** no path shaped like a private client area, no absolute home or temporary-directory path, no path into a private repository.
- **On the owner's machine, a pre-commit hook.** It reads confidential tokens from a file outside the repository, through a path given in an environment variable. That file is never committed.

The honesty line carries over unchanged. A green check proves structural isolation only. It is silent on git history and on re-identification, and it never means "safe to publish". The workspace governs itself with Yggdrasil, as the family's tools do: a small graph (registry and manifests, checks, corpus, release records) with the rails above as its aspects.

Nothing from the release records moves to a public repository without three things first: a name scan, a scrub, and the owner reading what his verbatim rulings say in public.

## 2. Layout

```
Althing/
├── README.md               what it checks, the one command, the modes, what a green run does not prove
├── CLAUDE.md, AGENTS.md    the operating doc for agents: the boundary above, commit identity, never writes to a tool
├── package.json            "private": true, no dependencies, scripts only
├── ws.mjs                  the one CLI (Node 22+, zero dependencies); named for its role, so a rename of the repository changes no code
├── lib/                    the CLI's internals: sources, trees, builds, env, manifest, runner, report
├── repos.json              the registry: each family repository once
├── releases/
│   ├── 6.1.0/family.json   published: tags, commits, npm versions; the upgrade path starts here
│   ├── 6.2.0/family.json   open now (branches), candidate once pinned (exact commits)
│   └── 6.3.0/              from 6.3.0 on, the release's whole record
│       ├── family.json
│       ├── plans/
│       └── .jarl/          the release loop: one loop per directory
├── checks/
│   ├── suites.mjs          each tool's own suite in the full environment; fails on an environment skip (254)
│   ├── pins.mjs            one Runes, Horde's Jarl on Jarl's commit, the floors (258)
│   ├── contracts.mjs       every family document: previous vs candidate shape, new codes (255)
│   ├── stack.mjs           propose → adopt → check, and the three-way edge parity (239)
│   ├── upgrade.mjs         a previous release's state → the candidate (256)
│   ├── loops.mjs           missions and real loops under the candidate Jarl and Horde's new vendor (257, cross-tool half)
│   ├── plugins.mjs         the core's plugins installed together, every MCP server answering (259)
│   └── family-sync.mjs     the README canon drift check (after 6.2.0, with the canon)
├── corpus/
│   ├── stack.json          which entries of Runes' corpus manifest run the stack scenario, exceptions with issue ids
│   └── loops/              scrubbed frozen Jarl loops, each with its source and date (after the owner's read)
├── fixtures/               small synthetic repositories for the contract and upgrade checks
├── test/                   tests of ws.mjs and of the checks themselves
├── .github/workflows/
│   ├── self.yml            the workspace's own tests, on push and pull request
│   ├── dev.yml             every 3 hours when a watched branch moved, nightly regardless; advisory
│   ├── candidate.yml       on a push that changes releases/*/family.json, and on dispatch; the gate
│   └── adopter.yml         on dispatch after a publish, and weekly; published artifacts
├── repos/                  gitignored: one full clone per registered repository
└── .cache/                 gitignored: trees/<repo>@<sha12>/ (detached worktrees, each with its build), corpus/<id>@<sha12>/, npm/, grammars/, results/
```

**How `repos/` and `.cache/` are used.**

- `repos/<name>` is a full clone, with every branch and tag. It is used for fetching and reading only. Nothing is built in it and nobody develops in it.
- Every commit the workspace needs becomes a detached worktree at `.cache/trees/<name>@<sha12>/`, with its own build inside it.
  - A dev build, a candidate build and the previous release's build sit side by side. The upgrade check needs two of them at once.
  - A build is never stale: a new SHA is a new directory.

**The development checkouts stay where they are:** siblings of each other, with their worktrees under `~/.jarl-wt/`, and Yggdrasil's inside its devcontainer. The workspace never adds a worktree to them, never builds in them and never reads the devcontainer's volumes. This is the lesson of plan-grain §5: "do not point `YG_BIN` at the Yggdrasil checkout, which its own workers are patching".

Making `repos/` the place where development happens is a different choice. It would break the `../` links of the tool map, the sibling layout the canon check and the tests assume, the devcontainer's bind mount, and every live worktree and lease. It is not recommended.

### The registry

`repos.json` declares each repository once. The `env` entries are the variables the tools' suites already read, so supplying them changes no test.

```json
{
  "schema": "family-repos/1",
  "repos": {
    "runes":      { "github": "krzysztofdudek/Runes",           "kind": "shared", "build": ["npm ci", "npm run build", "npm run grammars"] },
    "yggdrasil":  { "github": "krzysztofdudek/Yggdrasil",       "kind": "core",   "build": ["cd source/cli && npm ci && npm run build"], "bin": { "yg": "source/cli/dist/bin.js" }, "env": { "YG_BIN": "source/cli/dist/bin.js", "YGG_DIR": ".", "HORDE_TEST_YG": "source/cli/dist/bin.js" } },
    "grain":      { "github": "krzysztofdudek/Grain",           "kind": "core",   "build": [], "bin": { "grain": "plugins/grain/bin/grain.mjs" }, "env": { "HORDE_TEST_GRAIN": "node {tree}/plugins/grain/bin/grain.mjs" } },
    "jarl":       { "github": "krzysztofdudek/JarlSkill",       "kind": "core",   "build": [], "bin": { "jarl": "skills/jarl/scripts/jarl.mjs" }, "env": { "HORDE_TEST_JARL": "skills/jarl/scripts/jarl.mjs" } },
    "horde":      { "github": "krzysztofdudek/Horde",           "kind": "core",   "build": [], "env": { "HORDE_DIR": "." } },
    "ratatoskr":  { "github": "krzysztofdudek/RatatoskrSkill",  "kind": "add-on", "build": [], "env": { "HORDE_TEST_RATATOSKR_DIR": "." } },
    "urd":        { "github": "krzysztofdudek/UrdSkill",        "kind": "add-on", "build": [] },
    "researcher": { "github": "krzysztofdudek/ResearcherSkill", "kind": "add-on", "build": [] }
  }
}
```

### Sources: GitHub, or this machine's checkouts

All of 6.2.0 so far exists only in the local sibling checkouts; nothing is pushed beyond `main`. So the workspace can also fetch from them:

- An optional, gitignored `ws.local.json` maps names to those checkouts.
- `ws` adds each one as a second remote of `repos/<name>`, called `local`, and fetches from it first.
- A commit's identity is its SHA, wherever it came from. A candidate verified locally on unpushed commits is the same candidate CI verifies after the push.
- Without `ws.local.json` (in CI, or on a fresh machine), GitHub is the only source.

```json
{ "sources": { "runes": "../Runes", "yggdrasil": "../Yggdrasil", "grain": "../Grain", "jarl": "../JarlSkill", "horde": "../Horde", "ratatoskr": "../RatatoskrSkill", "urd": "../UrdSkill", "researcher": "../ResearcherSkill" } }
```

### Bootstrap and daily use

```sh
git clone https://github.com/krzysztofdudek/Althing && cd Althing
node ws.mjs up                                       # dev mode for the open release: clone or fetch all eight, check out the declared branches, build each commit once
eval "$(node ws.mjs env)"                            # YG_BIN, YGG_DIR, HORDE_DIR, HORDE_TEST_*, GRAIN_CORPUS_CLONES, RUNES_CORPUS_DIR, JARL_LIVE_LOOP; yg, grain and jarl on PATH
node ws.mjs up --ref grain=jarl/230-scope-identity   # one repository at a worker branch or a SHA, the rest as declared
node ws.mjs check stack --only express               # one check, one corpus entry
node ws.mjs run candidate 6.2.0                      # the whole gate on the manifest's exact commits
node ws.mjs status 6.2.0                             # per repository: branch, manifest version, [Unreleased], tag, npm
```

A Grain worker's full gate becomes `eval "$(node <workspace>/ws.mjs env)" && npm test` inside its worktree. `full-gate.sh` and every `$TMPDIR/…` path in the briefs go away. Locally, `ws` runs under `nice -n 15` and holds a lock, so two stack or corpus runs never overlap. That is the plan's load rule made mechanical.

### How it avoids the scratchpad's fragility

- **A stable home.** It lives at a fixed path in a git repository, beside the tools. Its caches are under its own `.cache/` (or `$XDG_CACHE_HOME`), never under the system temporary directory or a session's scratchpad.
- **Everything is derived from committed inputs.** A reboot or a new machine costs a rebuild, never knowledge.
- **Builds are keyed by commit.** "Rebuild `ci/yggdrasil` after every Yggdrasil merge" stops being an instruction someone must remember.
- **Scripts that proved something stay.** A comparison script a reviewer would write a second time goes into `checks/`, reviewed like code, instead of disappearing with the session.
- **Evidence outlives the run.** CI keeps each run's summary and artifacts. A release issue records the run's URL and its verdict as evidence (`--ran/--saw`), as it records local runs today.

## 3. Modes, the manifest, and CI

### The four modes

| Mode | Which commits | Built from | When | Blocks |
|---|---|---|---|---|
| dev | each repository's declared branch (`release/6.2.0`; `release/1.1.0` for Runes; `main` for the add-ons), or a `--ref` override | source | locally on demand; in CI every 3 hours when a watched branch moved, and nightly regardless | nothing. It advises; a red run is a finding to file in the loop |
| candidate | the exact SHAs in `releases/<v>/family.json` | source | on the push that changes a manifest, and on dispatch | the family's tags (below) |
| adopter | the published artifacts: `@chrisdudek/yg` and `@chrisdudek/runes` from npm, and each plugin installed from its marketplace at its tag | registries | on dispatch after a publish, and weekly against `latest` | nothing after the fact. It is the skill's "verify the publish" as a command. The weekly run catches drift in a registry or a host, the class of the 6.1.0 `npm@latest` failure |
| upgrade | the previous release (adopter) → the candidate (source) | both | inside every candidate run | the tags, together with candidate |

### The manifest

There is one manifest per family release and one per patch, at `releases/<version>/family.json`. Its schema id is `family-release/1`. It is JSON, because every pin in the family is JSON and `ws` has no dependencies.

```json
{
  "schema": "family-release/1",
  "release": "6.2.0",
  "state": "candidate",
  "previous": "6.1.0",
  "repos": {
    "runes":      { "version": "1.1.0", "branch": "release/1.1.0", "commit": "<40 hex>", "tag": "v1.1.0", "npm": "@chrisdudek/runes@1.1.0" },
    "yggdrasil":  { "version": "6.2.0", "branch": "release/6.2.0", "commit": "<40 hex>", "tag": "v6.2.0", "npm": "@chrisdudek/yg@6.2.0" },
    "grain":      { "version": "6.2.0", "branch": "release/6.2.0", "commit": "<40 hex>", "tag": "v6.2.0", "plugin": "grain@grain-marketplace" },
    "jarl":       { "version": "6.2.0", "branch": "release/6.2.0", "commit": "<40 hex>", "tag": "v6.2.0", "plugin": "jarl@jarl-marketplace" },
    "horde":      { "version": "6.2.0", "branch": "release/6.2.0", "commit": "<40 hex>", "tag": "v6.2.0", "plugin": "horde@horde-marketplace", "tags": ["pack/promises@<per D6>"] },
    "ratatoskr":  { "version": "0.8.0", "branch": "main", "commit": "92259b100e1e1c0d206df468bfdfc0456e99d6c9", "tag": "v0.8.0" },
    "urd":        { "version": "0.3.0", "branch": "main", "commit": "fd7e3bc471f1b23201e1068a6fd82483348024a1", "tag": "v0.3.0" },
    "researcher": { "version": "1.8.0", "branch": "main", "commit": "fa8c2be23cdcc3e1dadc9795420a0814eac317d7", "tag": "v1.8.0" }
  }
}
```

The 6.1.0 manifest is `published`, with the real tag commits: Yggdrasil `e5441101d329`, Grain `b70a4e91c654`, Jarl `0ee562ca9827`, Horde `96a446593d81`, Runes 1.0.0 `d90119effc51` (shortened here, written in full there). It is where the upgrade path starts.

A manifest moves through three states:

- **`open`.** It names branches only, and its commits are `null`. Dev mode reads it. It is written when a release opens.
- **`candidate`.** Every commit is filled in.
  - `ws pin <v>` writes them from the branch tips, local or remote, and refuses a commit that is not on the declared branch.
  - A fix in any repository means a re-pin, a new workspace commit and a new run.
- **`published`.** `ws verify-publish <v>` confirms that every tag resolves to its commit and that every npm version and release exists, then sets the state. A published manifest is never edited again.

A patch is a manifest whose `previous` is the release it patches, and it moves only the patched repository: `ws pin 6.1.1 --from 6.1.0 --move grain`. The real-repository gate that the skill requires for a patch then has a subject too.

### CI

| Workflow | Triggers | Runs | Blocks |
|---|---|---|---|
| `self.yml` | push and pull request touching `ws.mjs`, `lib/`, `checks/`, `test/` | the workspace's own tests | merges into the workspace |
| `dev.yml` | schedule every 3 hours; a first job compares `git ls-remote` heads of the declared branches with the last run's and stops when nothing moved; a full nightly run regardless; dispatch | dev mode: every check, the routine stack set, and the heavy tier at night | nothing |
| `candidate.yml` | push to `main` changing `releases/*/family.json`; dispatch with a release | candidate and upgrade; its last job, named `verdict`, is what the tools read | family tags |
| `adopter.yml` | dispatch after a publish; weekly | adopter mode against the published manifest | nothing |

**Why the triggers come from a schedule and not from the tools.** Cross-repository triggers have two shapes.

- **`repository_dispatch` from each tool's CI.** This needs a write-capable token stored as a secret in every tool repository. It also makes a tool's push call out to the workspace.
- **A schedule in the workspace.** It needs no secret and no tool change. The cost is up to three hours' delay in dev mode.

Candidate mode needs neither: the release loop pushes the pinned manifest, and that push is the trigger. So the schedule is enough. `repository_dispatch` is a later option if three hours ever matter.

Three facts about GitHub that this depends on:

- A `workflow_dispatch` sent with the workflow's own token does start a run. It is one of the two exceptions to the rule that the token's events start nothing.
- Scheduled workflows in a public repository are disabled after 60 days without a commit. A release cadence keeps them alive; a long pause needs a re-enable.
- Standard runners are free for public repositories. The Actions cache holds 10 GB per repository, and full-history corpus clones for the stack scenario must fit in it or be rebuilt each run.

```yaml
# candidate.yml (sketch)
name: candidate
on:
  push:
    branches: [main]
    paths: ['releases/*/family.json']
  workflow_dispatch:
    inputs:
      release: { description: 'release directory, e.g. 6.2.0', required: true }
permissions:
  contents: read
jobs:
  plan:
    runs-on: ubuntu-latest
    outputs: { release: '${{ steps.p.outputs.release }}', corpus: '${{ steps.p.outputs.corpus }}' }
    steps:
      - uses: actions/checkout@v4
      - id: p
        run: node ws.mjs plan candidate --release "${{ inputs.release }}" --before "${{ github.event.before }}" --github-output
  build:
    needs: plan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - uses: actions/cache@v4
        with: { path: .cache/trees, key: "trees-${{ hashFiles(format('releases/{0}/family.json', needs.plan.outputs.release)) }}" }
      - run: node ws.mjs up candidate ${{ needs.plan.outputs.release }}
      - uses: actions/upload-artifact@v4
        with: { name: trees, path: .cache/trees }
  checks:
    needs: [plan, build]
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix: { check: [suites, pins, contracts, upgrade, loops, plugins] }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - uses: actions/download-artifact@v4
        with: { name: trees, path: .cache/trees }
      - run: node ws.mjs check ${{ matrix.check }} --release ${{ needs.plan.outputs.release }} --summary "$GITHUB_STEP_SUMMARY"
  stack:
    needs: [plan, build]
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix: { entry: '${{ fromJSON(needs.plan.outputs.corpus) }}' }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24 }
      - uses: actions/download-artifact@v4
        with: { name: trees, path: .cache/trees }
      - uses: actions/cache@v4
        with: { path: '.cache/corpus/${{ matrix.entry }}', key: 'corpus-${{ matrix.entry }}' }
      - run: node ws.mjs check stack --only ${{ matrix.entry }} --release ${{ needs.plan.outputs.release }} --summary "$GITHUB_STEP_SUMMARY"
  verdict:
    needs: [checks, stack]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node ws.mjs verdict --needs '${{ toJSON(needs) }}'   # exit 1 unless every job above succeeded; writes the summary
```

In candidate mode, `checks/suites.mjs` parses each suite's test output and fails on any test skipped for an environment reason: a missing `YG_BIN`, a missing sibling, no corpus. Tests skipped for a platform (Windows-only) are reported, not failed. Windows stays each tool's own CI concern; the workspace runs on Linux in CI and on macOS locally.

### The gate on exactly a tool's SHA

The tagging step of a family release runs one more step first:

```yaml
- name: family gate (the workspace's verdict on exactly this commit)
  env:
    GH_TOKEN: ${{ github.token }}
    WS: krzysztofdudek/Althing
    SELF: grain                                  # this repository's name in the registry
    VERSION: ${{ steps.version.outputs.version }}
  run: |
    head=$(git rev-parse HEAD)                   # the commit being tagged, also under workflow_run
    c=$(gh api "repos/$WS/commits?path=releases/$VERSION/family.json&sha=main&per_page=1" -q '.[0].sha')
    [ -n "$c" ] || { echo "::error::no family manifest for $VERSION"; exit 1; }
    want=$(gh api -H 'Accept: application/vnd.github.raw' "repos/$WS/contents/releases/$VERSION/family.json?ref=$c" | jq -r --arg r "$SELF" '.repos[$r].commit')
    [ "$want" = "$head" ] || { echo "::error::the manifest at $c names $want for $SELF; this commit is $head"; exit 1; }
    ok=$(gh api "repos/$WS/commits/$c/check-runs?check_name=verdict" -q '[.check_runs[] | select(.conclusion == "success")] | length')
    [ "$ok" -gt 0 ] || { echo "::error::no green verdict on https://github.com/$WS/commit/$c"; exit 1; }
```

Where the step goes:

- **Yggdrasil:** in `tag-release.yml`, before the tag is created. Release follows Tag Release.
- **Grain and Jarl:** in `release.yml`, before the tag step. It runs on every push to `main`.
- **Horde:** in `release.yml`, before tagging, which runs after `ci`.
- **Runes:** in `release.yml`'s `publish` job, before `npm publish`. The owner pushes the tag, so the gate stops the publish, which is the irreversible step.
- **The add-ons:** no gate. They depend on nothing, and nothing in the family depends on them except Horde's drift test, which reads two of Ratatoskr's files.

**Why this does not become a single point that blocks everyday work.**

1. No tool's push or pull-request CI reads the workspace. A broken workspace changes nothing for a worker.
2. Dev mode never blocks anything.
3. The gate is a public, read-only question asked with the tool's own token. No secret is shared, and the workspace holds no write access to any tool.
4. It gates only what the family promises was tested together: a family tag, or a patch named by a manifest. Add-on releases and every branch pass it by.
5. A broken workspace is fixed with a commit in the workspace. No tool changes.
6. There is no bypass input. A "skip the family gate" switch would train the `--no-verify` reflex that the rationing principle of the family's gates warns about.

**Phase-in.**

- **In 6.2.0, a person reads the gate.** It is a line in 224's checklist: the candidate verdict on the commit that names the release's SHAs, recorded as evidence. The release workflows do not read it yet. Adding a step to five release workflows at the moment of publication would add a failure mode nobody has tried.
- **In 6.3.0, the step goes into the workflows.** It runs first on a patch or a dry run.

### What a green run does not prove

A green candidate verdict means these commits passed these checks. It does not mean the release is good.

- The corpus is public repositories at fixed commits, covering the languages and layouts chosen so far. The heavy tier never blocks routinely.
- Plugin hosts that cannot install headless are validated, not installed into, and the run says which ones.
- Where a check needs judgment, the agent records that judgment as testimony; it is not proof. One example is matching a red after the upgrade to the right "Before you upgrade" entry.

The README says all of this in its first screen.

## 4. 6.2.0: D11 and the issues

### D11, revisited

D11 (a) says: "Runes owns edges and resolver oracles …, Grain owns the stack scenario and the three-way parity …, with no new repository". The jarl recorded it under `autonomy-quality`, and it waits for the owner in the ratify batch a-004.

**What holds: Runes owning the edges (E) and the resolver oracles (R).**

- The plan's own reason was "only Runes can gate its own tag before the consumers have it". That weakens once a candidate manifest covers Runes' SHA before the tag.
- A stronger reason holds: the goldens move in the same commit as the extractor change. The plan's shared-files rule already makes each Runes package regenerate and explain its goldens. With seven Runes packages in flight, putting the goldens in a second repository would double every review.
- The corpus list (repositories at full SHAs, sparse paths, languages) stays in Runes' `corpus/manifest.json`, as C1 plans. The workspace refers to its entries by id and never copies them.

**What does not hold: Grain owning the stack scenario.**

- "No new repository" was a constraint, not a reason.
- The stack scenario (P) and the parity check need Grain, Yggdrasil and Horde at once, plus the Runes golden at the vendored commit. Their expectation moves with any of the three.
- Planting them in Grain extends the accident of the `seams` job: an eighth copy of the sibling-branch resolution, a `corpus.yml` in Grain that builds Yggdrasil and Horde, and a gate on Grain's release branch that tests branch tips rather than the SHAs that will be tagged.

**Revised D11:**

- E and R stay in Runes; C1 is unchanged.
- The stack scenario, the parity check and 254–259 go to the workspace.
- The skill names `npm run corpus` in Runes and `node ws.mjs run candidate <v>` in the workspace.

### Two ways to schedule it

| | A: now, local-first (recommended) | B: after 6.2.0 |
|---|---|---|
| What 6.2.0 builds | W0, the workspace skeleton; C2 and 254–259 as workspace checks; C1 unchanged | C2 in Grain (`corpus-gate.mjs`, `corpus.yml`); 254–259 as scripts in the scratchpad. 258 has no place, by its own text |
| Rework | none. C2 and the six checks are new code either way. W0 is the only addition, and 6.3.0 needs it anyway: the registry, the manifests, `up`, `env`, `pin`, `status`, `run`, local sources and its tests | C2 written in Grain, then moved out and deleted (an L, then an M); 254–259 written twice; Grain's CI changed twice |
| Risk to 6.2.0 | one more package, in a release with about forty open issues, on a laptop that has hit full load. The workspace's own bugs could hold up 224. Contained by: W0 first and small; every check runs locally without the GitHub repository; in 6.2.0 a person reads the gate, not the release workflows; if the repository does not exist by 224, the release records the local run on the final tips, as the plan already intended | the lowest |
| Value | the stack scenario and the six checks land in a git-backed home; the scratchpad environment and its paths leave every brief; CI runs on exact SHAs from the day the repository exists; 6.3.0 opens on a working workspace | 6.2.0's cross-tool evidence lives again on one disk or in a scratchpad, the place that was lost today |
| Owner steps now | the name; the repository can come late, any time before 224's pushes | none |

**Recommendation: A.** If the owner wants the release closed sooner, the fallback is B without the waste:

- Do not build C2 in Grain at all.
- Run the stack scenario, the parity check and 254–259 by hand on the final tips. Commit the scripts in the release directory of the repository the loop lived in, which is git-backed but on one disk.
- Build the workspace as 6.3.0's first issue, starting from those scripts.

### Plan changes under A

| # | Repo | Issues | Size | Tier | Waits for |
|---|---|---|---|---|---|
| W0 | Althing | new: the workspace skeleton — registry, manifests 6.1.0 (published) and 6.2.0 (open), `ws up/env/pin/status/run`, `ws.local.json`, its tests, the operating doc with the boundary, the name-free scan | M | strong | the name |
| W1 | Althing | 239, which was C2 in Grain: `checks/stack.mjs`, `corpus/stack.json` | L | strong | W0, C1's corpus manifest |
| W2 | Althing | 254 (Horde's suite on the 6.2.0 builds), the same for Grain's full gate and Jarl's suite, failing on environment skips; 258 (`checks/pins.mjs`) | M | standard | W0 |
| W3 | Althing | 255 (`checks/contracts.mjs`) | M | strong | W0 |
| W4 | Althing | 256 (`checks/upgrade.mjs`) | L | strong | W0, W2 |
| W5 | Althing | 257, cross-tool half (`checks/loops.mjs`); Jarl's own half stays with the architect's J5 | M | standard | W0, 251, 252 |
| W6 | Althing | 259 (`checks/plugins.mjs`) | M | standard | W0 |
| WF | Althing | the four workflows | S–M | standard | W0; active once the GitHub repository exists |

**The other changes:**

- 239's `Repo:` moves to the workspace, and the plan's Grain list loses C2. Grain's CI is not touched by 6.2.0's corpus work.
- 184 keeps C1 and its skill package. That package's text in the skill names both commands, and names the manifest commit as the gate's subject.
- 224 gains three steps: `ws pin 6.2.0` after the pushes; the candidate verdict on that commit before any tag; `ws verify-publish 6.2.0` after the publish. `ws status` replaces the hand-made session-start step.
- The Grain and Yggdrasil worker briefs replace the scratchpad paths with `ws env`.

**What each check does:**

- **258, the pins check.** It reads four pins:
  - Grain's vendored Runes pin (tag, commit, file hashes);
  - Horde's and Jarl's Runes pins;
  - Yggdrasil's `package.json` and lock: `resolved` from codeload at a SHA before the publish, from the registry after.

  After the publish, it checks that the bytes Grain vendors equal the files in the npm tarball. That is the proof that the published Runes is the tested one. The same check holds Horde's Jarl pin to Jarl's candidate commit (then its tag), and Horde's `YG_DOCUMENTS_AFTER` to Yggdrasil's version.
- **255, contract shapes.** For each document on Yggdrasil's family-contracts page that has a family consumer:
  - the producer runs at the previous release and at the candidate, on the same fixtures;
  - their shapes are compared (key paths, types, enumerations) and every difference is listed;
  - new issue codes are read from Yggdrasil's registry, and each consumer's handling of them is shown;
  - a synthetic document with an unknown code is fed to Horde's routing, to prove an unknown code does not crash it.
- **256, the upgrade path.** On a fixture and on one corpus repository (express):
  1. The published 6.1.0 tools adopt, check and refresh, and open a Jarl loop with a few issues and a Horde mission.
  2. The candidate builds run the same commands. Every tool runs, the caches rebuild, and the old loop and mission are read.
  3. Each new red is matched to a `### Before you upgrade` entry, and the fix that entry names is executed to prove it clears the red. The agent running the check judges the match and records it; it is not automated.
- **257, the cross-tool half.** It runs on two inputs: a mission from Horde's own tests, and a frozen copy of the 6.1.0 loop. Who produces that copy, and when it is committed:
  - In 6.2.0, `ws freeze` produces the copy locally, scrubbed, and it stays in `.cache/`.
  - It is committed to `corpus/loops/` only after the owner has read it.
- **259, the plugins.** The core's four plugins are taken from the candidate SHAs and installed into a throwaway config home through each host's CLI wherever that runs without a login.
  - Each MCP server is started over stdio, and its help tool is called through Runes' test-kit client.
  - The five manifests of each tool must agree on the version.
  - Where a host needs a login or has no headless install, the check validates the manifests, starts the server with the host's documented launch line, and names the hosts it did not install into.
  - The three add-ons are installed alongside, to catch a name or hook collision.

## 5. Jarl and the release record

**6.2.0 stays where it is.** Its loop stays where it is until it closes, under `jarl-pinned-in-loop` and the Jarl architect's §3.5. Its CLI is the main JarlSkill checkout at 6.1.0. A move mid-release would change every relative `Repo:` and gain nothing. The 6.1.1 → 6.2.0 move only survived because the directory depth stayed the same.

**From 6.3.0, a release directory in the workspace.** `releases/6.3.0/` holds `family.json`, `plans/` and `.jarl/`, a permanent loop. There is one loop per directory, as the ruling `one-loop-per-directory` keeps it: a patch backlog is `releases/6.3.1/.jarl`, never a second loop in the same directory.

**The driver Jarl.** The loop runs on the previous release's Jarl, which the workspace already holds as a published commit.

- `node ws.mjs jarl <command>` runs `.cache/trees/jarl@<the 6.2.0 commit>/skills/jarl/scripts/jarl.mjs`, with `--root` set to the open release.
- The Jarl the release changes lives in the development checkout and its worktrees, so the two can no longer be the same files.
- What `jarl-pinned-in-loop` had to arrange by hand for one release becomes the default.
- The installed Jarl plugin, which supplies the MCP tools, should be that same version. `ws status` warns when it is not.

**Repositories by name.** Jarl 6.2.0's 246 declares a loop's repositories once: name, path, base, check. The workspace's registry is that declaration for release loops.

- The release goal names `runes`, `yggdrasil` and the others.
- Their paths on this machine come from `ws.local.json`.
- So the committed record carries names, never relative climbs or absolute home paths.

This is a fit, not a dependency: Jarl does not read the registry.

**Closer to the code.** `jarl verify` (251) can run on the open loop in the workspace's CI. The release issue and the candidate manifest sit in one repository with one history.

**The record gets a git remote.** Today's one-disk risk ends for the family without putting anything private on GitHub.

**The cost.** The loops quote the owner verbatim, in Polish, and carry his rulings on everything. The loops quote the owner and carried absolute paths; they are scrubbed before publication.

- In a public workspace, the record is public. The name-free scan and the local token hook (section 1) catch names. What he is willing to say in public is his to judge.
- If he wants the record private, there are two honest options:
  - keep the loops private, still on one disk;
  - make the workspace private. The release workflows would then need a secret to read the verdict, and Actions minutes would no longer be free.

**Sessions elsewhere can still drive releases.** Such a session passes the workspace's release directory as `--root`, the same way it passes a tool repository's path today.
## 6. Name

GitHub was checked with `gh repo view krzysztofdudek/<name>` (read-only), and npm with `npm view`, on 2026-10-05. The workspace publishes nothing to npm (`"private": true`), so an unscoped npm name only matters if it is ever published. `@chrisdudek/<name>` is free for every candidate.

| Name | Rationale | `krzysztofdudek/<name>` | Elsewhere |
|---|---|---|---|
| **Althing** | "The assembly of all": the place where every party came once a year, the law was recited and disputes were judged. The family's register is already legal: law, rulings, testimony, ratification, Yggdrasil's court digest. The gods hold their daily judgment at Urd's well beneath Yggdrasil, and the family already has both. Unambiguous in prose ("Althing's verdict on 6.2.0 is green"). Honest note: it is also the name of Iceland's parliament today. | free | 69 repositories GitHub-wide carry it in their name; npm `althing` 0.0.1 is someone else's |
| **Thing** | The same assembly, in its plainest form, and the English word descends from it. | free | unsearchable, and ambiguous in every sentence ("run the thing"); npm `thing` is taken |
| **Naust** | The boathouse where longships are hauled up, repaired and fitted out between voyages: every ship of the fleet checked before it sails. | free | 35 repositories; npm free. An obscure word that needs explaining once |
| **Longhouse** | The hall where the whole family lived under one roof. Plain English. | free | 37 repositories; npm `longhouse` is taken. It says "home", while the job is proving |
| **Muster** | Plain English: to assemble for inspection, and "to pass muster". It describes the job exactly. | free | 2,501 repositories; npm `muster` is taken. Not Norse, though neither are Grain nor Horde |
| **Aett** | Old Norse *ætt*, "family, kin", and also the name of a row of eight runes in the futhark. The family is eight repositories sharing Runes. | free | 87 repositories; npm free. Tied to a count that has changed three times since September, easy to confuse with Runes, hard to spell and say |
| **Hird** | A jarl's sworn household, the people who travel with him. | free | 447 repositories; npm free. Obscure, and it makes the family Jarl's retinue, which inverts the canon (Yggdrasil is the heart, Jarl the loop) |

**Recommendation: Althing.**

- It is Norse, short enough, and plain once heard.
- It names exactly what the repository does: everyone assembles in one place and is held to the law that binds them.
- It sits naturally beside Yggdrasil and Urd, without the overuse of the best-known Norse names.

Second choice: **Muster**, if a plain English word is wanted over a Norse one. The CLI is `ws.mjs` and nothing in the code carries the name, so the choice can change without rework.

## 7. Migration, and the owner's part

### Steps

1. **The owner decides** (list below). Nothing starts before the name and the timing.
2. **In 6.2.0, under A:**
   - The jarl files W0–W6 and WF in the 6.2.0 loop, with `Files:` prefixed `Althing/…`.
   - The jarl re-homes 239 and 254–259, and records the revised D11 once the owner answers a-004.
   - W0 creates the local repository at `<repos>/Althing`: `git init` on `main`, local `user.email` set to `me@chrisdudek.com`, and `ws.local.json` pointing at the sibling checkouts.
3. **The owner creates the GitHub repository**, any time before 224's pushes. The jarl pushes `main` on his word, and `self` and `dev` start running.
4. **In 224:**
   1. `ws pin 6.2.0` after the pushes, then push the workspace.
   2. Record the candidate verdict on that commit.
   3. Tag in the skill's order.
   4. `ws verify-publish 6.2.0`; the manifest becomes `published`.
5. **After 6.2.0 closes:**
   - Move the canon and the sync check together, and the inventory as `ws inventory`.
   - Split the releasing skill.
   - Scrub the frozen loops and commit them after his read.
   - Jarl's `resume.test.mjs` drops its default path to a private loop in favour of `JARL_LIVE_LOOP` from `ws env`.
6. **6.3.0:**
   - The release opens in `releases/6.3.0/` on Jarl 6.2.0, through `ws jarl`.
   - The release workflows of Runes, Yggdrasil, Grain, Jarl and Horde gain the gate step, proven first on a dry run.

### Decisions only the owner can make

1. **The name.** Recommended: Althing.
2. **Visibility.** Recommended: public. Runners are free, the gate reads the verdict with no secret, and adopters can see the evidence. The alternative is private, with the costs in section 5.
3. **The release record.** Do the release loops move into the workspace from 6.3.0, knowing that his verbatim rulings then become public?
4. **Timing.** A, now and local-first (recommended), or B, after 6.2.0.
5. **D11, in the ratify batch a-004.** Answer it as changed: E and R stay in Runes; the stack scenario, the parity check and 254–259 go to the workspace.
6. **The canon.** Do the canon and its sync check move to the workspace after 6.2.0 (recommended), or do both stay where they are? They move together or not at all.

### What the owner does himself

The exact steps will be asked in the chat when the time comes. These are their contents:

- **Create the repository:** `gh repo create krzysztofdudek/Althing --public --description "The Yggdrasil family's workspace: one manifest per release, every repository at its exact commit, and the checks that prove they work together."`, then `gh repo edit krzysztofdudek/Althing --add-topic yggdrasil-family`. The default branch is `main`. A `main` ruleset like the other repositories' is optional.
- **Keep the defaults:** Actions enabled, and the default workflow token read-only. Each workflow asks for what it needs.
- **No secrets.**
- **No npm package and no marketplace entry.**
- **Later, and only if three hours of dev-mode delay ever matters:** one fine-grained token with Contents write on the workspace alone, stored as a secret in each tool repository for `repository_dispatch`. Not recommended now.
