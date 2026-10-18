# 251 · Jarl: verify — a read-only consistency check of the loop record (no lock, no network)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**
**After:** 308

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

## Evidence


