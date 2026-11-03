---
id: p52-lib-at-package-root
language: rust
category: import
expectation: edge
cites: "Cargo targets.rs normalize_lib (lib.path as written); Rust Reference, Modules"
---

## Rule

`[lib] path = "lib.rs"` at the package root: `mod parser;` is `parser/mod.rs`, and from it `crate::lexer::Token` is `lexer/mod.rs`.

## Files

```toml path=Cargo.toml
[package]
name = "kit"
edition = "2021"

[lib]
path = "lib.rs"
```

```rust path=lib.rs owner=root
mod parser;
mod lexer;
```

```rust path=parser/mod.rs
use crate::lexer::Token;
```

```rust path=lexer/mod.rs
pub struct Token;
```

## Expect

- lib.rs:1 -> node:parser
- lib.rs:2 -> node:lexer
- parser/mod.rs:1 -> node:lexer
