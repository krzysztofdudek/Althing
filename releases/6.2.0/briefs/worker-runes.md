# Worker brief: Runes

You are a worker of the release loop, raised for one package of issues in the Runes repository. Read the whole brief before you start. Read the repository's `CLAUDE.md`, `README.md` (the entry rule and the "never in Runes" list) and `docs/api.md` as if your working directory were that repository, and follow them: they win where they are stricter than this brief. Where a plan and this brief disagree, this brief wins, because it is newer.

## The loop

- The loop lives in Althing, in `{{root}}`; the code lives in Runes. Below, `jarl <command>` stands for `{{jarl}} <command> --root {{root}}`.
- The first issue of your package is pasted below. Read every other issue of the package with `jarl show <id>`. Issues, rulings and everything you write into the loop are English.
- Read the rulings in force with `jarl decisions --live`: above all `release-6-2-0` (every issue of the loop ships in this release; new options and contracts are allowed), `runes-last` (Runes is published last; Grain and Yggdrasil pick up the release branch's build first), `autonomy-quality`, `plan-6-2-0`, and any ruling your issue's `Settles:` names. Where two disagree, the later one wins, and a superseded one does not bind.
- Your package's fix direction is its section in the release plan, `{{root}}/plans/plan-<version>.md` (the version is the release directory's name; the Runes packages are its section 2), and the design section it points to. It is a hypothesis: each issue's acceptance line is the contract, within the rulings.
- The loop changes only through the `jarl` commands this brief names. Never edit a file of the loop or of Althing by hand, and never commit in Althing.
- Everything you write into the loop is public: no absolute path, no session link, no private name. Write paths relative to the repository.

## Where you work

- Your worktree is the issue's `Worktree:`, on the host under `{{wt:runes}}/Runes-<NNN>`, on the issue's `Branch:` (`jarl/<NNN>-<slug>`), cut from the release branch of `{{repo:runes}}`: the manifest's `repos.runes.branch` in `{{root}}/family.json`, written `<release-branch>` below. The main checkout is never touched; work only in your worktree. Runes runs on the host, with no container.
- First action: in your worktree, `git merge <release-branch>`. `git status` must be clean afterwards; if it is not, stop and report. Then, if `node_modules/` is missing in the worktree, `nice -n 15 timeout 600 npm ci`: `node_modules` is per worktree, and the grammar recipe reads the npm grammar pins from it. The grammar cache `~/.cache/runes/grammars` is warm and shared read-only, so `npm run grammars` works offline; never empty or edit it.

## The gates

All of them are green on your branch tip before you report.

- `nice -n 15 npm run check`: the TypeScript build (`tsc -p tsconfig.json` and `tsc -p tsconfig.relations.json`), the grammar build into `.grammars/`, the whole `node --test` suite (the guard over `src/`, `tools/` and `scripts/`, the relation catalogue, the vendor tool's end-to-end tests) and `check:dist`, which fails while the rebuilt `dist/` differs from git. Iterate with `nice -n 15 npm test` and single files (`nice -n 15 node --test test/relations/<file>.test.mjs` after `npm run build`). Run `npm run check` on the clean, committed tree before you report.
- `nice -n 15 npm run coverage`: thresholds over `dist/` of 98% lines, 92% branches and 97% functions. New branches get real tests; never lower a threshold and never add coverage-ignore comments.
- `dist/` is committed: every commit that changes `src/` carries the rebuilt `dist/` in the same commit.
- The catalogue count. A new case is `reference/relations/<language>/<id>.md` (frontmatter `id`, `language`, `category` in `import|usage-site|nested|trap|dynamic|builtin`, `expectation`, `cites`; sections `Rule`, `Files`, `Expect`, and optionally `Why`) plus exactly one `runCase('<id>')` in that language's `test/relations/extractors/<language>-name-resolution-matrix.test.mjs`. `test/relations/catalogue.test.mjs` asserts the total in its test name, its assertion and its first-line comment: raise all three by your own delta in the commit that adds the case. Other packages raise it too, and the merger sums the deltas when that one line conflicts. The prose counts in `README.md` (the status line and "The catalogue" paragraph) and `CLAUDE.md` wait for the final pass. A case whose expectation you flip (silence to edge, or the reverse) is renamed to say what it now expects (`…-silence` to `…-edge`), with its Rule and Why rewritten, never left contradicting its own name.
- The extractor `rev`. Bump it in the extractor whenever its `declarations()` or `uses()` output changes for some source, and update `test/relations/extractor-rev.test.mjs`, appending the reason to that language's comment; the current values are in that file. A resolver-only change (anything in `*-resolve.mts`, `resolve-path.mts`, `resolver.mts` or `csharp-project.mts`) needs no rev. Two packages that bump the same extractor's rev are chained in the plan, never run in parallel.
- The API page. `test/exports.test.mjs` holds `docs/api.md` and the package's exports together, both ways. A new export, option or field is a minor addition: list it in `docs/api.md` in the same commit, in its subpath's table with its Kind and the family tool that will import it (Grain, Yggdrasil), and say in prose what it promises; an optional field added to a listed type is described where that type is. Every value export must have a consumer by the time this release ships, because `docs/api.md` promises only what a family tool imports: the plan names the consumer package that adopts it. If your design needs an export no consumer will import, keep it internal and reach it in tests through `test/helpers/internal/relations.mjs`. The guard rejects exported identifiers that carry a family domain word (node, aspect, horde, jarl, ticket, mission, loop).
- Code conventions: the source is TypeScript in `src/` (`.mts`; relative imports name the output, `./x.mjs`); `src/relations/` compiles under `tsconfig.relations.json` without `noUncheckedIndexedAccess`; no module imports `web-tree-sitter` by value; zero runtime dependencies; `tools/vendor.mjs` stays plain JavaScript for Node 22; tests are `node:test` files in `test/` against the built `dist/` through the package's own exports; a test that needs git makes a throwaway repository under the operating system's temporary directory, with an explicit identity.

## Shared files

- You do not edit `package.json`'s version, `package-lock.json`, `src/version.mts`, `CHANGELOG.md`, or the prose counts and status line of `README.md` and `CLAUDE.md`: the final pass on the release branch does those once.
- Runes keeps no `[Unreleased]` section (the top CHANGELOG section must equal the package version, and a test checks it). Record each issue's user-visible entry on the issue instead: `jarl body <id> --changelog "Fixed: …"` (or `Added: …` for an export or option), one line in the register of the CHANGELOG's existing entries: what a consumer's relation pass now finds or stops finding, with the source form in backticks, and no file or function names of Runes. Say in the entry when the change can make a consumer's graph show new refusals; the final pass gathers those into "Before you upgrade".
- A `README.md` behaviour paragraph your change makes untrue is recorded as a note for the final pass: `jarl evidence <id> "docs: README.md: <section>: <what to change>"`. `docs/api.md` and the catalogue are edited in your commit, as above.

## Each commit

- One issue per commit, its subject `<area>: <what changed> (issue NNN)` (for example `csharp: a type named only in nameof gives no edge (issue 185)`), the body saying why in prose, never hard-wrapped. A fix a reviewer asks for is a further commit, never an amend.
- The identity is `me@chrisdudek.com`: if `git config user.email` in your worktree says otherwise, set it with `git config user.email me@chrisdudek.com` before the first commit. End every commit message with exactly this line, and no other trailer or session link:

```
{{trailer}}
```

## Proof

- Prove each change with a test that is red before it and green after: run it on your branch before the fix (or with the fix held in a scratch copy, never `git stash`) and after it, and show both runs. A catalogue case counts as the test when the runner drives the real pipeline; add a unit test as well where a case cannot reach the branch (an `isExcluded`, a file view, a diagnostics callback, a reachability predicate).
- Where the plan names corpus evidence (a pinned public repository), run it and report the before and after numbers. A repro an issue names that no longer exists is rebuilt from the issue's text. A public repository is fetched at its pinned commit into your scratch directory, never cloned into a checkout.
- If your acceptance needs a consumer run (a corpus repository through Yggdrasil's or Grain's relation pass), do it on a scratch copy as the plan's section for your package says, and say exactly what you ran.

## Scope and standing rules

- Your issues and nothing else. Anything else you notice goes under "Found" in your report, never into the diff. Never edit the Grain or Yggdrasil checkouts, their worktrees or their vendored copies.
- If an issue's correct fix needs a design decision beyond the plan and the rulings, do the part that fits the acceptance, stop on that part, and report the question with two or three options and what each costs.
- Never push, tag or publish. Never merge into or touch another branch. Never `git stash`: copy to your scratch directory instead. Never `--no-verify`.
- Never run `rm` in any form, not even `rm -f /dev/null`. Discard a change with `git checkout -- <file>`; use `git rm` only for an intended removal of a tracked file.
- Never chmod, chown or otherwise change the permissions of any checkout or worktree: it once broke a merger's gate. Reproduce a permission scenario only in a scratch copy.
- Never weaken a test, check, guard or threshold. If an issue seems to need that, stop and report.
- Where a repository carries a Yggdrasil graph: never write a `yg-suppress` marker, never change a rule's `review_by`, never hand-edit a lock file, and never edit `.yggdrasil/yg-architecture.yaml` without stopping to report first.
- Scratch goes to your session's scratchpad, never into a checkout or a worktree.
- You spawn no agents.

## Load and bounded commands

- The machine runs many agents at once. Run every build, test, coverage or corpus command under `nice -n 15`. Run the test files you touch until the final run; run `npm run check` and `npm run coverage` once each at the end (one to three minutes each). No corpus-wide or multi-repository sweep unless your acceptance needs it. Pull no docker image, and clone nothing the plan does not name. A test that fails only under load (the lock property tests have, at a load average above 100) is re-run alone and reported as such, never edited.
- **Bounded commands only** (the owner's rule, binding everywhere). Every command you run finishes on its own and never waits for anyone: an explicit `timeout` on anything that can run long (`timeout 1800` for a full suite, shorter for a single test file); no LLM-reviewed verdict (never `yg check --approve` without `--only-deterministic`, nothing that launches the reviewer); no sleep or polling loop waiting on a lock or another session; no server, watcher or browser left running; nothing that waits for a prompt or a permission. A step that would need any of that is stopped, recorded as open in your report, and the rest of the work continues.

## Your issue

````
{{issue}}
````

## Report

In under 250 words: per issue, what changed and the red-to-green evidence (the commands and what they printed); the catalogue delta and the new count; the rev changes; the API additions (names, and the `docs/api.md` rows); "Found"; open questions and open steps; and `git log --oneline <release-branch>..HEAD`.

## Changes

- 2026-10-06: created in the move, with the earlier brief's appended notes folded into the body.
