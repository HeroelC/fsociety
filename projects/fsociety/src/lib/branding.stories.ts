import { Component, OnInit } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  DEFAULT_PALETTE,
  FAMILIES,
  applyPalette,
  loadPalette,
  savePalette,
  scaleFor,
  scssSnippet,
  type FsFamily,
  type FsPalette,
} from '../../.storybook/palette';

import { FsButtonComponent } from './button/button.component';
import { FsBadgeComponent } from './badge/badge.component';
import { FsAlertComponent } from './alert/alert.component';
import { FsTabsComponent } from './tabs/tabs.component';
import { FsCheckboxComponent } from './choice/checkbox.component';
import { FsSwitchComponent } from './choice/switch.component';

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'fs-branding-doc',
  standalone: true,
  imports: [
    FsButtonComponent,
    FsBadgeComponent,
    FsAlertComponent,
    FsTabsComponent,
    FsCheckboxComponent,
    FsSwitchComponent,
  ],
  template: `
    <div class="doc">

      <section>
        <h2 class="title">Branding en vivo</h2>
        <p class="desc">
          Elegí los colores base y la librería recalcula las diez paradas de cada
          escala al instante. Los cambios se guardan y <strong>se aplican a todas
          las stories</strong>, así que podés navegar el Storybook entero con tu
          marca puesta. Combinalo con el toggle de tema para revisar light y dark.
        </p>
      </section>

      <!-- ── Pickers ────────────────────────────────────────────────────── -->
      <section>
        <div class="sub">Colores base</div>
        <div class="families">
          @for (f of families; track f) {
            <div class="family">
              <div class="family__head">
                <input
                  class="family__input"
                  type="color"
                  [value]="palette[f]"
                  [attr.aria-label]="'Color ' + f"
                  (input)="set(f, $event)"
                />
                <div class="family__meta">
                  <span class="family__name">{{ f }}</span>
                  <code class="family__hex">{{ palette[f] }}</code>
                </div>
                @if (isChanged(f)) {
                  <button class="family__reset" type="button" (click)="resetOne(f)">
                    revertir
                  </button>
                }
              </div>
              <div class="scale">
                @for (s of scaleFor(palette[f]); track s[0]) {
                  <span
                    class="scale__stop"
                    [style.background]="s[1]"
                    [title]="f + '-' + s[0] + ' · ' + s[1]"
                  ></span>
                }
              </div>
            </div>
          }
        </div>

        <div class="actions">
          <button class="btn" type="button" (click)="resetAll()">
            Volver a los colores por defecto
          </button>
          @if (dirty) {
            <span class="dirty">Paleta modificada</span>
          }
        </div>
      </section>

      <!-- ── Live preview ───────────────────────────────────────────────── -->
      <section>
        <div class="sub">Cómo queda</div>

        <div class="preview">
          <div class="row">
            <fs-button variant="primary">Primary</fs-button>
            <fs-button variant="secondary">Secondary</fs-button>
            <fs-button variant="outline">Outline</fs-button>
            <fs-button variant="ghost">Ghost</fs-button>
            <fs-button variant="danger">Danger</fs-button>
            <fs-button variant="link">Link</fs-button>
          </div>

          <div class="row">
            @for (c of badgeColors; track c) {
              <fs-badge [color]="c" variant="filled">{{ c }}</fs-badge>
            }
          </div>

          <div class="row">
            @for (c of badgeColors; track c) {
              <fs-badge [color]="c" variant="outline">{{ c }}</fs-badge>
            }
          </div>

          <div class="row row--tight">
            <fs-checkbox label="Checkbox activo" />
            <fs-switch label="Switch" />
          </div>

          <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
            <div class="tabbody">Tab activa: {{ activeTab }}</div>
          </fs-tabs>

          <div class="stack">
            @for (t of alertTones; track t) {
              <fs-alert [tone]="t" [title]="'Tono ' + t">
                Así se ve un alert con el tono {{ t }} y tu paleta aplicada.
              </fs-alert>
            }
          </div>
        </div>
      </section>

      <!-- ── Snippet ────────────────────────────────────────────────────── -->
      <section>
        <div class="sub">Llevátelo a tu app</div>
        <p class="desc">
          Pegá esto en <code>src/styles.scss</code>. Sass recalcula las mismas
          escalas en build time, así que el resultado es idéntico a lo que estás
          viendo.
        </p>
        <div class="code">
          <button class="code__copy" type="button" (click)="copy()">
            {{ copied ? 'copiado' : 'copiar' }}
          </button>
          <pre>{{ snippet }}</pre>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .doc {
      padding: 32px;
      max-width: 900px;
      background: var(--fs-color-bg);
      color: var(--fs-color-text-primary);
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      font-size: 13px;
    }

    section { margin-bottom: 44px; }

    .title {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 8px;
    }

    .desc {
      font-size: 12.5px;
      color: var(--fs-color-text-secondary);
      line-height: 1.65;
      margin: 0 0 4px;
      max-width: 68ch;
    }

    .sub {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--fs-color-text-secondary);
      margin-bottom: 14px;
    }

    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: var(--fs-color-primary);
      background: color-mix(in srgb, var(--fs-color-primary) 8%, var(--fs-color-surface));
      padding: 1px 5px;
      border-radius: 4px;
    }

    /* ── Pickers ─────────────────────────────────────────────────────── */
    .families {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }

    .family {
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-lg);
      padding: 12px;
    }

    .family__head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .family__input {
      inline-size: 34px;
      block-size: 34px;
      padding: 0;
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-md);
      background: none;
      cursor: pointer;
      flex-shrink: 0;
    }

    .family__meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .family__name {
      font-size: 12.5px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .family__hex { align-self: flex-start; }

    .family__reset {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font: inherit;
      font-size: 11px;
      color: var(--fs-color-primary);
      flex-shrink: 0;
    }

    .scale {
      display: flex;
      border-radius: var(--fs-radius-sm);
      overflow: hidden;
      border: 1px solid var(--fs-color-border);
    }

    .scale__stop {
      flex: 1;
      block-size: 22px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }

    .btn {
      font: inherit;
      font-size: 12.5px;
      padding: 7px 13px;
      border-radius: var(--fs-radius-md);
      border: 1px solid var(--fs-color-border);
      background: var(--fs-color-surface);
      color: var(--fs-color-text-primary);
      cursor: pointer;
    }

    .btn:hover { border-color: var(--fs-color-border-strong); }

    .dirty {
      font-size: 11.5px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Preview ─────────────────────────────────────────────────────── */
    .preview {
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-lg);
      padding: 22px;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    .row--tight { gap: 24px; }

    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tabbody {
      padding: 16px 0 4px;
      font-size: 12.5px;
      color: var(--fs-color-text-secondary);
    }

    /* ── Snippet ─────────────────────────────────────────────────────── */
    .code {
      position: relative;
      background: var(--fs-color-surface);
      border: 1px solid var(--fs-color-border);
      border-radius: var(--fs-radius-lg);
      padding: 14px 16px;
      margin-top: 12px;
      overflow-x: auto;
    }

    .code__copy {
      position: absolute;
      top: 10px;
      right: 10px;
      font: inherit;
      font-size: 11px;
      padding: 4px 9px;
      border-radius: var(--fs-radius-sm);
      border: 1px solid var(--fs-color-border);
      background: var(--fs-color-bg);
      color: var(--fs-color-text-secondary);
      cursor: pointer;
    }

    .code__copy:hover { color: var(--fs-color-text-primary); }

    pre {
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      line-height: 1.7;
      color: var(--fs-color-text-primary);
    }
  `],
})
export class FsBrandingDocComponent implements OnInit {
  readonly families = FAMILIES;
  readonly badgeColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'neutral'] as const;
  readonly alertTones = ['info', 'success', 'warning', 'danger'] as const;
  readonly scaleFor = scaleFor;

  readonly tabs = [
    { id: 'uno', label: 'Primera' },
    { id: 'dos', label: 'Segunda' },
    { id: 'tres', label: 'Tercera' },
  ];
  activeTab = 'uno';

  palette: FsPalette = { ...DEFAULT_PALETTE };
  copied = false;

  ngOnInit(): void {
    this.palette = loadPalette() ?? { ...DEFAULT_PALETTE };
    applyPalette(this.palette);
  }

  get dirty(): boolean {
    return FAMILIES.some(f => this.isChanged(f));
  }

  get snippet(): string {
    return scssSnippet(this.palette);
  }

  isChanged(family: FsFamily): boolean {
    return this.palette[family].toLowerCase() !== DEFAULT_PALETTE[family].toLowerCase();
  }

  set(family: FsFamily, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.palette = { ...this.palette, [family]: value };
    this.commit();
  }

  resetOne(family: FsFamily): void {
    this.palette = { ...this.palette, [family]: DEFAULT_PALETTE[family] };
    this.commit();
  }

  resetAll(): void {
    this.palette = { ...DEFAULT_PALETTE };
    // Persist the default palette rather than clearing storage, so the choice to
    // go back to defaults survives a reload just like any other choice.
    this.commit();
  }

  copy(): void {
    navigator.clipboard?.writeText(this.snippet).then(
      () => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1400);
      },
      () => { /* clipboard blocked — the snippet is on screen to select manually */ },
    );
  }

  private commit(): void {
    applyPalette(this.palette);
    savePalette(this.palette);
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<FsBrandingDocComponent> = {
  title: 'Foundations/Branding',
  component: FsBrandingDocComponent,
  decorators: [moduleMetadata({ imports: [FsBrandingDocComponent] })],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Elegí los colores base de la marca y vé el sistema entero actualizarse en vivo. La paleta persiste y se aplica a todas las stories.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsBrandingDocComponent>;

export const Branding: Story = {
  name: 'Paleta en vivo',
};
