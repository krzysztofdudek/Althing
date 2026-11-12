# 533 · Jarl: the carry of a text the record already holds is tied to where that text stands in the line

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261109T1711-gojr
**Tags:** jarl, jarl-6.3.1, record
**Files:** JarlSkill/skills/jarl/scripts/lib/owner.mjs
**Repo:** JarlSkill
**Found by:** rev-531-fable
**Where:** skills/jarl/scripts/lib/owner.mjs:119
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
needNoNewOwnersWords takes a carried text out of every place in a line, not only the place where the record's own text stands. Issue 531 closed the known path by checking every writer's name where it is read. Tying the carry to the position would close the whole class.

## Why
A later line shape that puts an unchecked new text beside a carried old text would pass the guard again.

## Acceptance
[test] A carried text is removed only at the position it was written, and the same text elsewhere in the line is still refused · by: cd skills/jarl/scripts && npm test

## Reviews
- **changes** · by rev-540-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0523-oslv
  Important (545): skills/jarl/scripts/jarl.mjs:87 refuses round --findings in a patch release. Jarl 6.3.0 documents --findings <n>, and the MCP tool jarl_round refuses the field findings too (tried: refused, naming finding-count). Any 6.3.0 caller, script or MCP client that counts findings breaks on 6.3.1. The CHANGELOG lists the rename under Unreleased with no Before you upgrade note, and the family's own policy keeps changes that ask something of a caller for a minor release. Keep --findings working as an alias that prints a notice naming --finding-count, on the command line and in the MCP tool, and test that the alias records the same count.
  Important (542): the new closing-block line **Supersession withdrawn:** (skills/jarl/scripts/lib/questions.mjs:402, read at lib/journal.mjs:213) is silently misread by Jarl 6.3.0, the version of the installed MCP plugin while this loop runs, and the record format stays 4. A 6.3.0 reader parses the closing block from its end, stops at the unknown line, and pulls By, Applies to, Superseded by and the owner's words into the ruling's text. Tried on a copy of the 6.2.0 record: after decide probe-d --supersedes yggdrasil-no-provider-redaction and retract yggdrasil-no-provider-redaction supersession, 6.3.0 reads that owner's ruling with by null and quote null. After a supersession of the rule try-to-break-a-guard was withdrawn, 6.3.0 reads appliesTo null, and its reviewer brief no longer carries the rule (6.3.1's does). references/record.md:47 explains what an older reader does with Applies to, but not with this line. Either write the withdrawal in a shape a 6.3.0 reader still parses, or say in the changelog (Before you upgrade) and in record.md that every reader must be 6.3.1 before a supersession is withdrawn. Test it with the 6.3.0 reader's parse of a record that holds the line.
  Minor (543): the heuristic at skills/jarl/scripts/lib/rules.mjs:220 reads an obligation word anywhere in the text, including the owner's words quoted inline and descriptions of product behaviour. On the real 6.2.0 record it would note 67 of the 175 rulings that carry no Applies to (55 besides the ask-<n> answers). By my reading, about 12 to 15 of those 55 are instructions to agents (fixes-on-word, finish-open-work, no-fable-model, hard-work-on-opus, avoid-fable and the like). The rest are records such as 340-line-2-reads-too-large-only (is never decoded), backlog-tidy-for-the-three-tools (1.0.1 was never published) and 566-line-1-red-before-per-extractor (must stay green). Of the last 40 rulings, 9 would be noted and about 4 rightly. The note says that a record needs nothing, so the cost is one stderr line, but most of the notes are false.
  Minor (544): skills/jarl/scripts/lib/rounds.mjs:423 skips only .git and node_modules. A lease whose branch is checked out in the checkout that holds the loop (Branch: main on an Althing issue, as 1 of 62 Althing issues here was) is never idle while anyone writes the loop. Tried on a copy, with the lease's log line, Since and every file backdated three hours: one unrelated log write brought lastWork back to 0 minutes. Leaving the loop's own .jarl directory out of the scan would close this.
  Minor (542): a refusal of a --supersedes list that holds one bad slug prints a form in which every slug given, the valid ones too, is replaced by a placeholder.
  What holds: each of the 8 new test files was red on b6d808c for its own reason (the assertion of its change, not a missing export) and is green on 79fcc23. The full suite on 79fcc23: tests 1855, pass 1833, fail 0, skipped 22, exit 0. On a copy of the real record: 466 (Repo ../../../Yggdrasil) and 679 (Repo Yggdrasil) leased in one set call brief as one lease, and the base refuses them. The repo selectors Yggdrasil, ../../../Yggdrasil, yggdrasil, a trailing slash, an absolute path, Gard and Mimir are accepted and reach both spellings; Nothing and ./repo are refused. --supersedes is all or none against an already superseded slug and against an unknown one, and live counts moved 177, 177, 176. retract supersession puts the ruling back in force, logs who and why, and refuses a second withdrawal, a missing --by and an empty reason; a new supersession after it works. decisions --live --as reviewer lists 8 rules, and painter is refused. Delivered rules carry no Made under or owner's-words lines. Retracting a note that carries the owner's words works, and a reason holding the marker is refused. 316: ws check canon-sync --ref jarl=jarl/540-jarl-6-3-1 reports no difference for Jarl, and CLAUDE.md:9 carries the pointer. The record contract is unchanged (RECORD_API jarl-record/4, record-contract.test.mjs untouched, record.mjs only a comment). The worktree scan takes under 0.1s on a 7630-file worktree. Platforms: ci.yml runs Linux, Windows (3 shards) and macOS on Node 22 and 24. The diff adds nothing Linux-only (path.join, lstat and Dirent types, no symlink following), but I could not run Windows or macOS. Changed tests were reworded only to keep the old note from firing, with no assertion weakened.

## Evidence

### Proof

- **ran (line fdde6d18c876):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For the next release of Jarl: no known path remains after 531.

Assumed: a carried text is tied to its place by two expressions the writer gives, the part of the line before it must end with the first and the part after it must start with the second, because the five writers put it in five different places (the end of a row after a separator, a whole line, after "was" in a body line, a struck-through note, a question and its options). Nothing user-visible changes, so there is no changelog line. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

