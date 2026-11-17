# Added for an examiner in the Runes 1.2.0 loop

`ws brief reviewer --issue <ids> --release 1.2.0` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your depth, your six steps, the lines and every command, including the verdict. This file holds what the family adds.

## The checkouts

Runes `{{repo:runes}}`, Althing `{{althing}}`. The release branch is `release/1.2.0`; worker branches are `jarl/NNN-slug`, in worktrees under `{{wt:runes}}/Runes/`. The loop's own commands are `{{jarl}} <command> --root {{root}}`, on the host. The plan is `{{root}}/plans/plan-runes-1.2.0.md`. Read Runes' `CLAUDE.md`, `README.md` and `docs/api.md` for its conventions.

## Read-only

- Spawn nothing, edit nothing, commit nothing. Never `git checkout` or switch branches in a main checkout or a worktree.
- Read the change with read-only git: `git -C {{repo:runes}} diff release/1.2.0...<branch>`, `git log`, `git show`.
- To reproduce red before and green after, extract trees into your own scratch folder (`mktemp -d` under the system temporary directory) with `git -C {{repo:runes}} archive <sha> | tar -x -C <folder>`, then `npm ci` and the tests there. The grammar cache `~/.cache/runes/grammars` is warm and shared; never edit it. Corpus runs use `RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared` and never edit the clones in it.
- Never `rm` in any form, never chmod or chown a checkout or worktree, never `git stash`.
- Everything you write into the loop is public and English: no absolute path outside a `Worktree:` field, no session link, no private name.

## Rust's build tests

This machine has no Rust toolchain, so `test/relations/rust-cases-build.test.mjs` skips its two build tests unless cargo and rustc 1.99.1 are on PATH. Where a line names them, run them as the worker brief says (ruling `runes-1-2-0-plan`, D6): two scripts `cargo` and `rustc` in a `mktemp -d` folder, each `exec docker run --rm -i -u "$(id -u):$(id -g)" -e CARGO_HOME="$TMPDIR/cargo-home" -v "$TMPDIR:$TMPDIR" -v "$PWD:$PWD" -w "$PWD" rust:1.99.1-slim <tool> "$@"`, put first on PATH, with `TMPDIR` set to a `mktemp -d` folder of its own (the scripts mount it into the container). A run that skips them proves nothing about a Rust case.

## Beyond the six steps

Where a ruling narrows an issue, judge against the ruling. Check Runes' conventions the diff must follow: one issue per commit with its subject naming the issue, a reviewer's fix as a further commit and never an amend, the changelog entry recorded on the issue, `dist/` rebuilt in the same commit as `src/`, the catalogue count raised in all three places, the extractor rev bumped where `declarations()` or `uses()` output changes, `docs/api.md` matching the exports, a Rust case that builds under rustc, no weakened test, check, guard or threshold, and no commit trailer naming an agent. Ask of every change what false edge it could add on a real repository, not only whether its own cases pass.

A gap that already existed and the change did not touch is a finding outside the issue: file it with the tool's `--outside` and approve if the issue is met. A finding of wording or taste is Minor.

## Memory, load and bounded commands

Every build or test runs under `systemd-run --user --scope -q -p MemoryMax=8G` (one file) or `MemoryMax=12G` (a full suite or check), with `nice -n 15` and a `timeout`, in the foreground; a `throttle:` line in the output is expected. Re-run the commands each `test`, `check` or `compare` line names, and the test files the change touches; a full suite once where a line needs it. No sleep or polling, no server, nothing that waits for a prompt. A step you cannot run is recorded as open in your answer, and the rest of the examination continues.

## Changes

- 2026-11-17: created for the Runes 1.2.0 loop from the 6.2.0 reviewer brief, Runes only, with the memory caps folded in.
