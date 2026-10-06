*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

Below are 16 findings, the most serious first. The design has two critical technical errors: `merge=union` corrupts `decisions.md`, and merge drivers cannot replace `yg log merge-resolve`, because they cannot update the lock. The 6k MCP budget with full parity cannot be reached with the method of §8. The hypothesis "an undefined driver falls back to a plain conflict" held up, but a misconfigured driver is more dangerous than the document assumes. I changed nothing in the repositories; the experiments are in `<session scratchpad>/critic-b/`.

## Checking the facts of §1

**1. Critical, §1 point 3 (fact 3), §5.9, plan 12.1 item 5: there is no "race", and the proposed test in the seam job would be permanently red.**
- Since `3cedc47f8`, 5 commits have already landed in `source/cli/src/relations` (the document saw 2). None of them touches the vendored files; what changes is `pass.ts`, `type-gate.ts` and `verifier.ts`.
- I re-ran `build-relations.mjs` from the current Yggdrasil into the session scratchpad. `diff -r -I '^// '` against Grain's copy is empty. All 58 differences are the `// Source: Yggdrasil <commit>` headers (2 lines × 29 files).
- Consequence: the planned step "regenerate and `git diff --exit-code`" would turn red after **every** Yggdrasil commit, including unrelated ones. The seam job checks out Yggdrasil's `main` or the branch of the same name (`Grain/.github/workflows/ci.yml:46-66`).
- Fix:
  - reword fact 3: "no guard", not "drift";
  - run the diff while ignoring the headers, or move the commit into a single manifest file;
  - compare against the pinned commit, not against `main`.

**2. Important, §1 point 1, §11.1 question 3: Horde does not "require" a graph; it creates one itself.**
- `Horde/skills/horde/SKILL.md:83-86` and `scripts/horde.mjs:524-553`: `horde init` creates the graph through `yg init` and Grain. It refuses only when there is no Yggdrasil CLI.
- The count of 0 `.yggdrasil/` files in Grain, JarlSkill and Horde is right, as are the 519 and 88 nodes.
- So the mechanical barrier was that the work spanned several repositories (Horde works on one repository), not a missing graph.
- Fix: change the justification in point 1 and in the answer to question 3.

**3. Important, §1 point 11 and §6.2: fact 11 is only half true, and the whole "reach principle" stands on it.**
- Confirmed: pinning an aspect to a type lives in `yg-architecture.yaml`, and `templates/rules.ts:50` says "Changes require user confirmation".
- The content of the rule, however, lives in `.yggdrasil/aspects/*/yg-aspect.yaml` and has no consent gate. So an agent can change the law of a whole type without touching `yg-architecture.yaml`.
- The "consent" itself is prose in prime, not a mechanism. The [built] tag overstates it.
- Fix: describe the gap honestly, and add to phase C a rule or a guard "a change to an aspect pinned to a type = a `ratify` question".

**4. Minor, §1: the other facts, checked.**

| Claim | Result |
|---|---|
| 460 cases, byte for byte | Confirmed (`diff -rq`: only `_reference-schema.yaml` and the runner differ) |
| Grammar pins: 15/16, PHP `php_only` versus `php` | Confirmed; the 4 patches are identical |
| Grammar sizes | Confirmed: 22M in Yggdrasil, 32M in Grain |
| "Grain's 8 additional grammars" | Grain has 23 hashes, that is, 7 languages plus a PHP variant |
| 7,764 and 2,294 lines of code that are candidates for Runes | Confirmed |
| MCP: 38 tools / 12,657 tokens and 25 / 9,480 | Confirmed by measurement |
| `yg incident add\|read --aspect` | Confirmed (`cli/incident.ts:21-89`) |
| The profile flags of 441, `--field`, rejecting an unknown key | Confirmed (`jarl.mjs:403,444`) |
| `words.test.mjs` | Confirmed |
| The entry about Horde's mission on 09-05/06 | Confirmed (line 32 of the tool map, now `family/map.md`) |
| Horde: 23,097 lines of scripts, 721 tests | Confirmed |
| The loop state in fact 12 | Already out of date: there are 460 issues, 57 open, 23 in-progress |
| §2.1 "log (`--node`, `--type`, `--aspect`)" | Today `yg log` has only `--node` as a `requiredOption` (`cli/log.ts:93`). `--type` and `--aspect` are 433 (in-progress) and 434 (open), so they have to be marked [proposed] |

## Merge drivers (§2.7, C1, R7)

**5. Critical: `merge=union` on Jarl's `decisions.md` silently corrupts the record.**
- Experiment `<session scratchpad>/critic-b/git/u`: two branches, each runs `--supersedes old-rule` (Jarl writes `**Superseded by:**` in place, `jarl.mjs:814`).
- Result: the merge went through with rc=0 and no conflict. The line `**Superseded by:** rule-b1` landed under **`rule-m`**, that is, it attached itself to the wrong ruling. `old-rule` has two successors, and the "already superseded" invariant (`jarl.mjs:811`) was bypassed.
- The guard against a duplicate slug (`:805`) disappears the same way.
- This is exactly the failure mode that §6.3 wants detected as a conflict.
- For `log.md`, which is only ever appended to, and for CHANGELOG, union is fine in practice. The order then follows the side of the merge rather than time, and identical lines fuse into one.
- Fix: `decisions.md` does not get union. Either a dedicated driver in Jarl (parsing the headings and refusing a double supersession), or a plain conflict.

**6. Critical: the logic of `yg log merge-resolve` cannot be a merge driver, and a "parent's side" lock driver cannot be defined.**
- `merge-resolve` takes `--node` and refs, reads HEAD/MERGE_HEAD and loads the graph (`cli/log.ts:274-300`). More importantly, it **writes `yg-lock.logs.json`** (`prefix_hash`, `core/log/log-merge-resolve.ts:365-391`).
- A git driver is a pure function `%O %A %B → %A` for one file. It cannot modify another file, and the lock is merged by its own driver in an unspecified order.
- After the driver merges `log.md`, the `prefix_hash` in the lock will be stale.
- The "parent's side" in the lock depends on the direction of the merge. Horde knows it; a driver does not (`%A` is always "ours").
- Fix:
  - for `log.md`, a purely textual driver, with the lock regenerated in a separate step after the merge (a post-merge hook, or `yg check` repairs the baseline);
  - for the lock, a driver with a direction-independent rule (the union of the keys, with conflicting pairs dropping out as unverified);
  - re-estimate C1 from S–M to **M–L**.

**7. Important: hypothesis R7 confirmed, but a different case is more dangerous (git 2.50.1).**

| Case | Result |
|---|---|
| Undefined driver | A plain conflict with markers (safe, as hypothesised) |
| Driver defined, but the binary is missing (`command not found`) | The file is marked `UU`, but **with no markers and only the "ours" content**; the "theirs" side is invisible, so `git add` silently loses it |
| The driver exits with code 0 without writing | A clean merge with rc=0 and a wrong result |

- When `yg init` writes a local `merge.<n>.driver` and the environment has no `yg` on the PATH (a different Node version, CI, a worktree in another shell), the user gets a trap.
- `land.mjs`, which today resolves these files itself (`SKILL.md:264-268`), would depend on the clone's local configuration, which is a regression.
- Fix:
  - `land.mjs` and the merger pass the driver through `git -c merge.X.driver=…` on every call;
  - the driver from `yg init` points at the binary in `node_modules/.bin` through `npx --no-install`, with a fallback to `git merge-file` with markers when yg does not work;
  - GitHub's merge button does not run drivers, and the documentation has to say so.

## Horde on Jarl (§4)

**8. Important: `jarl next`, `queue` and `set` on a Horde loop are not merely "informational".**
- `queue` shows only issues with a "live approve" (`jarl.mjs:166`). With `approve: none` it will always be empty, that is, a false "nothing to merge".
- `next` and `resume` compute readiness from `After` and from file overlap. Horde's port edges do not go into `After` (§4.2), so they will present blocked tickets as ready.
- The profile has no transition graph, and `jarl set` lets any status in. A director or a worker with the Jarl plugin can run `jarl_set N queued` and bypass the architect's veto. The claim "nothing but `refine` moves to `queued`" is not enforced.
- Fix:
  - a data flag in the profile, e.g. `"set-by": "none"` (a status unreachable through `set`, only through the library), or a list of transitions;
  - `next` and `resume` refuse, or flag, a loop whose profile has `external-scheduler: true`;
  - increase the cost of D2 by these two items.

**9. Important: vendoring "Jarl's scripts directory" freezes 142 exports as an implicit API.**
- `jarl.mjs` is importable (the guard at `:3180`, `jarl-mcp.mjs:27`), but it has 142 `export`s with no declaration of which of them are stable.
- This is exactly "an interface extracted from one consumer", only unversioned. Every refactor of Jarl will blow up when Horde bumps its pin.
- Fix: Jarl exposes an explicit `record.mjs` module with a list of exports, a contract test in Jarl's suite and an entry in Family Contracts.

## Runes (§5)

**10. Important, §5.1 and §3.2: the words test in its lexical form is unworkable.**
- Runes is supposed to know nothing of a node, a type or a graph. Yet the relations code has 520 × `node` (tree-sitter `Node`), 24 × `ownerNode` and `ownerIndex`, and "type" is a kind of edge (`type-ref`, `import type`).
- Yggdrasil already carries "Horde" in message **literals** today, e.g. `io/node-parser.ts:372,377` and `utils/file-formats-graph.ts:56-57`. The rule in §3.2 would be red on day one.
- Fix:
  - a Runes guard on exported identifiers and on imports, not on words;
  - in B2, rename `ownerNode` to `owner`;
  - add removing the "Horde" literals from Yggdrasil to the plan.

**11. Important, §5.5 (Yggdrasil): "in `dependencies`, bundled by tsup" is a contradiction.**
- By default tsup treats `dependencies` as external, so there will be no bundle. Yggdrasil also has `dts: true` (`source/cli/tsup.config.ts`).
- Fix, one of:
  - (a) a runtime dependency with an exact pin, without bundling;
  - (b) a devDependency and `noExternal: ['@chrisdudek/runes']`, with a check that the `.d.ts` of the public entry points does not import `@chrisdudek/runes`.

**12. Important, §5.2–5.3: an injected runtime is workable, but a pin of the runtime version is missing.**
- There is exactly one value import of `web-tree-sitter` in the relations: `kotlin-recover.ts:1,521` (`new Parser()` and `setLanguage(tree.language)`). The rest are `import type`, so injecting a parser factory is S.
- `ast/parser.ts`, however, depends on `language-registry` and on `createRequire(...).resolve('web-tree-sitter/…wasm')` for the cache hash (`:73,92`). So the runtime's identity has to be injected too.
- Today both consumers have `web-tree-sitter` 0.27.0, but nothing enforces it. The 460 catalogue in Runes's CI will pass on a different runtime than the consumer's.
- Likewise, a grammar recipe of the `npm` kind requires devDependencies at the consumer in the exact versions from the manifest, which gives a second point of drift.
- Fix:
  - the Runes manifest pins `runtime` and the versions of the npm packages;
  - the testkit checks that the consumer's match;
  - `.d.mts` requires `web-tree-sitter` as an optional `peerDependency` (types).

**13. Minor, §5.5: the vendoring gate.**
- It will not be flaky, because a clone of a tag is deterministic.
- The sha256 comparison against the pin, however, works offline and on its own detects a manual edit. Skipping the whole gate offline is therefore unnecessary.
- Reusing `.runes/<tag>` will hide a moved tag.
- The clone needs a public Runes repository (otherwise a token in CI).
- Fix:
  - the sha check always, also offline and in pre-commit;
  - the clone and `rev-parse` only in CI, always fresh (no cache);
  - this also resolves the "disagreement" with the owner along the way.

## MCP and the 7.0 plan

**14. Important, §8 and B6: 6k tokens with full parity cannot be reached with the "one sentence of description" method.**
- Measurement (`<session scratchpad>/critic-b/mcp*.mjs`):

| Server | Schemas alone, with parameter descriptions | With the tool description cut to 1 sentence | Schemas with no descriptions at all |
|---|---|---|---|
| Jarl | 29,744 characters ≈ 7.4k | ≈ 8.4k | ≈ 2.4k |
| Grain | 21,403 characters ≈ 5.4k | ≈ 6.2k | ≈ 1.8k |

- The weight lies in the descriptions of the 200 (Jarl) and 150 (Grain) parameters, not in the tool descriptions.
- Fix: the budget can be reached only by trimming the parameter descriptions (to nothing, or to the enum/type, with the rest through `help: true`) or through shared parameters. This has to be named outright, and its effect on the accuracy of calls measured. Or a target of 8k.

**15. Important, §12.2: dependencies and cost estimates.**
- **Double counting:** A2 (the Horde benchmark) is built "from Yggdrasil's 7.0 items (merge drivers, `yg owner --files`, log guards)". These are C1, C4 and part of C2, which the plan is doing at the same time, in parallel, with Jarl. One of the threads will lose scope, or the comparison is contaminated. A separate scope has to be chosen for the benchmark.
- **Mistagged:**

| Item | Is | Should be | Why |
|---|---|---|---|
| C1 | S–M | M–L | Finding 6 |
| A1 | S | M | Reproducing the manual analysis "to the last one" needs data on the provenance of reviews and on CI after merge, which the record does not always have |
| C4 | S | S–M | `yg owner` has only `--file` today, and the type unit is added |
| D2 | L | L+ | Add findings 8 and 9 |

- **B6** is independent of B5 and can go earlier.

**16. Minor, §5.2: the Node 18 target has been EOL since April 2025.**
- The CI matrix 18/22/24 exists only for Jarl (`engines >=18`). Yggdrasil and Grain have `>=22`.
- Fix: raise Jarl's `engines` to 22 and the Runes target to node22, which simplifies `stripTypeScriptTypes` and the fs API.

The experiment files are in `<session scratchpad>/critic-b/`:
- `git/r` and `git/u`: merge drivers and union;
- `regen/`: regenerating the relations;
- `mcp.mjs` and `mcp2.mjs`: measuring `tools/list`.
