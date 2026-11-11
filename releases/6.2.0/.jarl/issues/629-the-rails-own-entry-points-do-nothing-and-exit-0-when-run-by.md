# 629 · The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symboli…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1807-icfn
**Tags:** althing, names, rails
**Files:** 
**Repo:** Althing
**Found by:** rev-363g-fable
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Merged:** 9a948c4 in Althing
**Merge check:** yg check && npm test · saw npm test 196 tests, 184 pass, 0 fail, 11 skipped, 1 todo on the merge; yg check PASS after the free script pairs

## What
The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symbolic link: rails/run.mjs:219, rails/names.mjs:266, rails/english.mjs:252 and workspace/blind-starts.mjs:256 keep the run-directly check that 8c71e7a replaced in workspace/ws.mjs (import.meta.url, which node resolves through links, against process.argv[1] as given). Reproduced on a scratch copy: node <linked path>/rails/run.mjs range <base> <head> --require-key prints nothing and exits 0, where the real path refuses with exit 1; rails/names.mjs the same; the other two by reading. Althing's own hooks call rails/run.mjs by a relative path, which node resolves to the real folder, so they are not affected (checked from inside a linked folder); a scan by hand or a script that names the file by a linked absolute path sees a silent success (found in the review of 363 at 8c71e7a, beside 626)

## Why


## Acceptance


[test] rails/run.mjs, rails/names.mjs, rails/english.mjs and workspace/blind-starts.mjs run their command when invoked by an absolute path through a symbolic link, red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-592-opus (fresh) · 2026-11-11 · model claude-opus-5-5@xhigh · batch 20261111T2033-afoi
  Minor (622; rails/git.mjs:217-237, rails/README.md:128): a forged signature armor carries a listed name past every scan (pre-push, CI and the nightly share the reader). Tried on the built tool through Althing's own pre-push: an OpenPGP armor with no checksum line, one packet of tag 2 whose length matches, its base64 spelling a test entry on a line of its own; a commit's gpgsig header with it arrived (range clean), and so did a tag whose message holds it in the middle, between prose lines, with a two-word entry written as Kelby/Fenn+A in base64 letters (the test list, not the real one); git shows that text as the tag's message. 'Proved' is a structural check, and the exclusion is wider than the README says: any armor in any header line, and anywhere in a tag's text, not only at its end. Only a deliberate forgery reaches it (no accidental path found), so a known limit: narrow the exclusion to where git writes a signature (the gpgsig and gpgsig-sha256 header, the trailing armor of a tag and of a mergetag) and name the forgery in the README's known limits. True SSH- and OpenPGP-signed commits and a signed tag pass clean. Judged on request: Althing's pre-push reads only the commits the pushed refs reach. This checkout sets no push refspec and no mirror; 916 commits are reached only by the local refs/t3 checkpoints and none from a branch, and a new-tag scan of main (648 commits) is clean, so the 290 history refusals cannot block a real push of a branch or tag. A push that carried those refs (--mirror, refs/t3/*) is read and refused by the path and English rails, as it must be. No names refusal is hidden: each prints on its own line, and the nightly runs on a fresh CI clone without those refs. Every leak of the 363 rounds re-run through Althing's own hooks with real commits and pushes to a local bare remote, each refused at the right place with nothing arrived: quoted paths (space, Polish letter, quotes), lines after '++ ' and '+++ b/', merge resolutions that remove a line or join two, a merge adding a file, a split name, author e-mail, committer name, extra header, mergetag, tag message, tagger, tag name, a tag of a tag, raw ISO-8859-2 commit and tag, ISO-8859-2 under an encoding header, an unknown encoding, a replacement object, a graft file (exit 2); a comment-only graft file and true signatures pass. Red before green reproduced for 592/609/616 (11 of 13 fail at df39a35), 622 (3 of 54 at 481812c), 603 (2 of 15 at 83df69c) and 613 (3 of 17 at 3ee9975, failing on git -C <dir> push, not on a missing module). 593 [read] met: method/boundary.md says the names rail 'also reads the pushed range of another family repository, on the maintainer's machine: node workspace/ws.mjs names runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (workspace/hooks/pre-push) runs it before a push leaves. The rails' README says what each scan reads and how'. No test, rail or hook weakened; the rule change carries the owner's ratification (code-read-only-to-tools-v2-ratified); rails/english.mjs keeps its old check under english-rule-link-fault-stays.
  outside the issue, filed as 657: Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.
  outside the issue, filed as 658: A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once.

## Evidence

### Proof

- **ran (line a8556c9d4f90):** node --test rails/test/direct.test.mjs (in the worktree at 66a7b2b, the tests alone, before the fix) · **saw:** tests 5, pass 0, fail 5: rails/run.mjs (two commands), rails/names.mjs, rails/english.mjs and workspace/blind-starts.mjs each print nothing and exit 0 through a link to Althing and through a link above it
- **ran (line a8556c9d4f90):** node --test rails/test/direct.test.mjs (at 5700eab) · **saw:** tests 5, pass 4, fail 0, todo 1: rails/run.mjs, rails/names.mjs and workspace/blind-starts.mjs run through both links with the exit code and output of the real path; rails/english.mjs is the todo, it waits for the owner (a-35)
- **ran (line a8556c9d4f90):** systemd-run --user --scope -p MemoryMax=12G --quiet nice -n 15 timeout 1800 npm test (in the worktree at c72089e, clean); timeout 300 yg check --no-approve · **saw:** npm test: tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, ruling english-rule-link-fault-stays); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified; rails/test/direct.test.mjs: rails/run.mjs (two commands), rails/names.mjs and workspace/blind-starts.mjs pass through both links; rails/english.mjs stays todo under ruling english-rule-link-fault-stays

### Notes

Ruling ask-35 (stuck, by owner): Left to the jarl's judgment (he did not know whether it is worth it). The jarl's judgment: not worth a new version of the rule lang/english now; Althing's hooks call it by a relative path, so the link fault reaches only a manual run through a link, and admitting a rule version needs his explicit word, which this is not. rails/english.mjs keeps its run-directly check; the case stays marked todo with this reason.

