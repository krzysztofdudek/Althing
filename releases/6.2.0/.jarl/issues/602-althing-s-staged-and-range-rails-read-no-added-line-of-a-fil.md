# 602 · Althing's staged and range rails read no added line of a file whose path git quotes in a diff

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1504-ofxf
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's staged and range rails read no added line of a file whose path git quotes in a diff
rails/git.mjs addedLines, used by rails/run.mjs for pre-commit (staged) and pre-push (range), keys the added lines by the "+++" path as git prints it. A space in the path ends that line with a tab, and a non-ASCII letter, a double quote or a backslash makes it a quoted, octal-escaped path, so the key never matches the path from the file list and no line of such a file counts as added: pre-commit and pre-push report clean over a deny-listed word added to it (reproduced on a scratch repository with a test list: "rails range (1 commit): clean"). CI's tree scan still reads the whole file on the canonical repository, so it is caught after the push, too late for a public repository. Found while reviewing 363, whose gate shares the parser.

## Why


## Acceptance


[test] Althing's staged and range rails read the added lines of a file whose path git quotes in a diff (a space, a non-ASCII letter, a quote), with a planted test word refused in each shape, red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-592-opus (fresh) · 2026-11-11 · model claude-opus-5-5@xhigh · batch 20261111T2033-afoi
  Minor (622; rails/git.mjs:217-237, rails/README.md:128): a forged signature armor carries a listed name past every scan (pre-push, CI and the nightly share the reader). Tried on the built tool through Althing's own pre-push: an OpenPGP armor with no checksum line, one packet of tag 2 whose length matches, its base64 spelling a test entry on a line of its own; a commit's gpgsig header with it arrived (range clean), and so did a tag whose message holds it in the middle, between prose lines, with a two-word entry written as Kelby/Fenn+A in base64 letters (the test list, not the real one); git shows that text as the tag's message. 'Proved' is a structural check, and the exclusion is wider than the README says: any armor in any header line, and anywhere in a tag's text, not only at its end. Only a deliberate forgery reaches it (no accidental path found), so a known limit: narrow the exclusion to where git writes a signature (the gpgsig and gpgsig-sha256 header, the trailing armor of a tag and of a mergetag) and name the forgery in the README's known limits. True SSH- and OpenPGP-signed commits and a signed tag pass clean. Judged on request: Althing's pre-push reads only the commits the pushed refs reach. This checkout sets no push refspec and no mirror; 916 commits are reached only by the local refs/t3 checkpoints and none from a branch, and a new-tag scan of main (648 commits) is clean, so the 290 history refusals cannot block a real push of a branch or tag. A push that carried those refs (--mirror, refs/t3/*) is read and refused by the path and English rails, as it must be. No names refusal is hidden: each prints on its own line, and the nightly runs on a fresh CI clone without those refs. Every leak of the 363 rounds re-run through Althing's own hooks with real commits and pushes to a local bare remote, each refused at the right place with nothing arrived: quoted paths (space, Polish letter, quotes), lines after '++ ' and '+++ b/', merge resolutions that remove a line or join two, a merge adding a file, a split name, author e-mail, committer name, extra header, mergetag, tag message, tagger, tag name, a tag of a tag, raw ISO-8859-2 commit and tag, ISO-8859-2 under an encoding header, an unknown encoding, a replacement object, a graft file (exit 2); a comment-only graft file and true signatures pass. Red before green reproduced for 592/609/616 (11 of 13 fail at df39a35), 622 (3 of 54 at 481812c), 603 (2 of 15 at 83df69c) and 613 (3 of 17 at 3ee9975, failing on git -C <dir> push, not on a missing module). 593 [read] met: method/boundary.md says the names rail 'also reads the pushed range of another family repository, on the maintainer's machine: node workspace/ws.mjs names runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (workspace/hooks/pre-push) runs it before a push leaves. The rails' README says what each scan reads and how'. No test, rail or hook weakened; the rule change carries the owner's ratification (code-read-only-to-tools-v2-ratified); rails/english.mjs keeps its old check under english-rule-link-fault-stays.
  outside the issue, filed as 657: Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.
  outside the issue, filed as 658: A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once.

## Evidence

### Proof

- **ran (line dd1dc0d1414f):** node --test rails/test/run.test.mjs (the test of 602 alone over a git archive export of ad8169b, the commit before ac83dd9 corrected the shared path parser) · **saw:** tests 1, fail 1: rails staged: clean, over a test word added to files with a space, a non-ASCII letter and a quote in their paths
- **ran (line dd1dc0d1414f):** node --test rails/test/run.test.mjs (at f5f1338, and in the full suite at 9b15fcf) · **saw:** pass: rails/run.mjs staged and range refuse the test word at line 2 of each of the three files; npm test at 9b15fcf: tests 190, pass 178, fail 0
- **ran (line dd1dc0d1414f):** systemd-run --user --scope -p MemoryMax=12G --quiet nice -n 15 timeout 1800 npm test (in the worktree at c72089e, clean); timeout 300 yg check --no-approve; real commits and real pushes through Althing's own .githooks (pre-commit, commit-msg, pre-push) in a scratch copy of c72089e with a test key and an invented list, pushed to a local bare remote at a path ending krzysztofdudek/Althing.git; the Yggdrasil step of pre-commit stubbed, the rails step as committed; commits made without the key, pushed with it: three staged files whose paths hold a space, a Polish letter and double quotes · **saw:** npm test: tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, ruling english-rule-link-fault-stays); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified; pre-commit with the key refuses all three at line 2 with their paths; committed without the key, the push is refused at the commit with each file and line 2, nothing arrived

### Notes

Assumed: the fault of 602 no longer holds on main: ac83dd9 (issue 363) corrected the path parser in rails/git.mjs, which rails/run.mjs staged and range used. No behaviour was changed for 602; the test that holds it for both scans is added (f5f1338), red against the tree before ac83dd9.

