# 019 · A node mapped to the repository root ('/', './', '//') maps nothing: its enforced rules vanish silently and yg check passes; '.' pulls the graph's own .yggdrasil/ files into the rule's subjects, while ownership says the node has no file at all

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/utils/mapping-path.ts, Yggdrasil/source/cli/src/io/node-parser.ts, Yggdrasil/source/cli/src/io/paths.ts, Yggdrasil/source/cli/src/core/checks/mapping.ts, Yggdrasil/source/cli/src/io/hash.ts, Yggdrasil/source/cli/src/core/checks/architecture.ts, Yggdrasil/docs/configuration.md, Yggdrasil/docs/nodes.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/node-parser.ts:272 (validateRelativePath: escapesRepo(toPosixPath(entry)); toPosixPath strips the trailing slash, so '/' and '//' become '' and are not an absolute path); source/cli/src/utils/mapping-path.ts:32-33 (normalizeMappingPath: '/', '//', './' → ''; '.' stays), :96-98 (mappingEntryMatchesFile); source/cli/src/io/paths.ts:59 (normalizeMappingPaths drops ''); core/checks/mapping.ts:601 (mapping-path-missing only when mappingPaths.length > 0), :633ff (checkMappingEscapesRepo); io/hash.ts:234 (path.join(projectRoot, '.') walks the whole repo)
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
The parser rejects '' and '   ' (yaml-invalid) and '/src', but '/', '//' and './' pass, and then normalizeMappingPath turns them into '' (exactly what the parser rejects), normalizeMappingPaths throws them out, and for the pair expansion and the subject set the node is left with no mapping; mapping-path-missing does not fire, because the list is empty, and mapping-escapes-repo resolves '' to the root and stays silent. Reproduction (a fresh clone of v6.1.0 e5441101 built with npm ci + tsup, each variant in a separate fresh project with no lock; one type with when '**', node app, an enforced script rule refusing every subject): mapping ['src']: refused, FAIL, exit 1 (control). mapping ['/'], ['./'], ['//']: `yg check --approve --only-deterministic` ('fill pruned 1 verdict no longer expected') and `yg check --no-approve`: `PASS 1 node · 1/1 file covered (1 type-covered)`, exit 0, with no finding at all; the only trace is `yg context --node app`: 'Source files (0)' and 'Subjects: 0 files — vacuous'; `yg owner --file src/a.ts`: type:module, 'nothing from it enforces on this file'. Without a type covering src the file is only an uncovered warning, and the rule's disappearance shows only as a garbled 'type-when-mismatch File '' is in mapping of node 'app'' (architecture.ts gets the entry ''). mapping ['.']: the rule's subjects are 9 .yggdrasil/ files (yg-config.yaml, yg-architecture.yaml, the rule's check.mjs and yg-aspect.yaml, yg-node.yaml, .gitkeep files) plus src/a.ts, while at the same time `yg owner` and coverage say that no node has src/a.ts (type-covered), because mappingEntryMatchesFile('.', 'src/a.ts') returns false; this is the divergence the normalizeMappingPath docstring is meant to prevent. The part of the finder's report about '**' (graph files as subjects) is documented in docs/meta-modeling.md ('Never map the whole .yggdrasil/ directory') and is not part of this issue. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-16/logs/verify-16-root-mapping.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-16/repro.sh).

## Why
A false green: an enforced rule enforces nothing, and CI passes without a single finding. '/' is a natural way of writing 'the whole application', all the more since docs/configuration.md:306 says that coverage roots accept the same forms as a mapping entry and that '/' means the whole repo (utils/coverage-exclusion.ts:10, :23 treats it that way), and docs/configuration.md:325 promises that a node with a non-empty mapping and zero files 'needs to say so somewhere regardless of why the files vanished'.

## Acceptance
- The mapping entries '/', '//' and './' either map the whole repo consistently with coverage roots (and then the rule has subjects), or are rejected by the parser with a named code; none of them ends in PASS with an enforced rule that has no subjects.
- For '.', ownership (yg owner, coverage) and the subject expansion agree, and .yggdrasil/ files do not become subjects without an explicit mapping.

## Changelog
- Fixed: a mapping entry naming the repository root (/, //, ./ or .) is refused when the node loads, with an error naming the entry, instead of mapping nothing (an enforced rule passed with no subjects) or, for '.', making the graph's own .yggdrasil/ files subjects.

## Evidence

- **ran:** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

