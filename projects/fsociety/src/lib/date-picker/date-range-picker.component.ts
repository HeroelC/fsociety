import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
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
  startOfDay,
  startOfMonth,
  weekdayNames,
  type FsCalendarDay,
} from './calendar.util';
import { FsCorners } from '../corners';
import { FsControlSize } from '../control-size';

const CDN = 'https://api.iconify.design';
const ICONS = {
  calendar:     `${CDN}/tabler:calendar.svg`,
  chevronLeft:  `${CDN}/tabler:chevron-left.svg`,
  chevronRight: `${CDN}/tabler:chevron-right.svg`,
  x:            `${CDN}/tabler:x.svg`,
  arrowRight:   `${CDN}/tabler:arrow-narrow-right.svg`,
  alertCircle:  `${CDN}/tabler:alert-circle.svg`,
  circleCheck:  `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsDateRangePickerState = 'default' | 'error' | 'success';

/**
 * The model value. Either end can be null while the range is half-picked, which
 * is why this is a pair of nullables rather than a tuple of Dates.
 */
export interface FsDateRange {
  start: Date | null;
  end: Date | null;
}

/** A one-click shortcut in the calendar's side rail. */
export interface FsDateRangePreset {
  label: string;
  /** Called on click; return the range to apply. */
  range: () => FsDateRange;
}

let rangeIdCounter = 0;

function orText(value: string | null | undefined, fallback: string): string {
  return value === null || value === undefined || value === '' ? fallback : value;
}

function startPlaceholderInput(value: string | null | undefined): string {
  return orText(value, 'Desde');
}

function endPlaceholderInput(value: string | null | undefined): string {
  return orText(value, 'Hasta');
}

function localeInput(value: string | null | undefined): string {
  return orText(value, 'es-AR');
}

function clearLabelInput(value: string | null | undefined): string {
  return orText(value, 'Limpiar');
}

function weekStartInput(value: number | string | null | undefined): number {
  return normaliseWeekStart(value, 1);
}

function monthsInput(value: number | string | null | undefined): number {
  const n = Number(value);
  // Two months is the point of a range calendar — you pick across a boundary
  // without paging. One is allowed for narrow layouts; more than two stops
  // fitting in a popover.
  return n === 1 || n === 2 ? n : 2;
}

@Component({
  selector: 'fs-date-range-picker',
  standalone: true,
  imports: [CommonModule, FsAnchoredPopoverDirective],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsDateRangePickerComponent),
      multi: true,
    },
  ],
})
export class FsDateRangePickerComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input({ transform: startPlaceholderInput }) startPlaceholder = 'Desde';
  @Input({ transform: endPlaceholderInput }) endPlaceholder = 'Hasta';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() state: FsDateRangePickerState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() clearable = true;

  @Input({ transform: localeInput }) locale = 'es-AR';
  @Input({ transform: weekStartInput }) firstDayOfWeek = 1;

  /** How many months to show side by side: 1 or 2. */
  @Input({ transform: monthsInput }) months = 2;

  @Input() min?: Date | string | null;
  @Input() max?: Date | string | null;

  /** Caps how long the range may be, in days. 0 means no cap. */
  @Input() maxSpan = 0;

  /** Shortcuts down the side of the calendar. */
  @Input() presets: FsDateRangePreset[] = [];

  @Input({ transform: clearLabelInput }) clearLabel = 'Limpiar';

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  /**
   * Tamaño del control — 32 / 40 / 48px de alto.
   *
   * Es la escala compartida de la librería: un `fs-button` con el mismo `size`
   * mide exactamente lo mismo, así que campo y botón quedan parejos al
   * ponerlos uno al lado del otro.
   */
  @Input() size: FsControlSize = 'md';

  @Output() valueChange = new EventEmitter<FsDateRange>();

  readonly inputId = `fs-date-range-${++rangeIdCounter}`;

  value: FsDateRange = { start: null, end: null };
  open = false;

  startText = '';
  endText = '';

  /** Left-most month on screen. */
  view: Date = startOfMonth(new Date());

  /**
   * Which end the next click sets. A range is picked in two clicks, and this is
   * what decides whether a click starts over or completes the pair.
   */
  picking: 'start' | 'end' = 'start';

  /** The day under the pointer, so the range previews before the second click. */
  hovered: Date | null = null;

  private _onChange: (value: FsDateRange) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  // ─── Derived view state ───────────────────────────────────────────────────

  get minDate(): Date | null {
    return coerceDate(this.min, this.locale);
  }

  get maxDate(): Date | null {
    return coerceDate(this.max, this.locale);
  }

  get weekdays(): string[] {
    return weekdayNames(this.locale, this.firstDayOfWeek);
  }

  /** The months on screen, left to right. */
  get visibleMonths(): Date[] {
    return Array.from({ length: this.months }, (_, i) => addMonths(this.view, i));
  }

  labelFor(month: Date): string {
    return monthLabel(month, this.locale);
  }

  /**
   * Grid for one month.
   *
   * While the second click is pending, the hovered day stands in for the end so
   * the highlight follows the pointer. Without that the range only appears after
   * committing, and you cannot see what you are about to pick.
   */
  weeksFor(month: Date): FsCalendarDay[][] {
    const previewEnd =
      this.picking === 'end' && this.value.start && this.hovered
        ? this.hovered
        : this.value.end;

    return buildMonthGrid({
      month,
      firstDayOfWeek: this.firstDayOfWeek,
      selected: this.value.start,
      selectedEnd: previewEnd,
      min: this.minDate,
      max: this.effectiveMax,
    });
  }

  /**
   * maxSpan narrows the ceiling once a start is chosen, so days beyond the cap
   * render disabled instead of being rejected after the click.
   */
  private get effectiveMax(): Date | null {
    const hard = this.maxDate;
    if (this.picking !== 'end' || !this.value.start || this.maxSpan <= 0) return hard;

    const cap = startOfDay(this.value.start);
    cap.setDate(cap.getDate() + this.maxSpan - 1);
    if (!hard) return cap;
    return cap < startOfDay(hard) ? cap : hard;
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  get showClearBtn(): boolean {
    return (
      this.clearable &&
      (!!this.value.start || !!this.value.end) &&
      !this.disabled &&
      !this.readonly
    );
  }

  // ─── Open / close ─────────────────────────────────────────────────────────

  toggle(): void {
    if (this.disabled || this.readonly) return;
    this.open ? this.close() : this.openCalendar();
  }

  openCalendar(): void {
    if (this.disabled || this.readonly) return;
    this.open = true;
    // Land on the month of whatever is already chosen, so reopening does not
    // throw away context.
    this.view = startOfMonth(this.value.start ?? new Date());
    this.picking = this.value.start && !this.value.end ? 'end' : 'start';
    this.hovered = null;
  }

  close(): void {
    this.open = false;
    this.hovered = null;
    // An abandoned half-range would leave the field showing a start with no end.
    if (this.value.start && !this.value.end) this.picking = 'end';
    this._onTouched();
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(event.target)) this.close();
  }

  /**
   * Escape cierra el panel, igual que en `fs-date-picker`.
   *
   * Va en `document` y no en el host porque el panel se abre con el mouse
   * sobre un wrapper que no recibe foco: un listener del host no vería la
   * tecla mientras el foco siga en el `body`.
   */
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.open && event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  shiftMonth(delta: number): void {
    this.view = addMonths(this.view, delta);
  }

  // ─── Selection ────────────────────────────────────────────────────────────

  onDayClick(day: FsCalendarDay): void {
    if (day.disabled) return;
    const picked = startOfDay(day.date);

    if (this.picking === 'start' || !this.value.start) {
      // A fresh start clears any previous end, otherwise the field would show a
      // range whose start is newer than its end.
      this.commit({ start: picked, end: null });
      this.picking = 'end';
      return;
    }

    // Clicking before the start treats the click as a new start rather than an
    // invalid backwards range — that is what a user means by it.
    if (picked < startOfDay(this.value.start)) {
      this.commit({ start: picked, end: null });
      this.picking = 'end';
      return;
    }

    this.commit({ start: this.value.start, end: picked });
    this.picking = 'start';
    this.close();
  }

  onDayHover(day: FsCalendarDay): void {
    if (day.disabled) return;
    this.hovered = day.date;
  }

  applyPreset(preset: FsDateRangePreset): void {
    const range = preset.range();
    this.commit({
      start: range.start ? startOfDay(range.start) : null,
      end: range.end ? startOfDay(range.end) : null,
    });
    this.picking = 'start';
    if (range.start) this.view = startOfMonth(range.start);
  }

  clear(): void {
    this.commit({ start: null, end: null });
    this.picking = 'start';
    this.hovered = null;
  }

  // ─── Typing ───────────────────────────────────────────────────────────────

  onStartInput(event: Event): void {
    this.startText = (event.target as HTMLInputElement).value;
    const parsed = parseDate(this.startText, this.locale);
    if (parsed) {
      this.view = startOfMonth(parsed);
      this.commit({ start: parsed, end: this.value.end }, false);
    } else if (this.startText.trim() === '') {
      this.commit({ start: null, end: this.value.end }, false);
    }
  }

  onEndInput(event: Event): void {
    this.endText = (event.target as HTMLInputElement).value;
    const parsed = parseDate(this.endText, this.locale);
    if (parsed) {
      this.commit({ start: this.value.start, end: parsed }, false);
    } else if (this.endText.trim() === '') {
      this.commit({ start: this.value.start, end: null }, false);
    }
  }

  /** Blur reconciles the text with the model and orders the two ends. */
  onFieldBlur(): void {
    let { start, end } = this.value;

    // A range typed backwards is swapped rather than rejected. Rejecting would
    // silently drop what was typed.
    if (start && end && end < start) [start, end] = [end, start];

    this.commit({ start, end });
    this._onTouched();
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  private commit(next: FsDateRange, syncText = true): void {
    this.value = next;
    if (syncText) {
      this.startText = next.start ? formatDate(next.start, this.locale) : '';
      this.endText = next.end ? formatDate(next.end, this.locale) : '';
    }
    this._onChange(next);
    this.valueChange.emit(next);
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: FsDateRange | null): void {
    const start = coerceDate(value?.start, this.locale);
    const end = coerceDate(value?.end, this.locale);
    this.value = {
      start: start ? startOfDay(start) : null,
      end: end ? startOfDay(end) : null,
    };
    this.startText = this.value.start ? formatDate(this.value.start, this.locale) : '';
    this.endText = this.value.end ? formatDate(this.value.end, this.locale) : '';
    if (this.value.start) this.view = startOfMonth(this.value.start);
    this.picking = this.value.start && !this.value.end ? 'end' : 'start';
  }

  registerOnChange(fn: (value: FsDateRange) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
