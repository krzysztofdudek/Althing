# 154 · Grain: the sentence of a certified absence rule still reads as a ban ('No method … may be annotated with @Override'), though the rule is already a draft

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1011-dctt
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose-aspects.mjs
**Repo:** ../../../Grain
**After:** 039
**Found by:** grain-039
**Where:**
**Merged:** e9c6514
**CI:** none

## What
After 039 an absence rule stays a draft, but its description in yg-aspect.yaml is still worded as a ban. A person or an agent who raises it to enforced by hand gets a ban the code never promised.

## Why
The rule description is what the agent reads and what the reviewer judges; the sentence should say what was observed, not what is forbidden.

## Acceptance
The description of an absence rule says that in this part of the repo this has not been done so far, not that it is forbidden; a test on the text.

## Changelog
- Fixed: a proposed rule about something your code has not done reads as what was observed ("So far, 431 of 432 methods under `src/test/**` are not annotated with `@Override` — an absence, not a rule."), not as a ban.

## Evidence

- **ran (history):** node --test tests/absence-reads-as-observation.test.mjs on release/6.1.1 (2d42a4f) and on 2d3657c · **saw:** before: 3 of 3 fail (name 'No method under `src/test/**` may be annotated with `@Override`.'); after: 3 of 3 pass
- **ran (history):** node --test tests/propose.test.mjs tests/absence-never-enforced.test.mjs after the change · **saw:** the two assertions that pinned the old ban wording for a certified absence failed, were rewritten to the observed form; 42 pass, 4 skipped without YG_BIN; with YG_BIN in the full gate all pass
- **ran (history):** YG_BIN=<frozen yg 6.1.0> grain propose on gin@43fe48e with the new engine · **saw:** every certified absence reads as an observation, e.g. 'So far, 25 of 25 methods under `*`, in a file importing `errors`, take no parameter of type `testing.T` — an absence, not a rule.'; no aspect name with direction absence contains 'may'
- **ran (history):** YG_BIN HORDE_DIR GRAIN_CORPUS_CLONES npm test on 2d3657c · **saw:** tests 1993, pass 1992, fail 0, skipped 1

docs: docs/reference.md 'How a proposed rule is worded': the example 'No file under `src/Application/**` may import `lodash`.' is an absence and now reads 'So far, N of M files under … do not import `lodash` — an absence, not a rule.'; after 'The mood is deontic' add that a rule about an absence (import, call, marker, supertype, return or parameter type, construct; expected false) is worded as what was observed, with the counts of its holds line and the mined predicate word for word, and its description is that sentence alone. The sentence carries the counts the certified branch already uses, so issue 110's fix to those counts moves it too.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2048, pass 2047, fail 0, skipped 1, merge e9c6514

