import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsCheckboxComponent } from './checkbox.component';

const meta: Meta<FsCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: FsCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [FsCheckboxComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del control — 32 / 40 / 48px. Misma escala que fs-button.',
      table: {
        type:         { summary: 'FsControlSize' },
        defaultValue: { summary: 'md' },
      },
    },
    state: {
      control: 'select',
      options: ['default', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<FsCheckboxComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Acepto los términos',
  },
};

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: {
    label: 'Notificaciones por email',
    description: 'Recibirás resúmenes semanales y alertas importantes.',
  },
};

// ─── Checked ──────────────────────────────────────────────────────────────────

export const Checked: Story = {
  render: (args) => ({
    props: { ...args, model: true },
    template: `
      <fs-checkbox
        label="Acepto los términos"
        description="He leído y acepto los términos de uso y la política de privacidad."
        [(ngModel)]="model"
      ></fs-checkbox>
    `,
  }),
};

// ─── Indeterminate ────────────────────────────────────────────────────────────

export const Indeterminate: Story = {
  args: {
    label: 'Seleccionar todo',
    description: 'Algunos elementos están seleccionados.',
    indeterminate: true,
  },
};

// ─── Error ────────────────────────────────────────────────────────────────────

export const Error: Story = {
  args: {
    label: 'Acepto los términos',
    state: 'error',
    errorMessage: 'Debes aceptar los términos para continuar.',
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => ({
    props: { ...args, model: true },
    template: `
      <fs-checkbox
        label="Plan Pro activo"
        description="Este ajuste lo gestiona tu administrador."
        [disabled]="true"
        [(ngModel)]="model"
      ></fs-checkbox>
    `,
  }),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: {
      v1: false,
      v2: true,
      v3: false,
      v4: false,
      v5: true,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <fs-checkbox
          label="Acepto los términos"
          [(ngModel)]="v1"
        ></fs-checkbox>

        <fs-checkbox
          label="Notificaciones por email"
          description="Recibirás resúmenes semanales y alertas importantes."
          [(ngModel)]="v2"
        ></fs-checkbox>

        <fs-checkbox
          label="Seleccionar todo"
          description="Algunos elementos están seleccionados."
          [indeterminate]="true"
        ></fs-checkbox>

        <fs-checkbox
          label="Acepto los términos"
          state="error"
          errorMessage="Debes aceptar los términos para continuar."
          [(ngModel)]="v4"
        ></fs-checkbox>

        <fs-checkbox
          label="Plan Pro activo"
          description="Este ajuste lo gestiona tu administrador."
          [disabled]="true"
          [(ngModel)]="v5"
        ></fs-checkbox>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
