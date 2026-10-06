# Yggdrasil 6.1.0: package system review

## 1. Verdict

The copy-and-adapt core of the package system holds up. Installs are staged and atomic, symlinks, binaries and path escapes in marketplaces are refused, git is called with argv only, and the drift rail catches edited or unknown files. Adapt carry-over and config-change invalidation work, and none of the package's code runs at `add` time. That holds for one package, from one source, installed and run from the repo root. Beyond that path the system has real defects.

- **Data loss.** The `package:` field in `yg-packages.yaml` is never validated, so `yg pack remove` can delete the whole repository, `.git` included, and report success.
- **Wrong gate results.** The verdict hash leaves out every module that `check.mjs` imports, so an update that changes only a helper keeps a stale PASS. Changing a rule's status through its adapt file makes the CLI write a `log.md` into the package copy, and its own rail then fails the check.
- **The version model is not implemented.** The docs, the knowledge topic and the advise output describe tag-based publication. The code installs default-branch HEAD, or an uncommitted local working tree, records only the version the manifest claims, and can downgrade while printing "Updated".
- **Several commands mislead.** From a subdirectory, the pack commands report "nothing installed" or install into the wrong tree. A multi-package update applies part of its work and then says nothing changed. The fix hints for a drifted copy loop back to a command that refuses that state.

Git history shows the package code has not changed since v6.0.0, so every finding below already affects the shipped 6.0.0. Treat 6.1.0 as the release that fixes these, not the one that introduces them.

## 2. Cross-cutting themes

- **The lock is trusted input but is neither validated nor anchored.** `yg-packages.yaml` drives recursive deletes (B1), fetch targets (m4) and identity (m4), yet it records no commit or tag (M5) and keeps sources verbatim and machine-local (m6). It detects accidental edits, not provenance. See B1, M5, m4, m6, m8.
- **Verdict inputs are narrower than rule behaviour.** Only the `check.mjs` and `content.md` bytes feed the rule hash. Helper modules (M1), config renames (m3) and authority changes such as status or implies (m5) all change what a rule does without the consumer being told. See M1, m3, m5.
- **The CLI and its own rail disagree about who may write inside the copy.** The CLI writes `log.md` into the copy (M2), error messages tell the user to edit copy files (m12, m3), and the repair hint points at a command that refuses drift (M6). The package copy needs a clear consumer-owned side channel, like `yg-aspect.adapt.yaml`. See M2, M6, m3, m12.
- **Multi-step operations are not transactional.** Multi-package updates apply partially (M4). The per-package swap is not atomic when the rename fails (m10). Concurrent writers lose lock records (m8). Refusals and even successful installs leak clones (m7). See M4, m7, m8, m10.
- **Docs and knowledge promise a model the code does not have.** Same-name packages side by side (m1), "pin" (M5), updates that "compare against tags" (M5), "all or nothing" updates (m2), drills you can "watch pass" (M8), and "what runs is what its author published" (m4). See m1, m2, m4, M5, M8.
- **The test suite covers only the happy path.** Every e2e lifecycle case runs at the root with one `--as acme/law` local fixture (m16). Each major below falls into an untested scenario.

## 3. Findings

| id | severity | title | where | suggested fix |
|---|---|---|---|---|
| B1 | blocker | An unvalidated `package:` install id in the lock lets `yg pack remove` (or `update`) delete outside `aspects/packages`, including the project root and `.git` | io/package-manifest-parser.ts:551; io/package-store.ts:35, 303-305, 367-370; cli/pack.ts:965 | Require exactly three `isSingleSegment` parts, with the last equal to the entry key. Assert path containment before any `rm`. Report a malformed lock in `yg check`. |
| M1 | major | Modules imported by `check.mjs` are not verdict inputs, so a helper-only update keeps a stale cached PASS | core/pair-inputs.ts:45-47; core/pair-hash.ts:135; ast/loader-hook-impl.ts; structure/hook-loader.ts:216 | Hash every non-drill, non-adapt file in the aspect directory (for packages, the locked file hashes). Otherwise refuse relative imports. |
| M2 | major | A status change in the adapt file makes the CLI write `log.md` into the package copy, and the drift rail then fails `yg check` | core/log/aspect-log.ts:54-56; core/log/aspect-status.ts:172-181; core/fill.ts:395-410; core/checks/packages.ts:84-92 | Put package-rule logs and consumer drills beside the adapt file under an exempt name that installs preserve, or refuse the write. Fix the fill.ts comment. |
| M3 | major | Pack subcommands use `process.cwd()` as the project root: from a subdirectory `list` says nothing is installed and `add` writes a stray `.yggdrasil/` | cli/pack.ts:601, 725, 847, 937; cli/prime.ts:22-39 | Use `path.dirname(graph.rootPath)` in every subcommand and in prime. |
| M4 | major | A multi-package `update` applies partially on a non-drift failure, then prints "Nothing was installed or changed" with exit 1 | cli/pack.ts:789-838, 231-235 | Fetch, validate and stage everything first, then swap. Otherwise print a truthful per-package summary and always print the approve hint. |
| M5 | major | Version model: installs without a version take HEAD or the working tree, a pin is not sticky, update can downgrade, tag and manifest mismatches are recorded under the manifest's number, the marketplace-entry version is ignored, and no commit is recorded | cli/pack.ts:197-209, 264-296, 798-806; model/packages.ts:63-82; knowledge packages-and-marketplaces.ts:179; core/advise-package-nominations.ts:92; docs/packages.md:32-36, 177, 301-308 | Resolve "latest" to the highest `pack/<name>@*` tag. Record the requested ref, the resolved tag and the commit SHA. Refuse downgrades without a flag. Refuse tag, manifest or marketplace mismatches. Advise should point at `--to <v>`. |
| M6 | major | No command repairs an edited or missing copy, and both hints point at `yg pack update`, which refuses that exact state | core/checks/packages.ts:167; cli/pack.ts:622-634, 762-779, 803-806 | Add `yg pack update <name> --reinstall` (re-fetch the recorded version and keep the adapts) and point the hints at it. |
| M7 | major | `update` has no attachment guard, so a renamed or dropped rule leaves dangling references and its adapt is deleted silently; `remove`'s guard misses `implies:` and ports | cli/pack.ts:308-324, 789-830; io/package-store.ts:304, 385-403; docs/packages.md:235-238 | Before replacing, diff the old and new rule sets against every reference (nodes, types, flows, ports, implies) and refuse. Warn about orphaned adapts. Mention adapt deletion in remove. |
| M8 | major | `yg drill` cannot run the scaffolded rule or any rule that reads `ctx.config` or `ctx.subject`, and the failure is misreported as a check error ("unrun", exit 2) | ast/runner.ts ~186-205; cli/pack.ts:385-409; docs/packages.md:373-377 | Pass the package defaults or the adapt config as `ctx.config` and derive `ctx.subject` from the case files. At minimum, trap `ctx.config` as unsupported and fix the docs. |
| m1 | minor | The docs promise that the same package name from two repositories installs side by side, but the lock is keyed by bare name and the second install is refused | model/packages.ts:10-12, 93-97; cli/pack.ts:622; docs/packages.md:55-57; knowledge packages-and-marketplaces.ts:40-42 | Re-key by `<owner>/<repo>/<name>` and accept an unambiguous bare name, or correct the docs and comments. |
| m2 | minor | docs/packages.md contradicts itself on update atomicity: lines 80-86 match the code, 192-195 are stale | docs/packages.md:80-86 vs 192-195 | Delete 192-195. If M4 is not fixed, document the real behaviour for non-drift failures instead. |
| m3 | minor | An upstream config-key rename exits 0 as "Updated", then the untouched stub breaks the rule at load, and the cascading `aspect-undefined` fix says to create files inside the copy | io/package-store.ts:175-186; cli/pack.ts:811-838; aspect-undefined message | Diff the old and new config schemas on update and warn. Leave the stub's keys commented. Suppress the cascade for package rules whose adapt failed. |
| m4 | minor | The lock attests to itself: redirecting `source:` swaps the code under a trusted identity, and the docs overclaim "what runs is what its author published" | cli/pack.ts:789-822; docs/packages.md:53-57, 396-406 | Re-derive and compare the identity on update, record the commit SHA, add `yg pack verify`, and reword the docs. |
| m5 | minor | Updates change a rule's authority without saying so (draft→enforced, new implied rules whose code runs on the next `--approve`) and print no change summary; config is pinned but status is not | io/package-store.ts:149-189; cli/pack.ts:824-838 | Print a summary of added or removed rules, status, implies, scope and code changes. Consider pinning `status:` in the stub. |
| m6 | minor | The install source is stored verbatim: relative or absolute local paths do not resolve for teammates or CI, and a missing local path is reported as a network error | cli/pack.ts:204, 231-235, 660, 818; core/advise-package-nominations.ts:88 | Store the origin URL for a checkout, give local paths their own message, and strip userinfo before storing. |
| m7 | minor | `pack-fetch-*.tmp` full clones leak into `.yggdrasil/` on every refusal and on every successful remote or pinned `add` | cli/pack.ts:74-78, 638-686; exit-after-flush.ts:60 | Throw a typed refusal and exit after `finally` runs, or sweep stale fetch directories on start. |
| m8 | minor | Concurrent pack commands lose lock records while both report success | cli/pack.ts:621; io/package-store.ts:293-300 | Hold an exclusive lock for the read-modify-write, or re-read, merge and compare-and-swap. |
| m9 | minor | Install copies files through a UTF-8 round trip, so non-UTF-8 text is silently rewritten and the hash covers the altered copy | io/package-store.ts:246-271 | Copy bytes verbatim and hash them, or refuse invalid UTF-8 explicitly. |
| m10 | minor | The per-package swap removes the old copy before the rename, and on rename failure the lock is restored to a version whose files are gone | io/package-store.ts:300-311 | Rename the old directory aside and restore it on failure. |
| m11 | minor | A local aspect under `aspects/packages/` is silently not loaded: the error says "undefined" plus "no installed package put it there", and the reservation has no CHANGELOG note | core/graph-loader.ts:369-375, 404-447 | Add a dedicated "packages/ is reserved" diagnostic and an upgrade note. |
| m12 | minor | The adapt stub offers `references:` on deterministic rules, and the refusal's fixes all require editing the copy | io/package-store.ts:149-173; io/aspect-parser.ts:485 | Render the stub per rule kind and have package-aware messages name the adapt file. |
| m13 | minor | The scaffold writes `requires.yg: ">=6.0.0"` although its comment says "pinned to the running MAJOR", so it accepts 7.x | cli/pack.ts:339-351 | Scaffold `^<major>.0.0`. |
| m14 | minor | Contract register and reference gaps: `yg-package-versions/1` shows Since "before 6.0.0" (it is 6.0.0), configuration.md never mentions `yg-packages.yaml`, and "lock" means two things | docs/family-contracts.md:29; docs/configuration.md ~405-425; docs/the-lock.md | Fix Since, document the committed record, and use one consistent term ("package record"). |
| m15 | minor | `list` and `update` run one `ls-remote` and one clone per package, with no grouping by source and no `GIT_TERMINAL_PROMPT=0` | cli/pack.ts:789-798, 893-895; utils/git-pack-fetch.ts:98-121 | Group by source and set a non-interactive git environment. |
| m16 | minor | Package tests cover only one source at the root; the scenarios behind M3, M4, M5, m1 and m3 are untested | tests/e2e/cli-pack-lifecycle.test.ts; tests/unit/cli/pack.test.ts | Add e2e cases with a scratch bare repo holding real tags on two branches, nested cwd, two identities and mid-loop failures. |

## 4. Blocker and major details

### B1: `package:` in the lock is unvalidated and drives `rm -rf` (F1, SEC-2)

- **Evidence.** package-manifest-parser.ts:551 reads `const installId = (entry.package as string).trim();`. I confirmed this in the repo. The only escape check runs per `files:` key (`!posix.startsWith(installPrefix) || escapesRoot(posix)`), so `files: {}` bypasses it completely. installDirRelative (package-store.ts:35) joins strings, and removePackageFiles (:367-370) removes the result recursively.
- **Repro.** Two angles reproduced this independently. With the entry `helper: {package: "../../..", files: {}}`, `yg pack list` showed `at .yggdrasil/aspects/packages/../../../`, and `yg pack remove helper` printed `Removed 'helper' — its rules and its record are gone.` with exit 0. Afterwards the project held only a recreated `.yggdrasil`; `src/` and `.git` were gone. With `package: "../../../victim"`, `yg check` passed and did not flag the entry, and `remove` deleted a sibling directory.
- **Impact.** Irreversible data loss, `.git` included, from a routine command that reports success. The trigger is one line in a committed file that reviewers tend to treat as generated noise. `update` reaches the same `rm(finalAbs, {recursive:true})` at package-store.ts:304.
- **Fix.** Validate the id as `owner/repo/name` with three `isSingleSegment` parts, the last equal to the entry key. Add a containment assertion (`resolve(target).startsWith(resolve(packagesRoot)+sep)`) in both remove and install. Surface a malformed lock in `yg check`. Add regression tests for `../..`, absolute and empty values.
- **Verifier note.** The trust angle downgraded this to major because anyone who can land a lock change can already swap the rule code (m4). I keep it at blocker. The consequence is repository deletion rather than a wrong verdict, so it is not bounded by that existing access. It can also come from a botched hand merge. The fix is a few lines.

### M1: helper modules are not part of the verdict hash (PKG-LC-1, F2, SEC-1)

- **Evidence.** `ruleHashFor(aspect, filename)` returns `hashBytes(Buffer.from(contentFor(aspect, filename), 'utf8'))` (pair-inputs.ts:45-47, confirmed). Only `companion.mjs` is folded in besides that. loader-hook-impl.ts intercepts only `@chrisdudek/yg/` and passes relative specifiers through.
- **Repro.** Three angles reproduced it: `check.mjs` imports `./lib.mjs`, and the new version changes only `lib.mjs`. `yg pack update` printed "Rules whose content changed need judging again". Plain `yg check` then printed `1 verified (1 deterministic, 0 LLM)`, and `--approve --only-deterministic` printed "Filling 0 unverified pairs"; a side-effect file showed the rule did not re-run. After touching the source file or moving the deterministic lock aside, the rule refused: `src/thing.ts:1: banned word yyyforbidden`.
- **Impact.** Local runs and warm caches, including the pre-commit hook, stay green on code the installed rule now refuses. This contradicts docs/packages.md:182-184. Local multi-file aspects have the same gap. No doc mentions or forbids relative imports.
- **Fix.** Fold every non-drill, non-adapt file under the aspect directory into the rule hash (for packages, reuse the per-file hashes the lock already holds). Otherwise refuse non-`@chrisdudek/yg/*` imports in `marketplace check` and `yg check`. Add a regression test where only a helper changes.
- **Verifier note.** Two angles rated this a blocker. I rated it major because `.yg-lock.deterministic.json` is gitignored (confirmed at lock-store.ts:225, "absent on" a fresh clone), so a clean CI clone recomputes and catches the refusal. The stale green lives only in local and warm caches. Open question: whether a helper imported by an LLM rule's `companion.mjs` can leave a stale entry in the committed LLM lock (see section 6).

### M2: CLI writes `log.md` into the package copy (F3, SEC-5)

- **Evidence.** aspectLogPath (aspect-log.ts:54-56) has no package guard, and packages.ts:84-89 exempts only `ADAPT_FILENAME`.
- **Repro.** Two angles reproduced it. Setting `status: advisory` in `yg-aspect.adapt.yaml` (the documented adaptation, docs/packages.md:106) and running `--approve --only-deterministic` printed "…now stands at advisory (was enforced) — written into its own log." `git status` then showed `?? …/example/log.md`, and the next `yg check` failed with `package-file-modified … sits among the installed packages, but no installed package put it there … Fix: Delete …/log.md`. `yg aspects log add` and `yg drill add` against a package id take the same path. The next update also deletes the log silently.
- **Impact.** The main documented adaptation turns the gate red with a tampering message about the CLI's own write. fill.ts:398-402 says no committed file is touched under `--only-deterministic`, which is false here, so CI can dirty the tree.
- **Fix.** Write a reserved, rail-exempt, install-preserved sibling of the adapt file, or refuse these writes on package ids with what/why/next guidance. Correct the fill.ts comment.

### M3: pack subcommands treat cwd as the project root (PKG-LC-7, PKG-M1)

- **Evidence.** `const projectRoot = process.cwd()` at pack.ts:601, 725, 847 and 937. By contrast, `pack new` uses findUpwards, the versions cache uses `graph.rootPath`, and checks/packages.ts:123 uses the graph root.
- **Repro.** Two angles reproduced it from `src/sub`. `yg pack list` printed "No packages installed." (rc 0). `yg pack remove` printed "'house-style' is not installed." (rc 1). `yg pack add … --as other/law2` printed success but created `src/sub/.yggdrasil/yg-packages.yaml` and a full copy. It skipped the "already installed" refusal because it read the empty lock, and the collision check ran against the real graph.
- **Impact.** The normal monorepo workflow gets false answers and a stray graph fragment that `git add -A` will commit. `yg prime` also drops its package notice under the same condition.
- **Fix.** Use `path.dirname(graph.rootPath)` everywhere. Add a nested-cwd e2e test.

### M4: partial update that claims no change (PKG-LC-6, PKG-M4, F7)

- **Evidence.** In the runUpdate loop (pack.ts:789-830), `failWith` calls `process.exit(1)` after earlier packages were already installed and locked. Only drift is checked up front (:751-779).
- **Repro.** Three angles reproduced it with an unreachable source or an unsatisfiable `requires.yg`: `Updated 'house-style' 0.1.0 → 0.2.0.` followed by `Error: Could not reach '…/zsrc'. … Nothing was installed or changed.` (exit 1). The lock then held the new version, and the approve hint and the versions-cache refresh were both skipped.
- **Impact.** The user and CI believe nothing happened while one package's code was replaced.
- **Fix.** Use two phases: fetch, validate and stage all packages, then swap. Otherwise print a truthful per-package outcome and always print the approve hint when anything changed. See also m2 and m10.

### M5: versions are not what the docs say (PKG-LC-4, PKG-LC-5, F6, F11, SEC-6, PKG-M2)

- **Evidence.** fetchSource (pack.ts:197-209) reads a local directory as it is on disk, or clones with no ref, when no version is given. pack.ts:803 compares only with `===`. The lock entry (model/packages.ts:63-82) has no ref, commit or pin field. The marketplace-entry `version:` is validated (parser :183-228, which says it is "what an update compares against") but pack never reads it.
- **Repros.**
  - Untagged HEAD 0.6.0 installed as `Installed 'house-style' 0.6.0`, with the `// unreleased WIP` bytes present.
  - Uncommitted local manifest edits installed as `0.1.0 → 0.2.0`.
  - A tag-pinned 0.2.0 on a release branch, followed by a bare update, printed `Updated 'house-style' 0.2.0 → 0.1.0.` (rc 0).
  - `--to 0.9.0` on a tag whose manifest says 0.3.0 recorded 0.3.0, and `list` kept printing "also publishes: 0.9.0".
  - A bare update un-pins a `@0.1.0` install.
- **Impact.** Two consumers on "0.2.0" can run different code. "Update" can go backwards or onto unreleased work. The knowledge topic (:179 "compares against those tags"), docs "Pin a version" (:32) and advise's `yg pack update <name>` hint (:92) all describe a model that does not exist, and the advise hint fetches HEAD, not the advertised tag.
- **Fix.** Resolve the latest version as the highest semver tag through the existing ls-remote. Record the requested constraint, resolved tag and commit SHA. Refuse downgrades without `--allow-downgrade`. Refuse when the tag, manifest and marketplace versions disagree. For local sources, refuse a dirty tree or read only committed content. Point advise and list at `--to`.
- **Verifier note.** Taking HEAD when no version is given is partly documented (docs :177 "whatever the source now publishes", and the ref-missing hint at pack.ts:217), which is why one angle rated it minor. The silent downgrade, the tag/manifest mismatch and the false knowledge sentence are undocumented, so major stands.

### M6: no repair path for a drifted copy (PKG-LC-2)

- **Evidence.** After an edit, `yg check` says "To take the change wholesale, run: yg pack update house-style". packages.ts:167 tells the user to "reinstall the package: yg pack update" for a missing file. `update` and `update --to <same>` both refuse any drift (pack.ts:762-779), and `add` refuses "already installed" (:622-634).
- **Impact.** When git cannot restore the copy (an uncommitted install, or a file deleted before the first commit), the only way out is detach, remove (losing the adapts), add again, re-adapt and re-attach. The hints send the user round in a loop.
- **Fix.** Add a `--reinstall` path that keeps the adapts, and point both hints at it.

### M7: `update` has no attachment guard, and `remove` misses implies (F5, PKG-LC-10)

- **Evidence.** runUpdate never calls attachmentsOf. readInstalledAdapts reads only the new manifest's rule directories, so the adapt of a renamed or dropped rule disappears when install removes `finalAbs`. attachmentsOf (pack.ts:308-324) scans nodes, node_types and flows only.
- **Repros.** A rename from example to rule2 gave `Updated … 0.6.0 → 0.7.0` (exit 0), then `aspect-undefined … Fix: Create the aspects/packages/…/example directory`, and the advisory adapt was gone. A local aspect `bundle` that `implies:` a package rule let `yg pack remove` succeed, followed by `implied-aspect-missing`. Every `yg-aspect.adapt.yaml` was deleted and the docs do not mention it.
- **Impact.** The dangling-name failure that remove says it prevents is reachable through update, and through remove itself. Consumer tuning is lost without a message.
- **Fix.** Diff the old and new rule sets against all reference kinds (including ports and transitive implies) and refuse. Warn about orphaned adapts. State in the output and the docs that removal deletes the adapts.

### M8: drills cannot run the scaffolded rule (PKG-LC-8)

- **Evidence.** ast/runner.ts builds the drill ctx as `{ files }` and traps only node, subject, graph, fs and parse*. `ctx.config` is undefined.
- **Repro.** The unmodified `yg pack new` scaffold gave `2 unrun … could not be evaluated over this case (source parse or runtime error)` with exit 2. A rule that iterates `ctx.subject` returned "unsupported".
- **Impact.** `marketplace check` requires drills (`package-drills-missing`), and docs :373-377 promise you can "watch them pass" after installing. For the scaffolded rule, and for any rule configured through `ctx.config` (which the docs call "the only way"), that is impossible anywhere. The config case is also misreported as a check bug.
- **Fix.** Pass package defaults or the adapt config as `ctx.config` and derive `ctx.subject` from the case files. Otherwise classify the failure as unsupported and correct the docs and knowledge topic.

## 5. What is solid

- Marketplace path traversal is refused with a lexical `escapesRoot` check. Symlinks inside a package are refused through lstat, as are binaries (NUL check) and undeclared top-level directories.
- Git calls use `execFile` with argv and `--`, so no argument injection was found. Identity segments derived from URLs are validated.
- The drift pre-check before any replacement is atomic across packages, and e2e test 11b pins that.
- `files:` entries in the lock are checked against the install prefix. The drift rail catches edited, missing and unknown files in the copy.
- Adapt carry-over across updates works, and a changed config value invalidates exactly the dependent pairs.
- `yg marketplace check` does not run package code, and nothing runs at `yg pack add` time. The danger box honestly says package code runs during fill, and a check.mjs that writes files and reads env did run as the docs state.
- The install-only `requires` check is a deliberate, documented choice (parser :460-463), so a package the user can no longer remove is never stranded.
- The advise nomination for newer tags works end to end, and its "also publishes" line is covered in e2e (:976, :1003). Its suggested command is wrong, as covered in M5.

## 6. Completeness critique

- **Real remotes were never exercised.** Every fetch used local paths or file-scheme URLs. Nobody tested https or ssh to GitHub or GitLab, private repos, credential helpers, what happens when a remote asks for credentials (the missing `GIT_TERMINAL_PROMPT=0` in m15), force-pushed or moved tags, or `ls-remote` against large tag sets. To close this, run the lifecycle against a throwaway GitHub repo and a private one through a credential helper.
- **LLM-side verdicts after a package update were not checked.** No angle checked whether a helper imported by `companion.mjs`, or a changed `references:` target inside the package, leaves the committed LLM lock stale. That would survive a fresh CI clone and would make M1 a blocker for LLM rules. To close this, re-run M1 with an LLM rule whose `companion.mjs` imports a helper, using a stub reviewer.
- **Windows was not tested.** Rename EPERM (m10), path separators in the lock and in `installId`, and CRLF in the UTF-8 round trip (m9) were read from the code only. To close this, run the e2e pack suite on a Windows CI runner.
- **Consumer identity assertion was not tested.** `--as` lets a consumer claim any `owner/repo` for any source. No angle tested whether that combines with m4 into spoofing `packages/<trusted-org>/…` at first install rather than at update. To close this, install from an arbitrary source with `--as <well-known org>` and check what the rail, list and advise display.
- **Lock merge conflicts in `yg-packages.yaml` were not tested.** Two branches each updating a different package, then a merge, and whether the rail and the parser handle the merged file. This is the realistic non-malicious route to B1 and m8.
- **The CI flow after an update was not tested.** No angle ran `auto_approve` against a fresh clone right after a package update to confirm that the gate turns red rather than silently filling. That flow is how M1's stale PASS gets caught.
- **The versions cache (`yg-package-versions/1`) was not tested** for staleness or wrong versions after M5-style mismatches.
- **The 5.x→6.x upgrade path was covered only in part** (m11, by code reading). No angle ran a real 5.x repo through the upgrade.
- **Process incidents during the audit.** The code-correctness angle ran `git config --global` inside the shared container and overwrote `user.name` and `user.email` for a short window. The values were restored, but commits made in that window may carry the author "t <t@t>", so check recent container commits. The same angle's verifier also executed another agent's scratch script (`s4.sh`) against `$TMPDIR/verify-lifecycle-market*`. The lifecycle angle's scratch state may have been disturbed, although its findings were reproduced independently.

## 7. Refuted findings

- **SEC-8 (the consent statement misplaces when package code runs).** Refuted. verify-lock.ts:11-13 shows that a plain `yg check` may run an LLM rule's `companion.mjs`, so "runs on every check" is conservative, not wrong. Nothing runs at `add`, so the late warning causes no harm.
- **PKG-M7 (part).** The claim that `requires.yg` should be re-checked at load is refuted: install-only is deliberate and documented (parser :460-463, docs :292-294). Only the scaffold comment/code mismatch remains (m13).
- **PKG-M6 (part).** The credential leak through the stored URL was not reproduced and the docs never suggest tokens in URLs. Only the non-portable local path remains (m6).
- **PKG-M11 (part).** The claim that "also publishes" is untested is refuted by cli-pack-lifecycle.test.ts:976 and :1003.
- **SEC-3(b).** Rewriting a copied file together with its hash is inherent to an unsigned lock, and docs :403-406 state that there are no signatures. Only the doc overclaim and the missing identity re-check remain (m4).
- **PKG-LC-5 and PKG-M2 (part).** Taking HEAD when no version is given is partly documented (docs :177, pack.ts:217 hint). The finding survives only as the undocumented downgrade, the tag/manifest mismatch, the false knowledge sentence and the missing commit record (M5).
- **Severity disputes settled here.** M1 is major rather than blocker because the deterministic lock is gitignored, confirmed at lock-store.ts:225. B1 is blocker rather than major because the consequence is deleting the repo, which is not bounded by existing PR access. m1 is minor rather than major because the refusal is explicit and safe, and the defect is a doc and model mismatch.
