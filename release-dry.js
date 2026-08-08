// Runs the release preview and puts the manifests back afterwards.
//
// release-it's dry run is not read-only: it bumps package.json and
// package-lock.json for real, every time, and leaves them uncommitted. The real
// release then refuses to start — `requireCleanWorkingDir` sees a dirty tree —
// so the preview breaks the thing it was meant to de-risk.
//
// It is not a config problem and not fixable by upgrading. In lib/plugin/npm/npm.js
// one shared helper supplies the options for every npm command the plugin runs:
//
//   const getOptions = () => ({ write: false, env: getNpmEnv() });
//
// `write: false` is correct for `npm ping`, `npm whoami` and `npm show`, which
// only read. But `bump()` reuses the same helper for `npm version`, and
// lib/shell.js gates the dry run on exactly that flag:
//
//   const isWrite = options.write !== false;
//   if (isDryRun && isWrite) { /* log only */ return noop; }
//
// So the bump is classified as a read and executes. Still present in 21.0.1.
//
// This wrapper therefore restores the manifests itself. It restores them whether
// release-it succeeded or failed, since a failed preview leaves the same mess.

const { spawnSync } = require('child_process');

// The lockfile moves with the root manifest, and sync-version.js writes the
// library one from the after:bump hook.
const MANIFESTS = ['package.json', 'package-lock.json', 'projects/fsociety/package.json'];

const git = (args, opts = {}) =>
  spawnSync('git', args, { cwd: __dirname, encoding: 'utf8', ...opts });

// The restore below is a hard checkout. Refusing to start on already-dirty
// manifests is what keeps it from throwing away real edits — a version bump in
// progress, or a dependency someone just added.
const dirty = git(['status', '--porcelain', '--', ...MANIFESTS]).stdout.trim();
if (dirty) {
  console.error('release:dry restores the manifests with `git checkout` when it finishes,');
  console.error('so it will not run while they already have uncommitted changes:\n');
  console.error(dirty);
  console.error('\nCommit or stash them first.');
  process.exit(1);
}

const passthrough = process.argv.slice(2);
const run = spawnSync('npx', ['release-it', '--dry-run', '--ci', ...passthrough], {
  cwd: __dirname,
  stdio: 'inherit',
  // Windows needs the shell to resolve npx through its .cmd shim.
  shell: true,
});

const restore = git(['checkout', '--', ...MANIFESTS], { stdio: 'inherit' });
if (restore.status !== 0) {
  console.error(`\n! could not restore ${MANIFESTS.join(', ')} — check git status before releasing`);
  process.exit(restore.status ?? 1);
}

console.log(`\n= restored ${MANIFESTS.join(', ')} (the dry run bumps them for real)`);

process.exit(run.status ?? 1);
