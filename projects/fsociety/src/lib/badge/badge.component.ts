import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
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
export class FsBadgeComponent implements OnChanges {

  /** Color semántico del badge */
  @Input() color: FsBadgeColor = 'neutral';

  /**
   * Color personalizado en formato hex.
   * Ejemplo: '#7c3aed'
   * Cuando se provee, tiene prioridad sobre `color` y genera
   * automáticamente el fondo, borde y texto con la opacidad correcta.
   */
  @Input() customColor?: string;

  /** Filled = fondo sutil · outline = solo borde */
  @Input() variant: FsBadgeVariant = 'filled';

  /** Tamaño */
  @Input() size: FsBadgeSize = 'md';

  /** Texto del badge (alternativa al content projection) */
  @Input() label?: string;

  /** Muestra punto de estado a la izquierda */
  @Input() dot = false;

  /** SVG path del ícono izquierdo (viewBox 0 0 24 24) */
  @Input() iconLeft?: string;

  /** SVG path del ícono derecho (viewBox 0 0 24 24) */
  @Input() iconRight?: string;

  /**
   * URL o ruta de imagen izquierda.
   * Ejemplo: 'assets/icons/angular.svg' o 'https://cdn.simpleicons.org/angular/white'
   * Tiene prioridad sobre iconLeft si ambos están definidos.
   */
  @Input() imgLeft?: string;

  /**
   * URL o ruta de imagen derecha.
   * Tiene prioridad sobre iconRight si ambos están definidos.
   */
  @Input() imgRight?: string;

  /** Alt text para imgLeft — por defecto vacío (decorativo) */
  @Input() imgLeftAlt = '';

  /** Alt text para imgRight — por defecto vacío (decorativo) */
  @Input() imgRightAlt = '';

  /**
   * Modo solo ícono — oculta el label y hace el badge cuadrado/circular.
   * Requiere iconLeft, iconRight, imgLeft o imgRight.
   */
  @Input() iconOnly = false;

  /** Badge removible — muestra botón X */
  @Input() removable = false;

  /** Emite cuando se clickea el botón remove */
  @Output() removed = new EventEmitter<void>();

  // Estilos calculados para customColor
  customStyles: Record<string, string> = {};

  ngOnChanges(): void {
    if (this.customColor) {
      this.customStyles = this.buildCustomStyles(this.customColor);
    } else {
      this.customStyles = {};
    }
  }

  get classes(): Record<string, boolean> {
    return {
      [`fs-badge--${this.color}`]:   !this.customColor,
      [`fs-badge--${this.variant}`]: true,
      [`fs-badge--${this.size}`]:    true,
      'fs-badge--custom':            !!this.customColor,
      'fs-badge--dot':               this.dot,
      'fs-badge--icon-only':         this.iconOnly,
      'fs-badge--removable':         this.removable,
    };
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }

  private buildCustomStyles(hex: string): Record<string, string> {
    // Convertir hex a rgb para poder usar con opacidad
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (this.variant === 'outline') {
      return {
        'background':   'transparent',
        'color':        hex,
        'border-color': hex,
      };
    }

    return {
      'background':   `rgba(${r}, ${g}, ${b}, 0.15)`,
      'color':        this.lightenHex(r, g, b),
      'border-color': `rgba(${r}, ${g}, ${b}, 0.30)`,
    };
  }

  private lightenHex(r: number, g: number, b: number): string {
    // Mezcla con blanco al 60% para el texto
    const mix = (c: number) => Math.round(c + (255 - c) * 0.6);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }
}
