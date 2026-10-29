# Issues

How a report about any family tool becomes work: where reports come from, how they are triaged, what a good issue holds, and which tags it carries. Built today: this document and the loop skill's filing section. Where it is going: the skill `handling-issues`, which will hold the intake procedure.

## One backlog

The issues of every family repository live only in Althing's loops (`issues-live-in-althing`). Althing has no issue tracker of its own: a person reports a problem on the tool's own GitHub issues, and it is triaged into a loop here. One backlog finds duplicates across tools, gives a bug that spans repositories one home, and keeps every issue in a record anyone can read.

## Where reports come from

- a GitHub issue or pull request on a tool repository;
- the owner describing a problem;
- a finding from research, a review or a bug hunt (`findings-become-issues`);
- a field report, distilled from private work before it arrives ([the boundary](boundary.md)).

## Intake and triage

1. **Raw input first**, into `research/YYYY-MM-DD-<slug>/source.md`: verbatim if it is English, translated and marked if it is not, distilled first if it comes from private work.
2. **Reproduce** on the workspace's build of the reported version, cite `file:line`, and decide: a bug, a gap, or not a defect. A report that does not reproduce says so, and says what was tried.
3. **Deduplicate** against the open loop.
4. **File** into the open release loop, or into a patch backlog when the owner wants a patch, with `Source: <url>`.
5. **Reply, close or label on GitHub** only on the owner's word: it is public speech in his name.
6. **A dependabot pull request** is triaged as an issue, and never merged between a release's pushes.

## What a good issue holds

- A title in plain English.
- **What**, **Why** and **Acceptance**, one checkable line each, and **Where**: a `file:line`, or the command and what it printed.
- `Repo:` as a path relative to the loop's root, and `Files:` with the repository's directory as a prefix ([loops](loops.md)).
- `Tier:`, `strong` or `standard`: the worker's model.
- `Tags:` from the vocabulary below.
- `After:` when it waits on another issue.

An issue without an acceptance line gives the worker nothing to prove and the reviewer nothing to check. Nothing planned or being done goes untracked.

Scope is cut for quality, risk or truth, never for effort (`no-effort-estimates`). When a fix needs a choice of behaviour that the rulings do not settle, the part that fits the defect is done and the rest goes to the owner as a question (`code-docs-conflicts`).

## Tags

Tags are English and kebab-case. A tag the loop already has is reused before a new one is invented; `ws jarl list --all` shows them.

| Tag | Meaning |
|---|---|
| a repository's name (`runes`, `yggdrasil`, `grain`, `jarl`, `horde`, `ratatoskr`, `urd`, `researcher`, `mimir`, `gard`, `althing`) | the repository the issue changes |
| `workplace` | belongs to the workplace axis: Mimir, Gard, or what joins them to the family |
| `port` | moves code from one family repository to another, together with its tests |
| `release` | the release issue itself, which also carries `needs-owner`; it is found by its tags, never by its number |
| `needs-owner` | waits on the owner's word |
| `bug-hunt` | found by a bug hunt |
| `regression` | it worked in an earlier release |
| `partial` | the deferred part of an issue that a scope ruling cut in two |
| `compatibility` | holds only across repositories, and the workspace checks it |
| `placement` | asks where something belongs, because no row of the placement table fits |
| `security`, `performance`, `docs`, `tests`, `flaky`, `ux` | the kind of problem |
| an area of a tool (`propose`, `cochange`, `mapping`, `hooks`, a language such as `csharp` or `rust`) | where in the tool it is |
