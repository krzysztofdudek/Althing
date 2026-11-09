# 077 · The next: line and suggestedNext give the incomplete command 'yg knowledge read', which fails with 'missing required argument'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-tues
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/formatters/check-render-views.ts, Yggdrasil/source/cli/src/formatters/aspect-status-messages.ts, Yggdrasil/source/cli/src/io/aspect-parser.ts, Yggdrasil/source/cli/tests/e2e/cli-next-executes.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/formatters/check-render-views.ts: blockAction :280-294 (leadingCommand, then namedGraphFile, then embeddedCommand); embeddedCommand :151 passes the text after 'See: ' to leadingCommand :124, whose subcommand test :134 accepts a third bare word only after a group in THREE_WORD_GROUPS (an empty set), and the fallback :137 keeps only quoted or path-like words; the fix in formatters/aspect-status-messages.ts:18 (aspect-status-invalid) and :111 (aspect-status-downgrade) ends with 'See: yg knowledge read aspect-status.'; namedGraphFile :167 does not win, because aspect-status-invalid gets an absolute aspectDir (graph-loader.ts:403 → aspect-parser.ts:708-711), and describeAttachSite (aspect-status-messages.ts:52-70) names no file for a flow, ancestor or port site
**Branch:** jarl/032-check-report
**Merged:** 27d1e12f8f5b3f49d31a66d8c13078164c0c909e
**CI:** none

## What
Reproduction (a fresh clone HEAD 2493aa16 = v6.1.0 and npm @chrisdudek/yg@6.1.0, a new directory, custom scripts): Case 1, a rule with the typo `status: enforce`: the fix 'Edit <temporary project>/.yggdrasil/aspects/no-sync/yg-aspect.yaml … See: yg knowledge read aspect-status.' (an absolute path), then 'next: yg knowledge read'; in --json, suggestedNext 'yg knowledge read' and next.command ["yg","knowledge","read"] with target {} and requiresUser false; running that command gives "error[usage]: missing required argument 'name'", while `yg knowledge read aspect-status` works. Case 2, a flow attaches a rule with `status: advisory` (aspect-status-downgrade): the same next: line, suggestedNext and next.command. Variants: a downgrade declared in the node's yg-node.yaml gives a correct 'next: edit .yggdrasil/model/app/yg-node.yaml', and on the type 'next: edit .yggdrasil/yg-architecture.yaml' (which is why the golden status-downgrade/check.txt passes); the defect concerns aspect-status-invalid and aspect-status-downgrade from a flow, ancestor or port site. aspect-review-by-malformed and implies-status-inherit-invalid from the same file pass the same absolute aspectDir (not run; their next: falls back to a sentence, not to a broken command). tests/e2e/cli-next-executes.test.ts has no aspect-status case. Issues 234 and 348 from 6.1.0 moved most steps onto emitter data (234 notes that about 108 codes still use the prose fallback); neither covers this truncation. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-46/logs/verify-46.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-46/repro.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-46/logs/verify-46-part2.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-46/repro2.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F5-next-knowledge-read.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/F5-next-knowledge-read/repro.sh.

## Why
docs/cli-reference.md (~l.406) defines next.command as null when it is not a single runnable command, and (~l.612) says the step comes from the emitter's data, with the fix's words supplying at most a graph file; an agent told to run next: runs a command that fails, and a JSON consumer gets a non-runnable argv. The full text is in the fix: line, and the usage error has its own next, so minor.

## Acceptance
aspect-status-invalid and aspect-status-downgrade (also from a flow, ancestor and port site) pass the step as data (IssueMessage.step), e.g. 'edit .yggdrasil/aspects/<id>/yg-aspect.yaml' or the flow file, and leadingCommand never truncates a positional argument; in both repro cases next.command is runnable or null, the aspect path in the fix is repo-relative, and cli-next-executes.test.ts has both cases.

## Changelog
- Fixed: for an invalid or lowered rule status, next: and next.command no longer offer the incomplete 'yg knowledge read'; the step is the file that declares the status, named from the repository root.

## Evidence

- **ran (history):** git commit (merge of jarl/032-check-report into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.19%; [repo-check] All checks passed; [release/6.1.1 27d1e12f8] Merge jarl/032-check-report

