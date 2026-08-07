import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsSliderState = 'default' | 'error' | 'success';

/** Where the current value is shown, if at all. */
export type FsSliderValuePosition = 'right' | 'top' | 'none';

let sliderIdCounter = 0;

/** How many decimals a step implies, so arithmetic can be snapped back to it. */
function decimalsOf(step: number): number {
  const s = String(step);
  if (s.includes('e-')) return Number(s.split('e-')[1]);
  return (s.split('.')[1] ?? '').length;
}

@Component({
  selector: 'fs-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsSliderComponent),
      multi: true,
    },
  ],
})
export class FsSliderComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() state: FsSliderState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';

  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  /** Appended to the displayed value — '%', 'px', 'kg'. */
  @Input() unit = '';

  @Input() valuePosition: FsSliderValuePosition = 'right';

  /** Prints min and max under the track. */
  @Input() showBounds = false;

  /**
   * Tick marks along the track. `true` places one per step, a number places that
   * many evenly. Steps are not drawn when they would be closer than ~3% apart,
   * because past that the ticks read as a solid bar.
   */
  @Input() ticks: boolean | number = false;

  /** Formats the shown value. Defaults to the number plus the unit. */
  @Input() formatValue?: (value: number) => string;

  @Output() valueChange = new EventEmitter<number>();

  readonly inputId = `fs-slider-${++sliderIdCounter}`;

  value = 0;

  private _onChange: (value: number) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor() {
    this.value = this.min;
  }

  /**
   * How far along the track the value sits, 0–100.
   *
   * The span is guarded because `max === min` is a legitimate configuration while
   * a form is still loading its bounds, and dividing by it gives NaN — which
   * silently breaks the gradient and the tick positions.
   */
  get percent(): number {
    const span = this.max - this.min;
    if (span <= 0) return 0;
    const pct = ((this.value - this.min) / span) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  /** The filled portion is painted as a gradient stop on the track itself. */
  get trackBackground(): string {
    return (
      `linear-gradient(90deg,` +
      ` var(--fs-color-primary) 0%,` +
      ` var(--fs-color-primary) ${this.percent}%,` +
      ` var(--fs-slider-track) ${this.percent}%,` +
      ` var(--fs-slider-track) 100%)`
    );
  }

  get displayValue(): string {
    if (this.formatValue) return this.formatValue(this.value);
    return `${this.value}${this.unit}`;
  }

  get boundsMin(): string {
    return this.formatValue ? this.formatValue(this.min) : `${this.min}${this.unit}`;
  }

  get boundsMax(): string {
    return this.formatValue ? this.formatValue(this.max) : `${this.max}${this.unit}`;
  }

  /** Tick positions as percentages, or empty when they would crowd. */
  get tickPercents(): number[] {
    if (!this.ticks) return [];
    const span = this.max - this.min;
    if (span <= 0) return [];

    const count = this.ticks === true ? Math.round(span / this.step) : Math.round(this.ticks);
    if (!Number.isFinite(count) || count < 1) return [];
    // Below ~3% apart the marks merge into a bar and stop meaning anything.
    if (100 / count < 3) return [];

    return Array.from({ length: count + 1 }, (_, i) => (i / count) * 100);
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  onInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    // Snapped to the step's precision: a range input with step 0.1 can report
    // values like 0.30000000000000004 once the browser interpolates.
    const d = decimalsOf(this.step);
    const next = d === 0 ? Math.round(raw) : Number(raw.toFixed(d));
    this.value = next;
    this._onChange(next);
    this.valueChange.emit(next);
  }

  onBlur(): void {
    this._onTouched();
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined || value === '') {
      this.value = this.min;
      return;
    }
    const n = Number(value);
    this.value = Number.isFinite(n) ? Math.max(this.min, Math.min(this.max, n)) : this.min;
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
