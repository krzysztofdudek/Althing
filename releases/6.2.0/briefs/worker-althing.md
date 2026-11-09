# Added for a worker in Althing

`ws brief worker --repo althing --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about Althing: its documents (`family/`, `method/`, `research/`, the skills, the root documents) and its code (`workspace/`, `rails/`). Read `{{althing}}/AGENTS.md` whole, and `{{althing}}/CLAUDE.md`: they are Althing's rules, they are always in force, and they win where they are stricter than this file.

## The loop

The loop lives in `{{root}}`, inside Althing. Its commands are `{{jarl}} <command> --root {{root}}`. Where a plan or a design in `{{root}}/plans/` or `research/` gives the direction, it is a hypothesis within the acceptance lines. Never edit or commit the loop's own files (`{{root}}/.jarl/`) by hand: the jarl and the merger commit the loop's state.

## Where you work

- **A prose issue** (documents) is worked in the one checkout, `{{althing}}`, on `main`, touching only the files the issue's `Files:` names (prefixed `Althing/`). Other sessions work in the same checkout: never stage anything outside your files (`git add <file>…`, never `git add -A` or `git add .`), and never reset, check out or stash what is not yours.
- **A code issue** (`workspace/`, `rails/`) is worked in a worktree on the host under `{{wt:althing}}/Althing/<name>`, on your lease's branch, cut from `main`. The merger merges it into `main`. First action there: `git merge main`; `git status` must be clean afterwards, or stop and report.
- Session start, in the checkout or the worktree: `timeout 300 yg check` (green before you change anything; if it is red and not yours, stop and report), then `timeout 120 node workspace/ws.mjs doctor`. The release's check for Althing is its `check` in `{{root}}/family.json`.
- Althing's code is Node 22 or later with zero dependencies. `workspace/` verifies and records: it never pushes, tags, publishes or writes to a tool repository, and the rail `code/read-only-to-tools` refuses it. A command that would leave the machine is printed for a person to run on the owner's word.
- A detector in `rails/` has its tests in `rails/test/`, and its fix and calibration in `rails/README.md`; a check in `workspace/` has its tests in `workspace/test/`. New code comes with its tests, red before and green after. A document's proof is `yg check` green, every link resolving, and each acceptance line shown met with the file and line that meets it.

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
- The identity is `me@chrisdudek.com`, set as the repository's `user.email`; if `git config user.email` says otherwise, stop and report. The message is English and carries no trailer naming an agent, no session link and no link to a private host (the commit-msg rail refuses them).

## Standing rules

- Never push: Althing's `main` is pushed by the jarl under the ruling that allows it. Never tag, publish, merge into another branch, or use `git stash`, `rm` in any form, or chmod and chown on a checkout or worktree. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never weaken a rail, a test or a hook. Never write to the agent memory store: the repository is the memory.
- A question for the owner is filed by the jarl, never shown to him by you.
- Scratch and a permission scenario go in a `mktemp -d` folder under the system temporary directory, never into a checkout or a worktree.
- Every command is bounded: `timeout` on anything that can run long (`timeout 1800` for a full suite), no LLM-reviewed verdict, no sleep or polling (a held `index.lock` in the checkout is a stop, recorded as open), no server left running, nothing that waits for a prompt. Run every test command under `nice -n 15`, and one workspace run that reads other repositories at a time. A step that would need any of that is recorded as open in your report.

## Changes

- 2026-10-06: created in the move.
- 2026-11-09: the tool's own brief now holds the role, the lines and every command, and this file holds only what the family adds about Althing (the loop moved to Jarl 6.3.0).
