import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { FsAlertComponent } from './alert.component';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<FsAlertComponent> = {
  title:     'fsociety/Alert',
  component: FsAlertComponent,
  tags:      ['autodocs'],

  argTypes: {
    type: {
      control:  'select',
      options:  ['info', 'success', 'warning', 'danger', 'neutral'],
      description: 'Tipo semántico',
      table: { defaultValue: { summary: 'info' } },
    },
    variant: {
      control:  'radio',
      options:  ['filled', 'accent'],
      description: 'filled = fondo sutil · accent = borde izquierdo',
      table: { defaultValue: { summary: 'filled' } },
    },
    title: {
      control: 'text',
      description: 'Título en negrita — opcional',
    },
    dismissible: {
      control: 'boolean',
      description: 'Muestra botón X para cerrar',
      table: { defaultValue: { summary: 'false' } },
    },
    autoDismiss: {
      control: 'number',
      description: 'Auto-cierre en ms (0 = deshabilitado)',
      table: { defaultValue: { summary: '0' } },
    },
    dismissed: {
      action: 'dismissed',
      description: 'Emite al cerrarse',
    },
  },
};

export default meta;
type Story = StoryObj<FsAlertComponent>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    type:        'info',
    variant:     'filled',
    title:       'Nueva versión disponible',
    dismissible: true,
    autoDismiss: 0,
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-alert
        [type]="type"
        [variant]="variant"
        [title]="title"
        [dismissible]="dismissible"
        [autoDismiss]="autoDismiss"
        (dismissed)="dismissed($event)"
      >
        fsociety v0.0.2 ya está disponible.
        Actualizá con <code>npm install &#64;heroelc/fsociety</code>
      </fs-alert>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Todos los tipos — filled
// ---------------------------------------------------------------------------

export const AllTypesFilled: Story = {
  name: 'Todos los tipos — filled',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; max-width:540px;">
        <fs-alert type="info"    title="Nueva versión disponible" [dismissible]="true">
          fsociety v0.0.2 lista. Actualizá con npm install.
        </fs-alert>
        <fs-alert type="success" title="Build exitoso" [dismissible]="true">
          Pipeline completado sin errores en 3.2s.
        </fs-alert>
        <fs-alert type="warning" title="Deprecación" [dismissible]="true">
          Este API queda obsoleta en v3.0. Migrá antes de diciembre.
        </fs-alert>
        <fs-alert type="danger"  title="Error de compilación" [dismissible]="true">
          No se pudo resolver el módulo. Verificá el path.
        </fs-alert>
        <fs-alert type="neutral" title="Información" [dismissible]="true">
          Este componente es standalone. Importalo directamente.
        </fs-alert>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Todos los tipos — accent
// ---------------------------------------------------------------------------

export const AllTypesAccent: Story = {
  name: 'Todos los tipos — accent',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; max-width:540px;">
        <fs-alert type="info"    variant="accent" title="Información">Borde izquierdo del color semántico.</fs-alert>
        <fs-alert type="success" variant="accent" title="Éxito">Acción completada correctamente.</fs-alert>
        <fs-alert type="warning" variant="accent" title="Atención">Esta acción puede tener consecuencias.</fs-alert>
        <fs-alert type="danger"  variant="accent" title="Error">Algo salió mal. Revisá los logs.</fs-alert>
        <fs-alert type="neutral" variant="accent" title="Nota">Recordá hacer commit antes de cerrar.</fs-alert>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Sin título
// ---------------------------------------------------------------------------

export const WithoutTitle: Story = {
  name: 'Sin título — solo descripción',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; max-width:540px;">
        <fs-alert type="info"    [dismissible]="true">Este componente es standalone. Importalo directamente en tu módulo.</fs-alert>
        <fs-alert type="warning" [dismissible]="true">Hay cambios sin guardar.</fs-alert>
        <fs-alert type="success">Preferencias guardadas.</fs-alert>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Auto-dismiss con progress bar
// ---------------------------------------------------------------------------

export const AutoDismiss: Story = {
  name: 'Auto-dismiss con progress bar',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:10px; max-width:540px;">
        <fs-alert type="success" title="Guardado" [autoDismiss]="3000">
          Se cierra automáticamente en 3 segundos.
        </fs-alert>
        <fs-alert type="info" title="Actualizando" [autoDismiss]="5000">
          Se cierra en 5 segundos. La barra inferior indica el tiempo restante.
        </fs-alert>
        <fs-alert type="warning" title="Sesión por expirar" [autoDismiss]="8000" [dismissible]="true">
          Tu sesión expira en 8 segundos. Podés cerrar este aviso o esperar.
        </fs-alert>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Componente interactivo — add/remove dinámico
// ---------------------------------------------------------------------------

@Component({
  selector: 'fs-alert-demo',
  standalone: true,
  imports: [CommonModule, FsAlertComponent],
  template: `
    <div style="max-width:540px;">
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        <button *ngFor="let type of types" (click)="add(type)"
          style="font-size:11px; font-weight:500; padding:6px 14px; border-radius:6px;
                 border:0.5px solid rgba(255,255,255,0.15); background:transparent;
                 color:rgba(255,255,255,0.7); cursor:pointer; font-family:inherit;">
          + {{ type }}
        </button>
        <button (click)="addAuto()"
          style="font-size:11px; font-weight:500; padding:6px 14px; border-radius:6px;
                 background:#534AB7; color:#fff; border:none; cursor:pointer; font-family:inherit;">
          + auto 4s
        </button>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <fs-alert
          *ngFor="let a of alerts; trackBy: trackById"
          [type]="a.type"
          [variant]="a.variant"
          [title]="a.title"
          [dismissible]="true"
          [autoDismiss]="a.autoDismiss"
          (dismissed)="remove(a.id)"
        >{{ a.message }}</fs-alert>
      </div>
      <p *ngIf="!alerts.length"
        style="font-size:12px; color:rgba(255,255,255,0.3); margin-top:8px;">
        Hacé click en los botones para agregar alerts ↑
      </p>
    </div>
  `,
})
export class FsAlertDemoComponent {
  types = ['info', 'success', 'warning', 'danger', 'neutral'] as const;
  alerts: any[] = [];
  private counter = 0;

  readonly messages: Record<string, { title: string; message: string }> = {
    info:    { title: 'Nueva versión',    message: 'fsociety v0.0.2 lista. Actualizá con npm install.' },
    success: { title: 'Build exitoso',    message: 'Pipeline completado sin errores en 3.2s.' },
    warning: { title: 'Deprecación',      message: 'Este API queda obsoleta en v3.0.' },
    danger:  { title: 'Error',            message: 'No se pudo resolver el módulo. Verificá el path.' },
    neutral: { title: 'Recordatorio',     message: 'Hacé commit antes de cerrar la sesión.' },
  };

  add(type: string, autoDismiss = 0): void {
    const m = this.messages[type];
    this.alerts.push({
      id:          ++this.counter,
      type,
      variant:     this.counter % 2 === 0 ? 'accent' : 'filled',
      title:       m.title,
      message:     m.message,
      autoDismiss,
    });
  }

  addAuto(): void { this.add('info', 4000); }

  remove(id: number): void {
    setTimeout(() => {
      this.alerts = this.alerts.filter(a => a.id !== id);
    }, 250);
  }

  trackById(_: number, a: any): number { return a.id; }
}

export const Interactive: Story = {
  name: 'Interactivo — agregar y remover',
  render: () => ({
    moduleMetadata: {
      imports: [FsAlertDemoComponent],
    },
    template: `<fs-alert-demo />`,
  }),
};
