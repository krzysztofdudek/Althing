---
id: p38-proc-macro-path-dep
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Cargo targets, Library (`proc-macro = true`); Specifying dependencies"
---

## Rule

A proc-macro crate `derive-kit` (`[lib] proc-macro = true`) is a path dependency; `use derive_kit::Builder;` binds its library root.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dependencies]
derive-kit = { path = "../derive-kit" }
```

```toml path=derive-kit/Cargo.toml
[package]
name = "derive-kit"
edition = "2021"

[lib]
proc-macro = true
```

```rust path=derive-kit/src/lib.rs owner=macros
use proc_macro::TokenStream;
#[proc_macro_derive(Builder)]
pub fn builder(input: TokenStream) -> TokenStream { input }
```

```rust path=app/src/lib.rs owner=root
use derive_kit::Builder;
```

## Expect

- app/src/lib.rs:1 -> node:macros
