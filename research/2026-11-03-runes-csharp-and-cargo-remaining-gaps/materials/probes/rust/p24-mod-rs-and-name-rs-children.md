---
id: p24-mod-rs-and-name-rs-children
language: rust
category: import
expectation: edge
cites: "Rust Reference, Modules, Module source filenames (mod-rs and non-mod-rs files)"
---

## Rule

`src/a/mod.rs` declares `mod b;` → `src/a/b.rs`; `src/c.rs` declares `mod d;` → `src/c/d.rs`. Owners are set per file.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod a;
mod c;
```

```rust path=src/a/mod.rs owner=a
mod b;
```

```rust path=src/a/b.rs owner=b
pub fn f() {}
```

```rust path=src/c.rs owner=c
mod d;
```

```rust path=src/c/d.rs owner=d
pub fn f() {}
```

## Expect

- src/lib.rs:1 -> node:a
- src/lib.rs:2 -> node:c
- src/a/mod.rs:1 -> node:b
- src/c.rs:1 -> node:d
