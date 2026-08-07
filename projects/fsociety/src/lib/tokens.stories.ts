import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'fs-tokens-doc',
  standalone: true,
  template: `
    <div class="doc">

      <!-- BRAND SCALES ─────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Escalas de color brand</h2>
          <p class="section-desc">
            Cada color base genera 10 stops con <code>generate-scale()</code>.
            Usá los <strong>alias</strong> en componentes — nunca los stops numéricos directamente.
          </p>
        </div>

        @for (scale of brandScales; track scale.name) {
          <div class="scale-block">
            <div class="scale-meta">
              <span class="scale-name">{{ scale.name }}</span>
              <code class="scale-hex">{{ scale.hex }}</code>
            </div>
            <div class="scale-row">
              @for (s of stops; track s) {
                <div class="stop" [style.background]="'var(--fs-' + scale.name + '-' + s + ')'">
                  <span class="stop-num">{{ s }}</span>
                </div>
              }
            </div>
            <div class="alias-row">
              @for (a of aliases; track a.alias) {
                <div class="alias-chip" [style.background]="'var(--fs-' + scale.name + '-' + a.alias + ')'">
                  <span class="alias-name">{{ a.alias }}</span>
                </div>
              }
            </div>
          </div>
        }

        <div class="scale-block">
          <div class="scale-meta"><span class="scale-name">Semánticos</span></div>
          <div class="semantic-row">
            @for (c of semanticColors; track c.name) {
              <div class="sem-item">
                <div class="sem-swatch" [style.background]="'var(--fs-' + c.name + '-base)'"></div>
                <div class="sem-muted"  [style.background]="'var(--fs-' + c.name + '-muted)'"></div>
                <code class="sem-name">{{ c.name }}</code>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ALIAS TOKENS ─────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Alias tokens</h2>
          <p class="section-desc">
            Los alias apuntan a stops de la escala y son los únicos tokens que deben usarse en componentes.
            Disponibles para: <code>primary · secondary · tertiary · neutral · success · warning · danger</code>
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Stop</th>
              <th>Uso típico</th>
            </tr>
          </thead>
          <tbody>
            @for (a of aliasTokens; track a.alias) {
              <tr>
                <td><code>--fs-&#123;color&#125;-{{ a.alias }}</code></td>
                <td><code class="stop-badge" [style.background]="'var(--fs-primary-' + a.stop + ')'">{{ a.stop }}</code></td>
                <td class="usage-cell">{{ a.usage }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <!-- SEMANTIC UI TOKENS ───────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Tokens semánticos de UI</h2>
          <p class="section-desc">
            Definidos en <code>global.scss</code>. Son los tokens que todos los componentes usan directamente.
            Se adaptan automáticamente entre light y dark mode.
          </p>
        </div>

        @for (group of uiTokenGroups; track group.label) {
          <div class="ui-group">
            <div class="ui-group-label">{{ group.label }}</div>
            <div class="ui-tokens-row">
              @for (t of group.tokens; track t.token) {
                <div class="ui-token">
                  <div class="ui-swatch" [style.background]="'var(' + t.token + ')'"></div>
                  <code class="ui-token-name">{{ t.token }}</code>
                  <span class="ui-token-desc">{{ t.desc }}</span>
                </div>
              }
            </div>
          </div>
        }
      </section>

      <!-- BORDER RADIUS ────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Border radius</h2>
        </div>
        <div class="radii-row">
          @for (r of radii; track r.name) {
            <div class="radius-item">
              <div class="radius-box" [style.border-radius]="r.val"></div>
              <code class="radius-token">--fs-radius-{{ r.name }}</code>
              <span class="radius-val">{{ r.val }}</span>
            </div>
          }
        </div>
      </section>

      <!-- SPACING ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Espaciado</h2>
        </div>
        <div class="space-list">
          @for (s of spacing; track s.token) {
            <div class="space-row">
              <code class="space-token">{{ s.token }}</code>
              <div class="space-bar-wrap">
                <div class="space-bar" [style.width.px]="s.px"></div>
              </div>
              <span class="space-val">{{ s.px }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- SHADOWS ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Sombras</h2>
        </div>
        <div class="shadow-row">
          @for (s of shadows; track s.name) {
            <div class="shadow-item" [style.box-shadow]="s.value">
              <code>--fs-shadow-{{ s.name }}</code>
            </div>
          }
          <div class="shadow-item shadow-item--pop" [style.box-shadow]="'var(--fs-color-shadow-pop)'">
            <code>--fs-color-shadow-pop</code>
            <span class="shadow-tag">dropdowns / toasts</span>
          </div>
        </div>
      </section>

      <!-- TIPOGRAFÍA ───────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Tipografía</h2>
        </div>
        <div class="type-block">
          @for (t of typeSizes; track t.token) {
            <div class="type-row">
              <span class="type-preview" [style.font-size]="t.value">fsociety UI</span>
              <code class="type-token">{{ t.token }}</code>
              <span class="type-meta">{{ t.value }} · {{ t.label }}</span>
            </div>
          }
        </div>
        <div class="type-block" style="margin-top:12px">
          @for (w of fontWeights; track w.token) {
            <div class="type-row">
              <span class="type-preview" [style.font-weight]="w.value" style="font-size:15px">fsociety UI</span>
              <code class="type-token">{{ w.token }}</code>
              <span class="type-meta">{{ w.value }} · {{ w.label }}</span>
            </div>
          }
        </div>
      </section>

      <!-- TRANSICIONES ─────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Transiciones</h2>
        </div>
        <table>
          <thead>
            <tr><th>Token</th><th>Valor</th><th>Uso</th></tr>
          </thead>
          <tbody>
            @for (t of transitions; track t.token) {
              <tr>
                <td><code>{{ t.token }}</code></td>
                <td><code class="val-code">{{ t.value }}</code></td>
                <td class="usage-cell">{{ t.label }}</td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <!-- Z-INDEX ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Z-index</h2>
        </div>
        <div class="z-row">
          @for (z of zIndex; track z.name) {
            <div class="z-item">
              <div class="z-bar" [style.height.px]="z.value / 5 + 20"></div>
              <code class="z-token">$fs-z-{{ z.name }}</code>
              <span class="z-val">{{ z.value }}</span>
            </div>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    .doc {
      padding: 32px;
      max-width: 860px;
      background: var(--fs-color-bg);
      color: var(--fs-color-text-primary);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 13px;
    }

    section { margin-bottom: 52px; }

    .section-header { margin-bottom: 20px; }

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--fs-color-text-primary);
      margin: 0 0 6px;
      letter-spacing: -0.02em;
    }

    .section-desc {
      font-size: 12.5px;
      color: var(--fs-color-text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: var(--fs-color-primary);
      background: color-mix(in srgb, var(--fs-color-primary) 8%, var(--fs-color-surface));
      padding: 1px 5px;
      border-radius: 4px;
    }

    /* ── Brand scales ─────────────────────────────────────── */
    .scale-block { margin-bottom: 24px; }

    .scale-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .scale-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--fs-color-text-primary);
      text-transform: capitalize;
    }

    .scale-hex {
      font-size: 11px;
      opacity: 0.7;
    }

    .scale-row {
      display: flex;
      border-radius: var(--fs-radius-lg);
      overflow: hidden;
      border: 1px solid var(--fs-color-border);
    }

    .stop {
      flex: 1;
      height: 52px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 5px;
    }

    .stop-num {
      font-size: 9px;
      font-weight: 700;
      color: rgba(255,255,255,0.55);
      mix-blend-mode: difference;
      font-family: 'JetBrains Mono', monospace;
    }

    .alias-row {
      display: flex;
      gap: 4px;
      margin-top: 6px;
    }

    .alias-chip {
      flex: 1;
      height: 22px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alias-name {
      font-size: 8.5px;
      font-weight: 700;
      color: rgba(255,255,255,0.6);
      mix-blend-mode: difference;
      font-family: 'JetBrains Mono', monospace;
    }

    /* ── Semantic brand ───────────────────────────────────── */
    .semantic-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .sem-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .sem-swatch {
      width: 80px;
      height: 36px;
      border-radius: var(--fs-radius-md) var(--fs-radius-md) 0 0;
      border: 1px solid var(--fs-color-border);
      border-bottom: none;
    }

    .sem-muted {
      width: 80px;
      height: 24px;
      border-radius: 0 0 var(--fs-radius-md) var(--fs-radius-md);
      border: 1px solid var(--fs-color-border);
      border-top: none;
    }

    .sem-name {
      font-size: 11px;
      text-align: center;
      display: block;
      margin-top: 2px;
    }

    /* ── Alias table ──────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }

    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--fs-color-surface-alt);
      color: var(--fs-color-text-secondary);
      font-weight: 600;
      font-size: 11px;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      border-bottom: 1px solid var(--fs-color-border);
    }

    td {
      padding: 9px 12px;
      border-bottom: 1px solid var(--fs-color-border);
      color: var(--fs-color-text-primary);
      vertical-align: middle;
    }

    .stop-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.7);
      mix-blend-mode: difference;
      background-color: inherit;
    }

    .usage-cell { color: var(--fs-color-text-secondary); font-size: 12px; }

    .val-code {
      color: var(--fs-color-text-secondary);
      background: var(--fs-color-surface-alt);
    }

    /* ── Semantic UI tokens ───────────────────────────────── */
    .ui-group { margin-bottom: 20px; }

    .ui-group-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--fs-color-text-secondary);
      margin-bottom: 8px;
    }

    .ui-tokens-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ui-token {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      width: 96px;
    }

    .ui-swatch {
      width: 96px;
      height: 44px;
      border-radius: var(--fs-radius-md);
      border: 1px solid var(--fs-color-border);
    }

    .ui-token-name {
      font-size: 9.5px;
      text-align: center;
      word-break: break-all;
      line-height: 1.3;
    }

    .ui-token-desc {
      font-size: 10px;
      color: var(--fs-color-text-secondary);
      text-align: center;
    }

    /* ── Radii ────────────────────────────────────────────── */
    .radii-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-end;
    }

    .radius-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .radius-box {
      width: 52px;
      height: 52px;
      background: var(--fs-color-surface);
      border: 1.5px solid var(--fs-color-primary);
    }

    .radius-token {
      font-size: 10px;
      text-align: center;
    }

    .radius-val {
      font-size: 10px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Spacing ──────────────────────────────────────────── */
    .space-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .space-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .space-token { min-width: 120px; flex-shrink: 0; }

    .space-bar-wrap {
      flex: 1;
      height: 16px;
      background: var(--fs-color-surface-alt);
      border-radius: 3px;
      overflow: hidden;
    }

    .space-bar {
      height: 100%;
      background: var(--fs-color-primary);
      opacity: 0.35;
      border-radius: 3px;
      min-width: 4px;
    }

    .space-val {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
      min-width: 32px;
      text-align: right;
    }

    /* ── Shadows ──────────────────────────────────────────── */
    .shadow-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-end;
    }

    .shadow-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;
      background: var(--fs-color-surface);
      border-radius: var(--fs-radius-lg);
      border: 1px solid var(--fs-color-border);
      min-width: 120px;
    }

    .shadow-item--pop {
      border-width: 0;
    }

    .shadow-tag {
      font-size: 10.5px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Typography ───────────────────────────────────────── */
    .type-block {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .type-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      padding: 7px 12px;
      border-radius: var(--fs-radius-md);
      transition: background 120ms ease;

      &:hover { background: var(--fs-color-surface-alt); }
    }

    .type-preview {
      font-family: inherit;
      color: var(--fs-color-text-primary);
      min-width: 160px;
      flex-shrink: 0;
    }

    .type-token { min-width: 160px; flex-shrink: 0; }

    .type-meta {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Z-index ──────────────────────────────────────────── */
    .z-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .z-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .z-bar {
      width: 40px;
      background: color-mix(in srgb, var(--fs-color-primary) 30%, transparent);
      border-radius: var(--fs-radius-sm) var(--fs-radius-sm) 0 0;
      border: 1px solid color-mix(in srgb, var(--fs-color-primary) 40%, transparent);
      border-bottom: none;
    }

    .z-token {
      font-size: 9px;
      text-align: center;
      line-height: 1.4;
    }

    .z-val {
      font-size: 11px;
      font-weight: 700;
      color: var(--fs-color-text-secondary);
    }
  `],
})
export class FsTokensDocComponent {

  brandScales = [
    { name: 'primary',   hex: '#2563eb' },
    { name: 'secondary', hex: '#0ea5e9' },
    { name: 'tertiary',  hex: '#22d3ee' },
  ];

  stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  aliases = [
    { alias: 'muted' }, { alias: 'subtle' }, { alias: 'tint' },
    { alias: 'light' }, { alias: 'soft' },   { alias: 'base' },
    { alias: 'hover' }, { alias: 'active' }, { alias: 'emphasis' }, { alias: 'contrast' },
  ];

  semanticColors = [
    { name: 'neutral' }, { name: 'success' }, { name: 'warning' }, { name: 'danger' },
  ];

  aliasTokens = [
    { alias: 'muted',    stop: 50,  usage: 'Badge bg, chip bg, alert sutil' },
    { alias: 'subtle',   stop: 100, usage: 'Ghost hover, row highlight' },
    { alias: 'tint',     stop: 200, usage: 'Selected bg, focus ring fill' },
    { alias: 'light',    stop: 300, usage: 'Borders sobre fondos claros' },
    { alias: 'soft',     stop: 400, usage: 'Íconos, placeholder, disabled' },
    { alias: 'base',     stop: 500, usage: 'Color principal' },
    { alias: 'hover',    stop: 600, usage: 'Hover en solid buttons' },
    { alias: 'active',   stop: 700, usage: 'Pressed / active state' },
    { alias: 'emphasis', stop: 800, usage: 'Texto sobre fondos del mismo color' },
    { alias: 'contrast', stop: 900, usage: 'Texto dark, headings sobre muted/tint' },
  ];

  uiTokenGroups = [
    {
      label: 'Superficies',
      tokens: [
        { token: '--fs-color-bg',          desc: 'Fondo de página' },
        { token: '--fs-color-surface',     desc: 'Cards, inputs, menús' },
        { token: '--fs-color-surface-alt', desc: 'Rows hover, sidebar' },
      ],
    },
    {
      label: 'Texto',
      tokens: [
        { token: '--fs-color-text-primary',     desc: 'Body principal' },
        { token: '--fs-color-text-secondary',   desc: 'Labels, hints' },
        { token: '--fs-color-text-placeholder', desc: 'Placeholder inputs' },
      ],
    },
    {
      label: 'Bordes',
      tokens: [
        { token: '--fs-color-border',        desc: 'Divisores, menús' },
        { token: '--fs-color-border-field',  desc: 'Input en reposo' },
        { token: '--fs-color-border-strong', desc: 'Input hover, checkboxes' },
      ],
    },
    {
      label: 'Semánticos',
      tokens: [
        { token: '--fs-color-primary', desc: 'Acento principal' },
        { token: '--fs-color-error',   desc: 'Error / danger' },
        { token: '--fs-color-success', desc: 'Éxito' },
        { token: '--fs-color-warning', desc: 'Advertencia' },
      ],
    },
  ];

  radii = [
    { name: 'sm',   val: '4px'    },
    { name: 'md',   val: '6px'    },
    { name: 'lg',   val: '8px'    },
    { name: 'xl',   val: '12px'   },
    { name: '2xl',  val: '16px'   },
    { name: 'full', val: '9999px' },
  ];

  spacing = [
    { token: '--fs-space-1',  px: 4  },
    { token: '--fs-space-2',  px: 8  },
    { token: '--fs-space-3',  px: 12 },
    { token: '--fs-space-4',  px: 16 },
    { token: '--fs-space-6',  px: 24 },
    { token: '--fs-space-8',  px: 32 },
    { token: '--fs-space-10', px: 40 },
    { token: '--fs-space-12', px: 48 },
    { token: '--fs-space-16', px: 64 },
  ];

  shadows = [
    { name: 'sm', value: '0 1px 2px rgba(0,0,0,0.06)' },
    { name: 'md', value: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)' },
    { name: 'lg', value: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)' },
  ];

  typeSizes = [
    { token: '$fs-text-xs',   value: '12px', label: 'badges, captions' },
    { token: '$fs-text-sm',   value: '14px', label: 'body secundario' },
    { token: '$fs-text-base', value: '16px', label: 'body principal' },
    { token: '$fs-text-lg',   value: '18px', label: 'subtítulos' },
    { token: '$fs-text-xl',   value: '20px', label: 'títulos de sección' },
    { token: '$fs-text-2xl',  value: '24px', label: 'headings' },
    { token: '$fs-text-3xl',  value: '30px', label: 'display' },
  ];

  fontWeights = [
    { token: '$fs-font-regular', value: 400, label: 'body text' },
    { token: '$fs-font-medium',  value: 500, label: 'labels, tabs' },
    { token: '$fs-font-semi',    value: 600, label: 'tabs activos, títulos' },
    { token: '$fs-font-bold',    value: 700, label: 'headings' },
  ];

  transitions = [
    { token: '--fs-duration-fast',   value: '100ms', label: 'colores, opacidad rápida' },
    { token: '--fs-duration-normal', value: '200ms', label: 'mayoría de transiciones' },
    { token: '--fs-duration-slow',   value: '350ms', label: 'spinner, entradas de página' },
  ];

  zIndex = [
    { name: 'base',     value: 0   },
    { name: 'raised',   value: 10  },
    { name: 'dropdown', value: 100 },
    { name: 'sticky',   value: 200 },
    { name: 'overlay',  value: 300 },
    { name: 'modal',    value: 400 },
    { name: 'toast',    value: 500 },
    { name: 'tooltip',  value: 600 },
  ];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<FsTokensDocComponent> = {
  title: 'Foundations/Tokens',
  component: FsTokensDocComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Sistema de design tokens — escalas de color, alias semánticos, tipografía, espaciado, radios, sombras y z-index.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsTokensDocComponent>;

export const DesignTokens: Story = {
  name: 'Design tokens',
};
