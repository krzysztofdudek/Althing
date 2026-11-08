# Critique of the Jarl 6.3.0 design

I walked all three cases from the document alone, then tested claims on tip a6dcbc3 in a scratch loop. I have removed that loop and edited nothing.

## Part 1: the walk

**(a) Lone agent**
- `resume`, then `init`: told.
- Declare the check: guessed. No command is given. The tool uses `goal --set "Check: …"`.
- One issue or three: guessed. Section 1 says a requirement is a line, the glossary says an issue is one requirement, and section 4 says one issue with many lines.
- Write the marks: guessed. No marked line appears anywhere, only "on the `[owner]` grammar".
- Take the lease: inferred from the package row (`set <ids> in-progress`). Its flags are not given, and "in place" is never explained.
- `run`: told, except how a red "before" row counts.
- Fresh examiner: "`ask` for a fresh session". The kind is not given.
- Owner's tick: the command is not named (it is `tick`).
- Merge: blocked. See I1.

**(b) Large loop**
- Registering repositories: not told. Which repository holds `.jarl/`: not told.
- Slices: told as a tag. The tool also needs `goal --set "Coordinators: …"` and `Merger: …`, which the document never mentions.
- Cross-repository chain: told. Who holds the parent's `check` line, who examines a parent with no code, and whether After means merged or done: guessed.
- Compaction: `resume` is told. `resume --as` is unexplained, and the threshold has no value (the tool defaults to 30 minutes).

**(c) Failure**
- Dead worker: `set --handover` is told, but section 9 contradicts itself (I6).
- `changes`: told. The round limit has no value (the tool uses 3). What a re-examination reads is not told.
- Red merge: not told (C1).

**Used and not defined:** live approve, mark 1/5/7, wave, territory, drivers, sole-committer rule, model lines, removal step, second family, takeover block, "four reasons", "Found", the issue statuses, the question kinds (seven exist, two are named).

## Part 2 and ranked findings

### Critical

**C1. A red merge has no procedure (sections 5, 9).** Section 9 has no row for it. "Rolls back on red" stops there, while "landing" also includes "any repair", and the document never says when to repair instead of rolling back. The merger may not edit code, so nobody can make the repair. A repair on the target branch has no examiner, against `fresh-reviewer-required`. The real merger reference already separates a round from a red with an outside cause, files the cause and has `merged --red`. The design drops all of this.
Fix: add the row, name who fixes, and require review of the repair.

**C2. Two examiners do not work on the current gate (section 6).** I recorded `changes` by e1, then `approve` by e2. `next --as jarl` then said "approved, not merged; merge it". The gate counts approves after the last `changes`, so parallel order decides. The claim "a `changes` from either sends a round" is false, and no row in section 12 changes it.
Fix: a `changes` stands until a round or a new commit.

**C3. `run` through MCP runs in the wrong place (section 3 against section 15).** Section 3 says it runs "where the caller stands". The MCP server runs in its own working directory and has a `root` field but no working-directory field. Dispatch is synchronous and in-process, and the source says the adapter's timeout cannot stop it, so the "server's limit" does not exist. MCP is the default route. A worker in a worktree would get a witnessed row for the wrong tree, and the examiner "takes it as run".
Fix: require an absolute working directory and a timeout of its own, or make `run` command-line only under an explicit `mcp-parity` exception.

**C4. "At the current tip" breaks the main shapes (section 3).** Today rows count inside a window whatever the tip, and section 12 does not list this change. With "one commit per issue", the second commit makes the first issue unproved. A `test` needs a red row at an earlier commit. A landing check runs at a commit that is no branch's tip. The dirty flag has no stated effect.
Fix: define which commit each method needs, and say that dirty rows are not witnessed.

**C5. The format is never addressed.** Today `[test]` files as plain text and raises nothing, while `[owner]` raises the format because an older reader "lets done pass". New marks, witnessed rows, repairs and the lease copy need the same treatment. A format 4 needs stating, along with what pinned drivers do.
"An old loop reads as it always did" also conflicts with `read`, because old approves quote nothing. Either open issues there stop closing, or "judged" is not computed as defined.

### Important

**I1. A merge to `main` is reserved (section 7), yet the merger merges (sections 1, 5).** No merge target is defined, so a lone agent on `main` stops at step 7.

**I2. `run` does not remove the typing problem (section 3).** Today a merge carries the check when its `--ran` text equals a `Check` line after trimming. `run -- <wrapped command>` records a string too.
Fix: `run --check` takes the command from the goal. Also, `--line` is mandatory and takes one id, but a merge check covers batches and may have no line, and the tool today keeps the merge check apart from proof rows.

**I3. Stuck routing needs a rule the document does not give (sections 5, 7).** Today it lands on the owner; I confirmed this. The asker is in the log, so it can be built. But `stuck` is the default kind: a call with no `--by` still reaches the owner, a lone agent's question lands on itself, and each answer writes a ruling.

**I4. Depth is not computed from lines (section 6).** "Record format or contract" is a classification no line carries. An all-`compare` lease gets a light examiner even over a strong worker, against the quoted rule that a reviewer is never weaker. `owner`-only leases have no row.

**I5. Per-lease review has no lease identity.** Branch is the proxy, and an in-place lease has none. In my package, `next` offered a review of issue 3 while sibling 4 had no proof and the worktree was dirty.

**I6. Dead worker (section 9).** "New branch from the old tip" and "starts from the dirty worktree" conflict, because uncommitted work does not travel. The tool's brief says nothing about a dirty worktree. `spent` is written "when an agent returns", so dead agents cost nothing in the numbers.

**I7. Rows name lines by number.** Rows keep the number after an edit; ticks keep the text. With methods, inserting a line moves a `test` row onto another line and gives false proof.
Fix: store a digest of the line in the row.

**I8. Shape learning cannot work (section 4).** `report` "groups by shape", but shape is never recorded, and leases cannot separate a change by tool, a probe or a sequence from one agent. "No code has to change" is wrong.

**I9. Section 12 is not "every mechanism".** Missing: profiles (a 5,429-word reference, and the done-gate definition), bots, waivers, `retract`, permanent mode, `import`, `--loops`, the reserved goal line, the owner-questions metric.

**I10. `--loops` is undefined.** It is refused today. The existing walk covers one checkout, depth 4. Nothing says what "his loops" are or what happens when one refuses by format.

**I11. Section 13.** The per-role sums and the 088 total (19,475, then 4,500) are exact, and 78 composer mentions is right.
- But 14,975 words leave and only about 10,900 are accounted for.
- 3,500 words move into briefs capped at 2,100 together.
- `models.md` and `repositories.md` (4,797 words) vanish from the director's list with no row. Case (b) needs the second. With both, a director reads about 8,500, a fall of half rather than three quarters.

**I12. Retiring contradicts itself (sections 5, 11).** The register is a document "no agent has to read", yet the jarl must name a mechanism at each close. `close` has no field for it and no per-mechanism numbers exist.

### Minor

- `next` order "sits below": primary sort or tie-break is unclear.
- Section 5 demands a fresh examiner on every issue. Section 6 says only code does, and today the director's approve clears no-code issues.
- `compare` digests raw output, so timings and paths break it.
- How the tool detects a quote is unstated.
- Slices "keep After chains inside" while cross-repository chains cross areas.
- `spent` on a package has no split rule.
- "Any difference is a finding" catches a director's legitimate tightening.
- The lease copy is safe from `field` (refused, tested) but not from a hand edit. A log line would be stronger.

## Part 3

**Could go without loss:**
- The issue-side lease copy: use a log digest, and fold in the existing "grew after the lease" mark, which duplicates it.
- The refused-call file: it fails the document's own entry test, since no decision depends on it.
- Three of the five line states: "landed" belongs to an issue, not a line.

**Missing against the owner's requirements:**
- The red-merge flow.
- A lone agent's examiner depends on the owner being present, which conflicts with "work must not stand".
- Coordination between loops is only a digest. Section 14 argues this honestly, but the digest is undefined.
- Spend is seen only after the fact.

## What survives

- The chain from line to method to proof to depth holds up, and keeping the examiner is well argued.
- The default of one agent is argued honestly, and sections 14 and 16 are candid.
- `--handover` on packages, batch verdicts, `tick`, `brief --slice`, `resume --as` and the existing holder views are all there as marked.
