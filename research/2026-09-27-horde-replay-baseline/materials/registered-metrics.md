Registered 2026-09-27 before any replay run (first mission not yet framed).
Set: 080 095 105 110 119 123 332 363 377 (bases/merges/defects as selected).
Metrics:
1 owner interventions per ticket (framing questions not answered by ticket text; frame go reported separately; ask.mjs items stop/stuck/lower/charter); operator env repairs reported separately.
2 known defect caught before landing: probe fixed per defect (historical fix test applied to landed tree, or named doc/contract claims checked); not landed = not caught; record what caught it.
3 red CI after merge: scripts/repo-check.sh + lock-history-audit on horde trunk vs base sha; red counts only where base green on same step.
4 blind diff grade: fresh Opus reviewer, ticket text + shuffled unlabeled diffs (Horde (i) + historical), 1-5 on correctness, completeness, tests, scope.

REVISION 2026-09-27 (before any mission of the final set was framed): the first set (080 095 105 110 119 123 332 363 377) cannot run: Horde bbd50bb refuses a Yggdrasil CLI reporting 6.0.0 ("Horde needs 6.1.0 or newer"), and every base before 65bfb3967 (2026-09-25 version bump) builds a 6.0.0 CLI. Final set, all bases descending from 65bfb3967: 233 234 239 308 332 363 377 378. Metrics unchanged.

OPERATOR BUDGET RULE, added 2026-09-27 after the cut stage and before any worker ran or anything landed: a mission gets at most 20 agent spawns (architect, consultants, workers, reviews). A mission whose plan needs more is stopped where the budget runs out and scores "not landed" on metric 2, with the reason. Chairman asks the historical record does not answer are answered with the narrowest option that keeps the ticket's scope, and each counts on metric 1.

THROTTLING, 2026-09-27 ~14:05, at the coordinator's request (container load 30-50 was timing out other workers' hooks): one mission at a time (r332 paused until r308 finishes), gate.sh/fast.sh/testfile.sh wait until the 1-minute load is <= 12 and cap vitest at 4 threads/forks; the worker fast check runs only tests related to files changed against the horde trunk (vitest --changed). The landing gate still runs the full scripts/repo-check.sh, so metric 2 and 3 are measured as registered.
