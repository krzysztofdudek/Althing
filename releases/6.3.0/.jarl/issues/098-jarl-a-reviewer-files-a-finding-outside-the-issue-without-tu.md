# 098 · Jarl: a reviewer files a finding outside the issue without turning its verdict to changes, and a scope that grows after the lease shows

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 096
**Found by:** owner
**Source:** research/2026-11-03-jarl-as-a-loop-tool#findings-outside-filed
**Where:**

## What
Ruling findings-outside-the-issue-are-filed. Today a reviewer's findings are one text: a gap outside the issue, written as Important, makes the verdict changes and sends the worker into a round on work nobody asked for; and the coordinator can widen an issue's acceptance while it is leased with nothing to show it.

## Why
A simple change grew over three rounds in the owner's other work for exactly these two reasons.

## Acceptance
- review takes findings outside the issue apart from its verdict; each is filed as a new issue whose finder is the reviewed issue, and a changes verdict whose only Critical or Important findings are outside the issue is refused with the command that files them instead
- A change to an issue's acceptance while it is leased prints a note that its scope grew after the lease, names the line, and is logged; report counts such changes per coordinator
- Tests for both

## Evidence

Ruling findings-outside-the-issue-are-filed-098: Same ruling as findings-outside-the-issue-are-filed, with its issue number corrected: the reviewer's way to file a finding outside the issue without turning its verdict to changes, and the note on a scope that grows after the lease, are issue 098 (097 is another issue). Krzysztof, 2026-11-03 (translated from Polish): "By default the worker and the reviewer judge the work they were given, and when they find something they put it into the backlog, and at most they report that the agent ran into something and ask what we do with it. But always recorded, not that we suddenly fix everything in the universe along the way." Built-in rules for the worker, the reviewer and the coordinator are in 086.

