import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';

@Component({
  selector: 'fs-mixins-doc',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="doc">

      <!-- USO -->
      <section>
        <h2>Uso</h2>
        <p class="desc">
          Los mixins se pueden usar de dos formas — con <code>@include</code> en SCSS
          o como clases utilitarias directamente en el HTML.
        </p>
        <div class="code-block">
          <div class="code-label">con @include en SCSS del componente</div>
          <pre>{{ includeExample }}</pre>
        </div>
        <div class="code-block" style="margin-top:10px">
          <div class="code-label">clases directas en HTML</div>
          <pre>{{ classExample }}</pre>
        </div>
      </section>

      <!-- FLEXBOX -->
      <section>
        <h2>Flexbox / layout</h2>
        <div class="demo-grid">

          <div class="demo-card" *ngFor="let f of flexDemos">
            <div class="demo-label">{{ f.label }}</div>
            <div class="demo-box" [ngClass]="f.class" [ngStyle]="f.style">
              <div class="dot" *ngFor="let d of f.dots">{{ d }}</div>
            </div>
            <code class="demo-code">{{ f.code }}</code>
          </div>

        </div>
      </section>

      <!-- GAP -->
      <section>
        <h2>Gap</h2>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div *ngFor="let g of gapDemos" style="display:flex; align-items:center; gap:16px;">
            <code style="min-width:80px; font-size:11px; color:#60a5fa;">.gap-{{ g.key }}</code>
            <div style="display:flex;" [ngStyle]="{'gap': g.val}">
              <div class="chip" *ngFor="let c of ['A','B','C']">{{ c }}</div>
            </div>
            <span style="font-size:11px; color:rgba(255,255,255,0.3)">{{ g.val }}</span>
          </div>
        </div>
      </section>

      <!-- SPACING PADDING -->
      <section>
        <h2>Spacing — padding</h2>
        <p class="desc">Clases disponibles: <code>p-{n}</code> · <code>px-{n}</code> · <code>py-{n}</code> · <code>pl-{n}</code> · <code>pr-{n}</code> · <code>pt-{n}</code> · <code>pb-{n}</code></p>
        <div class="sp-grid">
          <div class="sp-card" *ngFor="let s of paddingDemos">
            <div class="sp-label">{{ s.class }}</div>
            <div class="sp-inner" [ngStyle]="s.style">
              <div class="sp-content">{{ s.value }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SPACING MARGIN -->
      <section>
        <h2>Spacing — margin</h2>
        <p class="desc">Clases disponibles: <code>m-{n}</code> · <code>mx-{n}</code> · <code>my-{n}</code> · <code>ml-{n}</code> · <code>mr-{n}</code> · <code>mt-{n}</code> · <code>mb-{n}</code> · <code>mx-auto</code></p>
        <div class="sp-grid">
          <div class="sp-card" *ngFor="let s of marginDemos">
            <div class="sp-label">{{ s.class }}</div>
            <div class="sp-outer">
              <div class="sp-inner-m" [ngStyle]="s.style">{{ s.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- TIPOGRAFÍA -->
      <section>
        <h2>Tipografía</h2>

        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
          <div>
            <div class="t-truncate">Este texto es muy largo y se corta con puntos suspensivos cuando supera el ancho disponible del contenedor</div>
            <code class="demo-code">.truncate — @include truncate</code>
          </div>
          <div>
            <div class="t-clamp2">Este texto tiene un máximo de dos líneas. Si hay más contenido se recorta automáticamente con puntos suspensivos al final de la segunda línea visible.</div>
            <code class="demo-code">.truncate-2 — @include truncate-lines(2)</code>
          </div>
          <div>
            <div class="t-clamp3">Este texto tiene un máximo de tres líneas. Si hay más contenido se recorta automáticamente con puntos suspensivos al final de la tercera línea visible en el componente.</div>
            <code class="demo-code">.truncate-3 — @include truncate-lines(3)</code>
          </div>
          <div>
            <div class="t-upper">Frontend Developer Angular</div>
            <code class="demo-code">.uppercase-label — @include uppercase-label</code>
          </div>
          <div>
            <div class="t-mono">const version = '0.0.3';</div>
            <code class="demo-code">.font-mono — @include font-mono</code>
          </div>
        </div>

        <div class="demo-label" style="margin-bottom:8px">font-size</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div *ngFor="let t of textSizes" style="display:flex; align-items:baseline; gap:16px;">
            <code style="min-width:100px; font-size:11px; color:#60a5fa;">.text-{{ t.name }}</code>
            <span [ngStyle]="{'font-size': t.size, 'color': 'rgba(255,255,255,0.7)'}">fsociety UI</span>
            <span style="font-size:11px; color:rgba(255,255,255,0.25)">{{ t.size }}</span>
          </div>
        </div>

        <div class="demo-label" style="margin-top:16px; margin-bottom:8px">font-weight</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div *ngFor="let w of fontWeights" style="display:flex; align-items:center; gap:16px;">
            <code style="min-width:130px; font-size:11px; color:#60a5fa;">.font-{{ w.name }}</code>
            <span [ngStyle]="{'font-weight': w.weight, 'font-size': '15px', 'color': 'rgba(255,255,255,0.8)'}">fsociety UI</span>
            <span style="font-size:11px; color:rgba(255,255,255,0.25)">{{ w.weight }}</span>
          </div>
        </div>
      </section>

      <!-- RESPONSIVE -->
      <section>
        <h2>Responsive — respond-to()</h2>
        <p class="desc">Breakpoints disponibles: <code>sm</code> 640px · <code>md</code> 768px · <code>lg</code> 1024px · <code>xl</code> 1280px · <code>2xl</code> 1536px</p>
        <div class="code-block">
          <div class="code-label">uso con @include en SCSS</div>
          <pre>{{ responsiveExample }}</pre>
        </div>
        <div class="resp-grid" style="margin-top:12px">
          <div class="resp-card" *ngFor="let c of [1,2,3]">
            card {{ c }}
            <span class="resp-note">sm: 2 cols · lg: 3 cols</span>
          </div>
        </div>
      </section>

      <!-- VISUAL -->
      <section>
        <h2>Visual / UI</h2>
        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:flex-start;">

          <div>
            <div class="v-card">
              <div style="font-size:12px; color:rgba(255,255,255,0.6)">card-surface</div>
            </div>
            <code class="demo-code">.card-surface — @include card-surface</code>
          </div>

          <div>
            <div class="v-glass">
              <div style="font-size:12px; color:rgba(255,255,255,0.7)">glass</div>
            </div>
            <code class="demo-code">.glass — @include glass</code>
          </div>

          <div>
            <div class="v-divider"></div>
            <code class="demo-code">.divider — @include divider</code>
          </div>

          <div>
            <button class="v-btn-reset">botón sin estilos →</button>
            <code class="demo-code">@include reset-button</code>
          </div>

        </div>

        <div style="margin-top:16px">
          <div class="demo-label" style="margin-bottom:8px">border-radius</div>
          <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:flex-end;">
            <div *ngFor="let r of radii" style="display:flex; flex-direction:column; align-items:center; gap:6px;">
              <div [ngStyle]="{'width':'48px','height':'48px','background':'#1d2736','border':'1.5px solid #2563eb','border-radius': r.val}"></div>
              <code style="font-size:9px; color:#60a5fa">.rounded-{{ r.name }}</code>
            </div>
          </div>
        </div>
      </section>

      <!-- BADGE HELPERS -->
      <section>
        <h2>Badge / color helpers</h2>
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:10px;">
          <span class="bv-primary">Angular</span>
          <span class="bv-secondary">TypeScript</span>
          <span class="bv-danger">Error</span>
          <span class="bv-success">Activo</span>
          <span class="bo-primary">outline primary</span>
          <span class="bo-danger">outline danger</span>
        </div>
        <div class="code-block">
          <div class="code-label">uso con @include</div>
          <pre>{{ badgeExample }}</pre>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .doc { font-family: 'JetBrains Mono', monospace; padding: 24px; max-width: 900px; color: #e6edf3; }
    section { margin-bottom: 48px; }
    h2 { font-size: 16px; font-weight: 600; color: #e6edf3; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px; }
    .desc { font-size: 12px; color: #8b949e; margin-bottom: 14px; line-height: 1.7; }
    code { color: #60a5fa; font-family: 'JetBrains Mono', monospace; font-size: 11px; }

    .code-block { background: #0d1117; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px 14px; }
    .code-label { font-size: 10px; color: rgba(255,255,255,0.3); margin-bottom: 6px; }
    pre { font-size: 12px; color: #60a5fa; white-space: pre-wrap; margin: 0; line-height: 1.7; }

    /* flex demos */
    .demo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
    .demo-card { display: flex; flex-direction: column; gap: 6px; }
    .demo-label { font-size: 11px; color: rgba(255,255,255,0.4); }
    .demo-box { background: #0d1117; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 8px; min-height: 60px; padding: 8px; }
    .demo-code { font-size: 10px; color: #60a5fa; }
    .dot { width: 28px; height: 28px; border-radius: 50%; background: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: 600; flex-shrink: 0; }
    .chip { background: rgba(37,99,235,0.15); color: #93c5fd; border-radius: 4px; padding: 4px 8px; font-size: 11px; flex-shrink: 0; }

    /* spacing */
    .sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
    .sp-card { background: #161b22; border: 0.5px solid rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
    .sp-label { font-size: 10px; color: rgba(255,255,255,0.3); padding: 5px 8px; background: rgba(255,255,255,0.03); }
    .sp-inner { background: #0d1117; }
    .sp-content { background: rgba(37,99,235,0.15); color: #93c5fd; font-size: 11px; text-align: center; border-radius: 3px; }
    .sp-outer { background: rgba(245,158,11,0.06); border: 1px dashed rgba(245,158,11,0.2); border-radius: 4px; padding: 4px; }
    .sp-inner-m { background: #0d1117; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 4px; font-size: 11px; color: rgba(255,255,255,0.5); padding: 6px 8px; text-align: center; }

    /* tipografía */
    .t-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px; color: rgba(255,255,255,0.7); font-size: 13px; }
    .t-clamp2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: rgba(255,255,255,0.7); font-size: 13px; max-width: 400px; line-height: 1.6; }
    .t-clamp3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; color: rgba(255,255,255,0.7); font-size: 13px; max-width: 400px; line-height: 1.6; }
    .t-upper { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
    .t-mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #60a5fa; }

    /* responsive */
    .resp-grid { display: grid; grid-template-columns: 1fr; gap: 8px; }
    @media (min-width: 640px) { .resp-grid { grid-template-columns: 1fr 1fr; } }
    @media (min-width: 1024px) { .resp-grid { grid-template-columns: repeat(3, 1fr); } }
    .resp-card { background: #0d1117; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; font-size: 12px; color: rgba(255,255,255,0.6); display: flex; flex-direction: column; gap: 4px; }
    .resp-note { font-size: 10px; color: rgba(255,255,255,0.25); }

    /* visual */
    .v-card { background: #0d1117; border: 0.5px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; width: 140px; transition: border-color 150ms; }
    .v-card:hover { border-color: rgba(255,255,255,0.14); }
    .v-glass { background: rgba(255,255,255,0.05); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; width: 140px; }
    .v-divider { height: 0.5px; background: rgba(255,255,255,0.1); width: 200px; margin: 8px 0; }
    .v-btn-reset { background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; color: #60a5fa; font-size: 13px; }

    /* badge helpers */
    .bv-primary   { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:rgba(37,99,235,0.15);color:#93c5fd;border:1px solid rgba(37,99,235,0.3); }
    .bv-secondary { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:rgba(14,165,233,0.15);color:#7dd3fc;border:1px solid rgba(14,165,233,0.3); }
    .bv-danger    { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:rgba(244,63,94,0.15);color:#fb7185;border:1px solid rgba(244,63,94,0.3); }
    .bv-success   { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:rgba(34,197,94,0.15);color:#86efac;border:1px solid rgba(34,197,94,0.3); }
    .bo-primary   { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:transparent;color:#2563eb;border:1px solid #2563eb; }
    .bo-danger    { display:inline-flex;align-items:center;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:500;background:transparent;color:#f43f5e;border:1px solid #f43f5e; }
  `],
})
export class FsMixinsDocComponent {

  flexDemos = [
    { label: 'flex-center',     class: ['demo-box','flex-center'],  style: { height: '70px' }, dots: ['·'], code: '@include flex-center' },
    { label: 'flex-between',    class: ['demo-box','flex-between'], style: { height: '70px', padding: '0 12px' }, dots: ['A','B'], code: '@include flex-between' },
    { label: 'flex-col',        class: ['demo-box','flex-col'],     style: { gap: '6px', padding: '10px' }, dots: ['1','2','3'], code: '@include flex-col' },
    { label: 'stack(12px)',     class: ['demo-box'],                style: { display:'flex', flexDirection:'column', gap:'12px', padding:'10px' }, dots: ['A','B','C'], code: '@include stack(12px)' },
    { label: 'inline-flex-center', class: ['demo-box','inline-flex-center'], style: { height: '70px', width: '100%' }, dots: ['HC'], code: '@include inline-flex-center' },
    { label: 'flex-end',        class: ['demo-box','flex-end'],     style: { height: '70px', padding: '0 10px' }, dots: ['→'], code: '@include flex-end' },
  ];

  gapDemos = [
    { key: 1, val: '4px' }, { key: 2, val: '8px' }, { key: 3, val: '12px' },
    { key: 4, val: '16px' }, { key: 6, val: '24px' }, { key: 8, val: '32px' },
  ];

  paddingDemos = [
    { class: 'px-4',  value: 'px = 16px', style: { padding: '10px 0' } },
    { class: 'py-3',  value: 'py = 12px', style: { padding: '0 10px' } },
    { class: 'pl-6',  value: 'pl = 24px', style: { padding: '8px 0 8px 24px', borderLeft: '3px solid #f59e0b' } },
    { class: 'pr-2',  value: 'pr = 8px',  style: { padding: '8px 8px 8px 0', borderRight: '3px solid #f59e0b' } },
    { class: 'pt-4',  value: 'pt = 16px', style: { paddingTop: '16px', borderTop: '3px solid #22d3ee' } },
    { class: 'pb-4',  value: 'pb = 16px', style: { paddingBottom: '16px', borderBottom: '3px solid #22d3ee' } },
    { class: 'p-4',   value: 'p = 16px',  style: { padding: '16px', outline: '2px dashed rgba(37,99,235,0.4)' } },
    { class: 'py-6',  value: 'py = 24px', style: { padding: '0 8px' } },
  ];

  marginDemos = [
    { class: 'mt-4', label: 'mt = 16px', style: { marginTop: '16px' } },
    { class: 'mb-4', label: 'mb = 16px', style: { marginBottom: '16px' } },
    { class: 'ml-4', label: 'ml = 16px', style: { marginLeft: '16px' } },
    { class: 'mr-4', label: 'mr = 16px', style: { marginRight: '16px' } },
    { class: 'mx-auto', label: 'centrado', style: { marginLeft: 'auto', marginRight: 'auto', width: '60%' } },
    { class: 'my-3', label: 'my = 12px', style: { marginTop: '12px', marginBottom: '12px' } },
  ];

  textSizes = [
    { name: 'xs',   size: '12px' }, { name: 'sm',   size: '14px' },
    { name: 'base', size: '16px' }, { name: 'lg',   size: '18px' },
    { name: 'xl',   size: '20px' }, { name: '2xl',  size: '24px' },
    { name: '3xl',  size: '30px' },
  ];

  fontWeights = [
    { name: 'regular', weight: 400 }, { name: 'medium', weight: 500 },
    { name: 'semi',    weight: 600 }, { name: 'bold',   weight: 700 },
  ];

  radii = [
    { name: 'sm',   val: '4px'   }, { name: 'md',   val: '6px'   },
    { name: 'lg',   val: '8px'   }, { name: 'xl',   val: '12px'  },
    { name: '2xl',  val: '16px'  }, { name: 'full', val: '9999px' },
  ];

  includeExample = `@use '@heroelc/fsociety/styles/mixins' as m;
@use '@heroelc/fsociety/styles/tokens' as t;

.experiencia-section {
  @include m.stack(t.$fs-space-6);

  @include m.respond-to('md') {
    @include m.flex-between;
  }
}

.card-titulo {
  @include m.truncate;
  @include m.pl(4);
  @include m.mb(2);
}`;

  classExample = `<!-- directo en el HTML -->
<div class="flex-between px-6 py-4">
  <div class="truncate-2 text-sm font-medium">...</div>
  <span class="uppercase-label mt-2">Frontend Developer</span>
</div>

<ul class="reset-list stack gap-4">
  <li class="flex-start pl-3">item</li>
</ul>`;

  responsiveExample = `@use '@heroelc/fsociety/styles/mixins' as m;

.grid {
  display: grid;
  grid-template-columns: 1fr;          // mobile: 1 columna

  @include m.respond-to('sm') {
    grid-template-columns: 1fr 1fr;    // ≥640px: 2 columnas
  }

  @include m.respond-to('lg') {
    grid-template-columns: repeat(3, 1fr); // ≥1024px: 3 columnas
  }
}`;

  badgeExample = `@use '@heroelc/fsociety/styles/mixins' as m;

.mi-badge {
  // filled
  @include m.badge-variant(
    $base:   #93c5fd,
    $bg:     rgba(37, 99, 235, 0.15),
    $border: rgba(37, 99, 235, 0.30)
  );

  // outline
  @include m.badge-outline(#2563eb);

  // dot de estado
  .dot { @include m.dot-indicator(#22c55e, 7px); }

  // degradé indicator (como los tabs)
  .bar { @include m.gradient-indicator; }
}`;
}

const meta: Meta<FsMixinsDocComponent> = {
  title:     'fsociety/Mixins',
  component: FsMixinsDocComponent,
  tags:      ['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'Mixins SCSS reutilizables y clases utilitarias de fsociety — flexbox, spacing, tipografía, responsive y helpers visuales.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsMixinsDocComponent>;

export const MixinsDoc: Story = {
  name: 'Mixins & utilidades',
};
