# 251 · Jarl: verify — a read-only consistency check of the loop record (no lock, no network)

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**
**After:** 308
**Branch:** jarl/251-verify
**Merged:** 9807d8a3598667423bfdf176825322969a50e713 in ../../../JarlSkill
**CI:** pending

## What
Architect, section 3.4: log.md is the event store of the done gate, and manual edits (the 006 strike-through, the 247 title change, goal.md lines) change the result silently. A check is needed that reads and reports. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.4, and B.2 item 7): with 247 a sibling repository is a name declared in .jarl/repos.md with its root commits, so verify checks repositories by name and roots, and a Repo that holds a path stays valid and is not flagged; and nothing ties the supersession of a ruling to the open issues whose text cites it (a field report from a loop in another project, item 7), so verify reports those that remain after the notice of 244 at the supersession. check is the wrong place for that: it reads the diff of a branch, not the record. Amended by the architect code review of 2026-10-18 (O9 and section 5): verify encodes no grammar of its own. It runs the single parsers in strict mode (the event parser of 324, goalLines of 325, parseIssue, loadAsks, loadDecisions and validateProfile) and reports what each one skipped or could not place, with the supersession scan shared with 244; it is the only command that checks the root commits of declared repositories (247). The slot checks of attachments (321, after this package) are added to the same strict parse of evidence rows and the profile. With 332 (one store of state) and 333 (Proof and Notes) landed before it, verify is the strict check of the single store: it checks that every projection agrees with the source 332 chooses and that each entry sits in the part of the issue 333 assigns it, and it takes the command form that 334 (one command grammar) sets when 334 lands after it.

## Why



A manual edit of the record changes the done gate's result with nothing to show it, a declared repository that resolves to the wrong checkout is read as the right one, and an open issue whose acceptance cites a superseded ruling sends a worker to prove a rule that no longer stands.

## Acceptance
- verify runs parseEvent/loopEvents, goalLines, parseIssue, loadAsks, loadDecisions and validateProfile in a strict mode and prints, per parser, what it skipped or could not place: log.md lines that look like events but do not parse (including model marks on lease and verdict lines and retraction lines that point at no entry or at a changes verdict); foreign lines in asks.md; duplicated ruling slugs; unparsable issue headers, a malformed Resources field, and After pointing to issues that do not exist; unparsable goal.md machine lines (Check:, Check (<name>):, Model (<tier>): and Coordinators:); worktree leases that no repository names; ids of 1000 or more, or any other format-2 element, in a loop whose format was not raised. It tolerates edits that a composer makes by design (the ruling fields of Horde)
- No grammar of its own: verify adds no regular expression for a record line; seams.test.mjs stays green, and every rule it reports comes from a strict flag or a skipped-lines list of an existing parser
- For repositories (247): a name with no declaration in .jarl/repos.md; a declared repository that does not resolve on this machine; roots that do not match, with a different origin reported as a note and a shallow clone as unverified; a Repo that holds a path is not flagged. Resolution goes through the one repository resolver of 325
- Open issues whose What, Why or Acceptance cite a superseded ruling by its slug, through the scan shared with 244
- Real loops only through an environment variable such as JARL_LIVE_LOOP (or a list of loop roots in one variable), never as committed fixtures and never by a path into a private repository: with the variable set to frozen copies of real loops (the 6.0.0, 6.1.0 and 6.2.0 release loops), verify gives a predictable, documented result (the known anomalies, such as the 006 strike-through); with it unset that test is skipped with a reason naming the variable; committed tests use loops built in the test. 257 carries the cross-loop proof
- Exit 0 when clean, 2 when it found something; no lock, no network, nothing written

## Changelog
- Added: A new read-only command, verify, checks a loop's record for lines Jarl cannot read, headers that disagree with its log, repositories the issues name that are not on this machine, and open issues that cite a ruling that has been replaced. It changes nothing, and it exits with status 2 when it finds something.

## Evidence


- **ran:** cd skills/jarl/scripts && npm test · **saw:** tests 615, pass 593, fail 0, skipped 22 (on the branch after the merge of release/6.2.0)
- **ran:** node --test tests/jarl.test.mjs -- strict reader tests, before the change · **saw:** tests 5, pass 0, fail 5 (log, goal, issue, question and decision readers listed no line)
- **ran:** node --test tests/jarl.test.mjs -- strict reader tests, after the change · **saw:** tests 5, pass 5, fail 0
- **ran:** verify on a copy of the 6.2.0 release loop, through JARL_LIVE_LOOP with JARL_LIVE_KNOWN=1 · **saw:** verify: 2 findings; log.md line 1564 is the struck-through verdict of issue 006; open issues citing a superseded ruling: 1 (issue 262, patch-scope); exit 2; the live-loop test passes
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches, show --full for 006, 224, 247, 251, 308: release tip driver against this branch, on a copy of the loop · **saw:** 13 of 13 outputs byte-identical

The verify tests were written after the command, so no red run of them was recorded before the command existed; the strict-reader tests are the red-then-green proof. The record library is unchanged, and tests/record-contract.test.mjs passes.
- **ran:** cd skills/jarl/scripts && npm test (branch tip, round two) · **saw:** tests 672, pass 650, fail 0, skipped 22
- **ran:** mutation check: each verify check and the parser check behind each finding kind commented out, one at a time, in a scratch copy of the branch; the kind's test run after each · **saw:** 32 of 32 mutants fail their kind's test; each kind's twin on the clean loop passes; the origin-differs note is caught by its own test
- **ran:** seams rule 10 on a copy whose verify section holds one regular expression, and on the branch · **saw:** copy: fails (1 of 1); branch: passes (1 of 1)
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches, show --full for 006, 224, 247, 251, 308: release tip driver against the branch tip, on a copy of the loop · **saw:** 13 of 13 outputs byte-identical
- **ran:** JARL_LIVE_LOOP=<a copy of the release loop> JARL_LIVE_KNOWN=1, real-loop test · **saw:** pass 1; verify on the copy: 2 findings: struck-through verdict of issue 006 (log line 1564), open issue 262 citing a superseded ruling; exit 2
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 9807d8a · **saw:** 672 tests, 650 pass, 0 fail, 22 skipped; verify gives 2 findings on a copy of the real loop (exit 2); worker haiku-5.5, two rounds (a regex of its own and tests that stayed green with their check removed found by the sonnet-5.5 reviewer, fixed; 32 of 32 mutations caught), approved

