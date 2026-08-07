import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsDatePickerComponent } from './date-picker.component';

const meta: Meta<FsDatePickerComponent> = {
  title: 'Components/DatePicker',
  component: FsDatePickerComponent,
  decorators: [
    moduleMetadata({
      imports: [FsDatePickerComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    locale: { control: 'text' },
    firstDayOfWeek: { control: { type: 'number', min: 0, max: 6 } },
    min: { control: false },
    max: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Campo de fecha tipeable con calendario. El calendario se renderiza en el top layer, así que no lo recorta ningún contenedor. Los nombres de mes y día salen de Intl según el `locale`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsDatePickerComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  // Every input the template binds needs a value here. A binding whose arg is
  // missing resolves to undefined, and for a DOM property like placeholder the
  // browser stringifies that — the empty field would read "undefined".
  args: {
    label: 'Fecha de nacimiento',
    hint: 'Podés tipearla o elegirla del calendario.',
    placeholder: 'dd/mm/aaaa',
    locale: 'es-AR',
    firstDayOfWeek: 1,
    state: 'default',
    disabled: false,
    readonly: false,
    clearable: true,
    showFooter: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:320px;">
        <fs-date-picker
          [label]="label"
          [hint]="hint"
          [placeholder]="placeholder"
          [locale]="locale"
          [firstDayOfWeek]="firstDayOfWeek"
          [state]="state"
          [disabled]="disabled"
          [readonly]="readonly"
          [clearable]="clearable"
          [showFooter]="showFooter"
        ></fs-date-picker>
      </div>
    `,
  }),
};

// ─── Typing ──────────────────────────────────────────────────────────────────

export const Typing: Story = {
  name: 'Tipeando — probá 15/03/1990',
  render: () => ({
    props: { value: null as Date | null },
    template: `
      <div style="max-width:340px; display:flex; flex-direction:column; gap:14px;">
        <fs-date-picker
          label="Fecha de nacimiento"
          hint="Acepta 15/03/1990 · 15-03-1990 · 15.03.90 · 1990-03-15"
          [(ngModel)]="value"
        ></fs-date-picker>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Valor del modelo:
          <code style="color:var(--fs-color-primary)">{{ value ? value.toISOString().slice(0,10) : 'null' }}</code>
        </div>
      </div>
    `,
  }),
};

// ─── Preselected ─────────────────────────────────────────────────────────────

export const Preselected: Story = {
  name: 'Con valor inicial',
  render: () => ({
    props: { value: new Date(1990, 2, 15) },
    template: `
      <div style="max-width:320px;">
        <fs-date-picker label="Fecha" [(ngModel)]="value"></fs-date-picker>
      </div>
    `,
  }),
};

// ─── Min / max ───────────────────────────────────────────────────────────────

export const MinMax: Story = {
  name: 'Rango permitido (min / max)',
  render: () => ({
    props: {
      value: null as Date | null,
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      max: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    },
    template: `
      <div style="max-width:340px;">
        <fs-date-picker
          label="Fecha de la reserva"
          hint="Solo este mes y el siguiente. El resto queda deshabilitado."
          [min]="min"
          [max]="max"
          [(ngModel)]="value"
        ></fs-date-picker>
      </div>
    `,
  }),
};

// ─── Locales ─────────────────────────────────────────────────────────────────

export const Locales: Story = {
  name: 'Locales — el formato y los nombres siguen a Intl',
  render: () => ({
    template: `
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; max-width:900px;">
        <fs-date-picker label="es-AR (día primero, semana en lunes)" locale="es-AR" [firstDayOfWeek]="1"></fs-date-picker>
        <fs-date-picker label="en-US (mes primero, semana en domingo)" locale="en-US" [firstDayOfWeek]="0" placeholder="mm/dd/yyyy"></fs-date-picker>
        <fs-date-picker label="ja-JP" locale="ja-JP" [firstDayOfWeek]="0" placeholder="yyyy/mm/dd"></fs-date-picker>
        <fs-date-picker label="de-DE" locale="de-DE" [firstDayOfWeek]="1" placeholder="tt.mm.jjjj"></fs-date-picker>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados',
  render: () => ({
    props: { taken: new Date() },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:340px;">
        <fs-date-picker label="Default" hint="Texto de ayuda."></fs-date-picker>

        <fs-date-picker
          label="Error"
          state="error"
          errorMessage="Esa fecha ya está ocupada."
          [(ngModel)]="taken"
        ></fs-date-picker>

        <fs-date-picker
          label="Success"
          state="success"
          successMessage="Fecha disponible."
          [(ngModel)]="taken"
        ></fs-date-picker>

        <fs-date-picker label="Disabled" [disabled]="true" [(ngModel)]="taken"></fs-date-picker>

        <fs-date-picker label="Readonly" [readonly]="true" [(ngModel)]="taken"></fs-date-picker>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Clipping ────────────────────────────────────────────────────────────────

export const InsideAScrollArea: Story = {
  name: 'Dentro de una caja con overflow y transform',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:12px; max-width:420px;">
        <p style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; margin:0;">
          Esta caja tiene <code>overflow:auto</code> y un <code>transform</code>, que es lo que
          convierte a un ancestro en containing block y recorta cualquier dropdown
          con <code>position:fixed</code>. El calendario se renderiza en el top layer,
          así que se sale igual.
        </p>

        <div style="
          height:170px;
          overflow:auto;
          transform:translateZ(0);
          padding:16px;
          border:1px dashed var(--fs-color-border-strong);
          border-radius:var(--fs-radius-lg);
          background:var(--fs-color-surface);
        ">
          <fs-date-picker label="Abrime" hint="El panel no debería quedar cortado."></fs-date-picker>
          <div style="height:220px"></div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Keyboard ────────────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Teclado',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:420px;">
        <fs-date-picker label="Enfocá el campo y probá las teclas"></fs-date-picker>

        <table style="font-size:12.5px; color:var(--fs-color-text-secondary); border-collapse:collapse;">
          <tbody>
            <tr><td style="padding:3px 14px 3px 0"><code>↓</code></td><td>abre el calendario</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>← → ↑ ↓</code></td><td>mueven el cursor, cruzando de mes</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Inicio</code> / <code>Fin</code></td><td>principio y fin de la semana</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>PageUp</code> / <code>PageDown</code></td><td>mes anterior / siguiente</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Shift</code> + <code>PageUp/Down</code></td><td>año anterior / siguiente</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Enter</code></td><td>selecciona el día del cursor</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Esc</code></td><td>cierra sin seleccionar</td></tr>
          </tbody>
        </table>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── In a form ───────────────────────────────────────────────────────────────

export const InAForm: Story = {
  name: 'En un formulario',
  render: () => ({
    props: { from: null as Date | null, to: null as Date | null },
    template: `
      <div style="display:flex; flex-direction:column; gap:18px; max-width:340px;">
        <fs-date-picker label="Desde" [(ngModel)]="from" [max]="to"></fs-date-picker>
        <fs-date-picker label="Hasta" [(ngModel)]="to" [min]="from"></fs-date-picker>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Dos campos acotándose entre sí con <code>min</code> y <code>max</code>.
          No es un range picker: son dos fechas independientes que no se cruzan.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
