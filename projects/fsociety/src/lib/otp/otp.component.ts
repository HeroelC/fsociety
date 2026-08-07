import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChildren,
  QueryList,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsOtpState = 'default' | 'error' | 'success';

/** Which characters a cell accepts. */
export type FsOtpMode = 'numeric' | 'alphanumeric';

let otpIdCounter = 0;

function lengthInput(value: number | string | null | undefined): number {
  const n = Number(value);
  // Clamped rather than trusted: a NaN or zero length would render no cells at
  // all and the control would silently do nothing.
  if (!Number.isFinite(n) || n < 1) return 6;
  return Math.min(12, Math.floor(n));
}

@Component({
  selector: 'fs-otp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsOtpComponent),
      multi: true,
    },
  ],
})
export class FsOtpComponent implements ControlValueAccessor, OnChanges {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() state: FsOtpState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';

  @Input({ transform: lengthInput }) length = 6;

  @Input() mode: FsOtpMode = 'numeric';

  /** Draws a separator before this index — `3` splits 6 cells into 3 + 3. */
  @Input() groupAt?: number;

  @Input() separator = '–';

  /** Selects the cell's content on focus, so typing overwrites it. */
  @Input() selectOnFocus = true;

  /** Emits once every cell is filled. */
  @Output() completed = new EventEmitter<string>();

  @Output() valueChange = new EventEmitter<string>();

  @ViewChildren('cell') cellRefs?: QueryList<ElementRef<HTMLInputElement>>;

  readonly inputId = `fs-otp-${++otpIdCounter}`;

  /** One character per cell. Kept as an array so each input binds to its own slot. */
  chars: string[] = [];

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor() {
    this.chars = Array(this.length).fill('');
  }

  /**
   * The reference initialised its array once, so changing `length` afterwards
   * left stale state — extra cells bound to undefined, removed ones kept their
   * value in the emitted code.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['length']) this.resize();
  }

  get value(): string {
    return this.chars.join('');
  }

  get filled(): boolean {
    return this.chars.length > 0 && this.chars.every(c => !!c);
  }

  get indexes(): number[] {
    return Array.from({ length: this.length }, (_, i) => i);
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  private get allowed(): RegExp {
    return this.mode === 'numeric' ? /[^0-9]/g : /[^0-9a-zA-Z]/g;
  }

  // ─── Input ────────────────────────────────────────────────────────────────

  /**
   * A cell holds one character, but the event can carry several: mobile SMS
   * autofill drops the whole code into the first field, and fast typing can
   * batch. Overflow is spread across the following cells instead of discarded —
   * the reference kept only the last character with `slice(-1)`, which threw the
   * rest away.
   */
  onCellInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(this.allowed, '');

    if (!cleaned) {
      this.setChar(index, '');
      input.value = '';
      return;
    }

    this.fillFrom(index, cleaned);
  }

  onCellKeydown(index: number, event: KeyboardEvent): void {
    switch (event.key) {
      case 'Backspace':
        if (this.chars[index]) {
          // Clear this cell and stay, so a single Backspace does not skip a cell.
          this.setChar(index, '');
        } else if (index > 0) {
          this.setChar(index - 1, '');
          this.focusAt(index - 1);
        }
        event.preventDefault();
        break;

      case 'Delete':
        this.setChar(index, '');
        event.preventDefault();
        break;

      case 'ArrowLeft':
        if (index > 0) this.focusAt(index - 1);
        event.preventDefault();
        break;

      case 'ArrowRight':
        if (index < this.length - 1) this.focusAt(index + 1);
        event.preventDefault();
        break;

      case 'Home':
        this.focusAt(0);
        event.preventDefault();
        break;

      case 'End':
        this.focusAt(this.length - 1);
        event.preventDefault();
        break;
    }
  }

  /**
   * Paste fills from the cell it lands on, not from zero. Pasting a full code
   * into the first cell fills everything; pasting two digits into cell 4 fills 4
   * and 5 and leaves the rest — the reference always restarted at 0, so pasting
   * mid-field wiped what came before.
   */
  onPaste(index: number, event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const cleaned = text.replace(this.allowed, '');
    if (cleaned) this.fillFrom(index, cleaned);
  }

  onFocus(event: FocusEvent): void {
    if (this.selectOnFocus) (event.target as HTMLInputElement).select();
  }

  onBlur(): void {
    this._onTouched();
  }

  clear(): void {
    this.chars = Array(this.length).fill('');
    this.emit();
    this.focusAt(0);
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  private fillFrom(index: number, text: string): void {
    const next = [...this.chars];
    let cursor = index;

    for (const ch of text) {
      if (cursor >= this.length) break;
      next[cursor] = this.mode === 'numeric' ? ch : ch.toUpperCase();
      cursor++;
    }

    this.chars = next;
    this.emit();
    // Park on the last written cell when the code runs out, rather than past the
    // end where there is nothing to focus.
    this.focusAt(Math.min(cursor, this.length - 1));
  }

  private setChar(index: number, ch: string): void {
    const next = [...this.chars];
    next[index] = ch;
    this.chars = next;
    this.emit();
  }

  private emit(): void {
    const value = this.value;
    this._onChange(value);
    this.valueChange.emit(value);
    if (this.filled) this.completed.emit(value);
  }

  private focusAt(index: number): void {
    const el = this.cellRefs?.get(index)?.nativeElement;
    if (!el) return;
    el.focus();
    if (this.selectOnFocus) el.select();
  }

  private resize(): void {
    const next = Array(this.length).fill('');
    for (let i = 0; i < Math.min(this.chars.length, this.length); i++) {
      next[i] = this.chars[i] ?? '';
    }
    this.chars = next;
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: string | null): void {
    const cleaned = (value ?? '').replace(this.allowed, '');
    const next = Array(this.length).fill('');
    for (let i = 0; i < Math.min(cleaned.length, this.length); i++) {
      next[i] = this.mode === 'numeric' ? cleaned[i] : cleaned[i].toUpperCase();
    }
    this.chars = next;
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
