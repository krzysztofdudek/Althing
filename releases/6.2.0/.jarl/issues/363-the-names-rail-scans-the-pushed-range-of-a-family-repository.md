# 363 · The names rail scans the pushed range of a family repository before its push

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261029T1423-mevg
**Tags:** althing, workplace, names, security
**Files:** Althing/rails, Althing/workspace
**Repo:** Althing
**After:** 359
**Found by:** owner
**Where:** method/boundary.md: the keyed names rail reads Althing's commits only; the key is the CI secret of Althing and of no other repository
**Branch:** jarl/363-names-range
**Worker:** w-363-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 14:04

## What
A command of the workspace runs the keyed names rail over a commit range of another family repository on the maintainer's machine (for example ws names --repo mimir origin/main..release/1.0.0), and a pre-push hook template that a tool repository installs calls it and refuses a push the rail cannot scan or that carries a name. Gard and Mimir install it first; any family repository may. The rail never prints a name it found, only the file, the line and the commit.

## Why
Mimir and Gard are public repositories built by someone who also works for companies, and Mimir's first history already carried such names; the leak gate has to stand before a commit leaves the machine, as it does for Althing.

## Acceptance
- A fixture repository with a planted deny-listed word in a file and in a commit message is refused with the file, line and commit, and the word is not printed
- The hook template refuses a push without the key to the canonical remote and lets one through to any other remote with one line saying it is unscanned, as Althing's pre-push does

## Reviews
- **changes** · by rev-363-opus (fresh) · 2026-11-11 · model claude-opus-5-5
  Examined 79400b0 (tests ffbb330) on a scratch copy of Althing whose digests were built from an invented test list under a test key; the real key and list were never read. The new test file passes 11/11 and fails at ffbb330 (module missing); npm test: 121 pass, 0 fail, 11 skipped; yg check --no-approve: PASS. The diff only adds lines; nothing protective was weakened; workspace/ runs only read commands (rev-parse, log, rev-list, diff-tree, cat-file, show, ls-tree) and code/read-only-to-tools passes.
  Line 1 [read], quoted: "A fixture repository with a planted deny-listed word in a file and in a commit message is refused with the file, line and commit, and the word is not printed". Met: the test of that name and my own fixtures are refused with the commit, the file and the line, and no test word appears in any output of the pre-push or by-hand form, except the error of Minor 6.
  Line 2 [read], quoted: "The hook template refuses a push without the key to the canonical remote and lets one through to any other remote with one line saying it is unscanned, as Althing's pre-push does". Met, by real git pushes through the installed template to local bare remotes under a family owner and under another owner: no key to the family, refused and nothing landed; no key to another remote, one line and pushed; no Node on PATH, refused to the family and one line elsewhere; no Althing checkout, the same; a wrong key, refused; with the key a push to a fork is scanned and refused on a hit. pushInsteadOf and insteadOf hand the hook the rewritten address, and a push from a linked worktree finds the Althing beside the main checkout.
  Important 1, rails/git.mjs:25 and :86 (used at rails/names-range.mjs:47 and :44): the lines added to a file whose path git quotes in a diff are never read, and the push reports clean. A space in the path makes git end the "+++" line with a tab; a non-ASCII letter or a double quote makes it a quoted, octal-escaped path; either way the key of the added-lines map differs from the path the file list gives, so no line counts as added. Reproduced: a test-list word added to "docs/Meeting notes.md", to a file with an accented letter and to one with a quote in its name, each "names range (1 commit): clean", exit 0; the same for a merge resolution in a path with an accented letter. No family repository has such a path today, but a space or an accented letter in a file name is ordinary in documents and fixtures, and this gate is the only names scan a tool repository gets.
  Important 2, rails/names-range.mjs:95-99: a pushed annotated tag is peeled to its commit, and its own message and tagger are never read. Reproduced with a real push: a tag whose message carries a test-list word, and one whose tagger name is a two-word test entry, reached the family remote with "names range (1 commit): clean". Release tags are pushed at every release, with messages an agent writes.
  Important 3, rails/names-range.mjs:55 and :59 (skippedForNames in rails/names.mjs): content the gate does not read passes as clean with no line saying so. Lockfiles (package-lock.json, *.lock, pnpm-lock.yaml) are skipped by the rail's list, and any file with a NUL byte in its first 8000 bytes is skipped as binary, UTF-16 text included. Reproduced: a "resolved" registry address carrying a test word in package-lock.json and in yarn.lock, a text file with an early NUL, and a UTF-16 file, each clean. Runes, Yggdrasil and Grain carry lockfiles and Yggdrasil eight image or archive files; the READMEs' "the lines it adds" is not true of them. Read them, or print one line naming each file not read; whether a binary file in a tool repository is refused is the owner's choice.
  Important 4, rails/names-range.mjs:99: a push of a new branch or of a tag (remote commit zero) reads the whole history, already-public commits included, so it is too slow for the largest family repository and is refused for good by any name already public. Measured with --tree and the test list: Runes 331 commits in 321 s, Grain 983 commits in 322 s, JarlSkill 927 commits in 370 s, and Yggdrasil (2138 commits) not finished after 900 s, so every new-branch or tag push to Yggdrasil outlasts an agent's command time limit. The hook gets the remote's name as $1, so the commits that remote's tracking refs already reach could be left out. Althing's own pre-push does the same.
  Minor 5, rails/names-range.mjs:44-45: a merge that adds a new file with no added line (empty, or binary) whose path carries a name passes, because the merge branch lists only files with added lines. A non-empty text file is refused.
  Minor 6, rails/names-range.mjs:68: ws names --tree aborts on a submodule whose commit is not in the repository, and the error prints the failed "git show HEAD:<path>", so a submodule path carrying a test word was printed whole. No family repository has a submodule today; tryGit and skipping gitlinks would close it.
  Minor 7, rails/names-range.mjs:89-100: an empty standard input reads as "names range (0 commits): clean" and passes with the key, so a chaining pre-push that has already read its input (the README's second way to install the template) turns the gate off without a word. Git never runs the hook with nothing to push, so an empty input can be refused.
  Minor 8, rails/names-range.mjs:58: a window may span more lines than words (a punctuation-only line between the words, the first word old and the last added), and a name may be formed by a deletion alone (a blank line removed between two old lines); both pass a range scan and --tree catches them. A known limitation.
  Checked and holding: a name in a commit message, split across its lines, in an author or committer e-mail, in a trailer, in a new or renamed path (not printed), in a pushed ref name in another case, in a pushed note; upper case, possessive, e-mail, camelCase, snake_case, a pair written together, two and three words over lines, Polish letters in NFC and NFD, folded ASCII, full-width letters, a zero-width space and a soft hyphen inside a word, CRLF lines; a capitalised cap entry refused and a lower-case one passing; a force-push over a known and an unknown remote tip; a new orphan branch; a deleted ref; a tag of a tree refused unread; an unrelated history merged in; an octopus merge; a merge resolution in a path with a space.
  outside the issue, filed as 602: Althing's staged and range rails read no added line of a file whose path git quotes in a diff
  outside the issue, filed as 603: Althing's pre-push does not read a pushed annotated tag's message or tagger

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (at ffbb330, the tests alone, from a git archive export) · **saw:** fail 1, pass 0: ERR_MODULE_NOT_FOUND rails/names-range.mjs
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (at ffbb330, the tests alone, from a git archive export) · **saw:** fail 1, pass 0: ERR_MODULE_NOT_FOUND rails/names-range.mjs
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (at the fix) · **saw:** tests 11, pass 11, fail 0; among them: a planted name in a file and in a commit message is refused with the file, the line and the commit, and never printed
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (at the fix) · **saw:** tests 11, pass 11, fail 0; among them: the hook template refuses a push without the key to the canonical remote and lets one through elsewhere with one line

Assumed: the canonical remote of a tool repository is any URL whose owner is one family/registry.json names (today one owner), or an absent URL, so a family repository not yet in the registry is gated too. The hook's fallback without an Althing checkout holds the same owner in its text and is a little stricter (the owner anywhere in the URL).

Assumed: only the names rail runs on a tool repository (not Althing's English, path or binary rails), and it also reads each commit's author and committer, the lines a merge adds over every parent, and a name split between an old line and an added one. A path or a ref that itself carries a name is not printed. With the key, a push to a fork is scanned and refused on a hit too.

Assumed: the hook finds Althing through ALTHING_ROOT, else the folder Althing beside the repository's main checkout; the template is workspace/hooks/pre-push and nothing installs it.
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (round 1, at ad8169b, the new tests alone, from a git archive export) · **saw:** pass 11, fail 8: quoted paths, the diff's paths, the annotated tag, lockfile and UTF-16 and binary, the remote's commits, the empty push, the merge's empty file, the submodule
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (round 1, at ac83dd9) · **saw:** pass 19, fail 0
- **ran (line 3da7bea8886a):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at ac83dd9's tree) · **saw:** tests 140, pass 129, fail 0, skipped 11
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (round 1, at ad8169b, the new tests alone, from a git archive export) · **saw:** pass 11, fail 8: quoted paths, the diff's paths, the annotated tag, lockfile and UTF-16 and binary, the remote's commits, the empty push, the merge's empty file, the submodule
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (round 1, at ac83dd9) · **saw:** pass 19, fail 0
- **ran (line 45af49e5f675):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at ac83dd9's tree) · **saw:** tests 140, pass 129, fail 0, skipped 11

Assumed: a true binary file is passed with one line saying it was not scanned (and a count in the last line), not refused, because a tool repository may hold some (an image, a compiled grammar) and refusing them would make the gate unusable there; its path is still read. Althing itself keeps refusing binaries by its own rule.

Assumed: what the remote already has is what its tracking refs on this machine reach (rev-list <head> --not <remote commit> --remotes=<name>); a remote name that is a URL, carries a glob character or has no tracking refs means the whole range. An empty push, or one of deletions only, exits 0 with a line saying there is nothing to scan, because git runs the hook for those too. Every line of a UTF-16 file counts as added, because git diffs it as binary.

