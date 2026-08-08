import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsAccordionComponent } from './accordion.component';
import { FsButtonComponent } from '../button/button.component';

const FAQ = [
  {
    id: 'cancel',
    title: '¿Cómo cancelo mi suscripción?',
    content:
      'Desde Ajustes → Facturación → Cancelar. El acceso continúa hasta el fin del periodo pagado.',
  },
  {
    id: 'plan',
    title: '¿Puedo cambiar de plan?',
    content: 'Sí, en cualquier momento. El cambio se prorratea automáticamente.',
  },
  {
    id: 'refund',
    title: '¿Ofrecen reembolsos?',
    content: 'Reembolso completo dentro de los primeros 14 días, sin preguntas.',
  },
];

const meta: Meta<FsAccordionComponent> = {
  title: 'Components/Accordion',
  component: FsAccordionComponent,
  decorators: [moduleMetadata({ imports: [FsAccordionComponent, FsButtonComponent] })],
  tags: ['autodocs'],
  argTypes: {
    items: { control: false },
    open: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsAccordionComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { multiple: false },
  render: (args) => ({
    props: { ...args, items: FAQ, open: ['cancel'] },
    template: `
      <fs-accordion [items]="items" [multiple]="multiple" [(open)]="open"></fs-accordion>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Single vs multiple ──────────────────────────────────────────────────────

export const Multiple: Story = {
  name: 'Uno solo vs varios',
  render: () => ({
    props: { items: FAQ, single: ['cancel'], many: ['cancel', 'refund'] },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px;">
        <div style="display:flex; flex-direction:column; gap:8px;">
          <span style="font-size:12.5px; font-weight:600; color:var(--fs-color-text-secondary);">multiple = false (default)</span>
          <fs-accordion [items]="items" [(open)]="single"></fs-accordion>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <span style="font-size:12.5px; font-weight:600; color:var(--fs-color-text-secondary);">multiple = true</span>
          <fs-accordion [items]="items" [multiple]="true" [(open)]="many"></fs-accordion>
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:460px;">
          En modo simple, volver a clickear el panel abierto lo cierra: es la única
          forma de dejar el acordeón sin nada abierto con el mouse.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Rich content ────────────────────────────────────────────────────────────

export const TemplateContent: Story = {
  name: 'Contenido con markup',
  render: () => ({
    props: { open: ['invoice'] },
    template: `
      <ng-template #invoice>
        <p style="margin:0 0 10px;">
          El próximo cobro de <b>Acme Corp</b> es el 12 de septiembre por USD 240.
        </p>
        <fs-button variant="outline" size="sm" label="Ver factura"></fs-button>
      </ng-template>

      <ng-template #seats>
        <ul style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
          <li>John Doe — administrador</li>
          <li>Jane Roe — editora</li>
          <li>6 asientos libres</li>
        </ul>
      </ng-template>

      <fs-accordion
        [multiple]="true"
        [(open)]="open"
        [items]="[
          { id: 'invoice', title: 'Próxima facturación', content: invoice },
          { id: 'seats', title: 'Miembros del equipo', content: seats },
          { id: 'plain', title: 'Texto plano', content: 'El contenido también acepta un string común.' }
        ]"
      ></fs-accordion>

      <div style="margin-top:16px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:460px;">
        <code>content</code> acepta un string o un <code>TemplateRef</code>. Con el
        template el panel renderiza markup real — botones, listas, lo que sea — sin
        que el componente tenga que saber nada de eso.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Item deshabilitado',
  render: () => ({
    props: {
      open: ['active'],
      items: [
        { id: 'active', title: 'Plan y facturación', content: 'Método de pago, facturas e historial de cobros.' },
        { id: 'locked', title: 'Auditoría (solo plan Enterprise)', content: 'No disponible en tu plan.', disabled: true },
        { id: 'other', title: 'Notificaciones', content: 'Elegí qué eventos te llegan por mail.' },
      ],
    },
    template: `<fs-accordion [items]="items" [(open)]="open"></fs-accordion>`,
  }),
  parameters: { layout: 'padded' },
};

// ─── Theming ─────────────────────────────────────────────────────────────────

export const Theming: Story = {
  name: 'Custom properties',
  render: () => ({
    props: { items: FAQ, a: ['cancel'], b: ['cancel'] },
    template: `
      <div style="display:flex; flex-direction:column; gap:26px;">
        <fs-accordion [items]="items" [(open)]="a"></fs-accordion>

        <div style="--fs-accordion-accent: var(--fs-color-success);
                    --fs-accordion-radius: var(--fs-radius-sm);
                    --fs-accordion-pad-x: 24px;
                    --fs-accordion-pad-y: 20px;">
          <fs-accordion [items]="items" [(open)]="b"></fs-accordion>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
