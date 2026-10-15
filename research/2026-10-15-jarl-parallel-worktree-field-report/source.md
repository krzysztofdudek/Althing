# Field input, as it arrived

A report written on 2026-10-15 by the coordinating agent of a private repository worked on almost only by AI agents, at the request of the user who maintains Jarl. It describes Jarl 6.1.0 used through its MCP tools. It is kept abridged and anonymised: the repository, its product and its ticket numbers are not named. The coordinator said it had verified nothing against Jarl's source.

## Setup

One coordinating agent and many short-lived worker agents, launched in the background, each in its own git worktree on its own branch; the coordinator merged their branches into `main`, with up to five workers at once. Independent reviewer agents judged finished tickets by running things. The repository's own rules: everything is ticketed in Jarl, workers claim tickets and record evidence, workers never close a ticket, and the `.jarl/` directory is committed with the work. About 90 tickets by the end, about 30 filed by the coordinator, about 17 independent verdicts. Tools used: `jarl_new`, `jarl_list`, `jarl_evidence`, `jarl_review`, `jarl_help`; `jarl_prio`, `jarl_tag`, `jarl_body`, `jarl_close`, `jarl_show` and `jarl_after` were available and not used.

## What worked

1. The rule that nothing is done without an independent review: fresh reviewers who ran real commands found defects the workers did not (an incremental command that regenerated everything, a publication gate that scanned a fixed file list, a validator with no test file, a fix that held for one random seed).
2. Evidence rows with equal numbers of `ran` and `saw`: reviewers could check specific claims.
3. The ticket as the unit of work: demanding a ticket for everything let a later sweep of the backlog find ten things that had only been said in chat.
4. Claims: it was visible which worker held which ticket.

## What hurt

- **3.1 `new` produced malformed files, every time (about 30 tickets here, 21 earlier).** Called with `root`, `title`, `what`, `why`, `acceptance` (an array of strings), `prio` (a number) and `tags` (a comma-separated string), the file came out with the default priority and empty tags, the `what` text held the other fields as XML-like tags (`<why>…</why>`, `<acceptance>["…"]</acceptance>`, `<prio>1</prio>`, `<tags>a,b</tags>`), a stray `</what>` in 21 of them, and the sections `## Why` and `## Acceptance` were empty. The coordinator repaired each file by hand with a regular expression and `sed`. It did not know whether the cause was Jarl's parameter parsing or how its own calls were serialised by the harness.
- **3.2 Ticket id collisions with worktrees.** Two workers filed tickets inside their own worktrees, which had their own copy of `.jarl/issues/`, so the new numbers were computed from the local copy and collided with numbers already used in the main checkout (two tickets numbered 064 and two 065); they were renumbered by hand. Workers also passed the main checkout as `root`, so evidence landed there while the code lived on the worktree's branch.
- **3.3 State in `.jarl/` was always uncommitted and shared.** Every worker's report ended with "`.jarl` in the main checkout needs a commit"; `log.md` changed on every write, so every merge touched it and branches that committed it conflicted on it; with parallel workers writing into one directory, what was whose to commit was unclear. Suggested: evidence in separate append-only files per ticket, and a setting that auto-commits `.jarl/` or keeps it where git ignores it.
- **3.4 After an approve, nothing said what comes next.** Reviewers recorded 12 approves and 5 sends-back; the tickets stayed `open` or `in-progress` in the list; no message said that closing was the next step, by whom and with which command. `in-progress` appeared to mean "claimed", not "being worked", so finished work still read `in-progress`.
- **3.5 `list` has no useful default view** with about 90 tickets: no filters, closed ones not hidden, nothing showing which tickets wait for a reviewer.
- **3.6 Smaller.** `Files:`, `After:`, `Found by:` and `Where:` were almost never filled, and the coordinator did not know how to fill them through the tools; priority collapsed to two values because it could not be set at creation (3.1); nothing stops work done without a ticket, and a few small changes were made before the ticket was filed.

## What the coordinator got wrong, by its own account

It edited ticket files with `perl` and `sed` instead of using `prio`, `tag` and `body`; it never called `close`, `resume`, `handoff` or `queue`; it did not read the help in full; it could not see how the harness serialises tool parameters.

## Requests, ranked

1. `new` parses `what`, `why`, `acceptance`, `prio` and `tags` into their own fields, replies with the created file's path and the parsed fields, and has a test that creates a ticket with every field.
2. Ticket numbers come from one source shared by every worktree of a repository.
3. Evidence and claims in per-ticket append-only files and no shared `log.md`, or auto-commit of `.jarl/`.
4. After `review`, print the next step; show approved-but-open tickets; clarify `in-progress` against "claimed".
5. Filters and a default view for `list`.
6. Document, in `help`, a recommended worktree workflow: where `.jarl` lives, who commits it, who files tickets.
7. Optional: a warning when a commit touches code with no open claimed ticket.

## Not verified by the coordinator

The plugin's version and source; whether the malformed output is a tool bug or a calling problem; whether `close` after an approve is the intended flow; behaviour on a repository without worktrees.
