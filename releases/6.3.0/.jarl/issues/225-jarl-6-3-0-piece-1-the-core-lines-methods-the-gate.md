# 225 · Jarl 6.3.0, piece 1: the core: lines, methods, the gate

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**Branch:** jarl/225-core
**Worker:** w-jarl-225-opus
**Worktree:** /home/me/Worktrees/JarlSkill/225-core
**Since:** 2026-11-08 19:10

## What
the design's section 3 and the gate of section 6: lines, methods, line state, the gate per method, the line digest, old line text kept whole, a `changes` that stands until a round. No new code calls `needFormat`: piece 3 removes it. The new shapes are written unconditionally. About 274 places in the suite write an acceptance line and about 400 write a row; moving them to marks and `--line` is part of this piece. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 1.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] `new` and `field` accept a line headed `[test]`, `[check]`, `[compare]`, `[read]` or `[owner]` in the form `[method] text · key: value`, and refuse any other line, ending with the form that names the five
- [test] a `[compare]` line without `· by:` is refused; a `[check]` line without `· by:` means the goal's declared check
- [test] a line with no mark reads as `read`; `import`'s "Proposed" line counts as no line
- [test] a lease on an issue with no line is refused, ending with the form that adds one
- [test] `done` asks of each line what its method asks: for `test`, `check` and `compare`, a counted row naming it by the holder of the lease and one by a name that has not held it (the landing's check for a `check` on the declared command); for `compare`, two rows with identical `--saw`; a live approve for `read`, or a waiver or a profile with no approve in its place; the tick for `owner`
- [test] `--without-rows` and the switch-on of the line rule are gone, and `--without-rows` is refused as an unknown flag
- [test] a row stores the digest of its line, not its number; after the line is reworded or another inserted before it, the row counts for no line other than the text it named
- [test] `evidence --ran --saw` without `--line` is refused; a free note is still taken
- [test] a `changes` stands until a round or a new commit: an approve by another examiner after it does not clear the issue
- [test] the log keeps the whole old text of the lines when they change, and the tool can print the lines as they were at the lease
- [test] `show` prints each line's state as the design defines it, and `status` counts lines by method
- [test] `merged` notes when `--ran` matches no declared check and prints the declared ones, and a `Check (<name>):` line matches the repository's own name
- [check] the full suite passes on the merged result
- [read] an independent examiner: the code does what sections 3 and 6 of the design say about lines, methods and the gate

## Evidence

