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
| `iconLeft` | `string` | — | SVG path del ícono izquierdo |
| `iconRight` | `string` | — | SVG path del ícono derecho |
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
<fs-alert type="info" title="Actualización disponible" [dismissible]="true">
  Nueva versión disponible: v0.0.2
</fs-alert>

<fs-alert type="success" variant="accent" [autoDismiss]="3000">
  Cambios guardados correctamente.
</fs-alert>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'info'` | Tipo semántico |
| `variant` | `'filled' \| 'accent'` | `'filled'` | filled = fondo · accent = borde izq. |
| `title` | `string` | — | Título en negrita |
| `dismissible` | `boolean` | `false` | Muestra botón X |
| `autoDismiss` | `number` | `0` | Auto-cierre en ms (0 = off) |

| Output | Tipo | Descripción |
|---|---|---|
| `dismissed` | `EventEmitter<void>` | Emite al cerrarse |

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
    {
      label:   'Angular',
      color:   'danger',
      imgLeft: 'https://cdn.simpleicons.org/angular/white',
    },
    {
      label:   'TypeScript',
      color:   'primary',
      imgLeft: 'https://cdn.simpleicons.org/typescript/white',
    },
    {
      label:       'AWS',
      customColor: '#ea580c',
      imgLeft:     'https://cdn.simpleicons.org/amazonaws/white',
    },
    { label: 'ESLint', color: 'neutral' },
  ],
};
```

> `FsExperienceBadge` acepta los mismos campos que `FsProfileBadge`:
> `color`, `customColor`, `iconLeft`, `imgLeft`, `imgLeftAlt`.

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
| `timelineLast` | `boolean` | `false` | Último item (oculta línea hacia abajo) |

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
  {
    label:  'linkedin.com/in/johndoe',
    url:    'https://linkedin.com/in/johndoe',
    imgUrl: 'https://cdn.simpleicons.org/linkedin/white',
    imgAlt: 'LinkedIn',
  },
  {
    label:  'github.com/johndoe',
    url:    'https://github.com/johndoe',
    imgUrl: 'https://cdn.simpleicons.org/github/white',
    imgAlt: 'GitHub',
  },
  { label: 'Buenos Aires, Argentina' },
];
badges = [
  {
    label:   'Angular',
    color:   'danger',
    imgLeft: 'https://cdn.simpleicons.org/angular/white',
  },
  {
    label:   'TypeScript',
    color:   'primary',
    imgLeft: 'https://cdn.simpleicons.org/typescript/white',
  },
  {
    label:       'NestJS',
    customColor: '#7c3aed',
    imgLeft:     'https://cdn.simpleicons.org/nestjs/white',
  },
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

## Contribuir

Issues y PRs bienvenidos en [github.com/heroelc/fsociety](https://github.com/heroelc/fsociety).

Documentación visual en Storybook: [heroelc.github.io/fsociety](https://heroelc.github.io/fsociety)

---

## Licencia

[MIT](LICENSE) © heroelc
