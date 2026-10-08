# Critique C: the cost of maintaining it

A fresh, read-only critic (Opus) of the first version of [design.md](../design.md), 2026-10-08. Kept as returned. The answers are in design.md, "Revision after critique".

The design adds a lot and removes almost nothing from Jarl. Most of the per-machine machinery serves a machine that does not exist yet.

**Tally.** What Jarl gains:
- **Commands:** one new command, `repos`, with four subcommands (`add`, `set`, `locate`, `normalize --dry-run`) and one new MCP tool.
- **Files in `.jarl/`:** three (`repos.md`, a git-ignored `local.json`, a format-only `profile.json`).
- **Flags:** `merged --ran/--saw/--red` and `show --full`.
- **Record format:** `Check (<name>):` lines in `goal.md`, a check token in the merge line, and `--repo`, Repo, Worktree and Merged's `in` meaning names instead of paths.
- **Output:** new output in `show`, `resume`, `status --by repo`, `report` and `init`, two stderr notes, and four `verify` checks.
- **In 6.3.0:** a `Resources:` field and derived in-flight marks.

Althing gains a doctor comparison, `--fix`, rail changes, a closing step and two rulings. Removed: the `pending` default, and later the paths-rail allowance. No Jarl command, flag or file goes, against plan 3.7: "add few commands and remove some".

**Critical**

1. **`local.json`, `repos locate` and the doctor sync are paid for a machine that does not exist.** A.2.8 admits a machine on the documented layout needs none of it. Plan 3.4 deferred per-machine overrides "until a loop actually runs from two machines", and the design neither cites nor rebuts that. The cost:
   - a third resolution tier;
   - archive's carry-over rule;
   - a second home for `ws.local.json`'s fact, under a different key (`JarlSkill` vs `jarl`), kept equal by a doctor duty;
   - a `.gitignore` migration the design never mentions. A committed loop's `.gitignore` is written once (`jarl-lib.mjs:172`, `:864`) without `local.json`. Outside Althing's rails, `git add .jarl` then commits absolute paths, the very leak the design exists to stop.

   A.2.4 also never says `--repo <non-sibling path>` writes `local.json`, so it declares a name that does not resolve straight away. The smaller design: store a name where the sibling convention resolves; otherwise keep the path, which A.2.9 says reads correctly forever. Drop 251's "path in a new-format loop" check.

**Important**

2. **`repos normalize` is a permanent command, plus an equivalence engine, for about one loop.** Single-repository loops and default-mode loops never need it, and paths keep reading. Plan 3.7 already moved the one-time `mode permanent` migration out of the main table. Rewriting 251 tokens in `log.md` buys the removal of the rail allowance (`paths.mjs:7-31`), while git history keeps the paths anyway (A.2.9's own "honest limit"). Smaller: rewrite the header fields only, treat old log tokens as testimony the way evidence rows already are, and ship the migration as an Althing or test-tree script.

3. **Origin matching refuses legitimate checkouts.** A fork, or a GitHub rename, keeps the root commit but changes the origin. So A.2.3 refuses `check` and `merged` for a contributor working from a fork of the public Althing loop. The root commit alone is identity: show the origin, never refuse on it. Also unaddressed: `SKILL.md:419` promises that two repositories sharing a directory name are told apart, and one name per repository silently drops that.

4. **One entity still lives in four homes.** The previous architect's "declare once" is not met: `repos.md` (name, fingerprint, base), `goal.md` (`Check (<name>)`), `local.json` and `ws.local.json` (where it is), written by two commands (`repos` and 253's `goal`). Once 246 binds the check row to the merge, per-repository `Check` lines are redundant. landsOn can be derived from bound rows, which also fixes divergence 6 (a banner one hand-added line can flip). Althing's rendered briefs already name each repository's command.

5. **A bounded `show` by default is right; the bound is wrong.** The reviewer reads the issue through `jarl_show` (`SKILL.md:471`) and checks evidence against acceptance. "The last five rows" hides rows the gate counts whenever an issue has more than five acceptance lines. Bound it by the gate's own window instead: everything since the last in-progress anchor, with earlier rounds summarized.

6. **No docs budget, and nothing said about the record contract.**
   - **Docs:** the design adds about eight SKILL.md topics (resolution, fingerprints, locate, normalize, the merger's `--red` rule, bounded `show`, four 250 sentences) and names no cut. 3.7 warned about exactly this size problem.
   - **Contract:** `recordMerged`'s default changes meaning under `jarl-record/1`. `format` moves from 1 to 2, a field `record.mjs:62` lists as contract. The design never says whether `repos` stays out of `record.mjs`.

**Minor**

7. **Command surface.** `repo` vs `repos` (and the two MCP tools) is an easy pair to confuse for agents that already skip parts of the surface. `repos add` duplicates the declaration `--repo` already makes (A.2.4). The `repos` view overlaps `branches` and `resume`'s new section. Checking fingerprints in every view adds git calls to a `resume` that takes about 0.7 s today; check them only in the commands that act, and in `verify`.

8. **`Resources:`** stays inside "What Jarl will not grow": `next` reads it, it holds within one loop, and it never acts. But W1 admits it is coarse and has no capacity, and After already orders two issues that migrate one database. Wait for a second request.

9. **The derived "awaiting review" mark** comes from "rows since the start". It mislabels a worker who records rows mid-task.

10. **A format-only `profile.json`** has to special-case `declared`, or `status --json` changes shape (`jarl-lib.mjs:1586`).

11. **During 6.2.0 the driver is pinned to 6.1.0,** which has no `repos` command. Both the doctor duty and the normalize after the close need a pin exception the design does not spell out.

12. **"Before you upgrade" items the design should list:**
    - `merged --sha` no longer writes `pending`.
    - `show` is bounded: scripts, and the worker's brief ("<the issue file, verbatim>", `SKILL.md:456`), need `--full`.
    - Repo and Worktree hold names, and the merge line gains a check token.
    - A 6.1.0 MCP plugin refuses a normalized loop.
    - A non-sibling layout needs `repos locate`.
    - A fork clone is refused by its origin.
    - Two repositories with the same name can no longer share a loop.
