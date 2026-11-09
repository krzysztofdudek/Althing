# 239 · A form Jarl prints on Windows with a --root that holds a doubled backslash reaches another path whe…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261109T1422-qxmf
**Tags:** 
**Files:** 
**Repo:** JarlSkill
**Found by:** rev-jarl-237-opus-platforms
**Where:** the review of 237

## What
A form Jarl prints on Windows with a --root that holds a doubled backslash reaches another path when pasted into Git Bash, which is where Claude Code on Windows runs commands: --root "\\server\share\x" is read as \server\share\x. PowerShell and cmd keep it. Seen under a win32 simulation for the printed form and in a real bash for the reading; the forms are written for PowerShell and cmd, and no test pastes a doubled backslash.

## Why


## Acceptance


## Evidence

