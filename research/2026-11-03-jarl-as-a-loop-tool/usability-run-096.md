# Usability run of the normalized command surface (issue 096, acceptance line 7)

## Question

Can a fresh agent on the light tier, given only `SKILL.md` and the tool's help, file an issue, change its fields, lease it, record proof, record a review, answer a question and close it on a scratch loop, with no call refused for a wrongly guessed form (ruling `surface-easy-for-agents`)?

## Method

Run on 2026-11-05 against the tip of the release branch with issue 096 merged. The test subject was Claude Haiku 5.5 at max effort, a light-tier model chosen with the model-choice skill. It could read `SKILL.md` and run the tool with `--help`; it was told not to read the references, scripts, tests or README, and to record every call exactly, including each failed first guess. The scratch loop was made with `mktemp -d` under the system temporary directory. The report below is the subject's own, with machine paths replaced by placeholders (`J` is the tool's script, `R` the scratch loop's folder).

## Result

16 Jarl calls (13 writes and 3 reads), 0 refused, 0 refused for a wrongly guessed form, all seven tasks done. The subject states one limit itself: it read the top-level help before its first write and copied each usage line from it, so the zero shows that the usage lines can be followed, not how a blind first guess would fare. It ran no command-level help.

## The calls, in order

Non-Jarl steps: a `mktemp -d` for `R`; one whole read of `SKILL.md` (143 lines); a read of the harness's saved copy of the top-level help, because the inline output was cut to a 2 KB preview; `node --version`, which printed `v24.11.1` and served as the proof command.

1. `J --help` worked first try. The output was 53.4 KB.
2. `J init "usability check" --root R` worked. It printed that the loop is kept out of git, and a note that the goal names no check, so the loop lands on testimony alone.
3. `J new "Usability check issue one" --what … --why … --acceptance … --where … --root R` worked. Filed as issue 1; the notes gave the defaults (tier standard, kind bug, priority 2) and listed files and after as empty, each with its field form.
4. `J field 1 Priority 1 --root R` worked.
5. `J field 1 Tags "usability,smoke" --add --root R` worked.
6. `J field 1 Files "notes/usability-check.txt" --root R` worked.
7. `J field 1 Acceptance "The proof row records the version that node --version printed" --add --root R` worked. The echo cut the new line with an ellipsis.
8. `J field 1 Tags "smoke" --remove --root R` worked.
9. `J show 1 --root R` worked (a read added to check the edits).
10. `J set 1 in-progress "Leased to the worker w-check for the usability check" --branch jarl/1-check --worker w-check --root R` worked. No `--model` was passed and none was asked for.
11. `J evidence 1 --ran "node --version" --saw "v24.11.1" --root R` worked.
12. `J review 1 approve --by rev-check "…" --root R` worked. No `--model` was passed. The next-step line said the merger should merge first.
13. `J ask "…" --root R` worked. It printed `asked a-1` and no kind.
14. `J answer a-1 "…" --by owner --root R` worked. The answer text said it was simulated by the test subject.
15. `J set 1 done "…" --root R` worked, with no merge asked for.
16. `J status --root R` worked. It showed `closed, gate does not hold: 1 · a code issue done with no merge recorded`, with a repair that reopens the issue.

## What confused the subject, most serious first

1. The done gate and the merge. The review reply said the merger merges first and a worker never sets done; `set done` then accepted the issue with no merge; `status` then called the same issue closed with a gate that does not hold. The skill never says a merge is needed before done, and the help's list of what done needs has no merge in it. (Filed as issue 148.)
2. `--model` is unbracketed in the skill's lease and review forms and bracketed in the help; both calls were accepted without it, with no note.
3. Owner answers: the help's `decide` requires the owner's own words for `--by owner`; `answer` takes `--by owner` with no quote, and nothing marks a simulated answer except the text.
4. The word close covers two commands: `set <ids> done` closes an issue, `close` ends the loop. The skill's table says so; the overlap is mild.
5. `ask` has no stated default kind and prints none, where `new` prints its defaults.
6. The top-level help is 53.4 KB, so a harness shows a 2 KB preview; some entries are very dense.
7. The skill shows `merged` with `--ran` and `--saw` required where the help shows them optional beside `--red`.
8. The skill's "Calling the tool" section says to use the MCP tools first; the check limited the subject to the command line, so this is a feature of the test, not of the tool.
9. The skill sends each role to a reference file; the check forbade those files.
10. Smaller points: the `field` echo cut the second acceptance line; the done note printed `1 2 acceptance line(s)` with an unexplained leading 1; `record format 3` in `status` is never explained.

Issues 148 and 149 hold the findings that are the tool's; the rest follow from the shape of the check.

## Conclusion

The normalized surface can be followed by a light-tier agent from the skill and the help: no call was refused. Whether a blind first guess works was not measured; a run that skips the help is the next step if the owner wants that number.
