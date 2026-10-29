# Gard in release 6.2.0: the plan from an empty repository to 1.0.0

Written 2026-10-29 (rulings `new-tools-in-6-2-0`, `shells-are-a-tool-of-their-own`, `gard-first-mimir-paused`). The design every issue is read against is `research/2026-10-29-mimir-and-gard/gard-design.md`; the reasons are in the `research/2026-10-29-mimir-and-gard/README.md` of the same folder. Every issue of Gard carries the tags `gard` and `workplace`; the tag of its area (`foundation`, `shell`, `worktrees`, `container`, `guards`, `git-gate`, `identities`, `drift`, `cleanup`, `windows`, `docs`) says where in the tool it is, and `port` marks code that moves from Mimir.

## Starting point

- `krzysztofdudek/Gard` is public and empty; the sibling checkout has no commit yet. The first issue makes `main`'s first commit and cuts `release/1.0.0` from it, which is the branch every worker branches from and the merger merges into.
- Gard depends on no family tool. Code that exists in Mimir (the git gate, the guards, the cleanup, the run script, the pair of branches, the tools container, the platform layer, the installer) is copied with its tests, from Mimir at `10257cd`; Mimir removes its copies later (433).
- Gard's check, once 361 writes it into the manifest and the goal: the suite and `yg check`, in Gard's own dev container.

## Before Gard's code

In Althing, now and in parallel:

| Issue | What | Tier |
|---|---|---|
| 359 | the registry's workplace kind, Gard and Mimir in it, the map | strong |
| 361 | the manifest and the goal with Gard 1.0.0 and Mimir 1.0.0 | standard |
| 362 | worker briefs for Gard and Mimir | standard |
| 363 | the names rail over a tool repository's pushed range | strong |
| 364 | the release procedure names the workplace tools | standard |
| 365 | research: does `yg` see a nested repository's files | strong |
| 366 | research: what Mimir and Gard share through Runes | strong |
| 360 | the canon and the thesis, on the owner's wording | strong |

## Packages

A package is one worker on one branch `jarl/NNN-slug`, its issues committed one by one. Waits are the issues' `After` lines; the table repeats the ones that order the packages.

| # | Issues (commit order) | Subject | Tier | Waits for |
|---|---|---|---|---|
| F1 | 367 | skeleton, package, licence | standard | — |
| F2 | 368, 372 | Gard's dev container, CI on three systems | standard | F1 |
| F3 | 369, 374 | command table and errors, test kit | strong | F1 |
| F4 | 370 | platform layer | strong | F3, 366 |
| F5 | 371 | the Yggdrasil graph | strong | F3 |
| F6 | 373 | pre-push names check | standard | F1, 363 |
| S1 | 375, 376, 377 | manifest, `init`, `repos sync` | strong | F3 |
| S2 | 378 | `where` | standard | S1 |
| W1 | 379, 380, 382 | views, list, remove, refresh, doctor | strong | S2 |
| W2 | 381, 412 | the shell in a view, the pair of branches | standard | W1 |
| C1 | 383, 384, 385, 386 | names, layered build, nothing on the host, same-path mount | strong | S1 |
| C2 | 387, 388, 392 | `run`, one volume per worktree, `verify host-clean` | strong | C1, W1 |
| C3 | 389, 390 | the whole application of a view, ports | strong | C2 |
| C4 | 391, 411 | the CI container and `check`, verified on a commit and drift | standard | C2 |
| H1 | 394, 463 | the plugin, the hook entry, the log of refusals | strong | S2 |
| H2 | 395, 396, 397, 464 | host-run, script-ban, temp, direct-git | strong | H1, C2, G1 |
| H3 | 398, 399, 400, 401 | disk, stray, team devcontainer, switches | standard | H1 |
| G1 | 402, 406, 465 | gard commit and gard push, the gate in a container, leftovers of an earlier gate | strong | S2, C2 |
| G2 | 403, 405 | rule directories and their API, the optional attribution rule | standard | G1 |
| I1 | 407, 408, 410 | tools container, pull requests through it, secrets | standard | C2 |
| I2 | 409 | browser profile per company | standard | I1 |
| D1 | 413 | Yggdrasil in a shell | strong | C4, G2, 365 |
| X1 | 414, 415 | cleanup report and apply | standard | C1 |
| P1 | 416 | the suite on a real Windows runner | strong | F2, C2, H1, G1 |
| P2 | 417 | install, update, uninstall | standard | H1 |
| P3 | 393, 421 | the `gard-init` skill, the product owner's example shell | standard | S1, C3 |
| E1 | 418, 419 | README, threat model | standard, strong | most of the above |
| R1 | 422 | field trial on three real shells | standard | E1, 463 |
| R2 | 423 | 1.0.0 prepared on the release branch | standard | P1, P2, E1, R1 |

Packages in one row of the "Waits for" column may run side by side: F2 to F6 after F1; S1 and C1 after F3; H1, G1 and the worktree packages as soon as `where` exists. Docker-dependent tests run on a machine with Docker and are skipped with the reason where it is missing, so a skip is never read as a pass.

## Through the family

- 424 moves the family's worktrees to Gard's layout once the owner answers a-026 on issues 346 to 354; 425 makes Althing's workspace run every repository through `gard run`.
- 420 (Copilot, Codex, Cursor) waits for the owner's word on probes with real accounts; Gard 1.0.0 serves Claude Code (ruling `gard-1-0-0-scope`, ratify a-024).
- Gard ships in the release issue, after the add-ons and before Mimir (364).

## Waiting for the owner

- Questions: a-026 (issues 346 to 354 against Gard's layout).
- Ratify items: a-022 (the workplace kind), a-024 (scope of 1.0.0), a-025 (Mimir's first loop archived).
- Issues tagged `needs-owner`: 360 (the canon's wording), 420 (other agent tools), 422 (the field trial on the owner's shells).
- Pushing Gard, tagging and publishing are the owner's word, as for every tool repository.
