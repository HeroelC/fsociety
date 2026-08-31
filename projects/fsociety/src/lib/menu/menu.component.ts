import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsAnchoredPopoverDirective, FsPopoverAlign, FsPopoverSide } from '../overlay/anchored-popover.directive';

/** Un ítem del menú. */
export interface FsMenuItem {
  /** Identificador que viaja en `itemSelect`. Es lo que el consumidor switchea. */
  id: string;

  /** Texto visible. */
  label: string;

  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:pencil.svg'.
   */
  icon?: string;

  /** Texto secundario alineado a la derecha: un atajo de teclado, un contador. */
  hint?: string;

  /** El ítem se ve apagado, no recibe foco y no emite. */
  disabled?: boolean;

  /** Lo pinta con el color de peligro. Para "Eliminar" y parecidos. */
  danger?: boolean;

  /** Dibuja un separador ARRIBA de este ítem. Sirve para agrupar. */
  separatorBefore?: boolean;
}

let menuIdCounter = 0;

/**
 * Menú de acciones anclado a un disparador.
 *
 * El disparador lo proyecta el consumidor, así que puede ser un `fs-button`,
 * un ícono suelto o lo que sea:
 *
 * ```html
 * <fs-menu [items]="acciones" (itemSelect)="onAccion($event)">
 *   <fs-button menuTrigger iconOnly variant="ghost" [iconLeft]="dots"></fs-button>
 * </fs-menu>
 * ```
 *
 * El panel sube al top layer vía `FsAnchoredPopoverDirective`, así que no lo
 * recorta ningún ancestro con `overflow` o `transform` — que es exactamente el
 * caso de una tabla con acciones por fila, o de un menú adentro de una card.
 *
 * El componente existe porque `fs-select`, `fs-multi-select` y `fs-date-picker`
 * ya traían cada uno su propia copia del cierre por click afuera, y dos de los
 * tres además el manejo de teclado. Acá está una sola vez, y con Escape — que
 * `fs-multi-select` nunca llegó a implementar.
 */
@Component({
  selector: 'fs-menu',
  standalone: true,
  imports: [CommonModule, FsAnchoredPopoverDirective],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsMenuComponent {
  /** Los ítems a mostrar. */
  @Input() items: FsMenuItem[] = [];

  /** Alinea el panel contra el disparador. */
  @Input() align: FsPopoverAlign = 'start';

  /** Lado preferido. Se da vuelta solo si de ese lado no entra. */
  @Input() side: FsPopoverSide = 'bottom';

  /**
   * Estira el panel al ancho del disparador. Por defecto NO: un menú se mide
   * por su contenido, a diferencia de un `fs-select`, donde el panel tiene que
   * empatar con el campo.
   */
  @Input() matchTriggerWidth = false;

  /** Deshabilita el disparador entero. */
  @Input() disabled = false;

  /** Nombre accesible del disparador cuando lo proyectado es solo un ícono. */
  @Input() ariaLabel = 'Abrir menú';

  /** Emite el ítem elegido. No dispara para ítems deshabilitados. */
  @Output() itemSelect = new EventEmitter<FsMenuItem>();

  /** Emite al abrir y al cerrar. */
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChildren('menuItem') private itemEls!: QueryList<ElementRef<HTMLButtonElement>>;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly menuId = `fs-menu-${++menuIdCounter}`;

  open = false;

  /** Índice del ítem con foco. -1 = ninguno. */
  activeIndex = -1;

  /**
   * Los índices que pueden recibir foco. Los deshabilitados quedan afuera para
   * que las flechas los salteen en vez de frenar el recorrido.
   */
  private get focusable(): number[] {
    return this.items
      .map((item, i) => (item.disabled ? -1 : i))
      .filter(i => i !== -1);
  }

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openMenu();
  }

  openMenu(): void {
    if (this.disabled || this.open) return;
    this.open = true;
    this.activeIndex = this.focusable[0] ?? -1;
    this.openChange.emit(true);
    this.focusActive();
  }

  close(options: { restoreFocus?: boolean } = {}): void {
    if (!this.open) return;
    this.open = false;
    this.activeIndex = -1;
    this.openChange.emit(false);

    // Al cerrar con teclado el foco tiene que volver al disparador, o el tab
    // order arranca de nuevo desde arriba del documento.
    if (options.restoreFocus) {
      this.triggerEl?.focus();
    }
  }

  select(item: FsMenuItem): void {
    if (item.disabled) return;
    this.itemSelect.emit(item);
    this.close({ restoreFocus: true });
  }

  // ─── Teclado ──────────────────────────────────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.openMenu();
        break;
      case 'ArrowUp':
        // Abrir desde abajo: el patrón esperado cuando el menú se despliega
        // hacia arriba, y un atajo útil para llegar al último ítem.
        event.preventDefault();
        this.openMenu();
        this.activeIndex = this.focusable.at(-1) ?? -1;
        this.focusActive();
        break;
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    const order = this.focusable;
    if (!order.length) return;

    const at = order.indexOf(this.activeIndex);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        // Circular: llegar al final y seguir vuelve al principio.
        this.activeIndex = order[(at + 1) % order.length];
        this.focusActive();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = order[(at - 1 + order.length) % order.length];
        this.focusActive();
        break;

      case 'Home':
        event.preventDefault();
        this.activeIndex = order[0];
        this.focusActive();
        break;

      case 'End':
        event.preventDefault();
        this.activeIndex = order[order.length - 1];
        this.focusActive();
        break;

      case 'Escape':
        event.preventDefault();
        this.close({ restoreFocus: true });
        break;

      case 'Tab':
        // Tab sale del menú. No se previene: dejar que el foco siga su camino
        // es el comportamiento esperado, pero el panel no puede quedar abierto
        // detrás.
        this.close();
        break;
    }
  }

  // ─── Cierre por click afuera ──────────────────────────────────────────────

  // mousedown y no click: con click el menú sigue abierto durante todo el
  // arrastre del botón, y un click que empieza afuera y termina adentro no
  // debería contar como "adentro".
  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this.open) return;

    const target = event.target as Node;
    // El panel está en el top layer pero sigue siendo descendiente del host en
    // el DOM, así que `contains` lo alcanza igual.
    if (!this.el.nativeElement.contains(target)) {
      this.close();
      this.cdr.markForCheck();
    }
  }

  private get triggerEl(): HTMLElement | null {
    return this.el.nativeElement.querySelector('.fs-menu__trigger');
  }

  /**
   * El foco se mueve después de que Angular pintó el panel. En el mismo tick
   * los botones todavía no existen en el DOM.
   */
  private focusActive(): void {
    queueMicrotask(() => {
      this.cdr.detectChanges();
      if (this.activeIndex === -1) return;
      // La QueryList recorre TODOS los ítems, deshabilitados incluidos, así que
      // su índice es el de `items` — no el de `focusable`.
      this.itemEls?.get(this.activeIndex)?.nativeElement.focus();
    });
  }
}
