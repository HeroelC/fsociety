import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsStepsComponent } from './steps.component';

const meta: Meta<FsStepsComponent> = {
  title: 'Components/Steps',
  component: FsStepsComponent,
  decorators: [
    moduleMetadata({
      imports: [FsStepsComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    current: { control: { type: 'number', min: 0, max: 4 } },
  },
};

export default meta;
type Story = StoryObj<FsStepsComponent>;

const checkoutSteps = [
  { label: 'Cuenta',   desc: 'Datos básicos' },
  { label: 'Perfil',   desc: 'Tu información' },
  { label: 'Plan',     desc: 'Elige y paga' },
  { label: 'Listo',    desc: 'Confirmación' },
];

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    steps: checkoutSteps,
    current: 2,
  },
};

// ─── Primer paso ──────────────────────────────────────────────────────────────

export const FirstStep: Story = {
  name: 'Primer paso (inicio)',
  args: {
    steps: checkoutSteps,
    current: 0,
  },
};

// ─── Último paso ──────────────────────────────────────────────────────────────

export const LastStep: Story = {
  name: 'Último paso (completado)',
  args: {
    steps: checkoutSteps,
    current: checkoutSteps.length,
  },
};

// ─── Sin descripciones ────────────────────────────────────────────────────────

export const NoDescriptions: Story = {
  name: 'Sin descripciones',
  args: {
    steps: [
      { label: 'Datos' },
      { label: 'Revisar' },
      { label: 'Pagar' },
      { label: 'Listo' },
    ],
    current: 1,
  },
};

// ─── Interactivo ──────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactivo',
  render: () => ({
    props: {
      step: 1,
      steps: checkoutSteps,
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:24px;max-width:600px;">

        <fs-steps [steps]="steps" [current]="step"></fs-steps>

        <div style="display:flex;gap:8px;">
          <button
            style="padding:6px 14px;border:1px solid var(--fs-color-border);border-radius:6px;background:var(--fs-color-surface);cursor:pointer;font:inherit;font-size:13px"
            [disabled]="step <= 0"
            (click)="step = step - 1"
          >← Anterior</button>
          <button
            style="padding:6px 14px;border:none;border-radius:6px;background:var(--fs-color-primary);color:#fff;cursor:pointer;font:inherit;font-size:13px"
            [disabled]="step >= steps.length"
            (click)="step = step + 1"
          >Siguiente →</button>
        </div>

        <p style="font-size:12px;color:var(--fs-color-text-secondary)">Paso {{ step + 1 }} de {{ steps.length }}</p>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Responsive ───────────────────────────────────────────────────────────────
// El colapso lo decide una container query sobre el ancho del propio fs-steps,
// no sobre el viewport: un stepper dentro de un panel angosto necesita el mismo
// trato que uno a pantalla completa en un telefono. Por eso los tres tramos se
// pueden ver a la vez, uno al lado del otro, sin tocar el tamano de la ventana.

export const Responsive: Story = {
  name: 'Responsive (tres tramos)',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;">

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">
            Completo — arriba de 520px entran todas las etiquetas
          </p>
          <div style="width:640px;max-width:100%">
            <fs-steps [steps]="steps" [current]="1"></fs-steps>
          </div>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">
            Compacto — hasta 520px solo el paso activo conserva etiqueta
          </p>
          <div style="width:420px;max-width:100%">
            <fs-steps [steps]="steps" [current]="1"></fs-steps>
          </div>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">
            Solo puntos — hasta 300px no hay lugar para ninguna palabra
          </p>
          <div style="width:280px;max-width:100%">
            <fs-steps [steps]="steps" [current]="1"></fs-steps>
          </div>
        </div>

      </div>
    `,
    props: {
      steps: [
        { label: 'Datos' },
        { label: 'Fotos' },
        { label: 'Precio' },
        { label: 'Publicar' },
      ],
    },
  }),
  parameters: { layout: 'padded' },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:32px;max-width:640px;">

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">Inicio (current=0)</p>
          <fs-steps [steps]="steps" [current]="0"></fs-steps>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">Medio (current=2)</p>
          <fs-steps [steps]="steps" [current]="2"></fs-steps>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">Completado (current=4)</p>
          <fs-steps [steps]="steps" [current]="4"></fs-steps>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:12px">Sin descripciones</p>
          <fs-steps [steps]="simple" [current]="1"></fs-steps>
        </div>

      </div>
    `,
    props: {
      steps: [
        { label: 'Cuenta',  desc: 'Datos básicos' },
        { label: 'Perfil',  desc: 'Tu información' },
        { label: 'Plan',    desc: 'Elige y paga' },
        { label: 'Listo',   desc: 'Confirmación' },
      ],
      simple: [
        { label: 'Datos' },
        { label: 'Revisar' },
        { label: 'Pagar' },
        { label: 'Listo' },
      ],
    },
  }),
  parameters: { layout: 'padded' },
};
