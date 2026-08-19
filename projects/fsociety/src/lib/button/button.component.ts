import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsSpinnerComponent } from '../loading/spinner.component';

export type FsButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type FsButtonSize    = 'sm' | 'md' | 'lg';
export type FsButtonType    = 'button' | 'submit' | 'reset';

@Component({
  selector: 'fs-button',
  standalone: true,
  imports: [CommonModule, FsSpinnerComponent],
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

  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:user.svg' o 'assets/user.svg'.
   * No es un nombre de Tabler: pasar "user" no renderiza nada ni avisa.
   */
  @Input() iconLeft?: string;

  /** URL completa, igual que `iconLeft`. */
  @Input() iconRight?: string;

  /** Ancho completo del contenedor */
  @Input() fullWidth = false;

  /** Botón cuadrado solo con ícono — oculta el label */
  @Input() iconOnly = false;

  /** aria-label para accesibilidad cuando iconOnly = true */
  @Input() ariaLabel?: string;

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
      'fs-btn--icon-only':         this.iconOnly,
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
