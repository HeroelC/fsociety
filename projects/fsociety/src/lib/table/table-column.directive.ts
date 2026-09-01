import { Directive, Input, TemplateRef } from '@angular/core';

/** Alineación horizontal del contenido de la columna. */
export type FsColumnAlign = 'start' | 'center' | 'end';

/**
 * Dónde cae la columna cuando la tabla se muestra como tarjetas (mobile).
 *
 * La tabla no puede adivinar cuál de tus columnas es el título y cuál el
 * precio, así que se lo decís acá. Con esto la tarjeta se arma sola: no hace
 * falta escribir un template aparte para mobile.
 *
 * - `media`   — miniatura a la izquierda, ocupa el alto de la tarjeta.
 * - `value`   — dato principal, arriba a la izquierda (precio, monto, total).
 * - `status`  — badge o estado, arriba a la derecha.
 * - `title`   — línea del título, debajo. Va en negrita y es el ancla natural
 *               del link al detalle.
 * - `meta`    — dato secundario. Se apila con su etiqueta adelante. Es el
 *               default: una columna sin `cardSlot` termina acá.
 * - `actions` — botones de fila, al pie de la tarjeta.
 * - `none`    — la columna no se muestra en modo tarjeta.
 */
export type FsCardSlot = 'media' | 'title' | 'value' | 'status' | 'meta' | 'actions' | 'none';

/** Contexto que recibe el template de celda. */
export interface FsCellContext<T> {
  $implicit: T;
  row: T;
  index: number;
}

/**
 * Define una columna de `fs-table`. Es un `ng-template`, así que el contenido
 * de la celda lo escribe quien usa la tabla:
 *
 * ```html
 * <fs-table [rows]="items" caption="Propiedades">
 *   <ng-template fsColumn="title" header="Propiedad" cardSlot="title" [sortable]="true" [rowsOf]="items" let-row>
 *     <a [routerLink]="['/p', row.id]">{{ row.title }}</a>
 *   </ng-template>
 * </fs-table>
 * ```
 *
 * La tabla nunca interpreta el dato: solo lo ubica, lo ordena si se lo pedís y
 * lo reacomoda en mobile según `cardSlot`.
 */
@Directive({
  selector: 'ng-template[fsColumn]',
  standalone: true,
})
export class FsColumnDirective<T = unknown> {
  /**
   * Clave de la columna. Es lo que viaja en `sortChange.key`, así que tiene
   * que ser estable y única dentro de la tabla.
   */
  @Input('fsColumn') name = '';

  /**
   * Solo para inferencia de tipos: pasale el mismo arreglo que le pasás a
   * `[rows]` en `fs-table`. Angular resuelve `T` a partir de este input, así
   * que `let-row` llega tipado en vez de `unknown` — nunca se lee en runtime.
   *
   * ```html
   * <fs-table [rows]="items">
   *   <ng-template fsColumn="title" [rowsOf]="items" let-row>
   *     {{ row.title }}
   *   </ng-template>
   * </fs-table>
   * ```
   */
  @Input() rowsOf?: readonly T[];

  /** Texto del encabezado. También es la etiqueta de la celda en modo tarjeta. */
  @Input() header = '';

  /**
   * Oculta el texto del encabezado a la vista pero lo deja para el lector de
   * pantalla. Para columnas sin título visible — acciones, selección, foto —
   * que igual necesitan nombre accesible.
   */
  @Input() headerHidden = false;

  /** Habilita el botón de orden en el encabezado. */
  @Input() sortable = false;

  @Input() align: FsColumnAlign = 'start';

  /**
   * Cuántos valores tiene activos el filtro de esta columna. Con más de cero,
   * el embudo del encabezado muestra el número y la columna queda marcada como
   * filtrada.
   *
   * Es un número que le pasás vos: la tabla no filtra ni sabe con qué. Solo
   * dibuja el estado. El panel se declara aparte, con
   * `ng-template fsColumnFilter="<nombre>"`.
   */
  @Input() filterCount = 0;

  /** Ancho CSS de la columna. Ej: `'180px'`, `'20%'`, `'minmax(0, 1fr)'` no. */
  @Input() width = '';

  /** Ver {@link FsCardSlot}. */
  @Input() cardSlot: FsCardSlot = 'meta';

  /**
   * Etiqueta de la celda en modo tarjeta, cuando el encabezado no sirve o
   * sobra. Por defecto usa `header`; con `''` no se dibuja etiqueta.
   */
  @Input() cardLabel?: string;

  /**
   * Cómo sacar el valor ordenable de la fila. Solo lo usa `clientSort`; con
   * orden del lado del servidor no se llama nunca.
   *
   * Si no lo pasás, se lee `row[name]` y se compara como texto o número según
   * lo que aparezca.
   */
  @Input() sortValue?: (row: T) => string | number | Date | null | undefined;

  constructor(readonly template: TemplateRef<FsCellContext<T>>) {}

  /** Tipa `let-row` dentro del template. */
  static ngTemplateContextGuard<T>(
    _dir: FsColumnDirective<T>,
    _ctx: unknown,
  ): _ctx is FsCellContext<T> {
    return true;
  }
}
