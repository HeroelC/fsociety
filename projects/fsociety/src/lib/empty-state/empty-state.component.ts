import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tono del estado vacío.
 *
 * `error` tiñe el ícono y nada más. La caja no se pinta de rojo a propósito:
 * que falle una carga es informativo, no una alarma, y si se le grita al
 * usuario cada vez que se cae la red deja de leer los rojos que sí importan.
 */
export type FsEmptyStateTone = 'default' | 'error';

/**
 * Tamaño del bloque, según el hueco que tenga que llenar.
 *
 * - `sm` — adentro de un dropdown o un panel angosto.
 * - `md` — adentro de una tabla o una card. Es el default.
 * - `lg` — ocupando la pantalla.
 *
 * No es la escala de `FsControlSize`: eso mide el alto de un control de
 * formulario, y acá lo que cambia es la densidad de un bloque de contenido.
 */
export type FsEmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * El bloque que ocupa el lugar donde debería haber contenido.
 *
 * "Vacío" no es un estado, son cuatro, y lo que los distingue no es el texto
 * sino qué acción ofrecen:
 *
 * 1. Primera vez — nunca creó nada. Invitación y un CTA primario.
 * 2. Sin resultados — buscó o filtró. El CTA **deshace**: limpiar filtros.
 * 3. Error — falló la carga. Reintentar, con `tone="error"`.
 * 4. Legítimamente vacío — está todo al día. **Ningún botón**; meter uno
 *    inventa trabajo que no existe.
 *
 * Tratarlos igual es lo que produce pantallas muertas: un usuario que entra
 * por primera vez y lee "Sin resultados" no buscó nada, no tiene nada que
 * limpiar, y nadie le dijo qué hacer.
 *
 * Las acciones van por content projection, así que el componente no conoce a
 * `fs-button` ni le impone una variante:
 *
 * ```html
 * <fs-empty-state
 *   [icon]="Icons.folderPlus"
 *   title="Todavía no hay proyectos"
 *   description="Creá el primero para empezar a organizar tu trabajo."
 * >
 *   <fs-button variant="primary" label="Crear proyecto"></fs-button>
 * </fs-empty-state>
 * ```
 */
@Component({
  selector: 'fs-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsEmptyStateComponent {
  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:folder-plus.svg' o 'assets/x.svg'.
   * No es un nombre de Tabler: pasar "folder-plus" no renderiza nada ni avisa.
   */
  @Input() icon = '';

  /** Qué falta. Una línea, sin punto final. */
  @Input() title = '';

  /** Por qué está vacío, o qué hacer al respecto. */
  @Input() description = '';

  /** Tiñe el ícono cuando el vacío es consecuencia de un error. */
  @Input() tone: FsEmptyStateTone = 'default';

  /** Densidad del bloque — 'sm' para un dropdown, 'lg' para una pantalla. */
  @Input() size: FsEmptyStateSize = 'md';

  /**
   * Saca el ícono y aprieta el espaciado, para huecos donde ni el `sm` entra.
   *
   * Es distinto de no pasar `icon`: sin ícono el bloque conserva su aire, y
   * con `compact` además se comprime.
   */
  @Input() compact = false;

  /**
   * El caso más común es que este bloque aparezca DESPUÉS de una búsqueda que
   * no encontró nada, y ahí un lector de pantalla tiene que enterarse de que
   * la lista cambió. `role="status"` ya implica `aria-live="polite"`, así que
   * el anuncio no interrumpe lo que se esté leyendo.
   *
   * Se puede apagar cuando el bloque es contenido estático de la página y el
   * anuncio sobra.
   */
  @Input() announce = true;

  get classes(): Record<string, boolean> {
    return {
      [`fs-empty--${this.size}`]: true,
      'fs-empty--error':         this.tone === 'error',
      'fs-empty--compact':       this.compact,
    };
  }

  get showIcon(): boolean {
    return !!this.icon && !this.compact;
  }
}
