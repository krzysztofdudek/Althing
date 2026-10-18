# 305 · Jarl: new refuses a text that holds a tag named after one of its own fields, and its reply lists what was parsed and what was left empty, w…

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Source:** research/2026-10-15-jarl-parallel-worktree-field-report#jarl-pw-new-field-tags-and-reply
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:955
**After:** 260, 310
**Branch:** jarl/310-ids-and-filing
**Merged:** 2ad622756fc87d49a52b8fa4a876912ee047e132 in ../../../JarlSkill
**CI:** pending

## What
Claim: A caller whose tool call carried every field inside the What parameter got tickets with the default priority, no tags and empty Why and Acceptance on every call (about 30 in one session), and could not tell from the reply that anything was wrong, because the reply is only the number and the file.

cmdNew writes each flag into its own place and reads nothing out of a text value (JarlSkill/skills/jarl/scripts/jarl-lib.mjs:955), so the tags in the What text came from the calling side; the reply is 'filed NNN · file' (jarl.mjs:474 at 67615e6); a field report from a private deployment of 6.1.0, section 3.1 and 3.6 (source.md). Not reproduced in this pass.

## Why


A ticket whose fields all landed in its What reads as filed and is not: no priority, no tags, no acceptance for a worker to prove. A reply that names what was parsed makes the slip visible on the call that made it. Amended by the architect's scope review of 2026-10-18 (section 4, item 10): the refusal must not catch a tag that is quoted, because this issue's own What, and any issue about Jarl's fields, names such tags in code spans; so only a matched opening and closing pair of a field name, outside code, is refused.

## Acceptance
- First step: reproduce the report's call on a scratch loop, recorded as a --ran/--saw row
- new and body refuse a What, Why or section text that holds a matched opening and closing tag pair named what, why, acceptance, prio, tags, files or kind outside code (a code span in backticks or a fenced block), naming the field and saying to pass it as its own parameter; a lone tag, or a pair inside a code span or fenced block, is accepted
- The reply of new keeps its first line (filed NNN · file) and then lists the parsed priority, tier, tags, the number of acceptance lines and the lengths of What and Why, and the fields left empty (Why, Acceptance, Files, After, Where, Found by), each with the command that fills it (body, files, after)
- Tests: all fields given, each parsed into its section or header; a What carrying a why pair outside code refused with the field named; the same pair inside backticks and inside a fenced block accepted; this issue's own What accepted; the reply of a bare new names every empty field. 6.2.0.

## Changelog
- Changed: new refuses a What, Why or section text that holds a matched tag pair named after one of the issue's own fields outside code, and its reply lists what was parsed and each empty field with the command that fills it.

## Evidence

Deferred: Next release (6.3.0), per research/2026-10-15-jarl-parallel-worktree-field-report/design.md, What follows; the owner decides whether any moves into 6.2.0

jarl: back in Jarl 6.2.0 under the ruling jarl-release-alone-with-every-jarl-issue (2026-10-18), which supersedes the deferral recorded above; body and After amended to the architect's scope review of the same day (its order of packages and its section 4).
- **ran:** jarl new "t" --what "<what>the thing</what><why>because</why><prio>1</prio><tags>a,b</tags><acceptance>- it works</acceptance>" on a scratch loop, before the change, then jarl show 1 · **saw:** filed 001 and nothing else; the issue shows Priority 2, empty Tags, empty Why and Acceptance, and the whole text in What. After the change the same call is refused: the What text holds a <what>…</what> pair: a field goes in its own parameter (--what)
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 2ad6227 · **saw:** 267 tests, 265 pass, 0 fail, 2 skipped

