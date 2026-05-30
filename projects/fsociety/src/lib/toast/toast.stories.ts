import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { FsToastStackComponent } from './toast-stack.component';
import { FsToastService, FsToastTone } from './toast.service';
import { FsButtonComponent } from '../button/button.component';

// ─── Demo wrapper ─────────────────────────────────────────────────────────────

@Component({
  selector: 'fs-toast-demo',
  standalone: true,
  imports: [FsToastStackComponent, FsButtonComponent],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <fs-button variant="primary"   size="sm" (click)="push('success','Guardado','Tus cambios se guardaron correctamente.')">Success</fs-button>
      <fs-button variant="secondary" size="sm" (click)="push('danger','Error de red','No se pudo conectar al servidor.')">Danger</fs-button>
      <fs-button variant="outline"   size="sm" (click)="push('warning','Sesión por expirar','Tu sesión expira en 5 minutos.')">Warning</fs-button>
      <fs-button variant="ghost"     size="sm" (click)="push('info','Actualización disponible','fsociety v0.0.16 está listo.')">Info</fs-button>
      <fs-button variant="ghost"     size="sm" (click)="push('neutral','Nuevo mensaje','Recibiste un mensaje.')">Neutral</fs-button>
    </div>
    <fs-toast-stack></fs-toast-stack>
  `,
})
class FsToastDemoComponent {
  private toasts = inject(FsToastService);
  push(tone: FsToastTone, title: string, text: string): void {
    this.toasts.push({ tone, title, text });
  }
}

@Component({
  selector: 'fs-toast-demo-minimal',
  standalone: true,
  imports: [FsToastStackComponent, FsButtonComponent],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <fs-button variant="primary" size="sm" (click)="push()">Mostrar toast</fs-button>
    </div>
    <fs-toast-stack></fs-toast-stack>
  `,
})
class FsToastDemoMinimalComponent {
  private toasts = inject(FsToastService);
  push(): void {
    this.toasts.push({ tone: 'success', title: 'Operación completada' });
  }
}

@Component({
  selector: 'fs-toast-demo-long',
  standalone: true,
  imports: [FsToastStackComponent, FsButtonComponent],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <fs-button variant="primary"   size="sm" (click)="push('success')">Success</fs-button>
      <fs-button variant="secondary" size="sm" (click)="push('danger')">Danger</fs-button>
      <fs-button variant="outline"   size="sm" (click)="push('warning')">Warning</fs-button>
    </div>
    <fs-toast-stack></fs-toast-stack>
  `,
})
class FsToastDemoLongComponent {
  private toasts = inject(FsToastService);
  push(tone: FsToastTone): void {
    this.toasts.push({
      tone,
      title: tone.charAt(0).toUpperCase() + tone.slice(1),
      text: 'Este toast se cierra automáticamente en 4.2 segundos.',
      duration: 4200,
    });
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [
    moduleMetadata({ imports: [FsToastDemoComponent, FsToastDemoMinimalComponent, FsToastDemoLongComponent] }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ─── All tones ────────────────────────────────────────────────────────────────

export const AllTones: Story = {
  name: 'Todos los tonos',
  render: () => ({ template: `<fs-toast-demo></fs-toast-demo>` }),
  parameters: { layout: 'padded' },
};

// ─── Solo título ──────────────────────────────────────────────────────────────

export const TitleOnly: Story = {
  name: 'Solo título',
  render: () => ({ template: `<fs-toast-demo-minimal></fs-toast-demo-minimal>` }),
  parameters: { layout: 'padded' },
};

// ─── Auto dismiss ─────────────────────────────────────────────────────────────

export const AutoDismiss: Story = {
  name: 'Auto-dismiss (4.2s)',
  render: () => ({ template: `<fs-toast-demo-long></fs-toast-demo-long>` }),
  parameters: { layout: 'padded' },
};
