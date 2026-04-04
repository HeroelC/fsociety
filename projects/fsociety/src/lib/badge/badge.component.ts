import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type FsBadgeColor   = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'neutral';
export type FsBadgeVariant = 'filled' | 'outline';
export type FsBadgeSize    = 'sm' | 'md';

@Component({
  selector: 'fs-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsBadgeComponent {

  /** Color semántico del badge */
  @Input() color: FsBadgeColor = 'neutral';

  /** Filled = fondo sutil · outline = solo borde */
  @Input() variant: FsBadgeVariant = 'filled';

  /** Tamaño */
  @Input() size: FsBadgeSize = 'md';

  /** Texto del badge (alternativa al content projection) */
  @Input() label?: string;

  /** Muestra punto de estado a la izquierda */
  @Input() dot = false;

  /**
   * SVG path del ícono izquierdo.
   * Ejemplo: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10...'
   */
  @Input() iconLeft?: string;

  /**
   * SVG path del ícono derecho.
   */
  @Input() iconRight?: string;

  /**
   * Modo solo ícono — oculta el label y hace el badge cuadrado/circular.
   * Requiere iconLeft o iconRight.
   */
  @Input() iconOnly = false;

  /** Badge removible — muestra botón X */
  @Input() removable = false;

  /** Emite cuando se clickea el botón remove */
  @Output() removed = new EventEmitter<void>();

  get classes(): Record<string, boolean> {
    return {
      [`fs-badge--${this.color}`]:   true,
      [`fs-badge--${this.variant}`]: true,
      [`fs-badge--${this.size}`]:    true,
      'fs-badge--dot':               this.dot,
      'fs-badge--icon-only':         this.iconOnly,
      'fs-badge--removable':         this.removable,
    };
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
