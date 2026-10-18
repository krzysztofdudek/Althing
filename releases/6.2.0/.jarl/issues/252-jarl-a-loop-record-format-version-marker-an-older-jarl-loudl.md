# 252 · Jarl: a loop record format version marker; an older Jarl loudly refuses a newer record

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:**

## What
Architect, section 3.5: only the profile declares a format; a loop without a profile has no version, so an older Jarl reading a newer record (names in Repo: from 247, multi-line questions from 248) silently misreads it. Jarl 6.1.0 refuses a bare name on write, but reads a name written into a file as a directory under the loop, silently: status --by repo and next go on as if nothing were wrong (probe H of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.2 item 7). The only place Jarl 6.1.0 reads and refuses loudly is the profile's format key: every command that loads issues loads the profile first (jarl-lib.mjs:572 at 2c12aa3), and the format is checked before anything else (:307-308), ahead of the statuses the rest of the check requires, so list and status are both refused (probe I). So the marker is a profile.json holding only jarl-profile and format, raised by the first write that needs it, not by a migration step. record.mjs:62 lists the profile's format as contract, with the value 1. This loop itself writes with Jarl 6.1.0 (jarl-pinned-in-loop), and the MCP tools in sessions are the installed version. Generalised by the architect's scope review of 2026-10-18 (sections 2 and 4, item 1) and the ruling jarl-release-alone-with-every-jarl-issue: format 2 is raised by the first write of any element a 6.1.0 reader would misread in silence, and there are three: a repository name in Repo (247); the first id of 1000 or more in an issue or an ask (310), because 6.1.0 reads ids with exactly three digits in nine places and skips a 1000-*.md file instead of refusing it, so issue 1000 and up drop out of list, next and the done gate; a retraction line (245), because 6.1.0 does not parse a retract and would count a retracted approve or evidence row, passing done where 6.2.0 refuses. Everything else 6.2.0 writes was checked as benign for 6.1.0 and raises nothing: the model and relayed marks on lease and verdict lines, the Model: and Resources: header fields and Tier: light, Check (<name>): and Model (<tier>): goal lines, a merge line naming its check, the ## Reviews section (kept by 6.1.0's in-place edits), title-change log lines, and multi-line asks. Format 1 and 2 are both the contract jarl-record/1 (scope review, Q3): no export changes and Horde reads no format. This package is the first of the Jarl release and builds, once, the cross-version fixture the later packages use: the Jarl 6.1.0 library pinned from the v6.1.0 tag as a test fixture, which reads every line kind the later packages write (245, 246, 248, 287 and 310 each ask for this test). The test half of 269 (the real-loop test reading only JARL_LIVE_LOOP) goes in the same package.

## Why



A record read wrong in silence is worse than one refused: an older Jarl would compute next, the views and the done gate over directories that do not exist. The marker must sit where the older Jarl already refuses, or it protects nothing.

## Acceptance
- The marker is .jarl/profile.json holding only jarl-profile and format. Jarl 6.2.0 accepts a profile that holds only those two and reads it as the built-in profile (declared: false), so status --json, the headers, report, import and the issue reader keep their shapes (jarl-lib.mjs:580, :1586, :3034, :3152, :3277, :3367)
- Format 2 is raised before the write, under the same lock, by the first write of any of three elements: a repository name in Repo (247; new --repo, import --repo and repo included); the first id of 1000 or more in an issue or an ask (310); the first retraction line (245). One function raises it and each of those packages calls it; a loop without a marker is format 1 and reads as today, and nothing else 6.2.0 writes raises it
- Jarl refuses to write and read a loop in a newer format with a clear message, as it does today for the profile format
- The Jarl 6.1.0 library, pinned from the v6.1.0 tag, is a test fixture built once in this package, read-only under the tests, with a helper that runs it over a loop the current Jarl wrote; the later packages add their line kinds and their triggers to this test instead of building their own
- Tests: the format-1 record read by the new Jarl; a format-only profile read with declared: false and the shapes above unchanged; the pinned Jarl 6.1.0 refusing list and status on a loop whose format the new Jarl raised; the cases for a name, issue 1000, ask a-1000 and a retraction are added by 247, 310 and 245 to the same test

## Evidence


