# 260 · Jarl: an issue file name can end in a dash when the title is cut at 60 characters

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** jarl
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs
**Found by:** jarl
**Where:** skills/jarl/scripts/jarl-lib.mjs, slugify()
**Repo:** ../../../JarlSkill

## What


slugify() trims leading and trailing dashes and then cuts the slug at 60 characters, so a cut that lands just after a dash leaves the dash at the end of the file name (260-jarl-an-issue-file-name-can-end-in-a-dash-when-the-title-is-.md, and 47 issue files of this loop). The order of the two steps is the defect: cut first, then trim.

## Why


A file name ending in a dash is untidy, breaks the plain kebab-case convention other tools check for (Althing's loop/shape rail had to be loosened to accept it), and differs from the slug the same title gets when it is shorter.

## Acceptance


- slugify() cuts at 60 characters and then trims dashes, so no name it returns ends or starts with a dash; a unit test with a title whose 60th character is a space or punctuation.
- Existing issue files are never renamed by this change (Jarl reads the number from the file name, so old names keep working); the CHANGELOG says new files no longer end in a dash.

## Changelog
- Fixed: a new issue's file name no longer ends in a dash when its title is cut at 60 characters.

## Evidence

