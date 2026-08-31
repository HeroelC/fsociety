import {
  AfterViewInit,
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
import { FsCorners } from '../corners';
import { FsControlSize } from '../control-size';

const CDN = 'https://api.iconify.design';
const ICONS = {
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsTextareaState = 'default' | 'error' | 'success';

/** How the box may be resized. `auto` grows to fit and disables manual resizing. */
export type FsTextareaResize = 'vertical' | 'none' | 'auto';

let textareaIdCounter = 0;

@Component({
  selector: 'fs-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsTextareaComponent),
      multi: true,
    },
  ],
})
export class FsTextareaComponent implements ControlValueAccessor, AfterViewInit {
  readonly Icons = ICONS;

  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() rows = 3;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() state: FsTextareaState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';

  /** Caps the length and turns on the counter. */
  @Input() maxlength?: number;

  /** Shows "12 / 200" under the field. Implied by `maxlength`. */
  @Input() showCounter = false;

  @Input() resize: FsTextareaResize = 'vertical';

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

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('field') fieldRef?: ElementRef<HTMLTextAreaElement>;

  readonly inputId = `fs-textarea-${++textareaIdCounter}`;

  value = '';

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    // A value set before the view existed still needs the box sized to it.
    if (this.resize === 'auto') this.grow();
  }

  get counterVisible(): boolean {
    return this.showCounter || this.maxlength !== undefined;
  }

  get counterText(): string {
    const n = this.value.length;
    return this.maxlength === undefined ? String(n) : `${n} / ${this.maxlength}`;
  }

  /** Flags the counter once the remaining room is nearly gone. */
  get counterNearLimit(): boolean {
    if (this.maxlength === undefined) return false;
    return this.value.length >= this.maxlength * 0.9;
  }

  get showStateIcon(): boolean {
    return this.state !== 'default';
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLTextAreaElement).value;
    this._onChange(this.value);
    this.valueChange.emit(this.value);
    if (this.resize === 'auto') this.grow();
  }

  onBlur(): void {
    this._onTouched();
  }

  /**
   * Auto-grow. Height is reset to `auto` first because scrollHeight never
   * shrinks below the current height — without the reset the box could only ever
   * get taller, never come back down when text is deleted.
   */
  private grow(): void {
    const el = this.fieldRef?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (this.resize === 'auto') {
      // The DOM value has not been written yet at this point in the cycle.
      queueMicrotask(() => this.grow());
    }
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
