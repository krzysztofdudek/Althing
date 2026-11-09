# The lessons the role text held, and where they live now

Piece 2 of Jarl 6.3.0 replaces the role texts `references/worker.md`, `references/reviewer.md` and `references/merger.md` with the briefs the tool assembles (`lib/brief.mjs`). Before the briefs were written, the history of those files was read (`git log` on them and on the parts of `SKILL.md` they were cut from, commit by commit from 8318634 of 2026-09-13 to the release tip, and the rulings they point to). This list names the real failure each part was the lesson of and where it now lives. A part with no recorded failure, kept as sensible practice, says so.

The briefs below mean the text printed by `brief`; "Commands" is its section of the same name, filled from the record.

## The worker's text

| Part | The real failure it was the lesson of | Where it lives now |
|---|---|---|
| Hold work aside with a scratch copy, never `git stash` | 992c60f, 2026-09-13: a worker applied another concurrent worker's stash entry; the stash list is shared by every worktree | worker brief, "How to work", step 3 |
| Run only the test files you touch; the merger runs the whole check | 0bb4f72, 2026-09-13: five workers in a row stalled on a full suite a loaded machine stretched past any timeout | worker brief, step 5 |
| Foreground, with the shell tool's own timeout set | 10012d3, 2026-09-13: a run outlived the tool's default timeout, went to the background, and the worker sat waiting for a notification instead of reporting | worker brief, step 5; merger brief, step 5 |
| A report that says "waiting for the test run" is no report | same day: workers reported before their runs finished, and nobody could tell the work from the wait | worker brief, step 5 |
| Rename a branch the platform named, never a second branch beside it | b60128b, 2026-09-21: a worktree a platform made started on a branch of its own name, the worker made `jarl/N` beside it, and the merger was left a branch nobody owned | worker brief, step 1 |
| First action: merge the base, the tree must be clean | carried from 8318634 (0.1.0) with no recorded failure; kept because a worker on a stale or dirty start builds on sand | worker brief, step 1 |
| Your scope is the issue; anything else goes under Found | 8318634 and the rule that findings outside an issue are filed (`findings-outside-the-issue-are-filed-098`): diffs grew past the issue and reviewers could not bound them | worker brief, "You do not" and step 2 |
| Never weaken a test, a check, a rule or a hook; stop and report | 8318634; the design's reading of ImpossibleBench (giving a model an exit cut cheating from 54% to 9%) is why the exit is now a command | worker brief, "You do not" and step 6, with the `stuck` command |
| Never push, never touch another branch | 8318634: only the feature branch leaves the machine, on the owner's word | worker brief, step 3 |
| Spawn no agents | 8318634: a worker's context is the unit that is checked; nested agents cannot be read | worker brief, step 7 |
| No file carries a task number; only the commit subject names the issue | cafbad1, 2026-10-19, the owner's rule: the loop ends and the number then points nowhere | worker brief, step 2 |
| Commit on the branch, each fix a further commit | owner's rule of 2026-10-18, one issue per commit; an amend hid what a reviewer had seen | worker brief, step 3 |
| `--root` on every call; the worker's worktree has no live `.jarl/` | 8a8113f, 2026-09-16: with the loop out of git by default, briefs sent roles to a directory that was not there | every command of every brief carries the loop root and the tool's absolute path |
| Never add `.jarl/` to your branch | same commit: a merge would then overwrite the live loop | merger brief, step 1 |
| A refused call writes nothing and ends with a form to fill | 2026-11-04/05, ruling `refusals-end-in-a-form-not-a-guess`: a call composed for the caller guessed values it did not know | worker brief, step 7, the only brief with the sentence; the merger and the examiner read it from the refusal itself, which states it and ends with the form |
| Read the rulings in force; a ruling that names your issue binds you | 0e1d1b9, 2026-09-26: a worker worked against a decision that was already taken | "Rules that reach you" in every brief, with the count and the `decisions --live` command |
| Evidence is proof; a closing checklist before reporting | 02342ce, 2026-10-19: reports skipped red and green rows and left them only in the prose | worker brief, step 4, and "What you report" |
| The changelog entry lives on the issue until the merge | eb98b67, 2026-09-26: parallel branches each adding a line under `[Unreleased]` conflicted at nearly every merge | worker brief, Commands (the `Changelog` field), merger brief, step 7 |

## The reviewer's text (the examiner)

| Part | The real failure it was the lesson of | Where it lives now |
|---|---|---|
| A worker's report is a hypothesis; a fresh one-shot reviewer | 8318634 and `fresh-reviewer-required` (2026-09-26): a self-approve, and a coordinator's approve, passed work no one independent had read | examiner brief, opening line; the gate refuses a self-approve as before |
| Read-only; never `git checkout` in the main checkout; reproduce with `git show` or `git archive` | 22a8da3, 2026-09-13: a reviewer checking out in the main checkout while a merge was running is the collision the merger's sole-committer rule exists to prevent | examiner brief, "Where to look" |
| Quote the acceptance line literally; an issue with none is a finding | 9f5d449, 2026-09-25: approves that said "looks fine" with no line they answered | examiner brief, steps 2 to 4 (each line, each method, the read lines quoted) |
| Was the new test red before and green after | 8318634; the design's three defects of 2026-11-08 that a green suite passed | examiner brief, step 2 and step 5 (the `test` line must be able to fail for the right reason) |
| Did the change weaken anything that protected | 02342ce, 2026-10-19: a green review passed a change that loosened a guard | examiner brief, step 6 |
| After a round, a new reviewer rechecks every line | d9b7cd7, 2026-11-04: a round that checked only the last findings reopened an earlier one | examiner brief, step 3 and the round rule |
| On light-tier work, re-run each command a proof row names | the owner's 2026-11-03 ruling for 6.3.0; a light worker's row for a command it never ran (design, section 3) | examiner brief, step 3: every `test`, `check`, `compare` line is re-run at any tier; the proof rows are printed as commands to re-run |
| Record your own verdict as the last step; `review` and never an evidence note | 1cba44c, 2026-10-18 and 4a7bd1e, 2026-11-03: verdicts lost in an agent's report, or typed as a note the gate could not read | examiner brief, "The verdict" |
| A finding outside the issue is filed and never turns the verdict | 5146b11, 2026-11-05, `findings-outside-the-issue-are-filed-098`: a verdict bounced work for a finding about something else | examiner brief, verdict command (`--outside`) |
| A change meant to alter nothing is checked by its comparison | 052ac8e, 2026-11-05, ruling `identical-output-light-review` | the `[compare]` method and the compare-only row of the depth table; the `identical-output` tag leaves in piece 3 |

## The merger's text

| Part | The real failure it was the lesson of | Where it lives now |
|---|---|---|
| One merger that verifies and merges | b429f34, 2026-09-13: merging ate the director's context | merger brief, opening, and the role itself; several mergers only one per target branch |
| The only committer in the main checkout | 53c9e0e and 355e2de, 2026-09-13: a reeve reconciled state by hand while a merger might still have been running, and the report that arrived afterwards described a rewritten HEAD; two committers in one checkout, one mid-merge, is how a conflict swallows the other's files | merger brief, "Where you merge" (one writer per target branch, a worktree of its own, only the holder of the main checkout commits `.jarl/`) |
| Commit `.jarl/` before each merge, and roll back with `reset --keep`, never `--hard` | f17c186, 2026-09-13: a hard reset after a red merge discarded a coordinator's uncommitted journal lines | commit `.jarl/` before each merge: merger brief, "Where you merge", the committed mode's commit step; `reset --keep`: merger brief, "A red check", first line |
| Batch branches that share no file, one check run; a red batch rolled back whole and redone one at a time | 9da2e31, 2026-09-13 | merger brief, step 4 and red check case 1 |
| Merge drivers passed on every merge, never left to the clone's configuration | 2333ff6, 2026-09-27: three silent-loss paths merging rulings and logs (a ruling both sides superseded, a slug both sides used) | merger brief, step 2 |
| A conflict the drivers stopped on is aborted, never resolved by picking a side | same commit; b429f34 | merger brief, step 3; "You do not" |
| Confirm a `done` landed before moving on | 0d12edd, 2026-09-13: the loop's record fell behind git's state twice in one day | merger brief, step 6 (`show` it and read done) |
| A red whose cause is outside the branch is no round | 993d6bd, 2026-10-18: red checks that were not the branch's fault counted as rounds and raised takeovers of work that was right | merger brief, red check case 3 |
| A branch without a fresh approve waits, and in the default mode a diff touching `.jarl/` is not merged | 8a8113f and the fresh-review rule: git treats the ignored loop as expendable | merger brief, step 1 |
| Report after the check has finished and its result is recorded | 3b285e4, 2026-11-03: merges reported before their check showed as landed | merger brief, step 5 |
| `MERGE WITHOUT THE BRANCH` / `WITHOUT THE BASE`, `SQUASH OR REBASE`, `APPROVED ON ANOTHER TIP` | 0853926 and d3e6fcd, 2026-11-03: a merge recorded a commit that lacked the branch tip, or a branch moved after its approve | merger brief, step 6, for the three that ask for an act; `SQUASH OR REBASE MERGE` is no fault and is not in the brief, the note `merged` prints says so where it arises |
| Changelog written once, in its own commit, after the batch is green | see the worker's changelog line | merger brief, step 7 |
| Nobody repairs the feature branch directly | about 4 of 73 merges in this release were repaired directly and left no trace (design, section 5) | merger brief, last line of "A red check" |

## Kept outside the briefs

| Part | Where it lives |
|---|---|
| The artifact path allowlist of `review --artifact` (the reviewer's text, 332 words, from 191e60b) | stays in `commands.md`/the help through piece 4 (design, section 13) |
| The cleanup a merge makes redundant, and the merge queue as a view | `references/merger.md` until piece 4, then `commands.md`; the merge step's own note (`merged` prints what it removed and why it kept anything) is what the merger reads |
| The light-tier and shared-review rules of the jarl (`jarl:coordinator-shared-review`, `jarl:reviewer-light-tier`) | removed in piece 3 with the four-issue unit and the re-run by tier (design, section 12) |

## What left SKILL.md and the references in piece 4 (parts over 200 words)

Piece 4 cut the guidance a director reads. Each part below had its history read with `git log -S` on the phrase that opens it and `git log` on the file it came from. "No recorded failure" means the part entered as the description of a feature, not as a lesson; it is named so that a reader knows nothing is lost by moving it.

| Part (words) | The real failure, or none recorded | Where it lives now |
|---|---|---|
| SKILL.md, the daily commands table (523) | none recorded: 81b32a9, 2026-10-19 (the split of SKILL.md, issue 337), a table added for orientation | `next --as` names each move with its command; `commands.md` has every command |
| SKILL.md, the number-collision story, and jarl.md's step 2 (383 + 394) | 29e9a80, 2026-11-04 (issue 084): two copies of a committed loop filed under one number and could not be told apart; the record needed keys and a `renumber` | SKILL.md "File first" (40 words), `repositories.md` Parallel workers (renumber, keys), `record.md` the key paragraph, and `verify`'s finding |
| SKILL.md, calling the tool and the server (about 400) | c25f3c8, 2026-09-27 (issue 424): agents ignored the MCP tools because the skill sent them to the script | SKILL.md "Calling the tool" (short), `commands.md` The tools and their fields; the Runes block unchanged in `family-rules.md` |
| The shell-quoting paragraph (79 x 5) | 48a906e, 2026-11-05: commands printed for a shell a platform does not use were pasted and misread | SKILL.md, once; each brief carries its own one-line form of the rule |
| SKILL.md, the three Runes blocks (799) | f0b62c3, 2026-09-27 (issue 472): the same passages drifted between tools | moved unchanged to `references/family-rules.md`, its pin retargeted; the 1,200-word budget of SKILL.md cannot hold them |
| jarl.md, citation grammar and the walk (600) | 0265d97 and 349c457, 2026-11-03 (issue 089): an issue's text relied on another with nothing ordering them, and a loose reading of numbers misfired | jarl.md Filing (one sentence); the tool's note says the rest wherever it fires |
| jarl.md, research import (1,008) | 02342ce, 2026-10-19 and 7919973 (issue 044): none recorded for the import itself; the comparison came from re-imports that overwrote edited text | `commands.md` Research import, whole |
| jarl.md, templates (350) | none recorded: eb98b67 (issue 288), a feature | `commands.md` Templates, whole |
| jarl.md, area rulings (687) | d5f9bef (issue 475): a ruling about a whole type of code did not reach the next agent to touch that type | `jarl.md` Who decides what, one sentence; `commands.md` Area rulings, whole |
| jarl.md, rules with a scope (260) | a1ea8da (issue 086): rules that reached every role when only one needed them | `jarl.md`, one sentence; `commands.md` Rules with a scope, whole |
| jarl.md, worked in place (290) | ee5c1f6, 2026-11-08 (issue 021): a document written on a branch had nothing to merge and no commit to name | `jarl.md` step 4, one sentence; `commands.md` Worked in place, whole |
| jarl.md, filing an issue (the body, the owner's line, After, sub-issues) | none recorded for the paragraphs as a set; the parts: 02342ce (issue 250, moments of work) | `jarl.md` Filing, condensed; the owner's line in `profile.md` The owner's sign-off |
| jarl.md, the relay for a coordinator that cannot spawn (160) | 64aefe8, 2026-09-13: a coordinator assumed it could spawn, and a resume had no form | `jarl.md` Coordinators: "does not guess", the `no-spawn` report, the spawn line and `resume <id> brief=<path>`, all restored after the first examiner found them lost |
| jarl.md, closing and permanent loops (250) | fa95409 (standing permission to push), none recorded for the rest | `jarl.md` Closing the branch, short; `commands.md` the close row; the merger's brief, step 8 (push nothing unless a goal line or a ruling grants the branch, never a worker's), restored after the first examiner found it lost |
| merger.md, the `yg log merge-resolve` follow-up (`git add` of lock files and `--amend`) | none recorded: 2333ff6, 2026-09-27 added the step with the merge drivers, and names no failure of it | the merger's brief, step 2, restored after the first examiner found it lost |
| reviewer.md, the artifact allowlist (332) | 191e60b, 2026-11-08 (issue 059): none recorded; written once so the tool and the skill could agree | `commands.md` Verdict artifacts, whole; the test holds it to the help |
| reviewer.md, identical-output (150) | 052ac8e, 2026-11-05 (issue 049) | gone with the tag: the `compare` method does its work |
| reviewer.md, the review and who records the verdict (300) | 8318634 and `fresh-reviewer-required`; 1cba44c (a verdict lost in a report) | the examiner's brief; `commands.md` Who counts as a fresh reviewer; `models.md` for `--relayed` |
| worker.md, changelog fragments (250) | eb98b67: parallel branches conflicted on `[Unreleased]` | `commands.md` Changelog fragments, whole; the worker's brief, the merger's brief |
| worker.md, the worker branch paragraph (170) | fca251a, 2026-09-13: a pushed worker branch nobody owned | SKILL.md rule, `jarl.md` step 4, the worker's brief |
| merger.md, what a merge records, the cleanup, the queue (220 + 290 + 210) | e24e266; b1fac28 (issue 319: finished worktrees piled up); eb98b67, none recorded for the queue itself | `commands.md`, three sections, whole |
| merger.md's own brief text | listed above in this file | the merger's brief, `brief --role merger` |
| composers.md, the record-library paragraph (450) and the parity table (1,500) | 709778a, 2026-09-27 (issue 463); dea6e50 (issue 336): the library and the command line differed with nothing saying where | `composers.md` (the contract, short); `record.md` What only the command line does, whole; a test still holds it cell by cell |
| composers.md, "What Jarl will not grow" | eb98b67, 2026-09-26: requests for a landing gate inside Jarl | `composers.md`, each exclusion with its own reason, and the design's section 14 |
| models.md, the whole table of what `models` shows (450), the approve that clears (300), a new model and relaying (180), the platforms (130) | 1cba44c, 2026-10-18 (issue 287): a model inherited silently, a verdict with no model; e0840af, 2026-09-13: a strong model doing clerical turns | `models.md`, shorter; `models` prints its own table, and `commands.md` has its row |
| repositories.md, the shape of worktree states and branch states (300) and the format-1/2 Repo text (120) | e24e266 (issues 273, 285): stale leases not seen; the format text goes with the formats | `repositories.md` Leases, shorter; `branches` prints the states |

No lesson had to be dropped against the word budgets.
