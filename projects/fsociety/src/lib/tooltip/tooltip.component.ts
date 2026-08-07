import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FsAnchoredPopoverDirective } from '../overlay/anchored-popover.directive';

export type FsTooltipSide = 'top' | 'bottom';

@Component({
  selector: 'fs-tooltip',
  standalone: true,
  imports: [FsAnchoredPopoverDirective],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  // OnPush is safe: `open` only changes from listeners in this component's own
  // template, which marks it for check.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsTooltipComponent {
  @Input() label = '';
  @Input() side: FsTooltipSide = 'top';

  /**
   * The tip renders in the top layer, so it needs a real open flag instead of a
   * pure CSS `:hover` rule. Focus is wired up alongside hover so keyboard users
   * get the tooltip too.
   */
  open = false;
}
