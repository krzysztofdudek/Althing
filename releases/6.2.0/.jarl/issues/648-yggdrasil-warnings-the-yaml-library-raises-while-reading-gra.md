# 648 · Yggdrasil: warnings the YAML library raises while reading graph files other than yg-config.yaml (yg…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-hhwr
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: warnings the YAML library raises while reading graph files other than yg-config.yaml (yg-aspect.yaml and the node, flow and architecture parsers, which still call parse) quote the source line unmasked: a key written as a YAML tag in yg-aspect.yaml prints whole on check and aspects (YAMLWarning: Unresolved tag: !sk-ant-...), and a key on a line with another warning prints whole in the excerpt.

## Why


## Acceptance


[test] A warning the YAML library raises while reading any graph file (yg-aspect.yaml, node, flow, architecture) masks a key-shaped value in its message and its source excerpt, on check and aspects, red before and green after · by: cd source/cli && npm test

## Changelog
- A rule file is named from the repository root in every message about it, and a key written as a YAML tag in any graph file is masked: each refusal yg check prints about a rule's yg-aspect.yaml names .yggdrasil/aspects/<rule>/yg-aspect.yaml instead of an absolute path, in text and with --json, and a key written as a YAML tag, or sitting on a line the YAML reader warns about, in a rule, node, flow, architecture or package file is shown by its first four characters in the warning every command prints.

## Reviews
- **changes** · by rev-641-opus (fresh) · 2026-11-12 · model claude-opus-5-5@high · batch 20261112T0004-bazc
  Important 1 (647, commit 9bc2e235b): the branch commits source/cli/node_modules as a symbolic link to the dev container's own node_modules folder (mode 120000), a machine path in the tree. The ignore line node_modules/ matches only a directory, so the link went in unnoticed (docs/node_modules is the same link, untracked). Merged, a fresh clone gets a dangling link, and a checkout where source/cli/node_modules is a real folder or the container's mounted volume must replace that ignored folder with the link: git treats ignored files as expendable, so the merge either fails on the mount point or empties the installed packages. Fix: remove it from the index in its own commit and ignore node_modules without the trailing slash. Important 2 (682): CHANGELOG.md and the 682 changelog say a key pasted into yg-architecture.yaml is shown by its first four characters in every message yg check prints about that file, in text and --json; three are not masked on the tip and print the key whole: type-unknown-parent (parents: [<key>]), aspect-undefined for a type's aspects ([<key>]) and relation-target-type-unknown (relations.uses: [<key>]), text 3 times and --json 6 times each. Either mask them (src/core/checks: the architecture messages) or narrow both changelogs to the file's refusals. Minor 3 (merge with jarl/302-log-merge-integrity, issue 574): a trial merge gives 15 conflicting hunks in source/cli/src/core/log/log-merge-resolve.ts; 302 already reworked the same next steps (the log file plus the re-run command, verifyUnion taking a location object). Taking 302's side in every hunk loses nothing of 649 (the node-not-found masking merges cleanly), but the new test in tests/unit/core/log-merge-resolve.test.ts ('names the log file in what it asks for') merges without a conflict and then calls verifyUnion with a string, so it fails the typecheck: the merger must rewrite it to pass { gitLogPath, rerun }. Minor 4 (661, cli-base.ts endReviewerWork): a group kept after its leader exits is SIGKILLed at a normal exit without checking that it still has members; if the members ended earlier in a long run and the number was reused as another group of the same user, that group is killed. forgetEmptyGroups() before the kill narrows it. Minor 5 (647/670): templates/rules.ts:97, the agent rules every project gets, still says only Ctrl+C or SIGTERM writes the finished verdicts, while docs and the cli reference now name SIGHUP. Minor 6: commit da4dbc2cb carries three issues (641, 648, 650) in one commit. Tried and holding: every new test red on the release source for the reason it names and green on the tip (250 tests); 25 hand-written yg-architecture.yaml refusals print the same text on release and tip, the YAML syntax error names the file and line, and the reviewer verdict for parser-contract on architecture-parser.ts is approved in the lock; SIGHUP to yg and a closed pty during a claude-code and a Copilot review with stand-in reviewers: reviewer stopped, verdict kept, no folder or lock left; SIGKILL: folder and lock left and removed by the next run, a live run's folder kept; 60 leak probes over node, flow, rule, adaptation and architecture files and command flags: every leak left on the tip is identical on release except Important 2. The three tests judged flaky (portal-extract, cli-check-json 9) pass 5 of 5 on the tip with the deterministic cache filled; they read the repository's own graph, so they race only with tests that rewrite its cache in the same run, not with this branch. The repository check log on the tip says All checks passed.
  outside the issue, filed as 683: Yggdrasil: yg context --file with a path that does not exist prints the repository root's absolute path in its error, next step and --json explanation (same on release/6.2.0)
  outside the issue, filed as 684: Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source excerpt, an unknown key, an unresolved alias, and the checks that quote a node's type, aspects, relation target or mapping, a flow's nodes, and a rule's implies or references (same on release/6.2.0)
  outside the issue, filed as 685: Yggdrasil: a key typed as an argument other than --aspect or --node is echoed whole: impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, find --json, and an unknown command or option (same on release/6.2.0)

## Evidence

### Proof

- **ran (line feb7aec62312):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts · **saw:** 108 passed; W1-W5 (key as a YAML tag or on a warned line in a rule, node, flow, architecture file masked in the warning on check, check --json and aspects) failed 5 of 5 on the release build, pass on this branch
- **ran (line feb7aec62312):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/io/architecture-parser-result.test.ts tests/unit/core/log-merge-resolve.test.ts tests/e2e/cli-log-integrity-extended.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts, on f0074df34 and with the same test files over the source of release/6.2.0 (f36bffcc0), each built · **saw:** tip: 250 passed. Release source: W1-W5 fail (W4: the architecture tag warning prints the key); green on the tip. By hand: a key as a YAML tag or an unknown directive in a node file printed whole on release, masked on the tip

### Notes

Assumed: besides the node, flow, architecture and rule parsers, the package manifest, yg pack update, yg prime's lock read and the 6.0.0 migration read their YAML through the masking step too, since each reads a committed graph file.

