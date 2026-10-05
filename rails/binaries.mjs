// The binary-file detector (rail boundary/no-binaries). A text scan cannot read
// a screenshot, a recording or a PDF, and a screenshot of a private system is
// the easiest leak there is. So no file whose extension names an image, audio,
// video, archive, font, office or PDF format enters, and no file with a NUL
// byte in its first 8000 characters. A diagram is SVG or text; a public picture
// is linked where it is public. The allow-list is empty until a ruling argues
// a need.

const EXT = new Set([
  // images (SVG is text and allowed)
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'icns', 'tif', 'tiff', 'heic', 'heif', 'avif', 'psd', 'raw',
  // audio
  'mp3', 'wav', 'ogg', 'oga', 'flac', 'm4a', 'aac', 'opus', 'wma',
  // video
  'mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', 'wmv', 'flv', 'mpg', 'mpeg',
  // archives and bundles
  'zip', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', '7z', 'rar', 'jar', 'war', 'dmg', 'iso', 'bundle', 'pack',
  // fonts
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  // documents
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'key', 'pages', 'numbers', 'rtf',
  // compiled and data blobs
  'exe', 'dll', 'so', 'dylib', 'wasm', 'class', 'o', 'a', 'bin', 'sqlite', 'db',
]);

export function binaryExtension(path) {
  const m = /\.([A-Za-z0-9]+)$/.exec(path || '');
  return m && EXT.has(m[1].toLowerCase()) ? m[1].toLowerCase() : null;
}

export function hasNul(content) {
  return typeof content === 'string' && content.slice(0, 8000).includes('\u0000');
}

// Returns a reason string, or null when the file is acceptable.
export function scanBinary(path, content) {
  const ext = binaryExtension(path);
  if (ext) return `a .${ext} file`;
  if (hasNul(content)) return 'binary content (a NUL byte in the first 8000 characters)';
  return null;
}

export function describeBinary(reason) {
  return `${reason}. No binary file enters Althing: draw a diagram as SVG or text, and link a public picture where it is already public.`;
}
