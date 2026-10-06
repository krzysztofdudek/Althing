# 064 · A parse error in .yggdrasil/yg-secrets.yaml prints the API key verbatim on stdout and in `yg check --json`

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/secrets-parser.ts, Yggdrasil/source/cli/src/io/config-parser.ts, Yggdrasil/source/cli/src/utils/redact.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/secrets-parser.ts:52 `parseYaml(content)` with the yaml 2.9.1 default `prettyErrors: true` (the YAMLParseError message carries a code frame that repeats the bad line, sometimes the previous one too); source/cli/src/io/config-parser.ts:388-394 (readOverlay) copies `err.message` unchanged into the `what` of the config-invalid error; redactSecrets and redactedTail from utils/redact.ts are not applied here
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
Reproduction (npm @chrisdudek/yg 6.1.0, a fresh repo after `yg init --provider anthropic --model claude-haiku-4-5`, isolated HOME and git config, no key in the environment, fake keys sk-ant-api03-FAKE… in the gitignored .yggdrasil/yg-secrets.yaml): `yg check`, `yg check --no-approve` and `yg check --json` print the full key on stdout (never on stderr) in 4 of 4 broken shapes: (1) a duplicated api_key during rotation (both come out, the old one and the new one, e.g. `api_key: <fake key OLDKEY-1111111111>` and `...-NEWKEY-2222222222`), (2) a value containing ': ', (3) a tab in the indentation, (4) an unclosed quote. In the text the key stands in the `at:` block, in JSON in issues[0].what. Control: a valid yg-secrets.yaml with the same key prints it nowhere (exit 0); `yg tree` and `yg context` do not print it; yg writes the key to no file (a recursive grep finds it only in yg-secrets.yaml). The credentials.ts:31 comment promises 'None of these messages ever repeats the key itself', and the tool redacts secrets in reviewer reasons and in provider errors. This is not 226, 340, 514 or 337 of 6.1.0, nor 020 here. Correction to the issue as filed: `redactReason` does not exist in 6.1.0 (it is only on the unmerged 514 branch); the existing helpers are redactSecrets and redactedTail; the `yg context` step from the finder's script does not reveal the key. The code is unchanged from v6.1.0 to origin/main 2493aa16. Repro: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-32/repro.sh, log <the session scratchpad, since lost>/bughunt/yggdrasil/verify-32/logs/verify-32-run1-1790925978.log; cause: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-32/cause.sh and <the session scratchpad, since lost>/bughunt/yggdrasil/verify-32/logs/verify-32-cause.log; issue as filed: <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/F-secrets-parse-error-prints-key.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/repros/secrets-parse-leak.sh.

## Why
yg-secrets.yaml is the documented place for keys, and a plain YAML typo is enough for the key to reach the terminal. AGENTS.md tells agents to start every session with `yg check`, so the key lands in the agent's context and transcript, and from there in pasted issues. CI rarely has this file, and GitHub Actions masks registered secrets, hence minor, but the fix is one line.

## Acceptance
Each of the four broken shapes of yg-secrets.yaml gives a config-invalid that names the file, line and column (from err.linePos), without the key value: the output of `yg check`, `yg check --no-approve` and `yg check --json` does not contain the key string (grep in an e2e test), e.g. through `parseYaml(content, { prettyErrors: false })` or by passing the detail through redactSecrets.

## Changelog
- Fixed: a yg-secrets.yaml that does not parse no longer prints your API key; yg check (and --json) names the file, line and column and quotes nothing from it.

## Evidence

- **ran:** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

