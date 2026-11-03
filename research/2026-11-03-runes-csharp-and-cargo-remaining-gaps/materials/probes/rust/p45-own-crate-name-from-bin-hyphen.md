---
id: p45-own-crate-name-from-bin-hyphen
language: rust
category: import
expectation: edge
cites: "Cargo targets.rs normalize_lib (lib name defaults to the package name with `-` replaced by `_`)"
---

## Rule

Package `my-app` with `src/lib.rs` and `src/main.rs`: from the binary's module `src/cli/mod.rs`, `use my_app::engine::Engine;` binds the library's `src/engine/mod.rs` (node engine).

## Files

```toml path=Cargo.toml
[package]
name = "my-app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
pub mod engine;
```

```rust path=src/main.rs owner=bin
mod cli;
fn main() {}
```

```rust path=src/engine/mod.rs
pub struct Engine;
```

```rust path=src/cli/mod.rs
use my_app::engine::Engine;
```

## Expect

- src/lib.rs:1 -> node:engine
- src/main.rs:1 -> node:cli
- src/cli/mod.rs:1 -> node:engine
