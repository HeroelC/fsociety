import type { Meta, StoryObj } from '@storybook/angular';
import { FsButtonComponent } from './button.component';

const CDN = 'https://api.iconify.design';
const I = {
  trash:    `${CDN}/tabler:trash.svg`,
  edit:     `${CDN}/tabler:edit.svg`,
  plus:     `${CDN}/tabler:plus.svg`,
  settings: `${CDN}/tabler:settings.svg`,
  heart:    `${CDN}/tabler:heart.svg`,
  download: `${CDN}/tabler:download.svg`,
  save:     `${CDN}/tabler:device-floppy.svg`,
  arrow:    `${CDN}/tabler:arrow-right.svg`,
  link:     `${CDN}/tabler:external-link.svg`,
};

const meta: Meta<FsButtonComponent> = {
  title:     'Components/Button',
  component: FsButtonComponent,
  tags:      ['autodocs'],

  argTypes: {
    variant: {
      control:     'select',
      options:     ['primary', 'secondary', 'outline', 'ghost', 'danger', 'link'],
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
    iconOnly: {
      control:     'boolean',
      description: 'Botón cuadrado sin label (solo ícono)',
      table: {
        type:         { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ariaLabel: {
      control:     'text',
      description: 'aria-label cuando iconOnly = true',
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
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    variant:   'primary',
    size:      'md',
    label:     'Guardar cambios',
    disabled:  false,
    loading:   false,
    fullWidth: false,
    iconOnly:  false,
  },
};

// ---------------------------------------------------------------------------
// Todas las variantes
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
        <fs-button variant="link">Link</fs-button>
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
        <fs-button variant="ghost" [disabled]="true">Ghost disabled</fs-button>
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
    props: { I },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
        <fs-button [iconRight]="I.arrow">Ver más</fs-button>
        <fs-button [iconLeft]="I.save" variant="outline">Guardar</fs-button>
        <fs-button [iconLeft]="I.trash" variant="danger">Eliminar</fs-button>
        <fs-button [iconLeft]="I.save" variant="ghost">Guardar borrador</fs-button>
        <fs-button [iconLeft]="I.link" variant="link">Ver enlace</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Icon-only
// ---------------------------------------------------------------------------

export const IconOnly: Story = {
  name:   'Solo ícono',
  render: () => ({
    props: { I },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px;">

        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <span style="font-size:12px;color:#888;width:80px">Primary</span>
          <fs-button variant="primary"   [iconLeft]="I.plus"     [iconOnly]="true" size="sm" ariaLabel="Agregar"></fs-button>
          <fs-button variant="primary"   [iconLeft]="I.plus"     [iconOnly]="true" size="md" ariaLabel="Agregar"></fs-button>
          <fs-button variant="primary"   [iconLeft]="I.plus"     [iconOnly]="true" size="lg" ariaLabel="Agregar"></fs-button>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <span style="font-size:12px;color:#888;width:80px">Outline</span>
          <fs-button variant="outline"   [iconLeft]="I.edit"     [iconOnly]="true" size="sm" ariaLabel="Editar"></fs-button>
          <fs-button variant="outline"   [iconLeft]="I.edit"     [iconOnly]="true" size="md" ariaLabel="Editar"></fs-button>
          <fs-button variant="outline"   [iconLeft]="I.edit"     [iconOnly]="true" size="lg" ariaLabel="Editar"></fs-button>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <span style="font-size:12px;color:#888;width:80px">Ghost</span>
          <fs-button variant="ghost"     [iconLeft]="I.settings" [iconOnly]="true" size="sm" ariaLabel="Configuración"></fs-button>
          <fs-button variant="ghost"     [iconLeft]="I.settings" [iconOnly]="true" size="md" ariaLabel="Configuración"></fs-button>
          <fs-button variant="ghost"     [iconLeft]="I.settings" [iconOnly]="true" size="lg" ariaLabel="Configuración"></fs-button>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <span style="font-size:12px;color:#888;width:80px">Danger</span>
          <fs-button variant="danger"    [iconLeft]="I.trash"    [iconOnly]="true" size="sm" ariaLabel="Eliminar"></fs-button>
          <fs-button variant="danger"    [iconLeft]="I.trash"    [iconOnly]="true" size="md" ariaLabel="Eliminar"></fs-button>
          <fs-button variant="danger"    [iconLeft]="I.trash"    [iconOnly]="true" size="lg" ariaLabel="Eliminar"></fs-button>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center;">
          <span style="font-size:12px;color:#888;width:80px">Disabled</span>
          <fs-button variant="ghost"  [iconLeft]="I.heart"    [iconOnly]="true" [disabled]="true" ariaLabel="Me gusta"></fs-button>
          <fs-button variant="outline" [iconLeft]="I.download" [iconOnly]="true" [disabled]="true" ariaLabel="Descargar"></fs-button>
        </div>

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
        <fs-button [fullWidth]="true" variant="ghost">Ghost full width</fs-button>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Link — uso inline
// ---------------------------------------------------------------------------

export const LinkInline: Story = {
  name:   'Link — uso inline',
  render: () => ({
    template: `
      <p style="font-size:14px; color:#64748b; line-height:1.7;">
        Trabajé 3 años en desarrollo frontend.
        <fs-button variant="link" size="sm">Ver detalle</fs-button>
        o revisá el
        <fs-button variant="link" size="sm">repositorio</fs-button>
        en GitHub.
      </p>
    `,
  }),
};
