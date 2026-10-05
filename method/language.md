# Language

Everything written into Althing is English: files, commit messages, branch names, slugs, tags, issue text, rulings, evidence and briefs. The rule is the owner's, given when Althing was founded:

Krzysztof, 2026-10-05 (translated from Polish): "Release backlogs may be committed there, but with one very important rule: everything in it is in English. I am doing this deliberately, so that I can work completely in public, including the methodology we use." (ruling `althing-family-layer`)

The reason is the reader. Althing is public so that anyone can follow how the family is built, its rulings included, and English is the language that reader shares with the family's code and documentation. The rule binds what is written into the repository. It says nothing about the language of a conversation.

The rail `lang/english` holds the line on every text file, and the commit-message rail on messages and branch names; what they catch and how they were calibrated is in [the rails' README](../rails/README.md).

## Translating the owner

The owner works in Polish. When his words are recorded, in a ruling, an answer, a goal or a source file, they are translated.

- **Faithfully.** Keep his meaning, his register and his firmness. A blunt sentence stays blunt.
- **Without swear words.** A swear word becomes a neutral word with the same force. He chose this when asked how his words would read in public (ruling `ask-011`; his choice was the option "faithfully, without swear words", a label, not his wording).
- **Decisions only.** A reaction that carries no decision is not written into a public ruling at all (the same ruling).
- **Marked.** Write `Krzysztof, YYYY-MM-DD (translated from Polish): "…"`. When he picked an option label, the ruling names the options and says that the label is not his wording.
- **Meaning over words.** Numbers, paths, code, slugs, commands and option labels stay exactly as they are.
- **Flag, never smooth.** A rendering you are unsure of is flagged to him. A wrong one is corrected by a ruling that supersedes it, never by editing the old one.
- **Never commit the original.** The Polish text stays where he wrote it.

Raw input he did not write (a report, a list) goes into `research/YYYY-MM-DD-<slug>/source.md` before anything else: verbatim if it is English, translated and marked if it is not.

Slugs are English and kebab-case. A ruling carried over from a loop written in Polish gets an English slug; the mapping from the old identifiers to the new ones is not public.

## Glossary

The family's working terms, as they are used in rulings, issues and briefs:

| Term | Meaning |
|---|---|
| loop | a Jarl issue loop: one `.jarl/` directory with its goal, rulings, questions, log and issues; one per release directory |
| jarl | the agent that directs a loop: files issues, raises workers, reviewers and the merger, and talks to the owner |
| ruling | a decision recorded in a loop's `decisions.md` with who made it; never edited, only superseded |
| package | two to ten small neighbouring issues handed to one worker on one branch |
| lease | the record that an issue is in progress: its branch, worker, worktree and start time |
| merger | the one agent that merges approved branches, runs the repository's check on the merged tip and records the result |
| fresh reviewer | a reviewer who neither wrote the change nor runs the loop; only its approve clears code |
| testimony | a reviewer's word, recorded; it can stop a change, never make a failing check pass |
| evidence row | one `--ran` command and the `--saw` output it printed; the proof a piece of work is done |
| gate | the check that decides what lands: a repository's own check for a tool, the rails and Yggdrasil for Althing |
| candidate | a release whose manifest names the exact commits being tested together |
| manifest | `releases/<version>/family.json`: the repositories of a release, their versions, branches, commits and checks |
| driver Jarl | the Jarl that writes a release loop's record, pinned to one commit for the whole release |
| field report | material from private work, distilled before it arrives: generic, naming no client, project, person, system or place |
| patch backlog | a release directory for one repository's patch, with its own loop; never a second loop in an open release's directory |
| ratify item | a choice made under the standing mandate that waits for the owner's word and blocks nothing |

## Register

The family's public register (plain words, no jargon put on the reader, what is built today kept apart from where it is going) is written in the canon's register section, which is being written. Every public sentence about the family follows it.
