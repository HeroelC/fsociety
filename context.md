# fsociety — contexto de desarrollo

> Pegá este archivo al inicio de una conversación nueva para retomar el desarrollo.

---

## Qué es

Librería Angular de componentes UI con design system propio.
Workspace: `fsociety-workspace` · Lib: `projects/fsociety/`
npm: `@heroelc/fsociety` · GitHub: `github.com/heroelc/fsociety`
Storybook: `heroelc.github.io/fsociety`

---

## Stack

- Angular 19 · standalone components · OnPush change detection
- SCSS con `@use` (Dart Sass moderno — sin `mix()`, sin `map-get()` globales)
- Storybook 10 con `@storybook/angular` + Compodoc
- release-it + conventional-changelog para versionado
- `sync-version.js` en la raíz sincroniza la versión al `projects/fsociety/package.json`

---

## Estructura
fsociety-workspace/
├── projects/
│   └── fsociety/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── button/           fs-button
│       │   │   ├── badge/            fs-badge
│       │   │   ├── tabs/             fs-tabs
│       │   │   ├── alert/            fs-alert
│       │   │   ├── experience-card/  fs-experience-card
│       │   │   ├── profile-card/     fs-profile-card
│       │   │   ├── tokens.stories.ts documentación de tokens
│       │   │   └── mixins.stories.ts documentación de mixins
│       │   ├── styles/
│       │   │   ├── _tokens.scss      sistema de color + alias tokens
│       │   │   ├── _mixins.scss      flexbox, spacing, typo, responsive
│       │   │   ├── _index.scss       @forward tokens y mixins
│       │   │   └── global.scss       @use tokens y mixins (cargado en Storybook)
│       │   └── public-api.ts         exports de la lib
│       ├── .storybook/
│       │   ├── main.ts
│       │   └── preview.ts
│       └── package.json              @heroelc/fsociety con versión actual
├── sync-version.js                   sincroniza versión workspace → lib
├── .release-it.json
└── package.json                      scripts del workspace


---

## Componentes completados

### fs-button
- Variantes: `primary | secondary | outline | ghost | danger | link`
- Sizes: `sm | md | lg`
- Inputs: `variant, size, type, disabled, loading, label, iconLeft, iconRight, fullWidth`
- Outputs: `fsClick`
- Variante `link`: sin fondo ni borde, color `primary`, subrayado visible solo en hover
  (`text-decoration-color: transparent` en reposo → `primary-base` en hover)

### fs-badge
- Colors: `primary | secondary | tertiary | success | warning | danger | neutral`
- Variantes: `filled | outline`
- Sizes: `sm (12px) | md (14px)`
- Inputs: `color, variant, size, label, dot, iconLeft, iconRight, iconOnly, removable`
- Outputs: `removed`
- Íconos SVG path en viewBox 0 0 24 24

### fs-tabs
- Indicator con degradé `primary → tertiary` + glow cyan
- `flex: 1` — tabs distribuyen 100% del ancho automáticamente
- ResizeObserver para recalcular indicator al redimensionar
- 9 CSS custom properties: `--fs-tab-bg`, `--fs-tab-color`, `--fs-tab-color-hover`,
  `--fs-tab-color-active`, `--fs-tab-border`, `--fs-tab-hover-bg`,
  `--fs-tab-indicator-from`, `--fs-tab-indicator-to`, `--fs-tab-indicator-glow`
- Inputs: `tabs: FsTab[], activeTab`
- Outputs: `activeTabChange, tabChange`

### fs-alert
- Tipos: `info | success | warning | danger | neutral`
- Variantes: `filled | accent` (borde izquierdo)
- Animación entrada: fade + slide 280ms · salida: fade + collapse 220ms
- Auto-dismiss con progress bar
- Inputs: `type, variant, title, dismissible, autoDismiss`
- Outputs: `dismissed`

### fs-experience-card
- Variantes: `full | compact`
- Modo timeline con línea vertical y dot verde (actual) / gris (pasado)
- Bullets expandibles con "ver más / ver menos"
- Duración calculada automáticamente desde fechas en español (ej: 'abr 2022')
- Token `--fs-exp-radius` para controlar redondeo (0 = full width)
- Inputs: `experience: FsExperienceCard, variant, timeline, timelineLast`

### fs-profile-card
- Banner: 180px (imagen o degradé navy)
- Avatar: 120px con iniciales o imagen
- Badge verificado escalado (30px)
- Stats configurables: `FsProfileStat[]`
- Variante con/sin acciones (showActions)
- Token `--fs-profile-radius` para controlar redondeo
- Inputs: `name, handle, role, verified, avatarUrl, bannerUrl, links, badges, stats,
           showActions, primaryActionLabel, secondaryActionLabel`
- Outputs: `primaryAction, secondaryAction`

---

## Sistema de tokens

### Colores base
$fs-primary-hex:   
#2563eb
$fs-secondary-hex: 
#0ea5e9
$fs-tertiary-hex:  
#22d3ee
$fs-neutral-hex:   
#64748b
$fs-success-hex:   
#22c55e
$fs-warning-hex:   
#f59e0b
$fs-danger-hex:    
#f43f5e


### Escala automática (generate-scale con color.mix)
50→muted · 100→subtle · 200→tint · 300→light · 400→soft
500→base · 600→hover · 700→active · 800→emphasis · 900→contrast

### Tokens de componente (en _tokens.scss sección 15)
fs-tabs: 9 variables · fs-profile-card: --fs-profile-radius · fs-experience-card: --fs-exp-radius

---

## Mixins disponibles

### Flexbox
`flex-center, flex-between, flex-around, flex-start, flex-end`
`flex-col, flex-col-center, inline-flex-center`
`stack($gap), inline-stack($gap)`
Clases: `.flex-center, .flex-between, .flex-col, .gap-{1-8}`

### Spacing — padding y margin con lados individuales
Mixins: `px($key), py($key), pl($key), pr($key), pt($key), pb($key)`
        `mx($key), my($key), ml($key), mr($key), mt($key), mb($key)`
Clases: `.px-{n}, .py-{n}, .pl-{n}, .pr-{n}, .pt-{n}, .pb-{n}`
        `.mx-{n}, .my-{n}, .ml-{n}, .mr-{n}, .mt-{n}, .mb-{n}, .mx-auto`
Escala: 0, 1(4px), 2(8px), 3(12px), 4(16px), 5(20px), 6(24px), 8(32px), 10(40px), 12(48px), 16(64px)

### Tipografía
`truncate, truncate-lines($n), uppercase-label, font-mono, text-style($size, $weight, $color)`
Clases: `.truncate, .truncate-2, .truncate-3, .uppercase-label, .font-mono`
        `.text-{xs|sm|base|lg|xl|2xl|3xl}, .font-{regular|medium|semi|bold}`
        `.text-{left|center|right}`

### Responsive
`respond-to('sm'|'md'|'lg'|'xl'|'xxl'), mobile-only, container($max)`
Breakpoints: sm=640px · md=768px · lg=1024px · xl=1280px · xxl=1536px
Clases: `.sm-flex, .md-hidden, .lg-flex-center`, etc.
⚠️ Usar 'xxl' (no '2xl') — CSS no permite selectores que empiecen con número

### Visual / UI
`focus-ring($color, $offset), card-surface($radius), glass($opacity)`
`visually-hidden, reset-button, reset-list, divider($color)`
Clases: `.visually-hidden, .card-surface, .glass, .divider, .reset-list`
        `.w-full, .h-full, .min-w-0, .overflow-hidden, .relative, .absolute`
        `.rounded-{sm|md|lg|xl|2xl|full}`

### Badge helpers
`badge-variant($base, $bg, $border), badge-outline($base)`
`dot-indicator($color, $size), gradient-indicator($from, $to)`

---

## Sass — reglas importantes
- Siempre usar `@use 'sass:color'` y `color.mix()` (nunca `mix()` global)
- Siempre usar `@use 'sass:map'` y `map.get()` (nunca `map-get()` global)
- Breakpoint responsive: usar `'xxl'` no `'2xl'`
- En Angular templates: escapar `@` como `&#64;` (Angular 17+ lo interpreta como control flow)

---

## Scripts del workspace
```bash
npm run storybook        # levantar storybook en :6006
npm run build:lib        # sync-version + ng build fsociety
npm run build-storybook  # build estático de storybook
npm run deploy-storybook # deploy a gh-pages
npm run release -- patch # bump version + CHANGELOG + tag + push
npm run release:dry      # dry run para verificar
```

## Flujo de publicación
```bash
git add . && git commit -m "fix: ..."
npm run release -- patch
npm run build:lib
cd dist/fsociety && npm publish --access public && cd ../..
npm run build-storybook && npm run deploy-storybook
git push origin main
```

---

## Pendiente (roadmap)

- [ ] fs-input / fs-form-field
- [ ] fs-toast — servicio + container flotante con apilado automático
- [ ] GitHub Actions CI/CD — automatizar build + publish en tag push
- [ ] Mejorar portfolio consumiendo la lib

---

## Convención de commits
fix(button): descripción     → patch
feat(input): descripción     → minor
feat!: descripción           → major (breaking)
chore: descripción           → sin bump
docs: descripción            → sin bump

