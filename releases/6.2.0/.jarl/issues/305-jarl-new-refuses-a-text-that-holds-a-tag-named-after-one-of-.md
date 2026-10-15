# 305 · Jarl: new refuses a text that holds a tag named after one of its own fields, and its reply lists what was parsed and what was left empty, w…

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-new-field-tags-and-reply
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:955

## What
Claim: A caller whose tool call carried every field inside the What parameter got tickets with the default priority, no tags and empty Why and Acceptance on every call (about 30 in one session), and could not tell from the reply that anything was wrong, because the reply is only the number and the file.

cmdNew writes each flag into its own place and reads nothing out of a text value (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:955), so the tags in the What text came from the calling side; the reply is 'filed NNN · file' (jarl.mjs:474 at 67615e6); a field report from a private deployment of 6.1.0, section 3.1 and 3.6 (source.md). Not reproduced in this pass.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: new and body refuse a What, Why or section text that holds an opening or closing tag named what, why, acceptance, prio, tags, files or kind, naming the field and saying to pass it as its own parameter. The reply of new lists the parsed priority, tier, tags, the number of acceptance lines and the lengths of What and Why, and the fields left empty (Why, Acceptance, Files, After, Where, Found by), each with the command that fills it (body, files, after). Tests: all fields given, each parsed into its section or header; a What carrying <why>...</why> refused with the field named; the reply of a bare new names every empty field. First step: reproduce the report's call on a scratch loop. 6.3.0.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

