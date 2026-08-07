import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsHintComponent } from './hint.component';
import { FsFieldComponent } from './field.component';
import { FsInputComponent } from '../input/input.component';
import { FsSelectComponent } from '../select/select.component';

const meta: Meta<FsHintComponent> = {
  title: 'Components/Hint',
  component: FsHintComponent,
  decorators: [
    moduleMetadata({
      imports: [FsHintComponent, FsFieldComponent, FsInputComponent, FsSelectComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<FsHintComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { tone: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <fs-hint [tone]="tone">Usá entre 8 y 32 caracteres.</fs-hint>
    `,
  }),
};

// ─── Todos los tonos ──────────────────────────────────────────────────────────

export const AllTones: Story = {
  name: 'Todos los tonos',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;max-width:360px;">
        <fs-hint tone="default">Usá entre 8 y 32 caracteres.</fs-hint>
        <fs-hint tone="error">La contraseña es demasiado corta.</fs-hint>
        <fs-hint tone="success">Contraseña segura.</fs-hint>
        <fs-hint tone="warning">Esta cuenta ya existe — podés iniciar sesión.</fs-hint>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Con ícono forzado ────────────────────────────────────────────────────────

export const IconForced: Story = {
  name: 'Ícono forzado / oculto',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:10px;max-width:360px;">
        <fs-hint tone="default" [icon]="true">Hint neutral con ícono forzado.</fs-hint>
        <fs-hint tone="error" [icon]="false">Error sin ícono.</fs-hint>
        <fs-hint tone="success">Éxito con ícono automático.</fs-hint>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Field wrapper ────────────────────────────────────────────────────────────

export const FieldWrapper: Story = {
  name: 'fs-field (wrapper)',
  render: () => ({
    props: { email: '', pass: '', nombre: '' },
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:360px;">

        <fs-field label="Correo electrónico" htmlFor="email1"
          hint="Usá tu correo de trabajo.">
          <fs-input type="email" placeholder="tu@empresa.com" [(ngModel)]="email"></fs-input>
        </fs-field>

        <fs-field label="Contraseña" htmlFor="pass1" [required]="true"
          error="La contraseña es demasiado corta.">
          <fs-input type="password" placeholder="••••••••" [(ngModel)]="pass"></fs-input>
        </fs-field>

        <fs-field label="Nombre" htmlFor="nombre1" [optional]="true"
          success="Nombre disponible.">
          <fs-input placeholder="John Doe" [(ngModel)]="nombre"></fs-input>
        </fs-field>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:14px;max-width:360px;">
        <fs-hint tone="default">Texto de ayuda neutral sin ícono (por defecto).</fs-hint>
        <fs-hint tone="default" [icon]="true">Ayuda con ícono de info forzado.</fs-hint>
        <fs-hint tone="error">El campo es obligatorio.</fs-hint>
        <fs-hint tone="success">Datos guardados correctamente.</fs-hint>
        <fs-hint tone="warning">Esta acción no se puede deshacer.</fs-hint>
        <fs-hint tone="error" [icon]="false">Error sin ícono.</fs-hint>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
