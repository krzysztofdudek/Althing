# Horde from zero: the second independent design iteration

**Question:** Given what the family is for and what its maintainer wants, what should the tool that works the graph look like, and should it be a separate tool at all?

**Method:** An eight-part, read-only design review by a fresh model instance on 2026-09-09. It read `VISION.md`, Yggdrasil's docs, Grain, the add-on skills, the eleven Superpowers skills Horde absorbed, Horde 0.4.0's code, two field reports and their triage and the 6.0.0 decisions, and the first review last, then compared five shapes.

**Status:** concluded

**Conclusion:** Horde as the mission layer of the law with no standing roles: one-shot consults cut the client's sentence into territories on the graph, one ephemeral worker runs per ticket, a mechanical landing gate is judged by Yggdrasil's own reviewer, and law is raised by any agent of a territory and lowered only by the client.

## What is here

- [review.md](review.md): the review: the goal as read, five shapes compared, the proposed shape, the migration, and ten disagreements with the maintainer

## Reading it

**What it is.** An eight-part design review written at the maintainer's request, asked not to critique Horde 0.4 but to think the tool through from zero. Where a document and the code disagree, the code is cited. It read [the first review](../2026-09-09-horde-redesign-review/README.md) last, so that the first review would not anchor it.

**What it concludes.** Five shapes compared (0.4 with the 6.0.0 decisions; the first review's territories model; the thin shape of a plan plus one subagent per task plus the gate; no separate Horde; its own). It recommends the last, with a `horde-law/1` document rendered to the client in plain words with a veto; teammates only relocate the loop. It marks the port-version mirror (issue 008) moot under that shape, keeps D1–D3, and prices the migration inside 6.0.0 test file by test file. Part 8 lists ten disagreements with the maintainer, each against his own sentence.

**How it was written.** Read-only; the reviewer edited nothing and ran no `yg` or git write. It names no client, repository, mission or person other than the maintainer; `H<n>` and `Y<n>` are the field reports' item numbers. Six of its `file:line` citations were re-read against the code before it was filed, and all six hold.

**Use for.** The shape of Horde, next to the first review. Its first proposed measurement needs no new code: classify every review "changes" and every not-reproduced verdict in a finished mission's ticket logs as rule-expressible, taste, or neither; the size of "neither" is the value of the seats it proposes to delete. It was input to the 6.0.0 decisions, not a decision itself.

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. The maintainer's words quoted in Polish in part 8 are translated and marked. The field reports it read are from a private deployment; their origin is not named here.
