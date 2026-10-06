# The contracts index

Who reads whose documents across the family, and which check holds each seam. The documents themselves, their schema ids, fields, producers and consumers, are registered on one page in Yggdrasil's docs, [Family Contracts](https://krzysztofdudek.github.io/Yggdrasil/family-contracts), and that page is canonical: this index names no field and restates no schema. When a row here and that page disagree, the page is right and this row is stale.

## The seams

One row per direction in which a family tool reads another's output. The schema ids are the ones the register lists for that direction.

| Producer → consumer | What crosses | What holds it today |
|---|---|---|
| Yggdrasil → Horde | `yg-check/1`, `yg-context/1`, `yg-impact/1`, `yg-node/1`, `yg-aspects/1`, `yg-aspects-health/1`, `yg-advise/1`, `yg-aspect-log/1`, `yg-suppressions/1`, `yg-drill/1`, `yg-error/1` | Yggdrasil's `family-contracts-invariant` test (every schema Yggdrasil emits is on the page, and every `yg-…` id on the page is emitted or named as produced elsewhere); Grain's seam job (every id Horde's scripts read is on the page); Horde refuses a document version it does not know and names the release to upgrade past |
| Yggdrasil → Grain | the graph files (no schema id), `yg-drill/1` | Grain's seam job: Grain's seam tests and its whole suite, run with Yggdrasil's real CLI on the path |
| Grain → Yggdrasil | `grain-proposal/1` with its per-rule measured breakage (`yg adopt`), `grain-advice/1` (`yg advise import`), the look-alike groups (`yg advise`) | Grain's seam job: Grain's proposal, run through Yggdrasil's real CLI |
| Grain → Horde | `grain-advice/1`, `grain-obligation/1`, `grain-cochange/1`, `grain-measure/1`; `grain-completeness/1` is planned for the architect and not read yet | Grain's seam job, run against Horde's real scripts; its scan of the ids Horde reads |
| Jarl → Horde | `jarl-record/1`: Jarl's record library, which Horde vendors at a pinned Jarl commit | Jarl's `record-contract` test (the library's exports and parameters cannot change without a new `RECORD_API`); Horde refuses to run when its vendored copy's `RECORD_API` differs from its pin |
| Horde → Jarl | `jarl-profile/1`: the loop profile a mission is opened with | Jarl's profile reader refuses a profile version it does not read |
| Jarl → Yggdrasil | no document: Jarl calls `yg log add` for what the client ratified and passes Yggdrasil's merge drivers to git, only where the repository has a graph | none of its own; covered by Yggdrasil's command reference |
| Runes → Grain, Jarl, Horde, Yggdrasil | shared code, not a document: Grain, Jarl and Horde commit a pinned copy, Yggdrasil installs `@chrisdudek/runes` at an exact version | each repository's own pin test holds its copy byte for byte against the pinned Runes |

Ratatoskr, Urd and Researcher carry no contracts: Horde uses them when present and never reads a document of theirs, so they have no row here or on the page.

No check yet compares Jarl's rows on the page with Jarl's code (the page says so itself), and nothing above runs the producer and the consumer of a seam at the exact commits a release names.

## Where it is going

The checks that need two or more repositories' commits at once belong to Althing's workspace. Built today:

- `node workspace/ws.mjs check canon-sync`: each family README's family section and headline against [the canon](canon.md).

Filed in the 6.2.0 loop, not built yet:

- **contract shapes** (issue 255): for each document with a family consumer, the producer runs at the previous release and at the candidate on the same fixtures, and every difference in shape is listed;
- **pins** (issue 258): one Runes across the family, Horde's Jarl pin on Jarl's candidate commit and then its tag, and the version floors;
- **the upgrade path** (issue 256): the previous release's tools, then the candidate's, over the same fixture and one real repository;
- **the stack scenario** (issue 239): the three tools together on the real-repository corpus;
- **the plugins** (issue 259): the core's plugins installed together, every MCP server answering.

Until they land, a release's compatibility rests on each tool's own suite and the seam checks above.
