import type { Meta, StoryObj } from '@storybook/angular';
import { FsBadgeComponent } from './badge.component';

// Íconos comunes como SVG paths (viewBox 0 0 16 16)
export const ICONS = {
  github:   'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z',
  html:     'M1.5 0h13l-1.5 14-6 2-6-2zm4.5 5h5.5l.5-3H5l.5 2.5H10l-.25 2.75-2.25.5-2.25-.5L5.25 8.5',
  css:      'M1.5 0h13l-1.5 14-6 2-6-2zm5 4l-.25 3h4.25l-.5 4-2.5.75-2.5-.75-.1-1.25h2l.05.75 1.05.25 1-.25.15-2H5.5L5 4z',
  js:       'M2 2h12v12H2zm6.5 9.5c.28.5.65.87 1.35.87.65 0 1.15-.33 1.15-.95 0-.63-.45-.85-1.2-1.2l-.4-.17c-1.2-.5-2-.85-2-1.87C7.4 7.17 8.2 6.5 9.35 6.5c.8 0 1.4.28 1.8.97l-.95.62c-.22-.38-.45-.53-.85-.53-.38 0-.65.2-.65.5 0 .38.25.55 1 .88l.4.17c1.4.6 2.2.97 2.2 2.1 0 1.2-.93 1.9-2.2 1.9-1.23 0-2.03-.62-2.4-1.43zM5.5 11c.2.37.38.7 1.03.7.6 0 .87-.27.87-.97V6.5H8.5v4.25c0 1.5-.88 2.18-2.17 2.18-1.15 0-1.83-.6-2.18-1.33z',
  angular:  'M8 1L1.5 3.5l1 8.5L8 15l5.5-3 1-8.5zM8 3.5L4.5 12h1.25L6.75 10h2.5l1 2h1.25zM8 5.5L9.25 9h-2.5z',
  node:     'M8 1.5L2 5v6l6 3.5L14 11V5zm0 2l4 2.5v5L8 13.5 4 11V6z',
  aws:      'M4.5 9.5c-.28.5-.45 1.1-.45 1.75C4.05 13.32 5.73 15 7.8 15c1.2 0 2.27-.57 2.97-1.45.43.1.88.15 1.33.15 2.2 0 3.9-1.58 3.9-3.7 0-.9-.3-1.72-.82-2.37.05-.25.07-.5.07-.76C15.25 4.7 13.55 3 11.5 3c-.38 0-.75.05-1.1.15C9.75 2.43 8.75 2 7.6 2 5.5 2 3.8 3.68 3.75 5.78c0 .3.03.6.1.87C3.1 7.4 2.5 8.4 2.5 9.5c0 .35.05.68.15 1H4.5z',
  check:    'M2 8l4 4 8-8',
  star:     'M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4 4.3 12.3l.7-4.1-3-2.9 4.2-.7z',
  zap:      'M13 2L4.5 9h5.5l-3 7 8.5-9H10z',
  terminal: 'M2 3h12v10H2zm2 3l2 2-2 2m4 0h4',
};

const meta: Meta<FsBadgeComponent> = {
  title:     'fsociety/Badge',
  component: FsBadgeComponent,
  tags:      ['autodocs'],

  argTypes: {
    color: {
      control:  'select',
      options:  ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'neutral'],
      description: 'Color semántico',
      table: { type: { summary: 'FsBadgeColor' }, defaultValue: { summary: 'neutral' } },
    },
    variant: {
      control:  'radio',
      options:  ['filled', 'outline'],
      description: 'Filled = fondo sutil · outline = solo borde',
      table: { type: { summary: 'FsBadgeVariant' }, defaultValue: { summary: 'filled' } },
    },
    size: {
      control:  'radio',
      options:  ['sm', 'md'],
      table: { type: { summary: 'FsBadgeSize' }, defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Texto del badge',
    },
    dot: {
      control: 'boolean',
      description: 'Muestra punto de estado',
      table: { defaultValue: { summary: 'false' } },
    },
    iconLeft: {
      control: 'text',
      description: 'SVG path del ícono izquierdo (viewBox 0 0 16 16)',
    },
    iconRight: {
      control: 'text',
      description: 'SVG path del ícono derecho (viewBox 0 0 16 16)',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Solo ícono — badge circular sin label',
      table: { defaultValue: { summary: 'false' } },
    },
    removable: {
      control: 'boolean',
      description: 'Muestra botón de remoción',
      table: { defaultValue: { summary: 'false' } },
    },
    removed: {
      action: 'removed',
      description: 'Emite al clickear el botón X',
    },
  },
};

export default meta;
type Story = StoryObj<FsBadgeComponent>;

export const Playground: Story = {
  args: {
    color:    'primary',
    variant:  'filled',
    size:     'md',
    label:    'Angular',
    dot:      false,
    iconOnly: false,
    removable: false,
  },
};

export const AllColors: Story = {
  name: 'Todos los colores',
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <fs-badge color="primary">Primary</fs-badge>
        <fs-badge color="secondary">Secondary</fs-badge>
        <fs-badge color="tertiary">Tertiary</fs-badge>
        <fs-badge color="success">Success</fs-badge>
        <fs-badge color="warning">Warning</fs-badge>
        <fs-badge color="danger">Danger</fs-badge>
        <fs-badge color="neutral">Neutral</fs-badge>
      </div>
    `,
  }),
};

export const WithIconLeft: Story = {
  name: 'Con ícono izquierdo',
  render: () => ({
    props: { ICONS },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <fs-badge color="neutral"   [iconLeft]="ICONS.github">GitHub</fs-badge>
        <fs-badge color="warning"   [iconLeft]="ICONS.html">HTML5</fs-badge>
        <fs-badge color="primary"   [iconLeft]="ICONS.css">CSS3</fs-badge>
        <fs-badge color="warning"   [iconLeft]="ICONS.js">JavaScript</fs-badge>
        <fs-badge color="danger"    [iconLeft]="ICONS.angular">Angular</fs-badge>
        <fs-badge color="success"   [iconLeft]="ICONS.node">Node.js</fs-badge>
        <fs-badge color="secondary" [iconLeft]="ICONS.aws">AWS</fs-badge>
      </div>
    `,
  }),
};

export const WithIconRight: Story = {
  name: 'Con ícono derecho',
  render: () => ({
    props: { ICONS },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <fs-badge color="success" [iconRight]="ICONS.check">Verificado</fs-badge>
        <fs-badge color="warning" [iconRight]="ICONS.zap">Rápido</fs-badge>
        <fs-badge color="primary" [iconRight]="ICONS.star">Destacado</fs-badge>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  name: 'Solo ícono — circular',
  render: () => ({
    props: { ICONS },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <fs-badge color="neutral"   [iconLeft]="ICONS.github"   [iconOnly]="true"></fs-badge>
        <fs-badge color="warning"   [iconLeft]="ICONS.html"     [iconOnly]="true"></fs-badge>
        <fs-badge color="primary"   [iconLeft]="ICONS.css"      [iconOnly]="true"></fs-badge>
        <fs-badge color="warning"   [iconLeft]="ICONS.js"       [iconOnly]="true"></fs-badge>
        <fs-badge color="danger"    [iconLeft]="ICONS.angular"  [iconOnly]="true"></fs-badge>
      </div>
    `,
  }),
};

export const TechStack: Story = {
  name: 'Tech stack — caso portfolio',
  render: () => ({
    props: { ICONS },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        <fs-badge color="danger"    [iconLeft]="ICONS.angular"  [dot]="true">Angular</fs-badge>
        <fs-badge color="primary"   [iconLeft]="ICONS.terminal"            >TypeScript</fs-badge>
        <fs-badge color="warning"   [iconLeft]="ICONS.js"                  >JavaScript</fs-badge>
        <fs-badge color="success"   [iconLeft]="ICONS.node"                >Node.js</fs-badge>
        <fs-badge color="secondary" [iconLeft]="ICONS.aws"                 >AWS</fs-badge>
        <fs-badge color="neutral"                                          >ESLint</fs-badge>
        <fs-badge color="neutral"                                          >Husky</fs-badge>
      </div>
    `,
  }),
};

export const Removable: Story = {
  name: 'Removable con íconos',
  render: () => ({
    props: { ICONS },
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <fs-badge color="danger"    [iconLeft]="ICONS.angular"  [removable]="true">Angular</fs-badge>
        <fs-badge color="primary"   [iconLeft]="ICONS.terminal" [removable]="true">TypeScript</fs-badge>
        <fs-badge color="secondary" [iconLeft]="ICONS.aws"      [removable]="true">AWS</fs-badge>
        <fs-badge color="neutral"                               [removable]="true">ESLint</fs-badge>
      </div>
    `,
  }),
};
