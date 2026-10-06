# 060 · Directories with glob special characters (Next.js `app/[locale]/`) get an unescaped `when: path`, so yg adopt rejects the whole proposal while Grain's preview says 'would accept'

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-types.mjs, Grain/plugins/grain/engine/propose-nodes.mjs, Grain/plugins/grain/engine/propose-aspects.mjs, Grain/plugins/grain/engine/propose-family.mjs, Grain/plugins/grain/engine/yggdrasil-graph.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** raw `${dir}/**` without escaping: plugins/grain/engine/propose-types.mjs:190 (a.when; :191 on release/6.1.1), propose-nodes.mjs:82 (typeGlob, used by the aspect scopes propose-aspects.mjs:271/273/274), propose-aspects.mjs:273 (directory scope; :351 on release/6.1.1), propose-family.mjs:105 (scopeFilesDraft); yggdrasil-graph.mjs:289-316 globToRe (no escape handling) and :332-339 pathMatcher (a mapping entry ending in '/' treated as a glob)
**Branch:** jarl/035-proposal-yg-accepts
**Merged:** ebdd56c
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0 ae6152f, yg 6.1.0): a repo in the app router layout (21 commits, 43 files): 20 pages app/[locale]/<name>/page.tsx, 20 pages app/(marketing)/<name>-promo/page.tsx, lib/ and components/. `grain propose` exit 0, the built-in preview 'yg adopt: would accept … Nothing was written'; `yg adopt .yggdrasil-proposal --dry-run` exit 0 'would accept'; `yg adopt .yggdrasil-proposal` exit 1: 'error[command-error]: In this repository the proposed graph does not hold together — 20 blocking problems across 1 kind: type-when-mismatch … File 'app/[locale]/admin/page.tsx' … does not satisfy 'app-locale'.when: ✗ path does not match "app/[locale]/**"'. The proposal has `when: path: "app/[locale]/**"` (yg-architecture.yaml:52), and minimatch reads `[locale]` as a character class (it matches e.g. app/l/x.ts). Counter-test: the same proposal with only `when` changed to `'app/\[locale\]/**'` → adopt accepts and `yg check --no-approve` passes. `(marketing)` and `@slot` are literal in minimatch; `[id]`, `[...slug]` and `[[...slug]]` (Next.js, SvelteKit, Nuxt) fail the same way. Correction to the issue as filed: Grain measures glob fidelity through globToRe, which also reads brackets as a class, and writes '`app/[locale]/**` selects 0 of 43 tracked files … (Jaccard 0.00)' (PROPOSAL.md: '`when` selects 0, fidelity 0.00'), that is, it knows the glob selects nothing and still writes an active type (MIN_WHEN_FIDELITY applies only to alternatives, propose-types.mjs:271/295). Two obstacles for a naive fix: globToRe("app/\[locale\]/**") throws 'Unterminated character class', and pathMatcher treats a mapping entry ending in '/' as a glob, while Yggdrasil reads an entry without '*' literally, so `grain advise` on the adopted graph gives nodesWithFiles 1 and filesWithAnOwningNode 20, while `yg owner --file 'app/[locale]/admin/page.tsx'` answers `app/[locale]`. The 'would accept' preview is issue 034 (Yggdrasil's dry-run without the in-place check). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-28/V-bracket-dir-glob.log (script <the session scratchpad, since lost>/bughunt/grain/verify-28/repro.sh), V-bracket-escaped-counter.log, V-grain-mapping-reader.log, V-grain-globToRe-no-escape.log; generator <the session scratchpad, since lost>/bughunt/grain/find-7/gen/nextish.mjs.

## Why
A whole family of popular framework layouts (dynamic route segments in Next.js, SvelteKit and Nuxt) gets a proposal that cannot be adopted, although Grain and the preview say it can; the 6.1.1 CHANGELOG draft promises 'Every proposal can be accepted'.

## Acceptance
- Every directory written into `when`, an aspect scope and a family glob goes through one shared helper that escapes glob special characters ([ ] ? * { } ! and extglob openers), and the YAML stays valid after escaping; globToRe handles backslash escaping, pathMatcher reads a mapping entry without '*' literally, as Yggdrasil does, and an active type whose `when` fidelity equals 0 is rejected or flagged.
- The repo from the reproduction (generator nextish.mjs): `grain propose`, then `yg adopt .yggdrasil-proposal` ends with exit 0, and `yg check --no-approve` passes; a test for the directories [locale], [...slug] and [[...slug]].

## Changelog
- Fixed: a repository with route directories named like [locale], [...slug] or [[...slug]] (Next.js, SvelteKit, Nuxt) now gets a proposal yg adopt accepts; before, the adoption refused the whole proposal although the preview said it would accept.

## Evidence

docs: docs/reference.md: in the grain propose contract, say a directory whose name holds glob characters ([locale], {a,b}, ?) is written escaped in every when, rule scope and family scope (app/\[locale\]/**), and a type whose when would select none of its own files is not proposed but listed in alternatives.md as not viable.

grain-035 @5e598ac (branch jarl/035-proposal-yg-accepts): tests/propose-glob-escape.test.mjs 8/8 red with the fix reverted (<the session scratchpad, since lost>/patch-611/grain-035/060-red-shim.log: helper as identity, one matcher for when and mapping; unmodified HEAD fails at import, <the session scratchpad, since lost>/patch-611/grain-035/060-red.log), 8/8 green after (<the session scratchpad, since lost>/patch-611/grain-035/060-green.log), including propose -> real yg adopt -> yg check --no-approve, both exit 0, on an app router with [locale], [...slug], [[...slug]] types. Escape checked against Yggdrasil's own minimatch for 15 names x 41 paths, 0 mismatches. The issue's nextish repo plus slug dirs (<the session scratchpad, since lost>/patch-611/grain-035/repro.sh): real adopt exit 1 with 20 type-when-mismatch before, adopt exit 0 and yg check --no-approve exit 0 after. No separate post-write preflight: the invariants hold by construction (gitFiles mirrors the walk, every path in a glob escaped, a when selecting none of its own files refused) and are proven against the real adopt. Full gate: 1865 tests, 1864 pass, 1 skip.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1915, pass 1914, fail 0, skipped 1, merge ebdd56c

