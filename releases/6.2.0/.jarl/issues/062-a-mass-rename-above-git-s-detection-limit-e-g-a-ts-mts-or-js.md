# 062 · A mass rename above git's detection limit (e.g. a .ts→.mts or .js→.ts migration of more than 1000 files) silently wipes out all conventions, and git's warning is thrown away

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-qzhk
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:257-280 walk() (v6.1.0; release/6.1.1 changes only the 'non-merge commits' log line): `git -C <dir> -c core.quotePath=false log --reverse --raw --no-abbrev --no-merges -M …` without `diff.renameLimit`, and `stdio: ['ignore','pipe','ignore']` (:278) throws stderr away; the comment :312 assumes -M 'never [gives] a separate D+A pair'
**Branch:** jarl/062-history-walk-fidelity
**Merged:** 1f1165c
**CI:** none

## What
Reproduction (git 2.50.1, node 24.11.1, no global diff.renameLimit; fresh clone of Grain v6.1.0; own generator): 1100 identical `@Injectable` / `extends BaseService` classes committed on 2024-01-01 and several months of edits; one commit on 2024-06-01 moves and renames all the files (.ts → .mts and src/ → lib/app/) and changes one import line in each; HEAD 4 days later. Default configuration: the move commit is 1100 A + 1100 D + 1 R; `grain status` → '0 conventions · 1101 files', 'up to date · history full', with no disclosure at all. A second clone of the same HEAD with only `git config diff.renameLimit 5000`: 1101 R and '11 conventions', among them 'types here are annotated with `@Injectable` — 100% of 1100 established · held since 2024-01'. Git writes the cause on stderr: 'warning: exhaustive rename detection was skipped due to too many files. … set your diff.renameLimit variable to at least 1100'. The same with an in-place .js → .ts migration (0 against 11) and with a directory move with import fixes when every file is `index.ts` (repeated base names; 0 against 11). HEAD 120 days after the move (past freshDays=14): the 11 conventions come back, but with 'held since 2024-06' instead of 2024-01 and '1100 new in 180d', so the dates and the history before the move stay wrong for good. Controls: N=900 (below the limit of 1000² pairs) → 901 R and the same conventions in both clones; a directory move with unique base names → 1101 R (base-name matching in git 2.50 runs before the limit). The patch `'-c','diff.renameLimit=0'` before `log` gives 1101 R and 11 conventions with the default configuration. Note: renameLimit=0 means no limit, and exhaustive detection grows as sources × targets, so a huge commit with vendored code can slow the walk down; a limit sized to the commit, or capturing git's warning and disclosing it in the freshness stamp, may be safer. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-30/R1-ext-1100-head4.log and R2-R7 in that directory (generator <the session scratchpad, since lost>/bughunt/grain/verify-30/gen-rename.mjs, driver run-case.sh, patch <the session scratchpad, since lost>/bughunt/grain/verify-30/grain-fix).

## Why
README:379 lists mass renames among the hostile repositories that degrade 'without a crash and with an honest stamp', yet the stamp says 'history full' when the history is cut at the move. The repository model depends on an unrelated git setting of the user: two developers on the same HEAD get different models, and for 14 days after the migration check has no convention of the moved files on which it could speak up.

## Acceptance
- The history walk detects renames regardless of the user's diff.renameLimit (`-c diff.renameLimit=` with 0 or a limit sized to the commit), or it captures git's warning and discloses in the freshness stamp that renames were not followed in that commit.
- The repo from the reproduction (1100 files, .ts → .mts): `grain status` with the default git configuration gives the same conventions as the clone with diff.renameLimit 5000, with 'held since 2024-01'.

## Changelog
- Fixed: moving or renaming more than about a thousand files in one commit (a .ts to .mts or .js to .ts migration) no longer wipes every convention of the moved files or restarts their history at the move, and the result no longer depends on your own git rename settings; a commit too large even for that is named in the status line.

## Evidence

docs: docs/reference.md: status row (line 26) or near the HIST_V row — the freshness line's 'history <mode>' may carry the note 'renames not followed in N commit(s) (<sha>): more moved files than git's rename limit of 10000 (needs M), so files moved there start their history again'; Grain sets git's rename limit itself (10000), the user's diff.renameLimit no longer matters

jarl: the diff.renameLimit=10000 limit for the history walk accepted (0 = no limit would risk a very long walk on a large vendor import); a commit above the limit is named in the freshness line
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2147, pass 2146, fail 0, skipped 1, merge 1f1165c

