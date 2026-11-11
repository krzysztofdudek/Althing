# 610 · Yggdrasil: a script rule that asks for the syntax tree of a large dense file ends as check-failed-t…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1541-motj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-340c-fable
**Where:** the review of 340
**Branch:** jarl/561-parser-abort
**Worker:** w-561-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Yggdrasil: a script rule that asks for the syntax tree of a large dense file ends as check-failed-to-run with "Aborted()", and the report tells the author to fix a bug in check.mjs. Seen with a rule that reads file.ast on a .json file holding an array of about 33 million numbers, at 67108864 and at 67108865 bytes, on release/6.2.0 at 41e944cd6 and on the branch of issue 340 alike: "check.mjs threw an exception while running. Aborted(). Build with -sASSERTIONS for more info." A 65 MiB .json of one long string parses and is judged, so the size of the tree is what fails, as the tree builder runs out of its own memory. The rule has no bug and cannot catch it; the pair stays unverified with no advice that fits. Probably the same cause as issue 561, met through a rule's tree where 561 met it in the relation check.

## Why


## Acceptance


[test] A script rule that asks for the syntax tree of a file the parser aborts on (a dense 64 MiB JSON array) gets the file marked as having no tree with the reason, not a check-failed-to-run that blames check.mjs, red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: yg check reads every other file when one mapped source file is too large or too dense for the parser (a source file over 4 MiB is read in a process of its own; a file whose tree does not fit in the parser's 2 GiB is reported as relation-parse-failed with the reason). Fixed: a script rule that asks for the syntax tree of such a file is left unverified with the reason, instead of check-failed-to-run with advice to fix check.mjs.

## Evidence

### Proof

- **ran (line dd378c10e8ab):** cd source/cli && npx vitest run tests/e2e/parser-memory.test.ts (the new test file, on a scratch copy of release/6.2.0 at 03ac2699d, built) · **saw:** RED before: 4 failed (4). The rule tests fail: a rule reading file.ast of a dense 64 MiB JSON array ends as 'Script rule valid-json failed to run' with Aborted(), and yg aspect-test prints Aborted() twice and a command error without the file's name.
- **ran (line dd378c10e8ab):** cd source/cli && NODE_OPTIONS=--max-old-space-size=8192 npx vitest run tests/e2e/parser-memory.test.ts tests/unit/structure/parser-memory.test.ts tests/unit/structure/det-worker-pool.test.ts (branch jarl/561-parser-abort, built) · **saw:** GREEN after: all passed. The pair of valid-json on payments is unverified with 'asked for the syntax tree of src/rates.json ... the parser ran out of memory building it', no check-failed-to-run, no 'Fix the bug', the other rule of the component is judged; yg aspect-test --files stops with the same reason; a worker thread whose parser aborted is replaced and the next task gets its trees.

### Notes

Assumed: 'marked as having no tree with the reason' means file.ast is undefined for that file and the pair ends unverified with a report naming the rule, the file and the reason, as a file over the text limit already does. A long file is first parsed in a process of its own, so the rule's thread keeps a working parser and the other rules are judged. When several smaller trees together exhaust a thread's parser, a worker thread is replaced; on the main thread the later rules that ask for a tree are left unverified naming the file the parser stopped on.

