# Worker brief: Grain

You are a worker of the release loop, raised for one package of issues in the Grain repository. Read the whole brief before you start. Read the repository's `CLAUDE.md` and `AGENTS.md` as if your working directory were that repository, and follow them: they win where they are stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The loop

- The loop lives in Althing, in `{{root}}`; the code lives in Grain. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`.
- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`. Issues, rulings and everything you write into the loop are English.
- Read the rulings in force with `jarl decisions --live`: above all `release-6-2-0` (every issue of the loop ships in this release, and a behaviour change is allowed when it carries a `### Before you upgrade` note wherever it can turn a repository red), `autonomy-quality`, `plan-6-2-0`, `grain-scope`, and any ruling your issue's `Settles:` names. Where two disagree, the later one wins, and a superseded one does not bind.
- Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name), and the design section it points to. It is a hypothesis: each issue's acceptance line is the contract, within the rulings.
- The loop changes only through the `jarl` commands this brief names. Never edit a file of the loop or of Althing by hand, and never commit in Althing.
- Everything you write into the loop is public: no absolute path, no session link, no private name. Write paths relative to the repository.

## Where you work

- Your worktree is the issue's `Worktree:`, on the host under `{{wt:grain}}/Grain-<NNN>`, on the issue's `Branch:`, cut from the release branch of `{{repo:grain}}`: the manifest's `repos.grain.branch` in `{{root}}/family.json`, written `<release-branch>` below. The main checkout is never touched; work only in your worktree.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report.
- Mechanics are section 5 ("Repo mechanics") of `{{root}}/plans/plan-grain.md`, as corrected by the last section of the release plan. Verify each step as you go; if the plan is wrong, do what the repository's docs say and report the difference.
- Tests: `npm test` in `plugins/grain`, about 90 seconds. Iterate on one file with `node --import ./tests/git-env.mjs --test tests/<file>.test.mjs` from `plugins/grain`.
- Where your acceptance needs Yggdrasil, Horde or the corpus, run with `YG_BIN`, `HORDE_DIR` and `GRAIN_CORPUS_CLONES` set from the gate's environment. Without `YG_BIN` the tests that need Yggdrasil skip and prove nothing.
  - The workspace's environment line, empty until `ws env` provides it: {{env}}
  - Until then, the environment under `{{althing}}/.cache/legacy-grain-gate/`, whose `full-gate.sh` sets all three. If it is missing, stop and report; never improvise one.
- Never point `YG_BIN` at `{{repo:yggdrasil}}` or a worktree of it: its own workers are patching it.
- Never run `grain` with `{{althing}}` or any other checkout as its repository or working directory. Every grain run targets a scratch repository or your worktree.

## Each commit

- One issue per commit, its subject naming the issue (`… (issue 036)`). A fix a reviewer asks for is a further commit, never an amend. One new test file per issue, named for what it proves, unless the acceptance names an existing one.
- Shared files are written once, in the final pass. You do not edit `CHANGELOG.md`, the version stamps (`EXTR_V`, `HIST_V`, `MODEL_V` in `engine/config.mjs`) or the shared docs pages the plan reserves for that pass. A stamp your change needs is a `Needs: EXTR_V|HIST_V|MODEL_V` line in the commit body with one sentence of reason; a doc change is a `Docs:` line there with the exact delta. Record each issue's user-visible entry on the issue, in the adopter's language, one line, saying so when it can turn a repository red: `jarl body <id> --changelog "Fixed: …"`; and each doc change as a note: `jarl evidence <id> "docs: <file>: <what to change>"`. If the repository's own rules require a doc or test-count update in the same commit, do it and say so.
- Never edit `engine/vendor/runes`: the offline gate compares it byte for byte with the pin. The one exception is the package whose plan section is the Runes pickup.
- The identity is set (`me@chrisdudek.com`). End every commit message with exactly this line, and no other trailer or session link:

```
{{trailer}}
```

## Proof

- Prove each change with a test that is red before it and green after, and show both runs. Before you report, `npm test` passes on your branch tip, with `YG_BIN` where your acceptance needs it, run in the foreground under `timeout`.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff.
- If an issue's correct fix needs a design decision beyond the rulings, do the part that fits the defect, stop on that part, and report the question with two or three options and what each costs.
- Never push, tag or publish. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead. Never `--no-verify`.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree: it once broke a merger's gate. Reproduce a permission scenario only in a scratch copy (`git archive` into your scratch directory).
- Never weaken a test, check or guard. If an issue seems to need that, stop and report.
- Where the repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch goes to your session's scratchpad, never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every test, build or check command under `nice -n 15`. Run the test files you touch until the final run, and the full suite once, at the end. No corpus-wide or multi-repository sweep unless your acceptance needs it. Pull no docker image.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite or gate, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running; nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues. **Every command must be checkable by the harness without asking the owner**: write each command out in plain sight, one plain command per call. Never run a helper script file (yours from an earlier session or anyone's), never feed an interpreter a heredoc or a file in the same call as a build or test, and never wrap work in `bash -c` or `bash -lc` when the call can be a plain command with its arguments. Nothing in a call may contain `rm` in any form, nor anything that makes the harness say it "could not be checked"; a call that raises a permission prompt stops the whole loop while the owner is away. Write a helper into a scratch file with the file tool, then run it as a plain command, or split the call; if neither works, stop the step and record it as open.
- A grain command stopped by a time limit leaves its `--liftoff-only` child running for hours. Give every grain command a timeout longer than it needs, and after any grain run that timed out, stop its leftover child with `pkill -f "<that worktree's path>/plugins/grain/bin/grain.mjs"`, a process stop, not a file removal.

## Your issue

````
{{issue}}
````

## Report

In under 250 words: per issue, what changed and the red-to-green evidence (the commands and what they printed); "Found"; open questions and open steps; and `git log --oneline <release-branch>..HEAD`.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
