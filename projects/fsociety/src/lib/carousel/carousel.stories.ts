import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsCarouselComponent, FsCarouselSlideDirective } from './carousel.component';
import { FsCardComponent } from '../card/card.component';

const meta: Meta<FsCarouselComponent> = {
  title: 'Components/Carousel',
  component: FsCarouselComponent,
  decorators: [
    moduleMetadata({
      imports: [FsCarouselComponent, FsCarouselSlideDirective, FsCardComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    corners: {
      control: { type: 'inline-radio' },
      options: ['all', 'none', 'top', 'bottom', 'start', 'end'],
    },
    count: { control: { type: 'number', min: 1, max: 12 } },
    startAt: { control: { type: 'number', min: 0, max: 11 } },
    preloadRadius: { control: { type: 'number', min: 0, max: 4 } },
  },
};

export default meta;
type Story = StoryObj<FsCarouselComponent>;

/** Placeholder slides — the carousel itself never knows what a slide holds. */
const panelStyle = `
  display: grid;
  place-items: center;
  height: 260px;
  font: 600 42px 'Plus Jakarta Sans', system-ui, sans-serif;
  color: #fff;
`;

const gradients = [
  'linear-gradient(135deg, #7c3aed, #06b6d4)',
  'linear-gradient(135deg, #f43f5e, #f59e0b)',
  'linear-gradient(135deg, #10b981, #3b82f6)',
  'linear-gradient(135deg, #6366f1, #ec4899)',
  'linear-gradient(135deg, #0ea5e9, #22d3ee)',
];

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    count: 5,
    label: 'Galería de ejemplo',
    startAt: 0,
    preloadRadius: 1,
    corners: 'all',
  },
  render: (args) => ({
    props: { ...args, gradients, panelStyle },
    template: `
      <div style="max-width: 460px">
        <fs-carousel [count]="count" [label]="label" [startAt]="startAt"
                     [preloadRadius]="preloadRadius" [corners]="corners">
          <ng-template fsCarouselSlide let-i>
            <div [style]="panelStyle" [style.background]="gradients[i % gradients.length]">
              {{ i + 1 }}
            </div>
          </ng-template>
        </fs-carousel>
      </div>
    `,
  }),
};

// ─── Slide inicial ───────────────────────────────────────────────────────────

export const StartAt: Story = {
  name: 'Slide inicial',
  ...Default,
  args: {
    count: 5,
    label: 'Galería de ejemplo',
    startAt: 2,
    preloadRadius: 1,
    corners: 'all',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`startAt` se lee una sola vez, en el primer render. Posiciona un carrusel que ' +
          'se está creando; después de eso el scroll es del usuario.',
      },
    },
  },
};

// ─── Carga diferida ──────────────────────────────────────────────────────────

export const LazyImages: Story = {
  name: 'Carga diferida',
  args: {
    count: 8,
    label: 'Fotos del lugar',
    startAt: 0,
    preloadRadius: 1,
    corners: 'all',
  },
  parameters: {
    docs: {
      description: {
        story:
          'El contexto del template trae `shouldLoad`. La librería no sabe qué es una ' +
          'imagen: sólo dice cuándo llegó el momento, y el consumidor decide qué hacer.',
      },
    },
  },
  render: (args) => ({
    props: { ...args },
    template: `
      <div style="max-width: 460px">
        <fs-carousel [count]="count" [label]="label" [startAt]="startAt"
                     [preloadRadius]="preloadRadius" [corners]="corners">
          <ng-template fsCarouselSlide let-i let-shouldLoad="shouldLoad">
            <div style="height: 260px; background: var(--fs-color-surface-alt)">
              @if (shouldLoad) {
                <img
                  [src]="'https://picsum.photos/seed/fsociety-' + i + '/920/520'"
                  [alt]="'Foto ' + (i + 1)"
                  style="width: 100%; height: 100%; object-fit: cover; display: block"
                />
              }
            </div>
          </ng-template>
        </fs-carousel>
      </div>
    `,
  }),
};

// ─── Tap sin swipe ───────────────────────────────────────────────────────────

export const Tapped: Story = {
  name: 'Tap sin swipe',
  parameters: {
    docs: {
      description: {
        story:
          '`tapped` sólo emite cuando el gesto no fue un swipe. En touch lo discrimina ' +
          'el propio navegador: cuando se queda con el gesto para scrollear dispara ' +
          '`pointercancel` y el `pointerup` nunca llega.',
      },
    },
  },
  render: () => ({
    props: {
      taps: 0,
      gradients,
      panelStyle,
      onTap(this: { taps: number }) {
        this.taps++;
      },
    },
    template: `
      <div style="max-width: 460px; display: grid; gap: 12px">
        <fs-carousel [count]="5" label="Galería de ejemplo" (tapped)="onTap()">
          <ng-template fsCarouselSlide let-i>
            <div [style]="panelStyle" [style.background]="gradients[i % gradients.length]">
              {{ i + 1 }}
            </div>
          </ng-template>
        </fs-carousel>

        <p style="margin: 0; color: var(--fs-color-text-secondary)">
          Taps: <strong>{{ taps }}</strong> — arrastrá y vas a ver que no suma.
        </p>
      </div>
    `,
  }),
};

// ─── Slide angosta con peek ──────────────────────────────────────────────────

export const Peek: Story = {
  name: 'Slide angosta con peek',
  parameters: {
    docs: {
      description: {
        story:
          'El ancho de slide y el gap son custom properties. El índice se calcula contra ' +
          'la caja real de cada slide, así que dejar asomar la siguiente no rompe nada.',
      },
    },
  },
  render: () => ({
    props: { gradients },
    template: `
      <div style="max-width: 460px">
        <fs-carousel
          [count]="6"
          label="Galería de ejemplo"
          style="--fs-carousel-slide-width: 78%; --fs-carousel-gap: 12px"
        >
          <ng-template fsCarouselSlide let-i>
            <div
              style="display: grid; place-items: center; height: 200px; border-radius: 12px;
                     font: 600 32px 'Plus Jakarta Sans', system-ui, sans-serif; color: #fff"
              [style.background]="gradients[i % gradients.length]"
            >
              {{ i + 1 }}
            </div>
          </ng-template>
        </fs-carousel>
      </div>
    `,
  }),
};

// ─── Esquinas ────────────────────────────────────────────────────────────────

export const Corners: Story = {
  name: 'Esquinas',
  parameters: {
    docs: {
      description: {
        story:
          'Por defecto van las cuatro. `top`, `bottom`, `start` y `end` apagan las ' +
          'del lado opuesto, para que el carrusel se apoye contra otra cosa sin dejar ' +
          'una esquina redonda adentro de otra. `start` y `end` son lógicas: en RTL ' +
          'se dan vuelta solas.',
      },
    },
  },
  render: () => ({
    props: { gradients, panelStyle, opciones: ['all', 'none', 'top', 'bottom', 'start', 'end'] },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 760px">
        @for (c of opciones; track c) {
          <div style="display: grid; gap: 8px">
            <code style="font-size: 12px; color: var(--fs-color-text-secondary)">corners="{{ c }}"</code>
            <fs-carousel [count]="3" label="Galería de ejemplo" [corners]="c"
                         style="--fs-carousel-radius: 20px">
              <ng-template fsCarouselSlide let-i>
                <div [style]="panelStyle" [style.height]="'150px'"
                     [style.background]="gradients[i % gradients.length]">{{ i + 1 }}</div>
              </ng-template>
            </fs-carousel>
          </div>
        }
      </div>
    `,
  }),
};

// ─── Dentro de una card ──────────────────────────────────────────────────────

export const InsideCard: Story = {
  name: 'Dentro de una card',
  parameters: {
    docs: {
      description: {
        story:
          'El caso para el que existe la opción. Con `corners="top"` el radio de la ' +
          'card sigue de largo; sin eso queda una esquina redonda adentro de otra y ' +
          'una medialuna de fondo entre las dos.',
      },
    },
  },
  render: () => ({
    props: { gradients, panelStyle },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 720px">
        <fs-card title="Con corners=top" subtitle="El radio de la card sigue de largo">
          <div cardMedia>
            <fs-carousel [count]="4" label="Fotos del lugar" corners="top">
              <ng-template fsCarouselSlide let-i>
                <div [style]="panelStyle" [style.height]="'170px'"
                     [style.background]="gradients[i % gradients.length]">{{ i + 1 }}</div>
              </ng-template>
            </fs-carousel>
          </div>
          Cuatro fotos del lugar, con el carrusel apoyado contra el borde de la card.
        </fs-card>

        <fs-card title="Sin la opción" subtitle="Esquina redonda adentro de otra">
          <div cardMedia>
            <fs-carousel [count]="4" label="Fotos del lugar">
              <ng-template fsCarouselSlide let-i>
                <div [style]="panelStyle" [style.height]="'170px'"
                     [style.background]="gradients[i % gradients.length]">{{ i + 1 }}</div>
              </ng-template>
            </fs-carousel>
          </div>
          Mirá las dos esquinas de arriba: se ve la medialuna de fondo entre los radios.
        </fs-card>
      </div>
    `,
  }),
};
