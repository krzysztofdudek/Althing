# 8 and 9. The user experience and the agent experience

## 8. The user experience

### 8.1. The first ten minutes

The project is the Python service of [files.md](files.md), before it has a law. It is a clone of a repository with a remote, on a branch.

**Minute one: install and start.**

```
$ npm i -g lawcheck
$ lawcheck init
lawcheck: created .lawcheck/law.yaml

Nothing is checked yet: the law has no types.
next: describe your first file type in .lawcheck/law.yaml  (lawcheck docs first-law shows how)
```

One folder appeared, with two files. `git status` shows `.lawcheck/` and nothing else. No question was asked, no provider chosen, no key needed.

**Minutes two to four: the first type and the first rule.** The person, or the agent they say one sentence to ("library code must never print"), writes two things.

In `.lawcheck/law.yaml`:

```yaml
lawcheck: 1.0.0

rules:
  no-print:
    why: Library code never prints; output goes through the logger.

types:
  source:
    paths: ["src/**/*.py"]
    rules: [no-print]
```

And `.lawcheck/rules/no-print.mjs`, eleven lines, shown in [files.md](files.md).

**Minute five: what does the rule say about the code that is already there?**

```
$ lawcheck check
lawcheck: PASS  2 changed files (against origin/main)
note: the law changed in this change; lawcheck check --full shows what it finds in the rest of the code

$ lawcheck check --full
lawcheck: PASS  2 changed files (against origin/main)

debt (outside this change): 2 findings in 1 file
src/storage/users_table.py:88  warning[no-print]  print() in library code
  why:  Library code never prints; output goes through the logger.
src/storage/users_table.py:131 warning[no-print]  print() in library code
```

The new rule does not turn the build red for code nobody touched. It shows that code as debt, and the person decides when to pay it.

**Minute six: the first failure.** The person edits `src/services/billing.py` and leaves a debugging line in.

```
$ lawcheck check
lawcheck: FAIL  1 error in 3 changed files (against origin/main)

src/services/billing.py:41  error[no-print]  print() in library code
  why:  Library code never prints; output goes through the logger.

next: fix src/services/billing.py:41
```

**Minute seven: the fix.**

```
$ lawcheck check
lawcheck: PASS  3 changed files (against origin/main)
```

**Minutes eight to ten: the first boundary.** The person splits `source` into the four layers and writes who may use whom (the `types:` block of the full example). One file already breaks it:

```
$ lawcheck check --full
...
debt (outside this change): 3 findings in 2 files
src/services/users.py:4  warning[forbidden-use]  services may not use api (src/api/auth.py)
  why:  services may use: services, storage, shared
...
```

In ten minutes: one folder, one law file, one rule file, a failure with its place and its reason, a fix, and a first picture of the existing debt. No component was drawn, no relation declared, no reviewer set up.

The reviewer comes later and only if wanted: the first `.md` rule, two lines of `reviewer:` in `.lawcheck/config.yaml`, and `lawcheck check --review`. `lawcheck check` says exactly that when it meets a reviewer rule with no provider set.

### 8.2. Daily use

**In the editor.** Lawcheck ships no editor extension in its first release. `lawcheck check <file>` answers for one file, each finding starts with `file:line`, and `--json` gives a document, which is enough for any editor's task runner or problem matcher. For an agent the editor is the session, and the plugin's hook after each edit does this by itself ([plugin.md](plugin.md)).

**Before a commit.** `lawcheck check --staged` judges what is about to be committed, as the index holds it. Lawcheck installs no hook; `lawcheck docs ci` has the three lines for a plain git hook and for the common hook managers.

**In CI.** One command on a pull request, with history deep enough to find the merge base, and no key ([rules-and-verdicts.md](rules-and-verdicts.md), 4.5). A red build means one of two things, told apart by the exit code: the change breaks the law, or the run could not conclude.

**Speed.** A linter is used when it is fast enough not to think about. The targets Lawcheck is built to and tested against, on the Yggdrasil repository as the reference (3,494 tracked files): one file with `check <file>` or `explain` under 0.3 seconds; a change of a few files in about one second; every script rule on every file in parallel, bounded by the machine's cores. These are targets. What was measured is Yggdrasil 6.1.0 on that repository: 3.9 seconds to describe one file, 6.4 to 7.2 seconds for a check with nothing changed, of which over a third of the processor time went to the mapping of components and to path patterns compiled again and again, and 3% to syntax trees. A model with no components does not have the first cost, and the per-file design does not load the world to answer about one file.

### 8.3. Writing a rule

1. Say the rule as one sentence. It becomes `why:`.
2. Decide how it is checked. If a program can decide it, a script. If it takes judgment, prose for the reviewer.
3. Write the entry in `law.yaml` and the file in `rules/`. Attach it to no type yet.
4. Try it on a file that should fail and on one that should pass:

```
$ lawcheck try no-print src/storage/users_table.py src/shared/money.py
no-print (script) on 2 files

src/storage/users_table.py:88   print() in library code
src/storage/users_table.py:131  print() in library code
src/shared/money.py             nothing found
```

Nothing was written anywhere. For a reviewer rule, `lawcheck try clear-errors src/api/billing.py --times 3` asks three times and prints each answer in full, which shows whether the wording gives the same judgment each time before anyone depends on it.

5. Attach it to a type. `lawcheck check --full --rule <id>` shows the debt it creates.
6. Decide what to do with that debt: pay it now, or leave the rule `advisory` until it is paid.

### 8.4. Understanding a failure

A finding answers three questions where it stands: where (`file:line`), what (the message the rule wrote), why (the owner's sentence). When that is not enough:

- `lawcheck explain <file>` shows why this file is under this rule at all: its type, the chain above it, the rules that come with each.
- `lawcheck explain --rule <id>` shows the rule: its sentence, where its file is, which types it is on.
- For a reviewer rule the message is the reviewer's own, with the line it points at. `lawcheck try <rule> <file>` prints the full answer.
- A finding that is wrong about this one place is a waiver with its reason. A finding that is wrong in general is a rule to fix.

## 9. The agent experience

Lawcheck is written to be operated by an agent while a person owns the law. Each message is designed for a reader that acts on it at once and has a limited window to read it in.

### 9.1. What the agent knows when a session starts

The hook ran `lawcheck prime`. Before its first action the agent has, in at most 8,000 characters ([plugin.md](plugin.md)):

- the loop: explain before writing, check after;
- what each exit code means for what it does next;
- what it may do unasked and what needs the user's word;
- the law of this repository: every type with its pattern and purpose, every rule with its kind and its reason, and who may use whom.

It does not have the tool's reference, and does not need it for ordinary work.

### 9.2. What it asks before it writes a file

```
$ lawcheck explain src/services/refunds.py
src/services/refunds.py  (does not exist yet)
  type:     services  (source > services)   Business logic.
  may use:  services, storage, shared

  rules
    no-print       script    enforced   Library code never prints; output goes through the logger.
    clear-errors   reviewer  advisory   An error message says what happened, why, and what to do next.
```

The answer comes from the path alone, in a fraction of a second, so the agent writes the file right the first time: it knows it may not use the `api` type from here and must not print. Where a type also depends on content, the answer says which pattern would move the file into which subtype.

When the path has no type, the answer says so and what follows from it: nothing binds the file; or, under `required`, the file needs a type and here are the types next to it.

### 9.3. What it reads after a failure

The output of `lawcheck check`, or under the hook after an edit, the JSON document. Either way each finding is a place, a code, a message and a reason, and the run ends with one next step. The agent does not have to choose among several suggestions or work out an order: findings are sorted, and `next` is the first thing to do.

The exit code tells it which kind of work it has:

| Exit | The agent's job |
|---|---|
| 1 | Change the code at the places named. Never the law, never a waiver |
| 2 | Change what the error names: a key in `law.yaml`, a crashing rule script, the base setting. Not the code |

This split is the most important thing an agent learns from Lawcheck. An agent that answers a broken rule script by rewriting the code under it, or a real violation by loosening the law, has done harm either way, and one number tells it which case it is in.

### 9.4. How every message tells it what to do next

| The message | The `next:` it carries |
|---|---|
| a finding of a script rule | `fix <file>:<line>` |
| `forbidden-use` | `fix <file>:<line>`, and the `why` lists what the type may use |
| `not-reviewed` on a changed file, with other findings present | fix the other findings first |
| `not-reviewed` on a changed file, nothing else left | `lawcheck check --review  (N reviewer calls)` |
| `too-many-reviews` | the number of calls, and that raising the limit is the user's decision |
| `untyped-file` | the types of the files beside it, and `lawcheck docs law` |
| `type-overlap` | the two types and the `!` line that would separate them |
| `rule-crashed` | the rule's file and the error it threw, and `lawcheck try <rule> <file>` |
| `base-unreachable` | the fetch command, or the CI setting |
| `reviewer-not-configured` | the two lines to add, and `lawcheck docs providers` |
| `law-needs-update` | `lawcheck docs update-<from>-to-<to>` |
| a clean run | nothing; one line |

A `next:` is a command that can succeed in the state the message describes, or a plain instruction. The first audit of Yggdrasil found a first hint that could only fail; that is a defect class this table exists to prevent, and a test holds each row.

### 9.5. How it adds a type

1. It writes the type in `law.yaml`: an id, `paths`, one line of `about`.
2. `lawcheck explain --type <id>` shows the files it caught. If it caught too many or too few, the pattern is wrong.
3. `lawcheck check` reports a `type-overlap` at once if the new type collides with a neighbour.
4. It may do this unasked when a new kind of file appears, or when a rule the user asked for needs a finer type. It tells the user in one line what it added.

Making a type finer is the one way to narrow a rule. There is no condition on a rule, no condition where a rule is attached, no filter on a rule's files. An agent that wants a rule to reach fewer files writes a subtype.

### 9.6. How it adds a rule

It follows 8.3: the entry and the file, `lawcheck try` on a failing and a passing file, then the attachment, then `lawcheck check --full --rule <id>` for the debt. It then tells the user the number of findings in existing code and asks one question: pay the debt now, or keep the rule advisory until it is paid. The status of a rule is the user's.

### 9.7. Paying for reviews

The agent runs `lawcheck check --review` by itself when a changed file lacks a verdict and nothing else is left to fix. Scripts first, because they are free and a file that still changes would be paid for twice. The run is bounded by `reviewer.max_calls`; the agent does not raise it.

When the reviewer fails a file, the finding reads like any other and the agent fixes the code. It does not ask again in the hope of a different answer.

### 9.8. What it must never do without the user

| Never, without the user's word | Why |
|---|---|
| Write a waiver comment | A waiver switches a rule off for some code. Every rule honours it without question |
| Take a rule off a type, delete a rule, or change its `why` | That changes the law to fit the code |
| Change a rule's status | Whether a rule blocks is the owner's decision |
| Widen `may_use`, or add to `ignored` | Both make findings disappear without fixing anything |
| Run `--review --again` on unchanged code | It asks a model again until it agrees |
| Raise `--max-calls` | It spends the user's money beyond the limit they set |
| Run with `--no-scripts` to get a clean result | A skipped rule is not a kept rule |
| Edit `.lawcheck/verdicts` | A line there claims a review happened |
| Change the reviewer settings | Who judges is the owner's choice |
| Fix debt it was not asked to fix | It turns a small change into a large one nobody reviewed |

And three things it never does at all: answer exit 2 by changing the code, answer exit 1 by changing the law, report work as finished while `lawcheck check` exits with 1.

The same lists are in `lawcheck prime`, in the same words, so the agent has read them before its first action in every session.

### 9.9. What an agent gets here that a linter does not give

| A linter | Lawcheck, for an agent |
|---|---|
| speaks after the code is written | answers before: `explain` on a path that does not exist yet |
| lists findings | ends every run with the one next step |
| has one failure code | tells "the code is wrong" from "the tool or the law is wrong" |
| knows rules a program can check | also holds rules that take judgment, with a record that the judgment was given |
| reports the whole project | holds the agent accountable for its change, and calls the rest debt |
| is configured by a person | is written by the agent from one sentence, tried on chosen files, with nothing written until it is attached |
| prints as much as it finds | fits what an agent must always see into a fixed budget |
| lets a comment silence it | reports every new waiver in every run |
