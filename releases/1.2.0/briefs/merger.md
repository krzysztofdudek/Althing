# Added for the merger of the Runes 1.2.0 loop

`ws brief merger --release 1.2.0` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds the merging procedure, the three cases of a red check and every command. This file says where Runes merges and what it needs. Read Runes' `CLAUDE.md`: it wins where it is stricter.

The loop lives in Althing, in `{{root}}`; the manifest `{{root}}/family.json` names the release branch, `release/1.2.0`, and the check, `npm run check`, which the goal repeats as `Check (Runes):`. The loop's commands are `{{jarl}} <command> --root {{root}}`, on the host. The order of merges and the shared files are in `{{root}}/plans/plan-runes-1.2.0.md`.

## Where Runes merges

In the merge worktree `{{wt:runes}}/Runes/release-1.2.0`, which is on `release/1.2.0`. Never in the main checkout `{{repo:runes}}`, which stays on its own branch, and never in a worker's worktree. If the merge worktree is not on `release/1.2.0`, is not clean, or does not exist, stop and tell the jarl. Never switch its branch, and never add or remove a worktree.

The check runs on the merged tree in that worktree: `systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 2400 npm run check`, in the foreground (a `throttle:` line is expected). `npm run check` again after the second of two packages that touch the same resolver file.

## Mechanical conflicts

- The catalogue count in `test/relations/catalogue.test.mjs` is the sum of both sides' deltas, in its test name, its assertion and its first-line comment.
- `dist/` is rebuilt on the merged tree (`npm run build`) and committed with the merge, never taken from one side.
- A golden under `corpus/goldens/` both sides changed is regenerated on the merged tree (`RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared npm run corpus:update -- --only <repository>`), and `corpus/explained.md` takes both sets of lines.
- `test/relations/extractor-rev.test.mjs`: both sides' reasons are kept; two sides that bump the same extractor's rev are a matter of meaning.
- Any other conflict is a matter of meaning: `git merge --abort`, and tell the jarl.

## After each merge

- Record the landing with the tool's green-merge command, `--repo Runes`, with what you ran and the check's summary line.
- Commit the loop's own state on Althing's `main`: `git -C {{althing}} add releases/1.2.0/.jarl`, then `timeout 600 git -C {{althing}} commit -m "1.2.0 loop: merged <ids>" -- releases/1.2.0/.jarl`. Stage and commit only that directory; other sessions work in the same checkout. If the commit is refused by a rail, stop and tell the jarl.
- Remove the merged worker's worktree with `git -C {{repo:runes}} worktree remove <its path>` and its branch with `git -C {{repo:runes}} branch -d <branch>`, one at a time, naming each; never a worktree with uncommitted changes, never the merge worktree.

## What you never do

- Never push, to any remote; never merge into `main`, tag, publish, or delete a remote branch.
- Never amend, rebase, reset (except the tool's roll-back of your own merge), force or rewrite. Never `git stash`. Never `--no-verify`.
- Never `rm` in any form; never chmod or chown a checkout or worktree.
- Never write an absolute path outside a `Worktree:` field, a session link or a private name into the loop: it is public.
- No sleep or polling, nothing left running; between merges you wait for the jarl's message.

## Changes

- 2026-11-17: created for the Runes 1.2.0 loop from the 6.2.0 merger brief, Runes only, merging in its own worktree.
