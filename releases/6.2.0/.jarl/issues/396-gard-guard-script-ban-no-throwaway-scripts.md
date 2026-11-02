# 396 · Gard guard script-ban: no throwaway scripts

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, guards, hooks, windows
**Files:** Gard/src/guards/script-ban.mjs, Gard/src/guards/shell-words.mjs, Gard/test/guard-script-ban.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: test/fixtures/owner-guards-module-copy (10-script-ban.mjs, owner-guards-lib/scripts.mjs, shell-word.mjs) and the false refusals fixed in Mimir's first loop (M56, M93)

## What
A throwaway script written on the fly and run at once is refused: code passed to an interpreter in a shell command (node -e, python -c, a heredoc into an interpreter), a pasted script, a file generated to be run once. Named, deterministic commands pass: commands of tools, scripts saved in a repository, gard run with its flags, sh -c inside a container. The rules read cmd and PowerShell as well as POSIX shells.

## Why
The owner, 2026-10-26: no non-deterministic scripts at all, because every such call stops the work on a question of consent and the owner has to watch the agent instead of walking away.

## Acceptance
- Tests cover each refused form and each passing form above, on POSIX, cmd and PowerShell spellings
- Every false refusal Mimir's first loop recorded is a passing test here

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

