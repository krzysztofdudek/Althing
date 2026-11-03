# Review outcome by change size, 6.2.0 loop

Part 1 of the review granularity investigation. Rows: [review-by-size.csv](review-by-size.csv). Script: [review-by-size.mjs](review-by-size.mjs), run as `node review-by-size.mjs` (read-only; writes `review-by-size.csv` and `bands.generated.md`, which holds the tables below).

## Method

- Units: every issue of `releases/6.2.0/.jarl/issues/` with at least one `merged <sha>` line in `log.md` (296 merge lines). Kind, tier and repo come from the issue header. A merge line with no `in <repo>` takes the repo from the issue's `Repo:` header (all candidates are tried).
- Size: `git diff --numstat <sha>^1 <sha>` in the sibling repository; lines = insertions plus deletions. Files under any `dist/` and paths matching `golden` are excluded from lines and files and counted apart (`gen_lines`, `gen_files`). Test files and `reference/` catalogue cases are counted as change. An issue with several merges (for example 075) sums them, once per distinct sha. Issues merged together on one sha (for example 015 and 017 on dac58df) each carry the size of the whole merge, so batched units are over-sized.
- Verdicts: `review approve` and `review changes` lines of the issue; `changes` is the count of the latter. Rounds = the larger of the verdict count and the number of `round` log lines (the 6.1.0 driver wrote `round` lines for only 14 notes, so rounds is in practice the number of review verdicts).
- Clean first pass = the issue's first verdict is approve. Severity = the highest of Critical, Important, Minor found as a word anywhere in any changes verdict's text (a verdict that mentions "Important" while only quoting it would be counted too; not hand-checked).
- Bands are by the issue's whole merge, not by the diff of a single review round.

## Bands

### By size band (lines changed, excluding dist and goldens)

| group | units | reviewed | clean first pass | Important/Critical named | mean rounds |
|---|---|---|---|---|---|
| 1 up to 20 | 2 | 2 | 100% | 0% | 1.00 |
| 2 21-100 | 3 | 3 | 33% | 67% | 1.67 |
| 3 101-400 | 22 | 22 | 77% | 23% | 1.36 |
| 4 401-1000 | 69 | 69 | 58% | 43% | 1.62 |
| 5 over 1000 | 23 | 23 | 52% | 52% | 2.04 |

### By kind

| group | units | reviewed | clean first pass | Important/Critical named | mean rounds |
|---|---|---|---|---|---|
| bug | 71 | 71 | 70% | 30% | 1.44 |
| cleanup | 3 | 3 | 33% | 67% | 1.67 |
| docs | 8 | 8 | 50% | 50% | 1.50 |
| gap | 35 | 35 | 49% | 57% | 2.06 |
| process | 2 | 2 | 0% | 100% | 2.50 |

### By tier

| group | units | reviewed | clean first pass | Important/Critical named | mean rounds |
|---|---|---|---|---|---|
| standard | 65 | 65 | 55% | 45% | 1.72 |
| strong | 54 | 54 | 67% | 37% | 1.56 |

### By repo

| group | units | reviewed | clean first pass | Important/Critical named | mean rounds |
|---|---|---|---|---|---|
| Althing | 2 | 2 | 100% | 0% | 1.00 |
| JarlSkill | 47 | 47 | 51% | 53% | 1.87 |
| Runes | 70 | 70 | 66% | 34% | 1.51 |


Finer splits (kind x band, tier x band) are in `bands.generated.md`.

## Commands run

- `ls`, `grep -E` over `log.md` and the issue headers to learn the line shapes (counts: 528 issues, 296 merge lines, 439 review lines, 14 round lines).
- `node review-by-size.mjs` (calls `git -C <repo> diff --numstat <sha>^1 <sha>` per merge sha, nothing else of git).
- `git -C <repo> cat-file -e 438d8f5` in Grain, Yggdrasil, Horde, Mimir, Althing, Runes, JarlSkill, `git -C Runes cat-file -p dac58df`, `git -C Runes diff --numstat <sha>^1 <sha>` for 010, `git -C Grain branch -a`: checks of the results above.

## Rows that could not be sized

176 merged issues, all in Grain (102), Yggdrasil (73) and one Grain+Yggdrasil: their merge shas (for example 438d8f5, 944e8fd, 3c4ec98) are in no sibling checkout (the Grain and Yggdrasil checkouts hold only `main`; the release branches of the 6.1.x patch work are gone). They are listed one by one in `bands.generated.md` under "Unsized". So the table covers only Runes (70), JarlSkill (47) and Althing (2) issues, 119 rows, of which none lacks a review verdict. The sample is therefore the Runes and Jarl work, not the whole loop.

## Cautions

- The record has few small units: only 5 rows are up to 100 lines, so the small bands say almost nothing. The loop's changes were large (median about 640 lines, with tests and catalogue cases).
- Issue 184 changes 22919 non-generated lines in 6 files (a large data file); treat it as an outlier.
- Size is confounded with kind (gap issues are large and find more) and with the repository (JarlSkill finds more than Runes).
