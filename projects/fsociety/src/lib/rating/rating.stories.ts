import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsRatingComponent } from './rating.component';

const meta: Meta<FsRatingComponent> = {
  title: 'Components/Rating',
  component: FsRatingComponent,
  decorators: [moduleMetadata({ imports: [FsRatingComponent, FormsModule] })],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error'] },
    icon: { control: 'select', options: ['star', 'heart'] },
    count: { control: { type: 'number', min: 1, max: 20 } },
    motion: { control: 'inline-radio', options: ['none', 'peek'] },
    formatValue: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsRatingComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: '¿Cómo estuvo?',
    hint: 'Clickeá la misma estrella para borrar.',
    count: 5,
    icon: 'star',
    allowClear: true,
    readonly: false,
    showValue: false,
    state: 'default',
    disabled: false,
    motion: 'none',
  },
  render: (args) => ({
    props: { ...args, value: 0 },
    template: `
      <fs-rating
        [label]="label" [hint]="hint"
        [count]="count" [icon]="icon"
        [allowClear]="allowClear"
        [readonly]="readonly"
        [showValue]="showValue"
        [state]="state" [disabled]="disabled"
        [motion]="motion"
        [(ngModel)]="value"
      ></fs-rating>
    `,
  }),
};

// ─── Readonly with fractions ─────────────────────────────────────────────────

export const Fractional: Story = {
  name: 'Readonly con fracciones',
  render: () => ({
    props: { avg: 4.2 },
    template: `
      <div style="display:flex; flex-direction:column; gap:22px;">
        <fs-rating label="Promedio de 128 reseñas" [readonly]="true" [showValue]="true" [(ngModel)]="avg"></fs-rating>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <fs-rating [readonly]="true" [showValue]="true" [ngModel]="1.5"></fs-rating>
          <fs-rating [readonly]="true" [showValue]="true" [ngModel]="2.8"></fs-rating>
          <fs-rating [readonly]="true" [showValue]="true" [ngModel]="3.33"></fs-rating>
          <fs-rating [readonly]="true" [showValue]="true" [ngModel]="5"></fs-rating>
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:440px;">
          Es el caso más común de un rating: mostrar un promedio. La capa de relleno
          se recorta a un porcentaje, así que una estrella parcial sale sin un
          segundo camino de render. En <code>readonly</code> no hay botones ni tab
          stop — es un <code>role="img"</code>.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Keyboard ────────────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Teclado — un solo tab stop',
  render: () => ({
    props: { v: 3 },
    template: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <fs-rating label="Enfocalo con Tab" [showValue]="true" [(ngModel)]="v"></fs-rating>

        <table style="font-size:12.5px; color:var(--fs-color-text-secondary); border-collapse:collapse;">
          <tbody>
            <tr><td style="padding:3px 14px 3px 0"><code>← →</code></td><td>bajan y suben un punto</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>↑ ↓</code></td><td>lo mismo</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Inicio</code> / <code>Fin</code></td><td>1 y el máximo</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Supr</code> / <code>Backspace</code></td><td>borra</td></tr>
          </tbody>
        </table>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:440px;">
          Las flechas mueven el <b>valor</b>, no el foco. Por eso el grupo entero es
          un solo tab stop: la referencia hacía cada estrella un botón tabulable, o
          sea cinco tabs para pasar un control.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Motion ──────────────────────────────────────────────────────────────────

export const Motion: Story = {
  name: 'Movimiento — peek con etiquetas',
  render: () => ({
    props: {
      labels: ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'],
      quieto: 0,
      conPeek: 0,
    },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:56px; padding-top:8px;">
        <fs-rating
          label="motion=&quot;none&quot;"
          [labels]="labels"
          motion="none"
          [(ngModel)]="quieto"
        ></fs-rating>

        <fs-rating
          label="motion=&quot;peek&quot;"
          [labels]="labels"
          motion="peek"
          [(ngModel)]="conPeek"
        ></fs-rating>
      </div>

      <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:460px; margin-top:26px;">
        Los dos muestran la misma etiqueta: <code>labels</code> no depende de
        <code>motion</code>, porque el texto es información y sólo el movimiento
        es opcional. A la izquierda la etiqueta aparece quieta; a la derecha la
        estrella sube un poco y la etiqueta entra deslizándose. Se puede enfocar
        con <code>Tab</code> y mover con las flechas para ver la etiqueta sin
        mouse, y la misma etiqueta viaja en el <code>aria-valuetext</code>. Con
        <code>prefers-reduced-motion</code> no se mueve nada, pero la etiqueta
        sigue apareciendo.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Icons and counts ────────────────────────────────────────────────────────

export const IconsAndCounts: Story = {
  name: 'Iconos y cantidades',
  render: () => ({
    props: { a: 4, b: 3, c: 7, custom: 'https://api.iconify.design/tabler:flame-filled.svg' },
    template: `
      <div style="display:flex; flex-direction:column; gap:22px;">
        <fs-rating label="Estrellas (default)" [(ngModel)]="a"></fs-rating>
        <fs-rating label="Corazones" icon="heart" [(ngModel)]="b"></fs-rating>
        <fs-rating label="10 puntos" [count]="10" [showValue]="true" [(ngModel)]="c"></fs-rating>
        <fs-rating label="Icono propio por URL" [icon]="custom" [(ngModel)]="a"></fs-rating>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Custom colour ───────────────────────────────────────────────────────────

export const CustomColor: Story = {
  name: 'Color y tamaño',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px;">
        <fs-rating label="Ámbar (default)" [ngModel]="4"></fs-rating>

        <div style="--fs-rating-color: var(--fs-color-error);">
          <fs-rating label="Con --fs-rating-color" icon="heart" [ngModel]="4"></fs-rating>
        </div>

        <div style="--fs-rating-size: 18px;">
          <fs-rating label="Chico, con --fs-rating-size" [ngModel]="4"></fs-rating>
        </div>

        <div style="--fs-rating-size: 34px; --fs-rating-gap: 6px;">
          <fs-rating label="Grande" [ngModel]="4"></fs-rating>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados',
  render: () => ({
    props: { v: 3 },
    template: `
      <div style="display:flex; flex-direction:column; gap:22px;">
        <fs-rating label="Default" hint="Texto de ayuda." [(ngModel)]="v"></fs-rating>
        <fs-rating label="Error" state="error" errorMessage="Tenés que puntuar antes de enviar." [(ngModel)]="v"></fs-rating>
        <fs-rating label="Readonly" [readonly]="true" [(ngModel)]="v"></fs-rating>
        <fs-rating label="Disabled" [disabled]="true" [(ngModel)]="v"></fs-rating>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
