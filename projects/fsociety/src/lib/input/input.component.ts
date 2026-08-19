import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsCorners } from '../corners';

const CDN = 'https://api.iconify.design';
const ICONS = {
  x:           `${CDN}/tabler:x.svg`,
  eye:         `${CDN}/tabler:eye.svg`,
  eyeOff:      `${CDN}/tabler:eye-off.svg`,
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export type FsInputType = 'text' | 'email' | 'password' | 'url' | 'search';
export type FsInputState = 'default' | 'error' | 'success';

let inputIdCounter = 0;

@Component({
  selector: 'fs-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsInputComponent),
      multi: true,
    },
  ],
})
export class FsInputComponent implements ControlValueAccessor {
  readonly Icons = ICONS;
  @Input() type: FsInputType = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:user.svg' o 'assets/user.svg'.
   * No es un nombre de Tabler: pasar "user" no renderiza nada ni avisa.
   */
  @Input() iconLeft = '';
  @Input() clearable = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() state: FsInputState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  readonly inputId = `fs-input-${++inputIdCounter}`;

  value = '';
  showPassword = false;

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  get inputType(): string {
    if (this.type === 'password') return this.showPassword ? 'text' : 'password';
    return this.type;
  }

  get showClearBtn(): boolean {
    return (
      this.clearable &&
      !!this.value &&
      !this.disabled &&
      !this.readonly &&
      this.state === 'default'
    );
  }

  get showPasswordToggle(): boolean {
    return this.type === 'password';
  }

  get showStateIcon(): boolean {
    return this.state !== 'default' && !this.showPasswordToggle;
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this._onChange(value);
  }

  onBlur(): void {
    this._onTouched();
  }

  /** mousedown.prevent mantiene el foco en el input al hacer click en el botón */
  clear(inputEl: HTMLInputElement): void {
    this.value = '';
    this._onChange('');
    inputEl.focus();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.value = value ?? '';
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
