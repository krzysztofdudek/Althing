# Added for a worker in the Jarl repository

`ws brief worker --repo jarl --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about the Jarl repository, and nothing the tool's brief already says. Where they differ about the record, the tool's brief wins; about this repository, this file does.

## The Jarl you change is not the Jarl that writes the loop

The loop lives in Althing, in `{{root}}`, and its record is written by the driver Jarl, `{{jarl}}`: a worktree of its own, `{{repo:jarl-6-3-0}}`, pinned to the commit the manifest's `driver` names in `{{root}}/family.json`. Never run a writing git command in that worktree: no checkout or switch, commit, merge, reset, pull or stash. If it moved, `ws jarl` refuses every write until it is back.

Never run your worktree's `jarl.mjs` against `{{root}}`. The Jarl you are building is exercised on copies of the loop: copy `{{root}}/.jarl` into your scratch folder and run `node <your worktree>/skills/jarl/scripts/jarl.mjs <command> --root <that copy's parent>` there. The loop is a real, large record, and a good test of what you change. The installed plugin's MCP tools are the released Jarl: never use them to test your change.

## Where you work

- Your worktree is the issue's `Worktree:`, under `{{wt:jarl}}/JarlSkill/<name>`, cut from the release branch: the manifest's `repos.jarl.branch` in `{{root}}/family.json`. The merger merges in its own worktree, never in the main checkout.
- The skill is `skills/jarl/`: `SKILL.md`, the references, `scripts/jarl.mjs` and `scripts/record.mjs`. Nothing outside `skills/jarl/` may affect its mechanics.
- Tests: `cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test`, on the host; a single file with `node --test tests/<file>.test.mjs`.

## The contracts Jarl keeps

- `scripts/record.mjs` is the record library, and `tests/record-contract.test.mjs` holds its exports, the contract `jarl-record/4`. An export may change when your issue needs it, with the contract test updated in the same commit; the test itself stays.
- The vendored Runes copy (`skills/jarl/scripts/vendor/runes/`) and the blocks of `SKILL.md` between `<!-- RUNES:<name>:START -->` and `<!-- RUNES:<name>:END -->` are never edited by hand; the tests fail on it. A change there is made in Runes.
- The MCP server holds no behaviour of its own: a new command or flag reaches it through the CLI's own tables. Never hand-write an MCP tool.
- No file you write carries a task number or describes a task (the owner, 2026-10-18): only the commit subject names the issue.
- Everything you write speaks of Jarl as it is now: no version number, no "new in", "since", "no longer", "used to", no reference to an older Jarl. History goes in the CHANGELOG alone.
- Script paths inside `SKILL.md` are written as `${CLAUDE_PLUGIN_ROOT:-.claude/skills/jarl}/scripts/jarl.mjs`.
- Jarl runs on macOS, Windows and Linux (ruling `jarl-runs-on-mac-windows-linux`): paths built with the path module, a file read and written back keeps its line endings, a printed command works in a POSIX shell, in PowerShell and in cmd or says which it is for. A test that cannot run on one platform is skipped there with a stated reason. Read `.github/workflows/ci.yml` and keep it green.
- A refusal ends with the form of the command, built by the one builder with a placeholder from the closed registry, never with a corrected call composed for the caller (ruling `refusals-end-in-a-form-not-a-guess`).
- A point of an issue that is only wording, taste or an input no one is expected to give is a known limitation (ruling `known-limitations-list-for-wording-minors`): leave it and say so in your report. `releases/6.3.0/plans/known-limitations.md` lists those already agreed.
- A repository with a Yggdrasil graph: never write a `yg-suppress`, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.

## Each commit

- A CHANGELOG entry goes in the same commit under `## [Unreleased]`, written for the people who use Jarl: one or two plain sentences, facts only, no file names and no internal mechanics. Record the same entry on the issue through the tool's changelog command.
- You never bump a version or a manifest: that is a release step.
- The identity is `me@chrisdudek.com`: set it in your worktree with `git config user.email me@chrisdudek.com` if it says otherwise.

## Standing rules of the machine

- Never push, tag, publish, merge into another branch, or use `git stash`, `--no-verify`, `rm` in any form, or chmod and chown on a checkout or worktree.
- Scratch and a test run's `TMPDIR` go in one folder made with `mktemp -d` under the system temporary directory. Never a folder in the home. Say its path in your report.
- Every command is bounded: `timeout` on anything that can run long, no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`), no sleep or polling, no server left running, nothing that waits for a prompt. Run a full suite under `nice -n 15`, once, at the end.
- Everything you write into the loop is public and English: no absolute path outside a `Worktree:` field, no session link, no private name.

## Changes

- 2026-10-06: created in the move.
- 2026-11-03 to 2026-11-05: copied for the 6.2.1 patch; worktree layout, three platforms, the record library's freeze gone.
- 2026-11-09: the tool's own brief now holds the role, the lines and every command; this file holds only what the family adds about this repository (the loop moved to Jarl 6.3.0).
