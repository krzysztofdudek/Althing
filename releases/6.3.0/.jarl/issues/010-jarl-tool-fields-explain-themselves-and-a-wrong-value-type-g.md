# 010 · Jarl: tool fields explain themselves, and a wrong value type gets a message about the type

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/010-tool-fields-explain
**Worker:** w-jarl-010-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-010
**Since:** 2026-11-03 17:02

## What
Through the tools a coordinator guessed field names: after takes id and ids, which the names do not say; evidence takes lists for ran and saw, and a plain string gave a JSON syntax error instead of a type message; body cannot append to a section; decide's --supersedes and decisions' live view were never found, so withdrawals were written as new rulings by hand.

## Why
The one-sentence tool summaries are the only text an agent reads before it calls; a field whose meaning is not in its name needs its example there.

## Acceptance
- Each tool field whose meaning is not obvious from its name carries a short example in its description (after, evidence, review, decide's supersedes, decisions' live view)
- A value of the wrong type is refused with a message naming the field and the type it takes
- body can append to a section as well as replace it
- Tests for the descriptions, the type message and the append

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

A second field report (2026-10-27): new --after refuses a JSON list while tags and files on the same call take lists; body takes only id through the tool. This issue covers that too: lists accepted wherever the command line takes a comma list, one rule for every list field.
- **ran:** TMPDIR=$HOME/Temp/tmp/w010 nice -n 15 node --test --test-name-pattern 'a tool field whose name does not give its meaning' skills/jarl/scripts/tests/mcp.test.mjs · **saw:** tests 1, pass 0, fail 1; not ok: a tool field whose name does not give its meaning carries an example that is a call of its own tool; AssertionError: jarl_after id carries an example
- **ran:** TMPDIR=$HOME/Temp/tmp/w010 nice -n 15 node --test --test-name-pattern 'a value of the wrong type is refused' skills/jarl/scripts/tests/mcp.test.mjs · **saw:** tests 1, pass 0, fail 1; not ok: a value of the wrong type is refused with a message naming the field and the type it takes; AssertionError: no match for the append message, actual: unknown field append
- **ran:** TMPDIR=$HOME/Temp/tmp/w010 nice -n 15 node --test --test-name-pattern 'jarl_body with append adds' skills/jarl/scripts/tests/mcp.test.mjs · **saw:** tests 1, pass 0, fail 1; not ok: jarl_body with append adds to the section the call names, and without it replaces that section; InvalidParams: jarl_body: unknown field append
- **ran:** TMPDIR=$HOME/Temp/tmp/w010 nice -n 15 node --test --test-name-pattern 'body --append adds to a section' skills/jarl/scripts/tests/description.test.mjs · **saw:** tests 1, pass 0, fail 1; not ok: body --append adds to a section after what it holds, and logs the line a replacement logs; unknown flag --append for body

