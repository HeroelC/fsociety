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

@Component({
  selector: 'fs-toast-demo-interactive',
  standalone: true,
  imports: [FsToastStackComponent, FsButtonComponent],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <fs-button variant="primary"   size="sm" (click)="push('success')">Success</fs-button>
      <fs-button variant="secondary" size="sm" (click)="push('danger')">Danger</fs-button>
      <fs-button variant="outline"   size="sm" (click)="push('info')">Info</fs-button>
    </div>

    <ul style="margin:16px 0 0;padding-left:18px;font-size:13px;line-height:1.7;opacity:.85;">
      <li>Arrastrá el toast hacia los costados para descartarlo.</li>
      <li>Dejá el mouse encima para pausar la cuenta regresiva.</li>
      <li>La barra inferior muestra el tiempo restante y se congela junto con el temporizador.</li>
    </ul>

    <fs-toast-stack [swipeToDismiss]="true" [fuse]="true" [pauseOnHover]="true"></fs-toast-stack>
  `,
})
class FsToastDemoInteractiveComponent {
  private toasts = inject(FsToastService);
  push(tone: FsToastTone): void {
    this.toasts.push({
      tone,
      title: 'Notificación de ejemplo',
      text: 'Arrastrá para descartar o dejá el mouse encima para pausar.',
      duration: 6000,
    });
  }
}

@Component({
  selector: 'fs-toast-demo-sticky',
  standalone: true,
  imports: [FsToastStackComponent, FsButtonComponent],
  template: `
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      <fs-button variant="primary" size="sm" (click)="push()">Mostrar toast permanente</fs-button>
    </div>

    <p style="margin:16px 0 0;font-size:13px;line-height:1.7;opacity:.85;">
      Con <code>duration: 0</code> el toast no se cierra solo: queda hasta que la
      persona lo cierre con el botón. Útil para errores que requieren una acción.
    </p>

    <fs-toast-stack [swipeToDismiss]="true"></fs-toast-stack>
  `,
})
class FsToastDemoStickyComponent {
  private toasts = inject(FsToastService);
  push(): void {
    this.toasts.push({
      tone: 'danger',
      title: 'No se pudo guardar',
      text: 'Revisá la conexión y volvé a intentar. Este aviso queda hasta que lo cierres.',
      duration: 0,
    });
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Components/Toast',
  decorators: [
    moduleMetadata({
      imports: [
        FsToastDemoComponent,
        FsToastDemoMinimalComponent,
        FsToastDemoLongComponent,
        FsToastDemoInteractiveComponent,
        FsToastDemoStickyComponent,
      ],
    }),
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

// ─── Swipe + fuse + pausa ─────────────────────────────────────────────────────

export const SwipeFuseAndPause: Story = {
  name: 'Swipe, barra de tiempo y pausa',
  render: () => ({ template: `<fs-toast-demo-interactive></fs-toast-demo-interactive>` }),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Las tres conductas son independientes y se activan por separado. ' +
          '`swipeToDismiss` habilita el arrastre horizontal para descartar; ' +
          '`fuse` dibuja la barra de tiempo restante en el borde inferior; ' +
          '`pauseOnHover` detiene la cuenta regresiva mientras el puntero está ' +
          'encima o el foco está dentro del toast, y viene activo por defecto ' +
          'porque un temporizador que no se puede detener es una barrera de ' +
          'accesibilidad (WCAG 2.2.1, Timing Adjustable).',
      },
    },
  },
};

// ─── Toast permanente ─────────────────────────────────────────────────────────

export const Sticky: Story = {
  name: 'Permanente (duration: 0)',
  render: () => ({ template: `<fs-toast-demo-sticky></fs-toast-demo-sticky>` }),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Con `duration: 0` (o cualquier valor negativo) no se agenda ningún ' +
          'temporizador: el toast permanece visible hasta que se cierra con el ' +
          'botón o con un gesto de arrastre. La barra de tiempo no se dibuja, ' +
          'porque no hay tiempo restante que mostrar.',
      },
    },
  },
};
