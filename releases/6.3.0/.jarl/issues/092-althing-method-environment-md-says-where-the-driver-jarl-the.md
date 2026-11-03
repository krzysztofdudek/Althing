# 092 · Althing: method/environment.md says where the driver Jarl, the merge worktree and test scratch live

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** docs
**Files:** method/environment.md
**Found by:** owner
**Where:**

## What
The release session's working note (pasted by the owner, 2026-11-03) holds facts no document has: the driver Jarl is a dedicated worktree pinned to the manifest's driver commit, which ws.local.json maps as jarl, so a brief's repo:jarl is that worktree and not JarlSkill's main checkout; the merger works in a release worktree; finished worktrees are removed; test suites run with TMPDIR under the machine's scratch area because the system temporary directory is memory with a file limit and Jarl's suite filled it.

## Why
Knowledge that lives only in a session's note is lost at the next compaction or the next session.

## Acceptance
- method/environment.md names the driver worktree, the merge worktree, the removal of finished worktrees, TMPDIR for test suites, and .cache/ for audits, each in one sentence with its reason
- The rails pass; no machine path beyond the ~ forms the document already uses

## Evidence

- **ran:** grep -c 'JarlSkill-driver\|JarlSkill-release\|TMPDIR\|.cache/' method/environment.md · **saw:** the four facts are in the Worktrees section, each with its reason

