# 029 · Jarl: every part of an issue's description can be changed by one command that logs the old value, and nothing in its history can be changed at all

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** Jarl 6.2.0: body <ids> --title changes the title and logs the old one; field takes only Resources and profile fields, so 'field 001 Tier strong' prints 'Tier is not a field'; Kind and Found by have no command at all. Jarl 6.1.0, the driver of the 6.2.0 and 6.2.1 loops, has no way to change a title: issue 181 of the 6.2.0 loop keeps a Polish title.

## What
The commands that change an issue grew one by one: body for the text and the title, prio, tag, files, repo, after and source for some header fields, field for profile fields. Tier, Kind and Found by have none, and each command logs a change in its own way.

## Why
An issue describes the work to be done, so any part of that description must be correctable when it was wrong. Its history (evidence, verdicts, merges, rulings, answers) proves what happened, so it is never changed, only retracted or superseded. One rule for each side keeps the done gate meaningful and saves the coordinator from hunting for the command.

## Acceptance
- Every part of the description (title, What, Why, Where, Acceptance, Changelog, priority, tier, kind, tags, files, repository, after, found by, source, profile fields) can be changed through a command, and every such change writes a log line with who changed it and the old value
- Status changes stay with set, which keeps its rules; evidence, verdicts, merges, rulings and answers have no edit command, only retract or supersede, and the reference says so in one place
- The help lists the description commands together, and a field name that cannot be changed is refused with the names that can
- Tests for each field, for the log line with the old value, and for the refusal

## Evidence

Ruling one-edit-rule-for-issues: Krzysztof, 2026-11-02 (translated from Polish), asked whether Jarl should be able to edit anything in an issue, as one consistent system, and on the proposal that every part of an issue's description is changeable with the old value logged while its history is only retracted or superseded, answered: "Yes". Issue 029 carries it into Jarl 6.2.1 and takes in 017.

