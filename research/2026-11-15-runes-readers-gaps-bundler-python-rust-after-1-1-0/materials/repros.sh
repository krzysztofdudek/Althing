#!/usr/bin/env bash
# usage: repros.sh <Runes checkout at v1.1.0, built, with .grammars/>
# Builds each minimal repository in its own mktemp -d folder, prints the classifyUse answers, removes the folder.
set -u
RUNES=$(cd "$1" && pwd)
HERE=$(cd "$(dirname "$0")" && pwd)
run() { node "$HERE/classify-folder.mjs" "$RUNES" "$1" 2>&1 | grep -v '^files read'; }
case_() { T=$(mktemp -d); echo "=== $1"; "$2" "$T"; run "$T"; rm -rf "$T"; }
w() { mkdir -p "$(dirname "$1")"; printf '%s\n' "${@:2}" > "$1"; }

alias_vite() { w $1/vite.config.ts 'export default { resolve: { alias: { "@": "/abs/src", "~data": "/abs/src/data" } } }'; w $1/src/data/d.ts 'export const d = 1;'
  w $1/src/ui/a.ts 'import { d } from "@/data/d";' 'import { d as e } from "~data/d";' 'import { d as f } from "../data/d";'; }
alias_webpack() { w $1/webpack.config.js 'module.exports = { resolve: { alias: { "data-alias": path.resolve(__dirname, "src/data") } } };'; w $1/src/data/d.js 'exports.d = 1;'
  w $1/src/ui/w.js 'const d = require("data-alias/d");'; }
alias_babel() { w $1/.babelrc '{ "plugins": [["module-resolver", { "alias": { "@d": "./src/data" } }]] }'; w $1/src/data/d.js 'export const d = 1;'
  w $1/src/ui/b.js 'import { d } from "@d/d";'; }
alias_tsconfig() { w $1/tsconfig.json '{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }'; w $1/src/data/d.ts 'export const d = 1;'
  w $1/src/ui/a.ts 'import { d } from "@/data/d";'; }
glob_forms() { w $1/src/data/d.ts 'export const d = 1;'; w $1/src/ui/g.ts 'const m = import.meta.glob("../data/*.ts");' 'const c = require.context("../data", false, /\.ts$/);' 'vi.mock("../data/d");'; }

py_lib() { w $1/pyproject.toml '[project]' 'name = "pkg"' '[tool.setuptools.packages.find]' 'where = ["lib"]'
  touch_() { mkdir -p "$(dirname "$1")"; : > "$1"; }; touch_ $1/lib/pkg/__init__.py; touch_ $1/lib/pkg/ui/__init__.py; touch_ $1/lib/pkg/data/__init__.py
  w $1/lib/pkg/data/d.py 'x = 1'; w $1/lib/pkg/ui/a.py 'from pkg.data.d import x' 'from ..data.d import x as y' 'import pkg.data.d'; }
py_src() { py_lib $1; mv $1/lib $1/src; w $1/pyproject.toml '[project]' 'name = "pkg"'; }
py_relative_vs_absolute() { py_src $1; w $1/src/pkg/data/__init__.py ''; w $1/src/pkg/data/m.py 'x = 1'; w $1/src/pkg/ui/a.py 'from ..data import x' 'from pkg.data import x as y' 'from ..data.m import x as z' 'from pkg.data.m import x as t'; }

rust_path() { w $1/Cargo.toml '[package]' 'name = "app"' 'version = "0.1.0"' 'edition = "2021"'; w $1/src/lib.rs 'pub mod ui;' 'pub mod data;'; w $1/src/data/mod.rs 'pub mod d;'
  w $1/src/data/d.rs 'pub fn f() {}'; w $1/src/data/orphan.rs 'pub fn o() {}'; w $1/src/ui/mod.rs 'pub mod f;' '#[path = "../data/orphan.rs"]' 'pub mod via_attr;'
  w $1/src/ui/f.rs '#[path = "../data/d.rs"] mod dd;' 'pub fn g() { crate::data::d::f(); }'; }
rust_dep() { w $1/Cargo.toml '[package]' 'name = "app"' 'version = "0.1.0"' 'edition = "2021"' '[dependencies]' 'datacrate = { path = "datacrate" }'
  w $1/datacrate/Cargo.toml '[package]' 'name = "datacrate"' 'version = "0.1.0"' 'edition = "2021"'; w $1/datacrate/src/lib.rs 'pub fn dc() {}'
  w $1/src/lib.rs 'pub mod k;' 'pub mod u;'; w $1/src/k.rs 'pub fn k() { datacrate::dc(); }'; w $1/src/u.rs 'use datacrate::dc;' 'pub fn u() { dc(); }'; }

go_replace() { w $1/ui/go.mod 'module example.com/ui' 'go 1.22' 'require example.com/data v0.0.0' 'replace example.com/data => ../data'; w $1/data/go.mod 'module example.com/data' 'go 1.22'
  w $1/data/d.go 'package data' 'func D() {}'; w $1/ui/a.go 'package ui' 'import "example.com/data"' 'func A() { data.D() }'; }
go_work() { go_replace $1; w $1/go.work 'go 1.22' 'use ./ui' 'use ./data'; }

vue_script() { w $1/src/data/d.ts 'export const d = 1;'; w $1/src/ui/v.vue '<template><b/></template>' '<!-- <script>import { d } from "../data/d"</script> -->'
  w $1/src/ui/s.vue '<template><b/></template>' '<script src="../data/d.ts"></script>'; w $1/src/ui/ok.vue '<template><b/></template>' '<script>import { d } from "../data/d"</script>'; }

cr_lines() { w $1/src/data/d.ts 'export const d = 1;'; printf 'const a = 1;\rconst b = 2;\rimport { d } from "../data/d";\r' > $1/src/ui_a.ts; mkdir -p $1/src; mv $1/src/ui_a.ts $1/src/a.ts; }

for c in alias_vite alias_webpack alias_babel alias_tsconfig glob_forms py_lib py_src py_relative_vs_absolute rust_path rust_dep go_replace go_work vue_script cr_lines; do case_ "$c" "$c"; done
