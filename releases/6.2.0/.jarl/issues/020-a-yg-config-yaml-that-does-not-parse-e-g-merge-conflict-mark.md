# 020 · A yg-config.yaml that does not parse (e.g. merge conflict markers) or is missing crashes every navigation command with error[internal] 'This is a bug — please file an issue'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/config-parser.ts, Yggdrasil/source/cli/src/core/graph-loader.ts, Yggdrasil/source/cli/src/core/validator.ts, Yggdrasil/source/cli/src/cli/preamble.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/config-parser.ts:404-405 (parseConfigInner: readFile and parseYaml not wrapped in ConfigParseError; compare readOverlay :384-396 for yg-secrets.yaml); core/graph-loader.ts:182-183 (the catch in loadGraph rethrows without tolerateInvalidConfig), ~669-686 diagnoseGraphLoadError, ~693-704 loadGraphOrThrow; cli/preamble.ts:15-37 (abortOnUnexpectedError → internal); core/validator.ts:122-126 (the fallback 'does not parse' and 'Fix the syntax error' also when the file is missing)
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
Only `yg check` (and type-suggest, pack*, incident, adopt and portal, which set tolerateInvalidConfig) classifies a broken config as error[config-invalid]. Reproduction (npm yg 6.1.0, a fresh repo after `yg init`): (A) git conflict markers around 'debug:' in .yggdrasil/yg-config.yaml; `yg check`: `error[config-invalid] yg-config.yaml does not parse …`, exit 1; `yg tree`, `yg context --file src/a.ts`, `yg owner --file`, `yg aspects`, `yg flows`, `yg structure`, `yg suppressions`, `yg impact --file`: `error[internal]: Unexpected error while <ctx>: Implicit keys need to be on a single line … why: The CLI encountered an error it does not classify. next: This is a bug — please file an issue`, exit 1; `--json` gives yg-error/1 with code "internal" and next.command null. (B) A stray tab: the same split. (C) A missing file: tree and context give error[internal] with a raw ENOENT, while check says 'does not parse: ENOENT …' and 'Fix the syntax error in .yggdrasil/yg-config.yaml' about a file that does not exist. A real `git merge` with conflicting edits to yg-config.yaml triggers this naturally (the .gitattributes from yg init gives this file no merge driver), and `yg context` then prints error[internal]. Controls: a broken yg-secrets.yaml, an unknown top-level key and a broken yg-architecture.yaml do not stop navigation; `version: 5` gives a correctly classified error[graph-load-failed]. This is a leftover of item F1/C7 of the release-readiness report of 2026-09-24 (kept in a private repository), absorbed by issue 228 in 6.1.0 and not delivered. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-17/logs/verify-17-config-internal.log, verify-17-real-merge.log, verify-17-controls.log (scripts repro.sh, realmerge.sh, control.sh in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-17/).

## Why
An agent that `yg context` (mandatory before editing) tells 'This is a bug — please file an issue' may stop or escalate instead of fixing the config. docs/cli-reference.md:3033 defines internal as a CLI bug, and config-invalid (:2827) is documented precisely for this case. It is not a regression from 6.0.0, the exit code is right, and check, as the first command of the protocol, classifies correctly, hence minor.

## Acceptance
- parseConfigInner wraps the read and parse error in ConfigParseError (like readOverlay); every navigation command from the list in What reports config-invalid naming .yggdrasil/yg-config.yaml and the line.
- A missing file has its own what/next (restore from VCS or `yg init --upgrade`), without 'syntax error'.

## Changelog
- Fixed: a yg-config.yaml that does not parse (conflict markers, a stray tab) or is missing is reported as config-invalid by every command, naming the file and the line, instead of an internal error asking for a bug report; a missing file is said to be missing.

## Evidence

- **ran:** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

