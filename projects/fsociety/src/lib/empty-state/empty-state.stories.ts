import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsEmptyStateComponent } from './empty-state.component';
import { FsButtonComponent } from '../button/button.component';

const CDN = 'https://api.iconify.design';
const I = {
  folderPlus: `${CDN}/tabler:folder-plus.svg`,
  search:     `${CDN}/tabler:search.svg`,
  alert:      `${CDN}/tabler:alert-triangle.svg`,
  checks:     `${CDN}/tabler:checks.svg`,
  inbox:      `${CDN}/tabler:inbox.svg`,
};

const meta: Meta<FsEmptyStateComponent> = {
  title: 'Components/Empty State',
  component: FsEmptyStateComponent,
  decorators: [
    moduleMetadata({ imports: [FsEmptyStateComponent, FsButtonComponent] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Densidad del bloque: sm para un dropdown, lg para una pantalla.',
    },
    tone: {
      control: { type: 'inline-radio' },
      options: ['default', 'error'],
      description: 'Tiñe el ícono. No pinta la caja entera.',
    },
    compact: { control: 'boolean' },
    announce: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FsEmptyStateComponent>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    icon: I.folderPlus,
    title: 'Todavía no hay proyectos',
    description: 'Creá el primero para empezar a organizar tu trabajo.',
    size: 'md',
    tone: 'default',
    compact: false,
    announce: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-empty-state
        [icon]="icon"
        [title]="title"
        [description]="description"
        [size]="size"
        [tone]="tone"
        [compact]="compact"
        [announce]="announce"
      >
        <fs-button variant="primary" label="Crear proyecto"></fs-button>
      </fs-empty-state>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Los cuatro tipos ────────────────────────────────────────────────────────
// La diferencia entre ellos no es el texto: es qué acción ofrecen.

export const Kinds: Story = {
  name: 'Los cuatro tipos',
  render: () => ({
    props: { I },
    template: `
      <div style="display:grid; gap:1.5rem; grid-template-columns:repeat(auto-fit,minmax(320px,1fr));">

        <div style="border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl); overflow:hidden;">
          <div style="padding:8px 14px; border-bottom:1px solid var(--fs-color-border); background:var(--fs-color-surface-alt); font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--fs-color-text-secondary);">
            1 · primera vez
          </div>
          <fs-empty-state
            [icon]="I.folderPlus"
            title="Todavía no hay proyectos"
            description="Creá el primero para empezar a organizar tu trabajo."
          >
            <fs-button variant="primary" label="Crear proyecto"></fs-button>
          </fs-empty-state>
        </div>

        <div style="border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl); overflow:hidden;">
          <div style="padding:8px 14px; border-bottom:1px solid var(--fs-color-border); background:var(--fs-color-surface-alt); font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--fs-color-text-secondary);">
            2 · sin resultados — el CTA deshace
          </div>
          <fs-empty-state
            [icon]="I.search"
            title="Sin resultados para “onboarding”"
            description="Probá con otros términos o sacá algún filtro."
          >
            <fs-button variant="ghost" label="Limpiar filtros"></fs-button>
          </fs-empty-state>
        </div>

        <div style="border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl); overflow:hidden;">
          <div style="padding:8px 14px; border-bottom:1px solid var(--fs-color-border); background:var(--fs-color-surface-alt); font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--fs-color-text-secondary);">
            3 · error de carga
          </div>
          <fs-empty-state
            tone="error"
            [icon]="I.alert"
            title="No pudimos cargar los proyectos"
            description="Puede ser un problema de conexión."
          >
            <fs-button variant="outline" label="Reintentar"></fs-button>
          </fs-empty-state>
        </div>

        <div style="border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl); overflow:hidden;">
          <div style="padding:8px 14px; border-bottom:1px solid var(--fs-color-border); background:var(--fs-color-surface-alt); font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--fs-color-text-secondary);">
            4 · legítimamente vacío — sin botón
          </div>
          <fs-empty-state
            [icon]="I.checks"
            title="No tenés notificaciones"
            description="Te avisamos acá cuando pase algo."
          ></fs-empty-state>
        </div>

      </div>

      <p style="margin-top:16px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:64ch;">
        Lo que los distingue no es el texto sino la acción. En “sin resultados”
        el botón <strong>deshace</strong>; en “primera vez” <strong>crea</strong>;
        en “todo al día” <strong>no hay botón</strong>, porque meter uno inventa
        trabajo que no existe.
      </p>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Tamaños ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Tamaños en su contexto',
  render: () => ({
    props: { I },
    template: `
      <div style="display:flex; flex-direction:column; gap:2.5rem;">

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            <code>sm</code> — dentro de un dropdown. Sin acciones: no hay lugar.
          </p>
          <div style="max-width:300px; border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-lg); box-shadow:var(--fs-color-shadow-pop); padding:5px;">
            <fs-empty-state
              size="sm"
              [icon]="I.search"
              title="Sin resultados"
              description="Ninguna opción coincide."
            ></fs-empty-state>
          </div>
        </div>

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            <code>md</code> — dentro de una tabla o una card. Un solo botón.
          </p>
          <div style="max-width:600px; border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl);">
            <fs-empty-state
              size="md"
              [icon]="I.search"
              title="Sin facturas en este rango"
              description="Probá ampliar las fechas del filtro."
            >
              <fs-button variant="ghost" size="sm" label="Limpiar filtros"></fs-button>
            </fs-empty-state>
          </div>
        </div>

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            <code>lg</code> — la pantalla entera. El único tamaño donde una
            acción secundaria tiene sentido.
          </p>
          <div style="border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-xl);">
            <fs-empty-state
              size="lg"
              [icon]="I.inbox"
              title="Tu bandeja está vacía"
              description="Cuando alguien te comparta un documento, lo vas a ver acá. Mientras tanto, podés empezar uno vos."
            >
              <fs-button variant="primary" label="Crear documento"></fs-button>
              <fs-button variant="outline" label="Ver plantillas"></fs-button>
            </fs-empty-state>
          </div>
        </div>

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            <code>compact</code> — sin ícono, para huecos donde ni el <code>sm</code> entra.
          </p>
          <div style="max-width:260px; border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-lg);">
            <fs-empty-state [compact]="true" title="Sin acciones"></fs-empty-state>
          </div>
        </div>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
