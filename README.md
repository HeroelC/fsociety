# fsociety

> Angular component library · Design system con tokens, mixins y componentes UI

[![npm version](https://img.shields.io/npm/v/@heroelc/fsociety.svg?style=flat-square)](https://www.npmjs.com/package/@heroelc/fsociety)
[![Angular](https://img.shields.io/badge/Angular-19%2B-red?style=flat-square&logo=angular)](https://angular.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Storybook](https://img.shields.io/badge/Storybook-docs-ff4785?style=flat-square&logo=storybook)](https://heroelc.github.io/fsociety)

Este README es para trabajar **sobre** la librería. Si la querés **usar**, lo que buscás está en otro lado:

| Quiero… | Ir a |
|---|---|
| Instalar y configurar la librería | [README del paquete](projects/fsociety/README.md) |
| Ver los componentes y sus props | [Storybook](https://heroelc.github.io/fsociety) |
| Trabajar en el código | seguí leyendo |

---

## Desarrollo local

```bash
git clone https://github.com/HeroelC/fsociety.git
cd fsociety
npm install

npm run storybook          # → http://localhost:6006
```

Storybook es el entorno de desarrollo: cada componente se trabaja contra su
propia story. La primera arranque tarda porque corre Compodoc para generar los
docs de las props.

### Scripts

| Script | Qué hace |
|---|---|
| `npm run storybook` | Storybook en modo dev, puerto 6006 |
| `npm run build:lib` | sincroniza la versión y compila la librería a `dist/fsociety` |
| `npm run build-storybook` | build estático de Storybook a `storybook-static` |
| `npm run deploy-storybook` | publica `storybook-static` en la branch `gh-pages` |
| `npm test` | tests unitarios |
| `npm run release:dry` | preview del próximo release, sin ensuciar el árbol |
| `npm run release:patch\|minor\|major` | bump + CHANGELOG + commit + tag |

Para compilar la librería en watch mientras trabajás fuera de Storybook:

```bash
npm run build:lib -- --watch
```

### Estructura

```
projects/fsociety/          la librería que se publica
  src/lib/                  un directorio por componente
    <componente>/           .component.ts · .html · .scss · .stories.ts
    control-size.ts         FsControlSize, escala compartida
    corners.ts              FsCorners
  src/styles/               tokens, mixins y partials SCSS
  src/public-api.ts         la superficie pública — todo export pasa por acá
  .storybook/               config de Storybook
  README.md                 el que se publica en npm

projects/fsociety-demo/     app de prueba

sync-version.js             alinea los dos package.json
release-dry.js              wrapper del dry run de release-it
clean-changelog.js          saca los hex del changelog
```

Un componente nuevo no existe hasta que está exportado en `public-api.ts`.

---

## Publicar una versión

Son cinco pasos y ninguno es opcional. `release-it` **no** pushea ni publica por
su cuenta: `git.push` está en `false` y `npm.publish` también, a propósito.

```bash
# 1. commitear el trabajo — de acá sale el changelog
git commit -m "feat(button): agregar variante link"

# 2. bump + sync + CHANGELOG + commit + tag, todo en un commit
npm run release:minor        # o patch / major

# 3. push del commit y del tag
git push --follow-tags

# 4. build y publish
npm run build:lib
cd dist/fsociety && npm publish --access public && cd ../..

# 5. storybook
npm run build-storybook && npm run deploy-storybook
```

### El token de npm

**Un Classic Token no alcanza para publicar.** npm exige segundo factor, y falla
con `E403 — Two-factor authentication or granular access token with bypass 2fa
enabled is required`. Peor: `npm whoami` responde OK igual, así que estar
autenticado no es lo mismo que poder publicar.

Configuralo una sola vez:

1. [npmjs.com](https://www.npmjs.com) → avatar → **Access Tokens**
2. **Generate New Token** → **Granular Access Token**
3. Habilitar **Bypass 2FA**
4. En **Packages and scopes**: `Read and write` sobre `@heroelc/fsociety`
5. `npm set //registry.npmjs.org/:_authToken TU_TOKEN`

> No pegues el token en un chat ni lo dejes en el historial del shell. Si pasó,
> rotalo.

La alternativa sin cambiar el token es pasar el código al publicar, pero dura
30 segundos:

```bash
cd dist/fsociety && npm publish --access public --otp=123456
```

### Verificar

```bash
# npm cachea metadata: sin --prefer-online podés estar viendo la versión vieja
npm view @heroelc/fsociety version --prefer-online
```

Antes de publicar conviene mirar qué se va a subir:

```bash
cd dist/fsociety && npm pack --dry-run
```

Chequeá que estén los partials SCSS (`_index`, `_mixins`, `_overlay`, `_tokens`,
`_corners`, `_control-size`) y `global.scss`. **Si agregás un partial nuevo en
`src/styles/`, hay que sumarlo a los `assets` de `ng-package.json` y al mapa
`exports` de `projects/fsociety/package.json`**, o el build de los consumidores
se rompe.

> `403` versión ya publicada → corriste el build antes del release.
> `403` autenticación → el token no tiene bypass 2FA, o expiró.

---

## Storybook en GitHub Pages

```bash
npm run build-storybook && npm run deploy-storybook
```

Se publica en **https://heroelc.github.io/fsociety** pisando la branch
`gh-pages` con `--force`. La configuración de Pages (Settings → Pages → branch
`gh-pages`, carpeta raíz) ya está hecha.

---

## Convenciones

### Commits

[Conventional Commits](https://www.conventionalcommits.org/). El changelog sale
de ahí, así que el mensaje es documentación, no trámite.

**No escribas `#` seguido de nada en el cuerpo de un commit**, salvo que sea un
issue real: el parser convierte todo `#algo` en un link.

- Los hex tipo `#0d1117` los limpia solo `clean-changelog.js`.
- `#42` en prosa **no se puede limpiar** — un decimal es indistinguible de un
  issue de verdad. Escribí "el issue 42" o ponelo entre backticks.

### Versionado

El release produce **un solo commit** con los dos manifests ya sincronizados:

```
chore: release v0.14.0
  CHANGELOG.md
  package-lock.json
  package.json
  projects/fsociety/package.json
```

Funciona porque el hook `after:bump` corre `sync-version.js` antes del
`git add . --update` de release-it. Si algún día volvés a necesitar un segundo
commit para alinear la versión, revisá primero que el archivo de config siga
llamándose `.release-it.json` **con el punto**: sin él, release-it no lo lee y
no avisa.

Dos trampas más:

- **El dry run no es de solo lectura.** Bumpea `package.json` de verdad. Por eso
  `npm run release:dry` pasa por `release-dry.js`, que restaura los manifests.
  **No llames `release-it --dry-run` directo.**
- **Cambiar de banda de madurez no es mecánico.** Salir de `0.0.x` o salir de
  pre-release a `1.0.0` son decisiones sobre el proyecto. Un `0.13.0 → 0.14.0`
  es un minor ordinario. Un número publicado no se puede reusar nunca.

En `0.x` el minor absorbe los breaking changes: van con `!` y footer
`BREAKING CHANGE`, pero no fuerzan un major.

### Estilos

- Un componente hace `@use` de `styles/tokens`, `styles/corners`,
  `styles/control-size` u `styles/overlay` — **nunca de `styles/mixins`**, que
  emite clases utilitarias y las duplicaría en cada componente.
- Alto, padding y tipografía de un control salen de `_control-size.scss`. No
  escribas píxeles a mano en el shell de un campo.

---

## Licencia

MIT © [Heroel Carpinetti](https://github.com/HeroelC)
