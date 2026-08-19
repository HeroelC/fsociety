# fsociety

> Angular component library · Design system con tokens, mixins y componentes UI

[![npm version](https://img.shields.io/npm/v/@heroelc/fsociety.svg?style=flat-square)](https://www.npmjs.com/package/@heroelc/fsociety)
[![Angular](https://img.shields.io/badge/Angular-19%2B-red?style=flat-square&logo=angular)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-docs-ff4785?style=flat-square&logo=storybook)](https://heroelc.github.io/fsociety)

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
| `@heroelc/fsociety/styles/overlay` | solo el mixin `popover-surface` (no emite CSS) |

### 1b. Elegir el tema

Los componentes siguen el atributo `data-theme` en la raíz del documento:

```html
<html data-theme="dark">
```

Sin el atributo, se usa el tema claro. **La librería no mira
`prefers-color-scheme`**, a propósito: el tema lo decide la app, en un solo
lugar, y las dos capas de tokens — la de marca y la semántica — siempre
coinciden.

Para seguir al sistema operativo, la app lo pide y además decide cuándo:

```typescript
const dark = matchMedia('(prefers-color-scheme: dark)');
const apply = () =>
  (document.documentElement.dataset['theme'] = dark.matches ? 'dark' : 'light');

apply();
dark.addEventListener('change', apply);
```

### 1c. Cargar las tipografías

**La librería nombra tipografías pero no las incluye.** No hay ningún
`@font-face` adentro del paquete, así que si no las cargás vos, todo cae al
fallback de la stack y nadie avisa:

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

O self-hosteadas, o las que quieras: pisá `--fs-font-sans` y la stack cambia
entera.

> `body` pide Plus Jakarta Sans y `--fs-font-sans` pide Inter. Son dos valores
> distintos y es a propósito solo a medias — si querés una sola, declará las dos.

### 2. Importar componentes

Los componentes son **standalone** — se importan directo en el `imports` del componente o módulo:

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

La librería separa lo que expone en dos grupos, y la línea es el **acoplamiento
al dominio**, no el tamaño:

| Grupo | Qué es | Ejemplos |
|---|---|---|
| **Components** | Primitivas de UI genéricas. No saben nada del dominio de tu app. | `fs-button`, `fs-input`, `fs-select`, `fs-tabs`, `fs-toast` |
| **Compositions** | Composiciones opinionadas que sí modelan un dominio: reciben datos estructurados y renderizan un layout completo. | `fs-profile-card`, `fs-experience-card` |

Un `fs-button` no sabe de qué habla tu producto. Un `fs-profile-card` sí: espera
una persona, con stats y links. Esperá reemplazar o pisar más estilos en una
Composition que en un Component — están pensadas para arrancar rápido, no para
cubrir todos los casos.

El Storybook usa esas mismas dos secciones.

### Índice

**Formulario** — [fs-input](#fs-input) · [fs-textarea](#fs-textarea) · [fs-number-input](#fs-number-input) · [fs-select](#fs-select) · [fs-multi-select](#fs-multi-select) · [fs-date-picker](#fs-date-picker) · [fs-date-range-picker](#fs-date-range-picker) · [fs-otp](#fs-otp) · [fs-slider](#fs-slider) · [fs-rating](#fs-rating) · [fs-file-upload](#fs-file-upload) · [checkbox · radio · switch · segmented](#selección--fs-checkbox-fs-radio-group-fs-switch-fs-segmented) · [fs-hint · fs-field](#fs-hint-y-fs-field)

**Acción y estado** — [fs-button](#fs-button) · [fs-badge](#fs-badge) · [fs-alert](#fs-alert) · [toast](#fstoastservice--fs-toast-stack) · [fs-tooltip](#fs-tooltip) · [skeleton · spinner · progress](#carga--fs-skeleton-fs-spinner-fs-progress)

**Layout y navegación** — [fs-tabs](#fs-tabs) · [fs-steps](#fs-steps) · [fs-accordion](#fs-accordion) · [fs-divider](#fs-divider) · [card · row-card · stat-card](#cards--fs-card-fs-row-card-fs-stat-card) · [fs-carousel](#fs-carousel) · [fs-breadcrumbs](#fs-breadcrumbs)

**Overlays** — [fs-modal](#fs-modal) · [fs-drawer](#fs-drawer) · [fsAnchoredPopover](#fsanchoredpopover)

**Compositions** — [fs-experience-card](#fs-experience-card) · [fs-profile-card](#fs-profile-card)

### `<fs-button>`

```html
<fs-button variant="primary" size="md">Guardar</fs-button>
<fs-button variant="secondary">Cancelar</fs-button>
<fs-button variant="outline" [disabled]="loading">Editar</fs-button>
<fs-button variant="ghost">Ver más →</fs-button>
<fs-button variant="danger">Eliminar</fs-button>
<fs-button [loading]="true">Guardando</fs-button>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Muestra spinner y deshabilita |
| `fullWidth` | `boolean` | `false` | Ocupa el 100% del contenedor |
| `iconLeft` | `string` | — | URL del ícono izquierdo (Iconify CDN) |
| `iconRight` | `string` | — | URL del ícono derecho (Iconify CDN) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML nativo |

| Output | Tipo | Descripción |
|---|---|---|
| `fsClick` | `EventEmitter<MouseEvent>` | Click (no emite si disabled o loading) |

---

### `<fs-badge>`

```html
<fs-badge color="primary">TypeScript</fs-badge>
<fs-badge color="success" [dot]="true">Activo</fs-badge>
<fs-badge color="neutral" variant="outline">ESLint</fs-badge>

<!-- con ícono monocromo — se tiñe con el color del badge -->
<fs-badge color="danger"
  imgLeft="https://api.iconify.design/simple-icons:angular.svg"
  imgLeftAlt="Angular">
  Angular
</fs-badge>

<!-- con color hex personalizado -->
<fs-badge customColor="#7c3aed"
  imgLeft="https://api.iconify.design/simple-icons:nestjs.svg">
  NestJS
</fs-badge>

<!-- removable -->
<fs-badge color="primary" [removable]="true" (removed)="onRemove()">TypeScript</fs-badge>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'neutral'` | Color semántico |
| `customColor` | `string` | — | Color hex personalizado — genera fondo, borde y texto automáticamente |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Variante visual |

> Si venís de un handoff escrito para el bundle de React: lo que allá se llama
> `soft` acá es `filled`. No hay alias — un mismo valor con dos nombres es deuda
> que no se paga sola.
| `size` | `'sm' \| 'md'` | `'md'` | Tamaño |
| `dot` | `boolean` | `false` | Punto de estado |
| `iconLeft` | `string` | — | SVG path ícono izquierdo (viewBox 0 0 24 24) |
| `iconRight` | `string` | — | SVG path ícono derecho |
| `imgLeft` | `string` | — | URL de ícono izquierdo (prioridad sobre iconLeft) |
| `imgRight` | `string` | — | URL de ícono derecho |
| `imgLeftAlt` | `string` | `''` | Descripción del ícono izquierdo |
| `imgRightAlt` | `string` | `''` | Descripción del ícono derecho |
| `iconOnly` | `boolean` | `false` | Badge circular sin label |
| `removable` | `boolean` | `false` | Muestra botón X |

| Output | Tipo | Descripción |
|---|---|---|
| `removed` | `EventEmitter<void>` | Emite al clickear el X |

> **`imgLeft` / `imgRight` esperan un ícono monocromo.** Se pintan con
> `mask-image` tomando el color del texto del badge, así que se adaptan al tono y
> al tema solos — y no hace falta un color en la URL. No sirven para artwork a
> color: solo se usa la silueta.
>
> Por eso los ejemplos usan `api.iconify.design/simple-icons:*.svg` sin sufijo de
> color. Un `<img>` no funcionaría: dentro de un `<img>` el SVG es un documento
> aislado, `currentColor` no hereda, y el ícono queda del color que traiga
> embebido — invisible cuando coincide con el fondo.
>
> Los íconos son decorativos (`aria-hidden`), así que el `Alt` no se renderiza:
> el label del badge ya comunica el significado.

---

### `<fs-tabs>`

```html
<fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
  <div *ngIf="activeTab === 'experiencia'">...</div>
  <div *ngIf="activeTab === 'sobre-mi'">...</div>
</fs-tabs>
```

```typescript
tabs = [
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'sobre-mi',    label: 'Sobre mí' },
  { id: 'formacion',   label: 'Formación' },
];
activeTab = 'experiencia';
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `tabs` | `FsTab[]` | `[]` | Array de tabs `{ id, label, disabled? }` |
| `activeTab` | `string` | `''` | Id de la tab activa |

| Output | Tipo | Descripción |
|---|---|---|
| `activeTabChange` | `EventEmitter<string>` | Two-way binding |
| `tabChange` | `EventEmitter<FsTab>` | Emite el objeto FsTab completo |

**CSS custom properties configurables.** Por defecto derivan de los tokens
semánticos, así que siguen el tema activo. Pisá solo las que necesites:

```css
fs-tabs {
  --fs-tab-bg:             var(--fs-color-bg);
  --fs-tab-color:          var(--fs-color-text-secondary);
  --fs-tab-color-hover:    color-mix(in srgb, var(--fs-color-text-primary) 70%, transparent);
  --fs-tab-color-active:   var(--fs-color-text-primary);
  --fs-tab-border:         var(--fs-color-border);
  --fs-tab-hover-bg:       color-mix(in srgb, var(--fs-color-text-primary) 5%, transparent);
  --fs-tab-indicator-from: var(--fs-primary-base);
  --fs-tab-indicator-to:   var(--fs-tertiary-base);
  --fs-tab-indicator-glow: color-mix(in srgb, var(--fs-tab-indicator-to) 45%, transparent);
  --fs-tab-radius:         8px;
}
```

---

### `<fs-alert>`

```html
<fs-alert tone="info" title="Actualización disponible" [dismissible]="true">
  Actualizá para acceder a las últimas funciones.
</fs-alert>

<fs-alert tone="success" title="Guardado" [autoDismiss]="3000">
  Cambios guardados correctamente.
</fs-alert>

<!-- Con botones de acción via slot [alertAction] -->
<fs-alert tone="warning" title="Tu plan expira pronto">
  Quedan 3 días de tu prueba gratuita.
  <fs-button alertAction variant="outline" size="sm">Recordar luego</fs-button>
  <fs-button alertAction variant="primary" size="sm">Renovar ahora</fs-button>
</fs-alert>
```

Poné `alertAction` en **cada** botón: el slot los separa entre sí. Si en cambio los envolvés en un solo elemento, también funciona — el wrapper se acomoda como fila con el mismo espaciado.

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Tono semántico — determina color e ícono |
| `title` | `string` | `''` | Título en negrita |
| `dismissible` | `boolean` | `false` | Muestra botón X para cerrar |
| `autoDismiss` | `number` | `0` | Auto-cierre en ms — muestra progress bar (0 = off) |

| Slot | Selector | Descripción |
|---|---|---|
| Default | — | Texto descriptivo del alert |
| Action | `[alertAction]` | Botones de acción (debajo del texto). Uno por botón, o un único wrapper |

| Output | Tipo | Descripción |
|---|---|---|
| `dismissed` | `EventEmitter<void>` | Emite al cerrarse (botón X o auto-dismiss) |

| Custom property | Default |
|---|---|
| `--fs-alert-radius` | `var(--fs-radius-md)` |

---

### `<fs-input>`

Implementa `ControlValueAccessor` — compatible con `[(ngModel)]` y formularios reactivos.

```html
<fs-input label="Nombre" placeholder="Ada Lovelace" hint="Tu nombre completo."
  [iconLeft]="iconUser"></fs-input>

<fs-input type="email" label="Correo" [iconLeft]="iconMail"
  [clearable]="true" [(ngModel)]="email"></fs-input>

<fs-input type="password" label="Contraseña" [iconLeft]="iconLock"
  hint="Mínimo 8 caracteres." [(ngModel)]="password"></fs-input>

<fs-input type="email" label="Correo" state="error"
  errorMessage="Ese correo no es válido." [(ngModel)]="correo"></fs-input>

<fs-input label="Cupón" state="success"
  successMessage="¡Cupón aplicado!" [(ngModel)]="cupon"></fs-input>
```

```typescript
// Los iconos son URLs de Iconify CDN
const CDN = 'https://api.iconify.design';
iconUser = `${CDN}/tabler:user.svg`;
iconMail = `${CDN}/tabler:mail.svg`;
iconLock = `${CDN}/tabler:lock.svg`;
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `'text' \| 'email' \| 'password' \| 'url' \| 'search'` | `'text'` | Tipo del campo |
| `label` | `string` | `''` | Etiqueta visible |
| `placeholder` | `string` | `''` | Placeholder del campo |
| `hint` | `string` | `''` | Texto de ayuda (visible en estado default) |
| `iconLeft` | `string` | `''` | URL del ícono izquierdo (Iconify CDN) |
| `clearable` | `boolean` | `false` | Muestra botón para limpiar el valor |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readonly` | `boolean` | `false` | Solo lectura |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | Estado de validación |
| `errorMessage` | `string` | `''` | Mensaje de error (visible cuando `state='error'`) |
| `successMessage` | `string` | `''` | Mensaje de éxito (visible cuando `state='success'`) |

| Custom property | Default |
|---|---|
| `--fs-input-radius` | `var(--fs-radius-md)` |

---

### `<fs-select>`

Implementa `ControlValueAccessor`. Las opciones con `desc` e `icon` muestran descripción e ícono en el dropdown.

```typescript
import { FsSelectComponent, FsSelectOption } from '@heroelc/fsociety';

options: FsSelectOption[] = [
  { value: 'admin',  label: 'Administrador', desc: 'Acceso completo' },
  { value: 'editor', label: 'Editor',         desc: 'Crear y editar contenido' },
  { value: 'viewer', label: 'Visor',          desc: 'Solo lectura' },
];
```

```html
<fs-select
  label="Rol de usuario"
  placeholder="Seleccionar rol..."
  hint="Define los permisos del usuario."
  [options]="options"
  [(ngModel)]="selectedRole"
></fs-select>

<!-- Con búsqueda -->
<fs-select
  label="Tecnología"
  [searchable]="true"
  [options]="techs"
  [(ngModel)]="selectedTech"
></fs-select>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `FsSelectOption[]` | `[]` | Array de opciones `{ value, label, desc?, icon? }` |
| `label` | `string` | `''` | Etiqueta visible |
| `placeholder` | `string` | `'Seleccionar...'` | Texto cuando no hay selección |
| `hint` | `string` | `''` | Texto de ayuda |
| `iconLeft` | `string` | `''` | URL del ícono izquierdo (Iconify CDN) |
| `searchable` | `boolean` | `false` | Habilita filtro por texto |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | Estado de validación |
| `errorMessage` | `string` | `''` | Mensaje de error |
| `successMessage` | `string` | `''` | Mensaje de éxito |
| `emptyText` | `string` | `'Sin resultados'` | Texto cuando no hay opciones que coincidan |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<string>` | Emite el valor seleccionado |

| Custom property | Default | |
|---|---|---|
| `--fs-select-radius` | `var(--fs-radius-md)` | Trigger |
| `--fs-select-menu-radius` | `var(--fs-radius-lg)` | Menú desplegable |

---

### `<fs-date-picker>`

Campo de fecha **tipeable** con calendario. Implementa `ControlValueAccessor`, así
que anda con `[(ngModel)]` y con formularios reactivos. El valor del modelo es un
`Date` a medianoche, o `null`.

```html
<fs-date-picker
  label="Fecha de nacimiento"
  hint="Podés tipearla o elegirla del calendario."
  [(ngModel)]="fechaNacimiento"
></fs-date-picker>

<!-- Acotado a un rango -->
<fs-date-picker
  label="Fecha de la reserva"
  [min]="hoy"
  [max]="finDeTemporada"
  [(ngModel)]="reserva"
></fs-date-picker>

<!-- Otro locale: cambia el formato y los nombres de mes y día -->
<fs-date-picker label="Date" locale="en-US" [firstDayOfWeek]="0"></fs-date-picker>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta visible |
| `placeholder` | `string` | `'dd/mm/aaaa'` | Placeholder del campo |
| `hint` | `string` | `''` | Texto de ayuda |
| `locale` | `string` | `'es-AR'` | BCP 47 — define el formato tipeado y los nombres de mes/día |
| `firstDayOfWeek` | `number` | `1` | Primer día de la semana (0 domingo … 1 lunes) |
| `min` | `Date \| string \| null` | — | Fecha mínima seleccionable |
| `max` | `Date \| string \| null` | — | Fecha máxima seleccionable |
| `clearable` | `boolean` | `true` | Muestra la X para limpiar |
| `showFooter` | `boolean` | `true` | Muestra el pie con Hoy / Limpiar |
| `todayLabel` | `string` | `'Hoy'` | Texto del botón Hoy |
| `clearLabel` | `string` | `'Limpiar'` | Texto del botón Limpiar |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readonly` | `boolean` | `false` | Solo lectura — no se tipea ni se abre |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | Estado de validación |
| `errorMessage` / `successMessage` | `string` | `''` | Mensajes de validación |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<Date \| null>` | Emite la fecha seleccionada |

**Lo que acepta al tipear.** El separador puede ser `/`, `-`, `.` o espacio, el año
puede tener 2 o 4 dígitos, y el orden de día y mes lo define el `locale` — salvo
que empiece con 4 dígitos, que se lee como ISO. Un año de 2 dígitos se interpreta
en una ventana de ±50 años alrededor de hoy, así que `90` es 1990 y `26` es 2026.

Mientras escribís, el modelo solo se actualiza cuando el texto parsea a una fecha
válida y dentro del rango: pisarlo en cada tecla pelearía con vos a mitad de
`15/03/1990`. Al salir del campo, lo que no parsea vuelve al valor del modelo, así
que el texto visible nunca contradice el valor.

Fechas imposibles se rechazan: `31/02` y `29/02/2023` dan `null` en vez de rodar a
marzo como haría `new Date()`.

**Teclado:** `↓` abre · flechas mueven el cursor cruzando de mes · `Inicio`/`Fin`
van al borde de la semana · `PageUp`/`PageDown` cambian de mes (con `Shift`, de
año) · `Enter` selecciona · `Esc` cierra.

> El calendario se renderiza en el **top layer** vía [`[fsAnchoredPopover]`](#fsanchoredpopover),
> así que no lo recorta ningún contenedor con `overflow` o `transform`.

| Custom property | Default | |
|---|---|---|
| `--fs-date-picker-radius` | `var(--fs-radius-md)` | Campo |
| `--fs-date-picker-panel-radius` | `var(--fs-radius-lg)` | Panel del calendario |

---

### `<fs-date-range-picker>`

Rango de fechas con dos meses en pantalla y preview al pasar el mouse. Implementa
`ControlValueAccessor`; el valor del modelo es `{ start, end }`.

```html
<fs-date-range-picker label="Período" [(ngModel)]="periodo"></fs-date-range-picker>

<!-- Con atajos -->
<fs-date-range-picker label="Reporte" [presets]="presets" [(ngModel)]="periodo"></fs-date-range-picker>

<!-- Máximo 7 noches -->
<fs-date-range-picker label="Reserva" [maxSpan]="7" [(ngModel)]="periodo"></fs-date-range-picker>
```

```typescript
import type { FsDateRange, FsDateRangePreset } from '@heroelc/fsociety';

periodo: FsDateRange = { start: null, end: null };

presets: FsDateRangePreset[] = [
  { label: 'Últimos 7 días', range: () => ({ start: hace(6), end: hoy() }) },
  { label: 'Este mes',       range: () => ({ start: inicioDeMes(), end: hoy() }) },
];
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` | `string` | `''` | |
| `startPlaceholder` / `endPlaceholder` | `string` | `'Desde'` / `'Hasta'` | Placeholders de los dos campos |
| `months` | `1 \| 2` | `2` | Meses en pantalla. `1` para columnas angostas |
| `locale` | `string` | `'es-AR'` | BCP 47 — formato y nombres, vía Intl |
| `firstDayOfWeek` | `number` | `1` | 0 domingo … 1 lunes |
| `min` / `max` | `Date \| string \| null` | — | Límites duros |
| `maxSpan` | `number` | `0` | Largo máximo del rango en días. `0` = sin tope |
| `presets` | `FsDateRangePreset[]` | `[]` | Atajos en la columna izquierda |
| `clearable` | `boolean` | `true` | Muestra la X |
| `disabled` / `readonly` | `boolean` | `false` | |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | |
| `errorMessage` / `successMessage` | `string` | `''` | |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<FsDateRange>` | Emite el rango |

> **Es un componente aparte del `<fs-date-picker>`, no un modo.** Un `mode="range"`
> haría que `value` fuera `Date | [Date, Date] | null`, una unión que cambia el
> contrato del `ControlValueAccessor` según un input: `[(ngModel)]` quedaría
> ambiguo y cada consumidor tendría que narrowear. Los dos comparten la lógica de
> calendario internamente, así que un bug de grilla se arregla una sola vez.

Los dos extremos de `FsDateRange` pueden ser `null` por separado — es lo que pasa
mientras el rango está a medio elegir. Por eso es un par de nullables y no una
tupla.

**Detalles de comportamiento.** El rango se previsualiza siguiendo el mouse antes
del segundo clic. Con `maxSpan`, una vez elegido el inicio los días más allá del
tope quedan **deshabilitados**, no rechazados después del clic. Clickear un día
anterior al inicio se toma como nuevo inicio, y un rango tipeado al revés se
ordena en el blur en vez de descartarse.

| Custom property | Default | |
|---|---|---|
| `--fs-date-range-picker-radius` | `var(--fs-radius-md)` | Campo |
| `--fs-date-range-picker-panel-radius` | `var(--fs-radius-lg)` | Panel del calendario |

---

### `<fs-otp>`

Campo de código de verificación. Implementa `ControlValueAccessor`; el valor es el
código concatenado.

```html
<fs-otp label="Código de verificación" [(ngModel)]="codigo"></fs-otp>

<!-- Agrupado, y avisando cuando se completa -->
<fs-otp [length]="6" [groupAt]="3" (completed)="verificar($event)"></fs-otp>

<!-- Alfanumérico -->
<fs-otp label="Invitación" mode="alphanumeric" [length]="6"></fs-otp>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` | `string` | `''` | |
| `length` | `number` | `6` | Cantidad de celdas, acotado a 1–12 |
| `mode` | `'numeric' \| 'alphanumeric'` | `'numeric'` | Alfanumérico pasa a mayúsculas solo |
| `groupAt` | `number` | — | Dibuja un separador antes de ese índice |
| `separator` | `string` | `'–'` | Carácter del separador |
| `selectOnFocus` | `boolean` | `true` | Selecciona el contenido al enfocar, así tipear sobrescribe |
| `disabled` | `boolean` | `false` | |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | |
| `errorMessage` / `successMessage` | `string` | `''` | |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<string>` | Emite en cada cambio |
| `completed` | `EventEmitter<string>` | Emite cuando todas las celdas están llenas |

> **La primera celda lleva `autocomplete="one-time-code"`.** Es lo que habilita el
> autofill del SMS en iOS y Android. Sin eso el usuario tiene que salir de la app
> a copiar el código a mano.

**Pegar funciona desde la celda enfocada.** Pegar el código completo en la primera
llena todas; pegar dos dígitos en la cuarta llena la cuarta y la quinta y deja las
anteriores intactas. Y el desborde de un solo evento se reparte en las celdas
siguientes en vez de descartarse — eso es lo que hace que el autofill del SMS,
que entrega todo el código a un solo campo, funcione.

`Backspace` sobre una celda llena la vacía y **se queda ahí**; solo retrocede si
ya estaba vacía. Si saltara siempre, borrar dos caracteres seguidos se vuelve
impredecible.

| Custom property | Default | |
|---|---|---|
| `--fs-otp-radius` | `var(--fs-radius-md)` | Cada celda, no el grupo |

---

### `<fs-modal>`

Diálogo modal construido sobre **`<dialog>` nativo** con `showModal()`.

```html
<fs-button (click)="abierto = true">Abrir</fs-button>

<fs-modal [(open)]="abierto" heading="Confirmar acción">
  <p>Esto va a archivar el proyecto.</p>

  <fs-button modalFooter variant="outline" (click)="abierto = false">Cancelar</fs-button>
  <fs-button modalFooter variant="danger" (click)="archivar()">Archivar</fs-button>
</fs-modal>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way: `[(open)]` |
| `heading` | `string` | `''` | Título del header |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 380 · 520 · 760px · casi todo el viewport |
| `width` | `string` | — | Cualquier longitud CSS; pisa el preset |
| `closeOnBackdrop` | `boolean` | `true` | Clickear el fondo cierra |
| `closeOnEscape` | `boolean` | `true` | `Escape` cierra |
| `showClose` | `boolean` | `true` | Muestra la X |
| `closeLabel` | `string` | `'Cerrar'` | `aria-label` de la X |
| `lockScroll` | `boolean` | `true` | Bloquea el scroll de la página de atrás |

| Output | Tipo | Descripción |
|---|---|---|
| `openChange` | `EventEmitter<boolean>` | Para el two-way binding |
| `closed` | `EventEmitter<void>` | Emite después de cerrarse, sin importar qué lo cerró |

| Slot | Selector | Descripción |
|---|---|---|
| Default | — | Cuerpo del modal |
| Footer | `[modalFooter]` | Botones de acción. Sin contenido, el footer no ocupa lugar |

> El slot **es** la fila: pone el `display: flex` y el `gap`. Por eso el atributo va
> en cada botón, no en un `<div>` que los envuelva — un wrapper se come el `gap` y
> los botones salen pegados.

---

### `<fs-drawer>`

El mismo `<dialog>` nativo, con el panel pegado a un borde en vez de centrado.

```html
<fs-drawer [(open)]="abierto" heading="Filtros" side="right" size="400px">
  <fs-input label="Buscar"></fs-input>

  <fs-button drawerFooter variant="primary" (click)="aplicar()">Aplicar</fs-button>
</fs-drawer>
```

Tiene los mismos inputs y outputs que `<fs-modal>`, con dos diferencias:

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `side` | `'right' \| 'left' \| 'top' \| 'bottom'` | `'right'` | Borde del que entra |
| `size` | `string` | `'400px'` | Ancho para left/right, alto para top/bottom |

El slot del footer es `[drawerFooter]`.

---

#### Por qué `<dialog>` nativo

`showModal()` resuelve cuatro cosas que un overlay hecho a mano tiene que
construir, y que normalmente quedan mal:

- **Focus trap.** `Tab` no se puede escapar del diálogo a la página de atrás.
- **Focus restore.** Al cerrar, el foco vuelve a lo que estaba enfocado antes.
- **Fondo inerte de verdad.** `aria-modal="true"` es una *declaración*, no una
  garantía: sin `inert`, un lector de pantalla llega igual al contenido de atrás.
- **Top layer.** Ningún `z-index` puede poner algo encima. Los dropdowns de esta
  librería viven en el top layer con `z-index: 9999`, así que un overlay con
  `z-index: 100` los tendría **por arriba** del modal.

`Escape` también lo maneja el navegador: dispara `cancel` y después `close`.

Lo que sí queda de nuestro lado, porque el nativo no lo hace: cerrar al clickear
el fondo, bloquear el scroll de la página, y mantener `open` sincronizado cuando
el navegador cierra el diálogo por su cuenta.

El scroll lock compensa el ancho de la barra con `padding-right`. Sin eso, esconder
la barra reflowea la página y se ve como un salto lateral al abrir.

| Custom property | Default |
|---|---|
| `--fs-drawer-size` | `400px` — ancho en left/right, alto en top/bottom |
| `--fs-drawer-max-size` | `calc(100dvw - 40px)` en left/right, `calc(100dvh - 40px)` en top/bottom |

`--fs-drawer-max-size` es el tope del panel sobre el eje que use el lado. Para una
hoja de filtros a pantalla completa:

```html
<fs-drawer side="bottom" style="--fs-drawer-max-size: 100dvh">
```

> **Se mide en `dvh`, no en `vh`.** `100vh` es el viewport con la barra de URL
> colapsada, lo reporte o no el navegador, así que en un teléfono el diálogo sale
> más alto que el área visible. Y como todo `<dialog>` trae `overflow: auto` del
> user-agent stylesheet, ese excedente no se recorta: scrollea. Con
> `side="bottom"` el panel se ancla al borde inferior de esa caja agrandada, que
> queda abajo del pliegue, y se lleva el footer con él.
>
> El footer despeja `env(safe-area-inset-bottom)` con `max(16px, …)`, así que en
> un iPhone las acciones no quedan abajo del indicador de home. `fs-modal` hace
> lo mismo: su tope es `100dvh - 48px`, que deja 24px de aire — menos que los
> ~34px que ocupa el indicador.

> **Los dos componentes usan `ViewEncapsulation.None`**, y no es un descuido:
> `::backdrop` no es descendiente del componente, así que la encapsulación
> emulada de Angular reescribe el selector a algo que nunca matchea. Es la única
> forma de estilarlo. Todas las reglas están namespaceadas bajo `.fs-modal` y
> `.fs-drawer` para que no se escape nada.

La animación de salida usa `transition-behavior: allow-discrete` con
`@starting-style`. Un `<dialog>` togglea `display`, así que sin eso solo se podría
animar la entrada.

---

### `<fs-slider>`

Control de rango. Implementa `ControlValueAccessor`; el valor es un `number`.

```html
<fs-slider label="Volumen" unit="%" [(ngModel)]="volumen"></fs-slider>

<!-- Con marcas y límites -->
<fs-slider label="Nivel" [min]="1" [max]="5" [ticks]="true" [showBounds]="true" [(ngModel)]="nivel"></fs-slider>

<!-- Formato propio -->
<fs-slider label="Presupuesto" [min]="0" [max]="100000" [step]="1000" [formatValue]="money" [(ngModel)]="monto"></fs-slider>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` | `string` | `''` | |
| `min` / `max` | `number` | `0` / `100` | Límites |
| `step` | `number` | `1` | Incremento |
| `unit` | `string` | `''` | Se agrega al valor mostrado |
| `valuePosition` | `'right' \| 'top' \| 'none'` | `'right'` | Dónde va el valor |
| `showBounds` | `boolean` | `false` | Imprime min y max bajo la barra |
| `ticks` | `boolean \| number` | `false` | `true` = una por paso · número = esa cantidad |
| `formatValue` | `(v: number) => string` | — | Formatea el valor mostrado |
| `disabled` | `boolean` | `false` | |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | |
| `errorMessage` / `successMessage` | `string` | `''` | |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<number>` | Emite el valor |

**CSS custom properties:**

```css
fs-slider {
  --fs-slider-track:      var(--fs-color-surface-alt);
  --fs-slider-thumb:      #ffffff;
  --fs-slider-thumb-size: 20px;
  --fs-slider-height:     7px;
}
```

> El knob es claro en los dos temas a propósito: se lee como un control físico, y
> uno del color de la superficie desaparecería sobre la barra en dark.

**Las marcas se omiten cuando quedarían a menos de 3% de distancia.** Con `step: 1`
sobre 0–100 serían 101 marcas y se leerían como una barra sólida, así que no se
dibujan. Y con `min === max` —que pasa mientras un formulario carga sus límites—
el porcentaje se guarda en 0 en vez de dar `NaN` y romper el gradiente.

---

### `<fs-rating>`

Puntuación con estrellas. Implementa `ControlValueAccessor`; el valor es un
`number`.

```html
<fs-rating label="¿Cómo estuvo?" [(ngModel)]="puntaje"></fs-rating>

<!-- Mostrar un promedio -->
<fs-rating [readonly]="true" [showValue]="true" [ngModel]="4.2"></fs-rating>

<!-- Corazones, 10 puntos -->
<fs-rating icon="heart" [count]="10" [(ngModel)]="puntaje"></fs-rating>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` | `string` | `''` | |
| `count` | `number` | `5` | Cantidad de glifos, acotado a 1–20 |
| `icon` | `'star' \| 'heart' \| string` | `'star'` | Los dos primeros vienen incluidos; cualquier otro string se toma como URL |
| `allowClear` | `boolean` | `true` | Clickear el valor actual lo borra |
| `readonly` | `boolean` | `false` | Solo lectura, y admite fracciones |
| `showValue` | `boolean` | `false` | Imprime el número al lado |
| `formatValue` | `(v: number) => string` | — | Formatea ese número |
| `disabled` | `boolean` | `false` | |
| `state` | `'default' \| 'error'` | `'default'` | |
| `errorMessage` | `string` | `''` | |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<number>` | Emite el valor |

**CSS custom properties:**

```css
fs-rating {
  --fs-rating-color: #f5a623;
  --fs-rating-empty: var(--fs-color-border-strong);
  --fs-rating-size:  26px;
  --fs-rating-gap:   3px;
}
```

> El color es un ámbar con nombre, no un token semántico: esto es una puntuación,
> no una advertencia, y mapearlo a `--fs-color-warning` lo arrastraría cada vez
> que cambie ese tono. Se pisa con `--fs-rating-color`.

**`readonly` acepta fracciones**, que es el caso más común de un rating: mostrar un
promedio de 4.2. La capa de relleno se recorta a un porcentaje, así que un glifo
parcial sale sin un segundo camino de render. En ese modo no hay botones ni tab
stop — es un `role="img"`.

**Es un solo tab stop.** Las flechas mueven el valor, no el foco; `Inicio` y `Fin`
van a los extremos y `Supr` borra. Un botón tabulable por estrella significaría
cinco tabs para pasar un control.

---

### `<fs-number-input>`

Campo numérico con stepper. Implementa `ControlValueAccessor`. El valor del
modelo es un `number`, o `null` cuando está vacío.

```html
<fs-number-input label="Cantidad" [min]="1" [max]="99" [(ngModel)]="cantidad"></fs-number-input>

<!-- Con prefijo o sufijo -->
<fs-number-input label="Precio" prefix="$" [step]="100" [(ngModel)]="precio"></fs-number-input>
<fs-number-input label="Peso" suffix="kg" [step]="0.5" [(ngModel)]="peso"></fs-number-input>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` / `placeholder` | `string` | `''` | Etiqueta, ayuda y placeholder |
| `min` / `max` | `number` | — | Límites. Sin ellos no hay tope |
| `step` | `number` | `1` | Incremento de los botones y las flechas |
| `prefix` / `suffix` | `string` | `''` | Texto pegado al número — símbolo o unidad |
| `allowEmpty` | `boolean` | `true` | Si es `false`, al salir vacío vuelve a `min` |
| `disabled` / `readonly` | `boolean` | `false` | |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | Estado de validación |
| `errorMessage` / `successMessage` | `string` | `''` | Mensajes |
| `decrementLabel` / `incrementLabel` | `string` | `'Disminuir'` / `'Aumentar'` | `aria-label` de los botones |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<number \| null>` | Emite el valor |

**Decimales sin drift.** El resultado se redondea a la precisión del `step`, así
que diez pasos de `0.1` dan `1` y no `0.9999999999999999`.

**Se puede vaciar.** Mientras tipeás, una entrada a medio escribir (`-`, `0.`)
no se toca; el valor se acota y redondea al salir del campo. Los botones se
deshabilitan solos en los límites, y `PageUp` / `PageDown` mueven diez pasos.

| Custom property | Default |
|---|---|
| `--fs-number-input-radius` | `var(--fs-radius-md)` |

---

### `<fs-textarea>`

Área de texto con la misma API de etiquetas y estados que `<fs-input>`.
Implementa `ControlValueAccessor`.

```html
<fs-textarea
  label="Comentario"
  placeholder="Contanos qué te pareció…"
  [rows]="3"
  [(ngModel)]="comentario"
></fs-textarea>

<!-- Con contador -->
<fs-textarea label="Bio" [maxlength]="160" [(ngModel)]="bio"></fs-textarea>

<!-- Crece con el contenido -->
<fs-textarea label="Notas" resize="auto" [(ngModel)]="notas"></fs-textarea>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` / `hint` / `placeholder` | `string` | `''` | |
| `rows` | `number` | `3` | Altura inicial |
| `maxlength` | `number` | — | Tope de caracteres. Activa el contador |
| `showCounter` | `boolean` | `false` | Muestra el contador sin tope |
| `resize` | `'vertical' \| 'none' \| 'auto'` | `'vertical'` | `auto` sigue al contenido y desactiva el arrastre |
| `disabled` / `readonly` | `boolean` | `false` | |
| `state` | `'default' \| 'error' \| 'success'` | `'default'` | |
| `errorMessage` / `successMessage` | `string` | `''` | |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<string>` | Emite el texto |

El contador pasa a color de advertencia al llegar al 90% del límite. El pie
comparte una línea entre el mensaje y el contador, así que un hint largo y la
cuenta no se pelean por el espacio.

| Custom property | Default |
|---|---|
| `--fs-textarea-radius` | `var(--fs-radius-md)` |

---

### `<fs-file-upload>`

Dropzone con lista de archivos. Implementa `ControlValueAccessor`, y **el valor
del modelo son objetos `File` reales** — no metadata — así que el formulario los
puede subir.

```html
<fs-file-upload label="Adjuntos" [(ngModel)]="archivos"></fs-file-upload>

<!-- Un solo archivo, solo imágenes -->
<fs-file-upload
  label="Foto de perfil"
  accept="image/*"
  [multiple]="false"
></fs-file-upload>

<!-- Con validación -->
<fs-file-upload
  label="Comprobantes"
  accept=".pdf"
  [maxSize]="10485760"
  [maxFiles]="3"
  (rejected)="onRechazados($event)"
></fs-file-upload>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta |
| `accept` | `string` | `''` | Igual que el input nativo: `.pdf,image/*` |
| `multiple` | `boolean` | `true` | Con `false` cada archivo reemplaza al anterior |
| `maxSize` | `number` | `0` | Tope por archivo en bytes. `0` = sin tope |
| `maxFiles` | `number` | `0` | Cantidad máxima. `0` = sin tope |
| `hint` / `title` / `subtitle` | `string` | ver defaults | Textos de la dropzone |
| `removeLabel` | `string` | `'Quitar'` | Prefijo del `aria-label` de borrar |
| `disabled` | `boolean` | `false` | |
| `state` | `'default' \| 'error'` | `'default'` | |
| `errorMessage` | `string` | `''` | Mensaje de error |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<File[]>` | Emite los archivos en cola |
| `rejected` | `EventEmitter<FsFileRejection[]>` | Los que se rechazaron, con el motivo |

`FsFileRejection` trae `{ file, reason: 'type' \| 'size' \| 'count', message }`.
Los rechazos también se muestran inline debajo de la dropzone.

> **`accept` se valida en el drop, no solo en el input.** El atributo nativo no
> se aplica al drag & drop, así que sin esa validación un archivo arrastrado de
> cualquier tipo entraría igual. Se soportan extensión (`.pdf`), MIME exacto
> (`application/pdf`) y wildcard (`image/*`).
>
> La dropzone es un `<button>`, así que `Enter` y `Espacio` abren el selector. El
> resaltado al arrastrar cuenta `dragenter` menos `dragleave`: un booleano simple
> parpadea al pasar el puntero sobre el ícono o el texto.

| Custom property | Default | |
|---|---|---|
| `--fs-file-upload-radius` | `calc(var(--fs-radius-lg) + 4px)` | Dropzone |
| `--fs-file-upload-row-radius` | `var(--fs-radius-md)` | Cada archivo listado |

---

### Selección — `<fs-checkbox>`, `<fs-radio-group>`, `<fs-switch>`, `<fs-segmented>`

Todos implementan `ControlValueAccessor`.

#### `<fs-checkbox>`

```html
<fs-checkbox
  label="Acepto los términos"
  description="He leído y acepto los términos de uso."
  [(ngModel)]="accepted"
></fs-checkbox>

<!-- Indeterminate -->
<fs-checkbox label="Seleccionar todo" [indeterminate]="true"></fs-checkbox>

<!-- Error -->
<fs-checkbox
  label="Acepto los términos"
  state="error"
  errorMessage="Debes aceptar los términos para continuar."
  [(ngModel)]="accepted"
></fs-checkbox>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta del checkbox |
| `description` | `string` | `''` | Descripción secundaria |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `indeterminate` | `boolean` | `false` | Estado indeterminado (ej: "seleccionar todo" parcial) |
| `state` | `'default' \| 'error'` | `'default'` | Estado de validación |
| `errorMessage` | `string` | `''` | Mensaje de error |

#### `<fs-radio-group>`

```typescript
import { FsRadioGroupComponent, FsRadioOption } from '@heroelc/fsociety';

plans: FsRadioOption[] = [
  { value: 'free',  label: 'Gratuito', description: 'Hasta 3 proyectos, 500 MB.' },
  { value: 'pro',   label: 'Pro',      description: 'Proyectos ilimitados, 50 GB.' },
  { value: 'team',  label: 'Equipo',   description: 'Todo Pro + colaboración.' },
];
```

```html
<fs-radio-group
  label="Plan"
  description="Elegí el plan que mejor se adapte."
  [options]="plans"
  [(ngModel)]="selectedPlan"
></fs-radio-group>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `FsRadioOption[]` | `[]` | Array `{ value, label, description? }` |
| `label` | `string` | `''` | Título del grupo |
| `description` | `string` | `''` | Descripción del grupo |
| `disabled` | `boolean` | `false` | Deshabilita todas las opciones |
| `state` | `'default' \| 'error'` | `'default'` | Estado de validación |
| `errorMessage` | `string` | `''` | Mensaje de error |

#### `<fs-switch>`

```html
<fs-switch
  label="Modo oscuro"
  description="Reduce el brillo para ambientes con poca luz."
  [(ngModel)]="darkMode"
></fs-switch>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta del toggle |
| `description` | `string` | `''` | Descripción secundaria |
| `disabled` | `boolean` | `false` | Estado deshabilitado |

#### `<fs-segmented>`

```typescript
import { FsSegmentedComponent, FsSegmentOption } from '@heroelc/fsociety';

views: FsSegmentOption[] = [
  { value: 'list',  label: 'Lista',      icon: 'https://api.iconify.design/tabler:list.svg' },
  { value: 'grid',  label: 'Cuadrícula', icon: 'https://api.iconify.design/tabler:layout-grid.svg' },
  { value: 'table', label: 'Tabla',      icon: 'https://api.iconify.design/tabler:table.svg' },
];
```

```html
<fs-segmented
  label="Vista"
  [options]="views"
  [(ngModel)]="activeView"
></fs-segmented>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `FsSegmentOption[]` | `[]` | Array `{ value, label, icon? }` |
| `label` | `string` | `''` | Etiqueta visible encima del control |
| `disabled` | `boolean` | `false` | Deshabilita toda la selección |

| Output | Tipo | Descripción |
|---|---|---|
| `valueChange` | `EventEmitter<string>` | El valor elegido, para quien no usa formularios |

`fs-segmented` implementa `ControlValueAccessor`, así que dentro de un formulario
alcanza con `[(ngModel)]` o `formControlName`. `valueChange` es para el caso
suelto, sin `FormControl` alrededor solo para poder escuchar.

| Custom property | Default | |
|---|---|---|
| `--fs-segmented-radius` | `var(--fs-radius-md)` | Track de `<fs-segmented>` |
| `--fs-segmented-item-radius` | `calc(var(--fs-segmented-radius) - 3px)` | Segmento interior |

---

### `FsToastService` + `<fs-toast-stack>`

Notificaciones efímeras apiladas en la esquina inferior derecha. El servicio es `providedIn: 'root'` — no requiere configuración adicional.

**Setup:** montá `<fs-toast-stack>` una sola vez en la raíz de tu app.

```typescript
// app.component.ts
import { FsToastStackComponent } from '@heroelc/fsociety';

@Component({
  standalone: true,
  imports: [FsToastStackComponent],
  template: `
    <router-outlet></router-outlet>
    <fs-toast-stack></fs-toast-stack>
  `,
})
export class AppComponent {}
```

```typescript
// cualquier componente
import { FsToastService } from '@heroelc/fsociety';

@Component({ ... })
export class MyComponent {
  private toasts = inject(FsToastService);

  save(): void {
    this.toasts.push({
      tone: 'success',
      title: 'Guardado',
      text: 'Tus cambios se guardaron correctamente.',
    });
  }

  fail(): void {
    this.toasts.push({ tone: 'danger', title: 'Error de red', duration: 6000 });
  }
}
```

**`FsToastService.push(options)`**

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Tono semántico — determina color del ícono |
| `title` | `string` | — | Título en negrita |
| `text` | `string` | — | Texto descriptivo secundario |
| `duration` | `number` | `4200` | Auto-cierre en ms |

Devuelve el `id: string` del toast creado.

**`FsToastService.remove(id)`** — cierra un toast manualmente.

---

### `<fs-tooltip>`

Etiqueta flotante que aparece al hacer hover o al enfocar con el teclado, y se
cierra con `Escape`.

Se renderiza en el **top layer** del navegador, así que no la recorta ningún
ancestro con `overflow`, `transform` o `contain` — el caso típico es un tooltip
dentro de una card o de un área con scroll.

```html
<fs-tooltip label="Guardar cambios">
  <fs-button variant="primary">Guardar</fs-button>
</fs-tooltip>

<fs-tooltip label="Aparece abajo" side="bottom">
  <button>Info</button>
</fs-tooltip>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Texto del tooltip |
| `side` | `'top' \| 'bottom'` | `'top'` | Posición relativa al trigger |

> Usa alto contraste: fondo = `--fs-color-text-primary`, texto = `--fs-color-bg`. Se invierte automáticamente en dark mode.

---

### `<fs-hint>` y `<fs-field>`

Texto de apoyo bajo campos de formulario. `<fs-field>` es un wrapper con label y prioridad de mensajes (error > success > hint).

```html
<!-- fs-hint directo -->
<fs-hint tone="default">Usá entre 8 y 32 caracteres.</fs-hint>
<fs-hint tone="error">La contraseña es demasiado corta.</fs-hint>
<fs-hint tone="success">Contraseña segura.</fs-hint>
<fs-hint tone="warning">Esta cuenta ya existe.</fs-hint>

<!-- fs-field wrapper (recomendado con controles del kit) -->
<fs-field label="Correo electrónico" hint="Usá tu correo de trabajo.">
  <fs-input type="email" placeholder="tu@empresa.com" [(ngModel)]="email"></fs-input>
</fs-field>

<fs-field label="Contraseña" [required]="true" error="Contraseña demasiado corta.">
  <fs-input type="password" [(ngModel)]="pass"></fs-input>
</fs-field>

<fs-field label="Nombre" [optional]="true" success="Nombre disponible.">
  <fs-input placeholder="Ada Lovelace" [(ngModel)]="nombre"></fs-input>
</fs-field>
```

**`<fs-hint>` inputs:**

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Tono semántico |
| `icon` | `boolean \| string \| undefined` | `undefined` | `undefined` = auto (solo tono no-default) · `false` = sin ícono · `true` = forzar ícono · `string` = URL custom |

**`<fs-field>` inputs:**

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta del campo |
| `htmlFor` | `string` | `''` | `for` del label (vincula con el id del input nativo) |
| `required` | `boolean` | `false` | Muestra `*` en rojo |
| `optional` | `boolean` | `false` | Muestra "opcional" tenue |
| `hint` | `string` | `''` | Texto de ayuda (solo visible si no hay error ni success) |
| `error` | `string` | `''` | Mensaje de error — tiene prioridad máxima |
| `success` | `string` | `''` | Mensaje de éxito — prioridad media |

---

### `<fs-multi-select>`

Dropdown de selección múltiple con chips removibles, buscador y checkboxes. Implementa `ControlValueAccessor`.

```typescript
import { FsMultiSelectComponent, FsMultiSelectOption } from '@heroelc/fsociety';

options: FsMultiSelectOption[] = [
  { value: 'angular',    label: 'Angular' },
  { value: 'react',      label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
];
```

```html
<fs-multi-select
  placeholder="Seleccionar tecnologías..."
  [options]="options"
  [(ngModel)]="selected"
></fs-multi-select>

<!-- Con límite y sin buscador -->
<fs-multi-select
  [options]="options"
  [max]="3"
  [searchable]="false"
  [(ngModel)]="selected"
></fs-multi-select>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `FsMultiSelectOption[]` | `[]` | Array de `{ value, label }` |
| `placeholder` | `string` | `'Seleccionar...'` | Texto cuando no hay selección |
| `iconLeft` | `string` | `''` | URL ícono izquierdo (Iconify CDN) |
| `searchable` | `boolean` | `true` | Muestra buscador dentro del menú |
| `max` | `number` | `0` | Límite de selecciones (0 = sin límite) |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `emptyText` | `string` | `'Sin resultados'` | Texto cuando no hay coincidencias |

| Custom property | Default | |
|---|---|---|
| `--fs-multi-select-radius` | `var(--fs-radius-md)` | Trigger |
| `--fs-multi-select-menu-radius` | `var(--fs-radius-lg)` | Menú desplegable |

---

### `<fs-steps>`

Indicador de progreso multi-paso. Puramente presentacional — el padre controla `current`.

```typescript
import { FsStepsComponent, FsStep } from '@heroelc/fsociety';

steps: FsStep[] = [
  { label: 'Cuenta',  desc: 'Datos básicos' },
  { label: 'Perfil',  desc: 'Tu información' },
  { label: 'Plan',    desc: 'Elige y paga' },
  { label: 'Listo',   desc: 'Confirmación' },
];
current = 2;
```

```html
<fs-steps [steps]="steps" [current]="current"></fs-steps>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `FsStep[]` | `[]` | Array de `{ label, desc? }` |
| `current` | `number` | `0` | Índice (0-based) del paso activo |

- `i < current` → **completado** (check + fondo tenue)
- `i === current` → **activo** (número + fondo primario)
- `i > current` → **pendiente** (número + gris)

---

### `<fs-accordion>`

Paneles colapsables. Uno abierto por vez, o varios con `multiple`.

```typescript
items: FsAccordionItem[] = [
  { id: 'cancel', title: '¿Cómo cancelo?', content: 'Desde Ajustes → Facturación.' },
  { id: 'plan',   title: '¿Puedo cambiar de plan?', content: 'Sí, se prorratea.' },
];

abiertos = ['cancel'];
```

```html
<fs-accordion [items]="items" [(open)]="abiertos"></fs-accordion>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `FsAccordionItem[]` | `[]` | `{ id, title, content?, disabled? }` |
| `multiple` | `boolean` | `false` | Permite más de un panel abierto |
| `open` | `string[]` | `[]` | Ids abiertos. Two-way: `[(open)]` |

| Output | Tipo | Descripción |
|---|---|---|
| `openChange` | `EventEmitter<string[]>` | Para el two-way binding |
| `itemToggle` | `EventEmitter<FsAccordionToggle>` | `{ item, open }` del que cambió |

`content` acepta un `string` o un `TemplateRef`, así que un panel que necesita
markup real no obliga a armar otro componente:

```html
<ng-template #factura>
  <p>El próximo cobro es el 12 de septiembre.</p>
  <fs-button variant="outline" size="sm" label="Ver factura"></fs-button>
</ng-template>

<fs-accordion [items]="[{ id: 'f', title: 'Facturación', content: factura }]"></fs-accordion>
```

| Custom property | Default |
|---|---|
| `--fs-accordion-bg` | `var(--fs-color-surface)` |
| `--fs-accordion-border` | `var(--fs-color-border)` |
| `--fs-accordion-radius` | `var(--fs-radius-lg)` |
| `--fs-accordion-hover-bg` | `var(--fs-color-surface-alt)` |
| `--fs-accordion-accent` | `var(--fs-color-primary)` |
| `--fs-accordion-pad-x` / `-pad-y` | `18px` / `15px` |

> La animación de altura es `grid-template-rows: 0fr → 1fr`. Llega a la altura
> real del contenido sin medir nada en JS y sin un `max-height` inventado que
> recorte los paneles largos.
>
> El panel cerrado **sigue renderizado** — el track mide cero, no es
> `display: none` — así que lleva `inert` para quedar fuera del orden de tabulado.
> Sin eso, tabulando se cae adentro de un panel que no se ve.

---

### `<fs-divider>`

Separador sólido o punteado, con etiqueta opcional, y variante vertical.

```html
<fs-divider></fs-divider>
<fs-divider variant="dashed"></fs-divider>
<fs-divider label="o continuá con"></fs-divider>
<fs-divider [icon]="iconoSparkle" label="Nuevo"></fs-divider>
<fs-divider label="Agosto 2026" align="left"></fs-divider>

<div style="display:flex; align-items:center; gap:14px">
  <span>Editar</span>
  <fs-divider orientation="vertical"></fs-divider>
  <span>Duplicar</span>
</div>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Eje |
| `variant` | `'solid' \| 'dashed'` | `'solid'` | Tipo de línea |
| `label` | `string` | `''` | Texto centrado en la línea |
| `icon` | `string` | — | URL del ícono, antes del label |
| `align` | `'center' \| 'left' \| 'right'` | `'center'` | Posición del label |

| Custom property | Default |
|---|---|
| `--fs-divider-color` | `var(--fs-color-border)` |
| `--fs-divider-dash-color` | `var(--fs-color-border-strong)` |
| `--fs-divider-label-color` | `var(--fs-color-text-placeholder)` |
| `--fs-divider-gap` | `12px` |
| `--fs-divider-inset` | `28px` (lado corto cuando `align` no es `center`) |

> El estilo vive en el **host**, no en un wrapper interno. El separador vertical
> toma la altura de la fila con `align-self: stretch`, y `stretch` solo aplica al
> hijo flex en sí: un elemento en el medio lo rompe. Necesita un contenedor flex.
>
> Una línea punteada no puede ser un `background`, así que esas variantes colapsan
> la caja a cero en un eje y dibujan la línea con un `border`.

---

### Cards — `<fs-card>`, `<fs-row-card>`, `<fs-stat-card>`

Tres formas distintas, no una con un flag de layout: la vertical tiene media y
pie, la horizontal tiene una acción inline, y la de métrica es un número.

#### `<fs-card>`

```html
<fs-card [icon]="iconoSparkle" title="Plan Pro" subtitle="Para equipos en crecimiento">
  <div cardMedia><img src="portada.jpg" alt=""></div>

  Incluye asientos ilimitados, soporte prioritario y reportes avanzados.

  <fs-button cardFooter variant="primary" size="sm" label="Elegir plan" [fullWidth]="true"></fs-button>
</fs-card>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `icon` | `string` | — | URL del ícono del header |
| `title` | `string` | `''` | Título |
| `subtitle` | `string` | `''` | Bajada |
| `tone` | `'success' \| 'danger' \| 'warning' \| 'info'` | — | Tiñe el borde y agrega el glifo de estado |
| `interactive` | `boolean` | `false` | Señal visual de hover |

| Slot | Selector | Descripción |
|---|---|---|
| Media | `[cardMedia]` | Imagen o degradé arriba, en 16/9 |
| Default | — | Cuerpo |
| Footer | `[cardFooter]` | Acciones. Igual que el modal: el atributo va en cada botón |

#### `<fs-row-card>`

```html
<fs-row-card tone="success" title="Dominio verificado" subtitle="app.acme-corp.com">
  <fs-badge cardAction color="success" label="Activo" [dot]="true"></fs-badge>
</fs-row-card>
```

Mismos `icon`, `title`, `subtitle` y `tone`. El slot de la acción es `[cardAction]`.
Con `tone`, el glifo de estado pisa al `icon`: una fila de estado se lee como estado.

#### `<fs-stat-card>`

```html
<fs-stat-card label="Ingresos (MRR)" value="$12,480" delta="+8.2%" deltaTone="success"></fs-stat-card>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Nombre de la métrica |
| `value` | `string \| number` | `''` | Ya formateado — moneda y separadores son tuyos |
| `delta` | `string` | `''` | Pill de variación. Vacío, no se muestra |
| `deltaTone` | `'success' \| 'danger' \| 'neutral'` | `'success'` | Si esa variación es buena o mala |
| `icon` | `string` | — | URL del ícono, al lado del label |

> `deltaTone` **no** se deduce del signo, y es a propósito: un churn que sube es
> `+0.4%` y sigue siendo malo. El tono lo decide quien conoce la métrica.

> Los tintes de estado salen de un `color-mix` contra el borde y la superficie —
> el mismo enfoque que `fs-alert` — en vez de un color claro fijo. Un tinte
> hardcodeado se lava en dark.
>
> `interactive` es solo el hover y **no** hace la card operable. Una card con un
> botón en el pie no puede ser ella misma un botón: eso es anidar controles. Si
> toda la card tiene que ser clickeable, el elemento interactivo lo ponés vos.

---

### Carga — `<fs-skeleton>`, `<fs-spinner>`, `<fs-progress>`

Tres formas de mostrar que algo está pasando, según cuánto sepas del trabajo:
**skeleton** cuando conocés la forma de lo que va a llegar, **spinner** cuando
no sabés cuánto falta, **progress** cuando sí.

#### `<fs-skeleton>`

Placeholder con la silueta del contenido real.

```html
<fs-skeleton variant="text" [lines]="3"></fs-skeleton>
<fs-skeleton variant="circle" size="48px"></fs-skeleton>
<fs-skeleton variant="rect" height="180px" radius="12px"></fs-skeleton>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `'text' \| 'circle' \| 'rect'` | `'text'` | `text` toma la altura del font size heredado |
| `lines` | `number` | `1` | Cantidad de barras. Solo en `text` |
| `width` | `string` | — | Cualquier longitud CSS |
| `height` | `string` | — | Solo tiene sentido en `rect` |
| `size` | `string` | — | Diámetro del `circle` |
| `radius` | `string` | — | Pisa `--fs-skeleton-radius` |
| `animation` | `'shimmer' \| 'pulse' \| 'none'` | `'shimmer'` | Reduced-motion siempre gana y cae a `none` |
| `lastLineWidth` | `string` | `'65%'` | Última línea corta. Solo con más de una |

| Custom property | Default |
|---|---|
| `--fs-skeleton-bg` | `var(--fs-color-border)` |
| `--fs-skeleton-highlight` | mezcla de `bg` y `surface` |
| `--fs-skeleton-radius` | `var(--fs-radius-sm)` |
| `--fs-skeleton-duration` | `1.4s` |
| `--fs-skeleton-text-height` / `-gap` | `0.72em` / `0.55em` |
| `--fs-skeleton-size` / `-rect-height` | `38px` / `88px` |

> **El skeleton es `aria-hidden`.** Un placeholder no tiene nada que anunciar.
> El estado de carga es del contenedor que es dueño de los datos, y se comunica
> con `aria-busy` — si no, cada barra aparece como ruido en el árbol de
> accesibilidad.
>
> `variant="text"` saca la altura del font size heredado, así que la barra
> queda alineada con el texto que va a reemplazar sin que le pases medidas.

#### `<fs-spinner>`

```html
<fs-spinner size="md" label="Cargando resultados"></fs-spinner>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `12px` / `16px` / `24px` |
| `label` | `string` | `''` | Nombre accesible. Vacío = decorativo |

| Custom property | Default |
|---|---|
| `--fs-spinner-size` | `16px` |
| `--fs-spinner-duration` | `0.7s` |

> **Sin `label` el spinner es `aria-hidden`, con `label` es un `role="status"`.**
> Una live region que nunca dice nada es peor que ninguna. Dejalo vacío cuando
> está adentro de un control que ya describe la espera — un `fs-button` en
> loading, por ejemplo, que ya lleva `aria-busy`.
>
> Para cualquier tamaño fuera de los tres pasos, usá `--fs-spinner-size`.

#### `<fs-progress>`

```html
<fs-progress [value]="subido" [max]="total" label="Subiendo" [showValue]="true"></fs-progress>
<fs-progress [indeterminate]="true" label="Procesando"></fs-progress>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | `0` | Se clampea a `0…max` antes de llegar al DOM |
| `max` | `number` | `100` | |
| `indeterminate` | `boolean` | `false` | Trabajo de duración desconocida: la barra loopea |
| `label` | `string` | `''` | Se muestra arriba y es el nombre accesible |
| `showValue` | `boolean` | `false` | Agrega el porcentaje. Se ignora en indeterminate |
| `tone` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'primary'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |

| Custom property | Default |
|---|---|
| `--fs-progress-track` | `var(--fs-color-surface-alt)` |
| `--fs-progress-fill` | `var(--fs-color-primary)` |
| `--fs-progress-height` | `8px` |
| `--fs-progress-radius` | `var(--fs-radius-full)` |
| `--fs-progress-gap` | `7px` |
| `--fs-progress-duration` | `1.3s` |

> **En indeterminate no se emiten `aria-valuenow`, `-valuemin` ni `-valuemax`.**
> Un `progressbar` sin valores es exactamente cómo se declara que el progreso
> es desconocido. Mandar un `0` sería mentir: un lector de pantalla lo lee como
> "0 por ciento", que es un dato, no una ausencia de dato.

---

### `<fs-carousel>`

Carrusel horizontal montado sobre **scroll-snap nativo**. El gesto, el momentum
y el enganche son del navegador: no hay un solo handler de drag en el
componente.

```html
<fs-carousel [count]="fotos.length" label="Fotos del lugar" [startAt]="0">
  <ng-template fsCarouselSlide let-i let-shouldLoad="shouldLoad">
    @if (shouldLoad) {
      <img [src]="fotos[i].url" [alt]="fotos[i].alt" />
    }
  </ng-template>
</fs-carousel>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `count` | `number` | `0` | Cuántas veces se estampa el template |
| `label` | `string` | `''` | Nombre accesible del grupo |
| `startAt` | `number` | `0` | Slide inicial. Se lee **una sola vez** |
| `preloadRadius` | `number` | `1` | Cuántas slides a cada lado reportan `shouldLoad` |
| `corners` | `FsCarouselCorners` | `'all'` | Qué esquinas redondear |

| Output | Tipo | Descripción |
|---|---|---|
| `tapped` | `EventEmitter<void>` | Un toque que **no** fue swipe |

El `<ng-template fsCarouselSlide>` recibe un contexto tipado — `FsCarouselSlideContext`:

| Variable | Tipo | Descripción |
|---|---|---|
| `$implicit` | `number` | Índice de la slide. `let-i` |
| `shouldLoad` | `boolean` | `true` si la slide está dentro del `preloadRadius` |

La librería no sabe qué es una imagen. Dice **cuándo** llegó el momento; qué
hacer con eso lo decidís vos: un `<img>`, un `<video>`, un iframe, o nada.

| Custom property | Default |
|---|---|
| `--fs-carousel-radius` | `var(--fs-radius-lg)` — acepta el shorthand de 4 valores |
| `--fs-carousel-slide-width` | `100%` |
| `--fs-carousel-gap` | `0px` |
| `--fs-carousel-arrow-size` | `28px` |
| `--fs-carousel-dot` / `-dot-active` | `6px` / `14px` |
| `--fs-carousel-dot-target` | `16px` |
| `--fs-carousel-dot-hit-inline` / `-hit-block` | `24px` / `24px` |

Bajar `--fs-carousel-slide-width` deja asomar la siguiente. El índice se calcula
contra la caja real de cada slide, así que anchos parciales y `gap` no lo rompen:

```html
<fs-carousel [count]="6" label="Galería"
             style="--fs-carousel-slide-width: 78%; --fs-carousel-gap: 12px">
```

`corners` es `'all' \| 'none' \| 'top' \| 'bottom' \| 'start' \| 'end'`. Sirve para
apoyar el carrusel contra otra cosa sin que quede una esquina redonda adentro de
otra — el caso típico es arriba de una card:

```html
<fs-card title="Departamento en Palermo">
  <div cardMedia>
    <fs-carousel [count]="fotos.length" label="Fotos" corners="top">
      <ng-template fsCarouselSlide let-i>…</ng-template>
    </fs-carousel>
  </div>
</fs-card>
```

> **`start` y `end` son lógicas**, no `left`/`right`: siguen la dirección de
> escritura, así que en RTL se dan vuelta solas.
>
> Para una combinación que no esté en la lista, `--fs-carousel-radius` acepta el
> shorthand entero de `border-radius` — los cuatro valores, arrancando arriba a
> la izquierda y siguiendo el reloj. Eso vale con `corners="all"`; los otros
> valores apagan esquinas puntuales con longhands y pisarían el shorthand.

> **`startAt` posiciona un carrusel que se está creando, no maneja uno que ya
> existe.** Se lee en el primer render, contra el ancho real del track, y nunca
> más. Desde el primer frame el scroll es del usuario, y pisárselo después
> sería arrancarle el gesto de la mano.

> **`touch-action` tiene que dejar pasar el paneo horizontal.** El stylesheet
> declara `pan-x pan-y pinch-zoom`. Si alguien lo baja a `pan-y`, el navegador
> deja de scrollear el track de costado y manda los gestos horizontales a la
> aplicación como pointer events — pero acá el swipe **es** scroll nativo, no
> hay ningún handler esperándolos. Nadie los consume y el carrusel se queda
> quieto en touch. Está comentado en el SCSS por la misma razón.

> **`tapped` contra el swipe.** En touch la discriminación la hace el propio
> navegador: cuando se queda con el gesto para scrollear dispara
> `pointercancel` y el `pointerup` nunca llega, así que no hay tap. El umbral
> de 8px que mide el recorrido es el respaldo para el drag con mouse, donde ese
> traspaso no existe.

> **Targets táctiles.** Las flechas se ocultan bajo `@media (hover: none)` —
> miden 28px y no hay hover que las revele — así que en touch los puntitos son
> el único control discreto. El pip sigue midiendo 6px, pero el área de impacto
> crece a **24px de ancho y 44px de alto** en punteros gruesos. Los 24 son la
> línea de WCAG 2.2 SC 2.5.8 (nivel AA); los 44×44 son AAA, y no entran: ocho
> puntos a 44px son 352px, más ancho que un teléfono de 360, y el strip de
> puntitos terminaría scrolleando. El ancho sostiene la línea AA porque compite
> por espacio; el alto se toma los 44 porque es gratis.

---

### `<fs-breadcrumbs>`

Ruta de navegación. Cada item puede ser solo texto, texto con ícono o solo
ícono, y cada uno decide por su cuenta si es link o no.

```typescript
import { FsBreadcrumbsComponent, FsBreadcrumb } from '@heroelc/fsociety';

const CDN = 'https://api.iconify.design';

ruta: FsBreadcrumb[] = [
  { label: 'Inicio', icon: `${CDN}/tabler:home.svg`, iconOnly: true, href: '/' },
  { label: 'Equipo', icon: `${CDN}/tabler:users.svg`, href: '/equipo' },
  { label: 'Archivados' },
  { label: 'Contrato.pdf' },
];
```

```html
<fs-breadcrumbs [items]="ruta" (navigate)="ir($event)"></fs-breadcrumbs>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `FsBreadcrumb[]` | `[]` | La ruta, de la raíz a la página actual |
| `label` | `string` | `'Ruta de navegación'` | Nombre accesible del `<nav>` |
| `separator` | `string` | chevron de Tabler | URL del ícono separador |

| Output | Tipo | Descripción |
|---|---|---|
| `navigate` | `EventEmitter<FsBreadcrumbNavigation>` | `{ item, index, event }` del item clickeado |

`FsBreadcrumb`:

| Campo | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Texto del item. **Siempre obligatorio** |
| `icon` | `string?` | URL completa del ícono |
| `iconOnly` | `boolean?` | Esconde el texto. Se ignora si no hay `icon` |
| `href` | `string?` | Lo convierte en link. Sin esto, es texto plano |

Las cuatro combinaciones:

```html
<!-- solo label, con link -->      { label: 'Equipo', href: '/equipo' }
<!-- label + ícono, con link -->   { label: 'Equipo', icon: iconoUsers, href: '/equipo' }
<!-- solo ícono, con link -->      { label: 'Inicio', icon: iconoHome, iconOnly: true, href: '/' }
<!-- sin link -->                  { label: 'Archivados' }
```

| Custom property | Default |
|---|---|
| `--fs-breadcrumbs-gap` | `8px` |
| `--fs-breadcrumbs-size` | `14px` |
| `--fs-breadcrumbs-icon` | `16px` |
| `--fs-breadcrumbs-separator-size` | `14px` |
| `--fs-breadcrumbs-color` / `-color-hover` / `-color-current` | tokens de texto |
| `--fs-breadcrumbs-separator` | `var(--fs-color-border-strong)` |

> **`label` es obligatorio incluso con `iconOnly`.** El ícono se pinta con
> `mask-image` y va `aria-hidden`, así que cuando el texto no está no queda nada
> que anunciar: el label pasa a ser el `aria-label`. Un link sin nombre accesible
> se lee como "link" y nada más, y un breadcrumb de casita es exactamente el caso
> donde eso pasa.

> **El último item nunca es link, ni aunque le pases `href`.** Es la página
> actual — un link a donde ya estás no lleva a ningún lado — y es lo que marca
> `aria-current="page"`. Si necesitás que sea navegable, es porque no es el
> último: agregá el nivel que falta.

> **No usa `RouterLink`.** La librería tiene dos peer dependencies,
> `@angular/common` y `@angular/core`, y sumarle `@angular/router` a todo el
> paquete por un componente sería caro para quien no lo usa. Los items son
> `<a href>` de verdad: andan solos, se abren en pestaña nueva con ctrl+click y
> se pueden copiar. Para routear, interceptá:
>
> ```typescript
> ir({ item, event }: FsBreadcrumbNavigation) {
>   event.preventDefault();
>   this.router.navigateByUrl(item.href!);
> }
> ```

> **La lista wrapea, no scrollea.** Una ruta que no entra sigue siendo legible en
> la segunda línea; un scroller horizontal sin señal de que scrollea, no.
> Colapsar el medio con un `…` es decisión tuya, que sabés qué niveles importan
> — se hace cortando el array antes de pasarlo.

---

### `<fs-experience-card>`

```typescript
experience = {
  company:        'Acme Corp',
  role:           'Senior Frontend Developer',
  startDate:      'mar 2022',
  current:        true,
  logoText:       'ACME',
  bullets: [
    'Desarrollo de interfaces con Angular 17+, migraciones de versiones anteriores.',
    'Configuración de pipelines CI/CD en AWS CodeBuild y ECS.',
    'Implementación de design system con tokens SCSS y componentes standalone.',
  ],
  bulletsPreview: 2,
  badges: [
    { label: 'Angular',     color: 'danger',  imgLeft: 'https://api.iconify.design/simple-icons:angular.svg' },
    { label: 'TypeScript',  color: 'primary', imgLeft: 'https://api.iconify.design/simple-icons:typescript.svg' },
    { label: 'AWS',         customColor: '#ea580c', imgLeft: 'https://api.iconify.design/simple-icons:amazonaws.svg' },
    { label: 'ESLint',      color: 'neutral' },
  ],
};
```

```html
<fs-experience-card
  [experience]="experience"
  variant="full"
  [timeline]="true"
  [timelineLast]="false"
/>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `experience` | `FsExperienceCard` | — | Datos de la experiencia |
| `variant` | `'full' \| 'compact'` | `'full'` | full = con bullets · compact = solo header |
| `timeline` | `boolean` | `false` | Línea y dot de timeline |
| `timelineLast` | `boolean` | `false` | Último item (oculta la línea inferior) |

**CSS custom properties configurables:**

```css
fs-experience-card {
  --fs-exp-radius: 12px; /* 0 para layout full width sin redondeo */
}
```

---

### `<fs-profile-card>`

```html
<fs-profile-card
  name="John Doe"
  handle="johndoe"
  role="Frontend Developer"
  avatarUrl="https://i.pravatar.cc/150?img=8"
  bannerUrl="https://picsum.photos/seed/fsociety/800/200"
  [verified]="true"
  [showActions]="false"
  [links]="links"
  [badges]="badges"
  [stats]="stats"
/>
```

```typescript
links = [
  { label: 'linkedin.com/in/johndoe', url: 'https://linkedin.com/in/johndoe', imgUrl: 'https://api.iconify.design/simple-icons:linkedin.svg', imgAlt: 'LinkedIn' },
  { label: 'github.com/johndoe',      url: 'https://github.com/johndoe',      imgUrl: 'https://api.iconify.design/simple-icons:github.svg',   imgAlt: 'GitHub' },
  { label: 'Buenos Aires, Argentina' },
];
badges = [
  { label: 'Angular',    color: 'danger',  imgLeft: 'https://api.iconify.design/simple-icons:angular.svg' },
  { label: 'TypeScript', color: 'primary', imgLeft: 'https://api.iconify.design/simple-icons:typescript.svg' },
  { label: 'NestJS',     customColor: '#7c3aed', imgLeft: 'https://api.iconify.design/simple-icons:nestjs.svg' },
];
stats = [
  { value: '4+',  label: 'años exp.'  },
  { value: '12',  label: 'proyectos'  },
  { value: '985', label: 'seguidores' },
];
```

las cards. Ver «Redondeo por componente», más abajo.

**CSS custom properties configurables:**

```css
fs-profile-card {
  --fs-profile-radius: 14px; /* 0 para layout full width sin redondeo */
}
```

> **Obtener tu avatarUrl de GitHub:**
> Abrí `https://api.github.com/users/TU_USUARIO`, copiá el campo `id` y usá:
> `https://avatars.githubusercontent.com/u/TU_ID`

---

## `[fsAnchoredPopover]`

La primitiva que usan internamente `fs-select`, `fs-multi-select` y `fs-tooltip`.
Está exportada porque el problema que resuelve aparece en cualquier dropdown
propio.

**El problema:** `position: fixed` no alcanza para escapar de un contenedor.
Cualquier ancestro con `transform`, `filter`, `backdrop-filter`, `contain` o
`will-change` pasa a ser el containing block de sus descendientes fixed, así que
el menú se posiciona **y se recorta** contra ese ancestro en vez del viewport.
Por eso un dropdown dentro de una card o de un área con scroll queda cortado.

La directiva usa la Popover API: el elemento se pinta en el **top layer**, donde
ningún `overflow` ni `transform` de ancestro lo alcanza.

```html
<div class="mi-campo" #anchor>
  <button (click)="open = !open">Abrir</button>
</div>

@if (open) {
  <div class="mi-menu" [fsAnchoredPopover]="anchor">…</div>
}
```

```scss
@use '@heroelc/fsociety/styles/overlay' as overlay;

.mi-menu {
  // Primero: neutraliza inset, margin, border y padding del user-agent
  @include overlay.popover-surface;

  // Después: tu propio box model
  background:    var(--fs-color-surface);
  border:        1px solid var(--fs-color-border);
  border-radius: var(--fs-radius-lg);
  padding:       5px;
  box-shadow:    var(--fs-color-shadow-pop);
}
```

El mixin `popover-surface` no es opcional: el user-agent le aplica a todo
`[popover]` un `inset: 0` y `margin: auto` que, sin resetear, estiran y centran
el elemento en la pantalla en vez de anclarlo al trigger.

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `fsAnchoredPopover` | `HTMLElement` | — | Elemento contra el que se alinea |
| `popoverOffset` | `number` | `6` | Separación vertical del ancla, en px |
| `popoverMatchWidth` | `boolean` | `true` | Toma el ancho del ancla |
| `popoverAlign` | `FsPopoverAlign` | `'start'` | `'start'` alinea bordes izquierdos · `'center'` centra |
| `popoverSide` | `FsPopoverSide` | `'bottom'` | Lado preferido; se voltea si no hay lugar |
| `popoverOpen` | `boolean \| undefined` | `undefined` | Visibilidad explícita. Sin setear, se muestra al inicializarse — pensado para contenido detrás de un `@if` |

Seguí el scroll y el resize solo, se voltea hacia arriba cuando no hay espacio
abajo, y queda contenido dentro del viewport. Si el navegador no soporta
`showPopover`, degrada al comportamiento in-flow anterior en vez de desaparecer.

> Usá `popoverOpen` cuando el elemento se queda en el DOM y solo alterna
> visibilidad: así el CSS puede transicionar `:popover-open` en los dos sentidos
> con `transition-behavior: allow-discrete` y `@starting-style`.

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

Colores disponibles: `primary · secondary · tertiary · neutral · success · warning · danger`

### Capa semántica

Encima de la paleta hay tokens que describen **rol**, no color, y son los que
consumen los componentes. Son los que cambian con `data-theme`:

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

Sass recalcula las diez paradas de cada escala en build time. Las familias
configurables son `$fs-primary-hex`, `$fs-secondary-hex`, `$fs-tertiary-hex`,
`$fs-neutral-hex`, `$fs-success-hex`, `$fs-warning-hex` y `$fs-danger-hex`.

> Probá colores en vivo antes de decidir: la página **Foundations → Branding**
> del [Storybook](https://heroelc.github.io/fsociety) tiene selectores de color
> que recalculan el sistema entero al instante y te dan este mismo snippet listo
> para copiar.

### Redondeo por componente

Cada componente resuelve su radio contra el token global, pero deja dos formas
de pisarlo sin tocar el resto del sistema.

componente contra otro sin que quede una esquina redonda adentro de otra, con
una medialuna de fondo entre las dos:

```html
</fs-card>
```


> **`start` y `end` son lógicas**, no `left`/`right`: siguen la dirección de
> escritura, así que en RTL se dan vuelta solas.

**La custom property de radio** de cada componente cambia cuánto redondea:

```html
<fs-input style="--fs-input-radius: 0"></fs-input>
<fs-card style="--fs-card-radius: 16px"></fs-card>
```

Acepta el shorthand entero de `border-radius` — los cuatro valores, arrancando
otros presets apagan esquinas puntuales con longhands y pisarían el shorthand.

> La excepción es `--fs-segmented-item-radius`: el segmento interior se deriva
> con `calc()` para quedar concéntrico dentro del padding del track, y `calc()`
> necesita un valor único. Si le pasás un shorthand al track, pasale otro al
> ítem.
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

Issues y PRs bienvenidos en [github.com/heroelc/fsociety](https://github.com/heroelc/fsociety).

Documentación visual en Storybook: [heroelc.github.io/fsociety](https://heroelc.github.io/fsociety)

---

## Licencia

[MIT](LICENSE) © heroelc
