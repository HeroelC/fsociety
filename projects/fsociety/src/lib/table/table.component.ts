import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FsCheckboxComponent } from '../choice/checkbox.component';
import { FsAnchoredPopoverDirective } from '../overlay/anchored-popover.directive';
import { FsEmptyStateComponent } from '../empty-state/empty-state.component';
import { FsColumnDirective } from './table-column.directive';
import { FsColumnFilterDirective } from './table-column-filter.directive';
import { FsCorners } from '../corners';

const CDN = 'https://api.iconify.design';
const ICONS = {
  sort:      `${CDN}/tabler:arrows-sort.svg`,
  arrowUp:   `${CDN}/tabler:arrow-up.svg`,
  arrowDown: `${CDN}/tabler:arrow-down.svg`,
  filter:    `${CDN}/tabler:filter.svg`,
} as const;

export type FsSortDir = 'asc' | 'desc';

/** Estado de orden de la tabla. `null` es "sin ordenar". */
export interface FsTableSort {
  key: string;
  dir: FsSortDir;
}

/** `comfortable` = filas de 62px · `compact` = filas de 44px. */
export type FsTableDensity = 'comfortable' | 'compact';

/**
 * Cómo se dibuja la tabla.
 *
 * `auto` cambia a tarjetas cuando el contenedor baja de 720px — con container
 * query, así que responde al ancho real disponible y no al del viewport. Una
 * tabla adentro de un panel angosto pasa a tarjetas aunque la pantalla sea
 * grande.
 */
export type FsTableLayout = 'auto' | 'table' | 'cards';

/**
 * Tabla de datos.
 *
 * Las columnas se declaran con `ng-template fsColumn`, así que la tabla no
 * sabe ni le importa qué hay adentro de cada celda: ubica, ordena si se lo
 * pedís, y en pantallas angostas reacomoda las mismas celdas como tarjeta
 * según el `cardSlot` de cada columna.
 *
 * ## Semántica y teclado
 *
 * Es una `<table>` de verdad en todos los anchos, incluso en modo tarjeta: los
 * encabezados quedan asociados a las celdas, así que un lector de pantalla
 * anuncia "Precio, US$ 180.000" aunque en pantalla no se vea ninguna columna.
 * Por eso `caption` es obligatorio: es el nombre accesible de la tabla y de la
 * región que scrollea.
 *
 * La tabla no hace la fila entera focusable. `rowActivate` existe como atajo
 * para el mouse, pero el camino accesible tiene que ser un `<a>` o un
 * `<button>` adentro de alguna celda — normalmente el título. Así funcionan
 * gratis el teclado, el click del medio y "abrir en pestaña nueva".
 */
@Component({
  selector: 'fs-table',
  standalone: true,
  imports: [CommonModule, FormsModule, FsCheckboxComponent, FsAnchoredPopoverDirective, FsEmptyStateComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsTableComponent<T = Record<string, unknown>> implements AfterContentInit, OnChanges {
  readonly Icons = ICONS;

  @ContentChildren(FsColumnDirective, { descendants: true })
  columnDefs!: QueryList<FsColumnDirective<T>>;

  @ContentChildren(FsColumnFilterDirective, { descendants: true })
  filterDefs!: QueryList<FsColumnFilterDirective>;

  /** Las filas tal cual se muestran, salvo que `clientSort` esté prendido. */
  @Input() rows: T[] = [];

  /**
   * Propiedad que identifica a la fila. Es lo que sale en `selectedChange` y
   * lo que usa el `track` del `@for`, así que tiene que ser única y estable.
   */
  @Input() rowKey = 'id';

  /**
   * Nombre accesible de la tabla. Obligatorio: sin esto la región que scrollea
   * queda sin nombre y el lector de pantalla anuncia una tabla anónima.
   */
  @Input() caption = '';

  /** Muestra el `caption` arriba de la tabla, además de anunciarlo. */
  @Input() captionVisible = false;

  // ─── Selección ────────────────────────────────────────────────────────────

  @Input() selectable = false;

  /** Claves (`rowKey`) de las filas marcadas. */
  @Input() selected: unknown[] = [];
  @Output() selectedChange = new EventEmitter<unknown[]>();

  /**
   * Etiqueta accesible del checkbox de cada fila. Recibe la fila y devuelve el
   * texto: sin esto todos los checkboxes se anuncian igual.
   */
  @Input() selectLabel: (row: T) => string = () => 'Seleccionar fila';

  // ─── Orden ────────────────────────────────────────────────────────────────

  /** Estado de orden actual. Controlado desde afuera. */
  @Input() sort: FsTableSort | null = null;

  /**
   * Se emite en cada click sobre un encabezado ordenable. El ciclo es
   * ascendente → descendente → sin orden.
   */
  @Output() sortChange = new EventEmitter<FsTableSort | null>();

  /**
   * Ordena `rows` acá adentro en vez de solo avisar. Solo para listas que ya
   * están enteras en memoria: si paginás o filtrás en el servidor, dejalo
   * apagado y ordená allá.
   */
  @Input() clientSort = false;

  // ─── Presentación ─────────────────────────────────────────────────────────

  @Input() density: FsTableDensity = 'comfortable';
  @Input() layout: FsTableLayout = 'auto';
  @Input() hoverable = true;
  @Input() zebra = false;

  /**
   * Deja el encabezado fijo al scrollear. Necesita `maxHeight`: sin una altura
   * que recorte, la tabla no scrollea por dentro y no hay nada a lo que
   * pegarse.
   */
  @Input() stickyHeader = false;

  /** Alto máximo del área que scrollea. Ej: `'420px'`, `'60vh'`. */
  @Input() maxHeight = '';

  /**
   * Ancho mínimo de la tabla antes de scrollear en horizontal. Evita que las
   * columnas se aplasten en un contenedor angosto.
   */
  @Input() minWidth = '760px';

  @Input() corners: FsCorners = 'all';

  // ─── Estados ──────────────────────────────────────────────────────────────

  @Input() loading = false;
  @Input() skeletonRows = 4;

  // ─── Fila ─────────────────────────────────────────────────────────────────

  /**
   * Atajo de mouse: se emite al hacer click en cualquier parte de la fila que
   * no sea un control. No reemplaza al link de la celda de título — es
   * redundante con él, a propósito.
   */
  @Output() rowActivate = new EventEmitter<T>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Las filas ya ordenadas, si corresponde. */
  displayRows: T[] = [];

  private sortedFrom: T[] | null = null;
  private sortedWith = '';
  private cachedColumns: FsColumnDirective<T>[] | null = null;
  private cachedFilters: Map<string, FsColumnFilterDirective> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] || changes['sort'] || changes['clientSort']) {
      this.refresh();
    }
  }

  ngAfterContentInit(): void {
    // El primer `refresh()` corre en `ngOnChanges`, cuando `columnDefs` todavía
    // está vacío: sin esto, el memo se sella con la comparación por defecto y
    // el `sortValue` de la columna no llega a usarse nunca.
    this.sortedFrom = null;
    this.cachedColumns = null;
    this.refresh();
    this.cdr.markForCheck();

    const invalidate = () => {
      this.cachedColumns = null;
      this.cachedFilters = null;
      this.sortedFrom = null;
      this.cdr.markForCheck();
    };

    const subs = [
      this.columnDefs.changes.subscribe(invalidate),
      this.filterDefs.changes.subscribe(invalidate),
    ];
    this.destroyRef.onDestroy(() => subs.forEach(u => u.unsubscribe()));
  }

  get columns(): FsColumnDirective<T>[] {
    if (!this.columnDefs) return [];
    return (this.cachedColumns ??= this.columnDefs.toArray());
  }

  /** Columnas + la de selección, para el `colspan` de los estados vacíos. */
  get columnCount(): number {
    return this.columns.length + (this.selectable ? 1 : 0);
  }

  get skeletonList(): number[] {
    return Array.from({ length: Math.max(1, this.skeletonRows) }, (_, i) => i);
  }

  keyOf(row: T): unknown {
    return (row as Record<string, unknown>)[this.rowKey];
  }

  // ─── Orden ────────────────────────────────────────────────────────────────

  ariaSort(col: FsColumnDirective<T>): 'ascending' | 'descending' | 'none' | null {
    if (!col.sortable) return null;
    if (this.sort?.key !== col.name) return 'none';
    return this.sort.dir === 'asc' ? 'ascending' : 'descending';
  }

  sortIcon(col: FsColumnDirective<T>): string {
    if (this.sort?.key !== col.name) return ICONS.sort;
    return this.sort.dir === 'asc' ? ICONS.arrowUp : ICONS.arrowDown;
  }

  isSorted(col: FsColumnDirective<T>): boolean {
    return this.sort?.key === col.name;
  }

  /** Ascendente → descendente → sin orden. */
  toggleSort(col: FsColumnDirective<T>): void {
    if (!col.sortable) return;

    let next: FsTableSort | null;
    if (this.sort?.key !== col.name)  next = { key: col.name, dir: 'asc' };
    else if (this.sort.dir === 'asc') next = { key: col.name, dir: 'desc' };
    else                              next = null;

    this.sort = next;
    this.refresh();
    this.sortChange.emit(next);
  }

  private refresh(): void {
    if (!this.clientSort || !this.sort) {
      this.displayRows = this.rows ?? [];
      this.sortedFrom = null;
      return;
    }

    const stamp = `${this.sort.key}:${this.sort.dir}`;
    if (this.sortedFrom === this.rows && this.sortedWith === stamp) return;

    const key = this.sort.key;
    const col = this.columns.find(c => c.name === key);
    const dir = this.sort.dir === 'asc' ? 1 : -1;
    const read = col?.sortValue ?? ((row: T) => (row as Record<string, unknown>)[key] as string);

    this.displayRows = [...(this.rows ?? [])].sort((a, b) => dir * compare(read(a), read(b)));
    this.sortedFrom = this.rows;
    this.sortedWith = stamp;
  }

  // ─── Selección ────────────────────────────────────────────────────────────

  isSelected(row: T): boolean {
    return this.selected.includes(this.keyOf(row));
  }

  get allSelected(): boolean {
    return this.displayRows.length > 0 && this.displayRows.every(r => this.isSelected(r));
  }

  get someSelected(): boolean {
    return !this.allSelected && this.displayRows.some(r => this.isSelected(r));
  }

  toggleRow(row: T): void {
    const key = this.keyOf(row);
    const next = this.isSelected(row)
      ? this.selected.filter(k => k !== key)
      : [...this.selected, key];

    this.selected = next;
    this.selectedChange.emit(next);
  }

  /**
   * Marca o desmarca todas las filas visibles. Las que estén marcadas pero
   * fuera de la vista actual — filtradas afuera — se respetan: desmarcar acá
   * no las pierde.
   */
  toggleAll(): void {
    const visible = this.displayRows.map(r => this.keyOf(r));
    const next = this.allSelected
      ? this.selected.filter(k => !visible.includes(k))
      : [...this.selected, ...visible.filter(k => !this.selected.includes(k))];

    this.selected = next;
    this.selectedChange.emit(next);
  }

  // ─── Filtros de columna ───────────────────────────────────────────────────

  /** Qué panel está abierto. Uno solo a la vez, como en cualquier tabla. */
  openFilter: string | null = null;

  /** Se emite al abrir o cerrar un panel. `null` es "no quedó ninguno abierto". */
  @Output() openFilterChange = new EventEmitter<string | null>();

  private get filters(): Map<string, FsColumnFilterDirective> {
    if (!this.filterDefs) return new Map();
    return (this.cachedFilters ??= new Map(this.filterDefs.map(f => [f.column, f])));
  }

  /** El panel declarado para esta columna, si hay alguno. */
  filterOf(col: FsColumnDirective<T>): FsColumnFilterDirective | undefined {
    return this.filters.get(col.name);
  }

  toggleFilter(col: FsColumnDirective<T>): void {
    this.openFilter = this.openFilter === col.name ? null : col.name;
    this.openFilterChange.emit(this.openFilter);
  }

  /**
   * Se pasa al template del panel como `let-close`. Va como propiedad con
   * arrow function y no como método para que el `this` sobreviva a viajar
   * adentro del contexto del template.
   */
  readonly closeFilter = (): void => {
    if (this.openFilter === null) return;
    this.openFilter = null;
    this.openFilterChange.emit(null);
    this.cdr.markForCheck();
  };

  /** La columna está ordenada o filtrada. En los dos casos se marca igual. */
  isColumnActive(col: FsColumnDirective<T>): boolean {
    return this.isSorted(col) || col.filterCount > 0;
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent): void {
    // El panel sube al top layer pero sigue siendo descendiente del host, así
    // que un click adentro suyo cuenta como click adentro de la tabla.
    if (this.openFilter && !this.el.nativeElement.contains(event.target as Node)) {
      this.closeFilter();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeFilter();
  }

  // ─── Fila ─────────────────────────────────────────────────────────────────

  /**
   * Ignora los clicks que nacieron en un control. Así las acciones de la fila
   * no necesitan `stopPropagation` una por una.
   */
  onRowClick(row: T, event: MouseEvent): void {
    if (!this.rowsClickable) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest('a, button, input, label, select, textarea, [role="button"]')) return;

    this.rowActivate.emit(row);
  }

  get rowsClickable(): boolean {
    return this.rowActivate.observed;
  }

  cardLabelOf(col: FsColumnDirective<T>): string {
    return col.cardLabel ?? col.header;
  }
}

/** Compara texto con `localeCompare`, números y fechas por resta. Nulos al final. */
function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}
