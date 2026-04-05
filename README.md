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
<fs-badge color="primary">Angular</fs-badge>
<fs-badge color="danger" [dot]="true">Activo</fs-badge>
<fs-badge color="neutral" variant="outline">ESLint</fs-badge>
<fs-badge color="primary" [iconLeft]="iconPath" [removable]="true" (removed)="onRemove()">
  TypeScript
</fs-badge>
<fs-badge color="secondary" [iconLeft]="iconPath" [iconOnly]="true"></fs-badge>
```

| Input | Tipo | Default | Descripción |
|---|---|---|---|
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'danger' \| 'neutral'` | `'neutral'` | Color |
| `variant` | `'filled' \| 'outline'` | `'filled'` | Variante visual |
| `size` | `'sm' \| 'md'` | `'md'` | Tamaño |
| `dot` | `boolean` | `false` | Punto de estado |
| `iconLeft` | `string` | — | SVG path ícono izquierdo |
| `iconRight` | `string` | — | SVG path ícono derecho |
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
  company:        'Xcale Consulting',
  role:           'Frontend Developer',
  startDate:      'abr 2022',
  current:        true,
  logoText:       'X CALE',
  bullets: [
    'Desarrollo de interfaces con Angular, migraciones v8→v16.',
    'Configuración de pipelines en CodeBuild, ECS en AWS.',
  ],
  bulletsPreview: 3,
  badges: [
    { label: 'Angular',    color: 'danger'  },
    { label: 'TypeScript', color: 'primary' },
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
| `timelineLast` | `boolean` | `false` | Último item (oculta línea hacia abajo) |

---

### `<fs-profile-card>`

```html
<fs-profile-card
  name="Heroel Carpinetti"
  handle="heroelc"
  role="Frontend Developer Angular"
  avatarUrl="https://avatars.githubusercontent.com/u/TU_ID"
  bannerUrl="URL_DE_TU_BANNER"
  [verified]="true"
  [showActions]="false"
  [links]="links"
  [badges]="badges"
  [stats]="stats"
/>
```

```typescript
links = [
  { label: 'linkedin.com/in/heroelc', url: 'https://linkedin.com/in/heroelc' },
  { label: 'github.com/heroelc',      url: 'https://github.com/heroelc' },
  { label: 'Tandil, Buenos Aires' },
];
badges = [
  { label: 'Angular',    color: 'danger'    },
  { label: 'TypeScript', color: 'primary'   },
  { label: 'AWS',        color: 'secondary' },
];
stats = [
  { value: '4+',  label: 'años exp.'  },
  { value: '12',  label: 'proyectos'  },
  { value: '985', label: 'seguidores' },
];
```

> **Obtener tu avatarUrl de GitHub:**
> Abrí `https://api.github.com/users/heroelc`, copiá el campo `id` y usá:
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
# patch 0.0.1 → 0.0.2
git commit -m "fix(button): corregir hover en dark mode"

# minor 0.0.2 → 0.1.0
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
npm run release
# para forzar patch sin importar el tipo de commit:
npm run release -- patch

# 3. build de la lib
npm run build:lib

# 4. ir a dist y publicar
cd dist/fsociety
npm publish --access public

# 5. volver a la raíz
cd ../..
```

### Verificar publicación

```bash
npm show @heroelc/fsociety version
```

O abrir: https://www.npmjs.com/package/@heroelc/fsociety

> Si aparece error 403, el token expiró o no tiene permisos. Repetir el paso de configurar token.

---

### Deploy

```bash
# build del storybook estático
npm run build-storybook
# genera la carpeta storybook-static/

# deploy a la rama gh-pages
npm run deploy-storybook
```

Storybook queda en: **https://heroelc.github.io/fsociety**

### Re-deploy (cuando actualizás componentes)

```bash
npm run build-storybook && npm run deploy-storybook
```

---

## Roadmap

- [x] `_tokens.scss` — sistema de color con 10 stops automáticos
- [x] `_mixins.scss` — mixins de base
- [x] `fs-button` — 5 variantes, 3 tamaños, loading, icons
- [x] `fs-badge` — 7 colores, iconLeft/Right, iconOnly, dot, removable
- [x] `fs-tabs` — degradé indicator, flex:1, CSS custom properties
- [x] `fs-alert` — filled/accent, autoDismiss, animaciones
- [x] `fs-experience-card` — full/compact, timeline, bullets expandibles
- [x] `fs-profile-card` — avatarUrl, bannerUrl, stats[], showActions
- [ ] `fs-input` / `fs-form-field`
- [ ] `fs-toast` — servicio + container flotante
- [ ] GitHub Actions CI/CD
- [x] Storybook en GitHub Pages

---

## Licencia

[MIT](LICENSE) © [Heroel Carpinetti](https://github.com/heroelc)
