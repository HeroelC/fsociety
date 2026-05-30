import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

const CDN = 'https://api.iconify.design';
const ICONS = {
  default: `${CDN}/tabler:info-circle.svg`,
  error:   `${CDN}/tabler:alert-circle.svg`,
  success: `${CDN}/tabler:circle-check.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
} as const;

export type FsHintTone = 'default' | 'error' | 'success' | 'warning';

@Component({
  selector: 'fs-hint',
  standalone: true,
  templateUrl: './hint.component.html',
  styleUrl: './hint.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsHintComponent {
  @Input() tone: FsHintTone = 'default';
  /** undefined = auto (only for non-default tones) | false = hidden | true = auto | string = URL */
  @Input() icon: boolean | string | undefined = undefined;

  get showIcon(): boolean {
    if (this.icon === undefined) return this.tone !== 'default';
    if (typeof this.icon === 'boolean') return this.icon;
    return true;
  }

  get iconUrl(): string {
    if (typeof this.icon === 'string') return this.icon;
    return ICONS[this.tone];
  }
}
