// =============================================================================
// Shared calendar logic for fs-date-picker and fs-date-range-picker.
//
// Both need the same month grid, the same Intl-driven names and the same
// forgiving parser. Keeping it here means a calendar bug is fixed once instead
// of twice.
//
// Everything is a pure function over Date. Nothing here touches the DOM or
// Angular, which is what makes it testable in isolation.
// =============================================================================

/** One cell of a month grid. Every cell is a real date — the grid is padded with
 *  the neighbouring months rather than with blanks. */
export interface FsCalendarDay {
  date: Date;
  day: number;
  today: boolean;
  selected: boolean;
  disabled: boolean;
  outside: boolean;
  /** Between the two ends of a range. Always false for a single date. */
  inRange: boolean;
  /** The first day of a range. */
  rangeStart: boolean;
  /** The last day of a range. */
  rangeEnd: boolean;
}

/** Midnight of the given date, so comparisons ignore the time component. */
export function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return (
    !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** First of the month, which is what the pickers use as their "view" cursor. */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/**
 * Normalises a week start into 0–6, so 7 reads as Sunday and -1 as Saturday.
 *
 * null and '' are rejected before coercing, because `Number(null)` is 0 — an
 * unset binding would otherwise silently mean Sunday instead of the caller's
 * default.
 */
export function normaliseWeekStart(
  value: number | string | null | undefined,
  fallback = 1,
): number {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? ((n % 7) + 7) % 7 : fallback;
}

/** e.g. "Marzo 2026", capitalised for a header. */
export function monthLabel(month: Date, locale: string): string {
  const raw = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(month);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** Narrow weekday initials, rotated to honour the week start. */
export function weekdayNames(locale: string, firstDayOfWeek: number): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  // 2024-01-07 is a Sunday, so index 0 lines up with getDay() === 0.
  const base = Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)));
  const offset = normaliseWeekStart(firstDayOfWeek);
  return [...base.slice(offset), ...base.slice(0, offset)];
}

export interface BuildGridOptions {
  month: Date;
  firstDayOfWeek: number;
  /** Single selection, or the start of a range. */
  selected?: Date | null;
  /** End of a range. Leave unset for a single date. */
  selectedEnd?: Date | null;
  min?: Date | null;
  max?: Date | null;
  /** Extra rule on top of min/max — a blocked weekday, for instance. */
  isDisabled?: (date: Date) => boolean;
}

/**
 * Always six rows, forty-two cells.
 *
 * A month spans 4–6 week rows depending on its length and start day. Letting the
 * grid change height makes the popover jump as you page through months, so
 * leading and trailing days from the neighbouring months fill it out.
 */
export function buildMonthGrid(options: BuildGridOptions): FsCalendarDay[][] {
  const { month, selected = null, selectedEnd = null, min = null, max = null } = options;
  const firstDayOfWeek = normaliseWeekStart(options.firstDayOfWeek);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const today = startOfDay(new Date());
  const first = new Date(year, monthIndex, 1);
  const lead = (first.getDay() - firstDayOfWeek + 7) % 7;

  // Ends are ordered here rather than at the call site, so a range picked
  // backwards still highlights correctly.
  const [from, to] = selected && selectedEnd && selectedEnd < selected
    ? [selectedEnd, selected]
    : [selected, selectedEnd];

  const cells: FsCalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(year, monthIndex, 1 - lead + i);
    const d = startOfDay(date);

    let disabled = false;
    if (min && d < startOfDay(min)) disabled = true;
    if (max && d > startOfDay(max)) disabled = true;
    if (!disabled && options.isDisabled?.(date)) disabled = true;

    const isStart = sameDay(date, from);
    const isEnd = sameDay(date, to);
    const between = !!from && !!to && d > startOfDay(from) && d < startOfDay(to);

    cells.push({
      date,
      day: date.getDate(),
      today: sameDay(date, today),
      selected: isStart || isEnd,
      disabled,
      outside: date.getMonth() !== monthIndex,
      inRange: between,
      rangeStart: isStart && !!to,
      rangeEnd: isEnd && !!to,
    });
  }

  const rows: FsCalendarDay[][] = [];
  for (let i = 0; i < 42; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/**
 * Canonical text for a date, in the locale's own numeric order — so es-AR gives
 * 15/03/1990 and en-US gives 3/15/1990 without a format string.
 */
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Whether this locale writes the month before the day. */
export function localeIsMonthFirst(locale: string): boolean {
  const parts = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(new Date(2024, 10, 22));
  const order = parts.filter(p => p.type === 'day' || p.type === 'month');
  return order[0]?.type === 'month';
}

/**
 * Parses what a user typed.
 *
 * `new Date(string)` is deliberately avoided: it reads "15/03/1990" as an invalid
 * US date, and bare "2024-03-15" as UTC, which shifts a day in negative offsets.
 *
 * Accepts `-` `/` `.` or space as separators, a 2- or 4-digit year, and detects
 * ISO by a leading 4-digit group. Otherwise the field order comes from the
 * locale, so es-AR reads day-first and en-US month-first.
 */
export function parseDate(input: string, locale: string): Date | null {
  const raw = input.trim();
  if (!raw) return null;

  const parts = raw.split(/[/\-.\s]+/).filter(Boolean);
  if (parts.length !== 3 || parts.some(p => !/^\d+$/.test(p))) return null;

  const nums = parts.map(Number);
  let day: number;
  let month: number;
  let year: number;

  if (parts[0].length === 4) {
    [year, month, day] = nums;
  } else {
    const monthFirst = localeIsMonthFirst(locale);
    day = monthFirst ? nums[1] : nums[0];
    month = monthFirst ? nums[0] : nums[1];
    year = nums[2];
  }

  if (parts[parts.length - 1].length <= 2) {
    // A 2-digit year lands in a ±50-year window around today, which is what a
    // person typing "90" for 1990 means.
    const pivot = new Date().getFullYear() - 50;
    year = year + Math.ceil((pivot - year) / 100) * 100;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  // Rejects overflow like 31/02, which Date would roll into March.
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Accepts a Date, a parseable string, or nothing. */
export function coerceDate(
  value: Date | string | null | undefined,
  locale: string,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const parsed = parseDate(value, locale) ?? new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}
