import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsInputComponent } from './input.component';

const CDN = 'https://api.iconify.design';
const I = {
  user:   `${CDN}/tabler:user.svg`,
  mail:   `${CDN}/tabler:mail.svg`,
  lock:   `${CDN}/tabler:lock.svg`,
  world:  `${CDN}/tabler:world.svg`,
  check:  `${CDN}/tabler:check.svg`,
  search: `${CDN}/tabler:search.svg`,
};

const meta: Meta<FsInputComponent> = {
  title: 'Components/Input',
  component: FsInputComponent,
  decorators: [
    moduleMetadata({
      imports: [FsInputComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'search'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<FsInputComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Nombre',
    placeholder: 'Ada Lovelace',
    iconLeft: I.user,
    hint: 'Tu nombre completo.',
  },
};

// ─── Clearable ────────────────────────────────────────────────────────────────

export const Clearable: Story = {
  render: (args) => ({
    props: { ...args, model: 'ada@empresa.com', icon: I.mail },
    template: `
      <fs-input
        label="Correo electrónico"
        [iconLeft]="icon"
        [clearable]="true"
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── Password ─────────────────────────────────────────────────────────────────

export const Password: Story = {
  render: (args) => ({
    props: { ...args, model: 'supersecreta123', icon: I.lock },
    template: `
      <fs-input
        type="password"
        label="Contraseña"
        hint="Mínimo 8 caracteres."
        [iconLeft]="icon"
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── Error ────────────────────────────────────────────────────────────────────

export const Error: Story = {
  render: (args) => ({
    props: { ...args, model: 'ada@@empresa', icon: I.mail },
    template: `
      <fs-input
        type="email"
        label="Correo"
        [iconLeft]="icon"
        state="error"
        errorMessage="Ese correo no es válido."
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── Success ──────────────────────────────────────────────────────────────────

export const Success: Story = {
  render: (args) => ({
    props: { ...args, model: 'DESIGN2026', icon: I.check },
    template: `
      <fs-input
        label="Cupón"
        [iconLeft]="icon"
        state="success"
        successMessage="¡Cupón aplicado!"
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => ({
    props: { ...args, model: 'USR-00041' },
    template: `
      <fs-input
        label="ID de cuenta"
        [disabled]="true"
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const Search: Story = {
  render: (args) => ({
    props: { ...args, model: 'formularios', icon: I.search },
    template: `
      <fs-input
        type="search"
        label="Buscar"
        [iconLeft]="icon"
        [clearable]="true"
        [(ngModel)]="model"
      ></fs-input>
    `,
  }),
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: {
      nombre: '',
      email: 'ada@empresa.com',
      password: 'supersecreta123',
      sitio: '',
      correoError: 'ada@@empresa',
      cupon: 'DESIGN2026',
      idCuenta: 'USR-00041',
      buscar: 'formularios',
      I,
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem 1.5rem;">
        <fs-input label="Nombre" [iconLeft]="I.user" placeholder="Ada Lovelace" hint="Tu nombre completo." [(ngModel)]="nombre"></fs-input>
        <fs-input label="Correo electrónico" [iconLeft]="I.mail" [clearable]="true" [(ngModel)]="email"></fs-input>
        <fs-input type="password" label="Contraseña" [iconLeft]="I.lock" hint="Mínimo 8 caracteres." [(ngModel)]="password"></fs-input>
        <fs-input type="url" label="Sitio web" [iconLeft]="I.world" placeholder="https://" [(ngModel)]="sitio"></fs-input>
        <fs-input type="email" label="Correo" [iconLeft]="I.mail" state="error" errorMessage="Ese correo no es válido." [(ngModel)]="correoError"></fs-input>
        <fs-input label="Cupón" [iconLeft]="I.check" state="success" successMessage="¡Cupón aplicado!" [(ngModel)]="cupon"></fs-input>
        <fs-input label="ID de cuenta" [disabled]="true" [(ngModel)]="idCuenta"></fs-input>
        <fs-input type="search" label="Buscar" [iconLeft]="I.search" [clearable]="true" [(ngModel)]="buscar"></fs-input>
      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
  },
};
