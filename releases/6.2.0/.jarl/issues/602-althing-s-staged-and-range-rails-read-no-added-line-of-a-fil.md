# 602 · Althing's staged and range rails read no added line of a file whose path git quotes in a diff

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1504-ofxf
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363-opus
**Where:** the review of 363

## What
Althing's staged and range rails read no added line of a file whose path git quotes in a diff
rails/git.mjs addedLines, used by rails/run.mjs for pre-commit (staged) and pre-push (range), keys the added lines by the "+++" path as git prints it. A space in the path ends that line with a tab, and a non-ASCII letter, a double quote or a backslash makes it a quoted, octal-escaped path, so the key never matches the path from the file list and no line of such a file counts as added: pre-commit and pre-push report clean over a deny-listed word added to it (reproduced on a scratch repository with a test list: "rails range (1 commit): clean"). CI's tree scan still reads the whole file on the canonical repository, so it is caught after the push, too late for a public repository. Found while reviewing 363, whose gate shares the parser.

## Why


## Acceptance


## Evidence

