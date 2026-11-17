# Added for a worker in the Runes repository

`ws brief worker --repo runes --issue <ids> --release 1.2.0` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about the Runes repository. Read that repository's `CLAUDE.md`, `README.md` (the entry rule and the "never in Runes" list) and `docs/api.md` as if your working directory were that repository: they win where they are stricter than this file.

## The loop

The loop lives in Althing, in `{{root}}`, and the code in Runes. The loop's commands are `{{jarl}} <command> --root {{root}}`. Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-runes-1.2.0.md`. It is a hypothesis: each acceptance line is the contract, within the rulings (`{{jarl}} decisions --live --root {{root}}`).

## Where you work

- Your worktree is on the host under `{{wt:runes}}/Runes/<name>`, on your lease's branch, cut from `release/1.2.0` of `{{repo:runes}}`. The main checkout is never touched. Runes has no dev container and runs on the host (ruling `runes-1-2-0-on-runes-alone`).
- First action: in your worktree, `git merge release/1.2.0`; `git status` must be clean afterwards, or stop and report. Then, if `node_modules/` is missing, `nice -n 15 timeout 600 npm ci`: `node_modules` is per worktree, and the grammar recipe reads the npm grammar pins from it. The grammar cache `~/.cache/runes/grammars` is warm and shared, so `npm run grammars` works offline; never empty or edit it.
- Before changing anything, confirm on `release/1.2.0` that what the issue describes still holds. If it no longer holds, change nothing, say so in your report and stop (ruling `confirm-the-fault-before-the-fix`).

## Memory, load and bounded commands

- Every build, test, coverage or corpus command runs in its own memory cap, so a runaway kills only itself: a single test file or probe under `systemd-run --user --scope -q -p MemoryMax=8G`, a full suite or `npm run check` under `MemoryMax=12G`, always with `nice -n 15` and a `timeout` (`timeout 1800` for a full suite). For example: `systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check`. A run killed by its cap is a finding to report with what it ran, not a reason to raise the cap.
- A machine-wide gate (throttle) queues heavy commands; a line `throttle: ...` in the output is expected, and the wait counts against your timeout, so give heavy runs a generous one. Keep no queue of your own.
- Every command runs in the foreground and ends before you report; never leave anything running in the background, no sleep or polling, no server, nothing that waits for a prompt, no LLM-reviewed verdict.
- If a run goes red a second time from the same cause after your fix attempt, stop: report what you ran, what it printed and what you think the cause is.
- Scratch goes in a folder made with `mktemp -d` under the system temporary directory, never into a checkout or worktree. A test that creates temporary directories runs with `TMPDIR` set to that folder.

## The gates

All of them are green on your branch tip before you report.

- `npm run check` (under the cap above): the TypeScript build, the grammar build into `.grammars/`, the whole `node --test` suite (the guard, the relation catalogue, the vendor tool's tests) and `check:dist`, which fails while the rebuilt `dist/` differs from git. Iterate with single files (`node --test test/relations/<file>.test.mjs` after `npm run build`). Run `npm run check` on the clean, committed tree before you report.
- `npm run coverage`: thresholds over `dist/` of 98% lines, 92% branches and 97% functions. New branches get real tests; never lower a threshold and never add coverage-ignore comments.
- `dist/` is committed: every commit that changes `src/` carries the rebuilt `dist/` in the same commit.
- The catalogue count. A new case is `reference/relations/<language>/<id>.md` (frontmatter `id`, `language`, `category` in `import|usage-site|nested|trap|dynamic|builtin`, `expectation`, `cites`; sections `Rule`, `Files`, `Expect`, and optionally `Why`) plus exactly one `runCase('<id>')` in that language's `test/relations/extractors/<language>-name-resolution-matrix.test.mjs`. `test/relations/catalogue.test.mjs` asserts the total in its test name, its assertion and its first-line comment: raise all three by your own delta in the commit that adds the case. The merger sums deltas when that line conflicts. A case whose expectation you flip is renamed to say what it now expects, with its Rule and Why rewritten. A Rust case must build under rustc (the build test lists the ones that do not).
- The extractor `rev`. Bump it in the extractor whenever its `declarations()` or `uses()` output changes for some source, and update `test/relations/extractor-rev.test.mjs`, appending the reason to that language's comment. A resolver-only change needs no rev.
- The API page. `test/exports.test.mjs` holds `docs/api.md` and the package's exports together, both ways. A new export, option or field is a minor addition: list it in `docs/api.md` in the same commit, in its subpath's table, and say in prose what it promises. A change to what `classifyUse` answers for a form is described where `docs/api.md` describes that language's answers.
- The corpus. Where your lines or the plan name corpus evidence, run `npm run corpus` (or `npm run corpus:edges -- --only <repository>`) with `RUNES_CORPUS_DIR` set to the shared cache, `~/Temp/runes-corpus-shared` (ruling `one-runes-corpus-cache`; create it if it is missing, never edit the clones in it), and report the before and after numbers. A changed golden is regenerated with `npm run corpus:update -- --only <repository>` and every changed edge is explained in `corpus/explained.md` or is a fix your issue names.

## Rust's build tests

This machine has no Rust toolchain, so `test/relations/rust-cases-build.test.mjs` skips its two build tests and `npm run check` passes whatever a Rust case does. Where your lines name those tests, run them under cargo and rustc 1.99.1 from the `rust:1.99.1-slim` image (ruling `runes-1-2-0-plan`, D6): in a `mktemp -d` folder `W` under the system temporary directory, write two executable scripts, `W/cargo` and `W/rustc`, each holding `#!/bin/sh` and `exec docker run --rm -i -u "$(id -u):$(id -g)" -e CARGO_HOME="$TMPDIR/cargo-home" -v "$TMPDIR:$TMPDIR" -v "$PWD:$PWD" -w "$PWD" rust:1.99.1-slim cargo "$@"` (`rustc` in the second), then run the test with `PATH=W:$PATH` and `TMPDIR` set to another `mktemp -d` folder, passing both into the memory cap with `--setenv`. Both build tests must run, none skipped; report the `ℹ skipped 0` line.

## Shared files

- You do not edit `package.json`'s version, `package-lock.json` (unless your issue moves a pin, as 586 does), `src/version.mts`, `CHANGELOG.md`, or the prose counts and status line of `README.md` and `CLAUDE.md`: the final pass on the release branch does those once.
- Runes keeps no `[Unreleased]` section. Record each issue's user-visible entry on the issue through the tool's changelog command, one line in the register of the CHANGELOG's existing entries: what a consumer's relation pass or `classifyUse` now finds or stops finding, with the source form in backticks, and no file or function names of Runes. Say when the change can make a consumer show new findings.
- A `README.md` behaviour paragraph your change makes untrue is recorded as a note on the issue for the final pass. `docs/api.md` and the catalogue are edited in your commit.

## Each commit

- One issue per commit, its subject `<area>: <what changed> (issue NNN)` (for example `csharp: a type in a positional pattern gives its edge (issue 750)`), the body saying why in prose, never hard-wrapped. Commit at the failing test and at the fix where that helps a takeover. A fix a reviewer asks for is a further commit, never an amend.
- The identity is `Krzysztof Dudek <me@chrisdudek.com>`: if `git config user.email` in your worktree says otherwise, set it before the first commit. A commit carries no trailer naming an agent, no AI attribution and no session link; the machine's git refuses them.

## Your report

Beside what the tool's brief asks: the commits (sha and subject), the catalogue delta and the new count, the rev changes, the `docs/api.md` additions, the changelog entries you recorded, the corpus numbers if you ran it, and anything left open.

## Standing rules

- Everything you write into the loop is public and English: no absolute path outside a `Worktree:` field, no session link, no private name.
- Never edit another repository, its worktrees or its vendored copies of Runes.
- Never push, tag, publish, merge into another branch, or use `git stash`, `--no-verify`, `rm` in any form, or chmod and chown on a checkout or worktree. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never weaken a test, check, guard or threshold.
- You spawn nothing.

## Changes

- 2026-11-17: created for the Runes 1.2.0 loop from the 6.2.0 Runes brief, with the 6.2.0 rules on memory caps, the throttle, bounded foreground commands and confirming the fault first folded into the body.
