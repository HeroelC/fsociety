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
  starFilled:  `${CDN}/tabler:star-filled.svg`,
  heartFilled: `${CDN}/tabler:heart-filled.svg`,
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
} as const;

export type FsRatingState = 'default' | 'error';

/** The glyph. `star` and `heart` are built in; pass a URL for anything else. */
export type FsRatingIcon = 'star' | 'heart';

let ratingIdCounter = 0;

function countInput(value: number | string | null | undefined): number {
  const n = Number(value);
  // A zero or NaN count would render nothing and the control would look broken.
  if (!Number.isFinite(n) || n < 1) return 5;
  return Math.min(20, Math.floor(n));
}

@Component({
  selector: 'fs-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsRatingComponent),
      multi: true,
    },
  ],
})
export class FsRatingComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() state: FsRatingState = 'default';
  @Input() errorMessage = '';

  @Input({ transform: countInput }) count = 5;

  /** Clicking the current value clears it back to zero. */
  @Input() allowClear = true;

  /**
   * Display only — no interaction, no tab stop, and fractional values render as
   * a partially filled glyph. This is the mode for showing an average.
   */
  @Input() readonly = false;

  @Input() icon: FsRatingIcon | string = 'star';

  /** Prints the numeric value beside the glyphs. */
  @Input() showValue = false;

  /** Formats that readout. Defaults to one decimal when fractional. */
  @Input() formatValue?: (value: number) => string;

  @Output() valueChange = new EventEmitter<number>();

  readonly inputId = `fs-rating-${++ratingIdCounter}`;

  value = 0;

  /** Glyph under the pointer, previewing what a click would set. */
  hovered = 0;

  private _onChange: (value: number) => void = () => {};
  private _onTouched: () => void = () => {};

  get iconUrl(): string {
    if (this.icon === 'star') return ICONS.starFilled;
    if (this.icon === 'heart') return ICONS.heartFilled;
    return this.icon;
  }

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i + 1);
  }

  /**
   * How much of the row is filled, 0–100.
   *
   * Hover wins while interacting so the preview is immediate. One overlay clipped
   * to a percentage covers both integers and fractions, which is what lets
   * readonly show 4.2 without a second rendering path.
   */
  get fillPercent(): number {
    const shown = this.hovered || this.value;
    if (this.count <= 0) return 0;
    const pct = Math.max(0, Math.min(100, (shown / this.count) * 100));
    // Rounded because this lands in a style attribute: 4.2 of 5 computes to
    // 84.00000000000001, and shipping that into `width` is just noise in the DOM.
    return Math.round(pct * 100) / 100;
  }

  get displayValue(): string {
    if (this.formatValue) return this.formatValue(this.value);
    // Whole numbers stay whole; only a fractional average gains a decimal.
    return Number.isInteger(this.value) ? String(this.value) : this.value.toFixed(1);
  }

  get interactive(): boolean {
    return !this.readonly && !this.disabled;
  }

  /** Single tab stop for the whole group, like a native radiogroup. */
  get tabIndexFor(): number {
    return this.interactive ? 0 : -1;
  }

  ariaLabelFor(n: number): string {
    return `${n} de ${this.count}`;
  }

  // ─── Interaction ──────────────────────────────────────────────────────────

  pick(n: number): void {
    if (!this.interactive) return;
    // Re-clicking the current value clears it, which is the only way to undo a
    // rating with a pointer.
    const next = this.allowClear && n === this.value ? 0 : n;
    this.commit(next);
  }

  onEnter(n: number): void {
    if (!this.interactive) return;
    this.hovered = n;
  }

  onLeave(): void {
    this.hovered = 0;
  }

  /**
   * Arrow keys move the value rather than the focus, which is what makes this one
   * control instead of `count` separate tab stops.
   */
  onKeydown(event: KeyboardEvent): void {
    if (!this.interactive) return;

    const step = (delta: number) => {
      event.preventDefault();
      this.commit(Math.max(0, Math.min(this.count, Math.round(this.value) + delta)));
    };

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        step(1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        step(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.commit(1);
        break;
      case 'End':
        event.preventDefault();
        this.commit(this.count);
        break;
      case 'Delete':
      case 'Backspace':
        if (this.allowClear) {
          event.preventDefault();
          this.commit(0);
        }
        break;
    }
  }

  onBlur(): void {
    this.hovered = 0;
    this._onTouched();
  }

  private commit(next: number): void {
    this.value = next;
    this._onChange(next);
    this.valueChange.emit(next);
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined || value === '') {
      this.value = 0;
      return;
    }
    const n = Number(value);
    this.value = Number.isFinite(n) ? Math.max(0, Math.min(this.count, n)) : 0;
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
