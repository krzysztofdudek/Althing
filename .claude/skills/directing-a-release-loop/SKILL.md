---
name: directing-a-release-loop
description: Use when a session in Althing starts while a release loop is open, or when it files, assigns, briefs, reviews or merges work in one - resuming the loop, raising a worker for an issue in a tool repository, briefing a reviewer or the merger, recording evidence, asking the owner a question, recording his answer, or deciding what runs next. Applies whatever language the request is in.
---

# Directing a release loop

A release loop is one permanent Jarl loop in `releases/<version>/.jarl/`. The loop's mechanics (issues, leases, workers, the fresh reviewer, the merger, the reeve, asks and rulings) are the Jarl skill, which the installed Jarl plugin provides and which is public at https://github.com/krzysztofdudek/JarlSkill/blob/main/skills/jarl/SKILL.md. This skill says only what differs in Althing. The open loop's `decisions.md` wins over this skill; read it before deciding anything.

Three things differ from a loop that lives next to its code:

- **The loop lives here, the code lives in the tool repositories.** Every issue that changes a tool names its repository, and workers, reviewers and the merger work there. `.jarl/` never enters a tool repository.
- **One driver Jarl writes the record**, pinned to one commit for the whole release (the manifest's `driver`; ruling `jarl-pinned-in-loop`). Call it as `node workspace/ws.mjs jarl <command>`, which sets `--root` and refuses a write when the driver checkout has left its pinned commit. The Jarl MCP tools are the installed plugin: fine for reading, and fine for writing only when its version is the driver's (`ws doctor` says).
- **Everything in the record is English** ([language](../../../method/language.md)), and it is public: nothing private goes into an issue, a ruling, an evidence row or a log line ([the boundary](../../../method/boundary.md)).

Below, `ws` is `node workspace/ws.mjs`.

## Resume

1. `ws status`: each repository's branch against the declared one, and the loop's counts. A repository off its declared branch is fixed before any work there.
2. `ws jarl resume`: the goal, the rulings in force, the work in flight with its leases, what waits, the open questions and ratify items, the next ready issues, the merge queue, the tips and the log's tail.
3. `ws jarl branches --repo <path>` for each repository the in-flight issues name: a worker branch with commits beyond the release branch is a report, whether or not the worker said so.
4. Open questions first: the owner may have answered one since.

Never re-derive what the record already says, and keep no notes of your own: the next session boots from `resume`.

## Filing

Everything anybody saw becomes an issue before anything else happens, filed directly, without asking first (`findings-become-issues`).

- **Body.** A title in plain English, and `--what`, `--why`, `--acceptance` (one checkable line each) and `--where` with `file:line` or the command and what it printed. An issue without an acceptance line gives the worker nothing to prove.
- **`--repo`** is a relative path from the loop's root, `../../../<Repo>` (for example `../../../Grain`), or `../..` for Althing itself. Never an absolute path: Jarl writes it into the record, and a machine path is refused by the gate.
- **`--files`** prefixes every path with its repository's directory name (`Grain/plugins/grain/engine/x.mjs`, `Althing/workspace/ws.mjs`), so `next` keeps workers apart across repositories.
- **`--tier`** is `strong` or `standard`; it is the worker's model (section 8 of `AGENTS.md`).
- **`--tags`** are English, kebab-case. Reuse a tag the loop already has (`ws jarl list --all` shows them) before inventing one; the vocabulary is written into `method/issues.md` once that file exists. The release issue carries `release, needs-owner`.
- An issue that waits on another says so with `--after`.

## Packages and leases

A package is two to ten small neighbouring issues for one worker on one branch. Lease them in one call before raising the worker:

```
ws jarl set 163-168 in-progress "<why>" --branch jarl/163-packages --worker <name> --worktree <absolute worktree path>
```

The worktree path is the only absolute path the record may hold, and only in its shapes: under the home directory's `Worktrees/<Repository>/` (the host's place), under the Yggdrasil container's worktree root, or, in loop records already written, under the home directory's old `.jarl-wt/` ([environment](../../../method/environment.md); the rail allows these in the Worktree field and the worktree segment of a log line only).

## Raising a worker

1. Cut the worktree from the repository's release branch, on branch `jarl/NNN-slug`, under `~/Worktrees/<Repository>/<name>`, where `<name>` says the work (`263-storage-roots`); the host's rules decide the place, and scratch goes in a `mktemp -d` folder under the system temporary directory. For Yggdrasil, inside its devcontainer with the worktree locked (`git worktree add --lock --reason devcontainer`); from the host such a worktree looks prunable and is not (issue 241 of the 6.2.0 loop).
2. Render the brief for this machine: `ws brief worker --repo <name> --issue <id> --trailer "<the attribution line your harness gives>"`. The rendered text, with the issue pasted verbatim, is what the spawn receives. Never paste a committed brief by hand: its placeholders hold this machine's paths, which never enter the repository.
3. Spawn with the model the issue's tier names, explicitly. Tell the worker it spawns nothing itself.

A brief changes by rewriting the template in `releases/<version>/briefs/` and adding one line to its "Changes" list at the end, never by appending notes that contradict the body above them.

## The reviewer

Fresh (neither the worker nor the one who runs the loop), read-only, never of the worker's own model and never weaker than the worker: `ws brief reviewer --issue <id>`. It answers Critical, Important or Minor, and records `ws jarl review <id> approve|changes --by <reviewer> "…"`. Only a fresh reviewer's approve clears an issue that carries code (`fresh-reviewer-required`).

## The merger

One long-lived merger per repository's merge queue: `ws brief merger --repo <name>`. It merges with the merge drivers on the command line, runs the repository's own check on the merged tip (the manifest's `check` for that repository, which the goal repeats as a `Check:` line), and records the result as an evidence row: `ws jarl evidence <id> --ran "<the check>" --saw "<its summary line, merge sha>"`. It records the merge with `ws jarl merged <ids> --sha <sha> --repo ../../../<Repo>`: the relative path again, because Jarl writes it into the record. After every merge it commits the loop's own state on Althing's `main` (`6.2.0 loop: merged 163-168`), because a loop whose code lives elsewhere has no other merge to ride on.

## Never by hand

- `log.md` is the done gate's event store. Never edit it; a wrong entry is retracted by an appended one.
- `goal.md` changes only on the owner's word, or under the mandate with a ratify item filed in the same move, citing the ruling.
- An issue's header fields change through the tool (`set`, `tag`, `prio`, `files`, `repo`, `after`, `body`), never by editing the file.

## Asking the owner

1. File it first: `ws jarl ask "<question>" --kind stop|stuck|lower|charter|ratify [--issue NNN]`. A question shown to him without an `ask` behind it is invisible to the record (the loop's `status` would say there are no questions).
2. Then show it to him in plain words, one topic per turn: the context (what the code does, with `file:line`), the question, and two or three options with what each costs. No loop jargon. Five topics are five turns.
3. His answer is recorded as he gave it, translated: `ws jarl answer <a-id> "Krzysztof chose … (an option label, not his wording)" --by owner`, or his words marked `(translated from Polish)`. Never answer for him.
4. When the answer sets a rule that outlives the question, record it as a ruling with an English slug: `ws jarl decide <slug> "Krzysztof, YYYY-MM-DD (translated from Polish): \"…\" …" --by owner`. A changed ruling is a new one with `--supersedes <slug>`, never an edit. Swear words become neutral words; a reaction with no decision in it is not recorded (`ask-011`).

## Under the mandate

When the owner is away the loop decides for quality (`autonomy-quality`): `ws jarl decide <slug> "…" --by jarl`, and when the choice is one that is his, `ws jarl ask --kind ratify "<what was decided, and why>"` in the same move. A ratify item blocks nothing; it waits for his word in one batch.

## Pushing

- Althing's `main`: after the first push, which is the owner's word, the jarl pushes it whenever the pre-push rails are green (`ask-012`). Never with `--no-verify`.
- A tool repository: only on the owner's word, each time, except the branch a ruling names (`runes-push-branch`). A worker branch `jarl/NNN-slug` is never pushed.
