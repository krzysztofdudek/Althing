---
name: releasing-the-family
description: Use when a session opens, plans, renumbers, ships or closes a release of the Yggdrasil family (the core - Yggdrasil, Grain, Jarl; the add-ons - Ratatoskr, Urd, Researcher; Runes, their shared code) or a patch of any one of them - a version number is named, the owner says to start, ship, publish or renumber a release, or release work is to be planned or filed. Applies whatever language the request is in.
---

# Releasing the family

A release is designed and run from Althing as one permanent Jarl loop in its release directory, `releases/<version>/`, which stays as the release's record (rulings `releases-run-as-jarl-loops`, `loop-in-release-directory`). The loop holds the backlog, the rulings and the evidence; the manifest `releases/<version>/family.json` holds the repositories, versions, branches, commits and checks. The open loop's `decisions.md` wins over this skill. How a loop is run is [directing-a-release-loop](../directing-a-release-loop/SKILL.md); this skill is the release itself. Below, `ws` is `node workspace/ws.mjs`.

## Versions

- The core (Yggdrasil, Grain, Jarl) ships on one version number (`family-composition`, without Horde since `horde-leaves-the-family`). Jarl has been on it since 6.1.0 (`blocks-and-composer`): its manifests and CHANGELOG heading are bumped with the core's, and a release in which Jarl does not change still gets a Jarl section that says so.
- The add-ons (Ratatoskr, Urd, Researcher) keep their own numbers. An add-on with work in the release ships at its own next number.
- Runes is shared code, not a member: it has its own semver, and a release pins the Runes version the core consumes.
- "Release X" is the core's number.

## What needs the owner's word

Publishing (npm, plugin marketplaces, GitHub releases); creating or moving a tag; pushing to a tool repository; merging a release branch into a tool's `main`; starting the release issue; deleting remote branches; dispatching a release workflow; changing GitHub descriptions, topics or settings. Pushes follow the open loop's rulings: a standing permission is recorded per branch, as a ruling that names it (`runes-push-branch` named Runes' `release/1.1.0` and nothing else), and without one every push is his word. The release issue starts only on his word, never on its own once the rest of the backlog looks done (`release-last-on-owner-word`).

## Session start

1. `ws status`: each repository's branch, HEAD, the manifest's version, the latest tag and `[Unreleased]`, and the loop's counts. It replaces fetching and noting by hand; fetch a checkout first when its remote may have moved, because stale refs make problems that do not exist. The installed plugins are the last released versions, not the code being worked on.
2. The open release is the release directory whose manifest is `open` or `candidate`. Boot it with `ws jarl resume`.
3. A new version number named while a release is open is a question for the owner (renumber, or the next one after?), filed with `ws jarl ask`, never a second loop (`one-loop-per-directory`).

Worktrees never go into the system temporary directory (`worktrees-outside-tmp`): the host's rules decide where working copies and temporary files live (`host-rules-place-worktrees-and-scratch`), worktrees under `~/Worktrees/<Repository>/<name>` and scratch in a `mktemp -d` folder under the system temporary directory; environments come from `ws env` once the workspace packages add it.

## Opening a release

```
ws release open <version> --previous <previous> --goal "<the goal in the owner's words, translated and marked>" [--version <repo>=<x.y.z>]... [--driver-sibling <commit> [--driver-source <name>]]
```

It writes `releases/<version>/family.json` (state `open`, every commit `null`), the Yggdrasil nodes of the release, the permanent loop (`init --permanent`, which holds `Format: 4`) with one `Check (<name>):` line per repository, Althing's bare, taken from the manifest's `check` entries, and the release issue, tagged `release, needs-owner`, its lines written with their methods. The driver Jarl that writes the loop's record is the Jarl of the previous release, run from its tag's tree, so the Jarl a release changes is never the Jarl that writes its record; until the workspace builds those trees, pin a sibling checkout's commit with `--driver-sibling`, and never switch that checkout's branch during the release (`jarl-pinned-in-loop`).

The release issue is found by its tags, never by its number: a session starting cold runs `ws jarl list --tag release`.

Then the goal gets the assumptions (what is already released, which repositories take part), and `releases/<version>/briefs/` gets what the family adds to the tool's own brief for each role (`ws brief` prints the tool's brief, then these): placeholders for every machine value, one coherent file per role, changed by rewriting with a line in its "Changes" list.

## Planning

- A planner's read-only pass writes its plan into `releases/<version>/plans/`. An architect reviews any tool whose format or contract changes.
- Every question to the owner goes through `ws jarl ask` before it is shown to him, one topic per turn: the context with `file:line`, the question, two or three options with their costs. His reply goes through `ws jarl answer`, never only the host's choice window or the chat, so the record holds it. A provisional decision taken under a mandate is `ws jarl decide --by jarl` plus `ws jarl ask --kind ratify --by jarl` in the same move. A question's options are written into its text.
- Raw input he did not write (a mission report, a bug list) goes verbatim into `research/YYYY-MM-DD-<slug>/source.md` before anything else is written, translated and marked if it is not English, and distilled first if it comes from private work. The check of every item against the code goes beside it as a triage, citing `file:line`; what survives becomes issues in the loop, written generically.
- Everything planned or being done is an issue, filed directly (`findings-become-issues`). Issues of every family repository live only in Althing's loops (`issues-live-in-althing`).

## Renumbering

When the owner changes the number of an open release:

1. A ruling first, with his words or his option label: `ws jarl decide <slug> "…" --by owner`.
2. `git mv releases/<old> releases/<new>`, and `git mv` its node directories (`.yggdrasil/model/release-<old>` and `release-<old>-loop`) to the new version's names; then the manifest's `release`, versions, branches and tags, then `ws release nodes <new>` and `ws index`.
3. The goal is amended citing the ruling, which is his word.
4. The briefs are re-rendered; nothing in a template names a version that is not a placeholder.
5. In each tool repository, the release branch is renamed on his word, and its push is his word too.

## Patches

A patch (x.y.Z) of one repository is a patch backlog of its own: a release directory `releases/<x.y.Z>/`, a manifest that moves that one repository, its own loop. Never a second loop in an open release's directory. The repository patches on its own `release/<x.y.Z>` branch cut from its `main`, with its own CHANGELOG section, under its own operating doc. The real-repository corpus gate runs on it as on a release, and it ships only on the owner's word: then it is that repository's own merge to `main` and its own release workflow. The next family release picks the patch up as its base.

## Shipping

The release issue walks these steps in order. Each step has its precondition, and each is recorded as an evidence row on the release issue.

1. **CI green on the exact commit.** Every repository's `release/<version>` tip is green before anything reaches `main`. After every Yggdrasil push, re-run the latest Grain CI on its release branch: its suite builds Yggdrasil from its branch and does not re-run on its own.
2. **Cross-surface truth.** On Yggdrasil's release tip, in `source/cli`, `npm run surface-truth` is green: the docs site, the knowledge topics, `yg prime`, the schema references and `--help` all say what the CLI does. Every drift it finds is an issue fixed on the release branch before the tag, never waived.
3. **The corpus gate.** Runes' corpus (`npm run corpus`) and the candidate run of the workspace (`ws run candidate <version>`, once the workspace packages land) are green on the manifest's pinned commits: real public repositories at fixed commits, every language the family claims, as coarse end-to-end smoke tests of the whole stack. Krzysztof, 2026-10-02 (translated from Polish): "external repositories pinned at a specific commit could simply be a fixture […] such coarse smoke tests for the whole stack"; "I used to do it this way." An unexplained lost edge, a false edge, a refused adoption or a disagreement with a language's own resolver blocks the tag. Until `ws run candidate` exists, the verdict is read by a person and recorded on the release issue against the commit that names the release's commits.
4. **The manifest becomes a candidate.** Every repository's `commit` is filled with the full commit being shipped, `state` becomes `candidate`, and Althing's `main` carries that commit.
5. **Bump commits** on each `release/<version>`, one per repository, each green: Yggdrasil `source/cli/package.json` and its CHANGELOG heading (the digest labels regenerated); Jarl's manifests and CHANGELOG heading; Grain's manifests and its engine version; each add-on's manifests, CHANGELOG heading and compare links.
6. **The order to `main`**, each on the owner's word, each only after the one before it is done:
   1. **Runes on npm.** Pushing a Runes tag is the whole Runes release, done by the owner; agents never tag Runes. Its first npm publish (1.0.0) is history.
   2. **Yggdrasil pins it.** In `source/cli`: `npm install @chrisdudek/runes@<version> --save-exact`; the lock resolves from `registry.npmjs.org`; `node scripts/runes-pin.mjs --publish` is green; the transitional "until Runes is on npm" point is gone from the CHANGELOG; committed on `release/<version>`, green. Then Yggdrasil reaches `main`.
   3. **Jarl.**
   4. **Grain.**
   5. **The add-ons**, each at its own number.
   No dependabot merge happens in between. The `main` rulesets allow only squash or rebase through a pull request, so the fast-forward is `git push origin <sha>:main` with the admin bypass, on the owner's word.
7. **Verify the publish, never trust a green run.** A fast-forward carrying more than 300 files may not trigger a `paths:`-filtered workflow: check `gh run list`, and ask the owner to dispatch the release workflow when it is missing. Then `npm view @chrisdudek/yg dist-tags`, the GitHub releases, and each add-on's tag and release (an add-on workflow succeeds silently without releasing when its heading was not bumped).
8. **A publishing workflow pins its npm**, never `npm@latest`: a newer npm once blocked a dependency's install script and failed a publish that CI had shown green. Before a release, check that both publishing workflows (Yggdrasil, Runes) still pin. A fix pushed after the tag is published by dispatching the release on `main`; the tag stays where it was.
9. **The manifest is published.** `state` becomes `published`, and the manifest is frozen with the release at closing.
10. **Cleanup last**, on the owner's word for anything remote: the remote `release/<version>` branches only after every `main` is green (`remote-keeps-main-and-release`: a remote keeps only `main`, the release branch and the branches of open pull requests; a branch with unique content goes to `refs/archive/<date>/` in the local clone first); worker branches and worktrees under `~/Worktrees/` and inside the Yggdrasil container.

## Closing

1. `ws jarl close --batch --by jarl`: files the ratification batch and closes nothing, so the owner can answer before the loop goes.
2. `ws jarl close --by jarl`: refuses while anything is open or in progress; for a permanent loop it appends the closing line and keeps the directory.
3. The ledger pass: every ruling of the loop that outlives the release gets a pointer entry in `method/rulings.md` (its slug, date, status and origin `releases/<version>`), checked by the rail `rulings/ledger`.
4. `ws freeze releases/<version>`: the whole directory, loop included, is held byte for byte from then on.

## Where work lives

- **Branches.** In each tool repository the work goes to `release/<version>`, cut from `main` and pushed when its first issue starts, on the owner's word. Worker branches `jarl/NNN-slug` are cut from it, one worktree each, never pushed.
- **Commits.** On a worker branch each issue lands as its own commit whose subject names that one issue, and each fix a reviewer asks for is a further commit, never an amend, so any issue can be reverted and bisected alone. A package is several commits on one branch, never one commit carrying several issues. The loop's own state is committed on Althing's `main`.
- **Yggdrasil runs in its devcontainer** (`yggdrasil-in-devcontainer`); every other repository runs on the host ([environment](../../../method/environment.md)).
- **Each repository's check** is the one its manifest entry names and its own operating doc describes. Code and everything an adopter reads is English, with a CHANGELOG entry under `[Unreleased]`, and so is everything in the loop ([language](../../../method/language.md)).
- **Machine documents.** The core's machine documents (`yg-check/1`, `yg-context/1`, `grain-advice/1` and the rest) are registered on Yggdrasil's Family Contracts page; an issue that changes one names every consumer.
- **The add-ons are optional.** No core tool assumes they are installed.
