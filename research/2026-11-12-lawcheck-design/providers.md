# 5. Providers

Lawcheck supports, from its first release, every provider Yggdrasil supports today. The list is Yggdrasil's (`source/cli/src/utils/known-providers.ts` at `360864946`): five that are called over HTTP and four that are programs on the machine.

## 5.1. The nine

| Provider | Reached through | `model` | `endpoint` | Signs in with |
|---|---|---|---|---|
| `anthropic` | HTTP | required | optional; the provider's own by default | a key: `ANTHROPIC_API_KEY`, or `keys.anthropic` |
| `openai` | HTTP | required | optional; the provider's own by default | a key: `OPENAI_API_KEY`, or `keys.openai` |
| `google` | HTTP | required | optional; the provider's own by default | a key: `GOOGLE_API_KEY`, or `keys.google` |
| `openai-compatible` | HTTP, any server that speaks the same protocol | required | required | a key stored for that endpoint, if the server wants one |
| `ollama` | HTTP, a local server | required | optional; `http://localhost:11434` by default | nothing |
| `claude-code` | the `claude` program | optional | none | the program's own sign-in |
| `codex` | the `codex` program | optional | none | the program's own sign-in |
| `gemini-cli` | the `gemini` program | optional | none | the program's own sign-in |
| `copilot-cli` | the `copilot` program | optional | none | the program's own sign-in |

For the four programs, a missing `model` means Lawcheck passes none and the program uses its own default. Yggdrasil hard-wires a default model for three of them; Lawcheck does not carry those names, because they go stale and a verdict does not depend on the model anyway. Whether `copilot-cli` accepts a call without a model was not checked here; Yggdrasil requires one for it, and if the program does too, `model` is required for that one provider.

The settings every provider reads are the ones in [files.md](files.md): `model`, `endpoint`, `timeout`, `temperature`, `max_chars`, `parallel`, `max_calls`. The programs ignore `temperature` and `endpoint`. A key the schema does not know is refused by name, for every provider alike.

## 5.2. Per project and per machine

The same `reviewer:` block can stand in three files. Lowest first:

| File | Scope | Typical use |
|---|---|---|
| `~/.config/lawcheck/config.yaml` | this machine, every project | "I review through the `claude` program everywhere" |
| `.lawcheck/config.yaml`, committed | this project, everyone | "This project is reviewed by this provider and model" |
| `.lawcheck/config.local.yaml`, ignored by git | this project, this machine | "Here I use another model", or the endpoint of a local server |

Keys are merged one by one, so the local file may change only `model` and leave the rest.

Because a verdict does not record who gave it, two people on one project may review through different providers and their verdicts merge like any others. A team that wants one reviewer for everyone commits it and leaves the local files alone.

A project that sets no provider anywhere can still be checked: verdicts are verified by hashing. Only `--review` needs a provider, and it says so with the two lines to add.

## 5.3. Where keys live

A key is never in the committed file. The committed schema has no place for one, so a key there is `error[config-invalid]` with the name of the file it belongs in. That is a schema rule, not a scan: Lawcheck does not look for key-shaped text anywhere and masks nothing in its output.

Lawcheck looks for a key in this order:

1. the provider's own environment variable (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`);
2. `LAWCHECK_REVIEWER_KEY`, for any HTTP provider, meant for CI;
3. `keys:` in `.lawcheck/config.local.yaml`;
4. `keys:` in the machine's file.

```yaml
# ~/.config/lawcheck/config.yaml
reviewer:
  provider: anthropic
  model: <model id>
keys:
  anthropic: <key>
  "https://llm.example.org/v1": <key>
```

### A key goes only where it was given

A key under a provider's name (`keys.anthropic`, or that provider's environment variable) is sent only to that provider's own endpoint. A key under a URL is sent only to that URL.

So when the committed file points a provider at another endpoint, the person's key does not follow it there: the call fails with `error[reviewer-unreachable]` and one line that says which endpoint asked for a key and where to store one for it if that is wanted. Yggdrasil handles the same risk with a warning on every check (the committed file decides where a developer's own key travels). Here the risk is closed by how keys are stored, and there is nothing to warn about.

`LAWCHECK_REVIEWER_KEY` is the one exception: it goes to whatever endpoint is configured. It exists for CI, where the person who sets it also controls the configuration.

## 5.4. Checking a setup

`lawcheck doctor` says, without a call: which provider is in force and from which file, whether its program is on the PATH or its key is present, and where a missing key would go. `lawcheck doctor --reviewer` makes one small call and reports the answer or the provider's error text as it came.

`lawcheck try <rule> <file> --dry-run` shows the size of the prompt a review would send, before anything is paid.

## 5.5. What is not carried over

| Yggdrasil | Lawcheck | Why |
|---|---|---|
| Named tiers; a rule picks a tier | One reviewer per project | One rule kind, one reviewer. Yggdrasil's own configuration defines a single tier. A second reviewer for some rules is question 6 in [open-questions.md](open-questions.md) |
| `consensus`: an odd number of votes | One answer | The same configuration uses 1. A failure is kept locally and `--again` asks anew when a rule's wording needs it |
| Hard-wired default models | The program's own default | They go stale |
| A provider question during `init` | Nothing asked | A linter starts free and without questions; the reviewer is set when the first reviewer rule is written |
| Redaction of provider error text and key-shaped values | None | The owner's rulings `yggdrasil-no-key-masking` and `yggdrasil-no-provider-redaction` |
| A warning about a committed endpoint receiving a developer's key | Keys bound to where they were given | See 5.3 |
