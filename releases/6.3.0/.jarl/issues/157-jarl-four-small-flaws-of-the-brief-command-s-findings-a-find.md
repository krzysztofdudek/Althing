# 157 · Jarl: four small flaws of the brief command's findings: a finding that begins with 'findings: model' is listed twice, a newer entry can stand in for an older one, matched findings keep the file's escapes, and commands.md says every finding is whole

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-058c-opus
**Where:** Review of 058 (rev-jarl-058c-opus), Minor findings

## What
(1) A finding whose own text begins with 'findings: model' or 'findings: relayed' does not match its log line (lib/brief.mjs:52-55) and is listed twice, the second time with a note that wrongly says it matches no log line. (2) With the same reviewer, first line and line count where the file keeps only the newer entry, the newer text stands in the older verdict's place (brief.mjs:56). (3) A matched finding is shown with the file's escapes (backslash before a marker or hash) because fromFile does not unescape (brief.mjs:46). (4) The brief row of references/commands.md says every finding is given whole, but where the file entry is gone only the log's first line can be shown and its pointer names a Reviews section that does not hold the rest, with no note.

## Why
A brief is read by an agent that trusts it; a doubled finding or an escaped one costs it time, and a sentence that promises more than the output gives is false.

## Acceptance
Each of the four is corrected or said honestly in the docs, with a test where the code changes

## Evidence

