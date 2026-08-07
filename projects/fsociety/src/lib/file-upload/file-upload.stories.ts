import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsFileUploadComponent } from './file-upload.component';

const meta: Meta<FsFileUploadComponent> = {
  title: 'Components/FileUpload',
  component: FsFileUploadComponent,
  decorators: [
    moduleMetadata({ imports: [FsFileUploadComponent, FormsModule] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error'] },
    maxSize: { control: 'number' },
    maxFiles: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Dropzone con lista de archivos. El valor del modelo son objetos `File` reales, no metadata — así el formulario los puede subir de verdad.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsFileUploadComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Adjuntos',
    accept: '',
    multiple: true,
    hint: 'PNG, JPG o PDF · hasta 10MB',
    title: 'Arrastrá archivos',
    subtitle: 'o hacé clic para subir',
    maxSize: 0,
    maxFiles: 0,
    state: 'default',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:460px;">
        <fs-file-upload
          [label]="label"
          [accept]="accept"
          [multiple]="multiple"
          [hint]="hint"
          [title]="title"
          [subtitle]="subtitle"
          [maxSize]="maxSize"
          [maxFiles]="maxFiles"
          [state]="state"
          [disabled]="disabled"
        ></fs-file-upload>
      </div>
    `,
  }),
};

// ─── Real File objects ───────────────────────────────────────────────────────

export const RealFiles: Story = {
  name: 'El modelo son File reales',
  render: () => ({
    // The helper lives in props alongside the data — the template resolves
    // everything against the props object.
    props: {
      files: [] as File[],
      isFile: (f: unknown) => f instanceof File,
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:460px;">
        <fs-file-upload label="Adjuntos" [(ngModel)]="files"></fs-file-upload>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.7;">
          El modelo tiene <code style="color:var(--fs-color-primary)">{{ files.length }}</code>
          archivo(s), y son instancias reales de <code>File</code>:
          @for (f of files; track f.name) {
            <div style="margin-top:4px">
              · <code>{{ f.name }}</code> — {{ f.type || 'sin MIME' }} —
              <code>instanceof File: {{ isFile(f) }}</code>
            </div>
          }
          @if (!files.length) {
            <div style="margin-top:4px">Subí algo para verlo.</div>
          }
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Esto es lo que la referencia no hacía: guardaba solo
          <code>{{ '{ id, name, size }' }}</code> y descartaba el <code>File</code>,
          así que no había nada que subir.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Single file ─────────────────────────────────────────────────────────────

export const SingleFile: Story = {
  name: 'Un solo archivo',
  render: () => ({
    template: `
      <div style="max-width:460px;">
        <fs-file-upload
          label="Foto de perfil"
          accept="image/*"
          [multiple]="false"
          hint="Una imagen · reemplaza la anterior"
          title="Arrastrá una imagen"
        ></fs-file-upload>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Validation ──────────────────────────────────────────────────────────────

export const Validation: Story = {
  name: 'Validación — tipo, tamaño y cantidad',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:460px;">
        <div>
          <fs-file-upload
            label="Solo PDF"
            accept=".pdf"
            hint="Únicamente .pdf"
          ></fs-file-upload>
          <div style="font-size:12.5px; color:var(--fs-color-text-secondary); margin-top:6px; line-height:1.6;">
            Probá arrastrar una imagen. El <code>accept</code> nativo no se aplica al
            drag &amp; drop, así que se valida también en el drop.
          </div>
        </div>

        <fs-file-upload
          label="Hasta 50 KB por archivo"
          [maxSize]="51200"
          hint="Cualquier tipo · máximo 50 KB"
        ></fs-file-upload>

        <fs-file-upload
          label="Hasta 2 archivos"
          [maxFiles]="2"
          hint="Máximo 2"
        ></fs-file-upload>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:460px;">
        <fs-file-upload label="Default"></fs-file-upload>

        <fs-file-upload
          label="Error"
          state="error"
          errorMessage="Tenés que adjuntar al menos un archivo."
        ></fs-file-upload>

        <fs-file-upload label="Disabled" [disabled]="true"></fs-file-upload>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
