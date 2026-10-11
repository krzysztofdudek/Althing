---
name: researching-the-family
description: Use when a question about any family tool, or about the family as a whole, needs an investigation rather than an answer from memory - a review, an audit, a design, a critique, a measurement, a bug hunt, or thinking a direction through before it becomes issues - and when a finished investigation is to land as issues, rulings or method. Applies whatever language the request is in.
---

# Researching the family

Research is how the family finds out instead of guessing: what a tool really does, whether a design holds, what a number really is. It lives in `research/YYYY-MM-DD-<slug>/` in Althing, one folder per investigation, public, English, and dated so that a folder name identifies it for good. The folder keeps the reasoning; the rule it leads to lands somewhere else. The worked examples are the folders already there: `research/2026-09-27-family-vision-design/` (a design, three critiques and the revision that answers them), `research/2026-09-25-jarl/` (a tool audit whose findings were filed as issues), `research/2026-09-27-horde-replay-baseline/` (a measurement registered before it ran). Below, `ws` is `node workspace/ws.mjs`.

## The folder

- **Name:** `research/<today's date>-<kebab-slug>/`, the slug naming the subject (`2026-10-06-grain-cochange-gates`). Dates and slugs are English.
- **`README.md` first, before any work.** After an optional `# Title`, its first four non-empty lines are, in this order:
  - `**Question:**` the one question, answerable;
  - `**Method:**` what will be read, run and compared, at which commits;
  - `**Status:**` `open`, `concluded`, or `superseded by <slug>` (nothing else);
  - `**Conclusion:**` the answer in a sentence or two; `pending` while open.
  The rail `layout/research` refuses a folder whose README does not open this way.
- Beside it: `report.md` (the investigation), `findings.json` when there are findings to file, `source.md` for raw input someone else wrote, and anything else under `materials/` (scripts, registered metrics, logs, text diffs). Files sit at the top or under `materials/`, nowhere deeper.
- No binary file: no image, screenshot, PDF or archive. A chart is a table or SVG; a picture that is already public is linked.
- After adding or concluding a folder, run `ws index` so `research/INDEX.md` lists it.

## Raw input first

Anything you did not write (a reviewer's list, a mission report, a bug report, a report from the owner) goes into `source.md` before anything else is written: verbatim if it is English; translated and marked `(translated from Polish)` if it is not, and the original is never committed ([language](../../../method/language.md)). Material from private work enters only as a field report, already distilled, with the provenance line of [the boundary](../../../method/boundary.md). The check of each item against the code goes beside it, citing `file:line`.

## Method

- **The question first.** Write it before reading anything, so the reading cannot bend it. A measurement registers its metrics in `materials/` before the first run, and any rule added later says when and why.
- **Read the code at a named commit.** Every claim cites `<Repo>/<path>:<line>` at a commit or a branch tip written in the report. A claim about behaviour is checked by running it, and the run is quoted: the command and what it printed.
- **Run on builds nobody is patching:** the workspace's clones and per-commit trees, a published version, or a scratch clone under Althing's `.cache/`. Never a development checkout a worker is changing, never a private repository, and never the system temporary directory or a session scratchpad for anything the report depends on, because they do not survive a reboot (`worktrees-outside-tmp`). A script that proved something is kept in `materials/`.
- **Real repositories** come from the Runes corpus at pinned commits, so another session can repeat the run. A number taken on a private repository keeps its value and loses the repository's identity.
- **A measurable claim** goes to the Researcher add-on (https://github.com/krzysztofdudek/ResearcherSkill): hypotheses, experiments, kept and discarded results.
- **A design gets critics.** Three independent Opus critiques, each from one angle: fidelity to the owner's intent, technical soundness, the cost of maintaining it. Each critic is fresh, read-only and ranks its findings Critical, Important or Minor. Then a revision that answers every finding, saying what changed and what was rejected and why. All of it stays in the folder.
- **A finding survives a sceptic.** Before it is filed, a second agent tries to refute it against the code; what survives says so, and what does not is recorded as refuted with the reason.
- **Negative results** are written with the same care as positive ones: what was tried, what it showed, why it does not hold.
- **Agents** are spawned with an explicit model, by the split in section 8 of `AGENTS.md`: the strongest for research, design and critique, a lighter one only for mechanical work a script checks. Each brief names the folder, the question and the commits.
- **Honesty.** Keep what is built today apart from what is proposed (mark them), give every number its denominator, and say where an answer is testimony (a model's judgment) rather than proof (a check that ran).

## findings.json

One finding per distinct claim, in one of the shapes Jarl's `import` reads (a flat array is simplest), each with a unique `id` (a dash and at least eight characters, such as `grain-2-B4`, so it reads as unique on its own) and the fields `title`, `claim`, `evidence`, `where` (`file:line`), `severity` (`high`, `medium` or `low`), `kind` (`defect`, `inconsistency`, `risk`, `opportunity`) and `proposal`, plus `verifier` when a sceptic checked it. The file must parse; the rail checks it.

## Landing

A research folder that only sits there changed nothing.

1. **Findings become issues** (`findings-become-issues`), filed without asking first: `ws jarl import research/<folder>/findings.json --source research/<folder> --repo ../../../<Repo> --dry-run`, then without `--dry-run`. Import is idempotent and writes `Source: research/<folder>#<id>` onto each issue. Rewrite each imported acceptance into a line that can be checked. `ws jarl sources research/<folder>/findings.json` shows the coverage; a finding deliberately left unfiled is recorded as a ruling that names it, never as silence.
2. **A conclusion that changes how the family works** goes to its one home: the canon, a `method/` document, a ruling in the open loop (the owner's word where it is his), or issues. The folder keeps the reasoning, not the rule, and the home links back to the folder.
3. **Status:** set `**Status:** concluded` and write the `**Conclusion:**` line. When later work replaces it, `superseded by <new slug>`, and the new folder says what it supersedes.
4. **Freeze once cited.** When a ruling, an issue or a method document cites the folder, `ws freeze research/<folder>` writes `FROZEN.sha256`, and the rail `freeze/holds` keeps every byte from then on. A correction to a frozen folder is a new folder, never an edit.
5. **Commit** on Althing's `main` with the subject `research: <what was found>`.
