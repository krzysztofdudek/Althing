# 145 · Jarl: MCP input refusals end with no form, and list accepts a status, kind or priority it does not know

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261105T0312-esfd
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096h-opus
**Where:** Review of 096 (rev-jarl-096h-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Merged:** 2d4133b2b75089cecf7d5a9f1ebe98527f8198ad in ../../../JarlSkill
**CI:** none

## What
A tool call whose root or path field is not absolute, whose field is unknown or whose type is wrong is refused with no form of the call. list --status bogus, --kind task and --prio 7 print (none) and exit 0 instead of refusing. Both were there before 096.

## Why
An agent that mistypes a filter should be told the allowed values, not shown an empty list.

## Acceptance
Every MCP input refusal ends with the tool's form with a registered placeholder, and list refuses an unknown status, kind or priority naming the allowed values; a test holds each

## Changelog
- Fixed: a tool call refused for its input, such as a root that is not an absolute path, a field the tool does not take or a value of the wrong type, now ends with the call that tool takes, each value to fill in marked. list given a status, a kind or a priority the loop does not know is now refused with the values it knows, instead of showing an empty list.

## Evidence

- **ran (history):** node --test tests/input-forms.test.mjs on the code before the change · **saw:** 5 of 6 failed: no refusal of a tool input ended with a form, list --status bogus printed (none)
- **ran (history):** node --test tests/input-forms.test.mjs tests/refusals.test.mjs tests/mcp.test.mjs tests/surface.test.mjs tests/grammar.test.mjs after the change; list --status bogus, --kind task, --prio 7 on a copy of the real loop · **saw:** fail 0; list refuses with '--status must be one of: open, in-progress, done, dropped, deferred (got "bogus")' ending with jarl.mjs list --status "<status>" (also kind with promise and wait, prio 1, 2, 3); a refused tool input ends with jarl_<tool> {...} whose values are registered placeholders or the root given
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch after packages B and C, TMPDIR from mktemp -d · **saw:** tests 1337, pass 1315, fail 0, skipped 22, merge 2d4133b

