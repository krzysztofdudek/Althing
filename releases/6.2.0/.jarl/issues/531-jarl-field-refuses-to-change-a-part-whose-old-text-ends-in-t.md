# 531 · Jarl: field refuses to change a part whose old text ends in the singular owner phrase and a full stop

**Status:** done
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
**Merged:** b6d808c315b88702307775299b45be1438723d5d in JarlSkill
**Merge check:** cd skills/jarl/scripts && npm test · saw tests 1831, pass 1809, fail 0, skipped 22

## What
The log line field writes quotes the value a part held before. An Acceptance ending in the possessive of owner, the singular noun word and a full stop gains a closing quotation mark in that line. MARKER_FORM then reads it as the quote marker and field refuses the write, with --add as well. The comment above MARKER_FORM calls the singular phrase honest. Issue 142 of this loop hit it on 2026-11-09 and was replaced by a new issue.

## Why
One honest sentence in an old issue blocks every later change to that part, and the only way out is to drop the issue and file a new one.

## Acceptance
[test] field replaces and adds to an Acceptance whose old text ends in that phrase and a full stop, and a forged marker is still refused · by: cd skills/jarl/scripts && npm test

## Reviews
- **changes** · by rev-531-fable (fresh) · 2026-11-09 · model claude-fable-5-1
  Important: lib/body.mjs:96 quotedOldText matches the quoted old text greedily, to the last quotation mark on the line, so when the trailing --by name holds a quotation mark the carried text reaches past the old text into the name. Through the library export cmdSplit (jarl-lib.mjs), with a by name that is the quote marker followed by a quotation mark and a word, and no writer set, the branch wrote two log lines ending in that forged name (reproduced in a scratch loop); main refuses the same call. The CLI and MCP paths are covered only because the writer copy after the stamp holds the same name and lies outside the carried span. Carry exactly the old text: end the match at the ' (N characters)' or ' · by ' suffix or at the end of the line (a value cannot hold the separator, so the anchor is exact), and add a test with a --by that holds a quotation mark. Minor: a marker already standing in an issue file by a hand edit is now copied verbatim into the log by a later field write (main refused it); the record already tolerates that line in the file, so this is a note on the design, not a request. Minor: the new test covers no body line that carries a --by name and not the 120-character cut of a What first line; the cut case passes when run by hand. Verified: npm test green on 86caf97; the new test fails for the right reason with lib/body.mjs reverted; the fix holds for title, What, Acceptance, --add, the plural phrase and the cut; a forged new text, a forged --by on field and a forged --by on split from the CLI are still refused.
- **changes** · by rev-531-fable (fresh) · 2026-11-09 · model claude-fable-5-1
  Important: lib/split.mjs:21 takes --by through editorOf alone, never through needNoOwnersWords as cmdBody does (lib/body.mjs:119), and needNoNewOwnersWords (lib/owner.mjs:119) removes every occurrence of a carried text from the line, not only the one in the was position. A caller who files an issue whose acceptance is one honest line ending in the plural owner phrase (allowed, no colon or quote after it), puts a sub-issue under it, and runs split with a --by that is that acceptance text in quotation marks, then a colon, then a quotation, gets the forged name written to the log from the CLI: the carried old text is cut out of the name, the residue is clean, and the line is written, in the writer position after the stamp too. Reproduced on 3b9c27d on the CLI and through the library cmdSplit; main refuses both. The anchor itself holds: the carried span now ends at the old text, the earlier library repro is refused, and old texts holding quotation marks and the stand-in pass. Fix: run the split's --by through needNoOwnersWords (or every writer name in editorOf, one place for all), and add a test with that by name on split; the stronger shape, carrying a text only where it stands, is a note for the carry in general. Minor: a marker already standing in an issue file by a hand edit is copied verbatim into the log by a later field write; the record tolerates that line in the file, a design note. Verified: npm test tests 1830, pass 1808, fail 0, skipped 22; one of three runs printed fail 1 and the failure did not return; the new test refuses a forged name after the old text in both line shapes.
- **approve** · by rev-531-fable (fresh) · 2026-11-09 · model claude-fable-5-1
  Approve. The three commits together: quotedOldText (lib/body.mjs:96) carries exactly the quoted old text, the span ending before the character-count suffix and the by segment; editorOf (lib/body.mjs:41) runs every writer's name through needNoOwnersWords, which covers the CLI writer, the record library, split, tags and the setters in one place. Re-run on abf27d8: the wrapped-name split from the CLI and through the library cmdSplit are refused with no line in the log; the plain forged name on the library split is refused; setBody through record.mjs with the wrapped name is refused; honest old texts ending in the singular and plural phrase, holding quotation marks and the stand-in, in the title, What and Acceptance, with and without --add, with a by that holds a quotation mark, are written. What else feeds a body line beside the old text: the issue number, the part name (built-in, or a profile section name of letters, digits, spaces, underscore and hyphen only, lib/profile.mjs:232), the character count, and the writer twice, both now checked; a Where field line in the same batch takes a value needNoOwnersWords checks, and Tags and Files refuse an item in quotes. Minor: a marker already standing in an issue file by a hand edit is copied verbatim into the log by a later field write; the record tolerates that line in the file, a design note, not a request. Minor: the removal of a carried text from everywhere in a line (lib/owner.mjs:119) is the shape that let the wrapped name through; it is now closed by checking the name, and a carry tied to the position of the text would close the class, a note for later. npm test: tests 1831, pass 1809, fail 0, skipped 22; the failure one earlier run printed on 3b9c27d did not return in three further runs.

## Changelog
- Fixed: changing an issue's title, description or acceptance no longer fails when the old text ends with the words owner's word and a full stop.

## Evidence

### Proof

- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1829, pass 1807, fail 0, skipped 22, on 86caf975753a7a3bd7c35c7e310aebe5f526e503
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1829, pass 1807, fail 0, skipped 22, on 86caf975753a7a3bd7c35c7e310aebe5f526e503 in the worktree 531-old-text-owner-phrase, clean tree
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1830, pass 1808, fail 0, skipped 22 on 3b9c27df00c33288d917d9a1e4794cd891d43b59 (the count as printed above if it differs)
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1830, pass 1808, fail 0, skipped 22, on 3b9c27df00c33288d917d9a1e4794cd891d43b59 in the worktree 531-old-text-owner-phrase, clean tree; a first run of the three printed fail 1 and the failure did not return in two further runs
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1831, pass 1809, fail 0, skipped 22 on abf27d825bb7386fcc3d4fb64de804dfd478d41b
- **ran (line 29542ea4435a):** cd skills/jarl/scripts && npm test · **saw:** tests 1831, pass 1809, fail 0, skipped 22, on abf27d825bb7386fcc3d4fb64de804dfd478d41b in the worktree 531-old-text-owner-phrase, clean tree, no failure in this run

### Notes

Deferred: For the next release of Jarl: it is not part of this release of Runes, Yggdrasil and Grain.

