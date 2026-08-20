import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  check: `${CDN}/tabler:check.svg`,
  minus: `${CDN}/tabler:minus.svg`,
} as const;

export type FsCheckboxState = 'default' | 'error';

let cbId = 0;

@Component({
  selector: 'fs-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsCheckboxComponent),
      multi: true,
    },
  ],
})
export class FsCheckboxComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() label = '';

  /**
   * Nombre accesible cuando no hay `label` visible — por ejemplo, la casilla
   * suelta de una celda de tabla. Sin esto la casilla se anuncia sin nombre.
   */
  @Input() ariaLabel = '';

  @Input() description = '';
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() state: FsCheckboxState = 'default';
  @Input() errorMessage = '';

  readonly id = `fs-cb-${++cbId}`;
  checked = false;

  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this._onChange(this.checked);
    this._onTouched();
  }

  onBlur(): void {
    this._onTouched();
  }

  writeValue(v: boolean): void { this.checked = !!v; }
  registerOnChange(fn: (v: boolean) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
