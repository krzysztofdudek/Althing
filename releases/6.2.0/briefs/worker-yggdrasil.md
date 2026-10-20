# Worker brief: Yggdrasil

You are a worker of the release loop, raised for one package of issues in the Yggdrasil repository. Read the whole brief before you start. Read the repository's `CLAUDE.md` and `AGENTS.md` as if your working directory were that repository, and follow them: they win where they are stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The loop

- The loop lives in Althing, in `{{root}}`; the code lives in Yggdrasil. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`, run on the host, never in the container.
- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`. Issues, rulings and everything you write into the loop are English.
- Read the rulings in force with `jarl decisions --live`: above all `release-6-2-0` (every issue of the loop ships in this release, and a behaviour change is allowed when it carries a `### Before you upgrade` note wherever it can turn a repository red), `autonomy-quality`, `plan-6-2-0`, `yggdrasil-scope`, and any ruling your issue's `Settles:` names. Where two disagree, the later one wins, and a superseded one does not bind.
- Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name), and the design section it points to. It is a hypothesis: each issue's acceptance line is the contract, within the rulings.
- The loop changes only through the `jarl` commands this brief names. Never edit a file of the loop or of Althing by hand, and never commit in Althing.
- Everything you write into the loop is public: no absolute path, no session link, no private name. Write paths relative to the repository.

## Where you work

- Yggdrasil is developed only inside its devcontainer, `yggdrasil-devcontainer`, which must be running. `{{exec:yggdrasil}}` runs a command in the container's main checkout, which is the host's `{{repo:yggdrasil}}` mounted into the container. You never touch the main checkout: it stays on the release branch, and only the merger moves it.
- Your worktree is the issue's `Worktree:`, a container path under `{{wt:yggdrasil}}/`, on the issue's `Branch:`. The jarl created it with `git worktree add --lock --reason devcontainer`, cut from the release branch: the manifest's `repos.yggdrasil.branch` in `{{root}}/family.json`, written `<release-branch>` below. The lock keeps the host from reading the container's worktree as gone: seen from the host its path does not exist, so it would look prunable.
- Run every command in the container as user `node`, in your worktree: `docker exec -u node -w <your worktree> yggdrasil-devcontainer <command>`, and for a pipeline `docker exec -u node -w <your worktree> yggdrasil-devcontainer bash -lc '<pipeline>'`. As root, the permission tests pass falsely, Chromium is missing, and root-owned files land in the shared volumes.
- Never stop or restart the container. Never prune worktrees, from the host or from the container: seen from the host, a container worktree looks prunable and is not. Never run `npm ci` or `npm install` in the shared volumes of the main checkout, because another worker's hook may be running. Leave the worktree `{{wt:yggdrasil}}/514-pkg` and the branch `jarl/514-pkg-redaction-contracts` alone: that work was deferred by the owner.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- Setup and mechanics are section 5 ("Repo mechanics") of `{{root}}/plans/plan-yggdrasil.md`, as corrected by the last section of the release plan: the dependency links, `dist/` built in your own tree, and your worktree's own `node source/cli/dist/bin.js`, never the global `yg`, which runs the main checkout's unpatched build. Run `node source/cli/dist/bin.js prime` from your worktree for the graph protocol. Verify each step as you go; if the plan is wrong, do what the repository's docs say and report the difference.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 004)`). A fix a reviewer asks for is a further commit, never an amend.
- The graph stays green the way the repository requires: `yg log add` on each touched node of a `log_required` type, its reason a self-contained why with no file paths, issue numbers or plan references; every new file mapped; then `node source/cli/dist/bin.js check --approve --only-deterministic`. Never the bare `--approve`: it launches the reviewer. If a commit needs a reviewer pair that only the reviewer can verify, do not commit: record the step as open in your report (which pair, which file) and go on with the rest.
- The CHANGELOG line goes into the same commit, under the existing `## [Unreleased]` heading, as a bullet under `### Fixed`, `### Security`, `### Added` or `### Changed`, and under `### Before you upgrade` when the change can turn a repository red. It is written for the people who use Yggdrasil: commands, flags, keys and visible output, never module, function or file names. `CHANGELOG.md` merges by union, so a repeated subheading is expected and is tidied in the final pass. Record the same entry on the issue: `jarl body <id> --changelog "Fixed: …"`.
- The pre-commit hook runs the full `scripts/repo-check.sh`: about fifteen minutes, longer under load. Do not run it by hand before a commit; let the commit run it, in the foreground, with the limits inside the container: `docker exec -u node -w <your worktree> yggdrasil-devcontainer nice -n 15 timeout 1800 git commit …`. A `timeout` put around `docker exec` on the host stops only the client and leaves the command running in the container. A commit that times out did not happen: record it as open.
- The identity is set (`me@chrisdudek.com`). End every commit message with exactly this line, and no other trailer or session link:

```
{{trailer}}
```

## Proof

- Prove each change with a test that is red before it and green after: run the test files you touch, before and after, and show both runs.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.
- The release branch sits close to the 90% branch-coverage gate, and a package that adds untested branches fails the merge. Before you report done, `git merge <release-branch>` into your branch and make sure the full hook on your last commit shows branch coverage of at least 90.2%, by real tests for the branches you added or changed, never by lowering a threshold or adding coverage-ignore comments.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff.
- You never bump a version or refresh the digest labels: that is the final pass, the jarl's.
- If an issue's correct fix needs a design decision beyond the rulings, do the part that fits the defect, stop on that part, and report the question with two or three options and what each costs.
- Never push, tag or publish. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead. Never `--no-verify`.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree: it once broke a merger's gate. Reproduce a permission scenario only in a scratch copy (`git archive` into the container's temporary directory).
- Never weaken a test, check, rule, aspect or hook. If an issue seems to need that, stop and report.
- Never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch goes to the container's temporary directory, or to your session's scratchpad on the host; never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every test, build or check command under `nice -n 15`, inside the container after its name. Run the test files you touch until the final run, and the full suite once, at the end. No corpus-wide or multi-repository sweep unless your acceptance needs it. Pull no docker image.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full hook or suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running; nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues. **Every command must be checkable by the harness without asking the owner**: write each command out in plain sight, one plain command per call. Never run a helper script file (yours from an earlier session or anyone's), never feed an interpreter a heredoc or a file in the same call as a build or test, and never wrap work in `bash -c` or `bash -lc` when the call can be a plain command with its arguments. Nothing in a call may contain `rm` in any form, nor anything that makes the harness say it "could not be checked"; a call that raises a permission prompt stops the whole loop while the owner is away. Write a helper into a scratch file with the file tool, then run it as a plain command, or split the call; if neither works, stop the step and record it as open.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give every grain command a timeout longer than it needs, and after any grain run that timed out, stop its leftover child with `pkill -f "<that worktree's path>/plugins/grain/bin/grain.mjs"`, a process stop, not a file removal.

## Your issue

````
{{issue}}
````

## Report

In under 300 words: per issue, what changed and the red-to-green evidence (the commands and what they printed); "Found"; open questions and open steps; and `git log --oneline <release-branch>..HEAD`.

## Checklist

Before you send the report, check each item. An item not done is an open step in the report, never a silent gap.

- The work is committed: every commit the brief asks for exists on your branch, its subject naming the issue, ending with the trailer line.
- Red and green are recorded as jarl evidence rows, `jarl evidence <id> --ran "<command>" --saw "<what it printed>"`, one for the red run and one for the green run of each test the issue names.
- Every check the brief names was waited for to its end: a run cut short by a timeout or a stop is not a result, and it is recorded as open.
- The changelog entry is written where this brief names one, and recorded on the issue with `jarl body <id> --changelog "…"`; a brief that names none has nothing to write here.
- No loop issue number appears in code, comments, tests, docs or graph entries: the number lives only in the commit subject, because the loop ends and the number then points nowhere.
- The report is sent, in the length the Report section gives.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
