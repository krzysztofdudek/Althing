# 099 · Jarl: next --as lines — resume's in-flight line contradicts the new list for a sent-back issue, the ready line leaves out --model, the ratify line cannot be pasted, a ruling cited by prefix matches a longer name, status --tag ends with the whole loop's list

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T1334-jqol
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 052
**Found by:** rev-jarl-052-opus
**Where:** Review of 052 (2026-11-03)
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
On the 6.3.0 loop resume --as jarl says 066 and 089 wait for a reviewer while the new list says a round sent them back; the printed command for a ready issue omits --model so the worker's model goes unrecorded; the ratify line carries (or reject) and cannot be pasted; a ruling counts as cited when its name appears anywhere in the issue's last reason so ask-01 matches ask-012; status --tag with --as ends with the whole loop's list; the owner-first order never shows inside one holder's list.

## Why
Each makes a line of the list less true or less usable for a coordinator reading it after a compaction.

## Acceptance
Each is fixed or stated as a limit, with a test where behaviour changes

## Evidence

- **ran (history):** node --test --test-name-pattern='cited by its whole name|sent back is back|scoped by a tag' tests/next-as.test.mjs in a copy of the release branch before the change (new tests) · **saw:** pass 0, fail 3: ask-01 is suppressed by a reason naming ask-012 (the ruling row is missing), resume and status say an issue a round sent back waits for a reviewer where next --as says it is back with the worker, and a status scoped by a tag ends with an unmarked whole-loop list
- **ran (history):** the same three tests on the branch tip, then node jarl.mjs next --as jarl on a copy of the 6.3.0 loop (before: set 001 in-progress --branch "<branch>" --worker "<name>") · **saw:** pass 3, fail 0; the ready line now ends --worker "<name>" --model "<model-id>"; resume and status say sent back by a round, no new proof yet for a sent-back issue; the ratify line (or reject) is the placeholder form of the next issue; the point that the owner-first key cannot show inside one holder's list is a property of the display and changes nothing
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

