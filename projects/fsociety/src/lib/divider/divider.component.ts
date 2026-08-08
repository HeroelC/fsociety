import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsDividerOrientation = 'horizontal' | 'vertical';
export type FsDividerVariant = 'solid' | 'dashed';
export type FsDividerAlign = 'center' | 'left' | 'right';

@Component({
  selector: 'fs-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Everything lives on the host: a wrapper element would break `align-self:
  // stretch`, which is what gives the vertical divider the height of its row.
  host: {
    class: 'fs-divider',
    role: 'separator',
    '[class.fs-divider--vertical]': `orientation === 'vertical'`,
    '[class.fs-divider--dashed]': `variant === 'dashed'`,
    '[class.fs-divider--labelled]': 'labelled',
    '[class.fs-divider--left]': `align === 'left'`,
    '[class.fs-divider--right]': `align === 'right'`,
    // `horizontal` is the implicit default for role=separator, so it is only
    // worth spelling out the other one.
    '[attr.aria-orientation]': `orientation === 'vertical' ? 'vertical' : null`,
    '[attr.aria-label]': 'label || null',
  },
})
export class FsDividerComponent {
  @Input() orientation: FsDividerOrientation = 'horizontal';

  @Input() variant: FsDividerVariant = 'solid';

  @Input() label = '';

  /** Icon URL, shown before the label. */
  @Input() icon?: string;

  /** Where the label sits. Ignored without a label. */
  @Input() align: FsDividerAlign = 'center';

  /** A vertical divider is always a plain rule — a label needs the horizontal run. */
  get labelled(): boolean {
    return this.orientation === 'horizontal' && !!(this.label || this.icon);
  }
}
