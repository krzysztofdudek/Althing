# Yggdrasil 6.1.0 release readiness

Candidate: Yggdrasil `release/6.1.0` at `1f82edbb`, with Horde and Grain on `release/6.1.0` and Jarl at its tip. Five angles were run, each finding checked by a separate verifier: upgrade-real, upgrade-docs, first-hour-again, daily-loop-again and family. The findings below are the ones that held up after checking. Severities are the verifiers' final ones unless this report says otherwise.

## 1. Verdict

**Ready with fixes. It cannot ship at the current tips.** Much of the release is solid:
- No run found a wrong exit code from Yggdrasil's own gate.
- A real 6.0.0 → 6.1.0 upgrade of two projects (a TS shop app and the v6.0.0 `examples/`) came back to green. Every prose verdict survived (4/4 and 2/2), including one recorded by an external judge.
- The Horde and Grain suites are green against the candidate, and the schema register agrees in both directions.
- The first-hour adopter findings are fixed or partly fixed.

Three things block it:
- **One blocker in the family.** Horde's `promises` package changed a lot but is still published as `0.1.0`. Every 6.0.0 adopter who installed it is stuck, and every documented way to refresh it fails.
- **Majors, mostly in how the upgrade is described.** Three changes turn a passing gate red, and each sits under Fixed or is undocumented: `auto_approve: full` in CI, trailing `yg-suppress` markers, and one unknown config key that throws away the whole config. Upgrading step 6 is not true as written. One untagged package freezes `yg pack update` for every package.
- **Majors in the contracts.** The one-line `next:` calls a paid run free. `yg-error/1` is about to be frozen with the wrong type for `next.command`. The only cross-repo seam gate in the family no longer checks for load failures.

Most fixes are CHANGELOG moves or small code changes. Re-run the upgrade walk after they land.

**Version number: release it as 7.0.0, not 6.1.0.** The Breaking section:
- removes a command (`yg verdict package|record|read`);
- removes the `OPENAI_API_KEY` fallback for `openai-compatible`;
- rewrites every text layout;
- adds new blocking errors;
- changes how rules are hashed and where drill cases live;
- changes what a trailing suppress marker means.

CHANGELOG.md:6 promises Semantic Versioning, and by SemVer that list is a major release. A minor number also causes practical harm:
- The documented CI recipe is an unpinned `npx @chrisdudek/yg`, so every adopter's CI floats to the new release on the day it is published.
- `yg pack new` scaffolds `^6.0.0`, and that range accepts 6.1.0.
- 6.0.0 and 6.1 hash some prose pairs differently, so a team with mixed versions keeps invalidating each other's verdicts in the committed lock.
- Horde 6.0.0 cannot drive Yggdrasil 6.1.

The only argument for 6.1.0 is that the family moves together, and no document records that reasoning (decisions.md does not either). If the number stays 6.1.0, the CHANGELOG header and `docs/family-contracts.md` must say why SemVer does not apply here. The CI recipe must pin a version either way.

## 2. Blockers and majors

| id | severity | title | where | fix |
|---|---|---|---|---|
| B1 (family F1) | blocker | Horde publishes `promises` `0.1.0` with different content from what 6.0.0 adopters installed as `0.1.0`: `packages/` changed in 30 files (+923/-19), including the new rule `evidence-is-live`. After `release.yml` tags `pack/promises@0.1.0`: `pack verify` exits 1 and blames an edited copy or a moved tag, neither of which is true. `--reinstall` exits 1. `--to 0.1.0` says it is pinned but copies nothing. A plain `update` says "already at 0.1.0". The only way out that works, `pack remove` + `add`, is undocumented and deletes the adapter's adaptations | Horde `packages/promises/yg-package.yaml:14`, `yg-marketplace.yaml:15`, `.github/workflows/release.yml:54-68`; Yggdrasil `pack-update.ts:327,373` | Before Horde merges: bump `promises` to `0.2.0` in both manifests, the CHANGELOG and the README pin example. If possible, tag `pack/promises@0.1.0` at `6a93649` (Horde v6.0.0) so 6.0.0-era copies verify and update cleanly. In Yggdrasil, make verify and `--reinstall` name a third cause ("the publisher re-used this version number") and its way out |
| M1 (upgrade-real F2, U8 in part) | major | One package that 6.0.0 installed from an untagged source makes a bare `yg pack update` fail for every package ("publishes no version of 'lint' … Nothing was installed or changed", rc=1). `pack verify` stays at rc=1 for good and recommends `--reinstall`, which fails the same way | `yg pack update` (update-all), `yg pack verify`; CHANGELOG Upgrading step 6, Breaking line 59 | Update every package that can be updated and report the untagged ones at the end. Give verify its own outcome, "installed from an untagged source by an earlier release", with a next step that works (pin it, or remove it and re-add once the author tags). Say in step 6 that update-all stops on such a package |
| M2 (upgrade-real F3) | major | One unknown top-level key, even in the gitignored `yg-secrets.yaml`, makes the CLI fall back to `FALLBACK_CONFIG`. The result is a false `unmapped` error across the whole repo, a false "no reviewer configured", valid LLM verdicts no longer counted, and a `next:` that sends the user to map files. Because the file is local only, CI stays green and nobody else can reproduce it | `graph-loader.ts:189-199`; `config-parser.ts:131-147,328-329`; missing from Upgrading | If unknown keys are the only config error, keep the parsed config and report the key. Rank config errors so that `next:` names the key. Make `init --upgrade` report the key too. Add an Upgrading step that points at both `yg-config.yaml` and the local `yg-secrets.yaml` |
| M3 (U1) | major | The release breaks things but is numbered as a minor version, and the CI recipe has no version pin. Every adopter's CI moves to it on publish day. A team running 6.0.0 and 6.1 side by side keeps invalidating each other's prose verdicts for rule directories that hold extra files | CHANGELOG.md:6; README.md:171-172; getting-started.md:362-364; `graph-loader.ts:27` (`CLI_SUPPORTED_SCHEMA='6.0.0'`) | Release as 7.0.0 (see §1). Pin `npx @chrisdudek/yg@<version>` in the docs. Add Upgrading step 0: upgrade CI and every developer together |
| M4 (U4) | major | With a committed `auto_approve: full`, a bare `yg check` under `CI=true` used to fill and PASS in 6.0.0. It now FAILs, and not even the free script pairs are filled. The note says "next: Nothing, for the gate" while the gate is red. The change is listed only under Fixed | CHANGELOG.md:252; missing from Breaking and Upgrading (step 10 covers only fork CI) | Move it to Breaking and add an Upgrading step telling such CI to run `--approve --only-deterministic` first. Consider downgrading `full` to `deterministic` under CI instead of to nothing. Fix the note's `next:` |
| M5 (U5) | major | A trailing `yg-suppress` marker now waives its own line instead of the next one. 6.0.0 documented the old behaviour. These repos go red at the first re-fill, and step 20 makes that re-fill mandatory. Listed only under Fixed | CHANGELOG.md:230 | Add a Breaking bullet and an Upgrading step: run `yg suppressions` and move each trailing marker onto its own line above the code |
| M6 (U7) | major | The one-line `next:` and `next.cost` label `yg check --approve` as `(1 script pair · free)` while the same command also bills 2 reviewer pairs (`--dry-run`: `1 script (free) · 2 reviewer calls`). The agent protocol requires consent before a paid run, and this label removes the cue to ask | CHANGELOG.md:39 (the Next contract); `yg check` text and JSON `next` | If the first block is script-only, emit `--approve --only-deterministic`. Otherwise, state the cost of the whole command. Document that `next.cost` is the cost of running `next.command` |
| M7 (C6) | major (must be fixed before the contract freezes) | `yg-error/1` `next.command` is a string (`"yg find \"nope\""`) while `yg-check/1` uses an argv array. `next.text` still starts with `Run:` although CHANGELOG line 43 says it no longer does. Usage errors emit `"why": ""`. `yg impact` still uses the old "Node not found" wording. `yg-error/1` is a new family contract, so fixing this after release takes a `/2` bump | `output.ts:240,272`; `docs/cli-reference.md:269-287`; `family-contracts.md:24` | Make `next.command` `string[]\|null`. Strip `Run:` in the shared message layer. Omit an empty `why`. Route impact's node-not-found through the shared diagnostic. Horde reads only `next.text` (`node.mjs:341`), so nothing breaks today |
| M8 (family F3) | major | The Grain seam's check for load failures scrapes codes indented under the old text layout (`/^ {2}([a-z][a-z-]+)/gm`). Under 6.1 it sees `at, why, fix` and reports `fatal: []` even when the output contains `error[aspect-reviewer-missing]`. The family's only cross-repo gate therefore passes a refused proposal. Only the node-count check still guards it | Grain `plugins/grain/tests/seams.test.mjs:136-147` | Run `yg check --json` in seam 1a and assert on `issues[].code` and `project.nodes` |
| M9 (upgrade-real F1; U8 and family F2 rated it minor) | major | Upgrading step 6 says "each package's next `yg pack update` records [tag and commit]". For a package already at its newest version it records nothing ("already at 0.1.0", record unchanged). Only the undocumented `--reinstall` writes them, and it then prints a false "Rules whose content changed need judging again". Until the author publishes a newer version, `pack verify` can only compare files, so it cannot detect a moved tag | CHANGELOG Upgrading step 6; `pack-update.ts:346-373` | Make a plain `update` at the same version back-fill `requested`, `tag` and `commit` when the record lacks them, or reword step 6 to say `--reinstall`. Have `pack list` and `pack verify` name that command. Drop the "content changed" line when no file changed |

## 3. Upgrade-path walk (6.0.0 → 6.1.0, following "Upgrading from 6.0.0" literally)

Test projects:
- **upgrade-real:** a TS app with 8 components, `.github` as a component, tsconfig `paths`, script rules with drills and helper modules, prose rules, `auto_approve: full`, an openai-compatible tier, an external-judge verdict and two packages. Also the v6.0.0 `examples/` directory.
- **upgrade-docs:** smaller scratch projects that isolate single behaviours.

| step | result | notes |
|---|---|---|
| 1 `yg init --upgrade` | Worked | Lists every line it adds, including an unmentioned `.gitattributes` line. Prints "Agent rules already up to date" because the manual comes from `yg prime` in the binary, so the step's stated reason ("the manual no longer teaches `yg verdict`") is moot (U12). Prints "nothing changed" and then "review them with git diff" (first-hour F12). |
| 2 `yg verdict *` removed | Worked | Exits 1 with what/why/next, and emits `yg-error/1` under `--json`. |
| 3 move drill cases | Worked, once you know which case to move | The case reports `MISS` with no hint. This is documented word for word in Breaking line 58, so it is refuted as a defect (see §8). |
| 4 `OPENAI_COMPATIBLE_API_KEY` | Worked | The 401 warning names the variable. |
| 5 | Worked | |
| 6 packages | **Failed as written** | (a) A plain `pack update` does not record the tag and commit (M9). (b) One untagged package freezes update-all, and verify's advice fails (M1). (c) The Horde `promises` version is reused (B1). (d) The step's closing sentence is the only Upgrading warning that prose rules whose directory holds extra files get re-opened and re-billed. A repo without packages skips the step, and the wording ("a helper module or a data file") is narrower than the rule itself (U6). |
| 7 script/output strings | Misleading | The example gives the wrong target strings (`1 pair  1 node`, `1 aspect · 1 flow`). Breaking says those are gone, and the real line is `2 nodes · 2/6 files covered · 1 pair verified (script)`. Duplicates step 21 (U10). |
| 8 run `yg check` (`.github` loads) | Worked, red for a false reason | `.github` loads as documented. All 8 script verdicts show as stale with the cause "a source edit, an aspect edit, or a changed reference", and none of those happened (upgrade-real F5, first-hour F8). Under `auto_approve: full` this bare check fills; 6.0.0 did the same. |
| 9 | Worked; examples go FAIL | Every `examples/` script verdict goes stale (checkout-flow 3/3, no-secrets-in-logs 2/2, pure-transforms 1/1, type-level 6/6), and the run shows FAIL until step 20. |
| 10 fork CI `--no-approve` | Red on any repo with a script rule | The linked `docs/the-lock.md:105` documents this and gives a recipe that works, but the step itself does not say the job will be red (U9, first-hour F3). |
| 12 plain prose verdict survives | Worked | |
| 14-19 relations | Worked | The tsconfig-alias edges surfaced, and `fix:` gave the stanza. A polyglot repo is told to run `yg check` six or more times, before the free fill in step 20 (U12). |
| 20 `--approve --only-deterministic` | Worked | Restored every script verdict for free: app 8/8 plus a new `.github` pair, examples 12/12. |
| 21 same family release | Worked, but under-signposted | This clause is the only warning that Horde 6.0.0 cannot drive Yggdrasil 6.1 (U3). |

**Final state:** both projects green. Prose verdicts held: app 4/4, examples 2/2, external judge included. The upgrade needed three pieces of guesswork: the drill move, the undocumented `pack update --reinstall`, and the untagged package, which has no way out.

**Traps the Upgrading list does not cover:**
- `auto_approve: full` under CI (M4).
- Trailing `yg-suppress` markers (M5).
- An unknown config key, including in local `yg-secrets.yaml` (M2).
- A team running mixed versions (M3).
- Prose rules whose directory holds `NOTES.md` or a README get a paid re-review. Breaking documents this, but the Upgrading list only mentions it inside the packages step (U6, upgrade-real F4).
- `mapping-path-case-mismatch` is a new blocking error listed only under Added.
- The 120 s limit on a deterministic check is listed under Fixed.
- `--approve --no-approve` and `--top 0` are now refused, listed under Changed (U11).
- Horde 6.0.0 incompatibility is missing from Breaking (U3).

## 4. Adopter-clarity scorecard vs the original findings

| id | original issue (short) | status | evidence |
|---|---|---|---|
| M1 | prime taught the removed `yg verdict record` | Fixed | prime has no `verdict record`; `yg verdict` exits 1 with a pointer; the knowledge index no longer lists it |
| M2 | keyless `--approve` path | Fixed | keyless `--approve --only-deterministic` fills and leaves the judgment pair alone; `--dry-run` exits 0; only a full `--approve` gives ABORTED with `next: yg init --provider <name>` |
| M3 | CI recipe ran a bare check | Fixed | README:171-175 and getting-started:361-365 use `--no-approve`; a bare check under CI prints "auto-approve: full ignored" (this created M4) |
| M4 | which commands run repository code | Fixed | `writing-deterministic-aspects` lists them |
| M5 | relations and type/`when` on brownfield | Partial | relations documented (getting-started:284-321); the type/`when` requirement for aspect-less nodes is not in the brownfield section or prime (first-hour F4) |
| M6 | wrong first move on a fresh repo | Partial | plumbing files are excluded and prime:199 has a Brownfield bullet; the first `next:` is still `yg type-suggest --file README.md` (F9) |
| M7 | reviewer-unavailable reason hidden | Partial | the CLI-availability reason now surfaces; API/HTTP status not re-tested |
| M8 | reviewer-failure loop | Partial | the JSON cause `reviewer-unreachable` and the reason in `what` are right, but `next:` and `suggestedNext` now say `edit .yggdrasil/yg-config.yaml` (first-hour F2, C3) |
| M9 | — | Not re-tested | |
| m1, m2, m3 | advisory PASS; `type-undefined-pending`; Core defines pair and lock | Fixed | |
| m4 | causes of unverified pairs | Mostly fixed, new mislabel | causes are split, but pairs re-opened by the upgrade show as "inputs changed" (F8) |
| m5-m10 | log-cycle-open, flag echo, approve/no-approve refused, init warns the CLI cannot run, comments kept | Fixed | |
| m18 | prime size | Partial | 501 lines, 9,271 words, 58,858 B (was 619 lines); still about 15k tokens a session (C10) |
| m26 | — | Fixed | |
| m29 | Breaking and Upgrading sections; honest "nothing changed" | Fixed | both sections exist; `init --upgrade` says "nothing changed" only when true, though it then prints a git-diff line |
| m30 | CHANGELOG wording | Fixed in the flagged text | but about a dozen entries written mid-release are now stale and contradict Breaking (U10) |
| earlier package-system M1 | helper modules of `check.mjs` not hashed | Fixed, overshoots | every file in any rule's directory is now hashed, including prose rules whose extra files never reach the prompt. This is documented, and it re-bills (F4, U6) |

Nothing regressed outright against the original list. The only move backwards is M8: a loop turned into a step pointed at the wrong file.

## 5. Family integration status

- **Horde release/6.1.0 against the candidate:** 1411 pass, 0 fail, 1 skipped. Its version floor works on both CLIs:
  - on 6.0.0, `drill` and `--health` fall back to text;
  - on 6.1, they read `yg-drill/1` and `yg-aspects-health/1`;
  - on 6.1, a missing node reads `absent` through `yg-error/1`.
  - The promises rules drill identically on both (evidence-is-live 17, has-evidence 11, product-language 11).
- **Grain:** `npm test` gives 2873 pass, 0 fail, 22 skipped. `seams.test.mjs` against the candidate passes 7/7, but seam 1a's load-failure guard no longer checks anything (M8).
- **Register:** agrees in both directions. Horde reads 17 schema ids and Grain writes 10, all registered. `.family-candidates.grain.json` matches its row. `yg adopt` copies it along with the proposal's `.yggdrasil/` (adopt-transaction.ts:302).
- **Relations:** Grain's vendored `engine/vendor/relations` is byte-identical to the candidate once the generated headers are ignored. On a 20-file polyglot repo Grain proposed 4 edges and `yg adopt` + `yg check` passed. Removing any one edge made the candidate report `relation-undeclared-dependency` for that node. The candidate accepts `grain-advice/1` through `yg advise import`.
- **Jarl:** it mentions yg only in its blurb and calls no yg command, so there is nothing to break.
- **Broken or at risk:**
  - The promises version is reused (B1).
  - The Grain seam guard checks nothing (M8).
  - Grain `propose` reads the text footer of `yg drill`, not `yg-drill/1`, and the register does not record that dependency. It works today, but if the footer changes, every rule silently stays at draft (family F4, minor).
  - Horde 6.0.0 running on Yggdrasil 6.1 scrapes `--details` text and hands out the removed `yg verdict`. It still refuses on a red graph, so the gate result is right but the diagnostics are worse. Breaking has no note on this (U3, minor).
  - `suggestedNext` changed meaning under `yg-check/1` without a new number, against `family-contracts.md:66-70`. No family consumer reads the field (U2, minor).
- `yg --version` on the candidate prints 6.0.0 and `init` writes `version: "6.0.0"` because package.json has not been bumped yet. Grain's `SCHEMA_VERSION` `'6.0.0'` matches `CLI_SUPPORTED_SCHEMA`.

## 6. Minors

**Upgrade and CHANGELOG**
- U6 / upgrade-real F4: the re-hash of prose rules with extra files is documented only in Breaking and inside step 6. After that, every edit to a `NOTES.md` the reviewer never sees re-bills that rule's pairs. Give it its own step with a `--dry-run` cost preview, and consider hashing only what enters the prompt for `content.md` rules.
- U10 / first-hour F12: stale entries contradict Breaking and the code:
  - Added 94 and 87: `3 reviewer calls made in 32s`.
  - Changed 125 and 118: advise `Next:` / "Requires the user's approval.".
  - Changed 136: "text is unchanged".
  - Changed 138: `Partial result:` (the code emits `partial:`).
  - Changed 144: `Error:` prefix.
  - Changed 143 and Fixed 216: "all expected pairs hold valid verdicts", which no longer exists in the source.
  - Fixed 211: says `OPENAI_API_KEY` is shared, while docs/configuration.md:209 says it is never read.
  - Breaking 38: describes a JSON `label` history that was never released.
  - README:211 and how-it-works:84 say "four lines"; `init` writes five.
- U11: Breaking and Removed are incomplete. New relation sources for Rust, Go, Python, Ruby, Java, Kotlin, C/C++ and PHP sit under Changed and Fixed. `mapping-path-case-mismatch` (a blocking error, `mapping.ts:500`) sits under Added. Removed lists only `port-default-reserved`. There are five merge-resolve entries. Repo-internal entries at lines 109 and 274.
- U12: the Upgrading steps are out of order (paid `--approve` before the free fill and before the tier decision in step 12). Step 1's reason is inaccurate.
- U9 / first-hour F3: step 10 should say in one sentence that the fork job will be red for any script rule, and point at the recipe in the-lock.md.
- U3: add a Breaking note that Horde 6.0.0 cannot drive Yggdrasil 6.1.
- U2: `suggestedNext` changed meaning without a schema number. Record an exception in family-contracts.md or keep the field byte-compatible.

**Diagnostics and `next:`**
- upgrade-real F5 / first-hour F8: script verdicts re-opened by the upgrade blame "a source edit, an aspect edit, or a changed reference", and the fix suggests the full `--approve` instead of `--only-deterministic`.
- upgrade-real F6 (narrowed) / first-hour F2 / C3: after a reviewer failure, stdout says "Fix the cause above" while the cause went only to stderr. The stdout `next:` is `edit .yggdrasil/yg-config.yaml`, taken from a debug hint. A run read as 2>&1 shows up to three `next:` lines, and no `fill  done` line when the reviewer is unreachable.
- first-hour F5: the fill's stderr `next:` and the report's stdout `next:` conflict. The keyless dry run prints pair lines after `next:` and recommends a command that aborts. Both break Breaking's "always the last lines".
- first-hour F6 / C2: the `next:` for config-reviewer-missing drops "ask the user first" and `[--model <m>]`. `next.command` is null, so it cannot run blindly.
- C1: `next:` cuts three-word commands down (`yg aspects log`, exit 1 with usage). Cause: `leadingCommand`'s `words < 2` (check-render-views.ts:109-128). Seen only on a warning in a PASS run.
- C4: "N errors need a code or graph fix" and `remaining.needsFix` count pairs waiting for a reviewer (31 when none needs code).
- first-hour F7 / C5: grouped headings print a literal `'<node>'` (relation-undeclared-dependency, log-cycle-open, type-without-when-with-mapping). Identical fixes repeat per member, and YAML dumps are embedded in `at:`.
- first-hour F9: on a fresh repo the first `next:` is still `yg type-suggest --file README.md`.
- first-hour F10: `config-committed-api-key` fires on an uncommitted edit and says the key is already in history.
- first-hour F11: a symlinked aspect directory reports `aspect-undefined` ("create the directory"). This predates 6.1.
- first-hour F1 / C7: `yg context` refuses on repo-wide errors: committed key, symlinked rule, and config-reviewer-missing in keyless mode (the last predates 6.1). The refusal nests why and next inside next. A YAML typo in the config is labelled `error[internal]`.
- first-hour F4: the brownfield fast path does not warn that aspect-less nodes need a type whose `when:` covers all their files. The in-tool warning `type-undefined-pending` does warn.

**JSON, output and cost**
- C8: `notes` are missing from `yg-check/1`. The dry-run document says `exit.code: 1` while the process exits 0.
- C9: "1 draft pair skipped" counts draft rules, not pairs; the real fan-out was 30.
- C10: `yg-check/1` is about 16-36x the size of the text report (27 KB vs 1.7 KB; 94-119 KB with pending pairs), while steps 7 and 21 tell scripts to switch to it. prime is about 15k tokens.
- C11: `--details` help says "ungrouped"; `--color` / `--no-color` are refused; `log add --json` suggests `--reason`; the unmapped fix keeps a `<path>` placeholder; the log-entry-missing fix says "Then re-run yg check --approve" on a plain check; zero-count fill lines are printed.

**Family and process**
- family F4: Grain `propose` depends on the `yg drill` text footer, and the register does not list it.
- The candidate reports `--version` 6.0.0 while `yg verdict` says "removed in 6.1.0". Bump it at release. Until then a tester cannot tell which build is running.

## 7. What is solid

- **Gate correctness:** no run found a wrong exit code from Yggdrasil's own gate, across clean, warning, unmapped, log-gate, ABORTED, refused, broken-YAML, pending, unreachable-reviewer, stale and draft states, in text, `--json`, `--summary`, `--top`, `--aspect`, `--details`, dry-run and TTY/pipe.
- **Upgrade outcome:**
  - Both real projects returned to green.
  - Script verdicts that went stale were restored for free in one step.
  - No plain prose verdict was re-opened, including the external-judge verdict.
  - `pack verify` catches content drift even without a recorded commit.
- **New output grammar (mostly delivered):**
  - verdict lines;
  - `error[label]` blocks with at/why/fix;
  - the 12-row cap in every sink;
  - `--summary` rollups;
  - the ABORTED document;
  - `error[code]:` on stderr with `yg-error/1` on stdout;
  - grouped `--help`.

  The refused and ABORTED paths match spec mock-ups A and C closely.
- **Clean removals and migrations:**
  - `yg verdict` refuses with what/why/next.
  - The `OPENAI_COMPATIBLE_API_KEY` split is consistent across Breaking, step 4 and configuration.md, and the 401 warning names the variable.
  - `init --upgrade` lists every line it writes.
- **Keyless and CI safety:**
  - Keyless free fill works.
  - The CI docs use `--no-approve`.
  - `auto_approve: deterministic` fills under CI, as documented.
- **Relations:** detected across languages including tsconfig aliases and `.vue` script blocks. Grain and Yggdrasil agree byte for byte.
- **Family:** suites green, register consistent both ways, and Horde's fallbacks for 6.0.x keep working.
- **First-hour fixes:** M1-M4 and nearly all minors landed.

## 8. Refuted

- **upgrade-real F7:** drill cases MISS silently. Breaking line 58 documents this word for word, step 3 says to move them, and running 6.0.0 `drill` gives a baseline to compare against.
- **upgrade-real F8:** "step 1 and step 6 describe changes a 6.0.0 project will not see; `aspect-packages-dir-reserved` contradicts its own advice". Step 1 does list every line it adds, and the `next:` goes on to give the move advice.
- **upgrade-real F4 as an undocumented regression:** the NOTES.md re-hash is deliberate and documented (Breaking line 63, step 6). Step 20's "LLM verdicts are not affected" refers to the grammar re-judge. Kept only as a design cost (minor).
- **upgrade-real F6, the auto_approve part:** a bare check spending money under `auto_approve: full` matches 6.0.0 and is opt-in. Only the "cause named above" defect survives.
- **U1, script-pair ping-pong:** the deterministic cache is local and gitignored, so script pairs do not flip back and forth through the committed lock. Only prose rules whose directory holds extra files do.
- **U3, "Horde waves the gate through":** Horde 6.0.0 `land.mjs:593-619` treats a red graph as a red gate. The effect is weaker diagnostics, not a wrong result. Raising Horde 6.1's Yggdrasil floor to 6.1.0 is unfounded because it keeps its 6.0.x fallbacks.
- **U13:** `npx @chrisdudek/yg@6.0.0` from `$TMPDIR` starting a different CLI could not be reproduced there. The family verifier saw the same npx call resolve to the dev build's global symlink. So the key 6.0.0 comparisons were re-checked against dedicated npm installs (`$TMPDIR/verify-upgrade-docs-v600`, `$TMPDIR/verify-family-y6`, and 6.0.0 `dist/bin.js`). Comparisons made through npx inside the container, such as the one in C7, should be read with that caveat.
- **first-hour F13:** `auto_approve: deterministic` under CI is deliberate and documented (CHANGELOG:252, configuration.md:517), and it is not silent: it prints `fill … · auto-filled`.
- **first-hour F9, directory sub-claim:** `type-suggest --file <dir>` matched its path predicate in the verifier's setup.
- **C11(b):** `-q` on a plain read is documented to change nothing (cli-reference.md:621).
- **family harness note:** `yg-suppressions/1` looked unread only because the session's `grep` was a shell function that dropped matches. It is read at `land.mjs:1281`.
