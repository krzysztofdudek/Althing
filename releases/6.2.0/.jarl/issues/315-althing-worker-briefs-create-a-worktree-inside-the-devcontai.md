# 315 · Althing: worker briefs create a worktree inside the devcontainer with --lock --reason devcontainer, so git reads it as held elsewhere (241's brief line)

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261018T1650-cnfs
**Tags:** althing, docs, briefs
**Files:** 
**After:** 284
**Found by:** jarl-architect
**Where:** Althing/releases/6.2.0/briefs/worker-yggdrasil.md (and any other brief whose worktree is created inside the container); Althing/.claude/skills/directing-a-release-loop/SKILL.md where it says how a worktree is made

## What
Jarl's 241 had an acceptance clause that the Yggdrasil worker brief creates its worktree in the container with --lock --reason devcontainer. The briefs live in Althing, not in JarlSkill, so the architect's scope review of 2026-10-18 (section 4, item 2) moves the line here; 284 already owns the briefs' worktree handling and edits the same files, so this waits on it. A worktree created inside the devcontainer has a path the host does not see; Jarl 6.1.0 then reports it as gone, and Jarl 6.2.0 (241) reads a worktree that git lists as locked as held elsewhere, not gone. The lock with a reason is what tells git, and so Jarl, the truth.

## Why
Without the lock, a container's worktree looks removed from the host: status and resume call it gone and branches can offer DONE then delete for a branch with work in it.

## Acceptance
- Every brief whose worktree is created inside the devcontainer creates it with git worktree add --lock --reason devcontainer, and the directing skill says so where it describes making a worktree
- A rail check or test proves each such template carries the flag; yg check and npm test green

## Evidence

- **ran (history):** node --test over rails/test and workspace/test in Althing, at fbfcbda · **saw:** 90 pass, 0 fail; the change committed in Althing as fbfcbda; the rule that changed (loop/shape) admitted by the owner on 2026-10-19

