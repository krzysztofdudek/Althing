// The secret-shape detector (rail secret-scan, and secrets-range over every
// pushed commit). Known high-signal shapes only, chosen so that prose about
// keys and tokens does not trip it: private key blocks, cloud and provider
// keys, tokens, JWTs, and a credential assigned in quotes. A real credential
// never enters the repository: remove it, rotate it if it is real, and keep it
// out of band. The names key is a secret like any other.

export const SECRET_PATTERNS = [
  [/-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/, 'a private key block'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS access key id'],
  [/\bASIA[0-9A-Z]{16}\b/, 'an AWS temporary key id'],
  [/\bgh[pousr]_[A-Za-z0-9]{36,}\b/, 'a GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{40,}\b/, 'a GitHub fine-grained token'],
  [/\bnpm_[A-Za-z0-9]{36}\b/, 'an npm token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, 'a Slack token'],
  [/\bsk-[A-Za-z0-9_-]{20,}\b/, 'a provider secret key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'a Google API key'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/, 'a JWT'],
  [/\bALTHING_NAMES_KEY\s*[:=]\s*['"]?[0-9a-fA-F]{32,}/, 'the names key'],
  [/(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'a credential assigned in quotes'],
];

// Scan text; returns [{ line, label }], one finding per line at most.
export function scanSecrets(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const [re, label] of SECRET_PATTERNS) {
      if (re.test(lines[i])) { out.push({ line: i + 1, label }); break; }
    }
  }
  return out;
}

export function describeSecret(f) {
  return `possibly ${f.label}. Remove it, rotate it if it is real, and keep it out of band (a local file or a CI secret).`;
}
