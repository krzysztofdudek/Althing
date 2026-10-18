# 248 · Jarl: review records only the first line of the findings in log.md and nothing on the issue, so the second Important is lost from the record

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** jarl, review
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** skills/jarl/scripts (review → log line); issue file Evidence
**After:** 241
**Branch:** jarl/248-review-testimony
**Merged:** bc1d4477695495ec4ae94d2dbb53be2a899ced9d in ../../../JarlSkill
**CI:** pending

## What
One class of bug (architect, section 3.3): wherever Jarl writes multi-line text into a line-based record file, only the first line remains. Confirmed: review findings in log.md (193: the second Important was lost), a question's options in asks.md and in the ruling (a question with options remains 'Answer: b'), the answer and the ruling copied into the issue's Evidence. The jarl of a loop in another project reported it too.

## Why
A changes verdict without the second Important does not say what needs fixing; over time the record cannot show why the package came back.

## Acceptance
- review records the full findings in the issue's ## Reviews section (verdict, reviewer, kind, the whole text); a question keeps every line; answer and decide --settles write into the issue a reference to the whole ruling instead of its first line; events in log.md never contain a raw newline character (a short line and a reference).
- One test passes a three-line text through every command that writes text (review, ask, answer, decide, evidence, body, new), and checks that nothing is lost in show, --json and the files.

## Changelog
- Fixed: A text of several lines given to a command is no longer cut to its first line. review writes the whole findings into the issue's new Reviews section, a question keeps every line, and a settling ruling points at the whole ruling; the log stays one line per event.

## Evidence


- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge bc1d447 · **saw:** 271 tests, 269 pass, 0 fail, 2 skipped

