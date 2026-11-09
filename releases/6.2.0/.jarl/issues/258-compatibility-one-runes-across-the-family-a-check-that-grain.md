# 258 · Compatibility: one Runes across the family — a check that Grain (vendor), Yggdrasil (npm dependency), Horde (vendor) and Jarl (pin) point to the same Runes version

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1855-wqhy
**Tags:** compatibility, runes, workspace
**Files:** Althing/workspace/checks/pins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275

## What
Runes reaches the family by four routes (Grain and Horde vendor it, Jarl pins it, Yggdrasil depends on it from npm); Grain's contract test guards only the Grain–Yggdrasil pair. Amended under the ruling jarl-release-alone-with-every-jarl-issue and the architect's scope review of 2026-10-18 (section 7.2): Jarl 6.2.0 ships alone on the Runes 1.0.0 it vendors, while Grain and Horde move to Runes 1.1.0 and Yggdrasil depends on it, so a check that fails when the version labels differ fails by design. Between Jarl's pin and Runes release/1.1.0 today, the only difference in the paths Jarl vendors is dist/version.mjs (1.0.0 to 1.0.1); nothing in dist/cli, dist/mcp or the testkit files differs. The check therefore compares the vendored files, not the labels, and an older pin passes only as an exception the release manifest declares (repos.jarl.runes in releases/6.2.0/family.json, with the pin, its commit and the ruling; the rail does not refuse unknown fields).

## Why



## Acceptance
- One command (a script in the place settled by the decision on the family workspace) reads the four pointers. Where they name the same Runes, it passes as before; where a tool pins an older Runes, it compares the vendored files that tool's pin names against the release's Runes tag, file by file, and passes only when they are identical apart from dist/version.mjs and the manifest declares that exception for that tool (its pin, its commit and the ruling). Any other difference, or an undeclared one, is an error that names the files
- Tests: an identical pin passes; Jarl's declared exception with only dist/version.mjs different passes; the same with the exception removed fails; a planted difference in a file under dist/cli, dist/mcp or the testkit fails and names it
- Run in 224 before the family's tags; the result recorded. A Runes 1.1.0 change landing later in a file Jarl vendors turns it red, and the family then chooses between re-vendoring Jarl in a later Jarl release and keeping that change out of 1.1.0

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

