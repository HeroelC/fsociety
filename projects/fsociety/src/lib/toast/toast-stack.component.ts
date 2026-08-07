import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
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
export class FsToastStackComponent implements AfterViewInit {
  readonly Icons = ICONS;

  @ViewChild('toaster') toaster!: ElementRef<HTMLElement>;

  constructor(readonly toastService: FsToastService) {}

  ngAfterViewInit(): void {
    // The stack is `position: fixed`, which is not enough: an ancestor with a
    // transform, filter or contain becomes its containing block and clips it,
    // so toasts vanished when the app root had any of those. Promoting the
    // stack to the top layer puts it beyond any ancestor's reach.
    //
    // It stays open for the component's whole life — the container is
    // pointer-events: none and only the toasts themselves are interactive, so
    // an always-open popover blocks nothing. No anchoring is needed either;
    // its own right/bottom offsets place it against the viewport.
    const el = this.toaster?.nativeElement;
    if (el && typeof el.showPopover === 'function' && !el.matches(':popover-open')) {
      el.showPopover();
    }
  }

  iconFor(tone: string): string {
    return ICONS[tone as keyof typeof ICONS] ?? ICONS.neutral;
  }
}
