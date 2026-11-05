# 098 · Jarl: a reviewer files a finding outside the issue without turning its verdict to changes, and a scope that grows after the lease shows

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 096
**Found by:** owner
**Source:** research/2026-11-03-jarl-as-a-loop-tool#findings-outside-filed
**Where:**
**Branch:** jarl/098-review-scope
**Worker:** w-jarl-098-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/098-review-scope
**Since:** 2026-11-05 11:05

## What
Ruling findings-outside-the-issue-are-filed. Today a reviewer's findings are one text: a gap outside the issue, written as Important, makes the verdict changes and sends the worker into a round on work nobody asked for; and the coordinator can widen an issue's acceptance while it is leased with nothing to show it.

## Why
A simple change grew over three rounds in the owner's other work for exactly these two reasons.

## Acceptance
- review takes findings outside the issue apart from its verdict; each is filed as a new issue whose finder is the reviewed issue, and a changes verdict whose only Critical or Important findings are outside the issue is refused with the command that files them instead
- A change to an issue's acceptance while it is leased prints a note that its scope grew after the lease, names the line, and is logged; report counts such changes per coordinator
- Tests for both

## Changelog
- Added: A reviewer can hand in a problem it found outside the task with its verdict, and Jarl files it as a new task found by that reviewer. Such a problem never sends the work back; a verdict that would send it back for that alone is refused.
- Added: When a task's checkable lines grow after a worker took it, Jarl says so and names the new line, and the report counts these changes for each person who made them.

## Evidence

Ruling findings-outside-the-issue-are-filed-098: Same ruling as findings-outside-the-issue-are-filed, with its issue number corrected: the reviewer's way to file a finding outside the issue without turning its verdict to changes, and the note on a scope that grows after the lease, are issue 098 (097 is another issue). Krzysztof, 2026-11-03 (translated from Polish): "By default the worker and the reviewer judge the work they were given, and when they find something they put it into the backlog, and at most they report that the agent ran into something and ask what we do with it. But always recorded, not that we suddenly fix everything in the universe along the way." Built-in rules for the worker, the reviewer and the coordinator are in 086.
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs tests/scope-after-lease.test.mjs (on release/6.2.1 2c798fe, archived to a scratch folder, the two new test files copied in) · **saw:** tests 10, pass 0, fail 10 (unknown flag --outside for review; no scope note, no grew mark, no scopeGrew in report)
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs tests/scope-after-lease.test.mjs (jarl/098-review-scope 5146b11) · **saw:** tests 10, pass 10, fail 0 (the frozen 6.1.0 and 6.2.0 readers read list, status and report of a loop whose leased issue grew; profile.json not written)
- **ran:** jarl.mjs (release tip) field 098 Acceptance "The reviewer brief names the outside form" --add --by jarl, and review 098 approve ... --outside "Important: ...", on a copy of the 6.3.0 loop · **saw:** field: no note; log: 098 body · acceptance · was "- review takes findings ..." (465 characters) · by jarl. review: unknown flag --outside for review
- **ran:** jarl.mjs (5146b11) the same calls, and review 098 changes "... Minor: a comment is stale" --outside "Important: ...", and report --metrics, on another copy of the 6.3.0 loop · **saw:** changes refused: its only Critical or Important findings are outside the issue (--outside), form: jarl.mjs review "<ids>" "<verdict>" "<what-was-read-and-found>" --by "<reviewer>" --outside "<finding-outside-the-issue>"; approve: filed outside the issue: 159 (Found by rev-copy-check, Where the review of 098, Repo ../../../JarlSkill); field: note: 098 is leased (in-progress), and its scope grew after the lease: line 4 "The reviewer brief names the outside form"; log: ... · grew after the lease: line 4 · by jarl; report: scope grew after the lease, per writer: jarl 1 (098)
- **ran:** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 2400 npm test (jarl/098-review-scope 052ac8e) · **saw:** tests 1239, pass 1219, fail 0, skipped 20; exit 0

Ruling outside-finding-found-by-reviewer-where-names-the-review: Under autonomy-quality, where the acceptance line of issue 098 and its own Changelog line disagree (code-docs-conflicts: an obvious reading, no real choice of behaviour): the acceptance says each finding filed outside the issue is a new issue 'whose finder is the reviewed issue'; the Changelog line says 'found by that reviewer'; this loop's every issue has Found by naming the reviewer and Where naming the review of the reviewed issue. A new issue filed by review --outside therefore has Found by = the reviewer's name and Where = 'the review of <reviewed id>', and the acceptance line is read that way: the finding traces to the reviewed issue through Where. Not a choice that is the owner's.
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs (052ac8e, archived to a scratch folder, the round-2 test file copied in) · **saw:** tests 10, pass 6, fail 4 (second finding refused after the first was filed; no --field on review; bare format-1 Repo not dotted on the filed issue; newIssue took repoAsHeld)
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs (jarl/098-review-scope 0b01079) · **saw:** tests 10, pass 10, fail 0
- **ran:** jarl.mjs (0b01079) review 098 approve ... --model claude-opus-5-5 --outside "Important: lib/import.mjs drops ..." --outside "Important: a <why>reason</why> sits in the text", on a copy of the 6.3.0 loop, shasum of log.md and 098's file and the issue count before and after · **saw:** exit 1: the finding outside the issue "Important: a <why>reason</why> sits in the text" cannot be filed: the What text holds an opening and a closing why tag ... nothing was written; form: jarl.mjs review "<ids>" "<verdict>" "<what-was-read-and-found>" --by "<reviewer>" --model "<model-id>" --outside "<finding-outside-the-issue>"; c1b288653d08, df8ed6ca72a4, 162 issues before and after
- **ran:** jarl.mjs (0b01079) on a copy of the 6.3.0 loop given a profile with Area required (enum core, cli): review 098 approve ... --outside "Important: ...", then the same with --field Area=core · **saw:** first: exit 1, Area is required by this loop's profile ... nothing was written, form ... --outside "<finding-outside-the-issue>" --field "<name=value>"; second: exit 0, filed 163 with Repo ../../../JarlSkill, Found by rev-copy-check, Where the review of 098, Area core
- **ran:** jarl.mjs (0b01079) on a copy of the 6.3.0 loop (format 1, no profile) whose 098 holds the bare Repo tool (a git checkout at <copy>/tool): review 098 approve ... --outside "Important: ...", then verify · **saw:** filed outside the issue: 163; 098 Repo ./tool, 163 Repo ./tool; profile format 3; verify names nothing about tool
- **ran:** cd skills/jarl/scripts && TMPDIR=<scratch> nice -n 15 timeout 2400 npm test (jarl/098-review-scope afe4cd8) · **saw:** tests 1244, pass 1224, fail 0, skipped 20; exit 0 (the run at 0b01079 had 1 fail: a git call in the new format-1 test carried no timeout, fixed in afe4cd8)
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs (afe4cd8 code, the round-3 tests added) · **saw:** tests 14, pass 10, fail 4 (no tip line after a review whose --outside raised a format-1 loop, single and bulk; the tag-pair reason named --why)
- **ran:** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs (e5ce772) · **saw:** tests 14, pass 14, fail 0
- **ran:** two scratch format-1 loops built with the driver (init, new --repo tool, set in-progress --branch jarl/001-work, evidence); review 001 approve ... --outside "Important: the importer drops the header row" with afe4cd8 on one and e5ce772 on the other; grep the log for tip and review lines · **saw:** afe4cd8: 001 review approve line, no 001 tip line; e5ce772: 001 review approve line, then 001 tip f951627f44fe972280e41f3c14a430485135fef2 (the branch's tip)

