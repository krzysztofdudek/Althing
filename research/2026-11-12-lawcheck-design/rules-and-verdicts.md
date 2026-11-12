# 4. Rules, verdicts, the default mode and CI

## 4.1. A script rule

A script rule is one JavaScript module, `.lawcheck/rules/<id>.mjs`, that exports one function. Users write it in JavaScript (an ES module), and it runs on the Node that runs Lawcheck. In practice the agent writes it from the user's one sentence.

```js
import { walk } from 'lawcheck/rule';

export async function check({ files, repo }) {
  const findings = [];
  for (const file of files) {
    const tree = await file.tree();
    if (!tree) continue;
    walk(tree, (node) => {
      if (node.type === 'call' && node.text.startsWith('print(')) {
        findings.push({ file: file.path, line: node.line, message: 'print() in library code' });
      }
    });
  }
  return findings;
}
```

### What the function receives

One object.

| Field | What it is |
|---|---|
| `files` | The files of this run. One file, unless the rule has `group`; then every file of the rule's types under the matched directory |
| `group` | The matched directory for a grouped rule (`releases/6.2.0`), otherwise `null` |
| `repo` | Read access to the rest of the repository, see below |

A file:

| Field | What it is |
|---|---|
| `path` | Relative to the repository root, forward slashes |
| `type` | The id of the file's type |
| `text` | The whole text |
| `lines` | The text as a list of lines |
| `language` | The language id (`python`, `typescript`, ...), or `null` when Lawcheck has no parser for it |
| `tree()` | The syntax tree, parsed on first call; `null` when there is no parser. Each node has `type`, `text`, `line`, `column`, `children`, `parent` and `field(name)` |
| `uses()` | What this file uses, as Lawcheck read it: a list of `{ target, line }` where `target` is a repository path or the name of an outside package. `null` for a language whose uses are not read |

`repo`:

| Call | What it returns |
|---|---|
| `repo.read(path)` | The text of another file, or `null` when it does not exist |
| `repo.exists(path)` | `'file'`, `'directory'` or `false` |
| `repo.list(glob)` | The paths that match |
| `repo.filesOf(typeId)` | The paths of every file of a type |

Every call on `repo` is recorded with what it returned. That record is what lets a cached result be reused only while everything the script looked at is unchanged. A script that reads the disk by any other route (its own `fs` import) still works, but its result is never cached, and `lawcheck doctor` names it.

Helpers come from the package and are imported, never handed in: `import { walk, find, lineOf } from 'lawcheck/rule'`. Whatever a script shares with other scripts lives in `.lawcheck/rules/lib/`.

### What the function returns

A list of findings, possibly empty, or a promise of one.

| Field | Required | What it is |
|---|---|---|
| `message` | yes | What is wrong here, in a few words. The rule's `why` is added by Lawcheck |
| `file` | no | Defaults to the run's file when there is one |
| `line` | no | Without it the finding is about the whole file |
| `column` | no | |

Anything else is `error[rule-crashed]`: a throw, a value that is not a list, a finding without a message, a run past `scripts.timeout`. A rule that cannot be run never passes; the run ends with exit 2 and names the rule and the file.

### How it runs

- Every `lawcheck check` runs the script rules that apply to the files it looks at. There is no separate step that records their results, and no state that can be out of date.
- Runs are spread over the machine's cores.
- The cache in `.lawcheck/.local/` is only speed. Deleting it changes no answer.
- `--no-scripts` runs none of them and counts them as skipped. A skipped rule is reported, never read as a pass.

Built today in Yggdrasil: the same idea with a different contract (the function receives a component and a graph, and must be synchronous). The 60 scripts of Yggdrasil's own graph all loop over files, 52 of them walk a syntax tree, and their median length is 78 lines; the contract above is drawn from what they do. Proposed: everything about this contract.

## 4.2. A reviewer rule

A reviewer rule is one Markdown file, `.lawcheck/rules/<id>.md`: the instruction to the reviewer, in plain prose. No front matter, no fields. Its `why`, its status and its optional context files are in `law.yaml`.

A good rule file says what must hold, what to report, and what is not a violation. See the two examples in [files.md](files.md).

### What the reviewer is given

For one rule and one file, in this order: a fixed frame that says what a verdict is and how to answer; the rule's `why`; the rule's text; each context file with its path; the file's path and its text with numbered lines; the line ranges a waiver covers for this rule.

Nothing else. No commit message, no history, no description written by whoever made the change, no other file of the repository. The reviewer judges the code in front of it, as a linter does, and everything it is given is part of what the verdict is recorded for.

### What it answers

A pass, or a failure with findings (`line` and `message` each). An answer that is neither is asked for once more, then `error[reviewer-bad-answer]`.

- A pass is recorded in `.lawcheck/verdicts`.
- A failure is shown as the rule's findings (errors for an `enforced` rule, warnings for an `advisory` one) and kept in `.lawcheck/.local/`, so the same content is not paid for a second time. `lawcheck check` shows it again from there for free. `--review --again` asks anew.

### Its limits

- One file per review. A reviewer rule has no `group`.
- A file whose prompt would exceed `reviewer.max_chars`: `too-large-to-review`. The fix is a smaller file, or a waiver for the file with its reason.
- One run makes at most `reviewer.max_calls` calls. Above that it stops before the first one and says the number.

Built today in Yggdrasil: the prompt of rule, reference files, file with numbered lines and waived ranges, and the limit on its size. Not carried over: the component path in the prompt, companion files, majority votes, named tiers.

## 4.3. Verdicts

### A verdict is a fact about content

One line of `.lawcheck/verdicts` says: this exact content passed this exact rule.

```
3f9a41c07be25d18a0c4e6f2917b5d3c clear-errors
```

The hash covers, in a fixed order: the verdict format's own number; the rule's id; its `why`; the text of its `.md` file; the path and text of each context file; the path of the judged file; its text. Line endings are read as LF before hashing, so a checkout on Windows computes the same value.

It does not cover: the rule's status, the provider, the model, any limit or timeout. Moving a rule from advisory to enforced, or changing the reviewer, re-opens nothing.

### What follows from that

| Situation | What happens | Why |
|---|---|---|
| A file changes | Its content has a new hash and no line. `not-reviewed` for every reviewer rule on it | The fact was about the old content |
| A rule's text or `why` changes | Every file under that rule has a new hash | The fact was about the old rule |
| Two branches each review their own changes and merge | The file holds both sets of lines | A fact is true on every branch; the union of two sets of facts is the right merge, which is what `merge=union` does |
| Two branches review the same content | One line | The same fact is the same line |
| One file changed on both sides of a merge | The merged content was judged by nobody: no line | Visible as `not-reviewed`, a warning outside a change; the next change to the file, or `lawcheck check --full --review`, closes it |
| A file is deleted or renamed | Lines that match nothing stay | Harmless; a `--full --review` run removes lines that match no content |
| CI has no key | It hashes what is in front of it and looks the lines up | Verifying a fact costs nothing |

Lines are sorted by hash, so the lines two branches add fall all over the file instead of next to each other. That keeps the file mergeable even where a host ignores the `merge=union` line. Whether GitHub's merge button honours it was not tested here; the design does not depend on the answer.

### When a missing verdict blocks

- In the change, for an `enforced` rule: an error. A pull request cannot be merged with a changed file that an enforced reviewer rule has not passed.
- Everywhere else: a warning. Content that a merge produced, or that an older law never asked about, does not stop anyone's work.

### Where the honesty ends

The file proves that somebody recorded a pass for this content. It does not prove that a model gave it: anyone who can compute the hash can write the line, an agent included. Yggdrasil's lock has the same property. Lawcheck says so in its documentation instead of implying more. A team that needs more runs `lawcheck check --review --again` on the change in CI with its own key, which pays for a second, independent answer.

A second limit: a model can pass on a second asking what it failed on the first. `--again` exists because a rule's wording sometimes needs it, and it is one of the things an agent does only on the user's word (see [experience.md](experience.md)).

## 4.4. The default mode

`lawcheck check` holds a run accountable for its change and for nothing else.

**The change** is every file whose content differs from the merge base of HEAD and the base branch: committed on this branch, staged, modified or new and not ignored by git.

**One rule decides what blocks: an `enforced` finding in a changed file.** Nothing widens it:

- A change to `law.yaml` (a new type, a finer type, a tighter `may_use`) puts no unchanged file in the change.
- A new or edited rule puts no unchanged file in the change.
- A changed setting puts no unchanged file in the change.

What a new rule or a tighter law finds in code nobody touched is debt. `lawcheck check --full` lists it as warnings; `lawcheck check --strict` makes it block, for a repository that has paid its debt and wants it to stay paid.

A grouped script rule is in the change when any file of its group is.

### How the base is found

In this order: `--base`; the variable `LAWCHECK_BASE`; the base variable of a known CI system (`GITHUB_BASE_REF` on GitHub, `CI_MERGE_REQUEST_TARGET_BRANCH_NAME` on GitLab); `base:` in the settings; the default branch of the remote as git records it. What comes from outside the repository outranks the committed file, because a branch can edit that file and would otherwise choose its own base.

### The three situations

| Situation | What Lawcheck does |
|---|---|
| A base is found and has common history with HEAD | Judges the change |
| No base exists at all: no remote, nothing configured, nothing handed in | Says so in one line and treats every file as the change. A repository with no base has no "before" to call debt |
| A base is named but cannot be reached: the ref is missing, or the clone is too shallow to hold the common commit | Stops: `error[base-unreachable]`, exit 2, with the exact command or CI setting that fixes it. It does not quietly judge everything, which would turn a team's debt into a red build, and it does not quietly judge nothing |

On the base branch itself the change is empty, and the answer is one line: `lawcheck: PASS  nothing changed against origin/main`. That line is not a statement about the health of the branch, and the documentation says so.

Built today in Yggdrasil: progressive mode, about 2,500 lines in four files, with a table of exceptions in which a change to the architecture file gates the whole project. Proposed: the one rule above. It is possible because a finding depends only on a file's own content, its type and the rule.

## 4.5. CI

One command on a pull request, with enough history to find the merge base:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
- run: npx lawcheck check
```

- No key and no model call: CI verifies verdicts by hashing.
- On a pull request from a fork, `npx lawcheck check --no-scripts` runs no code from the fork. The skipped rules are listed, and a maintainer runs the full check before merging.
- On the base branch, a team that keeps no debt runs `lawcheck check --strict`. A team with debt runs nothing there, or `lawcheck check --full` to print the debt without failing.
- Lawcheck installs no hook and writes no CI file. `lawcheck docs ci` holds the snippets.

## 4.6. Waivers

A waiver is a comment that exempts code from one named rule, with a reason.

```python
print(banner)  # lawcheck-waive no-print -- the CLI entry point prints its banner by design
```

| Form | Covers |
|---|---|
| `lawcheck-waive <rule> -- <reason>` | The line it is on, or the next line when it stands alone |
| `lawcheck-waive-start <rule> -- <reason>` ... `lawcheck-waive-end <rule>` | The lines between |
| `lawcheck-waive-file <rule> -- <reason>` | The whole file; must be in the first comment of the file |

- A waiver names exactly one rule. There is no form that waives everything.
- A reason is required. A waiver without one waives nothing and is an error.
- `forbidden-use` can be waived like any rule, on the line of the use.
- In a language Lawcheck parses, a waiver counts only inside a real comment. Elsewhere it is found by reading lines.
- For a script rule, Lawcheck drops the findings whose line a waiver covers. For a reviewer rule, the covered ranges are given to the reviewer and its findings on those lines are dropped.
- Every problem with a waiver is a finding of `lawcheck check` itself: an unknown rule, a missing reason, an unclosed range, and for script rules a waiver that waives nothing.
- Every run reports the waivers the change adds: a count in the first line of the output and each one in the JSON document. A new waiver is never invisible.
