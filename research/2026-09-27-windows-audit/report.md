# Windows compatibility audit (issue 481)

*Translated from Polish for Althing on 2026-10-06. Paths and references to private material were rewritten neutrally; the original is not public.*

Results of five agents from 2026-09-27: Grain, Jarl, Horde and Runes with fixes and windows-latest CI; Yggdrasil as an analysis (fixes in a separate step). The agents' texts are unedited.


## Runes

Branch `jarl/481-windows` in Runes, tip **7d3eedb**. I added 5 commits on `jarl/462-bootstrap`. Locally `npm run check` passes: 57/57 tests (49 old and 8 new) and "dist/ is fresh". Checked only on macOS. Nothing has run on a real Windows yet.

**Findings and fixes**
- **`tools/vendor.mjs` (`freshClone`, around l.205):** with `core.autocrlf=true` (the default in Git for Windows), the clone of a tag had CRLF. Then `check --ci` did not pass, and `update` would have written CRLF hashes into the pin. Now the clone runs with `-c core.autocrlf=false -c core.eol=lf`. Mutation test: without the fix the new test fails, with the fix it passes.
- **`tools/vendor.mjs`, the offline check (l.~160–185):** when the copy is checked out as CRLF, `check` still ends with an error, because the gate compares bytes. The message now says outright, however, that only the line endings differ, and gives the fix `text eol=lf` in `.gitattributes`. This applies to files, skill fragments and the tool itself.
- **`tools/vendor.mjs`, `rmSync` of the clone:** I added `maxRetries`, because on Windows `git` or an antivirus may still hold a file handle (EBUSY/EPERM).
- **`tools/vendor.mjs`, `changelogBetween`:** now splits on `/\r?\n/`.
- **Vendor tests:** 3 new:
  - a user with `autocrlf`;
  - a checkout with CRLF that an `eol=lf` entry cures;
  - Windows-style paths in the pin (`C:/`, `c:dist`, `dist\fs`, UNC) give a usage error.

  Instead of `/dev/null`, the tests use their own empty `gitconfig` file.
- **`src/testkit/guard/tokenize.mts` (string and template literals):** a `\` line continuation before CRLF ended the string too early, and the tokenizer read the rest of the line as code. This could hide or invent a guard finding. Fixed, and templates turn CRLF into LF. Mutation test: without the fix 21/22, with the fix 22/22.
- **`src/testkit/guard/run.mts:56-58`:** files are sorted by their path with forward slashes, so the order of findings is the same on every system. I added an internal function `relativePosix`, tested with `path.win32`. New tests cover sources with CRLF, `.cmd`/`.exe` commands and paths with a drive letter, state paths with backslashes, and an allow file with CRLF.
- **`scripts/check-dist.mjs:6`:** since the 2024 security fixes, Node rejects `execFileSync('npm.cmd')` without a shell with an EINVAL error. The rebuild now goes through `node $npm_execpath`, and outside npm through a shell.
- **`.gitattributes` (new file):** `* text=auto eol=lf`, and explicitly `dist/**`, `skills/**`, `tools/vendor.mjs` and `grammars/*.json`, with `*.wasm` as binary.
- **CI:** a new `test-windows` job on `windows-latest` with Node 22: build, `npm test`, `check:dist`. The Ubuntu job is unchanged.
- **README and CHANGELOG:** I added a section about Windows with a recommendation for consumers: `vendor/runes/** text eol=lf`, `scripts/runes.mjs text eol=lf`, and an `eol=lf` line for every file with a fragment.
- **Not a problem:** signals, `chmod`, symlinks, hooks, `HOME`/`tmpdir` and `sh -c` do not occur in Runes. `git` is invoked as an executable without a shell, which is correct.

**Windows CI:** not run, so there is no run id and no result. As the assignment said, I did not push `release/win-481`. The real test on Windows will start after Runes is pushed, that is, after 462 is merged.

**For a separate issue**
1. Run the `test-windows` job and make it green right after Runes' first push.
2. `update` inserts fragment content with LF into a target file with CRLF, so the file has mixed line endings. For now only the `eol=lf` recommendation guards against this. One could consider having `update` add to `.gitattributes` itself.
3. Grain, Jarl and Horde must add `eol=lf` entries to their `.gitattributes` when they first vendor, otherwise `check` will not pass on Windows.

Three evidence rows are recorded in issue 481.


## Jarl

JarlSkill now passes the tests on Windows: CI is green on Ubuntu and on windows-latest, on both Node versions (18 and 24).

**Branch:** `jarl/481-windows` in `~/.jarl-wt/JarlSkill-481`, last commit `b2f219a`. It is not merged yet. Commits:
- `6b209e7` code fixes, first part
- `96b5cf5` tests for Windows
- `11bf381` CI
- `0f10ae8` paths in Files and Repo, test fixes
- `b2f219a` MCP root test

**CI:** run 36314535402 succeeded, 162 tests pass on Windows. Two earlier runs (36313874267, 36314251184) were red, and they surfaced the bugs described below. I deleted the remote branch `release/win-481` after the green result. I did not finish the full test suite locally on macOS, because the machine was heavily loaded. Ubuntu in CI is green, and locally the `windows`, `mcp` and `words` tests pass.

**Findings and fixes:**
- **`jarl.mjs`, reads of loop files:** when the loop is committed, a checkout on Windows with `core.autocrlf` gives CRLF line endings and the parsers misread them. I added `readText()`, which turns CRLF into LF, and every loop read goes through it.
- **`jarl.mjs` `writeAtomic` and `cmdArchive`:** Windows rejects a rename when another process holds the file open (EPERM, EACCES, EBUSY). I added `renameRetry`, which retries the rename for 2 s, on win32 only.
- **`jarl.mjs` `withLock` (lock: pid, host, age):** on Windows a freshly released `.lock` is sometimes in a "delete pending" state, and creating it again gives EPERM. This is now treated as a held lock. The loop has a short sleep and a time limit, so it does not spin idle.
- **`jarl.mjs:234` `mainCheckoutWithLoop`:** git returns `C:/…`, while the path module writes `C:\…`. The comparison now goes through `canonical()`.
- **`jarl.mjs` `reportDirOf`:** for a directory on another drive, `relative()` returned an absolute path. It is now rejected.
- **`jarl.mjs` Files, Repo and the root hint:** paths given on Windows (`src\a.mjs`, `..\tool`) are written as `src/a.mjs` and `../tool` (new `portablePath`). Before, they never matched the git diff and broke when read on macOS.
- **`jarl.mjs` `ghBin`/`ciOf`:** a `JARL_GH` ending in `.js`, `.mjs` or `.cjs` is run through `process.execPath`. The `gh` stub in the tests no longer needs a shebang.
- **`jarl-mcp.mjs` (end of file), MCP server start:** the check whether the file is the entry point now compares real paths, case-insensitively on win32. With a different case of the drive letter, the server previously simply did not start.
- **Guard in `.mcp.json`:** works on Windows unchanged. I only fixed the test, which ran it with a POSIX shell line and now uses an argument array.
- **Tests:**
  - I replaced `bash -c` with the helper `tests/portable.mjs`. On Windows it takes bash from Git for Windows (not from WSL) and rewrites paths to forward slashes.
  - I replaced `ln -s` and `rm -rf` with `symlinkSync(junction)` and `rmSync`.
  - Git for Windows does not accept `/dev/null` as `core.excludesFile`, so on Windows the test gives a non-existent file.
  - I replaced `URL.pathname` with `fileURLToPath`, and `execSync` with `execFileSync` or `spawnSync`.
- **`package.json`:** the script `node --test tests/*.test.mjs` did not work under cmd.exe, because the glob is not expanded there. It is now plain `node --test`.
- **CI:** a `test-windows` job was added (windows-latest, Node 18 and 24). The Ubuntu job is unchanged.
- **Tests and documentation:** the new file `tests/windows.test.mjs` checks a loop with CRLF, `renameRetry`, the MCP server start and `portablePath`. The CHANGELOG entry is in the [Unreleased] → Fixed section.

I found nothing that cannot be done on Windows. Signals, `chmod` and hooks do not occur in Jarl's code.

**For a separate issue:**
- **Long paths:** with deeply nested worktrees, git on Windows may need `core.longpaths=true`. I did not test this and did not describe it in the README.
- **Retry for unlink:** the lock release does not retry deleting the file. If the deletion fails while the process (e.g. the MCP server) is still alive, the lock hangs for up to 10 minutes.

The evidence is recorded in issue 481 (two evidence rows). The working files are in `<session scratchpad>/w481-JarlSkill/`.


## Grain

Grain now works on Windows: in run 36317788586 for the final tip, the tests on windows-latest (node 22 and 24) and on ubuntu (node 22 and 24) passed. The `seam tests` job is red, but not because of these changes (explanation in item 1 at the end).

**Branch:** `jarl/481-windows` in `~/.jarl-wt/Grain-481`, tip `9724c24f88d12334437c2c2fccd0a9fb244889f7`, 12 commits. The remote branch `release/win-481` is already deleted, and the evidence is recorded in issue 481.

**First run on Windows (36311807603):** about 35 failures, then a hang until the 45-minute timeout. The second run (36316954349) had 11 failures, the third (36316954349) 3055 tests: 0 failures, 34 skipped with a stated reason. The change in `scripts/build-grammars.mjs` is not covered by tests, because we do not build grammars in CI.

## Findings in product code → fix
- **`engine/grain-context.mjs` `canonicalize`**: on Windows the check, edit and completeness hooks were silent. The file path arrived in the short 8.3 form (`RUNNER~1`) and the root from git in the full one, so the file looked as if it lay outside the repo. → on win32 I use `realpathSync.native`.
- **`engine/grain-context.mjs` `findRoot`**: git on Windows returns the root in the form `C:/x/y`. → on win32 I pass it through `resolve()`, so that it has backslashes like the rest of the paths.
- **`engine/propose-report.mjs:41`**: `rel()` compared against `root + '/'`, so the `propose` report showed absolute paths. → `path.relative` + `toPosix`.
- **`engine/learn.mjs:133`**: the POSIX `basename(root)` gave the whole path as the repo name (visible in the `grain rules` title). → `basename` from `node:path`.
- **`engine/propose-base.mjs` `resolveYg`**: `where yg` returned the sh shim without an extension first, and a `.cmd` cannot be run without a shell (EINVAL). → a new function `windowsLauncher`: it reads the script from the npm `.cmd` shim and runs it through node. An `.exe` file goes through unchanged, and the last resort is `cmd.exe /d /s /c`. Launching through `YG_BIN` now uses `process.execPath`. Test: `tests/windows-launcher.test.mjs`.
- **`bin/grain-mcp.mjs` `runCli`**: stopping through `kill(-pid)` and `detached` does not work on Windows (there are no process groups there). → on win32 I do not detach the process, I hide the window and kill the whole tree with `taskkill /pid … /T /F` (new function `killTree`).
- **`bin/grain-mcp.mjs`, the `self` check**: the server could fail to recognise that it was the one launched when the path differed in 8.3 form or in letter case, and then it did not start. → native realpath and a case-insensitive comparison.
- **`engine/base.mjs` new function `renameOver`**: during an atomic write, a `rename` onto an open file can give EPERM, EACCES or EBUSY. → on Windows I retry for up to about 1 s. `grain-context.mjs` and `history.mjs` use it.
- **`engine/grain-seed.mjs:121/167/230/263`**: the author of a decision was taken only from `USER`, which Windows does not set. → added a fallback to `USERNAME`.
- **`scripts/build-grammars.mjs`**: the tree-sitter CLI on Windows is called `tree-sitter.exe`. → name fixed.
- **`bin/grain.mjs`**: the relaunch with `--liftoff-only` got `windowsHide`.
- **CRLF**: Grain understands files with CRLF the same as with LF. A new test `tests/crlf.test.mjs` on a fixture with the new flag `--crlf` compares `report`, `where` and `check`.

## Findings in tests → fix
- `tests/git-env.mjs`: `core.autocrlf=false` for test repositories. Before, `git checkout` in a test rewrote the fixture to CRLF.
- `mcp-server.test.mjs`: the process table read through PowerShell (`Get-CimInstance`) instead of `ps`, `cpSync`/`mkdirSync` instead of `cp`/`mkdir`, and the cleanup with `rmSync` retries on EBUSY.
- `session-hook.test.mjs`: a `yg.cmd` stub, correct setting of `Path` regardless of letter case, `process.execPath` instead of `node`.
- `propose-root-parent.test.mjs`: `readdirSync` instead of `find`.
- `propose-language-marker-files.test.mjs` and `propose-hostile-repo.test.mjs`: the system separator (`sep`) instead of `/`.
- `propose-type-levels.test.mjs` and `reconstruct.test.mjs`: `tar` gets the archive on stdin, without `sh -c`.
- `family-candidates.test.mjs`: the regex accepts both separators `[\\/]`.

**Skipped on Windows, with the reason in the code:**
- the MCP server's SIGTERM, SIGINT and SIGHUP tests;
- tests with a docker stub as a script with a shebang (`container-path.test.mjs` and one test in `mcp-server.test.mjs`);
- file names with a backslash and a newline character (`propose-hardening.test.mjs`).

**Documentation:** `docs/reference.md` now describes `taskkill /T` on Windows. It also describes that when the host kills the server, the launched CLI finishes its work on its own and nobody receives the answer any more.

**CI:** a `test-windows` job was added to `.github/workflows/ci.yml` (windows-latest, node 22 and 24, `npm test`). The ubuntu job is unchanged.

## For a separate issue
1. **`seam tests` on branches outside release** compares against Yggdrasil's `main` (6.0.0) and Horde (which requires yg 6.1.0), so it fails. On those branches it does not work out of the box (the baseline was red too); on `release/6.1.0` it passes. A decision is needed on how it should pick the versions of the sibling repos.
2. **Hooks on Windows** are checked only by code review, not in a real host:
   - Cursor has only `command` with bash-style quotes and no Windows variant, so I did not check how it will run it;
   - in Codex, `commandWindows` has inconsistent escaping (`\bin` in one entry, `\\bin` in the others); Windows accepts both, but it is worth unifying;
   - Claude Code needs Git Bash on Windows;
   - `.mcp.json` (`node -e` with an argument array, no shell) is fine.
3. **Translating container paths for Docker Desktop on Windows** (the format of the `Source` field in mounts) is not tested, because the docker stub is a script with a shebang and does not work on Windows.
4. **The audit report in `research/`**, required by the acceptance criteria of issue 481, was not produced in this assignment.


## Horde

Horde works on Windows: the suite passes on windows-latest and on Ubuntu, 0 failures. Caveat: the green run was on a test branch with an extra commit that pins Yggdrasil to `release/6.1.0` and does not go into the branch. From the name `release/win-481`, CI picks Yggdrasil's `main`, that is, version 6.0.0, while Horde requires 6.1.0. On `release/6.1.0` this mismatch does not occur.

**Branch tip:** `fea9bbc` on `jarl/481-windows` (~/.jarl-wt/Horde-481). 14 commits, each with "(issue 481)" and with trailers.

**CI on Windows:**
- The final run **36322399666** is green in all jobs: ubuntu node 22 and 24, marketplace, windows-latest node 24.
- On Windows: 1533 tests, 1516 pass, 0 fail, 17 skip.
- Earlier runs: 36313078465 (Windows 189 fail), 36317575739 (4 fail), 36320136372 (green).
- The remote branch `release/win-481` is deleted. Evidence recorded in issue 481.

**Findings (file → fix):**
- `_lib.mjs` (new platform layer):
  - `programFor`/`cmdShimTarget`: npm `.cmd` shims (yg, grain) are run as node on their script. Since 20.12, Node does not start a `.cmd` without a shell, and the arguments are free text, so going through cmd.exe would be dangerous. Any other `.bat`/`.cmd` file is rejected with a readable message.
  - `splitCommandLine`: a quoted path with a space stays one word.
  - `posixShell`: gate, notify and runner commands go through sh.exe from Git for Windows or from `HORDE_SH`. When there is none, there is a clear refusal, never a silent cmd.exe.
  - `killTree`: on Windows stops the process tree with `taskkill /T /F` instead of `kill(-pid)`. The gate and notify supervisors use it.
  - `samePath`/`realPath`: a path comparison robust to `C:/` versus `C:\`, letter case and short 8.3 names.
  - `readText` reads CRLF as LF, and `renameReplacing` retries the rename on EPERM/EBUSY.
  - `processStartedAt` returns null on Windows, because there is no `ps` there.
- `_lib.mjs:1897,1976` and `tick.mjs:964`: the hard-coded `spawn('sh')` replaced with `posixShell()`, `windowsHide` added. The brief path in the sh command goes with `/`.
- `land.mjs`: `execSync` in gate, testFile, mutate and commit got `shell: posixShell()`. Detached background landings have `windowsHide`.
- `drill.mjs`: the same `shell: posixShell()`. `:686` recognises both separators.
- `node.mjs`, `horde.mjs`, `queue.mjs`, `audit.mjs`: splitting yg and grain commands now goes through `splitCommandLine` + `programFor`. In `node.mjs:1865,1884` node ids and the graph prefix use `/`.
- `blame.mjs:455`: "is outside the repository" fixed by comparing the `realPath` of both sides.
- `refine.mjs:721,1012`: `URL.pathname` gave `/D:/…` (and `%20` for a space); now `fileURLToPath`.
- `packages/promises/*`: documents with CRLF split with `split(/\r?\n/)`.
- Tests:
  - dynamic imports through `pathToFileURL`;
  - `sleep` replaced with `sleepSync`;
  - `basename`, regexes accepting both separators;
  - helpers return a node line for the yg shim;
  - a longer wait for a background landing on Windows (there it takes over a minute);
  - a new `tests/platform.test.mjs`.
- The 17 skips concern things that do not exist on Windows, each with the reason in its name: signals and process groups, pgrep, directory chmod, start time from `ps`, the `>` character in a branch name.
- `ci.yml`: new jobs `yggdrasil-dist` and `test-windows`. The ubuntu job is unchanged. On Windows: `core.autocrlf false`, TMP set to `runner.temp`, a 60-minute timeout.
- Documentation: an "On Windows" section in `README.md` (Requirements) and an entry in `CHANGELOG.md`.

**For follow-up:**
1. **Yggdrasil does not build on Windows.** `grammars.mjs` reports "grammar pin mismatch for typescript (tree-sitter-typescript.wasm)". That is why Horde's Windows job installs the dist built on ubuntu. After the fix in Yggdrasil, it is worth going back to building on Windows.
2. **A gate timeout through `execSync` kills only the shell, not its children.** This concerns `checkGate`, `runWholeCommand`, `runTestFileCommand` and mutate in `land.mjs`. The problem also occurs on POSIX. It would be better to run them through a supervisor with `killTree` that captures the output.
3. **On Windows a reused pid cannot be detected** under `--runner external`, because there is no `ps`. A possible implementation is through PowerShell/CIM, at the cost of a slower tick.
4. **`startBatchInBackground` throws away the stderr of the detached process** (`stdio: 'ignore'`). A failure of a background landing leaves no trace. I propose a log next to the result file.


## Yggdrasil — analysis

# Yggdrasil (release/6.1.0 @ 103934609): Windows compatibility audit, issue 481

As the assignment said, I changed nothing; I only read and checked. I recorded two evidence entries in issue 481. The most important finding: the most popular reviewer, `claude-code`, gets corrupted arguments on Windows, and most likely every review ends in an error. I confirmed this with a script on macOS, because Node joins arguments with `shell:true` the same way on both systems. I did not run it on Windows. Apart from that, `ci.yml` has no Windows job at all, and the build itself falls over on windows-latest today.

## What already works on Windows (keep)
- `io/hash.ts:36` `normalizeLineEndings`: the verification hash is robust to CRLF. `core/log-integrity.ts:17` normalises log.md, `core/checks/digest-gate.ts:44` the block digest, `ast/suppress.ts:275` the markers.
- `cli/init-scaffold.ts:56` appends the line `/.yggdrasil/**/log.md text eol=lf` to `.gitattributes`.
- `io/atomic-write.ts:33`: a temporary file + rename with retry on EPERM/EBUSY/EACCES. The lock through `wx` and the pid check (`process.kill(pid,0)`) also work on Windows.
- `utils/posix.ts` (`toPosix`, `toPosixPath`), `utils/repo-path-escape.ts`, `cli/simulate.ts:100`: drive letters and `..\`.
- `utils/binary-check.ts`: the `--version` probe through a shell (without `which`).
- `cli-base.ts:197` `needsShellToSpawn`: process groups are guarded by a `win32` condition.
- `copilot-cli.ts:24`: looks for `.exe`/`.cmd` through PATHEXT.
- All dynamic imports go through `pathToFileURL` (`ast/runner.ts:104`, `structure/hook-loader.ts:238`, `ast/loader-hook.ts`).
- `exit-after-flush.ts`: a workaround for a libuv assertion on Windows.
- `git` is invoked through `execFile` with an argument array. It is `git.exe`, so no shell is needed.
- The code does not use chmod. Symlinks are deliberately rejected (`aspect-reference-symlink`, `aspect-source-symlink`, log.md). Yggdrasil does not install git hooks.
- `docs/` promises nothing about Windows. The promises are only in the CHANGELOG (l. 289, 269, 1021, 1027).

## P1: bugs that break operation

**1. `claude-code` on Windows gets a broken argv**
- Where: `source/cli/src/llm/claude-code.ts:48-52` together with `llm/cli-base.ts:197-200,370,382`.
- On win32 every bare name (`claude`, `codex`, `gemini`) goes through `shell:true`. Node then simply glues the arguments together with spaces.
- Effect in the demo (`<session scratchpad>/w481-ygg/demo.mjs`):
  - the empty arguments `--tools ''` and `--setting-sources ''` disappear, so `--tools` takes the next flag as its value and the isolation falls apart;
  - `{"mcpServers":{}}` loses its quotes and turns into `{mcpServers:{}}`, which is invalid JSON;
  - Node 24 prints a DEP0190 warning to stderr.
- The promise from CHANGELOG:289 does not hold in practice for `claude`.
- Fix: do not pass an argument array together with `shell:true`. On win32, build the command line yourself with correct escaping: every argument in quotes according to the MSVCRT rules (`""` for an empty one, `\"` inside), cmd metacharacters prefixed with `^`. This is what `cross-spawn` does; it can be added as a dependency, or its `escapeArgument`/`escapeCommand` can be ported. The better variant: on win32, find the binary yourself through PATH and PATHEXT. When it is an `.exe` (Claude's native installer), spawn without a shell. When it is a `.cmd`, use the escaping.
- Tests:
  - (a) a pure unit on every OS: `buildWindowsCommandLine(bin, args)` parsed back with a CommandLineToArgvW implementation gives exactly the input argv; cases: `''`, JSON, spaces, `&`, `%`, `^`;
  - (b) on windows-latest: a fake `claude.cmd` dumps `process.argv` to a file, and the test checks that the argv is identical to `buildArgs()`.

**2. A reviewer timeout on Windows kills only cmd.exe, while the reviewer CLI keeps running and using up tokens**
- Where: `llm/cli-base.ts:252-262` (`killReviewer`) and the `timeout` option at `:385`.
- With `shell:true` the child is cmd.exe. `child.kill()` calls TerminateProcess only on it, and the node.exe running `claude`, `codex` or `gemini` is orphaned. `settle` after 5 s masks this in the result, but the process keeps running.
- Fix: on win32, call `execFile('taskkill', ['/pid', String(child.pid), '/T', '/F'])` on both SIGTERM and SIGKILL. Keep the spawn's `timeout` option only on POSIX, or drop it entirely, since the timer is our own anyway.
- Test on Windows: a fake `.cmd` runs `node -e "setInterval(()=>{},1e3)"` and writes down its pid. With `timeout: 500` the test checks that after settle `process.kill(pid,0)` throws ESRCH.

**3. `npm run build` on Windows fails on "grammar pin mismatch for typescript"**
- It shows in Horde's run 36312369221.
- Where: `source/cli/scripts/grammars.mjs:97` (`git()`) and `:100-104` (`checkout`).
- The grammar checkout inherits the global `core.autocrlf=true` from the runner. The grammar sources get CRLF, so `tree-sitter generate` produces a different wasm.
- Fix: `execFileSync('git', ['-c','core.autocrlf=false','-c','core.eol=lf','-c','advice.detachedHead=false', ...args])`. `git apply` of the patches also with `-c core.autocrlf=false`.
- A second thing: `tree-sitter build --wasm` needs emcc or docker. On Windows it is better to take a ready cache (see the CI section).
- Test: in the script's test, set `GIT_CONFIG_GLOBAL` to a file with `core.autocrlf=true`, do a checkout and check that a file from the tree has no `\r` byte.

**4. `pack-smoke.mjs` on Windows: `execFileSync('npm', …)` without a shell**
- Where: `source/cli/scripts/pack-smoke.mjs:29`.
- `npm` on Windows is `npm.cmd`, so the call ends in ENOENT or EINVAL. At `:93` there is an `execSync`, which works. `tar` at `:39` is in Windows 10+ (bsdtar), so OK.
- Fix: `execFileSync(process.execPath, [npmCliJs, 'pack', …])`, where `npmCliJs = process.env.npm_execpath` has a fallback to `require.resolve('npm/bin/npm-cli.js')`. Alternative: `shell: process.platform==='win32'` with constant arguments only. The `work` path, however, sometimes lies in a directory with a space, so it has to be quoted.
- Test: `repo-check` on windows-latest (the CI job from the section below).

## P2: wrong results or degradation

**5. `copilot-cli`: the absolute path of the binary goes to the shell without quotes, converted to `/`**
- Where: `llm/copilot-cli.ts:22,30` (`toPosixPath(candidate)`), `:99` and `:118` (`probeBinary(found)` with `shell:true`, `binary-check.ts:41-44`).
- A typical path is `C:/…/John Doe/AppData/Roaming/npm/copilot.cmd`. The space splits the command, because Node does not quote the file with `shell:true`.
- Fix: return the native path without `toPosixPath`. Use the POSIX form only in messages. With a shell, quote the file (the same escaper as in item 1).
- Test: a unit for `resolveCopilotBinary` with a PATH containing a directory with a space. On Windows, a fake `copilot.cmd` in such a directory, and `isAvailable()` must return true.

**6. Progressive mode on Windows switches itself off because of 8.3 names and letter case**
- Where: `core/progressive-scope-resolve.ts:364-367` together with `io/graph-fs.ts:83`.
- `git rev-parse --show-toplevel` returns the long name (`C:/…/runneradmin/...`). `os.tmpdir()` and cwd may have `RUNNER~1` or a lower-case `c:`. And the JS version of `realpathSync` does not expand 8.3 names. As a result, the preflight picks `global-fallback`. The same class of bug came up in Horde and Grain.
- Fix: `realpathSync.native` and a case-insensitive comparison on win32 (`a.toLowerCase() === b.toLowerCase()`). Put the same `.native` in `structure/ctx-fs.ts:131,139` and `cli/simulate.ts:130,158`.
- Test: a unit with an injected `platform` and realpath (path `c:/x` against `C:/x`). On Windows, a repo in `os.tmpdir()` must give `scoped` mode.

**7. `check.mjs` gets raw CRLF, while the pair hash is computed after normalisation**
- Where: `structure/ctx-fs.ts:240` (`bytes.toString('utf8')`) and `io/file-content-cache.ts:92`. The content lands in `file.content`, `ctx.read` and the AST.
- The same hash can mean different content for a rule, e.g. a regex `/…$/m` with `\r`. As a result, a rule passes on Windows and fails on Linux CI, or the other way round.
- Fix: normalise the text given to rules to LF, and keep the raw bytes in a separate API. This is a change to the contract of deterministic rules, so the decision is Krzysztof's.
- Test: the same fixture in an LF and a CRLF version, a rule with `/;$/m`, an identical verdict expected.

**8. Directory renames without retry**
- Where: `io/package-store.ts:432,438,443` and `cli/adopt-transaction.ts:324,365`.
- On Windows an antivirus, an indexer or the VS Code watcher gives EPERM/EBUSY when a directory is moved, and `atomic-write` has retry only for files.
- Fix: extract `renameWithRetry` (the same `TRANSIENT_WRITE_CODES` and delays) and use it in these places.
- Test: a unit with an injected `rename` that throws EBUSY twice and then succeeds. The operation must succeed, and the rollback must not run.

**9. DEP0190 in `yg`'s stderr on Node 24 on Windows**
- Where: `utils/binary-check.ts:41-44` (`execFile(binary, ['--version'], {shell:true})`) and `cli-base.ts:382`.
- The fix will come together with item 1: pass a single ready command line without an argument array.
- Test on Windows: `yg check` with a CLI reviewer must have a stderr without `DEP0190`.

## P3: cosmetics and robustness

**10. The lock attestation hash depends on CRLF**
- Where: `io/lock-store.ts:148-162` (`committedLockContentHash`, raw bytes) and `:811` (the "unchanged" comparison).
- A checkout with autocrlf gives a different attestation hash than on Linux and causes the lock to be rewritten on every write.
- Fix: add `/.yggdrasil/yg-lock.*.json text eol=lf` and `/.yggdrasil/*.jsonl text eol=lf` to `GITATTRIBUTES_LINES` (`cli/init-scaffold.ts:51`), and compute the hash through `normalizeLineEndings`.
- Test: two directories with a lock in an LF and a CRLF version must give the same hash.

**11. Signals on Windows**
- Where: `io/atomic-write.ts:254,272` and `llm/cli-base.ts:216-232`.
- SIGTERM does not arrive on Windows. Closing the console window sends SIGHUP, and Ctrl+Break sends SIGBREAK. Because of this, the callbacks (releasing the approve lock, flush) do not run. The pid check will rescue the lock, but the flush is lost.
- Re-sending `process.kill(process.pid, sig)` on Windows kills the process hard.
- Fix: `INTERRUPT_SIGNALS` on win32 = `['SIGINT','SIGHUP','SIGBREAK']`. After the callbacks, `process.exit(130)` instead of re-sending the signal.
- Test: a unit with an injected platform that checks the list of registered signals.

**12. `cli/portal.ts:129-132` `cmd /c start "" <path>`**
- A path with `&` or `^` will break the command. `windowsHide: true` is also missing, so a console window will flash.
- Fix: `windowsHide: true` and escaping of metacharacters (the same escaper).
- Test: a unit for building the argv for the path `C:\a&b\x.html`.

**13. npm scripts with an env prefix**
- Where: `source/cli/package.json` (`golden:update`, `glossary:update`, `prose:baseline`, `codes:update`, `schemas:update`, `json-schemas:update`).
- The `YG_X=1 vitest` syntax does not work in cmd or PowerShell, which npm uses on Windows. This concerns development only.
- Fix: `node scripts/with-env.mjs YG_X=1 -- vitest …`, or a variable set in `vitest.config` from an argument.

**14. Appending to a log.md from before `eol=lf`**
- Where: `core/log/log-entry.ts:85`.
- In a repo without the `eol=lf` pin, it appends LF to a file with CRLF, and the file ends up with mixed line endings. The hash is normalised, so this is only noise in the diff.
- Fix: append in the file's dominant style, as `templates/platform.ts` does.

**15. Tests will not run on Windows**
- The tests assume POSIX: fake binaries as `sh` scripts (`tests/e2e/cli-reviewer-fill-runtime.test.ts:33`, `tests/unit/llm/cli-provider-contract.test.ts:76,99`), 26 files with `symlinkSync`, about 175 chmod or symlink calls, `execSync` with `&&` and `GIT_EDITOR: 'true'` (`log-merge-resolve.test.ts:586`), and only 17 files have any `skipIf(win32)` at all.
- Fix: a helper `writeFakeCli(name, jsBody)` that creates `name` (node shebang) and `name.cmd` (`@node "%~dp0name.js" %*`). Mark POSIX-only tests with `it.skipIf(process.platform==='win32')`, with the reason in the name. In `GIT_EDITOR`, put `node -e ""` instead of `true`.

## The windows-latest job for `.github/workflows/ci.yml`

Grammars from the source build need emcc or docker, and the full `repo-check.sh` (Playwright, 90% coverage, shell fakes) will not pass on Windows today. That is why the job has two phases:
- phase 1 (now): the dist built on ubuntu, and on Windows a CLI smoke and a dedicated test set `tests/windows/**`;
- phase 2 (after item 15): a full `vitest run`.

Two steps have to be added to the same `quality` job on ubuntu (after `repo-check`):

```yaml
      - if: matrix.node-version == 22
        uses: actions/upload-artifact@v4
        with:
          name: yg-dist
          path: source/cli/dist
          retention-days: 1
```

New job:

```yaml
  windows:
    needs: quality
    runs-on: windows-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [22, 24]
    defaults:
      run:
        shell: bash
    steps:
      # The runner's global core.autocrlf=true stays on deliberately: users have it too,
      # so the job checks exactly what they get.
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
        working-directory: source/cli
      # Grammars need emcc/docker for a source build; take the dist built on ubuntu (grammar wasm is platform-independent).
      - uses: actions/download-artifact@v4
        with:
          name: yg-dist
          path: source/cli/dist
      - run: npm run typecheck
        working-directory: source/cli
      # Windows-specific tests: .cmd shim argv, taskkill of the process tree, 8.3 vs git toplevel, CRLF, rename retry.
      - run: npx vitest run tests/windows
        working-directory: source/cli
        env:
          FORCE_COLOR: '0'
      # Smoke of the built CLI on a fresh repo with CRLF (autocrlf from the runner).
      - name: CLI smoke (init + check on a CRLF checkout)
        run: |
          set -euo pipefail
          T="$(mktemp -d)"; cd "$T"
          git init -q && git config user.email ci@x && git config user.name ci
          mkdir src && printf 'export const a = 1;\r\n' > src/a.ts
          node "$GITHUB_WORKSPACE/source/cli/dist/bin.js" init --no-interactive || node "$GITHUB_WORKSPACE/source/cli/dist/bin.js" init --yes
          git add -A && git commit -qm init
          node "$GITHUB_WORKSPACE/source/cli/dist/bin.js" check --approve --only-deterministic
          node "$GITHUB_WORKSPACE/source/cli/dist/bin.js" check --no-approve
      # The repository's own graph on a Windows checkout (CRLF hashes = LF verdicts).
      - run: node source/cli/dist/bin.js check --approve --only-deterministic
      - run: node scripts/pack-smoke.mjs
        working-directory: source/cli
      # Phase 2: turn on the full suite after the helper from item 15; until then it is informational only.
      - run: npx vitest run
        working-directory: source/cli
        continue-on-error: true
```

In the smoke, `init` still has to be swapped for the real non-interactive flag of `yg init`; I did not check its name. If `pack-smoke` is also to build on Windows, item 4 has to be fixed first. If Krzysztof wants to build the grammars on Windows instead of downloading the artifact, `runner.os` or `enableCrossOsArchive: true` has to be added to the `actions/cache` key, and in both cases item 3 has to be fixed.

## Order of fixes for the worker
1, 2 and 9 together (one escaper and `taskkill` in `cli-base.ts` and `binary-check.ts`), then 3, 4, 5, 6, 8, and at the end 10–14. Item 7 needs Krzysztof's decision, because it changes the contract of deterministic rules.

The demo scripts are in `<session scratchpad>/w481-ygg/`: `demo.mjs` and `argv.cjs`.
