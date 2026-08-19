import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsNumberInputComponent } from './number-input.component';

const meta: Meta<FsNumberInputComponent> = {
  title: 'Components/NumberInput',
  component: FsNumberInputComponent,
  decorators: [
    moduleMetadata({ imports: [FsNumberInputComponent, FormsModule] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    corners: {
      control: { type: 'inline-radio' },
      options: ['all', 'none', 'top', 'bottom', 'start', 'end'],
    },
    state: { control: 'select', options: ['default', 'error', 'success'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<FsNumberInputComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    corners: 'all',
    label: 'Cantidad',
    hint: 'Usá los botones, las flechas o tipeá.',
    placeholder: '0',
    min: 0,
    max: 99,
    step: 1,
    prefix: '',
    suffix: '',
    state: 'default',
    disabled: false,
    readonly: false,
    allowEmpty: true,
  },
  render: (args) => ({
    props: { ...args, value: 1 },
    template: `
      <div style="max-width:200px;">
        <fs-number-input [corners]="corners"
          [label]="label"
          [hint]="hint"
          [placeholder]="placeholder"
          [min]="min" [max]="max" [step]="step"
          [prefix]="prefix" [suffix]="suffix"
          [state]="state"
          [disabled]="disabled" [readonly]="readonly"
          [allowEmpty]="allowEmpty"
          [(ngModel)]="value"
        ></fs-number-input>
      </div>
    `,
  }),
};

// ─── Prefix / suffix ─────────────────────────────────────────────────────────

export const PrefixSuffix: Story = {
  name: 'Prefijo y sufijo',
  render: () => ({
    props: { price: 1200, weight: 2.5, pct: 15 },
    template: `
      <div style="display:flex; flex-direction:column; gap:18px; max-width:220px;">
        <fs-number-input label="Precio" prefix="$" [min]="0" [step]="100" [(ngModel)]="price"></fs-number-input>
        <fs-number-input label="Peso" suffix="kg" [min]="0" [step]="0.5" [(ngModel)]="weight"></fs-number-input>
        <fs-number-input label="Descuento" suffix="%" [min]="0" [max]="100" [step]="5" [(ngModel)]="pct"></fs-number-input>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Decimals ────────────────────────────────────────────────────────────────

export const Decimals: Story = {
  name: 'Decimales — sin drift de flotantes',
  render: () => ({
    props: { value: 0 },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:340px;">
        <fs-number-input label="Paso 0.1" [step]="0.1" [min]="0" [max]="5" [(ngModel)]="value"></fs-number-input>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Valor: <code style="color:var(--fs-color-primary)">{{ value }}</code><br>
          Apretá <b>+</b> diez veces. Tiene que dar <code>1</code>, no
          <code>0.9999999999999999</code> — el resultado se redondea a la
          precisión del <code>step</code>.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Empty ───────────────────────────────────────────────────────────────────

export const Emptiable: Story = {
  name: 'Se puede vaciar',
  render: () => ({
    props: { a: 5, b: 5 },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:340px;">
        <div>
          <fs-number-input label="allowEmpty = true (default)" [min]="1" [max]="10" [(ngModel)]="a"></fs-number-input>
          <div style="font-size:12.5px; color:var(--fs-color-text-secondary); margin-top:6px;">
            Modelo: <code style="color:var(--fs-color-primary)">{{ a === null ? 'null' : a }}</code>
          </div>
        </div>

        <div>
          <fs-number-input label="allowEmpty = false" [allowEmpty]="false" [min]="1" [max]="10" [(ngModel)]="b"></fs-number-input>
          <div style="font-size:12.5px; color:var(--fs-color-text-secondary); margin-top:6px;">
            Modelo: <code style="color:var(--fs-color-primary)">{{ b === null ? 'null' : b }}</code>
            — al salir del campo vacío vuelve a <code>min</code>.
          </div>
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
    props: { v: 42 },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:240px;">
        <fs-number-input label="Default" hint="Entre 0 y 99." [min]="0" [max]="99" [(ngModel)]="v"></fs-number-input>
        <fs-number-input label="Error" state="error" errorMessage="Fuera de rango." [(ngModel)]="v"></fs-number-input>
        <fs-number-input label="Success" state="success" successMessage="Disponible." [(ngModel)]="v"></fs-number-input>
        <fs-number-input label="Disabled" [disabled]="true" [(ngModel)]="v"></fs-number-input>
        <fs-number-input label="Readonly" [readonly]="true" [(ngModel)]="v"></fs-number-input>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Bounds ──────────────────────────────────────────────────────────────────

export const Bounds: Story = {
  name: 'Límites — los botones se deshabilitan solos',
  render: () => ({
    props: { v: 3 },
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:340px;">
        <fs-number-input label="Entre 1 y 5" [min]="1" [max]="5" [(ngModel)]="v"></fs-number-input>
        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Valor: <code style="color:var(--fs-color-primary)">{{ v }}</code><br>
          En <code>1</code> el botón <b>−</b> queda deshabilitado, en <code>5</code> el <b>+</b>.
          <code>PageUp</code> y <code>PageDown</code> mueven diez pasos de una.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
