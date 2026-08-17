import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsProgressTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
export type FsProgressSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'fs-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fs-progress',
    '[attr.data-tone]': 'tone',
    '[attr.data-size]': 'size',
  },
})
export class FsProgressComponent {
  /** Clamped to the `0…max` range before it reaches the DOM. */
  @Input() value = 0;

  @Input() max = 100;

  /** Work of unknown length — the bar loops instead of filling. */
  @Input() indeterminate = false;

  /** Shown above the bar, and used as the accessible name. */
  @Input() label = '';

  /** Adds the percentage next to the label. Ignored when indeterminate. */
  @Input() showValue = false;

  @Input() tone: FsProgressTone = 'primary';

  @Input() size: FsProgressSize = 'md';

  get percent(): number {
    if (this.max <= 0) {
      return 0;
    }
    return Math.max(0, Math.min(100, (this.value / this.max) * 100));
  }

  get roundedPercent(): number {
    return Math.round(this.percent);
  }

  get clampedValue(): number {
    return Math.max(0, Math.min(this.max, this.value));
  }

  get showHeader(): boolean {
    return !!this.label || (this.showValue && !this.indeterminate);
  }
}
