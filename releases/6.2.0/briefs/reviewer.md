# Added for an examiner in a family repository

`ws brief reviewer --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your depth, your six steps, the lines and every command, including the verdict. This file holds what the family adds, and nothing the tool's brief already says.

## The checkouts

Runes `{{repo:runes}}`, Yggdrasil `{{repo:yggdrasil}}`, Grain `{{repo:grain}}`, the driver Jarl `{{repo:jarl}}`, Althing `{{althing}}`. The release branch of each is its `branch` in `{{root}}/family.json`. The loop's own commands are `{{jarl}} <command> --root {{root}}`, on the host. Read the repository's `CLAUDE.md` and `AGENTS.md` for its conventions.

## Read-only

- Spawn nothing, edit nothing, commit nothing. Never `git checkout` or switch branches in a main checkout or a worktree: only the merger moves a release branch.
- Read the change where read-only git commands are fine: `git diff <release-branch>...<branch>`.
- To reproduce red before green, extract a tree into your scratch folder with `git archive <sha> | tar -x -C <folder>` and run the tests there. For Runes, run `npm ci && npm run check` in that extraction. For Yggdrasil, extract into the container's temporary directory and run there as user `node` (`docker exec -u node -w <that directory> yggdrasil-devcontainer <command>`); `{{exec:yggdrasil}}` reaches the container's main checkout for reading. For Grain, a test that needs Yggdrasil runs with `YG_BIN` and `GRAIN_CORPUS_CLONES` from the gate's environment, under `{{althing}}/.cache/legacy-grain-gate/`, whose `full-gate.sh` sets both, and never pointed at a development checkout.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch folder, never cloned into a checkout.
- Never `rm` in any form, never chmod or chown a checkout or worktree, never `git stash`.

## Beyond the six steps

Check the repository's own conventions the diff must follow: one issue per commit with its subject naming the issue, a reviewer's fix as a further commit and never an amend, the changelog entry or its fragment on the issue, generated files rebuilt (Runes' `dist/`), counts and revs raised where the rules say, and no weakened test, check, guard, threshold or hook.

## Load and bounded commands

Run every test, build or check under `nice -n 15` (inside the container, after its name). Run the test files the change touches; a full suite only where a line needs it, once. Every command is bounded: `timeout` on anything that can run long (inside the container the `timeout` goes after the container's name), no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`), no sleep or polling, no server left running, nothing that waits for a prompt. A step that needs any of that is recorded as open in your answer, and the rest of the examination continues.

A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours: give it a timeout longer than it needs, and after one that timed out, stop its child with `pkill -f "<that tree's path>/plugins/grain/bin/grain.mjs"`.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
- 2026-11-09: the tool's own brief now holds the examiner's role, depth, steps and verdict, and this file holds only what the family adds (the loop moved to Jarl 6.3.0).
