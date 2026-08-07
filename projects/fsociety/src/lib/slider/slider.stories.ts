import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsSliderComponent } from './slider.component';

const meta: Meta<FsSliderComponent> = {
  title: 'Components/Slider',
  component: FsSliderComponent,
  decorators: [moduleMetadata({ imports: [FsSliderComponent, FormsModule] })],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    valuePosition: { control: 'select', options: ['right', 'top', 'none'] },
    ticks: { control: 'boolean' },
    formatValue: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsSliderComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Volumen',
    hint: 'Arrastrá, o usá las flechas del teclado.',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    valuePosition: 'right',
    showBounds: false,
    ticks: false,
    state: 'default',
    disabled: false,
  },
  render: (args) => ({
    props: { ...args, value: 40 },
    template: `
      <div style="max-width:420px;">
        <fs-slider
          [label]="label" [hint]="hint"
          [min]="min" [max]="max" [step]="step" [unit]="unit"
          [valuePosition]="valuePosition"
          [showBounds]="showBounds"
          [ticks]="ticks"
          [state]="state" [disabled]="disabled"
          [(ngModel)]="value"
        ></fs-slider>
      </div>
    `,
  }),
};

// ─── Value position ──────────────────────────────────────────────────────────

export const ValuePosition: Story = {
  name: 'Dónde va el valor',
  render: () => ({
    props: { a: 40, b: 65, c: 20 },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px; max-width:420px;">
        <fs-slider label="A la derecha (default)" unit="%" valuePosition="right" [(ngModel)]="a"></fs-slider>
        <fs-slider label="Arriba, junto al label" unit="%" valuePosition="top" [(ngModel)]="b"></fs-slider>
        <fs-slider label="Sin valor" unit="%" valuePosition="none" [(ngModel)]="c"></fs-slider>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Ticks and bounds ────────────────────────────────────────────────────────

export const TicksAndBounds: Story = {
  name: 'Marcas y límites',
  render: () => ({
    props: { a: 50, b: 3, c: 40 },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px; max-width:420px;">
        <fs-slider
          label="5 marcas"
          [ticks]="5" [showBounds]="true" unit="%"
          [(ngModel)]="a"
        ></fs-slider>

        <fs-slider
          label="Una marca por paso"
          [min]="1" [max]="5" [step]="1"
          [ticks]="true" [showBounds]="true"
          [(ngModel)]="b"
        ></fs-slider>

        <div>
          <fs-slider
            label="Paso 1 sobre 0–100 — las marcas se omiten"
            [min]="0" [max]="100" [step]="1"
            [ticks]="true" unit="%"
            [(ngModel)]="c"
          ></fs-slider>
          <div style="font-size:12.5px; color:var(--fs-color-text-secondary); margin-top:6px; line-height:1.6;">
            Serían 101 marcas a menos de 3% de distancia: se leerían como una barra
            sólida, así que no se dibujan.
          </div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Decimals ────────────────────────────────────────────────────────────────

export const Decimals: Story = {
  name: 'Decimales',
  render: () => ({
    props: { v: 1.5 },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:420px;">
        <fs-slider
          label="Peso"
          [min]="0" [max]="5" [step]="0.1"
          unit=" kg"
          [showBounds]="true"
          [(ngModel)]="v"
        ></fs-slider>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary);">
          Valor: <code style="color:var(--fs-color-primary)">{{ v }}</code>
          — redondeado a la precisión del <code>step</code>, sin colas de flotante.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── formatValue ─────────────────────────────────────────────────────────────

export const CustomFormat: Story = {
  name: 'formatValue',
  render: () => ({
    props: {
      price: 25000,
      money: (v: number) => '$' + v.toLocaleString('es-AR'),
      minutes: 90,
      hhmm: (v: number) => `${Math.floor(v / 60)}h ${String(v % 60).padStart(2, '0')}m`,
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px; max-width:420px;">
        <fs-slider
          label="Presupuesto"
          [min]="0" [max]="100000" [step]="1000"
          [formatValue]="money" [showBounds]="true"
          [(ngModel)]="price"
        ></fs-slider>

        <fs-slider
          label="Duración"
          [min]="0" [max]="240" [step]="15"
          [formatValue]="hhmm" [showBounds]="true"
          [(ngModel)]="minutes"
        ></fs-slider>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados',
  render: () => ({
    props: { v: 70 },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px; max-width:420px;">
        <fs-slider label="Default" hint="Texto de ayuda." unit="%" [(ngModel)]="v"></fs-slider>
        <fs-slider label="Error" state="error" errorMessage="Fuera del rango permitido." unit="%" [(ngModel)]="v"></fs-slider>
        <fs-slider label="Success" state="success" successMessage="Dentro del rango." unit="%" [(ngModel)]="v"></fs-slider>
        <fs-slider label="Disabled" [disabled]="true" unit="%" [(ngModel)]="v"></fs-slider>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Edge case ───────────────────────────────────────────────────────────────

export const EqualBounds: Story = {
  name: 'min igual a max',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:420px;">
        <fs-slider label="min = max = 50" [min]="50" [max]="50" [showBounds]="true"></fs-slider>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Pasa de verdad mientras un formulario todavía está cargando sus límites.
          La fórmula de la referencia divide por cero acá y devuelve <code>NaN</code>,
          que rompe el gradiente en silencio. Se guarda y queda en 0%.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
