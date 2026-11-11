# 608 · Althing's staged and range rails lose every added line of a file after an added line that begins wi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1536-jeew
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363b-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's staged and range rails lose every added line of a file after an added line that begins with "++ ", because addedLines in rails/git.mjs takes any "+++ " line for a file header

## Why


## Acceptance


[test] Althing's staged and range rails read every added line of a file after an added line that begins with '++ ' (headers told by position), red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-592-opus (fresh) · 2026-11-11 · model claude-opus-5-5@xhigh · batch 20261111T2033-afoi
  Minor (622; rails/git.mjs:217-237, rails/README.md:128): a forged signature armor carries a listed name past every scan (pre-push, CI and the nightly share the reader). Tried on the built tool through Althing's own pre-push: an OpenPGP armor with no checksum line, one packet of tag 2 whose length matches, its base64 spelling a test entry on a line of its own; a commit's gpgsig header with it arrived (range clean), and so did a tag whose message holds it in the middle, between prose lines, with a two-word entry written as Kelby/Fenn+A in base64 letters (the test list, not the real one); git shows that text as the tag's message. 'Proved' is a structural check, and the exclusion is wider than the README says: any armor in any header line, and anywhere in a tag's text, not only at its end. Only a deliberate forgery reaches it (no accidental path found), so a known limit: narrow the exclusion to where git writes a signature (the gpgsig and gpgsig-sha256 header, the trailing armor of a tag and of a mergetag) and name the forgery in the README's known limits. True SSH- and OpenPGP-signed commits and a signed tag pass clean. Judged on request: Althing's pre-push reads only the commits the pushed refs reach. This checkout sets no push refspec and no mirror; 916 commits are reached only by the local refs/t3 checkpoints and none from a branch, and a new-tag scan of main (648 commits) is clean, so the 290 history refusals cannot block a real push of a branch or tag. A push that carried those refs (--mirror, refs/t3/*) is read and refused by the path and English rails, as it must be. No names refusal is hidden: each prints on its own line, and the nightly runs on a fresh CI clone without those refs. Every leak of the 363 rounds re-run through Althing's own hooks with real commits and pushes to a local bare remote, each refused at the right place with nothing arrived: quoted paths (space, Polish letter, quotes), lines after '++ ' and '+++ b/', merge resolutions that remove a line or join two, a merge adding a file, a split name, author e-mail, committer name, extra header, mergetag, tag message, tagger, tag name, a tag of a tag, raw ISO-8859-2 commit and tag, ISO-8859-2 under an encoding header, an unknown encoding, a replacement object, a graft file (exit 2); a comment-only graft file and true signatures pass. Red before green reproduced for 592/609/616 (11 of 13 fail at df39a35), 622 (3 of 54 at 481812c), 603 (2 of 15 at 83df69c) and 613 (3 of 17 at 3ee9975, failing on git -C <dir> push, not on a missing module). 593 [read] met: method/boundary.md says the names rail 'also reads the pushed range of another family repository, on the maintainer's machine: node workspace/ws.mjs names runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (workspace/hooks/pre-push) runs it before a push leaves. The rails' README says what each scan reads and how'. No test, rail or hook weakened; the rule change carries the owner's ratification (code-read-only-to-tools-v2-ratified); rails/english.mjs keeps its old check under english-rule-link-fault-stays.
  outside the issue, filed as 657: Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.
  outside the issue, filed as 658: A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once.

## Evidence

### Proof

- **ran (line 328110750129):** node --test rails/test/run.test.mjs (the test of 608 alone over a git archive export of cca2888, the commit before 04aaa88 told headers by position) · **saw:** tests 1, fail 1: rails staged: clean, over a test word two lines after an added line that begins with ++
- **ran (line 328110750129):** node --test rails/test/run.test.mjs (at 6a54fa2, and in the full suite at 9b15fcf) · **saw:** pass: rails/run.mjs staged and range refuse the test word at line 3; npm test at 9b15fcf: tests 190, pass 178, fail 0
- **ran (line 328110750129):** systemd-run --user --scope -p MemoryMax=12G --quiet nice -n 15 timeout 1800 npm test (in the worktree at c72089e, clean); timeout 300 yg check --no-approve; real commits and real pushes through Althing's own .githooks (pre-commit, commit-msg, pre-push) in a scratch copy of c72089e with a test key and an invented list, pushed to a local bare remote at a path ending krzysztofdudek/Althing.git; the Yggdrasil step of pre-commit stubbed, the rails step as committed; commits made without the key, pushed with it: an added line that begins with '++ ' and one that begins with '+++ b/' before lines holding test entries · **saw:** npm test: tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, ruling english-rule-link-fault-stays); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified; pre-commit with the key refuses lines 3 and 5; the push is refused at the commit with lines 3 and 5, nothing arrived

### Notes

Assumed: the fault of 608 no longer holds on main: 04aaa88 (issue 363) made the shared parser tell a file header by its position. No behaviour was changed for 608; the test that holds it for both scans is added (6a54fa2), red against the tree before 04aaa88.

