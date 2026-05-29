import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsSwitchComponent } from './switch.component';

const meta: Meta<FsSwitchComponent> = {
  title: 'Components/Switch',
  component: FsSwitchComponent,
  decorators: [
    moduleMetadata({
      imports: [FsSwitchComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FsSwitchComponent>;

// ─── Default (off) ────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Notificaciones push',
  },
};

// ─── On ───────────────────────────────────────────────────────────────────────

export const On: Story = {
  render: (args) => ({
    props: { ...args, model: true },
    template: `
      <fs-switch
        label="Notificaciones push"
        description="Recibirás alertas en tiempo real."
        [(ngModel)]="model"
      ></fs-switch>
    `,
  }),
};

// ─── With description ─────────────────────────────────────────────────────────

export const WithDescription: Story = {
  args: {
    label: 'Modo oscuro',
    description: 'Reduce el brillo de la interfaz para ambientes con poca luz.',
  },
};

// ─── Disabled off ─────────────────────────────────────────────────────────────

export const DisabledOff: Story = {
  args: {
    label: 'Autenticación en dos pasos',
    description: 'Activado por tu organización.',
    disabled: true,
  },
};

// ─── Disabled on ──────────────────────────────────────────────────────────────

export const DisabledOn: Story = {
  render: (args) => ({
    props: { ...args, model: true },
    template: `
      <fs-switch
        label="Autenticación en dos pasos"
        description="Activado por tu organización."
        [disabled]="true"
        [(ngModel)]="model"
      ></fs-switch>
    `,
  }),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: {
      push:   false,
      dark:   true,
      emails: false,
      twofa:  true,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <fs-switch
          label="Notificaciones push"
          [(ngModel)]="push"
        ></fs-switch>

        <fs-switch
          label="Modo oscuro"
          description="Reduce el brillo de la interfaz para ambientes con poca luz."
          [(ngModel)]="dark"
        ></fs-switch>

        <fs-switch
          label="Resumen semanal por email"
          description="Te enviaremos un reporte cada lunes a las 9 am."
          [(ngModel)]="emails"
        ></fs-switch>

        <fs-switch
          label="Autenticación en dos pasos"
          description="Activado por tu organización."
          [disabled]="true"
          [(ngModel)]="twofa"
        ></fs-switch>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
