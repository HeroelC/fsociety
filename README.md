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

### 1. Cargar los tokens en `styles.scss`

```scss
// src/styles.scss de tu app Angular
@use '@heroelc/fsociety/styles/tokens';
@use '@heroelc/fsociety/styles/mixins'; // opcional — clases utilitarias
```

Esto emite todas las CSS custom properties (`--fs-primary-base`, `--fs-primary-hover`, etc.) en `:root`, disponibles globalmente en toda la app.

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

<!-- con imagen (simpleicons, assets, etc.) -->
<fs-badge color="danger"
  imgLeft="https://cdn.simpleicons.org/angular/white"
  imgLeftAlt="Angular">
  Angular
</fs-badge>

<!-- con color hex personalizado -->
<fs-badge customColor="#7c3aed"
  imgLeft="https://cdn.simpleicons.org/nestjs/white">
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
| `imgLeft` | `string` | — | URL o ruta imagen izquierda (prioridad sobre iconLeft) |
| `imgRight` | `string` | — | URL o ruta imagen derecha |
| `imgLeftAlt` | `string` | `''` | Alt text para imgLeft |
| `imgRightAlt` | `string` | `''` | Alt text para imgRight |
| `iconOnly` | `boolean` | `false` | Badge circular sin label |
| `removable` | `boolean` | `false` | Muestra botón X |

| Output | Tipo | Descripción |
|---|---|---|
| `removed` | `EventEmitter<void>` | Emite al clickear el X |

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

**CSS custom properties configurables:**

```css
fs-tabs {
  --fs-tab-bg:             #0d1117;
  --fs-tab-color:          rgba(255,255,255,0.40);
  --fs-tab-color-hover:    rgba(255,255,255,0.70);
  --fs-tab-color-active:   #ffffff;
  --fs-tab-border:         rgba(255,255,255,0.08);
  --fs-tab-hover-bg:       rgba(255,255,255,0.03);
  --fs-tab-indicator-from: var(--fs-primary-base);
  --fs-tab-indicator-to:   var(--fs-tertiary-base);
  --fs-tab-indicator-glow: rgba(34,211,238,0.45);
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
  <div alertAction>
    <fs-button variant="outline" size="sm">Recordar luego</fs-button>
    <fs-button variant="primary" size="sm">Renovar ahora</fs-button>
  </div>
</fs-alert>
```

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

Etiqueta flotante CSS-only — sin JS. Se muestra al hacer hover.

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
    { label: 'Angular',     color: 'danger',  imgLeft: 'https://cdn.simpleicons.org/angular/white' },
    { label: 'TypeScript',  color: 'primary', imgLeft: 'https://cdn.simpleicons.org/typescript/white' },
    { label: 'AWS',         customColor: '#ea580c', imgLeft: 'https://cdn.simpleicons.org/amazonaws/white' },
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
  { label: 'linkedin.com/in/johndoe', url: 'https://linkedin.com/in/johndoe', imgUrl: 'https://cdn.simpleicons.org/linkedin/white', imgAlt: 'LinkedIn' },
  { label: 'github.com/johndoe',      url: 'https://github.com/johndoe',      imgUrl: 'https://cdn.simpleicons.org/github/white',   imgAlt: 'GitHub' },
  { label: 'Buenos Aires, Argentina' },
];
badges = [
  { label: 'Angular',    color: 'danger',  imgLeft: 'https://cdn.simpleicons.org/angular/white' },
  { label: 'TypeScript', color: 'primary', imgLeft: 'https://cdn.simpleicons.org/typescript/white' },
  { label: 'NestJS',     customColor: '#7c3aed', imgLeft: 'https://cdn.simpleicons.org/nestjs/white' },
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
@use '@heroelc/fsociety/styles/tokens' with (
  $fs-primary-hex:   #7c3aed,
  $fs-secondary-hex: #0891b2,
  $fs-tertiary-hex:  #0d9488,
);
```

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

Usa [Conventional Commits](https://www.conventionalcommits.org/) + [release-it](https://github.com/release-it/release-it).

```bash
# patch 0.0.15 → 0.0.16
git commit -m "fix(button): corregir hover en dark mode"

# minor 0.0.16 → 0.1.0
git commit -m "feat(input): agregar componente fs-input"

# major 0.1.0 → 1.0.0
git commit -m "feat!: renombrar prefijo a fs-"
```

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
# 1. desde la raíz del workspace — commit con convención
git add .
git commit -m "fix: descripción del cambio"

# 2. generar el release (bumps version + CHANGELOG + git tag + push)
npm run release -- patch

# 3. build:lib sincroniza la versión a projects/fsociety/package.json y buildea
npm run build:lib

# 4. ir a dist y publicar
cd dist/fsociety
npm publish --access public

# 5. volver a la raíz
cd ../..
```

> `npm run build:lib` ejecuta `sync-version.js` antes del build — copia la versión del `package.json` raíz al `projects/fsociety/package.json` automáticamente.

### Verificar publicación

```bash
npm show @heroelc/fsociety version
```

> Error 403 versión ya publicada → corrí `npm run release` antes del build.
> Error 403 autenticación → token expiró, repetir configuración.

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
- [x] `fs-tooltip` — CSS-only, top/bottom, alto contraste
- [x] Storybook en GitHub Pages
- [ ] GitHub Actions CI/CD

---

## Licencia

[MIT](LICENSE) © heroelc
