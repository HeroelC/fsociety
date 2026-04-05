const fs = require('fs');

const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const libPkgPath = 'projects/fsociety/package.json';
const libPkg = JSON.parse(fs.readFileSync(libPkgPath, 'utf8'));

libPkg.version = rootPkg.version;

fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n');

console.log(`✓ projects/fsociety/package.json → ${libPkg.version}`);
