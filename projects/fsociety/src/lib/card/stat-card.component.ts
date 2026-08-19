import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsCorners } from '../corners';

export type FsStatDeltaTone = 'success' | 'danger' | 'neutral';

/** A single metric: label, big number, and an optional change pill. */
@Component({
  selector: 'fs-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsStatCardComponent {
  @Input() label = '';

  /** Pre-formatted — currency, percentages and separators are the caller's call. */
  @Input() value: string | number = '';

  /** The change pill, e.g. `+8.2%`. Hidden when empty. */
  @Input() delta = '';

  /**
   * Whether the delta reads as good or bad. Not derived from its sign: a rising
   * churn is `+0.4%` and still bad.
   */
  @Input() deltaTone: FsStatDeltaTone = 'success';

  /** Icon URL, shown muted beside the label. */
  @Input() icon?: string;

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';
}
