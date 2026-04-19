import type { Meta, StoryObj } from '@storybook/angular';
import { FsBadgeComponent } from './badge.component';

const meta: Meta<FsBadgeComponent> = {
  title:     'fsociety/Badge',
  component: FsBadgeComponent,
  tags:      ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary','secondary','tertiary','success','warning','danger','neutral'],
      description: 'Color semántico del badge',
    },
    customColor: {
      control: 'color',
      description: 'Color hex personalizado — tiene prioridad sobre color. Genera fondo, borde y texto automáticamente.',
    },
    variant:     { control: 'radio',   options: ['filled','outline'] },
    size:        { control: 'radio',   options: ['sm','md'] },
    imgLeft: {
      control: 'text',
      description: 'URL de imagen izquierda — ej: https://cdn.simpleicons.org/angular/white',
    },
    imgRight: {
      control: 'text',
      description: 'URL de imagen derecha',
    },
    imgLeftAlt:  { control: 'text', description: 'Alt text para imgLeft' },
    imgRightAlt: { control: 'text', description: 'Alt text para imgRight' },
    dot:         { control: 'boolean' },
    iconOnly:    { control: 'boolean' },
    removable:   { control: 'boolean' },
    removed:     { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<FsBadgeComponent>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    color:      'primary',
    variant:    'filled',
    size:       'md',
    label:      'TypeScript',
    imgLeft:    '',
    imgRight:   '',
    imgLeftAlt: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-badge
        [color]="color"
        [customColor]="customColor"
        [variant]="variant"
        [size]="size"
        [dot]="dot"
        [iconOnly]="iconOnly"
        [removable]="removable"
        [imgLeft]="imgLeft || undefined"
        [imgRight]="imgRight || undefined"
        [imgLeftAlt]="imgLeftAlt"
        [imgRightAlt]="imgRightAlt"
        (removed)="removed($event)"
      >{{ label }}</fs-badge>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Colores semánticos
// ---------------------------------------------------------------------------

export const SemanticColors: Story = {
  name: 'Colores semánticos',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
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

// ---------------------------------------------------------------------------
// Custom colors
// ---------------------------------------------------------------------------

export const CustomColors: Story = {
  name: 'Custom colors — hex',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          <fs-badge customColor="#7c3aed">NestJS</fs-badge>
          <fs-badge customColor="#ea580c">Firebase</fs-badge>
          <fs-badge customColor="#14b8a6">Tailwind</fs-badge>
          <fs-badge customColor="#0f172a">Docker</fs-badge>
          <fs-badge customColor="#d97706">Kubernetes</fs-badge>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          <fs-badge customColor="#7c3aed" variant="outline">NestJS outline</fs-badge>
          <fs-badge customColor="#ea580c" variant="outline">Firebase outline</fs-badge>
          <fs-badge customColor="#14b8a6" variant="outline">Tailwind outline</fs-badge>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Con imágenes
// ---------------------------------------------------------------------------

export const WithImages: Story = {
  name: 'Con imgLeft — logos de tecnologías',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <fs-badge color="danger"
          imgLeft="https://cdn.simpleicons.org/angular/white"
          imgLeftAlt="Angular">
          Angular
        </fs-badge>
        <fs-badge color="primary"
          imgLeft="https://cdn.simpleicons.org/typescript/white"
          imgLeftAlt="TypeScript">
          TypeScript
        </fs-badge>
        <fs-badge color="success"
          imgLeft="https://cdn.simpleicons.org/nodedotjs/white"
          imgLeftAlt="Node.js">
          Node.js
        </fs-badge>
        <fs-badge customColor="#7c3aed"
          imgLeft="https://cdn.simpleicons.org/nestjs/white"
          imgLeftAlt="NestJS">
          NestJS
        </fs-badge>
        <fs-badge customColor="#ea580c"
          imgLeft="https://cdn.simpleicons.org/firebase/white"
          imgLeftAlt="Firebase">
          Firebase
        </fs-badge>
        <fs-badge customColor="#0ea5e9"
          imgLeft="https://cdn.simpleicons.org/amazonaws/white"
          imgLeftAlt="AWS">
          AWS
        </fs-badge>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Variante outline
// ---------------------------------------------------------------------------

export const Outline: Story = {
  name: 'Variante outline',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <fs-badge color="primary"   variant="outline">Primary</fs-badge>
        <fs-badge color="secondary" variant="outline">Secondary</fs-badge>
        <fs-badge color="success"   variant="outline">Success</fs-badge>
        <fs-badge color="warning"   variant="outline">Warning</fs-badge>
        <fs-badge color="danger"    variant="outline">Danger</fs-badge>
        <fs-badge color="neutral"   variant="outline">Neutral</fs-badge>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Tamaños
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  name: 'Tamaños sm / md',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          <span style="font-size:11px;color:rgba(255,255,255,0.4);min-width:20px">md</span>
          <fs-badge color="primary"  size="md">Angular</fs-badge>
          <fs-badge color="success"  size="md">Node.js</fs-badge>
          <fs-badge color="neutral"  size="md">ESLint</fs-badge>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
          <span style="font-size:11px;color:rgba(255,255,255,0.4);min-width:20px">sm</span>
          <fs-badge color="primary"  size="sm">Angular</fs-badge>
          <fs-badge color="success"  size="sm">Node.js</fs-badge>
          <fs-badge color="neutral"  size="sm">ESLint</fs-badge>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Dot / removable
// ---------------------------------------------------------------------------

export const States: Story = {
  name: 'Dot y removable',
  render: () => ({
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <fs-badge color="success" [dot]="true">Activo</fs-badge>
        <fs-badge color="danger"  [dot]="true">Error</fs-badge>
        <fs-badge color="warning" [dot]="true">Pendiente</fs-badge>
        <fs-badge color="primary" [removable]="true">TypeScript</fs-badge>
        <fs-badge color="neutral" [removable]="true">ESLint</fs-badge>
      </div>
    `,
  }),
};
