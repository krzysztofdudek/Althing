# 131 · README: 'Grain's own repository earns zero rules enforced' is not true (6.1.0 on Grain's own HEAD gives 5 enforced), and the fixture blocks given as real output are out of date

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/README.md, Grain/plugins/grain/tests/docs-audit.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** README.md:24-26 (line 25, present tense), :79-83, :173-214 (fixture blocks; :175-216 on release/6.1.1, unchanged; release/6.1.1 already reworded line 83 in 076adf4); plugins/grain/tests/docs-audit.test.mjs checks only the command documentation and old wordings, it does not reproduce the fixture blocks. Newer output shapes: the `map:` prefix from voice('map') in engine/mine.mjs:783-784 (since 8e00179, 2026-09-06), the `in:` line from engine/cards.mjs:381 (e7a5e57, 2026-09-22); the README block was last edited in 3aa4ecf (2026-09-26), so it was patched line by line and never run as a whole.

## What
Reproduction (fresh clones from GitHub, HEAD ae6152f, yg 6.1.0 on PATH, node 24.11.1):

(1) Grain on its own repository: `node ../grain-src/plugins/grain/bin/grain.mjs propose --json ../grain-self-propose.json` prints '5 promoted to `status: enforced`, 3 to `status: advisory`'; JSON: aspects total 33, enforced 5, advisory 3, the remaining 25; the adoption preview '33 rules (5 enforced, 3 advisory, 25 draft)'. README:25 says in the present tense 'Grain's own repository earns zero rules enforced from its own `propose`, for the same reason', and the reason given is missing history, though the clone has 571 non-merge commits. Zero enforced happens only when there is no Yggdrasil CLI (propose-report.mjs:143), which this sentence does not describe. The 5 enforced rules concern test files and the aspect files of test oracles, but they passed a real drill.

(2) The deterministic fixture (head 47da000) in the block presented as 'Real output … nothing below is mocked up' differs in four places: the handlers header says '15 conventions' (README: 12); the architecture line '7 modules · 6 directed dependencies' (README: 6 · 5); `check` says 'governed by 13 convention(s)' on both the clean and the edited file (README: 12); `where` cards start with an `in: src/handlers/ (layer 2) · used by 1 modules` line and a `map:` prefix, and carriers have line ranges (`:7–15`, not `:7`). Beyond the report: with the edited file ('as of 47da000+dirty', as in the README) `check` 6.1.0 does not print the `conforms to:` line at all, while the README shows it ending in '+5 more'; the clean run ends it with '+6 more'.

README:83 ('the same renderer produced 0 enforced rules, 22 advisory candidates and 59 drafts') is in the past tense, matches the dated record in docs/results.md (lines 104/107), and release/6.1.1 has already reworded it to 'an earlier build of the renderer produced…'; this overlaps the known point about out-of-date numbers from the Yggdrasil run (issue 001, which also covers the label of the placement hook example around README:250). Line 25 and the fixture blocks are not reported anywhere.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f7-grain-self/repro.log and <the session scratchpad, since lost>/bughunt/grain/find-9/f6-readme-fixture/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-69/grain-self-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-69/fixture-repro.log, <the session scratchpad, since lost>/bughunt/grain/verify-69/fixture-dirty-repro.log.

## Why
Line 25 misstates why Grain gets zero enforced rules and what it actually gets, and the block sold as unmocked real output does not survive a verbatim rerun. This is documentation drift, not an engine bug, but every new user reads the README.

## Acceptance
- README:24-26 describes what 6.1.x gives on Grain's own repository, or is a dated measurement in the past tense.
- The fixture blocks in README:173-214 are 6.1.x output run verbatim on the fixture from build-fixture.mjs (headers, counts, `in:` and `map:` lines, `conforms to:`).
- A test or a script reproduces the fixture blocks and compares them with the README, so that drift is detected.

## Evidence


