# Added for the merger of the release loop

`ws brief merger` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds the whole merging procedure, the three cases of a red check and every command. This file says where each family repository merges and what each one needs. Read the `CLAUDE.md` and `AGENTS.md` of every repository you merge into: they win where they are stricter.

The loop lives in Althing, in `{{root}}`, and the manifest `{{root}}/family.json` names each repository's release branch and its check, which the goal repeats as its `Check` lines. The loop's commands are `{{jarl}} <command> --root {{root}}`, on the host.

## Where each repository merges

| Repository | Merges in | Notes |
|---|---|---|
| Runes | its main checkout, `{{repo:runes}}`, on its release branch | the catalogue count is summed and goldens are regenerated at merge (below); `npm run check` again after the second of two packages that touch `resolver.mts` |
| Yggdrasil | its main checkout inside the devcontainer: `{{exec:yggdrasil}}`, with `-u node` added after `docker exec` (as root, files in the shared volumes become root's) | `git merge --no-ff --no-commit`, then `git commit`, so the pre-commit hook (`scripts/repo-check.sh`) runs on the merged tip; its own log and lock merge drivers, below |
| Grain | its main checkout, `{{repo:grain}}`, on its release branch | the check runs with the gate's environment (below); the two Runes pickups, Yggdrasil's then Grain's, merge back to back with no other Grain merge between |
| Jarl | its main checkout, `{{althing}}/../JarlSkill`, on `main`, because Jarl 6.2.0 and 6.3.0 are published; never the driver worktree `{{repo:jarl}}`, which stays on the commit the driver is pinned to | Jarl's packages merge in series, the check after each |
| Althing | its checkout, `{{althing}}`, on `main` (code issues only; prose issues are committed on `main` by their workers) | the checkout is shared, and a merge commit cannot be partial: merge only when nothing is staged and no uncommitted change touches the files the merge brings; otherwise stop and tell the jarl |

The gate's environment, for the checks that need sibling tools, is Grain's full gate under `{{althing}}/.cache/legacy-grain-gate/`, whose `full-gate.sh` sets `YG_BIN` and `GRAIN_CORPUS_CLONES`. Never point a check at a development checkout or a worktree another worker is patching.

If a checkout is not on its release branch, is not clean, or a worktree you need does not exist, stop and tell the jarl. Never switch a checkout's branch, and never add or remove a worktree, on your own.

## Mechanical conflicts, per repository

- Runes: the catalogue count in `test/relations/catalogue.test.mjs` is the sum of both sides' deltas, in its test name, its assertion and its first-line comment; a golden under `corpus/goldens/` both sides changed is regenerated on the merged tree (`npm run corpus:update -- --only <repository>`), and `corpus/explained.md` takes both sets of lines.
- Yggdrasil: its log and lock files merge through Yggdrasil's own drivers. Where the clone does not configure them, give them for that one merge on the command line (`git -c merge.yg-log.driver='node source/cli/dist/bin.js merge-driver log %O %A %B %P' -c merge.yg-lock.driver='node source/cli/dist/bin.js merge-driver lock %O %A %B %P' merge …`), never by running `yg init --upgrade` in the clone. Without them, a `log.md` conflict is a chronological union and a lock file is taken from one side, then `node source/cli/dist/bin.js check --approve --only-deterministic`. Re-run `npm run codes:update` in `source/cli` when a side added issue codes.
- A CHANGELOG merges by union where the repository says so.
- Any other conflict is a matter of meaning: `git merge --abort`, and tell the jarl.

Where a repository's pre-commit hook gates the commit (Yggdrasil's runs the full `scripts/repo-check.sh`, about fifteen minutes), it runs on the merged tip; a red hook means no merge commit: `git merge --abort`, and tell the jarl.

## After each merge

- Record the landing with the tool's green-merge command: its `--repo` is the path relative to the loop's root (`../../../<Repo>`, `../..` for Althing), never an absolute path, because Jarl writes it into the record.
- Commit the loop's own state on Althing's `main`, because a loop whose code lives elsewhere has no other merge to ride on: `git -C {{root}} add .jarl`, then `timeout 600 git -C {{root}} commit -m "<version> loop: merged <ids>" -- .jarl`, the release directory's name as the version. Stage and commit only `.jarl/`; other sessions work in the same checkout.
- After a Yggdrasil merge, tell the jarl: the gate's build of Yggdrasil is rebuilt from the new tip before the next Grain merge that depends on it.

## What you never do

- Never push, to any remote. A release branch ready to be pushed is reported to the jarl: every push is the owner's word, except the one branch a ruling names.
- Never merge into a tool's `main` (Jarl's row above is the one exception, on the owner's order), tag, publish, or delete a branch or a worktree.
- Never amend, rebase, reset (except the tool's roll-back of your own merge), force or rewrite. Never `git stash`. Never `--no-verify`.
- Never `rm` in any form; never chmod or chown a checkout or worktree.
- Never write a `yg-suppress`, change a rule's `review_by`, hand-edit a lock file (a lock taken from one side of a merge is not an edit), or edit `.yggdrasil/yg-architecture.yaml`.

## Load and bounded commands

Run every check under `nice -n 15` (inside the container, after its name), one heavy check at a time. Every command is bounded: `timeout` on anything that can run long (`timeout 1800` for a full check, inside the container after its name, because a `timeout` around `docker exec` on the host stops only the client); no LLM-reviewed verdict; no sleep or polling on a lock or another session; no server left running; nothing that waits for a prompt. Between merges you wait for the jarl's message. A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours: stop it with `pkill -f "<that tree's path>/plugins/grain/bin/grain.mjs"`.

## Changes

- 2026-10-06: created in the move.
- 2026-11-09: the tool's own brief now holds the merging procedure, and this file holds where each family repository merges and what each needs (the loop moved to Jarl 6.3.0). Jarl merges on `main`.
