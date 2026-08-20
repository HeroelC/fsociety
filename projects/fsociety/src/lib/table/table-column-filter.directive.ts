import { Directive, Input, TemplateRef } from '@angular/core';

/** Contexto que recibe el template del panel de filtro. */
export interface FsColumnFilterContext {
  /** Cierra el panel. Llamalo desde «Aplicar», «Limpiar» o lo que corresponda. */
  $implicit: () => void;
  close: () => void;
  /** Clave de la columna a la que pertenece este panel. */
  column: string;
}

/**
 * Panel de filtro de una columna. Se enlaza por nombre con su
 * `ng-template fsColumn`:
 *
 * ```html
 * <ng-template fsColumn="status" header="Estado" [filterCount]="statusFilter.length" let-row>
 *   <fs-badge>{{ row.status }}</fs-badge>
 * </ng-template>
 *
 * <ng-template fsColumnFilter="status" let-close>
 *   @for (opt of statuses; track opt) {
 *     <fs-checkbox [label]="opt" [ngModel]="isOn(opt)" (ngModelChange)="toggle(opt)" />
 *   }
 *   <fs-button size="sm" variant="ghost" (click)="clearStatus(); close()">Limpiar</fs-button>
 * </ng-template>
 * ```
 *
 * La tabla pone el embudo en el encabezado, abre y cierra el panel, se asegura
 * de que haya uno solo abierto a la vez y lo dibuja en el top layer del
 * navegador — así no se lo come el `overflow` de la tabla.
 *
 * Qué hay adentro del panel y qué se filtra con eso es tuyo. La tabla no
 * filtra: no toca `rows`. Vos leés lo que el panel cambió y le pasás la lista
 * ya filtrada, igual que si la filtrara el servidor.
 */
@Directive({
  selector: 'ng-template[fsColumnFilter]',
  standalone: true,
})
export class FsColumnFilterDirective {
  /** Clave de la columna que filtra. Tiene que coincidir con un `fsColumn`. */
  @Input('fsColumnFilter') column = '';

  /**
   * Ancho del panel. Los filtros no tienen por qué medir lo que mide la
   * columna, así que se pide explícito.
   */
  @Input() panelWidth = '240px';

  constructor(readonly template: TemplateRef<FsColumnFilterContext>) {}

  static ngTemplateContextGuard(
    _dir: FsColumnFilterDirective,
    _ctx: unknown,
  ): _ctx is FsColumnFilterContext {
    return true;
  }
}
