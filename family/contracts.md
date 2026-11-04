# The contracts index

Who reads whose documents across the family, and which check holds each seam. The documents themselves, their schema ids, fields, producers and consumers, are registered on one page in Yggdrasil's docs, [Family Contracts](https://krzysztofdudek.github.io/Yggdrasil/family-contracts), and that page is canonical: this index names no field and restates no schema. When a row here and that page disagree, the page is right and this row is stale.

## The seams

One row per direction in which a family tool reads another's output. The schema ids are the ones the register lists for that direction.

| Producer → consumer | What crosses | What holds it today |
|---|---|---|
| Yggdrasil → Grain | the graph files (no schema id), `yg-drill/1` | Grain's seam job: Grain's seam tests and its whole suite, run with Yggdrasil's real CLI on the path |
| Grain → Yggdrasil | `grain-proposal/1` with its per-rule measured breakage (`yg adopt`), `grain-advice/1` (`yg advise import`), the look-alike groups (`yg advise`) | Grain's seam job: Grain's proposal, run through Yggdrasil's real CLI |
| Jarl → Yggdrasil | no document: Jarl calls `yg log add` for what the client ratified and passes Yggdrasil's merge drivers to git, only where the repository has a graph | none of its own; covered by Yggdrasil's command reference |
| Runes → Grain, Jarl, Yggdrasil | shared code, not a document: Grain and Jarl commit a pinned copy, Yggdrasil installs `@chrisdudek/runes` at an exact version | each repository's own pin test holds its copy byte for byte against the pinned Runes |

Ratatoskr, Urd and Researcher carry no contracts: no family tool reads a document of theirs, so they have no row here or on the page.

Until 2026-11-04 four more rows ran to and from a tool that left the family that day (the canon's history, "6.3.0"): it read Yggdrasil's and Grain's documents, vendored Jarl's record library (`jarl-record/1`) and opened its work with Jarl's loop profile (`jarl-profile/1`). Those seams have no family consumer now, and the page in Yggdrasil's docs drops them.

No check yet compares Jarl's rows on the page with Jarl's code (the page says so itself), and nothing above runs the producer and the consumer of a seam at the exact commits a release names.

## Where it is going

The checks that need two or more repositories' commits at once belong to Althing's workspace. Built today:

- `node workspace/ws.mjs check canon-sync`: each family README's family section and headline against [the canon](canon.md).

Filed in the 6.2.0 loop, not built yet:

- **contract shapes** (issue 255): for each document with a family consumer, the producer runs at the previous release and at the candidate on the same fixtures, and every difference in shape is listed;
- **pins** (issue 258): one Runes across the family and the version floors;
- **the upgrade path** (issue 256): the previous release's tools, then the candidate's, over the same fixture and one real repository;
- **the stack scenario** (issue 239): the three tools together on the real-repository corpus;
- **the plugins** (issue 259): the core's plugins installed together, every MCP server answering.

Until they land, a release's compatibility rests on each tool's own suite and the seam checks above.
