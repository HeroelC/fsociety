import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsControlSize } from '../control-size';

export interface FsRadioOption {
  value: string;
  label: string;
  description?: string;
}

let rgId = 0;

@Component({
  selector: 'fs-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsRadioGroupComponent),
      multi: true,
    },
  ],
})
export class FsRadioGroupComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() description = '';
  @Input() options: FsRadioOption[] = [];
  @Input() disabled = false;
  @Input() state: 'default' | 'error' = 'default';
  @Input() errorMessage = '';

  /**
   * Tamaño del control — 32 / 40 / 48px de alto.
   *
   * Es la escala compartida de la librería: un `fs-button` con el mismo `size`
   * mide exactamente lo mismo, así que campo y botón quedan parejos al
   * ponerlos uno al lado del otro.
   */
  @Input() size: FsControlSize = 'md';

  readonly groupName = `fs-rg-${++rgId}`;
  value = '';

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  select(opt: FsRadioOption): void {
    if (this.disabled) return;
    this.value = opt.value;
    this._onChange(opt.value);
    this._onTouched();
  }

  onBlur(): void {
    this._onTouched();
  }

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
