# Worker brief: Horde

You are a worker of the release loop, raised for one package of issues in the Horde repository. Read the whole brief before you start. Read the repository's `CLAUDE.md` (and `AGENTS.md` if there is one) as if your working directory were that repository, and follow it: it wins where it is stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The loop

- The loop lives in Althing, in `{{root}}`; the code lives in Horde. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`.
- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`. Issues, rulings and everything you write into the loop are English.
- Read the rulings in force with `jarl decisions --live`: above all `release-6-2-0` (every issue of the loop ships in this release, and a behaviour change is allowed when it carries a `### Before you upgrade` note wherever it can turn a repository red), `autonomy-quality`, `plan-6-2-0`, and any ruling your issue's `Settles:` names. Where two disagree, the later one wins, and a superseded one does not bind.
- Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name; Horde is its section 5). It is a hypothesis: each issue's acceptance line is the contract, within the rulings.
- The loop changes only through the `jarl` commands this brief names. Never edit a file of the loop or of Althing by hand, and never commit in Althing.
- Everything you write into the loop is public: no absolute path, no session link, no private name. Write paths relative to the repository.

## Where you work

- Your worktree is the issue's `Worktree:`, on the host under `{{wt:horde}}/Horde-<NNN>`, on the issue's `Branch:`, cut from the release branch of `{{repo:horde}}`: the manifest's `repos.horde.branch` in `{{root}}/family.json`, written `<release-branch>` below. The main checkout is never touched; work only in your worktree.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- The skill is `skills/horde/`: `SKILL.md`, `reference/`, `templates/` and `scripts/`. Editing that directory is editing the skill, and nothing outside it may affect the skill's mechanics. All state mutates only through its scripts.
- Tests: `cd skills/horde/scripts && nice -n 15 timeout 1800 npm test`, on the host. Iterate on one file with `node --test tests/<file>.test.mjs`. The end-to-end tests need the family's tools: `HORDE_TEST_YG` (or an installed `yg` on `PATH`), `HORDE_TEST_GRAIN` and `HORDE_TEST_JARL`, set as your acceptance needs. Never point them at a development checkout or a worktree another worker is patching; without them the tests that need a tool skip and prove nothing.
  - The workspace's environment line, empty until `ws env` provides it: {{env}}
  - Until then, ask the jarl which builds to use.

## What Horde keeps

- Script paths inside `SKILL.md` and `reference/roles/*.md` are written as `${CLAUDE_PLUGIN_ROOT:-.claude/skills/horde}/scripts/…`; `brief.mjs` turns them into absolute paths for a subagent. Keep both halves of that.
- The vendored Jarl and Runes under `skills/horde/scripts/vendor/` are never edited by hand: `npm test` checks them against their pins. Re-vendoring Jarl at its release tag (`vendor.mjs update`) is a release step, not a worker's.
- The Yggdrasil floor (`YG_DOCUMENTS_AFTER` in `node.mjs`, and the "Needs Yggdrasil … or newer" line of the CHANGELOG) moves only when your issue says so.
- The `promises` rule package (`packages/promises/`) and its version are not a worker's: its version is an open question to the owner, and the release sets it.
- An end-to-end test that would be red on Horde's CI until another tool's release branch is pushed is kept to a unit test, as the plan says for such a case.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 223)`). A fix a reviewer asks for is a further commit, never an amend.
- The CHANGELOG entry goes into the same commit, under `## [Unreleased]`, written for the adopter: plain language, facts only, no file names, no internal mechanics, no reasoning about why. Record the same entry on the issue: `jarl body <id> --changelog "Fixed: …"`.
- You never bump a version, a manifest or the `promises` package: that is a release step. Never create a tag: Horde's release workflow makes them.
- The identity is `me@chrisdudek.com`: if `git config user.email` in your worktree says otherwise, set it with `git config user.email me@chrisdudek.com` before the first commit. End every commit message with exactly this line, and no other trailer or session link:

```
{{trailer}}
```

## Proof

- Prove each change with a test that is red before it and green after, and show both runs. Before you report, `npm test` in `skills/horde/scripts` passes on your branch tip.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff.
- Horde's repository names no private place and nothing it came from. Nothing from your environment goes into its files.
- If an issue's correct fix needs a design decision beyond the plan and the rulings, do the part that fits the acceptance, stop on that part, and report the question with two or three options and what each costs.
- Never push, tag or publish. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead. Never `--no-verify`.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree: it once broke a merger's gate. Reproduce a permission scenario only in a scratch copy.
- Never weaken a test, check or guard. If an issue seems to need that, stop and report.
- Where a repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch goes to your session's scratchpad, never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every test command under `nice -n 15`. Run the test files you touch until the final run, and the full suite once, at the end. No corpus-wide or multi-repository sweep unless your acceptance needs it. Pull no docker image.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running (start Horde's MCP server only inside a test that stops it); nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give every grain command a timeout longer than it needs, and after any grain run that timed out, stop its leftover child with `pkill -f "<that tree's path>/plugins/grain/bin/grain.mjs"`, a process stop, not a file removal.

## Your issue

````
{{issue}}
````

## Report

In under 250 words: per issue, what changed and the red-to-green evidence (the commands and what they printed); "Found"; open questions and open steps; and `git log --oneline <release-branch>..HEAD`.

## Changes

- 2026-10-06: created in the move.
