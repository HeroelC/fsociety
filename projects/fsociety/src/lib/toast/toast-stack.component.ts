import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FsToastService } from './toast.service';

const CDN = 'https://api.iconify.design';
const ICONS = {
  success: `${CDN}/tabler:circle-check.svg`,
  danger:  `${CDN}/tabler:alert-circle.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
  info:    `${CDN}/tabler:info-circle.svg`,
  neutral: `${CDN}/tabler:info-circle.svg`,
  x:       `${CDN}/tabler:x.svg`,
} as const;

@Component({
  selector: 'fs-toast-stack',
  standalone: true,
  templateUrl: './toast-stack.component.html',
  styleUrl: './toast-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsToastStackComponent {
  readonly Icons = ICONS;

  constructor(readonly toastService: FsToastService) {}

  iconFor(tone: string): string {
    return ICONS[tone as keyof typeof ICONS] ?? ICONS.neutral;
  }
}
