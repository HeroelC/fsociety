import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const TONE_ICONS = {
  success: `${CDN}/tabler:circle-check.svg`,
  danger: `${CDN}/tabler:alert-circle.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
  info: `${CDN}/tabler:info-circle.svg`,
} as const;

export type FsCardTone = 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'fs-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCardComponent {
  /** Icon URL for the header badge. */
  @Input() icon?: string;

  @Input() title = '';

  @Input() subtitle = '';

  /** Tints the border and adds a status glyph. */
  @Input() tone?: FsCardTone;

  /**
   * Hover affordance only — it does not make the card operable. A card with a
   * button in its footer cannot itself be a button, so the click target stays
   * the consumer's to provide.
   */
  @Input() interactive = false;

  get toneIcon(): string | null {
    return this.tone ? TONE_ICONS[this.tone] : null;
  }

  get hasHeader(): boolean {
    return !!(this.icon || this.tone);
  }
}
