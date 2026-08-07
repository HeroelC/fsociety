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

Esa línea es todo lo que necesitás. Emite la paleta (`--fs-primary-base`, …), la
**capa semántica** (`--fs-color-surface`, `--fs-color-text-primary`, …) que es la
que le da color a los componentes, la utilidad `.fs-icon` que usan todos los
íconos, y las clases utilitarias.

> **No alcanza con importar solo `styles/tokens`.** La capa semántica y `.fs-icon`
> viven en `styles/global`, y 17 stylesheets de componentes dependen de ellas.

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

Sin el atributo, se usa el tema claro.

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
> al tema solos, sin necesidad de un color en la URL. Solo se usa la silueta, así
> que no sirven para artwork a color. Son decorativos (`aria-hidden`), por eso el
> `Alt` no se renderiza — el label del badge ya comunica el significado.

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
semánticos, así que siguen el tema activo:

```css
fs-tabs {
  --fs-tab-bg:             var(--fs-color-bg);
  --fs-tab-color:          var(--fs-color-text-secondary);
  --fs-tab-color-active:   var(--fs-color-text-primary);
  --fs-tab-border:         var(--fs-color-border);
  --fs-tab-indicator-from: var(--fs-primary-base);
  --fs-tab-indicator-to:   var(--fs-tertiary-base);
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

Poné `alertAction` en **cada** botón: el slot los separa entre sí. Si en cambio
los envolvés en un solo elemento, también funciona.

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Tono semántico — determina color e ícono |
| `title` | `string` | `''` | Título en negrita |
| `dismissible` | `boolean` | `false` | Muestra botón X para cerrar |
| `autoDismiss` | `number` | `0` | Auto-cierre en ms — muestra progress bar (0 = off) |

| Slot | Selector | Descripción |
|---|---|---|
| Default | — | Texto descriptivo del alert |
| Action | `[alertAction]` | Botones de acción (se renderizan debajo del texto) |

| Output | Tipo | Descripción |
|---|---|---|
| `dismissed` | `EventEmitter<void>` | Emite al cerrarse (botón X o auto-dismiss) |

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

> El calendario se renderiza en el **top layer** vía `[fsAnchoredPopover]`, así que
> no lo recorta ningún contenedor con `overflow` o `transform`.

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

---

### `<fs-modal>`

Diálogo modal construido sobre **`<dialog>` nativo** con `showModal()`.

```html
<fs-button (click)="abierto = true">Abrir</fs-button>

<fs-modal [(open)]="abierto" heading="Confirmar acción">
  <p>Esto va a archivar el proyecto.</p>

  <div modalFooter>
    <fs-button variant="outline" (click)="abierto = false">Cancelar</fs-button>
    <fs-button variant="danger" (click)="archivar()">Archivar</fs-button>
  </div>
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

---

### `<fs-drawer>`

El mismo `<dialog>` nativo, con el panel pegado a un borde en vez de centrado.

```html
<fs-drawer [(open)]="abierto" heading="Filtros" side="right" size="400px">
  <fs-input label="Buscar"></fs-input>

  <div drawerFooter>
    <fs-button variant="primary" (click)="aplicar()">Aplicar</fs-button>
  </div>
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
}
```

**`FsToastService.push(options)`**

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Tono semántico — determina color del ícono |
| `title` | `string` | — | Título en negrita |
| `text` | `string` | — | Texto descriptivo secundario |
| `duration` | `number` | `4200` | Auto-cierre en ms |

Devuelve el `id: string` del toast creado. **`FsToastService.remove(id)`** — cierra manualmente.

---

### `<fs-tooltip>`

Etiqueta flotante que aparece al hacer hover o al enfocar con el teclado, y se
cierra con `Escape`. Se renderiza en el **top layer**, así que no la recorta
ningún ancestro con `overflow` o `transform`.

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

---

### `<fs-hint>` y `<fs-field>`

Texto de apoyo bajo campos de formulario, en 4 tonos. `<fs-field>` es un wrapper con label, required/optional y prioridad de mensajes (error > success > hint).

```html
<fs-hint tone="error">La contraseña es demasiado corta.</fs-hint>
<fs-hint tone="success">Contraseña segura.</fs-hint>
<fs-hint tone="warning">Esta cuenta ya existe.</fs-hint>
<fs-hint tone="default">Usá entre 8 y 32 caracteres.</fs-hint>

<fs-field label="Correo" [required]="true" error="Email inválido.">
  <fs-input type="email" [(ngModel)]="email"></fs-input>
</fs-field>
```

| Input (`fs-hint`) | Tipo | Default | Descripción |
|---|---|---|---|
| `tone` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Tono semántico |
| `icon` | `boolean \| string \| undefined` | `undefined` | `undefined` = auto · `false` = sin ícono · `true` = forzar · URL = custom |

| Input (`fs-field`) | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | `''` | Etiqueta del campo |
| `required` | `boolean` | `false` | Muestra `*` rojo |
| `optional` | `boolean` | `false` | Muestra "opcional" tenue |
| `hint` / `error` / `success` | `string` | `''` | Mensajes (prioridad: error > success > hint) |

---

### `<fs-multi-select>`

Dropdown de selección múltiple con chips removibles, buscador y checkboxes. Implementa `ControlValueAccessor`.

```typescript
options: FsMultiSelectOption[] = [
  { value: 'angular',    label: 'Angular' },
  { value: 'typescript', label: 'TypeScript' },
];
```

```html
<fs-multi-select [options]="options" [(ngModel)]="selected"></fs-multi-select>
<fs-multi-select [options]="options" [max]="3" [searchable]="false" [(ngModel)]="selected"></fs-multi-select>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `FsMultiSelectOption[]` | `[]` | Array de `{ value, label }` |
| `placeholder` | `string` | `'Seleccionar...'` | Texto cuando no hay selección |
| `searchable` | `boolean` | `true` | Muestra buscador |
| `max` | `number` | `0` | Límite de selecciones (0 = sin límite) |
| `disabled` | `boolean` | `false` | Estado deshabilitado |

---

### `<fs-steps>`

Indicador de progreso multi-paso puramente presentacional. El padre controla `current`.

```typescript
steps: FsStep[] = [
  { label: 'Cuenta', desc: 'Datos básicos' },
  { label: 'Perfil', desc: 'Tu información' },
  { label: 'Plan',   desc: 'Elige y paga' },
  { label: 'Listo',  desc: 'Confirmación' },
];
```

```html
<fs-steps [steps]="steps" [current]="2"></fs-steps>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `FsStep[]` | `[]` | Array de `{ label, desc? }` |
| `current` | `number` | `0` | Índice activo (0-based) |

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

### Theming por app

```scss
@use '@heroelc/fsociety/styles' with (
  $fs-primary-hex:   #7c3aed,
  $fs-secondary-hex: #0891b2,
  $fs-tertiary-hex:  #0d9488,
);
```

Familias configurables: `$fs-primary-hex`, `$fs-secondary-hex`,
`$fs-tertiary-hex`, `$fs-neutral-hex`, `$fs-success-hex`, `$fs-warning-hex`,
`$fs-danger-hex`.

> Probá colores en vivo antes de decidir: **Foundations → Branding** en el
> [Storybook](https://heroelc.github.io/fsociety) recalcula el sistema entero al
> instante y te da este snippet listo para copiar.

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

## Desarrollo local

```bash
git clone https://github.com/heroelc/fsociety.git
cd fsociety
npm install

# levantar storybook
npm run storybook
# → http://localhost:6006

# build de la lib en modo watch
npm run build:lib -- --watch
```

---

## Versionado

Usa [Conventional Commits](https://www.conventionalcommits.org/) +
[release-it](https://github.com/release-it/release-it), configurado en
`.release-it.json`.

```bash
npm run release:patch   # 0.2.0 → 0.2.1
npm run release:minor   # 0.2.0 → 0.3.0
npm run release:major   # 0.2.0 → 1.0.0
npm run release:dry     # ver qué haría, sin tocar nada
```

Un release produce **un solo commit** con los dos manifests ya sincronizados:

```
chore: release v0.2.0
  CHANGELOG.md
  package-lock.json
  package.json
  projects/fsociety/package.json
```

Eso funciona porque el hook `after:bump` de `.release-it.json` corre
`sync-version.js` antes de que release-it haga `git add . --update`. Si algún día
volvés a necesitar un segundo commit para alinear la versión, revisá primero que
el archivo de config siga llamándose `.release-it.json` **con el punto**: sin él,
release-it no lo lee y no avisa.

Dos cosas que conviene tener presentes:

- **`--dry-run` no ejecuta los hooks.** Sirve para confirmar el número de versión
  y el changelog, no para verificar el sync. La verificación real es mirar el
  commit después.
- **No escribas `#` seguido de nada en el cuerpo de un commit**, salvo que sea un
  issue real que quieras linkear. El parser del changelog convierte todo `#algo`
  en referencia a un issue.
  - `#0d1117` y otros hex los limpia solo `clean-changelog.js` en el hook
    `before:git:beforeRelease`.
  - `#42` en prosa **no se puede limpiar**: un número decimal es indistinguible
    de un issue de verdad, así que el script lo deja pasar a propósito. Escribí
    "el issue 42" o ponelo entre backticks.

Y una advertencia de semver: **cambiar de banda** de madurez no es algo mecánico.
Salir de `0.0.x` (a `0.1.0`) o salir de pre-release (a `1.0.0`) son decisiones
sobre el proyecto y las decidís vos. Un `0.2.0 → 0.3.0` en cambio es un minor
ordinario y no requiere ceremonia. Un número publicado no se puede reusar.

---

## 📦 Publicar en npm

### Primera vez — configurar token de acceso

1. Ir a [npmjs.com](https://www.npmjs.com) → tu avatar → **Access Tokens**
2. **Generate New Token** → **Classic Token** → tipo **Automation**
3. En **Packages and scopes**: `Read and write` + `All packages`
4. En **Organizations**: dejar vacío
5. Copiar el token generado y ejecutar:

```bash
npm set //registry.npmjs.org/:_authToken TU_TOKEN_AQUI
```

### Publicar nueva versión — flujo completo

```bash
# 1. commitear el trabajo con conventional commits (es de donde sale el changelog)
git add .
git commit -m "fix: descripción del cambio"

# 2. release: bump + sync + CHANGELOG + commit + tag, todo en uno
npm run release:patch      # o release:minor / release:major

# 3. push del commit y del tag
git push --follow-tags

# 4. build y publicar
npm run build:lib
cd dist/fsociety && npm publish --access public && cd ../..

# 5. storybook
npm run build-storybook && npm run deploy-storybook
```

El release **no** pushea ni publica en npm por su cuenta: `git.push` está
desactivado y `npm.publish` está en `false` en `.release-it.json`, a propósito.

### Verificar publicación

```bash
# ojo: npm cachea metadata, así que sin --prefer-online podés ver la versión vieja
npm view @heroelc/fsociety version --prefer-online
npm dist-tag ls @heroelc/fsociety
```

Antes de publicar vale la pena mirar qué se va a subir:

```bash
cd dist/fsociety && npm pack --dry-run
```

Chequeá que estén los cuatro partials SCSS (`_index`, `_mixins`, `_overlay`,
`_tokens`) y `global.scss`. Si agregás un partial nuevo en `src/styles/`, hay que
sumarlo a los `assets` de `projects/fsociety/ng-package.json` **y** al mapa
`exports` de `projects/fsociety/package.json`, o el build de los consumidores se
rompe.

> Error 403 versión ya publicada → corré el release antes del build.
> Error 403 autenticación → el token expiró, repetí la configuración.

---

## 📖 Publicar Storybook en GitHub Pages

### Instalación (solo la primera vez)

```bash
npm install -D @storybook/storybook-deployer
```

Agregar en `package.json` raíz:

```json
"deploy-storybook": "storybook-to-ghpages --existing-output-dir=storybook-static"
```

### Configurar GitHub Pages (solo la primera vez)

1. Repo en GitHub → **Settings** → **Pages**
2. **Source** → `Deploy from a branch`
3. **Branch** → `gh-pages` → `/ (root)` → **Save**

### Deploy y re-deploy

```bash
npm run build-storybook && npm run deploy-storybook
```

Storybook en: **https://heroelc.github.io/fsociety**

---

## Roadmap

- [x] `_tokens.scss` — sistema de color con 10 stops automáticos
- [x] `_mixins.scss` — flexbox, spacing, tipografía, responsive, visual helpers
- [x] `fs-button` — 5 variantes, 3 tamaños, loading, icons
- [x] `fs-badge` — 7 colores, customColor hex, imgLeft/Right, iconOnly, dot, removable
- [x] `fs-tabs` — degradé indicator, flex:1, 9 CSS custom properties
- [x] `fs-alert` — filled/accent, autoDismiss con progress bar, animaciones
- [x] `fs-experience-card` — full/compact, timeline, bullets expandibles
- [x] `fs-profile-card` — avatarUrl, bannerUrl, links con imgUrl, badges con customColor
- [x] `fs-input` — text/email/password/url/search, clearable, iconLeft, error/success
- [x] `fs-select` — searchable, iconLeft, descripción por opción, error/success
- [x] `fs-checkbox` — indeterminate, error, descripción
- [x] `fs-radio-group` — opciones con descripción, error
- [x] `fs-switch` — toggle on/off, descripción
- [x] `fs-segmented` — control segmentado con íconos opcionales
- [x] `fs-toast` — FsToastService + fs-toast-stack, 5 tonos, auto-dismiss
- [x] `fs-tooltip` — top/bottom, alto contraste, top layer
- [x] `fs-hint` + `fs-field` — mensajes de apoyo en 4 tonos, wrapper de campo
- [x] `fs-multi-select` — chips removibles, buscador, checkboxes, max
- [x] `fs-steps` — stepper multi-paso, completado/activo/pendiente
- [x] `fs-date-picker` — campo tipeable + calendario, min/max, locale via Intl, teclado
- [x] `fs-number-input` — stepper, prefijo/sufijo, decimales sin drift
- [x] `fs-textarea` — contador, auto-grow, estados
- [x] `fs-file-upload` — dropzone, File reales, validación de tipo/tamaño/cantidad
- [x] `fs-date-range-picker` — dos meses, preview, presets, maxSpan
- [x] `fs-otp` — código de verificación, autofill de SMS, pegado inteligente
- [x] `fs-slider` — marcas, límites, formato propio, decimales sin drift
- [x] `fs-rating` — fracciones en readonly, un solo tab stop, icono configurable
- [x] `fs-modal` — <dialog> nativo: focus trap, fondo inerte, top layer
- [x] `fs-drawer` — mismo dialog, panel en cualquiera de los 4 bordes
- [x] Temas light y dark vía `data-theme`, con capa semántica de tokens
- [x] `[fsAnchoredPopover]` — overlays en el top layer, sin recortes
- [x] Storybook en GitHub Pages, con paleta de marca en vivo
- [ ] GitHub Actions CI/CD

---

## Licencia

[MIT](LICENSE) © heroelc
