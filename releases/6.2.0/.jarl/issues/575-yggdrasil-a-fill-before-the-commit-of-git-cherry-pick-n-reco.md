# 575 · Yggdrasil: a fill before the commit of git cherry-pick -n records a branch entry as the baseline an…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1312-inbl
**Tags:** 
**Files:** Yggdrasil/docs/the-lock.md
**Repo:** Yggdrasil
**Found by:** rev-302-fable
**Where:** the review of 302, 303, 304
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 13:12

## What
Yggdrasil: a fill before the commit of git cherry-pick -n records a branch entry as the baseline and the committed pick reads green. It is the gap 303 closed for a squash and for merge --no-commit, and git leaves no state to read it from. CHANGELOG.md and docs/the-lock.md do not name it among the remaining limits. Tags: yggdrasil, log.

## Why


## Acceptance


[read] docs/the-lock.md and the CHANGELOG name a fill before the commit of git cherry-pick -n as a limit beside the date-keeping rebase, since git leaves no state to detect it

## Reviews
- **changes** · by rev-302b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1416-gptq
  Important, source/cli/src/core/log/log-merge-resolve.ts:1018 to :1024 (the recorded-history guard in resolveReplay, through recordedHistoryLost at :451): at a cherry-pick or a rebase stop the guard refuses histories in which nothing was rewritten. Repro on the built tool: a release branch and main share the first entry; main adds two entries, the release branch then adds one, main then adds a fix with its entry. git cherry-pick of the fix onto the release branch stops on the log, as it did before. yg log merge-resolve --node app exits 1 with log-merge-history-rewritten and says recording the log would write a baseline over a rewrite. The same log resolved by hand, the release branch's log plus the picked entry, is refused the same way. After git cherry-pick --continue, yg check reports log-integrity boundary_missing and says the log was deleted or reset. The release build writes the union, records the baseline and asks for the entry the pick owes. Cause: at the stop the lock driver keeps the oldest of three baselines, and here that is the one of the picked commit's parent. It covers main's two entries, which a cherry-pick does not carry. The guard finds that version in the picked commit's log and requires every entry of it in the result. The comment at :1018 states that requirement; it holds only when the replay carries the whole history of the replayed commit. git rebase --onto main feature topic is refused the same way at every stop when main's newest entry is newer than feature's, and so is a cherry-pick stopped on a conflict in a source file. A plain rebase of three commits stopped at the third still reconciles. No test replays a commit whose branch holds entries the target does not. Minor, docs/the-lock.md:181: the sentence says each remaining case leaves only the log-cycle-open warning. After a fill before the commit of git cherry-pick -n, yg check prints no warning, before the commit and after it; the missing warning is the limit the sentence describes. Lines: 574 line 1 met as written ("With a rebase or cherry-pick stopped on a conflict, yg log merge-resolve --node <node> with no sides refuses to record a baseline over a committed rewrite of the first entry, and yg check stays red after git rebase --continue"): the two 15b cases and the two rebase-stop unit cases fail on the code before cd2df2d26 with merge-resolve exiting 0, and pass after. 575 line 1 met ("docs/the-lock.md and the CHANGELOG name a fill before the commit of git cherry-pick -n as a limit beside the date-keeping rebase, since git leaves no state to detect it"): CHANGELOG.md:98 and docs/the-lock.md:181 both name it, and git cherry-pick -n left no CHERRY_PICK_HEAD in my run. What I tried against the replay guard and could not get past: a rewrite of the first entry and of a middle entry, 60 commits between the rewrite and the replay, git rebase --apply, a replayed commit with no entry of its own, each for a rebase and for a cherry-pick. Each run exits 1 with log-merge-history-rewritten, leaves the lock file byte for byte, and yg check exits 1 after the continue. Ran: the two test files of the line on both trees (8 of 48 fail before, 48 of 48 pass after), 215 tests in ten neighbouring log test files, 157 in tests/unit/repo, tsc, eslint on the three touched files, yg check --no-approve on the worktree (exit 0). Not run: the full suite.

## Evidence

### Notes

Assumed: named in docs/the-lock.md (the remaining limits after a date-keeping rebase) and in the CHANGELOG entry for 303, in b69103594; git leaves no state for cherry-pick -n, so the advice is to write the entry yourself.

Round 2: docs/the-lock.md now says a fill before the commit of git cherry-pick -n leaves the committed pick reading clean with no log-cycle-open warning, apart from the two cases that leave only that warning (9a8ba754f).

