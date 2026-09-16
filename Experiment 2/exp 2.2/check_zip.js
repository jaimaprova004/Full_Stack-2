const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'rbac-demo.zip');
console.log('checking', p, '->', fs.existsSync(p));
