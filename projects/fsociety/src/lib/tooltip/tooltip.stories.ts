import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsTooltipComponent } from './tooltip.component';
import { FsButtonComponent } from '../button/button.component';

const meta: Meta<FsTooltipComponent> = {
  title: 'Components/Tooltip',
  component: FsTooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [FsTooltipComponent, FsButtonComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom'],
    },
  },
};

export default meta;
type Story = StoryObj<FsTooltipComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Esto aparece arriba',
    side: 'top',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 40px; display: flex; justify-content: center;">
        <fs-tooltip [label]="label" [side]="side">
          <fs-button variant="outline" size="sm">Pasa el cursor</fs-button>
        </fs-tooltip>
      </div>
    `,
  }),
};

// ─── Top y bottom ─────────────────────────────────────────────────────────────

export const TopAndBottom: Story = {
  name: 'Top y bottom',
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; justify-content:center; padding: 60px 40px;">
        <fs-tooltip label="Aparece arriba" side="top">
          <fs-button variant="outline" size="sm">Top</fs-button>
        </fs-tooltip>
        <fs-tooltip label="Aparece abajo" side="bottom">
          <fs-button variant="outline" size="sm">Bottom</fs-button>
        </fs-tooltip>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sobre íconos ─────────────────────────────────────────────────────────────

export const OnIconButtons: Story = {
  name: 'Sobre íconos',
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; justify-content:center; padding: 60px 40px;">
        <fs-tooltip label="Editar" side="top">
          <fs-button variant="ghost" size="sm">Editar</fs-button>
        </fs-tooltip>
        <fs-tooltip label="Eliminar" side="top">
          <fs-button variant="ghost" size="sm">Eliminar</fs-button>
        </fs-tooltip>
        <fs-tooltip label="Más opciones" side="bottom">
          <fs-button variant="ghost" size="sm">···</fs-button>
        </fs-tooltip>
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
      <div style="display:flex; flex-direction:column; gap:32px; align-items:flex-start; padding:60px 40px;">

        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <fs-tooltip label="Guardar cambios" side="top">
            <fs-button variant="primary" size="sm">Guardar</fs-button>
          </fs-tooltip>
          <fs-tooltip label="Descartar y volver" side="top">
            <fs-button variant="outline" size="sm">Cancelar</fs-button>
          </fs-tooltip>
          <fs-tooltip label="Acción irreversible" side="top">
            <fs-button variant="secondary" size="sm">Eliminar</fs-button>
          </fs-tooltip>
        </div>

        <div style="display:flex; gap:16px; flex-wrap:wrap;">
          <fs-tooltip label="Tooltip abajo" side="bottom">
            <fs-button variant="ghost" size="sm">Bottom izq</fs-button>
          </fs-tooltip>
          <fs-tooltip label="Otro tooltip abajo" side="bottom">
            <fs-button variant="ghost" size="sm">Bottom der</fs-button>
          </fs-tooltip>
        </div>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
