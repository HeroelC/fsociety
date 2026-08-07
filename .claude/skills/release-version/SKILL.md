---
name: release-version
description: "Bump, sync, stage and commit the fsociety library version in a single commit. Trigger: releasing, publishing, bumping the version, subir la version, nueva version, release patch/minor/major."
metadata:
  version: "1.0"
---

## When to Use

The user wants to ship a new version of `@heroelc/fsociety` — "subir la versión",
"release", "bump", "sacá una minor", "publicá".

Do **not** use this skill for ordinary feature commits.

## What Problem This Solves

The repo has two manifests that must carry the same version:

- `package.json` (workspace root) — the one `release-it` bumps
- `projects/fsociety/package.json` — the one that actually ships to npm

Historically the second one lagged behind, so every release needed a manual
follow-up commit just to align the version.

Two things were wrong, and both are fixed:

1. **The config file was never read.** It was named `release-it.json`.
   release-it resolves `.release-it` (with a leading dot) via c12, so the whole
   file was inert — no `commitMessage`, no changelog plugin, no hooks. That is
   why old commits read `Release 0.0.18` (release-it's built-in default) instead
   of the configured `chore: release v0.0.18`, and why no `CHANGELOG.md` existed.
   The file is now `.release-it.json`.
2. **Nothing synced the library manifest.** `.release-it.json` now runs
   `sync-version.js` from the `after:bump` hook, which fires *before* release-it
   stages files with `git add . --update` in its `beforeRelease` step. Both
   manifests therefore land in the same release commit.

If a future release regresses to two commits, check the filename first.

## Procedure

### 1. Verify the working tree is clean

```bash
git status --porcelain
```

`release-it` refuses to run with a dirty tree (`requireCleanWorkingDir` defaults
to true).

If the changes **are** the work being released, commit them first as
conventional commits — they are what the changelog is generated from — then
release on top. If they are unrelated, stop and ask; never sweep unrelated work
into a release.

If a *generated* file keeps reappearing here, do not commit it to get past the
check: gitignore it instead. `projects/fsociety/documentation.json` (Compodoc
output, ~500 KB, rewritten by every Storybook build) used to do exactly this and
is now ignored.

### 2. Confirm the branch

```bash
git rev-parse --abbrev-ref HEAD
```

Releases go from `main`. On any other branch, stop and ask.

### 3. Determine the bump level

If the user named it ("patch", "minor", "major"), use that. If they only said
"subir la versión", infer from the commits since the last tag:

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

- any `feat!:` / `BREAKING CHANGE` → major
- any `feat:` → minor
- only `fix:` / `chore:` / `docs:` → patch

State the level you inferred and why, then continue. Ask only if the history is
genuinely ambiguous — **or if the guard below applies.**

#### Guard: never change maturity band on your own

The project sits in one of three **bands**. Moving between them is a statement
about the project, not arithmetic:

| From | To | Band change? |
|---|---|---|
| `0.0.18` | `0.0.19` | no — routine patch |
| `0.2.0` | `0.2.1` | no — routine patch |
| `0.2.0` | `0.3.0` | no — routine minor, still `0.x` |
| `0.0.18` | `0.1.0` | **yes** — leaving `0.0.x` |
| `0.3.0` | `1.0.0` | **yes** — leaving pre-release |

**STOP and ask only for the last two.** Anything that stays inside the same band
is a normal bump: state the level and proceed.

State the current version, the level you inferred, why, and let the user choose.
A published version number can never be reused, so this is not recoverable.

This guard exists because it was already gotten wrong: `0.0.18` went to `0.1.0`
on inferred `minor` (a genuinely new public directive) when the project had been
shipping every change — features included — as a `0.0.x` patch. The result was
semver-correct and was kept, but the call belonged to the user.

> The rule was first written as "changes the first non-zero segment". That reads
> as firing on `0.2.0 → 0.3.0`, since the minor is the first non-zero segment
> there — which is an ordinary minor and exactly what a `0.x` library should do.
> Bands are the thing that matters; do not reintroduce the segment wording.

Note for reasoning about impact: a caret range on `0.0.x` pins the patch.
`^0.0.18` resolves to `>=0.0.18 <0.0.19`, so those consumers would not have
picked up `0.0.19` either. Do not argue that a minor "leaves consumers behind"
where a patch would not have — on `0.0.x` that is false.

#### Commit bodies: no `#` before hex

Conventional-changelog reads `#` followed by anything as an issue reference, so a
hex colour in a commit body becomes a link to an issue that does not exist.
Write `0d1117`, or wrap it in backticks.

`clean-changelog.js` now strips those from `CHANGELOG.md` in the `after:bump`
hook, so a slip no longer reaches the published changelog. Do not rely on it as a
licence to be sloppy — it only handles hex-shaped refs.

### 4. Dry run first

```bash
npm run release:dry
```

Use it to confirm the **target version** and the changelog preview.

Do NOT use it to verify the sync. In dry-run, release-it logs write commands
without executing them (`isDryRun && isWrite` short-circuits in
`lib/shell.js`), and hooks are dispatched with `write` unset, so
`node sync-version.js` is printed but never runs. The changeset preview will
therefore *not* list `projects/fsociety/package.json`. That is expected and is
not a failure. The real check is step 6.

### 5. Release

```bash
npm run release:patch   # or release:minor / release:major
```

`release-it` is interactive by default. If the environment cannot answer
prompts, add `--ci` to accept the defaults, and say so in your report.

### 6. Verify one commit, not two

```bash
git log -1 --stat
git show --name-only HEAD
```

Both manifests must appear in that single commit, and their versions must match:

```bash
node -e "const r=require('./package.json'),l=require('./projects/fsociety/package.json');console.log(r.version===l.version?'OK '+r.version:'MISMATCH '+r.version+' vs '+l.version)"
```

If it reports MISMATCH, the hook failed. Report it — do not paper over it with a
second commit, because that is the exact problem this skill exists to remove.

A healthy release commit looks like this:

```
chore: release v0.0.20
  CHANGELOG.md
  package-lock.json
  package.json
  projects/fsociety/package.json
```

Four files, one commit. A commit titled `Release 0.0.20` with only two files
means the config file is not being read again.

### 7. Report

Tell the user the new version, the commit hash, the tag, and whether it was
pushed. Do **not** push or publish to npm unless the user asked — `npm.publish`
is `false` in `release-it.json` on purpose.

## Notes

- `sync-version.js` is idempotent: it exits early when the versions already
  match, so running it standalone is always safe.
- `npm run build:lib` runs the sync before building, so a local build never
  produces a package with a stale version.
