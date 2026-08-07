import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsAlertComponent } from './alert.component';
import { FsButtonComponent } from '../button/button.component';

const meta: Meta<FsAlertComponent> = {
  title: 'Components/Alert',
  component: FsAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [FsAlertComponent, FsButtonComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    dismissed: { action: 'dismissed' },
  },
};

export default meta;
type Story = StoryObj<FsAlertComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    tone:        'info',
    title:       'Nueva versión disponible',
    dismissible: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-alert [tone]="tone" [title]="title" [dismissible]="dismissible"
                (dismissed)="dismissed($event)">
        Actualizá para acceder a las últimas funciones y correcciones.
      </fs-alert>
    `,
  }),
};

// ─── Todos los tonos ──────────────────────────────────────────────────────────

export const AllTones: Story = {
  name: 'Todos los tonos',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px;">
        <fs-alert tone="info" title="Nueva versión disponible" [dismissible]="true">
          Actualizá para acceder a las últimas funciones.
        </fs-alert>
        <fs-alert tone="success" title="Pago confirmado" [dismissible]="true">
          Tu suscripción está activa hasta mayo de 2027.
        </fs-alert>
        <fs-alert tone="warning" title="Tu plan expira pronto" [dismissible]="true">
          Quedan 3 días de tu prueba gratuita.
        </fs-alert>
        <fs-alert tone="danger" title="No se pudo procesar el pago" [dismissible]="true">
          Revisá los datos de tu tarjeta e intentá de nuevo.
        </fs-alert>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sin título ───────────────────────────────────────────────────────────────

export const WithoutTitle: Story = {
  name: 'Sin título',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px;">
        <fs-alert tone="info" [dismissible]="true">
          Este componente es standalone. Importalo directamente en tu módulo.
        </fs-alert>
        <fs-alert tone="warning" [dismissible]="true">
          Hay cambios sin guardar.
        </fs-alert>
        <fs-alert tone="success">
          Preferencias guardadas correctamente.
        </fs-alert>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Con acciones ─────────────────────────────────────────────────────────────

export const WithActions: Story = {
  name: 'Con acciones',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px;">

        <!-- Preferred: one [alertAction] per button, spaced by the slot itself -->
        <fs-alert tone="warning" title="Tu plan expira pronto">
          Quedan 3 días de tu prueba gratuita. Renovalo para no perder el acceso.
          <fs-button alertAction variant="outline" size="sm">Recordar luego</fs-button>
          <fs-button alertAction variant="primary" size="sm">Renovar ahora</fs-button>
        </fs-alert>

        <fs-alert tone="danger" title="No se pudo procesar el pago">
          Revisá los datos de tu tarjeta e intentá de nuevo.
          <fs-button alertAction variant="primary" size="sm">Reintentar</fs-button>
        </fs-alert>

        <!-- Also supported: a single wrapper holding the buttons -->
        <fs-alert tone="info" title="Nueva versión disponible">
          Hay una versión nueva disponible con mejoras de rendimiento.
          <div alertAction>
            <fs-button variant="outline" size="sm">Ver cambios</fs-button>
            <fs-button variant="primary" size="sm">Actualizar</fs-button>
          </div>
        </fs-alert>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Auto-dismiss ─────────────────────────────────────────────────────────────

export const AutoDismiss: Story = {
  name: 'Auto-dismiss con progress bar',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px;">
        <fs-alert tone="success" title="Guardado" [autoDismiss]="3000">
          Se cierra automáticamente en 3 segundos.
        </fs-alert>
        <fs-alert tone="info" title="Sincronizando" [autoDismiss]="5000">
          Se cierra en 5 segundos. La barra inferior indica el tiempo restante.
        </fs-alert>
        <fs-alert tone="warning" title="Sesión por expirar" [autoDismiss]="8000" [dismissible]="true">
          Tu sesión expira en 8 segundos.
        </fs-alert>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 10px; max-width: 560px;">

        <fs-alert tone="info" title="Nueva versión disponible" [dismissible]="true">
          Actualizá para acceder a las últimas funciones.
        </fs-alert>

        <fs-alert tone="success" title="Pago confirmado" [dismissible]="true">
          Tu suscripción está activa hasta mayo de 2027.
        </fs-alert>

        <fs-alert tone="warning" title="Tu plan expira pronto">
          Quedan 3 días de tu prueba gratuita.
          <div alertAction>
            <fs-button variant="outline" size="sm">Recordar luego</fs-button>
            <fs-button variant="primary" size="sm">Renovar ahora</fs-button>
          </div>
        </fs-alert>

        <fs-alert tone="danger" title="No se pudo procesar el pago" [dismissible]="true">
          Revisá los datos de tu tarjeta e intentá de nuevo.
          <div alertAction>
            <fs-button variant="primary" size="sm">Reintentar</fs-button>
          </div>
        </fs-alert>

        <fs-alert tone="success" title="Guardado" [autoDismiss]="5000">
          Se cierra en 5 segundos.
        </fs-alert>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
