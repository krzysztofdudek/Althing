# 530 · Yggdrasil: adoption of Runes 1.1.0 (pin, documentation of relation limits, rerun of the reproductions)

**Status:** in-progress
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261109T1633-evok
**Tags:** yggdrasil, runes
**Files:** Yggdrasil/source/cli/package.json, Yggdrasil/source/cli/package-lock.json, Yggdrasil/docs/relations-flows-ports.md
**Repo:** Yggdrasil
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018, 475
**Found by:** jarl
**Where:**
**Branch:** jarl/530-runes-110
**Worker:** w-530-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
The extractor fixes in Runes 1.1.0 reach Yggdrasil only after Runes 1.1.0 is published, which is the owner's step. Then: npm install @chrisdudek/runes@1.1.0 --save-exact in source/cli, an update of the cited lines and of the limits table in docs/relations-flows-ports.md, and a rerun of the reproduction of every Runes issue on Yggdrasil. Runes 1.0.1 was never published, and release/6.2.0 pins 1.0.0 today. The Yggdrasil halves of 233, 234, 235 and 240 land with this adoption, because their Runes halves are already on Runes release/1.1.0. 475 comes first. This issue replaces 142.

When adopting, pass Runes 1.1.0's new optional C# inputs where Yggdrasil builds the C# relation pass: globalStatics and projectGlobalStatics (project-wide global using static, issue 500), and the Reachability internalsVisible member (issue 489), so their behaviour reaches users.

Through Yggdrasil's facts cache (source/cli/src/relations/facts-cache.ts, which copies the C# extract field by field) carry Runes 1.1.0's new C# extract fields scope.staticDecls, scope.globalStatics and fileLocalTypes (issue 562).

## Why
Without this the Runes fixes change nothing for Yggdrasil's users.

## Acceptance
- [read] release/6.2.0 pins Runes 1.1.0 in source/cli/package.json and its lockfile
- [read] The limits table in docs/relations-flows-ports.md matches what Runes 1.1.0 does
- [read] The reproductions of 009 to 018 and 073 to 075 were rerun on the built Yggdrasil and the results are recorded

## Evidence

### Notes

Assumed: the lock entry for @chrisdudek/runes names the GitHub archive of Runes commit c5124ca0525ea5896c589fbb93a1a4e6ec84e018 (release/1.1.0, not pushed), as the pin script allows for a release branch ahead of npm. Its integrity is the sha512 of a tarball packed locally from that commit with the version stamped 1.1.0 (the commit's own package.json and version export still say 1.0.1 until Runes' final pass), so it is provisional: after the jarl pushes the Runes commit that carries version 1.1.0, one npm install of the codeload URL of that commit rewrites resolved and integrity, package.json keeps "1.1.0". Until then npm ci and the pack smoke step cannot fetch it; every test here ran against that local build.

Assumed: the file view of the relation pass (235) is the list of files the repository scan yields (tracked plus untracked files git does not ignore, no symbolic links, no nested projects), with text read from the working tree (plan decision D9 a). The owner index is not changed: yg owner on an ignored build file still names the node by its path; only the resolvers and the C# readers stopped seeing such files.

Assumed: the diagnostics of 234 become two non-blocking warnings, relation-config-unreadable (code config-unreadable) and relation-package-entry-missing (code package-entry-missing), one warning per kind listing every file with line and column when known; the C# reachability (014, 489) is built only when the pass holds C# files and reads project files through the same file view.

Assumed: the limits table of docs/relations-flows-ports.md is read as the Known grammar limits table plus the per-language statements around it. Every row of the grammar table was re-probed on 2026-11-11 with the shipped grammars (ERROR where the table says ERROR, parses where it says parses; pins unchanged from Runes 1.0.0) and its date now says so; the Upstream column was not re-checked and keeps its 2026-09-24 date. The language statements (Python, Rust, C#, Java and Kotlin, TypeScript) were rewritten from the Runes 1.1.0 api notes and the issues' changelog entries.

