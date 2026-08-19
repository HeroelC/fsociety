import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  chevronRight: `${CDN}/tabler:chevron-right.svg`,
} as const;

export interface FsBreadcrumb {
  /**
   * Texto del item. Siempre obligatorio: cuando `iconOnly` esconde el texto,
   * este label pasa a ser el `aria-label`, porque un ícono es `aria-hidden` y
   * un link sin nombre accesible se anuncia como "link" y nada más.
   */
  label: string;

  /** URL completa del ícono, igual que en `fs-button`. No es un nombre de Tabler. */
  icon?: string;

  /** Muestra solo el ícono. Se ignora si no hay `icon`, para no dejar un item vacío. */
  iconOnly?: boolean;

  /** Convierte el item en link. Sin esto, es texto plano. */
  href?: string;
}

export interface FsBreadcrumbNavigation {
  item: FsBreadcrumb;
  index: number;
  /** Sin `preventDefault()`, el navegador sigue el `href` como siempre. */
  event: MouseEvent;
}

@Component({
  selector: 'fs-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsBreadcrumbsComponent {
  @Input() items: FsBreadcrumb[] = [];

  /**
   * Nombre accesible del `<nav>`. Va nombrado y no fijo porque puede haber más
   * de un nav en la página y un lector de pantalla los lista por su nombre.
   */
  @Input() label = 'Ruta de navegación';

  /** URL del ícono separador. */
  @Input() separator: string = ICONS.chevronRight;

  /**
   * El item clickeado, con su evento. La librería no depende de
   * `@angular/router` — sumarlo como peer dependency de todo el paquete por un
   * componente sería caro — así que el item se renderiza como `<a href>` real y
   * la navegación por router se resuelve acá:
   *
   *   onNavigate({ item, event }: FsBreadcrumbNavigation) {
   *     event.preventDefault();
   *     this.router.navigateByUrl(item.href!);
   *   }
   *
   * Sin `preventDefault()` el link funciona solo, que es lo que querés en una
   * app sin router. Un `<a href>` de verdad además abre en pestaña nueva con
   * ctrl+click y se puede copiar, cosa que un `(click)` sobre un `<span>` no.
   */
  @Output() navigate = new EventEmitter<FsBreadcrumbNavigation>();

  /**
   * El último item es la página actual: nunca se renderiza como link, ni aunque
   * traiga `href`. Es el patrón de WAI-ARIA para breadcrumbs — un link a donde
   * ya estás no lleva a ningún lado — y lo que marca `aria-current="page"`.
   */
  isCurrent(index: number): boolean {
    return index === this.items.length - 1;
  }

  /**
   * `iconOnly` solo tiene efecto si hay ícono. Sin este guard, un item mal
   * configurado se renderiza vacío y sin nada que anunciar.
   */
  showsText(item: FsBreadcrumb): boolean {
    return !item.iconOnly || !item.icon;
  }

  /** Solo hace falta cuando el texto no está: si está, él es el nombre. */
  accessibleName(item: FsBreadcrumb): string | null {
    return this.showsText(item) ? null : item.label;
  }

  onNavigate(event: MouseEvent, item: FsBreadcrumb, index: number): void {
    this.navigate.emit({ item, index, event });
  }
}
