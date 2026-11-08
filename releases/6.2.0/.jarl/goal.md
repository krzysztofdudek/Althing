# Goal

The family's 6.2.0 release (Yggdrasil, Grain, Jarl) and Runes 1.1.0 — the renumbered loop of the 6.1.1 patch. The owner, 2026-10-05, chose the option 'Everything now, as 6.2.0' (option label; ruling release-6-2-0): we fix all of the loop's issues, branches release/6.2.0 (Yggdrasil, Grain) and release/1.1.0 (Runes), the family release protocol from the releasing-the-family skill. The loop's history since 2026-10-02:

Patch 6.1.1: bugs found in Yggdrasil and Grain. The owner, 2026-10-02: "fire up two big workflows, one for Yggdrasil, the other for Grain. Bug hunt. You will put it into Jarl under 6.1.1 if you find anything" (translated from Polish). Patches go per repo, on local release/6.1.1 branches, with no release without the owner's word.

## Assumptions

## Rules that apply here

One check per repository decides what lands there, mirrored from the release manifest (`releases/6.2.0/family.json`); the merger runs the repository's check on every merge, and a review stops a change but is recorded as testimony (ruling goal-check-lines):

- Check: Runes, `npm run check`
- Check: Yggdrasil, `cd source/cli && npm test` inside its devcontainer
- Check: Grain, `cd plugins/grain && npm test`
- Check: Jarl, `cd skills/jarl/scripts && npm test`
- Check: Althing, `yg check && npm test`
