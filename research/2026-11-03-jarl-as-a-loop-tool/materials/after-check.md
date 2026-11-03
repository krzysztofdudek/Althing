# The After order of the design's issues, checked line by line

**Question:** Does every acceptance line of the design's issues have, before it in the After graph, the issue that adds the command, flag, kind, field or view it needs?

**Method:** For each of 006 007 008 022 031 039 040 042 044 045 049 052 055 058 059 063 064 066 068 073 076 078 083 084 085 086 087 088, every acceptance line was read for what it uses that the record and the commands at JarlSkill 71ebc5b do not have, and for which issue of the list adds it. Built things were checked in `scripts/jarl.mjs` at 71ebc5b: `retract` takes `--by`, `new` takes `--found-by`, `set` takes `--worker` and no `--by`, and `Resources` is a field. A script read the After lines from the issue files, walked them transitively, looked for a cycle, and marked each need ordered or not. The same table run on the files at deda60c, before the fixes, found 9 of its needs unordered, besides 052's three and 008's slice, which the fixes took out of those lines.

**Status:** done

**Conclusion:** After the fixes every need in the table is ordered and the graph has no cycle. Round 3 of 035's review named three gaps: 052 against 039 and 073, and 008's slice. The check found seven more pairs of the same class. 052 also gave rows to a named coordinator that only 085's slices make, so those rows moved to 085. 007, 042, 068, 084 and 086 used 085's coordinators, slices, writer per call or escalation text and were not after 085. 084 put a conflict on the jarl's list without being after 052. Each was fixed the same way as round 3's finding: the line names the issue that adds what it uses, and the After list orders it. 008 now reads a slice tag only when the issue has one, so it needs nothing from 085. 052 now derives only what the record at 71ebc5b holds and says which issue adds each other row.

## Fixes

| Issue | Acceptance change | After before | After now |
|---|---|---|---|
| 052 | derives the rows the record at 71ebc5b holds; the rows of owner-only lines, promises and waits, slices, escalations, the merger, parents and liveness belong to 039, 073, 085, 078 and 042; `status --as` and `resume --as` named | 035 | 035 |
| 039 | adds its row to `next --as` and the owner's digest | 035, 083 | 035, 052, 083 |
| 073 | each kind adds its row to `next --as`; a promise's maker read from its Found by | 035, 083 | 035, 052, 083 |
| 008 | names the held issue's slice tag only when it has one | 035 | 035 |
| 068 | per-coordinator counts of reopens after done and retractions, read from the writer of 085; refused writes not counted | 035 | 035, 085 |
| 042 | the coordinator's list is the slice's coordinator's (085), the jarl's with no slice | 035, 052 | 035, 052, 085 |
| 007 | the coordinator's list over its slice (085) | 035, 052, 086 | 035, 052, 085, 086 |
| 084 | the lease writer is 085's `--by`; the conflict shows on `next --as jarl` (052) | 035, 031, 083 | 035, 031, 083, 085 |
| 085 | adds the coordinator's rows to `next --as`; writes the four reasons to escalate into references/jarl.md for 086 to quote | 035, 052, 083 | 035, 052, 083 |
| 086 | the slice selector is 085's slice; a built-in rule the references do not hold yet is written there first | 035, 052, 083 | 035, 052, 083, 085 |

## The table

Issues with no row use nothing another issue of the list adds: 006 (`next` and the refusal are built), 022, 031, 055 (the approved tip is 002, done), 063 (`decide --by` is built), 066, 083 and 087.

| Issue | Needs | Provided by | Ordered |
|---|---|---|---|
| 007 | `next --as`, the coordinator's list | 052 | yes |
| 007 | a coordinator's slice | 085 | yes |
| 007 | the built-in rule on shared reviews | 086 | yes |
| 008 | a slice tag, read only when the held issue has one | none needed | yes |
| 039 | the owner-only mark under format 3 | 083 | yes |
| 039 | `next --as` and the owner's digest | 052 | yes |
| 040 | the batch id under format 3 | 083 | yes |
| 042 | `next --as` | 052 | yes |
| 042 | its coordinator's list (a slice gives the coordinator) | 085 | yes |
| 044 | the issue tree with a Source | 078 | yes |
| 045 | `next --as jarl` | 052 | yes |
| 049 | the built-in rule for a change meant to alter nothing | 086 | yes |
| 049 | the owner's waiver (004, outside the list); its test needs no waiver, since done refuses with no approve at 71ebc5b | none needed | yes |
| 052 | rows of owner-only lines, outside persons and coordinators, moved to 039, 073 and 085 | none needed | yes |
| 058 | `brief --slice` and a rule of another slice | 085 | yes |
| 058 | the rules with a scope | 086 | yes |
| 059 | `--artifact` under format 3 | 083 | yes |
| 059 | owner-only lines, named as where the owner's looks live; 059 builds nothing on them | none needed | yes |
| 064 | the next actions at the end | 052 | yes |
| 068 | the writer each move names (`--by` per call) | 085 | yes |
| 073 | kinds `promise` and `wait` under format 3 | 083 | yes |
| 073 | `next --as` | 052 | yes |
| 076 | scenario 1: `next --as`, the owner's digest | 052 | yes |
| 076 | scenario 1: slices, `Merger:` | 085 | yes |
| 076 | scenario 1: the second lease refused | 008 | yes |
| 076 | scenario 2: a standing rule for slice A | 086 | yes |
| 076 | scenario 2: a promise | 073 | yes |
| 076 | scenario 2: `brief --slice` | 058 | yes |
| 076 | scenario 3: the liveness threshold | 042 | yes |
| 076 | scenario 4: key, renumber, conflict, conflict markers | 084 | yes |
| 076 | scenario 4: two files with one number refused | 031 | yes |
| 076 | scenario 5: `next --as owner --all` | 052 | yes |
| 076 | scenario 6: a proof with no verdict on the owner | 052 | yes |
| 078 | the parent in the header under format 3 | 083 | yes |
| 078 | the parent's check on its coordinator's list | 052 | yes |
| 078 | the slice tag a sub-issue inherits | 085 | yes |
| 078 | a rule naming an issue | 086 | yes |
| 084 | the key under format 3 | 083 | yes |
| 084 | 031's detection and refusal | 031 | yes |
| 084 | the writer on a lease line (`--by` per call) | 085 | yes |
| 084 | the conflict on the jarl's list | 052 | yes |
| 085 | `next --as` rows, the jarl's list | 052 | yes |
| 085 | the writer under format 3 | 083 | yes |
| 086 | `next --as` and `resume --as` | 052 | yes |
| 086 | the slice selector | 085 | yes |
| 086 | the four reasons to escalate in references/jarl.md | 085 | yes |
| 086 | whether Applies to raises the format | 083 | yes |
| 088 | `next --as` in place of the commands table | 052 | yes |
| 088 | `brief` | 058 | yes |
| 088 | the coordinator's guidance | 085 | yes |
| 088 | built-in rules | 086 | yes |

## The After graph after the fixes

006: 035 · 007: 035, 052, 085, 086 · 008: 035 · 022: 035 · 031: none · 039: 035, 052, 083 · 040: 035, 083 · 042: 035, 052, 085 · 044: 035, 078 · 045: 035, 052 · 049: 035, 086 · 052: 035 · 055: 035 · 058: 035, 085, 086 · 059: 035, 083 · 063: 035 · 064: 035, 052 · 066: none · 068: 035, 085 · 073: 035, 052, 083 · 076: 052, 042, 058, 085, 086, 084, 039, 073, 008 · 078: 035, 083, 085, 086 · 083: 035 · 084: 035, 031, 083, 085 · 085: 035, 052, 083 · 086: 035, 052, 083, 085 · 087: 035 · 088: 052, 058, 085, 086
