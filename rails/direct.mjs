// Whether a module is the script node was started with, which is how an entry
// point tells a run from an import.
//
// Node resolves import.meta.url through symbolic links and leaves
// process.argv[1] as it was typed, so the two are compared by their real
// paths. Compared as given, a script reached through a link runs nothing and
// exits 0, which a hook or a script that trusts the exit code takes for a pass.

import { realpathSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function runDirectly(moduleUrl, started = process.argv[1]) {
  if (!started) return false;
  try {
    return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(started);
  } catch {
    return moduleUrl === pathToFileURL(started).href;
  }
}
