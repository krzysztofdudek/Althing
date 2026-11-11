# 630 · Althing: the pre-push hook passes a push on any exit 0 of ws names, and no test holds its Althing lookup or its link handling

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T1809-vjaj
**Tags:** althing, rails, names, security
**Files:** Althing/workspace/hooks/pre-push Althing/workspace/test
**Repo:** Althing
**Found by:** jarl
**Where:** rev-363g-fable, the final review of 363 (pre-push:40 with ws.mjs:531)
**Branch:** jarl/592-names-gate
**Merged:** 9a948c4 in Althing
**Merge check:** yg check && npm test · saw npm test 196 tests, 184 pass, 0 fail, 11 skipped, 1 todo on the merge; yg check PASS after the free script pairs

## What


## Why
An empty or cut-off ws.mjs, or an older one behind a linked workspace folder, exits 0 without scanning and the hook takes it for a pass; and with the hook's two last changes reverted every test still passes, so a regression there would go unseen.

## Acceptance
[test] The hook passes a push only when ws names printed its own closing line (a clean range, the unscanned line, or nothing to scan); an empty ws.mjs, one cut off after its imports, and an exit 0 with no closing line are refused, and the Althing lookup (linked root, linked sibling, bare clone beside Althing, a git directory not named .git) has a real-push test each, red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-592-opus (fresh) · 2026-11-11 · model claude-opus-5-5@xhigh · batch 20261111T2033-afoi
  Minor (622; rails/git.mjs:217-237, rails/README.md:128): a forged signature armor carries a listed name past every scan (pre-push, CI and the nightly share the reader). Tried on the built tool through Althing's own pre-push: an OpenPGP armor with no checksum line, one packet of tag 2 whose length matches, its base64 spelling a test entry on a line of its own; a commit's gpgsig header with it arrived (range clean), and so did a tag whose message holds it in the middle, between prose lines, with a two-word entry written as Kelby/Fenn+A in base64 letters (the test list, not the real one); git shows that text as the tag's message. 'Proved' is a structural check, and the exclusion is wider than the README says: any armor in any header line, and anywhere in a tag's text, not only at its end. Only a deliberate forgery reaches it (no accidental path found), so a known limit: narrow the exclusion to where git writes a signature (the gpgsig and gpgsig-sha256 header, the trailing armor of a tag and of a mergetag) and name the forgery in the README's known limits. True SSH- and OpenPGP-signed commits and a signed tag pass clean. Judged on request: Althing's pre-push reads only the commits the pushed refs reach. This checkout sets no push refspec and no mirror; 916 commits are reached only by the local refs/t3 checkpoints and none from a branch, and a new-tag scan of main (648 commits) is clean, so the 290 history refusals cannot block a real push of a branch or tag. A push that carried those refs (--mirror, refs/t3/*) is read and refused by the path and English rails, as it must be. No names refusal is hidden: each prints on its own line, and the nightly runs on a fresh CI clone without those refs. Every leak of the 363 rounds re-run through Althing's own hooks with real commits and pushes to a local bare remote, each refused at the right place with nothing arrived: quoted paths (space, Polish letter, quotes), lines after '++ ' and '+++ b/', merge resolutions that remove a line or join two, a merge adding a file, a split name, author e-mail, committer name, extra header, mergetag, tag message, tagger, tag name, a tag of a tag, raw ISO-8859-2 commit and tag, ISO-8859-2 under an encoding header, an unknown encoding, a replacement object, a graft file (exit 2); a comment-only graft file and true signatures pass. Red before green reproduced for 592/609/616 (11 of 13 fail at df39a35), 622 (3 of 54 at 481812c), 603 (2 of 15 at 83df69c) and 613 (3 of 17 at 3ee9975, failing on git -C <dir> push, not on a missing module). 593 [read] met: method/boundary.md says the names rail 'also reads the pushed range of another family repository, on the maintainer's machine: node workspace/ws.mjs names runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (workspace/hooks/pre-push) runs it before a push leaves. The rails' README says what each scan reads and how'. No test, rail or hook weakened; the rule change carries the owner's ratification (code-read-only-to-tools-v2-ratified); rails/english.mjs keeps its old check under english-rule-link-fault-stays.
  outside the issue, filed as 657: Althing's pre-commit leaves out a staged file whose type changed (rails/git.mjs:278 filters ACMR, so a link turned into a file is not read, though line 284 treats a type change as handled): a link replaced by a note holding a test entry passed pre-commit with the key; the pre-push refused it. The filter predates this change.
  outside the issue, filed as 658: A new tag or branch pushed to Althing reads the whole history of the pushed commit (rails/run.mjs:230): measured on this machine, 648 commits of main in 991 s with a test key, clean. Not a leak, but a latent hard block: once any public commit trips a rule added or tightened later (a name put on the deny-list after it went public, which is the leak response's own case, or a stricter English or path rule), every new tag or branch push to Althing is refused, with no way out but rewriting public history or bypassing the hook. Asking the remote what it holds, as rails/names-range.mjs remoteHolds already does, removes both the wait and the block; the nightly CI history scan still reads the whole history. Same root as w-592-fable's outside note 2 on 592: file once.

## Evidence

### Proof

- **ran (line e82e122db763):** node --test --test-name-pattern 'the hook (passes|finds)' workspace/test/names-range.test.mjs (a git archive export of d365558 with the test file of df935e5; the same with the hook of 8c71e7a, and with the hook of c17adf6, in place of today's) · **saw:** today's hook: fail 1 of 3, an empty ws.mjs lets a commit with a test word reach a remote of the family; the hook of 8c71e7a: fail 2 (also the git directory under another name); the hook of c17adf6: fail 3 (also the links, the bare clone and the git directory kept apart)
- **ran (line e82e122db763):** node --test --test-name-pattern 'the hook (passes|finds)' workspace/test/names-range.test.mjs (the tree of 4b08335, the fix) · **saw:** tests 3, pass 3, fail 0: an empty ws.mjs, one cut off after its imports and three other ends with exit code 0 and no closing line are refused by real pushes with nothing arrived; the three closing lines pass; real pushes find Althing through a linked root, a link above it, a linked sibling, beside a bare clone, beside a git directory kept apart and beside one under another name
- **ran (line e82e122db763):** systemd-run --user --scope -p MemoryMax=12G --quiet nice -n 15 timeout 1800 npm test (in the worktree at c72089e, clean); timeout 300 yg check --no-approve · **saw:** npm test: tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, ruling english-rule-link-fault-stays); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified; the hook tests pass: an empty ws.mjs, one cut off after its imports and exit 0 without a closing line are refused by real pushes, and the Althing lookup holds through a linked root, a linked sibling, a bare clone and a git directory under another name

### Notes

Assumed: the hook holds the scan's lines until the scan ends and then shows them, so that it can judge the last line; the closing lines it accepts are the three rails/names-range.mjs prints, and that file says beside them that the hook reads them.

