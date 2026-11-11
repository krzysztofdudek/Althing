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

