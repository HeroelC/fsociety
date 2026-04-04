import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';

@Component({
  selector: 'fs-tokens-doc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc">

      <section>
        <h2>Colores brand</h2>
        <p class="desc">
          Cada color base genera 10 stops con <code>generate-scale()</code>.
          Usá siempre los alias — nunca los stops numéricos directamente.
        </p>

        <div class="scale-label">primary — #2563eb</div>
        <div class="scale-row">
          <div *ngFor="let s of primaryScale" class="stop" [style.background]="s.color">
            <span class="stop-num" [style.color]="s.text">{{ s.stop }}</span>
            <span class="stop-alias" [style.color]="s.text">{{ s.alias }}</span>
          </div>
        </div>

        <div class="scale-label mt">secondary — #0ea5e9</div>
        <div class="scale-row">
          <div *ngFor="let s of secondaryScale" class="stop" [style.background]="s.color">
            <span class="stop-num" [style.color]="s.text">{{ s.stop }}</span>
          </div>
        </div>

        <div class="scale-label mt">tertiary — #22d3ee</div>
        <div class="scale-row">
          <div *ngFor="let s of tertiaryScale" class="stop" [style.background]="s.color">
            <span class="stop-num" [style.color]="s.text">{{ s.stop }}</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Colores semánticos</h2>
        <div class="semantic-grid">
          <div *ngFor="let s of semanticColors" class="semantic-card">
            <div class="semantic-swatches">
              <div class="swatch" [style.background]="s.base"></div>
              <div class="swatch" [style.background]="s.muted" style="border-left:1px solid rgba(0,0,0,0.08)"></div>
            </div>
            <div class="semantic-meta">
              <span class="semantic-name">{{ s.name }}</span>
              <code>--fs-{{ s.name }}-base · {{ s.base }}</code>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Alias tokens de estado</h2>
        <p class="desc">Disponibles para: primary · secondary · tertiary · neutral · success · warning · danger</p>
        <table>
          <thead>
            <tr><th>Token</th><th>Stop</th><th>Uso típico</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of aliasTokens">
              <td><code>--fs-&lbrace;color&rbrace;-{{ a.alias }}</code></td>
              <td><code>{{ a.stop }}</code></td>
              <td>{{ a.usage }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Tipografía</h2>
        <div class="type-stack">
          <div *ngFor="let t of typeSizes" class="type-row">
            <span class="type-preview" [style.fontSize]="t.value">fsociety UI</span>
            <code class="type-token">{{ t.token }}</code>
            <span class="type-val">{{ t.value }} — {{ t.label }}</span>
          </div>
        </div>
        <div class="type-stack" style="margin-top:12px">
          <div *ngFor="let w of fontWeights" class="type-row">
            <span class="type-preview" [style.fontWeight]="w.value" style="font-size:15px">fsociety UI</span>
            <code class="type-token">{{ w.token }}</code>
            <span class="type-val">{{ w.value }} — {{ w.label }}</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Espaciado</h2>
        <div class="space-stack">
          <div *ngFor="let s of spacing" class="space-row">
            <div class="space-bar" [style.width.px]="s.px"></div>
            <code class="space-token">{{ s.token }}</code>
            <span class="space-val">{{ s.px }}px</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Border radius</h2>
        <div class="radii-row">
          <div *ngFor="let r of radii" class="radius-item">
            <div class="radius-box" [style.borderRadius]="r.px > 100 ? '9999px' : r.px + 'px'"></div>
            <code>{{ r.name }}</code>
            <span class="radius-val">{{ r.px > 100 ? '9999px' : r.px + 'px' }}</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Transiciones</h2>
        <div class="trans-stack">
          <div *ngFor="let t of transitions" class="trans-row">
            <code class="trans-token">{{ t.token }}</code>
            <span class="trans-val">{{ t.value }}</span>
            <span class="trans-label">{{ t.label }}</span>
          </div>
        </div>
      </section>

      <section>
        <h2>Tokens de componentes — fs-tabs</h2>
        <table style="margin-top:12px">
          <thead>
            <tr><th>Token</th><th>Default</th><th>Controla</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of tabTokens">
              <td><code>{{ t.token }}</code></td>
              <td><code>{{ t.default }}</code></td>
              <td>{{ t.controls }}</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  `,
  styles: [`
    .doc { font-family: 'JetBrains Mono', monospace; padding: 24px; max-width: 900px; color: #e6edf3; }
    section { margin-bottom: 48px; }
    h2 { font-size: 16px; font-weight: 600; color: #e6edf3; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; }
    .desc { font-size: 12px; color: #8b949e; margin-bottom: 16px; line-height: 1.7; }
    code { color: #60a5fa; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

    .scale-label { font-size: 11px; color: #8b949e; margin-bottom: 6px; }
    .mt { margin-top: 16px; }
    .scale-row { display: flex; border-radius: 8px; overflow: hidden; border: 0.5px solid rgba(255,255,255,0.06); }
    .stop { flex: 1; height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
    .stop-num   { font-size: 9px; font-weight: 600; }
    .stop-alias { font-size: 8px; opacity: 0.8; }

    .semantic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px,1fr)); gap: 10px; }
    .semantic-card { border-radius: 8px; overflow: hidden; border: 0.5px solid rgba(255,255,255,0.06); }
    .semantic-swatches { display: flex; }
    .swatch { flex: 1; height: 44px; }
    .semantic-meta { background: #0d1117; padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
    .semantic-name { font-size: 12px; font-weight: 600; color: #e6edf3; }

    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { text-align: left; padding: 8px 12px; background: #161b22; color: #8b949e; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.08); }
    td { padding: 8px 12px; border-bottom: 0.5px solid rgba(255,255,255,0.05); color: #e6edf3; }

    .type-stack { display: flex; flex-direction: column; gap: 4px; }
    .type-row { display: flex; align-items: baseline; gap: 16px; padding: 8px 12px; background: #0d1117; border-radius: 6px; }
    .type-preview { color: #e6edf3; min-width: 160px; font-family: inherit; }
    .type-token { min-width: 160px; }
    .type-val   { font-size: 10px; color: #4b5563; }

    .space-stack { display: flex; flex-direction: column; gap: 8px; }
    .space-row { display: flex; align-items: center; gap: 16px; }
    .space-bar { height: 16px; background: #2563eb; border-radius: 2px; flex-shrink: 0; min-width: 4px; }
    .space-token { min-width: 120px; }
    .space-val   { font-size: 10px; color: #4b5563; }

    .radii-row { display: flex; flex-wrap: wrap; gap: 20px; }
    .radius-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .radius-box { width: 52px; height: 52px; background: #1d2736; border: 1.5px solid #2563eb; }
    .radius-val { font-size: 9px; color: #4b5563; }

    .trans-stack { display: flex; flex-direction: column; gap: 4px; }
    .trans-row { display: flex; align-items: center; gap: 16px; padding: 10px 12px; background: #0d1117; border-radius: 6px; }
    .trans-token { min-width: 200px; }
    .trans-val   { font-size: 13px; color: #e6edf3; min-width: 60px; }
    .trans-label { font-size: 11px; color: #4b5563; }
  `],
})
export class FsTokensDocComponent {
  primaryScale = [
    { stop: 50,  alias: 'muted',    color: '#eef3fe', text: '#1e3a8a' },
    { stop: 100, alias: 'subtle',   color: '#d5e2fc', text: '#1e3a8a' },
    { stop: 200, alias: 'tint',     color: '#adc4f9', text: '#1e3a8a' },
    { stop: 300, alias: 'light',    color: '#7aa3f5', text: '#fff' },
    { stop: 400, alias: 'soft',     color: '#4782f2', text: '#fff' },
    { stop: 500, alias: 'base',     color: '#2563eb', text: '#fff' },
    { stop: 600, alias: 'hover',    color: '#1d55d4', text: '#fff' },
    { stop: 700, alias: 'active',   color: '#1646bc', text: '#fff' },
    { stop: 800, alias: 'emphasis', color: '#0f35a4', text: '#fff' },
    { stop: 900, alias: 'contrast', color: '#082494', text: '#fff' },
  ];
  secondaryScale = [
    { stop: 50,  color: '#e0f6ff', text: '#0c4a6e' },
    { stop: 100, color: '#b9ebfd', text: '#0c4a6e' },
    { stop: 200, color: '#84d9fb', text: '#0c4a6e' },
    { stop: 300, color: '#4ec6f8', text: '#fff' },
    { stop: 400, color: '#22b2f5', text: '#fff' },
    { stop: 500, color: '#0ea5e9', text: '#fff' },
    { stop: 600, color: '#0896d8', text: '#fff' },
    { stop: 700, color: '#0386c1', text: '#fff' },
    { stop: 800, color: '#0272a4', text: '#fff' },
    { stop: 900, color: '#015a82', text: '#fff' },
  ];
  tertiaryScale = [
    { stop: 50,  color: '#ecfeff', text: '#164e63' },
    { stop: 100, color: '#cffafe', text: '#164e63' },
    { stop: 200, color: '#a5f3fc', text: '#164e63' },
    { stop: 300, color: '#67e8f9', text: '#164e63' },
    { stop: 400, color: '#22d3ee', text: '#164e63' },
    { stop: 500, color: '#06b6d4', text: '#fff' },
    { stop: 600, color: '#0891b2', text: '#fff' },
    { stop: 700, color: '#0e7490', text: '#fff' },
    { stop: 800, color: '#155e75', text: '#fff' },
    { stop: 900, color: '#164e63', text: '#fff' },
  ];
  semanticColors = [
    { name: 'success', base: '#22c55e', muted: '#f0fdf4' },
    { name: 'warning', base: '#f59e0b', muted: '#fffbeb' },
    { name: 'danger',  base: '#f43f5e', muted: '#fff1f2' },
    { name: 'neutral', base: '#64748b', muted: '#f8fafc' },
  ];
  aliasTokens = [
    { alias: 'muted',    stop: 50,  usage: 'Badge bg, chip, alert sutil' },
    { alias: 'subtle',   stop: 100, usage: 'Ghost hover bg, row hover' },
    { alias: 'tint',     stop: 200, usage: 'Selected bg, focus fill' },
    { alias: 'light',    stop: 300, usage: 'Borders sobre fondos claros' },
    { alias: 'soft',     stop: 400, usage: 'Íconos, placeholder, disabled' },
    { alias: 'base',     stop: 500, usage: 'Color principal' },
    { alias: 'hover',    stop: 600, usage: 'Hover en solid buttons' },
    { alias: 'active',   stop: 700, usage: 'Pressed / active state' },
    { alias: 'emphasis', stop: 800, usage: 'Texto sobre mismo color' },
    { alias: 'contrast', stop: 900, usage: 'Texto dark sobre tint/muted' },
  ];
  typeSizes = [
    { token: '$fs-text-xs',   value: '12px', label: 'badges, captions' },
    { token: '$fs-text-sm',   value: '14px', label: 'body secundario, tabs' },
    { token: '$fs-text-base', value: '16px', label: 'body principal' },
    { token: '$fs-text-lg',   value: '18px', label: 'subtítulos' },
    { token: '$fs-text-xl',   value: '20px', label: 'títulos de sección' },
    { token: '$fs-text-2xl',  value: '24px', label: 'headings' },
    { token: '$fs-text-3xl',  value: '30px', label: 'display' },
  ];
  fontWeights = [
    { token: '$fs-font-regular', value: 400, label: 'body text' },
    { token: '$fs-font-medium',  value: 500, label: 'labels, tabs' },
    { token: '$fs-font-semi',    value: 600, label: 'tabs activos' },
    { token: '$fs-font-bold',    value: 700, label: 'headings' },
  ];
  spacing = [
    { token: '$fs-space-1',  px: 4 },
    { token: '$fs-space-2',  px: 8 },
    { token: '$fs-space-3',  px: 12 },
    { token: '$fs-space-4',  px: 16 },
    { token: '$fs-space-6',  px: 24 },
    { token: '$fs-space-8',  px: 32 },
    { token: '$fs-space-10', px: 40 },
    { token: '$fs-space-12', px: 48 },
    { token: '$fs-space-16', px: 64 },
  ];
  radii = [
    { name: 'sm',   px: 4 },
    { name: 'md',   px: 6 },
    { name: 'lg',   px: 8 },
    { name: 'xl',   px: 12 },
    { name: '2xl',  px: 16 },
    { name: 'full', px: 9999 },
  ];
  transitions = [
    { token: '--fs-duration-fast',   value: '100ms', label: 'colores, opacidad' },
    { token: '--fs-duration-normal', value: '200ms', label: 'mayoría de transiciones' },
    { token: '--fs-duration-slow',   value: '350ms', label: 'spinner, entradas' },
  ];
  tabTokens = [
    { token: '--fs-tab-bg',             default: '#0d1117',                controls: 'Fondo del header' },
    { token: '--fs-tab-color',          default: 'rgba(255,255,255,0.40)', controls: 'Texto inactivo' },
    { token: '--fs-tab-color-hover',    default: 'rgba(255,255,255,0.70)', controls: 'Texto en hover' },
    { token: '--fs-tab-color-active',   default: '#ffffff',                controls: 'Texto tab activa' },
    { token: '--fs-tab-border',         default: 'rgba(255,255,255,0.08)', controls: 'Línea separadora' },
    { token: '--fs-tab-hover-bg',       default: 'rgba(255,255,255,0.03)', controls: 'Fondo en hover' },
    { token: '--fs-tab-indicator-from', default: 'var(--fs-primary-base)', controls: 'Color inicio degradé' },
    { token: '--fs-tab-indicator-to',   default: 'var(--fs-tertiary-base)',controls: 'Color fin degradé' },
    { token: '--fs-tab-indicator-glow', default: 'rgba(34,211,238,0.45)',  controls: 'Glow del indicator' },
  ];
}

const meta: Meta<FsTokensDocComponent> = {
  title:     'fsociety/Tokens',
  component: FsTokensDocComponent,
  tags:      ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'Sistema de design tokens de fsociety — colores, tipografía, espaciado, radios y transiciones.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsTokensDocComponent>;

export const DesignTokens: Story = {
  name: 'Design tokens',
};
