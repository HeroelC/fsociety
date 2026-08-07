import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsAnchoredPopoverDirective } from '../overlay/anchored-popover.directive';

const CDN = 'https://api.iconify.design';
const ICONS = {
  calendar:     `${CDN}/tabler:calendar.svg`,
  chevronLeft:  `${CDN}/tabler:chevron-left.svg`,
  chevronRight: `${CDN}/tabler:chevron-right.svg`,
  chevronDown:  `${CDN}/tabler:chevron-down.svg`,
  x:            `${CDN}/tabler:x.svg`,
  alertCircle:  `${CDN}/tabler:alert-circle.svg`,
  circleCheck:  `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsDatePickerState = 'default' | 'error' | 'success';

/** One cell of the month grid. Every cell is a real date — the grid is padded
 *  with the neighbouring months rather than with blanks. */
export interface FsCalendarDay {
  date: Date;
  day: number;
  today: boolean;
  selected: boolean;
  disabled: boolean;
  outside: boolean;
}

let datePickerIdCounter = 0;

// ─── Input guards ───────────────────────────────────────────────────────────
// A binding that resolves to null or undefined must not reach the DOM. Angular
// writes the property as-is and the browser stringifies it, so
// `[placeholder]="maybeUndefined"` makes the empty field read "undefined".
//
// These are plain function declarations on purpose: @Input({ transform }) is
// resolved statically by the AOT compiler, so a factory call like
// `textOr('dd/mm/aaaa')` fails with NG1010 — the transform has to be a
// reference, not the result of calling something.

function orText(value: string | null | undefined, fallback: string): string {
  return value === null || value === undefined || value === '' ? fallback : value;
}

function placeholderInput(value: string | null | undefined): string {
  return orText(value, 'dd/mm/aaaa');
}

function localeInput(value: string | null | undefined): string {
  return orText(value, 'es-AR');
}

function todayLabelInput(value: string | null | undefined): string {
  return orText(value, 'Hoy');
}

function clearLabelInput(value: string | null | undefined): string {
  return orText(value, 'Limpiar');
}

/**
 * The week start feeds modular arithmetic, so an unset binding is worse than
 * cosmetic: `undefined % 7` is NaN, which turns every cell of the grid into an
 * Invalid Date.
 *
 * null and '' are rejected before coercing, because `Number(null)` is 0 — so
 * `[firstDayOfWeek]="config?.weekStart"` on a null config would silently mean
 * Sunday rather than falling back to the documented Monday.
 *
 * A valid number is wrapped into 0–6, so 7 reads as Sunday and -1 as Saturday.
 */
function weekStartInput(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 1;
  const n = Number(value);
  return Number.isFinite(n) ? ((n % 7) + 7) % 7 : 1;
}

/** Midnight of the given date, so comparisons ignore the time component. */
function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return (
    !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

@Component({
  selector: 'fs-date-picker',
  standalone: true,
  imports: [CommonModule, FsAnchoredPopoverDirective],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsDatePickerComponent),
      multi: true,
    },
  ],
})
export class FsDatePickerComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input({ transform: placeholderInput }) placeholder = 'dd/mm/aaaa';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() state: FsDatePickerState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() clearable = true;

  /**
   * BCP 47 locale for month and weekday names and for the typed format.
   * Month/weekday names come from Intl rather than a hardcoded array, because
   * this ships on npm and cannot assume Spanish.
   */
  @Input({ transform: localeInput }) locale = 'es-AR';

  /** First day of the week: 0 Sunday … 1 Monday. Normalised into 0–6. */
  @Input({ transform: weekStartInput }) firstDayOfWeek = 1;

  /** Earliest selectable date. Days before it render disabled. */
  @Input() min?: Date | string | null;

  /** Latest selectable date. */
  @Input() max?: Date | string | null;

  /** Hides the Today / Clear footer. */
  @Input() showFooter = true;

  @Input({ transform: todayLabelInput }) todayLabel = 'Hoy';
  @Input({ transform: clearLabelInput }) clearLabel = 'Limpiar';

  @Output() valueChange = new EventEmitter<Date | null>();

  @ViewChild('field') fieldRef?: ElementRef<HTMLInputElement>;

  readonly inputId = `fs-date-picker-${++datePickerIdCounter}`;

  value: Date | null = null;
  open = false;

  /** What the user has typed. Kept separate from `value` so a half-typed date
   *  does not clobber a valid one until it parses. */
  text = '';

  /** Month currently on screen. Not the selection — you can browse away. */
  view: Date = startOfDay(new Date());

  /** Keyboard cursor inside the grid, so arrows can move without selecting. */
  focused: Date | null = null;

  private _onChange: (value: Date | null) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  // ─── Derived view state ───────────────────────────────────────────────────

  get minDate(): Date | null {
    return this.coerce(this.min);
  }

  get maxDate(): Date | null {
    return this.coerce(this.max);
  }

  /** e.g. "marzo 2026", capitalised for the header. */
  get monthLabel(): string {
    const raw = new Intl.DateTimeFormat(this.locale, {
      month: 'long',
      year: 'numeric',
    }).format(this.view);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  /** Narrow weekday initials, rotated to honour firstDayOfWeek. */
  get weekdays(): string[] {
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'narrow' });
    // 2024-01-07 is a Sunday, so index 0 lines up with getDay() === 0.
    const base = Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 7 + i)),
    );
    const offset = this.firstDayOfWeek;   // ya normalizado 0-6 por el transform
    return [...base.slice(offset), ...base.slice(0, offset)];
  }

  /**
   * Always six rows. A month spans 4–6 week rows depending on its length and
   * start day, and letting the grid change height makes the popover jump as you
   * page through months — so leading and trailing days from the neighbouring
   * months fill it out.
   */
  get weeks(): FsCalendarDay[][] {
    const year = this.view.getFullYear();
    const month = this.view.getMonth();
    const today = startOfDay(new Date());
    const first = new Date(year, month, 1);
    const offset = this.firstDayOfWeek;   // ya normalizado 0-6 por el transform
    const lead = (first.getDay() - offset + 7) % 7;

    const cells: FsCalendarDay[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(year, month, 1 - lead + i);
      cells.push({
        date,
        day: date.getDate(),
        today: sameDay(date, today),
        selected: sameDay(date, this.value),
        disabled: this.isDisabled(date),
        outside: date.getMonth() !== month,
      });
    }

    const rows: FsCalendarDay[][] = [];
    for (let i = 0; i < 42; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  get showClearBtn(): boolean {
    return this.clearable && !!this.value && !this.disabled && !this.readonly;
  }

  isDisabled(date: Date): boolean {
    const d = startOfDay(date);
    const min = this.minDate;
    const max = this.maxDate;
    if (min && d < startOfDay(min)) return true;
    if (max && d > startOfDay(max)) return true;
    return false;
  }

  isFocused(date: Date): boolean {
    return sameDay(date, this.focused);
  }

  // ─── Open / close ─────────────────────────────────────────────────────────

  toggle(): void {
    if (this.disabled || this.readonly) return;
    this.open ? this.close() : this.openCalendar();
  }

  openCalendar(): void {
    if (this.disabled || this.readonly) return;
    this.open = true;
    this.view = startOfDay(this.value ?? new Date());
    this.focused = this.value ? startOfDay(this.value) : startOfDay(new Date());
  }

  close(): void {
    this.open = false;
    this.focused = null;
    this._onTouched();
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // ─── Month navigation ─────────────────────────────────────────────────────

  shiftMonth(delta: number): void {
    this.view = new Date(this.view.getFullYear(), this.view.getMonth() + delta, 1);
  }

  // ─── Selection ────────────────────────────────────────────────────────────

  select(date: Date): void {
    if (this.isDisabled(date)) return;
    const picked = startOfDay(date);
    this.value = picked;
    this.text = this.format(picked);
    this._onChange(picked);
    this.valueChange.emit(picked);
    this.close();
    this.fieldRef?.nativeElement.focus();
  }

  selectToday(): void {
    const today = startOfDay(new Date());
    if (this.isDisabled(today)) return;
    this.select(today);
  }

  clear(): void {
    this.value = null;
    this.text = '';
    this._onChange(null);
    this.valueChange.emit(null);
    this.fieldRef?.nativeElement.focus();
  }

  // ─── Typing ───────────────────────────────────────────────────────────────

  onTextInput(event: Event): void {
    this.text = (event.target as HTMLInputElement).value;
    const parsed = this.parse(this.text);

    // An unparseable or out-of-range string is left alone while typing —
    // clobbering the model on every keystroke would fight the user halfway
    // through "15/03/1990". It is resolved on blur instead.
    if (parsed && !this.isDisabled(parsed)) {
      this.value = parsed;
      this.view = parsed;
      this.focused = parsed;
      this._onChange(parsed);
      this.valueChange.emit(parsed);
    } else if (this.text.trim() === '') {
      this.value = null;
      this._onChange(null);
      this.valueChange.emit(null);
    }
  }

  /**
   * Blur is where a half-typed or invalid entry gets resolved: either it becomes
   * the canonical format of a real date, or it reverts to whatever the model
   * holds. Leaving garbage in the field would let the visible text disagree with
   * the value.
   */
  onBlur(): void {
    const parsed = this.parse(this.text);
    if (parsed && !this.isDisabled(parsed)) {
      this.text = this.format(parsed);
    } else {
      this.text = this.value ? this.format(this.value) : '';
    }
    this._onTouched();
  }

  // ─── Keyboard ─────────────────────────────────────────────────────────────

  onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' && !this.open) {
      event.preventDefault();
      this.openCalendar();
      return;
    }
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.close();
      return;
    }
    if (this.open) this.onCalendarKeydown(event);
  }

  onCalendarKeydown(event: KeyboardEvent): void {
    const cursor = this.focused ?? startOfDay(this.value ?? new Date());
    const move = (days: number) => {
      event.preventDefault();
      const next = new Date(cursor);
      next.setDate(next.getDate() + days);
      this.focused = next;
      // Follow the cursor across a month boundary.
      if (next.getMonth() !== this.view.getMonth() || next.getFullYear() !== this.view.getFullYear()) {
        this.view = new Date(next.getFullYear(), next.getMonth(), 1);
      }
    };

    switch (event.key) {
      case 'ArrowLeft':  move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'ArrowUp':    move(-7); break;
      case 'ArrowDown':  move(7); break;
      case 'Home': {
        event.preventDefault();
        const offset = this.firstDayOfWeek;   // ya normalizado 0-6 por el transform
        move(-(((cursor.getDay() - offset) + 7) % 7));
        break;
      }
      case 'End': {
        event.preventDefault();
        const offset = this.firstDayOfWeek;   // ya normalizado 0-6 por el transform
        move(6 - (((cursor.getDay() - offset) + 7) % 7));
        break;
      }
      case 'PageUp':
        event.preventDefault();
        this.shiftMonth(event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        event.preventDefault();
        this.shiftMonth(event.shiftKey ? 12 : 1);
        break;
      case 'Enter':
        if (this.focused) {
          event.preventDefault();
          this.select(this.focused);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  // ─── Formatting / parsing ─────────────────────────────────────────────────

  /**
   * Canonical text for a date, in the locale's own numeric order — so es-AR
   * gives 15/03/1990 and en-US gives 3/15/1990 without a format string input.
   */
  format(date: Date): string {
    return new Intl.DateTimeFormat(this.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  /**
   * Parses what the user typed. `new Date(string)` is deliberately avoided: it
   * reads "15/03/1990" as an invalid US date, and bare "2024-03-15" as UTC,
   * which shifts a day in negative offsets.
   *
   * Accepts any of `-` `/` `.` as separators, a 2- or 4-digit year, and detects
   * ISO by a leading 4-digit group. Otherwise the field order is taken from the
   * locale, so es-AR reads day-first and en-US month-first.
   */
  parse(input: string): Date | null {
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
      const monthFirst = this.localeIsMonthFirst();
      day = monthFirst ? nums[1] : nums[0];
      month = monthFirst ? nums[0] : nums[1];
      year = nums[2];
    }

    if (parts[parts.length - 1].length <= 2) {
      // A 2-digit year is read inside a ±50-year window around today, which is
      // what a person typing "90" for 1990 means.
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

  /** Whether this locale writes the month before the day. */
  private localeIsMonthFirst(): boolean {
    const parts = new Intl.DateTimeFormat(this.locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(new Date(2024, 10, 22));
    const order = parts.filter(p => p.type === 'day' || p.type === 'month');
    return order[0]?.type === 'month';
  }

  private coerce(v: Date | string | null | undefined): Date | null {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const parsed = this.parse(v) ?? new Date(v);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: Date | string | null): void {
    const coerced = this.coerce(value);
    this.value = coerced ? startOfDay(coerced) : null;
    this.text = this.value ? this.format(this.value) : '';
    if (this.value) this.view = this.value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
