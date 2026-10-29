# 393 · Gard: the gard-init skill sets up a shell for a repository with an agent

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, shell, docs
**Files:** Gard/plugin/skills/gard-init
**Repo:** ../../../Gard
**After:** 377, 389, 392
**Found by:** owner
**Where:** the owner, 2026-10-24: a GitHub repository with the plugin and a skill that installs the setup through the agent

## What
A skill of Gard's plugin that an agent follows to give a repository a shell: read the repository (languages, package managers, an existing dev container, the services it needs), propose the shell's manifest in plain words and wait for the user's yes, write it into the shell (never into the team's repository), sync the repos, build the container, run gard verify host-clean on the repository's own install and tests, and report what works and what is the application's own work to make come up.

## Why
Setting up a shell must be one request to an agent, for any repository, without the user writing a manifest by hand.

## Acceptance
The skill names every step above with the command it runs, and a recorded run on a fixture repository ends with a shell whose verify host-clean is empty

## Evidence

