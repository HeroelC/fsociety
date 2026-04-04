# fsociety

> Angular component library · Design system con tokens, mixins y componentes UI

[![npm version](https://img.shields.io/npm/v/@heroelc/fsociety.svg?style=flat-square)](https://www.npmjs.com/package/@heroelc/fsociety)
[![Angular](https://img.shields.io/badge/Angular-17%2B-red?style=flat-square&logo=angular)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-docs-ff4785?style=flat-square&logo=storybook)](https://heroelc.github.io/fsociety)

---

## Instalación

```bash
npm install @heroelc/fsociety
```

### Prerrequisitos

- Angular 17+
- Node 18+
- SCSS habilitado en el proyecto

---

## Setup rápido

### 1. Cargar los tokens en `styles.scss`

```scss
// src/styles.scss de tu app Angular
@use '@heroelc/fsociety/styles/tokens';
```

Esto emite todas las CSS custom properties (`--fs-primary-base`, `--fs-primary-hover`, etc.) en `:root`, disponibles globalmente en toda la app.

### 2. Importar componentes

Los componentes son **standalone** — se importan directo en el `imports` del componente o módulo que los necesita:

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
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `loading` | `boolean` | `false` | Muestra spinner y deshabilita |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML nativo |

| Output | Tipo | Descripción |
|---|---|---|
| `fsClick` | `EventEmitter<MouseEvent>` | Click (no emite si disabled o loading) |

---

### `<fs-badge>`

```html
<fs-badge color="primary">Angular</fs-badge>
<fs-badge color="secondary">TypeScript</fs-badge>
<fs-badge color="success">Activo</fs-badge>
<fs-badge color="danger">Deprecado</fs-badge>
<fs-badge variant="outline" color="neutral">ESLint</fs-badge>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'neutral'` | Color del badge |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Variante visual |
| `size` | `'sm' \| 'md'` | `'md'` | Tamaño |

---

### `<fs-alert>`

```html
<fs-alert type="info" title="Actualización disponible">
  Nueva versión de fsociety disponible: v1.2.0
</fs-alert>

<fs-alert type="success" [dismissible]="true">
  Cambios guardados correctamente.
</fs-alert>

<fs-alert type="warning" title="Atención">
  Esta acción no se puede deshacer.
</fs-alert>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `type` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Tipo semántico |
| `title` | `string` | `undefined` | Título opcional |
| `dismissible` | `boolean` | `false` | Muestra botón de cierre |

| Output | Tipo | Descripción |
|---|---|---|
| `dismissed` | `EventEmitter<void>` | Se emite al cerrar el alert |

---

### `<fs-tabs>`

```html
<fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
  <ng-template fsTabContent="experiencia">
    <!-- contenido de la tab -->
  </ng-template>
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

---

### `<fs-profile-card>`

```html
<fs-profile-card
  name="Heroel Carpinetti"
  handle="heroelc"
  role="Frontend Developer Angular"
  location="Tandil, Buenos Aires"
  [verified]="true"
  [stats]="{ years: 4, projects: 12, followers: 985 }"
  [tags]="['Angular', 'TypeScript', 'AWS']"
/>
```

---

## Sistema de tokens

La librería expone un sistema de color con **10 stops por color** generados automáticamente desde el color base. Los alias tokens son los que se usan en los componentes.

### Colores brand

| Token | Valor | Uso |
|---|---|---|
| `--fs-primary-base` | `#2563eb` | Botón principal, links, focus |
| `--fs-secondary-base` | `#0ea5e9` | Acciones secundarias |
| `--fs-tertiary-base` | `#22d3ee` | Highlights, accents |

### Alias de estado (disponibles para primary, secondary, tertiary, neutral, success, warning, danger)

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

### Theming por app

Para sobreescribir los colores base, usá el `@use ... with` de Sass antes de importar los tokens:

```scss
// styles.scss de tu app
@use '@heroelc/fsociety/styles/tokens' with (
  $fs-primary-hex:   #7c3aed,  // purple
  $fs-secondary-hex: #0891b2,
  $fs-tertiary-hex:  #0d9488,
);
```

Toda la escala de 10 stops se regenera automáticamente con los nuevos colores.

---

## Mixins

```scss
@use '@heroelc/fsociety/styles/mixins' as fs;

.mi-componente {
  // focus ring accesible
  &:focus { @include fs.focus-ring; }
  &:focus { @include fs.focus-ring($color: var(--fs-danger-base), $offset: 3px); }

  // transiciones
  transition: fs.$fs-transition-colors;
  transition: fs.$fs-transition-base;
}
```

---

## Storybook

```bash
# clonar y levantar el storybook local
git clone https://github.com/heroelc/fsociety.git
cd fsociety
npm install
npm run storybook
# → http://localhost:6006
```

Storybook publicado: [heroelc.github.io/fsociety](https://heroelc.github.io/fsociety)

---

## Desarrollo local

```bash
git clone https://github.com/heroelc/fsociety.git
cd fsociety
npm install

# build de la lib en modo watch
ng build fsociety --watch

# levantar app de demo
ng serve fsociety-demo

# levantar storybook
npm run storybook
```

---

## Versionado

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/) y [release-it](https://github.com/release-it/release-it) para el versionado semántico automático.

```bash
# patch: fix → 0.1.0 → 0.1.1
git commit -m "fix(button): corregir hover en dark mode"

# minor: feat → 0.1.0 → 0.2.0
git commit -m "feat(badge): agregar variante outline"

# major: feat! → 0.1.0 → 1.0.0
git commit -m "feat!: renombrar prefijo a fs-"

# generar release
npm run release
```

---

## Roadmap

- [x] `_tokens.scss` — sistema de color con 10 stops automáticos
- [x] `_mixins.scss` — mixins de base
- [x] `fs-button` — variantes, estados, loading
- [x] `fs-badge` — colores y variantes
- [ ] `fs-alert` — tipos semánticos, dismissible
- [x] `fs-tabs` — tabs con content projection
- [x] `fs-profile-card` — card de portfolio
- [x] `fs-experience-card` — card de experiencia laboral
- [ ] `fs-input` / `fs-form-field` — formularios
- [ ] GitHub Actions CI/CD
- [ ] Storybook publicado en GitHub Pages

---

## Licencia

[MIT](LICENSE) © [Heroel Carpinetti](https://github.com/heroelc)
