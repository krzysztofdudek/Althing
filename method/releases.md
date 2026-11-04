# Releases

The policy behind a release of the family, and its reasons. The procedure, step by step, is the skill `releasing-the-family` (`.claude/skills/releasing-the-family/SKILL.md`). The open release's own rulings, in its loop, win over both.

## Versions

- **The core ships on one number** (`family-composition`): Yggdrasil, Grain and Jarl, with Jarl on it since 6.1.0 (`blocks-and-composer`) and Horde out of the family since 2026-11-04 (`horde-leaves-the-family`). They are one product, built and tested together, and any drift between them is paid for by whoever installed them.
- **The add-ons keep their own numbers.** Ratatoskr, Urd and Researcher depend on nothing and nothing depends on them, so tying them to the core would only make empty releases.
- **Runes has its own semver.** It is the code the core shares, infrastructure rather than a member, and a release pins the Runes version the core consumes.
- **A released version is final** (`released-version-is-final`). Work found after it goes into the next release. A published CHANGELOG section is never rewritten with later work; a sentence that misdescribed that release is corrected in place as an erratum (`changelog-erratum-in-place`).

## A release is a loop

Each release is designed and run as one Jarl loop (`releases-run-as-jarl-loops`) in its own directory, `releases/<version>/`, which stays as the release's record (`loop-in-release-directory`). The backlog, the rulings, the questions and the evidence live in one place that every session resumes from, so nothing about a release lives only in a conversation. One directory holds one loop (`one-loop-per-directory`): a renumbered release moves its directory, and a patch gets a directory of its own. How loops are run here is [loops](loops.md).

Beside the loop sits the manifest, `releases/<version>/family.json`: the repositories of the release, their versions, branches, exact commits and checks. It moves from `open` to `candidate` to `published`, and a published manifest is frozen. The loop says why; the manifest says what.

## Branches

- Every repository works a release on `release/<version>` (`release-branch-everywhere`). Worker branches merge into it, and reaching `main` is part of shipping, never part of the work.
- A remote keeps `main`, the release branch and the branches of open pull requests (`remote-keeps-main-and-release`). A branch with unique content is archived in the local clone before it goes.

## When it ships

- **Last, and on the owner's word** (`release-last-on-owner-word`). The release issue waits at the end of the queue, and the backlog stays open to new matters until he says to ship.
- **A false green is closed at once** (`ask-001`, 6.2.0). A fix that closes a false green ships blocking, with a "Before you upgrade" note, even though some repositories turn red after upgrading. A false green is the failure the family exists to prevent; shipping its fix as a warning would leave adopters trusting a wrong answer for one more release.
- **Nothing reaches the public without his word** (`autonomy-quality`): no publish, no tag, no push to a tool repository, except a branch a ruling names.

## The gates

A release is checked at four levels, each catching what the one below cannot:

1. **Each repository's own check**, on the exact commit that ships.
2. **Cross-surface truth** on Yggdrasil: the docs site, the knowledge topics, `yg prime`, the schema references and `--help` all say what the CLI does. A drift is fixed before the tag, never waived.
3. **The corpus gate**: real public repositories pinned at fixed commits, in every language the family claims, run through the whole stack as coarse end-to-end smoke tests. A tool's own tests prove it against the cases its authors imagined; a real repository brings the cases nobody imagined.
4. **The candidate verdict**: the workspace builds the manifest's exact commits and checks them against each other ([the workspace](../workspace/README.md)). Built today: the workspace's first commands. Where it is going: `ws run candidate`; until it exists, a person reads the verdict and records it on the release issue.

## The order to main

Runes reaches npm first, because Yggdrasil pins the published Runes, and a pin to an unpublished version is one no adopter can install. Yggdrasil follows, then Jarl. Grain follows, and the add-ons go last, each at its own number. Each step waits until the one before it is done, and each is the owner's word.

## Patches

A patch is not the family's release process: each repository patches on its own (`patch-per-repo`). It gets a patch backlog directory with its own loop and a manifest that moves that one repository, it passes the corpus gate, and it ships on the owner's word. A patch fixes a defect and adds no export, option or contract, which is what the third number of semver promises. When the work outgrows that, the patch becomes a release, as 6.1.1 became 6.2.0 (ruling `release-6-2-0` in the 6.2.0 loop).

## Closing

A loop closes in four moves: the ratification batch first, so the owner can answer before the loop goes; then the close; then the ledger pass, in which every ruling of the loop that outlives the release gets a pointer in [the ledger](rulings.md); then the freeze, after which the whole release directory is held byte for byte.
