# Critique B: technical soundness

A fresh, read-only critic (Opus) of the first version of [design.md](../design.md), 2026-10-08, acting also as the sceptic of every claim about the code. Kept as returned. The answers are in design.md, "Revision after critique".

**Claims I tried to refute and could not.** Every cited line says what the design says it does. Checked: :293, :307-308, :572, :1192, :1213, :1345, :1375, :1473, :1485-1519, :1766, :1842, :1992, :2203-2208, :2231, :2340-2354 and :2512 in jarl-lib.mjs; jarl.mjs:338 and :481; jarl-mcp.mjs:69; loop.mjs:41-44; paths.mjs:7-31; Horde loop.mjs:143. Every count holds:

- 278 of 279 issues carry a Repo, as 9 single values and 6 lists over 19 issues.
- 34 Merged fields carry `in`, and 193 merges record `CI none`.
- 24 live leases; 217 lease lines (144 on the host, 73 in the container).
- No Files prefix differs from the name.

The done gate does not read any token the rewrite touches: the review regex, the coordinator names, the log parser keyed by line index and the worker parse ending at ` · worktree ` all skip them. Jarl 6.1.0 reads `Check (X):` as no check. Horde is unaffected by removing the `pending` default. Probe F holds.

**Critical**

1. **The format is raised last, so a run that stops partway is read wrong without a word.** The design lists the format raise as the last step (A.2.9). A run cut short after some issues already hold names leaves names under format 1. Jarl 6.1.0, which is still the pinned driver and the session's MCP (decisions.md:149), then reads `Grain` as `<root>/Grain`, which is the silent misread of probe H. Separately, Jarl 6.1.0 stores a `--repo` value as given (:1020, :1527), so a value with no slash, like `Grain`, is a valid old path and a valid new name at once. "Both spellings read correctly" is therefore false in two ways. Fix: let the format decide how a value is read, not its shape, and raise the format before the first name is written.

**Important**

2. **After normalization, Althing can no longer read or write the frozen record through `ws`.** `releases/6.2.0/family.json:6` pins the driver at `2c12aa3`. `ws jarl` refuses writes when the driver checkout is off that commit, so the normalize step itself is blocked. After it, every `ws jarl --release 6.2.0` read is refused by the format. The ruling has to move the manifest's pin as well, not only refine `jarl-pinned-in-loop`.

3. **The equivalence check proves less than it claims.** It runs Jarl 6.2.0's readers on the record before and after the rewrite, so it cannot see where 6.2.0 reads a path differently from 6.1.0.
   - For the gate it is a tautology, since the gate reads none of the tokens.
   - It never checks the Worktree half: 6.1.0 tests the path on disk (:2395), 6.2.0 asks `git worktree list`, and the stale lines are not among the compared outputs.
   - It does not catch a change in what "no Repo" means. Today an issue with no Repo resolves to the root, a subdirectory here (:2199). Elsewhere the code uses the repository's top (:3108, :2545). Step 1 of the design says "the top", which changes the meaning for loops whose root is a subdirectory.

4. **The fingerprint check refuses good checkouts.**
   - A shallow clone reports its shallow boundary commit as a root. It is refused as the wrong repository, not "checked by origin alone", unless shallowness is tested first.
   - Horde has 2 roots across its refs, but the design names one root commit.
   - Requiring the origin to match refuses forks, renamed repositories, and SSH against HTTPS clones (the `:` in the scp form survives the stated normalization).
   - Althing has no origin at all.

   Let the root commit decide, and make the origin a warning.

5. **The loop's own repository and the sibling convention are underspecified.**
   - The design does not say how `Althing` is matched to the loop's own repository: by directory name, or by fingerprint?
   - A fingerprint cannot tell two clones apart, so a second Althing checkout passes.
   - In a loop inside a linked worktree, the "top" is the worktree, so the sibling lookup lands in `~/.jarl-wt/`. Use the main checkout, as the design already does for `--repo`.

6. **Resolving a worktree by its name is ambiguous.**
   - Git allows two worktrees with the same last path segment, and the container's `NNN-slug` names carry no repository. Yggdrasil's list already holds `514-pkg` from another loop. The match has to require name and branch together, not name first and branch as a fallback.
   - Live multi-repository leases (233, 234, 235, 240) do not say which repository's list to search.
   - The container worktrees `git worktree list` shows in Yggdrasil (including all three this loop leases) are prunable, not locked, so the "elsewhere (locked)" state does not apply to them.
   - If a container mounts the loop's repository, `.jarl/local.json` is shared between two machines and stops being per-machine.

7. **The format-only profile and the archive need more than the design states.**
   - Only `repos normalize` raises the format. A fresh 6.2.0 loop that writes names through `new --repo` must raise it too.
   - A format-only profile must keep `declared: false`. Otherwise these change: `status --json` shape (:1586), the status and resume headers (:3034, :3367), the report (:3152), import (:3277) and the issue reader (:580).
   - Jarl 6.1.0's profile check requires `statuses` (:318), so 6.2.0 needs a special case for a profile that holds only the format.
   - The archive does not keep `local.json` today (:889). "As it leaves templates" describes a change to make, not current behaviour.

**Minor**

8. **Item 246:** without a default CI state, a merge line has no ` · CI` suffix, so the metrics regex at :1992 no longer matches. Jarl 6.1.0 then counts the merge only through the field fallback (:1998). Also, `done` (:1318) still notes a missing CI as "CI not recorded", and SKILL.md:84 and :190 describe the old default.

9. **W1:** probe C fails `check` only when the pseudo-file is the issue's sole declared file (:2300). Next to real files it passes. The cross-repository case (probe B) still carries the argument.

10. **"The rulings hold no location" is wrong:** decisions.md:149 names `../JarlSkill` and `~/.jarl-wt/JarlSkill-NNN`. The merge line is also read for its timestamp (:2539), which is harmless.

11. **Normalize writes a base it cannot know.** After the close, JarlSkill sits on `main` by ruling and the release branches are merged, so the frozen record would declare `main` everywhere.

12. **A cheaper interim exists for future leases.** Simply not passing `--worktree` on new leases stops new machine paths at no cost to the gate (:1766, :2395). "No bridge" is true only for the past lines.

13. **`log.md` merges by union.** Rewriting past lines is safe only while no other copy of the log is in flight. State that as a precondition.

14. **The normalize log line must not start with three digits**, or the log parser files it under an issue (:1711).

15. **Ordering in Althing:** the change to Althing's loop-shape rail (accepting `repos.md` and `profile.json`) has to land before the normalization commit, not merely before the freeze.
