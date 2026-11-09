# 091 · docs/the-lock.md:109 falsely promises that a first-party key goes 'only to the provider's own endpoint or one named in yg-secrets.yaml', while a committed config.endpoint receives it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-rwpi
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/docs/the-lock.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** docs/the-lock.md:109, the parenthesis '(a first-party key goes only to the provider's own endpoint or one named in `yg-secrets.yaml`; ...)', added in b58283658 (issue 362, when the key was withheld); issue 492 (dc11544af, merged as 0dbda9afd, ruling ask-015 reviewer-key-warning-only) rewrote :97 ('the key is sent either way'), but not :109; the code works as the ruling says: source/cli/src/llm/api-utils.ts:27-31 (resolveApiKey), llm/anthropic.ts:17-33 (x-api-key to config.endpoint), core/checks/credentials.ts:71-79 (reviewer-endpoint-committed is only a warning)
**Branch:** jarl/063-local-writes
**Merged:** 786a2847333c0ea01ee390b47922ffa8efdd75ec
**CI:** none

## What
Reproduction (fresh clone at tag v6.1.0 e5441101 and npm @chrisdudek/yg@6.1.0, own fake Anthropic server <the session scratchpad, since lost>/bughunt/yggdrasil/verify-61/fake-anthropic.mjs): `yg init --provider anthropic --model claude-haiku-4-5 --endpoint http://127.0.0.1:PORT/v1` (init itself writes the endpoint into the committed yg-config.yaml), without yg-secrets.yaml; `ANTHROPIC_API_KEY=<fake key VERIFIER-DEV-KEY-1111> yg check --approve`: the committed endpoint receives POST /v1/messages over plain http with x-api-key=<fake key VERIFIER-DEV-KEY-1111> and a body containing the reviewed source; the run prints warning[reviewer-endpoint-committed] ('The key is sent; this warning only shows where'), PASS with 1 verified pair, exit 0. The runtime behaviour is intended (ruling ask-015, issue 492, whose acceptance requires the documentation and the trust table to say the same thing); docs/configuration.md:268 ('never refuses a configuration over it and never withholds a key') and the-lock.md:97 tell the truth, only :109 still holds the old absolute promise. This is the missing documentation half of the ruling 362/ask-015. The sentence is the same at tag v6.1.0 and on origin/main; the model logs (aspects/log.md:98-100 and :102) record the withholding and its reversal as history. This is not 362, 492 or 203 of 6.1.0. No paid calls and no claude-code reviewer. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-61/verify-61.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-61/repro-committed-endpoint.sh); issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/F-committed-endpoint-docs.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/repros/committed-endpoint-key.sh.

## Why
This is a false security promise in a document about the trust model: a reader who believes it will commit an endpoint convinced that their first-party key is protected, and it is not. The paragraph's main advice (never `yg check --approve` with a reviewer key on an untrusted branch) is good, and the runtime warning names the target, though only after sending, so minor.

## Acceptance
docs/the-lock.md:109 says the same as :97 and docs/configuration.md:268-272 (the key is sent to the committed endpoint, yg only warns reviewer-endpoint-committed); grep 'goes only to the provider' in docs/ finds nothing.

## Changelog
- Fixed: the trust model no longer promises that a first-party reviewer key stays with its provider; a committed endpoint receives the key and yg check only warns reviewer-endpoint-committed.

## Evidence

- **ran (history):** git commit (merge of jarl/063-local-writes into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8100 pairs verified; [repo-check] All checks passed; [release/6.1.1 786a28473] Merge jarl/063-local-writes

