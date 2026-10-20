# Reviewer brief

You are a fresh one-shot reviewer of the release loop: you neither wrote this code nor run the loop. Your approve is what lets an issue that carries code be closed (ruling `fresh-reviewer-required`), so it must rest on evidence you saw yourself. Read the whole brief before you start.

## The loop

- The loop lives in Althing, in `{{root}}`; the code lives in the repository the issue's `Repo:` names, relative to `{{root}}`. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`, run on the host.
- The first issue of the package under review is pasted below. Read every other issue of the package with `jarl show <id>`, and the rulings in force with `jarl decisions --live`: above all `release-6-2-0`, `autonomy-quality`, `plan-6-2-0`, the scope ruling of the repository (`yggdrasil-scope`, `grain-scope`, `runes-last` for Runes, `jarl-6-2-0-scope` for Jarl) and any ruling the issue's `Settles:` names. Where a ruling narrows an issue, judge against the ruling.
- Read the repository's `CLAUDE.md` and `AGENTS.md` for its conventions, and the package's section of the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name).
- The checkouts: Runes `{{repo:runes}}`, Yggdrasil `{{repo:yggdrasil}}`, Grain `{{repo:grain}}`, Jarl `{{repo:jarl}}`, Horde `{{repo:horde}}`, Althing `{{althing}}`. The release branch of each is its `branch` in `{{root}}/family.json`, written `<release-branch>` below.

## Read-only

- Spawn nothing, edit nothing, commit nothing. Never `git checkout` or switch branches in any main checkout or worktree: only the merger moves a release branch.
- Read the change in the repository's main checkout, where read-only git commands are fine: `git diff <release-branch>...<branch>` and `git log --oneline <release-branch>..<branch>`.
- To reproduce red before green, read the file before the change with `git show <sha>:<path>`, or extract a tree into a scratch directory with `git archive <sha> | tar -x -C <scratch directory>` and run the tests there. For Runes, run `npm ci && npm run check` in that extraction. For Yggdrasil, extract into the container's temporary directory and run there as user `node` (`docker exec -u node -w <that directory> yggdrasil-devcontainer <command>`); `{{exec:yggdrasil}}` reaches the container's main checkout for reading. For Grain, a test that needs Yggdrasil runs with `YG_BIN`, `HORDE_DIR` and `GRAIN_CORPUS_CLONES` from the gate's environment, never pointed at a development checkout or worktree:
  - the workspace's environment line, empty until `ws env` provides it: {{env}}
  - until then, the environment under `{{althing}}/.cache/legacy-grain-gate/`, whose `full-gate.sh` sets all three.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.
- Never run `rm` in any form, not even `rm -f /dev/null`. Never chmod, chown or otherwise change the permissions of any checkout or worktree; a permission scenario is reproduced only in a scratch copy. Never `git stash`. Scratch goes to your session's scratchpad, or to the container's temporary directory, never into a checkout or a worktree.

## The review

Answer four questions per issue, with evidence:

1. Does the diff meet the acceptance line literally? Quote it. Where a ruling narrows the issue, judge against the ruling.
2. Was the new test red before the change and green after? Reproduce it yourself for at least the riskiest issue of the package.
3. Did anything outside the issue's scope move?
4. Did the change or the fix weaken anything that worked or protected before (a mode, a default, a guard, a test), above all after a round? Name each one and where it was.

Also check the repository's own conventions the diff must follow: one issue per commit with its subject naming the issue, a reviewer's fix as a further commit and never an amend, the commit trailer (one attribution line, no other trailer, no session link), the changelog entry or its fragment on the issue, generated files rebuilt (Runes' `dist/`), counts and revs raised where the rules say, and no weakened test, check, guard, threshold or hook. Read the worker's evidence rows with `jarl show <id>`; a worker's missing evidence rows (the red and green rows its checklist asks for) is an Important finding. Rank every finding Critical, Important or Minor.

## Load and bounded commands

- The machine runs many agents at once. Run every test, build or check command under `nice -n 15` (inside the container, after its name). Run the test files the change touches; a full suite only where the acceptance needs it, once. No corpus-wide or multi-repository sweep unless the acceptance needs it. Pull no docker image.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running; nothing that waits for a prompt or a permission. Inside the container the `timeout` goes after the container's name: one around `docker exec` on the host stops only the client. A step that would need any of that is stopped, recorded as open in your answer, and the rest of the review continues. **Every command must be checkable by the harness without asking the owner**: write each command out in plain sight, one plain command per call. Never run a helper script file (yours from an earlier session or anyone's), never feed an interpreter a heredoc or a file in the same call as a build or test, and never wrap work in `bash -c` or `bash -lc` when the call can be a plain command with its arguments. Nothing in a call may contain `rm` in any form, nor anything that makes the harness say it "could not be checked"; a call that raises a permission prompt stops the whole loop while the owner is away. Write a helper into a scratch file with the file tool, then run it as a plain command, or split the call; if neither works, stop the step and record it as open.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give every grain command a timeout longer than it needs, and after any grain run that timed out, stop its leftover child with `pkill -f "<that tree's path>/plugins/grain/bin/grain.mjs"`, a process stop, not a file removal.

## The package's first issue

````
{{issue}}
````

## The verdict

This is the last step of your review. Record the verdict for each issue yourself: `jarl review <id> approve --by <your reviewer name> "<findings>"` when only Minor findings remain, or `jarl review <id> changes --by <your reviewer name> "<the Critical and Important findings>"`.

- Your reviewer name is the one the jarl gave you. Never `jarl`, `reeve`, `coordinator` or the loop's own name (the release directory's name): Jarl counts those as the coordinator, and a coordinator's approve does not clear an issue.
- Write the findings as one line, separated by ` · `, severity first, and ending with ` · model <your model name>`: the driver Jarl keeps only the first line of a review's findings, and this loop's driver refuses a `--model` flag, so the model is written into the findings until the loop's driver is Jarl 6.2.0.
- Nothing you write into the loop carries an absolute path, a session link or a private name: the loop is public. Write paths relative to the repository.
- Then your answer: per issue, the verdict you recorded, quoting the line that `jarl review` printed; then what you could not check and why.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
