// One-off generator: parses mhb-repo/data/hymns/<n>.mhb files (1..984)
// and writes hymns.js containing window.MHB_HYMNS = [ {n,t,a,v}, ... ].
// v = array of stanzas; each stanza = array of lyrical lines.
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'mhb-repo', 'data', 'hymns');
const out = path.join(__dirname, 'hymns.js');

const entries = [];
for (let n = 1; n <= 984; n++) {
  // Some files in the source dataset have a stray space before ".mhb" (e.g. "30 .mhb").
  let file = path.join(dir, n + '.mhb');
  if (!fs.existsSync(file)) file = path.join(dir, n + ' .mhb');
  if (!fs.existsSync(file)) {
    console.log('MISSING', n);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split(/\r?\n/);

  // Trim trailing blank lines.
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  // Trim leading blank lines.
  while (lines.length && lines[0].trim() === '') lines.shift();
  if (lines.length < 3) {
    console.log('TOO_SHORT', n);
    continue;
  }

  const title = lines[1].trim();
  const author = lines[2].trim().replace(/^(\r|\n)+$/, '');
  const lyricLines = lines.slice(3);

  // Split into stanzas on blank lines.
  const stanzas = [];
  let current = [];
  for (const ln of lyricLines) {
    if (ln.trim() === '') {
      if (current.length) {
        stanzas.push(current);
        current = [];
      }
    } else {
      current.push(ln.trimEnd());
    }
  }
  if (current.length) stanzas.push(current);

  entries.push({ n, t: title, a: author, v: stanzas });
}

let outStr =
  '// Methodist Hymn Book (MHB) - complete hymn texts, numbers 1 to 984.\n' +
  '// Generated from the open MHB dataset (github.com/justiceamoh/mhb).\n' +
  'window.MHB_HYMNS = [\n';
for (const e of entries) {
  outStr += JSON.stringify(e) + ',\n';
}
outStr = outStr.replace(/,\n$/, '\n');
outStr += '];\n';

fs.writeFileSync(out, outStr, 'utf8');
console.log('Wrote', entries.length, 'hymns to hymns.js (' + outStr.length + ' bytes)');