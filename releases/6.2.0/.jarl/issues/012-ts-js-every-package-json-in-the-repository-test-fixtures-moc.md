# 012 · TS/JS: every package.json in the repository (test fixtures, mocks) is indexed like a workspace package, so a bare import of an installed dependency binds to a fixture of the same name

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-wycp
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/typescript-resolve.mts, Yggdrasil/docs/relations-flows-ports.md, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/typescript-resolve.mts: makeTsResolveDeps → packageIndex (l.470-495, byName.set l.492), resolveBare (l.120-149), resolveWorkspacePackage (l.162-190); Yggdrasil source/cli/src/relations/resolve-path.ts:25-34 (guardedResolve passes only the nested-projects predicate and coverage.excluded)
**Branch:** jarl/010-ts-resolve
**Merged:** 3fb8352 in ../../../Runes
**CI:** none

## What
packageIndex walks the whole repo (skipping only dot directories, node_modules/bower_components/jspm_packages and paths from coverage.excluded), indexes every package.json by `name` and never reads the root `workspaces`, pnpm-workspace.yaml or the importing package's dependencies; resolveWorkspacePackage binds a bare specifier that paths/baseUrl did not resolve to any such package and does not check whether it would lose to an installed node_modules/<name>. A second package with the same name turns the entry into 'ambiguous', that is, silence. Reproduction (clone v6.1.0 e5441101, `yg check --no-approve`): A without a fixture: PASS. B: workspaces [packages/*]; packages/resolver/test/fixtures/lodash/package.json with name "lodash"; packages/app imports lodash from node_modules; Node and `tsc --traceResolution` resolve to node_modules/lodash, yg: FAIL `packages/app/src/index.ts:1 → resolver`. C (B + coverage.excluded on the fixtures): PASS, the workaround works at the cost of coverage. D0 (app imports the workspace member @acme/resolver): a correct edge. D1 (D0 + a fixture elsewhere named @acme/resolver): PASS, the real edge goes silent. Real repos: jestjs/jest @202dd8a1: 3 blocking edges e2e/... → packages-jest-resolve, because require('foo') binds to the only package.json named foo, the mock packages/jest-resolve/src/__mocks__/self-ref/foo (while e2e/pnp has `portal:./lib`, e2e/custom-resolver its own resolver); excluding the mocks directory removes all three. facebook/react @7c6ac13e: 6 blocking edges from the eslint-plugin-react-hooks tests to fixtures, because require('eslint-v7'/'eslint-v8'/'eslint-v9') are npm aliases (npm:eslint@…) declared in the plugin's package.json, and fixtures/eslint-v7|8|9 are test applications with those names; root workspaces [packages/*]. Correction: the root workspaces of jestjs/jest are ["packages/*","website","examples/*"]; the mock is outside the globs anyway. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-9/repro.log (scenarios A/B/C/D0/D1, script repro.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-9/real.log (real.sh, graph.sh).

## Why
False, blocking relation-undeclared-dependency in two large monorepos, and silently lost edges on a duplicate name. Mapping a package directory together with its fixtures and mocks is normal; the only ways out are a false relation declaration or an exclusion from coverage. The rule 'an in-repo package whose package.json name matches' (relations-flows-ports.md:99) is documented, but the result clashes with promises from the same document: 'probed the way the compiler probes it' and 'designed to stay silent rather than guess'.

## Acceptance
- A bare specifier binds only to a workspace member (root workspaces, pnpm-workspace.yaml, packages linked in node_modules) or to a package declared in the importer's dependencies; a fixture outside the workspace globs is not importable by name (scenario B: PASS, jestjs/jest and facebook/react without false edges).
- A fixture named like a workspace member does not silence the real edge (D1 reports the edge); docs/relations-flows-ports.md:99/:103 describe the new rule; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: a bare TypeScript or JavaScript import binds first to the package the importing package.json declares under that name with a file:, link:, portal: or workspace: spec; otherwise, in a repository that declares a workspace (package.json workspaces or pnpm-workspace.yaml, brace globs included), it binds only to a workspace member, so a test fixture or mock named like an installed dependency no longer gives a false edge and a fixture copying a member's name no longer silences the real one.

## Evidence

jarl: the rule of the importer's own local dependency (file:/link:/portal:/workspace: in the repo) also applies in a repo with no workspace declaration — acceptance 012 requires it, and it removes a false binding, so it fits within patch-scope despite D2
- **ran (history):** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1549, pass 1549, fail 0, catalogue 470 cases, dist/ is fresh; npm run coverage: tests 1549, pass 1549, fail 0, all files 98.76 / 94.00 / 98.57, exit 0; merge 3fb8352 (catalogue count merged silently at 465 by both sides, corrected to 465 + 5 = 470 in the merge)

jarl: commit 985fac8 (brace expansion in workspace globs) checked in the re-review rev-runes-010: a real npm workspace with plain, nested and negated braces — the resolver agrees with npm on 13 packages, 1.0.0 had 6 false bindings

