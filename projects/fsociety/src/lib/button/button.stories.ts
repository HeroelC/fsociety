import type { Meta, StoryObj } from '@storybook/angular';
import { FsButtonComponent } from './button.component';

// Ícono de ejemplo — arrow right (SVG path)
const ICON_ARROW = 'M3 8h10M9 4l4 4-4 4';
const ICON_SAVE  = 'M13 2H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8l2-2V3a1 1 0 0 0-1-1zM9 12V8m0 0H7m2 0h2';
const ICON_TRASH = 'M4 6h8M7 6V4h2v2M6 6v6a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V6';

const meta: Meta<FsButtonComponent> = {
  title:     'fsociety/Button',
  component: FsButtonComponent,
  tags:      ['autodocs'],

  argTypes: {
    variant: {
      control:     'select',
      options:     ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Variante visual del botón',
      table: {
        type:         { summary: 'FsButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control:     'radio',
      options:     ['sm', 'md', 'lg'],
      description: 'Tamaño del botón',
      table: {
        type:         { summary: 'FsButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      control:     'radio',
      options:     ['button', 'submit', 'reset'],
      description: 'Tipo HTML nativo',
      table: {
        type:         { summary: 'FsButtonType' },
        defaultValue: { summary: 'button' },
      },
    },
    disabled: {
      control:     'boolean',
      description: 'Deshabilita el botón',
      table: {
        type:         { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control:     'boolean',
      description: 'Muestra spinner y deshabilita',
      table: {
        type:         { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control:     'text',
      description: 'Texto del botón',
    },
    fullWidth: {
      control:     'boolean',
      description: 'Ocupa el ancho del contenedor',
      table: {
        type:         { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fsClick: {
      action:      'fsClick',
      description: 'Evento click (no dispara si disabled o loading)',
    },
  },
};

export default meta;
type Story = StoryObj<FsButtonComponent>;

// ---------------------------------------------------------------------------
// Playground — story principal con todos los controles
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    variant:  'primary',
    size:     'md',
    label:    'Guardar cambios',
    disabled: false,
    loading:  false,
    fullWidth: false,
  },
};

// ---------------------------------------------------------------------------
// Variantes
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  name:   'Todas las variantes',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <fs-button variant="primary">Primary</fs-button>
        <fs-button variant="secondary">Secondary</fs-button>
        <fs-button variant="outline">Outline</fs-button>
        <fs-button variant="ghost">Ghost</fs-button>
        <fs-button variant="danger">Danger</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Tamaños
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  name:   'Tamaños',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <fs-button size="sm">Small</fs-button>
        <fs-button size="md">Medium</fs-button>
        <fs-button size="lg">Large</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Estados
// ---------------------------------------------------------------------------

export const States: Story = {
  name:   'Estados',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <fs-button>Normal</fs-button>
        <fs-button [disabled]="true">Disabled</fs-button>
        <fs-button [loading]="true">Loading</fs-button>
        <fs-button variant="outline" [disabled]="true">Outline disabled</fs-button>
        <fs-button variant="danger" [loading]="true">Danger loading</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Con íconos
// ---------------------------------------------------------------------------

export const WithIcons: Story = {
  name:   'Con íconos',
  render: () => ({
    props: {
      iconArrow: ICON_ARROW,
      iconSave:  ICON_SAVE,
      iconTrash: ICON_TRASH,
    },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <fs-button [iconRight]="iconArrow">Ver más</fs-button>
        <fs-button [iconLeft]="iconSave" variant="outline">Guardar</fs-button>
        <fs-button [iconLeft]="iconTrash" variant="danger">Eliminar</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Full width
// ---------------------------------------------------------------------------

export const FullWidth: Story = {
  name:   'Full width',
  render: () => ({
    template: `
      <div style="max-width:320px; display:flex; flex-direction:column; gap:10px;">
        <fs-button [fullWidth]="true">Primary full width</fs-button>
        <fs-button [fullWidth]="true" variant="outline">Outline full width</fs-button>
      </div>
    `,
  }),
};
