# 20 · TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1351-lbds
**Tags:** performance, runes, typescript
**Files:** 
**Repo:** Runes
**Found by:** rev-762-opus
**Where:** the review of 762
**Branch:** jarl/755-bundler-alias
**Worker:** w-755-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening tags that never reach a > ('<script ' or '<script a="' repeated): 256 KB takes about 3.4 s at v1.1.0 and 6.3 s at the 1.2.0 branch, since each <script retries the opening-tag pattern to the end of the file; once one attempt finds no >, no later one can match

## Why


A crafted or damaged component can stall every consumer that reads the repository, against the extractor's linear-time guarantee.

## Acceptance


[test] A Vue or Svelte component holding a long run of <script openings with no > (both '<script ' and '<script a="' repeated, 1 MB) is read in linear time, in a test bounded in the style of the extractor's existing linear-time tests, red before and green after; every existing answer stays as it is · by: npm run check

## Changelog
- A Vue or Svelte component holding a long run of `<script` openings with no `>` after them (`<script ` or `<script a="` repeated, as a crafted or damaged file may) is now read in linear time; in 1.1.0 256 KB of it took seconds and the time grew with the square of its size. No finding changes.

## Reviews
- **changes** · by rev-755-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1509-wprq
  Verdict: changes, for one Important finding on 755; 10 and 20 meet their lines. [read] 755 line 1 is met by ruling runes-1-2-0-plan, D2: 'the alias is read from the literal forms of Vite, webpack and Babel configuration the plan lists, and a configuration that exists but whose alias cannot be read makes a bare specifier that names no declared dependency unfollowed'. Every [test] line was re-run in a scratch clone: red at 4c47621, 45d8cfe and dba567a, green at 29c0bd4 (npm run check: 2848 tests, 2845 pass, 0 fail, 3 skipped, dist/ fresh; routine corpus gate passed, 25 repositories; react, typeorm, shaka-player passed). The worker's departure from the plan holds: Vite's bundled @rollup/plugin-alias resolves the replaced id with this.resolve(updatedId, importer), and enhanced-resolve's AliasUtils keeps the request's path, so both bundlers resolve a relative replacement from the importing file. The token reader is linear: a 10 MB configuration in 0.8 s, 10 MB of bundle-like text in 0.7 s, 2 MB of nested brackets in 0.2 s. No prototype-property crash was found: in the reader (keys __proto__, constructor, toString, hasOwnProperty), in declaresDependency (Object.hasOwn), or in the mock reading (jest.toString, constructor.mock, jest.mock('a').constructor('b')). The 20 fix gives the same answers, since an opening at or after the last > could never match. IMPORTANT (755, bundler-alias.mts objectEntries and applyBundlerAliases): a member the reader cannot read that comes after a readable key in an alias object can, under JavaScript's rules, replace that key's value, but the reader lets the earlier key decide, which is a false edge. Each of these binds @/x to src/x.ts at 29c0bd4, where Vite binds other/x: alias { '@': '/src', ...{ '@': '/other' } }; { '@': '/src', ['@']: '/other' }; { '@': '/src', '\x40': '/other' }; { '@': '/src', get '@'() { return '/other'; } }; and, one level up, { resolve: { alias: { '@': '/src' }, ...more } } and { resolve: { alias: { '@': '/src' } }, ...overrides }. The reader's own rule for a literal key written twice (it keeps its first place and its last value, so the list is unknown) is the right one, but it is not applied to the members it cannot read. docs/api.md says a computed key or a spread leaves a bare specifier unfollowed, and the unit test 'an object entry it cannot read leaves its key unknown, in its place' pins the opposite. A fix: an unreadable member after a readable key leaves the keys before it unknown (or the whole list), and a spread after alias in resolve, or after resolve in its owner, makes the list unknown. MINOR: (1) a webpack alias key with one * (the wildcard of enhanced-resolve 5, read in its AliasUtils) is read as a literal name, so '@/*': path.resolve(__dirname, 'src/*') never matches @/x, which answers outside instead of unfollowed; it is a false green, not a false edge. (2) module-resolver reads a relative value from opts.cwd, which defaults to process.cwd() (its normalizeOptions.js), not from the configuration's directory. The reading follows the plan, but the Babel case's cite and the worker's assumption call the working directory 'the configuration's'. A nested .babelrc that babelrcRoots lets apply, with Babel run from the root, reads './src' from the root. (3) an alias under any key named resolve is read, so webpack's rule-level module.rules[].resolve.alias, and a module-resolver inside Babel overrides or env, apply to every file under the configuration's directory (both bind @/x to other/x for a file the rule or override does not cover); this is worth a limit line or an unknown reading. (4) path.resolve(__dirname, ...) is read even where the file declares its own __dirname; const __dirname = path.resolve(fileURLToPath(import.meta.url), '../..') still binds from the configuration's directory. (5) bundlerAlias recomputes for every bare-specifier call with no memo: 202037 entries cost 1.25 ms per call, and 131072 alias lists in a 5 MB configuration about 54 ms per call (2000 specifiers in 109 s), because combineAliasAnswers stringifies every list's answer; this is crafted only, and the same shape as the tsconfig paths cost filed outside. (6) 10: Jest documents that jest.resetModules(), jest.useFakeTimers(), jest.enableAutomock() and others return the jest object, but the chain walk follows only the six module calls, so jest.resetModules().mock('x') gives no use and the unit test pins that; the corpus has no instance. (7) commits 87f5310, dba567a, f013917 and 5193854 do not build (TS7022 at typescript.mts:151-152, fixed by 876baf6), so npm run check fails at those commits; the tip is green. (8) the vite and unreadable alias cases sit in the TypeScript matrix's 'JavaScript (no type syntax)' block, not in 'project configuration'.
  outside the issue, filed as 24: Runes, TypeScript and JavaScript: a tsconfig paths map with very many keys makes each bare specifier cost time in proportion to it, so a crafted repository stalls every consumer: at release/1.2.0 (3e125cb) a 6 MB tsconfig.json with 202037 paths keys takes about 89 ms per resolve or explainMiss call of a specifier no key matches (20 specifiers, each resolved and explained, 3.56 s; 2000 did not finish in 300 s), against the linear cost the readers keep elsewhere
  outside the issue, filed as 25: Runes, TypeScript and JavaScript: webpack resolve.modules is not read: with resolve.modules [path.resolve(__dirname, 'src'), 'node_modules'] in webpack.config.js, require('components/Button') from src/app.js answers absent outside although webpack binds src/components/Button.js; the same false green 755 fixes for resolve.alias, for the other way webpack maps a bare request into the repository
  outside the issue, filed as 26: Runes, TypeScript and JavaScript: Jest's moduleNameMapper (the jest key of package.json or jest.config.*) is not read: with '^@/(.*)$': '<rootDir>/src/$1', a test's import of @/components/Button answers absent outside although Jest binds src/components/Button.js, so a test that reaches the code only through a Jest-only alias passes a layer check unseen

## Evidence

### Proof

- **ran (line ec95c1b18015):** node --test --test-name-pattern='openings with attributes' test/relations/extractors/typescript.test.mjs, at dba567a (test only) · **saw:** red: fail 1; the first component, 1 MB of '<script ' in a .vue file, took about 70 s against the 15 s bound
- **ran (line ec95c1b18015):** node --test test/relations/extractors/typescript.test.mjs and the TypeScript and JavaScript matrices, at the fix commit · **saw:** green: pass 211, fail 0; 1 MB of '<script ' and of '<script a="' in .vue and .svelte, and the run closed by one >, read in 86 ms in all; every existing sfcScriptView test unchanged
- **ran (line ec95c1b18015):** npm run check at 29c0bd4 · **saw:** tests 2848, pass 2845, fail 0, skipped 3 (the two Rust build tests without a toolchain, and one more skip as on the release branch); dist/ is fresh
- **ran (line ec95c1b18015):** node --test --test-name-pattern='openings with attributes' test/relations/extractors/typescript.test.mjs; at dba567a (test only), in a scratch clone · **saw:** red: fail 1 after 77249 ms: expected 77247.34 < 15000, the first component (1 MB of '<script ' in a .vue file)
- **ran (line ec95c1b18015):** node --test --test-name-pattern='linear time' test/relations/extractors/typescript.test.mjs; npm run check; at 29c0bd4, in a scratch clone · **saw:** green: pass 6, fail 0; the run of script openings with attributes (both openings in .vue and .svelte, and the run closed by one >) read in 64.8 ms; check: tests 2848, pass 2845, fail 0, skipped 3, dist/ is fresh

### Notes

The three skips of npm run check at 29c0bd4 are the two Rust build tests (no rustc or cargo 1.99.1 here) and the Go oracle test (go is not installed); none touches the TypeScript reader.

