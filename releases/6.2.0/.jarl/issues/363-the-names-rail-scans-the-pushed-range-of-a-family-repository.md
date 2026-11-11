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

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (at ffbb330, the tests alone, from a git archive export) · **saw:** fail 1, pass 0: ERR_MODULE_NOT_FOUND rails/names-range.mjs
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (at ffbb330, the tests alone, from a git archive export) · **saw:** fail 1, pass 0: ERR_MODULE_NOT_FOUND rails/names-range.mjs
- **ran (line 3da7bea8886a):** node --test workspace/test/names-range.test.mjs (at the fix) · **saw:** tests 11, pass 11, fail 0; among them: a planted name in a file and in a commit message is refused with the file, the line and the commit, and never printed
- **ran (line 45af49e5f675):** node --test workspace/test/names-range.test.mjs (at the fix) · **saw:** tests 11, pass 11, fail 0; among them: the hook template refuses a push without the key to the canonical remote and lets one through elsewhere with one line

Assumed: the canonical remote of a tool repository is any URL whose owner is one family/registry.json names (today one owner), or an absent URL, so a family repository not yet in the registry is gated too. The hook's fallback without an Althing checkout holds the same owner in its text and is a little stricter (the owner anywhere in the URL).

Assumed: only the names rail runs on a tool repository (not Althing's English, path or binary rails), and it also reads each commit's author and committer, the lines a merge adds over every parent, and a name split between an old line and an added one. A path or a ref that itself carries a name is not printed. With the key, a push to a fork is scanned and refused on a hit too.

Assumed: the hook finds Althing through ALTHING_ROOT, else the folder Althing beside the repository's main checkout; the template is workspace/hooks/pre-push and nothing installs it.

