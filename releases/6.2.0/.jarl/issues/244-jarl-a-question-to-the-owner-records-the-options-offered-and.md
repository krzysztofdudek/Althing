# 244 · Jarl: a question to the owner records the options offered, and the answer — which one he chose, or that he answered in his own words

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, ask
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**After:** 338
**Branch:** jarl/244-questions-goal
**Merged:** 55d724cc620d01dc7dcde0725177e581e42d51e0 in ../../../JarlSkill
**CI:** pending

## What
In the 6.2.0 loop the jarl asked the owner through the host's choice window (options with consequences and a recommendation), and copied the answer into decide --by owner with the note '(option label)'. ask/answer exist and turn an answer into a ruling — the jarl did not use them (an error of practice, not of Jarl) — but even through ask the record neither contains the options offered nor distinguishes the chosen label from the owner's words. On reflection: this is pure record-keeping (consistent with 'What Jarl will not grow'); it adds no new kind of question and blocks nothing. Amended by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (B.2 items 6 and 7), from a field report from a loop in another project, where the owner is rarely available: asks are already the owner's background queue (ratify blocks nothing, stuck --issue holds one issue, both listed by status and resume), but answering is one id per call (jarl.mjs:338 at 2c12aa3), and when the owner looks at several ratify items and says yes to all of them (this loop's ruling ask-015 is that case) the jarl answers them one by one; and nothing ties a ruling's supersession to the open issues whose What, Why or Acceptance cite it, so the moment to rewrite them passes unnoticed. Rejected: ask --defer and an owner tag (asks are the queue; a tag would duplicate it).

## Why
A ruling 'chose option B' without the list of options loses its meaning over time; the audit of decisions (who chose what against which alternatives) is the main value of the record. Cheap answering is what makes asks a queue an owner who is rarely there can clear in one sitting, and a supersession is the one moment the jarl can rewrite every issue that cites the old ruling.

## Acceptance
- ask accepts an optional, repeatable --option "<label>: <effect>" and prints the question with its options ready to be put in the choice window of the host; a yes/no question without options works as it does today
- answer accepts --option <label> or text; the ruling quotes the options offered and marks the chosen one, or quotes the words of the person — never one pretending to be the other; an answer to a ratify item requires --by and rejects coordinator names (jarl, reeve, coordinator, the name of the loop)
- decide --by owner without a question in the record prints a notice on stderr
- Growth, on the word of the owner (ask a-018): answer takes several ratify ids with one verdict and writes one ruling each, each naming the batch it was answered in; decide --supersedes <slug> prints on stderr the open issues whose What, Why or Acceptance name the old slug, so the jarl rewrites them at once, through the one supersession scan that verify (251) also runs; tests for both
- The several ids of answer come as one comma list in the same argument, and the field of the MCP tool keeps its name id (architect scope review of 2026-10-18, section 4, item 12): a caller of jarl_answer that passes one id works unchanged; tests for one id and a list through the CLI and the MCP tool
- Under the record contract jarl-record/1 the library answer is unchanged: it takes no options, its arity is the one record-contract.test.mjs holds, and --by and --option reach only the CLI and the MCP tool; record.mjs is unchanged (git diff of it prints nothing) and record-contract.test.mjs is green
- Not here (architect code review of 2026-10-18, O11): no --recommend, which would tie Jarl to the choice window of one host, no decide --ratify, which is a shortcut for two existing calls, and no other option beyond these lines

## Changelog
- Added: a question can offer its choices with --option, and the answer records which one was chosen or the person's own words.
- Added: several ratification questions are answered at once with one comma list of ids and one answer.
- Added: decide --supersedes names the open issues that still cite the ruling it replaces; a ruling by the owner with no question behind it gets a notice.
- Changed: an answer to a ratification question must say who gave it, with --by; a coordinator's name is refused there.

## Evidence


- **ran:** cd skills/jarl/scripts && npm test · **saw:** tests 523, pass 502, fail 0, skipped 21 (at commit dc543d9)
- **ran:** node --test --test-reporter=tap tests/jarl.test.mjs --test-name-pattern=options · **saw:** before the change: the new question, answer, notice, separator, frozen reader and MCP tests did not pass (5 of the 6 selected failed); after it: all pass
- **ran:** node --test --test-reporter=tap tests/jarl.test.mjs --test-name-pattern=frozen reader · **saw:** the frozen 6.1.0 reader lists, reports, next and queue the loop with no error; the worker is parsed; done passes
- **ran:** jarl status, resume, next --all, report, list --all, tips, queue, branches and show --full for every issue, before and after the change, on a copy of the loop · **saw:** byte-identical before and after
- **ran:** cd skills/jarl/scripts && npm test · **saw:** tests 537, pass 516, fail 0, skipped 21 (at commit 45bf4b4)
- **ran:** node --test --test-reporter=tap tests/jarl.test.mjs --test-name-pattern=cannot forge · **saw:** before the fix: 5 of the 6 selected tests failed (the reviewer's attack, the free-text property, the option line break, the duplicate answer and the supersession boundary); after it: all pass
- **ran:** node --test --test-reporter=tap tests/jarl.test.mjs --test-name-pattern=frozen reader · **saw:** the frozen 6.1.0 reader reads a loop with an own-words answer and a batch answer: lists, status, next and queue with no error, the worker parsed, the open question counted, done passes
- **ran:** jarl status, resume, next --all, report, list --all, tips, queue, branches and show --full for every issue, on a copy of the loop · **saw:** byte-identical to the baseline
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 55d724c · **saw:** 537 tests, 516 pass, 0 fail, 21 skipped; model test: worker haiku-5.5, two rounds (a critical forgery by newline found by the sonnet-5.5 reviewer and fixed), approved

