import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsInputComponent } from './input.component';
import { FsButtonComponent } from '../button/button.component';

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
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del control — 32 / 40 / 48px. Misma escala que fs-button.',
      table: {
        type:         { summary: 'FsControlSize' },
        defaultValue: { summary: 'md' },
      },
    },
    corners: {
      control: { type: 'inline-radio' },
      options: ['all', 'none', 'top', 'bottom', 'start', 'end'],
    },
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
    corners: 'all',
    size: 'md',
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

// ─── Sizes ───────────────────────────────────────────────────────────────────
// La escala es compartida: un fs-input y un fs-button del mismo `size` miden
// exactamente lo mismo. Esta historia existe para que eso se pueda verificar a
// ojo, que es donde antes se notaba el desfasaje.

export const Sizes: Story = {
  decorators: [
    moduleMetadata({ imports: [FsInputComponent, FsButtonComponent, FormsModule] }),
  ],
  render: () => ({
    props: { I },
    template: `
      <div style="display:flex; flex-direction:column; gap:2rem; max-width:640px;">

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            Los tres pasos de la escala: 32 / 40 / 48px.
          </p>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <fs-input size="sm" label="Small" [iconLeft]="I.user" placeholder="32px de alto"></fs-input>
            <fs-input size="md" label="Medium" [iconLeft]="I.user" placeholder="40px de alto"></fs-input>
            <fs-input size="lg" label="Large" [iconLeft]="I.user" placeholder="48px de alto"></fs-input>
          </div>
        </div>

        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 10px;">
            Campo y botón del mismo tamaño, alineados por abajo. Antes el botón
            quedaba 4px más bajo en cualquier combinación.
          </p>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div style="display:flex; align-items:flex-end; gap:.5rem;">
              <fs-input size="sm" label="Small" placeholder="Buscar" style="flex:1"></fs-input>
              <fs-button size="sm" label="Buscar"></fs-button>
            </div>
            <div style="display:flex; align-items:flex-end; gap:.5rem;">
              <fs-input size="md" label="Medium" placeholder="Buscar" style="flex:1"></fs-input>
              <fs-button size="md" label="Buscar"></fs-button>
            </div>
            <div style="display:flex; align-items:flex-end; gap:.5rem;">
              <fs-input size="lg" label="Large" placeholder="Buscar" style="flex:1"></fs-input>
              <fs-button size="lg" label="Buscar"></fs-button>
            </div>
          </div>
        </div>

      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
  },
};
