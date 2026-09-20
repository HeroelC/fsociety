import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsOtpComponent } from './otp.component';

const meta: Meta<FsOtpComponent> = {
  title: 'Components/Otp',
  component: FsOtpComponent,
  decorators: [moduleMetadata({ imports: [FsOtpComponent, FormsModule] })],
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'select', options: ['default', 'error', 'success'] },
    mode: { control: 'select', options: ['numeric', 'alphanumeric'] },
    length: { control: { type: 'number', min: 1, max: 12 } },
    groupAt: { control: 'number' },
    motion: { control: 'inline-radio', options: ['none', 'slots'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Campo de código de verificación. La primera celda lleva `autocomplete="one-time-code"`, que es lo que habilita el autofill del SMS en iOS y Android — y el desborde se reparte en las celdas siguientes en vez de descartarse.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsOtpComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Código de verificación',
    hint: 'Te enviamos un código de 6 dígitos.',
    length: 6,
    mode: 'numeric',
    state: 'default',
    disabled: false,
    selectOnFocus: true,
    separator: '–',
    motion: 'none',
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-otp
        [label]="label"
        [hint]="hint"
        [length]="length"
        [mode]="mode"
        [groupAt]="groupAt"
        [separator]="separator"
        [state]="state"
        [disabled]="disabled"
        [selectOnFocus]="selectOnFocus"
        [motion]="motion"
      ></fs-otp>
    `,
  }),
};

// ─── Paste ───────────────────────────────────────────────────────────────────

export const Paste: Story = {
  name: 'Pegar — probá con 123456',
  render: () => ({
    props: { code: '' },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <fs-otp label="Código" [(ngModel)]="code"></fs-otp>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.7; max-width:440px;">
          Valor: <code style="color:var(--fs-color-primary)">{{ code || '(vacío)' }}</code>

          <div style="margin-top:8px">
            Copiá <code>123456</code> y pegalo en la <b>primera</b> celda: se
            reparte en las seis.
          </div>
          <div style="margin-top:4px">
            Ahora pegá <code>99</code> en la <b>cuarta</b>: llena la cuarta y la
            quinta, y deja las primeras tres como estaban. La referencia siempre
            arrancaba de cero y borraba lo anterior.
          </div>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Lengths and grouping ────────────────────────────────────────────────────

export const Lengths: Story = {
  name: 'Largos y agrupado',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <fs-otp label="4 dígitos" [length]="4"></fs-otp>
        <fs-otp label="6 dígitos" [length]="6"></fs-otp>
        <fs-otp label="6 con separador al medio" [length]="6" [groupAt]="3"></fs-otp>
        <fs-otp label="8 con separador" [length]="8" [groupAt]="4" separator="·"></fs-otp>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Alphanumeric ────────────────────────────────────────────────────────────

export const Alphanumeric: Story = {
  name: 'Alfanumérico',
  render: () => ({
    props: { code: '' },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <fs-otp
          label="Código de invitación"
          hint="Letras y números. Se pasa a mayúsculas solo."
          mode="alphanumeric"
          [length]="6"
          [(ngModel)]="code"
        ></fs-otp>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary);">
          Valor: <code style="color:var(--fs-color-primary)">{{ code || '(vacío)' }}</code>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Complete ────────────────────────────────────────────────────────────────

export const Completed: Story = {
  name: 'Evento completed',
  render: () => ({
    props: { done: '' as string },
    template: `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <fs-otp label="Código" (completed)="done = $event"></fs-otp>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          @if (done) {
            <span style="color:var(--fs-color-success)">completed → <code>{{ done }}</code></span>
          } @else {
            Completá las seis celdas para que emita.
          }
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
    props: { v: '1234' },
    template: `
      <div style="display:flex; flex-direction:column; gap:24px;">
        <fs-otp label="Default" [length]="4" [(ngModel)]="v"></fs-otp>

        <fs-otp
          label="Error"
          [length]="4"
          state="error"
          errorMessage="El código no es válido o expiró."
          [(ngModel)]="v"
        ></fs-otp>

        <fs-otp
          label="Success"
          [length]="4"
          state="success"
          successMessage="Código verificado."
          [(ngModel)]="v"
        ></fs-otp>

        <fs-otp label="Disabled" [length]="4" [disabled]="true" [(ngModel)]="v"></fs-otp>
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
      <div style="display:flex; flex-direction:column; gap:18px;">
        <fs-otp label="Probá las teclas" [length]="6" [groupAt]="3"></fs-otp>

        <table style="font-size:12.5px; color:var(--fs-color-text-secondary); border-collapse:collapse;">
          <tbody>
            <tr><td style="padding:3px 14px 3px 0"><code>0-9</code></td><td>escribe y avanza</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Backspace</code></td><td>borra la celda; si ya está vacía, vuelve y borra la anterior</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>← →</code></td><td>mueven entre celdas</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Inicio</code> / <code>Fin</code></td><td>primera y última celda</td></tr>
            <tr><td style="padding:3px 14px 3px 0"><code>Ctrl+V</code></td><td>pega desde la celda enfocada</td></tr>
          </tbody>
        </table>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:440px;">
          <code>Backspace</code> sobre una celda llena la vacía y <b>se queda ahí</b>,
          en vez de saltar. Si salta, borrar dos caracteres seguidos se vuelve
          impredecible.
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Motion ──────────────────────────────────────────────────────────────────

export const Motion: Story = {
  name: 'Animación opcional',
  render: () => ({
    props: { plain: '', fancy: '', state: 'default' },
    template: `
      <div style="display:flex; flex-direction:column; gap:30px; max-width:460px;">

        <div style="display:flex; flex-direction:column; gap:10px;">
          <fs-otp
            label="motion=&quot;none&quot; — el default"
            hint="Sin animación: sólo las transiciones de borde y foco."
            [length]="6"
            [(ngModel)]="plain"
          ></fs-otp>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <fs-otp
            label="motion=&quot;slots&quot;"
            hint="Cada dígito aterriza con un pop y un wash del color primario."
            [length]="6"
            motion="slots"
            [(ngModel)]="fancy"
          ></fs-otp>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-start;">
          <fs-otp
            label="Error — la fila se sacude"
            [length]="6"
            motion="slots"
            [state]="state"
            errorMessage="El código no es válido o expiró."
            (valueChange)="state = 'default'"
          ></fs-otp>

          <button
            type="button"
            (click)="state = 'error'"
            style="font:inherit; font-size:12.5px; padding:6px 12px; cursor:pointer;
                   color:var(--fs-color-text-primary); background:var(--fs-color-surface);
                   border:1px solid var(--fs-color-border-field); border-radius:var(--fs-radius-md);"
          >
            Simular código inválido
          </button>
        </div>

        <div style="font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6;">
          La animación es <b>opt-in por instancia</b>: <code>motion</code> arranca en
          <code>'none'</code>, así que un <code>&lt;fs-otp&gt;</code> pelado no mueve nada.
          Y aunque esté prendida, <code>prefers-reduced-motion</code> del sistema apaga
          todo el movimiento y deja sólo el fundido — la preferencia del usuario gana
          por encima de la del consumidor.
        </div>

      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Adaptación del patrón *code slots*: el dígito aterriza con un pop, el error sacude la fila y el ícono de estado entra con escala. Cada efecto anima su propio elemento porque un `<input>` no admite pseudo-elementos, así que no hay dos animaciones compitiendo por el mismo nodo.',
      },
    },
  },
};
