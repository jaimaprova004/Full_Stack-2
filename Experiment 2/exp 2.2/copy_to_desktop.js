const fs = require('fs');
const path = require('path');
const os = require('os');
try {
  const src = path.join(__dirname, '..', 'rbac-demo.zip');
  const dst = path.join(os.homedir(), 'Desktop', 'rbac-demo.zip');
  fs.copyFileSync(src, dst);
  console.log('COPIED', dst);
} catch (err) {
  console.error('COPY_FAILED', err.message);
  process.exit(1);
}
