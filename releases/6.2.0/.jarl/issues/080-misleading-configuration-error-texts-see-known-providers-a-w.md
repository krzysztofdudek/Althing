# 080 · Misleading configuration error texts: 'see KNOWN_PROVIDERS', a wrong why for an unknown key under type_law, 'version: null … reads as a number', '.inf … (got null)', and the documentation counts eleven top-level keys instead of twelve

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-nlpb
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/config-parser.ts, Yggdrasil/source/cli/src/core/graph-loader.ts, Yggdrasil/source/cli/src/utils/file-schema.ts, Yggdrasil/docs/configuration.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/config-parser.ts:980 (a hard-coded `next: add 'provider: <one-of-known>' (see KNOWN_PROVIDERS)`, while the neighbouring check :987 inserts `KNOWN_PROVIDERS.join(', ')`); :733-740 refuseSchemaProblems (one why and one fix for every schema problem other than an unknown top-level key); :91-96 readSchemaVersionField and core/graph-loader.ts:631 schemaVersionFieldIssue ('which YAML reads as a number') and the text of MalformedSchemaVersionError (~:96); config-parser.ts:1027 `JSON.stringify(c[key])` (Infinity and NaN give 'null'), the same pattern in shown() in utils/file-schema.ts:123; docs/configuration.md:39-41
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
Reproduction (a fresh v6.1.0 clone and npm @chrisdudek/yg@6.1.0, a separate fresh `yg init` project for each case): (a) a tier without provider: 'fix: add 'provider: <one-of-known>' (see KNOWN_PROVIDERS)', repeated in next:; an unknown provider gets the real list (ollama, openai, ... copilot-cli); KNOWN_PROVIDERS appears in neither the docs nor the README, and the e2e test cli-config-tier-validation.test.ts:195 pins only the prefix. (b) the docs speak of eleven keys ('Those eleven are the whole of it'), and the parser's config-unknown-key message lists twelve, with type_law (documented on the same page at :647, :759 and :807). (c) `type_law: { ratifcation: true }`: what correctly says 'unknown key ... did you mean 'ratification'', but why is 'A value of the wrong type is not read at all', the fix only 'Correct 'type_law'', and next the generic 'edit .yggdrasil/yg-config.yaml' (for comparison, `signals: { atention: true }` gets a dedicated config-signals-unknown-key with a matching why and fix). (d) `version: null` → 'has version: null, which YAML reads as a number'; an empty `version:` gives the same, and `version: true` says 'version: true, which YAML reads as a number' (the graph is rightly refused, only the words are wrong). (e) `timeout: .inf` → '(got null)'; `.nan` also '(got null)'. Every case fails closed with the right code and exit 1. The texts are unchanged on origin/main. This is not 187, 226, 340 or 349 from 6.1.0, nor anything from the 6.1.1 loop. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-49/repro.log; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F8-config-message-defects.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/F8-config-message-defects/repro.sh.

## Why
The documentation promises messages that name the file and the key, and these five texts name a constant from the code, give a why that contradicts the what, describe null as a number and infinity as null, and the documentation leaves out one key; an agent and a person get a wrong repair hint. The behaviour is correct, so minor.

## Acceptance
(a) fix and next list the providers from KNOWN_PROVIDERS; (b) docs/configuration.md counts and lists twelve keys, with type_law; (c) an unknown key under type_law has a why about an unknown key and a fix with a suggestion; (d) a null, empty and boolean `version` are described as what they are (an empty value, a boolean), not as a number; (e) .inf and .nan are shown as they were written; each case has a message test.

## Changelog
- Fixed: configuration errors name what is in the file — the provider list for a tier without provider:, an unknown-key explanation under type_law:, an empty or boolean version: described as such, .inf and .nan shown as written; the configuration page lists all twelve top-level keys.

## Evidence

- **ran (history):** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

