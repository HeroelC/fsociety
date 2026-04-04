import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type FsButtonSize    = 'sm' | 'md' | 'lg';
export type FsButtonType    = 'button' | 'submit' | 'reset';

@Component({
  selector: 'fs-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsButtonComponent {

  /** Variante visual del botón */
  @Input() variant: FsButtonVariant = 'primary';

  /** Tamaño del botón */
  @Input() size: FsButtonSize = 'md';

  /** Tipo HTML nativo */
  @Input() type: FsButtonType = 'button';

  /** Deshabilita el botón */
  @Input() disabled = false;

  /** Muestra spinner y deshabilita el botón */
  @Input() loading = false;

  /** Texto del botón (alternativa al content projection) */
  @Input() label?: string;

  /** Ícono izquierdo — string SVG path o nombre de ícono */
  @Input() iconLeft?: string;

  /** Ícono derecho */
  @Input() iconRight?: string;

  /** Ancho completo del contenedor */
  @Input() fullWidth = false;

  /** Emite el click — no dispara si disabled o loading */
  @Output() fsClick = new EventEmitter<MouseEvent>();

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.fullWidth ? '100%' : 'auto';
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get classes(): Record<string, boolean> {
    return {
      [`fs-btn--${this.variant}`]: true,
      [`fs-btn--${this.size}`]:    true,
      'fs-btn--loading':           this.loading,
      'fs-btn--disabled':          this.isDisabled,
      'fs-btn--full-width':        this.fullWidth,
    };
  }

  onClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.fsClick.emit(event);
  }
}
