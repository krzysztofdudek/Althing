# 313 · Jarl 6.2.0 release: the tag, the plugin, the publication checks, alone on Runes 1.0.0

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** release, needs-owner, jarl
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 312
**Found by:** jarl-architect
**Where:** JarlSkill release/6.2.0 (cut from main at v6.1.1), .github/workflows/release.yml (tags and publishes on a push to main); Althing releases/6.2.0/family.json

## What
Split from 224 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18): Jarl 6.2.0 ships alone, before the rest of the family, from release/6.2.0 of JarlSkill cut from main at v6.1.1, on the Runes 1.0.0 copy it vendors (vendor/runes.pin.json at v1.0.0, d90119e). This issue holds the tag, the plugin and the publication checks; 224 keeps the family's other rows. JarlSkill's release workflow reads the version from the CHANGELOG's first heading and, on a push to main, creates the tag v<version> and the GitHub release; so the tag is made by the push to main, which is the owner's step. The manifest (architect's scope review, 7.2): releases/6.2.0/family.json stays open and repos.jarl.commit stays null until the family's candidate, because the rail requires every commit null while the state is open and candidate applies to the whole manifest; the Jarl tag, its commit, the plugin version and the publication checks are recorded here as --ran/--saw rows, and at the family candidate repos.jarl.commit is set to this published commit. repos.jarl gains a declared exception, runes: pin v1.0.0, commit d90119effc517c923239d561e09adbfe075d603b, ruling jarl-release-alone-with-every-jarl-issue, which 258 reads and the rail lets through. driver.jarl stays as jarl-pinned-in-loop sets it: the driver checkout is never moved to release/6.2.0 or v6.2.0 while this loop is open, and sessions that drive this loop keep the 6.1.0 plugin or use ws jarl only, because a 6.2.0 MCP tool writing a repository name into this loop would raise its format and the 6.1.0 driver would then refuse it (scope review, section 5 risks and Q2). The rail's one-version rule means a Jarl fix needed after this tag while the family is still open cannot ship as 6.2.1 inside the 6.2.0 manifest (scope review 7.3); the owner chooses the way before the tag. Agents push nothing: every remote step is the owner's, asked in the chat with its exact commands when it is due.

## Why
A Jarl-only tag in the middle of an open family release touches three things at once: the published plugin every session picks up, the manifest's rules, and the loop's own driver. Each needs its own recorded step, or the release leaves the family manifest wrong or this loop unreadable by its driver.

## Acceptance
- Before the tag, the final pass is recorded as --ran/--saw rows (scope review, section 5), each run directly with explicit paths and a timeout: npm test in skills/jarl/scripts green with nothing skipped for want of JARL_LIVE_LOOP (276's Jarl half); frozen copies of the 6.0.0, 6.1.0 and 6.2.0 loops and a Horde mission give the same numbers under 6.2.0 as under 6.1.0 in status, resume, list, show --full, report and next --all, verify reports only the known anomalies, and nothing on them raises the format (257's Jarl half); the pinned 6.1.0 library reads every benign line kind and refuses list and status for each format-2 trigger (a name, issue 1000, ask a-1000, a retraction); a loop holding 998 to 1001 works end to end through the CLI and MCP; the generated MCP tool list equals the CLI table (verify, goal and models present, handoff absent, answer's id field still taking one id) and the server's instructions carry the compaction sentence; runes-vendor.test.mjs green with the pin at v1.0.0; Horde's suite green with Jarl 6.2.0 vendored into a scratch copy; Jarl 6.2.0's plugin installs and its MCP server answers in Claude Code, Codex, Cursor and Copilot beside the installed 6.1.x family (259's Jarl half)
- Before the tag, the owner has chosen how a Jarl fix needed while the family is still open ships (hold it for the next family release, or ship it as 6.2.1 under a new version of the one-version rule, or pin the family to a later Jarl tag under a ruling), recorded as his answer to an ask
- The owner's steps are asked in the chat, one at a time, with their exact commands, when each is due, and nothing is pushed by an agent: (1) from the JarlSkill checkout, git push origin release/6.2.0, then gh run list --branch release/6.2.0 shows CI green on the release tip's exact sha; (2) git push origin <that sha>:main, the fast-forward with the admin bypass; (3) gh run list --workflow release.yml shows the Release run green, which created the tag v6.2.0 and the GitHub release from the CHANGELOG section; (4) the plugin updated in his hosts outside the sessions that drive this loop
- After publication, read-only checks recorded as rows: git ls-remote origin refs/tags/v6.2.0 names the release tip's sha; gh release view v6.2.0 shows the 6.2.0 section; a fresh host lists the Jarl plugin at 6.2.0 and its MCP server answers jarl_help with verify present
- releases/6.2.0/family.json stays open with repos.jarl.commit null, carries the declared runes exception under repos.jarl, and driver.jarl is unchanged; the Althing rails and yg check are green on that commit
- Cleanup on the owner's word for anything remote: the worker branches and worktrees of the Jarl issues removed; the remote release/6.2.0 kept until the family's cleanup step

## Evidence

