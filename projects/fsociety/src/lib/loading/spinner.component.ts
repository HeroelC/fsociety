import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsSpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'fs-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fs-spinner',
    '[class.fs-spinner--sm]': `size === 'sm'`,
    '[class.fs-spinner--lg]': `size === 'lg'`,
    // Without a label there is nothing to announce, and a bare live region
    // that never says anything is worse than none. The label is what turns it
    // into a status; inside a button the button already carries aria-busy.
    '[attr.role]': `label ? 'status' : null`,
    '[attr.aria-label]': 'label || null',
    '[attr.aria-hidden]': `label ? null : 'true'`,
  },
})
export class FsSpinnerComponent {
  /** Use `--fs-spinner-size` for anything outside the three steps. */
  @Input() size: FsSpinnerSize = 'md';

  /**
   * Announced to assistive tech. Leave empty when the spinner sits inside a
   * control that already describes the wait, such as a loading button.
   */
  @Input() label = '';
}
