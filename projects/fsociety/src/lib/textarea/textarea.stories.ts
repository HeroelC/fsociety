import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsTextareaComponent } from './textarea.component';

const meta: Meta<FsTextareaComponent> = {
  title: 'Components/Textarea',
  component: FsTextareaComponent,
  decorators: [
    moduleMetadata({ imports: [FsTextareaComponent, FormsModule] }),
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
    state: { control: 'select', options: ['default', 'error', 'success'] },
    resize: { control: 'select', options: ['vertical', 'none', 'auto'] },
    rows: { control: { type: 'number', min: 1, max: 12 } },
    maxlength: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<FsTextareaComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    corners: 'all',
    size: 'md',
    label: 'Comentario',
    placeholder: 'Contanos qué te pareció…',
    hint: 'Se puede arrastrar el borde inferior para agrandarlo.',
    rows: 3,
    resize: 'vertical',
    state: 'default',
    disabled: false,
    readonly: false,
    showCounter: false,
  },
  render: (args) => ({
    props: { ...args, value: '' },
    template: `
      <div style="max-width:420px;">
        <fs-textarea [corners]="corners"
          [label]="label"
          [placeholder]="placeholder"
          [hint]="hint"
          [rows]="rows"
          [resize]="resize"
          [state]="state"
          [disabled]="disabled"
          [readonly]="readonly"
          [showCounter]="showCounter"
          [(ngModel)]="value"
        ></fs-textarea>
      </div>
    `,
  }),
};

// ─── Counter ─────────────────────────────────────────────────────────────────

export const Counter: Story = {
  name: 'Contador de caracteres',
  render: () => ({
    props: { bio: '' },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:420px;">
        <fs-textarea
          label="Bio"
          placeholder="Máximo 160 caracteres…"
          hint="Aparece en tu perfil público."
          [maxlength]="160"
          [rows]="3"
          [(ngModel)]="bio"
        ></fs-textarea>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          El contador se pone en color de advertencia al llegar al 90% del límite.
          Poner <code>maxlength</code> ya lo activa; <code>showCounter</code> solo hace
          falta si querés contar sin tope.
        </div>

        <fs-textarea
          label="Sin tope, con contador"
          [showCounter]="true"
          [rows]="2"
        ></fs-textarea>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Auto-grow ───────────────────────────────────────────────────────────────

export const AutoGrow: Story = {
  name: 'Auto-grow',
  render: () => ({
    props: { value: '' },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:420px;">
        <fs-textarea
          label="Crece con el texto"
          placeholder="Escribí varias líneas y mirá cómo se agranda…"
          resize="auto"
          [rows]="2"
          [(ngModel)]="value"
        ></fs-textarea>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Con <code>resize="auto"</code> el alto sigue al contenido y se desactiva el
          arrastre manual. Borrá líneas: también se achica, porque la altura se
          resetea antes de medir.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados',
  render: () => ({
    props: { v: 'Un comentario cualquiera.' },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:420px;">
        <fs-textarea label="Default" hint="Texto de ayuda." [(ngModel)]="v"></fs-textarea>

        <fs-textarea
          label="Error"
          state="error"
          errorMessage="El comentario es demasiado corto."
          [maxlength]="200"
          [(ngModel)]="v"
        ></fs-textarea>

        <fs-textarea
          label="Success"
          state="success"
          successMessage="Guardado."
          [(ngModel)]="v"
        ></fs-textarea>

        <fs-textarea label="Disabled" [disabled]="true" [(ngModel)]="v"></fs-textarea>
        <fs-textarea label="Readonly" [readonly]="true" [(ngModel)]="v"></fs-textarea>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Rows: Story = {
  name: 'Altura inicial',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:18px; max-width:420px;">
        <fs-textarea label="2 filas" [rows]="2" placeholder="Corto…"></fs-textarea>
        <fs-textarea label="5 filas" [rows]="5" placeholder="Más largo…"></fs-textarea>
        <fs-textarea label="Sin resize" [rows]="3" resize="none" placeholder="Alto fijo…"></fs-textarea>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
