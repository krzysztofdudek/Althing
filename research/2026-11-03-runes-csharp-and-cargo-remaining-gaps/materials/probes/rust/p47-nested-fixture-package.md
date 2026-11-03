---
id: p47-nested-fixture-package
language: rust
category: import
expectation: silence
cites: "The Cargo Book, The manifest format (a package is the directory of its Cargo.toml); Rust Reference, Paths (`crate`)"
---

## Rule

A test fixture package `tests/fixtures/demo/` has its own Cargo.toml and `src/lib.rs` declaring `mod config;`. In `tests/fixtures/demo/src/run.rs`, `crate::config::C` is the fixture's own `tests/fixtures/demo/src/config.rs` (same owner src), never the outer package's `src/config/mod.rs` (node config).

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod config;
```

```rust path=src/config/mod.rs
pub struct C;
```

```toml path=tests/fixtures/demo/Cargo.toml
[package]
name = "demo"
edition = "2021"
```

```rust path=tests/fixtures/demo/src/lib.rs
mod config;
mod run;
```

```rust path=tests/fixtures/demo/src/config.rs
pub struct C;
```

```rust path=tests/fixtures/demo/src/run.rs
use crate::config::C;
```

## Expect

- silence
