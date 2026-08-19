import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsCorners } from '../corners';

const CDN = 'https://api.iconify.design';
const ICONS = {
  info:    `${CDN}/tabler:info-circle.svg`,
  success: `${CDN}/tabler:circle-check.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
  danger:  `${CDN}/tabler:alert-circle.svg`,
  x:       `${CDN}/tabler:x.svg`,
} as const;

export type FsAlertTone = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'fs-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAlertComponent implements OnInit, OnDestroy {
  readonly Icons = ICONS;

  @Input() tone: FsAlertTone = 'info';
  @Input() title = '';
  @Input() dismissible = false;
  @Input() autoDismiss = 0;

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  @Output() dismissed = new EventEmitter<void>();

  isExiting = false;
  private autoTimer?: ReturnType<typeof setTimeout>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.autoDismiss > 0) {
      this.autoTimer = setTimeout(() => this.dismiss(), this.autoDismiss);
    }
  }

  ngOnDestroy(): void {
    if (this.autoTimer) clearTimeout(this.autoTimer);
  }

  dismiss(): void {
    if (this.isExiting) return;
    this.isExiting = true;
    this.cdr.markForCheck();
    setTimeout(() => this.dismissed.emit(), 220);
  }

  get iconUrl(): string {
    return ICONS[this.tone];
  }

  get progressDuration(): string {
    return `${this.autoDismiss}ms`;
  }
}
