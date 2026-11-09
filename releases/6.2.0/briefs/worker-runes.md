# Added for a worker in the Runes repository

`ws brief worker --repo runes --issue <ids>` prints the tool's own brief, then this file, rendered for this machine. The tool's brief holds your role, your lines and every command you use. This file holds what the family adds about the Runes repository. Read that repository's `CLAUDE.md`, `README.md` (the entry rule and the "never in Runes" list) and `docs/api.md` as if your working directory were that repository: they win where they are stricter than this file.

## The loop

The loop lives in Althing, in `{{root}}`, and the code in Runes. The loop's commands are `{{jarl}} <command> --root {{root}}`. Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name; the Runes packages are its section 2). It is a hypothesis: each acceptance line is the contract, within the rulings.

## Where you work

- Your worktree is on the host under `{{wt:runes}}/Runes/<name>`, on your lease's branch, cut from the release branch of `{{repo:runes}}`: the manifest's `repos.runes.branch` in `{{root}}/family.json`. The main checkout is never touched. Runes runs on the host, with no container.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report. Then, if `node_modules/` is missing in the worktree, `nice -n 15 timeout 600 npm ci`: `node_modules` is per worktree, and the grammar recipe reads the npm grammar pins from it. The grammar cache `~/.cache/runes/grammars` is warm and shared read-only, so `npm run grammars` works offline; never empty or edit it.

## The gates

All of them are green on your branch tip before you report.

- `nice -n 15 npm run check`: the TypeScript build (`tsc -p tsconfig.json` and `tsc -p tsconfig.relations.json`), the grammar build into `.grammars/`, the whole `node --test` suite (the guard over `src/`, `tools/` and `scripts/`, the relation catalogue, the vendor tool's end-to-end tests) and `check:dist`, which fails while the rebuilt `dist/` differs from git. Iterate with `nice -n 15 npm test` and single files (`nice -n 15 node --test test/relations/<file>.test.mjs` after `npm run build`). Run `npm run check` on the clean, committed tree before you report.
- `nice -n 15 npm run coverage`: thresholds over `dist/` of 98% lines, 92% branches and 97% functions. New branches get real tests; never lower a threshold and never add coverage-ignore comments.
- `dist/` is committed: every commit that changes `src/` carries the rebuilt `dist/` in the same commit.
- The catalogue count. A new case is `reference/relations/<language>/<id>.md` (frontmatter `id`, `language`, `category` in `import|usage-site|nested|trap|dynamic|builtin`, `expectation`, `cites`; sections `Rule`, `Files`, `Expect`, and optionally `Why`) plus exactly one `runCase('<id>')` in that language's `test/relations/extractors/<language>-name-resolution-matrix.test.mjs`. `test/relations/catalogue.test.mjs` asserts the total in its test name, its assertion and its first-line comment: raise all three by your own delta in the commit that adds the case. Other packages raise it too, and the merger sums the deltas when that one line conflicts. The prose counts in `README.md` (the status line and "The catalogue" paragraph) and `CLAUDE.md` wait for the final pass. A case whose expectation you flip (silence to edge, or the reverse) is renamed to say what it now expects (`…-silence` to `…-edge`), with its Rule and Why rewritten, never left contradicting its own name.
- The extractor `rev`. Bump it in the extractor whenever its `declarations()` or `uses()` output changes for some source, and update `test/relations/extractor-rev.test.mjs`, appending the reason to that language's comment; the current values are in that file. A resolver-only change (anything in `*-resolve.mts`, `resolve-path.mts`, `resolver.mts` or `csharp-project.mts`) needs no rev. Two packages that bump the same extractor's rev are chained in the plan, never run in parallel.
- The API page. `test/exports.test.mjs` holds `docs/api.md` and the package's exports together, both ways. A new export, option or field is a minor addition: list it in `docs/api.md` in the same commit, in its subpath's table with its Kind and the family tool that will import it (Grain, Yggdrasil), and say in prose what it promises; an optional field added to a listed type is described where that type is. Every value export must have a consumer by the time this release ships, because `docs/api.md` promises only what a family tool imports: the plan names the consumer package that adopts it. If your design needs an export no consumer will import, keep it internal and reach it in tests through `test/helpers/internal/relations.mjs`. The guard rejects exported identifiers that carry a family domain word; its list is in `src/testkit/guard/config.mts`.
- Code conventions: the source is TypeScript in `src/` (`.mts`; relative imports name the output, `./x.mjs`); `src/relations/` compiles under `tsconfig.relations.json` without `noUncheckedIndexedAccess`; no module imports `web-tree-sitter` by value; zero runtime dependencies; `tools/vendor.mjs` stays plain JavaScript for Node 22; tests are `node:test` files in `test/` against the built `dist/` through the package's own exports; a test that needs git makes a throwaway repository under the operating system's temporary directory, with an explicit identity.

## Shared files

- You do not edit `package.json`'s version, `package-lock.json`, `src/version.mts`, `CHANGELOG.md`, or the prose counts and status line of `README.md` and `CLAUDE.md`: the final pass on the release branch does those once.
- Runes keeps no `[Unreleased]` section (the top CHANGELOG section must equal the package version, and a test checks it). Record each issue's user-visible entry on the issue through the tool's changelog command, one line in the register of the CHANGELOG's existing entries: what a consumer's relation pass now finds or stops finding, with the source form in backticks, and no file or function names of Runes. Say in the entry when the change can make a consumer's graph show new refusals; the final pass gathers those into "Before you upgrade".
- A `README.md` behaviour paragraph your change makes untrue is recorded as a note on the issue for the final pass. `docs/api.md` and the catalogue are edited in your commit, as above.

## Each commit

- One issue per commit, its subject `<area>: <what changed> (issue NNN)` (for example `csharp: a type named only in nameof gives no edge (issue 185)`), the body saying why in prose, never hard-wrapped. A fix a reviewer asks for is a further commit, never an amend.
- The identity is `me@chrisdudek.com`: if `git config user.email` in your worktree says otherwise, set it before the first commit. A commit carries no trailer naming an agent and no session link.

## Proof beyond your lines

- A catalogue case counts as the red-before and green-after test when the runner drives the real pipeline; add a unit test as well where a case cannot reach the branch (an `isExcluded`, a file view, a diagnostics callback, a reachability predicate).
- Where the plan names corpus evidence (a pinned public repository), run it and report the before and after numbers. If your acceptance needs a consumer run (a corpus repository through Yggdrasil's or Grain's relation pass), do it on a scratch copy as the plan's section for your package says, and say exactly what you ran.
- A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch folder, never cloned into a checkout.

## Your report

Beside what the tool's brief asks, give the catalogue delta and the new count, the rev changes and the API additions (names, and the `docs/api.md` rows): the merger sums the catalogue deltas.

## Standing rules

- Everything you write into the loop is public and English: no absolute path outside a `Worktree:` field, no session link, no private name.
- Never edit the Grain or Yggdrasil checkouts, their worktrees or their vendored copies.
- Never push, tag, publish, merge into another branch, or use `git stash`, `--no-verify`, `rm` in any form, or chmod and chown on a checkout or worktree. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never weaken a test, check, guard or threshold. Where a repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch and a permission scenario go in a `mktemp -d` folder under the system temporary directory, never into a checkout or a worktree.
- Every command is bounded: `timeout` on anything that can run long (`timeout 1800` for a full suite), no LLM-reviewed verdict, no sleep or polling, no server left running, nothing that waits for a prompt. Run every build, test, coverage or corpus command under `nice -n 15`; the files you touch until the final run, and `npm run check` and `npm run coverage` once each at the end. A test that fails only under load (the lock property tests have, at a load average above 100) is re-run alone and reported as such, never edited. A step that would need any of that is recorded as open in your report.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
- 2026-11-09: the tool's own brief now holds the role, the lines and every command, and this file holds only what the family adds about this repository (the loop moved to Jarl 6.3.0).
