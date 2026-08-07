import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'fs-mixins-doc',
  standalone: true,
  // NgStyle is required: the flex, padding, margin and typography demos all
  // drive their previews through [ngStyle]. Without it every one of those
  // bindings fails and the demos render as empty boxes.
  imports: [NgStyle],
  template: `
    <div class="doc">

      <!-- USO ──────────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Uso</h2>
          <p class="section-desc">
            Los mixins se pueden usar de dos formas: con <code>&#64;include</code> en SCSS
            o como clases utilitarias directamente en el HTML.
          </p>
        </div>
        <div class="code-pair">
          <div class="code-block">
            <div class="code-label">SCSS — con &#64;include</div>
            <pre>{{ includeExample }}</pre>
          </div>
          <div class="code-block">
            <div class="code-label">HTML — clases utilitarias</div>
            <pre>{{ classExample }}</pre>
          </div>
        </div>
      </section>

      <!-- FLEXBOX ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Flexbox / layout</h2>
        </div>
        <div class="flex-grid">
          @for (f of flexDemos; track f.label) {
            <div class="demo-card">
              <div class="demo-preview" [ngStyle]="f.containerStyle">
                @for (d of f.dots; track d) {
                  <div class="dot">{{ d }}</div>
                }
              </div>
              <code class="demo-code">{{ f.code }}</code>
              <span class="demo-label">{{ f.label }}</span>
            </div>
          }
        </div>
      </section>

      <!-- GAP ──────────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Gap</h2>
        </div>
        <div class="gap-list">
          @for (g of gapDemos; track g.key) {
            <div class="gap-row">
              <code class="gap-token">.gap-{{ g.key }}</code>
              <div class="chips" [style.gap]="g.val">
                @for (c of ['A', 'B', 'C']; track c) {
                  <span class="chip">{{ c }}</span>
                }
              </div>
              <span class="gap-val">{{ g.val }}</span>
            </div>
          }
        </div>
      </section>

      <!-- PADDING ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Padding</h2>
          <p class="section-desc">
            <code>p-n</code> · <code>px-n</code> · <code>py-n</code> ·
            <code>pt-n</code> · <code>pr-n</code> · <code>pb-n</code> · <code>pl-n</code>
          </p>
        </div>
        <div class="sp-grid">
          @for (s of paddingDemos; track s.class) {
            <div class="sp-card">
              <div class="sp-tag">{{ s.class }}</div>
              <div class="sp-box" [ngStyle]="s.style">
                <div class="sp-inner">{{ s.value }}</div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- MARGIN ───────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Margin</h2>
          <p class="section-desc">
            <code>m-n</code> · <code>mx-n</code> · <code>my-n</code> ·
            <code>mt-n</code> · <code>mr-n</code> · <code>mb-n</code> · <code>ml-n</code> · <code>mx-auto</code>
          </p>
        </div>
        <div class="sp-grid">
          @for (s of marginDemos; track s.class) {
            <div class="sp-card">
              <div class="sp-tag">{{ s.class }}</div>
              <div class="margin-outer">
                <div class="margin-inner" [ngStyle]="s.style">{{ s.label }}</div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- TIPOGRAFÍA ───────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Tipografía</h2>
        </div>

        <div class="type-demos">
          @for (t of typeDemos; track t.label) {
            <div class="type-row">
              <div class="type-sample" [ngStyle]="t.style">{{ t.sample }}</div>
              <code class="type-code">{{ t.code }}</code>
              <span class="type-desc">{{ t.label }}</span>
            </div>
          }
        </div>

        <div class="sub-label">font-size</div>
        <div class="size-list">
          @for (ts of textSizes; track ts.name) {
            <div class="size-row">
              <code class="size-token">.text-{{ ts.name }}</code>
              <span class="size-preview" [style.font-size]="ts.size">fsociety UI</span>
              <span class="size-val">{{ ts.size }}</span>
            </div>
          }
        </div>

        <div class="sub-label" style="margin-top:20px">font-weight</div>
        <div class="size-list">
          @for (fw of fontWeights; track fw.name) {
            <div class="size-row">
              <code class="size-token">.font-{{ fw.name }}</code>
              <span class="size-preview" [style.font-weight]="fw.weight">fsociety UI</span>
              <span class="size-val">{{ fw.weight }}</span>
            </div>
          }
        </div>
      </section>

      <!-- RESPONSIVE ───────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Responsive</h2>
          <p class="section-desc">
            Breakpoints: <code>sm</code> 640px · <code>md</code> 768px ·
            <code>lg</code> 1024px · <code>xl</code> 1280px · <code>xxl</code> 1536px
          </p>
        </div>
        <div class="code-block" style="margin-bottom:14px">
          <div class="code-label">SCSS</div>
          <pre>{{ responsiveExample }}</pre>
        </div>
        <div class="bp-table">
          @for (bp of breakpoints; track bp.name) {
            <div class="bp-row">
              <code class="bp-name">{{ bp.name }}</code>
              <div class="bp-bar-wrap">
                <div class="bp-bar" [style.width.%]="bp.pct"></div>
              </div>
              <span class="bp-val">{{ bp.px }}px</span>
            </div>
          }
        </div>
      </section>

      <!-- VISUAL ───────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Visual / UI</h2>
        </div>
        <div class="visual-row">

          <div class="visual-item">
            <div class="vis-card">
              <span class="vis-label">card-surface</span>
            </div>
            <code class="vis-code">.card-surface</code>
          </div>

          <div class="visual-item">
            <div class="vis-glass">
              <span class="vis-label">glass</span>
            </div>
            <code class="vis-code">.glass</code>
          </div>

          <div class="visual-item">
            <div class="vis-divider"></div>
            <code class="vis-code">.divider</code>
          </div>

          <div class="visual-item">
            <button class="vis-btn-reset">botón sin estilos →</button>
            <code class="vis-code">&#64;include reset-button</code>
          </div>

          <div class="visual-item">
            <button class="vis-btn-focus">enfocame con Tab</button>
            <code class="vis-code">&#64;include focus-ring</code>
          </div>

        </div>

        <p class="section-desc" style="margin-top:14px">
          <strong>card-surface</strong>, <strong>glass</strong> y
          <strong>divider</strong> derivan de los tokens semánticos, así que
          siguen el tema activo. Probá el toggle de tema en la toolbar.
        </p>
      </section>

      <!-- OVERLAY ──────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Overlay / top layer</h2>
          <p class="section-desc">
            Un dropdown con <code>position: fixed</code> igual queda recortado si
            algún ancestro tiene <code>transform</code>, <code>filter</code>,
            <code>contain</code> o <code>backdrop-filter</code>: ese ancestro pasa
            a ser su containing block. La Popover API lo evita subiendo el
            elemento al top layer, donde ningún <code>overflow</code> lo alcanza.
          </p>
        </div>

        <div class="code-block" style="margin-bottom:14px">
          <div class="code-label">SCSS — resetea los estilos de user-agent de [popover]</div>
          <pre>{{ popoverScssExample }}</pre>
        </div>

        <div class="code-block">
          <div class="code-label">HTML — anclá el popover al trigger</div>
          <pre>{{ popoverHtmlExample }}</pre>
        </div>

        <p class="section-desc" style="margin-top:14px">
          <code>FsAnchoredPopoverDirective</code> se encarga de mostrar el
          popover, posicionarlo contra el ancla, seguirlo en scroll y resize, y
          voltearlo hacia arriba cuando no hay lugar abajo. Es lo que usan
          internamente <code>fs-select</code> y <code>fs-multi-select</code>.
        </p>
      </section>

      <!-- RADII ────────────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Border radius</h2>
        </div>
        <div class="radii-row">
          @for (r of radii; track r.name) {
            <div class="radius-item">
              <div class="radius-box" [style.border-radius]="r.val"></div>
              <code class="radius-code">.rounded-{{ r.name }}</code>
            </div>
          }
        </div>
      </section>

      <!-- BADGE HELPERS ────────────────────────────────────── -->
      <section>
        <div class="section-header">
          <h2 class="section-title">Badge helpers</h2>
        </div>
        <div class="badge-row">
          <span class="bv-primary">Angular</span>
          <span class="bv-secondary">TypeScript</span>
          <span class="bv-danger">Error</span>
          <span class="bv-success">Activo</span>
          <span class="bo-primary">outline primary</span>
          <span class="bo-danger">outline danger</span>
        </div>
        <div class="code-block" style="margin-top:14px">
          <div class="code-label">SCSS</div>
          <pre>{{ badgeExample }}</pre>
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

    .section-header { margin-bottom: 16px; }

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

    .sub-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--fs-color-text-secondary);
      margin-bottom: 8px;
    }

    /* ── Code blocks ──────────────────────────────────────── */
    .code-pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    @media (max-width: 640px) { .code-pair { grid-template-columns: 1fr; } }

    .code-block {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-lg);
      padding: 14px 16px;
    }

    .code-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--fs-color-text-secondary);
      margin-bottom: 8px;
    }

    pre {
      font-size: 11.5px;
      color: var(--fs-color-text-primary);
      font-family: 'JetBrains Mono', monospace;
      white-space: pre-wrap;
      margin: 0;
      line-height: 1.7;
    }

    /* ── Flex demos ───────────────────────────────────────── */
    .flex-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
    }

    .demo-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .demo-preview {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-md);
      min-height: 60px;
      padding: 8px;
    }

    .demo-code {
      font-size: 10px;
    }

    .demo-label {
      font-size: 10.5px;
      color: var(--fs-color-text-secondary);
    }

    .dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--fs-color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }

    /* ── Gap ──────────────────────────────────────────────── */
    .gap-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .gap-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .gap-token { min-width: 64px; }

    .chips {
      display: flex;
    }

    .chip {
      background: color-mix(in srgb, var(--fs-color-primary) 12%, transparent);
      color: var(--fs-color-primary);
      border-radius: 4px;
      padding: 4px 9px;
      font-size: 11px;
      font-weight: 600;
    }

    .gap-val {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Spacing ──────────────────────────────────────────── */
    .sp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
    }

    .sp-card {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-md);
      overflow: hidden;
    }

    .sp-tag {
      font-size: 10px;
      font-weight: 600;
      color: var(--fs-color-text-secondary);
      padding: 5px 8px;
      background: var(--fs-color-surface-alt);
      border-bottom: 1px solid var(--fs-color-border);
    }

    .sp-box {
      background: var(--fs-color-bg);
    }

    .sp-inner {
      background: color-mix(in srgb, var(--fs-color-primary) 14%, transparent);
      color: var(--fs-color-primary);
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      border-radius: 3px;
      padding: 5px;
    }

    .margin-outer {
      padding: 4px;
      background: color-mix(in srgb, var(--fs-color-warning) 8%, var(--fs-color-bg));
      border: 1px dashed color-mix(in srgb, var(--fs-color-warning) 30%, transparent);
      border-radius: 3px;
      margin: 4px;
    }

    .margin-inner {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: 4px;
      font-size: 11px;
      color: var(--fs-color-text-secondary);
      padding: 5px 8px;
      text-align: center;
    }

    /* ── Typography ───────────────────────────────────────── */
    .type-demos {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 20px;
    }

    .type-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 12px;
      border-radius: var(--fs-radius-md);
      transition: background 120ms ease;

      &:hover { background: var(--fs-color-surface-alt); }
    }

    .type-sample {
      color: var(--fs-color-text-primary);
      min-width: 200px;
      flex-shrink: 0;
    }

    .type-code {
      min-width: 180px;
      flex-shrink: 0;
    }

    .type-desc {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
    }

    .size-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .size-row {
      display: flex;
      align-items: baseline;
      gap: 16px;
      padding: 6px 10px;
      border-radius: var(--fs-radius-sm);

      &:hover { background: var(--fs-color-surface-alt); }
    }

    .size-token { min-width: 120px; flex-shrink: 0; }

    .size-preview {
      color: var(--fs-color-text-primary);
      min-width: 120px;
    }

    .size-val {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Responsive ───────────────────────────────────────── */
    .bp-table {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .bp-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .bp-name { min-width: 40px; }

    .bp-bar-wrap {
      flex: 1;
      height: 10px;
      background: var(--fs-color-surface-alt);
      border-radius: 3px;
      overflow: hidden;
    }

    .bp-bar {
      height: 100%;
      background: var(--fs-color-primary);
      opacity: 0.4;
      border-radius: 3px;
    }

    .bp-val {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
      min-width: 48px;
      text-align: right;
    }

    /* ── Visual ───────────────────────────────────────────── */
    .visual-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-end;
    }

    .visual-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .vis-label {
      font-size: 11px;
      color: var(--fs-color-text-secondary);
    }

    .vis-code {
      font-size: 10px;
    }

    .vis-card {
      width: 120px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-lg);
      transition: border-color 150ms ease;

      &:hover { border-color: var(--fs-color-border-strong); }
    }

    .vis-glass {
      width: 120px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--fs-color-text-primary) 5%, transparent);
      border: 1px solid color-mix(in srgb, var(--fs-color-text-primary) 10%, transparent);
      border-radius: var(--fs-radius-lg);
      backdrop-filter: blur(8px);
    }

    .vis-divider {
      width: 160px;
      height: 1px;
      background: var(--fs-color-border);
      margin: 24px 0;
    }

    .vis-btn-reset {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: inherit;
      color: var(--fs-color-primary);
      font-size: 13px;
    }

    /* Reproduce el mixin focus-ring: el anillo interno usa el fondo del tema,
       así que se lee tanto en light como en dark. */
    .vis-btn-focus {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-md);
      padding: 7px 12px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12.5px;
      color: var(--fs-color-text-primary);
    }

    .vis-btn-focus:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--fs-color-bg),
                  0 0 0 4px var(--fs-color-primary);
    }

    .radii-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-end;
    }

    .radius-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .radius-box {
      width: 48px;
      height: 48px;
      background: var(--fs-color-surface);
      border: 1.5px solid var(--fs-color-primary);
    }

    .radius-code { font-size: 10px; }

    /* ── Badge helpers ────────────────────────────────────── */
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }

    .bv-primary, .bv-secondary, .bv-danger, .bv-success, .bo-primary, .bo-danger {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.5;
    }

    .bv-primary   { background: color-mix(in srgb, var(--fs-color-primary) 12%, transparent); color: var(--fs-color-primary); border: 1px solid color-mix(in srgb, var(--fs-color-primary) 28%, transparent); }
    .bv-secondary { background: rgba(14,165,233,0.12); color: #0284c7; border: 1px solid rgba(14,165,233,0.28); }
    .bv-danger    { background: color-mix(in srgb, var(--fs-color-error) 12%, transparent); color: var(--fs-color-error); border: 1px solid color-mix(in srgb, var(--fs-color-error) 28%, transparent); }
    .bv-success   { background: color-mix(in srgb, var(--fs-color-success) 12%, transparent); color: var(--fs-color-success); border: 1px solid color-mix(in srgb, var(--fs-color-success) 28%, transparent); }
    .bo-primary   { background: transparent; color: var(--fs-color-primary); border: 1px solid var(--fs-color-primary); }
    .bo-danger    { background: transparent; color: var(--fs-color-error); border: 1px solid var(--fs-color-error); }
  `],
})
export class FsMixinsDocComponent {

  flexDemos = [
    {
      label: 'flex-center',
      code: '@include flex-center',
      dots: ['HC'],
      containerStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px', padding: '8px' },
    },
    {
      label: 'flex-between',
      code: '@include flex-between',
      dots: ['A', 'B'],
      containerStyle: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px', padding: '8px 12px' },
    },
    {
      label: 'flex-col / stack',
      code: '@include stack(12px)',
      dots: ['1', '2', '3'],
      containerStyle: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px' },
    },
    {
      label: 'inline-flex-center',
      code: '@include inline-flex-center',
      dots: ['HC'],
      containerStyle: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '60px', padding: '8px' },
    },
    {
      label: 'flex-end',
      code: '@include flex-end',
      dots: ['→'],
      containerStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: '60px', padding: '8px 12px' },
    },
    {
      label: 'flex-start',
      code: '@include flex-start',
      dots: ['←'],
      containerStyle: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', minHeight: '60px', padding: '8px 12px' },
    },
  ];

  gapDemos = [
    { key: 1, val: '4px' }, { key: 2, val: '8px' }, { key: 3, val: '12px' },
    { key: 4, val: '16px' }, { key: 6, val: '24px' }, { key: 8, val: '32px' },
  ];

  paddingDemos = [
    { class: 'px-4', value: 'px = 16px', style: { padding: '8px 16px', borderLeft: '2px solid #f59e0b', borderRight: '2px solid #f59e0b' } },
    { class: 'py-3', value: 'py = 12px', style: { padding: '12px 8px', borderTop: '2px solid #22d3ee', borderBottom: '2px solid #22d3ee' } },
    { class: 'pl-6', value: 'pl = 24px', style: { padding: '8px 8px 8px 24px', borderLeft: '2px solid #f59e0b' } },
    { class: 'pr-2', value: 'pr = 8px',  style: { padding: '8px 8px 8px 8px', borderRight: '2px solid #f59e0b' } },
    { class: 'pt-4', value: 'pt = 16px', style: { padding: '16px 8px 8px', borderTop: '2px solid #22d3ee' } },
    { class: 'pb-4', value: 'pb = 16px', style: { padding: '8px 8px 16px', borderBottom: '2px solid #22d3ee' } },
    { class: 'p-4',  value: 'p = 16px',  style: { padding: '16px', outline: '2px dashed rgba(37,99,235,0.35)', outlineOffset: '0' } },
    { class: 'py-6', value: 'py = 24px', style: { padding: '24px 8px', borderTop: '2px solid #22d3ee', borderBottom: '2px solid #22d3ee' } },
  ];

  marginDemos = [
    { class: 'mt-4',    label: 'mt = 16px', style: { marginTop: '16px' } },
    { class: 'mb-4',    label: 'mb = 16px', style: { marginBottom: '16px' } },
    { class: 'ml-4',    label: 'ml = 16px', style: { marginLeft: '16px' } },
    { class: 'mr-4',    label: 'mr = 16px', style: { marginRight: '16px' } },
    { class: 'mx-auto', label: 'centrado',  style: { marginLeft: 'auto', marginRight: 'auto', width: '60%' } },
    { class: 'my-3',    label: 'my = 12px', style: { marginTop: '12px', marginBottom: '12px' } },
  ];

  typeDemos = [
    {
      label: 'truncate — 1 línea',
      sample: 'Este texto es muy largo y se corta con puntos suspensivos cuando supera el ancho disponible',
      style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px', fontSize: '13px' },
      code: '.truncate · @include truncate',
    },
    {
      label: 'truncate-2 — 2 líneas',
      sample: 'Este texto tiene máximo dos líneas. Si hay más contenido se recorta automáticamente con puntos suspensivos.',
      style: { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '13px', maxWidth: '360px', lineHeight: '1.6' },
      code: '.truncate-2 · @include truncate-lines(2)',
    },
    {
      label: 'uppercase-label',
      sample: 'Frontend Developer Angular',
      style: { fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5 },
      code: '.uppercase-label · @include uppercase-label',
    },
    {
      label: 'font-mono',
      sample: "const version = '0.0.16';",
      style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--fs-color-primary)' },
      code: '.font-mono · @include font-mono',
    },
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

  breakpoints = [
    { name: 'sm',  px: 640,  pct: 42 },
    { name: 'md',  px: 768,  pct: 50 },
    { name: 'lg',  px: 1024, pct: 67 },
    { name: 'xl',  px: 1280, pct: 84 },
    { name: 'xxl', px: 1536, pct: 100 },
  ];

  radii = [
    { name: 'sm',   val: '4px'    }, { name: 'md',  val: '6px'   },
    { name: 'lg',   val: '8px'    }, { name: 'xl',  val: '12px'  },
    { name: '2xl',  val: '16px'   }, { name: 'full',val: '9999px'},
  ];

  includeExample = `@use '@heroelc/fsociety/styles/mixins' as m;
@use '@heroelc/fsociety/styles/tokens' as t;

.experience-section {
  @include m.stack(t.$fs-space-6);

  @include m.respond-to('md') {
    @include m.flex-between;
  }
}

.card-title {
  @include m.truncate;
  @include m.pl(4);
}`;

  classExample = `<!-- clases directas en el HTML -->
<div class="flex-between px-6 py-4">
  <div class="truncate-2 text-sm font-medium">...</div>
  <span class="uppercase-label mt-2">Frontend Dev</span>
</div>

<ul class="reset-list gap-4"
    style="display:flex;flex-direction:column">
  <li class="flex-start pl-3">item</li>
</ul>`;

  responsiveExample = `@use '@heroelc/fsociety/styles/mixins' as m;

.grid {
  display: grid;
  grid-template-columns: 1fr;

  @include m.respond-to('sm') {
    grid-template-columns: 1fr 1fr;
  }

  @include m.respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}`;

  badgeExample = `@use '@heroelc/fsociety/styles/mixins' as m;

.my-badge {
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

  popoverScssExample = `@use '@heroelc/fsociety/styles/overlay' as overlay;

.my-menu {
  // Primero: neutraliza inset, margin, border y padding del user-agent
  @include overlay.popover-surface;

  // Después: tu propio box model
  background:    var(--fs-color-surface);
  border:        1px solid var(--fs-color-border);
  border-radius: var(--fs-radius-lg);
  padding:       5px;
  box-shadow:    var(--fs-color-shadow-pop);
}`;

  popoverHtmlExample = `<div class="field" #anchor>
  <button (click)="open = !open">Abrir</button>
</div>

@if (open) {
  <div class="my-menu" [fsAnchoredPopover]="anchor">
    <!-- se renderiza en el top layer -->
  </div>
}`;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<FsMixinsDocComponent> = {
  title: 'Foundations/Mixins',
  component: FsMixinsDocComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Mixins SCSS reutilizables y clases utilitarias — flexbox, spacing, tipografía, responsive y helpers visuales.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsMixinsDocComponent>;

export const MixinsDoc: Story = {
  name: 'Mixins & utilidades',
};
