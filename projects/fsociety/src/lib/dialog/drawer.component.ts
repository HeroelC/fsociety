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

/** Which edge the panel slides in from. */
export type FsDrawerSide = 'right' | 'left' | 'top' | 'bottom';

let drawerIdCounter = 0;

@Component({
  selector: 'fs-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  // Same reason as fs-modal: ::backdrop is unreachable through emulated
  // encapsulation. Rules are namespaced under .fs-drawer.
  encapsulation: ViewEncapsulation.None,
})
export class FsDrawerComponent extends FsDialogBase implements AfterViewInit {
  readonly Icons = ICONS;

  @Input() side: FsDrawerSide = 'right';

  /** Panel size across its axis — width for left/right, height for top/bottom. */
  @Input() size = '400px';

  readonly drawerId = `fs-drawer-${++drawerIdCounter}`;

  get horizontal(): boolean {
    return this.side === 'left' || this.side === 'right';
  }

  ngAfterViewInit(): void {
    if (this.open) this.syncOpenState();
  }
}
