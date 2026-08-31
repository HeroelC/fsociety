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

  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:user.svg' o 'assets/user.svg'.
   * No es un nombre de Tabler: pasar "user" no renderiza nada ni avisa.
   *
   * Hasta la v1 este input era el atributo `d` de un `<path>` crudo y `fs-badge`
   * era la excepción de la librería: el mismo nombre significaba una cosa acá y
   * otra en `fs-button`. Ahora significa lo mismo en todos lados.
   */
  @Input() iconLeft?: string;

  /** URL completa, igual que `iconLeft`. */
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

  /**
   * Solo publica el color; el mezclado lo hace CSS con color-mix() en el SCSS.
   *
   * Antes se calculaba acá en JS, y el texto se mezclaba 60% hacia BLANCO —
   * pensado para cuando los badges vivían sobre fondo oscuro. Sobre un badge
   * claro eso daba 1.3:1 de contraste, ilegible. Y al ser JS no podía saber el
   * tema activo, así que no había forma de invertirlo.
   *
   * En CSS el mezclado puede referenciar los tokens del tema, y así se invierte
   * solo. Acepta cualquier color válido de CSS, no solo #rrggbb: la versión
   * anterior parseaba el hex a mano y devolvía NaN con formato corto.
   */
  private buildCustomStyles(color: string): Record<string, string> {
    return { '--fs-badge-custom': color };
  }
}
