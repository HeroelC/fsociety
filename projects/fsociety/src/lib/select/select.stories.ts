import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsSelectComponent } from './select.component';
import type { FsSelectOption } from './select.component';

const CDN = 'https://api.iconify.design';
const I = {
  globe: `${CDN}/tabler:globe.svg`,
  code:  `${CDN}/tabler:code.svg`,
};

const ROLES: FsSelectOption[] = [
  { value: 'admin',  label: 'Administrador', desc: 'Acceso completo al sistema' },
  { value: 'editor', label: 'Editor',         desc: 'Puede crear y editar contenido' },
  { value: 'viewer', label: 'Visor',          desc: 'Solo lectura' },
  { value: 'guest',  label: 'Invitado',       desc: 'Acceso muy limitado' },
];

const PAISES: FsSelectOption[] = [
  { value: 'ar', label: 'Argentina' },
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'cl', label: 'Chile' },
  { value: 'pe', label: 'Perú' },
  { value: 'br', label: 'Brasil' },
  { value: 'uy', label: 'Uruguay' },
];

const TECHS: FsSelectOption[] = [
  { value: 'angular', label: 'Angular',  desc: 'Framework de Google' },
  { value: 'react',   label: 'React',    desc: 'Librería de Meta' },
  { value: 'vue',     label: 'Vue',      desc: 'Framework progresivo' },
  { value: 'svelte',  label: 'Svelte',   desc: 'Compilador de UI' },
  { value: 'solid',   label: 'SolidJS',  desc: 'Signals-first framework' },
  { value: 'next',    label: 'Next.js',  desc: 'React full-stack' },
  { value: 'nuxt',    label: 'Nuxt',     desc: 'Vue full-stack' },
  { value: 'astro',   label: 'Astro',    desc: 'Content-first web' },
];

const meta: Meta<FsSelectComponent> = {
  title: 'Components/Select',
  component: FsSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [FsSelectComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsSelectComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Rol de usuario',
    placeholder: 'Seleccionar rol...',
    hint: 'Define los permisos del usuario en el sistema.',
    options: ROLES,
  },
};

// ─── With icon ────────────────────────────────────────────────────────────────

export const WithIcon: Story = {
  render: (args) => ({
    props: { ...args, model: '', icon: I.globe },
    template: `
      <fs-select
        label="País"
        [iconLeft]="icon"
        placeholder="Seleccionar país..."
        [options]="options"
        [(ngModel)]="model"
      ></fs-select>
    `,
  }),
  args: { options: PAISES },
};

// ─── Searchable ───────────────────────────────────────────────────────────────

export const Searchable: Story = {
  render: (args) => ({
    props: { ...args, model: '', icon: I.code },
    template: `
      <fs-select
        label="Tecnología"
        [iconLeft]="icon"
        placeholder="Seleccionar tecnología..."
        [searchable]="true"
        [options]="options"
        [(ngModel)]="model"
      ></fs-select>
    `,
  }),
  args: { options: TECHS },
};

// ─── Error ────────────────────────────────────────────────────────────────────

export const Error: Story = {
  args: {
    label: 'Departamento',
    placeholder: 'Seleccionar...',
    options: ROLES,
    state: 'error',
    errorMessage: 'Selecciona un departamento para continuar.',
  },
};

// ─── Success ──────────────────────────────────────────────────────────────────

export const Success: Story = {
  render: (args) => ({
    props: { ...args, model: 'admin' },
    template: `
      <fs-select
        label="Rol"
        state="success"
        successMessage="Rol disponible y asignable."
        [options]="options"
        [(ngModel)]="model"
      ></fs-select>
    `,
  }),
  args: { options: ROLES },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => ({
    props: { ...args, model: 'editor' },
    template: `
      <fs-select
        label="Rol asignado"
        [disabled]="true"
        [options]="options"
        [(ngModel)]="model"
      ></fs-select>
    `,
  }),
  args: { options: ROLES },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: {
      rol: '',
      pais: 'ar',
      tech: '',
      disabledVal: 'editor',
      ROLES,
      PAISES,
      TECHS,
      I,
    },
    template: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem 1.5rem;">
        <fs-select
          label="Rol de usuario"
          placeholder="Seleccionar rol..."
          hint="Define los permisos."
          [options]="ROLES"
          [(ngModel)]="rol"
        ></fs-select>

        <fs-select
          label="País"
          [iconLeft]="I.globe"
          placeholder="Seleccionar país..."
          [options]="PAISES"
          [(ngModel)]="pais"
        ></fs-select>

        <fs-select
          label="Tecnología"
          [iconLeft]="I.code"
          placeholder="Buscar tecnología..."
          [searchable]="true"
          [options]="TECHS"
          [(ngModel)]="tech"
        ></fs-select>

        <fs-select
          label="Departamento"
          placeholder="Seleccionar..."
          [options]="ROLES"
          state="error"
          errorMessage="Campo requerido."
        ></fs-select>

        <fs-select
          label="Rol validado"
          [options]="ROLES"
          state="success"
          successMessage="Rol disponible."
          [(ngModel)]="disabledVal"
        ></fs-select>

        <fs-select
          label="Rol asignado"
          [disabled]="true"
          [options]="ROLES"
          [(ngModel)]="disabledVal"
        ></fs-select>
      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
  },
};
