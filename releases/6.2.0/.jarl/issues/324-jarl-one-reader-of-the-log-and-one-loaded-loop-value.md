# 324 · Jarl: one reader of the log and one loaded-loop value

**Status:** in-progress
**Kind:** cleanup
**Priority:** 2
**Tier:** strong
**Tags:** jarl, refactor
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs
**Repo:** ../../../JarlSkill
**After:** 319
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (journalById, gateState, loopMetrics, parseIssueEvents, followUpsByIssue, leaseWorkers, LEASE_WORKER, roundsOf, cmdRound, cmdTips, cmdStatus, cmdResume, LOOP_DIRS, BRANCH_WORKERS, cmdModels)
**Branch:** jarl/324-log-reader
**Worker:** w-r1-sonnet
**Since:** 2026-10-18 20:02

## What
The architect code review of 2026-10-18 (R1 and R2, from findings S1 and S2). The log of a loop is read by five readers with three grammars: journalById, gateState, loopMetrics, parseIssueEvents (used only by models) and raw reads in cmdStatus, cmdResume, roundsOf, cmdRound and cmdTips. The worker grammar of a lease line is written twice (leaseWorkers and LEASE_WORKER), and the follow-up rule twice (loopMetrics and followUpsByIssue). Per-command state lives in hidden globals instead of a value: LOOP_DIRS, which cmdModels rewrites so that the loop directory points at an archive while models are read; BRANCH_WORKERS, a WeakMap keyed by the identity of an issues array; and default-parameter chains such as gateState(root, id, events = journalById(root), issues = loadIssues(root), journal = journalById(root)), with a comment warning that a caller must load once and pass the same array. The change: one typed event parser, parseEvent(id, text), returning filed, move with its lease, round, evidence row, verdict with its model and relay, retracted row, retracted review, merged, CI and body events, and one loopEvents(dir) over it. The gate, metrics, models, follow-ups, rounds (roundsOf and round), tips and the timestamps that status and resume print consume its events, and one follow-up function serves both metrics and models. One loop snapshot, readLoop(dir), carrying the directory, profile, issues, issues by id, events by id, asks, decisions and goal, is read once per command and passed to the gate, the views and models; models reads an archive by passing its directory. LOOP_DIRS, BRANCH_WORKERS, the default-parameter chains and the quadratic-cost warning go. It is a refactor: what every command prints, writes and refuses stays the same, record.mjs keeps its exports, and the record format does not change.

## Why
Every new kind of log line has to be taught to four replays that must agree for the done gate to be right, and a consistency check would become a sixth reader. A global that redirects where a loop is found makes the result of a call depend on what ran before it in the same process, which the MCP server, a long-lived process, makes real. With one parser and one loaded value, each rule about the log lives in one place, and every later package adds its line kind there once. The gate semantics are what is at risk, so this is strong-tier work, reviewed by a fresh reviewer of a different model, with the existing gate tests as the oracle.

## Acceptance
- cd skills/jarl/scripts && npm test is green, and no existing test file changes: git diff --stat <base>...HEAD -- skills/jarl/scripts/tests lists no modified file, recorded as a --ran/--saw row
- The gate tests are the oracle: node --test on fresh-review.test.mjs, retract.test.mjs, show-window.test.mjs and gate-decide-tips.test.mjs passes unchanged, each recorded as its own --ran/--saw row
- The log file is read in one place: grep -n "log.md" skills/jarl/scripts/jarl-lib.mjs lists only the path of the file, the append and loopEvents, recorded as a row; journalById, if kept, is a view over loopEvents and holds no regular expression of its own
- grep -cE "LOOP_DIRS|BRANCH_WORKERS|followUpsByIssue|LEASE_WORKER" skills/jarl/scripts/jarl-lib.mjs prints 0; the lease worker grammar and the follow-up rule each exist once, used by the gate, metrics and models
- No function takes a loaded value as a default parameter: grep -nE "= *(journalById|loadIssues|loadProfile|loopEvents|readLoop)\(" skills/jarl/scripts/jarl-lib.mjs lists no parameter list, recorded as a row
- The outputs do not change on a real record: status --json, report --json, next --all --json, models --json, tips --json and show --json of every issue, run with the base and with the branch on the same frozen copy of a real loop (JARL_LIVE_LOOP), are byte-identical, recorded as rows; without the variable that check is skipped with a reason naming it
- The record contract and format do not move: git diff <base>...HEAD -- skills/jarl/scripts/record.mjs prints nothing, record-contract.test.mjs and format-marker.test.mjs are green, and RECORD_FORMATS is unchanged
- Every comment the change adds states the property of the code in the present tense, with no version number and no reference to an earlier Jarl

## Evidence

