---
id: p07-build-rs-mod-beside
language: rust
category: import
expectation: edge
cites: "Cargo targets.rs normalize_build (build.rs beside Cargo.toml); Rust Reference, Modules"
---

## Rule

`build.rs` is the build script's root; `mod codegen;` there is `codegen/mod.rs` at the package root (node codegen).

## Files

```toml path=Cargo.toml
[package]
name = "kit"
edition = "2021"
```

```rust path=build.rs owner=buildscript
mod codegen;
fn main() {}
```

```rust path=codegen/mod.rs
pub fn run() {}
```

## Expect

- build.rs:1 -> node:codegen
