import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsMenuComponent, FsMenuItem } from './menu.component';

const CDN = 'https://api.iconify.design';
const I = {
  dots:      `${CDN}/tabler:dots-vertical.svg`,
  chevron:   `${CDN}/tabler:chevron-down.svg`,
  pencil:    `${CDN}/tabler:pencil.svg`,
  copy:      `${CDN}/tabler:copy.svg`,
  share:     `${CDN}/tabler:share.svg`,
  download:  `${CDN}/tabler:download.svg`,
  archive:   `${CDN}/tabler:archive.svg`,
  trash:     `${CDN}/tabler:trash.svg`,
  eye:       `${CDN}/tabler:eye.svg`,
};

const ACTIONS: FsMenuItem[] = [
  { id: 'view',     label: 'Ver detalle',  icon: I.eye },
  { id: 'edit',     label: 'Editar',       icon: I.pencil,   hint: '⌘E' },
  { id: 'copy',     label: 'Duplicar',     icon: I.copy },
  { id: 'archive',  label: 'Archivar',     icon: I.archive,  separatorBefore: true },
  { id: 'delete',   label: 'Eliminar',     icon: I.trash,    danger: true, separatorBefore: true },
];

const icon = (url: string, size = 18) =>
  `<span class="fs-icon" style="--_icon:url(${url}); width:${size}px; height:${size}px"></span>`;

const meta: Meta<FsMenuComponent> = {
  title: 'Components/Menu',
  component: FsMenuComponent,
  decorators: [moduleMetadata({ imports: [FsMenuComponent] })],
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: { type: 'inline-radio' },
      options: ['start', 'center'],
      description: 'Alineación horizontal del panel contra el disparador.',
    },
    side: {
      control: { type: 'inline-radio' },
      options: ['bottom', 'top'],
      description: 'Lado preferido. Se da vuelta solo si de ese lado no entra.',
    },
    matchTriggerWidth: {
      control: 'boolean',
      description: 'Estira el panel al ancho del disparador.',
    },
    disabled: { control: 'boolean' },
    itemSelect: { action: 'itemSelect' },
    openChange: { action: 'openChange' },
  },
};

export default meta;
type Story = StoryObj<FsMenuComponent>;

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: ACTIONS,
    align: 'start',
    side: 'bottom',
    matchTriggerWidth: false,
    disabled: false,
    ariaLabel: 'Acciones',
  },
  render: (args) => ({
    props: { ...args, I },
    template: `
      <div style="padding: 2rem 0;">
        <fs-menu
          [items]="items"
          [align]="align"
          [side]="side"
          [matchTriggerWidth]="matchTriggerWidth"
          [disabled]="disabled"
          [ariaLabel]="ariaLabel"
          (itemSelect)="itemSelect($event)"
          (openChange)="openChange($event)"
        >
          ${icon(I.dots)}
        </fs-menu>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Acciones por fila ───────────────────────────────────────────────────────
// El caso para el que existe el componente. La fila tiene overflow y el panel
// igual escapa, porque sube al top layer.

export const RowActions: Story = {
  name: 'Acciones por fila',
  render: () => ({
    props: {
      I,
      actions: ACTIONS,
      rows: [
        { name: 'Acme Corp',        plan: 'Enterprise', seats: 240 },
        { name: 'Globex',           plan: 'Pro',        seats: 48 },
        { name: 'Initech',          plan: 'Starter',    seats: 12 },
      ],
    },
    template: `
      <div style="max-width:560px; border:1px solid var(--fs-color-border); border-radius:var(--fs-radius-lg); overflow:hidden;">
        @for (row of rows; track row.name) {
          <div style="display:flex; align-items:center; gap:12px; padding:12px 14px; border-bottom:1px solid var(--fs-color-border);">
            <div style="flex:1; min-width:0;">
              <div style="font-size:14px; font-weight:600; color:var(--fs-color-text-primary);">{{ row.name }}</div>
              <div style="font-size:12.5px; color:var(--fs-color-text-secondary);">{{ row.plan }} · {{ row.seats }} asientos</div>
            </div>
            <fs-menu [items]="actions" align="start" side="bottom" ariaLabel="Acciones de la fila">
              ${icon(I.dots)}
            </fs-menu>
          </div>
        }
      </div>

      <p style="margin-top:14px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:560px;">
        El contenedor tiene <code>overflow: hidden</code>. El panel igual se ve
        entero: <code>FsAnchoredPopoverDirective</code> lo pinta en el top layer,
        así que ningún ancestro con <code>overflow</code> o <code>transform</code>
        lo puede recortar.
      </p>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Disparador con texto ────────────────────────────────────────────────────

export const TextTrigger: Story = {
  name: 'Disparador con texto',
  render: () => ({
    props: {
      I,
      items: [
        { id: 'csv',  label: 'Exportar a CSV',   icon: I.download },
        { id: 'xlsx', label: 'Exportar a Excel', icon: I.download },
        { id: 'pdf',  label: 'Exportar a PDF',   icon: I.download },
        { id: 'link', label: 'Copiar enlace',    icon: I.share, separatorBefore: true },
      ] as FsMenuItem[],
    },
    template: `
      <fs-menu [items]="items" ariaLabel="Exportar">
        <span style="font-size:14px; color:var(--fs-color-text-primary);">Exportar</span>
        ${icon(I.chevron, 16)}
      </fs-menu>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Estados ─────────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'Estados de los ítems',
  render: () => ({
    props: {
      I,
      mixed: [
        { id: 'a', label: 'Acción normal',   icon: I.pencil },
        { id: 'b', label: 'Con atajo',       icon: I.copy,  hint: '⌘D' },
        { id: 'c', label: 'Deshabilitada',   icon: I.share, disabled: true },
        { id: 'd', label: 'Destructiva',     icon: I.trash, danger: true, separatorBefore: true },
      ] as FsMenuItem[],
      empty: [] as FsMenuItem[],
    },
    template: `
      <div style="display:flex; gap:3rem; align-items:flex-start;">
        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 8px;">Ítems mezclados</p>
          <fs-menu [items]="mixed" ariaLabel="Acciones">${icon(I.dots)}</fs-menu>
        </div>
        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 8px;">Sin acciones</p>
          <fs-menu [items]="empty" ariaLabel="Acciones">${icon(I.dots)}</fs-menu>
        </div>
        <div>
          <p style="font-size:12.5px; color:var(--fs-color-text-secondary); margin:0 0 8px;">Deshabilitado</p>
          <fs-menu [items]="mixed" [disabled]="true" ariaLabel="Acciones">${icon(I.dots)}</fs-menu>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Teclado ─────────────────────────────────────────────────────────────────

export const Keyboard: Story = {
  name: 'Navegación por teclado',
  render: () => ({
    props: { I, items: ACTIONS },
    template: `
      <div style="display:flex; gap:2rem; align-items:flex-start;">
        <fs-menu [items]="items" ariaLabel="Acciones">${icon(I.dots)}</fs-menu>

        <table style="font-size:12.5px; color:var(--fs-color-text-secondary); border-collapse:collapse;">
          <tbody>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>Enter</kbd> / <kbd>Espacio</kbd></td><td>Abre y cierra</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>↓</kbd></td><td>Abre y va al primer ítem</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>↑</kbd></td><td>Abre y va al último ítem</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>↓</kbd> / <kbd>↑</kbd> abierto</td><td>Recorre en círculo, salteando los deshabilitados</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>Home</kbd> / <kbd>End</kbd></td><td>Primero / último</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>Esc</kbd></td><td>Cierra y devuelve el foco al disparador</td></tr>
            <tr><td style="padding:3px 14px 3px 0;"><kbd>Tab</kbd></td><td>Cierra y sigue el tab order</td></tr>
          </tbody>
        </table>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
