import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsTableComponent } from './table.component';
import { FsColumnDirective } from './table-column.directive';
import { FsColumnFilterDirective } from './table-column-filter.directive';
import { FsBadgeComponent } from '../badge/badge.component';
import { FsButtonComponent } from '../button/button.component';
import { FsCheckboxComponent } from '../choice/checkbox.component';

const meta: Meta<FsTableComponent> = {
  title: 'Components/Table',
  component: FsTableComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FsTableComponent,
        FsColumnDirective,
        FsColumnFilterDirective,
        FsBadgeComponent,
        FsButtonComponent,
        FsCheckboxComponent,
        FormsModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    density: {
      control: { type: 'inline-radio' },
      options: ['comfortable', 'compact'],
    },
    layout: {
      control: { type: 'inline-radio' },
      options: ['auto', 'table', 'cards'],
    },
    corners: {
      control: { type: 'inline-radio' },
      options: ['all', 'none', 'top', 'bottom', 'start', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<FsTableComponent>;

// ─── Datos de muestra ────────────────────────────────────────────────────────

interface Invoice {
  id: string;
  client: string;
  logo: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  issued: string;
  items: number;
}

const invoices: Invoice[] = [
  { id: 'INV-1042', client: 'Acme Corp',        logo: 'linear-gradient(135deg,#6366f1,#8b5cf6)', amount: 12400, currency: 'USD', status: 'paid',    issued: '2026-08-02', items: 8  },
  { id: 'INV-1041', client: 'Globex',           logo: 'linear-gradient(135deg,#0ea5e9,#22d3ee)', amount: 3250,  currency: 'USD', status: 'pending', issued: '2026-07-28', items: 3  },
  { id: 'INV-1040', client: 'Initech',          logo: 'linear-gradient(135deg,#f59e0b,#f97316)', amount: 890,   currency: 'USD', status: 'overdue', issued: '2026-07-14', items: 1  },
  { id: 'INV-1039', client: 'Umbrella Health',  logo: 'linear-gradient(135deg,#10b981,#34d399)', amount: 22750, currency: 'USD', status: 'paid',    issued: '2026-07-09', items: 14 },
  { id: 'INV-1038', client: 'Soylent Foods',    logo: 'linear-gradient(135deg,#ec4899,#f43f5e)', amount: 5600,  currency: 'USD', status: 'draft',   issued: '2026-06-30', items: 5  },
  { id: 'INV-1037', client: 'Hooli',            logo: 'linear-gradient(135deg,#64748b,#94a3b8)', amount: 18100, currency: 'USD', status: 'pending', issued: '2026-06-21', items: 11 },
];

const statusColor: Record<Invoice['status'], string> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  draft: 'neutral',
};

const statusLabel: Record<Invoice['status'], string> = {
  paid: 'Pagada',
  pending: 'Pendiente',
  overdue: 'Vencida',
  draft: 'Borrador',
};

const helpers = {
  invoices,
  statusColor,
  statusLabel,
  money: (n: number) => `US$ ${n.toLocaleString('es-AR')}`,
  day: (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
  labelFor: (row: Invoice) => `Seleccionar factura ${row.id} de ${row.client}`,
};

// Las columnas se declaran una sola vez y se reusan en todas las historias: es
// exactamente el mismo markup que escribiría quien consume la librería.
const columns = `
  <ng-template fsColumn="logo" header="Logo" [headerHidden]="true" cardSlot="media" let-row>
    <div class="fs-table__media" [style.background]="row.logo"></div>
  </ng-template>

  <ng-template fsColumn="client" header="Cliente" cardSlot="title" [sortable]="true" let-row>
    <a href="#" (click)="$event.preventDefault()">{{ row.client }}</a>
  </ng-template>

  <ng-template fsColumn="id" header="Factura" cardSlot="meta" let-row>
    <span style="font-family:var(--fs-font-mono);font-size:12.5px;">{{ row.id }}</span>
  </ng-template>

  <ng-template fsColumn="amount" header="Importe" align="end" cardSlot="value" [sortable]="true" let-row>
    {{ money(row.amount) }}
  </ng-template>

  <ng-template fsColumn="status" header="Estado" cardSlot="status" let-row>
    <fs-badge size="sm" [color]="statusColor[row.status]">{{ statusLabel[row.status] }}</fs-badge>
  </ng-template>

  <ng-template fsColumn="items" header="Ítems" align="end" cardSlot="meta" [sortable]="true" let-row>
    {{ row.items }}
  </ng-template>

  <ng-template fsColumn="issued" header="Emitida" cardSlot="meta" [sortable]="true" let-row>
    {{ day(row.issued) }}
  </ng-template>

  <ng-template fsColumn="actions" header="Acciones" [headerHidden]="true" align="end" cardSlot="actions" let-row>
    <fs-button size="sm" variant="ghost" (click)="picked = row.id">Ver</fs-button>
  </ng-template>
`;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    caption: 'Facturas emitidas',
    rowKey: 'id',
    selectable: true,
    clientSort: true,
    density: 'comfortable',
    layout: 'auto',
    hoverable: true,
    zebra: false,
    corners: 'all',
  },
  render: (args) => ({
    props: { ...args, ...helpers, sel: [] as string[], sort: { key: 'issued', dir: 'desc' }, picked: '' },
    template: `
      <fs-table
        [rows]="invoices"
        [rowKey]="rowKey"
        [caption]="caption"
        [selectable]="selectable"
        [(selected)]="sel"
        [selectLabel]="labelFor"
        [(sort)]="sort"
        [clientSort]="clientSort"
        [density]="density"
        [layout]="layout"
        [hoverable]="hoverable"
        [zebra]="zebra"
        [corners]="corners"
      >
        ${columns}
      </fs-table>

      <p style="margin-top:12px;font:13px var(--fs-font-sans);color:var(--fs-color-text-secondary);">
        Orden: <strong>{{ sort ? sort.key + ' · ' + sort.dir : 'sin orden' }}</strong>
        · Seleccionadas: <strong>{{ sel.length }}</strong>
      </p>
    `,
  }),
};

// ─── Modo tarjeta ────────────────────────────────────────────────────────────

export const Cards: Story = {
  name: 'Modo tarjeta (mobile)',
  parameters: {
    docs: {
      description: {
        story:
          'La misma tabla, las mismas celdas y la misma semántica: solo cambia dónde ' +
          'cae cada una. El acomodo sale del `cardSlot` de cada columna, así que no ' +
          'hay un template aparte para mobile. Con `layout="auto"` el cambio lo ' +
          'dispara el ancho del contenedor — probá achicando el panel.',
      },
    },
  },
  render: () => ({
    props: { ...helpers, sel: [] as string[], sort: null, picked: '' },
    template: `
      <div style="max-width:390px;">
        <fs-table
          [rows]="invoices"
          rowKey="id"
          caption="Facturas emitidas"
          [selectable]="true"
          [(selected)]="sel"
          [selectLabel]="labelFor"
          [(sort)]="sort"
          [clientSort]="true"
          layout="cards"
        >
          ${columns}
        </fs-table>
      </div>
    `,
  }),
};

// ─── Auto: el mismo componente a dos anchos ──────────────────────────────────

export const Responsive: Story = {
  name: 'Auto — según el contenedor',
  parameters: {
    docs: {
      description: {
        story:
          'El corte lo hace una container query sobre el ancho real disponible, no ' +
          'sobre el viewport. Por eso la tabla de la derecha está en tarjetas aunque ' +
          'la pantalla sea ancha: lo angosto es su contenedor.',
      },
    },
  },
  render: () => ({
    props: { ...helpers, selA: [] as string[], selB: [] as string[], sortA: null, sortB: null, picked: '' },
    template: `
      <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;">
        <div style="flex:1 1 760px;min-width:0;">
          <fs-table [rows]="invoices" rowKey="id" caption="Facturas — panel ancho"
                    [captionVisible]="true" [(sort)]="sortA" [clientSort]="true">
            ${columns}
          </fs-table>
        </div>
        <div style="flex:0 0 360px;">
          <fs-table [rows]="invoices" rowKey="id" caption="Facturas — panel angosto"
                    [captionVisible]="true" [(sort)]="sortB" [clientSort]="true">
            ${columns}
          </fs-table>
        </div>
      </div>
    `,
  }),
};

// ─── Densidad ────────────────────────────────────────────────────────────────

export const Density: Story = {
  name: 'Densidad',
  render: () => ({
    props: { ...helpers, sortA: null, sortB: null, picked: '' },
    template: `
      <div style="display:flex;flex-direction:column;gap:28px;">
        <div>
          <h4 style="font:600 13px var(--fs-font-sans);margin:0 0 8px;">comfortable — 62px</h4>
          <fs-table [rows]="invoices" rowKey="id" caption="Facturas cómodas"
                    density="comfortable" [(sort)]="sortA" [clientSort]="true">
            ${columns}
          </fs-table>
        </div>
        <div>
          <h4 style="font:600 13px var(--fs-font-sans);margin:0 0 8px;">compact — 44px</h4>
          <fs-table [rows]="invoices" rowKey="id" caption="Facturas compactas"
                    density="compact" [(sort)]="sortB" [clientSort]="true">
            ${columns}
          </fs-table>
        </div>
      </div>
    `,
  }),
};

// ─── Encabezado fijo ─────────────────────────────────────────────────────────

export const StickyHeader: Story = {
  name: 'Encabezado fijo',
  parameters: {
    docs: {
      description: {
        story:
          '`stickyHeader` necesita `maxHeight`: sin una altura que recorte, el que ' +
          'scrollea es el documento y el encabezado no tiene a qué pegarse.',
      },
    },
  },
  render: () => ({
    props: {
      ...helpers,
      invoices: [...invoices, ...invoices, ...invoices].map((r, i) => ({ ...r, id: `${r.id}-${i}` })),
      sort: null,
      picked: '',
    },
    template: `
      <fs-table [rows]="invoices" rowKey="id" caption="Facturas emitidas"
                [stickyHeader]="true" maxHeight="360px" [(sort)]="sort" [clientSort]="true">
        ${columns}
      </fs-table>
    `,
  }),
};

// ─── Cargando ────────────────────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Cargando',
  render: () => ({
    props: { ...helpers, picked: '' },
    template: `
      <fs-table [rows]="[]" rowKey="id" caption="Facturas emitidas"
                [selectable]="true" [loading]="true" [skeletonRows]="5">
        ${columns}
      </fs-table>
    `,
  }),
};

// ─── Vacío ───────────────────────────────────────────────────────────────────

export const Empty: Story = {
  name: 'Sin resultados',
  parameters: {
    docs: {
      description: {
        story:
          'Sin nada proyectado sale un texto mínimo. Con `fsTableEmpty` el estado ' +
          'vacío lo escribe quien usa la tabla — que es quien sabe qué ofrecerle ' +
          'a alguien que no encontró nada.',
      },
    },
  },
  render: () => ({
    props: { ...helpers, picked: '' },
    template: `
      <div style="display:flex;flex-direction:column;gap:28px;">
        <fs-table [rows]="[]" rowKey="id" caption="Facturas — vacío por defecto">
          ${columns}
        </fs-table>

        <fs-table [rows]="[]" rowKey="id" caption="Facturas — vacío propio">
          ${columns}
          <div fsTableEmpty style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <strong style="font:600 15px var(--fs-font-sans);">No hay facturas vencidas</strong>
            <span style="font:13px var(--fs-font-sans);color:var(--fs-color-text-secondary);">
              Buena noticia. Probá con otro filtro para ver el resto.
            </span>
            <fs-button size="sm" variant="secondary">Ver todas</fs-button>
          </div>
        </fs-table>
      </div>
    `,
  }),
};

// ─── Zebra ───────────────────────────────────────────────────────────────────

export const Zebra: Story = {
  name: 'Filas alternadas',
  render: () => ({
    props: { ...helpers, sort: null, picked: '' },
    template: `
      <fs-table [rows]="invoices" rowKey="id" caption="Facturas emitidas"
                [zebra]="true" density="compact" [(sort)]="sort" [clientSort]="true">
        ${columns}
      </fs-table>
    `,
  }),
};

// ─── Filtro por columna ──────────────────────────────────────────────────────

/** El estado que la story de filtro mantiene sobre la instancia del componente. */
interface FilterState {
  active: string[];
  rows: Invoice[];
}

export const ColumnFilters: Story = {
  name: 'Filtro por columna',
  parameters: {
    docs: {
      description: {
        story:
          'La tabla pone el embudo, ancla el panel y se asegura de que haya uno solo ' +
          'abierto — pero **no filtra**: no toca `rows`. Vos leés lo que el panel cambió ' +
          'y le pasás la lista ya filtrada, igual que si la filtrara el servidor.\n\n' +
          '`filterCount` es un número que le pasás: con más de cero se dibuja el badge y ' +
          'la columna queda marcada. El panel se declara aparte con ' +
          '`ng-template fsColumnFilter="<nombre>"`, enlazado por nombre a su columna.\n\n' +
          'El panel sube al top layer del navegador, así que no lo recorta el ' +
          '`overflow-x` de la tabla ni ningún ancestro con `transform` o `contain` — que ' +
          'es exactamente donde se rompen los dropdowns hechos con `position: fixed`.',
      },
    },
  },
  render: () => ({
    // La story hace de consumidor: la tabla avisa qué se tocó, y acá se decide
    // qué filas ve. Los métodos escriben sobre `this` — Storybook copia estas
    // props a la instancia del componente, así que un closure propio quedaría
    // mutando un objeto que el template ya no está leyendo.
    props: {
      ...helpers,
      picked: '',
      sort: null,
      active: [] as string[],
      rows: invoices,
      allStatuses: ['paid', 'pending', 'overdue', 'draft'],

      toggle(this: FilterState, value: string) {
        this.active = this.active.includes(value)
          ? this.active.filter(v => v !== value)
          : [...this.active, value];
        this.rows = this.active.length
          ? invoices.filter(i => this.active.includes(i.status))
          : invoices;
      },

      clear(this: FilterState) {
        this.active = [];
        this.rows = invoices;
      },
    },
    template: `
      <fs-table [rows]="rows" rowKey="id" caption="Facturas emitidas"
                [(sort)]="sort" [clientSort]="true">

        <ng-template fsColumn="client" header="Cliente" cardSlot="title" [sortable]="true" let-row>
          <a href="#" (click)="$event.preventDefault()">{{ row.client }}</a>
        </ng-template>

        <ng-template fsColumn="id" header="Factura" cardSlot="meta" let-row>
          <span style="font-family:var(--fs-font-mono);font-size:12.5px;">{{ row.id }}</span>
        </ng-template>

        <ng-template fsColumn="amount" header="Importe" align="end" cardSlot="value" [sortable]="true" let-row>
          {{ money(row.amount) }}
        </ng-template>

        <ng-template fsColumn="status" header="Estado" cardSlot="status"
                     [filterCount]="active.length" let-row>
          <fs-badge size="sm" [color]="statusColor[row.status]">{{ statusLabel[row.status] }}</fs-badge>
        </ng-template>

        <ng-template fsColumn="issued" header="Emitida" cardSlot="meta" [sortable]="true" let-row>
          {{ day(row.issued) }}
        </ng-template>

        <ng-template fsColumnFilter="status" panelWidth="200px" let-close>
          <div style="display:flex;flex-direction:column;gap:8px;">
            @for (st of allStatuses; track st) {
              <fs-checkbox [label]="statusLabel[st]"
                           [ngModel]="active.includes(st)"
                           (ngModelChange)="toggle(st)" />
            }
            @if (active.length) {
              <div style="display:flex;justify-content:flex-end;padding-top:4px;">
                <fs-button size="sm" variant="ghost" (click)="clear(); close()">Limpiar</fs-button>
              </div>
            }
          </div>
        </ng-template>

        <div fsTableFooter style="font:13px var(--fs-font-sans);color:var(--fs-color-text-secondary);">
          {{ rows.length }} de {{ invoices.length }} facturas
        </div>
      </fs-table>
    `,
  }),
};
