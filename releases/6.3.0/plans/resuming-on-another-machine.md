# Resuming the 6.3.0 loop on another machine

Written 2026-11-04 when the work was paused. Everything the loop knows is in `releases/6.3.0/.jarl/` in this repository. Everything the code knows is in the JarlSkill repository, and part of that exists only on the machine that did the work until the bundle or a push carries it over (see "The code").

## Where the work stands

- Jarl 6.3.0, one coherent version on Jarl alone (ruling `release-6-3-0-one-coherent-version`). Runes work is stopped where it stands and Jarl ships on Runes 1.0.0 (ruling `only-jarl-now`).
- 45 issues done, 14 dropped (folded into larger ones or filed in the wrong loop), 1 deferred, 55 open, 1 in progress (028 waits for CI on `main` at release). Nothing else was in flight when this was written. `node workspace/ws.mjs jarl status --release 6.3.0` says the current numbers.
- The release branch of JarlSkill is still named `release/6.2.1`. Renaming it to `release/6.3.0` and pushing it are the owner's decision and have not been taken.
- Every merged issue went through a fresh reviewer and a full suite on the release worktree. The last recorded full suite was 1116 tests, 0 failures, 23 skipped, at release commit e100b8b (issue 084 merged, the last of the format-raising issues).

## The code

- The release branch `release/6.2.1` of JarlSkill is 172 commits ahead of `main` and was never pushed. Thirty-odd worker branches `jarl/NNN-slug` exist only locally, and the ones for merged issues are no longer needed.
- A `git bundle` of the release branch and the live worker branches is in the owner's exchange folder as `Jarl 6.3.0 code.bundle` (40 branches: `main`, `release/6.2.1` at e100b8b and 38 `jarl/…` branches; `git bundle verify` passes). On the new machine: `git clone git@github.com:krzysztofdudek/JarlSkill.git ~/repos/github.com/krzysztofdudek/JarlSkill`, then `git -C <clone> fetch "<bundle>" 'refs/heads/*:refs/heads/*'` (use `+refs/heads/*:refs/heads/*` if git refuses to update the checked-out `main`). If the owner has pushed the branch instead, `git fetch origin` is enough.
- The merger's worktree is `~/Worktrees/JarlSkill/release` on the release branch (the host's rules put every working copy under `~/Worktrees/<Repository>/<name>`, ruling `host-rules-place-worktrees-and-scratch`): `git -C ~/repos/github.com/krzysztofdudek/JarlSkill worktree add ~/Worktrees/JarlSkill/release release/6.2.1`. The suite runs in `skills/jarl/scripts` with `TMPDIR` set to a folder made by `mktemp -d` under the system temporary directory, as `nice -n 15 timeout 2400 npm test`, in the background, never two at once.
- The driver Jarl, which writes this loop, is a detached worktree of JarlSkill at the commit `releases/6.3.0/family.json` names (`2c12aa3e11af2a0cbb0895db85e6246ae998174d`): `git worktree add --detach ~/Worktrees/JarlSkill/driver 2c12aa3e11af2a0cbb0895db85e6246ae998174d`, then `git worktree lock` it. The machine's tidy-up job removes unlocked worktrees whose head is on `origin/main`, so lock both the driver and the release worktree. `ws.local.json` (ignored by git) maps `jarl` to the driver worktree; copy the shape from `method/environment.md`.

## Setting the machine up

1. Clone Althing and the sibling repositories (`method/environment.md`), `git pull --ff-only`.
2. `yg check`, then `node workspace/ws.mjs doctor`. The names key comes from the owner; without it the machine is a contributor's machine and cannot push to the canonical Althing.
3. `node workspace/ws.mjs status`, then `node workspace/ws.mjs jarl resume --release 6.3.0`. Never re-derive what the record says.

## How the loop is run

- Worker per issue in its own worktree `~/Worktrees/JarlSkill/<NNN-slug>` on branch `jarl/NNN-slug` cut from the release branch; lease it with `ws jarl set <id> in-progress "<why>" --branch … --worker … --worktree …`; brief with `ws brief worker --release 6.3.0 --repo jarl --issue N --trailer "…"`; a fresh reviewer is briefed the same way with `reviewer`.
- Models come from the `model-choice` skill: Haiku at max for small test-decided issues (the brief adds the honesty rule: a proof row only for a command really run), Sonnet at high for ordinary ones, Opus at high for format and core work, Opus at xhigh for reviews of Opus work. A reviewer is never of a weaker tier than the worker and never Fable (ruling `no-fable-model`). Small Haiku issues share a review of at most four.
- A worker judges only its issue; anything else it finds is filed, never fixed on the side (ruling `findings-outside-the-issue-are-filed-098`). After three rounds a fresh strong worker takes over with a changed approach.
- Any line shape that the pinned 6.1.0 driver, Horde or Jarl 6.2.0 would misread rides the one format raise to format 3 through `needFormat` in `lib/profile.mjs`; a composer's loop is never raised (rulings `one-format-raise-horde-later` and `older-reader-says-needs-format-3`).
- Merge with `git merge --no-ff` in the release worktree, run the suite there, then `ws jarl evidence … --ran … --saw …`, `ws jarl merged <id> --sha <sha> --ci none --repo ../../../JarlSkill`, `ws jarl set <id> done "…"`, remove the worker worktree by name, commit the loop state in Althing and push it (`ask-012` grants the push when the rails are green).
- The one known flaky test, `resume stays fast`, was reworked in issue 101; limits of the new bound are issue 111.

## What is left

- The format-3 core is in: 083 (the raise), 084 (issue keys), 085 (slices, the writer, escalations), 086 (scoped rules), 052 (`next --as`), 008 (handover), 019, 039 (owner ticks), 073 (promise and wait kinds).
- Next, in this order (the After graph in the loop is authoritative): 096 (the normalized command surface; old forms out, after 085 and 086), 042 and 068, then 058 and 078, 098, 044 and 049, 007; 088 (the word budget of the guidance) and 076 (the six end-to-end scenarios, then the live run) last. 004, 016, 043, 074, 079, 087 and 091 are P1 or P2 and independent.
- Not started: all the small P3 issues filed from reviews (103 to 120 and older ones). Several are follow-ups of merged issues; read each issue's What before leasing it.
- Everything else is small and independent: package it for Haiku with grouped reviews of at most four (the owner ruled `all-minors-stay-in-6-3-0`: nothing slips to a patch).
- Before the release: 028 closes when CI is green on the release's `main`; the family manifest's JarlSkill branch name and the Althing skills and briefs move to the 6.3.0 command forms only when Althing's driver moves to 6.3.0 (issues 096 and 115).
- The owner's words are still needed for: renaming and pushing the JarlSkill release branch, the tag, publishing, and merging into JarlSkill `main`.

## Pointers

- The model and design: `research/2026-11-03-jarl-as-a-loop-tool/report.md`.
- The field report the version answers: `research/2026-11-03-jarl-field-report-long-loop/`.
- Rulings of the loop: `node workspace/ws.mjs jarl decisions --live --release 6.3.0`; the standing ones are in `method/rulings.md`.
- The Jarl Evolution session in T3 Code owns the design and files issues into this loop; pull before committing, because it also pushes to Althing `main`.
