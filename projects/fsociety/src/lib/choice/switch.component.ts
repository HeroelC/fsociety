import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

let swId = 0;

@Component({
  selector: 'fs-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsSwitchComponent),
      multi: true,
    },
  ],
})
export class FsSwitchComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() description = '';
  @Input() disabled = false;

  readonly id = `fs-sw-${++swId}`;
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
