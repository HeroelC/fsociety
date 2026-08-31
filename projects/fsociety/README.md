# fsociety

> Angular component library · Design system con tokens, mixins y componentes UI

[![npm version](https://img.shields.io/npm/v/@heroelc/fsociety.svg?style=flat-square)](https://www.npmjs.com/package/@heroelc/fsociety)
[![Angular](https://img.shields.io/badge/Angular-19%2B-red?style=flat-square&logo=angular)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-docs-ff4785?style=flat-square&logo=storybook)](https://heroelc.github.io/fsociety)

**📖 La documentación de cada componente — props, ejemplos y playground interactivo — vive en el [Storybook](https://heroelc.github.io/fsociety).** Este README cubre lo que hay que hacer una sola vez: instalar y configurar.

---

## Instalación

```bash
npm install @heroelc/fsociety
```

### Prerrequisitos

- Angular 19+
- Node 18+
- SCSS habilitado en el proyecto

---

## Setup rápido

### 1. Cargar los estilos en `styles.scss`

```scss
// src/styles.scss de tu app Angular
@use '@heroelc/fsociety/styles';
```

Esa línea es todo lo que necesitás. Emite:

- La paleta completa como CSS custom properties (`--fs-primary-base`, `--fs-primary-hover`, …) en `:root`.
- La **capa semántica** (`--fs-color-surface`, `--fs-color-text-primary`, `--fs-color-border`, …), que es la que hace que los componentes tengan color y que responden al tema activo.
- La utilidad `.fs-icon`, que todos los iconos de la librería usan vía `mask-image`.
- Las clases utilitarias (`flex-center`, `pl-6`, `truncate`, …).

> **No alcanza con importar solo `styles/tokens`.** La capa semántica y `.fs-icon` viven en `styles/global`, y 17 stylesheets de componentes dependen de ellas. Sin eso los componentes se renderizan sin fondo, sin bordes y con los iconos invisibles.

Si preferís control granular, los entry points son:

| Entry point | Qué trae |
|---|---|
| `@heroelc/fsociety/styles` | todo lo de abajo |
| `@heroelc/fsociety/styles/tokens` | paleta, radios, espaciados, tipografía |
| `@heroelc/fsociety/styles/global` | capa semántica `--fs-color-*`, `.fs-icon`, `box-sizing` |
| `@heroelc/fsociety/styles/mixins` | mixins SCSS + clases utilitarias |
| `@heroelc/fsociety/styles/control-size` | escala de tamaño de los controles (no emite CSS) |
| `@heroelc/fsociety/styles/overlay` | solo el mixin `popover-surface` (no emite CSS) |

### 2. Elegir el tema

Los componentes siguen el atributo `data-theme` en la raíz del documento:

```html
<html data-theme="dark">
```

Sin el atributo, se usa el tema claro. **La librería no mira `prefers-color-scheme`**, a propósito: el tema lo decide la app, en un solo lugar, y las dos capas de tokens — la de marca y la semántica — siempre coinciden.

Para seguir al sistema operativo, la app lo pide y además decide cuándo:

```typescript
const dark = matchMedia('(prefers-color-scheme: dark)');
const apply = () =>
  (document.documentElement.dataset['theme'] = dark.matches ? 'dark' : 'light');

apply();
dark.addEventListener('change', apply);
```

### 3. Cargar las tipografías

**La librería nombra tipografías pero no las incluye.** No hay ningún `@font-face` adentro del paquete, así que si no las cargás vos, todo cae al fallback de la stack y nadie avisa:

| Dónde | Qué pide |
|---|---|
| `body` (en `styles/global`) | `Plus Jakarta Sans` |
| `--fs-font-sans` | `Inter` |
| `--fs-font-mono` | `JetBrains Mono` |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
  rel="stylesheet"
>
```

O self-hosteadas, o las que quieras: pisá `--fs-font-sans` y la stack cambia entera.

### 4. Importar componentes

Los componentes son **standalone** — se importan directo en el `imports` del componente:

```typescript
import { FsButtonComponent } from '@heroelc/fsociety';

@Component({
  standalone: true,
  imports: [FsButtonComponent],
  template: `<fs-button variant="primary">Guardar</fs-button>`
})
export class MyComponent {}
```

---

## Componentes

Cada link abre el playground con los props documentados y editables.

### Formulario

| | | |
|---|---|---|
| [`fs-input`](https://heroelc.github.io/fsociety/?path=/docs/components-input--docs) | campo de texto | password, search, clear, estados |
| [`fs-textarea`](https://heroelc.github.io/fsociety/?path=/docs/components-textarea--docs) | texto multilínea | autogrow, contador |
| [`fs-number-input`](https://heroelc.github.io/fsociety/?path=/docs/components-numberinput--docs) | numérico con steppers | min/max, prefijo y sufijo |
| [`fs-select`](https://heroelc.github.io/fsociety/?path=/docs/components-select--docs) | selección simple | búsqueda, íconos, descripciones |
| [`fs-multi-select`](https://heroelc.github.io/fsociety/?path=/docs/components-multiselect--docs) | selección múltiple | chips, máximo |
| [`fs-date-picker`](https://heroelc.github.io/fsociety/?path=/docs/components-datepicker--docs) | fecha | calendario, locale, min/max |
| [`fs-date-range-picker`](https://heroelc.github.io/fsociety/?path=/docs/components-daterangepicker--docs) | rango de fechas | presets, span máximo |
| [`fs-otp`](https://heroelc.github.io/fsociety/?path=/docs/components-otp--docs) | código de verificación | pegado inteligente |
| [`fs-slider`](https://heroelc.github.io/fsociety/?path=/docs/components-slider--docs) | valor en un rango | marcas, valor visible |
| [`fs-rating`](https://heroelc.github.io/fsociety/?path=/docs/components-rating--docs) | puntuación | medias estrellas |
| [`fs-file-upload`](https://heroelc.github.io/fsociety/?path=/docs/components-fileupload--docs) | carga de archivos | drag & drop, validación |
| [`fs-checkbox`](https://heroelc.github.io/fsociety/?path=/docs/components-checkbox--docs) | casilla | indeterminado |
| [`fs-radio-group`](https://heroelc.github.io/fsociety/?path=/docs/components-radiogroup--docs) | opción única | descripciones por opción |
| [`fs-switch`](https://heroelc.github.io/fsociety/?path=/docs/components-switch--docs) | interruptor | |
| [`fs-segmented`](https://heroelc.github.io/fsociety/?path=/docs/components-segmented--docs) | control segmentado | íconos |
| [`fs-hint`, `fs-field`](https://heroelc.github.io/fsociety/?path=/docs/components-hint--docs) | ayuda y wrapper de campo | tonos |

Todos implementan `ControlValueAccessor`: andan con `[(ngModel)]` y con `formControlName`.

### Acción y estado

| | | |
|---|---|---|
| [`fs-button`](https://heroelc.github.io/fsociety/?path=/docs/components-button--docs) | botón | 6 variantes, loading, icon-only |
| [`fs-badge`](https://heroelc.github.io/fsociety/?path=/docs/components-badge--docs) | etiqueta | color custom, removible |
| [`fs-alert`](https://heroelc.github.io/fsociety/?path=/docs/components-alert--docs) | mensaje en bloque | tonos, cerrable |
| [`FsToastService`](https://heroelc.github.io/fsociety/?path=/docs/components-toast--docs) | notificaciones | stack, autodismiss |
| [`fs-tooltip`](https://heroelc.github.io/fsociety/?path=/docs/components-tooltip--docs) | tooltip | 4 lados |
| [`fs-empty-state`](https://heroelc.github.io/fsociety/?path=/docs/components-empty-state--docs) | estado vacío | 3 tamaños, tono de error |
| [`fs-skeleton`](https://heroelc.github.io/fsociety/?path=/docs/components-skeleton--docs) | placeholder de carga | variantes |
| [`fs-spinner`](https://heroelc.github.io/fsociety/?path=/docs/components-spinner--docs) | spinner | 3 tamaños |
| [`fs-progress`](https://heroelc.github.io/fsociety/?path=/docs/components-progress--docs) | barra de progreso | indeterminado |

### Layout y navegación

| | | |
|---|---|---|
| [`fs-tabs`](https://heroelc.github.io/fsociety/?path=/docs/components-tabs--docs) | pestañas | indicador animado |
| [`fs-steps`](https://heroelc.github.io/fsociety/?path=/docs/components-steps--docs) | pasos | horizontal y vertical |
| [`fs-accordion`](https://heroelc.github.io/fsociety/?path=/docs/components-accordion--docs) | acordeón | single y multiple |
| [`fs-divider`](https://heroelc.github.io/fsociety/?path=/docs/components-divider--docs) | separador | con label o ícono |
| [`fs-card`, `fs-row-card`, `fs-stat-card`](https://heroelc.github.io/fsociety/?path=/docs/components-card--docs) | superficies | tonos, métricas |
| [`fs-carousel`](https://heroelc.github.io/fsociety/?path=/docs/components-carousel--docs) | carrusel | autoplay, loop |
| [`fs-breadcrumbs`](https://heroelc.github.io/fsociety/?path=/docs/components-breadcrumbs--docs) | migas de pan | colapso automático |

### Datos

| | | |
|---|---|---|
| [`fs-table`](https://heroelc.github.io/fsociety/?path=/docs/components-table--docs) | tabla | orden, filtros por columna, densidad, vista mobile en tarjetas |

### Overlays

| | | |
|---|---|---|
| [`fs-modal`](https://heroelc.github.io/fsociety/?path=/docs/components-modal--docs) | modal | `<dialog>` nativo |
| [`fs-drawer`](https://heroelc.github.io/fsociety/?path=/docs/components-drawer--docs) | panel lateral | 4 lados |
| [`fs-menu`](https://heroelc.github.io/fsociety/?path=/docs/components-menu--docs) | menú de acciones | teclado completo, separadores |
| `[fsAnchoredPopover]` | directiva | ancla un panel al top layer |

> `[fsAnchoredPopover]` es la pieza sobre la que se apoyan `fs-select`, `fs-multi-select`, `fs-date-picker` y `fs-menu`. `position: fixed` **no** alcanza para escapar de un contenedor: cualquier ancestro con `transform`, `filter`, `backdrop-filter`, `contain` o `will-change` se vuelve el bloque contenedor y recorta el panel. La directiva usa la Popover API, que pinta en el top layer y no puede ser recortado por ningún `overflow`. Su docblock en el `.d.ts` tiene la explicación completa.

### Compositions

Componentes acoplados a un dominio, no primitivas.

| | |
|---|---|
| [`fs-experience-card`](https://heroelc.github.io/fsociety/?path=/docs/compositions-experiencecard--docs) | experiencia laboral |
| [`fs-profile-card`](https://heroelc.github.io/fsociety/?path=/docs/compositions-profilecard--docs) | perfil con stats y links |

### Foundations

Páginas del Storybook, no componentes: [Branding](https://heroelc.github.io/fsociety/?path=/docs/foundations-branding--docs) (probá colores de marca en vivo y copiá el snippet), [Tokens](https://heroelc.github.io/fsociety/?path=/docs/foundations-tokens--docs) y [Mixins](https://heroelc.github.io/fsociety/?path=/docs/foundations-mixins--docs).

---

## Sistema de tokens

```scss
--fs-{color}-muted      // 50  — badge bg, chip, alert sutil
--fs-{color}-subtle     // 100 — ghost hover bg
--fs-{color}-tint       // 200 — selected bg, focus fill
--fs-{color}-light      // 300 — borders sobre fondos claros
--fs-{color}-soft       // 400 — íconos, disabled
--fs-{color}-base       // 500 — color principal
--fs-{color}-hover      // 600 — hover en solid buttons
--fs-{color}-active     // 700 — pressed
--fs-{color}-emphasis   // 800 — texto sobre mismo color
--fs-{color}-contrast   // 900 — texto dark sobre tint/muted
```

Colores: `primary · secondary · tertiary · neutral · success · warning · danger`

### Capa semántica

Encima de la paleta hay tokens que describen **rol**, no color, y son los que consumen los componentes. Son los que cambian con `data-theme`:

```scss
--fs-color-bg               // fondo de página
--fs-color-surface          // superficie elevada (cards, campos, menús)
--fs-color-surface-alt      // superficie secundaria (hover de filas)
--fs-color-text-primary     // texto principal
--fs-color-text-secondary   // texto secundario
--fs-color-text-placeholder // placeholders
--fs-color-border           // bordes
--fs-color-border-field     // bordes de campos de formulario
--fs-color-border-strong    // bordes en hover
--fs-color-primary          // color de marca activo
--fs-color-error · --fs-color-success · --fs-color-warning
--fs-color-shadow-pop       // sombra de menús y popovers
```

### Cambiar la marca

```scss
@use '@heroelc/fsociety/styles' with (
  $fs-primary-hex:   #7c3aed,
  $fs-secondary-hex: #0891b2,
  $fs-tertiary-hex:  #0d9488,
);
```

Sass recalcula las diez paradas de cada escala en build time. Las familias configurables son `$fs-primary-hex`, `$fs-secondary-hex`, `$fs-tertiary-hex`, `$fs-neutral-hex`, `$fs-success-hex`, `$fs-warning-hex` y `$fs-danger-hex`.

> Probá colores en vivo antes de decidir: la página **Foundations → Branding** del [Storybook](https://heroelc.github.io/fsociety/?path=/docs/foundations-branding--docs) recalcula el sistema entero al instante y te da este mismo snippet listo para copiar.

### Tamaño de los controles

Todos los controles de formulario comparten una sola escala de alto, y el botón también. Un `fs-button` y un `fs-input` con el mismo `size` miden exactamente lo mismo, así que quedan parejos al ponerlos uno al lado del otro.

| `size` | Alto | Fuente |
|---|---|---|
| `sm` | 32px | 13px |
| `md` (default) | 40px | 14px |
| `lg` | 48px | 16px |

Lo aceptan `fs-button`, `fs-input`, `fs-select`, `fs-multi-select`, `fs-textarea`, `fs-number-input`, `fs-date-picker`, `fs-date-range-picker`, `fs-checkbox` y `fs-radio-group`.

Para construir un control propio que alinee con los de la librería:

```scss
@use '@heroelc/fsociety/styles/control-size' as size;

@include size.scale('.mi-control');

.mi-control__shell {
  height: var(--fs-control-h);
  padding: 0 var(--fs-control-pad-x);
  font-size: var(--fs-control-font);
}
```

El mixin emite las custom properties `--fs-control-*` por `data-size`, así que el componente tiene que bindear `[attr.data-size]="size"` en su raíz.

> **`lg` usa 16px de fuente y no 15 a propósito:** Safari en iOS hace zoom al enfocar un input con menos de 16px.

> **Todo componente que lea `--fs-control-*` tiene que incluir `scale()` sobre su propia raíz.** Las custom properties heredan, así que sin eso un control anidado dentro de otro tomaría la escala del padre.

### Redondeo por componente

**El input `corners`** elige qué esquinas van redondeadas. Sirve para apoyar un componente contra otro sin que quede una esquina redonda adentro de otra:

```html
<fs-card corners="top">
  <fs-input corners="bottom"></fs-input>
</fs-card>
```

`FsCorners` es `'all' | 'none' | 'top' | 'bottom' | 'start' | 'end'`.

> **`start` y `end` son lógicas**, no `left`/`right`: siguen la dirección de escritura, así que en RTL se dan vuelta solas.

**La custom property de radio** de cada componente cambia cuánto redondea:

```html
<fs-input style="--fs-input-radius: 0"></fs-input>
<fs-card style="--fs-card-radius: 16px"></fs-card>
```

Acepta el shorthand entero de `border-radius`, pero solo con `corners="all"`: los otros presets apagan esquinas puntuales con longhands y pisarían el shorthand.

---

## Mixins y utilidades

```scss
@use '@heroelc/fsociety/styles/mixins' as m;

.mi-componente {
  @include m.flex-center;
  @include m.px(4);        // padding-left + right: 16px
  @include m.stack(16px);  // flex-col + gap
  @include m.truncate;

  @include m.respond-to('md') {
    @include m.flex-between;
  }
}
```

O con clases utilitarias directamente en el HTML:

```html
<div class="flex-between px-6 py-4 gap-4">
  <span class="truncate-2 text-sm font-medium">...</span>
  <span class="uppercase-label">Frontend Developer</span>
</div>
```

Breakpoints: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `xxl` 1536px

---

## Contribuir

El código vive en [github.com/HeroelC/fsociety](https://github.com/HeroelC/fsociety). Ahí está el detalle de cómo levantar el proyecto, correr Storybook y publicar.

## Licencia

MIT © [Heroel Carpinetti](https://github.com/HeroelC)
