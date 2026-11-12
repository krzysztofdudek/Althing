# 2. Files

Everything Lawcheck reads or writes in a repository lives in one folder, `.lawcheck/`, at the repository root. Lawcheck never writes outside it: no agent files, no `.gitattributes` at the root, no git configuration, no hooks.

## 2.1. The folder

```
.lawcheck/
  law.yaml             committed   the user writes it: types and rules
  rules/               committed   the user writes it: one file per rule
    no-print.mjs                     a script rule
    clear-errors.md                  a reviewer rule
    lib/                             optional helpers that scripts import
  config.yaml          committed   optional: settings that differ from their defaults
  verdicts             committed   the tool writes it, from the first review on
  .gitattributes       committed   the tool writes it with the first verdict: one line
  .gitignore           committed   the tool writes it at init: two lines
  config.local.yaml    local       optional: this machine's reviewer and keys for this project
  .local/              local       caches; safe to delete at any time
```

Outside the repository, one optional file per machine: `~/.config/lawcheck/config.yaml` (on Windows `%APPDATA%\lawcheck\config.yaml`), for the reviewer and keys a person uses in every project.

| File | Who writes it | Committed | Exists after `init` |
|---|---|---|---|
| `law.yaml` | the user or their agent | yes | yes |
| `rules/<id>.mjs`, `rules/<id>.md` | the user or their agent | yes | no, with the first rule |
| `rules/lib/**` | the user or their agent | yes | no |
| `config.yaml` | the user or their agent | yes | no, with the first setting that differs from a default |
| `verdicts` | `lawcheck check --review` | yes | no, with the first recorded pass |
| `.gitattributes` | `lawcheck check --review` | yes | no, together with `verdicts` |
| `.gitignore` | `lawcheck init` | yes | yes |
| `config.local.yaml` | the user | no | no |
| `.local/` | any command | no | no |
| `~/.config/lawcheck/config.yaml` | the user | outside the repository | no |

Every YAML file refuses an unknown key by name and suggests the nearest known one. Keys are snake_case. One shape per key: a key that takes a list always takes a list.

## 2.2. `law.yaml`

The whole law in one file, so that an agent reads one file and knows every type and every rule with its reason.

```yaml
lawcheck: 1.0.0

required: ["src/**"]
ignored: ["**/generated/**"]

rules:
  <rule-id>:
    why: <one sentence>
    status: advisory
    group: "<directory glob>"
    context: ["<path>", ...]

types:
  <type-id>:
    about: <one line>
    paths: ["<glob>", ...]
    content: "<regular expression>"
    rules: [<rule-id>, ...]
    may_use: [<type-id>, ...]
    types:
      <subtype-id>: { ... }
```

### Top level

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `lawcheck` | string, a version | yes | written by `init` | The last Lawcheck version whose update document this law has had applied. See 2.7 |
| `required` | list of globs | no | `[]` | A file matching one of these must have a type; otherwise `error[untyped-file]` |
| `ignored` | list of globs | no | `[]` | A file matching one of these has no type and is never checked. It subtracts from everything, `required` included |
| `rules` | map | no | `{}` | Every rule, by id |
| `types` | map | no | `{}` | The root types, by id |

By default nothing is required and everything may have a type. A file with no type is not a finding unless it lies under `required`.

### A rule

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `why` | string, one sentence, at most 200 characters | yes | | Printed under every finding of the rule, shown in `prime` and `explain`, and given to the reviewer |
| `status` | `enforced` or `advisory` | no | `enforced` | `enforced`: a finding in the change is an error. `advisory`: a warning |
| `group` | a glob of directories, or `"."` | no, script rules only | one run per file | Each directory the glob matches is one run that receives every file of the rule's types under it. `"."` is one run for the whole repository |
| `context` | list of repository paths | no, reviewer rules only | `[]` | Files given to the reviewer with every review of this rule, such as an error catalogue the rule refers to |

The way a rule is checked follows from its file: `rules/<id>.mjs` is a script rule, `rules/<id>.md` a reviewer rule. No key repeats that.

A rule id is kebab-case and may contain `/` to group rules in subfolders (`boundary/no-binaries` is `rules/boundary/no-binaries.mjs`). An id may not equal a built-in code (the list is in [commands.md](commands.md)).

A rule that no type lists is legal and silent. It is how a rule is written and tried before it is switched on.

### A type

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `about` | string, one line | no | | What files of this type are for. Shown in `prime` and `explain` |
| `paths` | list of globs | yes | | Which files belong. Globs are relative to the repository root, in gitignore syntax; a leading `!` excludes |
| `content` | string, a regular expression | no | | The file belongs only if its text also matches |
| `rules` | list of rule ids | no | `[]` | The rules files of this type must keep |
| `may_use` | list of type ids | no | inherited, else unrestricted | The types whose files a file of this type may use |
| `types` | map | no | `{}` | Subtypes |

How a file gets its type:

1. A file is tested against the root types. `paths` and `content` must both hold.
2. Within the type that matched, it is tested against that type's subtypes, and so on down.
3. Its type is the deepest one that matched. It keeps the rules of every type on the way down.
4. If two types at the same level match one file, the law is ambiguous: `error[type-overlap]` names the file and both types, and the run stops with exit 2. The fix is a `!` line in one of them or making one a subtype of the other.

Type ids are unique across the whole tree, so a type is named by its id alone everywhere (`may_use: [services]`, `--type services`).

`may_use`:

- The list names every type a file of this type may use, itself included when files of the type use each other.
- Naming a type allows its subtypes too.
- A type without the key takes the list of the nearest parent that has one. With none on the way up, its uses are unrestricted.
- A use of a file that has no type, from a type with a list, is a finding (`forbidden-use`): to restrict what a type uses is to say where everything it uses belongs.
- Packages from outside the repository (the standard library, dependencies) are not governed by `may_use`. A rule about them is a script rule.

## 2.3. Rule files

`rules/<id>.mjs` and `rules/<id>.md`. Their contracts are in [rules-and-verdicts.md](rules-and-verdicts.md).

- A rule in `law.yaml` without a file: `error[rule-missing-file]`.
- A file under `rules/` that is no rule's file and not under `rules/lib/`: `error[rule-file-without-entry]`. A forgotten rule is never silently a helper.
- `rules/lib/` holds whatever scripts import. A change there counts as a change of every script rule that imports it.

## 2.4. `config.yaml`, `config.local.yaml` and the machine's file

One schema, three places. A fresh project has none of them: every key has a default.

```yaml
base: origin/main
runner: pnpm

reviewer:
  provider: anthropic
  model: <model id>
  endpoint: <url>
  timeout: 60
  temperature: 0
  max_chars: 50000
  parallel: 4
  max_calls: 100

scripts:
  timeout: 30

keys:
  anthropic: <key>
```

| Key | Type | Default | Meaning |
|---|---|---|---|
| `base` | a git ref | the remote's default branch, read from git | The branch a change is measured against |
| `runner` | `global`, `npx`, `pnpm`, `yarn`, `bun` | `global` | How the plugin and the agent start Lawcheck in this project. Committed file only. See [plugin.md](plugin.md) |
| `reviewer.provider` | one of the nine in [providers.md](providers.md) | none | Without it, a reviewer rule cannot be reviewed and `--review` says how to set one |
| `reviewer.model` | string | the provider's own default where it has one | The model id, as the provider spells it |
| `reviewer.endpoint` | URL | the provider's own | Where calls go. See the rule about endpoints in [providers.md](providers.md) |
| `reviewer.timeout` | seconds | 300 for the four command-line providers and `ollama`, 60 for the hosted ones | Per call |
| `reviewer.temperature` | number from 0 | 0 | Ignored by the command-line providers |
| `reviewer.max_chars` | integer | 50000 | The largest rule, context and file together that is sent; above it `error[too-large-to-review]` |
| `reviewer.parallel` | integer | 4 | Reviewer calls at once |
| `reviewer.max_calls` | integer | 100 | The most reviewer calls one run makes. Above it the run stops before the first call and says how many it would make |
| `scripts.timeout` | seconds | 30 | Per run of a script rule |
| `keys` | map | `{}` | Keys, by provider name or by endpoint URL. Refused in the committed file |

Which place wins, lowest first: the built-in defaults, the machine's file, the committed `config.yaml`, `config.local.yaml`. A project's committed choice beats a person's general preference; a person's choice for this one project beats both. A reference handed in from outside (`--base`, the `LAWCHECK_BASE` variable, a CI system's own variable) beats every file, because the committed file is the one thing a branch can edit.

Verdicts do not depend on any of these keys. Changing the provider, the model or a limit re-opens nothing.

## 2.5. `verdicts`

A text file, one line per recorded pass, sorted:

```
3f9a41c07be25d18a0c4e6f2917b5d3c clear-errors
81b0d2e94a7c63f5102b8e7d4c9a66f0 handlers-are-thin
```

The first field is 32 hexadecimal characters of a SHA-256 over the rule and the content it judged. The second is the rule id, for a person reading a diff. Nobody edits this file by hand. What goes into the hash and why the file merges without conflict is in [rules-and-verdicts.md](rules-and-verdicts.md).

`.lawcheck/.gitattributes` holds one line, `verdicts merge=union`, written together with the first verdict.

## 2.6. `.gitignore` and `.local/`

`init` writes `.lawcheck/.gitignore` with two lines:

```
.local/
config.local.yaml
```

`.local/` holds only what can be thrown away: parsed syntax trees, results of script rules keyed by their inputs, the reviewer's failed answers (so the same content is not paid for twice), and a debug log when `LAWCHECK_DEBUG=1`. No command needs it to be present, and no answer changes when it is deleted.

The local settings file is deliberately not inside `.local/`: a key is not something to lose when a cache is cleared.

## 2.7. The version line

`lawcheck: 1.0.0` in `law.yaml` is the last Lawcheck version whose update document this law has had applied. It is not a separate schema number, and it does not follow every patch release.

| The law says | The CLI is | What happens |
|---|---|---|
| 1.0.0 | 1.0.3, no update document between | Nothing. No message, no edit |
| 1.0.0 | 1.2.0, and 1.2.0 ships `update-1.0-to-1.2` | `error[law-needs-update]`, exit 2, with `next: lawcheck docs update-1.0-to-1.2`. The agent follows the document and sets the line to 1.2.0 |
| 1.2.0 | 1.0.3 | `error[law-newer-than-cli]`, exit 2, with the install command for the newer CLI |

Lawcheck has no migration code. An update document tells an agent what to rename, what no longer exists and when to ask the user.

## 2.8. A complete small project

A Python service with three layers.

```
.lawcheck/
  law.yaml
  config.yaml
  rules/
    no-print.mjs
    handlers-are-thin.md
    clear-errors.md
  verdicts
  .gitattributes
  .gitignore
docs/
  errors.md
src/
  api/        users.py  billing.py
  services/   users.py  billing.py
  storage/    users_table.py
  shared/     money.py
tests/
  test_billing.py
```

`.lawcheck/law.yaml`

```yaml
lawcheck: 1.0.0

required: ["src/**"]

rules:
  no-print:
    why: Library code never prints; output goes through the logger.
  handlers-are-thin:
    why: A handler parses the request and calls one service; logic lives in services.
  clear-errors:
    why: An error message says what happened, why, and what to do next.
    status: advisory
    context: ["docs/errors.md"]

types:
  source:
    about: Everything that ships.
    paths: ["src/**/*.py"]
    rules: [no-print]
    types:
      api:
        about: HTTP handlers.
        paths: ["src/api/**"]
        rules: [handlers-are-thin, clear-errors]
        may_use: [api, services, shared]
      services:
        about: Business logic.
        paths: ["src/services/**"]
        rules: [clear-errors]
        may_use: [services, storage, shared]
      storage:
        about: Everything that talks to the database.
        paths: ["src/storage/**"]
        may_use: [storage, shared]
      shared:
        about: Small value types with no dependencies.
        paths: ["src/shared/**"]
        may_use: [shared]
  tests:
    about: Tests. No rules yet.
    paths: ["tests/**/*.py"]
```

`.lawcheck/config.yaml`

```yaml
reviewer:
  provider: claude-code
```

`.lawcheck/rules/no-print.mjs`

```js
export function check({ files }) {
  const findings = [];
  for (const file of files) {
    file.lines.forEach((text, index) => {
      if (/^\s*print\(/.test(text)) {
        findings.push({ file: file.path, line: index + 1, message: 'print() in library code' });
      }
    });
  }
  return findings;
}
```

`.lawcheck/rules/handlers-are-thin.md`

```markdown
A handler function may read the request, validate its shape, call exactly one
service function and build the response.

Report every handler that loops over domain data, calls the database, or
decides a business condition. Give the line of the first statement that does it.
```

`.lawcheck/rules/clear-errors.md`

```markdown
Every message a caller or a user can see says three things: what happened, why,
and what to do next. The wording follows the catalogue in the context file.

Report each message that leaves one of the three out. A log line for developers
is not such a message.
```

`.lawcheck/verdicts`, after the first `lawcheck check --review`:

```
1c5e09ab74d3f6e82b0a9d417c63f5e0 clear-errors
5a77e3c0d91b24f68e03c1ad7b59e2f4 handlers-are-thin
9d02b6f1483ea7c5d60f219b8a4c73e1 handlers-are-thin
c48f17a2e6b0935d7c1e84fa02d6b9a3 clear-errors
e30a9c5d17f48b62a905d3ce61f7b084 clear-errors
f6b2d84e0a13c79f5d28e6410b9ac357 clear-errors
```

Six lines: `handlers-are-thin` judged the two files of `api`, `clear-errors` the two of `api` and the two of `services`.
