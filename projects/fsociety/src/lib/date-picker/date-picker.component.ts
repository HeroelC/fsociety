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
import {
  addMonths,
  buildMonthGrid,
  coerceDate,
  formatDate,
  monthLabel,
  normaliseWeekStart,
  parseDate,
  sameDay,
  startOfDay,
  startOfMonth,
  weekdayNames,
  type FsCalendarDay,
} from './calendar.util';

// Re-exported so `import { FsCalendarDay } from '@heroelc/fsociety'` keeps
// working now that the type lives in the shared calendar module.
export type { FsCalendarDay };

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

function weekStartInput(value: number | string | null | undefined): number {
  return normaliseWeekStart(value, 1);
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
    return coerceDate(this.min, this.locale);
  }

  get maxDate(): Date | null {
    return coerceDate(this.max, this.locale);
  }

  get monthLabel(): string {
    return monthLabel(this.view, this.locale);
  }

  get weekdays(): string[] {
    return weekdayNames(this.locale, this.firstDayOfWeek);
  }

  get weeks(): FsCalendarDay[][] {
    return buildMonthGrid({
      month: this.view,
      firstDayOfWeek: this.firstDayOfWeek,
      selected: this.value,
      min: this.minDate,
      max: this.maxDate,
    });
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
    this.view = addMonths(startOfMonth(this.view), delta);
  }

  // ─── Selection ────────────────────────────────────────────────────────────

  select(date: Date): void {
    if (this.isDisabled(date)) return;
    const picked = startOfDay(date);
    this.value = picked;
    this.text = formatDate(picked, this.locale);
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
    const parsed = parseDate(this.text, this.locale);

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
    const parsed = parseDate(this.text, this.locale);
    if (parsed && !this.isDisabled(parsed)) {
      this.text = formatDate(parsed, this.locale);
    } else {
      this.text = this.value ? formatDate(this.value, this.locale) : '';
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
        this.view = startOfMonth(next);
      }
    };

    switch (event.key) {
      case 'ArrowLeft':  move(-1); break;
      case 'ArrowRight': move(1); break;
      case 'ArrowUp':    move(-7); break;
      case 'ArrowDown':  move(7); break;
      case 'Home': {
        event.preventDefault();
        move(-(((cursor.getDay() - this.firstDayOfWeek) + 7) % 7));
        break;
      }
      case 'End': {
        event.preventDefault();
        move(6 - (((cursor.getDay() - this.firstDayOfWeek) + 7) % 7));
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

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: Date | string | null): void {
    const coerced = coerceDate(value, this.locale);
    this.value = coerced ? startOfDay(coerced) : null;
    this.text = this.value ? formatDate(this.value, this.locale) : '';
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
