import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsBreadcrumbsComponent, FsBreadcrumb } from './breadcrumbs.component';

const CDN = 'https://api.iconify.design';
const I = {
  home: `${CDN}/tabler:home.svg`,
  folder: `${CDN}/tabler:folder.svg`,
  file: `${CDN}/tabler:file-text.svg`,
  users: `${CDN}/tabler:users.svg`,
  slash: `${CDN}/tabler:slash.svg`,
  point: `${CDN}/tabler:point-filled.svg`,
};

const meta: Meta<FsBreadcrumbsComponent> = {
  title: 'Components/Breadcrumbs',
  component: FsBreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [FsBreadcrumbsComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FsBreadcrumbsComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Proyectos', href: '/proyectos' },
      { label: 'Acme Corp', href: '/proyectos/acme' },
      { label: 'Configuración' },
    ] as FsBreadcrumb[],
  },
};

// ─── Solo label ──────────────────────────────────────────────────────────────

export const LabelOnly: Story = {
  name: 'Solo label',
  args: {
    items: [
      { label: 'Inicio', href: '/' },
      { label: 'Equipo', href: '/equipo' },
      { label: 'John Doe' },
    ] as FsBreadcrumb[],
  },
};

// ─── Label con ícono ─────────────────────────────────────────────────────────

export const WithIcons: Story = {
  name: 'Label con ícono',
  args: {
    items: [
      { label: 'Inicio', icon: I.home, href: '/' },
      { label: 'Equipo', icon: I.users, href: '/equipo' },
      { label: 'Documentos', icon: I.folder, href: '/equipo/docs' },
      { label: 'Contrato.pdf', icon: I.file },
    ] as FsBreadcrumb[],
  },
};

// ─── Solo ícono ──────────────────────────────────────────────────────────────

export const IconOnly: Story = {
  name: 'Solo ícono',
  parameters: {
    docs: {
      description: {
        story:
          'Con `iconOnly` el texto desaparece, pero `label` sigue siendo obligatorio: ' +
          'el ícono es `aria-hidden`, así que el label pasa a ser el `aria-label`. ' +
          'Un link sin nombre accesible se anuncia como "link" y nada más.',
      },
    },
  },
  args: {
    items: [
      { label: 'Inicio', icon: I.home, iconOnly: true, href: '/' },
      { label: 'Proyectos', href: '/proyectos' },
      { label: 'Acme Corp', href: '/proyectos/acme' },
      { label: 'Configuración' },
    ] as FsBreadcrumb[],
  },
};

// ─── Sin links ───────────────────────────────────────────────────────────────

export const NoLinks: Story = {
  name: 'Sin links',
  parameters: {
    docs: {
      description: {
        story:
          'Un item sin `href` es texto plano. Sirve para un nivel que existe en la ' +
          'jerarquía pero no tiene página propia — acá "2026" agrupa, no navega.',
      },
    },
  },
  args: {
    items: [
      { label: 'Inicio', icon: I.home, href: '/' },
      { label: 'Reportes', href: '/reportes' },
      { label: '2026' },
      { label: 'Marzo' },
    ] as FsBreadcrumb[],
  },
};

// ─── Todo junto ──────────────────────────────────────────────────────────────

export const Mixed: Story = {
  name: 'Todo junto',
  parameters: {
    docs: {
      description: {
        story:
          'Las cuatro formas en una sola ruta: solo ícono, ícono con label, solo ' +
          'label sin link, y el item actual — que nunca es link, ni aunque le pases ' +
          '`href`. Un link a donde ya estás no lleva a ningún lado.',
      },
    },
  },
  args: {
    items: [
      { label: 'Inicio', icon: I.home, iconOnly: true, href: '/' },
      { label: 'Equipo', icon: I.users, href: '/equipo' },
      { label: 'Archivados' },
      { label: 'Contrato.pdf', icon: I.file, href: '/equipo/contrato' },
    ] as FsBreadcrumb[],
  },
};

// ─── Separador propio ────────────────────────────────────────────────────────

export const CustomSeparator: Story = {
  name: 'Separador propio',
  render: () => ({
    props: { I, items: [
      { label: 'Inicio', href: '/' },
      { label: 'Tienda', href: '/tienda' },
      { label: 'Zapatillas' },
    ] },
    template: `
      <div style="display: grid; gap: 16px">
        <fs-breadcrumbs [items]="items" [separator]="I.slash"></fs-breadcrumbs>
        <fs-breadcrumbs [items]="items" [separator]="I.point"></fs-breadcrumbs>
      </div>
    `,
  }),
};

// ─── Navegación con router ───────────────────────────────────────────────────

export const Navigation: Story = {
  name: 'Navegación',
  parameters: {
    docs: {
      description: {
        story:
          'Los items son `<a href>` de verdad: andan solos, se abren en pestaña nueva ' +
          'con ctrl+click y se pueden copiar. El output `navigate` es para routear — ' +
          '`event.preventDefault()` y `router.navigateByUrl(item.href)`. La librería no ' +
          'depende de `@angular/router`, así que la decisión queda de tu lado.',
      },
    },
  },
  render: () => ({
    props: {
      last: '—',
      items: [
        { label: 'Inicio', href: '/' },
        { label: 'Proyectos', href: '/proyectos' },
        { label: 'Acme Corp', href: '/proyectos/acme' },
        { label: 'Configuración' },
      ],
      onNavigate(this: { last: string }, e: { item: FsBreadcrumb; index: number; event: MouseEvent }) {
        e.event.preventDefault();
        this.last = `${e.item.label} (índice ${e.index}) → ${e.item.href}`;
      },
    },
    template: `
      <div style="display: grid; gap: 12px">
        <fs-breadcrumbs [items]="items" (navigate)="onNavigate($event)"></fs-breadcrumbs>
        <p style="margin: 0; color: var(--fs-color-text-secondary)">
          Último click: <strong>{{ last }}</strong>
        </p>
      </div>
    `,
  }),
};

// ─── Ruta larga ──────────────────────────────────────────────────────────────

export const LongTrail: Story = {
  name: 'Ruta larga',
  parameters: {
    docs: {
      description: {
        story:
          'La lista wrapea en vez de scrollear: una ruta que no entra sigue siendo ' +
          'legible en la segunda línea. Colapsar el medio es decisión del consumidor, ' +
          'que sabe qué niveles importan — se hace cortando el array.',
      },
    },
  },
  render: () => ({
    props: {
      items: [
        { label: 'Inicio', href: '/' },
        { label: 'Organización', href: '/org' },
        { label: 'Departamento de Ingeniería', href: '/org/eng' },
        { label: 'Plataforma', href: '/org/eng/plataforma' },
        { label: 'Design System', href: '/org/eng/plataforma/ds' },
        { label: 'Componentes' },
      ],
    },
    template: `
      <div style="max-width: 340px; border: 1px dashed var(--fs-color-border); padding: 12px">
        <fs-breadcrumbs [items]="items"></fs-breadcrumbs>
      </div>
    `,
  }),
};
