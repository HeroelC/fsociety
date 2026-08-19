import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsCorners } from '../corners';

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

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  /**
   * Mirrors the CVA change for consumers that are not using a form. Matches
   * `fs-slider`, which exposes the same pair, so a control does not have to
   * be wrapped in a FormControl just to observe it.
   */
  @Output() valueChange = new EventEmitter<string>();

  value = '';

  private _onChange: (v: string) => void = () => {};
  private _onTouched: () => void = () => {};

  select(opt: FsSegmentOption): void {
    if (this.disabled) return;
    this.value = opt.value;
    this._onChange(opt.value);
    this._onTouched();
    this.valueChange.emit(opt.value);
  }

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(d: boolean): void { this.disabled = d; }
}
