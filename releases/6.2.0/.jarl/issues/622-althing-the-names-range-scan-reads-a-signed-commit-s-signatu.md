# 622 · Althing: the names range scan reads a signed commit's signature as text and a tag's non-UTF-8 text as UTF-8

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1627-euid
**Tags:** althing, rails, names
**Files:** Althing/rails
**Repo:** Althing
**After:** 363
**Found by:** jarl
**Where:** w-363-takeover-fable, 363 after the takeover
**Branch:** jarl/592-names-gate
**Merged:** 9a948c4 in Althing
**Merge check:** yg check && npm test · saw npm test 196 tests, 184 pass, 0 fail, 11 skipped, 1 todo on the merge; yg check PASS after the free script pairs

## What


## Why
A short deny-list entry can match a base64 fragment of a signature and refuse an honest push (a false red), and a tag written in another encoding is decoded wrongly, so a name in it can pass.

## Acceptance
[test] A signed commit whose signature happens to contain a short test word passes, and a tag message written in ISO-8859-2 with a test word is refused, each red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-592-opus (fresh) · 2026-11-11 · model claude-opus-5-5@xhigh · batch 20261111T2033-afoi
  Minor (622; rails/git.mjs:217-237, rails/README.md:128): a forged signature armor carries a listed name past every scan (pre-push, CI and the nightly share the reader). Tried on the built tool through Althing's own pre-push: an OpenPGP armor with no checksum line, one packet of tag 2 whose length matches, its base64 spelling a test entry on a line of its own; a commit's gpgsig header with it arrived (range clean), and so did a tag whose message holds it in the middle, between prose lines, with a two-word entry written as Kelby/Fenn+A in base64 letters (the test list, not the real one); git shows that text as the tag's message. 'Proved' is a structural check, and the exclusion is wider than the README says: any armor in any header line, and anywhere in a tag's text, not only at its end. Only a deliberate forgery reaches it (no accidental path found), so a known limit: narrow the exclusion to where git writes a signature (the gpgsig and gpgsig-sha256 header, the trailing armor of a tag and of a mergetag) and name the forgery in the README's known limits. True SSH- and OpenPGP-signed commits and a signed tag pass clean. Judged on request: Althing's pre-push reads only the commits the pushed refs reach. This checkout sets no push refspec and no mirror; 916 commits are reached only by the local refs/t3 checkpoints and none from a branch, and a new-tag scan of main (648 commits) is clean, so the 290 history refusals cannot block a real push of a branch or tag. A push that carried those refs (--mirror, refs/t3/*) is read and refused by the path and English rails, as it must be. No names refusal is hidden: each prints on its own line, and the nightly runs on a fresh CI clone without those refs. Every leak of the 363 rounds re-run through Althing's own hooks with real commits and pushes to a local bare remote, each refused at the right place with nothing arrived: quoted paths (space, Polish letter, quotes), lines after '++ ' and '+++ b/', merge resolutions that remove a line or join two, a merge adding a file, a split name, author e-mail, committer name, extra header, mergetag, tag message, tagger, tag name, a tag of a tag, raw ISO-8859-2 commit and tag, ISO-8859-2 under an encoding header, an unknown encoding, a replacement object, a graft file (exit 2); a comment-only graft file and true signatures pass. Red before green reproduced for 592/609/616 (11 of 13 fail at df39a35), 622 (3 of 54 at 481812c), 603 (2 of 15 at 83df69c) and 613 (3 of 17 at 3ee9975, failing on git -C <dir> push, not on a missing module). 593 [read] met: method/boundary.md says the names rail 'also reads the pushed range of another family repository, on the maintainer's machine: node workspace/ws.mjs names runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (workspace/hooks/pre-push) runs it before a push leaves. The rails' README says what each scan reads and how'. No test, rail or hook weakened; the rule change carries the owner's ratification (code-read-only-to-tools-v2-ratified); rails/english.mjs keeps its old check under english-rule-link-fault-stays.
  outside the issue, filed as 657: Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.
  outside the issue, filed as 658: A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once.

## Evidence

### Proof

- **ran (line fc9aa193cb13):** node --test rails/test/run.test.mjs workspace/test/names-range.test.mjs (a git archive export of 481812c, the code before the fix, with the two test files of beb397d) · **saw:** tests 54, fail 3, pass 51: a commit signed with an OpenPGP or an SSH signature whose letters hold a three-letter test entry is refused, and a tag message and a commit message in ISO-8859-2 with a test entry in Polish letters pass as clean
- **ran (line fc9aa193cb13):** node --test rails/test/run.test.mjs workspace/test/names-range.test.mjs (the tree of d365558, the fix) · **saw:** tests 54, pass 54, fail 0: both signed commits pass, a comment line of the armor and lines that are no signature are still refused, a signed tag's message is read, and the ISO-8859-2 tag and commit are refused as bytes that are not UTF-8
- **ran (line fc9aa193cb13):** node --test --test-name-pattern signature rails/test/run.test.mjs workspace/test/names-range.test.mjs (a git archive export of 3ee9975 with the two test files of 28a9ea0, then at ad2daf6) · **saw:** before: fail 1 of 3, a true signature's lines under a checksum that is not theirs are left out unread; at ad2daf6: pass 3 of 3
- **ran (line fc9aa193cb13):** systemd-run --user --scope -p MemoryMax=12G --quiet nice -n 15 timeout 1800 npm test (in the worktree at c72089e, clean); timeout 300 yg check --no-approve; node --test rails/test/run.test.mjs workspace/test/names-range.test.mjs over a git archive of 481812c with the test files of beb397d; real commits and real pushes through Althing's own .githooks (pre-commit, commit-msg, pre-push) in a scratch copy of c72089e with a test key and an invented list, pushed to a local bare remote at a path ending krzysztofdudek/Althing.git; the Yggdrasil step of pre-commit stubbed, the rails step as committed; commits made without the key, pushed with it: true SSH- and OpenPGP-signed commits and tag, a raw ISO-8859-2 commit and tag written as objects, and forged armors · **saw:** npm test: tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, ruling english-rule-link-fault-stays); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified; before: tests 54, fail 3, pass 51; true signed commits and tag arrive clean; a commit and a tag whose bytes are not UTF-8 are refused, nothing arrived. A forged armor (OpenPGP packet tag 2 with a matching length, no checksum line) whose base64 spells a test entry on a line of its own passes and arrives: in a commit's gpgsig header, and in the middle of a tag's message with a two-word entry written with / and +

### Notes

Assumed: a signature's encoded lines are left out only when proved to be one (valid base64 whose bytes are OpenPGP signature packets or an SSH signature and nothing else, under the right checksum where there is one); an X.509 signature and anything unproved stays text, a false red named in rails/README.md. A tag whose bytes are not UTF-8, and a commit that is not UTF-8 and declares no encoding, is refused whatever it says (a false red named there too), because no other reading of it can be trusted.

