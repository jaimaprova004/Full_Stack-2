const fs = require('fs');
const path = require('path');
const os = require('os');

function findFile(dir, name) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isFile() && it.name.toLowerCase() === name.toLowerCase()) return p;
    if (it.isDirectory()) {
      try {
        const found = findFile(p, name);
        if (found) return found;
      } catch (e) {}
    }
  }
  return null;
}

try {
  const root = path.resolve(__dirname, '..'); // post manager
  const found = findFile(root, 'rbac-demo.zip');
  if (!found) { console.error('NOT_FOUND'); process.exit(2); }
  const dst = path.join(os.homedir(), 'Desktop', 'rbac-demo.zip');
  fs.copyFileSync(found, dst);
  console.log('COPIED', dst);
} catch (err) {
  console.error('ERROR', err.message);
  process.exit(1);
}
