# Jarl 6.2.0: the vision, the eight new issues, and what the loop does not see

Written 2026-10-05 by the architect of Jarl at the owner's request. Read-only: nothing in this loop, in JarlSkill or in Horde was changed. Inputs: JarlSkill at `c9c36cf` (6.1.0): `skills/jarl/SKILL.md`, `scripts/jarl-lib.mjs`, `scripts/record.mjs`, `scripts/jarl.mjs`, the tests, README, CHANGELOG, CLAUDE.md. Horde at `0f6ccba`: `loop.mjs`, `ask.mjs`, `jarl-profile.json`, `vendor/jarl.pin.json`. The family layer: `VISION.md`, the family canon, the releasing-the-family skill. This loop: `status --by repo`, `resume`, `next`, `goal.md`, `decisions.md`, `asks.md`, `log.md`, the issue files, `plans/plan-6.2.0.md` and the three worker briefs. The 6.1.0 loop for comparison. The field notes of two jarls. Every claim below was checked against the code or the record; where I ran something that writes, it ran on a scratch loop in the session's scratchpad. Line numbers are `jarl-lib.mjs` unless another file is named.

## The short version

1. Jarl's product is the record: proof, testimony and the owner's intent, good enough to be the crew's only memory. The field confirms it. Both jarls leaned on rulings, evidence rows, fresh-review accounting and After plus Files, and both skipped the scheduling views. 6.2.0 should be spent on the integrity and completeness of the record, not on more views.
2. Three of the eight issues are one bug class. Wherever Jarl writes multi-line text into a line-oriented file it keeps the first line: a review's findings in `log.md` (248), a question's options in `asks.md` and in the ruling (the defect under 244), the answer and the ruling copied into an issue's evidence. Fix the class once.
3. `log.md` is not a journal. It is the done gate's event store, and a hand edit changes the gate silently. The jarl's strike of a stray verdict (log.md:1564) removed that verdict from the gate and the metrics, the opposite of what 245 says. The record needs a read-only integrity check (`verify`) before it needs entry ids.
4. 246 and 247 are two halves of one missing concept: the loop's repositories as a first-class entity (name, path, base branch, check, fingerprint), declared once and referenced by name. 241 sits at its edge.
5. The release loop runs the Jarl it is about to change: its CLI comes from the `../JarlSkill` checkout, its MCP tools from the installed 6.1.0 plugin. Any format change in 6.2.0 needs a loop format marker, and this loop should stay on Jarl 6.1.0 until it closes.
6. Recommended for 6.2.0: 248 widened to the whole one-line class, 241 reshaped onto git's own worktree state, 249 reshaped (ready only by default, held by an open question, missing Files flagged), 245 narrowed (no global ids, retraction only ever stricter), a new `verify`, a loop format marker, a small ratify shape for mandate decisions, and 250 widened to a restructure of SKILL.md, done last. The repositories issue (246 with the core of 247) and 244's structured options also fit 6.2.0 if the owner holds to `release-6-2-0`. They are the first to slip if the release must close sooner. Wait: relink discovery, per-file existence checks, `jarl-record/2`, carrying work across loops. Drop: 245's global entry ids.

## 1. Jarl's vision, and where tool, docs and use part ways

### The vision in my words

Jarl turns one agent into the director of a crew and leaves behind a record good enough to be that crew's only memory. Everything seen becomes an issue. Each issue is leased to one worker in its own worktree. Work counts only with proof that can be re-run (`--ran`/`--saw`), and code counts only with the word of a reviewer who neither wrote it nor runs the loop. Whatever the owner decides becomes a ruling that outlives every session. A new session rebuilds the whole state from the record (`resume`), so nothing depends on a handoff or on anyone's context. Jarl records, derives and displays. Its one refusal is at the level of the record: `done` without proof or without a fresh approve. It never lands or blocks code; that is the repository's check, or Horde's gate (SKILL.md:670-680).

### What the code says the centre is

The code agrees with that, more sharply than the docs do. Its heart is four things: the done gate (`doneRefusal` :1262, `gateState` :1822), the journal parser the gate reads (`journalById` :1704), the lock that lets dozens of writers share one record (`withLock` :137), and the parse and render of an issue file. Every view is a derivation over those. `record.mjs` freezes that record into a contract for composers. In code terms Jarl is an event-sourced issue record whose one hard invariant is the done gate. The scheduling views (`next`, `queue`, `tips`, `branches`) are conveniences on top.

### Three products in one skill

1. **The branch loop.** This is the README's story: a feature branch, `.jarl/` out of git, workers, a close that deletes the directory, "nothing ships, nothing lingers".
2. **The standing release loop.** Permanent, committed, directing code in other repositories through **Repo:**, five repositories at once, a dev container, 250 to 532 issues, a renaming in mid-flight. All the real heavy use has gone here.
3. **The record library and profiles** for a composer, Horde, which runs its missions on Jarl's record.

Most of 6.1.0's growth served 2 and 3. The README and the opening of SKILL.md still tell 1.

### What the field says the value is

The second jarl ranked rulings that carry the owner's intent across agents first. It also credited ratify items with catching a reeve's misreading, `--after` with `--files` with preventing collisions, and the fresh-review accounting as trusted. The release loop agrees. Its done work is `fresh 191 · coordinator 0 · self 0`. `resume` carried it through a pause and a new login (rulings `finish-open-work`, `resume-after-finishing`). Twenty-six rulings are shown at every boot. Dozens of concurrent writers lost no row, and `resume` assembles the 250-issue, 1,874-line loop in 0.7 s. None of the value either jarl cited is a scheduling view.

### Where the tool, the docs and real use diverge

1. **The question kinds are labels only.** SKILL.md:87 says `stop` "halts everything" and `stuck` "blocks one issue". `cmdNext` (:1537-1567) never reads `asks.md`. On a scratch loop, an issue with an open `stuck` ask and a loop with an open `stop` both kept every issue in the ready list.
2. **"One tool moves it" holds for statuses, not for the record.** The claim is at SKILL.md:43. But `goal.md`, the file every role reads first, has no command. The renaming from 6.1.1 to 6.2.0 rewrote the goal by hand and left no line in the loop's log (14:07 `decided release-6-2-0`, then 14:08 `filed 224`); only git commit `6f405ea` knows the loop moved. Titles have no command either: 247 was retitled by hand, and its file still carries the old slug. Horde edits rulings and ticket files directly through the library's own `withLock`/`writeAtomic` (Horde `ask.mjs:212` `prefixRuling`, `:233` `nameAnswerer`, `loop.mjs:165` `editTicket`), because `record.mjs`'s `answer` takes no `by` (record.mjs:140).
3. **The journal is the gate's store, not a diary.** SKILL.md:41 calls it "the journal, append-only, one dated line per event". The gate reads restarts, reopens, rounds, verdicts and evidence-row stamps from it and from nowhere else (section 3.2).
4. **The owner's questions bypass `ask`.** In four days the loop filed one ask (`a-001`) against twelve owner rulings. Five of those rulings carry a hand-written "(etykieta opcji)" note: the jarl is telling the reader that the text is a host option's label, not the owner's words. Decision D6 (the `promises` package version, "needs his word") is open only inside the prose of ruling `plan-6-2-0` and the plan's section 12, while `status` prints `questions 0`. The family's own releasing skill tells the jarl to put an open topic to the owner "in plain words … Then stop" (its line 69), with no word about recording it.
5. **Mandate decisions bypass ratify.** SKILL.md:563-569 says a choice made under a mandate is filed as `ask --kind ratify`. Under `autonomy-quality` the jarl decided D2 to D12 of the plan (D6 was left to the owner). They live in one prose ruling. Four earlier rulings say "do weta Krzysztofa" with nothing tracking the veto. The loop has no ratify item.
6. **The trust banner is a declaration, not a fact.** `checkState` (:1926) says `landsOn: check` as soon as `goal.md` has any `Check:` line. This loop has none and says it "lands on testimony alone", while the merger's rows record the repository's hook on merge commits (issue 193: "git commit (merge of jarl/063-local-writes …; pre-commit runs scripts/repo-check.sh)"). One hand-added line would flip the banner for 250 issues with no merge proving anything.
7. **Testimony keeps one line.** `cmdReview` logs `findings.split('\n')[0]` (:2140) and writes nothing on the issue. Reviewers adapted by writing single enormous lines: the 248 verdict lines in this log have a median of 719 characters and a maximum of 2,068.
8. **Files is the only collision guard, and empty means "touches nothing".** Of the 35 open issues, 25 declare no Files. `next` offers such an issue as if it touched nothing (:1559). `queue` treats a branch with no files as riding alone (SKILL.md:194). All eight Jarl issues are offered at once, though every one of them edits `jarl-lib.mjs` or SKILL.md.
9. **The docs are shaped for reference, not for the moment.** SKILL.md is 104.6 KB in 684 lines. 57% of it (lines 36-352: the command table, profiles, JSON shapes, metrics) comes before "The loop" begins at line 353. "The record as a library" sits as a subsection of "Talking to the user" (SKILL.md:660-668). The README says the jarl "runs the test suite itself", while the skill gives that job to the merger.

## 2. The eight issues

| Issue | Against the vision | Shape | Recommendation |
|---|---|---|---|
| 241 container worktrees "gone" | inside (a wrong view, plus a latent wrong "delete") | right goal, weak signal | ship, reshaped onto git's own worktree state (plan J1) |
| 244 options in the owner's question | inside (record of intent) | half of it is a defect, half a feature | defect inside the one-line package; options at CLI and MCP; library later |
| 245 retraction, empty findings | inside, more urgent than stated | global ids too heavy; asymmetry missing | ship narrowed: retraction by selector, only ever stricter; `body --title` |
| 246 check per repository | inside; fixes a hollow banner | per-merge fact is the core | ship inside the repositories issue; bind the check row to the merge |
| 247 repository paths | inside | right direction, five things in one | ship normalization, names, stored fingerprints; fold the record check into `verify`; defer relink discovery |
| 248 review keeps first line | inside; data loss | right | ship first, widened to the class; full text in `## Reviews`, not Evidence |
| 249 `next` mixes groups | inside | right, incomplete | ready only by default; groups with `--all`; held by an open question; flag missing Files |
| 250 docs | inside | right, too small | widen to a restructure, done last; route briefs to rulings; fix the family skill |

None of the eight crosses "What Jarl will not grow". Two could drift toward it and need a sentence in their acceptance: retraction (245) must not become a way to override a reviewer, and per-repository checks (246) must never make `done` wait for a check row.

### 241 · `status`, `resume` and `branches` call a container worktree gone

**What it asks.** A lease whose worktree path is missing, whose parent is missing too, while git still lists the worktree, should read "not visible from this machine". That is information, not stale, and such a branch never gets DONE → delete.

**Against the vision.** Squarely inside: a view that is wrong today. It is more than a cosmetic false STALE. `branchesIn` sets `dirty` to null for a worktree it cannot see (:2459-2460), and `doneMark` turns a null dirty count into `delete` (:2436). So a merged package whose container worktree still holds uncommitted work is offered for deletion.

**Shape.** The heuristic (the parent directory is missing) is the weaker signal, because git already knows. From the host, `git worktree list --porcelain` in Yggdrasil prints `prunable gitdir file points to non-existent location` for all three live container worktrees, and for 6.1.0's `514-pkg`. For a worktree created with `--lock --reason <r>` the same command prints `locked <r>`. Reshape:

- `locked` reads "elsewhere: <reason>". This is certain.
- `prunable` with a missing parent reads "not visible from here". The state is unknown: never stale, never delete.
- A path missing under an existing parent reads gone, as today.
- An unknown dirty count is never clean.

Keep the brief change (`git worktree add --lock --reason devcontainer`). It is also the only thing standing between a host `git worktree prune` and the container's live bookkeeping.

**Neighbours.** `jarl-lib.mjs` only. No RECORD_API change. Horde re-vendors as the plan already says. No MCP change, nothing to migrate.

**Recommendation.** Ship, reshaped. It is the plan's J1.

### 244 · the owner's question records the options and how it was answered

**What it asks.** A repeatable `ask --option "<label>: <effect>"` and `--recommend`. `answer --option <label>` or free text. The ruling quotes the options and marks the choice, or quotes the owner's own words, never one passing for the other. Plus a rule in SKILL.md: every owner question goes through `ask`, then the host's window, then `answer`.

**Against the vision.** Inside: it is the record of intent, which the second jarl named as Jarl's main value. But half its premise is a defect, not a gap. SKILL.md:559 already tells the jarl to ask with "the options with trade-offs, your recommendation", and `ask` silently throws them away when they sit on separate lines:

- `asks.md` holds one line per question (`ASK_RE` :2731).
- `cmdAsk` writes the text raw (:2761), so lines two onward become stray lines nothing parses.
- The ruling quotes only what `loadAsks` parsed, the first line (:2798).

On a scratch loop, `ask "Line one?⏎(a) option A⏎(b) option B"` followed by `answer a-001 "b"` produced the ruling `**Question:** Line one? **Answer:** b`. A jarl that did everything the skill says would still have recorded the meaningless "chose b" this issue complains about.

**Shape.** Fix the defect first: a question keeps every line, and the ruling quotes the whole question. Then the structured part, which is still worth having for the honest label-or-own-words distinction the jarl wrote by hand five times. Make `ask` print the question in the form the host's question window takes (options with effects, the recommended one marked). Then asking through Jarl first costs nothing extra, which is the only way the record path wins against the host UI.

**Neighbours.**
- RECORD_API: `ask` gains optional opts keys, which needs no RECORD_API bump. `answer` in `record.mjs` takes no opts at all. It is frozen as `(root, id, text)` in `tests/record-contract.test.mjs:63`, so carrying `--option` through the library, or the CLI's existing `--by`, re-shapes the export and forces `jarl-record/2`.
- Horde: Horde works around the missing `by` today by rewriting the ruling's **By:** line and prefixing fields into the ruling's text. That breaks the rule "a ruling's text is never edited" (SKILL.md:39) through the library's own primitives.
- Profiles: none.
- MCP: three fields.
- Old loops: old one-line asks read as before. A multi-line question needs a block form in `asks.md`, which an older Jarl reads as its first line only. That is benign.

**Recommendation.** Ship the defect inside the one-line package below. Ship the options in 6.2.0 at the CLI and MCP only. Keep `record.mjs` on `jarl-record/1`, and plan `jarl-record/2` as one deliberate contract step later, not as a side effect: an `answer` with `by`, `option` and composer fields, so Horde can stop editing rulings.

### 245 · retracting a wrong entry by an appended entry, and refusing empty findings

**What it asks.** A stable id for every verdict and every evidence row. A `retract <entry-id> --by <who> "<why>"` after which retracted entries stop counting. A `review` that refuses findings with no substance. Its Evidence adds a missing command to change a title.

**Against the vision.** Inside, and more urgent than the issue says. Its Why states that a hand edit "does not change the views" (translated from Polish). It does, silently. The jarl struck the stray verdict as `- 2026-10-03 13:12 · ~~006 review approve · by rev-ygg-006 (fresh) · x~~ — …` (log.md:1564). `journalById` keys a line with `^(?:filed )?(\d{3})\b` (:1711), which no longer matches after `~~`. The verdict vanished from the done gate, from `reviews` and from the metrics, and nothing in any view says a verdict was removed. The record's integrity currently rests on everyone's typing.

**Shape.** Global entry ids are the expensive route to retraction. They change either the log-line format or the evidence-row format. `record.mjs`'s `evidenceRows` hands that row format to composers as contract. And they need a migration of 1,874-line logs. Retraction by selector costs none of that:

- `review <id> retract --by <who> "<why>"` retracts the latest live approve on that issue (or `--of <reviewer>`).
- `evidence <id> --retract <n> "<why>"` retracts the n-th `--ran/--saw` row as `show` numbers it. Rows are append-only on the issue, so the ordinal is stable.

Both append a log line, and nothing is deleted.

The issue does not state one rule, and it must: **retraction may only make the gate stricter.** `gateState` counts only approves logged after the last `changes` (:1858-1859). So retracting a fresh reviewer's `changes` would revive the approve before it and close an issue with an Important finding unanswered. A `changes` is answered by a new approve, never retracted. Wanting it gone is an `ask --kind lower`.

Two smaller parts:

- **The title.** `body <id> --title "<new>"`, logged with the old title, the file name left alone. The id, not the slug, is the identity.
- **The findings floor.** Yes, narrowly: letters and at least a few words, with a test on `x`.

**Neighbours.** Every new thing is an opts key or a verdict value, so there is no RECORD_API bump. Horde never calls `review`. MCP gains two fields. Old loops have nothing to migrate. The struck line here stays as written, and `verify` names it.

**Recommendation.** Ship narrowed. Drop the global ids.

### 246 · `Check:` lines per repository, and whether merges carry that check's row

**What it asks.** `Check (<repo>): <cmd>`. `evidence --check <repo>` marks a row as that repository's gate run. `status --by repo` and `report` show, per repository, `landsOn`, and per merged issue whether such a row follows the merge. `init` says once that a loop with no `Check:` lands on testimony.

**Against the vision.** Inside, and it repairs a hollow spot in the trust model (divergence 6). The per-merge fact is what the family's trust sentence actually needs: where the repository has a check, the check decided this landing.

**Shape.** The per-merge fact is the core, and per-repository lines are its configuration. A free `--check` tag on any evidence row is weaker than binding the row to the merge it proves. Let the merger record the merge and its check in one call: `merged <ids> --sha <sha> --ran "<check>" --saw "<summary>"` writes the usual evidence row and ties it to that sha. "This merge passed its repository's check" is then derived, not asserted twice. The issue already holds the line, and it must stay in the acceptance: nothing refuses `done` for a missing check row. A done that waits for a check is item 2 of "What Jarl will not grow".

**Neighbours.**
- RECORD_API: new opts keys on `recordMerged`, no bump. `status --json` and `report --json` gain keys, which is additive, as SKILL.md:332 promises.
- Horde: it writes its own single `Check:` line at init (Horde `horde.mjs:821`) and is unaffected.
- Older Jarl: it reads `Check (Grain): …` as no check, because the regex at :1921 wants `check:`. That is the benign direction.

**Recommendation.** Ship inside the repositories issue below, with `init`'s one-time note.

### 247 · repository paths resolved mechanically, named, fingerprinted, checked and relinked

**What it asks.**
- Any spelling of a path in; the repository's main root out; one canonical form stored.
- A fingerprint per repository: the root commit and the normalized origin.
- Names (`Repos: name=path`) usable in `--repo` and as the `--files` prefix.
- Refusal with hints at write time.
- An on-demand check of the whole record.
- Moved repositories or loops found by fingerprint and fixed by one explicit, logged command.
- Container paths reported as "not visible from here".

**Against the vision.** Inside: records, derives, displays, and nothing moves by itself. The evidence is strong. The loop's issues carry 13 distinct **Repo:** values. Yggdrasil and Runes are each spelled both relatively and absolutely, and 36 issues carry absolute machine paths that bind a committed, permanent record to one laptop. The rest use `../../../../X`, which survived the move from `release-6.1.1` to `release-6.2.0` only because both directories sit at the same depth.

**Shape.** Right direction, wrong size. It bundles five things of different value:

- **(a) Input normalization.** A worktree path resolves to its main checkout through `--git-common-dir`, and a file to its repository's root. A `--files` prefix implies the repository, and a conflicting prefix is refused. `repoOf` already refuses a subdirectory with a hint (:2208) but accepts a worktree path, since a worktree's `--show-toplevel` is itself. Cheap and high value.
- **(b) Names, declared once and referenced by issues.** This is the real fix for portability and for the second jarl's complaint that multi-repository filing is verbose.
- **(c) Fingerprints.** Cheap to store. They pay off once something reads them (`verify`).
- **(d) The on-demand check.** It should be the general record check (`verify`, section 3.4), not a path-only command.
- **(e) Discovery of moved repositories among siblings, and per-file existence checks on the loop's branch.** Speculative. No loop has needed a relink yet, and files that do not exist yet are normal for new work and would need a new marker.

**Neighbours.**
- RECORD_API: `setRepo` and `newIssue` keep their signatures, so there is no bump. But the content of **Repo:** changes meaning, a name instead of a path.
- Older Jarl: 6.1.0 would resolve a name as a relative directory (`resolve(root, named)` :2203) and silently read the wrong place. That is why this needs the loop format marker (section 3.5).
- Horde: missions name no **Repo:** and are unaffected.
- MCP: `repo` and `new` already take the field, and names make it simpler, not bigger.
- Old loops: paths keep working. An explicit, logged normalization rewrites them to names. Run it on any committed loop that travels.

**Recommendation.** Ship (a), (b) and the storage of (c) as one repositories issue together with 246. Fold (d) into `verify`. Defer (e).

### 248 · `review` keeps only the first line of its findings

**What it asks.** The full findings, multi-line, on the issue, with the verdict, the reviewer and the kind. A short log line that points to the issue. `show` and `--json` carry the full text.

**Against the vision.** Inside. It is data loss in the one place the family calls testimony. It is confirmed in code: `cmdReview` writes `findings.split('\n')[0]` into `log.md` (:2140) and nothing onto the issue. Issue 193's second Important is gone (log.md:1364), and that log line was the only copy.

**Shape.** Right, with one refinement. Write the full text to its own `## Reviews` section, not into Evidence. Evidence is "what ran and what it printed" (SKILL.md:168-173). A review is testimony (SKILL.md:12, family.md "Trust"), and mixing the two blurs exactly the line the trust model draws. Keep the done gate reading `log.md` as today, so the gate needs no migration. The section is for readers; the log line is for the gate and points to the section. Widen the fix to the whole class (section 3.3).

**Neighbours.**
- RECORD_API: no signature change. `parseIssue` returns one more section, which is additive.
- Profiles: adding `Reviews` to `BUILTIN_SECTIONS` (:287) makes invalid any profile that declares its own `Reviews` section. Horde's profile declares only `Scope` and `Notes for the worker`, so none breaks today.
- Horde: never calls `review`.
- Old loops: nothing to migrate and nothing to recover. `show` should say that verdicts recorded before 6.2.0 kept only their first line.

**Recommendation.** Ship first, widened.

### 249 · `next` mixes ready, waiting on After, and held by a file

**What it asks.** Three headed groups, or only the ready ones with the count of the rest. The SKILL.md description and `--json` match the output, with a test on a loop holding every kind.

**Against the vision.** Inside. It is confirmed: `next` here prints 142 and 143 "(after 010, 075)" and the held 014 and 075 between ready rows. `cmdNext` (:1537-1567) pushes every dispatchable issue, and `--limit` applies only to the ready ones.

**Shape.** The default should print what the command's name promises: ready only, with one footer line (`held 2 · waiting 10 · resume shows them`). `resume` already prints both other groups under their own headings. Three headed groups belong behind `next --all`. Add two things the issue misses:

- **An open question holds an issue.** An issue with an open `stuck` ask is held, and an open `stop` holds everything (divergence 1). This is a view, not a gate, so it stays on Jarl's side of the line, and it finally makes SKILL.md:87 true.
- **A missing Files declaration is flagged.** An issue that declares no Files is marked `(no files declared)`, as `(no acceptance yet)` is marked (divergence 8).

The release issue 224 shows why this matters. It sits at the top of `next` as a ready P1, while the releasing skill lets it start only on the owner's word. With question holds it can wait on an open `stuck` ask, or on After its final passes.

**Neighbours.** `next` is not in `record.mjs`. Under a profile's external scheduler it prints the composer's note, unchanged. `next --json` keeps every row (SKILL.md:332 promises keys are never removed) and gains a `group` key.

**Recommendation.** Ship, reshaped.

### 250 · a multi-repository section, import where researchers are raised, resume first, uncommitted work at open

**What it asks.** One short section on loops over several repositories. One sentence wherever the jarl raises researchers: ask for `findings.json`, and `import` files the issues with their source. `resume` in the first lines of the loop. A paragraph on uncommitted work at loop open.

**Against the vision.** Inside, and all four are true:

- `resume`'s "start here" sits behind three paragraphs on the retired handoff (SKILL.md:89, :387-398).
- `import` is at SKILL.md:206-223, reachable only by someone who already knows it exists. The second jarl hand-filed 56 issues.
- The multi-repository rules are spread over SKILL.md:38, :71, :136-137 and :414-423.

**Shape.** Right, but too small for what the field shows. Section 3.1 argues that the skill's structure is itself a cause of the misuses. Widen it to a restructure, done last, after every behaviour change has landed. Every Jarl package edits SKILL.md, so a restructure in parallel would conflict with all of them. The restructure:

- Split SKILL.md into an operating manual organized by moment: open, boot, file, pick, raise, review, merge, ask the owner, decide under a mandate, close.
- Move the reference to a file beside it, opened when needed: the command table's detail, the profiles' composer keys, the JSON shapes, the metric definitions, the record library. Horde already keeps its reference this way (`skills/horde/scripts/README.md`).
- Add one line to the worker's and the reviewer's briefs (SKILL.md:427-477) telling them to read the rulings in force. Today the rulings reach a worker only when the jarl names them by hand, as this loop's Yggdrasil brief does ("Read the rulings patch-scope and yggdrasil-scope").
- Fix the family skill that steered this jarl away from `ask`. Its line 69 should say: file it with `ask`, put it to him in the chat, record the answer with `answer`.

**Neighbours.** Docs only, nothing to migrate.

**Recommendation.** Ship, widened, as the last Jarl package.

### Overlaps and order

- 248 and the defect half of 244 are one fix: the one-line projection class.
- 245 builds on 248, because retraction acts on the verdict store and `body --title` sits beside 248's `body` work.
- 241, 246 and 247 are one concept, the loop's repositories. 241 is independent enough to go first; it is the planned J1.
- 249 depends on nothing, except that it should read asks.
- 250 goes last.

Every Jarl package touches `jarl-lib.mjs` (3,606 lines) and SKILL.md. Declare Files on every Jarl issue (today all eight declare none), so `next` serializes them, and the merger runs `npm test` after each.

## 3. What we do not see

### 3.1 The pattern behind the misuses

Two capable agents, in two projects, on the same day, skipped the same features: `ask`/`answer`, ratify (in this loop), `deferred`, `Check:`, `import`, `next`, `queue`, `report`. Both covered missing commands with hand edits. One label does not fit all of it. There are three causes, and each calls for a different response.

**First, a record write that pays off for someone else, later, loses to something the agent already has, now.**
- The host's question window beats `ask`. It is synchronous, and the owner sees a proper choice; `ask` is shaped for "file it and keep moving".
- The agent's own plan beats `next` and `queue`.
- Its own grep beats `status --by`.

The cost landed on the record. Four days produced one ask. D6 is open while `status` says `questions 0`. The vetoable rulings are tracked nowhere. Ratify itself is not broken: the second jarl used it, and it caught a misreading.

**Second, shape.**
- Ratify is one item per call, while a plan's decisions come as one artifact.
- `deferred` hides an issue from `list`, while the jarl wanted "later, but visible". It used tags instead: `polowka` on 12 issues, `6.2` on 7, `1.1.0` on 5.
- `ask` keeps one line, while the skill asks for options.

**Third, placement and size.**
- `Check:` is a convention inside a table cell (SKILL.md:38).
- `import` sits in the reference half.
- "Start with `resume`" sits behind a retired file.

The response follows the causes:
- Make the record path the cheapest path, or capture the path agents already take: an `ask` that prints host-ready options, a `decide --ratify` for a batch of mandate decisions, a `merged` that carries its check, Files that imply the repository.
- Make a bypass visible: `status` noting an owner ruling filed with no question on record, `verify` naming hand edits, `next` naming missing Files.
- Shrink what an agent must read before it finds the moment it is in.

`next` and `queue` are not misplaced, though. They serve roles without context: the merger through its brief, a cold session through `resume`. They should not be pushed on a jarl that holds a plan.

### 3.2 The journal is the database

`gateState` (:1822-1880) reads every input of the done gate from `log.md`: restarts, reopens, rounds, verdicts and the stamps of evidence rows. Four consequences follow.

1. **A hand edit changes outcomes without a trace.** The strike on issue 006 is the live example.
2. **Stamps resolve to the minute.** Two verdicts in the same minute cannot be told apart. My scratch run wrote two identical lines. Horde already worked around this with a millisecond ticket log of its own (Horde `loop.mjs:12`).
3. **Order is fragile in committed loops.** In the committed modes `log.md` merges by union, which can interleave two branches' lines. Line order is what "newer than the last round" means.
4. **`goal.md` holds gate inputs the same way.** A name added to `Coordinators:` re-classifies old approves (:1849, only ever stricter, by design), and a `Check:` line sets the trust banner. Both are hand-edited with no log line. The loop's own directory name is also a coordinator name (:1735-1745), so renaming the loop directory changes who counts as the loop itself. No approve here was affected.

On top of that, the library hands composers `withLock` and `writeAtomic` as contract (record.mjs:78-79), and Horde uses them to edit rulings and ticket text directly. None of this is wrong for a markdown-first record. It means the record's guarantees are conventions, and nothing reports a broken one. Add a read-only check before adding more write paths.

### 3.3 One bug class, not three issues

The class covers every place Jarl projects multi-line text into a line-oriented file:
- the review into the log (:2140)
- the question into `asks.md` and the log (:2761)
- the answer into the issue's evidence and the log (:2801, :2804)
- `decide --settles` into each settled issue's evidence (:2884)
- any log event that holds a newline: `appendLogLines` writes it raw (:732-735), and the scratch `ask` left two stray lines in `log.md`

Two cases need different treatment:
- **The full text survives elsewhere** (`answer`, `decide`: in `decisions.md`). The projection should say it is a pointer: "… (whole ruling: decisions `ask-003`)". A worker reading issue 193 today sees one line of a four-sentence ruling and cannot tell it is cut.
- **The projection is the only copy** (`review`, `ask`). It must not cut.

One principle covers both: no command loses text it was given. A line-oriented store gets a single-line pointer, and the full text lives in a block-oriented place. One test covers the class: every writing command fed a three-line text, and every view checked.

### 3.4 Missing concepts

**The loop's repositories.** A repository today is smeared across four places:
- **Repo:** paths, 13 spellings in this loop.
- Files prefixes, read through the directory's basename (`fileAt` :1496).
- Check lines.
- A base that is whatever the main checkout has checked out (`defaultBase` :2231). `check`, `queue`, `tips`, `branches` and Horde's `requires-merged` gate all read it.

The base is the invisible one. If someone checks out `main` in `../Grain`, every view silently computes against `main`. Declare each repository once (name, path, base branch, check, fingerprint) and reference it by name. `status` can then warn when a checkout is not on its declared base, and 246 and 247 become one change. Warn only in 6.2.0. Using the declared base in the views is a later step.

**The record's integrity.** A `verify`: read-only, no lock, no network. It reports:
- lines in `log.md` that look like events but do not parse, such as the 006 strike
- stray lines in `asks.md`
- **Repo:** values that do not resolve, or whose fingerprint does not match
- After naming issues that do not exist
- duplicate ruling slugs
- issue headers that do not parse
- leases naming worktrees no repository lists
- machine-read lines in `goal.md` that do not parse

It must tolerate the edits a composer makes by design, such as Horde's prefixed ruling fields. This is pure "derives and displays", and it is the piece 247's "check the whole record" was reaching for.

**Goal amendments and the loop's identity.** The loop was renamed and re-scoped in one afternoon:
- its goal was rewritten
- its directory moved
- three repositories' branches were renamed
- three briefs were amended with "read every 'release/6.1.1' above as 'release/6.2.0'"

The loop's own log says nothing about it. A small `goal` command would make renumbering first-class without a "move" command:
- print the goal
- set a machine-read line (Check, Coordinators, a repository) with a log line
- amend the paragraph, citing the ruling that allowed it

The move itself is `git mv`, and once repositories are named, nothing inside the loop depends on its depth.

**The owner as an actor across sessions.** The only bridge between the owner's sessions is one complete list of what waits on him, and this loop's list is wrong: D6 and the vetoable rulings are missing. Two cheap shapes fix it:
- `decide <slug> "…" --by jarl --ratify` files the ratify item in the same move. That is one call per mandate decision, and the owner answers yes or reject per ruling.
- A note on stderr when `decide --by owner` records the owner's word with no question on file.

Attribution is the sharper risk. `answer` and `decide` default to "owner" (SKILL.md:87, :90), so an agent that forgets `--by` writes the owner's name on its own choice. The second jarl answered a ratify item meant for the owner. At least an answer to a ratify item should require `--by` and refuse a coordinator name: `jarl`, `reeve`, `coordinator`, the loop's own name.

**Intent reaching workers.** Covered under 250. The value the field ranks first does not reach a worker unless the jarl copies it by hand.

**Continuity across loops.** A permanent loop per release strands unfinished work when the release closes. 6.1.0 closed with five deferred issues. One is P1 (514, a reviewer's quoted secret reaching the committed lock), with a live branch and a container worktree that this loop's Yggdrasil brief tells workers to leave alone. It was deferred deliberately, on the owner's words of 2026-09-28, but no view of the current loop shows it. This is not for 6.2.0. `import` could read another loop's deferred issues with `Source: <loop>#<id>` and give carrying work forward a command.

**Machine identity.** Three things in the record are facts about one machine: the lease's worktree path, the **Repo:** path and the lock's holder. Only the lock records which machine it was (`lockIsStale` :100-109). Names (247) and git's own worktree state (241) cover today's cases. Per-machine path overrides can wait until a loop actually runs from two machines. One sentence outside Jarl: the repository that then held the release loops had no git remote, so the permanent record of every release lived on one disk.

**A record format version.** Only a profile can declare `format` (:275-308). A loop without a profile carries no format at all, so an older Jarl that meets a newer record cannot know.

### 3.5 The release loop runs the Jarl it is changing

This loop's CLI runs from the `../JarlSkill` checkout (releasing-the-family, its lines 24 and 61). The MCP tools come from the installed plugin, which is 6.1.0 (`~/.claude/plugins/cache/jarl-marketplace/jarl/6.1.0`). Once JarlSkill's `release/6.2.0` is checked out there and Jarl's packages merge into it, two things happen. The CLI that writes this 250-issue record changes under it mid-release. And the MCP tools stay at 6.1.0, so two versions of Jarl write one loop.

The danger depends on the change:
- With 248 it is harmless: an unknown section is ignored.
- With names in **Repo:** (247), a 6.1.0 writer misreads every named issue.
- With multi-line asks, a 6.1.0 reader sees the first line only.

Two steps follow:
- **A loop format marker.** `init` writes it. The first write that uses a newer format raises it. An older Jarl refuses a newer record loudly, as it already does for a profile's `format` (:307-308).
- **A ruling in this loop.** Its CLI runs from a JarlSkill worktree pinned at `v6.1.0` until the release closes, and 6.2.0's Jarl is exercised on copies of this loop.

The 6.3.0 loop then opens on 6.2.0.

### 3.6 Jarl has no corpus gate

In this very loop the family learned that its tools' own suites test only what their authors imagined. It decided on a pinned real-repository corpus gate before every tag (releasing-the-family, "Real-repository gate before the tag", and issue 184). Jarl's equivalent corpus already exists and is publishable: the family's own release loops.
- 6.1.0: 532 issues.
- 6.2.0: 250 issues, 1,874 log lines, five repositories, a container and a renaming.

`resume.test.mjs:220-232` already runs `resume` on a copy of the 6.1.0 loop, but only when the repository holding the release loops happens to sit beside the checkout, and it is skipped everywhere else, CI included. Make it a gate:
- a frozen copy in the test tree, or a pinned commit of the repository holding the release loops
- every view run on it
- `verify` reporting exactly the known anomalies (the 006 strike)
- normalization to names round-tripping
- outputs compared with goldens

### 3.7 Risks of growth, and what to take away

**Risks.**
- **Size.** Every feature added to a 104.6 KB skill makes the next one less likely to be used. The field data is that two strong agents already skip a large part of the surface. 6.2.0 should add few commands and remove some.
- **Contract strictness.** RECORD_API counts even an added export, or `opts` added to `answer`, as a new contract version (the header of `tests/record-contract.test.mjs`). That ripples into Horde's code (Horde `loop.mjs:36`), Horde's pin, Yggdrasil's family-contracts page and `family.md`. Keep 6.2.0 on `jarl-record/1` by using opts keys only.
- **Contract policy.** Ask the owner whether an additive change should keep the version, with a composer checking for a function's presence. That one policy decides how often Horde breaks.
- **MCP surface.** There are 38 tools today. This set adds one (`verify`), possibly two (`goal`), and can remove one (`handoff`).
- **A temptation to watch.** Once per-repository checks and per-merge check rows exist, someone will ask for `done` to refuse without one. That is item 2 of the list.

**What to take away or move.**
- **`handoff`.** Retired since 6.1.0; `handoff write` writes nothing. It still has a tool, three paragraphs, `status.handoff` and `resume.legacyHandoff`. Remove the MCP tool and the prose now, and the CLI alias at the next major.
- **`mode permanent`.** A one-time migration for loops older than the mode; it belongs in the reference, not the main table.
- **The composer-only material.** The profiles' composer keys, the record library, the JSON shapes and the metric definitions, about 18 KB. It belongs out of SKILL.md.
- **The reeve's no-spawn relay protocol.** It belongs in the reference.

## 4. Recommended set for Jarl 6.2.0

| # | Item | In 6.2.0 | Shape |
|---|---|---|---|
| J1 | 241 | yes (planned) | git's `locked`/`prunable` state first, the parent-directory rule as fallback; an unknown dirty count is never `delete`; the brief adds `--lock --reason devcontainer` |
| J2 | 248, widened to the one-line class, with 244's defect half | yes, first after J1 | full findings in `## Reviews`; questions keep every line; `answer` and `decide --settles` write a pointer to the whole ruling; log events never carry raw newlines; one test of a three-line text through every writing command |
| J3 | 245, narrowed | yes | findings floor; `review <id> retract` strikes the latest approve, never a `changes`; `evidence <id> --retract <n>`; `body <id> --title`; no global entry ids |
| J4 | 249, reshaped | yes | ready only by default, groups with `--all`; held by an open `stuck` or `stop`; `(no files declared)`; `next --json` keeps rows and adds `group` |
| J5 | new: `verify` plus the corpus fixture | yes | read-only record check as in 3.4; tested on frozen copies of the family's release loops |
| J6 | new: loop format marker | yes, if J7 ships | written by `init`, raised by the first write in a newer format, an older Jarl refuses loudly |
| J7 | repositories: 247 (a), (b), stored (c), with 246 | yes, if the owner holds to `release-6-2-0`; else 6.3.0 | repositories declared once (name, path, base, check, fingerprint); `--repo` takes a name, a path, a worktree or a file; a Files prefix implies the repository; a logged normalization command; per-merge check rows bound by `merged --ran/--saw`; `status` warns on a checkout off its base; `init`'s testimony note |
| J8 | 244's options, plus `decide --ratify`, plus ratify answers needing `--by` | yes, at CLI and MCP; the library later | `ask --option/--recommend` printing host-ready options; `answer --option`; a ruling that says label or own words; `record.mjs` unchanged |
| J9 | 250, widened | yes, last | SKILL.md by moment, reference beside it; briefs read the rulings in force; `handoff` and composer material out; the releasing skill routes owner questions through `ask` |
| (optional) | new: a `goal` command | if J7 ships | print the goal; set a machine-read line with a log line; amend the paragraph citing a ruling |

**Waits for 6.3.0 or later, with reasons:**
- 247 (e), relink discovery among siblings and per-file existence checks. No loop has needed either yet, and new files make existence checks noisy.
- `jarl-record/2`. One deliberate contract step: `answer` with `by`, `option` and composer fields, so Horde can stop editing rulings and tickets directly. It also needs the policy decision above.
- Carrying deferred work across loops.
- Per-machine path overrides.
- Using the declared base in the views, beyond a warning.

**Dropped:**
- 245's global entry ids. They are a format change that buys nothing retraction by selector does not.
- 241's parent-directory rule as the primary signal.

**Not a Jarl change, but needed: a ruling in this loop that pins its Jarl at v6.1.0 until close (section 3.5).** The jarl should file it. I filed nothing.

**For the owner's word:**
1. **Scope.** Ruling `release-6-2-0` (14:07) says every issue of this loop ships now. 244 to 250 were filed after it (16:39-16:47), and J5, J6 and the ratify shape are new. Does the ruling cover them? I would ship J1 to J6, J8 and J9, and let J7 slip first if the release must close sooner.
2. **Contract policy.** Whether additive library changes keep `jarl-record/1`, and when `jarl-record/2` is taken.
3. **Attribution.** Whether `answer` on a ratify item must name who answered. I recommend yes, refusing coordinator names.
4. **D6.** The `promises` package version is still open, recorded only in prose. It is his, not mine; flagged because `status` does not show it.

**Order and Files.** J1 → J2 → J3 → J4 → J6 → J7 → J5 → J8 → J9. J6 lands just before J7 because it protects J7's format change. J5 lands after J7 so it can check names and fingerprints. J9 goes last because every package edits SKILL.md. Each Jarl issue should declare at least `JarlSkill/skills/jarl/scripts/jarl-lib.mjs`, `JarlSkill/skills/jarl/SKILL.md` and its test file (plus `jarl.mjs` where a flag or command is added), so `next` keeps them in series. The merger runs `npm test` in `skills/jarl/scripts` after each. Horde re-vendors once, against Jarl's `v6.2.0` tag, as section 5 of the plan already says. Horde's suite is then the proof that J2 to J7 left the record library's behaviour intact for the one composer that stands on it.
