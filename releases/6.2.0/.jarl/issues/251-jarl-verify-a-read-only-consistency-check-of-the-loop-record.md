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
**After:** 308, 247, 245, 287, 253, 310

## What
Architect, section 3.4: log.md is the event store of the done gate, and manual edits (the 006 strike-through, the 247 title change, goal.md lines) change the result silently. A check is needed that reads and reports, before identifiers or retractions arrive. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.4, and B.2 item 7): with 247 a sibling repository is a name declared in .jarl/repos.md with its root commits, so verify checks repositories by name and roots, and a Repo that holds a path stays valid and is not flagged; and nothing ties a ruling's supersession to the open issues whose text cites it (a field report from a loop in another project, item 7), so verify reports those that remain after 244's notice at the supersession. check is the wrong place for that: it reads a branch's diff, not the record.

## Why



A manual edit of the record changes the done gate's result with nothing to show it, a declared repository that resolves to the wrong checkout is read as the right one, and an open issue whose acceptance cites a superseded ruling sends a worker to prove a rule that no longer stands.

## Acceptance
- verify reports: log.md lines that look like events but cannot be parsed; foreign lines in asks.md; After pointing to non-existent issues; duplicated ruling slugs; unparsable issue headers; worktree leases that no repository names; unparsable goal.md machine lines (Check:, Check (<name>):, Model (<tier>): and Coordinators:). It tolerates edits that a composer makes by design (Horde's ruling fields)
- For the elements the other 6.2.0 packages add: Model lines and the model marks on lease and verdict lines (287) that do not parse; a Resources field (282) that is malformed; retraction lines (245) that point at no entry, or at a changes verdict; ids of 1000 or more (310) in a loop whose format was not raised, and any other format-2 element in a format-1 loop (252)
- For repositories (247): a name with no declaration in .jarl/repos.md; a declared repository that does not resolve on this machine; roots that do not match, with a different origin reported as a note; a Repo that holds a path is not flagged. The main checkout is found through 306's helper
- Open issues whose What, Why or Acceptance cite a superseded ruling by its slug
- Real loops only through an environment variable such as JARL_LIVE_LOOP (or a list of loop roots in one variable), never as committed fixtures and never by a path into a private repository: with the variable set to frozen copies of real loops (the 6.0.0, 6.1.0 and 6.2.0 release loops), verify gives a predictable, documented result (the known anomalies, such as the 006 strike-through); with it unset that test is skipped with a reason naming the variable; committed tests use loops built in the test. 257 carries the cross-loop proof
- Exit 0 when clean, 2 when it found something; no lock, no network, nothing written

## Evidence


