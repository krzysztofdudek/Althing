# 325 · Jarl: one reader per file of the record, and the seams test

**Status:** done
**Kind:** cleanup
**Priority:** 2
**Tier:** standard
**Key:** 20261018T1941-jppt
**Tags:** jarl, refactor
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/tests/helpers.mjs, JarlSkill/skills/jarl/scripts/tests/seams.test.mjs, JarlSkill/skills/jarl/scripts/tests
**Repo:** ../../../JarlSkill
**After:** 324
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (coordinatorNames, declaredChecks, modelLines, cmdStatus, cmdReport, mergeRefusal, cmdMerged, issueRepos, leaseProblems, cmdTips, loopRepos, repoNames, repoLabel, mainCheckoutOf, worktreeState, branchesIn, expandIds, idsNamed, isBulk, issuesOnBranch, cmdSet, appendDecision, TOOL_FIELDS, renderResume); jarl.mjs (setCommand, dispatch); record.mjs (setStatus, setField); the local helpers of the test files
**Branch:** jarl/325-seams
**Merged:** 6d73cf7bbc9424f7d775a4ae1e842ba664068ecb in ../../../JarlSkill
**CI:** pending

## What
The architect code review of 2026-10-18 (R3 to R8, from findings S3 to S9, C3, C6, and the cheap items listed under R8). Each file of the record is parsed in several places with copies of one grammar, and every remaining package of the release would add another copy. The change, all in one package: (1) one goalLines(text) reader, returning goal, checks, checks per repository, models and coordinators, with one writer beside it, used by coordinatorNames, declaredChecks, modelLines, status and report; (2) one repository resolver, issueRepos, used everywhere an issue names its repositories (mergeRefusal, merged, leaseProblems, tips, loopRepos), one worktree-list parser for mainCheckoutOf, worktreeState and branchesIn, and one repository label for report, models and branches; (3) one ids section holding expandIds, idsNamed, isBulk, the ids read from branch names (issuesOnBranch and the queue) and a-N, over ID_SRC, so that 322 and 289 settle one id grammar there; (4) one routing for set in the lib (setCommand in jarl.mjs and the pre-checks of setStatus and setField in record.mjs reduce to the call), one lease-flag guard, appendDecision reusing markDecision, and Resources in TOOL_FIELDS so a profile cannot shadow it; (5) tests/helpers.mjs with run, jarl, refuses, loop and gitRepo, each spawn with an explicit timeout, imported by the test files in place of their own copies; (6) tests/seams.test.mjs, which greps the lib for the review rules 1 to 5 (only the journal section names log.md, decisions.md, asks.md or goal.md or holds the stamp pattern; only the issue-file section parses a header or a section; git runs in one place; views never write; no upward import) and for the present-tense comment rule, so every later package is held to them. Cheap items in the same package: reviewState and REVIEWER_KINDS deleted; lastSetCaller replaced by a check in the contract test against the log line of the move; branches, decide and decisions rendered through renderBranches, renderDecide and renderDecisions instead of inline in dispatch; renderResume reusing renderTips and renderQueue; and the roughly 35 comments that narrate past versions rewritten as present-tense statements of the property they guard, keeping the fact each states. It is a refactor: behaviour unchanged, the refusal texts of setStatus and setField word for word.

## Why
A rule that lives in five copies changes in one and drifts in four, and the open packages of the release (Check lines per repository, the goal command, repositories as an entity, verify, the id grammar, the check notes) each land on exactly these seams; written once, each of them adds one key or one call instead of one more parser. The seams test turns the shape into something a script holds, so it cannot erode while the file is still one module. Shared test helpers with explicit timeouts end the copies in eight test files and make a hung spawn fail instead of waiting.

## Acceptance
- cd skills/jarl/scripts && npm test is green, and no existing assertion changes: git diff <base>...HEAD -- skills/jarl/scripts/tests | grep -cE "^[-+][^-+].*assert" prints 0 outside seams.test.mjs, helpers.mjs and the contract test line that replaces lastSetCaller, recorded as a row
- grep -n "goal.md" skills/jarl/scripts/jarl-lib.mjs lists only the path of the file and goalLines with its writer; the bold-key line pattern of goal.md occurs once in the file, recorded as a row
- grep -c "reposNamed(i).length" skills/jarl/scripts/jarl-lib.mjs prints at most 1 (inside issueRepos), the worktree list is split in one function (grep -c "worktree list" lists one parsing site), and one function labels a repository, recorded as rows
- The ids section is one block over ID_SRC: no regular expression for an id, a range or an id in a branch name exists outside it, checked by seams.test.mjs; the output of idsNamed is unchanged
- The set routing is decided once, in the lib: grep -cE "branch.,.*worker.,.*model.,.*worktree" skills/jarl/scripts/jarl-lib.mjs prints 1; appendDecision calls markDecision; a profile declaring a field named Resources is refused as shadowing a built-in field, tested; the refusal texts of setStatus and setField are word for word as before, proved by record-contract.test.mjs unchanged and green
- grep -cE "reviewState|REVIEWER_KINDS|lastSetCaller|lastCaller" skills/jarl/scripts/jarl-lib.mjs skills/jarl/scripts/record.mjs prints 0 for each file
- tests/helpers.mjs passes a timeout to every spawn; grep -lE "^(async )?function (jarl|loop|refuses|gitRepo)\(" skills/jarl/scripts/tests/*.test.mjs prints nothing, recorded as a row
- tests/seams.test.mjs holds the review rules 1 to 5 and the present-tense comment rule, passes on the result, and has one case per rule proving it fails on a sample that breaks it
- branches, decide and decisions print through renderBranches, renderDecide and renderDecisions, renderResume calls renderTips and renderQueue, and their outputs are byte-identical to the base on the tests and on a frozen copy of a real loop (JARL_LIVE_LOOP), recorded as rows
- No comment in the scripts names a past version: grep -nE "//.*([0-9]+\.[0-9]+\.[0-9]+|older|before .* existed|no longer|earlier version)" skills/jarl/scripts/*.mjs lists only the exceptions seams.test.mjs names (the frozen earlier reader and the record format values), recorded as a row
- git diff <base>...HEAD -- skills/jarl/scripts/record.mjs changes no export (RECORD_API unchanged) and the record format does not change: format-marker.test.mjs green

## Changelog
- Added: a profile cannot declare a field named Resources; Jarl refuses it.

## Evidence

- **ran (history):** cd skills/jarl/scripts && npm test (branch tip) · **saw:** 408 tests, 391 pass, 0 fail, 17 skipped (the live-loop cases skip without their environment)
- **ran (history):** git diff <base>...HEAD -- skills/jarl/scripts/tests (minus seams, helpers, goal-lines) | grep -E '^[-+][^-+].*assert' · **saw:** only the removed assert.notEqual of the copied refuses helpers, the replaced lastSetCaller test (now checks the caller against the move's log line and the set-by refusal), and the old Resources-shadowing test (replaced by the refusal test, intended); no other assertion or expected value moved
- **ran (history):** grep -n 'goal\.md' jarl-lib.mjs; grep -c bold-key goal-line pattern · **saw:** goal.md is named once, as GOAL_FILE in the journal section; the bold-key line pattern occurs once, in goalLines; goalLineText is its writer; coordinators, checks, models, status and report read through goalLines
- **ran (history):** grep -c 'reposNamed(i).length' jarl-lib.mjs; grep -c 'worktree list' jarl-lib.mjs; grep -cE "branch.,.*worker.,.*model.,.*worktree" jarl-lib.mjs; grep -c '^function repoLabel(' jarl-lib.mjs · **saw:** 0, 1 (worktreesOf, the one parsing site), 1 (LEASE_FLAGS), 1 (repoLabel, used by report, models, branches and the cleanup)
- **ran (history):** node --test tests/seams.test.mjs at the branch tip, and the same file run over the release tip's scripts copied to scratch · **saw:** tip: 9 pass; release tip: 7 of 9 fail (rules 1, 2, 3, 6, the resolvers, the dated comments; rules 4 and 5 already held); each rule also has a sample that breaks it and is found
- **ran (history):** status, status --json, resume, next --all (text, json), report (text, json), models (text, json), list --all, tips (text, json), queue, branches, show --full of five issues, decisions (all, live) on a frozen copy of this loop, byte-compared with the release tip's output after each commit; JARL_LIVE_LOOP golden test over the same copy · **saw:** all 21 outputs identical byte for byte after each of the commits; tests/live-loop.test.mjs: 14 pass, 0 fail against golden files taken at the release tip
- **ran (history):** grep -cE 'reviewState|REVIEWER_KINDS|lastSetCaller|lastCaller' jarl-lib.mjs record.mjs; grep -lE '^(async )?function (jarl|loop|refuses|gitRepo)\(' tests/*.test.mjs; grep -nE '//.*([0-9]+\.[0-9]+\.[0-9]+|older|before .* existed|no longer|earlier version)' *.mjs · **saw:** 0 and 0; no file listed; no comment listed (the seams test names no exception)
- **ran (history):** git diff <base>...HEAD -- skills/jarl/scripts/record.mjs; node --test tests/record-contract.test.mjs tests/format-marker.test.mjs tests/next-views.test.mjs · **saw:** record.mjs changes only the bodies of setStatus and setField (they call cmdSetStatus and cmdSetField, whose refusal texts are the old ones word for word); RECORD_API and every export unchanged; contract, format-marker and the new Resources refusal test green
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 6d73cf7 · **saw:** 409 tests, 392 pass, 0 fail, 17 skipped

