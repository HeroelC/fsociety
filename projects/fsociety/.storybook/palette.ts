// =============================================================================
// Live branding for Storybook.
//
// The library generates every colour stop at BUILD time: `generate-scale()` in
// src/styles/_tokens.scss mixes each base hex toward white or toward the dark
// mix with Sass. Nothing about that is reachable at runtime, so to preview a
// different brand live we regenerate the same stops in JS and write them as
// inline custom properties on <html>.
//
// Only the numbered stops (--fs-primary-50 … -900) need writing. The alias layer
// (--fs-primary-base, -hover, -muted, …) and the semantic layer
// (--fs-color-primary) are stylesheet rules that already point at the numbered
// stops, and they map differently per theme — so overriding the numbers lets the
// aliases keep their correct light/dark behaviour for free.
//
// Inline styles on <html> outrank every stylesheet rule that is not !important,
// which is why this wins over the compiled :root block.
//
// ⚠ The constants below MIRROR src/styles/_tokens.scss. If generate-scale() or a
// default hex changes there, update it here too — verified against the compiled
// output: base #2563eb yields stop 50 rgb(237.56, 242.52, 253.4) and stop 600
// rgb(33.48, 86.84, 204.12).
//
// This file is a Storybook-only dev tool. It is not part of the published
// package.
// =============================================================================

export const FAMILIES = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'success',
  'warning',
  'danger',
] as const;

export type FsFamily = (typeof FAMILIES)[number];

/** Mirrors the $fs-*-hex defaults in _tokens.scss. */
export const DEFAULT_PALETTE: Record<FsFamily, string> = {
  primary:   '#2563eb',
  secondary: '#0ea5e9',
  tertiary:  '#22d3ee',
  neutral:   '#64748b',
  success:   '#22c55e',
  warning:   '#f59e0b',
  danger:    '#f43f5e',
};

/** $fs-light-mix / $fs-dark-mix. Dark stops mix toward navy, not pure black. */
const LIGHT_MIX = '#ffffff';
const DARK_MIX = '#0f172a';

/**
 * The ten stops, as [stop, colour mixed toward, how much of it].
 * Stop 500 is the untouched base.
 */
const STOPS: ReadonlyArray<readonly [number, string | null, number]> = [
  [50, LIGHT_MIX, 0.92],
  [100, LIGHT_MIX, 0.8],
  [200, LIGHT_MIX, 0.64],
  [300, LIGHT_MIX, 0.44],
  [400, LIGHT_MIX, 0.22],
  [500, null, 0],
  [600, DARK_MIX, 0.16],
  [700, DARK_MIX, 0.34],
  [800, DARK_MIX, 0.54],
  [900, DARK_MIX, 0.72],
];

const STORAGE_KEY = 'fsociety.branding';

type Rgb = [number, number, number];

function toRgb(hex: string): Rgb {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function toHex(rgb: Rgb): string {
  return (
    '#' +
    rgb
      .map(c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Sass `color.mix($a, $b, $weight)` on opaque colours is a plain weighted
 * average in sRGB — no gamma correction — where $weight is how much of $a.
 */
function mix(a: Rgb, b: Rgb, weight: number): Rgb {
  return [
    a[0] * weight + b[0] * (1 - weight),
    a[1] * weight + b[1] * (1 - weight),
    a[2] * weight + b[2] * (1 - weight),
  ];
}

/** The full ten-stop scale for a base hex, as [stop, hex] pairs. */
export function scaleFor(baseHex: string): Array<[number, string]> {
  const base = toRgb(baseHex);
  return STOPS.map(([stop, toward, weight]) => [
    stop,
    toward === null ? toHex(base) : toHex(mix(toRgb(toward), base, weight)),
  ]);
}

export type FsPalette = Record<FsFamily, string>;

/** Writes the palette as inline custom properties on <html>. */
export function applyPalette(palette: FsPalette): void {
  const root = document.documentElement;
  for (const family of FAMILIES) {
    for (const [stop, hex] of scaleFor(palette[family])) {
      root.style.setProperty(`--fs-${family}-${stop}`, hex);
    }
  }
}

/** Drops the inline overrides so the compiled stylesheet takes over again. */
export function clearPalette(): void {
  const root = document.documentElement;
  for (const family of FAMILIES) {
    for (const [stop] of STOPS) {
      root.style.removeProperty(`--fs-${family}-${stop}`);
    }
  }
}

export function loadPalette(): FsPalette | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FsPalette>;
    // Fill any missing family from the defaults so a stale entry cannot
    // half-apply a palette.
    return { ...DEFAULT_PALETTE, ...parsed };
  } catch {
    return null;
  }
}

export function savePalette(palette: FsPalette | null): void {
  try {
    if (palette) localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The palette
    // still applies for this session; it just will not persist.
  }
}

/**
 * Re-applies the stored palette. Called from the preview decorator so branding
 * chosen in the Branding story carries across every other story.
 */
export function restorePalette(): void {
  const stored = loadPalette();
  if (stored) applyPalette(stored);
  else clearPalette();
}

/** The `@use ... with (...)` block to paste into a real app's styles.scss. */
export function scssSnippet(palette: FsPalette): string {
  const changed = FAMILIES.filter(f => palette[f].toLowerCase() !== DEFAULT_PALETTE[f].toLowerCase());
  const families = changed.length ? changed : FAMILIES;
  const width = Math.max(...families.map(f => f.length));
  const lines = families
    .map(f => `  $fs-${f}-hex:${' '.repeat(width - f.length)} ${palette[f]},`)
    .join('\n');

  return [
    "@use '@heroelc/fsociety/styles' with (",
    lines.replace(/,$/, ''),
    ');',
  ].join('\n');
}
