import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsSpinnerComponent } from './spinner.component';
import { FsButtonComponent } from '../button/button.component';

const meta: Meta<FsSpinnerComponent> = {
  title: 'Components/Spinner',
  component: FsSpinnerComponent,
  decorators: [moduleMetadata({ imports: [FsSpinnerComponent, FsButtonComponent] })],
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<FsSpinnerComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    size: 'md',
    label: 'Cargando',
  },
  render: (args) => ({
    props: args,
    template: `<fs-spinner [size]="size" [label]="label"></fs-spinner>`,
  }),
  parameters: { layout: 'centered' },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:24px;">
        <fs-spinner size="sm"></fs-spinner>
        <fs-spinner size="md"></fs-spinner>
        <fs-spinner size="lg"></fs-spinner>
        <fs-spinner style="--fs-spinner-size: 40px;"></fs-spinner>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
};

// ─── currentColor ────────────────────────────────────────────────────────────

export const InheritsColor: Story = {
  name: 'Hereda el color',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <p style="margin:0; font-size:12px; color:var(--fs-color-text-secondary); max-width:380px;">
          El arco se dibuja con <code>currentColor</code>. No tiene input de color:
          toma el del contexto, que es lo que lo hace correcto dentro de cualquier
          variante de botón sin configurar nada.
        </p>
        <div style="display:flex; align-items:center; gap:24px;">
          <span style="color:var(--fs-color-primary);"><fs-spinner size="lg"></fs-spinner></span>
          <span style="color:var(--fs-color-success);"><fs-spinner size="lg"></fs-spinner></span>
          <span style="color:var(--fs-color-warning);"><fs-spinner size="lg"></fs-spinner></span>
          <span style="color:var(--fs-color-error);"><fs-spinner size="lg"></fs-spinner></span>
          <span style="color:var(--fs-color-text-secondary);"><fs-spinner size="lg"></fs-spinner></span>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
};

// ─── With text ───────────────────────────────────────────────────────────────

export const WithText: Story = {
  name: 'Con texto',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:10px;
                  color:var(--fs-color-text-secondary); font-size:13px;">
        <span style="color:var(--fs-color-primary);"><fs-spinner></fs-spinner></span>
        Sincronizando con Acme Corp…
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
};

// ─── Speed ───────────────────────────────────────────────────────────────────

export const Speed: Story = {
  name: 'Velocidad',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; color:var(--fs-color-primary);">
        <p style="margin:0; max-width:420px; font-size:12px; color:var(--fs-color-text-secondary);">
          El período del giro se controla con <code>--fs-spinner-duration</code>
          (0.7s por defecto). No usa los tokens de transición: esos miden un
          cambio de estado que pasa una vez, no el período de un loop.
        </p>
        <div style="display:flex; align-items:center; gap:32px;">
          <span style="--fs-spinner-duration: 0.35s;"><fs-spinner size="lg"></fs-spinner></span>
          <span style="--fs-spinner-duration: 0.7s;"><fs-spinner size="lg"></fs-spinner></span>
          <span style="--fs-spinner-duration: 1.2s;"><fs-spinner size="lg"></fs-spinner></span>
        </div>
        <div style="display:flex; gap:32px; font-size:11px; color:var(--fs-color-text-secondary);">
          <span style="width:32px; text-align:center;">0.35s</span>
          <span style="width:32px; text-align:center;">0.7s</span>
          <span style="width:32px; text-align:center;">1.2s</span>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
};

// ─── Inside a button ─────────────────────────────────────────────────────────

export const InsideButton: Story = {
  name: 'Dentro de fs-button',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:12px;">
        <fs-button variant="primary" [loading]="true">Guardando</fs-button>
        <fs-button variant="outline" [loading]="true">Guardando</fs-button>
        <fs-button variant="danger" [loading]="true">Eliminando</fs-button>
      </div>
    `,
  }),
  parameters: { layout: 'centered' },
};
