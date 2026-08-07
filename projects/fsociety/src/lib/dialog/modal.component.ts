import {
  AfterViewInit,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsDialogBase } from './dialog-base.directive';

const CDN = 'https://api.iconify.design';
const ICONS = {
  x: `${CDN}/tabler:x.svg`,
} as const;

export type FsModalSize = 'sm' | 'md' | 'lg' | 'full';

const SIZE_WIDTHS: Record<FsModalSize, string> = {
  sm: '380px',
  md: '520px',
  lg: '760px',
  full: 'calc(100vw - 40px)',
};

let modalIdCounter = 0;

@Component({
  selector: 'fs-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  // Emulated encapsulation rewrites ::backdrop into a scoped selector that never
  // matches, because the backdrop is not a normal descendant. None is the only
  // way to style it, so every rule in the stylesheet is namespaced under
  // .fs-modal to keep it from leaking.
  encapsulation: ViewEncapsulation.None,
})
export class FsModalComponent extends FsDialogBase implements AfterViewInit {
  readonly Icons = ICONS;

  @Input() size: FsModalSize = 'md';

  /** Overrides the size preset. Any CSS length. */
  @Input() width?: string;

  readonly modalId = `fs-modal-${++modalIdCounter}`;

  get resolvedWidth(): string {
    return this.width ?? SIZE_WIDTHS[this.size] ?? SIZE_WIDTHS.md;
  }

  /** An `open` that was already true before the view existed still has to open. */
  ngAfterViewInit(): void {
    if (this.open) this.syncOpenState();
  }
}
