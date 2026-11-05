# Resuming the 6.2.0 loop on another machine

**Read this first: the machine that takes this loop over prepares itself and then does nothing until the owner says to continue.** It reads this note and the 6.3.0 one (`releases/6.3.0/plans/resuming-on-another-machine.md`, which holds the setup steps and the way the loop is run), fetches the code below, checks that the record and the branches are there, reports in a few lines, and stops. The machine that wrote this note has stopped and runs nothing; two machines never run a loop at once.

Written 2026-11-05. The 6.2.0 loop is `releases/6.2.0/.jarl/` in this repository. It was not worked on in the session that wrote this note: that session ran the 6.3.0 loop. It is handed over with the 6.3.0 one because the owner asked that the other machine take over all open release work, and because its code exists only on the first machine.

## Where it stands

- The goal (read it with `node workspace/ws.mjs jarl status --release 6.2.0`): the family's 6.2.0 release (Yggdrasil, Grain, Jarl and Runes 1.1.0), the renumbered loop of the 6.1.1 patch. The manifest `releases/6.2.0/family.json` names the release branches: `release/1.1.0` of Runes, `release/6.2.0` of Yggdrasil, Grain and Jarl. State: open.
- Jarl 6.2.0 is published: JarlSkill has the tag `v6.2.0` and `origin/release/6.2.0` at `a2cc616`, equal to the local branch. Nothing of JarlSkill's 6.2.0 needs carrying over.
- Counts at this moment from `status --release 6.2.0`: 89 open, 28 waiting, 116 deferred, 294 done, 2 dropped, 82 merged with CI pending, 4 merged with CI red (184, 295, 469, 471), 1 question to the owner (`a-032`, which of 34 further Runes gaps go into Runes 1.1.0), 7 items to ratify. `jarl resume --release 6.2.0` says the rest.
- **Horde is out.** Horde left the family on 2026-11-04 (ruling `horde-leaves-the-family`) and the owner says it is to be scrapped. The 6.2.0 manifest still lists it; nothing of Horde is carried. Nine issues of this loop name Horde in their Repo (eight open, one deferred): they are to be dropped, with the reason "Horde left the family", after the owner says to continue. They are not touched before.

## The code

Three repositories hold 6.2.0 work that exists only on the first machine (their release branches have no counterpart on the remote, or the remote is behind). Three bundles carry them, each with the release branch and every local-only branch of the repository, checked with `git bundle verify`:

| Repository | Bundle | Release branch tip | Other branches in the bundle |
|---|---|---|---|
| Runes | `Runes 6.2.0 code 2026-11-05.bundle` | `release/1.1.0` at `5d2a782` (the remote has `6f3df1b`; the local branch is three commits ahead, one of them a merge of `main` after Horde left) | `jarl/014-csharp-reach`, `jarl/177-csharp-forms`, `jarl/233-java-same-package`, `jarl/235-file-view` |
| Yggdrasil | `Yggdrasil 6.2.0 code 2026-11-05.bundle` | `release/6.2.0` at `d8deab98e` (no remote counterpart) | `jarl/021-navigation`, `jarl/028-packages`, `jarl/220-tier-secret`, `jarl/221-rebase-squash-and-ports`, `jarl/225-whole-repo-mapping`, `jarl/514-pkg-redaction-contracts`, `readme-ready`, and the tag `pre-structural-fixes-v2` |
| Grain | `Grain 6.2.0 code 2026-11-05.bundle` | `release/6.2.0` at `b1ddc48` (no remote counterpart) | `jarl/003-check-populations`, `jarl/169-oversize-relations`, `jarl/182-file-lineage`, `jarl/228-hooks-refresh` |

- The bundles are in the owner's exchange folder, in the area for the other machine. Fetch each with `git -C <clone> fetch "<bundle>" '+refs/heads/*:refs/heads/*' '+refs/tags/*:refs/tags/*'` (check out another commit first if git refuses to update a checked-out branch), then compare the tips above. A repository not cloned yet is cloned from its GitHub URL first. Never push, tag or rename in a tool repository without the owner's word; Runes may push the one branch `runes-push-branch` names.
- Yggdrasil's suite runs in its devcontainer (ruling `yggdrasil-in-devcontainer`); on the first machine no container, volume or extra working copy of Yggdrasil, Grain or Runes exists, so nothing was left in a container.
- The working copies of 6.2.0 workers do not exist any more on the first machine; the branches above are the work.

## What the owner decides

Pushing the release branches of Yggdrasil, Grain and Runes, the tags, publishing, and merging into any tool's `main` are the owner's words, as for 6.3.0. The question `a-032` and the 7 items to ratify wait for him.
