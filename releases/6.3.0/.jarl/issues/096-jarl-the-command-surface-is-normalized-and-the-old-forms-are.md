# 096 · Jarl: the command surface is normalized and the old forms are removed: one command per kind of change, one meaning per flag, one name for free text, one rule for the author

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 052, 085
**Found by:** owner
**Source:** research/2026-11-03-jarl-as-a-loop-tool#surface-normalization
**Where:**
**Branch:** jarl/096-normalized-surface
**Worker:** w-jarl-096-opus
**Worktree:** /Users/me/.jarl-wt/JarlSkill-096
**Since:** 2026-11-04 10:33

## What
Ruling normalize-the-surface-old-forms-out. At release/6.2.1 7a10c53 Jarl has 44 commands and about 17 read views; an issue's field is changed by field and also by prio, tag, files, repo, source and after, each with its own grammar; --by is the author on writes and the grouping in status and models; free text is a field named why, text, findings, what, question, answer, ruling, event or reason depending on the command; the author is required on review, defaults to the owner on answer and decide, and is optional elsewhere.

## Why
An agent pays for every form it must remember and every wrong guess; one form per thing, refused old forms that name the new one, and fewer views are what lets the guidance shrink (088).

## Acceptance
- One command changes any field of an issue (header fields and the description's sections) with one grammar for setting, adding, removing and clearing; prio, tag, files, repo, source, after and body are removed, and each removed command is refused with one line naming the form that replaces it
- A flag name means one thing across commands: --by is always the author; grouping is --group in status and models; --kind is the kind of the thing the command writes or filters; a test over the command table checks it
- Free text has one name in every tool (text) and one place in every command's usage
- The author is required on every write that records a judgement (review, answer, decide, retract) and optional elsewhere; an unnamed write shows as unnamed (as 085 says)
- The read views are reviewed against next --as (052): a view that only shows part of another is removed or folded into it, refused with the view that replaces it, and the help gives each remaining view one purpose in one line
- Every refusal ends with a ready command or the flag to add (folds 053); SKILL.md and the references use only the new forms
- Easy for an agent (ruling surface-easy-for-agents): a fresh agent on the light tier, given only SKILL.md and the help, files an issue, changes its fields, leases it, records proof, records a review, answers a question and closes it on a scratch loop, with no call refused for a wrongly guessed form; its transcript is kept in research/2026-11-03-jarl-as-a-loop-tool

## Changelog
- Changed: Every change to a task's description now goes through one command, field: give a part a value to replace it, or add to it, take items off it or clear it with --add, --remove or --clear. The commands that each changed one part (body, tag, prio, files, repo, source and after) are gone: using one prints the field call that does the same. A repository's base branch is changed with base, and set takes statuses only.
- Changed: The counts of status and models are grouped with --group, and --by always names who did a write. check is no longer a second name for scope, and a review or a piece of proof is taken back only with retract; each old spelling is refused with the call to use instead.
- Changed: Free text is given the same way to every command: as the last argument on the command line, and as the field text in the tools.
- Changed: An answer and a ruling given on the command line or through the tools now always say who gave them: answer and decide need --by, and nothing is taken to be the owner's or the coordinator's when no name is given. A tool built on the record library records an answer as the owner's and a ruling as the coordinator's when it names nobody, as before.
- Changed: When Jarl refuses a call, it says why, and the last line of the message is a command to paste: your call fixed, the step that has to come first followed by your call, or the command that does what you asked, with a value only you know shown as a <placeholder>. The command keeps every word you gave, quoted so that a shell takes it as it is, with a text that starts with -- after a bare --.
- Changed: The merge queue and the branch tips are read in resume: tips and queue are gone, and using either prints the resume call that shows the same. resume --repo narrows both to one repository, --base sets the merge queue's base, and --gh asks gh for the CI of the tips (resume --ci is refused with the --gh call; a tool built on the record library still asks with ci).

## Evidence

Ruling surface-may-break-nothing-lost: Krzysztof, 2026-11-03 (translated from Polish): "It can be breaking. The API surface for the agent is flexible, and we break nothing as long as we lose nothing." The surface of 096 may change incompatibly; what must hold is that no capability is lost: every function a removed form had is reachable through a new form, and every loop written before stays readable.

Ruling surface-easy-for-agents: Krzysztof, 2026-11-03 (translated from Polish), correcting the reading of his earlier words: "I mean, I do not know about the condition that we lose nothing; I simply want a nice Jarl with a nice API that an agent finds easy to use and understand. That is all." The aim of 096 is an API an agent finds easy to use and understand; breaking the old surface is allowed. The formal test that every removed form maps to a new one is dropped; ease is checked instead: a fresh agent on the light tier, given only SKILL.md and the help, does a set of ordinary tasks without a call refused for a wrongly guessed form (that check is the analysis session's proposal, not his wording).
- **ran:** node --test tests/surface.test.mjs (the field tests, against the release/6.2.1 code extracted to scratch) · **saw:** tests 7, pass 0, fail 7: field refuses --add and section names; prio, tag, files, source, after, repo and body run instead of being refused; set writes a field; base is an unknown command
- **ran:** node --test tests/surface.test.mjs (JarlSkill skills/jarl/scripts, branch jarl/096-normalized-surface, before the first commit) · **saw:** tests 7, pass 7, fail 0
- **ran:** copy of releases/6.3.0/.jarl, release/6.2.1 code: prio 096 2; field 096 Tags --add surface; field 096 What x · **saw:** 096 priority 2; unknown flag --add for field; What is not a field of the description ... a section is written by body <ids> --what
- **ran:** same copy, branch code: prio 096 2; field 096 Tags --add surface --by w-jarl-096-opus; field 096 Acceptance "a line added on a scratch copy" --add; field 096 Tags surface --remove; then the driver's status · **saw:** prio is not a command; the priority is a field: jarl.mjs field 096 Priority 2; 096 Tags: design, surface; log 096 field Tags · design, surface · was design · by w-jarl-096-opus; 096 body · acceptance · was ... (1489 characters); 096 Tags: design; driver status exit 0
- **ran:** node --test tests/surface.test.mjs (the flag tests, at 2cb0722 before the flag change) · **saw:** tests 10, pass 7, fail 3: --by and --group not checked against a table of meanings; status --by repo still groups and --group is unknown; evidence --retract, review retract and check still run
- **ran:** node --test tests/surface.test.mjs (after the flag change) · **saw:** tests 10, pass 10, fail 0
- **ran:** node --test tests/surface.test.mjs (the free-text tests, at f781548 before the rename) · **saw:** tests 12, pass 10, fail 2: the free text of set, review, round, ask, answer, log, decide and retract is named why, findings, what, question, answer, event, ruling and reason; jarl_evidence/round/set/log/ask refuse a text field
- **ran:** node --test tests/surface.test.mjs (after the rename) · **saw:** tests 12, pass 12, fail 0
- **ran:** node --test tests/surface.test.mjs (the author test, at f989216 before the change) · **saw:** tests 13, pass 12, fail 1: answer a-1 "this way" without --by was accepted and recorded as the owner's
- **ran:** node --test tests/surface.test.mjs (after the change) · **saw:** tests 13, pass 13, fail 0
- **ran:** node --test --test-name-pattern 'every refusal of a writing' tests/surface.test.mjs (at c218102, before the refusal texts changed) · **saw:** fail 1: 30 of 44 wrong calls ended without a ready command or a flag to add, among them new with no title, --tier huge, set 1 bogus, review without --by, merged without --sha, a duplicate slug and no such issue
- **ran:** node --test tests/surface.test.mjs (after) · **saw:** tests 14, pass 14, fail 0
- **ran:** the same red run again, the code of c218102 extracted to scratch with the new surface test: node --test --test-name-pattern 'every refusal of a writing' tests/surface.test.mjs · **saw:** pass 0, fail 1: 35 of the 42 wrong calls listed bare (the row above estimated 30 of 44 before counting; this row is the count)
- **ran:** node --test tests/surface.test.mjs (the views help test, at 797c030 before the views section) · **saw:** tests 15, pass 14, fail 1: the help has no views section
- **ran:** node --test tests/surface.test.mjs tests/mcp-runes.test.mjs tests/mcp.test.mjs tests/help-workflow.test.mjs tests/docs-true.test.mjs tests/vocabulary.test.mjs tests/tense.test.mjs tests/jarl.test.mjs (after) · **saw:** tests 282, pass 281, fail 0
- **ran:** copy of releases/6.3.0/.jarl, branch code at 1d4ac2d: status --by repo; status --group repo; decide x-y "a ruling"; check 096 --branch jarl/096-normalized-surface; then the driver's status · **saw:** status groups its counts with --group, and --by names the author of a write: jarl.mjs status --group repo; by repo: Horde open 1 / JarlSkill open 55 · in flight 2 · done 43 / Yggdrasil dropped 1; decide records who ruled: jarl.mjs decide x-y "a ruling" --by <who ruled, ...>; check is not a command; a branch is measured by scope: jarl.mjs scope 096 --branch jarl/096-normalized-surface; driver status exit 0
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (branch tip 1d4ac2d) · **saw:** tests 1131, pass 1109, fail 0, skipped 22, exit 0
- **ran:** node --test tests/surface.test.mjs (the fold test, on the code of 1d4ac2d extracted to scratch) · **saw:** tests 16, pass 14, fail 2: tips and queue still commands, resume takes no --repo or --base; the flag table names queue for --repo and --base
- **ran:** node --test tests/surface.test.mjs (on the fold, before its commit) · **saw:** tests 16, pass 16, fail 0
- **ran:** TMPDIR under ~/Temp/tmp/w096b, cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (the tree committed as f35af5b) · **saw:** tests 1130, pass 1110, fail 0, skipped 20, exit 0
- **ran:** node --test --test-name-pattern 'use no command or flag the surface refuses' tests/surface.test.mjs (the code and skill of f35af5b extracted to scratch) · **saw:** pass 0, fail 1: references/jarl.md:114 (source <id>), references/profile.md:100 twice (status --by, body --section/--acceptance), references/reviewer.md:44 (findings:), references/worker.md:30 (jarl_body)
- **ran:** node --test tests/surface.test.mjs tests/unordered-names.test.mjs tests/workflow-texts.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/vocabulary.test.mjs tests/tense.test.mjs tests/jarl.test.mjs (after the fixes) · **saw:** tests 279, pass 278, fail 0
- **ran:** node --test tests/surface.test.mjs (the shell trial and carry tests, on the code of 75947fb extracted to scratch) · **saw:** tests 19, pass 13, fail 6: the printed calls wrote one acceptance line holding a backslash-n and dropped --by, the reason and --tag; files 1 "" printed Files ""
- **ran:** node --test tests/surface.test.mjs, then tests/grammar.test.mjs tests/jarl.test.mjs (after: the printed calls run through /bin/sh against a scratch loop) · **saw:** tests 19, pass 19, fail 0; pass 193, fail 0
- **ran:** node --test --test-name-pattern 'every refusal of a writing' tests/surface.test.mjs (77 wrong calls, the code of 8bc00b3 extracted to scratch) · **saw:** pass 0, fail 1: 41 refusals did not end with a command or a flag on their last line
- **ran:** node --test tests/jarl.test.mjs tests/owner-sign-off.test.mjs tests/surface.test.mjs (after) · **saw:** pass 211, fail 0
- **ran:** node --test tests/surface.test.mjs (the minor tests, the code of 305f641 extracted to scratch) · **saw:** tests 20, pass 16, fail 4: Repo --add of a held path added it again; list --kind as a switch went unseen and --ci took two shapes; answer, decide, review, retract and tick did not require by
- **ran:** TMPDIR under ~/Temp/tmp/w096c, cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (the tree committed as 6b249a4) · **saw:** tests 1134, pass 1114, fail 0, skipped 20, exit 0
- **ran:** walk of the reviewers' 107 wrong calls (rev-calls.json, rev-calls2.json) on the reviewer's pristine loop, each ready line run by /bin/sh, against 6b249a4 (before round 2) · **saw:** calls 107, refused 103, problems 107: no refusal has its ready command on a last line of its own (e.g. new requires "<title>": jarl.mjs new "<title>" --tier light|standard|strong ...)
- **ran:** the same walk against 09a7481 · **saw:** calls 107, refused 103, problems 0 (4 calls go through: set onto a branch issue 2 holds, answer a-3 'maybe later', evidence 1 '-x note', field Tags --add --by -w)
- **ran:** mutation: refusalFor on a scratch copy ends every field refusal with 'jarl.mjs list --all'; node --test --test-name-pattern 'generated wrong call' tests/refusals.test.mjs · **saw:** fails: ["field"]: the ready command calls list, not field: jarl.mjs list --all, and every other field call
- **ran:** cd skills/jarl/scripts && TMPDIR=$HOME/Temp/tmp/w096d/full nice -n 15 timeout 2400 npm test (at 09a7481) · **saw:** tests 1138, pass 1118, fail 0, skipped 20, cancelled 0; exit 0

