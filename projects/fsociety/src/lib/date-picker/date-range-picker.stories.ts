import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsDateRangePickerComponent, type FsDateRangePreset } from './date-range-picker.component';

/** Presets built relative to today, so the story never goes stale. */
const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const shift = (days: number) => {
  const d = today();
  d.setDate(d.getDate() + days);
  return d;
};

const PRESETS: FsDateRangePreset[] = [
  { label: 'Hoy',              range: () => ({ start: today(), end: today() }) },
  { label: 'Últimos 7 días',   range: () => ({ start: shift(-6), end: today() }) },
  { label: 'Últimos 30 días',  range: () => ({ start: shift(-29), end: today() }) },
  {
    label: 'Este mes',
    range: () => {
      const t = today();
      return { start: new Date(t.getFullYear(), t.getMonth(), 1), end: t };
    },
  },
  {
    label: 'Mes pasado',
    range: () => {
      const t = today();
      return {
        start: new Date(t.getFullYear(), t.getMonth() - 1, 1),
        end: new Date(t.getFullYear(), t.getMonth(), 0),
      };
    },
  },
];

const meta: Meta<FsDateRangePickerComponent> = {
  title: 'Components/DateRangePicker',
  component: FsDateRangePickerComponent,
  decorators: [
    moduleMetadata({ imports: [FsDateRangePickerComponent, FormsModule] }),
  ],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    months: { control: 'select', options: [1, 2] },
    presets: { control: false },
    min: { control: false },
    max: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Rango de fechas con dos meses en pantalla y preview al pasar el mouse. Es un componente aparte del `fs-date-picker` a propósito: el valor del modelo es `{ start, end }`, así el contrato del `ControlValueAccessor` es de un solo tipo.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsDateRangePickerComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Período',
    hint: 'Dos clics: inicio y fin. El rango se previsualiza mientras movés el mouse.',
    startPlaceholder: 'Desde',
    endPlaceholder: 'Hasta',
    months: 2,
    locale: 'es-AR',
    firstDayOfWeek: 1,
    maxSpan: 0,
    state: 'default',
    disabled: false,
    readonly: false,
    clearable: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:360px;">
        <fs-date-range-picker
          [label]="label"
          [hint]="hint"
          [startPlaceholder]="startPlaceholder"
          [endPlaceholder]="endPlaceholder"
          [months]="months"
          [locale]="locale"
          [firstDayOfWeek]="firstDayOfWeek"
          [maxSpan]="maxSpan"
          [state]="state"
          [disabled]="disabled"
          [readonly]="readonly"
          [clearable]="clearable"
        ></fs-date-range-picker>
      </div>
    `,
  }),
};

// ─── Model shape ─────────────────────────────────────────────────────────────

export const ModelShape: Story = {
  name: 'El modelo es { start, end }',
  render: () => ({
    props: {
      range: { start: null as Date | null, end: null as Date | null },
      iso: (d: Date | null) => (d ? d.toISOString().slice(0, 10) : 'null'),
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:400px;">
        <fs-date-range-picker label="Período" [(ngModel)]="range"></fs-date-range-picker>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.7;">
          <code style="color:var(--fs-color-primary)">start</code>: {{ iso(range.start) }}<br>
          <code style="color:var(--fs-color-primary)">end</code>: {{ iso(range.end) }}
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Los dos extremos pueden ser <code>null</code> por separado, que es lo que
          pasa mientras el rango está a medio elegir. Por eso el valor es un par de
          nullables y no una tupla de <code>Date</code>.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Presets ─────────────────────────────────────────────────────────────────

export const Presets: Story = {
  name: 'Con atajos',
  render: () => ({
    props: { range: { start: null, end: null }, presets: PRESETS },
    template: `
      <div style="max-width:360px;">
        <fs-date-range-picker
          label="Período del reporte"
          hint="Los atajos aparecen en la columna izquierda del calendario."
          [presets]="presets"
          [(ngModel)]="range"
        ></fs-date-range-picker>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── One month ───────────────────────────────────────────────────────────────

export const SingleMonth: Story = {
  name: 'Un solo mes',
  render: () => ({
    template: `
      <div style="max-width:300px;">
        <fs-date-range-picker
          label="Período"
          hint="months = 1, para columnas angostas."
          [months]="1"
        ></fs-date-range-picker>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── maxSpan ─────────────────────────────────────────────────────────────────

export const MaxSpan: Story = {
  name: 'Largo máximo del rango',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:400px;">
        <fs-date-range-picker
          label="Reserva"
          hint="Máximo 7 noches."
          [maxSpan]="7"
        ></fs-date-range-picker>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Elegí una fecha de inicio y mirá el calendario: los días más allá del
          séptimo quedan <b>deshabilitados</b>, no rechazados después del clic.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Bounds ──────────────────────────────────────────────────────────────────

export const Bounds: Story = {
  name: 'Acotado con min y max',
  render: () => ({
    props: {
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      max: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    },
    template: `
      <div style="max-width:360px;">
        <fs-date-range-picker
          label="Disponibilidad"
          hint="Solo este mes y el siguiente."
          [min]="min"
          [max]="max"
        ></fs-date-range-picker>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Backwards ───────────────────────────────────────────────────────────────

export const Backwards: Story = {
  name: 'Elegido al revés',
  render: () => ({
    props: {
      range: { start: null, end: null },
      iso: (d: Date | null) => (d ? d.toISOString().slice(0, 10) : 'null'),
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:400px;">
        <fs-date-range-picker label="Período" [(ngModel)]="range"></fs-date-range-picker>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.7;">
          start: <code style="color:var(--fs-color-primary)">{{ iso(range.start) }}</code> ·
          end: <code style="color:var(--fs-color-primary)">{{ iso(range.end) }}</code>
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          Elegí un inicio y después clickeá un día <b>anterior</b>: se toma como
          nuevo inicio, que es lo que uno quiere decir con ese clic. Y si tipeás
          las fechas al revés, el blur las ordena en vez de descartarlas.
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
    props: {
      r: { start: new Date(), end: new Date(Date.now() + 6 * 864e5) },
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:20px; max-width:360px;">
        <fs-date-range-picker label="Default" hint="Texto de ayuda." [(ngModel)]="r"></fs-date-range-picker>

        <fs-date-range-picker
          label="Error"
          state="error"
          errorMessage="El período no está disponible."
          [(ngModel)]="r"
        ></fs-date-range-picker>

        <fs-date-range-picker
          label="Success"
          state="success"
          successMessage="Período disponible."
          [(ngModel)]="r"
        ></fs-date-range-picker>

        <fs-date-range-picker label="Disabled" [disabled]="true" [(ngModel)]="r"></fs-date-range-picker>
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
      <div style="display:flex; flex-direction:column; gap:12px; max-width:440px;">
        <p style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; margin:0;">
          El panel de dos meses es el overlay más grande de la librería, así que es
          el peor caso para el clipping. Se renderiza en el top layer.
        </p>

        <div style="
          height:170px; overflow:auto; transform:translateZ(0); padding:16px;
          border:1px dashed var(--fs-color-border-strong);
          border-radius:var(--fs-radius-lg); background:var(--fs-color-surface);
        ">
          <fs-date-range-picker label="Abrime"></fs-date-range-picker>
          <div style="height:220px"></div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
