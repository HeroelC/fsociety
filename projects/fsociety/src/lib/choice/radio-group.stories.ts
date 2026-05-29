import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsRadioGroupComponent } from './radio-group.component';
import type { FsRadioOption } from './radio-group.component';

const PLANS: FsRadioOption[] = [
  { value: 'free',    label: 'Gratuito',    description: 'Hasta 3 proyectos, 500 MB de almacenamiento.' },
  { value: 'pro',     label: 'Pro',         description: 'Proyectos ilimitados, 50 GB, soporte prioritario.' },
  { value: 'team',    label: 'Equipo',      description: 'Todo Pro + colaboración, roles y auditoría.' },
];

const ROLES: FsRadioOption[] = [
  { value: 'admin',  label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visor' },
];

const meta: Meta<FsRadioGroupComponent> = {
  title: 'Components/RadioGroup',
  component: FsRadioGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [FsRadioGroupComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'error'],
    },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsRadioGroupComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Rol de usuario',
    options: ROLES,
  },
};

// ─── With descriptions ────────────────────────────────────────────────────────

export const WithDescriptions: Story = {
  args: {
    label: 'Plan',
    description: 'Elige el plan que mejor se adapte a tus necesidades.',
    options: PLANS,
  },
};

// ─── Selected ─────────────────────────────────────────────────────────────────

export const Selected: Story = {
  render: (args) => ({
    props: { ...args, model: 'pro' },
    template: `
      <fs-radio-group
        label="Plan"
        description="Elige el plan que mejor se adapte a tus necesidades."
        [options]="options"
        [(ngModel)]="model"
      ></fs-radio-group>
    `,
  }),
  args: { options: PLANS },
};

// ─── Error ────────────────────────────────────────────────────────────────────

export const Error: Story = {
  args: {
    label: 'Rol de usuario',
    options: ROLES,
    state: 'error',
    errorMessage: 'Debes seleccionar un rol para continuar.',
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => ({
    props: { ...args, model: 'pro' },
    template: `
      <fs-radio-group
        label="Plan actual"
        [options]="options"
        [disabled]="true"
        [(ngModel)]="model"
      ></fs-radio-group>
    `,
  }),
  args: { options: PLANS },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: { rol: '', plan: 'pro', ROLES, PLANS },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2rem;">
        <fs-radio-group
          label="Rol de usuario"
          [options]="ROLES"
          [(ngModel)]="rol"
        ></fs-radio-group>

        <fs-radio-group
          label="Plan"
          description="Elige el plan que mejor se adapte a tus necesidades."
          [options]="PLANS"
          [(ngModel)]="plan"
        ></fs-radio-group>

        <fs-radio-group
          label="Rol de usuario"
          [options]="ROLES"
          state="error"
          errorMessage="Debes seleccionar un rol para continuar."
        ></fs-radio-group>

        <fs-radio-group
          label="Plan actual"
          [options]="PLANS"
          [disabled]="true"
          [(ngModel)]="plan"
        ></fs-radio-group>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
