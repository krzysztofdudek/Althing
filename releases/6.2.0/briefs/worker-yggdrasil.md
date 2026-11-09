# Added for a worker in the Yggdrasil repository

`ws brief worker --repo yggdrasil --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about the Yggdrasil repository. Read that repository's `CLAUDE.md` and `AGENTS.md` as if your working directory were that repository: they win where they are stricter than this file.

## The loop

The loop lives in Althing, in `{{root}}`, and the code in Yggdrasil. The loop's commands are `{{jarl}} <command> --root {{root}}`, run on the host, never in the container. Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name). It is a hypothesis: each acceptance line is the contract, within the rulings.

## Where you work

- Yggdrasil is developed only inside its devcontainer, `yggdrasil-devcontainer`, which must be running. `{{exec:yggdrasil}}` runs a command in the container's main checkout, which is the host's `{{repo:yggdrasil}}` mounted into the container. You never touch the main checkout: it stays on the release branch, and only the merger moves it.
- Your worktree is a container path under `{{wt:yggdrasil}}/`, on your lease's branch. The jarl created it with `git worktree add --lock --reason devcontainer`, cut from the release branch: the manifest's `repos.yggdrasil.branch` in `{{root}}/family.json`. The lock keeps the host from reading the container's worktree as gone: seen from the host its path does not exist, so it would look prunable.
- Run every command in the container as user `node`, in your worktree: `docker exec -u node -w <your worktree> yggdrasil-devcontainer <command>`, and for a pipeline `docker exec -u node -w <your worktree> yggdrasil-devcontainer bash -lc '<pipeline>'`. As root, the permission tests pass falsely, Chromium is missing, and root-owned files land in the shared volumes.
- Never stop or restart the container. Never prune worktrees, from the host or from the container. Never run `npm ci` or `npm install` in the shared volumes of the main checkout, because another worker's hook may be running. Leave the worktree `{{wt:yggdrasil}}/514-pkg` and the branch `jarl/514-pkg-redaction-contracts` alone: that work was deferred by the owner.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- Setup and mechanics are section 5 ("Repo mechanics") of `{{root}}/plans/plan-yggdrasil.md`, as corrected by the last section of the release plan: the dependency links, `dist/` built in your own tree, and your worktree's own `node source/cli/dist/bin.js`, never the global `yg`, which runs the main checkout's unpatched build. Run `node source/cli/dist/bin.js prime` from your worktree for the graph protocol. Verify each step as you go; if the plan is wrong, do what the repository's docs say and report the difference.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 004)`). A fix a reviewer asks for is a further commit, never an amend.
- The graph stays green the way the repository requires: `yg log add` on each touched node of a `log_required` type, its reason a self-contained why with no file paths, issue numbers or plan references; every new file mapped; then `node source/cli/dist/bin.js check --approve --only-deterministic`. Never the bare `--approve`: it launches the reviewer. If a commit needs a reviewer pair that only the reviewer can verify, do not commit: record the step as open in your report (which pair, which file) and go on with the rest.
- The CHANGELOG line goes into the same commit, under the existing `## [Unreleased]` heading, as a bullet under `### Fixed`, `### Security`, `### Added` or `### Changed`, and under `### Before you upgrade` when the change can turn a repository red. It is written for the people who use Yggdrasil: commands, flags, keys and visible output, never module, function or file names. `CHANGELOG.md` merges by union, so a repeated subheading is expected and is tidied in the final pass. Record the same entry on the issue through the tool's changelog command.
- The pre-commit hook runs the full `scripts/repo-check.sh`: about fifteen minutes, longer under load. Do not run it by hand before a commit; let the commit run it, in the foreground, with the limits inside the container: `docker exec -u node -w <your worktree> yggdrasil-devcontainer nice -n 15 timeout 1800 git commit …`. A `timeout` put around `docker exec` on the host stops only the client and leaves the command running in the container. A commit that times out did not happen: record it as open.
- The identity is `me@chrisdudek.com`. A commit carries no trailer naming an agent and no session link.
- You never bump a version or refresh the digest labels: that is the final pass.

## Coverage

The release branch sits close to the 90% branch-coverage gate, and a package that adds untested branches fails the merge. Before you report done, `git merge <release-branch>` into your branch and make sure the full hook on your last commit shows branch coverage of at least 90.2%, by real tests for the branches you added or changed, never by lowering a threshold or adding coverage-ignore comments.

## Standing rules

- Never push, tag, publish, merge into another branch, or use `git stash`, `--no-verify`, `rm` in any form, or chmod and chown on a checkout or worktree. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never weaken a test, check, rule, aspect or hook. Never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Reproduce a permission scenario only in a scratch copy (`git archive` into the container's temporary directory). Scratch goes to the container's temporary directory, or to a `mktemp -d` folder on the host, never into a checkout or a worktree.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.
- Every command is bounded: `timeout` on anything that can run long (`timeout 1800` for a full hook or suite, inside the container after its name), no LLM-reviewed verdict, no sleep or polling, no server left running, nothing that waits for a prompt. Run every test, build or check under `nice -n 15`; the files you touch until the final run, and the full suite once, at the end. A step that would need any of that is recorded as open in your report.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give it a timeout longer than it needs, and after one that timed out, stop its child with `pkill -f "<that worktree's path>/plugins/grain/bin/grain.mjs"`.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
- 2026-11-09: the tool's own brief now holds the role, the lines and every command, and this file holds only what the family adds about this repository (the loop moved to Jarl 6.3.0).
