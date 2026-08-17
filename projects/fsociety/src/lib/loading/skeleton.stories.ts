import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FsSkeletonComponent } from './skeleton.component';

const meta: Meta<FsSkeletonComponent> = {
  title: 'Components/Skeleton',
  component: FsSkeletonComponent,
  decorators: [moduleMetadata({ imports: [FsSkeletonComponent] })],
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'circle', 'rect'] },
    animation: { control: 'inline-radio', options: ['shimmer', 'pulse', 'none'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
  },
};

export default meta;
type Story = StoryObj<FsSkeletonComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'text',
    lines: 3,
    animation: 'shimmer',
    lastLineWidth: '65%',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width:420px;">
        <fs-skeleton
          [variant]="variant"
          [lines]="lines"
          [animation]="animation"
          [lastLineWidth]="lastLineWidth"
        ></fs-skeleton>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Variants ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: 'Variantes',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:28px; max-width:420px;">
        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">text</p>
          <fs-skeleton [lines]="3"></fs-skeleton>
        </div>

        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">circle</p>
          <div style="display:flex; align-items:center; gap:12px;">
            <fs-skeleton variant="circle" size="28px"></fs-skeleton>
            <fs-skeleton variant="circle" size="38px"></fs-skeleton>
            <fs-skeleton variant="circle" size="56px"></fs-skeleton>
          </div>
        </div>

        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">rect</p>
          <fs-skeleton variant="rect" height="120px" radius="12px"></fs-skeleton>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── The point of the text variant ───────────────────────────────────────────

export const InheritsTypography: Story = {
  name: 'Hereda la tipografía',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:26px; max-width:520px;">
        <p style="margin:0; font-size:12px; color:var(--fs-color-text-secondary);">
          El mismo componente, sin un solo px de configuración: la altura de cada
          barra sale del font-size heredado, así que acompaña al texto que reemplaza.
        </p>

        <div style="font-size:24px; font-weight:650;">
          <div style="color:var(--fs-color-text-primary);">Acme Corp</div>
          <fs-skeleton [lines]="1" style="margin-top:8px;"></fs-skeleton>
        </div>

        <div style="font-size:15px;">
          <div style="color:var(--fs-color-text-primary);">Plan Enterprise, renovación anual</div>
          <fs-skeleton [lines]="2" style="margin-top:8px;"></fs-skeleton>
        </div>

        <div style="font-size:12px;">
          <div style="color:var(--fs-color-text-secondary);">Actualizado hace 3 minutos</div>
          <fs-skeleton [lines]="2" style="margin-top:8px;"></fs-skeleton>
        </div>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Composition ─────────────────────────────────────────────────────────────
// A "skeleton row" is not a component: it is these primitives inside whatever
// layout the real row already uses.

export const Composition: Story = {
  name: 'Composición — fila de lista',
  render: () => ({
    props: { rows: [0, 1, 2] },
    template: `
      <div style="display:flex; flex-direction:column; gap:8px; max-width:480px;">
        @for (row of rows; track $index) {
          <div style="display:flex; align-items:center; gap:12px; padding:11px 13px;
                      border:1px solid var(--fs-color-border);
                      border-radius:var(--fs-radius-xl);
                      background:var(--fs-color-surface);">
            <fs-skeleton variant="circle" size="38px"></fs-skeleton>
            <div style="flex:1; min-width:0; font-size:13px;">
              <fs-skeleton [lines]="2" lastLineWidth="46%"></fs-skeleton>
            </div>
            <fs-skeleton variant="rect" width="64px" height="26px" radius="7px"></fs-skeleton>
          </div>
        }
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Animation ───────────────────────────────────────────────────────────────

export const Animations: Story = {
  name: 'Animaciones',
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:24px; max-width:420px;">
        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">shimmer (default)</p>
          <fs-skeleton [lines]="2" animation="shimmer"></fs-skeleton>
        </div>
        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">pulse</p>
          <fs-skeleton [lines]="2" animation="pulse"></fs-skeleton>
        </div>
        <div>
          <p style="margin:0 0 10px; font-size:12px; color:var(--fs-color-text-secondary);">none</p>
          <fs-skeleton [lines]="2" animation="none"></fs-skeleton>
        </div>
        <p style="margin:0; font-size:12px; color:var(--fs-color-text-secondary);">
          Con <code>prefers-reduced-motion: reduce</code> las tres se comportan como
          <code>none</code>: la preferencia del sistema le gana al input.
        </p>
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
      <div style="display:flex; flex-direction:column; gap:24px; max-width:420px;">
        <fs-skeleton [lines]="2"></fs-skeleton>

        <fs-skeleton
          [lines]="2"
          style="--fs-skeleton-bg: var(--fs-primary-tint);
                 --fs-skeleton-radius: var(--fs-radius-full);"
        ></fs-skeleton>

        <fs-skeleton
          [lines]="2"
          style="--fs-skeleton-text-height: 1.1em;
                 --fs-skeleton-gap: 0.9em;
                 --fs-skeleton-duration: 2.6s;"
        ></fs-skeleton>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
