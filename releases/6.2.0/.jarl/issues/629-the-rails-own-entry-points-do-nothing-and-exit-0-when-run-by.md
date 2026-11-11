# 629 · The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symboli…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1807-icfn
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363g-fable
**Where:** the review of 363

## What
The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symbolic link: rails/run.mjs:219, rails/names.mjs:266, rails/english.mjs:252 and workspace/blind-starts.mjs:256 keep the run-directly check that 8c71e7a replaced in workspace/ws.mjs (import.meta.url, which node resolves through links, against process.argv[1] as given). Reproduced on a scratch copy: node <linked path>/rails/run.mjs range <base> <head> --require-key prints nothing and exits 0, where the real path refuses with exit 1; rails/names.mjs the same; the other two by reading. Althing's own hooks call rails/run.mjs by a relative path, which node resolves to the real folder, so they are not affected (checked from inside a linked folder); a scan by hand or a script that names the file by a linked absolute path sees a silent success (found in the review of 363 at 8c71e7a, beside 626)

## Why


## Acceptance


## Evidence

