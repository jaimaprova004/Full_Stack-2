const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'rbac-demo.zip');
try{
  const s = fs.statSync(p);
  console.log('FOUND', p, s.size);
}catch(e){console.error('MISSING', p, e.message); process.exit(1);} 
