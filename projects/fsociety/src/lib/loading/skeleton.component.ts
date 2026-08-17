import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsSkeletonVariant = 'text' | 'circle' | 'rect';
export type FsSkeletonAnimation = 'shimmer' | 'pulse' | 'none';

@Component({
  selector: 'fs-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fs-skeleton',
    '[class.fs-skeleton--text]': `variant === 'text'`,
    '[class.fs-skeleton--circle]': `variant === 'circle'`,
    '[class.fs-skeleton--rect]': `variant === 'rect'`,
    '[attr.data-animation]': 'animation',
    // A placeholder has nothing to announce. The loading state belongs to the
    // container that owns the data, via aria-busy — otherwise every bar shows
    // up as noise in the accessibility tree.
    'aria-hidden': 'true',
  },
})
export class FsSkeletonComponent {
  /**
   * `text` takes its height from the inherited font size, so it lines up with
   * whatever copy it stands in for. `circle` is a single diameter. `rect` is
   * the only one that needs explicit dimensions.
   */
  @Input() variant: FsSkeletonVariant = 'text';

  /** Number of bars. Ignored outside the `text` variant. */
  @Input() lines = 1;

  /** Any CSS length. Defaults to the full width of the container. */
  @Input() width?: string;

  /** Any CSS length. Only worth setting on `rect`. */
  @Input() height?: string;

  /** Circle diameter — any CSS length. */
  @Input() size?: string;

  /** Any CSS length. Overrides `--fs-skeleton-radius`. */
  @Input() radius?: string;

  /** Reduced-motion always wins over this and falls back to `none`. */
  @Input() animation: FsSkeletonAnimation = 'shimmer';

  /**
   * A short last line is what makes a stack of bars read as a paragraph
   * instead of a block. Only applied when there is more than one line.
   */
  @Input() lastLineWidth = '65%';

  get lineCount(): number {
    return this.variant === 'text' ? Math.max(1, this.lines) : 1;
  }

  get bars(): number[] {
    return Array.from({ length: this.lineCount }, (_, i) => i);
  }

  barWidth(index: number): string | null {
    if (this.variant === 'circle') {
      return this.size ?? null;
    }
    const isLastOfMany = this.lineCount > 1 && index === this.lineCount - 1;
    if (this.variant === 'text' && isLastOfMany) {
      return this.lastLineWidth;
    }
    return this.width ?? null;
  }

  get barHeight(): string | null {
    if (this.variant === 'circle') {
      return this.size ?? null;
    }
    return this.height ?? null;
  }
}
