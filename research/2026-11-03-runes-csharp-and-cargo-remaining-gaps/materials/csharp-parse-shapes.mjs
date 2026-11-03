// Prints the tree-sitter parse of the C# type positions the audit found unread, so each finding can name the node shape the extractor skips.
// Usage, from the Runes tree's directory: node csharp-parse-shapes.mjs <runes tree>
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const tree = process.argv[2];
const ts = await import(pathToFileURL(path.resolve(tree, 'test/helpers/tree-sitter.mjs')).href);
const code = [
  'class C {',
  '  bool A(object o) => o is App.Models.Order;',
  '  int B(object o) => o switch { Models.Order => 1, _ => 0 };',
  '  bool E(object o) => o is Note[];',
  '  ref Order F() => throw null;',
  '  void G() { ref Line l = ref H(); }',
  '  object Q(object xs) => from Row r in xs select r;',
  '  unsafe delegate*<Order, void> P;',
  '}',
  'delegate void D(int x);',
].join('\n');
const show = (n, depth) => {
  if (!n.isNamed) return;
  const text = n.childCount === 0 ? ` "${n.text}"` : '';
  console.log(`${'  '.repeat(depth)}${n.type}${text}`);
  for (let i = 0; i < n.childCount; i++) show(n.child(i), depth + 1);
};
await ts.withParsedFile('Shapes.cs', code, (tree) => show(tree.rootNode, 0), 'csharp');
