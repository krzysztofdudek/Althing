# 622 · Althing: the names range scan reads a signed commit's signature as text and a tag's non-UTF-8 text as UTF-8

**Status:** in-progress
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
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
A short deny-list entry can match a base64 fragment of a signature and refuse an honest push (a false red), and a tag written in another encoding is decoded wrongly, so a name in it can pass.

## Acceptance
[test] A signed commit whose signature happens to contain a short test word passes, and a tag message written in ISO-8859-2 with a test word is refused, each red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line fc9aa193cb13):** node --test rails/test/run.test.mjs workspace/test/names-range.test.mjs (a git archive export of 481812c, the code before the fix, with the two test files of beb397d) · **saw:** tests 54, fail 3, pass 51: a commit signed with an OpenPGP or an SSH signature whose letters hold a three-letter test entry is refused, and a tag message and a commit message in ISO-8859-2 with a test entry in Polish letters pass as clean
- **ran (line fc9aa193cb13):** node --test rails/test/run.test.mjs workspace/test/names-range.test.mjs (the tree of d365558, the fix) · **saw:** tests 54, pass 54, fail 0: both signed commits pass, a comment line of the armor and lines that are no signature are still refused, a signed tag's message is read, and the ISO-8859-2 tag and commit are refused as bytes that are not UTF-8
- **ran (line fc9aa193cb13):** node --test --test-name-pattern signature rails/test/run.test.mjs workspace/test/names-range.test.mjs (a git archive export of 3ee9975 with the two test files of 28a9ea0, then at ad2daf6) · **saw:** before: fail 1 of 3, a true signature's lines under a checksum that is not theirs are left out unread; at ad2daf6: pass 3 of 3

### Notes

Assumed: a signature's encoded lines are left out only when proved to be one (valid base64 whose bytes are OpenPGP signature packets or an SSH signature and nothing else, under the right checksum where there is one); an X.509 signature and anything unproved stays text, a false red named in rails/README.md. A tag whose bytes are not UTF-8, and a commit that is not UTF-8 and declares no encoding, is refused whatever it says (a false red named there too), because no other reading of it can be trusted.

