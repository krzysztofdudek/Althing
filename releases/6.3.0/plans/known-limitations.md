# Known limitations of Jarl 6.3.0

The owner's ruling `known-limitations-list-for-wording-minors` (2026-11-05): a finding that is only a matter of wording, taste or an input no one is expected to give is not an open issue. It is written here with the review it came from and one sentence of what a user could meet, and the release notes may carry it. A defect stays an issue and is fixed in 6.3.0. A finding in doubt is a defect.

This list is the raw material for the "known limitations" part of the release notes; the final text is written once by hand at the release.

## Whole issues moved here

Each of these issues was dropped with the reason "a known limitation, listed in releases/6.3.0/plans/known-limitations.md".

- 110: the tool text says a comma list, so a JSON list for Tags or Resources is refused, text that looks like JSON is stored as text, and two fields lack a worked example.
- 116: `renumber` exists only for two files that carry one number after two clones filed alike; later references to the old number (an After, a question) stay as they were.
- 118: the examples of the lease commands in the docs omit `--by`, so two writers' leases taken in two unsynchronised clones look alike.
- 121: npm itself leaves a compile-cache folder in the scratch directory, so "the scratch directory is empty after the suite" is not true of the outer folder.
- 123: `handoff` works but is an internal command, hidden from the help on purpose.
- 124: `--findings` on `round` is a number, while the same word was once free text on other commands.
- 129: `next --limit` and `resume --ready` are two names for how many ready issues to show; both work.
- 138: `archive` turns a name into kebab case, and `decide` accepts letters, digits and the characters `.`, `_` and `-`, so a ruling name such as `Bad_Slug` can exist.
- 139: a free note such as "4 merged abc1234 into main" is stored as plain text and could mislead a person, though not the tool.
- 154: a coordinator's brief lists the rules of all six moments while `next --as` lists the moments of its own rows (a superset, nothing is lost); the reviewer's brief of a dropped issue says its proof is missing, which does not apply to an issue nobody reviews.

## Points of open issues that are limitations

These points sit inside issues that stay open because another point of the same issue is a defect. A worker who takes the issue fixes the defect points only, and leaves these as they are.

- 113, point 1: a refused question once raised the record format; it now raises it only after every check, so it looks fixed and needs only a test.
- 117, points 1, 2 and 4: a multi-line question prints on several lines in its row of `next --as`; `ask --kind rule` takes an `--option` that nobody can answer; some comments of the record library are not exact.
- 033, the rest: a tip line written by an older Jarl's log command, in the same minute and directly after its row, still counts as that row's tip; closing it needs a record format raise (ruling `033-older-tip-line-is-a-known-limit`, ratify item a-018).
- 157, the rest: a hand merge that swaps or duplicates two alike Reviews entries, where one pairing in order still places every entry, gives each verdict the other's whole text with no note, because no record can tell the two apart.
- 188, the rest: two owner waivers on different tips, with the branch deleted by hand before `merged`, record no close tip, so a branch of the same name made again later turns the closed issue red, exactly as before; in the default flow the gate holds, and `references/profile.md` does not mention the case.
- 097, point 1: the refusal for a number two files carry reads "cannot be moved → done", which is awkward wording.
- 136, points 1 and 4: the README says the merger merges "into the branch", which is ambiguous but not false; the loop-discovery sentence sits under "What it does not do".
- 147, points 2 and 3: the held-lease refusal ends with an odd positional placeholder; the rule text shown by `next --as jarl` writes `--slice <name>` unquoted.
- 151, points 2, 3 and 4: some test comments keep the words "mission" and "ticket"; `SKILL.md` explains "composer" in passing while the glossary holds the definition; the vocabulary test does not catch that form.
- 153, points 3 and 6: the table "what is on whom" has no row for an idle lease and the `idle` field of `next --as --json` is not documented; a move from done to dropped counts as reopened after done in `report`, and writer names are grouped by exact spelling.
- 157, points 1, 2 and 3: a finding whose own text begins with "findings: model" is listed twice; with the same reviewer, first line and line count a newer entry can stand in for an older one; matched findings keep the file's backslash escapes.
- 158, points 1, 3, 4 and 5: `renumber` leaves a stale Parent after two copies of a loop are merged; a split can empty a parent and leave blank lines; a cycle refusal names its path from the sub-issue; a hand-made parent cycle gives `list` no top row (`verify` reports it).
- 162, point 2: `import` has no option that files every issue under one parent; set it per issue with `field <id> Parent <p>`.

## From the reviews of issues still in work

- 098: the dry run of each finding stops before the number is taken, so in a loop kept at the first format by an external scheduler two findings that land on 999 and 1000 file one and refuse the other; two identical `--outside` texts in one review file two identical issues; a refusal form shows one `--outside` slot even when the call gave several; the refusal of `--field` without `--outside` writes `--by "<who>"` where the other review forms write `<reviewer>`.
- 098: an issue that `review --outside` files gets a `filed` log line with no writer, where `new --by` writes one in a loop of the third format; the finder is still recorded in Found by, so nothing is lost.
- 044: findings with neither a claim nor a truth (only evidence and a proposal) are not compared by `import`, because the issue file carries no mark that import could know the issue by; the owner decided to say it plainly and leave it (ruling import-reports-changes-for-claim-and-truth-findings). A re-run of `import` compares nothing when it is not given the first run's `--found-by`; the output says how many findings it compared and how many it could not.
- 044: the reference "From research to issues" does not name the keys of the `--json` output of `import` (`changed`, `compared`, `notCompared`, `foundBy`), so a tool that reads it learns them from the code; the header "changed since filed N" counts issues while the line "compared N of M" counts findings, so when one finding has two issues that both read as import-filed the two numbers differ.
- 044: the library's import is not all-or-nothing in general; this is issue 162, point 1, and stays a defect.
- 145: a call to a tool name that does not exist ("Unknown tool") ends with no form, because there is no tool whose form could be shown.
- 140: the test that gives `--root` a directory name with a line break does not run on Windows, where such a name cannot exist; the read views (`list`, `status` and the like) still read an empty loop in a directory with no loop, while every writing command says there is none.
- 016: the `coordinatorNames` export of `jarl-lib.mjs` is no longer called by anything; and any write that names its author (`--by`) raises a loop to the third format, which the pinned first driver then refuses, as the ruling on one format raise says.
