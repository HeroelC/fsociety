import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsProgressComponent } from './progress.component';

const meta: Meta<FsProgressComponent> = {
  title: 'Components/Progress',
  component: FsProgressComponent,
  decorators: [moduleMetadata({ imports: [FsProgressComponent] })],
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['primary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<FsProgressComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    value: 68,
    max: 100,
    label: 'Subiendo informe-anual.pdf',
    showValue: true,
    indeterminate: false,
    tone: 'primary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px;">
        <fs-progress
          [value]="value"
          [max]="max"
          [label]="label"
          [showValue]="showValue"
          [indeterminate]="indeterminate"
          [tone]="tone"
          [size]="size"
        ></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Determinate vs indeterminate ────────────────────────────────────────────

export const Modes: Story = {
  name: 'Determinado e indeterminado',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:420px;">
        <fs-progress [value]="68" label="Subiendo archivo…" [showValue]="true"></fs-progress>
        <fs-progress [indeterminate]="true" label="Procesando…"></fs-progress>
        <fs-progress [value]="42"></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Tones ───────────────────────────────────────────────────────────────────

export const Tones: Story = {
  name: 'Tonos',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:420px;">
        <fs-progress [value]="72" tone="primary" label="Primary" [showValue]="true"></fs-progress>
        <fs-progress [value]="100" tone="success" label="Completado" [showValue]="true"></fs-progress>
        <fs-progress [value]="88" tone="warning" label="Cerca del límite" [showValue]="true"></fs-progress>
        <fs-progress [value]="96" tone="danger" label="Almacenamiento casi lleno" [showValue]="true"></fs-progress>
        <fs-progress [value]="34" tone="neutral" label="Neutral" [showValue]="true"></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:420px;">
        <fs-progress [value]="60" size="sm" label="sm"></fs-progress>
        <fs-progress [value]="60" size="md" label="md"></fs-progress>
        <fs-progress [value]="60" size="lg" label="lg"></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Custom scale ────────────────────────────────────────────────────────────

export const CustomMax: Story = {
  name: 'Escala propia',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:420px;">
        <p style="margin:0; font-size:12px; color:var(--fs-color-text-secondary);">
          <code>max</code> evita tener que convertir a porcentaje en el template.
          El porcentaje que se muestra sale de <code>value / max</code>.
        </p>
        <fs-progress [value]="7" [max]="12" label="7 de 12 pasos" [showValue]="true"></fs-progress>
        <fs-progress [value]="3.4" [max]="8" label="3,4 GB de 8 GB" [showValue]="true" tone="neutral"></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Theming ─────────────────────────────────────────────────────────────────

export const Theming: Story = {
  name: 'Custom properties',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:420px;">
        <fs-progress [value]="64" label="Default" [showValue]="true"></fs-progress>

        <fs-progress
          [value]="64"
          label="Barra gruesa y cuadrada"
          [showValue]="true"
          style="--fs-progress-height: 18px; --fs-progress-radius: var(--fs-radius-sm);"
        ></fs-progress>

        <fs-progress
          [value]="64"
          label="Relleno propio"
          [showValue]="true"
          style="--fs-progress-fill: linear-gradient(90deg, var(--fs-secondary-base), var(--fs-primary-base));"
        ></fs-progress>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
