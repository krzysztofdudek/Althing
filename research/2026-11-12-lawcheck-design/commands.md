# 3. Commands, exit codes, output, JSON, errors

The program is `lawcheck`. It runs from any directory inside a repository and finds `.lawcheck/` by walking up. Paths a person types are relative to the current directory. Paths the tool prints are always relative to the repository root, with forward slashes.

## 3.1. The seven commands

| Command | Question it answers | Writes |
|---|---|---|
| `lawcheck init` | Start a law here | `.lawcheck/law.yaml`, `.lawcheck/.gitignore` |
| `lawcheck prime` | What must an agent know at the start of a session? | nothing |
| `lawcheck check [paths...]` | Does the change keep the law? | caches; with `--review`, `verdicts` |
| `lawcheck explain <path>` | What is this file and what binds it? | nothing |
| `lawcheck try <rule> <paths...>` | What does this one rule say about these files? | nothing at all |
| `lawcheck docs [topic]` | How is a file written, a rule written, a version updated? | nothing |
| `lawcheck doctor` | Is everything in place to run here? | nothing |

Flags every command takes: `--json` (one document on standard output instead of text), `--help`, `--no-color`. `lawcheck --version` prints the version.

A target that is a file or a directory is a plain argument, as in every linter. A target that is a notion of the law is a flag: `--rule <id>`, `--type <id>`.

### `lawcheck init`

Creates `.lawcheck/` with a `law.yaml` that holds the version line and a commented example, and the two-line `.gitignore`. Asks nothing and takes no flags. In a repository that already has `.lawcheck/`: `error[already-initialized]`, exit 2.

```
$ lawcheck init
lawcheck: created .lawcheck/law.yaml

Nothing is checked yet: the law has no types.
next: describe your first file type in .lawcheck/law.yaml  (lawcheck docs first-law shows how)
```

### `lawcheck prime`

Prints the session primer: how to work with Lawcheck in a dozen lines, then this repository's law in short. Never more than 8,000 characters. In a repository without `.lawcheck/` it prints two lines and exits 0. Content and budget: [plugin.md](plugin.md).

### `lawcheck check [paths...]`

| Form | What is looked at | What blocks |
|---|---|---|
| `lawcheck check` | the change: files that differ from the base, committed or not | every `enforced` finding |
| `lawcheck check <paths...>` | exactly these files or directories, changed or not | every `enforced` finding |
| `lawcheck check --staged` | the staged content, as the index holds it | every `enforced` finding |
| `lawcheck check --full` | every file | findings in the change; the rest is reported as debt, as warnings |
| `lawcheck check --strict` | every file | every `enforced` finding |

| Flag | Meaning |
|---|---|
| `--base <ref>` | Measure the change against this ref. Outranks every file and variable |
| `--full` | Look at everything; only the change blocks |
| `--strict` | Look at everything; everything blocks. For a repository that keeps no debt |
| `--staged` | Check what is staged, for a pre-commit hook |
| `--rule <id>` | Only this rule. Repeatable |
| `--type <id>` | Only files of this type and its subtypes. Repeatable |
| `--review` | Call the reviewer wherever a reviewer rule has no verdict for the content in front of it, and record each pass |
| `--dry-run` | With `--review`: say how many calls would be made, and make none |
| `--again` | With `--review`: ask again where an earlier answer was a failure. Without it a failure is shown from the local cache and not paid for twice |
| `--max-calls <n>` | With `--review`: raise or lower `reviewer.max_calls` for this run |
| `--no-scripts` | Run no code from the repository: script rules are skipped and counted as skipped. For CI on pull requests from forks |

Without `--review`, `lawcheck check` never calls a model and needs no key. It runs every script rule that applies, reads uses, and compares the verdict file with the content in front of it.

### `lawcheck explain <path>`

For a file: its type and the chain above it, every rule that binds it (id, kind, status, why), what it may use, the waivers in it, and for each reviewer rule whether this version has a verdict.

For a path that does not exist yet, it answers from the path alone and says where a type also depends on content ("becomes `command` if its text matches ..."). This is the question an agent asks before it creates a file.

For a directory: the types found under it, with file counts.

| Flag | Meaning |
|---|---|
| `--rule <id>` | Explain a rule instead: its why, kind, status, the types it is attached to, and where its file is |
| `--type <id>` | Explain a type instead: its `about`, patterns, chain, rules, `may_use` and how many files it holds |

```
$ lawcheck explain src/api/billing.py
src/api/billing.py
  type:     api  (source > api)   HTTP handlers.
  may use:  api, services, shared

  rules
    no-print            script    enforced   Library code never prints; output goes through the logger.
    handlers-are-thin   reviewer  enforced   A handler parses the request and calls one service; logic lives in services.   reviewed
    clear-errors        reviewer  advisory   An error message says what happened, why, and what to do next.                 not reviewed

  waivers: none
```

### `lawcheck try <rule> <paths...>`

Runs one rule on chosen files and prints what it finds. It writes nothing: no verdict, no cache. The rule does not have to be attached to any type yet, which is how a new rule is tried before it is switched on.

| Flag | Meaning |
|---|---|
| `--type <id>` | Instead of paths: every file of this type |
| `--times <n>` | Reviewer rules: ask n times and show each answer, to see whether the rule's wording gives a stable judgment |
| `--dry-run` | Reviewer rules: show the number of calls and the size of each prompt, and make no call |

Exit 0 when the rule found nothing, 1 when it found something, 2 when it could not run.

### `lawcheck docs [topic]`

Without a topic it lists them. Topics: `first-law`, `law`, `config`, `script-rules`, `reviewer-rules`, `waivers`, `ci`, `providers`, `languages`, `json`, `codes`, `from-yggdrasil`, and one `update-<from>-to-<to>` per release that needs it. Each topic is one page, generated from the same source as the published documentation, so the two cannot disagree.

### `lawcheck doctor`

Checks, in this order, and stops at nothing: the Node version; that `.lawcheck/law.yaml` parses and is valid; that the base resolves; how many files have a type and how many under `required` do not; which languages the repository holds and for which of them uses are read; whether a reviewer is configured, the program or key it needs is present, and (only with `--reviewer`) whether one small call succeeds; the `runner` setting. Exit 0 when all hold, 2 otherwise.

## 3.2. Exit codes

| Code | Meaning | What an agent does |
|---|---|---|
| 0 | Nothing blocks | carry on |
| 1 | The code breaks the law: at least one blocking finding | fix the code |
| 2 | Lawcheck could not conclude: a wrong flag, an invalid law, a rule that crashed, a base that cannot be reached, a reviewer that cannot be reached | fix what the error names; leave the code alone |

When both hold, 2 wins: a run that could not conclude says so first. The same three codes hold for every command.

## 3.3. The human output of `check`

```
lawcheck: FAIL  2 errors, 1 warning in 3 changed files (against origin/main)

src/services/billing.py:3   error[forbidden-use]  services may not use api (src/api/auth.py)
  why:  services may use: services, storage, shared
src/services/billing.py:41  error[no-print]  print() in library code
  why:  Library code never prints; output goes through the logger.
src/services/billing.py     warning[not-reviewed]  clear-errors has not judged this version
  why:  An error message says what happened, why, and what to do next.

next: fix src/services/billing.py:3
```

The rules of the format:

- The first line is the verdict: `PASS`, `FAIL` or `ERROR`, the counts, and what was looked at.
- One finding is one line that starts with the place (`file:line`), then `error[code]` or `warning[code]`, then what. Every editor and every agent can find the place without parsing prose.
- The code in the brackets is the rule's id for a rule's finding, and a built-in code otherwise. It is the same string as `code` in the JSON document and as the name a waiver takes.
- `why:` follows the first finding of each rule in a run, not every finding.
- Findings are sorted by file, then by line.
- The last line is one `next:`, the single most useful step: a place to fix, or a command to run.
- At most 50 findings are printed; then one line says how many more there are and how to narrow the run. The JSON document always holds all of them.

A clean run is one line:

```
lawcheck: PASS  3 changed files (against origin/main)
```

When the change touches the law itself, one more line follows, because a new rule shows nothing in code nobody touched:

```
note: the law changed in this change; lawcheck check --full shows what it finds in the rest of the code
```

With `--full`, debt is listed after the change, as warnings whatever the rule's status, under its own heading, and never changes the exit code:

```
debt (outside this change): 4 findings in 2 files
src/storage/users_table.py:88  warning[no-print]  print() in library code
...
```

## 3.4. The codes

A rule's findings carry the rule's id. The built-in codes:

| Code | Kind | When |
|---|---|---|
| `forbidden-use` | finding | a file uses a file of a type its own type may not use, or a file with no type |
| `unresolved-use` | finding, always a warning | a use the reader could not follow to a file or recognise as an outside package; counted, never silently allowed |
| `uses-not-read` | finding, always a warning, once per run | a type with `may_use` holds files in a language whose uses Lawcheck cannot read; says how many and which languages |
| `not-reviewed` | finding | a reviewer rule has no verdict for this version of the file. An error for an `enforced` rule when the file is in the change, a warning otherwise |
| `too-large-to-review` | finding | rule, context and file together exceed `reviewer.max_chars` |
| `untyped-file` | finding | a file under `required` has no type |
| `waiver-unknown-rule` | finding, an error | a waiver names a rule that does not exist |
| `waiver-without-reason` | finding, an error | a waiver gives no reason; it waives nothing |
| `waiver-unclosed` | finding, an error | a `lawcheck-waive-start` with no matching end |
| `waiver-unused` | finding, a warning | a waiver for a script rule or for `forbidden-use` that waives nothing |
| `usage` | error, exit 2 | an unknown flag or command, or flags that do not go together |
| `not-initialized` | error, exit 2 | no `.lawcheck/` here |
| `already-initialized` | error, exit 2 | `init` where `.lawcheck/` exists |
| `law-invalid` | error, exit 2 | `law.yaml` does not parse, or holds an unknown key, a wrong value, an unknown rule or type id |
| `config-invalid` | error, exit 2 | the same for a settings file, a key in the committed file included |
| `law-needs-update` | error, exit 2 | an update document lies between the law's version and the CLI's |
| `law-newer-than-cli` | error, exit 2 | the law is written for a newer Lawcheck |
| `type-overlap` | error, exit 2 | two types at one level match the same file |
| `rule-missing-file` | error, exit 2 | a rule in the law has no file |
| `rule-file-without-entry` | error, exit 2 | a file in `rules/` belongs to no rule |
| `rule-crashed` | error, exit 2 | a script threw, returned something that is not a list of findings, or ran past its timeout |
| `base-unreachable` | error, exit 2 | a base is named but cannot be resolved or has no common history with HEAD here |
| `file-unreadable` | error, exit 2 | a file could not be read, or is too large for a `content` pattern to be applied |
| `parser-failed` | error, exit 2 | a language's parser could not be loaded; uses for that language were not read |
| `reviewer-not-configured` | error, exit 2 | `--review` with no provider set |
| `reviewer-unreachable` | error, exit 2 | the provider's program is missing, the key is missing, or the call failed |
| `reviewer-bad-answer` | error, exit 2 | the reviewer answered something that is not a verdict, after one retry |
| `too-many-reviews` | error, exit 2 | the run would make more calls than `reviewer.max_calls` |

The list is closed and printed by `lawcheck docs codes`. No code is a catch-all.

## 3.5. The error grammar

An error has the same three parts as a finding, so there is one grammar to learn:

```
lawcheck: ERROR  the law cannot be read

.lawcheck/law.yaml:14  error[law-invalid]  unknown key 'path' in type 'api' (did you mean 'paths'?)
  why:  a misspelled key would leave the type matching nothing, without a word

next: rename the key, then run lawcheck check
```

Every error names a place where it has one, says what is wrong in one line, says why it matters in one line, and the run ends with one `next:` that is either a command that can succeed or a plain instruction. A `next:` never names a command that will fail in the state the error describes.

## 3.6. The JSON documents

Every document carries `schema`. Keys are snake_case. A path is relative to the repository root. `next` is always `{ "command": ..., "text": ... }` or `null`, where `command` is `null` when the step is not a command. Under `--json` nothing else is written to standard output; progress goes to standard error.

`lawcheck-check/1`:

```json
{
  "schema": "lawcheck-check/1",
  "result": "fail",
  "scope": { "mode": "change", "base": "origin/main", "files": 3 },
  "summary": { "errors": 2, "warnings": 1, "debt": 0, "skipped_rules": 0, "new_waivers": 0 },
  "findings": [
    {
      "code": "forbidden-use",
      "rule": null,
      "severity": "error",
      "blocking": true,
      "debt": false,
      "file": "src/services/billing.py",
      "line": 3,
      "message": "services may not use api (src/api/auth.py)",
      "why": "services may use: services, storage, shared",
      "type": "services"
    },
    {
      "code": "no-print",
      "rule": "no-print",
      "severity": "error",
      "blocking": true,
      "debt": false,
      "file": "src/services/billing.py",
      "line": 41,
      "message": "print() in library code",
      "why": "Library code never prints; output goes through the logger.",
      "type": "services"
    }
  ],
  "waivers": [],
  "reviews": { "missing": 1, "calls_made": 0, "passes_recorded": 0 },
  "next": { "command": null, "text": "fix src/services/billing.py:3" }
}
```

| Field | Values |
|---|---|
| `result` | `pass`, `fail`, `error` |
| `scope.mode` | `change`, `paths`, `staged`, `full`, `strict` |
| `findings[].severity` | `error`, `warning` |
| `findings[].blocking` | whether this finding contributes to exit 1 |
| `findings[].debt` | true for a finding outside the change in a `--full` run |
| `findings[].line` | a number, or absent for a finding about the whole file |
| `waivers[]` | `{ file, line, rule, reason, new }` for every waiver in the files looked at; `new` is true when the change added it |

The other documents:

| Schema | From | Holds |
|---|---|---|
| `lawcheck-error/1` | any command that ends with exit 2 under `--json` | `errors[]` of `{ code, file, line, message, why }`, and `next` |
| `lawcheck-explain/1` | `explain` | `subject` (`file`, `rule` or `type`), `type_chain[]`, `rules[]` of `{ id, kind, status, why, reviewed }`, `may_use[]`, `waivers[]` |
| `lawcheck-try/1` | `try` | `rule`, `runs[]` of `{ file, findings[], answer }`, where `answer` is the reviewer's own text for a reviewer rule |
| `lawcheck-doctor/1` | `doctor` | `checks[]` of `{ id, ok, message, next }` |
| `lawcheck-docs/1` | `docs` without a topic | `topics[]` of `{ id, title }` |

A field is added to a document without changing its number. A field that is removed or changes meaning makes it `/2`, and the release that does so ships an update document.
