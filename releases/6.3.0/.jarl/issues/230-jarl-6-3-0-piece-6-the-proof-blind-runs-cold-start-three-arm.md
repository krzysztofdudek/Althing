# 230 · Jarl 6.3.0, piece 6: the proof: blind runs, cold start, every rule tested

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261108T1910-ntot
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 229
**Found by:** jarl
**Where:**
**Branch:** jarl/230-proof
**Worker:** w-jarl-230-opus
**Model:** claude-opus-5-5
**Since:** 2026-11-09 04:47

## What
the design's section 16 made real. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 6.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] the six end-to-end scenarios of 076 are scripted and pass
- [read] `releases/6.3.0/plans/blind-tests.md` is updated: the commands of 6.3.0, a raised agent is given only its brief, and a coordinator trigger scenario is added. The runs of 076 are done as it says, with light and mid agents, one failure of a check being an issue
- [read] the cold-start drill: a fresh agent given only the record of this loop answers a fixed list of questions about its state, scored against known answers, and a wrong answer is filed
- [test] every rule of the design has a test that fails without it: a table in `skills/jarl/scripts/tests/` lists each rule of sections 3 and 6 and the name of its test, the table fails when a named test is missing, and the red run of each with its guard removed on a scratch copy is a recorded row
- [read] an independent examiner: the code does what the design says, section by section
- [check] the full suite passes on the merged result

## Changelog
- The brief a coordinator is raised with lists the open questions of its slice, says how far each issue in flight has come, and marks which issues are promises or waits, so a coordinator taking over a slice sees what the one before it left open.

## Evidence

### Proof

- **ran (line 3f0af28ec498):** TMPDIR=<scratch> node --test tests/scenarios.test.mjs tests/rule-table.test.mjs · **saw:** tests 10, pass 10, fail 0 (the six scenarios in 7 tests)
- **ran (line 3f0af28ec498):** bash probe-old.sh: the four behavioural assertions with the commands of 71ebc5b on a scratch archive of that commit · **saw:** double lease: ACCEPTED by the second call (worker now w2); two branches: on branch one the new issue took 2-on-one.md and branch two took 2-on-two.md; verify on a conflicted file: exit 0, clean; stale lease at 31 minutes: not shown by status
- **ran (line 7640ad878612):** node --test tests/rule-table.test.mjs (a scratch copy with one row naming a test that does not exist) · **saw:** fail 1: every rule of the table names a test that exists, and the table fails when one is missing
- **ran (line 7640ad878612):** TMPDIR=<scratch> node --test tests/rule-table.test.mjs · **saw:** tests 3, pass 3, fail 0
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-line-carries-its-method (its guard removed on a scratch copy) · **saw:** a-line-carries-its-method red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-key-is-one-the-method-takes (its guard removed on a scratch copy) · **saw:** a-key-is-one-the-method-takes red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-compare-names-its-command (its guard removed on a scratch copy) · **saw:** a-compare-names-its-command red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-check-without-a-command-is-the-declared-one (its guard removed on a scratch copy) · **saw:** a-check-without-a-command-is-the-declared-one red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-lease-needs-a-line (its guard removed on a scratch copy) · **saw:** a-lease-needs-a-line red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only an-unmarked-line-reads-as-read (its guard removed on a scratch copy) · **saw:** an-unmarked-line-reads-as-read red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only the-proposed-line-is-no-line (its guard removed on a scratch copy) · **saw:** the-proposed-line-is-no-line red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-test-line-needs-the-holders-row (its guard removed on a scratch copy) · **saw:** a-test-line-needs-the-holders-row red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-mechanical-line-needs-a-non-holders-row (its guard removed on a scratch copy) · **saw:** a-mechanical-line-needs-a-non-holders-row red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-compare-needs-two-identical-rows (its guard removed on a scratch copy) · **saw:** a-compare-needs-two-identical-rows red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only the-landing-proves-a-declared-check (its guard removed on a scratch copy) · **saw:** the-landing-proves-a-declared-check red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-read-line-needs-a-live-approve (its guard removed on a scratch copy) · **saw:** a-read-line-needs-a-live-approve red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-waiver-or-no-approve-profile-stands-in-for-the-approve (its guard removed on a scratch copy) · **saw:** a-waiver-or-no-approve-profile-stands-in-for-the-approve red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only an-owner-line-needs-his-tick (its guard removed on a scratch copy) · **saw:** an-owner-line-needs-his-tick red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-row-counts-only-while-its-digest-matches (its guard removed on a scratch copy) · **saw:** a-row-counts-only-while-its-digest-matches red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-caller-names-a-line-by-its-number (its guard removed on a scratch copy) · **saw:** a-caller-names-a-line-by-its-number red proof-lines.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-row-names-a-line (its guard removed on a scratch copy) · **saw:** a-row-names-a-line red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-row-counts-inside-the-window (its guard removed on a scratch copy) · **saw:** a-row-counts-inside-the-window red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-line-keeps-its-old-text-whole (its guard removed on a scratch copy) · **saw:** a-line-keeps-its-old-text-whole red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only the-brief-shows-every-change-of-the-lines (its guard removed on a scratch copy) · **saw:** the-brief-shows-every-change-of-the-lines red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only every-write-names-its-writer (its guard removed on a scratch copy) · **saw:** every-write-names-its-writer red required-names.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-lease-names-its-model (its guard removed on a scratch copy) · **saw:** a-lease-names-its-model red required-names.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-verdict-names-its-model (its guard removed on a scratch copy) · **saw:** a-verdict-names-its-model red required-names.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only merged-notes-a-check-that-matches-none (its guard removed on a scratch copy) · **saw:** merged-notes-a-check-that-matches-none red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-check-line-names-its-repository (its guard removed on a scratch copy) · **saw:** a-check-line-names-its-repository red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only status-counts-lines-by-method (its guard removed on a scratch copy) · **saw:** status-counts-lines-by-method red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-loop-of-another-format-is-refused (its guard removed on a scratch copy) · **saw:** a-loop-of-another-format-is-refused red record-format.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only init-writes-the-format-line (its guard removed on a scratch copy) · **saw:** init-writes-the-format-line red record-format.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-line-with-no-writer-is-not-read (its guard removed on a scratch copy) · **saw:** a-line-with-no-writer-is-not-read red log-reader.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only unrecorded-is-no-writer (its guard removed on a scratch copy) · **saw:** unrecorded-is-no-writer red log-reader.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-history-row-counts-for-no-line (its guard removed on a scratch copy) · **saw:** a-history-row-counts-for-no-line red log-reader.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only an-issue-closed-before-the-conversion-is-not-re-read (its guard removed on a scratch copy) · **saw:** an-issue-closed-before-the-conversion-is-not-re-read red log-reader.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only an-issue-closed-before-the-conversion-keeps-its-approve (its guard removed on a scratch copy) · **saw:** an-issue-closed-before-the-conversion-keeps-its-approve red log-reader.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only depth-all-compare (its guard removed on a scratch copy) · **saw:** depth-all-compare red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only depth-mechanical (its guard removed on a scratch copy) · **saw:** depth-mechanical red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only depth-judged (its guard removed on a scratch copy) · **saw:** depth-judged red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only depth-top-tier (its guard removed on a scratch copy) · **saw:** depth-top-tier red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only depth-takes-the-deeper-of-lease-and-now (its guard removed on a scratch copy) · **saw:** depth-takes-the-deeper-of-lease-and-now red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-report-does-not-reach-the-examiner (its guard removed on a scratch copy) · **saw:** a-report-does-not-reach-the-examiner red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only assumed-notes-reach-the-examiner (its guard removed on a scratch copy) · **saw:** assumed-notes-reach-the-examiner red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only proof-rows-are-commands-to-re-run (its guard removed on a scratch copy) · **saw:** proof-rows-are-commands-to-re-run red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only the-examiner-is-given-the-six-steps (its guard removed on a scratch copy) · **saw:** the-examiner-is-given-the-six-steps red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only changes-needs-a-critical-or-important-finding (its guard removed on a scratch copy) · **saw:** changes-needs-a-critical-or-important-finding red jarl.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-finding-outside-the-issue-is-filed (its guard removed on a scratch copy) · **saw:** a-finding-outside-the-issue-is-filed red outside-findings.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-lease-is-one-unit-of-review (its guard removed on a scratch copy) · **saw:** a-lease-is-one-unit-of-review red review-units.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-review-waits-for-the-workers-rows (its guard removed on a scratch copy) · **saw:** a-review-waits-for-the-workers-rows red moves.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-changes-stands-until-a-round-or-a-commit (its guard removed on a scratch copy) · **saw:** a-changes-stands-until-a-round-or-a-commit red line-methods.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-re-examination-reads-the-previous-findings (its guard removed on a scratch copy) · **saw:** a-re-examination-reads-the-previous-findings red moves-briefs.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only a-self-approve-is-refused (its guard removed on a scratch copy) · **saw:** a-self-approve-is-refused red gate-decide-tips.test.mjs: the named test failed without the guard
- **ran (line 7640ad878612):** node tests/rule-guards.mjs --only code-needs-a-fresh-approve (its guard removed on a scratch copy) · **saw:** code-needs-a-fresh-approve red fresh-review.test.mjs: the named test failed without the guard
- **ran (line fe2337ab86c3):** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 1800 node tests/suite.mjs (at 7c2fa20, the branch holding the release branch and main) · **saw:** tests 1722, pass 1700, fail 0, skipped 22, exit 0

### Notes

Assumed: 'one approve in each slice at once gives one merge at a time' is read as: one merger holds both approves, one merge queue lists both, and each landing leaves the other queued; the serialisation of merged itself is the merger's, per its brief.

Assumed: 'a fresh coordinator's brief' is brief --slice, and it must carry the slice's open question and its review in flight; the brief carried neither, so they were added as a plain defect the scenario decides (a new section and a stage on each lease, covered by the replacement scenario).

