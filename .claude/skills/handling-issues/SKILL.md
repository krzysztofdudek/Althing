---
name: handling-issues
description: Use when a report arrives about any family tool - a GitHub issue or pull request on a tool repository, a dependabot pull request, a bug the owner describes, a finding from research or review, or a field report distilled from private work - and it must be reproduced, triaged, deduplicated and filed into the right release loop, or when the open issues and pull requests of the family's repositories are to be swept. Applies whatever language the request is in.
---

# Handling issues

Every report about a family tool ends up in one place: an issue in a release loop in Althing (`issues-live-in-althing`). The tool repositories keep GitHub issues open so that anyone can report, but nothing is tracked there; Althing itself has no issue tracker. Reports are reproduced before they are believed, and everything anybody saw becomes an issue, filed directly (`findings-become-issues`). Below, `ws` is `node workspace/ws.mjs`; how a loop is run is [directing-a-release-loop](../directing-a-release-loop/SKILL.md).

## Sources

- **GitHub, read freely:** `gh issue list -R krzysztofdudek/<Repo> --state open` and `gh pr list -R krzysztofdudek/<Repo> --state open` for each repository of the registry (the core: Yggdrasil, Grain, JarlSkill; the add-ons: RatatoskrSkill, UrdSkill, ResearcherSkill; Runes), then `gh issue view <n> -R … --comments` for each one not yet triaged. A sweep checks each against the open loop first (`ws jarl list --all --grep "<repo>#<n>"`).
- **The owner** describing a bug in conversation.
- **Research and review:** a reviewer's finding, a sceptic's note, a research folder's `findings.json` (those land through [researching-the-family](../researching-the-family/SKILL.md)).
- **Private work:** only as a field report, distilled before it arrives, naming no client, project, person, system or place, with the provenance line "a field report from a private deployment; its origin is not named here" ([the boundary](../../../method/boundary.md)). If what you hold is not yet distilled, it does not enter.

## 1. Raw input first

Before anything else is written, the report goes into a research folder of its own, `research/YYYY-MM-DD-<repo>-<short-subject>/`:

- `source.md`: the report as it arrived, with its URL, author handle and date when it came from GitHub. Verbatim if English; translated and marked `(translated from Polish)` if not, the original never committed ([language](../../../method/language.md)). A screenshot attached to a GitHub issue is described in words and linked where it is public, never downloaded into the repository.
- `README.md` with its four header lines (Question: "is this a defect in <tool>, and where?"; Method; `**Status:** open`; `**Conclusion:** pending`).

Several reports swept at once may share one folder, one `source.md` section per report.

## 2. Reproduce

- On the version reported, never on a development checkout: the published package or plugin at that version, or a detached tree of that tag under Althing's `.cache/`, and later the workspace's adopter build (`ws up adopter`, once the workspace packages land). Never under the system temporary directory.
- On a small public or synthetic repository that shows the problem; never on a private one.
- Then on the current release branch, to learn whether it is already fixed.
- Write `triage.md` beside the source: each distinct problem the report contains, the exact commands and what they printed, the code that causes it with `<Repo>/<path>:<line>` at a named commit, and a verdict for each: **defect**, **gap** (works as built, but the family promised or needs more), or **not a defect** (with the reason). A report you could not reproduce says what was tried and stays open as a question to the reporter, drafted for the owner.

## 3. Deduplicate

`ws jarl list --all --grep "<key words>"` and `--tag <area>`. When an issue already covers it, do not file a second one: attach the new source to it (`ws jarl field <id> Source "research/<folder>#<finding id>" --add --by <who>`) and add what the report adds as a round or evidence. A closed issue that the report shows was not really fixed is reopened with the report as the reason.

## 4. File

- For each defect or gap, a finding in `findings.json` in the folder (the shape in [researching-the-family](../researching-the-family/SKILL.md)), then `ws jarl import research/<folder>/findings.json --source research/<folder> --repo ../../../<Repo> --dry-run --by <who>`, then without `--dry-run`. Each issue carries `Source: research/<folder>#<id>`.
- Rewrite each imported acceptance into a line with its method (`ws jarl field <id> Acceptance "[test] …" --by <who>`: a `[test]` line is red before and green after), set `Files` with the repository's directory prefix, and English tags reused from the loop, each with `ws jarl field` (`ws jarl list --all` shows them).
- **Which loop:** the open release loop by default. When the owner wants a patch, a patch backlog of its own (releasing-the-family). When no loop is open, the folder holds the triage and its findings are imported when the next loop opens; tell the owner.
- Then set the folder's status to `concluded` with a one-line conclusion naming the issues, run `ws index`, and commit (`research: triage of <repo>#<n>`).

## 5. Answer on GitHub only on the owner's word

Commenting on, labelling, closing or reopening a public issue or pull request needs the owner's word, each time. Draft the reply in `triage.md` (plain, factual, naming the release that will carry the fix, never a date or an effort), show it to him, and post it only when he says so. A "not a defect" verdict is drafted the same way.

## Pull requests

- **From outside contributors:** never merged by an agent. Triage the change like a report: what it fixes, whether it is right, whether a test proves it. The owner decides; if the fix is taken, it lands through an issue in the loop, with the contributor credited in the issue and the CHANGELOG entry.
- **Dependabot:** triaged as issues. Never merged between a release's pushes; a bump that matters is filed into the loop and lands on the release branch like any other change.

## What never happens

- An issue tracked only on GitHub, or only in conversation.
- A reproduction on a private repository, or a client's name, system or person in a source, a triage, an issue or a reply.
- A fix pushed straight to a tool's `main`.
- A report believed without running it.
