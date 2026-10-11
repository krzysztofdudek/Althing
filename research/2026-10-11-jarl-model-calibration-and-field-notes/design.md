# Jarl: model calibration, and fourteen notes from a coordinator

Written 2026-10-11 by the architect of Jarl. Read-only towards the loop and every tool repository: nothing in the 6.2.0 loop, in JarlSkill, in Horde or in any other checkout was changed. Inputs: JarlSkill at `2c12aa3` (6.1.0, the driver `jarl-pinned-in-loop` pins): `skills/jarl/SKILL.md`, `scripts/jarl-lib.mjs`, `scripts/jarl.mjs`, `scripts/record.mjs`; Horde at `b1e7607` (its class ladder); Althing at `95a08e6` (`AGENTS.md`, `method/loops.md`, `method/environment.md`, `method/working-model.md`, the skills, `releases/6.2.0/briefs/`, the rails); the 6.2.0 loop read through `ws jarl` (issues 241, 244 to 253, 280, 287, the rulings `model-calibration-in-6-2-0` and `jarl-6-2-0-scope-revised`, the answer to a-018); the previous designs, [the repository-names design](../2026-10-08-jarl-field-report-and-repository-names/design.md) and the architecture review `releases/6.2.0/plans/jarl-architecture-6.2.0.md`, which this one builds on and contradicts nowhere; and the field input in [source.md](source.md). Line numbers are `JarlSkill/skills/jarl/scripts/jarl-lib.mjs` at `2c12aa3` unless another file is named. "Probe M1" to "probe F4" are runs of Jarl 6.1.0 on a scratch loop ([materials/probe.mjs](materials/probe.mjs), output in [materials/probe-output.txt](materials/probe-output.txt)); "the retro" is the proposed metrics computed on the real 6.2.0 record ([materials/retro.mjs](materials/retro.mjs), output in [materials/retro-output.txt](materials/retro-output.txt)).

## The short version

1. **The model is the one missing fact.** The record already holds who worked (the lease line names the worker, :1235), who reviewed and of what kind (:2140), every round, merge, reopen and follow-up, and Jarl already derives metrics from them with `n` and "no data" (:1968-2083). Calibration is those same facts with a model beside each name, grouped by model and by kind of task. Nothing else needs to be invented.
2. **What the record stores.** `set <ids> in-progress … --model <m>` and `review … --model <m>`: the model rides the two calls that already name the agent, filled by the one who spawns it, never by the agent's own guess. A value is the platform's model id, with `@<effort>` where the platform has a reasoning-effort lever (`claude-sonnet-5-5@high`). `review --relayed` marks a verdict someone else recorded in the reviewer's name. All of it is read by Jarl 6.1.0 without change (probes F0 to F4), so no format marker is needed, and `record.mjs` takes them as optional opts keys, so `jarl-record/1` holds.
3. **Tiers become three, and the loop says which model each runs on.** The built-in tiers become `light | standard | strong`, weakest first, with `standard` still the default; Althing's rules already speak of three classes and Horde already ranks `light | standard | heavy | max`. A loop declares its models in `goal.md`, one line per tier, `Model (strong): <model>, …`, like 246's `Check (<name>):` lines. The order of the tiers is the order of strength; a model on no line is new.
4. **A kind of task is `Kind · Tier`.** Both fields are always present and closed sets; Repo and Tags are slices on demand; size is left out, because Files is often empty.
5. **What Jarl derives**, in a new read-only `models` view and in two marks on `next`: per model as worker (units reviewed, clean first pass, changes, rounds, red after approve, handed over, ended before review, evidence rows before review, follow-ups) and as reviewer (verdicts, changes, approves checked by a later reviewer of another model, misses, relayed, clearing approves on the worker's own or a lower-ranked model). A share only from n ≥ 5; below that, counts and "no data". Per model and kind, `fits` or `below` the kind's own baseline. Suggestions only; Jarl never refuses or changes anything by model.
6. **The safeguards.** The approve that clears an issue comes from a model that is neither the worker's own nor ranked below it, until `models` shows, for that kind, at least five such approves checked by a stronger reviewer with no miss; a lighter first reviewer is always welcome. A breach is a note and a count, never a refusal.
7. **Checked against the field.** The metrics would have shown most of what the private deployment saw: the light model's clean share (with no ratio, at n 3), the mid model's missing evidence, the strongest model's red checks after merge, the light first reviewer's changes in 4 of 4. They would not have shown the "in progress" reports or the forbidden command form: those never reach a record, and the cure is the brief. On the existing 6.2.0 record, every metric but the model is computable today: 62 settled units on the strong tier, 58% clean on the first pass.
8. **Record now, derive later.** If 6.2.0 must close sooner, 287's views (`models`, the marks on `next`) can follow in a patch; its recording cannot, because a model not recorded now is lost for good.
9. **The fourteen notes:** ten amend 287 or 250, two are already done (7 and 12, with half of 5), two are rejected (10 and 13), and two new issues follow: `check` notes loop issue numbers in a branch's added lines (Jarl, 6.3.0), and Althing's briefs end with a checklist and record what calibration needs (Althing, now). Part A adds two more: `models` reads other loops (Jarl, 6.3.0), and Althing follows the model records before the 6.3.0 loop opens. The retro adds two findings for Althing's briefs: its workers record evidence rows before review in only 27% of units, and its merger records a red check as a note, never as a round.

## Part A. Model calibration

### A.1 What the owner asked, and what is already there

The ruling `model-calibration-in-6-2-0`, in short (its text is in the loop's `decisions.md`): the skill is for models of every provider; it may suggest, but the whole range stays open, because different models are good at different things; Jarl calibrates itself, checking what tasks a model can do and deciding whether it fits a category, because assignment by rule cannot keep up with a new model every few weeks; the record adds the model to what it already holds; Jarl derives, per model and kind of task, how often work passes without changes, and suggests without forbidding; a new model enters at small tasks with a stronger reviewer; the reviewer is never of the worker's own model and never weaker, until the data say otherwise; the hub's and Althing's rules stop naming models. He chose to put it into 6.2.0, beyond the scope `jarl-6-2-0-scope-revised` set, so it must stay small and mechanical.

Most of it is there already:

- **Who worked and who reviewed.** A lease line is `NNN → in-progress · <why> · branch <b> · worker <w>[ · worktree <p>]` (:1235-1236). A verdict line is `NNN review approve|changes · by <name> (fresh|coordinator|self) · <findings>` (:2140), its kind computed by `reviewerKind` (:1726-1732).
- **What happened to the work.** Rounds (`NNN round n`, :2224), merges and CI (:1379), moves in and out of done, evidence rows with their stamps (:1473), and Found by on every issue.
- **Metrics with honest denominators.** `loopMetrics` (:1968-2083) already derives rounds, reopenings, fresh reviews, red CI after merge and follow-ups, each with its `n` and, where the record holds nothing, `noData` with the reason instead of a zero. SKILL.md:343 says the principle: "they are as good as the record".
- **A ranked class ladder, in the family.** Horde ranks its work `light | standard | heavy | max`, deliberately host-neutral, and leaves the mapping of each class to a real model to the adopter's configuration, "never Horde's to guess" (Horde `skills/horde/scripts/_lib.mjs:726-741`); a ticket that keeps failing goes one rung up (`classUp`, :758).
- **Althing's rules have already stopped naming models.** Commit `9dcf782` rewrote `AGENTS.md` section 8, `method/working-model.md` and three skills: every spawn names its model, any provider; until Jarl's measurements say otherwise, the split follows what an undetected mistake costs (a light model where a script or a test decides, the strongest for research, design and unknown causes); a reviewer is never of the worker's own model and never weaker.

What is missing is one fact per lease and per verdict, the model, and a place that says which models a loop runs on. The rest of this part is how little else is needed.

### A.2 What the record stores

**The value.** One string per agent: the model id as the platform names it, plus `@<effort>` where the platform offers a reasoning-effort lever (`claude-opus-5-5@high`, `claude-haiku-5-5`). Effort is part of the value, not a second field, because the unit that is calibrated is the pair: the same model at two efforts is two workers with two records, and one field keeps them apart with no extra flag. Jarl writes the value as given, trimmed, and keeps no list of known models: a list in code is exactly what goes stale every few weeks, and any provider is allowed. One rule goes into the skill: record the resolved id, never a moving alias, because an alias such as `sonnet` points to a newer model after a release and would silently merge two models' records.

**Where it goes.**

- **The worker:** `set <ids> in-progress "<why>" --branch <b> --worker <name> --model <m>`. The lease gains a **Model:** field, written and removed with **Worker:** (`LEASE_FIELDS`, :30), and the lease's log line gains `· model <m>`, written **before** `· worker <w>`. The order matters: Jarl 6.1.0 reads the worker as everything after `· worker ` up to `· worktree ` or the end of the line (:1766). With the model after the worker, 6.1.0 reads the worker as `w6 · model …` and accepts that worker's own approve as fresh (probe F0: `006 review approve by w6 (fresh)`); with the model before it, 6.1.0 refuses the self-approve as it should (probe F1). 247 drops `· worktree` from the same line; the two changes do not touch each other.
- **The reviewer:** `review <ids> approve|changes --by <name> --model <m> [--relayed] "<findings>"`. The verdict line gains `· model <m>` and, when given, `· relayed`, both after the kind: `by rev-c (fresh) · model claude-opus-5-5 · relayed · …`. Jarl 6.1.0's `REVIEW_LINE` (:1750) reads the name and kind and ignores the rest, so the verdict counts exactly as before (probe F2: `set done` passes on it, and `report` counts it fresh). 248 moves the full findings into the issue's `## Reviews`; the model and the relay mark go into that entry too.
- **MCP and the CLI** are the same path: the MCP tools are generated from the CLI's command table (SKILL.md:58), so `model` and `relayed` become fields of `jarl_set` and `jarl_review` with no hand-written tool. `record.mjs` passes them as opts keys; a new optional key does not bump `RECORD_API` (`record.mjs:14-16`), so `jarl-record/1` holds and Horde re-vendors at the tag as planned.
- **Who fills it.** The one who spawns the agent knows the model it asked for; the agent often cannot name itself reliably. So the coordinator passes `--model` on the lease it writes before raising a worker, and writes the reviewer's model into the reviewer's brief, whose recording command carries it (`--model <the model you were raised on>`). In Althing, `ws brief` renders it as a placeholder.

**The relay mark.** A verdict recorded by anyone in a reviewer's name is indistinguishable today from the reviewer's own (probe R1: `review 004 approve --by reviewer-123` from any caller logs `(fresh)`). Jarl cannot authenticate a caller and should not try; `--by` is already an honest-system field. The rule comes first: a reviewer records its own verdict, and one that returned without recording it is resumed to record it. `--relayed` is for the one case that rule cannot cover, a reviewer that cannot be resumed (its session ended, an outside interruption): the coordinator records the verdict the reviewer gave, from its report, and says so. The verdict still counts as the reviewer's kind, because the reviewer did review; the mark makes the second-hand provenance true and makes the reviewer model's slip countable.

**Format.** None of this needs a new record format. A **Model:** header field and a Tier the built-in list does not know are read by Jarl 6.1.0 without a refusal (`parseIssue` reads every `**X:**` line, :544-565; probe F3 and F4: `show`, `status` and `list` run on such an issue). So 287 depends neither on 252's marker nor on 247.

**Considered and set aside.**

| Alternative | Why not |
|---|---|
| The model in the agent's name (`rev-412-opus`) | A convention parsed is a guess; names are identity for the self check and must not carry anything else |
| A declaration command (`agent <name> --model <m>`) | One more call to remember; the model rides two calls that are made anyway |
| The agent reports its own model | A model often cannot name itself reliably; the spawner knows what it asked for |
| A separate `--effort` flag | The calibrated unit is the pair; one value keeps it whole |
| A list of known models in Jarl | Stale within weeks; contradicts "any provider" |
| Back-filling models into old leases | A guess about the past; old work stays grouped by its tier (A.5) |

### A.3 Tiers, and which model each runs on

**Three built-in tiers.** `TIERS` (:19) becomes `light | standard | strong`, weakest first, so the list's order is the order of strength. The default stays `standard`: today the default is the list's first entry (`tierDefault`, :449), so the built-in profile must name it explicitly. A profile that declares its own tiers is unchanged and its declared order is read the same way. Why a third tier: Althing's section 8 already sends "a task a script or a test checks" to a light model while the record can only say `standard`, so the coordinator must remember a prose rule the issue cannot carry; every provider ships a small, a mid and a large model; and the field data show a real niche for the light one (exploratory testing, filing, first review, clear-scope work). Jarl 6.1.0 reads `Tier: light` without complaint (probe F3, F4).

**When `strong`, when `light`** (note 1). The skill gets the criteria, as a prior the measurements then refine:

- **light**: a check or a test decides whether the work is right, the scope is written down and nothing that protects changes (a mechanical edit, a filing from notes, a read-only inquiry, a first-pass review);
- **standard**: a clear acceptance and a known place in the code; ordinary code, tests and docs;
- **strong**: the cause is unknown (a "flaky" test included: twice in the field it was a real defect), a design, a record format or a contract, security or data integrity, anything that weakens or changes a protection, a takeover after three rounds, finishing another worker's uncommitted work.

`new` without `--tier` prints one line on stderr with the tier it used and these criteria in a few words. The takeover block that the third `round` prints (:2225-2228) adds: raise the fresh worker one tier up, or on another model than the one that failed, which the lease now names (Horde's `classUp` is the precedent).

**The loop's model lines.** A loop says which models it runs on, per tier, in `goal.md`:

```
Model (strong): claude-opus-5-5@high
Model (standard): claude-sonnet-5-5, <another provider's mid model>@medium
Model (light): claude-haiku-5-5
```

The first model on a line is the tier's default, the one a coordinator raises unless a suggestion says otherwise; the others are in the pool at that rank. The lines are read like `Check:` and `Coordinators:` (:1735-1745, :1916-1925), in the same plain, list-item or bold forms. `goal.md` is the right home for the same reason the previous design kept 246's Check lines there: who works on a tier is a rule of the loop, which is what the charter holds; and it is what every role reads first, so a brief no longer needs a model's name in it. In Althing that means a change to the lines is the owner's word or the mandate with a ratify item, which suits a choice that moves cost; 253's `goal --set` gives it a log line. A model on no line is **unplaced**: it may run (nothing is refused), and its rank is unknown, so as a reviewer it ranks below every placed model; until it has data it is also new (A.6). Without any lines, Jarl records and derives exactly the same, and only the rank-based notes and marks stay silent.

**On each platform** (notes 2 and 3). The skill describes the levers, not the names, and gives families as examples, never as a rule, because ids go stale:

- **Claude Code:** the Agent tool takes a `model` (an alias that resolves to an id: record the id) and an `effort`. Families by size: Haiku, Sonnet, Opus.
- **OpenAI's Codex:** a run takes a model and a reasoning effort. Families by size: the mini, the standard and the largest reasoning model.
- **Other hosts:** whatever the host's picker allows per agent. A host that cannot choose a model per spawn runs every agent on the session's model: record it all the same; the own-model note then fires on every approve, which is the truth about that loop, and the skill says what it means (a fresh instance is still a fresh reviewer; the correlation risk is real and visible).
- **Reasoning effort** is the second lever: for an issue that is hard but clear, a higher effort on the same model is a cheaper step than a higher tier, and the record measures the two separately because the value carries both.

### A.4 The kind of task

A kind of task is **`Kind · Tier`**: `bug·strong`, `docs·light`. Both fields are on every issue and are closed sets (seven kinds and three tiers built in, or the profile's), so the cells are few, comparable across loops, and filled. The Tier also carries the coordinator's judgement of difficulty, which is the best single signal of it the record has, so comparing models inside one tier compares like with like as far as the record can.

Left out of the class, and why:

- **Repo** measures the repository as much as the model (in the retro, Yggdrasil's units came back clean in 44% against Grain's 65%, under one model). It is a slice: `models --by repo`.
- **Tags** are free and many (66 in the 6.2.0 loop): as a class they would leave every cell empty. A slice: `models --by tag`.
- **Size** would come from Files, which is often empty (25 of 35 open issues declared none when the previous architect counted), and any bucket boundary would be invented.

A package mixes kinds; its class is its first issue's. Below n ≥ 5 in a cell, the view falls back once, to the model's numbers across all kinds at that tier, and says so.

### A.5 What Jarl derives, and where it shows

**The unit is a lease**: one worker on one branch, which is one issue or one package leased in one call. A package that fails counts once, not once per issue. A takeover by another worker starts a new unit.

**As a worker, per model and kind:**

| Metric | Read from |
|---|---|
| units reviewed (n) | units with at least one verdict on their issues |
| clean first pass | every issue of the unit closed under this worker with no `changes` verdict and no round |
| changes, rounds | `review changes` and `round` lines in the unit's window |
| red after approve | a round after an approve: the check found what the review did not (an outside red is 246's `--red`, not a round, and is not counted) |
| handed over | another worker leased an issue of the unit after a verdict (a takeover after rounds) |
| ended before review | the unit's lease ended with no verdict at all; kept out of the clean share's n and listed with the reason of the move that ended it, because an outside interruption is not a quality signal |
| evidence rows before review | each reviewed issue had a `--ran`/`--saw` row between the lease and its first verdict: the worker recorded its own proof |
| follow-ups | the existing metric's rule (Found by names the issue, within 7 days) |

**As a reviewer, per model and kind:** verdicts; changes given; approves **checked** (a later verdict on the same work by a reviewer of another model, with no round, restart or reopen between); **misses** (that later verdict was `changes`, or a round, a reopen or a follow-up came after the approve); relayed verdicts; and clearing approves on the worker's own model or on a lower-ranked one.

**Not derived.** Whether a finding was right (the field's "real Important point" is a judgement), the topic of a finding (security, evidence, layout: free text), cost (the record has no source for it), and every slip that never reaches the record: a worker that reports "in progress" before its check finishes, a forbidden command form, a step the coordinator quietly did for an agent. The view says so in its header, and the cure for those is the brief (part B, note 4), not a metric.

**Honest numbers.** Every count carries its n. A share is printed only from n ≥ 5; below, the counts and "no data". No confidence intervals: at n between 5 and 20 they would look precise and mislead, while the floor and the visible counts let the reader judge. Two biases are named in the view's header: a model is measured only on the work it was given, so compare inside a kind; and a worker's clean share is as strict as its reviewers, so compare inside one review practice.

**The verdict words.** Per model and kind, with n ≥ 5: **fits** when its clean share is at least the kind's baseline (all units of that kind in the loop), **below** otherwise. A model with n < 5 in every kind is **new**; one on no model line is **unplaced** (A.3). A reviewer model that ranks below the workers it reviews, or is their own model, and that has at least five approves in a kind which a reviewer able to clear (neither the worker's model nor ranked below it) checked afterwards, with no miss among them: **may clear <kind>**. That last phrase is "until the data say otherwise", written down.

**Why so simple a rule is enough.** A wrong suggestion costs a round, never a defect: the review and the repository's check still stand in front of every landing, and a model that fits by luck at n 5 drops below its baseline on its next failures, so the rule corrects itself.

**Where it shows.**

- **`models [--by repo|tag] [--json]`**, read-only, one new command and one new MCP tool (250 removes `handoff`'s, so the count stays): the table above, the words, the new models and the suggestions. Old work with no model is grouped `(not recorded) · tier <t>`.
- **`next`** and `resume`'s ready rows, only in a loop with model lines: the tier's default (`standard → claude-sonnet-5-5`), and `suggest <m>` when a lower-ranked model `fits` the issue's kind while the default does no better there, with its numbers; `next --json` gains `model: { default, suggested, basis }`. That is where the coordinator decides, so that is where the suggestion goes (agents skip what they have to ask for).
- **`resume`'s in-flight rows** and `status --json`'s `inFlight` carry the model, or "model not recorded" (note 5).
- **`review`** notes on stderr, in a loop with model lines: no `--model`; an approve whose model is a model leased on the issue; an approve whose model ranks below the worker's (an unplaced reviewer ranks below every placed model). `set in-progress` notes a lease with no `--model`. Notes only; a loop without model lines sees none of them.

### A.6 How a new model enters the pool

1. The coordinator raises it with an explicit `--model`. Jarl records it; it is unplaced and new.
2. It starts on small issues (light or standard, a clear acceptance), and the approve that clears its work comes from a placed model of at least the issue's tier; as an unplaced reviewer it ranks below every placed model, so the review note says so if anyone forgets.
3. As a reviewer it starts first, beside a placed reviewer that clears.
4. After five reviewed units in a kind, `models` says `fits` or `below`; after five checked approves with no miss, `may clear`. When it fits a kind at a tier, `models` suggests adding it to that tier's line. A person, or the jarl under a mandate with a ratify item, edits the line. Nothing moves by itself.

### A.7 The fixed safeguards

- Jarl never refuses, reroutes or changes anything by model. It records, derives and suggests ("What Jarl will not grow", SKILL.md:670-680).
- The done gate is untouched: the self-approve refusal and the fresh-review rule stand as they are.
- Every spawn names its model; a spawn that inherits the coordinator's model is a bug (note 5).
- The approve that clears an issue is never of the worker's own model and never ranked below it, until `may clear` says otherwise for that kind. A breach is a note and a count. A lighter or same-model reviewer that adds a `changes` before the clearing one is always welcome: in the field it was right in 4 of 4.
- Every number with its n; a share only from n ≥ 5; "no data" otherwise.
- Record the resolved model id, never a moving alias.

### A.8 Checked against the field

**The private deployment** (counts as it gave them, approximate where it said so; [source.md](source.md), section 2). The question is whether the proposed metrics would have shown what its coordinator saw by hand.

| What the field saw | The metric | Would it show? |
|---|---|---|
| Light model as worker: 3 of 5 packages to the end | units reviewed 3, ended before review 2 (an outside interruption, listed with its reason) | yes, without blaming the model for the interruption |
| Light worker: one clean package, one with a changes, one with two | clean first pass 1 of 3, changes 3 | yes, as counts: n 3 gives no share and no verdict word, which is the honest reading of three packages |
| Light worker: a new gap under each fix in the hardest package | changes, changes, approve on one unit | the shape shows; "a new gap each time" is a judgement |
| Light worker: complete evidence without reminders | evidence rows before review 3 of 3 | yes, if its evidence was recorded as rows |
| Light worker reported "in progress" three times | none | no: nothing reaches the record; the cure is the brief's checklist |
| Mid model as worker: about 13 of 15 first pass | clean first pass 13 of 15 (87%) | yes |
| Mid model: evidence descriptions missing three times | evidence rows before review 12 of 15 | yes, where the evidence is rows |
| Mid model: a reviewer that did not record its verdict, which the coordinator recorded in its name | relayed 1 | only with `--relayed`; today it reads as the reviewer's own (probe R1) |
| Mid model: a forbidden command form | none | no: a repository's rule, not the record |
| Strongest model: two red full checks after merge from tests it made unstable | red after approve 2 | yes, where a red is recorded as a round (Jarl's merger brief does, SKILL.md:520-523; Althing's does not, part B) |
| Strongest model on unknown causes: 2 of 2 clean | `bug·strong` clean 2 of 2 | as counts only (n 2) |
| Light first reviewer: changes in 4 of 4, the mid reviewer then approved | changes 4 of 4; approves checked 0; may clear: no data | yes, and the conclusion agrees with the field's: a good first reviewer, not yet one that clears alone |
| The mid model's clean share fell once a stricter first reviewer looked | clean share depends on the reviewers | yes, and the view's header names the bias |

**Retroactively, from a record written today.** Everything in A.5 except the model is computable from a Jarl 6.1.0 record per worker name and per reviewer name: units, clean first pass, changes, rounds, red after approve, handed over, ended before review, evidence rows before review, follow-ups; verdicts, changes, checked approves and misses. The model is not there, and neither are relayed verdicts or own-model approves. In the private deployment the names did not carry the model, so its record cannot be calibrated after the fact. In Althing's 6.2.0 loop a tier stood for a model by rule until `9dcf782`, so its record can be read by tier, as far as the rule was followed. The retro does that:

| Group | Units | Clean first pass | Changes | Rounds | Rows before review | Follow-ups |
|---|---|---|---|---|---|---|
| tier strong | 62 | 36 (58%) | 34 | 0 | 17 (27%) | 1 |
| tier standard | 4 | 3 (n < 5, no share) | 1 | 0 | 0 | 0 |

The reviewers, one model by rule: 247 verdicts, 40 changes, 207 approves, none checked by a later reviewer, no coordinator verdict.

It shows three things. The metrics compute on a real record of 2,062 log lines. This loop cannot compare models: 62 of its 66 settled units are on one tier and every issue had one reviewer, so calibration starts with the 6.3.0 loop, the first on Jarl 6.2.0. And two metrics read low or zero for reasons that are Althing's practice, not any model's: the merger records a red check as a free-text note and never as a round, so "red after approve" cannot be counted, and workers leave their red-to-green proof in their reports, so only 27% of units have evidence rows before review. Both are briefs to fix (part B).

### A.9 What the rules say instead of naming models

**Althing.** `9dcf782` already removed every model name from the rules. Once 287 lands, the next loop makes the prose concrete, and section 8 of `AGENTS.md` and `method/working-model.md` say, in substance: every spawn names its model explicitly and any provider is allowed; the open loop's `Model (<tier>):` lines say which model each tier runs on, and `ws jarl models` shows what each has done; the default split by what an undetected mistake costs is the prior a new loop starts from, written as tiers (`light`, `standard`, `strong`); the approve that clears an issue is never of the worker's own model and never ranked below it, until `models` says it may clear that kind; a lighter first reviewer is welcome. `ws brief` renders the model into each brief's recording command.

**The reviewer rule, made precise.** The owner's words are "the reviewer is never of the worker's own model and never weaker than the worker until the data say otherwise". Read as every reviewer, they would forbid the arrangement that worked best in the field, a light first reviewer whose `changes` was right 4 times in 4, followed by a mid reviewer who cleared. Read as the reviewer whose approve clears the issue, they keep the safeguard whole and allow the extra eyes. This design takes the second reading. It is an interpretation of his ruling, so it should be a ruling of the loop with a ratify item.

**Outside Althing**, the owner's own agent rules follow the same shape: an explicit model on every spawn, of any provider, never the session's default, and the loop's lines and Jarl's measurements decide the split.

### A.10 What was set aside

| Request or idea | Why not |
|---|---|
| Refusing or rerouting by model | The owner: suggest, never forbid; Jarl never blocks code |
| Cost per model | No source in the record; it would be typed by hand |
| Confidence intervals, statistical tests | False precision at n 5 to 20; the floor and the counts are honest |
| Classifying findings by topic | Free text; judgement, not record |
| Model calibration of the merger and the coordinator | Not asked; their slips show already as the merge note (part B, note 7) and the relay mark |
| `models` across loops | No loop holds model data before 6.3.0; a new issue for 6.3.0 (`--with <root>`, and the loop's own archives) |

### A.11 What 287 should say

**What.** The record does not know which model did a piece of work: a lease names a worker and a verdict a reviewer, nothing more (`jarl-lib.mjs:1235`, `:2140` at `2c12aa3`). So assignment cannot learn which model passes first time on which kind of task, which reviewer misses what, or whether a new model can take standard work, and assignment written into rules goes stale with every new model. Designed in `research/2026-10-11-jarl-model-calibration-and-field-notes/design.md`, part A; built on the ruling `model-calibration-in-6-2-0`.

**Why.** The record already holds who did the work, its verdicts, rounds, merges, reopens and follow-ups, and Jarl already derives metrics from them with honest denominators; the model is the one missing fact, and a model not recorded now can never be recovered.

**Acceptance.**

- *Record.* `set <ids> in-progress … --model <m>` writes **Model:** with the lease (removed with **Worker:**) and `· model <m>` in the lease line before `· worker`; `review … --model <m> [--relayed]` writes `· model <m>` and `· relayed` after the kind, and into 248's `## Reviews` entry; the value is stored as given, trimmed (the platform's model id, `@<effort>` where the platform has that lever); the MCP fields come from the CLI table; `record.mjs` takes `model` and `relayed` as optional opts keys and `RECORD_API` stays `jarl-record/1`. A test reads every line written this way with Jarl 6.1.0's library: the worker is parsed, the self-approve refused, the verdict fresh, `done` passes (the probe's F0 to F4).
- *Tiers and lines.* The built-in tiers are `light | standard | strong`, weakest first, with `standard` the default; a profile's tiers keep their declared order. `goal.md` lines `Model (<tier>): <model>[, <model>…]` are read like `Check:` lines; the first is the tier's default; the tier order ranks the models; a model on no line is unplaced and ranks below every placed one as a reviewer.
- *Notes, never refusals,* in a loop with model lines: a lease or a verdict without `--model`; an approve whose model was leased on the issue; an approve ranked below the worker's model. `new` without `--tier` prints the tier and the criteria in one line. The third `round`'s takeover block says to raise the fresh worker one tier up or on another model.
- *Views.* `resume`'s in-flight rows and `status --json`'s `inFlight` carry the model or "model not recorded". `models [--by repo|tag] [--json]`, read-only, prints per model as worker and as reviewer the metrics of design A.5, per `Kind · Tier`, every count with its n, a share only from n ≥ 5, the words `fits`, `below`, `new` and `may clear <kind>`, and groups old work as `(not recorded) · tier <t>`. `next` and `resume`'s ready rows show the tier's default model and `suggest <m>` by A.5's rule; `next --json` gains `model`.
- *Skill.* "Which model sits where" opens with: every spawn names its model explicitly and never inherits the coordinator's. Then the tier criteria, the model lines, how each platform maps them (families as examples, never names in a rule), effort as the second lever, the clearing-approve rule, how a new model enters, and the rule on relaying (resume the reviewer; `--relayed` only when it cannot be).
- *Tests.* A loop with three models over two kinds gives the counts, shares and words, including n = 4 printing no share and no word; a 6.1.0-format loop reads as `(not recorded)` by tier; the notes fire only in a loop with model lines; through `JARL_LIVE_LOOP`, when set, the 6.2.0 record gives the retro's tier rows (`materials/retro-output.txt`), or the difference is explained.
- **After:** 249 (it extends `next`'s rows) and 248 (it extends the verdict line); before 250.

### A.12 The order, and what to keep if the release must close sooner

287 fits after 249 and 248 in the order `jarl-6-2-0-scope-revised` set, and before 250, which rewrites SKILL.md last. It needs neither 252 nor 247 (probes F0 to F4). If the release must close sooner, its views (`models`, the marks on `next`) can move to a patch; its recording (`--model`, `--relayed`, the tiers, the model lines, the notes and the in-flight model) stays, because a view can be derived later from what was recorded, and a model that was not recorded is gone.

## Part B. The fourteen notes

Each note checked against JarlSkill at `2c12aa3`, Althing's templates in `releases/6.2.0/briefs/` and its skills, and the open issues.

| # | Note | What the code and the templates say | Decision |
|---|---|---|---|
| 1 | No criteria for `strong`; a hint at `new` | Tier is "the tier of model the worker is raised on" (SKILL.md:134), with no criteria anywhere | AMEND 287: the criteria for three tiers (A.3), and `new` without `--tier` prints them |
| 2 | No example map of tiers to models | None in SKILL.md; Horde names families in a comment (`_lib.mjs:731-734`) | AMEND 287: levers per platform and families as examples; the loop's model lines are the map |
| 3 | Reasoning effort not mentioned | Not in SKILL.md | AMEND 287: `@<effort>` in the recorded value, effort as the second lever |
| 4 | Weaker models drop formal steps: a closing checklist, checked before merging | Jarl's worker brief never says to record evidence rows; it says to report them (SKILL.md:442-453). The done gate already refuses without a row and a live fresh approve, and `queue` lists only approved branches, but the merger's own check row satisfies the gate, so a worker's missing proof passes unseen. Althing's worker briefs also ask for evidence in the report, not as rows (retro: 27% of units) | AMEND 250: the worker brief ends with a checklist for every tier (committed; red and green recorded as `--ran`/`--saw` rows; waited for every check the brief names; changelog fragment; report), and the reviewer reads the rows: none from the worker is an Important finding. NEW Althing: the same in its briefs |
| 5 | "Never inherit" buried in step 4; show each agent's tier | The sentence is at SKILL.md:373; "Say which tier is running in every report" exists (SKILL.md:658); `resume`'s in-flight rows show branch, worker and since only (:3030) | Half DONE; AMEND 287: the sentence opens "Which model sits where", and in-flight rows carry the model |
| 6 | A verdict recorded for a reviewer in its name passes as fresh | Confirmed (probe R1): any name that is not a worker or a coordinator name is fresh (:1726-1732). Jarl's own reviewer brief contributes: it ends "Return: verdict … and the findings" (SKILL.md:475) and never tells the reviewer to record it | AMEND 287: `review --relayed`, counted per reviewer model; the rule: resume the reviewer to record its own verdict, relay only when it cannot be resumed |
| 7 | A package merged before its fresh review; `merged` could warn | Already so: `merged --sha` notes "MERGED WITHOUT A FRESH REVIEW" when the issue holds no live fresh approve, including one a round spent (:1361-1371; probes M1, M2, and M3 with no note after a live approve). A merge git made but never recorded stays invisible; the merger's brief records it in the same step (SKILL.md:524) | DONE |
| 8 | Issue numbers leak into code, docs and the graph | Nothing in a brief forbids it (SKILL.md:425-457); Althing's Yggdrasil brief forbids it only for `yg log` reasons; `check` reads changed file names, never their lines (:2280) | AMEND 250: the worker brief says no loop issue number in code, comments, tests, docs or graph entries, the reason in the worker's own words, the number only in the commit subject. NEW Jarl 6.3.0: `check` lists loop issue numbers on a branch's added lines, as a note. NEW Althing: its briefs. The commit subject keeps the number even outside git: the shared worker block requires it (`… (issue NNN)`), and it serves review and revert while the loop runs |
| 9 | `handoff` still suggested in places; unify on `resume` | The command row (SKILL.md:89), the MCP tool `jarl_handoff` (jarl.mjs:369), the archive row and two JSON keys keep it alive; the main path already says there is nothing to write (SKILL.md:389-398) | AMEND 250: the main path names only `resume`; the `handoff` tool leaves the MCP list; `handoff read` stays in the CLI until the next major |
| 10 | `ask --defer` and a night queue | Unchanged since the previous design: asks are that queue (`ratify` blocks nothing, `ask --kind stuck --issue` holds one issue, `resume` lists both); 244 answers several ratify ids at once | REJECT: the note adds a wish for a view, and `resume` is it; 250 already documents working with an owner who is rarely there |
| 11 | Standard-tier reviewers sometimes do not call `review` | The cause is in the template: Jarl's reviewer brief asks the reviewer to return the verdict, not to record it (SKILL.md:475); Althing's says "record it yourself" in its middle (`reviewer.md`, The verdict) | AMEND 250: the brief's last step is the recording call with its fields filled (`by`, `model`), and the answer quotes the line `review` printed, which the coordinator can check at a glance; capitals add nothing a last, concrete step does not. NEW Althing: the same in `reviewer.md` |
| 12 | No state "merged, gate red" | 246 records it as `merged --red <id>`, the cause tracked by its own issue, and an outside red is not a round (growth admitted in a-018) | DONE (246) |
| 13 | "Write the evidence file" read as "check the file" | No brief of Jarl's or Althing's asks for an evidence file; Jarl's evidence is rows | REJECT: the project's own template; the lesson, name the action, is in note 4's checklist |
| 14 | A fix that switched production mode off in tests cost a round | The reviewer answers three questions (SKILL.md:472-475); `check` counts removed tests and assertions (:2308-2313), not weakened behaviour | AMEND 250: a fourth question for every reviewer, and above all after a round: did the change, or the fix, weaken anything that worked or protected before (a mode, a default, a guard, a test)? NEW Althing: the same in `reviewer.md` |

**Two findings of the retro, for Althing's briefs.** Althing's merger brief records a red check after a merge as a free-text note (`merger.md`, One merge, step 7), so the 6.2.0 record holds no round at all in 2,062 lines, and "red after approve" cannot be counted for any model. Once 246 lands, a red whose cause is in the branch is a `jarl round` (it charges the worker, which is what calibration needs), and an outside one is `merged --red`. And Althing's worker briefs ask for the red-to-green proof in the report, which the session that reads it loses; recorded as rows, it is on the record for the reviewer and for the metrics. Both go into the new Althing issue below.

## Proposed changes

| Change | Repo | Release |
|---|---|---|
| AMEND 287: What, Why and Acceptance as in A.11 (recording, three tiers, model lines, notes, `models`, the marks on `next`, the skill's section; notes 1, 2, 3, 5 and 6); After 249 and 248 | JarlSkill | 6.2.0 (the owner's word, ruling `model-calibration-in-6-2-0`); if the release must close sooner, the views move to a patch and the recording stays |
| AMEND 250: the worker brief ends with a checklist for every tier, and forbids loop issue numbers outside the commit subject (notes 4, 8); the reviewer brief's last step records the verdict with its fields and quotes the printed line, and asks a fourth question, whether the change or the fix weakened anything that worked (notes 11, 14); a worker's missing rows are an Important finding (note 4); the main path names only `resume`, and the `handoff` tool leaves the MCP list (note 9) | JarlSkill | 6.2.0 |
| NEW: `check` lists loop issue numbers on a branch's added lines (`issue NNN`, `#NNN` for an id of this loop), as a note that does not change `ok` | JarlSkill | 6.3.0 |
| NEW: `models` reads other loops, `--with <root>` and the loop's own archives, so calibration outlives a release loop | JarlSkill | 6.3.0 |
| NEW: Althing's briefs end with a checklist: a worker records red and green as `jarl evidence --ran/--saw` rows, waits for every check it was told to run, and names no loop issue number outside the commit subject; the reviewer answers a fourth question (did the change or the fix weaken anything that worked) and ends by recording its verdict and quoting the line; the merger records a red whose cause is in the branch as `jarl round`, and, once 246 lands, an outside one as `merged --red` | Althing | now (the 6.2.0 loop's briefs) |
| NEW: Althing follows Jarl's model records before the 6.3.0 loop opens: `ws brief` renders the model into the lease and the recording commands; the 6.3.0 goal declares `Model (<tier>):` lines; `AGENTS.md` section 8, `method/working-model.md` and the skill for directing a release loop point to the lines and `ws jarl models` and write the tiers as `light`, `standard`, `strong` | Althing | before the 6.3.0 loop opens |
| RULING with a ratify item: the reviewer rule applies to the approve that clears an issue; a lighter or same-model reviewer may add a `changes` first; `may clear` in `models` is what "until the data say otherwise" means | the loop | now |
| DONE: note 7 (the merge note, :1361-1371), note 12 (246's `--red`), half of note 5 (SKILL.md:658) | | |
| REJECT: note 10, `ask --defer` | | asks are the queue and `resume` is the view |
| REJECT: note 13, "create the evidence file" | | in no template of Jarl's or Althing's |
| REJECT: refusal or rerouting by model, cost per model, confidence intervals, topic classification of findings, back-filled models, a model list in code (A.2, A.10) | | |

## Limits of this pass

- No critics were raised: the session that commissioned this study asked the architect to avoid spawning agents. The first independent reading of part A is the fresh reviewer of 287; the research method's three critiques (fidelity, technical soundness, maintenance cost) remain open and can be run on this file before 287 starts.
- The field counts are the deployment's own, partly from its coordinator's memory; the table in A.8 checks whether the metrics would have shown them, not the counts themselves.
- The retro's grouping by tier stands for a model only as far as Althing's former rule was followed; the model was never recorded.
- The thresholds (n ≥ 5, "at least the baseline", "no miss in five checked approves") are chosen to be plain and conservative, not derived. They are constants in one place, and the first loops that run on them will show whether they are too strict.
- Platform details beyond Claude Code (whose Agent tool's `model` and `effort` the architect could read) are described at the level of the lever, not the flag.
