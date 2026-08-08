import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsCardTone } from './card.component';

const CDN = 'https://api.iconify.design';
const TONE_ICONS: Record<FsCardTone, string> = {
  success: `${CDN}/tabler:circle-check.svg`,
  danger: `${CDN}/tabler:alert-circle.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
  info: `${CDN}/tabler:info-circle.svg`,
};

/**
 * The list-row shape of a card: icon, two lines of text, and an action on the
 * far end. Separate from `fs-card` because the slots differ — there is no media
 * and no footer, and the action sits inline instead of below.
 */
@Component({
  selector: 'fs-row-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './row-card.component.html',
  styleUrl: './row-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsRowCardComponent {
  /** Icon URL. A `tone` supplies its own glyph when this is left unset. */
  @Input() icon?: string;

  @Input() title = '';

  @Input() subtitle = '';

  @Input() tone?: FsCardTone;

  /** The tone glyph wins, matching the reference: a status row reads as status. */
  get resolvedIcon(): string | null {
    if (this.tone) return TONE_ICONS[this.tone];
    return this.icon ?? null;
  }
}
