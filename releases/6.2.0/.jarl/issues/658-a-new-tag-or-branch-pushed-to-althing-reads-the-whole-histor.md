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

## Evidence

### Proof

- **ran (line 273ad3743650):** node --test rails/test/run.test.mjs (the test for this line) against the old rails/git.mjs, at c71a985 (tests only) · **saw:** the test for line 1 failed: 657 'rails staged: clean.' for a staged type change; 658 'rails range (1 commit): clean.' for a forged armor in a header of another name
- **ran (line 273ad3743650):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 201, pass 189, fail 0, skipped 11, todo 1 (the todo is the existing direct.test.mjs one); rails/test/run.test.mjs 23/23 pass, the new tests green at d9792bf
- **ran (line 273ad3743650):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script)

### Notes

Assumed: the remote is asked for a push to any remote, a fork's included, not only the canonical one, since the scan of a fork's commits runs when a key exists and a long new branch costs the same there.

Assumed: the armor that closes a mergetag header counts as where git writes a signature (a merge of a signed tag), beside gpgsig and gpgsig-sha256 and the end of a tag; an armor in any other header, a gpgsig whose armor does not open it, or anything after the armor, is read as text.

Assumed: the test helper run() in rails/test/run.test.mjs sets GIT_ALLOW_PROTOCOL=file, so the https canonical URL that existing pushed() tests pass can never reach the network when the remote is asked; it fails at once and the whole range is read.

