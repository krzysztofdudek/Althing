# 287 · Jarl: the record keeps the model of every worker and reviewer, and Jarl suggests an assignment from measured results per model and kind of task

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261011T1938-adtz
**Tags:** jarl, models
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1235 (the lease line) and :2140 (the verdict line) at 2c12aa3
**After:** 282, 248, 249, 245
**Branch:** jarl/287-models
**Merged:** ed40bc3e6245f247ff0ffa231314de880e468336 in ../../../JarlSkill
**CI:** pending

## What


The record does not know which model did a piece of work: a lease names a worker and a verdict a reviewer, nothing more (`jarl-lib.mjs:1235`, `:2140` at `2c12aa3`). So assignment cannot learn which model passes first time on which kind of task, which reviewer misses what, or whether a new model can take standard work, and assignment written into rules goes stale with every new model. Designed in `research/2026-10-11-jarl-model-calibration-and-field-notes/design.md`, part A (A.11 is this issue acceptance), and part B, notes 1, 2, 3, 5 and 6; built on the ruling `model-calibration-in-6-2-0`.

## Why


The record already holds who did the work, its verdicts, rounds, merges, reopens and follow-ups, and Jarl already derives metrics from them with honest denominators; the model is the one missing fact, and a model not recorded now can never be recovered. A verdict recorded by someone in a reviewer name passes today as the reviewer own (probe R1), so the second-hand case needs its own mark. If the release must close sooner, the views (`models`, the marks on `next`) can move to a patch; the recording (`--model`, `--relayed`, the tiers, the model lines, the notes and the in-flight model) stays.

## Acceptance


- *Record.* `set <ids> in-progress … --model <m>` writes **Model:** with the lease (removed with **Worker:**) and `· model <m>` in the lease line before `· worker` (Jarl 6.1.0 reads the worker as everything after `· worker `, so the order matters); `review … --model <m> [--relayed]` writes `· model <m>` and `· relayed` after the kind, and into 248 `## Reviews` entry; the value is stored as given, trimmed: the platform model id, with `@<effort>` where the platform has a reasoning-effort lever, so effort is part of the recorded value; the MCP fields come from the CLI table; `record.mjs` takes `model` and `relayed` as optional opts keys and `RECORD_API` stays `jarl-record/1`. A test reads every line written this way with the Jarl 6.1.0 library pinned as a fixture by 252: the worker is parsed, the self-approve refused, the verdict fresh, `done` passes (the probe F0 to F4).
- *Tiers and lines.* The built-in tiers are `light | standard | strong`, weakest first, with `standard` the default (named explicitly in the built-in profile); a profile tiers keep their declared order. `goal.md` lines `Model (<tier>): <model>[, <model>…]` are read like `Check:` lines; the first is the tier default; the tier order ranks the models; a model on no line is unplaced and ranks below every placed one as a reviewer.
- *Tier criteria and hint.* The skill gives the criteria (light: a check or test decides, scope written down, nothing that protects changes; standard: clear acceptance and a known place; strong: unknown cause including a flaky test, a design, a record format or contract, security or data integrity, anything that weakens a protection, a takeover after three rounds, finishing another worker uncommitted work). `new` without `--tier`, called from the command line, prints one line on stderr with the tier it used and the criteria in a few words. The third `round` takeover block says to raise the fresh worker one tier up or on another model than the one that failed.
- *Notes, never refusals,* in a loop with model lines: a lease or a verdict without `--model`; an approve whose model was leased on the issue; an approve ranked below the worker model. A loop without model lines sees none of them.
- *Notes on the command line only* (architect scope review of 2026-10-18, section 4, item 13): the stderr notes above and the tier note of `new` fire only for the CLI caller; a library caller such as Horde, through `record.mjs`, gets none, and its results do not change. Tested both ways.
- *Views.* `resume` in-flight rows and `status --json` `inFlight` carry the model or "model not recorded". `models [--by repo|tag] [--json]`, read-only, prints per model as worker and as reviewer the metrics of design A.5, per `Kind · Tier`, every count with its n, a share only from n ≥ 5, the words `fits`, `below`, `new` and `may clear <kind>`, and groups old work as `(not recorded) · tier <t>`. `next` and `resume` ready rows show the tier default model and `suggest <m>` by A.5 rule; `next --json` gains `model`.
- *Skill.* The section "Which model sits where" opens with the sentence: every spawn names its model explicitly and never inherits the coordinator model. Then the tier criteria, the model lines, how each platform maps them (the levers, families as examples, never names in a rule), effort as the second lever, the clearing-approve rule, how a new model enters, and the rule on relaying: resume the reviewer to record its own verdict, and use `review --relayed` only when it cannot be resumed.
- *Tests.* A loop with three models over two kinds gives the counts, shares and words, including n = 4 printing no share and no word; a 6.1.0-format loop reads as `(not recorded)` by tier; the notes fire only in a loop with model lines; through `JARL_LIVE_LOOP`, when set, the 6.2.0 record gives the retro tier rows (`materials/retro-output.txt`), or the difference is explained.
- Order: after 248 (it extends the verdict line), 249 (it extends `next` rows) and 245 (the verdict line is extended in that order); before 290, 253 and 250, which rewrites SKILL.md last. It writes nothing that raises the record format and does not need 247; its cross-version test uses the fixture of 252.

## Changelog
- Added: The record keeps which model did each piece of work (set --model, review --model and --relayed), with three tiers, model lines in goal.md, notes on the command line, and a read-only models view with suggestions on next and resume.

## Evidence

- **ran (history):** JARL_LIVE_LOOP=<copy of the 6.2.0 loop> node --test --test-name-pattern=JARL_LIVE tests/models.test.mjs (log cut at line 2062) · **saw:** strong 62 units, 36 clean, 34 changes, 17 rows before review; standard 4/3/1/0: the research's rows. The earlier 64/38 counted 2 units reviewed and then ended without closing; they are now listed apart (ended after a review without closing 2)
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge ed40bc3 · **saw:** 333 tests, 330 pass, 0 fail, 3 skipped; the model numbers on the loop's log cut at line 2062 equal the research's

