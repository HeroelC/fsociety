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

export type FsAlertType    = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type FsAlertVariant = 'filled' | 'accent';

@Component({
  selector: 'fs-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAlertComponent implements OnInit, OnDestroy {

  /** Tipo semántico del alert */
  @Input() type: FsAlertType = 'info';

  /** filled = fondo sutil · accent = borde izquierdo */
  @Input() variant: FsAlertVariant = 'filled';

  /** Título opcional en negrita */
  @Input() title?: string;

  /** Muestra botón X para cerrar */
  @Input() dismissible = false;

  /**
   * Auto-cierre en milisegundos.
   * 0 = deshabilitado.
   * Muestra progress bar cuando está activo.
   */
  @Input() autoDismiss = 0;

  /** Emite cuando el alert se cierra (botón X o auto-dismiss) */
  @Output() dismissed = new EventEmitter<void>();

  // Estado interno de animación
  animState: 'entering' | 'visible' | 'exiting' = 'entering';

  private autoTimer?: ReturnType<typeof setTimeout>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // tras la animación de entrada → visible
    setTimeout(() => {
      this.animState = 'visible';
      this.cdr.markForCheck();
    }, 300);

    if (this.autoDismiss > 0) {
      this.autoTimer = setTimeout(() => this.dismiss(), this.autoDismiss);
    }
  }

  ngOnDestroy(): void {
    if (this.autoTimer) clearTimeout(this.autoTimer);
  }

  dismiss(): void {
    if (this.animState === 'exiting') return;
    this.animState = 'exiting';
    this.cdr.markForCheck();

    // esperar la animación de salida antes de emitir
    setTimeout(() => {
      this.dismissed.emit();
    }, 240);
  }

  get progressDuration(): string {
    return `${this.autoDismiss}ms`;
  }

  get iconPath(): string {
    const icons: Record<FsAlertType, string> = {
      info:    'M8 7v4M8 5.5v.01M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z',
      success: 'M5 8l2 2 4-4M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z',
      warning: 'M8 2L2 13h12L8 2zM8 7v3M8 11.5v.01',
      danger:  'M8 5v4M8 10.5v.01M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z',
      neutral: 'M8 7v4M8 5.5v.01M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z',
    };
    return icons[this.type];
  }
}
