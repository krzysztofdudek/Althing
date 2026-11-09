# Added for a worker in the Grain repository

`ws brief worker --repo grain --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about the Grain repository. Read that repository's `CLAUDE.md` and `AGENTS.md` as if your working directory were that repository: they win where they are stricter than this file.

## The loop

The loop lives in Althing, in `{{root}}`, and the code in Grain. The loop's commands are `{{jarl}} <command> --root {{root}}`. Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name). It is a hypothesis: each acceptance line is the contract, within the rulings.

## Where you work

- Your worktree is on the host under `{{wt:grain}}/Grain/<name>`, on your lease's branch, cut from the release branch of `{{repo:grain}}`: the manifest's `repos.grain.branch` in `{{root}}/family.json`. The main checkout is never touched.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- Mechanics are section 5 ("Repo mechanics") of `{{root}}/plans/plan-grain.md`, as corrected by the last section of the release plan. Verify each step as you go; if the plan is wrong, do what the repository's docs say and report the difference.
- Tests: `npm test` in `plugins/grain`. Iterate on one file with `node --import ./tests/git-env.mjs --test tests/<file>.test.mjs` from `plugins/grain`.
- Where your acceptance needs Yggdrasil or the corpus, run with `YG_BIN` and `GRAIN_CORPUS_CLONES` set from the gate's environment, under `{{althing}}/.cache/legacy-grain-gate/`, whose `full-gate.sh` sets both. If it is missing, stop and report; never improvise one. Without `YG_BIN` the tests that need Yggdrasil skip and prove nothing.
- Never point `YG_BIN` at `{{repo:yggdrasil}}` or a worktree of it: its own workers are patching it.
- Never run `grain` with `{{althing}}` or any other checkout as its repository or working directory. Every grain run targets a scratch repository or your worktree.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 036)`). A fix a reviewer asks for is a further commit, never an amend. One new test file per issue, named for what it proves, unless the acceptance names an existing one.
- Shared files are written once, in the final pass. You do not edit `CHANGELOG.md`, the version stamps (`EXTR_V`, `HIST_V`, `MODEL_V` in `engine/config.mjs`) or the shared docs pages the plan reserves for that pass. A stamp your change needs is a `Needs: EXTR_V|HIST_V|MODEL_V` line in the commit body with one sentence of reason; a doc change is a `Docs:` line there with the exact delta. Record each issue's user-visible entry on the issue through the tool's changelog command, in the adopter's language, one line, saying so when it can turn a repository red. Record each doc change as a note on the issue. If the repository's own rules require a doc or test-count update in the same commit, do it and say so.
- Never edit `engine/vendor/runes`: the offline gate compares it byte for byte with the pin. The one exception is the package whose plan section is the Runes pickup.
- The identity is `me@chrisdudek.com`. A commit carries no trailer naming an agent and no session link.

## Standing rules

- Everything you write into the loop is public and English: no absolute path outside a `Worktree:` field, no session link, no private name.
- Before you report, `npm test` passes on your branch tip, with `YG_BIN` where your acceptance needs it, run in the foreground under `timeout`.
- Never push, tag, publish, merge into another branch, or use `git stash`, `--no-verify`, `rm` in any form, or chmod and chown on a checkout or worktree. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never weaken a test, check or guard. Where the repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch and a permission scenario go in a `mktemp -d` folder under the system temporary directory, never into a checkout or a worktree.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch folder, never cloned into a checkout.
- Every command is bounded: `timeout` on anything that can run long (`timeout 1800` for a full suite or gate), no LLM-reviewed verdict, no sleep or polling, no server left running, nothing that waits for a prompt. Run every test, build or check under `nice -n 15`; the files you touch until the final run, and the full suite once, at the end. A step that would need any of that is recorded as open in your report.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give it a timeout longer than it needs, and after one that timed out, stop its child with `pkill -f "<that worktree's path>/plugins/grain/bin/grain.mjs"`.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
- 2026-11-09: the tool's own brief now holds the role, the lines and every command, and this file holds only what the family adds about this repository (the loop moved to Jarl 6.3.0).
