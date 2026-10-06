# 027 · Repositories with husky: yg init says to add yg log merge-resolve to .husky/_/post-merge, husky's generated and ignored wrapper, where the added line never runs and the next npm install removes it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/init-scaffold.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/init-scaffold.ts: ensureMergeDrivers; `git rev-parse --git-path hooks/post-merge` :227 (under husky v9 = .husky/_/post-merge); the existing-hook branch :233-240 (note :237) is checked before the core.hooksPath branch :241-249 (path.dirname(hookPath) :242/:246)
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
Reproduction (clone of v6.1.0 e544110 built with npm ci + build, Node 24.11.1, husky 9.1.7): `npm i -D husky@9` and `npx husky init` set core.hooksPath=.husky/_; `yg init --no-reviewer` prints 'note: No post-merge hook installed: <repo>/.husky/_/post-merge exists and is not Yggdrasil's, so it was left as it is.' and 'fix: Add a line running yg log merge-resolve to <repo>/.husky/_/post-merge.' After adding two lines exactly as the fix says (an echo of a marker and yg log merge-resolve) and a real merge, the marker does not appear: husky's h script, which the wrapper sources, always ends the shell (`[ ! -f "$s" ] && exit 0` … `exit $c`), so nothing after `. h` runs. `git check-ignore -v` reports `.husky/_/.gitignore:1:*`, `git ls-files` says the file is not tracked. `npx husky` (prepare on npm install) regenerates the wrapper and the line disappears. Control: the same lines in .husky/post-merge work on the next merge (the marker and the merge-resolve output are visible). `yg init --upgrade` prints the same wrong note. The note from issue 531 about core.hooksPath does not appear here, because the existing-hook branch is checked first, but swapping the order alone is not enough: the hooksPath branch would point to the .husky/_ directory, which is also generated and ignored (hookspath-branch.log). After a merge without a working hook, `yg check` stays PASS with a non-blocking log-cycle-open warning, which a manual merge-resolve clears. Lefthook (hooks generated in .git/hooks/post-merge) may hit the same branch; not reproduced. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-24/logs/husky-verify.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-24/scripts/husky-verify.sh), hookspath-branch.log, safety-net-full.log.

## Why
docs/cli-reference.md:2524 promises that fix: names the hook to edit by hand; under husky v9, the most common hook manager in npm projects, that is a generated wrapper, so the user does exactly what they were told and the hook never works. The effect is a warning-level gap (log_required is not enforced until a full approve), with no data loss.

## Acceptance
- When core.hooksPath ends in `/_` and the directory has husky's h script, the note names <dirname(hooksPath)>/post-merge (.husky/post-merge), also in the existing-hook branch.
- The note never names a file that `git check-ignore` reports as ignored.

## Changelog
- Fixed: Under husky v9, yg init's note about the post-merge hook names .husky/post-merge, the hook that runs, instead of husky's generated .husky/_/post-merge wrapper, where an added line never runs and the next install removes it; the note never asks for a line in a file git ignores.

## Evidence

merged into release/6.1.1 at 387472893, gate green
- **ran:** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

