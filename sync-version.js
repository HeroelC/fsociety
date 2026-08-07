// Keeps projects/fsociety/package.json in sync with the root package.json
// version.
//
// Runs from release-it's `after:bump` hook, which fires after the version has
// been written to the root manifest but before release-it stages files
// (`git add . --update`) for the release commit. That ordering is what lets the
// library version land in the same commit as the bump, instead of needing a
// manual follow-up commit.
//
// Also runs standalone via `npm run sync-version` and before `build:lib`.

const fs = require('fs');
const path = require('path');

const repoRoot = __dirname;
const rootPkgPath = path.join(repoRoot, 'package.json');
const libPkgPath = path.join(repoRoot, 'projects', 'fsociety', 'package.json');

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const libPkg = JSON.parse(fs.readFileSync(libPkgPath, 'utf8'));

if (libPkg.version === rootPkg.version) {
  console.log(`= projects/fsociety/package.json already at ${rootPkg.version}`);
  process.exit(0);
}

const previous = libPkg.version;
libPkg.version = rootPkg.version;

fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2) + '\n');

console.log(`✓ projects/fsociety/package.json ${previous} → ${libPkg.version}`);
