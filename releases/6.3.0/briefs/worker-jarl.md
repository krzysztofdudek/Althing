# Worker brief: Jarl

You are a worker of the release loop, raised for one package of issues in the Jarl repository (JarlSkill). Read the whole brief before you start. Read the repository's `CLAUDE.md` (and `AGENTS.md` if there is one) as if your working directory were that repository, and follow it: it wins where it is stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The Jarl you change is not the Jarl that writes the loop

- The loop lives in Althing, in `{{root}}`, and its record is written by the driver Jarl, `{{jarl}}`: the driver worktree `{{repo:jarl}}`, a worktree of its own (not Jarl's main checkout), pinned to the commit the manifest's `driver` names in `{{root}}/family.json` for the whole release (ruling `jarl-pinned-in-loop`). Never run a writing git command in that worktree: no checkout or switch, commit, merge, reset, pull or stash. If it moved, the record would be written by a Jarl it was not pinned to, and `ws jarl` refuses every write until the worktree is back.
- Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`: the driver, for reading your issues and recording on them. Never run your worktree's `jarl.mjs` against `{{root}}`. The Jarl of this release is exercised on copies of the loop: copy `{{root}}/.jarl` into your scratch directory and run `node <your worktree>/skills/jarl/scripts/jarl.mjs <command> --root <that copy's parent>` there. The loop as it stands is a real, large record (hundreds of issues, a long log, several repositories, a devcontainer and a renumbering), and a good test of what you change.
- The installed Jarl plugin's MCP tools are the released Jarl, not yours: never use them to test your change.

## The loop

- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`. Issues, rulings and everything you write into the loop are English.
- Read the rulings in force with `jarl decisions --live`: above all `everything-from-the-field-report-into-6-2-1` (every finding of the field report ships in this patch, on Jarl alone), `only-jarl-now` (Jarl 6.2.1 ships on the Runes 1.0.0 it vendors), `one-edit-rule-for-issues`, `ci-green-on-github-and-bounded-agents`, and any ruling your issue's `Settles:` names; the family's standing rulings (`autonomy-quality`, `jarl-pinned-in-loop`) are in Althing's `method/rulings.md`. Where two disagree, the later one wins, and a superseded one does not bind. The record library's contract `jarl-record/1` stays unchanged in this patch.
- This patch has no plan document: each issue's What, Why and acceptance lines are the contract, within the rulings. Two limits of the 6.2.0 architecture review still bind: retraction never overrides a reviewer, and a per-repository check never makes `done` wait for a check row.
- The loop changes only through the `jarl` commands this brief names. Never edit a file of the loop or of Althing by hand, and never commit in Althing.
- Everything you write into the loop is public: no absolute path, no session link, no private name. Write paths relative to the repository.

## Where you work

- Your worktree is the issue's `Worktree:`, on the host under `{{wt:jarl}}/JarlSkill-<NNN>`, on the issue's `Branch:`, cut from the release branch: the manifest's `repos.jarl.branch` in `{{root}}/family.json`, written `<release-branch>` below. Work only in your worktree. The merger merges into the release branch in its own worktree, never in the main checkout.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- The skill is `skills/jarl/`: `SKILL.md`, `scripts/jarl.mjs` (the one tool the loop's state moves through, zero dependencies), `scripts/jarl-lib.mjs` and `scripts/record.mjs`. Nothing outside `skills/jarl/` may affect the skill's mechanics.
- Tests: `cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test`, on the host. Iterate on one file with `node --test tests/<file>.test.mjs`.

## The contracts Jarl keeps

- `scripts/record.mjs` is the `jarl-record/1` contract that Horde vendors and runs its missions on: its exports are a promise to another repository, and `tests/record-contract.test.mjs` holds them. This release keeps that contract unchanged. If your package would need to change an export, stop on that part and report it with options.
- A change to the format of the loop's files must be readable by the driver Jarl, which keeps writing this loop until it closes. A change an older Jarl would misread waits for the loop format marker the review describes; never ship it ahead of the marker.
- The vendored Runes copy (`skills/jarl/scripts/vendor/runes/`) and the blocks of `SKILL.md` between `<!-- RUNES:<name>:START -->` and `<!-- RUNES:<name>:END -->` are never edited by hand: the tests fail on it. A change there is made in Runes.
- The MCP server holds no behaviour of its own: a new command or flag reaches it through the CLI's own tables and its one-sentence summary. Never hand-write an MCP tool.
- No file you write carries a task number or a description of a task (the owner, 2026-10-18: zero task numbers anywhere, only sensible comments and code): no `(issue N)`, `issue N`, ticket, package, round or reviewer reference in a comment, a test title, a test header, the skill, the README or the CHANGELOG; a comment says what the code does and why it must be so, a test title says what behaviour it proves. The commit subject is the only place that names the issue, as the next rule says.
- Everything you write speaks of Jarl only as it is now, in the absolute present (the owner's rule, 2026-10-18: "only the absolute present version, that is all"): `SKILL.md`, the help text, the tool summaries, the MCP instructions, comments and test names carry no version number, no "new in", "since", "no longer", "used to", "earlier versions", no reference to an older Jarl or to backward compatibility ("legacy", "compatible with", "migrate", "Jarl 6.x"), no plan for a later release; what Jarl reads and refuses is a rule of the present ("a record carries its format; Jarl reads the formats it knows and refuses a higher one"), never a comparison with a version. State the property of the record or the code instead. History goes to the CHANGELOG entry alone; a frozen earlier reader appears only as the test fixture itself.
- Script paths inside `SKILL.md` are written as `${CLAUDE_PLUGIN_ROOT:-.claude/skills/jarl}/scripts/jarl.mjs`.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 241)`). A fix a reviewer asks for is a further commit, never an amend. Every Jarl package touches `jarl-lib.mjs` and `SKILL.md`; the packages run in series for that reason, so keep to your issue's declared `Files:`.
- The CHANGELOG entry goes into the same commit, under `## [Unreleased]`, written for the people who use Jarl and compared with the previous released version only (the owner, 2026-10-18): plain language a non-technical person understands, one or two short sentences about what the person gets or must do, low information density, facts only, no file names, no internal mechanics, nothing about a defect that was introduced and fixed inside this release. It is raw material for the release's final CHANGELOG text, which the release step writes once by hand. Record the same entry on the issue: `jarl body <id> --changelog "Fixed: …"`.
- You never bump a version or a manifest: that is a release step.
- The identity is `me@chrisdudek.com`: if `git config user.email` in your worktree says otherwise, set it with `git config user.email me@chrisdudek.com` before the first commit. End every commit message with exactly this line, and no other trailer or session link:

```
{{trailer}}
```

## Proof

- Prove each change with a test that is red before it and green after, and show both runs. Where the change is about the record, also run the command on a copy of this loop and show what it printed before and after.
- Before you report, `npm test` in `skills/jarl/scripts` passes on your branch tip.
- If your change touches anything `record.mjs` exports or calls, say so in your report: Horde re-vendors Jarl once, at the release tag, and its suite is then the proof that the library's behaviour held.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff.
- If an issue's correct fix needs a design decision beyond the review and the rulings, do the part that fits the acceptance, stop on that part, and report the question with two or three options and what each costs.
- Never push, tag or publish; Jarl's release workflow makes the tag. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead. Never `--no-verify`.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree: it once broke a merger's gate. Reproduce a permission scenario only in a scratch copy.
- Never weaken a test, check or guard. If an issue seems to need that, stop and report.
- Where a repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch goes to your session's scratchpad, never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every test command under `nice -n 15`. Run the test files you touch until the final run, and the full suite once, at the end. No multi-repository sweep unless your acceptance needs it.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running (start Jarl's MCP server only inside a test that stops it); nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues. **Every command must be checkable by the harness without asking the owner**: write each command out in plain sight, one plain command per call. Never run a helper script file (yours from an earlier session or anyone's), never feed an interpreter a heredoc or a file in the same call as a build or test, and never wrap work in `bash -c` or `bash -lc` when the call can be a plain command with its arguments. Nothing in a call may contain `rm` in any form, nor anything that makes the harness say it "could not be checked"; a call that raises a permission prompt stops the whole loop while the owner is away. Write a helper into a scratch file with the file tool, then run it as a plain command, or split the call; if neither works, stop the step and record it as open.

## Your issue

````
{{issue}}
````

## Report

In under 250 words: per issue, what changed and the red-to-green evidence (the commands and what they printed); whether anything `record.mjs` exports or calls moved; "Found"; open questions and open steps; and `git log --oneline <release-branch>..HEAD`.

## Checklist

Before you send the report, check each item. An item not done is an open step in the report, never a silent gap.

- The work is committed: every commit the brief asks for exists on your branch, its subject naming the issue, ending with the trailer line.
- Red and green are recorded as jarl evidence rows, `jarl evidence <id> --ran "<command>" --saw "<what it printed>"`, one for the red run and one for the green run of each test the issue names.
- Every check the brief names was waited for to its end: a run cut short by a timeout or a stop is not a result, and it is recorded as open.
- The changelog entry is written where this brief names one, and recorded on the issue with `jarl body <id> --changelog "…"`; a brief that names none has nothing to write here.
- No loop issue number appears in code, comments, tests, docs or graph entries: the number lives only in the commit subject, because the loop ends and the number then points nowhere.
- The report is sent, in the length the Report section gives.

## Changes

- 2026-10-06: created in the move.
- 2026-11-03: copied for the 6.2.1 patch; its rulings and the absence of a plan named.
- 2026-11-03: line 7 names `{{repo:jarl}}` as the driver worktree, which is what the machine's checkout map renders it as, not as Jarl's main checkout.
