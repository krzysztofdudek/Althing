# 102 · oracle record writes the raw origin URL together with its credentials, and absolute local paths, to oracle.json, README.md, proposal.json and accepted.json, i.e. to a record the documentation presents as one to commit and share

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain, security
**Files:** Grain/plugins/grain/engine/oracle.mjs, Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/history.mjs:61-63 (originUrl returns the raw `git remote get-url origin`), oracle.mjs:593 (the record calls originUrl), :600 (target.repo and the absolute target.checkout), :601 (the absolute sources.proposal and sources.accepted), :162 (distill returns `root: graphRoot` at the top of proposal.json and accepted.json), :497 (readmeFor puts target.repo into the '**Target**' row), :633 (the 'it will NOT store' list in the consent plan), :454-463 (writeRecord writes everything unchanged). The code is unchanged between v6.1.0 and release/6.1.1, with the same line numbers.
**Branch:** jarl/102-oracle-record-privacy
**Merged:** 3c4ec98
**CI:** none

## What
Reproduction (fresh clone of v6.1.0 b70a4e9; the graph written by hand, without the yg binary): a repository with `origin` = `https://alice:ghp_FAKE…@github.com/acme/private-app.git`, then `grain oracle record --proposal P --name myapp --out O` and the same with `--yes`. A second variant with a URL shaped like a GitLab CI runner checkout: `https://gitlab-ci-token:glcbt-FAKE…@gitlab.example.com/...`. In both cases `--yes` ends with exit 0 and writes the URL with the token into oracle.json `target.repo` and into the '**Target**' row of README.md; `grain oracle score` prints it again in the `target` line.

Absolute local paths land in oracle.json (`target.checkout`, `sources.proposal`, `sources.accepted`) and in the `root` field at the top of proposal.json and accepted.json (which the issue did not list).

The consent plan prints the URL with the token in the 'the repository' line, but its 'it will NOT store' list ends at file contents and descriptions and does not say that the URL or the paths go to disk. docs/reference.md ('The oracle contract') calls the record 'small enough to commit and read' and says that 'a repository that cannot be shared can still contribute its oracle'; docs/validation.md and the README repeat the latter. The project itself scrubbed these fields by hand in its own oracle tests/stress/oracles/yggdrasil (the placeholders `<yggdrasil>` and `<scratchpad>` in oracle.json, README.md, proposal.json and accepted.json; commit 2f2c0fa: 'machine-local paths scrubbed from ... the recorded oracle').

Direction of the fix: strip userinfo from the remote URL (e.g. `new URL()` with username and password cleared, or only host and path; the scp form `git@host:path` must be handled too), remove the absolute paths or make them relative or optional, and list in the consent plan every field that identifies the machine or the remote.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f3-oracle-credentials.log (script f3-oracle-credentials.sh); verification <the session scratchpad, since lost>/bughunt/grain/verify-35/repro/oracle-origin-creds.log (script oracle-origin-creds.sh; a fresh clone in verify-35/grain-clone).

## Why
A secret (a PAT or a CI job token) lands in a file the documentation invites you to commit and share, and the consent plan is silent about it. Credentials in a remote URL are discouraged, but common: a pasted PAT, or every GitLab CI job checkout. The absolute paths alone would be a trifle, but they reveal the machine's layout, and the project itself judged them unfit for publication.

## Acceptance
- The record's oracle.json and README.md contain no userinfo from the remote URL (for `https://user:token@host/path` what remains is `https://host/path`), and the scp form `git@host:path` is handled.
- No file of the record (oracle.json, README.md, proposal.json, accepted.json) contains an absolute machine path; paths are relative or written only on request.
- The consent plan lists every stored field that identifies the machine or the remote.
- The script f3-oracle-credentials.sh: a grep for the token and for the absolute repository path in the record directory finds nothing.

## Changelog
- Security: `grain oracle record` no longer writes a user name, password or token from your remote's address, or any path on your machine, into the record you may share; the confirmation step now lists everything the record says about your remote and your machine.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/oracle-record-privacy.test.mjs (plugins/grain, worktree Grain-102) · **saw:** before (release/6.1.1 oracle.mjs): 4/4 fail (README.md and oracle.json hold ghp_… token, glcbt- CI token, plan prints the token); after 4c9f2b7: 4/4 pass
- **ran:** scratchpad/patch-611/grain-102/f3.sh (f3-oracle-credentials.sh pointed at the worktree, plus grep -rn over the whole record dir) · **saw:** before: token in oracle.json:7 and README.md:9, absolute paths in oracle.json checkout/sources and proposal.json/accepted.json root, grep exit 0; after: both greps find nothing, grep exit 1; plan shows https://github.com/acme/private-app.git

docs: docs/reference.md 'The oracle contract': oracle.json row — target is (repo, asOf, files, filesExcluded); repo = origin remote without user name/password/token/query/fragment, null when there is no origin or origin is a local path; 'checkout' removed; 'the two source directories' -> 'where the two graphs sit, relative to the repository (null for one outside it)'; proposal.json/accepted.json carry the same relative root. 'Structure and paths, never contents' paragraph: add no credentials from the remote URL and no absolute path of the machine. 'Consent is the command's output': it also names everything the record keeps about the remote and the machine.
- **ran:** npm test (plugins/grain, branch tip 220af73, no YG_BIN) · **saw:** 1862 tests, 1836 pass, 0 fail, 26 skipped

docs: docs/reference.md:761 says 'five documents', while oracle record writes six (with README.md) — fix in the final pass
- **ran:** review round 2: scratchpad/patch-611/grain-102/r2-shapes.sh (5 unclean shapes, record --yes + score) and tests/oracle-record-privacy.test.mjs · **saw:** before 3c8653e: the 4 unclean shapes kept the secret (stored in target.repo, in 2 record files, printed by record and score), vault::SEKRET5 called 'a local path'; test red at https://dave:SEKRET1/x@…; after 3c8653e: secret stored/printed 0 times for all, plan says 'origin's address does not parse cleanly' / 'an address for the vault remote helper'; test green
- **ran:** nice -n 15 npm test (plugins/grain, tip 3c8653e, after merging release/6.1.1) · **saw:** 1938 tests, 1909 pass, 0 fail, 29 skipped
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1938, pass 1937, fail 0, skipped 1, merge 3c4ec98

