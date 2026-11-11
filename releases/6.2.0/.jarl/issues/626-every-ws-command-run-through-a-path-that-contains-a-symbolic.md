# 626 · Every ws command run through a path that contains a symbolic link does nothing and exits 0 (doctor,…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1752-jwxp
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363f-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Every ws command run through a path that contains a symbolic link does nothing and exits 0 (doctor, status, check, release), because the run-directly check at the end of workspace/ws.mjs compares import.meta.url, which node resolves through links, with process.argv[1] as given; a script or a hook that trusts its exit code sees a silent success (found in round 3 after the takeover of 363, where the names hook depends on it)

## Why


## Acceptance


[test] Every ws command run through a path that holds a symbolic link (a linked Althing, a link above it) runs its command, as run by its real path, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line d0d9c923763c):** node --test --test-name-pattern 'every ws command runs through' workspace/test/ws.test.mjs (the new test over a copy of the tree with workspace/ws.mjs of c17adf6, the commit before 8c71e7a) · **saw:** tests 1, pass 0, fail 1: ws help through Linked differs from the run by the real path
- **ran (line d0d9c923763c):** node --test --test-name-pattern 'every ws command runs through' workspace/test/ws.test.mjs (at 04882ee, and again at 5700eab) · **saw:** tests 1, pass 1, fail 0: seven ws commands (help, check, names, names with a folder, jarl resume, brief, an unknown command) give the same exit code and output by the real path, through a link to Althing and through a link above it

### Notes

Assumed: the fault of 626 no longer holds on main: 8c71e7a (issue 363) already compares real paths in workspace/ws.mjs. Nothing in ws's behaviour was changed for 626; the test that holds it for both link shapes and seven commands is added (04882ee), and ws now takes the check from rails/direct.mjs, the one copy 629 introduces.

