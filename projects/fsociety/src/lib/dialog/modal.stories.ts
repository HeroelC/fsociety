import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsModalComponent } from './modal.component';
import { FsButtonComponent } from '../button/button.component';
import { FsInputComponent } from '../input/input.component';
import { FsSelectComponent } from '../select/select.component';

const meta: Meta<FsModalComponent> = {
  title: 'Components/Modal',
  component: FsModalComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FsModalComponent,
        FsButtonComponent,
        FsInputComponent,
        FsSelectComponent,
        FormsModule,
      ],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Construido sobre `<dialog>` nativo con `showModal()`. De ahí salen gratis el focus trap, el focus restore al cerrar, el fondo inerte, `Escape`, y el top layer — así que ningún `z-index` puede poner un dropdown encima.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsModalComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    heading: 'Confirmar acción',
    size: 'md',
    closeOnBackdrop: true,
    closeOnEscape: true,
    showClose: true,
    lockScroll: true,
  },
  render: (args) => ({
    props: { ...args, open: false },
    template: `
      <fs-button variant="primary" (click)="open = true">Abrir modal</fs-button>

      <fs-modal
        [(open)]="open"
        [heading]="heading"
        [size]="size"
        [closeOnBackdrop]="closeOnBackdrop"
        [closeOnEscape]="closeOnEscape"
        [showClose]="showClose"
        [lockScroll]="lockScroll"
      >
        <p style="margin:0">
          Esto va a archivar el proyecto y sacarlo del listado. Podés restaurarlo
          más tarde desde la papelera.
        </p>

        <div modalFooter>
          <fs-button variant="outline" (click)="open = false">Cancelar</fs-button>
          <fs-button variant="danger" (click)="open = false">Archivar</fs-button>
        </div>
      </fs-modal>
    `,
  }),
};

// ─── What native gives us ────────────────────────────────────────────────────

export const NativeBehaviour: Story = {
  name: 'Lo que da <dialog> nativo',
  render: () => ({
    props: { open: false },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
        <fs-button variant="primary" (click)="open = true">Abrir y probar</fs-button>

        <table style="font-size:12.5px; color:var(--fs-color-text-secondary); border-collapse:collapse; line-height:1.5;">
          <tbody>
            <tr><td style="padding:4px 14px 4px 0"><b>Tab</b></td><td>queda atrapado adentro — no se escapa a la página</td></tr>
            <tr><td style="padding:4px 14px 4px 0"><b>Escape</b></td><td>cierra</td></tr>
            <tr><td style="padding:4px 14px 4px 0"><b>Al cerrar</b></td><td>el foco vuelve al botón que lo abrió</td></tr>
            <tr><td style="padding:4px 14px 4px 0"><b>Click afuera</b></td><td>cierra</td></tr>
            <tr><td style="padding:4px 14px 4px 0"><b>Fondo</b></td><td>inerte de verdad, no solo <code>aria-modal</code></td></tr>
            <tr><td style="padding:4px 14px 4px 0"><b>Scroll</b></td><td>bloqueado, y sin salto lateral</td></tr>
          </tbody>
        </table>

        <div style="height:600px; display:grid; place-items:center; border:1px dashed var(--fs-color-border); border-radius:var(--fs-radius-lg); color:var(--fs-color-text-placeholder); font-size:12.5px;">
          Contenido alto, para que se note el scroll lock
        </div>
      </div>

      <fs-modal [(open)]="open" heading="Probá el teclado">
        <p style="margin:0 0 14px">
          Tabulá entre estos controles: el foco no sale del modal, y al cerrar vuelve
          al botón de arriba.
        </p>
        <fs-input label="Nombre" placeholder="Escribí algo"></fs-input>

        <div modalFooter>
          <fs-button variant="outline" (click)="open = false">Cerrar</fs-button>
        </div>
      </fs-modal>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Above a dropdown ────────────────────────────────────────────────────────

export const AboveOverlays: Story = {
  name: 'Por encima de los dropdowns',
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
      <div style="display:flex; flex-direction:column; gap:16px; max-width:520px;">
        <p style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; margin:0;">
          Nuestros dropdowns viven en el top layer con <code>z-index: 9999</code>.
          La referencia le ponía <code>z-index: 100</code> al overlay, así que un
          select abierto quedaba <b>encima</b> del modal. Un <code>&lt;dialog&gt;</code>
          modal está en el top layer por encima de los popovers, sin pelear z-index.
        </p>

        <fs-select label="Abrí este select y después el modal" [options]="options"></fs-select>
        <fs-button variant="primary" (click)="open = true">Abrir modal</fs-button>
      </div>

      <fs-modal [(open)]="open" heading="Y el select acá adentro también funciona">
        <fs-select label="Un select dentro del modal" [options]="options"></fs-select>
        <p style="margin:14px 0 0; font-size:12.5px;">
          Su panel también sube al top layer, por encima del modal.
        </p>

        <div modalFooter>
          <fs-button variant="outline" (click)="open = false">Cerrar</fs-button>
        </div>
      </fs-modal>
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
        <fs-button variant="outline" (click)="which = 'sm'">sm</fs-button>
        <fs-button variant="outline" (click)="which = 'md'">md</fs-button>
        <fs-button variant="outline" (click)="which = 'lg'">lg</fs-button>
        <fs-button variant="outline" (click)="which = 'full'">full</fs-button>
        <fs-button variant="outline" (click)="which = 'custom'">width propio</fs-button>
      </div>

      <fs-modal [open]="which === 'sm'" (openChange)="which = ''" heading="sm — 380px" size="sm">
        <p style="margin:0">Para confirmaciones cortas.</p>
      </fs-modal>

      <fs-modal [open]="which === 'md'" (openChange)="which = ''" heading="md — 520px (default)" size="md">
        <p style="margin:0">El tamaño de todos los días.</p>
      </fs-modal>

      <fs-modal [open]="which === 'lg'" (openChange)="which = ''" heading="lg — 760px" size="lg">
        <p style="margin:0">Para formularios o tablas.</p>
      </fs-modal>

      <fs-modal [open]="which === 'full'" (openChange)="which = ''" heading="full" size="full">
        <p style="margin:0">Casi todo el viewport.</p>
      </fs-modal>

      <fs-modal [open]="which === 'custom'" (openChange)="which = ''" heading="width = 42rem" width="42rem">
        <p style="margin:0">Cualquier longitud CSS pisa el preset.</p>
      </fs-modal>
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

      <fs-modal [(open)]="open" heading="Términos y condiciones" size="lg">
        @for (n of lines; track n) {
          <p style="margin:0 0 12px">
            Párrafo {{ n }}. El cuerpo scrollea adentro del panel, así que el header
            y el footer se quedan fijos en vez de irse de pantalla.
          </p>
        }

        <div modalFooter>
          <fs-button variant="outline" (click)="open = false">Rechazar</fs-button>
          <fs-button variant="primary" (click)="open = false">Aceptar</fs-button>
        </div>
      </fs-modal>
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
      <div style="display:flex; flex-direction:column; gap:14px; max-width:520px;">
        <fs-button variant="primary" (click)="open = true">Abrir</fs-button>
        <p style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; margin:0;">
          Con <code>closeOnBackdrop</code> y <code>closeOnEscape</code> en
          <code>false</code>, y sin la X, la única salida son los botones. Para
          cuando la decisión no puede quedar a medias.
        </p>
      </div>

      <fs-modal
        [(open)]="open"
        heading="Confirmá tu elección"
        [closeOnBackdrop]="false"
        [closeOnEscape]="false"
        [showClose]="false"
        size="sm"
      >
        <p style="margin:0">Probá Escape o clickear afuera: no cierra.</p>

        <div modalFooter>
          <fs-button variant="outline" (click)="open = false">No</fs-button>
          <fs-button variant="primary" (click)="open = false">Sí, dale</fs-button>
        </div>
      </fs-modal>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── No header ───────────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: 'Sin header ni footer',
  render: () => ({
    props: { open: false },
    template: `
      <fs-button variant="primary" (click)="open = true">Abrir</fs-button>

      <fs-modal [(open)]="open" [showClose]="false" size="sm">
        <div style="text-align:center; padding:14px 0;">
          <p style="margin:0 0 16px; color:var(--fs-color-text-primary); font-size:15px;">
            Sin header y sin footer proyectado, no queda ningún borde suelto.
          </p>
          <fs-button variant="primary" (click)="open = false">Entendido</fs-button>
        </div>
      </fs-modal>
    `,
  }),
  parameters: { layout: 'padded' },
};
