# 532 · 6.2.0 briefs: the release's templates become additions to the tool's own brief, without Horde

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261109T1649-mkwa
**Tags:** althing, briefs
**Files:** Althing/releases/6.2.0/briefs, Althing/workspace/test/brief-templates.test.mjs
**Repo:** Althing
**Found by:** jarl
**Where:** releases/6.2.0/briefs/reviewer.md:10
**Branch:** jarl/532-briefs-as-additions
**Merged:** 445b18d36be18123d4c2addab45b0db3a19a934a in Althing
**Merge check:** yg check && npm test · saw yg check: PASS auto-filled 17 nodes - 1225/1225 files covered - 5289 pairs verified (sc; tests 121,pass 110,fail 0,skipped 11

## What
The 6.2.0 loop moved to Jarl 6.3.0, whose tool prints the role, the lines and every command. The release's templates are still complete briefs of the old format. So ws brief reviewer and ws brief merger stop on the placeholders for Horde, which has left the family, and for the pasted issue. Each template becomes a list of what the family adds, as the 6.3.0 release has it, the Horde worker template goes, and workspace/test/brief-templates.test.mjs stops requiring the old shape, which has kept Althing's tests red since the conversion.

## Why
Without this no reviewer or merger of the release can be briefed, and every piece of work that follows needs both.

## Acceptance
- [test] Every brief of an open release renders with only the tools still in the family · by: node --test workspace/test/brief-templates.test.mjs
- [read] Each template holds what the family adds and nothing the tool's own brief says, and no template of an open release names Horde

## Reviews
- **approve** · by rev-532-fable (fresh) · 2026-11-09 · model claude-fable-5-1
  Minor: releases/6.2.0/briefs/reviewer.md:60, merger.md:6, worker-grain.md:141, worker-runes.md:226, worker-yggdrasil.md:281 drop the old rule that everything written into the loop is public (no absolute path, no session link, no private name), which the tool's brief does not say; worker-jarl.md:213 keeps it, so one line per file restores it · Minor: reviewer.md:70 lacks the three ledger rulings the 6.3.0 model's reviewer carried (jarl-runs-on-mac-windows-linux, known-limitations-list-for-wording-minors, the --outside guidance) while worker-jarl.md:199-200 cites two of them, so a Jarl worker is held to a platform rule its examiner is not told to check · Minor: reviewer.md:60 no longer says that where a ruling narrows an issue the examiner judges against the ruling, and names no scope ruling; the tool points only at 109 live rulings · Minor: merger.md:15 composes the JarlSkill path as {{althing}}/../JarlSkill, which the tool's brief already prints from repos.md and which misleads on a machine where JarlSkill is not Althing's sibling · Minor: merger.md drops the pointer to plan-6.2.0.md sections 'Waves and the cross-repository order' and 'Shared files and how they are resolved', which still exist and hold 6.2.0-specific sequencing · Minor: worker-runes.md:256 drops the Runes report items (catalogue delta and new count, rev changes, docs/api.md rows) the merger used to sum deltas · Minor: worker-jarl.md drops the pointer to plans/jarl-architecture-6.2.0.md while a Jarl issue (316) is still open · Minor: the worker recorded only the green run of line 1; the red run (the new test over the old templates) was not on the record, I ran it and it fails for the right reason · Checked: no Horde in any 6.2.0 template, nothing outside the issue's Files moved, no older-format loop with briefs remains under releases/ (6.1.0 holds only its manifest and freeze), so the removed shape tests guarded nothing that still exists; every role renders with the machine's ws.local.json; {{exec:yggdrasil}} renders empty here as before the change (no exec in ws.local.json), a machine setting, not this change

## Evidence

### Proof

- **ran (line 5e9e0beb063d):** node --test workspace/test/brief-templates.test.mjs · **saw:** tests 5, pass 5, fail 0, on 4d15b8e6dd74df7ffa68fd98589862c69cd43618
- **ran (line 5e9e0beb063d):** node --test workspace/test/brief-templates.test.mjs · **saw:** in the worktree at 4d15b8e: tests 5, pass 5, fail 0; the same test file over the base tree 3e766fe extracted to a scratch folder: tests 5, pass 2, fail 3 (the brief needs {{repo:horde}}, {{trailer}}; merger.md names horde), so it fails for the right reason
- **ran (line 5e9e0beb063d):** node --test workspace/test/brief-templates.test.mjs · **saw:** red before the change, on base 3e766fe with the new test file: tests 5, pass 2, fail 3

