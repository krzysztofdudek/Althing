# Jarl: repository names, and a field report from a loop in another project

The first version, kept as the three critiques read it; it is superseded by [design.md](../design.md).

Written 2026-10-08 by the architect of Jarl. Read-only towards the loop and every tool repository: nothing in the 6.2.0 loop, in JarlSkill or in any other checkout was changed. Inputs: JarlSkill at `2c12aa3` (6.1.0, the driver `jarl-pinned-in-loop` pins); Althing at `0dbe5e3` (`AGENTS.md`, `method/loops.md`, `method/environment.md`, `family/registry.json`, the shape of `ws.local.json`, `workspace/README.md`, `releases/6.2.0/family.json`, the rails); the 6.2.0 loop read through `ws jarl` (279 issues, 2,003 log lines); the previous architect's plan `releases/6.2.0/plans/jarl-architecture-6.2.0.md`, which this design builds on; and the field report in [source.md](../source.md). Line numbers are `JarlSkill/skills/jarl/scripts/jarl-lib.mjs` at `2c12aa3` unless another file is named. "Probe A" to "probe I" are runs of Jarl 6.1.0 on a scratch loop, [materials/probe.mjs](probe.mjs), output in [materials/probe-output.txt](probe-output.txt).

## The short version

1. **A loop names a repository by its name, never by a path.** The name is the directory `git clone` gives the repository, which is its name on its host and already the prefix every Files entry carries. The loop declares each repository once, with a fingerprint (its origin and root commit) and its base branch, and no path. Each machine resolves a name in a fixed order (the loop's own repository, a git-ignored `.jarl/local.json`, then the sibling of the loop's repository) and verifies the fingerprint, so a wrong checkout is refused instead of read. A lease records its worktree's name, and git's own worktree list says where it is on the machine at hand.
2. **The migration is one command that proves itself.** `repos normalize` rewrites the Repo fields, the Merged fields' `in` part, the lease Worktree fields and the same tokens in `log.md`, and writes nothing unless every issue's done gate, the review split, the metrics, `next` and the status counts are identical before and after.
3. **246 and 247 trade places.** The repositories entity goes back to 247, whose title already names it. 246 keeps what its title names, the check per repository, and becomes "a merge records the check that decided it". That part needs no format change and absorbs two field items, so it should not slip with the names, which are the release's declared first item to set aside.
4. **This loop keeps its paths until it closes; no bridge.** The relative sibling paths are the family's documented layout, not one machine's; the only truly machine-specific values are the worktree paths, which no bridge inside Jarl 6.1.0's path semantics can remove. Jarl 6.2.0 normalizes the loop once, after the close is logged and before the freeze, under a ruling that refines `jarl-pinned-in-loop`, after the same run has passed on a frozen copy.
5. **The field report:** of nine "could be better" items and two "works badly" items, two are real defects the 6.2.0 loop shows too (CI recorded as `none` on all 193 of its merges although every tool repository has CI; a red gate with an outside cause has no honest record), one is a real gap with a cheap fix (`show` grows without bound, and 248 will make it grow faster), and three more are covered by issues already in scope once they are amended. Five are rejected, each with its reason: they ask for a state, a tag or a limit where the record already carries the fact or a view can derive it.

## Part A. Naming a repository

### A.1 What the record holds today

| What | Where it comes from | In this loop |
|---|---|---|
| **Repo:** a path relative to the loop's root | `repoOf` resolves it from the root (:2203) and refuses anything that is not a repository's top (:2204-2208) | 278 of 279 issues; 9 single values (`../..` for Althing on 17 issues, `../../../<Name>` for the rest) and 6 lists over 19 issues |
| **Files:** each entry prefixed with the repository's directory name | `fileAt` and `prefixedIn` read the prefix as the basename of the resolved Repo path (:1496-1519) | every issue that names a repository |
| **Merged:** `<sha> in <path>` | the `--repo` value is written as given (:1375) | 34 of 193 Merged fields, and the same 34 merge lines in `log.md` |
| **Worktree:** an absolute path | `set --worktree` resolves the value against the root and stores the result (:1213) | 24 live leases; 217 lease lines in `log.md` (144 under a home directory's `.jarl-wt/`, 73 under the devcontainer's worktree root) |
| the base branch | whatever the checkout has checked out (`defaultBase`, :2231) | never written; read by `check`, `queue`, `tips`, `branches` |

Nothing else in the record carries a location: no `--ran`/`--saw` row of this loop holds a machine path (counted over every issue file), and the rulings, asks and goal hold none. The set to migrate is mechanical and closed.

Four things are wrong with it, and only one of them is the folder layout:

1. **A path says where, not which.** Any repository at `../../../Grain` is read as Grain. Nothing checks that it is one.
2. **A path relative to the loop encodes the loop's depth and the sibling layout.** The loop survived its move from the private repository only because the new directory sits at the same depth (the previous architect's point on 247, and ruling `althing-move`, which rewrote the paths once under an equivalence check).
3. **The worktree path is the one value that belongs to one machine:** a home directory with its user name, or the devcontainer's root. It is also the only reason Althing's paths rail carries an allowance (`rails/paths.mjs:7-31`).
4. **The base is implicit.** The previous architect called it the invisible one: if someone checks out `main` in a sibling checkout, every view computes against `main`.

### A.2 The design

The principle: **the record holds identity; each machine holds location; Jarl verifies one against the other and never guesses.**

**1. The name.** A repository's name is the directory `git clone` gives it, which is the repository's name on its host (`JarlSkill`, `Grain`, `Althing`). Three reasons. Every Files prefix in this loop is already exactly that name, so no Files entry is rewritten. It belongs to no machine: it is the repository's public name. And on a machine that keeps the family's sibling layout it resolves with no configuration at all. The registry's keys (`jarl`, `grain`) are not used: Jarl is a general tool and cannot read Althing's registry, the keys would rewrite every Files entry, and resolving `jarl` to a checkout called `JarlSkill` would need a map only Althing holds. The mapping the other way is mechanical: a registry entry's `github` value ends in the name.

**2. The declaration.** Each repository is declared once, in a new file `.jarl/repos.md`, one line per repository, written only by the tool, each change with a log line:

```
- **Grain** · origin github.com/krzysztofdudek/grain · root 3a1f… · base release/6.2.0
```

It holds the name, the fingerprint (the normalized origin when there is one, and the root commit of the base) and the base branch. It holds no path. The loop's own repository is implicit: an issue with no Repo is read in it exactly as today, and a single-repository loop, which is the common case, declares nothing and changes nothing.

Not in `goal.md`, as 246's acceptance had it: `goal.md` is the owner's charter, amended only on his word, and a repository joining a loop is routine (this loop took in three add-on repositories in one afternoon). Mixing the two either puts routine changes under his word or exempts part of the charter from it. The check stays in `goal.md` (`Check (Grain): …`, see A.4), because what decides a landing is a rule of the loop, which is what the charter holds.

**3. Resolution on a machine.** A name resolves in this order:

1. the loop's own repository: the top of the git repository holding the root;
2. `.jarl/local.json`, ignored by git in every mode, written by `repos locate <name> <path>`: this machine's exceptions;
3. the convention: the sibling of the loop's own repository, `<parent of its top>/<name>`.

The result is verified: the directory is a repository's top, its root commit is the declared one, and its origin, when both sides have one, matches after normalization (scheme, user, `.git` and case removed). A shallow clone with no root commit is checked by origin alone, and one with neither is shown as unverified, never refused. A name that does not resolve, or resolves to the wrong repository, is shown as `unresolved: <why> · fix: repos locate <name> <path>`. The commands that act on a repository (`check`, `merged`, `branches --repo`, `repo`) refuse it; the views carry on and mark it, as `loopRepos` already tolerates a path that does not resolve (:2340-2354).

The machine's exceptions live in the loop, not in an environment variable or the home directory. Every process that reaches the loop does so through `root`: the jarl's CLI, the session's MCP server, a worker's, a reviewer's and the merger's calls. A file beside the record is the one place they all read. An environment variable differs per process, so the MCP server and a CLI call could resolve one name to two checkouts. A file in the home directory is state outside every repository, invisible to anyone reading the loop. `archive` leaves `local.json` in place, as it leaves templates (:889), so a successor loop in the same directory inherits it.

**4. Writing.** `--repo` (on `new`, `import`, `repo`, `check`, `branches`, `merged`, `queue`, `changelog`) takes a name, a checkout path, a worktree path or a file inside a repository. A path is reduced to its main checkout through git's common directory (today a worktree path passes as a repository of its own: the previous architect's 247 (a)), matched to a declared repository by fingerprint, and stored as the name. A path to an undeclared repository declares it in the same move, with a log line and a stderr note naming the base it took (the checkout's branch at that moment) and how to change it. A Files prefix is the declared name, and the rule for a repository holding a directory of its own name (:1485-1488) stays. Merged's `in` part is a name.

**5. Worktrees.** A lease records the worktree's name, the last segment of its path (`Grain-228`, `028-packages`), never the path. The path is git's answer on the machine at hand: `git worktree list --porcelain` in the issue's repository, matched by that segment, else by the lease's branch. That is the state 241 already reshapes the views onto: here; elsewhere (`locked: <reason>`, the devcontainer's worktrees); not visible from here (prunable, with its parent missing); gone. `set --worktree` still takes a path, and when the path exists it refuses a worktree that belongs to another repository than the issue's: today nothing catches a worker raised in the wrong checkout (probe G stores whatever it is given). The done gate is untouched: it reads a lease line's worker up to the ` · worktree ` separator and ignores what follows (:1766).

**6. Finding the real checkout.** One new read-only command, `repos`, prints every declared repository: its name, its checkout and its worktrees on this machine, its base and whether the checkout is on it (a warning only, as the previous architect set it for 6.2.0), the fingerprint's state and its check. `show` prints the resolved checkout and worktree beside Repo and Worktree, on stdout only, and `resume` gains a Repositories section. Nothing resolved is ever written. A brief takes its paths from `repos` (or, in Althing, from `ws brief`, see 8), never by joining the root and a Repo value. This is what "agents know where to look" means in practice: the calls every role already makes (`show`, `resume`) answer it on the machine where the role runs.

**7. The format.** A loop that holds names is a newer record format. Jarl 6.1.0 refuses a bare name on write (probe H: `repo 004 r2` is refused as "not a git repository") but reads a name written into a file as a directory under the loop, silently: `status --by repo` and `next` go on as if nothing were wrong (probe H). The format marker of 252 is what keeps an older Jarl away, and the only place Jarl 6.1.0 reads and refuses loudly is the profile's `format` key: every command that loads issues loads the profile first (:572) and refuses a format it does not know before anything else (:307-308; probe I, `list` and `status` both refused). So 252's marker belongs in `.jarl/profile.json`, as a format-only profile for a loop that has none, read by 6.2.0 as the built-in profile at that format. A separate marker file would leave 6.1.0 reading names as directories without a word.

**8. Althing.** `ws.local.json` stays the one per-machine home. On a machine that keeps the documented layout nothing else is needed, because its `sources` are the very sibling paths the convention gives. `ws doctor` compares `ws jarl repos --json` with `ws.local.json` for every repository the open loop declares and names any difference; `ws doctor --fix` writes a difference into the loop through `ws jarl repos locate`, so `.jarl/local.json` is always derived from `ws.local.json` and never kept by hand. A declared repository whose origin matches no registry entry is a doctor finding. `ws brief` keeps rendering from `ws.local.json`, and the doctor's comparison is what makes the brief's path and Jarl's resolution the same path. The rail `loop/shape` today accepts a relative path or a registry key (`rails/loop.mjs:41-44`); it must accept the names instead (the last segment of each registry entry's `github`, and `Althing`), plus `repos.md` and a format-only `profile.json`. Once no loop holds a worktree path, the paths rail's worktree allowance goes.

**9. The migration.** `repos normalize [--dry-run]`, one write under the loop's lock:

- It declares every repository the record names (fingerprints read from the checkouts this machine resolves; a path that does not resolve here stops it, naming the path).
- It rewrites Repo to names (278 issues here), Merged's `in` part (34 fields and 34 merge lines), lease Worktree fields (24) and the `· worktree <path>` token of lease lines (217) to names, and a Files prefix only where it was spelled otherwise than the name (none here). It never touches an evidence row, a ruling, an ask or free text: those are quoted testimony.
- It computes, on the record before and after, for every issue the gate state (tracked, anchor, rows since the anchor, the live approve's reviewer and kind, approved, fresh), the done refusal, the recorded merge and the set of checkouts the issue resolves to; and for the loop the review split, the metrics, `next` and the status counts. Any difference and nothing is written; the first differences are printed.
- It appends one log line with the counts, and raises the format (7).

Rewriting `log.md` at all needs a reason, because `log.md` is the done gate's event store. The tokens it rewrites are locations, never events. The gate reads none of them: a lease line's worker ends at ` · worktree ` (:1766), and the merge line is read only for its id and its CI state (:1992). The equivalence check proves this on every run rather than trusting the argument, as ruling `althing-move` proved the move. Both spellings read correctly during and after the run, so a run cut short leaves a record that still reads right and a second run finishes it. The honest limit: the text is fixed going forward, and git's history still holds what was written before.

**What it does not do, and why.** It does not discover moved repositories among siblings by fingerprint, and it does not check that declared files exist on the loop's branch: the rest of 247 that the previous architect deferred. With names, a moved loop needs nothing, because nothing in it depends on its depth, and a moved checkout needs one `repos locate`, verified by the fingerprint. An existence check is noise for every issue that creates a file. Both should be dropped, not carried to 6.3.0.

### A.3 What was considered and set aside

| Alternative | Why not |
|---|---|
| Paths relative to the loop's repository instead of the loop (`../Grain`) | Removes the depth, keeps the layout; still no identity, and the worktree paths stay |
| Absolute paths per machine, kept in the record | Commits every machine's layout and user names to a public record |
| The registry's keys as names | Couples Jarl to Althing; rewrites every Files entry; needs a map only Althing has |
| An environment variable naming each checkout | Each process has its own environment, so the MCP server and the CLI could disagree |
| A map in the home directory, keyed by origin | Invisible from the loop; global state outside every repository; one more place for tests to isolate |
| Discovery by fingerprint as the main resolution | Scans siblings on every command; the convention plus one explicit `locate` is cheaper and logged |
| Keep Worktree as a path, home-relative (`~/.jarl-wt/…`) | Still a layout, wrong in a container, and git already knows the answer |
| Names in `goal.md` (246's text today) | The charter is the owner's; routine declarations do not belong under his word |

### A.4 246, 247 and the issues around them

The ruling `jarl-6-2-0-scope` set J7 as "repositories as an entity (246 with the core of 247)" and made J7 the first item to set aside. Two things in 246 are not the entity at all: the per-merge check row, which the previous architect called 246's core, and the field's two merge items (B.2, items 1 and 3). None of them needs names or a format change: Jarl 6.1.0 already reads `Check (Grain): …` as no check, the benign direction, and a merge line that adds its check before its CI state still parses (:1992). Tied to J7 they slip with it. So the two issues trade contents, and each title then says what its issue does:

**246 becomes "a merge records the check that decided it".** Its acceptance:

- `Check (<name>): <command>` lines in `goal.md` name each repository's check, `<name>` being the repository's name as its Files prefix writes it; a bare `Check:` line keeps its meaning today.
- `merged <ids> --sha <sha> --ran "<check>" --saw "<summary>"` records the merge and the check that decided it in one call: the evidence row as today, and a merge line that carries the check before its CI state. `--red <id>` records instead a merge that landed while its check was red for a cause outside the branch, which issue `<id>` (it must exist) tracks. `status --by repo` and `report` show per repository whether it lands on a check or on testimony, and how many merges carry a passing check, landed on red (with the cause), or carry no check row (every merge from before this change). `init` says once that a loop with no check lands on testimony. Nothing refuses `done` for a missing or a red check ("What Jarl will not grow", item 2).
- `merged --sha` records CI only when `--ci` is given: no default `pending`. `pending` means a pushed commit whose CI will report, and only that state makes `status` count "CI pending" and `done` note it. The merger's brief: on green, one `merged --sha --ran --saw` call; a red whose cause lies outside the branch is not a `round` (rounds count the worker's failures, and the third raises a takeover): the cause is filed as its own issue, and the branch stays approved in the queue until the check is green, or lands with `--red <cause>` on the jarl's ruling.
- Tests: a merge with a passing check, one landed on red, one with no check row, in a loop of one repository and one of several; a loop from before the change reads its merges as "no check row recorded", never as failed; Jarl 6.1.0 reads the new merge line.
- After: 249 instead of 252.

**247 comes back from deferred and becomes the repositories entity of A.2.** Its acceptance:

- Repositories are declared once, in `.jarl/repos.md`, one line each (name, origin, root commit, base), written only by `repos add|set` with a log line, holding no path; the loop's own repository is implicit, and a single-repository loop declares nothing.
- A name resolves through the loop's own repository, then `.jarl/local.json` (ignored by git, written by `repos locate <name> <path>`), then `<parent of the loop's repository>/<name>`, and is verified against its fingerprint; a name that does not resolve, or resolves to another repository, is shown with its fix, refused by the commands that act on a repository, and marked by the views.
- `--repo` takes a name, a checkout, a worktree or a file and stores the name, declaring an undeclared repository in the same move; Files prefixes and Merged's `in` part are names; a lease's Worktree is the worktree's name, resolved through `git worktree list` with 241's states, and `set --worktree` refuses a worktree of another repository.
- `repos` prints each repository's checkout and worktrees on this machine, its base (a warning when the checkout is off it), its fingerprint's state and its check; `show` and `resume` print the resolved places; nothing resolved is ever written.
- `repos normalize [--dry-run]` migrates a loop (Repo, Merged's `in`, Worktree, the same tokens in `log.md`) and writes nothing unless every issue's gate state and done refusal, the review split, the metrics, `next` and the status counts are identical before and after; it logs one line and raises the format (252). Paths keep working until then.
- Tests: a loop with paths over two repositories and a worktree git lists as locked normalizes with every gate unchanged; a second layout resolves through `local.json`; a checkout of another repository under the right name is refused by its fingerprint; the real loop through `JARL_LIVE_LOOP` when it is set (269).
- Not here, and dropped: discovery of moved repositories and per-file existence checks (A.2, 9).
- After: 252 (and 241, by the order).

**The neighbours.**

- **251** (`verify`): its repository checks become: a Repo name that is not declared; a declared repository that does not resolve or whose fingerprint differs; a Repo still written as a path in a loop of the new format; a Worktree name git does not list. After 247 instead of 246.
- **252** (format marker): the marker is the record format written in `.jarl/profile.json` (A.2, 7), the one place Jarl 6.1.0 refuses loudly; `repos normalize` raises it.
- **253** (`goal` command): it sets Check and Coordinators lines; repositories are declared by `repos`, not in `goal.md`.
- **257** (Althing, frozen copies): add `repos normalize` on the frozen copy of the 6.2.0 loop, with every gate unchanged, and Jarl 6.1.0 refusing the result.
- **The order** of `jarl-6-2-0-scope` becomes J1 241 → J2 248 → J3 245 → J4 249 → 246 → J6 252 → J7 247 → J5 251 → J8 244 → J9 250, with 253 after 246 if it goes in. The change is the jarl's under the mandate, so it is a ruling with a ratify item, like the scope ruling itself.

### A.5 The interim for this loop

**Keep the paths; no bridge.** The loop is pinned to Jarl 6.1.0, which understands only paths. The only bridge possible inside those semantics swaps one path for another: for example a git-ignored directory of symlinks, one per repository, created on each machine from `ws.local.json`, with Repo values pointing into it. It is rejected on quality grounds:

- It cannot remove the worktree paths, which are the one machine-specific value in the record (217 lease lines and 24 live leases); the Repo values it would replace are the family's documented layout, which every conforming machine reproduces, not a fact about one machine.
- It doubles the migrations of the done gate's event store, now and again when 6.2.0 arrives, and each one is a chance to move a gate.
- It adds a per-machine step whose absence turns every repository command into "not a git repository": a false red the doctor would have to police.
- `jarl-pinned-in-loop` exists to keep the record's form still until the close; a mid-release rewrite is the churn it was written to prevent.

Until the close, every new Repo is the relative sibling form (`../../../<Name>`, or `../..` for Althing), never absolute, which the rails already enforce, and Files keep the checkout's directory name as prefix.

**The conversion.** Once Jarl 6.2.0 is tagged, `repos normalize` first runs on a frozen copy of this loop (257), and then runs once on the loop itself, after `close` has logged the close and before the freeze, so the frozen record is the normalized one, and every write of the release's life stays Jarl 6.1.0's. This needs one ruling that refines `jarl-pinned-in-loop` (it says "until it closes", and the normalization is a write by another Jarl after that point), filed by the jarl before the close with a ratify item, and one step added to the closing order (the ratification batch, the close, the normalization, the ledger pass, the freeze). If J7 slips to 6.3.0, the 6.2.0 record is frozen with its paths: they read correctly in every later Jarl, and the rails already accept them.

## Part B. The field report

### B.1 What works well

Every item the coordinator praised is what the previous architect called the product: the record and its one hard gate. Two need a word. "Root on every call and refusal of relative paths" is the property the repositories design keeps: the machine map lives under `root`, so every role resolves through the same file (A.2, 3). "After blocking next" is the property 249 sharpens. Nothing to change.

### B.2 The items, checked

| # | Item | Real? | Already covered? | Decision | Release |
|---|---|---|---|---|---|
| 1 | "CI pending" forever when nothing is pushed | Yes: `merged --sha` defaults to `pending` (:1345; probe E); this loop recorded `CI none` on all 193 merges although all five tool repositories have CI | `--ci none` exists but says "no CI to wait for", which is false | AMEND 246 (no default `pending`; the check row bound to the merge is the local gate's proof) | 6.2.0, growth inside 246 |
| 2 | No "ready for review" state | Yes: `set ready` is refused (:1192; probe D) | Partly: `queue` shows approved branches; "awaiting review" is derivable from the record | REJECT the status; NEW: derived marks for work in flight | 6.3.0 |
| 3 | Merged, gate red for an outside reason | Yes: no honest record, and the merger's only move is a `round`, which charges the worker | No | AMEND 246 (`--red <cause>`; an outside red is not a round) | 6.2.0, growth inside 246 |
| 4 | `show` huge | Yes: `show` prints the file verbatim (`jarl.mjs:481`); 248 will add every review's full findings to it | No | NEW: `show` bounded by default, `--full` for the file | 6.2.0 on the owner's word (pairs with 248), else 6.3.0 |
| 5 | `status --tag x` | Yes, a convenience | `list --tag x --all` lists the slice; `status --by tag` prints one line per tag | REJECT | none |
| 6 | Background queue of owner decisions | Partly: answering is one ask per call (`jarl.mjs:338`) | Yes: asks are that queue (`ratify` blocks nothing, `stuck --issue` holds one issue, both listed by `status` and `resume`); 244 makes asking cheap | AMEND 244 (one verdict for several ratify items); AMEND 250 (docs); REJECT `ask --defer` and an owner tag | 6.2.0 (244 on the owner's word) |
| 7 | Acceptance citing a superseded ruling | Yes: nothing connects a ruling's supersession to the issues that cite it | No | AMEND 244 (`decide --supersedes` names the citing open issues); AMEND 251 (`verify` reports them) | 6.2.0 (244 part on the owner's word) |
| 8 | Same fresh reviewer after a round? | The code is clear: yes (probe F); the skill's "fresh one-shot reviewer" is not | n/a | AMEND 250 (one sentence) | 6.2.0 |
| 9 | Long free-text evidence | Yes: free text is appended whole and only its first line reaches the log (:1473) | No | REJECT a length limit; the bounded `show` (item 4) and 250's docs carry it | with item 4 |
| W1 | Shared resources collide | Yes, and a pseudo-file half-works: it holds within one repository (probe A), not across two (probe B), and it fails `check` (probe C) | No | NEW: a declared exclusive resource that `next` respects, loop-wide | 6.3.0 |
| W2 | Compaction: summary trusted over the record | Yes; the skill says nothing about compaction | Handoff is retired; `resume` is the live state | AMEND 250 (a compaction is a session start) plus one sentence in the MCP server's instructions; NEW in Althing for its own skill | 6.2.0 |

**Item 1.** Real, and the 6.2.0 loop shows it from the other side: to keep `status` from saying "CI pending" for ever, its merger recorded `CI none` on all 193 merges, the value that means "this repository has no CI", while Runes, Yggdrasil, Grain, JarlSkill and Horde all run CI on GitHub. Both workarounds put a false statement in the record. The cause is a default: `merged --sha` without `--ci` writes `pending` (:1345), but a merge into a branch that is not pushed has no CI run to wait for, and when the branch is pushed later, CI runs on its tip, not on each merge. `ciOf` reads runs for the exact commit (:2512), so most merges' `pending` can never resolve. The fix is not a new CI value (`--ci local` would assert something without proof). It is to keep the two facts apart: the local gate's verdict is the check row bound to the merge (246), and CI is recorded only when someone knows a run will report. `tips` already reads the CI of a pushed tip. Horde passes `ci: 'none'` explicitly (Horde `skills/horde/scripts/loop.mjs:143`) and is unaffected.

**Item 2.** Real, but a status is the wrong answer. A worker that has recorded its rows and reported is "awaiting review" by facts the record already holds: a lease, rows since the start, no verdict since the last restart or round. A status would be one more write a worker can forget and one more thing to go stale. The word the worker reached for is also taken: `ready` is a reserved view word in Jarl (:293), meaning "ready to start" in `next`. Derive it instead: the in-flight rows in `status` and `resume` say what each issue waits for (working; awaiting review; changes requested; approved, in the queue). `set` refusing an unknown status such as `ready` or `review` then names that view, and says a loop that wants an explicit review state can declare one in its profile. Not urgent: 6.3.0.

**Item 3.** Real. The merger's brief knows only "red, roll back, `round`" (SKILL.md, the merger, step 3). A red that is not the branch's fault is charged to its worker, and three of them raise a takeover of work that was right. The state the coordinator missed already exists once it is named: an approved branch that waits in the queue until the gate is green again. `round` spends the approve (:1842), and a plain rollback does not. What is missing is the rule (an outside red is not a round, and its cause is an issue) and, for the rare merge that lands on red anyway on the jarl's ruling, an honest record: `--red <cause>`, never counted as a passing check. A status for "landed but the base is red" was considered and rejected, because it would write the repository's state into an issue.

**Item 4.** Real, and 6.2.0 will make it worse: 248 writes every review's full findings into the issue, and the worker's brief pastes the issue verbatim (SKILL.md, the worker's brief), so a takeover after three rounds carries three full reviews into a fresh worker's context. The fix is a bounded `show` by default: the header, What, Why, Acceptance and Changelog, the latest verdict in full, the last five `--ran`/`--saw` rows, a count of what it left out, and the exact call that prints everything (`show <id> --full`, the file verbatim). `show --json` stays complete. A bounded default rather than an opt-in `--brief` follows the previous architect's lesson (section 3.1): agents skip what they have to remember to ask for, so the cheap path has to be the right one. Sub-parts of an issue are rejected: issues with After, or a package on one branch, are the parts. Recommended for 6.2.0 because 248 is, which is growth and the owner's word.

**Item 5.** Rejected: `list --tag x --all` lists the slice, and `status --by tag` prints one line per tag, which a reader or a script (`--json`) picks from. A scope filter on every view grows the surface that both field jarls already skip (previous architect, section 3.1), for a saving of one line.

**Item 6.** Mostly covered, by a feature both field jarls under-used. A decision the jarl may take provisionally is `decide` plus `ask --kind ratify --issue NNN`: it blocks nothing, `status` counts it, `resume` lists it, and it waits for the owner as long as he needs. A question the jarl cannot settle is `ask --kind stuck --issue NNN`, which holds only that issue (in `next`, once 249 lands). That is the background queue the coordinator wanted, linked to issues. A tag would duplicate it, and `ask --defer` would add a kind to a closed set for no new behaviour. What is really missing is cheap answering: when the owner looks at eight ratify items and says yes to all of them (this loop's ruling `ask-015` is that case), `answer` takes one id per call. 244 should let `answer` take several ratify ids with one verdict, one ruling each, each naming the batch it was answered in. 250 should say in one place how a jarl works with an owner who is rarely there. The tag this loop uses, `needs-owner`, marks work that needs his hands (a push, a publish), not questions, and stays.

**Item 7.** Real: nothing ties a ruling's supersession to the issues whose acceptance cites it. The right moment is the supersession itself: `decide --supersedes <slug>` prints on stderr the open issues whose What, Why or Acceptance name the old slug, so the jarl rewrites them at once (244 already reshapes `decide`). `verify` (251) reports any that remain. `check` is the wrong place: it reads a branch's diff, not the record.

**Item 8.** The code answers it. After a round, an approve by the reviewer of the earlier round counts as fresh and closes the issue (probe F: `review 005 approve --by rev-a` after a round logs `(fresh)`, and `set 005 done` passes). The skill's "fresh one-shot reviewer" leaves the reader unsure. One sentence in 250: the gate counts the earlier reviewer as fresh; the loop's practice, for quality, is a new one-shot reviewer for each round, handed the earlier findings to check.

**Item 9.** A limit is rejected: it would refuse or cut text, against 248's rule that no command loses text it was given. The cost the coordinator describes is reading cost, which the bounded `show` (item 4) removes, since it shows rows and not notes. 250 says what free text is for (a line or two that explains; the rows prove; a worker's long report goes to the jarl), and `evidence` notes on stderr when a free-text note runs long. The field already credits Jarl's stderr notes with changing behaviour.

**W1.** Real, and the pseudo-file the coordinator proposed half-works today. Within one repository, two issues declaring `resource:gate` hold each other in `next` (probe A). Across repositories they do not, because a file is a (repository, path) pair, so a machine resource held by an issue in Grain does not hold one in Yggdrasil (probe B). And `check` reads the pseudo-file as a declared file and reports every real change as outside the issue (probe C); `queue` would batch on it too. So a resource is not a file: it gets its own header field, `Resources: gate, db`, loop-wide, which `next` treats the way it treats a file held by work in flight (with 249's held group naming the holder), and which nothing else reads. Two limits keep it honest. It holds for a lease's whole life, which is coarse: most contention for ports and a database server is the few minutes of a test run, and the real fix there is the repository's own test harness (free ports, a database per worktree), or a lock around the heavy command, which belongs to the workspace and not to Jarl ("Jarl does not run commands"; Althing's 275 already gives `ws run` such a lock). And it has no capacity, so "at most two heavy workers" stays the jarl's choice of how many workers to raise. Within those limits it stops two issues that both migrate one shared database from running at once, which nothing does today. 6.3.0: it is a new field, and 6.2.0's scope is the owner's.

**W2.** Real, and the cure the coordinator proposed is the retired one. `handoff write` writes nothing since 6.1.0, and that is right: the state is the live record, which `resume` assembles in under a second. The failure was not a missing handoff but a summary trusted over the record. Two changes: 250 adds the moment ("after a compaction, or any summary of your own context, you are starting a session: `resume` before the next action; a summary is not the state, and nothing it says outranks the record"); and the same sentence goes into the instructions Jarl's MCP server hands the host (`jarl-mcp.mjs:69`), which a host keeps in the session's standing instructions, so it survives the compaction that loses the skill. A plugin hook on compaction was considered: it would be specific to one host, and the server's instructions reach every host that runs the server. Althing's own skill for directing a release loop gets the same sentence, with `ws jarl resume`.

## Proposed changes

Release marks: **6.2.0** is inside the scope `jarl-6-2-0-scope` set on the owner's answer to a-002; **6.2.0, growth** goes beyond the architect's J1 to J9 texts and is the owner's word (one question can carry all of it); **6.3.0** is for the next release.

| Change | Repo | Release |
|---|---|---|
| AMEND 246: "a merge records the check that decided it" (A.4); takes field items 1 and 3; After 249 | JarlSkill | 6.2.0; the CI default and `--red` are growth |
| AMEND 247: back from deferred, the repositories entity (A.4); its deferred remainder dropped | JarlSkill | 6.2.0 (J7, first to set aside) |
| AMEND 251: repository checks for names and fingerprints; open issues citing a superseded ruling; After 247 | JarlSkill | 6.2.0 |
| AMEND 252: the marker is the format in `.jarl/profile.json`; `repos normalize` raises it | JarlSkill | 6.2.0 |
| AMEND 253: no repository lines; repositories are declared by `repos` | JarlSkill | 6.2.0 (optional, as before) |
| AMEND 244: `answer` takes several ratify ids with one verdict; `decide --supersedes` names the open issues citing the old slug | JarlSkill | 6.2.0, growth |
| AMEND 250: a compaction is a session start (and the same sentence in the MCP server's instructions, adding `jarl-mcp.mjs` to its Files); the reviewer after a round; asks as the owner's queue; what free-text evidence is for | JarlSkill | 6.2.0 (the server sentence is growth) |
| AMEND 257: `repos normalize` on the frozen copy of this loop, gates unchanged, Jarl 6.1.0 refusing the result | Althing | 6.2.0 |
| NEW: `show` prints a bounded issue by default, `--full` the file; a long free-text note is noted on stderr; After 248 | JarlSkill | 6.2.0 on the owner's word, else 6.3.0 |
| NEW: an issue declares exclusive resources (`Resources:`), loop-wide; `next` never offers two issues holding one | JarlSkill | 6.3.0 |
| NEW: work in flight says what it waits for (working, awaiting review, changes requested, approved and queued), derived; an unknown status like `ready` is refused with that view named | JarlSkill | 6.3.0 |
| NEW: Althing follows Jarl's repository names: `loop/shape` accepts names, `repos.md` and a format-only `profile.json`; `ws doctor` compares Jarl's resolution with `ws.local.json` and `--fix` writes the differences through `ws jarl repos locate`; `method/loops.md`, `method/environment.md` and the closing order (normalize between the close and the freeze); the paths rail's worktree allowance goes once no record holds a worktree path; After 247 | Althing | before the 6.2.0 freeze |
| NEW: Althing's skill for directing a release loop treats a compaction as a session start (`ws jarl resume` before acting) | Althing | now |
| RULING, not an issue: refine `jarl-pinned-in-loop`: after the close is logged, Jarl 6.2.0's `repos normalize` runs once on this loop and its equivalence check decides, then the freeze; with a ratify item | the loop | before the close |
| RULING: the new order of `jarl-6-2-0-scope` (A.4), with a ratify item | the loop | now |
| REJECT: a "ready for review" status (item 2) | | derivable; `ready` is a reserved view word |
| REJECT: a merged-but-red status (item 3) | | 246's `--red` records it without writing the repository's state into an issue |
| REJECT: `merged --ci local`, or Check read as CI (item 1) | | a label without proof; the bound check row is the proof |
| REJECT: sub-parts of an issue (item 4) | | After and packages are the parts |
| REJECT: `status --tag x` (item 5) | | `list --tag x --all` and `status --by tag` answer it |
| REJECT: `ask --defer`, an owner tag (item 6) | | asks are the queue; a tag would duplicate it |
| REJECT: a length limit on evidence (item 9) | | it would lose text; the bounded `show` removes the cost |
| REJECT: pushing harder to hand off (W2) | | handoff is retired; the cure is `resume` after a compaction |
