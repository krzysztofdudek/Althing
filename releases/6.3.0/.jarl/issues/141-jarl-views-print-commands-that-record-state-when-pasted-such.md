# 141 · Jarl: views print commands that record state when pasted, such as next --as jarl printing merged <id> --ci green|red

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261104T2053-wvvm
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096g-opus
**Where:** Review of 096 (rev-jarl-096g-opus), Outside the issue
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
Views and replies print commands: next --as jarl prints 'merged <id> --ci green|red', which pasted records CI green; the owner's list prints 'answer a-N "yes" --by owner (or "reject")'; new prints 'field <id> Files p,q'. They were there before 096.

## Why
A view is read by agents who paste; a printed command that records a state or an act reserved to someone else can be pasted without the facts being checked.

## Acceptance
A command a view prints either carries a registered placeholder where a fact only the reader knows goes, or is read-only; the owner's acts are shown as questions to ask; a test scans the views' output for it

## Changelog
- Changed: A command that the status, the resume or a note prints for you to run, such as recording a CI result, reopening a task or ordering one task after another, keeps a <placeholder> wherever only you know the fact, and the owner's answer and tick always do. A line pasted as printed is refused and records nothing until you fill it in.

## Evidence

- **ran (history):** node --test tests/printed-writes.test.mjs in a copy of the release branch before the change (new file, 3 tests that read the commands of 16 views over a loop with an issue at every step, a merge whose CI is pending, a closed issue whose gate does not hold, an unordered naming and a question of every kind) · **saw:** pass 0, fail 3: merged 6 --ci 'green|red', set 7 open, field 9 After 5 --add, answer a-N yes --by jarl or owner and tick 8 1 --by owner are printed as runnable writes
- **ran (history):** the same file on the branch tip; node jarl.mjs next --as owner --all and status on the rich loop · **saw:** pass 3; every command that writes holds a registered placeholder (merged 6 --ci "<ci-state>", set 7 open "<text>", field 9 After "<ids-it-waits-on>" --add, answer a-2 "<yes-or-reject-first>" --by "<the-owner-himself>", tick 8 1 --by "<the-owner-himself>"); the one command printed whole is ask 'start a fresh session to review issues ...', the question put to the owner; pasting an owner form is refused for its placeholder; the walk of refusals-walk-views still passes
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

