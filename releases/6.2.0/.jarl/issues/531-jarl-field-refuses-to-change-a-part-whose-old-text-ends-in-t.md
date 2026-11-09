# 531 · Jarl: field refuses to change a part whose old text ends in the singular owner phrase and a full stop

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261109T1633-vbyq
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/lib/owner.mjs
**Repo:** JarlSkill
**Found by:** jarl
**Where:** skills/jarl/scripts/lib/owner.mjs:79
**Branch:** jarl/531-old-text-owner-phrase
**Worker:** jarl-531
**Model:** claude-opus-5-5
**Since:** 2026-11-09 16:45

## What
The log line field writes quotes the value a part held before. An Acceptance ending in the possessive of owner, the singular noun word and a full stop gains a closing quotation mark in that line. MARKER_FORM then reads it as the quote marker and field refuses the write, with --add as well. The comment above MARKER_FORM calls the singular phrase honest. Issue 142 of this loop hit it on 2026-11-09 and was replaced by a new issue.

## Why
One honest sentence in an old issue blocks every later change to that part, and the only way out is to drop the issue and file a new one.

## Acceptance
[test] field replaces and adds to an Acceptance whose old text ends in that phrase and a full stop, and a forged marker is still refused · by: cd skills/jarl/scripts && npm test

## Reviews
- **changes** · by rev-531-fable (fresh) · 2026-11-09 · model claude-fable-5-1
  Important: lib/body.mjs:96 quotedOldText matches the quoted old text greedily, to the last quotation mark on the line, so when the trailing --by name holds a quotation mark the carried text reaches past the old text into the name. Through the library export cmdSplit (jarl-lib.mjs), with a by name that is the quote marker followed by a quotation mark and a word, and no writer set, the branch wrote two log lines ending in that forged name (reproduced in a scratch loop); main refuses the same call. The CLI and MCP paths are covered only because the writer copy after the stamp holds the same name and lies outside the carried span. Carry exactly the old text: end the match at the ' (N characters)' or ' · by ' suffix or at the end of the line (a value cannot hold the separator, so the anchor is exact), and add a test with a --by that holds a quotation mark. Minor: a marker already standing in an issue file by a hand edit is now copied verbatim into the log by a later field write (main refused it); the record already tolerates that line in the file, so this is a note on the design, not a request. Minor: the new test covers no body line that carries a --by name and not the 120-character cut of a What first line; the cut case passes when run by hand. Verified: npm test green on 86caf97; the new test fails for the right reason with lib/body.mjs reverted; the fix holds for title, What, Acceptance, --add, the plural phrase and the cut; a forged new text, a forged --by on field and a forged --by on split from the CLI are still refused.

## Evidence

### Proof

- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1829, pass 1807, fail 0, skipped 22, on 86caf975753a7a3bd7c35c7e310aebe5f526e503
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1829, pass 1807, fail 0, skipped 22, on 86caf975753a7a3bd7c35c7e310aebe5f526e503 in the worktree 531-old-text-owner-phrase, clean tree
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1830, pass 1808, fail 0, skipped 22 on 3b9c27df00c33288d917d9a1e4794cd891d43b59 (the count as printed above if it differs)

### Notes

Deferred: For the next release of Jarl: it is not part of this release of Runes, Yggdrasil and Grain.

