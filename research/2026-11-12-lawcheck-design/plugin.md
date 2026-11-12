# 7. The plugin and `lawcheck prime`

## 7.1. What the plugin is

The Lawcheck repository is at once the tool's source, a plugin and a marketplace for four hosts (Claude Code, Codex, Cursor, Copilot), laid out as Ratatoskr's repository is. A person installs the plugin once per host. The plugin carries no version of Lawcheck's knowledge: everything it says comes from the `lawcheck` program of the project it is in, so an old plugin and a new CLI never disagree.

Lawcheck changes no file of the repository to reach the agent. There is no block in `AGENTS.md`, no `CLAUDE.md` line, no rules file for any host. For a host without the plugin, the README gives one sentence a person may paste into their own agent file: "Run `lawcheck prime` at the start of every session and follow it."

## 7.2. The hook at the start of a session

| The repository | What the hook does |
|---|---|
| has `.lawcheck/` and `lawcheck` runs | runs `lawcheck prime` and hands its output to the agent |
| has `.lawcheck/`, and `lawcheck` is not found | tells the agent in two lines how to install it: `npm i -g lawcheck`, or `npm install` where the project pins it |
| has no `.lawcheck/` | tells the agent in two lines that Lawcheck is available and that it may run `lawcheck init` if the user asks. It runs nothing and changes nothing |

The hook runs again after a compaction, where the host has that event, because a summary of a session rarely keeps the law.

## 7.3. The redirect

A project that pins Lawcheck as a development dependency says how it is started, in the committed `.lawcheck/config.yaml`:

```yaml
runner: pnpm
```

| `runner` | The command the hook and the agent use |
|---|---|
| `global` (the default) | `lawcheck` |
| `npx` | `npx --no-install lawcheck` |
| `pnpm` | `pnpm exec lawcheck` |
| `yarn` | `yarn run lawcheck` |
| `bun` | `bun x lawcheck` |

It is a name from a list, not a command. A hook that ran whatever string a repository holds would run a stranger's command the moment somebody opened a session in a fresh clone. With a list, the worst a repository can do is name the package manager that starts the `lawcheck` it pins, which is what installing its dependencies already trusts.

The hook reads the key without Lawcheck, so the key stands on one line of its own at the top level of the file. `lawcheck prime` prints the command in force in its first line, so the agent uses the same one all session.

## 7.4. Two more hooks

Both are part of the plugin, both can be switched off in the host's plugin settings, and neither ever calls a reviewer.

| Hook | When | What it does |
|---|---|---|
| after an edit | the agent wrote or edited a file in a repository with `.lawcheck/` | runs `lawcheck check <file> --json`. Silent when clean. Otherwise it hands the findings to the agent next to the result of the edit |
| at the end of a turn | the agent is about to stop, and files changed during the turn | runs `lawcheck check`. On exit 1 it hands the findings back once, so the agent goes on instead of reporting work as done over a failing check. It does this once per stop, never in a loop |

The first is the linter in the editor, where the editor is the agent. The second is the pre-commit hook of a session. Session start exists on all four hosts (Ratatoskr's plugin uses it on each). Which of the four have the two other events was not checked here; where a host lacks one, that hook is simply absent there.

A hook that hands the agent the rules of a type before its first edit of that type is deliberately not built. It needs memory across calls of what the agent has already been told, and `prime` already lists the types and rules; the agent is told to run `lawcheck explain <path>` instead.

## 7.5. What `prime` says

Two parts. The first is the same in every repository and teaches the loop. The second is this repository's law in short, generated from `law.yaml`. An agent that has read it knows what kinds of files exist here, what each must keep and why, before it opens a single file.

The whole output for the example project of [files.md](files.md):

```
Lawcheck checks this repository's code against its law: the file types, the rules each type keeps, and which types may use which. The law is .lawcheck/law.yaml; rules are in .lawcheck/rules/. Start it as: lawcheck

How to work here
- Before you create a file, or first edit a file of a type new to you in this session: lawcheck explain <path>
- After you change code: lawcheck check
- Exit 0: clean. Exit 1: the code breaks the law; fix the code. Exit 2: Lawcheck or the law itself is broken; fix what the error names and leave the code alone.
- Every finding has a why line, and every run ends with a next line. Do what next says.
- not-reviewed: a reviewer rule has not judged this version of a file. Fix every other finding first, then run: lawcheck check --review
- Debt (findings outside your change, listed by --full) is not yours. Leave it unless the user asks.

Only on the user's word
- a waiver comment (lawcheck-waive), or taking a rule off a type
- changing a rule's status or its why, widening may_use, adding to ignored
- lawcheck check --review --again, --max-calls above the limit, --no-scripts
- any edit of .lawcheck/verdicts, and the reviewer settings

You may, unasked
- add a type for a new kind of file, or make a type finer
- write a rule the user asked for, and try it first: lawcheck try <rule> <paths>

The law here: 6 types, 3 rules
source      src/**/*.py        Everything that ships.                        rules: no-print
  api       src/api/**         HTTP handlers.                                rules: handlers-are-thin, clear-errors   may use: api, services, shared
  services  src/services/**    Business logic.                               rules: clear-errors                      may use: services, storage, shared
  storage   src/storage/**     Everything that talks to the database.                                                 may use: storage, shared
  shared    src/shared/**      Small value types with no dependencies.                                                may use: shared
tests       tests/**/*.py      Tests. No rules yet.
required: src/**

Rules
no-print            script              Library code never prints; output goes through the logger.
handlers-are-thin   reviewer            A handler parses the request and calls one service; logic lives in services.
clear-errors        reviewer  advisory  An error message says what happened, why, and what to do next.

More: lawcheck docs
```

That is about 2,600 characters.

## 7.6. The size budget

Claude Code caps what a hook hands to the agent at 10,000 characters; above that the agent gets a file path and a preview of the first 2,000 characters, and nothing tells it to read the file (its hooks documentation, read on 2026-11-12). Ratatoskr's hook notes the same order of limit for Copilot. Yggdrasil's `yg prime` is 70,438 characters today.

So `lawcheck prime` has a hard budget, and a test holds it:

- **At most 8,000 characters, always.** The first part is at most 1,800.
- The law part takes what is left and shortens itself in fixed steps when a law is large:
  1. everything as above;
  2. each `about` and each `why` cut to 60 characters;
  3. the rule table without its `why` column, and subtypes without their patterns;
  4. only the root types, with counts of subtypes and rules, and the rule ids as one list.
- Whatever step was taken, the last line says so and names the command that shows the rest: `shortened to fit; lawcheck explain --type <id> shows a type in full`.

For scale: a law of the size of Yggdrasil's own graph (38 types, 73 rules) needs step 3 by a rough count: about 70 characters per type and 35 per rule come to some 5,200, while step 2 would need over 11,000. At that size the agent learns every type and the name of every rule at the start, and reads a rule's reason from `lawcheck explain` when it touches a file. That is an estimate, not a measurement; the test on real laws decides.

`prime` never prints the reference of the tool. That is `lawcheck docs`, read one topic at a time and only when needed.
