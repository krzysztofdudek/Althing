# 742 · Runes CI: the Rust case build test skips silently when the runner image's Rust is not the pinned 1.99.1, so a runner update turns the test off without a red

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261113T1813-mbay
**Tags:** ci, rust
**Files:** Runes/.github/workflows/ci.yml, Runes/test/relations/rust-cases-build.test.mjs
**Repo:** Runes
**Found by:** w-740-opus
**Where:** Runes release/1.1.0 at 8b0173d: test/relations/rust-cases-build.test.mjs skips where the pinned toolchain is missing or differs; .github/workflows/ci.yml installs no Rust toolchain of its own
**Branch:** jarl/740-runes-1-1-0-final
**Worker:** w-740-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 18:13

## What
The build test of the Rust catalogue runs only where rustc and cargo are the pinned 1.99.1, and is skipped otherwise. On GitHub it runs today because the runner images carry that version; when they move on, the test is skipped on every platform and the run stays green.

## Why
A test that turns itself off without a red is a false green (ruling quality-before-convenience); 733 showed this test is the one that catches platform faults in the Rust cases.

## Acceptance
- [test] On CI the Rust case build test runs under the pinned toolchain on Linux, macOS and Windows whatever the runner image carries (the workflow installs it), and where CI is set and the pinned toolchain cannot be had the test fails instead of skipping, with a test of that rule · by: npm run check
- [check] Runes CI on the pushed release/1.1.0 with the change runs the test on all three platforms (not skipped) · by: gh run view <run-id> --log

## Evidence

### Proof

- **ran (line e0e9c4270429):** node --test test/relations/rust-cases-build.test.mjs (at 6340669, the test before the fix) · **saw:** not ok: 'the Rust build tests fail on CI where the pinned toolchain is missing or differs, and are skipped with the reason elsewhere' (expected skip false, got the not-installed reason); pass 1, fail 1, skipped 2
- **ran (line e0e9c4270429):** node --test test/ci-workflow.test.mjs against the workflow of 6340669, then node --test test/ci-workflow.test.mjs test/relations/rust-cases-build.test.mjs at 9307a9c; and CI=true node --test test/relations/rust-cases-build.test.mjs at 9307a9c on a host without Rust · **saw:** old workflow: 'every job that runs the suite installs the pinned Rust toolchain before it' fails; at 9307a9c: pass 8, fail 0, skipped 2 (no Rust here, CI unset); with CI=true both build tests fail with the reason and the rule test passes
- **ran (line e0e9c4270429):** npm run check (at 9307a9c) · **saw:** tests 2684, pass 2681, fail 0, skipped 3 (the two Rust build tests and the Go oracle: no rustc, cargo or go on this host, CI unset); dist/ is fresh; exit 0

### Notes

Assumed: the workflow selects 1.99.1 through RUSTUP_TOOLCHAIN in GITHUB_ENV (bash on all three runners) instead of rustup default, so nothing outside the job changes; CI counts as set when CI is 'true', as tools/vendor.mjs reads it. The pinned version moves to the test helpers (PINNED_RUST) so the workflow test and the build test read one value.

