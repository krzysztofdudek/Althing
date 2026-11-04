# 086 · Jarl: rules with a scope reach every brief and view they concern, Jarl's role guidance ships as such rules, and a loop's rules are offered for promotion at close

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-scoped-rules
**Where:**
**After:** 035, 052, 083, 085
**Branch:** jarl/086-scoped-rules
**Merged:** 9f971b6 in ../../../JarlSkill
**CI:** none

## What
The owner asked for rules that attach not only to the loop or one issue but to a role, a tag and other scopes, delivered without anyone having to remember them (README of research/2026-11-03-jarl-as-a-loop-tool). Report section 6. Folds 020 (the loop-scoped rule), 061 and 062 (rulings in resume), 051 (the reviewer's rank) and the rule half of 050.

## Why
A rule written once in prose is lost when a brief is written by hand; in the field a rule the reviewer reference already held never reached the reviewers (058's evidence).

## Acceptance
- decide takes an Applies to with one or more selectors joined by and (the loop, a role, a tag, an issue, a kind, a slice as 085 defines it, an area of files, a repository, a moment of work) and an end (revoked, a date, an issue closing)
- resume --as and next --as (052) print the rules that match the asker, whole, and nothing else; resume no longer prints every ruling in force; the brief (058) prints them too, in 058
- An agent can propose a rule with the ball on the jarl, or on the owner where the rule is his; once accepted it reaches every matching view and brief
- Jarl ships built-in rules quoted from the role references, and a rule the references do not hold yet is written there first, at least: reviewer, every round: re-check every acceptance line; reviewer, light-tier work: re-run each command a proof row names; reviewer, format, contract or visual work: a tier above the worker; reviewer, a change meant to alter nothing: check that its identical-output comparison covers everything it touched (049); coordinator: the four reasons to escalate (written by 085); coordinator: pull before leasing, push right after; one shared review only over issues that are one contract or one screen, at most four; worker: do only the issue, and report anything else you find so it is filed, never fixed on the side; reviewer: the verdict judges the issue's acceptance and what the change itself broke, and a finding outside that is filed as a new issue and never turns the verdict to changes; coordinator: an issue's scope does not grow once it is leased, and a new ask becomes a new issue (ruling findings-outside-the-issue-are-filed)
- close offers each loop rule for promotion: carried into the next loop, written into the repository's agent instructions, written into Yggdrasil's law when it is about code (as area rulings are today), or dropped
- Whether Applies to raises the record format is checked and stated; tests for matching, a slice selector among them, ending, proposing and promotion

## Changelog
- Added: A ruling can say whom it is for and until when: the whole loop, a role such as reviewers or workers, one coordinator's part of the backlog, a tag, a kind of task, a set of files, a repository or a moment of the work, and it can end on a date or when a task closes. The resume and the list of what is waiting on someone show that person the rules meant for them, in full, and the resume no longer lists every ruling.
- Added: Jarl gives coordinators, workers and reviewers its own working rules for their role, such as re-checking every acceptance line on each review round.
- Added: Anyone in the loop can propose a rule, for whoever runs the loop to accept, or for the owner when the rule is his. When the loop closes, each of its rules is offered to the owner: keep it for the next loop, write it into the repository's instructions for agents, make it a rule of the code, or drop it.

## Evidence

- **ran:** skills/jarl/scripts at release/6.2.1 4f741c3 with tests/scoped-rules.test.mjs and tests/old-jarl.mjs of a1ea8da copied in: node --test tests/scoped-rules.test.mjs · **saw:** pass 0, fail 4 (decide --applies-to unknown: no scope line, no refusal, no end, no old-reader case)
- **ran:** JarlSkill-086 at a1ea8da: node --test tests/scoped-rules.test.mjs · **saw:** tests 4, pass 4, fail 0 (scope line first in the closing block; refusals; ends by date, by issue, by supersession; 6.1.0 and 6.2.0 readers keep By and Superseded by, the scope as the ruling's last line, profile stays format 1)
- **ran:** skills/jarl/scripts at a1ea8da with tests/scoped-rules.test.mjs of the matching step copied in: node --test tests/scoped-rules.test.mjs · **saw:** pass 4, fail 3: next --as prints no rules, the worker and the jarl get none, resume still prints Rulings in force (40 rulings on the 6.3.0 loop copy)
- **ran:** JarlSkill-086 at d9b7cd7: node --test tests/scoped-rules.test.mjs · **saw:** tests 13, pass 13, fail 0 (matching per role, slice, tag, moment, files, repo, kind; built-in rules quoted from the references; proposing on the jarl and on the owner; promotion at close; composer loop offered none)
- **ran:** copy of releases/6.3.0/.jarl: jarl.mjs resume, release tip vs d9b7cd7 · **saw:** before 107 lines 20396 bytes with Rulings in force (40); after 70 lines 9764 bytes: 40 ruling(s) in force: jarl.mjs decisions --live, Rules for the whole loop (0)
- **ran:** JarlSkill-086 at 264b40e, skills/jarl/scripts: nice -n 15 timeout 1800 npm test · **saw:** tests 1078, pass 1055, fail 0, cancelled 0, skipped 23, exit 0
- **ran:** skills/jarl/scripts at e55fa9b (merge of release/6.2.1 5ce62f0, before the round-2 fixes) with tests/scoped-rules.test.mjs of 2d50ebd copied in: node --test tests/scoped-rules.test.mjs · **saw:** tests 16, pass 12, fail 4: resume count (8 in force, decisions --live 7), two-line rule printed whole, jarl of a loop with no slice given coordinator rules, removing close names no answer
- **ran:** JarlSkill-086 at 2d50ebd: node --test tests/seams.test.mjs tests/scoped-rules.test.mjs tests/modules.test.mjs · **saw:** pass 35, fail 0
- **ran:** JarlSkill-086 at 2d50ebd, skills/jarl/scripts: nice -n 15 timeout 1800 npm test · **saw:** tests 1091, pass 1068, fail 0, cancelled 0, skipped 23, exit 0
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at 9f971b6 with 086 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1091 tests, 1068 pass, 0 fail, 23 skipped

