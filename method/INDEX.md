# The method

How the Yggdrasil family is developed, on one page. Each step links the document that holds its reasons. The rules an agent follows on every turn are in the operating doc, `AGENTS.md`; the procedures for a given moment are the skills it lists in its section 5; the thesis the tools serve is `VISION.md`.

## In one page

1. **Work enters as an issue.** Every report, finding and planned change, for any family repository, is filed into the open release loop before anything else happens. Issues live only here ([issues](issues.md)).
2. **A loop holds it.** One Jarl loop per release directory is the release's whole record: its goal, issues, rulings, questions, evidence and log. Every session resumes from it ([loops](loops.md)).
3. **Agents do the work, and evidence closes it.** The jarl directs. Workers change one tool repository each, in their own worktree. A fresh reviewer reads; the merger runs the repository's check and records what it printed. Work closes on evidence, never on an agent's word ([the working model](working-model.md)).
4. **The owner decides what is his.** Publishing, pushing, tagging, ratifying law and starting a release are his word. Everything else is decided under a mandate that puts quality first and files his choices for ratification ([the working model](working-model.md)).
5. **A release ships the tools together.** The core on one number and the add-ons on their own, through four gates, in a fixed order to `main`, on the owner's word ([releases](releases.md)).
6. **A question that needs investigation becomes research**: a dated folder with a question, a method, a status and a conclusion, whose findings become issues ([research](research.md)).
7. **A ruling that outlives its release goes to the ledger** ([rulings](rulings.md)).
8. **All of it is English** ([language](language.md)), **nothing private enters** ([the boundary](boundary.md)), and every machine is laid out the same way ([the working environment](environment.md)).
9. **The repository polices itself**, and why it is built as it is: [Althing's architecture](althing-architecture.md).

## The documents

| Document | What it holds |
|---|---|
| [working-model](working-model.md) | the roles, trust, the mandate when the owner is away, what stays his word, asking him, models, commits, the repository as memory |
| [releases](releases.md) | versions, the release as a loop, branches, when it ships, the gates, the order to `main`, patches, closing |
| [loops](loops.md) | the loop as the record, one loop per release directory, the driver Jarl, workers and worktrees, template briefs, what is never edited by hand |
| [research](research.md) | the research folder, the method of an investigation, critics for a design, where conclusions land |
| [issues](issues.md) | one backlog, intake and triage, what a good issue holds, the tags |
| [language](language.md) | English only, translating the owner, the glossary of the family's working terms |
| [boundary](boundary.md) | what never enters, field reports, how the line is held, the leak response |
| [environment](environment.md) | the sibling checkouts, `ws.local.json`, worktrees, the devcontainer, the names key, git |
| [rulings](rulings.md) | the owner's standing rulings, by slug |
| [althing-architecture](althing-architecture.md) | how this repository is organised and policed, and why |
