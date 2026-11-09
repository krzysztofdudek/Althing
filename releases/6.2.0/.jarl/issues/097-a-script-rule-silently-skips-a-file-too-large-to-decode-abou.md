# 097 · A script rule silently skips a file too large to decode (about 512 MiB and more), and the pair is recorded as approved and stays valid on every later yg check

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-jobx
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/structure/hook-loader.ts, Yggdrasil/source/cli/src/core/pairs.ts, Yggdrasil/source/cli/src/io/graph-fs.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/structure/hook-loader.ts:141-146 (buildOwnFiles: `content = fs.readFileSync(abs).toString('utf8')` inside `catch { continue; // unreadable — skip }`, per: file and per: node) and :596-601 (buildNodelessUnitCtx for type coverage: `catch {/* unreadable — skip */}`); related :166-176 (the lazy read treats a decode error like recordReadAbsent and supplies ''); the guard core/pairs.ts:509-547 ('Step 2.5') uses probeUnreadable from io/graph-fs.ts:52-59, which only does access(R_OK); the hash io/hash.ts:53-56 (hashFile) reads the raw bytes without decoding, so the verdict stays valid
**Branch:** jarl/069-reviewer-subjects
**Merged:** 9f4ce909d72a1ebd6916d4a2c3bbd51c64a941db
**CI:** none

## What
Reproduction (yg 6.1.0 from npm, Node v24.11.1, a clone from GitHub for the code, own scripts, no key and no reviewer; a sparse .sql file of 629 145 601 bytes starting with '-- TODO'; check.mjs writes what it got in ctx.files to a side file): A. (the issue's repro, per: file, small.sql + dump.sql): small.sql is refused; dump.sql lands in .yg-lock.deterministic.json as {"touched":[],"verdict":"approved"}, while the check got {"files":[]}; decoding in Node gives ERR_STRING_TOO_LONG (limit 0x1fffffe8 characters). B. only the large file: `yg check --approve --only-deterministic` PASS, exit 0, and then `yg check --no-approve` as in CI also PASS, exit 0, with totals.verdicts.approved = 1. C. per: node: node:data approved with an empty ctx.files, so wider than in the issue. D. control: a small file after chmod 000 gives a blocking error[file-unreadable] and the check does not run. E. control: the same TODO line in a 5 MiB file is refused. Type coverage without a node: the small file refused, the large one approved with an empty ctx.files (the second place, :596-601). In a git repo with the file committed: still PASS with approved. Correction to the issue: lines 596-601 are the nodeless type path, while the issue's repro goes through buildOwnFiles 141-146; both places are affected and both were checked. hook-loader.ts identical at tag v6.1.0 and on origin/main 2493aa16. This is not 047, 204, 438 or 088 of 6.1.0. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-69/logs/huge-file-script-rule.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-69/repro-huge-file.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-69/logs/huge-file-script-rule-typelevel.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-69/logs/huge-file-script-rule-git.log; issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/07-huge-file-script-rule-fail-open.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/07-huge-file-script-rule-fail-open.sh.

## Why
The comment pairs.ts:511-514 says that Step 2.5 exists 'so a deterministic check can never run over a silently-shrunk subject and pass vacuously', the file-unreadable registry (utils/issue-code-registry.ts:270, docs/cli-reference.md:2941) covers a source that cannot be read or that exceeds the limit, and the content-filter path already fails closed on a file that is too large (pairs.ts:474-490). This is a real opening of the gate, but it needs a mapped, non-ignored file of about 512 MiB or more without a binary extension, so minor.

## Acceptance
A subject larger than buffer.constants.MAX_STRING_LENGTH (or one whose read or decode fails in hook-loader) gives file-unreadable or an unverified disposition, never approved: in scenarios A, B, C and in the nodeless variant the large file's pair is not recorded as approved, and `yg check --no-approve` ends with exit 1 (a test).

## Changelog
- Fixed: A mapped file too large to read as text (over about 512 MiB) no longer passes a script rule unchecked — it is a blocking file-unreadable error and no verdict is recorded over it; files binary by extension are not affected.

## Evidence

- **ran (history):** git commit (merge of jarl/069-reviewer-subjects into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 9f4ce909d] Merge jarl/069-reviewer-subjects

