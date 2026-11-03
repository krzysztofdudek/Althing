---
id: p22-non-mod-rs-nested-inline
language: rust
category: import
expectation: edge
cites: "Rust Reference, Modules, Module source filenames (non-mod-rs files: a nested `mod` is under a directory named after the file, then after each inline module)"
---

## Rule

`src/net.rs` (a non-mod-rs file) holds `mod proto { mod wire; }`: `wire` is `src/net/proto/wire.rs` (node proto). In `src/net/proto/wire.rs`, `super::super::Conn` is the module `net`, whose file is `src/net.rs`.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod net;
```

```rust path=src/net.rs owner=net
pub struct Conn;
mod proto {
    mod wire;
}
```

```rust path=src/net/proto/wire.rs
use super::super::Conn;
```

## Expect

- src/lib.rs:1 -> node:net
- src/net.rs:3 -> node:proto
- src/net/proto/wire.rs:1 -> node:net
