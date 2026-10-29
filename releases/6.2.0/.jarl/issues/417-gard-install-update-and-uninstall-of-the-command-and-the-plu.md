# 417 · Gard: install, update and uninstall of the command and the plugin

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, foundation, port
**Files:** Gard/src/install, Gard/test/install.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: src/install (install.mjs, shim.mjs, path.mjs, plugin.mjs, windows.mjs, uninstall.mjs, update.mjs) and its tests

## What
gard install puts the command on the PATH (bash, zsh and fish on macOS and Linux, the user's PATH on Windows), installs the Claude Code plugin and says what it did; a development install links to a checkout instead of a package; update keeps the user's settings; uninstall removes exactly what install added and nothing of the user's. A missing or too old Node or git answers with the first command to run, in plain words.

## Why
Installation must be one command, and its removal must leave the computer as it was.

## Acceptance
- Tests in a fixture home install, install again with no change, update, and uninstall back to the fixture's original files byte for byte
- The owner's answer on macOS with bash, when ~/.bashrc exists and ~/.bash_profile does not (write the PATH block where a login bash reads it, or not), is recorded and the installer follows it

## Evidence

