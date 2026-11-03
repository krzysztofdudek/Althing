---
id: p26-inline-mod-super-in-fn
language: rust
category: import
expectation: edge
cites: "Rust Reference, Paths, `super` (relative to the enclosing module, inline modules included)"
---

## Rule

In `src/svc/mod.rs`, `mod inner { fn f() { super::super::db::Pool::new(); } }`: `super` of `inner` is `svc`, `super::super` is the crate root, so the path is `crate::db::Pool`, the file `src/db/mod.rs` (node db).

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod svc;
mod db;
```

```rust path=src/db/mod.rs
pub struct Pool;
```

```rust path=src/svc/mod.rs
mod inner {
    fn f() { super::super::db::Pool::new(); }
}
```

## Expect

- src/lib.rs:1 -> node:svc
- src/lib.rs:2 -> node:db
- src/svc/mod.rs:2 -> node:db
