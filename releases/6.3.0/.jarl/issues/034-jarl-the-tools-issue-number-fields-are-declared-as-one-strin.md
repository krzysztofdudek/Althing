# 034 · Jarl: the tools' issue-number fields are declared as one string though they take lists, and tag +a,b stores one tag written a,b

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 015
**Found by:** rev-jarl-015d-opus
**Where:** Review of 015 after its takeover (2026-11-03)
**Branch:** jarl/034-tags-list-schema
**Merged:** d53603f in ../../../JarlSkill
**CI:** none

## What
The ids and id fields of the tools accept a list and refuse list text, but their declared schema type stays string, so a client reading the schema sends text. tag +a,b stores one tag a,b, as it did before 015.

## Why
A schema that says string invites the list-as-text a call then refuses; a comma inside one tag is almost never meant.

## Acceptance
- The id-list fields declare a list in the tool schema (built in jarl-mcp, within what the vendored Runes adapter allows), with a test reading the schema
- tag +a,b adds two tags, or is refused with a message, with a test

## Changelog
- Fixed: A comma in a tag command separates tags: +a,b adds a and b, and -a,b removes both. Before, the command added one tag named a,b.

## Evidence

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules
- **ran:** node --test --test-name-pattern='declares a list for the id field' tests/list-fields.test.mjs (in skills/jarl/scripts), before the schema change · **saw:** tests 1, pass 0, fail 1: the schema lists no field as a list (actual [], expected the fifteen id fields); red
- **ran:** node --test --test-name-pattern='a comma list in a tag operation' tests/list-fields.test.mjs (in skills/jarl/scripts), before the tag change · **saw:** tests 1, pass 0, fail 1: tag 1 +a,b printed '1 tags: a,b' where '1 tags: a, b' was expected; red
- **ran:** node --test --test-name-pattern='no name in it is refused' tests/list-fields.test.mjs (in skills/jarl/scripts), before the tag change · **saw:** tests 1, pass 0, fail 1: tag 1 +, was accepted where a refusal was expected; red
- **ran:** node --test --test-name-pattern='declares a list for the id field' tests/list-fields.test.mjs (in skills/jarl/scripts), after the schema change · **saw:** tests 1, pass 1, fail 0: the schema declares a list for the fifteen id fields and for no other field; green
- **ran:** node --test --test-name-pattern='a comma list in a tag operation' tests/list-fields.test.mjs (in skills/jarl/scripts), after the tag change · **saw:** tests 1, pass 1, fail 0: tag 1 +a,b printed '1 tags: a, b', -a,b takes both off on the command line and through the tool; green
- **ran:** node --test --test-name-pattern='no name in it is refused' tests/list-fields.test.mjs (in skills/jarl/scripts), after the tag change · **saw:** tests 1, pass 1, fail 0: a tag operation with no name in it, or with a name that starts with -, is refused and writes nothing; green
- **ran:** tag 034 +a,b on a copy of the release loop, before the change, then list --tag a,b · **saw:** 034 tags: a,b; list --tag a,b: (none); the Tags header is read back as a and b, so list --tag a lists the issue; red
- **ran:** tag 034 +a,b on a fresh copy of the release loop, after the change, then list --tag a,b, list --tag a and tag 034 -a,b · **saw:** 034 tags: a, b; list --tag a,b: (none); list --tag a: the issue listed with tags a, b; tag 034 -a,b: 034 tags: (none); green
- **ran:** nice -n 15 timeout 1800 npm test in skills/jarl/scripts, with TMPDIR set to a worker folder, on the working tree the commit records · **saw:** tests 1037, pass 1014, fail 0, skipped 23 (the same skips as before the change), 777 s; green
- **ran:** git diff of the change to skills/jarl and CHANGELOG.md, read for any skip marker, as a check on the phrase in the full-suite row above · **saw:** no line of the diff adds or removes a skip; the phrase 'the same skips as before the change' was not measured against a run of the base tree, so it stands as a reading of the diff only
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at 5ce62f0 with 034, 102 and 065 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1075 tests, 1052 pass, 0 fail, 23 skipped

