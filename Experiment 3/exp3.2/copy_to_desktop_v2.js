const fs = require('fs');
const path = require('path');
const os = require('os');

const candidates = [
  path.join(os.homedir(), 'Desktop'),
  path.join(os.homedir(), 'OneDrive', 'Desktop'),
  path.join(os.homedir(), 'OneDrive - Personal', 'Desktop'),
  path.join(os.homedir(), 'Documents')
];

const src = path.join(__dirname, '..', 'rbac-demo.zip');
let dstDir = null;
for (const c of candidates) {
  try { if (fs.existsSync(c)) { dstDir = c; break; } } catch (e) {}
}
if (!dstDir) {
  // fallback to home
  dstDir = os.homedir();
}
const dst = path.join(dstDir, 'rbac-demo.zip');
try{
  fs.copyFileSync(src, dst);
  console.log('COPIED', dst);
} catch (err) {
  console.error('COPY_FAILED', err.message, 'src', src, 'dst', dst);
  process.exit(1);
}
