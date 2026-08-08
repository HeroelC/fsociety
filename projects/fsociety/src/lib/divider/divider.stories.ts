import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsDividerComponent } from './divider.component';

const SPARKLE = 'https://api.iconify.design/tabler:sparkles.svg';

const meta: Meta<FsDividerComponent> = {
  title: 'Components/Divider',
  component: FsDividerComponent,
  decorators: [moduleMetadata({ imports: [FsDividerComponent] })],
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['solid', 'dashed'] },
    align: { control: 'inline-radio', options: ['center', 'left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<FsDividerComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    label: 'o continuá con',
    align: 'center',
  },
  render: (args) => ({
    props: args,
    template: `
      <fs-divider
        [orientation]="orientation"
        [variant]="variant"
        [label]="label"
        [align]="align"
      ></fs-divider>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Every shape ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: 'Variantes',
  render: () => ({
    props: { sparkle: SPARKLE },
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:520px;">
        <fs-divider></fs-divider>
        <fs-divider variant="dashed"></fs-divider>
        <fs-divider label="o continuá con"></fs-divider>
        <fs-divider [icon]="sparkle" label="Nuevo en esta versión"></fs-divider>
        <fs-divider label="Agosto 2026" align="left"></fs-divider>
        <fs-divider label="Archivado" align="right"></fs-divider>
        <fs-divider variant="dashed" label="Punteado con etiqueta"></fs-divider>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Vertical ────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  name: 'Vertical',
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; gap:14px; height:32px;
                  font-size:14px; color:var(--fs-color-text-secondary);">
        <span>Editar</span>
        <fs-divider orientation="vertical"></fs-divider>
        <span>Duplicar</span>
        <fs-divider orientation="vertical" variant="dashed"></fs-divider>
        <span>Eliminar</span>
      </div>

      <div style="margin-top:18px; font-size:12.5px; color:var(--fs-color-text-secondary); line-height:1.6; max-width:460px;">
        El separador vertical toma la altura de la fila con <code>align-self: stretch</code>.
        Por eso el estilo vive en el host y no en un wrapper: si hubiera un div en el
        medio, el <code>stretch</code> no llegaría. Necesita un contenedor flex.
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Theming ─────────────────────────────────────────────────────────────────

export const Theming: Story = {
  name: 'Custom properties',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:22px; max-width:520px;">
        <fs-divider label="Default"></fs-divider>

        <div style="--fs-divider-color: var(--fs-color-primary);
                    --fs-divider-label-color: var(--fs-color-primary);">
          <fs-divider label="Con acento"></fs-divider>
        </div>

        <div style="--fs-divider-gap: 24px; --fs-divider-inset: 64px;">
          <fs-divider label="Más aire, más sangría" align="left"></fs-divider>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
