import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsCardComponent } from './card.component';
import { FsRowCardComponent } from './row-card.component';
import { FsStatCardComponent } from './stat-card.component';
import { FsButtonComponent } from '../button/button.component';
import { FsBadgeComponent } from '../badge/badge.component';

const CDN = 'https://api.iconify.design';
const ICONS = {
  sparkle: `${CDN}/tabler:sparkles.svg`,
  upload: `${CDN}/tabler:cloud-upload.svg`,
  mail: `${CDN}/tabler:mail.svg`,
  user: `${CDN}/tabler:user.svg`,
  arrowRight: `${CDN}/tabler:arrow-right.svg`,
};

const GRID_3 = 'display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;';
const GRID_2 = 'display:grid; grid-template-columns:repeat(2, 1fr); gap:24px;';
const STACK = 'display:flex; flex-direction:column; gap:14px;';

const meta: Meta<FsCardComponent> = {
  title: 'Components/Card',
  component: FsCardComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FsCardComponent,
        FsRowCardComponent,
        FsStatCardComponent,
        FsButtonComponent,
        FsBadgeComponent,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: [undefined, 'success', 'danger', 'warning', 'info'] },
  },
};

export default meta;
type Story = StoryObj<FsCardComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'Plan Pro',
    subtitle: 'Para equipos en crecimiento',
    interactive: false,
  },
  render: (args) => ({
    props: { ...args, icons: ICONS },
    template: `
      <div style="max-width:340px;">
        <fs-card
          [icon]="icons.sparkle"
          [title]="title"
          [subtitle]="subtitle"
          [tone]="tone"
          [interactive]="interactive"
        >
          Incluye asientos ilimitados, soporte prioritario y reportes avanzados.
          <fs-button cardFooter variant="primary" size="sm" label="Elegir plan" [fullWidth]="true"></fs-button>
        </fs-card>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Standard grid ───────────────────────────────────────────────────────────

export const Standard: Story = {
  name: 'Estándar',
  render: () => ({
    props: { icons: ICONS, grid: GRID_3 },
    template: `
      <div [style]="grid">
        <fs-card [icon]="icons.sparkle" title="Plan Pro" subtitle="Para equipos en crecimiento">
          Incluye asientos ilimitados, soporte prioritario y reportes avanzados.
          <fs-button cardFooter variant="primary" size="sm" label="Elegir plan" [fullWidth]="true"></fs-button>
        </fs-card>

        <fs-card [icon]="icons.upload" title="Copia de seguridad" subtitle="Última: hace 2 horas">
          Tus archivos se respaldan automáticamente cada 24 horas.
          <fs-button cardFooter variant="outline" size="sm" label="Respaldar ahora" [fullWidth]="true"></fs-button>
        </fs-card>

        <fs-card title="Guía de inicio" subtitle="5 min de lectura">
          <div cardMedia style="background:linear-gradient(135deg, var(--fs-primary-base), var(--fs-tertiary-base));"></div>
          Aprendé a configurar tu cuenta y tu primer proyecto.
          <fs-button cardFooter variant="ghost" size="sm" label="Leer guía" [iconRight]="icons.arrowRight"></fs-button>
        </fs-card>
      </div>

      <div style="margin-top:20px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:520px;">
        Los slots son <code>[cardMedia]</code> y <code>[cardFooter]</code>; el resto del
        contenido va por defecto. Cada slot se esconde solo cuando no recibe nada, así
        que una card sin pie no arrastra ni el borde ni el padding.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Tones ───────────────────────────────────────────────────────────────────

export const Tones: Story = {
  name: 'Estado',
  render: () => ({
    props: { grid: GRID_2 },
    template: `
      <div [style]="grid">
        <fs-card tone="success" title="Pago procesado" subtitle="Factura #A-2291">
          Tu pago de USD 49.00 se completó correctamente. Recibís la factura por mail.
          <fs-button cardFooter variant="outline" size="sm" label="Ver recibo"></fs-button>
        </fs-card>

        <fs-card tone="danger" title="Sincronización fallida" subtitle="Intento 3 de 3">
          No pudimos conectar con tu proveedor de almacenamiento. Revisá las credenciales.
          <fs-button cardFooter variant="danger" size="sm" label="Reintentar"></fs-button>
        </fs-card>
      </div>

      <div style="margin-top:20px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:520px;">
        El tinte del borde sale de un <code>color-mix</code> contra el borde base, no de
        un color claro fijo. Por eso el estado se lee igual de bien en dark.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Row cards ───────────────────────────────────────────────────────────────

export const RowCards: Story = {
  name: 'Tarjeta horizontal',
  render: () => ({
    props: { icons: ICONS, stack: STACK },
    template: `
      <div [style]="stack">
        <fs-row-card tone="success" title="Dominio verificado" subtitle="app.acme-corp.com">
          <fs-badge cardAction color="success" variant="filled" label="Activo" [dot]="true"></fs-badge>
        </fs-row-card>

        <fs-row-card tone="danger" title="Certificado SSL expirado" subtitle="Venció el 2 de agosto">
          <fs-button cardAction variant="outline" size="sm" label="Renovar"></fs-button>
        </fs-row-card>

        <fs-row-card [icon]="icons.mail" title="3 invitaciones pendientes" subtitle="Miembros del equipo">
          <fs-button cardAction variant="ghost" size="sm" label="Ver" [iconRight]="icons.arrowRight"></fs-button>
        </fs-row-card>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Stat cards ──────────────────────────────────────────────────────────────

export const StatCards: Story = {
  name: 'Tarjeta de métrica',
  render: () => ({
    props: { icons: ICONS, grid: GRID_3 },
    template: `
      <div [style]="grid">
        <fs-stat-card label="Ingresos (MRR)" value="$12,480" delta="+8.2%" deltaTone="success" [icon]="icons.sparkle"></fs-stat-card>
        <fs-stat-card label="Churn" value="2.1%" delta="+0.4%" deltaTone="danger" [icon]="icons.user"></fs-stat-card>
        <fs-stat-card label="Asientos activos" value="342" [icon]="icons.user"></fs-stat-card>
      </div>

      <div style="margin-top:20px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:520px;">
        <code>deltaTone</code> no se deduce del signo: un churn que sube es
        <code>+0.4%</code> y sigue siendo malo. El tono lo decide quien conoce la métrica.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Interactive ─────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive',
  render: () => ({
    props: { icons: ICONS },
    template: `
      <div style="max-width:340px;">
        <fs-card [icon]="icons.sparkle" title="Pasate a Enterprise" subtitle="SSO, auditoría y SLA" [interactive]="true">
          Pasá el mouse por encima.
        </fs-card>
      </div>

      <div style="margin-top:20px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:520px;">
        <code>interactive</code> es solo la señal visual de hover — no convierte la card
        en un control. Y no lo hace a propósito: una card con un botón en el pie no puede
        ser ella misma un botón. Si toda la card tiene que ser clickeable, el elemento
        interactivo lo ponés vos alrededor o adentro.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
