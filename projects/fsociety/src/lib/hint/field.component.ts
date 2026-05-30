import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FsHintComponent } from './hint.component';

@Component({
  selector: 'fs-field',
  standalone: true,
  imports: [FsHintComponent],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsFieldComponent {
  @Input() label = '';
  @Input() htmlFor = '';
  @Input() optional = false;
  @Input() required = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() success = '';

  get messageType(): 'error' | 'success' | 'hint' | null {
    if (this.error) return 'error';
    if (this.success) return 'success';
    if (this.hint) return 'hint';
    return null;
  }
}
