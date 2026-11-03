# Sceptic review of the two findings against Jarl at a1132a8

**Question:** Do the two findings in findings.json (jarl-rethink-dupnum, jarl-rethink-emptyclone) hold against JarlSkill at commit a1132a8, does a documented setting or command prevent them, is their severity honest for a loop driven from two machines, and does an open issue cover them?

**Method:** I took the tree of a1132a8 with git archive into Althing's ignored cache and changed nothing in JarlSkill. I read references/record.md (the three modes, the merge drivers, the write lock), SKILL.md, references/jarl.md, references/repositories.md, references/merger.md and the help for merge-driver, then the code behind new, findIssue and the merge setup. I repeated both runs of materials/two-clones.md in scratch repositories, this time merging with the settings `jarl.mjs merge-driver flags` prints, as the merger reference says to do on every merge. I added moves (set in-progress, set dropped) after the merge, one run with two branches of one checkout, and one run with a permanent loop. I listed the 6.2.1 loop with `ws jarl list --all --release 6.2.1`, read its issue 022, and searched the open Jarl issues of both loops for clones, numbers and the missing directory.

**Status:** done

**Conclusion:** Both findings stand, and the first stands with a correction that makes it worse. No merge driver covers `.jarl/issues/`, so the documented flags change nothing.

**Conclusion:** Two issues with one number are not just hard to address. Every move of that number lands on both in the log, which is the record. After `set 2 dropped`, list shows both issues dropped while the second file still reads open.

**Conclusion:** verify is clean right after the merge. After the first move it reports the second file as out of step with the log and advises copying the log's state into it.

**Conclusion:** No open issue covers either finding. Issue 022 of 6.2.1 is about reserving number ranges for series, and it says nothing about clones.

## jarl-rethink-dupnum: stands with a correction, severity high

The merge setup in `.jarl/.gitattributes` names two files: `log.md` merges by union and `decisions.md` by Jarl's driver. Issue files have no driver. Two files named `2-second-on-a.md` and `2-second-on-b.md` never conflict, so `git $(jarl.mjs merge-driver flags) merge` gave the same clean merge as a plain one. A clone gets no driver in its local configuration, and its first write adds none, because the setup runs only when `.gitattributes` is missing (jarl-lib.mjs:206-207). That gap does not cause this finding.

The docs promise that numbers never collide, because the write lock hands them out (SKILL.md:99, references/jarl.md:45, references/repositories.md:40). That lock lives in one checkout. The numbering reads this checkout and its worktrees (jarl-lib.mjs:1493-1500), and the guard on `new` refuses only a linked worktree (jarl-lib.mjs:1523). record.md describes two clones merging a committed loop, and tests/one-store.test.mjs tests it, but only with issues filed before cloning.

The correction: `show 2` and `set 2` reach the first file, as the finding says. The log line `2 → in-progress` has no file in it, though. list and resume fold the log by number, so both issues moved. `set 2 dropped` dropped the second issue in the record as well. verify then gave four findings on 2, each saying the file disagrees with the log and how to write the log's value into it. Following that advice drops an issue nobody dropped. Two branches of one checkout that each file an issue, then merge, end in the same state.

High is honest for a loop driven from two machines. The second issue's state follows moves meant for the first, and nothing names the shared number.

## jarl-rethink-emptyclone: stands, severity medium

`init` creates `.jarl/issues/` (jarl-lib.mjs:1357) and puts nothing in it, so git keeps no such directory. In the fresh clone, verify, status, resume, list and next all pass, because the readers check that the directory exists (jarl-lib.mjs:1497, 5062). `new` reads it without a check (jarl-lib.mjs:1562) and fails with `ENOENT … scandir '<b>/.jarl/issues'`, writing nothing. A permanent loop fails the same way. `init` refuses in the clone because a live loop exists, so no command repairs it. `ask` and `decide` work.

Medium is honest. Filing is blocked behind a raw error, nothing is lost, and `mkdir .jarl/issues` gets past it once someone reads the message.

The runs, command by command, are in [sceptic.json](sceptic.json).
