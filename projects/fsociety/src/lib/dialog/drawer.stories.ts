import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsDrawerComponent } from './drawer.component';
import { FsButtonComponent } from '../button/button.component';
import { FsInputComponent } from '../input/input.component';
import { FsSelectComponent } from '../select/select.component';
import { FsSwitchComponent } from '../choice/switch.component';

const meta: Meta<FsDrawerComponent> = {
  title: 'Components/Drawer',
  component: FsDrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FsDrawerComponent,
        FsButtonComponent,
        FsInputComponent,
        FsSelectComponent,
        FsSwitchComponent,
        FormsModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['right', 'left', 'top', 'bottom'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'El mismo `<dialog>` nativo que el modal — focus trap, focus restore, fondo inerte, `Escape` y top layer incluidos — con el panel pegado a un borde en vez de centrado.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsDrawerComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    heading: 'Filtros',
    side: 'right',
    size: '400px',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showClose: true,
    lockScroll: true,
  },
  render: (args) => ({
    props: {
      ...args,
      open: false,
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'active', label: 'Activos' },
        { value: 'archived', label: 'Archivados' },
      ],
    },
    template: `
      <fs-button variant="primary" (click)="open = true">Abrir drawer</fs-button>

      <fs-drawer
        [(open)]="open"
        [heading]="heading"
        [side]="side"
        [size]="size"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showClose]="showClose"
        [lockScroll]="lockScroll"
      >
        <div style="display:flex; flex-direction:column; gap:18px;">
          <fs-input label="Buscar" placeholder="Nombre del proyecto…"></fs-input>
          <fs-select label="Estado" [options]="options"></fs-select>
          <fs-switch label="Solo los míos"></fs-switch>
        </div>

        <div drawerFooter>
          <fs-button variant="outline" (click)="open = false">Limpiar</fs-button>
          <fs-button variant="primary" (click)="open = false">Aplicar</fs-button>
        </div>
      </fs-drawer>
    `,
  }),
};

// ─── Sides ───────────────────────────────────────────────────────────────────

export const Sides: Story = {
  name: 'Los cuatro lados',
  render: () => ({
    props: { which: '' as string },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:10px;">
        <fs-button variant="outline" (click)="which = 'right'">right</fs-button>
        <fs-button variant="outline" (click)="which = 'left'">left</fs-button>
        <fs-button variant="outline" (click)="which = 'top'">top</fs-button>
        <fs-button variant="outline" (click)="which = 'bottom'">bottom</fs-button>
      </div>

      <fs-drawer [open]="which === 'right'" (openChange)="which = ''" heading="Desde la derecha" side="right">
        <p style="margin:0">El default. Entra deslizándose desde el borde derecho.</p>
      </fs-drawer>

      <fs-drawer [open]="which === 'left'" (openChange)="which = ''" heading="Desde la izquierda" side="left">
        <p style="margin:0">Típico de un menú de navegación.</p>
      </fs-drawer>

      <fs-drawer [open]="which === 'top'" (openChange)="which = ''" heading="Desde arriba" side="top" size="260px">
        <p style="margin:0">Acá <code>size</code> es la altura, no el ancho.</p>
      </fs-drawer>

      <fs-drawer [open]="which === 'bottom'" (openChange)="which = ''" heading="Desde abajo" side="bottom" size="300px">
        <p style="margin:0">El patrón de sheet en mobile.</p>
      </fs-drawer>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  name: 'Tamaños',
  render: () => ({
    props: { which: '' as string },
    template: `
      <div style="display:flex; flex-wrap:wrap; gap:10px;">
        <fs-button variant="outline" (click)="which = 'a'">320px</fs-button>
        <fs-button variant="outline" (click)="which = 'b'">400px (default)</fs-button>
        <fs-button variant="outline" (click)="which = 'c'">640px</fs-button>
        <fs-button variant="outline" (click)="which = 'd'">50vw</fs-button>
      </div>

      <fs-drawer [open]="which === 'a'" (openChange)="which = ''" heading="320px" size="320px">
        <p style="margin:0">Angosto.</p>
      </fs-drawer>
      <fs-drawer [open]="which === 'b'" (openChange)="which = ''" heading="400px" size="400px">
        <p style="margin:0">El default.</p>
      </fs-drawer>
      <fs-drawer [open]="which === 'c'" (openChange)="which = ''" heading="640px" size="640px">
        <p style="margin:0">Para un formulario cómodo.</p>
      </fs-drawer>
      <fs-drawer [open]="which === 'd'" (openChange)="which = ''" heading="50vw" size="50vw">
        <p style="margin:0">Acepta cualquier longitud CSS, no solo px.</p>
      </fs-drawer>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Long body ───────────────────────────────────────────────────────────────

export const LongBody: Story = {
  name: 'Contenido largo',
  render: () => ({
    props: { open: false, lines: Array.from({ length: 40 }, (_, i) => i + 1) },
    template: `
      <fs-button variant="primary" (click)="open = true">Abrir</fs-button>

      <fs-drawer [(open)]="open" heading="Historial de actividad">
        @for (n of lines; track n) {
          <p style="margin:0 0 12px">
            Evento {{ n }} — el cuerpo scrollea adentro del panel, así que el header
            y el footer se quedan fijos.
          </p>
        }

        <div drawerFooter>
          <fs-button variant="outline" (click)="open = false">Cerrar</fs-button>
        </div>
      </fs-drawer>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Nested overlays ─────────────────────────────────────────────────────────

export const WithOverlays: Story = {
  name: 'Con dropdowns adentro',
  render: () => ({
    props: {
      open: false,
      options: [
        { value: 'a', label: 'Opción A' },
        { value: 'b', label: 'Opción B' },
        { value: 'c', label: 'Opción C' },
      ],
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px; max-width:520px;">
        <fs-button variant="primary" (click)="open = true">Abrir drawer</fs-button>
        <p style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; margin:0;">
          Un drawer es angosto y con scroll: exactamente donde un dropdown
          <code>position: fixed</code> se recortaría. Los nuestros suben al top
          layer, así que salen del panel.
        </p>
      </div>

      <fs-drawer [(open)]="open" heading="Abrí el select y el date picker" size="360px">
        <div style="display:flex; flex-direction:column; gap:18px;">
          <fs-select label="Estado" [options]="options"></fs-select>
          <fs-select label="Con búsqueda" [searchable]="true" [options]="options"></fs-select>
          <div style="height:300px"></div>
          <fs-select label="Uno abajo, con scroll de por medio" [options]="options"></fs-select>
        </div>

        <div drawerFooter>
          <fs-button variant="outline" (click)="open = false">Cerrar</fs-button>
        </div>
      </fs-drawer>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Locked ──────────────────────────────────────────────────────────────────

export const NotDismissable: Story = {
  name: 'Sin salida fácil',
  render: () => ({
    props: { open: false },
    template: `
      <fs-button variant="primary" (click)="open = true">Abrir</fs-button>

      <fs-drawer
        [(open)]="open"
        heading="Completá el paso"
        [closeOnBackdrop]="false"
        [closeOnEscape]="false"
        [showClose]="false"
      >
        <p style="margin:0">Escape y el click afuera están desactivados.</p>

        <div drawerFooter>
          <fs-button variant="primary" (click)="open = false">Listo</fs-button>
        </div>
      </fs-drawer>
    `,
  }),
  parameters: { layout: 'padded' },
};
