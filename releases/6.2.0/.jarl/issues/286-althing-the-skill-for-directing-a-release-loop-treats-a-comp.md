# 286 · Althing: the skill for directing a release loop treats a compaction as a session start (ws jarl resume before acting)

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261008T1145-jtda
**Tags:** althing, docs
**Files:** Althing/.claude/skills/directing-a-release-loop/SKILL.md, Althing/AGENTS.md
**Repo:** ../..
**Found by:** jarl-architect
**Source:** research/2026-10-08-jarl-field-report-and-repository-names#althing-fr-compaction
**Where:** Althing/AGENTS.md section 2 (session start); Althing/.claude/skills/directing-a-release-loop/SKILL.md, Resume
**Worker:** jarl
**Model:** claude-opus-5-5
**Since:** 2026-11-11 09:37

## What
A coordinator of a loop in another project whose context was compacted acted on the summary instead of the record (the field report's "works badly" item; the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, B.2, W2). Althing's session start (AGENTS.md, section 2) and its skill for directing a release loop (the "Resume" section) say nothing about a compaction. Jarl's own skill gets the same sentence in 250.

## Why
The state is the live record, which resume assembles in under a second. A summary of one's own context is the one input that looks like the state and is not.

## Acceptance
- One sentence in the skill's Resume section and one in AGENTS.md's session start: after a compaction, or any summary of your own context, run ws jarl resume before the next action; a summary is not the state
- yg check && npm test green

## Reviews
- **changes** · by rev-286-fable (fresh) · 2026-11-11 · model claude-fable-5-2
  Important: AGENTS.md:16, line 1 is half met. The session-start step says to run resume 'again after a compaction or any summary of your own context, because a summary is not the state of the loop' and leaves out 'before the next action', which the acceptance line, the issue's title, the commit's subject, the skill's own sentence and Jarl's rule (its SKILL.md and its server's instructions) all carry. The failure this issue answers was acting before resuming, and AGENTS.md is the text a host loads again after a compaction, when the skill is gone, so the weaker wording sits in the home that survives. Asked: a sentence of its own in step 4, the skill's sentence with the full command. · Minor: AGENTS.md:16, the clause went in between the command and its colon, so the list of what resume prints ('the goal, the count of rulings in force and the rules for the whole loop, ...') now follows 'a summary is not the state of the loop:' and reads as a gloss of the state, no longer of the command; the skill's step 2 keeps 'command: what it prints'. The same separate sentence cures it. · Line 1, the skill's half, read and met: .claude/skills/directing-a-release-loop/SKILL.md:25, in Resume, 'After a compaction, or any summary of your own context, run `ws jarl resume` before the next action: a summary is not the state of the loop.' It agrees with Jarl's rule and differs only by the command, as the design asks. · Line 2, read and re-run, met: on a clean copy of main at d582244 yg check passes (5405 pairs) and npm test has 110 pass, 0 fail, 11 skipped for this machine's setup. · Also checked: the commit 00da0d8 touches only the two files of the issue and no later commit touched them; no check, rail or hook moved; the two homes of the sentence in Althing are what line 1 asks for, and no third copy exists; the command the sentences name runs and prints the loop's state in about a second.
  outside the issue, filed as 582: Althing loop record: the uncommitted state of the 6.2.0 loop carries an absolute path under a home directory (the shared Runes corpus cache) in three places, the ruling one-runes-corpus-cache (decisions.md:848), an evidence row of issue 500 (line 58) and log.md:5372; yg check refuses each with boundary/no-private-paths, so the live checkout is red and the next commit of the loop's state is refused until the path is written in plain words or as a placeholder

## Evidence

### Proof

- **ran (line 5afeab563af5):** a clean copy of Althing's main at d582244 (git archive into a scratch folder; AGENTS.md and the skill are unchanged since 00da0d8): yg check --approve --only-deterministic, then npm test · **saw:** yg check: PASS  17 nodes · 1254/1254 files covered · 5405 pairs verified (script). npm test: tests 121, pass 110, fail 0, skipped 11 (nine want a skill to build with, two a driver source this machine does not name); the same counts in the live checkout. In the live checkout yg check --no-approve is red on boundary/no-private-paths, from uncommitted loop state outside this issue

### Notes

Two sentences added on main in 00da0d8eddede034990cacd5d7a6afbcb9c850c6: AGENTS.md section 2 item 4 and the Resume section of directing-a-release-loop; yg check and npm test green.

