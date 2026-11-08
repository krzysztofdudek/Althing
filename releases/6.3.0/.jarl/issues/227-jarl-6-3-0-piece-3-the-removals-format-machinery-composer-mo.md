# 227 · Jarl 6.3.0, piece 3: the removals: format machinery, composer mode, older readers

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 226
**Found by:** jarl
**Where:**

## What
section 12's removals in code, and the refusal of section 3. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 3.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] a loop whose `goal.md` holds no `Format: 4` line, or another number, is refused on every command, before anything else, and the refusal names `references/converting-from-6-2.md`
- [test] `init` writes the line, and no command changes it
- [test] every write at the command line and through MCP without `--by`, and a lease or verdict without `--model`, is refused, ending with the form; the library takes the writer it is given
- [check] nothing in `skills/jarl/scripts` matches `needFormat`, `needRaisable` or `FORMAT_LINES` · by: `grep -rEl "needFormat|needRaisable|FORMAT_LINES" skills/jarl/scripts` prints nothing
- [check] the frozen older readers and the tests about them are gone · by: `ls skills/jarl/scripts/tests/fixtures | grep -E "^jarl-6\." ; grep -rl "old-jarl" skills/jarl/scripts/tests` prints nothing
- [test] the log reader reads only the current shape of each line, a writer of `unrecorded` and a history row included; a line of an older shape is named by `verify`; an issue closed before a `converted` line is not re-read against the gate
- [check] composer mode is gone from the code · by: `grep -rEil "external.scheduler|composer" skills/jarl/scripts/lib skills/jarl/scripts/*.mjs` prints nothing
- [test] `record.mjs` holds one contract, `jarl-record/4`, with the older tables gone, and its contract test holds that one
- [test] the `identical-output` tag has no effect, and `compare` does its work
- [test] the four-issue cut of review units and the package size are gone: a lease is one unit, whatever it carries
- [test] the reviewer's re-run rule by tier is gone
- [check] the full suite passes on the merged result
- [read] an independent examiner: what went is what section 12 says went, and nothing else

## Evidence

