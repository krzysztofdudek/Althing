# 118 · grain check resolves imports against a symbol table capped at 3 declaring files per name, so a name that the full pass and yg treat as ambiguous binds to the first three files and gives a false 'FIRST edge'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-qzcx
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/plugins/grain/engine/arch.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/relations.mjs:412-426 compactDecls (`if (arr.length < 3 && !arr.includes(rel)) arr.push(rel)`; the comment at :412-413 says the 0/1/>=2 classification survives the cap), :427-432 hydrateTable, arch.mjs:306 (model.relDecls), arch.mjs:129-140 computeArchHits (called from check.mjs:51). The owner-level rule: dirOwner relations.mjs:321-327, symbolOutcome and jvmSymbolOutcome in vendor/runes/dist/relations/resolver.mjs:309-328 and 214-234. The cap comes from commit 7161888 (2026-08-24), which predates the owner rule (m28, issue 223, 2026-09-24). release/6.1.1 does not change relations.mjs.
**Branch:** jarl/051-relation-targets
**Merged:** bf2a1d4
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0-1; @chrisdudek/yg 6.1.0 from npm; node 24.11.1; own fixture script): ProjA declares partial class Acme.Shared.Result in N files of src/ProjA/Shared, ProjB has its own Acme.Shared.Result in src/ProjB/Shared/Result.cs, and the test edits src/ProjB/Jobs/NightlyJob.cs to use `Result`.

- Control N=2 (3 declaring files, within the cap): relDecls holds all 3, including ProjB/Shared/Result.cs; `grain check` is silent; `grain export` has no edge from ProjB; `yg check --full` passes.
- Bug N=3 (4 declaring files): relDecls.csharp["Acme.Shared.Result"] holds only the three ProjA files. `grain check src/ProjB/Jobs/NightlyJob.cs` prints '[grain] architecture: your import of `src/ProjA/Shared/Result.Alpha.cs` (line 7) is the FIRST edge src/ProjB → src/ProjA (0 existing)'. After the edit is committed, `grain export` has no file edge from src/ProjB and no module edge, and `yg check --full` passes with no relation finding. The false note stays after the commit: `grain check` on the committed, unchanged file still prints FIRST edge, so check permanently contradicts the module graph it compares itself with.
- The only difference between the runs is the number of ProjA files, which isolates the cap as the cause.
- Positive control: the same N=3 fixture with the Result in ProjB renamed to Other, so the reference really binds to ProjA. `grain export` has the edge NightlyJob.cs → src/ProjA/Shared/Result.Alpha.cs, and yg check fails with relation-undeclared-dependency projb → proja. So the silence of both tools in the bug case means ambiguity, and the FIRST edge from check is a false alarm.

Order matters: if a file of the second owner sorts among the first three, the cap keeps both owners and the result is correct. The same cap applies to the JVM path (Kotlin expect/actual, or overloads in 3+ files of one package directory with a duplicate FQN elsewhere); read in the code, not run. Direction of the fix: keep in relDecls one file for each distinct owner (the lexicographically first one, i.e. the one symbolOutcome reports) with a cap of 2 owners instead of 3 files, or all declaring files. Distinct from 214 and 052.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-4/F5-check-cap/repro.log (script repro.sh); verification <the session scratchpad, since lost>/bughunt/grain/verify-54/repro.log, positive control <the session scratchpad, since lost>/bughunt/grain/verify-54/control-positive.log (scripts repro.sh, fixture.sh, control-positive.sh in the same directory).

## Why
README.md:315 promises 'resolved / ambiguous / absent: silence instead of a false edge', and relations.mjs:350 says that the full pass and the single-file `check` path 'resolve through the SAME machinery'. The note is advisory (exit 0), but it tells the agent about a boundary crossing that does not exist, and it does not go away after the commit. Two C# projects sharing a namespace and a type name, with a partial class in 3 or more files, are a valid layout.

## Acceptance
- relDecls keeps, for every name, at least one file of each distinct owner (or all declaring files), so the classification at check time agrees with the full pass.
- The N=3 fixture from verify-54: `grain check src/ProjB/Jobs/NightlyJob.cs` is silent before and after the commit, and the positive control still gives the edge to ProjA.

## Changelog
- Fixed: grain check no longer reports a false first dependency when two projects declare a type of the same name and one of them spreads it over three or more files.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2189, pass 2188, fail 0, skipped 1, merge bf2a1d4

