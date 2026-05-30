import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type FsTooltipSide = 'top' | 'bottom';

@Component({
  selector: 'fs-tooltip',
  standalone: true,
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsTooltipComponent {
  @Input() label = '';
  @Input() side: FsTooltipSide = 'top';
}
