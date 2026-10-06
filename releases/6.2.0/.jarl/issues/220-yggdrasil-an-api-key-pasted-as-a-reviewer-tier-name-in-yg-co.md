# 220 · Yggdrasil: an API key pasted as a reviewer tier name in yg-config.yaml is printed in full in the unknown-tier message

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, config, 6.2
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-ygg-020
**Where:**

## What
The reviewer of package 020 (064): after all leak paths from yg-secrets.yaml are closed, there remains the case of a key pasted as a tier name in yg-config.yaml — a file that is committed anyway, so the key is already exposed; the message repeats it.

## Why



## Acceptance
The unknown-tier message does not repeat a name that looks like a secret (or shortens it); test red→green.

## Evidence


