import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FsSegmentOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'fs-segmented',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented.component.html',
  styleUrl: './segmented.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsSegmentedComponent),
      multi: true,
    },
  ],
})
export class FsSegmentedComponent implements ControlValueAccessor {
  @Input() options: FsSegmentOption[] = [];
  @Input() disabled = false;
  @Input() label = '';

  value = '';

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  select(opt: FsSegmentOption): void {
    if (this.disabled) return;
    this.value = opt.value;
    this._onChange(opt.value);
    this._onTouched();
  }

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
