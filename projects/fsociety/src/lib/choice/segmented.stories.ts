import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsSegmentedComponent } from './segmented.component';
import type { FsSegmentOption } from './segmented.component';

const CDN = 'https://api.iconify.design';

const VIEWS: FsSegmentOption[] = [
  { value: 'list',  label: 'Lista' },
  { value: 'grid',  label: 'Cuadrícula' },
  { value: 'table', label: 'Tabla' },
];

const PERIODS: FsSegmentOption[] = [
  { value: '7d',  label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '1y',  label: '1 año' },
];

const VIEWS_ICON: FsSegmentOption[] = [
  { value: 'list',  label: 'Lista',        icon: `${CDN}/tabler:list.svg` },
  { value: 'grid',  label: 'Cuadrícula',   icon: `${CDN}/tabler:layout-grid.svg` },
  { value: 'table', label: 'Tabla',        icon: `${CDN}/tabler:table.svg` },
];

const meta: Meta<FsSegmentedComponent> = {
  title: 'Components/Segmented',
  component: FsSegmentedComponent,
  decorators: [
    moduleMetadata({
      imports: [FsSegmentedComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    corners: {
      control: { type: 'inline-radio' },
      options: ['all', 'none', 'top', 'bottom', 'start', 'end'],
    },
    options: { control: false },
  },
};

export default meta;
type Story = StoryObj<FsSegmentedComponent>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => ({
    props: { ...args, model: 'list' },
    template: `
      <fs-segmented [corners]="corners" [options]="options" [(ngModel)]="model"></fs-segmented>
    `,
  }),
  args: { corners: 'all', options: VIEWS },
};

// ─── With label ───────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: (args) => ({
    props: { ...args, model: '30d' },
    template: `
      <fs-segmented label="Período" [options]="options" [(ngModel)]="model"></fs-segmented>
    `,
  }),
  args: { options: PERIODS },
};

// ─── With icons ───────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: (args) => ({
    props: { ...args, model: 'grid' },
    template: `
      <fs-segmented label="Vista" [options]="options" [(ngModel)]="model"></fs-segmented>
    `,
  }),
  args: { options: VIEWS_ICON },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: (args) => ({
    props: { ...args, model: '30d' },
    template: `
      <fs-segmented label="Período" [options]="options" [disabled]="true" [(ngModel)]="model"></fs-segmented>
    `,
  }),
  args: { options: PERIODS },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    props: {
      view:   'list',
      period: '30d',
      vicon:  'grid',
      VIEWS, PERIODS, VIEWS_ICON,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 480px;">
        <fs-segmented [options]="VIEWS" [(ngModel)]="view"></fs-segmented>

        <fs-segmented label="Período" [options]="PERIODS" [(ngModel)]="period"></fs-segmented>

        <fs-segmented label="Vista" [options]="VIEWS_ICON" [(ngModel)]="vicon"></fs-segmented>

        <fs-segmented label="Período (deshabilitado)" [options]="PERIODS" [disabled]="true" [(ngModel)]="period"></fs-segmented>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
