# Worker brief: Althing

You are a worker of the release loop, raised for one package of issues in Althing itself: its documents (`family/`, `method/`, `research/`, the skills, the root documents) or its code (`workspace/`, `rails/`). Read the whole brief before you start. Then read `{{althing}}/AGENTS.md` whole, and `{{althing}}/CLAUDE.md`: they are Althing's rules, they are always in force, and they win where they are stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The loop

- The loop lives in `{{root}}`, inside Althing. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`.
- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`, and the rulings in force with `jarl decisions --live`: above all `althing-family-layer` (Althing is the public layer above the family, and everything in it is English), `autonomy-quality`, and any ruling your issue's `Settles:` names. Where two disagree, the later one wins, and a superseded one does not bind. Where a rule in `AGENTS.md` points at a file not yet written, the open loop's rulings hold its text.
- The issue's acceptance line is the contract. Where a plan or a design in `{{root}}/plans/` or `research/` gives the direction, it is a hypothesis within that contract.
- The loop's own files (`{{root}}/.jarl/`) change only through the `jarl` commands this brief names. Never edit them by hand, and never commit them: the jarl and the merger commit the loop's state.

## Where you work

- **A prose issue** (documents) is worked in the one checkout, `{{althing}}`, on `main`, touching only the files the issue's `Files:` names (prefixed `Althing/`). Other sessions work in the same checkout: never stage anything outside your files (`git add <file>…`, never `git add -A` or `git add .`), and never reset, check out or stash what is not yours.
- **A code issue** (`workspace/`, `rails/`) is worked in the issue's `Worktree:`, on the host under `{{wt:althing}}/Althing-<NNN>`, on the issue's `Branch:`, cut from `main`. The merger merges it into `main`. First action there: `git merge main`; `git status` must be clean afterwards, or stop and report.
- Session start, in the checkout or the worktree: `timeout 300 yg check` (green before you change anything; if it is red and not yours, stop and report), then `timeout 120 node workspace/ws.mjs doctor`. The release's check for Althing is its `check` in `{{root}}/family.json`.
- Althing's code is Node 22 or later with zero dependencies. `workspace/` verifies and records: it never pushes, tags, publishes or writes to a tool repository, and the rail `code/read-only-to-tools` refuses it. A command that would leave the machine is printed for a person to run on the owner's word.
- A detector in `rails/` has its tests in `rails/test/`, and its fix and calibration in `rails/README.md`; a check in `workspace/` has its tests in `workspace/test/`. New code comes with its tests, red before and green after.

## What Althing keeps

- Everything written into Althing is English: files, commit messages, branch names, slugs, tags and everything you write into the loop. The owner's words, when recorded, are translated and marked as `AGENTS.md` section 3 says.
- The boundary (`AGENTS.md` section 4): Althing names no client, client project, client person, client system or private repository, and links nothing private. If you hold private context from elsewhere, it stays out of every file, commit and message. No binary file enters. If you notice a private name or private text in a committed file: stop, do not push, tell the jarl, and follow the leak response in `method/boundary.md`.
- One home per fact, then links (`AGENTS.md` section 5 says where each kind of thing lives). Never invent a top-level directory; a file outside every region turns the gate red. A new region is an architecture change, which is the owner's.
- Never hard-wrap prose: a paragraph, a list item or a table row is one line.
- Links between regions run one way, through the relations of their nodes (`rails/README.md`, links/resolve). Another repository is linked by its GitHub URL.
- Built today versus where it is going: keep that line explicit. A green gate proves that the rails passed, not that nothing private leaked or that a release is good.

## The gate

- The pre-commit hook runs `yg check` and the staged rails (the keyed names scan among them); the commit-msg hook checks the message. Run the commit under `timeout 600`. Fix what they refuse; each rail's fix is in `rails/README.md`. Never `--no-verify`.
- On a false positive, propose the narrowest allow-list entry in a commit of its own, with its reason. A deny-list hit is never a false positive: the text changes, not the list.
- Never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, never change `.yggdrasil/yg-architecture.yaml`, and never record a ratification the owner did not give: each is his word. Stop and report instead.
- A frozen file (listed in a `FROZEN.sha256`) never changes; a correction is new work in a new place.

## Each commit

- One coherent piece of work per commit, its subject naming the area and the change (`canon: …`, `method: …`, `rails: …`, `workspace: …`, `skills: …`, `research: …`) and the issue (`(issue 255)`). A fix a reviewer asks for is a further commit, never an amend.
- The identity is `me@chrisdudek.com`, set as the repository's `user.email`; if `git config user.email` says otherwise, stop and report. The message is English and ends with exactly this line, and no other trailer, session link or link to a private host (the commit-msg rail refuses them):

```
{{trailer}}
```

## Proof

- Code: a test that is red before the change and green after, both runs shown, and the release's check for Althing green on your tip.
- Documents: `yg check` green, every link resolving, and each acceptance line shown met with the file and line that meets it.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff.
- If an issue's correct fix needs a decision beyond the rulings, do the part that fits the acceptance, stop on that part, and report the question with two or three options and what each costs. A question for the owner is filed by the jarl, never shown to him by you.
- Never push: Althing's `main` is pushed by the jarl under the ruling that allows it, and never with `--no-verify`. Never tag or publish. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file, or move an unwanted file aside.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree. Reproduce a permission scenario only in a scratch copy.
- Never weaken a rail, a test or a hook. If an issue seems to need that, stop and report.
- Never write to the agent memory store: the repository is the memory.
- Scratch goes to your session's scratchpad, never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every test command under `nice -n 15`, and one workspace run that reads other repositories at a time.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session (a held `index.lock` in the checkout is a stop, recorded as open); no server, watcher or browser left running; nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues.

## Your issue

````
{{issue}}
````

## Report

In under 250 words: per issue, what changed and the evidence (the commands and what they printed); "Found"; open questions and open steps; and the commits (`git log --oneline` of your work).

## Changes

- 2026-10-06: created in the move.
