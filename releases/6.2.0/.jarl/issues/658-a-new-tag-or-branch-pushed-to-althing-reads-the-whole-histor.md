# 658 · A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:2…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2033-tcyd
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-592-opus
**Where:** the review of 592, 593, 602, 603, 608, 609, 613, 616, 622, 626, 629, 630
**Branch:** jarl/658-names-remote-asked
**Worker:** w-658-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:36

## What
A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once. Also (rev-592-opus, minor of 622): the proved-signature exclusion (rails/git.mjs:217-237) applies to any armor line in any header and anywhere in a tag's text, so a forged packet whose base64 spells a listed word passes pre-push, CI and the nightly scan; limit it to where git writes a signature (gpgsig, gpgsig-sha256, the armor at the end of a tag or mergetag) and name the forgery in rails/README.md's known limits.

## Why


## Acceptance


[test] The proved-signature exclusion applies only where git writes a signature (gpgsig and gpgsig-sha256 headers, the armor at the end of a tag or mergetag), so a forged packet spelling a test word elsewhere is refused; the forgery is named in rails/README.md's known limits, red before and green after · by: yg check && npm test

## Reviews
- **changes** · by rev-658-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2100-dctw
  Examined d9792bf (tests c71a985) on scratch copies whose digests come from an invented list under a test key, with a scratch home; the real key and list were never read. Every probe is a real commit or push through Althing's own hooks to local bare remotes, compared with the hooks of 9c55826. Both [test] lines are met (evidence rows by rev-658-opus): the five new tests fail at c71a985 for their own reasons and pass at d9792bf; npm test 201, pass 189, fail 0, skipped 11, todo 1; yg check --no-approve PASS.
  Important 1, rails/run.mjs:235-239 with rails/names-range.mjs:145: the pre-push leaves out every commit that any ref the remote lists reaches, pull-request refs among them. A host lists refs/pull/<n>/head and refs/pull/<n>/merge to anyone who asks (checked with git ls-remote on a public GitHub repository) and hides them from a push, so git sends those commits again while the scan skips them. Reproduced to a bare remote under krzysztofdudek/Althing.git with receive.hideRefs=refs/pull: (a) a contributor's commit holding a test word, on the remote only under refs/pull/7/head, merged here into main and pushed: "rails range (1 commit): clean", exit 0, and the remote's main now reaches the word; 9c55826 refused it (2 commits, 1 refusal) and nothing landed. (b) a leaked commit whose branch was deleted on the remote while a pull-request ref still reaches it, pushed again on a new branch: clean, landed; 9c55826 refused it. That is the fork pull request of AGENTS.md section 10 (public in the repository once it opens, and a local merge passes the pre-push) and the leak response's cleaned leak: a commit public only under a pull-request ref is on no branch, and the gate now puts it on one and says clean. Ask only for what a clone receives (git ls-remote --heads --tags, or the refs/heads/ and refs/tags/ patterns): public history sits on a branch or a tag, so a new tag or branch still costs 0 or 1 commits.
  Minor 2, rails/test/hooks.test.mjs:133-143 (unchanged, behaves differently now): the test "range --remote: only the canonical repository needs the key" runs the range with real github.com addresses (https and ssh, the canonical repository among them) and no GIT_ALLOW_PROTOCOL, and run.mjs now asks each remote, even when the push is then refused for the key or let through unscanned. Every npm test run sends about a dozen questions to github.com (traced for two of the addresses: 11 and 22 curl trace lines); offline they fail at once, on a network that drops packets each waits its 60 s limit. Set GIT_ALLOW_PROTOCOL=file there, as run.test.mjs now does.
  Minor 3, rails/git.mjs:222-230: a tag that git signs under extensions.compatObjectFormat carries a second signature in a gpgsig header among its headers (git 2.53, a SHA-256 repository with SHA-1 compat: a gpgsig header and the armor at the end). The new rule for tags reads that header's encoded lines as words, so a short entry may meet them by chance: a false red, never a leak; 9c55826 left them out. The mode is experimental and no family repository uses it: a known limit to name, or accept a proved armor that opens and closes a gpgsig or gpgsig-sha256 header of a tag too.
  Tried and holding (new tag and remote-asked): a new lightweight or annotated tag on public history, 0 commits, about 0.05 s on a 689-commit copy of Althing where 9c55826 was still reading after 60 s; a word listed after it went public no longer blocks a tag or a branch, and is refused where it is new (a fresh family remote, a fresh fork, a new commit); an annotated tag message with a word refused; round 2 of 363 (a private history after the address changed to the family remote, a mirror fetch with a pushurl to it, a cleaned leak pushed again from a clone that fetched it), round 3 (insteadOf to a mirror with pushInsteadOf back), remote.<address>.uploadpack and a whole-address insteadOf rule (one line, whole range): all refused, nothing landed; two push URLs, each asked on its own; a relative address from a subfolder resolves alike for git and the scan. Signatures: refused in a header of another name, continuing another header, a gpgsig header with text before or after its armor, a mergetag with text after its armor or the armor in its middle, the middle of a tag message, a paragraph after it, the headers of a tag, a forged armor before a clean one at the end (9c55826 let 15 of the 17 crafted objects through); a forged armor in a proper gpgsig or gpgsig-sha256 header (the previous examiner's form included), in two gpgsig headers, at the end of a mergetag or of a tag still lands, as rails/README.md now names it; real GPG and SSH signed commits, tags, tags of tags and signed merges of signed tags clean. Type change: refused both ways through the real pre-commit (yg check PASS first), clean when it carries nothing; 9c55826 passed both. No output carried a test word. Only the five files of the issue moved; no test, rail or hook was weakened apart from Important 1.
  outside the issue, filed as 660: names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commits that pull-request refs reach, as in Important 1 of 657/658: a contributor's or dependabot's pull request merged locally in a tool repository and pushed is not scanned for the commits a host lists under refs/pull; asking only for heads and tags in remoteHolds closes both.

## Evidence

### Proof

- **ran (line 273ad3743650):** node --test rails/test/run.test.mjs (the test for this line) against the old rails/git.mjs, at c71a985 (tests only) · **saw:** the test for line 1 failed: 657 'rails staged: clean.' for a staged type change; 658 'rails range (1 commit): clean.' for a forged armor in a header of another name
- **ran (line 273ad3743650):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 201, pass 189, fail 0, skipped 11, todo 1 (the todo is the existing direct.test.mjs one); rails/test/run.test.mjs 23/23 pass, the new tests green at d9792bf
- **ran (line 273ad3743650):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script)
- **ran (line 273ad3743650):** node --test rails/test/run.test.mjs on an extraction of c71a985 (the new tests on the old rails), then npm test at d9792bf · **saw:** at c71a985 the signature test fails with a continuation of another header: rails range (1 commit): clean. (actual 0, expected 1); at d9792bf it passes
- **ran (line 273ad3743650):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test, in the worktree at d9792bf · **saw:** tests 201, pass 189, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); rails/test/run.test.mjs all green
- **ran (line 273ad3743650):** timeout 300 yg check --no-approve, in the worktree at d9792bf · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script)
- **ran (line 273ad3743650):** real pushes through Althing's own pre-push to a local bare remote under krzysztofdudek/Althing.git, on a scratch repository at d9792bf whose digests come from an invented list under a test key: 17 crafted commits and tags carrying a forged OpenPGP armor whose letters spell a test word, then real GPG- and SSH-signed commits, tags, tags of tags and signed merges of signed tags; the same 17 through the pre-push of 9c55826 · **saw:** d9792bf refused with nothing landed: an armor in a header of another name, continuing another header, a gpgsig header with text before or after its armor, a mergetag with text after its armor or the armor in its middle, the middle of a tag message, a paragraph after it, the headers of a tag, a forged armor before a clean one at the end; landed as rails/README.md now names it: a proper gpgsig or gpgsig-sha256 header, two gpgsig headers, the end of a mergetag, the end of a tag; every real signature clean (1 or 3 commits, 0 for tags); 9c55826 let 15 of the 17 through
- **ran (line 273ad3743650):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 203, pass 191, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); the pull-request tests green in rails/test/run.test.mjs and workspace/test/names-range.test.mjs
- **ran (line 273ad3743650):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script), at 9c6d3b5

### Notes

Assumed: the remote is asked for a push to any remote, a fork's included, not only the canonical one, since the scan of a fork's commits runs when a key exists and a long new branch costs the same there.

Assumed: the armor that closes a mergetag header counts as where git writes a signature (a merge of a signed tag), beside gpgsig and gpgsig-sha256 and the end of a tag; an armor in any other header, a gpgsig whose armor does not open it, or anything after the armor, is read as text.

Assumed: the test helper run() in rails/test/run.test.mjs sets GIT_ALLOW_PROTOCOL=file, so the https canonical URL that existing pushed() tests pass can never reach the network when the remote is asked; it fails at once and the whole range is read.

