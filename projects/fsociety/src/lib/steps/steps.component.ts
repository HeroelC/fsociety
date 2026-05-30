import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

const CDN = 'https://api.iconify.design';

export interface FsStep {
  label: string;
  desc?: string;
}

@Component({
  selector: 'fs-steps',
  standalone: true,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsStepsComponent {
  readonly checkIcon = `${CDN}/tabler:check.svg`;

  @Input() steps: FsStep[] = [];
  @Input() current = 0;

  stateOf(i: number): 'done' | 'active' | 'todo' {
    if (i < this.current) return 'done';
    if (i === this.current) return 'active';
    return 'todo';
  }
}
