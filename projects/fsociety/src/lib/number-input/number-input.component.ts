import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  minus:       `${CDN}/tabler:minus.svg`,
  plus:        `${CDN}/tabler:plus.svg`,
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsNumberInputState = 'default' | 'error' | 'success';

let numberInputIdCounter = 0;

/** Falls back when a binding resolves to null, undefined or ''. */
function textOr(value: string | null | undefined, fallback: string): string {
  return value === null || value === undefined || value === '' ? fallback : value;
}

function decrementLabelInput(value: string | null | undefined): string {
  return textOr(value, 'Disminuir');
}

function incrementLabelInput(value: string | null | undefined): string {
  return textOr(value, 'Aumentar');
}

/** How many decimals a step implies, so arithmetic can be snapped back to it. */
function decimalsOf(step: number): number {
  const s = String(step);
  if (s.includes('e-')) return Number(s.split('e-')[1]);
  return (s.split('.')[1] ?? '').length;
}

@Component({
  selector: 'fs-number-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsNumberInputComponent),
      multi: true,
    },
  ],
})
export class FsNumberInputComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input() hint = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() state: FsNumberInputState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';

  @Input() min?: number;
  @Input() max?: number;
  @Input() step = 1;

  /** Text before the value — a currency symbol, for instance. */
  @Input() prefix = '';

  /** Text after the value — a unit. */
  @Input() suffix = '';

  /**
   * Whether clearing the field is allowed. When false, an empty field falls back
   * to `min` (or 0) on blur instead of leaving the model null.
   */
  @Input() allowEmpty = true;

  @Input({ transform: decrementLabelInput }) decrementLabel = 'Disminuir';
  @Input({ transform: incrementLabelInput }) incrementLabel = 'Aumentar';

  @Output() valueChange = new EventEmitter<number | null>();

  @ViewChild('field') fieldRef?: ElementRef<HTMLInputElement>;

  readonly inputId = `fs-number-${++numberInputIdCounter}`;

  value: number | null = null;

  /**
   * The raw text in the field. Kept apart from `value` so a partial entry like
   * "-" or "0." survives while it is being typed — coercing on every keystroke
   * would delete the character the user just pressed.
   */
  text = '';

  private _onChange: (value: number | null) => void = () => {};
  private _onTouched: () => void = () => {};

  get canDecrement(): boolean {
    if (this.disabled || this.readonly) return false;
    if (this.value === null) return true;
    return this.min === undefined || this.value > this.min;
  }

  get canIncrement(): boolean {
    if (this.disabled || this.readonly) return false;
    if (this.value === null) return true;
    return this.max === undefined || this.value < this.max;
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  // ─── Stepping ─────────────────────────────────────────────────────────────

  step_(direction: 1 | -1): void {
    if (this.disabled || this.readonly) return;

    // Stepping from empty starts at min, or 0 when there is no floor, so the
    // first click lands somewhere predictable instead of on NaN.
    const from = this.value ?? this.min ?? 0;
    const next = this.value === null ? from : from + direction * this.step;

    this.commit(this.clamp(this.round(next)));
    this.fieldRef?.nativeElement.focus();
  }

  // ─── Typing ───────────────────────────────────────────────────────────────

  onTextInput(event: Event): void {
    this.text = (event.target as HTMLInputElement).value;

    if (this.text.trim() === '') {
      this.value = null;
      this._onChange(null);
      this.valueChange.emit(null);
      return;
    }

    const parsed = Number(this.text);
    // NaN means the entry is still in progress ("-", "1e", "0."). Leave the
    // model alone and let blur settle it.
    if (!Number.isNaN(parsed)) {
      // Deliberately not clamped here: typing "15" into a field with max 20
      // passes through "1", and clamping mid-entry would rewrite it to the
      // bound and fight the keystrokes.
      this.value = parsed;
      this._onChange(parsed);
      this.valueChange.emit(parsed);
    }
  }

  /** Blur is where the value is settled: clamped, rounded, and reconciled with
   *  the visible text so the two can never disagree. */
  onBlur(): void {
    if (this.text.trim() === '') {
      if (this.allowEmpty) {
        this.commit(null);
      } else {
        this.commit(this.clamp(this.min ?? 0));
      }
    } else {
      const parsed = Number(this.text);
      this.commit(Number.isNaN(parsed) ? this.value : this.clamp(this.round(parsed)));
    }
    this._onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    // The native number input already handles ArrowUp/Down. PageUp/Down move in
    // tens of a step, which is what makes a large range usable.
    if (event.key === 'PageUp') {
      event.preventDefault();
      this.commit(this.clamp(this.round((this.value ?? this.min ?? 0) + this.step * 10)));
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      this.commit(this.clamp(this.round((this.value ?? this.min ?? 0) - this.step * 10)));
    }
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  private commit(next: number | null): void {
    this.value = next;
    this.text = next === null ? '' : String(next);
    this._onChange(next);
    this.valueChange.emit(next);
  }

  private clamp(n: number): number {
    let out = n;
    if (this.min !== undefined && out < this.min) out = this.min;
    if (this.max !== undefined && out > this.max) out = this.max;
    return out;
  }

  /**
   * Snaps to the step's precision. Without this, ten increments of 0.1 land on
   * 0.9999999999999999 — floating point adds error that surfaces straight in the
   * field.
   */
  private round(n: number): number {
    const d = decimalsOf(this.step);
    return d === 0 ? Math.round(n) : Number(n.toFixed(d));
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined || value === '') {
      this.value = null;
      this.text = '';
      return;
    }
    const n = Number(value);
    this.value = Number.isNaN(n) ? null : n;
    this.text = this.value === null ? '' : String(this.value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
