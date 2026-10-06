# 090 · A config with `version: "6.1.0"` (the release number; the CHANGELOG of 6.1.0 anticipates the mistake) is refused with advice to upgrade a CLI that is already the latest, and `yg init --upgrade` ends with exit 0 and leaves the graph unloadable

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/graph-loader.ts, Yggdrasil/source/cli/src/cli/init.ts, Yggdrasil/source/cli/src/core/migrator-runner.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/graph-loader.ts:151-152 throws UnsupportedSchemaVersionError for a version above CLI_SUPPORTED_SCHEMA ('6.0.0', :28); diagnoseGraphLoadError :643-648 always advises 'Upgrade the yg CLI to a version that supports schema X' without comparing X with cliVersion() (already used in cli/init.ts:787); :652 and :64 insert CLI_SUPPORTED_SCHEMA as 'this CLI (6.0.0)'; cli/init.ts:1051-1066 refuses only a missing, non-string or unreadable version, never a newer one; core/migrator-runner.ts:43-60 finds no migration when fromVersion is above the target and returns without an error; the type-law note init.ts:604-610 pastes the raw message (double punctuation '(max: 6.0.0).).')
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
Reproduction (fresh clone 2493aa16 = v6.1.0+5, no changes to graph-loader, init or the migrator since the tag; a fresh `npm i @chrisdudek/yg@6.1.0`, `yg --version` 6.1.0, `npm view` shows 6.1.0 as the latest version): control examples/checkout-flow with version "6.0.0": `yg tree` exit 0. Case A, version raised to "6.1.0": `yg check --json` gives yg-error/1 with code graph-load-failed, what 'Graph schema version 6.1.0 is newer than this CLI supports (max: 6.0.0).', next.text 'Upgrade the yg CLI to a version that supports schema 6.1.0 (e.g. `npm i -g @chrisdudek/yg`)…', command null, exit 1; following the advice (installing @chrisdudek/yg@latest in a fresh directory) installs 6.1.0 again and gives the same error. `yg init --upgrade` ends with exit 0, writes the .gitattributes and .gitignore lines and the merge drivers, the version stays "6.1.0", and the only signal is 'Type-law ratification was not taken up: the graph did not load (yg-config.yaml version "6.1.0" is newer than this CLI supports (max: 6.0.0).). … next: Fix what yg check reports, then run yg init --upgrade again.', which is a loop back to the CLI upgrade advice. Case B, version "5.9.0": the message says 'older than this CLI (6.0.0)', although the CLI is 6.1.0 (cosmetic); here `init --upgrade` repairs the version to "6.0.0". CHANGELOG 6.1.0 step 3 anticipates exactly this mistake ('a hand-raised "6.1.0" reads as a newer graph and is refused'), docs/configuration.md:20 says 'Do not edit manually', and docs/cli-reference.md:3038 says to follow next:. The refusal itself is intended and correct; the advice is what is wrong. Note for the fix: rewriting a newer version through init --upgrade is safe only when the declared version ≤ the package version of the running CLI; a graph really written by a newer CLI must not be downgraded. This is not 529 or 187 of 6.1.0, nor 020 here; not a regression (this class of message was in 6.0.0). Side note, not checked further: init --upgrade of an older CLI on a graph with a newer version writes rules, .gitattributes and git config before it is known that the graph is readable. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-60/repro/verify-60.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-60/repro/verify-60.sh); issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-7-version-advice.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-7-version-advice.sh.

## Why
6.1.0 is the first release in which the package number and the schema number differ, right after a major, so the mistake is likely (the CHANGELOG itself anticipates it), and an agent following next: goes round in a loop; init --upgrade reports success on a graph that still does not load. The trigger is a hand edit the documentation forbids, nothing breaks, and restoring "6.0.0" helps at once, so minor.

## Acceptance
When the declared schema version is higher than CLI_SUPPORTED_SCHEMA but not higher than cliVersion(), diagnoseGraphLoadError advises restoring `version: "6.0.0"` (without CLI upgrade advice), and `yg init --upgrade` in that range repairs the version or refuses with exit 1; a graph with a version higher than cliVersion() still gets the CLI upgrade advice; messages say 'graph schema 6.0.0', not 'this CLI (6.0.0)' (tests for "6.1.0" and "5.9.0").

## Changelog
- Fixed: a yg-config.yaml version: raised by hand to the CLI's release number ("6.1.0") is advised back to "6.0.0" instead of a CLI upgrade, and yg init --upgrade sets it back; a version above the running release keeps the upgrade advice and yg init --upgrade refuses it with exit 1; messages say graph schema 6.0.0.

## Evidence

- **ran:** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

