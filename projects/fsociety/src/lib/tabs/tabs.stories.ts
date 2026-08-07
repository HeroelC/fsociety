import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsTabsComponent } from './tabs.component';

const meta: Meta<FsTabsComponent> = {
  title:     'Components/Tabs',
  component: FsTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [FsTabsComponent],
    }),
  ],
  tags: ['autodocs'],

  argTypes: {
    tabs: {
      control:     'object',
      description: 'Array de FsTab — { id, label, disabled? }',
    },
    activeTab: {
      control:     'text',
      description: 'Id de la tab activa',
    },
    activeTabChange: {
      action:      'activeTabChange',
      description: 'Two-way binding — emite el id de la tab seleccionada',
    },
    tabChange: {
      action:      'tabChange',
      description: 'Emite el objeto FsTab completo al cambiar',
    },
  },
};

export default meta;
type Story = StoryObj<FsTabsComponent>;

/** Estilos del contenido proyectado — siguen el tema activo */
const bodyStyle =
  'padding:20px 0; color:var(--fs-color-text-secondary); font-size:13px;';

// ---------------------------------------------------------------------------
// Portfolio — 3 tabs (caso real)
// ---------------------------------------------------------------------------

export const Portfolio: Story = {
  name: 'Portfolio — 3 tabs',
  args: {
    activeTab: 'experiencia',
    tabs: [
      { id: 'experiencia', label: 'Experiencia' },
      { id: 'sobre-mi',    label: 'Sobre mí' },
      { id: 'formacion',   label: 'Formación' },
    ],
  },
  render: (args) => ({
    props: { ...args, bodyStyle },
    template: `
      <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
        <div [style]="bodyStyle">
          Tab activa: {{ activeTab }}
        </div>
      </fs-tabs>
    `,
  }),
};

// ---------------------------------------------------------------------------
// 4 tabs
// ---------------------------------------------------------------------------

export const FourTabs: Story = {
  name: '4 tabs — ancho distribuido',
  args: {
    activeTab: 'experiencia',
    tabs: [
      { id: 'experiencia', label: 'Experiencia' },
      { id: 'sobre-mi',    label: 'Sobre mí' },
      { id: 'formacion',   label: 'Formación' },
      { id: 'proyectos',   label: 'Proyectos' },
    ],
  },
  render: (args) => ({
    props: { ...args, bodyStyle },
    template: `
      <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
        <div [style]="bodyStyle">
          Tab activa: {{ activeTab }}
        </div>
      </fs-tabs>
    `,
  }),
};

// ---------------------------------------------------------------------------
// 2 tabs
// ---------------------------------------------------------------------------

export const TwoTabs: Story = {
  name: '2 tabs — 50/50',
  args: {
    activeTab: 'info',
    tabs: [
      { id: 'info',     label: 'Información' },
      { id: 'settings', label: 'Configuración' },
    ],
  },
  render: (args) => ({
    props: { ...args, bodyStyle },
    template: `
      <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
        <div [style]="bodyStyle">
          Tab activa: {{ activeTab }}
        </div>
      </fs-tabs>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Con tab deshabilitada
// ---------------------------------------------------------------------------

export const WithDisabled: Story = {
  name: 'Con tab deshabilitada',
  args: {
    activeTab: 'experiencia',
    tabs: [
      { id: 'experiencia', label: 'Experiencia' },
      { id: 'sobre-mi',    label: 'Sobre mí' },
      { id: 'formacion',   label: 'Formación', disabled: true },
      { id: 'proyectos',   label: 'Proyectos' },
    ],
  },
  render: (args) => ({
    props: { ...args, bodyStyle },
    template: `
      <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
        <div [style]="bodyStyle">
          Tab activa: {{ activeTab }}
        </div>
      </fs-tabs>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Con contenido real de portfolio
// ---------------------------------------------------------------------------

export const WithContent: Story = {
  name: 'Con contenido — portfolio completo',
  args: {
    activeTab: 'experiencia',
    tabs: [
      { id: 'experiencia', label: 'Experiencia' },
      { id: 'sobre-mi',    label: 'Sobre mí' },
      { id: 'formacion',   label: 'Formación' },
    ],
  },
  render: (args) => ({
    props: {
      ...args,
      bodyStyle:  'color:var(--fs-color-text-secondary); font-size:13px; line-height:1.7;',
      titleStyle: 'color:var(--fs-color-text-primary);',
    },
    template: `
      <fs-tabs [tabs]="tabs" [(activeTab)]="activeTab">
        <div style="padding:24px 0;">
          @if (activeTab === 'experiencia') {
            <div [style]="bodyStyle">
              <strong [style]="titleStyle">Acme Corp</strong> · Frontend Developer · 2022 – actualidad<br/>
              Angular, TypeScript, RxJS, Node.js
            </div>
          }
          @if (activeTab === 'sobre-mi') {
            <div [style]="bodyStyle">
              Perfil de ejemplo para mostrar contenido proyectado dentro de las tabs.
            </div>
          }
          @if (activeTab === 'formacion') {
            <div [style]="bodyStyle">
              <strong [style]="titleStyle">Example University</strong> · Analista en Sistemas
            </div>
          }
        </div>
      </fs-tabs>
    `,
  }),
};
