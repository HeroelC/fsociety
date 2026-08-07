// Strips bogus issue references from CHANGELOG.md.
//
// conventional-changelog treats `#` followed by anything as an issue reference,
// so a hex colour mentioned in a commit body — `#0d1117`, `#2563eb` — becomes
// `closes [#0d1117](.../issues/0d1117)`: a link to an issue that does not exist
// and never will.
//
// Discipline alone did not hold: it happened in v0.1.0, was documented in the
// root README, and happened again in v0.3.0. So this removes them mechanically.
//
// Runs from release-it's `before:git:beforeRelease` hook. The timing matters and
// is not obvious: @release-it/conventional-changelog writes the infile in its
// `beforeRelease` step, NOT in `bump`. An `after:bump` hook therefore runs before
// the new entry exists and cleans nothing — verified the hard way.
//
// `before:git:beforeRelease` lands after the changelog plugin has written the
// file and before the git plugin stages with `git add . --update`, so the cleaned
// version is what gets committed. It also re-stages the file itself, so the
// cleanup survives being wired to a different hook later.
//
// Only hex-shaped references are removed. A real `#123` is left alone, because a
// GitHub issue number is decimal and cannot be six hex digits with a letter in
// it. References that are all digits are never touched.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const changelogPath = path.join(__dirname, 'CHANGELOG.md');

if (!fs.existsSync(changelogPath)) {
  console.log('= no CHANGELOG.md, nothing to clean');
  process.exit(0);
}

const original = fs.readFileSync(changelogPath, 'utf8');

// A hex-colour reference: 3 or 6 hex chars that are not purely decimal.
const HEX_REF = /\[#(?=[0-9a-f]*[a-f])([0-9a-f]{3}|[0-9a-f]{6})\]\([^)]*\/issues\/\1\)/g;

// Horizontal whitespace only — \s would match newlines and swallow the blank
// lines that separate markdown blocks.
let cleaned = original
  // Drop each bogus link, plus any space that preceded it.
  .replace(new RegExp(`[ \\t]*${HEX_REF.source}`, 'g'), '')
  // A line whose every reference was bogus is left with a dangling ", closes".
  .replace(/,[ \t]*closes[ \t]*$/gm, '');

if (cleaned === original) {
  console.log('= CHANGELOG.md has no bogus issue references');
  process.exit(0);
}

const removed = (original.match(HEX_REF) ?? []).length;
fs.writeFileSync(changelogPath, cleaned);
console.log(`✓ CHANGELOG.md — removed ${removed} bogus issue reference(s) from hex colours`);

// The changelog plugin stages the infile as soon as it writes it, so re-stage the
// cleaned bytes. Harmless when run standalone outside a release.
try {
  execFileSync('git', ['add', '--', changelogPath], {
    cwd: __dirname,
    stdio: 'ignore',
  });
} catch {
  // Not a repo, or the file is intentionally unstaged. The cleanup already
  // happened on disk, which is what matters.
}
