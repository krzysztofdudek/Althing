# 081 · file-mapping-gitignored blames .gitignore for files nothing ignores (an entry differing in letter case on a case-insensitive file system, an NFD name on disk and NFC in the mapping), and its wrong advice becomes the run's next: line

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-flmc
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/checks/mapping.ts, Yggdrasil/source/cli/src/core/validator.ts, Yggdrasil/source/cli/src/io/graph-fs.ts, Yggdrasil/source/cli/src/io/repo-scanner.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/checks/mapping.ts:45-99 (checkFileMappingGitignored: statPath :48-49 from io/graph-fs.ts:61 is a plain stat, which follows a link and on APFS/NTFS ignores letter case and Unicode normalization; :87 an exact lookup of the entry text in the set from walkRepoFiles; :89-99 emits file-mapping-gitignored without checking any ignore source); core/validator.ts:261 runs this check before checkMappingPathsExist (:267), which emits mapping-path-case-mismatch (mapping.ts:548-560); onDiskSpellingIfCaseDiffers (mapping.ts:480-514) compares only through toLowerCase; a positive probe already exists: isFileGitignored in io/repo-scanner.ts:62
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
Three independent reports of the same cause (find-5, find-10 and the 'SRC' half of find-4), confirmed in verify-50, verify-67 and verify-47 (case-insensitive macOS APFS, yg built from a fresh v6.1.0 clone; mapping.ts unchanged on main 2493aa16). (A) Letter case: on disk src/Util.ts, node app/util maps 'src/util.ts'; nothing ignores the file (core.ignorecase=true, `git check-ignore -v --no-index src/util.ts src/Util.ts` exit 1, no .gitignore at the root, an empty info/exclude, no global excludesFile). `yg check` → FAIL with error[file-mapping-gitignored] "File 'src/util.ts' ... is excluded by .gitignore" (fix '1. Remove the file from .gitignore') next to a correct error[mapping-path-case-mismatch]; 'next: Remove the file from .gitignore (if it should be tracked code) (file-mapping-gitignored — 2 errors need a code or graph fix)', in --json next.text the same, command null; `yg context --node app/util` refuses with both errors. Control: mapping 'src/Util.ts' → PASS; a file really ignored by .gitignore (check-ignore exit 0) gets file-mapping-gitignored as documented. The same for 'SRC/a.ts' in a repo without any .gitignore (verify-47): three errors, including a false file-mapping-gitignored, and next: 'Remove the file from .gitignore'. (B) Unicode normalization: a file name stored on disk as NFD 'café.ts', the mapping typed as NFC: the only errors are a false file-mapping-gitignored and error[unmapped] src/m0/café.ts, which looks identical to the mapping entry; nothing mentions normalization, and next: again points at .gitignore (on Linux the same graph would get mapping-path-missing). (C) A committed symlink in the repo (mode 120000) with no ignore rule also gets a false file-mapping-gitignored with the same next:, but this case is already in issue 022 (its Acceptance requires that the message for a symlink not speak of .gitignore). The code itself states the rule it breaks here: io/repo-scanner.ts:625-627 'absence from the walk alone is never proof of a gitignore match'. This is not 179, 341, 482 or 490 from 6.1.0, nor 187 (which added the case check). Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-50/logs/case-gitignored-run-1.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-50/scripts/case-gitignored.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-67/logs/repro-run-1.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-67/scripts/repro.sh, working directory <the session scratchpad, since lost>/bughunt/yggdrasil/verify-67/runs/run-20261002093426-99276), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-47/logs/verify-47-mapping-spelling.log; reports <the session scratchpad, since lost>/bughunt/yggdrasil/find-5/logs/case-gitignored.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/find-5/scripts/case-gitignored.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/05-false-gitignored-diagnosis.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/05-false-gitignored-diagnosis.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F7-mapping-spelling-false-errors.log.

## Why
The code registry (utils/issue-code-registry.ts:265) and docs/nodes.md:71 define file-mapping-gitignored as an entry that names a gitignored file, and the docs say that a separate file-mapping-excluded exists so as not to blame 'a .gitignore rule that may not even exist'. Agents run next: literally, so they edit a .gitignore with no matching rule or remove the mapping. The gate still blocks, and in (A) the correct error stands next to it, so minor; (B) is left without any real diagnosis.

## Acceptance
- file-mapping-gitignored is raised only for a path that git or the .gitignore stack really ignores (positive confirmation through isFileGitignored or `git check-ignore`): in (A), in the 'SRC/a.ts' variant and in (B) this code does not appear, and the control with a real .gitignore rule still gives it (e2e test).
- When a specific error fires (mapping-path-case-mismatch), it sets next:; a difference only in Unicode normalization gets its own diagnosis naming NFD and NFC instead of a bare error[unmapped].

## Changelog
- Fixed: file-mapping-gitignored is reported only for a file git really ignores; a letter-case or Unicode normalization (NFC/NFD) difference is named as mapping-path-case-mismatch, and next: no longer tells you to edit a .gitignore with no matching rule.

## Evidence

- **ran (history):** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

