# 126 · The next steps printed by oracle record do not work: `grain oracle score <name>` does not find a record written under --out, and the hint after the consent plan loses --repo

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-exhh
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/oracle.mjs, Grain/plugins/grain/engine/grain-context.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/oracle.mjs:520 (the record's README: "scoring needs no clone: `grain oracle score ' + record.name + '`"), :663 (the hint after `--yes`: `next: \`grain oracle score ${name}\``, though it should give the written dest.dir), :650 (the consent hint rebuilds the command from `--proposal`, `--graph` and `--out`, but not from `--repo`, and it too ends with a bare name), :539 (`--out` gives `<out>/<name>`), :684-695 (resolveOracleDir checks only `<cwd>/<name>` and `ORACLES_DIR()/<name>`); grain-context.mjs:94-95 (findRoot falls back to process.cwd(), which is why a hint without --repo takes whatever checkout one happens to be standing in). oracle.mjs unchanged since ae6152f on release/6.1.1 (0e0093a).
**Branch:** jarl/102-oracle-record-privacy
**Merged:** 3c4ec98
**CI:** none

## What
Reproduction (fresh Grain ae6152f, 6.1.0; yg 6.1.0; script verify-64/repro.sh, run in verify-64/run-1790927366):
A. Absolute `--out`, run from inside the repo: `record --yes` prints 'next: `grain oracle score myapp`', and the record's README ends with the same command. Run verbatim from the same cwd: 'no recorded oracle at <repo>/myapp or <clone>/plugins/grain/tests/stress/oracles/myapp', exit 1. `grain oracle score <out>/myapp` works, exit 0.
A2. `--out oracles` (relative, the natural use): the hint ends with exit 1, and `grain oracle score oracles/myapp` with exit 0.
A3. Control with `--out .`: the bare name resolves, but only because the record happens to lie in the cwd.
B. The consent step with `--repo R`, run from a directory outside any repo: the hint loses `--repo`; run verbatim from the same cwd it fails with 'grain oracle record --graph: no .yggdrasil/ under <cwd>', exit 1. The finder's log shows exit=0 only because the exit code was taken from the `| tail` pipeline.
B2 (beyond the report). The same hint run in another checkout with its own .yggdrasil silently records an oracle with exit 0, and the target and the accepted graph in oracle.json are that other checkout, not R: a wrong oracle without any error. The plan prints 'the repository <path>', so an attentive reader can notice it.

docs/reference.md:228 says that a bare `name-or-dir` 'resolves in the repository', the resolver's message says 'a name resolves only against this repository's own oracles', and reference.md:34 says that outside Grain's fixtures `--out` is required. `score <name>` therefore works as documented, and the bug is that `record` tells you to run a command its own documented rules will not resolve. The tests (tests/oracle-command.test.mjs:189, 220) always score `join(out, 'demo')`, never a bare name, and no test pins the hint text. Different from 263, 486 and 509 from release-6.1.0.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f2-oracle-score-hint.log (script f2-oracle-score-hint.sh beside it); verification <the session scratchpad, since lost>/bughunt/grain/verify-64/repro.log (the first line is the exact command).

## Why
A user who does exactly what the tool suggests gets an error, and in variant B2 records an oracle of the wrong repository. No data is lost and the record itself is correct, hence minor.

## Acceptance
- The next line and the record's README give the directory the record was actually written to (e.g. `grain oracle score <out>/myapp`).
- The hint after the consent plan carries `--repo` when it was given.
- repro.sh: every command printed by `record` in cases A, A2 and B, run verbatim from the same cwd, ends with exit 0 and works on the right repository.

## Changelog
- Fixed: the next steps `grain oracle record` prints now work as printed: the score command names the directory the record was written to, and the command that confirms the record keeps the repository you named.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/oracle-record-next-steps.test.mjs (runs every printed command verbatim via sh from the same cwd; out dir has a space) · **saw:** before (release/6.1.1 and at 4c9f2b7): 5/5 fail ('no recorded oracle at <repo>/myapp', hint without --repo, B2 recorded other.git); after 220af73: 5/5 pass
- **ran (history):** scratchpad/patch-611/grain-102/repro126.sh (verify-64 repro.sh pointed at the worktree) · **saw:** after: A/A2/A3 next lines name the written dir (grain oracle score <out>/myapp); B hint 'grain oracle record --repo <R> --proposal <P> --out <O> --name myapp2 --yes' run from outside any repo exit 0; B2 same hint from other-checkout records R (accepted graph R), no longer the other checkout
- **ran (history):** npm test (plugins/grain, branch tip 220af73, no YG_BIN) · **saw:** 1862 tests, 1836 pass, 0 fail, 26 skipped

jarl: the consent hint always carries --repo (also when none was given) and the record's README says 'grain oracle score .' — accepted
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1938, pass 1937, fail 0, skipped 1, merge 3c4ec98

