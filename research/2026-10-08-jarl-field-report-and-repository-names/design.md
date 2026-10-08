# Jarl: repository names, and a field report from a loop in another project

Written 2026-10-08 by the architect of Jarl. Read-only towards the loop and every tool repository: nothing in the 6.2.0 loop, in JarlSkill or in any other checkout was changed. Inputs: JarlSkill at `2c12aa3` (6.1.0, the driver `jarl-pinned-in-loop` pins); Althing at `0dbe5e3` (`AGENTS.md`, `method/loops.md`, `method/environment.md`, `family/registry.json`, the shape of `ws.local.json`, `workspace/README.md`, `releases/6.2.0/family.json`, the rails); the 6.2.0 loop read through `ws jarl` (279 issues, 2,003 log lines); the previous architect's plan `releases/6.2.0/plans/jarl-architecture-6.2.0.md`, which this design builds on; and the field report in [source.md](source.md). Line numbers are `JarlSkill/skills/jarl/scripts/jarl-lib.mjs` at `2c12aa3` unless another file is named. "Probe A" to "probe I" are runs of Jarl 6.1.0 on a scratch loop: [materials/probe.mjs](materials/probe.mjs), output in [materials/probe-output.txt](materials/probe-output.txt).

This is the revised design. The first version is [materials/design-v1.md](materials/design-v1.md). Three fresh critics read it, one on fidelity to the owner's intent ([A](materials/critique-a-fidelity.md)), one on technical soundness, who also tried to refute every claim about the code ([B](materials/critique-b-technical.md)), and one on the cost of maintaining it ([C](materials/critique-c-maintenance.md)). The last section answers every finding. The revision made the design smaller. It drops the per-machine override file, the migration command and the new `repos` command, and it records no worktree location at all.

## The short version

1. **A loop names a sibling repository by its name, never by a path.** The name is the directory `git clone` gives the repository, which is its name on its host and already the prefix of every Files entry. Jarl declares each named repository once, by itself, the first time an issue names it, in `.jarl/repos.md`: the name, its root commits, its origin and its base branch, and no path. A name resolves to the sibling of the loop's own main checkout, and the root commit decides whether the checkout found there is the right repository. A repository that is not a sibling keeps a path, as today. On a machine laid out differently, a symlink beside the loop's checkout is the override, and Jarl needs no code for it.
2. **The record holds no worktree location.** A lease is its branch, its worker and its moment. Git already knows which worktree holds a branch, so every view asks git, on whatever machine it runs.
3. **No migration command.** Paths keep reading for ever; a loop gets names from its next issue on. The format marker (252) goes into `.jarl/profile.json`, the one place Jarl 6.1.0 refuses loudly, and it rises before the first name is written.
4. **246 and 247 trade places.** 247, back from deferred, becomes the repositories entity; its title already names it. 246 keeps its own subject, the check per repository, and becomes "a merge records the check that decided it". That part needs no format change and takes two field items, so it should not slip with the names, the release's declared first item to set aside.
5. **The interim for this loop:** keep the Repo paths, which Jarl 6.1.0 needs and which hold no machine and no user; stop recording worktree paths now (briefs pass no `--worktree`, at no cost to the gate); and take the 217 worktree paths already in `log.md` out before Althing's first push (issue 266), by the equivalence-checked method of ruling `althing-move`. The record is then frozen as its driver wrote it, with `jarl-pinned-in-loop` and the manifest's pin intact. One question goes to the owner: may the relative sibling paths go public with that push?
6. **The field report.** Two items are real defects the 6.2.0 loop shows as well (CI is recorded as `none` on all 193 of its merges, although every tool repository has CI; and a red gate with an outside cause has no honest record). Both go into 246. Four items become new issues: a `show` bounded by the gate's window (it grows without limit, and 248 will make it grow faster), `status --tag`, declared exclusive resources, and in-flight marks derived from the record. Four become amendments to 244, 250 and 251. Seven requests are rejected, each with its reason.

## Part A. Naming a repository

### A.1 What the record holds today

| What | Where it comes from | In this loop |
|---|---|---|
| **Repo:** a path relative to the loop's root | `repoOf` resolves it from the root (:2203) and refuses anything that is not a repository's top (:2204-2208) | 278 of 279 issues; 9 single values (`../..` for Althing on 17 issues, `../../../<Name>` for the rest) and 6 lists over 19 issues |
| **Files:** each entry prefixed with the repository's directory name | `fileAt` and `prefixedIn` read the prefix as the basename of the resolved Repo path (:1496-1519) | every issue that names a repository |
| **Merged:** `<sha> in <path>` | the `--repo` value is written as given (:1375) | 34 of 193 Merged fields, and the same 34 merge lines in `log.md` |
| **Worktree:** an absolute path | `set --worktree` resolves the value against the root and stores the result (:1213) | 24 live leases; 217 lease lines in `log.md` (144 under a home directory's `.jarl-wt/`, 73 under the devcontainer's worktree root) |
| the base branch | whatever the checkout has checked out (`defaultBase`, :2231) | never written; read by `check`, `queue`, `tips`, `branches` |

No `--ran`/`--saw` row of this loop holds a machine path (counted over every issue file). The asks and the goal hold none. One ruling's prose names the driver checkout and the worktree root (`jarl-pinned-in-loop`, `decisions.md:149`), relatively and with `~`. It is testimony and stays as written.

Four things are wrong with it, and only one of them is the folder layout:

1. **A path says where, not which.** Any repository at `../../../Grain` is read as Grain. Nothing checks that it is one.
2. **A path relative to the loop encodes the loop's depth and the sibling layout.** The loop survived its move from the private repository only because the new directory sits at the same depth: the previous architect's point on 247, and ruling `althing-move`, which rewrote the paths once under an equivalence check.
3. **The worktree path is the one value that belongs to one machine:** a home directory with its user name, or the devcontainer's root. It is also the only reason Althing's paths rail carries an allowance (`rails/paths.mjs:7-31`).
4. **The base is implicit.** The previous architect called it the invisible one: if someone checks out `main` in a sibling checkout, every view computes against `main`.

### A.2 The design

The principle: **the record holds identity; the machine holds location; Jarl checks one against the other where it acts, and never guesses.**

**1. The name.** A repository's name is the directory `git clone` gives it, which is the repository's name on its host (`JarlSkill`, `Grain`, `Althing`). There are three reasons. Every Files prefix in this loop is already exactly that name, so no Files entry changes. The name belongs to no machine: it is the repository's public name. And on a machine that keeps the family's sibling layout it resolves with no configuration at all. The registry's keys (`jarl`, `grain`) are not used. Jarl is a general tool and cannot read Althing's registry; the keys would rewrite every Files entry; and resolving `jarl` to a checkout called `JarlSkill` would need a map only Althing holds. The mapping the other way is mechanical: a registry entry's `github` value ends in the name.

**2. The declaration.** Jarl writes `.jarl/repos.md` itself, one line per repository, the first time an issue names that repository. Each write adds a log line, and no command exists to declare a repository by hand:

```
- **Grain** · roots 3a1f… · origin github.com/krzysztofdudek/Grain · base release/6.2.0
```

The line holds:

- the name;
- the root commits of the base. A repository can have several (Horde has two), and all are kept.
- the origin as found, for information only;
- the base branch, taken from the checkout at the moment it is declared and changed with `repo --base <name> <branch>`, with a log line.

It holds no path. An issue with no Repo is read exactly as today: in the loop's root (:2199). An issue that names the loop's own repository (Althing's issues do) names it like any other.

The declaration does not go in `goal.md`, as 246's acceptance had it. `goal.md` is the owner's charter, amended only on his word, and a repository joining a loop is routine: this loop took in three add-on repositories in one afternoon. The check stays in `goal.md` (`Check (Grain): …`, A.4), because what decides a landing is a rule of the loop, which is what the charter holds.

**3. Resolution.** A name resolves to the sibling of the loop's own main checkout: `<parent of the main checkout>/<name>`. The main checkout is the top of the repository holding the root, found through git's common directory, so a loop opened in a linked worktree still finds its siblings beside the main checkout and not under the worktree root. The loop's own repository resolves to its main checkout directly. Nothing else is consulted:

- **A machine laid out differently** puts a symlink beside the loop's checkout. Jarl reads repositories through their canonical path (:1492-1494), so the symlink is the override, and Jarl needs no code for it. A file of per-machine overrides is left out of 6.2.0. Ruling `jarl-6-2-0-scope` moved "per-machine path overrides" out, and the previous architect advised waiting "until a loop actually runs from two machines". If the owner wants such a file now, it is growth and his word.
- **Identity is the root commit.** It is checked only where Jarl acts on a repository (`check`, `merged`, `repo`, `new --repo`, `import --repo`) and in `verify`, never in the read-only views, so `resume` adds no git calls. A checkout whose roots include a declared root is the repository. A shallow checkout (`git rev-parse --is-shallow-repository`) cannot show its roots, so it is not refused; its state reads unverified. A different origin (a fork, a renamed repository, SSH against HTTPS) is a note, never a refusal. Two clones of one repository cannot be told apart by any fingerprint; the convention picks the sibling.
- **A name that does not resolve**, or resolves to another repository, is shown with its fix: put the checkout, or a symlink to it, at `<parent>/<name>`. The commands that act refuse it; the views carry on and mark it, as `loopRepos` already tolerates a path that does not resolve (:2340-2354).

**4. Writing, and reading by format.** `--repo` takes a name, a checkout, a worktree or a file inside a repository. A path is reduced to its main checkout through git's common directory; today a worktree path passes as a repository of its own (the previous architect's 247 (a)). Then there are two cases:

- **The checkout sits where the convention looks for its name.** Jarl stores the name and declares the repository if it is new.
- **It does not.** Repo keeps the path, as today, and a stderr note says why. Two repositories sharing a directory name can never both be siblings, so the second keeps its path, and SKILL.md's promise that they are told apart (`SKILL.md:419`) holds.

How a value is read depends on the loop's format, never on the value's shape:

- In a loop of the old format every value is a path, as in 6.1.0.
- In a loop of the new format, a value that starts with `.` or `/` (or a drive letter) is a path, and anything else is a name.

The first write that stores a name raises the format before it writes the name, under the same lock. A bare-word path from before (a format-1 `Grain` meaning `<root>/Grain`) is rewritten as `./Grain` in that same write: the same location, said unambiguously. The Files prefix rule and the rule for a repository holding a directory of its own name (:1485-1488) stay as they are. Merged's `in` part follows Repo. `repo` gains the log line it lacks today (cmdRepo writes none).

**5. Worktrees.** The record holds no worktree location. A lease is its Branch, Worker and Since. Git allows a branch to be checked out in at most one worktree of a repository, so `git worktree list --porcelain`, asked in each repository the issue names for the lease's branch, gives one answer on the machine at hand. That is the state 241 reshapes the views onto:

- here;
- listed but not visible from here (prunable with its parent missing, which is the state of the devcontainer's worktrees seen from the host);
- elsewhere, for a worktree locked with a reason;
- no worktree holds the branch.

`set --worktree <path>` keeps working, as a check only. When the path exists, it must be a worktree of one of the issue's repositories with the lease's branch checked out, or the call is refused: today nothing catches a worker raised in the wrong checkout (probe G stores whatever it is given). Nothing is stored. A lease from before keeps its Worktree field and is read as today until it ends. The done gate is untouched: it reads a lease line's worker up to the ` · worktree ` separator or the end of the line (:1766).

**6. Finding the real checkout.** No new command is needed.

- `show` prints, beside Repo, each repository's checkout on this machine and its state, and for a lease, the worktree git has on its branch, on stdout only. `show --json` carries the same answers as `where`.
- `status --by repo` prints each repository's checkout, its base and whether the checkout is on it (a warning only, as the previous architect set it for 6.2.0), and its state.
- `resume`'s tips already list each repository's branches.

Nothing resolved is ever written. A brief takes its paths from these, or, in Althing, from `ws brief`, never by joining the root and a Repo value. "Agents know where to look" then means that the calls every role already makes answer the question on the machine where that role runs.

**7. The format.** A loop that holds names is a newer record format. Jarl 6.1.0 refuses a bare name on write (probe H: `repo 004 r2` is refused as "not a git repository"). It reads a name written into a file as a directory under the loop, silently: `status --by repo` and `next` go on as if nothing were wrong (probe H). The only place Jarl 6.1.0 reads and refuses loudly is the profile's `format` key. Every command that loads issues loads the profile first (:572), and the format is checked before anything else (:307-308), ahead of the `statuses` the rest of the check requires (probe I: `list` and `status` are both refused). So 252's marker is `.jarl/profile.json` holding only `jarl-profile` and `format`. Jarl 6.2.0 must accept a profile that holds only those two, and read it as the built-in profile (`declared: false`), so that `status --json`, the headers, `report`, `import` and the issue reader keep their shapes (:580, :1586, :3034, :3152, :3277, :3367). Any write that stores the first name raises the format (point 4), not a migration step. The contract: `record.mjs:62` lists the profile's `format` as contract, with the value 1. Whether a second value bumps `jarl-record` is the contract policy the previous architect left to the owner (his section 4, "For the owner's word", 2). Horde's missions name no Repo and stay format 1.

**8. Althing.** `ws.local.json` stays the one home of where this machine's checkouts are. Jarl reads no copy of it, because on a machine that keeps the documented layout the convention gives the same paths. `ws doctor` gains two read-only comparisons:

- each repository the open loop names (paths today; `ws jarl status --by repo --json` once the loop runs on Jarl 6.2.0) against `ws.local.json`. A difference is named, and the fix is the layout or a symlink.
- each declared base and Check line of the loop against the release manifest's `branch` and `check`, so that the base and the check keep one home, the manifest, and the loop mirrors it.

Two rail changes follow:

- `loop/shape` today accepts a relative path or a registry key (`rails/loop.mjs:41-44`). It must accept the names instead (the last segment of each registry entry's `github`, and `Althing`), plus `repos.md` and a format-only `profile.json`. That change lands before the first commit that carries them, which is the opening of the 6.3.0 loop.
- The paths rail's worktree allowance goes once no lease line or field holds a path (A.5).

**9. No migration command.** The first version had `repos normalize`, a permanent command with an equivalence engine, written for about one loop. Paths read for ever, single-repository loops and loops kept out of git never need it, and a loop gets names from its next issue on. A loop that wants an open issue to carry a name re-points it with `repo <id> <name>`. That is a logged header change, and the gate never reads Repo. Old log lines are testimony, like evidence rows, and are left as written. Two parts of 247 are dropped, not carried to 6.3.0: discovering moved repositories among siblings, and checking that declared files exist on the loop's branch. With names, a moved loop needs nothing, a moved checkout needs a symlink or a move, and the root-commit check says which. An existence check is noise for every issue that creates a file. The drop is a ruling that names both, so nothing leaves the record in silence.

### A.3 What was considered and set aside

| Alternative | Why not |
|---|---|
| Paths relative to the loop's repository instead of the loop (`../Grain`) | Removes the depth, keeps the layout; still no identity |
| Absolute paths per machine, kept in the record | Commits every machine's layout and user names to a public record |
| The registry's keys as names | Couples Jarl to Althing; rewrites every Files entry; needs a map only Althing has |
| An environment variable naming each checkout | Each process has its own environment, so the MCP server and the CLI could disagree |
| A per-machine override file (`.jarl/local.json`, version 1) | Moved out by `jarl-6-2-0-scope`; a symlink does the same with no code; a second home for `ws.local.json`'s fact; a `.gitignore` migration for every committed loop |
| A migration command (`repos normalize`, version 1) | A permanent command for about one loop; paths read for ever |
| The worktree recorded by its name (version 1) | Git allows two worktrees with one name; the branch already identifies the worktree uniquely |
| The origin as identity | Refuses forks, renamed repositories and SSH against HTTPS; Althing has no origin yet |
| Names in `goal.md` (246's text today) | The charter is the owner's; routine declarations do not belong under his word |

### A.4 246, 247 and the issues around them

The ruling `jarl-6-2-0-scope` set J7 as "repositories as an entity (246 with the core of 247)" and made J7 the first item to set aside. Part of 246 is not the entity at all: the per-merge check row, which the previous architect called 246's core, and the field's two merge items (B.2, items 1 and 3). None of these needs names or a format change. Jarl 6.1.0 reads `Check (Grain): …` as no check, which is the benign direction, and it reads a merge line through its field when the line carries no CI state (:1998). Tied to J7, they would slip with it. So the two issues trade contents, and each title then says what its issue does. 247's title ends "and finding moved ones": the root-commit check finds a wrong or moved checkout and names the fix, which is what remains of that clause.

**246 becomes "a merge records the check that decided it".** Its acceptance:

- `Check (<name>): <command>` lines in `goal.md` name the command each repository's check runs, `<name>` being the repository's name as its Files prefix writes it; a bare `Check:` line keeps its meaning today.
- `merged <ids> --sha <sha> --ran "<check>" --saw "<summary>"` records the merge and the check that decided it in one call: the evidence row as today, and a merge line that names its check. `--red <id>` records instead a merge that landed while its check was red for a cause outside the branch, which issue `<id>` (it must exist) tracks.
- Whether a repository lands on its check is derived from these rows, no longer from a declared line. A hand-added `Check:` line can flip today's banner for hundreds of issues with no merge proving anything (the previous architect's divergence 6). `status --by repo` and `report` show, per repository, how many merges carry a passing check, landed on red (with the cause), or carry none (every merge from before this change). `init` says once that a loop with no check lands on testimony. Nothing refuses `done` for a missing or a red check ("What Jarl will not grow", item 2).
- `merged --sha` records CI only when `--ci` is given; there is no default `pending`. `pending` means a pushed commit whose CI will report, and only that state makes `status` count "CI pending" and `done` note it. `done` no longer notes "CI not recorded" for a merge that carries a passing check (:1318). SKILL.md's two descriptions of the old default change with it (`SKILL.md:84`, `:190`).
- The merger's brief: on green, one `merged --sha --ran --saw` call. A red whose cause lies outside the branch is not a `round`: rounds count the worker's failures, and the third raises a takeover. The cause is filed as its own issue, and the branch stays approved in the queue until the check is green, or lands with `--red <cause>` on the jarl's ruling.
- Tests:
  - a merge with a passing check, one landed on red and one with no check row, in a loop of one repository and one of several;
  - a merge line with no CI state counted by 6.2.0's metrics, and by Jarl 6.1.0 through the Merged field (:1998);
  - a loop from before the change reads its merges as "no check row recorded", never as failed.
- After: 249 instead of 252.

**247 comes back from deferred and becomes the repositories entity of A.2.** Its acceptance:

- A repository an issue names is declared by Jarl, once, in `.jarl/repos.md` (name, roots, origin, base) with a log line, holding no path; `repo --base <name> <branch>` changes a base with a log line; `repo` logs every change.
- A name resolves to `<parent of the loop's main checkout>/<name>` (the main checkout found through git's common directory). The root commit is checked by the commands that act and by `verify`, with an unverified state for a shallow checkout and a note, never a refusal, for a different origin. A name that does not resolve, or resolves to another repository, is shown with its fix, refused by the commands that act, and marked by the views.
- `--repo` takes a name, a checkout, a worktree or a file. It stores the name where the checkout sits at the convention's place, and the path otherwise. The loop's format decides how a value is read, and the first write of a name raises the format first (252), rewriting any bare-word path as `./<word>`.
- No worktree location is recorded. Views ask git for the worktree holding the lease's branch in each of the issue's repositories, with 241's states; `set --worktree` checks the path and stores nothing.
- `show`, `show --json` and `status --by repo` print where each repository and the lease's worktree are on this machine; nothing resolved is written.
- Tests:
  - a loop over two sibling repositories gets names, and keeps a path for a third that is not a sibling;
  - a symlink beside the loop's checkout resolves a name;
  - a checkout of another repository under the right name is refused by its roots;
  - a fork with another origin passes with a note, and a shallow clone reads unverified;
  - a loop opened in a linked worktree resolves its siblings beside the main checkout;
  - a lease's worktree is found by its branch, including one git lists as prunable;
  - the real loop through `JARL_LIVE_LOOP` when it is set (269).
- Not here: a per-machine override file (moved out by `jarl-6-2-0-scope`), a migration command, discovery of moved repositories and per-file existence checks (A.2, 9).
- After: 252 (and 241, by the order).

**The neighbours.**

- **251** (`verify`) checks, for repositories:
  - a name with no declaration;
  - a declared repository that does not resolve on this machine;
  - roots that do not match, with a different origin as a note;
  - field item 7: open issues whose What, Why or Acceptance cite a superseded ruling.

  It does not flag a path, which stays valid. After 247 instead of 246.
- **252** (format marker): the marker is `.jarl/profile.json` holding only `jarl-profile` and `format`, read as the built-in profile with `declared: false`. Any write that stores the first name raises it before writing. The test is Jarl 6.1.0 refusing the result.
- **253** (`goal` command): it sets the Check and Coordinators lines; repositories are declared by Jarl itself.
- **257** (Althing, frozen copies): unchanged. With no migration, Jarl 6.2.0 reads the frozen 6.2.0 loop as written, and 6.1.0 refuses a loop that 6.2.0 wrote with names (252). That is already 257's acceptance.
- **The order** of `jarl-6-2-0-scope` becomes J1 241 → J2 248 → J3 245 → J4 249 → 246 → J6 252 → J7 247 → J5 251 → J8 244 → J9 250, with 253 after 246 if it goes in. It is the jarl's ruling under the mandate, with a ratify item, and that item spells out what changes against what the owner approved in a-002:
  - 246 leaves the bucket that is first to set aside;
  - 246 gains the CI default, `--red` and the derived landing (growth);
  - 247 returns from deferred;
  - two parts of 247 are dropped;
  - per-machine overrides stay out.

### A.5 The interim for this loop

The timing decides it. Althing has no remote yet. Its first push is issue 266 of this loop, the owner's word, and it goes out as one squashed commit. That push comes before this loop can close, because the loop closes only when 266 is done. Whatever the record holds at that moment becomes public for good. Whatever is rewritten before it never does.

1. **Now: stop recording worktree paths.** The briefs pass no `--worktree`. This needs no code. Jarl 6.1.0's gate reads the worker up to the end of the line (:1766). The worktree's only reader is the "worktree gone" warning (:2395), which is wrong for the devcontainer's worktrees anyway, and `branches` reads worktrees from git (:2466). A lease gives the branch, and `git worktree list` gives the place.
2. **Before 266: the worktree paths already written leave the record.** This is one rewrite under a ruling with a ratify item, by the method of `althing-move`. The `· worktree <path>` tail of each of the 217 lease lines becomes `· worktree <its last segment>`, and a Worktree field still on a live lease is removed. Jarl 6.1.0's library, imported directly, must show zero difference before and after in every issue's gate state, its header fields other than Worktree, its evidence rows, and in `status`, `next`, `report` and `list`. The precondition is that no other copy of the loop's log is in flight: the log merges by union, and only `main` carries this loop. After it, the paths rail's worktree allowance can go, as a new version of the rule, which is the owner's to ratify.
3. **The Repo paths stay.** Jarl 6.1.0 needs them, and they hold no machine and no user: they spell the sibling layout that `method/environment.md` already publishes. A bridge that keeps 6.1.0 working is rejected. The only such bridge is an ignored directory of symlinks, one per repository, with Repo values pointing into it. It would migrate the gate's event store twice, add a per-machine step whose absence turns every repository command into "not a git repository", and remove nothing a reader could not already learn from `method/environment.md`.
4. **The record is frozen as its driver wrote it.** `jarl-pinned-in-loop` and the manifest's pin stay whole, and every later Jarl reads the record, because paths read for ever. The 6.3.0 loop, on Jarl 6.2.0, writes names from its first issue. The first version proposed converting this loop after its close. That reverses two sentences of the pin ("We check Jarl 6.2.0 on frozen copies of this loop, not on the loop itself"; "The first loop on 6.2.0 is the next release"), needs the manifest's pin moved, and would leave `ws jarl` unable to read its own frozen record. That is too much exception for the text of a closed record.
5. **The owner's question.** The design concludes that the relative paths are the family's documented layout and not one machine's. The owner's request reads them as layout to remove, so the difference goes to him rather than being settled here. The options:
   - **(a)** The relative sibling paths go public with the first push; from 6.3.0 on, loops carry names. This is the recommendation.
   - **(b)** The first push waits until the 6.2.0 loop has closed and been converted to names. That needs the conversion above, with its two pin exceptions, and delays everything that waits on 266, such as the READMEs' Althing sentence (267 to 274).

## Part B. The field report

### B.1 What works well

Every item the coordinator praised is what the previous architect called the product: the record and its one hard gate. Two need a word:

- "Root on every call and refusal of relative paths" is the property the repositories design keeps: every role resolves through the loop under `root`, and the record holds no machine value to disagree about.
- "After blocking next" is the property 249 sharpens.

Nothing to change.

### B.2 The items, checked

| # | Item | Real? | Already covered? | Decision | Release |
|---|---|---|---|---|---|
| 1 | "CI pending" forever when nothing is pushed | Yes: `merged --sha` defaults to `pending` (:1345; probe E); this loop recorded `CI none` on all 193 merges although all five tool repositories have CI | `--ci none` exists but says "no CI to wait for", which is false | AMEND 246 (no default `pending`; the check row bound to the merge is the local gate's proof) | 6.2.0, growth inside 246 |
| 2 | No "ready for review" state | Yes: `set ready` is refused (:1192; probe D) | Partly: `queue` shows approved branches | REJECT the status; NEW: in-flight marks derived from the record | 6.3.0 |
| 3 | Merged, gate red for an outside reason | Yes: no honest record, and the merger's only move is a `round`, which charges the worker | No | AMEND 246 (`--red <cause>`; an outside red is not a round) | 6.2.0, growth inside 246 |
| 4 | `show` huge | Yes: `show` prints the file verbatim (`jarl.mjs:481`); 248 will add every review's full findings to it | No | NEW: `show` bounded by the gate's window by default, `--full` for the file | 6.2.0 on the owner's word (pairs with 248), else 6.3.0 |
| 5 | `status --tag x` | Yes: `status --by tag` prints 104 lines on this loop, 66 of them one per tag, and `list --tag` gives no scoped in-flight, stale or CI view | No | NEW: `status --tag <t>` | 6.3.0 |
| 6 | Background queue of owner decisions | Partly: answering is one ask per call (`jarl.mjs:338`) | Yes: asks are that queue (`ratify` blocks nothing, `stuck --issue` holds one issue, both listed by `status` and `resume`) | AMEND 244 (one verdict for several ratify items); AMEND 250 (docs); REJECT `ask --defer` and an owner tag | 6.2.0 (244 is growth) |
| 7 | Acceptance citing a superseded ruling | Yes: nothing ties a ruling's supersession to the issues that cite it | No | AMEND 244 (`decide --supersedes` names the citing open issues); AMEND 251 (`verify` reports them) | 6.2.0 (the 244 part is growth) |
| 8 | Same fresh reviewer after a round? | The code is clear: yes (probe F); the skill's "fresh one-shot reviewer" is not | n/a | AMEND 250 (one sentence) | 6.2.0 |
| 9 | Long free-text evidence | Yes: free text is appended whole and only its first line reaches the log (:1473) | No | REJECT a length limit; the bounded `show` (item 4) and 250's docs carry it | with item 4 |
| W1 | Shared resources collide | Yes, and a pseudo-file half-works: it holds within one repository (probe A), not across two (probe B), and as an issue's only declared file it fails `check` (probe C) | No | NEW: a declared exclusive resource that `next` respects, loop-wide | 6.3.0 |
| W2 | Compaction: summary trusted over the record | Yes; the skill says nothing about compaction | Handoff is retired; `resume` is the live state | AMEND 250 (a compaction is a session start) plus one sentence in the MCP server's instructions; NEW in Althing for its own skill | 6.2.0 (the server sentence is growth) |

**Item 1.** Real, and the 6.2.0 loop shows it from the other side. To keep `status` from saying "CI pending" for ever, its merger recorded `CI none` on all 193 merges. That value means "this repository has no CI", yet Runes, Yggdrasil, Grain, JarlSkill and Horde all run CI on GitHub. Both workarounds put a false statement in the record. The cause is a default: `merged --sha` without `--ci` writes `pending` (:1345). A merge into a branch that is not pushed has no CI run to wait for, and when the branch is pushed later, CI runs on its tip, not on each merge. `ciOf` reads runs for the exact commit (:2512), so most merges' `pending` can never resolve. The fix is not a new CI value: `--ci local` would assert something without proof. It is to keep the two facts apart. The local gate's verdict is the check row bound to the merge (246), and CI is recorded only when someone knows a run will report. `tips` already reads the CI of a pushed tip. Horde passes `ci: 'none'` explicitly (Horde `skills/horde/scripts/loop.mjs:143`) and is unaffected.

**Item 2.** Real, but a status is the wrong answer: it is one more write a worker can forget and one more thing to go stale. The word the worker reached for is also taken: `ready` is a reserved view word in Jarl (:293), meaning "ready to start" in `next`. What the record does know are facts. The in-flight rows in `status` and `resume` can carry them, without guessing intent:

- no rows since the start;
- rows since the start, and no verdict since the last restart or round;
- changes requested;
- approved and queued.

A worker who records rows partway through its task shows as "rows, no verdict", which is true. `set` refusing an unknown status such as `ready` or `review` then names that view, and says that a loop which wants an explicit review state can declare one in its profile. Not urgent: 6.3.0.

**Item 3.** Real. The merger's brief knows only "red, roll back, `round`" (SKILL.md, the merger, step 3). A red that is not the branch's fault is charged to its worker, and three of them raise a takeover of work that was right. The state the coordinator missed already exists once it is named: an approved branch that waits in the queue until the gate is green again. `round` spends the approve (:1842), and a plain rollback does not. Two things are missing. One is the rule: an outside red is not a round, and its cause is an issue. The other is an honest record for the rare merge that lands on red anyway, on the jarl's ruling: `--red <cause>`, never counted as a passing check. A status for "landed but the base is red" was rejected, because it would write the repository's state into an issue.

**Item 4.** Real, and 6.2.0 will make it worse. 248 writes every review's full findings into the issue, and the worker's brief pastes the issue whole (`SKILL.md:456`), so a takeover after three rounds carries three full reviews into a fresh worker's context. The fix is a `show` bounded by the gate's own window. It prints in full:

- the header, What, Why, Acceptance and Changelog;
- every `--ran`/`--saw` row and every verdict since the last start or reopen, which is what the done gate counts;
- every `changes` finding no later approve has answered.

Earlier rounds are summarized in one line each, and the output ends with the exact call that prints everything, `show <id> --full`, the file verbatim. `show --json` stays complete. A bounded default, rather than an opt-in `--brief`, follows the previous architect's lesson (his section 3.1): agents skip what they have to remember to ask for. The bound is the gate's window, not a fixed count, so a reviewer always sees every row the gate counts, and a worker taking over always sees what is still open. The worker's brief then pastes `show`'s output. Sub-parts of an issue are rejected: issues with After, or a package on one branch, are the parts. Recommended for 6.2.0 because 248 is in it; that is growth and the owner's word.

**Item 5.** Real: `status --by tag` prints 104 lines on this loop, 66 of them one per tag, and `list --tag x` gives the issues but not the in-flight, stale, waiting and CI sections `status` computes. `status --tag <t>` scopes `status` to the issues carrying the tag. That is one flag on one view, reusing everything `status` already computes. 6.3.0.

**Item 6.** Mostly covered, by a feature both field jarls under-used:

- A decision the jarl may take provisionally is `decide` plus `ask --kind ratify --issue NNN`. It blocks nothing, `status` counts it, `resume` lists it, and it waits for the owner as long as he needs.
- A question the jarl cannot settle is `ask --kind stuck --issue NNN`, which holds only that issue (in `next`, once 249 lands).

That is the background queue the coordinator wanted, linked to issues. A tag would duplicate it, and `ask --defer` would add a kind to a closed set for no new behaviour. What is really missing is cheap answering. When the owner looks at eight ratify items and says yes to all of them (this loop's ruling `ask-015` is that case), `answer` takes one id per call. 244 should let `answer` take several ratify ids with one verdict, one ruling each, each naming the batch it was answered in. 250 should say in one place how a jarl works with an owner who is rarely there. The tag this loop uses, `needs-owner`, marks work that needs his hands (a push, a publish), not questions, and stays.

**Item 7.** Real: nothing ties a ruling's supersession to the issues whose acceptance cites it. The right moment is the supersession itself: `decide --supersedes <slug>` prints on stderr the open issues whose What, Why or Acceptance name the old slug, so the jarl rewrites them at once (244 already reshapes `decide`). `verify` (251) reports any that remain. `check` is the wrong place: it reads a branch's diff, not the record.

**Item 8.** The code answers it. After a round, an approve by the reviewer of the earlier round counts as fresh and closes the issue: in probe F, `review 005 approve --by rev-a` after a round logs `(fresh)`, and `set 005 done` passes. The skill's "fresh one-shot reviewer" leaves the reader unsure. One sentence in 250 settles it: the gate counts the earlier reviewer as fresh, and the loop's practice, for quality, is a new one-shot reviewer for each round, handed the earlier findings to check.

**Item 9.** A limit is rejected: it would refuse or cut text, against 248's rule that no command loses text it was given. The cost the coordinator describes is reading cost, which the bounded `show` removes. 250 says what free text is for: a line or two that explains, while the rows prove, and a worker's long report goes to the jarl. `evidence` also notes on stderr when a free-text note runs long; the field already credits Jarl's stderr notes with changing behaviour.

**W1.** Real, and the pseudo-file the coordinator proposed half-works today:

- Within one repository, two issues declaring `resource:gate` hold each other in `next` (probe A).
- Across repositories they do not, because a file is a (repository, path) pair (probe B).
- As an issue's only declared file it makes `check` report every real change as outside the issue (probe C; next to real files it passes, :2300).

A resource is therefore not a file. It gets its own header field, `Resources: gate, db`, loop-wide. `next` treats it the way it treats a file held by work in flight, and 249's held group names the holder. Nothing else reads it.

Two limits keep it honest. It holds for a lease's whole life, which is coarse: most contention for ports and a database server is the few minutes of a test run, and the real fix there is the repository's own test harness (free ports, a database per worktree), or a lock around the heavy command. That lock belongs to the workspace, not to Jarl ("Jarl does not run commands"), and Althing's 275 already gives `ws run` one. And it has no capacity: "at most two heavy workers" stays the jarl's choice of how many workers to raise.

Critic C asked to wait for a second request, since After already orders two issues. After cannot say "either order, but not together" for more than two issues without inventing an order. Althing has the same need by hand ("one heavy run at a time", `method/environment.md`). Kept, for 6.3.0, at the lowest priority.

**W2.** Real, and the cure the coordinator proposed is the retired one. `handoff write` writes nothing since 6.1.0, and that is right: the state is the live record, which `resume` assembles in under a second. The failure was not a missing handoff but a summary trusted over the record. Two changes follow:

- 250 adds the moment: "after a compaction, or any summary of your own context, you are starting a session: `resume` before the next action; a summary is not the state".
- The same sentence goes into the instructions Jarl's MCP server hands the host (`jarl-mcp.mjs:69`). Hosts keep those in the session's standing instructions, so the sentence survives the compaction that loses the skill.

A plugin hook on compaction was considered. It would serve one host only, while the server's instructions reach every host that runs the server. Althing's own skill for directing a release loop gets the same sentence, with `ws jarl resume`.

## Before you upgrade (Jarl 6.2.0, from this design)

- `merged --sha` no longer writes CI `pending`; give `--ci pending` when a pushed commit's CI will report.
- `show` prints the gate's window; scripts and briefs that need the whole file use `show --full` (`--json` is unchanged).
- A loop's first repository name raises its record format: Jarl 6.1.0, including a 6.1.0 MCP plugin, refuses the loop after that, loudly.
- Repo holds a name for a sibling repository; a repository elsewhere keeps its path; a machine laid out differently puts a symlink beside the loop's checkout.
- New leases record no worktree path; views ask git.
- The merge line names its check; a loop's landing on its check is derived from those rows, not from a `Check:` line.

## The docs budget

The design adds to SKILL.md:

- the repositories rule (one paragraph, replacing the four places the rules for several repositories live today);
- the merger's check row and outside red (two sentences in the merger's brief);
- the bounded `show` (one row);
- four sentences in 250.

It removes the Worktree field's description and the `pending` default. 250's restructure moves the reference half out (the previous architect's section 3.7). Its acceptance should carry a number: the operating manual's main path is smaller after the release than the 104.6 KB of today.

## Proposed changes

Release marks:

- **6.2.0** is inside the scope `jarl-6-2-0-scope` set on the owner's answer to a-002.
- **6.2.0, growth** goes beyond the previous architect's J1 to J9 texts and is the owner's word; one question can carry all of it.
- **6.3.0** is for the next release.

| Change | Repo | Release |
|---|---|---|
| AMEND 246: "a merge records the check that decided it" (A.4): per-repository Check lines, `merged --ran/--saw` binding, landing derived from rows, no default `pending`, `--red <cause>`, an outside red is not a round; After 249 | JarlSkill | 6.2.0; the CI default, `--red` and the derived landing are growth |
| AMEND 247: back from deferred as the repositories entity (A.4): names for siblings, `repos.md` written by Jarl, root-commit identity where Jarl acts, format decides reading, no worktree location, locations printed by `show` and `status --by repo`; no override file, no migration command, the deferred remainder dropped | JarlSkill | 6.2.0 (J7, first to set aside) |
| AMEND 251: repository checks by name and roots (origin a note), no flag on paths, open issues citing a superseded ruling; After 247 | JarlSkill | 6.2.0 |
| AMEND 252: the marker is a format-only `.jarl/profile.json` read with `declared: false`; raised by the first write of a name, before it | JarlSkill | 6.2.0 |
| AMEND 253: no repository lines; Jarl declares repositories itself | JarlSkill | 6.2.0 (optional, as before) |
| AMEND 244: `answer` takes several ratify ids with one verdict; `decide --supersedes` names the open issues citing the old slug | JarlSkill | 6.2.0, growth |
| AMEND 250: a compaction is a session start (and the same sentence in the MCP server's instructions, adding `jarl-mcp.mjs` to its Files); the reviewer after a round; asks as the owner's queue; what free-text evidence is for; the main path smaller than today | JarlSkill | 6.2.0 (the server sentence is growth) |
| NEW: `show` bounded by the gate's window by default, `--full` the file; a long free-text note noted on stderr; After 248 | JarlSkill | 6.2.0, growth (pairs with 248), else 6.3.0 |
| NEW: `status --tag <t>` scopes status to one tag | JarlSkill | 6.3.0 |
| NEW: declared exclusive resources (`Resources:`), loop-wide; `next` never offers two issues holding one | JarlSkill | 6.3.0 |
| NEW: in-flight rows carry derived facts (no rows yet; rows, no verdict; changes requested; approved and queued); an unknown status such as `ready` is refused with that view named | JarlSkill | 6.3.0 |
| NEW: the worktree paths leave the 6.2.0 record before the first push: the briefs pass no `--worktree`; the 217 lease lines rewritten and live Worktree fields removed, with Jarl 6.1.0's library showing no difference; the paths rail's worktree allowance retired (a new rule version, for ratification) | Althing | before 266 |
| NEW: Althing follows Jarl's names: `loop/shape` accepts names, `repos.md` and a format-only `profile.json`; `ws doctor` compares the loop's repositories with `ws.local.json`, and its bases and Check lines with the manifest; `method/loops.md` and `method/environment.md` say how a loop names repositories | Althing | before the 6.3.0 loop opens |
| NEW: Althing's skill for directing a release loop treats a compaction as a session start (`ws jarl resume` before acting) | Althing | now |
| RULING, with a ratify item: the new order of `jarl-6-2-0-scope`, 246 and 247 trading places, 247's remainder dropped, per-machine overrides kept out (A.4) | the loop | now |
| RULING, with a ratify item: the pre-push rewrite of the worktree paths, by the method of `althing-move` | the loop | before 266 |
| ASK the owner: may the relative sibling Repo paths go public with the first push (A.5, 5) | the loop | before 266 |
| REJECT: a "ready for review" status (item 2) | | a write that goes stale; `ready` is a reserved view word; the facts are derivable |
| REJECT: a merged-but-red status (item 3) | | 246's `--red` records it without writing the repository's state into an issue |
| REJECT: `merged --ci local`, or a Check line read as CI (item 1) | | a label without proof; the bound check row is the proof |
| REJECT: sub-parts of an issue (item 4) | | After and packages are the parts |
| REJECT: `ask --defer`, an owner tag (item 6) | | asks are the queue; a tag would duplicate it |
| REJECT: a length limit on evidence (item 9) | | it would lose text; the bounded `show` removes the cost |
| REJECT: pushing harder to hand off (W2) | | handoff is retired; the cure is `resume` after a compaction |

## Revision after critique

Every finding of the three critiques, and what it changed. "Taken" means the design now does what the finding asks; "answered" means the finding is right about a gap and the design closes it another way; "kept" means the design holds its position, for the reason given.

| Finding | What changed |
|---|---|
| A-C1: the override file brings back what `jarl-6-2-0-scope` moved out; dropping 247's remainder needs a ruling | Taken. No override file; a symlink is the override (A.2, 3). The drop is part of the order ruling, with a ratify item (A.4) |
| A-I1: the first push comes before the close, so the interim lets the worktree paths go public | Taken. The interim is built around 266 (A.5) |
| A-I2: not passing `--worktree` is a free interim; the disagreement about relative paths is the owner's | Taken. Step 1 of A.5 and the owner's question in A.5, 5 |
| A-I3: converting after the close reverses the pin | Taken. No conversion; the record freezes as written (A.5, 4) |
| A-I4: the swap changes what the owner approved, and the ruling must show it | Taken. The order ruling lists every change (A.4) |
| A-I5: the rejection of `status --tag` misread the request | Taken. NEW for 6.3.0 (item 5) |
| A-I6: base and check would have two homes | Answered. `ws doctor` compares them with the manifest, which stays their home (A.2, 8) |
| A-I7: rewriting the log overrides a written method line | Answered. Only the pre-push rewrite touches the log, by `althing-move`'s precedent and under a ruling; with no migration command, Jarl itself never rewrites it |
| A-M1: a worker taking over would miss open findings | Taken. The bound keeps every unanswered `changes` (item 4) |
| A-M2: the rejection count was wrong | Taken. Seven rejected, four new issues, counted in the short version |
| A-M3: rewriting the Check lines amends the goal | Answered. This loop keeps its lines (it stays on 6.1.0); the 6.3.0 loop is opened with the new form |
| A-M4: `findings.json` was missing | Taken |
| B-1: the format was raised last, and a bare word is both a path and a name | Taken. The format decides how a value is read, and rises before the first name (A.2, 4) |
| B-2: after a conversion, `ws` cannot read the frozen record | Answered. No conversion (A.5, 4) |
| B-3: the equivalence check proved little, and "no Repo" changed meaning | Answered. No migration engine; an issue with no Repo reads exactly as today (A.2, 2) |
| B-4: the fingerprint refuses shallow clones, forks and renames, and misses second roots | Taken. Roots, all of them, decide; a shallow checkout reads unverified; the origin is a note (A.2, 3) |
| B-5: the loop's own repository and a loop in a linked worktree were underspecified | Taken. The main checkout through git's common directory (A.2, 3) |
| B-6: a worktree by name is ambiguous, and container worktrees are prunable, not locked | Taken. No worktree is recorded; the branch finds it; the prunable state is named (A.2, 5) |
| B-7: the format-only profile must keep `declared: false`; `new --repo` must raise the format; archive does not keep `local.json` | Taken. A.2, 7 and 252's amendment; no `local.json` |
| B-8: a merge line with no CI state; the done note and SKILL.md's text | Taken. 246's acceptance (A.4) |
| B-9: probe C fails only with the pseudo-file alone | Taken. W1 says so |
| B-10: a ruling's prose names locations | Taken. A.1 says so; it is testimony and stays |
| B-11: a conversion after the close cannot know the base | Answered. No conversion |
| B-12: not passing `--worktree` is a cheaper interim | Taken. A.5, 1 |
| B-13: rewriting the log needs no other copy in flight | Taken. A precondition of A.5, 2 |
| B-14: a migration log line must not start with three digits | Answered. No migration command; the pre-push rewrite logs nothing new into the loop |
| B-15: the rail change must land before the first commit carrying names | Taken. A.2, 8 |
| C-1: the override file, its sync and its `.gitignore` migration serve a machine that does not exist | Taken. Names only where the convention resolves; paths elsewhere; no override file (A.2, 3-4) |
| C-2: a permanent migration command for one loop | Taken. Dropped (A.2, 9) |
| C-3: the origin refuses forks and renames; two repositories with one directory name | Taken. A.2, 3 and 4 |
| C-4: one entity in four homes; per-repository Check lines become redundant once rows are bound | Partly taken. Landing is derived from rows (246); the Check lines stay as the command the merger runs, a rule, which is what the charter holds |
| C-5: the bound of `show` should be the gate's window | Taken. Item 4 |
| C-6: no docs budget; the record contract | Taken. "The docs budget"; the contract in A.2, 7 |
| C-7: `repo` against `repos`; `repos add` duplicates `--repo`; fingerprints in every view | Taken. No `repos` command; fingerprints only where Jarl acts |
| C-8: wait for a second request before `Resources:` | Kept, for 6.3.0 at the lowest priority: After cannot express "not together" for more than two issues (W1) |
| C-9: "awaiting review" mislabels a worker recording rows partway | Taken. The marks are facts, not intent (item 2) |
| C-10: the format-only profile and `status --json` | Taken. A.2, 7 |
| C-11: the pin and the doctor during 6.2.0 | Answered. No conversion; the doctor reads paths with no Jarl command while the loop is on 6.1.0 |
| C-12: the "Before you upgrade" items | Taken. Its own section |
