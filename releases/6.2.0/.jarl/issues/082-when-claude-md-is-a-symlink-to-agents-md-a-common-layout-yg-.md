# 082 · When CLAUDE.md is a symlink to AGENTS.md (a common layout), yg init writes the @AGENTS.md import line through the link, so AGENTS.md imports itself

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/templates/platform.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/templates/platform.ts, installRules: :323 `resolveCaseVariant(projectRoot, CLAUDE_FILENAME)` matches only the name, with no lstat or realpath, so it does not see that CLAUDE.md and AGENTS.md (:295) are the same file; step 1 writes the block at :313; step 2 reads CLAUDE.md through the link at :325 (it gets the content of AGENTS.md with the block, but without `@AGENTS.md`, so hasImport at :340-348 is false) and appends `@AGENTS.md` through `writeFile(claudePath, …)` at :351, which follows the symlink; the rules-digest-stale gate reads the import with the same logic and stays silent
**Branch:** jarl/079-singletons
**Merged:** b446e32fab2fe73581bfda4eb599a5a9da921277
**CI:** none

## What
Reproduction (a fresh clone at tag v6.1.0 e5441101, npm ci and npm run build, `node dist/bin.js` 6.1.0; platform.ts unchanged up to origin/main): Case A (CLAUDE.md -> AGENTS.md): after `yg init --no-reviewer` CLAUDE.md is still a symlink, git status shows ` M AGENTS.md` (+40 lines), and line 43 of AGENTS.md is `@AGENTS.md` right after `<!-- yggdrasil:end -->`; `yg init --upgrade` says 'Agent rules already up to date — nothing changed', `yg check` passes without a rules-digest warning; a second upgrade leaves exactly one such line (stable, but wrong). Case B (AGENTS.md -> CLAUDE.md), outside the report: the same defect, CLAUDE.md gets the block and `@AGENTS.md`, which leads back to CLAUDE.md; upgrade and check stay silent. Control C (two ordinary files): the import only in CLAUDE.md, as intended. Workaround D: `--no-claude-md` with the symlink makes no self-import, and check passes. docs/configuration.md ('Rules artifacts'), getting-started.md and cli-reference describe `claude_md` as the @AGENTS.md import line in CLAUDE.md and do not mention symlinks or `--no-claude-md` for such repos. Not checked whether Claude Code deduplicates such an import (it would need a run on the owner's subscription); the defect stands without it. This is not 201 from 6.1.0 nor 022 here (other symlinks), nor 035 (a CLAUDE.md symlink in the mapping of a Grain proposal). Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-51/logs/claude-symlink.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-51/scripts/claude-symlink.sh; working repos <the session scratchpad, since lost>/bughunt/yggdrasil/verify-51/caseA.Gp0r, caseB.4EFE, caseC.YKhY, caseD.srC0); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-5/logs/claude-symlink.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-5/scripts/claude-symlink.sh.

## Why
A CLAUDE.md -> AGENTS.md symlink is a common layout, so this is a defect of the default path, not of a bad configuration: the file every agent reads (Codex, Cursor and others) gets a meaningless self-import line outside the managed block, CLAUDE.md for Claude Code resolves to a file that imports itself, and yg reports nothing. Nothing is lost and the file stays valid, so minor.

## Acceptance
installRules compares the fs.realpath of CLAUDE.md and AGENTS.md (or checks the lstat of CLAUDE.md); when they are the same file, it skips the import line and says so in the output, and before writing through any link it names the real target: in cases A and B after `yg init` neither file contains the line `@AGENTS.md` (e2e test).

## Changelog
- Fixed: yg init writes no @AGENTS.md import line when CLAUDE.md and AGENTS.md are one file through a symbolic link (either direction), says why, removes the self-import an earlier version wrote on --upgrade, and yg check no longer asks for it; a file written through a link is named.

## Evidence

- **ran:** git commit (merge of jarl/079-singletons into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8117 pairs verified; coverage branches 90.2%; [repo-check] All checks passed; [release/6.1.1 b446e32fa] Merge jarl/079-singletons

