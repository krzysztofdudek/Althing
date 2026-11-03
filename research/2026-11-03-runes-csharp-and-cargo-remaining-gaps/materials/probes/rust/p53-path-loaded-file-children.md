---
id: p53-path-loaded-file-children
language: rust
category: import
expectation: edge
cites: "Rust Reference, Modules, The path attribute (a file loaded through `#[path]` outside inline modules owns its directory as a mod-rs file does: its `mod x;` is beside it)"
---

## Rule

`src/lib.rs` has `#[path = "platform/linux.rs"] mod sys;` and `src/platform/linux.rs` declares `mod epoll;`, which is `src/platform/epoll/mod.rs` (node epoll), not `src/platform/linux/epoll.rs`. The `#[path]` mod itself stays silent by design.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
#[path = "platform/linux.rs"]
mod sys;
```

```rust path=src/platform/linux.rs owner=platform
mod epoll;
```

```rust path=src/platform/epoll/mod.rs
pub fn wait() {}
```

## Expect

- src/platform/linux.rs:1 -> node:epoll
