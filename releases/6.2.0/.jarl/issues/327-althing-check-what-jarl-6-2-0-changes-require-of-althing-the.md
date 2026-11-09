# 327 · Althing: check what Jarl 6.2.0 changes require of Althing: the workspace, the rails, the skills and the briefs that drive a loop

**Status:** dropped
**Kind:** research
**Priority:** 2
**Tier:** standard
**Key:** 20261018T2020-anys
**Tags:** althing, jarl, compat
**Files:** workspace/ws.mjs, rails/loop.mjs, releases/6.2.0/briefs/merger.md
**Repo:** ../..
**Found by:** coordinator
**Where:** Althing's use of Jarl: ws jarl, ws brief, rails/loop.mjs, the skills that direct a loop, AGENTS.md
**After:** 313

## What
The owner, 2026-10-18: what about Althing? Not to be done now; this issue is the standing reminder that Althing, which drives every release loop through Jarl, must be checked against what Jarl 6.2.0 does before the next loop opens under it. It collects, and does not replace, the issues already filed for single points (284, 285, 286, 288, 291, 292, 293, 314, 315, 323). The check covers: (1) the driver pin: ws jarl refuses writes unless the driver checkout is on the pinned commit; decide what the pin becomes for the next release and how the 6.2.0 loop, which stays on its pinned driver until it closes, is told apart from loops opened later; (2) the loop rail: the issue file name (plain numbers), a format-only profile.json, the new files a loop can hold (repos.md, attachments' paths), a record at a higher format; (3) the briefs and ws brief: the worker, reviewer and merger instructions against the new behaviour (a review reply names the next step, merged records the check and cleans up, next lists only ready issues, models and the tiers, attachments, plain ids); (4) the skills that direct a loop and the rules in AGENTS.md and method/: statements that Jarl's new behaviour makes false or redundant, and the rule that Jarl's own texts speak only of the present; (5) ws doctor and ws jarl: messages and checks that assume the old record; (6) the hooks and CI of Althing against a loop written by the new Jarl (a record committed at a higher format). The outcome is a short note on this issue with the decision for each point and, where something is needed, the issue for it.

## Why
Althing is the place where Jarl is used the most; a change in Jarl that Althing does not follow shows up as a refused commit or a wrong instruction in the middle of a release.

## Acceptance
- Each of the six points has a written finding on this issue: no change needed, or an existing or new issue named
- A loop opened in a scratch copy of Althing under the Jarl 6.2.0 plugin passes ws doctor, the loop rail and a scripted pass through the briefs' commands; the run is recorded as a --ran/--saw row

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: They check Jarl 6.2.0 and what it requires of Althing, and Jarl 6.2.0 and 6.3.0 are published, with the loop already driven by 6.3.0. Ruling backlog-tidy-for-the-three-tools.

